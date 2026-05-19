"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users, Hammer, Presentation, CalendarDays, BookOpen,
  Lightbulb, Rocket, Zap, IndianRupee, Factory,
  Building2, Network, Handshake, Globe, Users2, ArrowRight
} from "lucide-react";

const sectionsData = [
  {
    id: "unite",
    title: "Let's Unite",
    highlight: "Unite",
    description: "Event listings and hosting for meetups, workshops, programs, and startup gatherings.",
    href: "/unite",
    cta: "Explore Unite",
    colorClass: "text-[#00ffff]",
    bgClass: "bg-[#00ffff]/10",
    borderClass: "border-[#00ffff]/20",
    cardBgClass: "bg-gradient-to-br from-[#000369] to-[#00ffff]/80",
    cardHoverShadow: "hover:shadow-[#00ffff]/40",
    cards: [
      {
        title: "Events",
        icon: <CalendarDays className="w-8 h-8 text-white" />
      },
      {
        title: "Meetups",
        icon: <Users className="w-8 h-8 text-white" />
      },
      {
        title: "Seminars",
        icon: <Presentation className="w-8 h-8 text-white" />
      },
      {
        title: "Programs",
        icon: <BookOpen className="w-8 h-8 text-white" />
      },
      {
        title: "Workshops",
        icon: <Hammer className="w-8 h-8 text-white" />
      }
    ]
  },
  {
    id: "build",
    title: "Let's Build",
    highlight: "Build",
    description: "A builder platform led by FIX for startup showcases, founder feedback, and growth opportunities.",
    href: "/build",
    cta: "Explore Build",
    colorClass: "text-[#00ffff]",
    bgClass: "bg-[#00ffff]/10",
    borderClass: "border-[#00ffff]/20",
    cardBgClass: "bg-gradient-to-br from-[#000369] to-[#00ffff]/80",
    cardHoverShadow: "hover:shadow-[#00ffff]/40",
    cards: [
      {
        title: "Ideas",
        icon: <Lightbulb className="w-8 h-8 text-white" />
      },
      {
        title: "Projects",
        icon: <Rocket className="w-8 h-8 text-white" />
      },
      {
        title: "Startups",
        icon: <Zap className="w-8 h-8 text-white" />
      },
      {
        title: "Incubations",
        icon: <Factory className="w-8 h-8 text-white" />
      },
      {
        title: "Investments",
        icon: <IndianRupee className="w-8 h-8 text-white" />
      }
    ]
  },
  {
    id: "xplore",
    title: "Let's Xplore",
    highlight: "Xplore",
    description: "Ask Us, opportunity listings, and hosting support for colleges, companies, and communities.",
    href: "/xplore",
    cta: "Explore Xplore",
    colorClass: "text-[#00ffff]",
    bgClass: "bg-[#00ffff]/10",
    borderClass: "border-[#00ffff]/20",
    cardBgClass: "bg-gradient-to-br from-[#000369] to-[#00ffff]/80",
    cardHoverShadow: "hover:shadow-[#00ffff]/40",
    cards: [
      {
        title: "Companies",
        icon: <Building2 className="w-8 h-8 text-white" />
      },
      {
        title: "Ecosystems",
        icon: <Globe className="w-8 h-8 text-white" />
      },
      {
        title: "Connections",
        icon: <Handshake className="w-8 h-8 text-white" />
      },
      {
        title: "Communities",
        icon: <Users2 className="w-8 h-8 text-white" />
      },
      {
        title: "Collaborations",
        icon: <Network className="w-8 h-8 text-white" />
      }
    ]
  }
];

export function UBXSection() {
  return (
    <div className="bg-background relative overflow-hidden flex flex-col gap-6 md:gap-12 py-6 md:py-12">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-x-1/2" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      {sectionsData.map((section) => (
        <section key={section.id} className="container mx-auto px-4 sm:px-6 relative z-10 py-6">
          <div className="text-center mb-6 md:mb-12 space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black tracking-tight"
            >
              Let's <span className={section.colorClass}>{section.highlight}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              {section.description}
            </motion.p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {section.cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(20%-20px)] p-6 rounded-3xl border ${section.cardBgClass} ${section.borderClass} backdrop-blur-xl ${section.cardHoverShadow} hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center text-center group`}
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 md:mb-6 shadow-sm border ${section.borderClass} bg-background/50 group-hover:scale-110 group-hover:bg-background transition-all duration-300`}>
                  {card.icon}
                </div>

                <h3 className="text-lg md:text-xl font-bold">{card.title}</h3>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-10 flex justify-center"
          >
            <Link
              href={section.href}
              className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-bold text-primary shadow-soft transition hover:-translate-y-0.5 hover:bg-primary hover:text-white"
            >
              {section.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>
      ))}
    </div>
  );
}
