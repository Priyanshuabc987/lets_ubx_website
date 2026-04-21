
"use client";

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { useMutation } from '@tanstack/react-query';

export function useAdminEventsHeading() {
  const db = useFirestore();
  const settingRef = useMemoFirebase(() => doc(db, 'settings', 'events_heading'), [db]);
  const { data } = useDoc<{ value: string }>(settingRef);
  return { data: data?.value || "Startup Ecosystem Meetups & Events", isLoading: false };
}

export function useAdminEventsSubheading() {
  const db = useFirestore();
  const settingRef = useMemoFirebase(() => doc(db, 'settings', 'events_subheading'), [db]);
  const { data } = useDoc<{ value: string }>(settingRef);
  return { data: data?.value || "Dynamic Ecosystem of Nexus Communities", isLoading: false };
}

export function useUpdateEventsHeading() {
  const db = useFirestore();
  return useMutation({
    mutationFn: async (value: string) => {
      const ref = doc(db, 'settings', 'events_heading');
      return setDoc(ref, { value }, { merge: true });
    },
  });
}

export function useUpdateEventsSubheading() {
  const db = useFirestore();
  return useMutation({
    mutationFn: async (value: string) => {
      const ref = doc(db, 'settings', 'events_subheading');
      return setDoc(ref, { value }, { merge: true });
    },
  });
}

export function usePublicEventsHeading() { return useAdminEventsHeading(); }
export function usePublicEventsSubheading() { return useAdminEventsSubheading(); }
