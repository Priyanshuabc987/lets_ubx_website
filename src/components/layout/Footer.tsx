
import Link from "next/link";
import { Linkedin, Instagram, Youtube, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-xs space-y-4">
            <h2 className="text-2xl font-black tracking-tighter text-white">CEDAT</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Empowering the next generation of innovators through a dynamic ecosystem of nexus communities.
            </p>
          </div>

          <nav className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Platform</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
                <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Programs</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/startup-world-cup" className="hover:text-white transition-colors">Startup World Cup</Link></li>
                <li><Link href="/fix" className="hover:text-white transition-colors">FIX</Link></li>
                <li><Link href="/ask-us" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Connect</h4>
              <div className="flex gap-4 items-center">
                <a href="https://www.linkedin.com/company/cedatnexus" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#0077B5] transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://www.youtube.com/channel/UCmY3PX-DZdvnaOOp8uSHheA" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#FF0000] transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/c_e_d_a_t/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#E4405F] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://wa.me/7406345305" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#25D366] transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>

            </div>
          </nav>
        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col sm:flex-row justify-around items-center gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} CEDAT Startup Ecosystem. All rights reserved.</p>
          {/* <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-300">Terms of Service</Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
