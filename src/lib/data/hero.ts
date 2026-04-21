
import 'server-only';
import admin from 'firebase-admin';
import { adminDb } from '@/firebase/admin';
import { HeroItem } from '@/lib/types';
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
 * Private function to fetch hero images from Firestore. It should not be exported.
 * This function is the single source of truth for database queries for the hero images.
 * @returns {Promise<HeroItem[]>} A promise that resolves to an array of hero images.
 */
async function _getHeroImages(): Promise<HeroItem[]> {
  try {
    const query = adminDb.collection('hero').orderBy('display_order', 'asc');
    const snapshot = await query.get();
    if (snapshot.empty) {
      return [];
    }

    // Process and serialize the documents
    const items = snapshot.docs.map((doc) => {
      const data = convertTimestamps(doc.data());
      return { id: doc.id, ...data } as HeroItem;
    });

    return items;
  } catch (error) {
    console.error("Error fetching hero images from Firestore:", error);
    // Return an empty array to prevent page crashes on database errors
    return [];
  }
}

/**
 * Public, cached function to get all hero images.
 * Uses Next.js caching for high performance.
 */
export const getHeroImages = unstable_cache(
  // The function to cache
  () => _getHeroImages(),
  // Unique cache key
  ['hero', 'images'],
  // Cache options
  { 
    tags: ['hero', 'images'] // Tag for on-demand revalidation
  }
);
