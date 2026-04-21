"use client";

import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

export function Metrics() {
  return (
    <section className="container mx-auto px-4 -mt-16 relative z-20">
      <div className="bg-white rounded-3xl p-3 py-6 sm:p-12 shadow-2xl border flex flex-wrap justify-between gap-8 text-center">
        <div className="flex-1 min-w-[120px]">
          <div className="text-3xl sm:text-4xl font-black text-primary">
            <AnimatedCounter to={33000} format={(n) => `${Math.round(n / 1000)}K+`} />
          </div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Members</div>
        </div>
        <div className="flex-1 min-w-[120px]">
          <div className="text-3xl sm:text-4xl font-black text-primary">
            <AnimatedCounter to={5000} format={(n) => `${Math.round(n / 1000)}K+`} />
          </div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Startups</div>
        </div>
        <div className="flex-1 min-w-[120px]">
          <div className="text-3xl sm:text-4xl font-black text-primary">
            <AnimatedCounter to={350} format={(n) => `${Math.round(n / 1)}+`} />
          </div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Events</div>
        </div>
        <div className="flex-1 min-w-[120px]">
          <div className="text-3xl sm:text-4xl font-black text-primary">
            <AnimatedCounter to={80} format={(n) => `${Math.round(n / 1)}+`} />
          </div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Partners</div>
        </div>
        <div className="flex-1 min-w-[120px]">
          <div className="text-3xl sm:text-4xl font-black text-primary">
            <AnimatedCounter to={30} format={(n) => `${Math.round(n / 1)}+`} />
          </div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Communities</div>
        </div>
      </div>
    </section>
  );
}
