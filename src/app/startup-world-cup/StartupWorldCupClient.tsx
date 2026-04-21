"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Mic2,Zap } from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

const SWC_LOGO_SRC = "https://static.wixstatic.com/media/9a1d63_ab519186f938416c8846e0010be6186d~mv2_d_2001_2457_s_2.png";

export function StartupWorldCupClient() {
  return (
    <div className="min-h-screen bg-white text-foreground font-sans">

      {/* Hero Section with Video and Stats */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20 sm:pt-24">
        <video
          src="/startupworldcup/SWC hero video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-10" aria-hidden="true" />
        
        <div className="relative z-20 text-center px-4 pt-16 pb-8 flex-grow flex flex-col justify-center items-center">
            {/* <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight tracking-tighter max-w-4xl"
            >
              Startup World Cup
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="mt-4 text-lg sm:text-xl md:text-2xl font-bold text-accent max-w-2xl mx-auto"
            >
              Bengaluru Regional
            </p> */}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="relative z-20 w-full container mx-auto px-4 sm:px-6 pb-10"
        >
          <div className=" rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-wrap justify-between gap-6 text-center">
              <div className="flex-1 min-w-[120px]">
                <div className="text-3xl sm:text-4xl font-black text-white">
                  <AnimatedCounter to={1000000} format={(n) => `$${Math.round(n / 1000000)}M`} />
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-widest mt-1">Investment Prize</div>
              </div>
              <div className="flex-1 min-w-[120px]">
                <div className="text-3xl sm:text-4xl font-black text-white">
                  <AnimatedCounter to={50000} format={(n) => `${Math.round(n / 1000)}K+`} />
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-widest mt-1">Attendees</div>
              </div>
              <div className="flex-1 min-w-[120px]">
                <div className="text-3xl sm:text-4xl font-black text-white">
                  <AnimatedCounter to={2500} format={(n) => `${Math.round(n).toLocaleString()}+`} />
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-widest mt-1">Investors</div>
              </div>
              <div className="flex-1 min-w-[120px]">
                <div className="text-3xl sm:text-4xl font-black text-white">
                  <AnimatedCounter to={100} format={(n) => `${Math.round(n).toLocaleString()}+`} />
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-widest mt-1">Regionals</div>
              </div>
          </div>
        </motion.div>
      </section>

      {/* Logo & Partnership Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-cyan-50/50 border-b border-slate-200/60">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center space-y-10"
          >
<div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900">
                World's Largest Startup Competition
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="h-1 w-12 bg-primary rounded-full" />
                <span className="text-2xl font-bold text-primary">$1 Million Cash Prize</span>
                <div className="h-1 w-12 bg-primary rounded-full" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12 w-full max-w-4xl mx-auto rounded-3xl bg-white/80 backdrop-blur-sm p-10 sm:p-12 shadow-xl border">
              <div className="rounded-xl bg-[#0284c7] aspect-square w-32 sm:w-44 flex items-center justify-center shrink-0 p-3">
                <img
                  src={SWC_LOGO_SRC}
                  alt="Startup World Cup"
                  className="max-w-full object-contain drop-shadow-md"
                />
              </div>
              <div className="text-xl font-bold text-primary tracking-widest uppercase">
                In Partnership With
              </div>
              <img
                src="/startupworldcup/swccedat.png"
                alt="CEDAT"
                className="h-28 sm:h-36 w-auto object-contain shrink-0"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro & Timeline Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center space-y-4 md:space-y-8"
          >
            <p className="text-primary font-medium uppercase tracking-[0.2em]">
              Regional Competition
            </p>
            <h2 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-gray-900">
              Bengaluru Regional
            </h2>
            <p className="text-xl font-bold text-primary max-w-2xl mx-auto">
              Hosted by CEDAT
            </p>
            <img
              src="/startupworldcup/SWC1.png"
              alt="Startup World Cup Bengaluru Regional"
              className="w-full max-w-3xl mx-auto rounded-2xl object-contain shadow-xl border"
            />
            <p className="text-lg text-gray-600 max-w-xl italic">
              “This platform is for startups and startup ecosystems of the world.”
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="https://www.startupworldcup.io/Bengaluru-2026" target="_blank">
                <Button size="lg" className="rounded-full font-semibold px-8 py-6 text-base shadow-md">
                  Register to Pitch
                </Button>
              </Link>
              <Link href="https://luma.com/dhftdjzm" target="_blank">
                <Button variant="outline" size="lg" className="rounded-full font-semibold px-8 py-6 text-base shadow-sm">
                  Register to Attend
                </Button>
              </Link>
            </div>

            <div className="w-full max-w-4xl mx-auto pt-16">
              <div className="bg-white rounded-3xl p-8 sm:p-12 border shadow-xl">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12 pb-8 border-b">
                  <div className="flex items-center gap-4">
                    <MapPin className="w-10 h-10 text-primary" />
                    <span className="text-2xl font-bold text-gray-900">Bengaluru, India</span>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
                  <div className="flex items-center gap-4">
                    <img src="/startupworldcup/swccedat.png" alt="CEDAT" className="h-16 w-auto object-contain" />
                    <span className="text-lg text-gray-700 font-semibold">Host</span>
                  </div>
                </div>
                
                <div className="relative space-y-12">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-zinc-200 -translate-x-1/2" aria-hidden="true" />
            
            {[
              { label: "Applications Open", date: "3rd March 2026", active: true },
              { label: "Applications Close", date: "10th July 2026", active: false },
              { label: "Top 10 Announced", date: "20th July 2026", active: false },
              { label: "Regional Final", date: "8th August 2026", active: false },
              { label: "Grand Final", date: "4th-6th Nov 2026", active: false },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative flex items-center gap-6 md:gap-12`}
              >
                <div className="w-1/2 text-right">
                  <div className={`text-base md:text-2xl font-black text-right ${item.active ? 'text-accent' : 'text-zinc-900'}`}>
                    {item.label}
                  </div>
                </div>
                
                <div className={`z-10 w-16 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${item.active ? 'bg-accent text-white' : 'bg-zinc-300 text-white'}`}>
                  <Zap className="w-6 h-6" />
                </div>

                <div className="w-1/2">
                  <div className={`text-base md:text-xl font-bold  text-left font-bold text-cyan-700 `}>
                    {item.date}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Attend Section */}
      <section className="py-16 sm:py-24 bg-slate-50 border-y">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-center mb-12 text-gray-900">Why Attend?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="order-2 md:order-1 rounded-2xl p-8 bg-gradient-to-br from-cyan-50 to-sky-100 border flex flex-col justify-center">
              <h3 className="text-xl font-display font-bold text-primary mb-3 uppercase tracking-wide">For Startups</h3>
              <ul className="space-y-2 text-gray-800 list-disc list-inside">
                <li>Network with top tier investors.</li>
                <li>Develop corporate partnerships and hear from top industry experts.</li>
              </ul>
            </div>
            <div className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-lg aspect-video">
              <img src="/startupworldcup/SWC2.png" alt="Startups at SWC" className="w-full h-full object-cover" />
            </div>
            <div className="order-3 rounded-2xl p-8 bg-gradient-to-br from-cyan-50 to-sky-100 border flex flex-col justify-center">
              <h3 className="text-xl font-display font-bold text-primary mb-3 uppercase tracking-wide">For Corporations</h3>
              <ul className="space-y-2 text-gray-800 list-disc list-inside">
                <li>Meet innovative startups from around the world.</li>
                <li>Originate business development opportunities.</li>
                <li>Network with other corporate representatives and investors.</li>
              </ul>
            </div>
            <div className="order-4 rounded-2xl overflow-hidden shadow-lg aspect-video">
              <img src="/startupworldcup/SWC3.png" alt="Corporations at SWC" className="w-full h-full object-cover" />
            </div>
            <div className="order-6 md:order-5 rounded-2xl p-8 bg-gradient-to-br from-cyan-50 to-sky-100 border flex flex-col justify-center">
              <h3 className="text-xl font-display font-bold text-primary mb-3 uppercase tracking-wide">For Investors</h3>
              <ul className="space-y-2 text-gray-800 list-disc list-inside">
                <li>Meet top global startup founders.</li>
                <li>Expand your deal pipeline and explore new markets.</li>
                <li>Network with other investors and corporate representatives.</li>
              </ul>
            </div>
            <div className="order-5 md:order-6 rounded-2xl overflow-hidden shadow-lg aspect-video">
              <img src="/startupworldcup/SWC4.png" alt="Investors at SWC" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Speakers & Judges Coming Soon */}
      <section className="py-16 sm:py-24 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h2 className="text-3xl font-display font-bold mb-8 flex items-center justify-center gap-3 text-gray-900">
                <Mic2 className="w-8 h-8 text-primary" />
                Speakers
              </h2>
              <div className="max-w-md mx-auto bg-slate-50 rounded-2xl p-12 border border-dashed text-center">
                <p className="text-2xl font-display font-semibold text-gray-600">Coming Soon</p>
                <p className="text-gray-500 mt-2">Our lineup of world-class speakers will be announced shortly.</p>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-display font-bold mb-8 flex items-center justify-center gap-3 text-gray-900">
                <Users className="w-8 h-8 text-primary" />
                Judges
              </h2>
              <div className="max-w-md mx-auto bg-slate-50 rounded-2xl p-12 border border-dashed text-center">
                <p className="text-2xl font-display font-semibold text-gray-600">Coming Soon</p>
                <p className="text-gray-500 mt-2">Our panel of esteemed judges will be revealed soon.</p>
              </div>
            </div>
          </div>
      </section>


      {/* Global Sponsors Section */}
      <section className="py-16 sm:py-24 bg-slate-50 border-y">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-10 text-gray-900 uppercase tracking-wide">
            Our Global Sponsors & Partners
          </h2>
          <div className="w-full max-w-6xl mx-auto">
            <img
              src="/startupworldcup/Sponser.png"
              alt="Global Sponsors & Partners"
              className="w-full h-auto rounded-xl shadow-lg object-contain bg-white p-6"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
       <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-8 text-gray-900">About Us</h2>
            <div className="max-w-3xl mx-auto text-center space-y-4 text-gray-700 text-lg">
              <p>
                <span className="font-semibold text-primary">Startup World Cup</span> is a global conference and competition that brings together the top startups, VCs, entrepreneurs and world-class tech CEOs.
              </p>
              <p>
                <span className="font-semibold text-primary">CEDAT</span> is proud to host the Bengaluru Regional, connecting India's thriving startup ecosystem with the world's largest startup competition.
              </p>
            </div>
          </div>
        </section>
    </div>
  );
}
