
import Link from "next/link";
import { Phone,Mail, Linkedin, Instagram, Twitter, Youtube, MessageCircle } from "lucide-react";

interface FooterProps {
  description?: string;
  contactText?: string;
  contactPhone?: string;
}

export function Footer({ description, contactText, contactPhone }: FooterProps) {
  const displayPhone = contactPhone || "+91 74063 45305";
  const telLink = `tel:${displayPhone.replace(/\s+/g, '')}`;

  return (
    <footer className="bg-zinc-900 text-zinc-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-xs space-y-4">
            <h2 className="text-2xl font-black tracking-wide text-white">Let's UBX</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {description || "Dynamic Ecosystem of Nexus Communities for Founders, Enablers, Mentors, Learners, Investors, Freelancers & Professionals"}
            </p>
          </div>

          <nav className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Let's UBX</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/unite" className="hover:text-white transition-colors">Unite</Link></li>
                <li><Link href="/build" className="hover:text-white transition-colors">Build</Link></li>
                <li><Link href="/xplore" className="hover:text-white transition-colors">Xplore</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Explore</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
                <li><Link href="/fix" className="hover:text-white transition-colors">FIX Program</Link></li>
                <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
                <li><Link href="/ask-us" className="hover:text-white transition-colors">Ask Us</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Connect</h4>
                <p className="text-zinc-400 text-xs flex flex-wrap sm:flex-nowrap items-center gap-x-1">
                  <span className="whitespace-nowrap">{contactText || "Have important questions? Contact us at"}</span>
                  <a href={telLink} className="hover:text-white transition-colors whitespace-nowrap font-medium">{displayPhone}</a>
                </p>
              </div>

              <div className="flex gap-4 items-center">
                {/* Direct Call Icon */}
                <a href="tel:+917406345305" className=" text-blue-400 transition-colors">
                  <Phone className="w-5 h-5" />
                </a>

                <a href="https://wa.me/7406345305" target="_blank" rel="noopener noreferrer" className="text-[#25D366] transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/letsubx.in" target="_blank" rel="noopener noreferrer" className="text-[#E4405F] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/company/letsubx" target="_blank" rel="noopener noreferrer" className="text-[#0077B5] transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://www.youtube.com/channel/UCmY3PX-DZdvnaOOp8uSHheA" target="_blank" rel="noopener noreferrer" className="text-[#FF0000] transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="https://x.com/letsubx" target="_blank" rel="noopener noreferrer" className="text-[#1DA1F2] transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="mailto:letsubx.center@gmail.com" className="text-[#EA4335] transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </nav>
        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col sm:flex-row justify-around items-center gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Let's UBX Startup Ecosystem. All rights reserved.</p>
          {/* <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-300">Terms of Service</Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
