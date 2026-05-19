
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle } from 'lucide-react';
import { FICImageGallery } from '@/components/fix/FICImageGallery';

interface FixPageClientProps {
  registrationLink?: string;
  title: string;
  about: string;
  sidebarTitle: string;
  sidebarPoints: string[];
}

export function FixPageClient({
  registrationLink,
  title,
  about,
  sidebarTitle,
  sidebarPoints,
}: FixPageClientProps) {
  const hasExternalRegistrationLink = Boolean(registrationLink);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4">

          {/* Top Image */}
          <div className="max-w-3xl mx-auto my-6 md:my-12">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border-2 border-border shadow-lg">
              <Image
                src="/fix/fix.jpeg"
                alt="Founders & Investors Xplore Banner"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16">
            {/* Left side (description) */}
            <div className="md:col-span-3 space-y-6">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-primary italic">{title}</h1>
              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {about}
              </div>
            </div>

            {/* Right side (details & registration) */}
            <div className="md:col-span-2">
              <div className="bg-muted/30 p-6 px-3 md:px-6 rounded-2xl border border-border sticky top-24">
                <h3 className="text-xl font-bold mb-4">{sidebarTitle}</h3>
                <ul className="space-y-3 text-[13.5px] md:text-base text-muted-foreground mb-6">
                  {sidebarPoints.map((point) => (
                    <li key={point} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-3 mt-1 text-primary flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                {hasExternalRegistrationLink ? (
                  <Button asChild size="lg" className="w-full font-bold text-lg">
                    <Link href={registrationLink!} target="_blank">
                      Register Now
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="w-full font-bold text-lg">
                    <Link href="/fix/register">
                      Register Now
                    </Link>
                  </Button>
                )}
                <Link
                  href="https://wa.me/7406345305?text=Hello%2C%20I%20want%20to%20know%20more%20about%20Founders%20%26%20Investors%20Xplore%20(FIX)"
                  target="_blank"
                >
                  <Button size="lg" className="w-full font-bold text-lg text-black bg-white mt-3">
                    <MessageCircle className="w-5 h-5" />
                    Contact Us
                  </Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground pt-3">
                  {hasExternalRegistrationLink
                    ? 'Registration is required to pitch at FIX.'
                    : "You will be redirected to the Let's UBX FIX registration page."}
                </p>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="max-w-6xl mx-auto mt-20 pt-12 border-t border-border">
            <h2 className="text-3xl font-bold text-center mb-8">Glimpses from Past Events</h2>
            <FICImageGallery />
          </div>

        </div>
      </main>
    </div>
  );
}
