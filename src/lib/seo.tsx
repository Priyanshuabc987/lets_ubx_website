
import React from 'react';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  publishedTime?: string;
  imageAlt?: string;
  structuredData?: any[];
}

export const seoConfigs: Record<string, SEOConfig> = {
  home: {
    title: "Let\'s UBX | Startup Ecosystem & Community",
    description: 'Dynamic hub for startups, events, and innovation in Bengaluru.',
  },
  events: {
    title: "Events | Let's UBX",
    description: 'Browse upcoming startup meetups and summits.',
  },
  gallery: {
    title: "Community Gallery | Let's UBX",
    description: 'Moments captured across our ecosystem.',
  },
  startupWorldCup: {
    title: "Startup World Cup Bengaluru Regional | Let's UBX",
    description: 'Register for the world\'s largest startup competition.',
  },
  askUs: {
    title: "Ask Us | Let's UBX",
    description: "Submit your inquiries to the Let's UBX team.",
  },
  login: {
    title: "Login | Let's UBX Member Portal",
    description: 'Sign in to access your dashboard.',
  },
  register: {
    title: "Become a Member | Let's UBX",
    description: 'Join the premier startup community.',
  },
  dashboard: {
    title: "Dashboard | Let's UBX",
    description: 'Manage your registrations and profile.',
  },
  admin: {
    title: "Admin Panel | Let's UBX",
    description: 'Ecosystem management dashboard.',
  },
  notFound: {
    title: "404 - Not Found | Let's UBX",
    description: 'The page you are looking for does not exist.',
  }
};

export function generateSEO(config: SEOConfig) {
  return null; // Next.js handles metadata via Metadata API, but keeping this for compatibility with your pages
}

export function generateEventStructuredData(event: any) { return {}; }
export function generateProfileStructuredData(profile: any) { return {}; }
export function generateBreadcrumbStructuredData(crumbs: any[]) { return {}; }
