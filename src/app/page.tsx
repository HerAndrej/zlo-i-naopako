
"use client";

import { useState } from "react";
import { useScrollPosition } from "@/hooks/useScrollReveal";
import Hero from "@/components/sections/Hero";
import Sauces from "@/components/sections/Sauces";
import Story from "@/components/sections/Story";
import Contact from "@/components/sections/Contact";
import Journey from "@/components/sections/Journey";

import Testimonials from "@/components/sections/Testimonials";

import CheckoutModal from "@/components/ui/CheckoutModal";

export default function Home() {
  const [activeColor, setActiveColor] = useState('#F59E0B');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const scrollY = useScrollPosition();

  const handleOrder = (product: string) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  return (
    <main className="relative w-full min-h-screen" suppressHydrationWarning>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedProduct={selectedProduct}
      />

      {/* Navbar - scroll-aware with blur transition */}
      <nav
        className={`fixed top-0 left-0 w-full px-6 flex justify-between items-center z-50 text-white transition-all duration-500 ${scrollY > 80
          ? 'py-3 navbar-scrolled'
          : 'py-6 mix-blend-difference'
          }`}
        suppressHydrationWarning
      >
        <a href="#" className="flex items-center transition-transform hover:scale-105 duration-300">
          <img
            src="/logo.webp"
            alt="Zlo i Naopako"
            className={`w-auto object-contain transition-all duration-500 ${scrollY > 80 ? 'h-8 md:h-10' : 'h-10 md:h-12'}`}
          />
        </a>
        <div className="hidden md:flex gap-8 font-medium">
          <a href="#sosevi" className="hover:text-primary transition-colors relative group">
            Sosevi
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#o-nama" className="hover:text-primary transition-colors relative group">
            O nama
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#kako-pravimo" className="hover:text-primary transition-colors relative group">
            Proces
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#kontakt" className="hover:text-primary transition-colors relative group">
            Kontakt
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </a>
        </div>
      </nav>

      {/* Scrollable Content */}
      <div className="relative z-10" suppressHydrationWarning>
        <Hero />
        <Journey />
        <Sauces onSauceChange={setActiveColor} onOrder={handleOrder} />

        <Story />
        <Testimonials />
        <Contact />

        <footer className="py-8 text-center text-gray-500 text-sm bg-black relative z-10">
          <p>© 2024 Zlo i naopako ljuti sosevi – vrući još od 2021.</p>
        </footer>
      </div>
    </main>
  );
}
