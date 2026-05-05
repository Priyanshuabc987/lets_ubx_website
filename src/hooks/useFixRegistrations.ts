"use client";

import { useEffect, useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, limit, orderBy, query, where } from 'firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type FixRegistrationStatus = 'pending' | 'approved' | 'rejected';

export interface FixRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  founder_linkedin?: string;
  startup_name: string;
  startup_stage: string;
  startup_summary: string;
  support_needed: string;
  additional_info: string;
  pitch_deck_link: string;
  allocated_date?: any;
  status: FixRegistrationStatus;
  createdAt?: any;
  updatedAt?: any;
}

const FIX_REGISTRATIONS_PUBLIC_COLLECTION = 'fix_registrations_public';
const FIX_REGISTRATIONS_PRIVATE_COLLECTION = 'fix_registrations_private';

export function useFixRegistrations(statusFilter?: FixRegistrationStatus | 'all', stageFilter?: string | 'all') {
  // When public docs are disabled we cannot perform client reads; return empty result for public UI.
  if (process.env.NEXT_PUBLIC_FIX_PUBLIC_READS !== 'enabled') {
    return { data: [], isLoading: false } as any;
  }

  const db = useFirestore();
  const registrationsQuery = useMemoFirebase(() => {
    const registrationsRef = collection(db, FIX_REGISTRATIONS_PUBLIC_COLLECTION);
    const clauses: any[] = [];

    if (statusFilter && statusFilter !== 'all') {
      clauses.push(where('status', '==', statusFilter));
    }

    if (stageFilter && stageFilter !== 'all') {
      clauses.push(where('startup_stage', '==', stageFilter));
    }

    if (clauses.length > 0) {
      return query(
        registrationsRef,
        ...clauses,
        orderBy('createdAt', 'desc')
      );
    }

    return query(registrationsRef, orderBy('createdAt', 'desc'));
  }, [db, statusFilter, stageFilter]);

  return useCollection<Omit<FixRegistration, 'id'>>(registrationsQuery);
}

export function useCreateFixRegistration() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  // Submissions from the public should be routed to a server endpoint which writes to the
  // private collection via the Admin SDK. This prevents direct client writes to private data.
  return useMutation({
    mutationFn: async (registration: Omit<FixRegistration, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
      const normalized = registration.startup_name.trim().toLowerCase().replace(/\s+/g, ' ');

      const payload = {
        ...registration,
        email: registration.email.trim().toLowerCase(),
        phone: registration.phone.trim(),
        founder_linkedin: registration.founder_linkedin?.trim() || '',
        startup_name: registration.startup_name.trim(),
        startup_stage: registration.startup_stage.trim(),
        startup_summary: registration.startup_summary.trim(),
        support_needed: registration.support_needed.trim(),
        additional_info: registration.additional_info.trim(),
        pitch_deck_link: registration.pitch_deck_link.trim(),
        // normalized startup name for case-insensitive lookups (keep both fields)
        startups_normalise: normalized,
        startup_normalised: normalized,
      };

      // Optimistically cache the submission locally so the user can see their application
      // even if the server call fails or times out. Use startup_name + phone as the cache key.
      try {
        const key = `fix_status_cache:${payload.startup_name}:${payload.phone}`;
        const cached = {
          id: null,
          name: payload.name || '',
          startup_name: payload.startup_name || '',
          startups_normalise: normalized,
          startup_normalised: normalized,
          status: 'pending',
          allocated_date: null,
          savedAt: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(cached));
      } catch (e) {
        // ignore localStorage errors
      }

      const res = await fetch('/api/fix/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [FIX_REGISTRATIONS_PUBLIC_COLLECTION] });
      try {
        const normalized = ((variables as any).startup_name || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
        const key = `fix_status_cache:${normalized}:${(variables as any).phone}`;
        const cached = {
          id: data?.id || null,
          name: (variables as any).name || '',
          startup_name: (variables as any).startup_name || '',
          startups_normalise: normalized,
          startup_normalised: normalized,
          status: 'pending',
          allocated_date: null,
          savedAt: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(cached));
      } catch (e) {
        // ignore
      }
    },
    onError: (err, variables) => {
      // Keep the optimistic cache so the user still sees their submission locally.
      try {
        const normalized = ((variables as any).startup_name || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
        const key = `fix_status_cache:${normalized}:${(variables as any).phone}`;
        const cached = {
          id: null,
          name: (variables as any).name || '',
          startup_name: (variables as any).startup_name || '',
          startups_normalise: normalized,
          startup_normalised: normalized,
          status: 'pending',
          allocated_date: null,
          savedAt: Date.now(),
          error: err?.message || 'submission_failed',
        };
        localStorage.setItem(key, JSON.stringify(cached));
      } catch (e) {
        // ignore
      }
    },
  });
}
export function useFixRegistrationLookup(startup_name?: string, phone?: string, captchaToken?: string) {
  const [registration, setRegistration] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

  // helper to fetch from server and update cache
  const fetchFromServer = async (forceCacheKey?: string) => {
    if (!startup_name) return null;
    setIsLoading(true);
    setError(null);
    const normalizedStartup = startup_name.trim().toLowerCase().replace(/\s+/g, ' ');
    const cacheKey = `fix_status_cache:${normalizedStartup}:${phone || ''}`;
    try {
      const res = await fetch('/api/fix/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup_name, phone, captchaToken }),
      });
      const data = await res.json();
      if (res.ok) {
        const cached = {
          id: data?.registration?.id || null,
          name: data?.registration?.name || '',
          startup_name: data?.registration?.startup_name || startup_name,
          startups_normalise: normalizedStartup,
          startup_normalised: normalizedStartup,
          status: data?.registration?.status || 'pending',
          allocated_date: data?.registration?.allocated_date || null,
          savedAt: Date.now(),
        };
        try {
          localStorage.setItem(cacheKey, JSON.stringify(cached));
        } catch (e) {}
        setRegistration(cached);
        return cached;
      } else {
        setError(data?.error || 'Lookup failed');
        setRegistration(null);
        return null;
      }
    } catch (e: any) {
      setError(e?.message || 'Lookup error');
      setRegistration(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!startup_name) return;
    let mounted = true;

    const normalizedStartup = startup_name.trim().toLowerCase().replace(/\s+/g, ' ');
    const cacheKey = `fix_status_cache:${normalizedStartup}:${phone || ''}`;

    const doLookup = async () => {
      setIsLoading(true);
      setError(null);

      // check local cache first
      try {
        const raw = localStorage.getItem(cacheKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.savedAt && Date.now() - parsed.savedAt < CACHE_TTL_MS) {
            setRegistration(parsed);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        // ignore localStorage errors
      }

      // if local cache was fresh, we already returned earlier. Otherwise fetch from server
      await fetchFromServer(cacheKey);
    };

    doLookup();

    return () => { mounted = false; };
  }, [startup_name, phone, captchaToken]);

  return { registration, isLoading, error, refresh: fetchFromServer };
}


export function useUpdateFixRegistrationStatus() {
  const db = useFirestore();
  const queryClient = useQueryClient();
  // Admin-only operation: proxy the update through a server endpoint which uses the Admin SDK.
  const { user } = useUser();

  return useMutation({
    mutationFn: async ({ registrationId, status }: { registrationId: string; status: FixRegistrationStatus }) => {
      const token = user ? await user.getIdToken() : null;
      const res = await fetch('/api/admin/fix/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ registrationId, fields: { status } }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to update');
      return json;
    },
    onSuccess: (data, variables) => {
      // Update admin list cache optimistically
      const updated = data?.registration;
      try {
        queryClient.setQueryData(['admin', 'fix_registrations'], (old: any[]) => {
          if (!old) return old;
          return old.map((r) => (r.id === updated.id ? { ...r, ...updated } : r));
        });
      } catch (e) {
        // ignore
      }
      // invalidate public collection to ensure consistency
      queryClient.invalidateQueries({ queryKey: [FIX_REGISTRATIONS_PUBLIC_COLLECTION] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'fix_registrations'] });
    },
  });
}

export function useUpdateFixRegistration() {
  const db = useFirestore();
  const queryClient = useQueryClient();
  // Admin-only: route updates through Admin SDK endpoint
  const { user } = useUser();

  return useMutation({
    mutationFn: async ({ registrationId, fields }: { registrationId: string; fields: Partial<FixRegistration> }) => {
      const token = user ? await user.getIdToken() : null;
      const res = await fetch('/api/admin/fix/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ registrationId, fields }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to update');
      return json;
    },
    onSuccess: (data, variables) => {
      const updated = data?.registration;
      try {
        queryClient.setQueryData(['admin', 'fix_registrations'], (old: any[]) => {
          if (!old) return old;
          return old.map((r) => (r.id === updated.id ? { ...r, ...updated } : r));
        });
      } catch (e) {}
      queryClient.invalidateQueries({ queryKey: [FIX_REGISTRATIONS_PUBLIC_COLLECTION] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'fix_registrations'] });
    },
  });
}
