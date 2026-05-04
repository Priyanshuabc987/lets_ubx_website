
"use client";

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DEFAULT_HOME_DESCRIPTION,
  DEFAULT_HOME_TITLE,
} from '@/lib/home-content';
import { revalidateHomeContent } from '@/lib/actions/revalidate';

const SETTINGS_COLLECTION = 'settings';
const HOME_SETTINGS_DOC = 'home';

export type HomeContentSettings = {
  title?: string;
  description?: string;
  updatedAt?: unknown;
};

export function useHomeContentSettings() {
  const db = useFirestore();
  const settingRef = useMemoFirebase(
    () => doc(db, SETTINGS_COLLECTION, HOME_SETTINGS_DOC),
    [db]
  );
  const { data, isLoading, error } = useDoc<HomeContentSettings>(settingRef);

  return {
    data: {
      title: data?.title || DEFAULT_HOME_TITLE,
      description: data?.description || DEFAULT_HOME_DESCRIPTION,
    },
    isLoading,
    error,
  };
}

export function useUpdateHomeContentSettings() {
  const db = useFirestore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: { title: string; description: string }) => {
      const ref = doc(db, SETTINGS_COLLECTION, HOME_SETTINGS_DOC);
      return setDoc(
        ref,
        {
          title: value.title.trim(),
          description: value.description.trim(),
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
  return { data: data.title, isLoading };
}

export function useAdminEventsSubheading() {
  const { data, isLoading } = useHomeContentSettings();
  return { data: data.description, isLoading };
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
