
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
    title: 'Cedat | Startup Ecosystem & Community',
    description: 'Dynamic hub for startups, events, and innovation in Bengaluru.',
  },
  events: {
    title: 'Events | Cedat',
    description: 'Browse upcoming startup meetups and summits.',
  },
  gallery: {
    title: 'Community Gallery | Cedat',
    description: 'Moments captured across our ecosystem.',
  },
  startupWorldCup: {
    title: 'Startup World Cup Bengaluru Regional | Cedat',
    description: 'Register for the world\'s largest startup competition.',
  },
  askUs: {
    title: 'Ask Us | Cedat',
    description: 'Submit your inquiries to the Cedat team.',
  },
  login: {
    title: 'Login | Cedat Member Portal',
    description: 'Sign in to access your dashboard.',
  },
  register: {
    title: 'Become a Member | Cedat',
    description: 'Join the premier startup community.',
  },
  dashboard: {
    title: 'Dashboard | Cedat',
    description: 'Manage your registrations and profile.',
  },
  admin: {
    title: 'Admin Panel | Cedat',
    description: 'Ecosystem management dashboard.',
  },
  notFound: {
    title: '404 - Not Found | Cedat',
    description: 'The page you are looking for does not exist.',
  }
};

export function generateSEO(config: SEOConfig) {
  return null; // Next.js handles metadata via Metadata API, but keeping this for compatibility with your pages
}

export function generateEventStructuredData(event: any) { return {}; }
export function generateProfileStructuredData(profile: any) { return {}; }
export function generateBreadcrumbStructuredData(crumbs: any[]) { return {}; }
