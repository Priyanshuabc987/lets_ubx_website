
import { getEventsPage } from '@/lib/data/events';
import { EventListClient } from "@/components/events/EventListClient";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from 'next';
import { BASE_URL, LOGO_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: "Startup Events in Bengaluru - Cedat",
  description: "Browse upcoming startup meetups, workshops, and networking events in Bengaluru. Join the Cedat community and connect with fellow innovators.",
  openGraph: {
    title: "Startup Events in Bengaluru - Cedat",
    description: "Browse upcoming startup meetups, workshops, and networking events in Bengaluru. Join the Cedat community and connect with fellow innovators.",
    url: `${BASE_URL}/events`,
    siteName: 'Cedat',
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: 'Cedat Events',
      },
    ],
    type: 'website',
  },
   twitter: {
      card: 'summary_large_image',
      title: "Startup Events in Bengaluru - Cedat",
      description: "Browse upcoming startup meetups, workshops, and networking events in Bengaluru. Join the Cedat community and connect with fellow innovators.",
      images: [LOGO_URL],
      creator: '@cedat_org',
    },
};


import { getHomeSettings } from '@/lib/data/settings';

export default async function EventsPage() {
  const [initialEventsPage, homeSettings] = await Promise.all([
    getEventsPage({
      status_filter: 'published',
      page_size: 9
    }),
    getHomeSettings()
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Events",
        "item": `${BASE_URL}/events`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      <main className="pt-20 md:pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 md:mb-8 hover:bg-primary/70">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="max-w-7xl mb-8 md:mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-primary italic">
              {homeSettings.eventsTitle}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {homeSettings.eventsDescription}
            </p>
          </div>

          <EventListClient
            initialEvents={initialEventsPage.events}
            statusFilter="published"
            initialHasMore={initialEventsPage.hasMore}
            initialCursorId={initialEventsPage.nextCursorId ?? undefined}
            queryScope="events-page"
          />

        </div>
      </main>
    </div>
  );
}
