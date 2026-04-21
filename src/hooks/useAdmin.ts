// src/hooks/useAdmin.ts
"use client";

import { useAuth } from './useAuth';

/**
 * A simple hook to determine if the current user is an admin.
 */
export function useAdmin() {
  const { user, isLoading } = useAuth();

  const isAdmin = user?.roles?.includes('admin') ?? false;

  return { isAdmin, isLoading };
}
