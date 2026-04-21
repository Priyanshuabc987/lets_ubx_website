
import { Hero } from "@/components/home/Hero";
import { SocialFeed } from "@/components/home/SocialFeed";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Ecosystem } from "@/components/home/Ecosystem";
import { getEvents } from "@/lib/data/events";
import { getSocialPosts } from "@/lib/data/socialposts";
import { getHeroImages } from "@/lib/data/hero";
import { EventListClient } from "@/components/events/EventListClient";
import { Metadata } from 'next';
import { BASE_URL, LOGO_URL } from '@/lib/constants';
import { Metrics } from "@/components/home/Metrics";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cedat: Bengaluru's Largest Startup Ecosystem & Tech Community Hub",
  description: "Welcome to Cedat, Bengaluru's largest and most diverse startup ecosystem. We are community builders across all sectors, offering regular meetups, events, funding opportunities, and resources for founders in Hardware, Healthcare, Tech, Social Impact, and more. Join us to connect, learn, and grow your startup.",
  openGraph: {
    title: "Cedat: Bengaluru's Largest Startup Ecosystem & Tech Community Hub",
    description: "Welcome to Cedat, Bengaluru's largest and most diverse startup ecosystem. Join us to connect, learn, and grow your startup.",
    url: BASE_URL,
    siteName: 'Cedat',
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: 'Cedat Community',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Cedat: Bengaluru's Largest Startup Ecosystem & Tech Community Hub",
    description: "Welcome to Cedat, Bengaluru's largest and most diverse startup ecosystem. Join us to connect, learn, and grow your startup.",
    images: [LOGO_URL],
    creator: '@cedat_org',
  },
};


export default async function Home() {

  const [latestEvents, socialPosts, heroImages] = await Promise.all([
    getEvents({
      status_filter: "published",
      page_size: 3
    }),
    getSocialPosts(),
    getHeroImages()
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Hero initialImages={heroImages} />

      <Metrics />

      {/* Events Grid */}
      <section className="pt-14 md:pt-24  container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-primary italic">
              Startup Ecosystem Meetups & Events
            </h2>
            <p className="text-muted-foreground text-base md:text-lg ">
              Explore exclusive meetups and networking sessions. Cedat is your gateway to the heart of the Bengaluru startup ecosystem.
            </p>
          </div>
          <Link href="/events">
            <Button size="lg" className="rounded-full group">
              View All Events <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <EventListClient initialEvents={latestEvents} statusFilter="published" />
        
      </section>

      <SocialFeed initialPosts={socialPosts} />

      <Ecosystem />

      {/* Programs Teaser */}
      <section className="py-24 pb-10 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl space-y-8">
            <h2 className="text-3xl sm:text-6xl font-black leading-tight">
              Fouders & Investors Xplore (FIX) by CEDAT: <span className="text-accent italic">Pitch Your StartUp</span>
            </h2>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
            FIX connects ambitious founders with top-tier investors and mentors. Whether you’re pitching on stage or networking from the floor, find the fuel for your startup journey here.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/fic">
                <Button size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-white font-black px-6 md:px-10 h-12 md:h-16 text-sm md:text-lg">
                  Apply Now 
                </Button>
              </Link>
              <Link href="https://wa.me/7406345305?text=I%20wanted%20to%20know%20more%20about%20FIX" target="_blank">
                <Button size="lg" variant="outline" className="rounded-full border-2 border-white text-black hover:bg-white/10 px-6 md:px-10 h-10 md:h-16 text-sm md:text-lg">
                <MessageCircle className="w-5 h-5" />
                  Contact Us 
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
