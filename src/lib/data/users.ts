
import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import admin from 'firebase-admin';
import { adminDb } from '@/firebase/admin';
import { User } from '@/lib/types'; // Corrected: Import User from the single source of truth

/**
 * Converts Firestore Timestamps to ISO strings for serialization, which is necessary
 * for data passed from Server Components to Client Components or cached.
 * @param data - The object with Firestore Timestamps.
 * @returns A new object with Timestamps converted to ISO strings.
 */
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
 * Private function to fetch a user by their ID from Firestore.
 * This should not be exported directly.
 * @param id - The UID of the user to fetch.
 * @returns {Promise<User | null>} A promise that resolves to the user object or null if not found.
 */
const _getUserById = async (id: string): Promise<User | null> => {
  try {
    const userDocRef = adminDb.collection('users').doc(id);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.warn(`No user document found for ID: ${id}`);
      return null;
    }

    const data = userDoc.data();
    // The User interface expects `id`, which isn't in the doc data itself
    const appUser: User = {
      id: userDoc.id,
      email: data?.email || null,
      roles: data?.roles || [],
      full_name: data?.full_name || null,
    };
    
    return appUser;

  } catch (error) {
    console.error(`Error fetching user ${id} from Firestore:`, error);
    // Return null to prevent page crashes on database errors.
    // The calling function should handle the null case.
    return null;
  }
};

/**
 * Public, cached function to get a user by ID.
 * This function is wrapped with both React's `cache` and Next.js's `unstable_cache`
 * to ensure that calls within the same request are deduplicated and the result
 * is cached across requests.
 */
export const getUserById = (id: string) => unstable_cache(
  // Use React's cache to deduplicate requests within the same render pass
  cache(_getUserById),
  // Unique cache key for Next.js Data Cache
  ['user', id],
  // Cache options
  {
    // A tag for on-demand revalidation. We can revalidate this if a user's role changes.
    tags: [`user:${id}`],
  }
)(id);
