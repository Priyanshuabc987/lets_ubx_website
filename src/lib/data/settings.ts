import 'server-only';

import { unstable_cache } from 'next/cache';
import { adminDb } from '@/firebase/admin';
import {
  DEFAULT_HOME_DESCRIPTION,
  DEFAULT_HOME_TITLE,
  DEFAULT_SOCIAL_TITLE,
  DEFAULT_SOCIAL_SUBTITLE,
  DEFAULT_LINKEDIN_LABEL,
  DEFAULT_INSTAGRAM_LABEL,
  DEFAULT_YOUTUBE_LABEL,
  DEFAULT_FIX_TITLE,
  DEFAULT_FIX_DESCRIPTION,
  DEFAULT_FIX_APPLY_LABEL,
  DEFAULT_FIX_CONTACT_LABEL,
  DEFAULT_FOOTER_DESCRIPTION,
  DEFAULT_FOOTER_CONTACT_TEXT,
  DEFAULT_FOOTER_CONTACT_PHONE,
  DEFAULT_EVENTS_TITLE,
  DEFAULT_EVENTS_DESCRIPTION,
  DEFAULT_GALLERY_TITLE,
  DEFAULT_GALLERY_DESCRIPTION,
  DEFAULT_ASK_US_TITLE,
  DEFAULT_ASK_US_DESCRIPTION,
  DEFAULT_ASK_US_CARD_TITLE,
  DEFAULT_ASK_US_CARD_DESCRIPTION,
  DEFAULT_ASK_US_BUTTON_LABEL,
  HomeSettings,
} from '@/lib/home-content';

async function _getHomeSettings(): Promise<HomeSettings> {
  try {
    const snapshot = await adminDb.collection('settings').doc('home').get();
    const data = snapshot.data() as Partial<HomeSettings> | undefined;

    return {
      title: data?.title?.trim() || DEFAULT_HOME_TITLE,
      description: data?.description?.trim() || DEFAULT_HOME_DESCRIPTION,
      socialTitle: data?.socialTitle?.trim() || DEFAULT_SOCIAL_TITLE,
      socialSubtitle: data?.socialSubtitle?.trim() || DEFAULT_SOCIAL_SUBTITLE,
      linkedinLabel: data?.linkedinLabel?.trim() || DEFAULT_LINKEDIN_LABEL,
      instagramLabel: data?.instagramLabel?.trim() || DEFAULT_INSTAGRAM_LABEL,
      youtubeLabel: data?.youtubeLabel?.trim() || DEFAULT_YOUTUBE_LABEL,
      fixTitle: data?.fixTitle?.trim() || DEFAULT_FIX_TITLE,
      fixDescription: data?.fixDescription?.trim() || DEFAULT_FIX_DESCRIPTION,
      fixApplyLabel: data?.fixApplyLabel?.trim() || DEFAULT_FIX_APPLY_LABEL,
      fixContactLabel: data?.fixContactLabel?.trim() || DEFAULT_FIX_CONTACT_LABEL,
      footerDescription: data?.footerDescription?.trim() || DEFAULT_FOOTER_DESCRIPTION,
      footerContactText: data?.footerContactText?.trim() || DEFAULT_FOOTER_CONTACT_TEXT,
      footerContactPhone: data?.footerContactPhone?.trim() || DEFAULT_FOOTER_CONTACT_PHONE,
      eventsTitle: data?.eventsTitle?.trim() || DEFAULT_EVENTS_TITLE,
      eventsDescription: data?.eventsDescription?.trim() || DEFAULT_EVENTS_DESCRIPTION,
      galleryTitle: data?.galleryTitle?.trim() || DEFAULT_GALLERY_TITLE,
      galleryDescription: data?.galleryDescription?.trim() || DEFAULT_GALLERY_DESCRIPTION,
      askUsTitle: data?.askUsTitle?.trim() || DEFAULT_ASK_US_TITLE,
      askUsDescription: data?.askUsDescription?.trim() || DEFAULT_ASK_US_DESCRIPTION,
      askUsCardTitle: data?.askUsCardTitle?.trim() || DEFAULT_ASK_US_CARD_TITLE,
      askUsCardDescription: data?.askUsCardDescription?.trim() || DEFAULT_ASK_US_CARD_DESCRIPTION,
      askUsButtonLabel: data?.askUsButtonLabel?.trim() || DEFAULT_ASK_US_BUTTON_LABEL,
    };
  } catch (error) {
    console.error('Error fetching home settings from Firestore:', error);

    return {
      title: DEFAULT_HOME_TITLE,
      description: DEFAULT_HOME_DESCRIPTION,
      socialTitle: DEFAULT_SOCIAL_TITLE,
      socialSubtitle: DEFAULT_SOCIAL_SUBTITLE,
      linkedinLabel: DEFAULT_LINKEDIN_LABEL,
      instagramLabel: DEFAULT_INSTAGRAM_LABEL,
      youtubeLabel: DEFAULT_YOUTUBE_LABEL,
      fixTitle: DEFAULT_FIX_TITLE,
      fixDescription: DEFAULT_FIX_DESCRIPTION,
      fixApplyLabel: DEFAULT_FIX_APPLY_LABEL,
      fixContactLabel: DEFAULT_FIX_CONTACT_LABEL,
      footerDescription: DEFAULT_FOOTER_DESCRIPTION,
      footerContactText: DEFAULT_FOOTER_CONTACT_TEXT,
      footerContactPhone: DEFAULT_FOOTER_CONTACT_PHONE,
      eventsTitle: DEFAULT_EVENTS_TITLE,
      eventsDescription: DEFAULT_EVENTS_DESCRIPTION,
      galleryTitle: DEFAULT_GALLERY_TITLE,
      galleryDescription: DEFAULT_GALLERY_DESCRIPTION,
      askUsTitle: DEFAULT_ASK_US_TITLE,
      askUsDescription: DEFAULT_ASK_US_DESCRIPTION,
      askUsCardTitle: DEFAULT_ASK_US_CARD_TITLE,
      askUsCardDescription: DEFAULT_ASK_US_CARD_DESCRIPTION,
      askUsButtonLabel: DEFAULT_ASK_US_BUTTON_LABEL,
    };
  }
}

export const getHomeSettings = unstable_cache(_getHomeSettings, ['home-settings'], {
  tags: ['home-content'],
});
