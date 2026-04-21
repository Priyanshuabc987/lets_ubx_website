
"use client";

import { motion } from "framer-motion";
import { 
  Cpu, 
  HeartPulse, 
  Sparkles,
  Globe, 
  Leaf, 
  Shirt, 
  Sprout, 
  UsersRound, 
  BriefcaseBusiness, 
  Network 
} from "lucide-react";

const communities = [
  { name: "Hardware", icon: Cpu, color: "from-sky-100 to-blue-100" },
  { name: "Healthcare", icon: HeartPulse, color: "from-red-100 to-pink-100" },
  { name: "AI & Technology", icon: Sparkles, color: "from-purple-100 to-indigo-100" },
  { name: "Import & Export", icon: Globe, color: "from-teal-100 to-cyan-100" },
  { name: "Food & Agriculture", icon: Leaf, color: "from-green-100 to-lime-100" },
  { name: "Fashion & Lifestyle", icon: Shirt, color: "from-rose-100 to-fuchsia-100" },
  { name: "Sustainability & SDGs", icon: Sprout, color: "from-emerald-100 to-green-100" },
  { name: "Social Impact & NGOs", icon: UsersRound, color: "from-yellow-100 to-amber-100" },
  { name: "Education & Employment", icon: BriefcaseBusiness, color: "from-orange-100 to-red-100" },
  { name: "Nexus of CEDAT (NOC)", icon: Network, color: "from-slate-100 to-gray-100" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

export function Ecosystem() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            About CEDAT Ecosystem
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {communities.map((community, i) => {
            const Icon = community.icon;
            return (
              <motion.div
                key={community.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                className="w-full"
              >
                  <div className={`bg-gradient-to-br ${community.color} border rounded-2xl p-6 h-full text-center flex flex-col items-center justify-center group hover:shadow-lg transition-shadow duration-300`}>
                    <Icon className="w-10 h-10 mb-4 text-primary" />
                    <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {community.name}
                    </h3>
                  </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
