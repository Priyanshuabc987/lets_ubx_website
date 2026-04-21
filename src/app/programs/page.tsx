
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Zap, Rocket, Users, BarChart3, Globe, Shield, Star, CheckCircle2 } from "lucide-react";
// import { PlaceHolderImages } from "@/lib/placeholder-images";

// const PROGRAMS_DETAIL = [
//   {
//     title: "Venture Incubation",
//     tag: "Ideation Stage",
//     description: "Our 6-month intensive incubation program helps first-time founders validate their problem-solution fit and build their MVP.",
//     icon: Zap,
//     benefits: ["Equity-free support", "Shared workspace", "Tech stack credits ($50k+)", "Foundational workshops"],
//     image: "https://picsum.photos/seed/p1/800/600",
//   },
//   {
//     title: "Growth Accelerator",
//     tag: "Scaling Stage",
//     description: "For startups with traction looking to optimize their sales funnel, scale their team, and prepare for Series A funding.",
//     icon: Rocket,
//     benefits: ["Direct investor intros", "Growth hacking mentorship", "Global market access", "Dedicated account manager"],
//     image: "https://picsum.photos/seed/p2/800/600",
//   },
//   {
//     title: "Corporate Innovation",
//     tag: "Corporate Partners",
//     description: "Bridging the gap between agile startups and established corporations for pilots and M&A opportunities.",
//     icon: Shield,
//     benefits: ["Custom pilot design", "Innovation scouting", "Cultural transformation", "Joint ventures"],
//     image: "https://picsum.photos/seed/p3/800/600",
//   },
// ];

// export default function ProgramsPage() {
//   return (
//     <div className="pt-24 pb-20">
//       {/* Header */}
//       <section className="bg-primary py-24 text-white">
//         <div className="container mx-auto px-4 text-center max-w-3xl">
//           <h1 className="text-5xl md:text-7xl font-extrabold font-headline mb-8">Our Programs</h1>
//           <p className="text-xl text-white/80 leading-relaxed">
//             We provide structured paths for every stage of your entrepreneurial journey, from a simple sketch to a global IPO.
//           </p>
//         </div>
//       </section>

//       {/* Programs List */}
//       <section className="container mx-auto px-4 py-24 space-y-32">
//         {PROGRAMS_DETAIL.map((prog, i) => (
//           <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>
//             <div className="flex-1 space-y-8">
//               <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-bold tracking-widest uppercase">
//                 {prog.tag}
//               </div>
//               <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">{prog.title}</h2>
//               <p className="text-xl text-muted-foreground leading-relaxed">
//                 {prog.description}
//               </p>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {prog.benefits.map((benefit, j) => (
//                   <div key={j} className="flex items-center gap-3">
//                     <CheckCircle2 className="h-5 w-5 text-secondary" />
//                     <span className="font-semibold">{benefit}</span>
//                   </div>
//                 ))}
//               </div>
//               <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold">
//                 Apply for {prog.title}
//               </Button>
//             </div>
//             <div className="flex-1 relative w-full aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
//               <Image
//                 src={prog.image}
//                 alt={prog.title}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* Stats/Mentors */}
//       <section className="bg-white py-24 border-y">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-4xl font-bold font-headline text-primary mb-16">The Mentorship Network</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
//             {[
//               { label: "Active Mentors", value: "200+" },
//               { label: "Industries Covered", value: "30+" },
//               { label: "Mentoring Hours", value: "10k+" },
//               { label: "Success Rate", value: "88%" },
//             ].map((stat, i) => (
//               <div key={i}>
//                 <div className="text-5xl font-black text-secondary font-headline mb-2">{stat.value}</div>
//                 <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="container mx-auto px-4 py-24">
//         <div className="bg-secondary/10 rounded-[3rem] p-16 text-center">
//           <h2 className="text-3xl md:text-5xl font-bold font-headline text-primary mb-8">Not sure which program is for you?</h2>
//           <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
//             Our ecosystem experts are here to help you navigate the best path for your specific needs.
//           </p>
//           <Button size="lg" className="rounded-full px-12 h-16 text-xl font-bold bg-primary hover:bg-primary/90">
//             Book a Consultation
//           </Button>
//         </div>
//       </section>
//     </div>
//   );
// }

export default function Dummy() { return null; }
