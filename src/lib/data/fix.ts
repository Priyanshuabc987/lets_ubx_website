
import 'server-only';
import { adminDb } from '@/firebase/admin';
import { unstable_cache } from 'next/cache';

interface FixSettings {
  registration_link?: string;
}

async function _getFixSettings(): Promise<FixSettings | null> {
  try {
    const docRef = adminDb.collection('settings').doc('fix_settings');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.warn(`FIX settings document not found.`);
      return null;
    }

    return docSnap.data() as FixSettings;
  } catch (error) {
    console.error(`Error fetching FIX settings:`, error);
    return null;
  }
}

export const getFixSettings = unstable_cache(
  _getFixSettings,
  ['fix-settings'],
  {
    tags: ['fix-url']
  }
);
