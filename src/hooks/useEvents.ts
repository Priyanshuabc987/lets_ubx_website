
"use client";

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, doc, deleteDoc, updateDoc, addDoc, serverTimestamp, getDocs, getDoc, limit, startAfter, QueryDocumentSnapshot, QueryConstraint } from 'firebase/firestore';
import { useMutation, useQueryClient, useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import { generateSlug } from '@/lib/utils';
import { revalidateEventsList, revalidateEventDetail } from '@/lib/actions/revalidate';
import { uploadToCloudinary } from '@/lib/cloudinary';

export interface Event {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  status: 'draft' | 'published' | 'cancelled';
  category?: string;
  featured_image_url?: string;
  external_registration_url?: string;
}

const PAGE_SIZE = 9;

type EventsPage = {
  events: Event[];
  lastDoc: QueryDocumentSnapshot | string | null;
  hasMore: boolean;
};

export function useEvents({ 
  status_filter, 
  pageSize = PAGE_SIZE, 
  initialData,
  initialHasMore = false,
  initialCursorId,
  staleTime, // Allow staleTime to be passed
}: { 
  status_filter?: string, 
  pageSize?: number,
  initialData?: Event[],
  initialHasMore?: boolean,
  initialCursorId?: string,
  staleTime?: number,
} = {}) {
  const db = useFirestore();

  const fetchEvents = async (context: QueryFunctionContext): Promise<EventsPage> => {
    const pageParam = context.pageParam as QueryDocumentSnapshot | string | null;
    const constraints: QueryConstraint[] = [orderBy('event_date', 'asc'), limit(pageSize + 1)];
    if (status_filter) {
      constraints.push(where('status', '==', status_filter));
    }
    if (pageParam) {
      const cursorDoc = typeof pageParam === 'string' ? await getDoc(doc(db, 'events', pageParam)) : pageParam;
      if (cursorDoc.exists()) {
        constraints.push(startAfter(cursorDoc));
      }
    }
    const q = query(collection(db, 'events'), ...constraints);
    const snapshot = await getDocs(q);
    const hasMore = snapshot.docs.length > pageSize;
    const pageDocs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;
    const newEvents = pageDocs.map(d => ({ id: d.id, ...d.data() })) as Event[];
    const lastDoc = pageDocs[pageDocs.length - 1] || null;
    return { events: newEvents, lastDoc, hasMore };
  };

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isLoading, 
    isFetchingNextPage, 
    error 
  } = useInfiniteQuery<EventsPage, Error>({
    queryKey: ['events', { status_filter }],
    queryFn: fetchEvents,
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.lastDoc;
    },
    initialData: initialData 
      ? {
          pages: [{ events: initialData, lastDoc: initialCursorId || initialData[initialData.length - 1]?.id || null, hasMore: initialHasMore }],
          pageParams: [null],
        }
      : undefined,
    // Use staleTime to control re-fetching
    staleTime: staleTime,
  });

  const allEvents = data?.pages.flatMap(page => page.events) || [];

  return {
    events: allEvents,
    loadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    error,
  };
}

export function useEvent(id: string) {
  const db = useFirestore();
  const eventRef = useMemoFirebase(() => id ? doc(db, 'events', id) : null, [db, id]);
  return useDoc<Event>(eventRef);
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const db = useFirestore();

  return useMutation({
    mutationFn: async ({ eventData, imageFile }: { eventData: Partial<Event>, imageFile: File | null }) => {
        const { featured_image_url, ...restEventData } = eventData;
        const eventDocRef = await addDoc(collection(db, 'events'), { ...restEventData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        const slug = generateSlug(eventData.title!, eventData.event_date!, eventDocRef.id);
        const updatePayload: { [key: string]: any } = { slug };
        
        if (imageFile) {
            const imageUrl = await uploadToCloudinary(imageFile);
            updatePayload.featured_image_url = imageUrl;
        } else if (featured_image_url) {
            updatePayload.featured_image_url = featured_image_url;
        }

        await updateDoc(eventDocRef, updatePayload);
        return eventDocRef;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        revalidateEventsList();
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const db = useFirestore();

  return useMutation({
    mutationFn: async ({ eventId, eventData, imageFile }: { eventId: string; eventData: Partial<Event>; imageFile: File | null }) => {
        const docRef = doc(db, 'events', eventId);
        const { featured_image_url, ...restEventData } = eventData;
        const updatePayload: { [key: string]: any } = { ...restEventData, updatedAt: serverTimestamp() };
        if (eventData.title && eventData.event_date) {
            updatePayload.slug = generateSlug(eventData.title, eventData.event_date, eventId);
        }

        if (imageFile) {
            const imageUrl = await uploadToCloudinary(imageFile);
            updatePayload.featured_image_url = imageUrl;
        } else {
          updatePayload.featured_image_url = featured_image_url;
        }

        await updateDoc(docRef, updatePayload);
    },
    onSuccess: (_data, { eventId }) => {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        revalidateEventsList();
        revalidateEventDetail(eventId);
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const db = useFirestore();

  return useMutation({
    mutationFn: (id: string) => deleteDoc(doc(db, 'events', id)),
    onSuccess: (_data, eventId) => {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        revalidateEventsList();
        revalidateEventDetail(eventId);
    },
  });
}
