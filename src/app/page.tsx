
import { Hero } from "@/components/home/Hero";
import { UBXSection } from "@/components/home/UBXSection";
import { SocialFeed } from "@/components/home/SocialFeed";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Ecosystem } from "@/components/home/Ecosystem";
import { getEventsPage } from "@/lib/data/events";
import { getSocialPosts } from "@/lib/data/socialposts";
import { getHeroImages } from "@/lib/data/hero";
import { getHomeSettings } from "@/lib/data/settings";
import { EventListClient } from "@/components/events/EventListClient";
import { Metadata } from 'next';
import { BASE_URL, LOGO_URL } from '@/lib/constants';
import { Metrics } from "@/components/home/Metrics";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Let's UBX: Bengaluru's Largest Startup Ecosystem of Communities ",
  description: "Welcome to Let's UBX, Bengaluru's largest and dynamic startup ecosystem of communities for Founders, Enablers, Mentors, Learners & Investors We are ecosystem across all sectors, offering regular meetups, events, funding opportunities, and resources for founders in Hardware, Healthcare, Tech & AI, Food & Agri, Fashion & lifestyle and Social Impact, and more. Join us to connect, learn, and grow your startup.",
  openGraph: {
    title: "Let's UBX: Bengaluru's Largest Startup Ecosystem & Tech Community Hub",
    description: "Welcome to Let's UBX, Bengaluru's largest and most diverse startup ecosystem. Join us to connect, learn, and grow your startup.",
    url: BASE_URL,
    siteName: "Let\'s UBX",
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Let\'s UBX Community",
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Let's UBX: Bengaluru's Largest Startup Ecosystem & Tech Community Hub",
    description: "Welcome to Let's UBX, Bengaluru's largest and most diverse startup ecosystem. Join us to connect, learn, and grow your startup.",
    images: [LOGO_URL],
    creator: '@letsubx_org',
  },
};


export default async function Home() {

  const [latestEventsPage, socialPosts, heroImages, homeSettings] = await Promise.all([
    getEventsPage({
      status_filter: "published",
      page_size: 6,
    }),
    getSocialPosts(),
    getHeroImages(),
    getHomeSettings(),
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
              {homeSettings.title}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg whitespace-pre-wrap">
              {homeSettings.description}
            </p>
          </div>
          <Link href="/events">
            <Button size="lg" className="rounded-full group text-black">
              View All Events <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <EventListClient
          initialEvents={latestEventsPage.events}
          statusFilter="published"
          initialHasMore={latestEventsPage.hasMore}
          initialCursorId={latestEventsPage.nextCursorId ?? undefined}
          queryScope="home-page"
        />

      </section>

      <UBXSection />

      <SocialFeed
        initialPosts={socialPosts}
        settings={{
          socialTitle: homeSettings.socialTitle,
          socialSubtitle: homeSettings.socialSubtitle,
          linkedinLabel: homeSettings.linkedinLabel,
          instagramLabel: homeSettings.instagramLabel,
          youtubeLabel: homeSettings.youtubeLabel,
        }}
      />

      <Ecosystem />

      {/* Programs Teaser */}
      <section className="py-24 pb-10 bg-black text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl space-y-8">
            <h2 className="text-3xl sm:text-6xl font-black leading-tight">
              {homeSettings.fixTitle.split(' - ')[0]}
              {homeSettings.fixTitle.includes(' - ') && (
                <>
                  {" - "}
                  <span className="text-accent italic">{homeSettings.fixTitle.split(' - ')[1]}</span>
                </>
              )}
            </h2>

            <div className="text-lg md:text-xl text-white/80 leading-relaxed whitespace-pre-wrap">
              {homeSettings.fixDescription}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/fix">
                <Button
                  size="lg"
                  className="rounded-full bg-accent hover:bg-accent/90 text-black font-black font-bold px-3 md:px-4 h-9 md:h-12 text-xl md:text-2xl"
                >
                  {homeSettings.fixApplyLabel}
                </Button>
              </Link>

              <Link
                href="https://wa.me/7406345305?text=Hello%2C%20I%20want%20to%20know%20more%20about%20Founders%20%26%20Investors%20Xplore%20(FIX)"
                target="_blank"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 border-white text-black font-bold hover:bg-white/10 px-3 md:px-5 h-9 md:h-12 text-xl md:text-2xl"
                >
                  {homeSettings.fixContactLabel}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
