
"use client";

import { Check, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface SpecialOfferProps {
    onOrder: (product: string) => void;
}

export default function SpecialOffer({ onOrder }: SpecialOfferProps) {
    const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.15 });

    return (
        <section
            ref={sectionRef}
            className="min-h-screen w-full bg-black flex items-center justify-center py-20 px-6 relative overflow-hidden"
        >
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full animate-glow-pulse" />

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* Left: Content */}
                <div className="text-center lg:text-left">
                    <span className={`inline-block py-2 px-4 rounded-full bg-primary/20 text-primary font-bold tracking-widest uppercase text-sm mb-6 border border-primary/30 reveal-hidden ${isVisible ? 'reveal-scale' : ''}`}>
                        Specijalna Ponuda
                    </span>

                    <h2 className={`text-6xl md:text-8xl font-black text-white mb-6 uppercase leading-[0.9] reveal-hidden ${isVisible ? 'reveal-up stagger-1' : ''}`}>
                        Trio <br /><span className="text-primary">Paket.</span>
                    </h2>

                    <p className={`text-gray-400 text-xl md:text-2xl mb-10 font-light max-w-xl mx-auto lg:mx-0 reveal-hidden ${isVisible ? 'reveal-up stagger-2' : ''}`}>
                        Zašto birati kad možeš da imaš sve? Sva tri jahača apokalipse u jednoj kutiji. Savršen poklon za nekoga koga voliš (ili mrziš).
                    </p>

                    <div className="flex flex-col gap-4 mb-10 max-w-md mx-auto lg:mx-0">
                        {[
                            { name: 'Smokiša:', desc: 'Dimljena magija' },
                            { name: 'Čongo:', desc: 'Voćna eksplozija' },
                            { name: 'Bafalo:', desc: 'Puterasti klasik' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-3 text-gray-300 reveal-hidden ${isVisible ? `reveal-left stagger-${i + 3}` : ''}`}
                            >
                                <div className="bg-primary/20 p-1 rounded-full"><Check size={16} className="text-primary" /></div>
                                <span><strong className="text-white">{item.name}</strong> {item.desc}</span>
                            </div>
                        ))}
                    </div>

                    <div className={`flex flex-col md:flex-row items-center gap-6 justify-center lg:justify-start reveal-hidden ${isVisible ? 'reveal-up stagger-6' : ''}`}>
                        <div className="text-center md:text-left">
                            <span className="block text-gray-500 decoration-primary/50 line-through text-lg">2.100 RSD</span>
                            <span className="block text-5xl font-black text-white">1.890 <span className="text-lg font-normal text-gray-400">RSD</span></span>
                        </div>

                        <button
                            onClick={() => onOrder('Trio Paket (Sva tri sosa)')}
                            className="group bg-primary hover:bg-red-700 text-white text-xl font-black py-5 px-10 rounded-full transition-all hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:scale-105 flex items-center gap-3"
                        >
                            Naruči Sve
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Right: Image */}
                <div className={`relative group reveal-hidden ${isVisible ? 'reveal-rotate stagger-2' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-700 animate-glow-pulse" />
                    <img
                        src="/svi.png"
                        alt="Trio Paket Soseva"
                        className={`w-full h-auto object-contain relative z-10 hover:scale-105 transition-transform duration-700 drop-shadow-2xl ${isVisible ? 'animate-float' : ''}`}
                    />
                </div>
            </div>
        </section>
    );
}
