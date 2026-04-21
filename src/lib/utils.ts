
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateSlug = (title: string, date: string, id: string) => {
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
    .slice(0, 50);            // Limit title length for slug

  const datePart = date;

  return `${sanitizedTitle}-${datePart}-${id}`;
};

export const extractIdFromSlug = (slug: string): string | null => {
  const parts = slug.split('-');
  const id = parts[parts.length - 1];
  if (id && /^[a-zA-Z0-9]+$/.test(id) && id.length >= 15) {
    return id;
  }
  return null;
};

/**
 * Formats a 24-hour time string (e.g., "14:00") into a 12-hour AM/PM format (e.g., "2:00 PM").
 */
export const formatTime = (timeString: string) => {
    if (!timeString || !/\d{2}:\d{2}/.test(timeString)) return 'Invalid time';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

/**
 * Calculates the real-time status of an event and returns the status text and a corresponding, type-safe Badge variant.
 */
export const getEventStatus = (eventDate: string, startTime: string, endTime: string): { text: string; variant: "secondary" | "default" | "destructive" } => {
    const now = new Date();
    // Combine date and time, being careful of timezone offsets
    const startDateTime = new Date(`${eventDate}T${startTime}`);
    const endDateTime = new Date(`${eventDate}T${endTime}`);

    if (now > endDateTime) return { text: 'Concluded', variant: 'destructive' };
    if (now >= startDateTime && now <= endDateTime) return { text: 'Ongoing', variant: 'default' };
    return { text: 'Upcoming', variant: 'secondary' };
};

export function extractLinkedInID(url: string): string {
  try {
    const parsed = new URL(url);
    const full = `${parsed.pathname}${parsed.search}`;
    const ugcFromPosts = full.match(/ugcPost-(\d+)/i);
    if (ugcFromPosts?.[1]) return `urn:li:ugcPost:${ugcFromPosts[1]}`;
    const activityFromPosts = full.match(/activity-(\d+)/i);
    if (activityFromPosts?.[1]) return `urn:li:activity:${activityFromPosts[1]}`;
    const feedUrn = full.match(/urn:li:(ugcPost|activity):(\d+)/i);
    if (feedUrn?.[1] && feedUrn?.[2]) return `urn:li:${feedUrn[1]}:${feedUrn[2]}`;
  } catch {}
  const ugcFallback = url.match(/ugcPost-(\d+)/i);
  if (ugcFallback?.[1]) return `urn:li:ugcPost:${ugcFallback[1]}`;
  const activityFallback = url.match(/activity-(\d+)/i);
  if (activityFallback?.[1]) return `urn:li:activity:${activityFallback[1]}`;
  return url;
}
