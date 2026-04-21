
// This file defines shared data structures and types used across the application.

/**
 * Represents an authenticated user in the application.
 */
export interface User {
  id: string;
  email: string | null;
  roles: string[];
  full_name: string | null;
}

/**
 * Represents a single item in the gallery.
 * This type is used in both the Firestore hooks and the React components.
 */
export interface GalleryItem {
  id: string;
  url: string;
  type: 'photo' | 'video';
  display_order: number;
  caption?: string; // Optional caption for the gallery item
  createdAt: any; // Firestore timestamp
}

/**
 * Represents a single item in the hero section.
 */
export interface HeroItem {
  id: string;
  url: string;
  display_order: number;
  caption?: string; // Optional caption for the hero item
  createdAt: any; // Firestore timestamp
}

/**
 * Represents a single event.
 * This is a placeholder and should be expanded based on the Event interface in useEvents.ts
 */
export interface Event {
  id: string;
  title: string;
  // Add other event properties here
}
