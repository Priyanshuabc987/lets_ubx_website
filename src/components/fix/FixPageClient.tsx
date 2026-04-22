
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle } from 'lucide-react';
import { FICImageGallery } from '@/components/fix/FICImageGallery';

interface FixPageClientProps {
  registrationLink: string;
}

export function FixPageClient({ registrationLink }: FixPageClientProps) {
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
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-primary italic">Founders & Investors Xplore (FIX)</h1>
              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
                <p>
                  Founders & Investors Xplore (FIX) by CEDAT is an exclusive event that brings together founders, investors, mentors, startup ecosystem enablers & leaders.
                </p>
                <p>
                  FIX also features a live startup pitch session, where selected founders will get the chance to present their startups directly to investors and enablers of the ecosystem.
                </p>
                <p>
                  Founders will get live feedback, valuable insights and potential funding opportunities for their startup. Along with that, they can explore the startup ecosystem and communities through CEDAT for their startup journey.
                </p>
                <p>
                  We will share a link to submit your pitch deck. Only shortlisted startups will be invited to present their pitch deck on the event day.
                </p>
                <p>
                  Other registered founders & participants can attend the event as visitors, network with mentors, enablers, investors and gain valuable insights.
                </p>
              </div>
            </div>

            {/* Right side (details & registration) */}
            <div className="md:col-span-2">
              <div className="bg-muted/30 p-6 rounded-2xl border border-border sticky top-24">
                <h3 className="text-xl font-bold mb-4">Event Highlights</h3>
                <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                    <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-3 mt-1 text-primary flex-shrink-0" />Live pitching to a panel of active investors.</li>
                    <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-3 mt-1 text-primary flex-shrink-0" />Actionable feedback from industry veterans.</li>
                    <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-3 mt-1 text-primary flex-shrink-0" />High-value networking with VCs & mentors.</li>
                    <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-3 mt-1 text-primary flex-shrink-0" />Explore the CEDAT startup ecosystem.</li>
                </ul>
                <Button asChild size="lg" className="w-full font-bold text-lg">
                    <Link href={registrationLink} target="_blank">
                        Register Now
                    </Link>
                </Button>
                <Link href="https://wa.me/7406345305?text=I%20wanted%20to%20know%20more%20about%20FIX" target="_blank">
                <Button  size="lg" className="w-full font-bold text-lg text-black bg-white mt-3">
                <MessageCircle className="w-5 h-5" />
                  Contact Us 
                </Button>
              </Link>
                <p className="text-xs text-center text-muted-foreground pt-3">
                Registration is required to pitch at FIX.
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
