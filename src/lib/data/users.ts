
import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { adminDb } from '@/firebase/admin';
import { User } from '@/lib/types'; // Corrected: Import User from the single source of truth

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
    throw error;
  }
};

/**
 * Public function to get a user by ID.
 * User role checks for auth should not be cross-request cached, otherwise stale
 * "not found" results can survive after the Firestore document is fixed.
 */
export const getUserById = (id: string) => unstable_cache(
  // Use React's cache to deduplicate requests within the same render pass
  cache(_getUserById),
  // Unique cache key for Next.js Data Cache
  ['user-v1', id],
  // Cache options
  {
    // A tag for on-demand revalidation. We can revalidate this if a user's role changes.
    tags: [`user:${id}`],
  }
)(id);
