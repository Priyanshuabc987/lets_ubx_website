
import 'server-only';
import { adminDb } from '@/firebase/admin';
import { unstable_cache } from 'next/cache';
import {
  DEFAULT_FIX_ABOUT_TEXT,
  DEFAULT_FIX_SIDEBAR_POINTS,
  DEFAULT_FIX_SIDEBAR_TITLE,
  DEFAULT_FIX_TITLE,
  FixContentSettings,
} from '@/lib/fix-content';

async function _getFixSettings(): Promise<FixContentSettings> {
  try {
    const docRef = adminDb.collection('settings').doc('fix_settings');
    const docSnap = await docRef.get();
    const data = (docSnap.data() || {}) as Partial<FixContentSettings>;
    const sidebarPoints = Array.isArray(data.sidebar_points)
      ? data.sidebar_points.map((item) => String(item).trim()).filter(Boolean)
      : DEFAULT_FIX_SIDEBAR_POINTS;

    return {
      registration_link: data.registration_link?.trim() || '',
      title: data.title?.trim() || DEFAULT_FIX_TITLE,
      about: data.about?.trim() || DEFAULT_FIX_ABOUT_TEXT,
      sidebar_title: data.sidebar_title?.trim() || DEFAULT_FIX_SIDEBAR_TITLE,
      sidebar_points: sidebarPoints.length ? sidebarPoints : DEFAULT_FIX_SIDEBAR_POINTS,
    };
  } catch (error) {
    console.error(`Error fetching FIX settings:`, error);
    return {
      registration_link: '',
      title: DEFAULT_FIX_TITLE,
      about: DEFAULT_FIX_ABOUT_TEXT,
      sidebar_title: DEFAULT_FIX_SIDEBAR_TITLE,
      sidebar_points: DEFAULT_FIX_SIDEBAR_POINTS,
    };
  }
}

export const getFixSettings = unstable_cache(
  _getFixSettings,
  ['fix-settings'],
  {
    tags: ['fix-settings', 'fix-url']
  }
);
