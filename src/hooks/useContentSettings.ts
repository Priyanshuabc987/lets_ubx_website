
"use client";

import { useState, useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  HomeSettings,
} from '@/lib/home-content';
import { revalidateHomeContent } from '@/lib/actions/revalidate';

const SETTINGS_COLLECTION = 'settings';
const HOME_SETTINGS_DOC = 'home';

export type HomeContentSettings = Partial<HomeSettings> & {
  updatedAt?: unknown;
};

export function useHomeContentSettings() {
  const db = useFirestore();
  const settingRef = useMemoFirebase(
    () => doc(db, SETTINGS_COLLECTION, HOME_SETTINGS_DOC),
    [db]
  );
  const { data, isLoading: firestoreLoading, error } = useDoc<HomeContentSettings>(settingRef);
  
  // useDoc starts with isLoading: false, then useEffect sets it to true.
  // We want to treat the initial state as loading too.
  const [hasStartedLoading, setHasStartedLoading] = useState(false);
  useEffect(() => {
    if (firestoreLoading) setHasStartedLoading(true);
  }, [firestoreLoading]);

  const isLoading = firestoreLoading || (!hasStartedLoading && !data);

  return {
    data: (data || (isLoading ? null : {})) as HomeContentSettings | null,
    isLoading,
    error,
  };
}

export function useUpdateHomeContentSettings() {
  const db = useFirestore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: Partial<HomeSettings>) => {
      const ref = doc(db, SETTINGS_COLLECTION, HOME_SETTINGS_DOC);
      const cleanedValue: Record<string, any> = {};
      Object.entries(value).forEach(([key, val]) => {
        if (typeof val === 'string') cleanedValue[key] = val.trim();
      });

      return setDoc(
        ref,
        {
          ...cleanedValue,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doc', SETTINGS_COLLECTION, HOME_SETTINGS_DOC] });
      revalidateHomeContent();
    },
  });
}

export function useAdminEventsHeading() {
  const { data, isLoading } = useHomeContentSettings();
  return { data: data?.title || '', isLoading };
}

export function useAdminEventsSubheading() {
  const { data, isLoading } = useHomeContentSettings();
  return { data: data?.description || '', isLoading };
}

export function useUpdateEventsHeading() {
  const db = useFirestore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: string) => {
      const ref = doc(db, SETTINGS_COLLECTION, HOME_SETTINGS_DOC);
      return setDoc(
        ref,
        { title: value.trim(), updatedAt: serverTimestamp() },
        { merge: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doc', SETTINGS_COLLECTION, HOME_SETTINGS_DOC] });
      revalidateHomeContent();
    },
  });
}

export function useUpdateEventsSubheading() {
  const db = useFirestore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: string) => {
      const ref = doc(db, SETTINGS_COLLECTION, HOME_SETTINGS_DOC);
      return setDoc(
        ref,
        { description: value.trim(), updatedAt: serverTimestamp() },
        { merge: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doc', SETTINGS_COLLECTION, HOME_SETTINGS_DOC] });
      revalidateHomeContent();
    },
  });
}

export function usePublicEventsHeading() { return useAdminEventsHeading(); }
export function usePublicEventsSubheading() { return useAdminEventsSubheading(); }
