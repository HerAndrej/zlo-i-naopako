
"use client";

import { useState } from "react";
import { useScrollPosition } from "@/hooks/useScrollReveal";
import { CartProvider } from "@/context/CartContext";
import Hero from "@/components/sections/Hero";
import Sauces from "@/components/sections/Sauces";
import Story from "@/components/sections/Story";
import Contact from "@/components/sections/Contact";
import Journey from "@/components/sections/Journey";
import Founder from "@/components/sections/Founder";
import Testimonials from "@/components/sections/Testimonials";
import Link from "next/link";
import { Lock } from 'lucide-react';
import CheckoutModal from "@/components/ui/CheckoutModal";

export default function Home() {
  const [activeColor, setActiveColor] = useState('#F59E0B');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollY = useScrollPosition();

  const navLinks = [
    { href: '#sosevi', label: 'Sosevi' },
    { href: '#o-nama', label: 'O nama' },
    { href: '#kako-pravimo', label: 'Proces' },
    { href: '#kontakt', label: 'Kontakt' },
  ];

  return (
    <CartProvider>
      <main className="relative w-full min-h-screen" suppressHydrationWarning>

        <CheckoutModal />

        {/* Navbar */}
        <nav
          className={`fixed top-0 left-0 w-full px-6 flex justify-between items-center z-50 text-white transition-all duration-500 ${scrollY > 80
            ? 'py-3 navbar-scrolled'
            : 'py-6 mix-blend-difference'
            }`}
          suppressHydrationWarning
        >
          <a href="#" className="flex items-center transition-transform hover:scale-105 duration-300">
            <img
              src="/logo-zin.png"
              alt="Zlo i Naopako"
              className={`w-auto object-contain transition-all duration-500 ${scrollY > 80 ? 'h-12 md:h-14' : 'h-14 md:h-16'}`}
            />
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex gap-8 font-medium items-center">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="hover:text-primary transition-colors relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <a
              href="#sosevi"
              className="bg-primary text-white font-bold text-sm py-2 px-5 rounded-full hover:scale-105 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300 ml-2"
            >
              Kupi Odmah
            </a>
          </div>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 z-[60]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 z-[45] md:hidden transition-all duration-500 ${mobileMenuOpen ? 'visible' : 'invisible'}`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className={`relative z-10 flex flex-col items-center justify-center h-full gap-8 transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-black uppercase tracking-wider text-white hover:text-primary transition-all duration-300"
                style={{ transitionDelay: mobileMenuOpen ? `${i * 80}ms` : '0ms' }}
              >
                {link.label}
              </a>
            ))}

            <div className="mt-8 w-12 h-0.5 bg-primary/50" />

            <a
              href="#sosevi"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 bg-primary text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
            >
              Naruči Odmah →
            </a>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="relative z-10" suppressHydrationWarning>
          <Hero />
          <Journey />
          <Founder />
          <Sauces onSauceChange={setActiveColor} />

          <Story />
          <Testimonials />
          <Contact />

          <footer className="py-12 bg-black border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
              {/* Logo */}
              <img
                src="/logo-zin.png"
                alt="Zlo i Naopako"
                className="h-16 md:h-20 w-auto object-contain opacity-80"
              />
              {/* Copyright */}
              <p className="text-gray-600 text-sm text-center">
                © 2025 Zlo i Naopako • Ljuti sosevi ručne izrade
              </p>
              {/* Admin link — diskretan */}
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-gray-700 hover:text-gray-400 transition-all duration-300 text-xs group mt-2"
              >
                <Lock size={11} className="group-hover:text-primary transition-colors duration-300" />
                <span>admin</span>
              </Link>
            </div>
          </footer>

        </div>
      </main>
    </CartProvider>
  );
}
