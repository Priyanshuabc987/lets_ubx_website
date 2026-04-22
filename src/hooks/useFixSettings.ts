
"use client";

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revalidateFixUrl } from '@/lib/actions/revalidate';

export interface FixSettings {
  registration_link?: string;
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

  return { data, isLoading, error };
}

// Hook to update the FIX settings
export function useUpdateFixSettings() {
  const queryClient = useQueryClient();
  const db = useFirestore();

  return useMutation({
    mutationFn: async (settings: { registration_link: string }) => {
      const docRef = doc(db, SETTINGS_COLLECTION, FIX_SETTINGS_DOC);
      const payload = {
        ...settings,
        updatedAt: serverTimestamp(),
      };
      await setDoc(docRef, payload, { merge: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SETTINGS_COLLECTION] });
      queryClient.invalidateQueries({ queryKey: ['doc', SETTINGS_COLLECTION, FIX_SETTINGS_DOC] });
      revalidateFixUrl();
    },
  });
}
