import 'server-only';

import { unstable_cache } from 'next/cache';
import { adminDb } from '@/firebase/admin';
import {
  DEFAULT_HOME_DESCRIPTION,
  DEFAULT_HOME_TITLE,
  HomeSettings,
} from '@/lib/home-content';

async function _getHomeSettings(): Promise<HomeSettings> {
  try {
    const snapshot = await adminDb.collection('settings').doc('home').get();
    const data = snapshot.data() as Partial<HomeSettings> | undefined;

    return {
      title: data?.title?.trim() || DEFAULT_HOME_TITLE,
      description: data?.description?.trim() || DEFAULT_HOME_DESCRIPTION,
    };
  } catch (error) {
    console.error('Error fetching home settings from Firestore:', error);

    return {
      title: DEFAULT_HOME_TITLE,
      description: DEFAULT_HOME_DESCRIPTION,
    };
  }
}

export const getHomeSettings = unstable_cache(_getHomeSettings, ['home-settings'], {
  tags: ['home-content'],
});
