
"use client";

import { useEffect } from 'react';
import { LOGO_URL } from '@/lib/constants';

export const FaviconFixer = () => {
  useEffect(() => {
    // This code runs only on the client, after the initial render
    // and after Firebase has likely done its iframe magic.

    // Find the existing favicon link element
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");

    if (link) {
      // If a link element exists, simply update its href
      link.href = LOGO_URL;
    } else {
      // If for some reason no link element exists, create one
      link = document.createElement('link');
      link.rel = 'icon';
      link.href = LOGO_URL;
      document.head.appendChild(link);
    }

  }, []); // The empty dependency array ensures this runs only once on mount

  return null; // This component renders nothing
};
