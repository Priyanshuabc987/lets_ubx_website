
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
    { href: "/startup-world-cup", label: "Startup World Cup" },
    { href: "/ask-us", label: "Ask Us" },
  ];

  const isTransparentDefault = pathname === "/" || pathname === "/startup-world-cup";
  const isSolid = scrolled || !isTransparentDefault;

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isSolid
        ? "bg-white/95 backdrop-blur-md  border-border/40 h-14 md:h-20  shadow-sm"
        : "bg-transparent h-14 md:h-18 "
    )}>
      <div className="container mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-24 h-16 sm:w-32 sm:h-20 overflow-hidden rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="/logo/cedat-logo.png" alt="CEDAT" className="w-full h-full object-contain" />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={cn(
                "text-sm font-bold transition-all hover:text-primary cursor-pointer relative group/link",
                pathname === link.href
                  ? (isSolid ? "text-primary" : "text-primary")
                  : (isSolid ? "text-muted-foreground" : "text-white/90")
              )}>
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                  pathname === link.href ? "w-full" : "w-0 group-hover/link:w-full"
                )} />
              </span>
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              {user?.roles?.includes('admin') && (
                <Link href="/admin">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "rounded-full border-2 transition-all font-bold",
                      isSolid 
                        ? "border-primary/20 text-primary hover:bg-primary/5" 
                        : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "rounded-full border-2 transition-all font-bold",
                      isSolid 
                        ? "border-primary/20 text-primary hover:bg-primary/5" 
                        : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    )}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user?.full_name ? user.full_name.split(' ')[0] : 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
          <button
            className={cn(
              "md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors",
              isSolid ? "text-foreground" : "text-white"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background  border-border/40 p-6 flex flex-col gap-4 animate-in slide-in-from-top-5 shadow-2xl">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                <span className={cn(
                  "text-lg font-bold py-2 block transition-colors",
                  pathname === link.href ? "text-primary" : "text-foreground"
                )}>
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            {isAuthenticated && (
              <div className="flex flex-col gap-2">
                {user?.roles?.includes('admin') && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start rounded-full h-12">
                      <Shield className="w-4 h-4 mr-2" /> Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="justify-start px-0 text-destructive h-12"
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
    </nav>
  );
}
