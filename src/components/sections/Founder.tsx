"use client";

import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ChefHat, Flame, Heart } from 'lucide-react';

const STATS = [
    { icon: ChefHat, value: '10+', label: 'Godina iskustva' },
    { icon: Flame, value: '3', label: 'Originalna sosa' },
    { icon: Heart, value: '∞', label: 'Ljubav prema ljutom' },
];

export default function Founder() {
    const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.15 });

    return (
        <section ref={sectionRef} className="relative py-16 md:py-32 bg-black text-white overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/2 right-0 w-[50vw] h-[50vw] md:w-[600px] md:h-[600px] bg-primary/15 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

                    {/* Photo */}
                    <div className={`relative reveal-hidden ${isVisible ? 'reveal-left' : ''}`}>
                        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
                            <img
                                src="/ze.jpeg"
                                alt="Aleksandar Davidović — kuvar i osnivač"
                                className="w-full h-[400px] md:h-[600px] object-cover object-top"
                            />
                            {/* Gradient overlay at bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            {/* Name overlay on photo */}
                            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                                <span className="text-primary font-bold text-xs md:text-sm tracking-[0.2em] uppercase">Osnivač</span>
                                <h3 className="text-2xl md:text-4xl font-black mt-1">Aleksandar Davidović</h3>
                            </div>
                        </div>

                        {/* Decorative border accent */}
                        <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-primary/20 rounded-2xl md:rounded-3xl -z-10 hidden md:block" />
                    </div>

                    {/* Text Content */}
                    <div>
                        <span className={`text-primary font-bold tracking-[0.15em] uppercase mb-3 block text-xs md:text-sm reveal-hidden ${isVisible ? 'reveal-right stagger-1' : ''}`}>
                            O meni
                        </span>
                        <h2 className={`text-3xl md:text-6xl font-black mb-6 md:mb-8 leading-[0.95] reveal-hidden ${isVisible ? 'reveal-right stagger-2' : ''}`}>
                            IZA SVAKOG <br />
                            <span className="text-primary">SOSA</span> STOJI <br />
                            PRIČA.
                        </h2>

                        <div className={`space-y-4 md:space-y-6 mb-8 md:mb-10 reveal-hidden ${isVisible ? 'reveal-right stagger-3' : ''}`}>
                            <p className="text-gray-300 text-base md:text-xl font-light leading-relaxed">
                                Ja sam <span className="text-white font-medium">Aleksandar Davidović</span> — kuvar sa preko 10 godina iskustva u profesionalnim kuhinjama.
                                Oduvek sam voleo ljute paprike i intenzivne ukuse koji bude čula.
                            </p>
                            <p className="text-gray-400 text-sm md:text-lg font-light leading-relaxed">
                                Zlo i Naopako nije nastalo u fabrici, već u mojoj kuhinji — iz čiste ljubavi prema ljutini,
                                eksperimentisanju i želji da napravim nešto što ljudi zaista <span className="text-white">žele da jedu</span>.
                                Svaki sos ima svoj karakter, baš kao i jelo koje pravim — bez kompromisa, bez prečica, samo pravi ukus.
                            </p>
                            <p className="text-gray-400 text-sm md:text-lg font-light leading-relaxed">
                                Verujem da hrana treba da budi emocije. A ljutina? Ljutina budi <span className="text-primary font-medium">sve</span>.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className={`grid grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-10 reveal-hidden ${isVisible ? 'reveal-up stagger-4' : ''}`}>
                            {STATS.map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={i}
                                        className="text-center p-3 md:p-5 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all duration-300"
                                    >
                                        <Icon size={20} className="mx-auto mb-2 text-primary md:w-6 md:h-6" />
                                        <span className="block text-xl md:text-3xl font-black">{stat.value}</span>
                                        <span className="block text-[10px] md:text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA */}
                        <a
                            href="#sosevi"
                            className={`group w-full md:w-auto bg-primary text-white font-black text-base md:text-lg py-3.5 md:py-4 px-8 md:px-12 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 reveal-hidden ${isVisible ? 'reveal-scale stagger-5' : ''}`}
                        >
                            Probaj moje soseve
                            <span className="text-xl transition-transform group-hover:translate-x-1">🌶️</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
