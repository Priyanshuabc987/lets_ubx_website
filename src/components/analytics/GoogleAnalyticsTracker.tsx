"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export function GoogleAnalyticsTracker({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
      .gtag;
    if (!gtag) return;

    const search = searchParams?.toString();
    const url = search ? `${pathname}?${search}` : pathname;

    gtag("config", gaId, { page_path: url });
  }, [gaId, pathname, searchParams]);

  return null;
}

