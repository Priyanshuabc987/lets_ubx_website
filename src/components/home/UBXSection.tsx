"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users, Hammer, Presentation, CalendarDays, BookOpen,
  Lightbulb, Rocket, Zap, IndianRupee, Factory,
  Building2, Network, Handshake, Globe, Users2, ArrowRight
} from "lucide-react";
import { HomeSettings } from "@/lib/home-content";

type UBXSectionProps = {
  settings: Pick<
    HomeSettings,
    | "ubxUniteTitle"
    | "ubxUniteDescription"
    | "ubxUniteCards"
    | "ubxBuildTitle"
    | "ubxBuildDescription"
    | "ubxBuildCards"
    | "ubxXploreTitle"
    | "ubxXploreDescription"
    | "ubxXploreCards"
  >;
};

function splitTitle(title: string) {
  const parts = title.trim().split(" ");
  if (parts.length <= 1) {
    return { prefix: title, highlight: "" };
  }

  return {
    prefix: parts.slice(0, -1).join(" "),
    highlight: parts[parts.length - 1],
  };
}

export function UBXSection({ settings }: UBXSectionProps) {
  const sectionsData = [
    {
      id: "unite",
      title: settings.ubxUniteTitle,
      description: settings.ubxUniteDescription,
      href: "/unite",
      cta: "Explore Unite",
      colorClass: "text-[#00ffff]",
      borderClass: "border-[#00ffff]/20",
      cardBgClass: "bg-gradient-to-br from-[#000369] to-[#00ffff]/80",
      cardHoverShadow: "hover:shadow-[#00ffff]/40",
      cards: [
        { title: settings.ubxUniteCards[0] || "", icon: <CalendarDays className="w-8 h-8 text-white" /> },
        { title: settings.ubxUniteCards[1] || "", icon: <Users className="w-8 h-8 text-white" /> },
        { title: settings.ubxUniteCards[2] || "", icon: <Presentation className="w-8 h-8 text-white" /> },
        { title: settings.ubxUniteCards[3] || "", icon: <BookOpen className="w-8 h-8 text-white" /> },
        { title: settings.ubxUniteCards[4] || "", icon: <Hammer className="w-8 h-8 text-white" /> },
      ],
    },
    {
      id: "build",
      title: settings.ubxBuildTitle,
      description: settings.ubxBuildDescription,
      href: "/build",
      cta: "Explore Build",
      colorClass: "text-[#00ffff]",
      borderClass: "border-[#00ffff]/20",
      cardBgClass: "bg-gradient-to-br from-[#000369] to-[#00ffff]/80",
      cardHoverShadow: "hover:shadow-[#00ffff]/40",
      cards: [
        { title: settings.ubxBuildCards[0] || "", icon: <Lightbulb className="w-8 h-8 text-white" /> },
        { title: settings.ubxBuildCards[1] || "", icon: <Rocket className="w-8 h-8 text-white" /> },
        { title: settings.ubxBuildCards[2] || "", icon: <Zap className="w-8 h-8 text-white" /> },
        { title: settings.ubxBuildCards[3] || "", icon: <Factory className="w-8 h-8 text-white" /> },
        { title: settings.ubxBuildCards[4] || "", icon: <IndianRupee className="w-8 h-8 text-white" /> },
      ],
    },
    {
      id: "xplore",
      title: settings.ubxXploreTitle,
      description: settings.ubxXploreDescription,
      href: "/xplore",
      cta: "Explore Xplore",
      colorClass: "text-[#00ffff]",
      borderClass: "border-[#00ffff]/20",
      cardBgClass: "bg-gradient-to-br from-[#000369] to-[#00ffff]/80",
      cardHoverShadow: "hover:shadow-[#00ffff]/40",
      cards: [
        { title: settings.ubxXploreCards[0] || "", icon: <Building2 className="w-8 h-8 text-white" /> },
        { title: settings.ubxXploreCards[1] || "", icon: <Globe className="w-8 h-8 text-white" /> },
        { title: settings.ubxXploreCards[2] || "", icon: <Handshake className="w-8 h-8 text-white" /> },
        { title: settings.ubxXploreCards[3] || "", icon: <Users2 className="w-8 h-8 text-white" /> },
        { title: settings.ubxXploreCards[4] || "", icon: <Network className="w-8 h-8 text-white" /> },
      ],
    }
  ];

  return (
    <div className="bg-background relative overflow-hidden flex flex-col gap-6 md:gap-12 py-6 md:py-12">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-x-1/2" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      {sectionsData.map((section) => {
        const titleParts = splitTitle(section.title);
        const visibleCards = section.cards.filter((card) => card.title.trim().length > 0);

        return (
          <section key={section.id} className="container mx-auto px-4 sm:px-6 relative z-10 py-6">
            <div className="text-center mb-6 md:mb-12 space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-black tracking-tight"
              >
                {titleParts.prefix}
                {titleParts.highlight ? (
                  <>
                    {" "}
                    <span className={section.colorClass}>{titleParts.highlight}</span>
                  </>
                ) : null}
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
              {visibleCards.map((card, index) => (
                <motion.div
                  key={`${section.id}-${index}-${card.title}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(20%-20px)] p-6 rounded-3xl border ${section.cardBgClass} ${section.borderClass} backdrop-blur-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center text-center group`}
                >
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 md:mb-6 shadow-sm border ${section.borderClass} bg-background/50 group-hover:scale-110  transition-all duration-300`}>
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
        );
      })}
    </div>
  );
}
