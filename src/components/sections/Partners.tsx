"use client";

import { useScrollReveal } from '@/hooks/useScrollReveal';

const PARTNERS = [
    {
        name: 'LT Pasta Bar',
        tagline: 'Your local pasta dealer',
        image: '/saradnici/lt-pasta-bar.webp',
    },
];

export default function Partners() {
    const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

    return (
        <section id="saradnici" className="py-16 md:py-24 bg-black border-t border-white/5 relative overflow-hidden">
            <div ref={ref} className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="text-center mb-10 md:mb-14">
                    <span className={`text-gray-500 font-bold tracking-widest uppercase mb-3 block text-xs md:text-sm reveal-hidden ${isVisible ? 'reveal-up' : ''}`}>
                        Saradnici
                    </span>
                    <h2 className={`text-3xl md:text-5xl font-black text-white reveal-hidden ${isVisible ? 'reveal-up stagger-1' : ''}`}>
                        U DOBROM DRUŠTVU
                    </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                    {PARTNERS.map((partner, i) => (
                        <div
                            key={partner.name}
                            className={`w-full max-w-sm bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 text-center hover:border-white/20 transition-colors reveal-hidden ${isVisible ? `reveal-up stagger-${i + 2}` : ''}`}
                        >
                            <img
                                loading="lazy"
                                decoding="async"
                                src={partner.image}
                                alt={partner.name}
                                className="h-64 md:h-80 w-auto max-w-full mx-auto object-contain mb-6"
                            />
                            <h3 className="text-xl md:text-2xl font-black text-white">{partner.name}</h3>
                            <p className="text-gray-500 text-sm uppercase tracking-widest mt-1">{partner.tagline}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
