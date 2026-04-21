
import { getEventBySlug, getEvents } from "@/lib/data/events";
import { EventDetailView } from "@/components/events/EventDetailView";
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StaticEventList } from "@/components/events/StaticEventList";
import type { Metadata } from 'next';
import { BASE_URL, LOGO_URL } from "@/lib/constants";

export async function generateStaticParams() {
  const events = await getEvents({ status_filter: 'published' });
  return events.map((event) => ({
    slug: event.slug,
  }));
}

interface EventDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const resolvedparmas = await params;
  const event = await getEventBySlug(resolvedparmas.slug);
  if (!event) {
    return { title: "Event Not Found" };
  }

  const pageTitle = `${event.title} - Cedat: Bengaluru Startup Event`;
  const pageDescription = `Join us for ${event.title}, a premier event for the Bengaluru startup ecosystem. ${event.description?.substring(0, 120)}...`;
  const imageUrl = event.featured_image_url || LOGO_URL;
  const pageUrl = `${BASE_URL}/events/${event.slug}`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
      type: 'article',
      siteName: 'Cedat',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
      creator: '@cedat_org',
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const resolvedparmas = await params;
  const event = await getEventBySlug(resolvedparmas.slug);

  if (!event) {
    notFound();
  }

  const allPublishedEvents = await getEvents({
    status_filter: 'published',
    page_size: 6
  });

  const otherEvents = allPublishedEvents.filter(e => e.id !== event.id).slice(0, 6);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "name": event.title,
        "startDate": `${event.event_date}T${event.start_time}`,
        "endDate": `${event.event_date}T${event.end_time}`,
        "eventStatus": event.status === 'cancelled' ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
        "location": {
            "@type": "Place",
            "name": event.location || "Bengaluru",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": event.location || "Bengaluru",
                "addressLocality": "Bengaluru",
                "addressRegion": "KA",
                "postalCode": "560001",
                "addressCountry": "IN"
            }
        },
        "image": [event.featured_image_url || ""],
        "description": event.description || "",
        "organizer": {
            "@type": "Organization",
            "name": "Cedat",
            "url": BASE_URL
        }
      },
      {
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
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": event.title,
            "item": `${BASE_URL}/events/${event.slug}`
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-32 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
            <Link href="/events" className='mb-2 md:mb-8 inline-block'>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </Link>
            <EventDetailView event={event} layout="centered" />

            {otherEvents.length > 0 && (
              <div className="mt-6 md:mt-10">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10">
                  Upcoming Meetups & Events in Bengaluru
                </h2>
                <StaticEventList events={otherEvents} />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
