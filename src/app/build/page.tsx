import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CheckCircle, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FICImageGallery } from "@/components/fix/FICImageGallery";
import { getFixSettings } from "@/lib/data/fix";

export const metadata: Metadata = {
  title: "Let's Build | FIX Platform",
  description:
    "Let's Build is the builder-facing platform of Let's UBX, led by Founders & Investors Xplore (FIX) for startup showcasing, feedback, and opportunities.",
};

const buildHighlights = [
  "Pitch in front of founders, investors, and ecosystem enablers.",
  "Get real-time feedback that helps refine your startup story.",
  "Access the broader UBX community for visibility, support, and momentum.",
];

export default async function BuildPage() {
  const fixSettings = await getFixSettings();
  const registrationLink = fixSettings.registration_link?.trim() || "/fix/register";
  const registrationTarget = fixSettings.registration_link?.trim() ? "_blank" : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-24 pb-20">
        <section className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary via-primary to-cyan-500 px-6 py-12 text-white shadow-xl md:grid-cols-[1.1fr_0.9fr] md:px-12 md:py-14">
            <div className="space-y-6">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200/90">
                Builder Platform
              </p>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
                Let&apos;s Build
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                Let&apos;s Build is where ideas step into the room. This page is centered around FIX,
                our founder and investor-facing platform for startup visibility, sharper feedback,
                and stronger growth opportunities.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-full bg-cyan-300 text-primary hover:bg-cyan-200">
                  <Link href="/fix">
                    Explore FIX
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/15"
                >
                  <Link href={registrationLink} target={registrationTarget}>
                    Apply to Build
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {buildHighlights.map((point) => (
                <div
                  key={point}
                  className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
                >
                  <Sparkles className="mb-3 h-5 w-5 text-cyan-200" />
                  <p className="text-sm leading-6 text-white/85">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto mt-14 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16">
            <div className="md:col-span-3 space-y-6">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-border shadow-lg">
                <Image
                  src="/fix/fix.jpeg"
                  alt="Founders and Investors Xplore"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary/70">
                  Featured Build Program
                </p>
                <h2 className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
                  {fixSettings.title}
                </h2>
                <div className="whitespace-pre-wrap leading-7 text-muted-foreground">
                  {fixSettings.about}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Card className="sticky top-24 rounded-[2rem] border-primary/10 bg-muted/30">
                <CardContent className="space-y-6 p-6">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/70">
                      Why Build Here
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-primary">
                      {fixSettings.sidebar_title}
                    </h3>
                  </div>

                  <ul className="space-y-3 text-sm text-muted-foreground md:text-base">
                    {fixSettings.sidebar_points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col gap-3">
                    <Button asChild size="lg" className="rounded-full font-bold text-base">
                      <Link href={registrationLink} target={registrationTarget}>
                        Register for FIX
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full font-bold text-base">
                      <Link href="/fix/status">Check Registration Status</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full font-bold text-base">
                      <Link
                        href="https://wa.me/7406345305?text=Hello%2C%20I%20want%20to%20know%20more%20about%20Let%27s%20Build%20and%20FIX"
                        target="_blank"
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Contact Us
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto mt-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto rounded-[2rem] border border-primary/10 bg-primary/[0.03] p-6 sm:p-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/70">
                  Proof of Energy
                </p>
                <h2 className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
                  Glimpses from past FIX gatherings
                </h2>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/fix">Open Full FIX Page</Link>
              </Button>
            </div>
            <FICImageGallery />
          </div>
        </section>
      </main>
    </div>
  );
}
