"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function GoogleAnalyticsTracker({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    const search = window.location.search;
    const url = search ? `${pathname}${search}` : pathname;

    if (lastTracked.current === url) return;
    lastTracked.current = url;

    const w = window as unknown as {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };

    // Create a stub so events are queued even if gtag.js hasn't loaded yet.
    w.dataLayer = w.dataLayer || [];
    w.gtag =
      w.gtag ||
      ((...args: unknown[]) => {
        w.dataLayer?.push(args);
      });

    // Ensure config exists, but don't auto-send page_view from config.
    w.gtag("config", gaId, { send_page_view: false });

    // Explicit page view for App Router navigations (and initial mount).
    w.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [gaId, pathname]);

  return null;
}
