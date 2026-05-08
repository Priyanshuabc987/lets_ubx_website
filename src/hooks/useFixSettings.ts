
"use client";

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revalidateFixSettings } from '@/lib/actions/revalidate';
import {
  DEFAULT_FIX_ABOUT_TEXT,
  DEFAULT_FIX_SIDEBAR_POINTS,
  DEFAULT_FIX_SIDEBAR_TITLE,
  DEFAULT_FIX_TITLE,
  DEFAULT_FIX_REG_TITLE,
  DEFAULT_FIX_REG_DESCRIPTION,
  DEFAULT_FIX_QUESTIONS,
  FixContentSettings,
  FixQuestion,
} from '@/lib/fix-content';

export interface FixSettings extends Partial<FixContentSettings> {
  updatedAt?: any;
}

const SETTINGS_COLLECTION = 'settings';
const FIX_SETTINGS_DOC = 'fix_settings';

// Hook to get the FIX settings data
export function useFixSettings() {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(
    () => doc(db, SETTINGS_COLLECTION, FIX_SETTINGS_DOC),
    [db]
  );

  const { data, isLoading, error } = useDoc<FixSettings>(settingsRef);

  return {
    data: {
      registration_link: data?.registration_link || '',
      title: data?.title || DEFAULT_FIX_TITLE,
      about: data?.about || DEFAULT_FIX_ABOUT_TEXT,
      sidebar_title: data?.sidebar_title || DEFAULT_FIX_SIDEBAR_TITLE,
      sidebar_points: Array.isArray(data?.sidebar_points) && data?.sidebar_points.length
        ? data!.sidebar_points
        : DEFAULT_FIX_SIDEBAR_POINTS,
      registration_title: data?.registration_title || DEFAULT_FIX_REG_TITLE,
      registration_description: data?.registration_description || DEFAULT_FIX_REG_DESCRIPTION,
      registration_questions: Array.isArray(data?.registration_questions)
        ? data!.registration_questions
        : DEFAULT_FIX_QUESTIONS,
    },
    isLoading,
    error,
  };
}

// Hook to update the FIX settings
export function useUpdateFixSettings() {
  const queryClient = useQueryClient();
  const db = useFirestore();

  return useMutation({
    mutationFn: async (settings: {
      registration_link?: string;
      title?: string;
      about?: string;
      sidebar_title?: string;
      sidebar_points?: string[];
      registration_title?: string;
      registration_description?: string;
      registration_questions?: FixQuestion[];
    }) => {
      const docRef = doc(db, SETTINGS_COLLECTION, FIX_SETTINGS_DOC);
      const payload = {
        ...settings,
        registration_link: settings.registration_link?.trim() || '',
        title: settings.title?.trim() || DEFAULT_FIX_TITLE,
        about: settings.about?.trim() || DEFAULT_FIX_ABOUT_TEXT,
        sidebar_title: settings.sidebar_title?.trim() || DEFAULT_FIX_SIDEBAR_TITLE,
        sidebar_points: settings.sidebar_points?.map((item) => item.trim()).filter(Boolean) || DEFAULT_FIX_SIDEBAR_POINTS,
        registration_title: settings.registration_title?.trim() || DEFAULT_FIX_REG_TITLE,
        registration_description: settings.registration_description?.trim() || DEFAULT_FIX_REG_DESCRIPTION,
        registration_questions: settings.registration_questions || DEFAULT_FIX_QUESTIONS,
        updatedAt: serverTimestamp(),
      };
      await setDoc(docRef, payload, { merge: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SETTINGS_COLLECTION] });
      queryClient.invalidateQueries({ queryKey: ['doc', SETTINGS_COLLECTION, FIX_SETTINGS_DOC] });
      revalidateFixSettings();
    },
  });
}
