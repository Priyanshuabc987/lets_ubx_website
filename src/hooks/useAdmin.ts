// src/hooks/useAdmin.ts
"use client";

import { useAuth } from './useAuth';

/**
 * A simple hook to determine if the current user is an admin.
 */
export function useAdmin() {
  const { user, isLoading } = useAuth();

  const isAdmin = user?.roles?.includes('admin') ?? false;

  // Provide mutation-like stubs used by admin components (e.g., mutateAsync)
  const verify = { mutateAsync: async (_id: string) => ({ ok: false }) };
  const checkin = { mutateAsync: async (_id: string) => ({ ok: false }) };
  const approve = { mutateAsync: async (_id: string) => ({ ok: false }) };

  return { isAdmin, isLoading, verify, checkin, approve } as any;
}

// --- Additional admin helper hooks (stubs) ---
export function useAdminEventRegistrations(eventId?: string) {
  // Minimal stub returning empty registrations and stats
  return { data: { items: [], statistics: {} as any }, isLoading: false } as any;
}

export function useAdminMembers(params?: any) {
  return { data: { items: [], total: 0 }, isLoading: false } as any;
}

export function useVerifyQRCode() {
  return { mutateAsync: async (code: string) => ({ valid: false }), isPending: false, error: null } as any;
}

export function useCheckInRegistration() {
  return { mutateAsync: async (id: string) => ({ ok: true }), isPending: false, error: null } as any;
}

export function useApproveRegistration() {
  return { mutateAsync: async (id: string) => ({ ok: true }), isPending: false, error: null } as any;
}

export function useAdminStats() {
  return { data: { total_registrations: 0, attended_registrations: 0, total_events: 0, attendance_rate: 0 }, isLoading: false } as any;
}

export function useAdminAllRegistrations(params?: any) {
  return { data: { items: [], total: 0 }, isLoading: false } as any;
}

export function useAdminEvents(params?: any) {
  return { data: { items: [], total: 0 }, isLoading: false } as any;
}

export function useAdminRegistrationDetails(id?: string) {
  return { data: null, isLoading: false } as any;
}

export function useAdminMember(id?: string) {
  return { data: null, isLoading: false };
}
