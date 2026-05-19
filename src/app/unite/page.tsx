import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CalendarDays, Handshake, Layers3 } from "lucide-react";
import { getEventsPage } from "@/lib/data/events";
import { EventListClient } from "@/components/events/EventListClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Let's Unite | Events Listing & Hosting Platform",
  description:
    "Discover upcoming startup events, meetups, workshops, and community gatherings. Let's Unite is the events listing and hosting arm of Let's UBX.",
};

const uniteHighlights = [
  {
    title: "Event Listings",
    description:
      "A dedicated place to discover upcoming meetups, founder circles, workshops, demo days, and community gatherings.",
    icon: CalendarDays,
  },
  {
    title: "Host With UBX",
    description:
      "Colleges, companies, founders, and communities can partner with us to host high-energy events with the right audience.",
    icon: Handshake,
  },
  {
    title: "Flexible Formats",
    description:
      "From networking evenings to hackathons and curated learning sessions, we support multiple event formats under one roof.",
    icon: Layers3,
  },
];

export default async function UnitePage() {
  const initialEventsPage = await getEventsPage({
    status_filter: "published",
    page_size: 6,
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-20">
        <section className="container mx-auto px-4 sm:px-6">
          <div className="overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary via-primary to-cyan-500 text-white shadow-xl">
            <div className="grid gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.3fr_0.7fr] md:px-14 md:py-16">
              <div className="space-y-6">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200/90">
                  Events Listing & Hosting Platform
                </p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
                  Let&apos;s Unite
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                  Let&apos;s Unite is where the UBX ecosystem gathers. We list upcoming events,
                  help communities host stronger experiences, and make it easier for the right
                  people to find the right rooms.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="rounded-full bg-cyan-300 text-primary hover:bg-cyan-200">
                    <Link href="/events">
                      Browse Events
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/15"
                  >
                    <Link href="/ask-us">Host With Us</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {uniteHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                        <Icon className="h-6 w-6 text-cyan-200" />
                      </div>
                      <h2 className="text-lg font-bold">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-white/75">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto mt-14 px-4 sm:px-6">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary/70">
                Live Listings
              </p>
              <h2 className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
                Upcoming events across the ecosystem
              </h2>
              <p className="max-w-2xl text-muted-foreground">
                Explore what&apos;s coming up next and plug into the communities, conversations,
                and collaborations happening inside UBX.
              </p>
            </div>
            {/* <Button asChild variant="outline" className="rounded-full">
              <Link href="/events">View All Events</Link>
            </Button> */}
          </div>

          <EventListClient
            initialEvents={initialEventsPage.events}
            statusFilter="published"
            initialHasMore={initialEventsPage.hasMore}
            initialCursorId={initialEventsPage.nextCursorId ?? undefined}
            queryScope="unite-page"
          />
        </section>

        <section className="container mx-auto mt-10 px-4 sm:px-6">
          <Card className="rounded-[2rem] border-primary/10 bg-primary/[0.03]">
            <CardHeader className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/70">
                For Hosts
              </p>
              <CardTitle className="text-2xl font-black text-primary sm:text-3xl">
                Want to list or host an event with Let&apos;s UBX?
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <p className="max-w-2xl text-muted-foreground">
                If you&apos;re planning a campus session, founder meetup, workshop, community
                gathering, or startup showcase, we can help you list it, shape it, and bring the
                right people in.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-full">
                  <Link href="/ask-us">Start a Hosting Request</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link
                    href="https://wa.me/7406345305?text=Hello%2C%20I%20want%20to%20host%20an%20event%20with%20Let%27s%20UBX"
                    target="_blank"
                  >
                    Contact on WhatsApp
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
