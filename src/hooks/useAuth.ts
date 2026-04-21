
// src/hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useFirebaseApp } from '@/firebase/provider';
import { User } from '@/lib/types';

// Key for session storage
const USER_CACHE_KEY = 'app_user_cache';

async function fetchUserFromServer(userId: string): Promise<User | null> {
    try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) {
            // A 404 is not an error, it just means the user isn't in our DB.
            if (response.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch user data');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching user from server:", error);
        return null;
    }
}

export function useAuth() {
  const isServer = typeof window === 'undefined';
  const router = useRouter();
  const firebaseApp = !isServer ? useFirebaseApp() : null;
  const auth = firebaseApp ? getAuth(firebaseApp) : null;
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<Error | null>(null);

  const handleUser = useCallback(async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      // On any auth change, always fetch from server to validate role.
      const appUser = await fetchUserFromServer(firebaseUser.uid);

      // User must exist in our DB and have the 'admin' role.
      if (appUser && appUser.roles.includes('admin')) {
        sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(appUser));
        setUser(appUser);
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        // If not an admin, force sign-out and set an error.
        setLoginError(new Error("Access denied. Only administrators can log in."));
        if (auth) {
          await signOut(auth); // This triggers onAuthStateChanged again with null.
        }
        // State will be cleared by the subsequent onAuthStateChanged call.
      }
    } else {
      // User is signed out.
      sessionStorage.removeItem(USER_CACHE_KEY);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, handleUser);
    return () => unsubscribe();
  }, [auth, handleUser]);

  const login = async (email: string, pass: string) => {
    if (!auth) return;
    setLoginError(null);
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged now handles all validation and state changes.
    } catch (error) { 
      // Catches Firebase errors like wrong password.
      setLoginError(error as Error);
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!auth) return;
    sessionStorage.removeItem(USER_CACHE_KEY);
    await signOut(auth);
    router.push('/'); // Redirect to home page after logout
  };

  return { user, isAuthenticated, isLoading, login, logout, loginError };
}
