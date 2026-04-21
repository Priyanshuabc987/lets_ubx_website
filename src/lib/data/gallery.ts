
import 'server-only';
import admin from 'firebase-admin';
import { adminDb } from '@/firebase/admin';
import { GalleryItem } from '@/lib/types';
import { unstable_cache } from 'next/cache';

// Helper to convert Firestore Timestamps to ISO strings for serialization
const convertTimestamps = (data: any) => {
  const convertedData = { ...data };
  for (const key in convertedData) {
    if (convertedData[key] instanceof admin.firestore.Timestamp) {
      convertedData[key] = convertedData[key].toDate().toISOString();
    }
  }
  return convertedData;
};

/**
 * Private function to fetch gallery items from Firestore. It should not be exported.
 * This function is the single source of truth for database queries for the gallery.
 * @param {{ type?: 'photo' | 'video' }} options - Filter options to fetch specific item types.
 * @returns {Promise<GalleryItem[]>} A promise that resolves to an array of gallery items.
 */
async function _getGalleryItems(options: { type?: 'photo' | 'video' } = {}): Promise<GalleryItem[]> {
  try {
    let query: admin.firestore.Query = adminDb.collection('gallery');

    // Apply type filter if provided
    if (options.type) {
      query = query.where('type', '==', options.type);
    }

    // Order by the user-defined display order
    query = query.orderBy('display_order', 'asc');

    const snapshot = await query.get();
    if (snapshot.empty) {
      return [];
    }

    // Process and serialize the documents
    const items = snapshot.docs.map((doc) => {
      const data = convertTimestamps(doc.data());
      return { id: doc.id, ...data } as GalleryItem;
    });

    return items;
  } catch (error) {
    console.error("Error fetching gallery items from Firestore:", error);
    // Return an empty array to prevent page crashes on database errors
    return [];
  }
}

/**
 * Public, cached function to get all gallery photos.
 * Uses Next.js caching for high performance.
 */
export const getGalleryPhotos = unstable_cache(
  // The function to cache
  () => _getGalleryItems({ type: 'photo' }),
  // Unique cache key
  ['gallery', 'photos'],
  // Cache options
  { 
    tags: ['gallery', 'photos'] // Tag for on-demand revalidation
  }
);

/**
 * Public, cached function to get all gallery videos.
 * Uses Next.js caching for high performance.
 */
export const getGalleryVideos = unstable_cache(
  // The function to cache
  () => _getGalleryItems({ type: 'video' }),
  // Unique cache key
  ['gallery', 'videos'],
  // Cache options
  { 
    tags: ['gallery', 'videos'] // Tag for on-demand revalidation
  }
);
