
import 'server-only';
import admin from 'firebase-admin';
import { adminDb } from '@/firebase/admin';
import { Event } from '@/hooks/useEvents';
import { unstable_cache } from 'next/cache';
import { extractIdFromSlug } from '@/lib/utils';

const EVENTS_TIME_ZONE = 'Asia/Kolkata';

const getEventsTodayKey = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: EVENTS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

// Helper to convert Timestamps
const convertTimestamps = (data: any) => {
  const convertedData = { ...data };
  for (const key in convertedData) {
    if (convertedData[key] instanceof admin.firestore.Timestamp) {
      convertedData[key] = convertedData[key].toDate().toISOString();
    }
  }
  return convertedData;
};

async function _getEvents(
  options: {
    status_filter?: string;
    start_after_id?: string;
    page_size?: number;
  },
  todayStr: string
) {

  try {
    let query: admin.firestore.Query = adminDb.collection('events');
    if (options.status_filter) {
      query = query.where('status', '==', options.status_filter);
    }

    query = query
      .where('event_date', '>=', todayStr)
      .orderBy('event_date', 'asc');

    if (options.start_after_id) {
      const lastDoc = await adminDb.collection('events').doc(options.start_after_id).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }
    if (options.page_size) {
      query = query.limit(options.page_size);
    }
    const snapshot = await query.get();
    if (snapshot.empty) {
      return [];
    }
    const events = snapshot.docs.map((doc) => {
      const data = convertTimestamps(doc.data());
      return { id: doc.id, ...data } as Event;
    });
    return events;
  } catch (error) {
    console.error("Error fetching events from Firestore:", error);
    return [];
  }
}

export type EventsPageResult = {
  events: Event[];
  nextCursorId: string | null;
  hasMore: boolean;
};

async function _getEventsPage(
  options: {
    status_filter?: string;
    start_after_id?: string;
    page_size?: number;
  },
  todayStr: string
): Promise<EventsPageResult> {
  const pageSize = options.page_size ?? 6;
  const events = await _getEvents(
    {
      ...options,
      page_size: pageSize + 1,
    },
    todayStr
  );

  const hasMore = events.length > pageSize;
  const pageEvents = hasMore ? events.slice(0, pageSize) : events;
  const nextCursorId = pageEvents[pageEvents.length - 1]?.id ?? null;

  return {
    events: pageEvents,
    nextCursorId,
    hasMore,
  };
}

// NEW: Efficiently fetches a single document directly by its ID.
async function _getEventById(id: string): Promise<Event | null> {
  try {
    const docRef = adminDb.collection('events').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      console.warn(`Event with ID ${id} not found.`);
      return null;
    }
    const data = convertTimestamps(docSnap.data());
    return { id: docSnap.id, ...data } as Event;
  } catch (error) {
    console.error(`Error fetching event by ID ${id}:`, error);
    return null;
  }
}

const cachedGetEvents = unstable_cache(
  _getEvents,
  ['events'],
  {
    tags: ['events']
  }
);

export const getEvents = (options: any = {}) => {
  return cachedGetEvents(options, getEventsTodayKey());
};

const cachedGetEventsPage = unstable_cache(
  _getEventsPage,
  ['events-page'],
  {
    tags: ['events']
  }
);

export const getEventsPage = (options: any = {}) => {
  return cachedGetEventsPage(options, getEventsTodayKey());
};

// REFACTORED: Now uses the robust Firebase ID for fetching and caching.
export const getEventBySlug = async (slug: string): Promise<Event | null> => {
  const eventId = extractIdFromSlug(slug);

  if (!eventId) {
    console.error(`Could not extract a valid ID from slug: "${slug}"`);
    return null;
  }

  // This function dynamically creates a cached version of _getEventById for the specific ID.
  // The cache is keyed by the stable ID, not the fragile slug.
  const getCachedEventById = (id: string) =>
    unstable_cache(
      async () => _getEventById(id),
      ['events', id], // Unique cache key for this specific ID
      {
        // This tag matches your revalidateTag call exactly
        tags: [`event:${id}`]
      }
    )();


  return getCachedEventById(eventId);
};
