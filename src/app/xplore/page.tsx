import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Compass,
  GraduationCap,
  MessageCircle,
  Network,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Let's Xplore | Ask Us & Opportunities Platform",
  description:
    "Let's Xplore is the Ask Us, opportunities listing, and hosting platform for colleges, companies, and communities inside the Let's UBX ecosystem.",
};

const xploreTracks = [
  {
    title: "For Colleges",
    description:
      "List campus programs, startup clubs, innovation challenges, speaker sessions, and experiential opportunities for students.",
    icon: GraduationCap,
  },
  {
    title: "For Companies",
    description:
      "Share internships, live projects, hiring drives, founder talks, collaborations, and industry-facing opportunities.",
    icon: Building2,
  },
  {
    title: "For Communities",
    description:
      "Host cross-community initiatives, showcase open calls, and create discovery paths for creators, operators, and founders.",
    icon: Users2,
  },
];

const opportunityBlocks = [
  {
    title: "Ask Us",
    description:
      "Use the UBX network to get help, introductions, collaboration support, or guidance on where your requirement fits.",
    icon: MessageCircle,
  },
  {
    title: "List Opportunities",
    description:
      "Publish programs, internships, startup challenges, community roles, and partnership openings in one ecosystem-facing space.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Host Discovery",
    description:
      "Run curated sessions and open doors for talent, founders, students, and collaborators through UBX-powered outreach.",
    icon: Compass,
  },
  {
    title: "Grow Connections",
    description:
      "Turn one ask into a wider network effect with communities, mentors, institutions, and operators working together.",
    icon: Network,
  },
];

export default function XplorePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-20">
        <section className="container mx-auto px-4 sm:px-6">
          <div className="overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-[#06224f] via-primary to-[#0b8f8f] text-white shadow-xl">
            <div className="grid gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.15fr_0.85fr] md:px-14 md:py-16">
              <div className="space-y-6">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200/90">
                  Ask Us & Opportunities Platform
                </p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
                  Let&apos;s Xplore
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                  Let&apos;s Xplore helps colleges, companies, and communities ask for support,
                  list opportunities, and host ecosystem-facing experiences that create new paths
                  for learning, hiring, and collaboration.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="rounded-full bg-cyan-300 text-primary hover:bg-cyan-200">
                    <Link href="/ask-us">
                      Ask Us Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/15"
                  >
                    <Link
                      href="https://wa.me/7406345305?text=Hello%2C%20I%20want%20to%20list%20or%20host%20an%20opportunity%20with%20Let%27s%20UBX"
                      target="_blank"
                    >
                      List or Host
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {xploreTracks.map((item) => {
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
          <div className="mb-8 space-y-3">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary/70">
              What Xplore Covers
            </p>
            <h2 className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
              A space for asks, opportunities, and outreach
            </h2>
            <p className="max-w-3xl text-muted-foreground">
              Xplore is designed for ecosystem discovery. It works as a support channel, an
              opportunity board, and a hosting layer for collaborations that need the right people
              to find them.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {opportunityBlocks.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="rounded-[1.75rem] border-primary/10 shadow-soft">
                  <CardHeader className="space-y-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                      <Icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl font-black text-primary">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="container mx-auto mt-14 px-4 sm:px-6">
          <Card className="rounded-[2rem] border-primary/10 bg-primary/[0.03]">
            <CardContent className="grid gap-8 p-6 sm:p-8 md:grid-cols-[0.95fr_1.05fr] md:items-center">
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/70">
                  Ask Us
                </p>
                <h2 className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
                  Need help from the UBX ecosystem?
                </h2>
                <p className="text-muted-foreground">
                  If you have a requirement, a partnership idea, an opportunity to share, or need
                  help navigating the right community, start with Ask Us and we&apos;ll help route it.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-primary/10 bg-white p-6 shadow-soft">
                <h3 className="text-2xl font-black text-primary">Submit your enquiry or opportunity</h3>
                <p className="mt-3 text-muted-foreground">
                  Tell us what you&apos;re looking for, what you want to host, or what you want to list.
                  We&apos;ll use UBX to connect the dots.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild className="rounded-full">
                    <Link href="/ask-us">Open Ask Us Form</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link
                      href="https://wa.me/7406345305?text=Hello%2C%20I%20have%20an%20opportunity%20or%20enquiry%20for%20Let%27s%20Xplore"
                      target="_blank"
                    >
                      WhatsApp Us
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
