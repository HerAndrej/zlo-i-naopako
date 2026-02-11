"use client";

import { Instagram, Mail, Phone } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const CONTACT_ITEMS = [
    {
        href: 'mailto:info@zloinaopako.com',
        icon: Mail,
        label: 'Email',
        value: 'info@zloinaopako.com'
    },
    {
        href: 'tel:+381601234567',
        icon: Phone,
        label: 'Telefon',
        value: '+381 60 123 4567'
    },
    {
        href: '#',
        icon: Instagram,
        label: 'Instagram',
        value: '@zlo_i_naopako_sos'
    }
];

function ContactItem({ item, index }: { item: typeof CONTACT_ITEMS[0]; index: number }) {
    const { ref, isVisible } = useScrollReveal<HTMLAnchorElement>({ threshold: 0.3 });
    const Icon = item.icon;

    return (
        <a
            ref={ref}
            href={item.href}
            className={`flex items-center gap-4 md:gap-6 group p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/5 
                hover:border-primary/50 hover:bg-white/5 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)] 
                transition-all duration-500 hover:-translate-y-1
                reveal-hidden ${isVisible ? `reveal-right stagger-${index + 2}` : ''}`}
        >
            <div className={`w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center text-primary flex-shrink-0
                group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500
                reveal-hidden ${isVisible ? `animate-icon-spin-in stagger-${index + 3}` : ''}`}
            >
                <Icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
                <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">{item.label}</span>
                <span className="text-base md:text-2xl font-bold break-all md:break-normal">{item.value}</span>
            </div>
        </a>
    );
}

export default function Contact() {
    const { ref: headingRef, isVisible: headingVisible } = useScrollReveal({ threshold: 0.3 });

    return (
        <section id="kontakt" className="relative py-12 md:py-20 bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 md:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

                    {/* Left: Heading */}
                    <div ref={headingRef}>
                        <span className={`text-primary font-bold tracking-widest uppercase mb-4 block reveal-hidden ${headingVisible ? 'reveal-left' : ''}`}>
                            Kontakt
                        </span>
                        <h2 className={`text-3xl md:text-7xl font-black mb-5 md:mb-8 leading-tight reveal-hidden ${headingVisible ? 'reveal-left stagger-1' : ''}`}>
                            JAVI SE <br />
                            <span className="text-gray-600">AKO SMEŠ.</span>
                        </h2>
                        <p className={`text-gray-400 text-base md:text-xl font-light max-w-md reveal-hidden ${headingVisible ? 'reveal-left stagger-2' : ''}`}>
                            Imaš pitanje? Hoćeš saradnju? Ili samo želiš da nam kažeš da smo preterali sa ljutinom? Tu smo.
                        </p>
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-4 md:space-y-8">
                        {CONTACT_ITEMS.map((item, i) => (
                            <ContactItem key={i} item={item} index={i} />
                        ))}
                    </div>
                </div>

                <div className="mt-12 md:mt-20 pt-8 md:pt-10 border-t border-white/10 text-center text-gray-600 text-sm">
                    © {new Date().getFullYear()} Zlo i Naopako. Sva prava zadržana. Ljutina je lični izbor.
                </div>
            </div>
        </section>
    );
}
