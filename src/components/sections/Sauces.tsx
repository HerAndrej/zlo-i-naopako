"use client";

import { useState } from 'react';
import { LucideFlame } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const SAUCES = {
    smokisa: {
        id: 'smokisa',
        name: 'Smokiša',
        subtitle: 'Dim koji greje',
        description: 'Smokiša je mekano dimljeni ljuti sos za sve koji vole roštilj vibru čak i kad nema roštilja. Blaga kiselina, puno paprike i topla ljutina koja greje, a ne ubija.',
        color: '#F59E0B',
        colorRgb: '245, 158, 11',
        image: '/smokisa_final.png',
        heat: 3,
        bestWith: 'burger, krompiriće, sendviče, jaja, roštilj.',
        price: '650'
    },
    congo: {
        id: 'congo',
        name: 'Čongo',
        subtitle: 'Voćni haos',
        description: 'Čongo je divlji brat iz ekipe – voćniji, življi i ljutiji. Citrusne note i ozbiljan šut kapsaicina za dane kad ti treba malo više buke u tanjiru.',
        color: '#EAB308',
        colorRgb: '234, 179, 8',
        image: '/congo.png',
        heat: 4,
        bestWith: 'tacos, piletinu, pizzu, testeninu, grilovano povrće.',
        price: '700'
    },
    bafalo: {
        id: 'bafalo',
        name: 'Bafalo',
        subtitle: 'Krilca ili ništa',
        description: 'Bafalo je naš domaći buffalo‑style sos: kremast, pikantan i pravljen da se lepi za krilca i prste. Puterasti ukus, sirće i čili spojeni u savršen haos za sve prženo.',
        color: '#EA580C',
        colorRgb: '234, 88, 12',
        image: '/bafalo_final.png',
        heat: 3,
        bestWith: 'pileća krilca, burger, onion rings, pržene krompiriće, sendviče.',
        price: '750'
    },
    trio: {
        id: 'trio',
        name: 'Trio Paket',
        subtitle: 'Sva tri zla',
        description: 'Zašto birati kad možeš da imaš sve? Sva tri jahača apokalipse u jednoj kutiji — Smokiša, Čongo i Bafalo. Savršen poklon za nekoga koga voliš (ili mrziš).',
        color: '#DC2626',
        colorRgb: '220, 38, 38',
        image: '/svi.png',
        heat: 5,
        bestWith: 'bukvalno sve. Od doručka do večere, od roštilja do pizze.',
        price: '1.890',
        oldPrice: '2.100'
    }
};

interface SaucesProps {
    onSauceChange: (color: string) => void;
    onOrder: (product: string) => void;
}

export default function Sauces({ onSauceChange, onOrder }: SaucesProps) {
    const [activeSauce, setActiveSauce] = useState<keyof typeof SAUCES>('smokisa');
    const [isAnimating, setIsAnimating] = useState(false);
    const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });

    const handleSelect = (key: keyof typeof SAUCES) => {
        if (key === activeSauce) return;
        setIsAnimating(true);
        setTimeout(() => {
            setActiveSauce(key);
            onSauceChange(SAUCES[key].color);
            setIsAnimating(false);
        }, 300);
    };

    const sauce = SAUCES[activeSauce];
    const isTrio = activeSauce === 'trio';

    return (
        <section
            ref={sectionRef}
            id="sosevi"
            className="w-full flex flex-col justify-center px-4 md:px-20 py-12 md:py-20 relative z-10 overflow-hidden transition-colors duration-700"
        >
            {/* Dynamic Ambient Background Glow */}
            <div
                className="absolute top-1/2 left-1/2 w-[80vw] h-[80vw] md:w-[800px] md:h-[800px] blur-[100px] md:blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2 -z-10 pointer-events-none mix-blend-screen animate-glow-pulse transition-all duration-700"
                style={{ backgroundColor: sauce.color, opacity: 0.3 }}
            />

            {/* Section Title */}
            <div className={`mb-6 md:mb-12 text-center reveal-hidden ${isVisible ? 'reveal-up' : ''}`}>
                <h2 className="text-4xl md:text-7xl font-black mb-2 tracking-tighter">
                    IZABERI SVOJE <br />
                    <span className="transition-colors duration-500" style={{ color: sauce.color }}>ZLO.</span>
                </h2>
            </div>

            {/* Sauce Selector — Grid on mobile, flex on desktop */}
            <div className={`grid grid-cols-2 md:flex md:justify-center gap-2 mb-8 md:mb-16 reveal-hidden ${isVisible ? 'reveal-scale stagger-2' : ''}`}>
                {(Object.keys(SAUCES) as Array<keyof typeof SAUCES>).map((key) => (
                    <button
                        key={key}
                        onClick={() => handleSelect(key)}
                        className={`
                            px-3 py-2.5 md:px-6 md:py-2 rounded-full font-bold text-xs md:text-sm tracking-wider md:tracking-widest uppercase transition-all duration-300 whitespace-nowrap
                            ${activeSauce === key
                                ? 'text-white scale-[1.02] md:scale-105'
                                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/30'
                            }
                        `}
                        style={activeSauce === key ? {
                            backgroundColor: SAUCES[key].color,
                            boxShadow: `0 0 20px ${SAUCES[key].color}66`
                        } : {}}
                    >
                        {SAUCES[key].name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 w-full max-w-7xl mx-auto items-center">
                {/* Visual Side (Image) */}
                <div className="order-1 md:order-2 flex justify-center h-[30vh] md:h-[50vh] relative">
                    <img
                        src={sauce.image}
                        alt={sauce.name}
                        className={`
                            h-full w-auto object-contain drop-shadow-2xl transition-all duration-500 transform
                            ${isAnimating ? 'opacity-0 scale-75 rotate-6' : 'opacity-100 scale-100 rotate-0'}
                        `}
                        style={{
                            filter: isAnimating ? 'blur(8px)' : 'blur(0px)',
                            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    />
                </div>

                {/* Info Side */}
                <div className="order-2 md:order-1 relative z-20">
                    <div
                        className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}
                        style={{ transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    >
                        <div className={`flex items-baseline gap-3 mb-4 md:mb-6 reveal-hidden ${isVisible ? 'reveal-left stagger-3' : ''}`}>
                            <h3 className="text-3xl md:text-5xl font-black">{sauce.name}</h3>
                            <span className="text-base md:text-xl text-gray-400 font-normal">{sauce.subtitle}</span>
                        </div>

                        {/* Accent line in sauce color */}
                        <div
                            className={`w-12 md:w-16 h-1 mb-5 md:mb-8 ${isVisible ? 'animate-line-grow stagger-4' : 'scale-x-0'}`}
                            style={{ backgroundColor: sauce.color }}
                        />

                        <p className={`text-base md:text-xl text-gray-300 mb-6 md:mb-10 leading-relaxed font-light reveal-hidden ${isVisible ? 'reveal-left stagger-4' : ''}`}>
                            {sauce.description}
                        </p>

                        <div className={`grid grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12 border-t border-white/10 pt-6 md:pt-8 reveal-hidden ${isVisible ? 'reveal-up stagger-5' : ''}`}>
                            <div>
                                <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ljutina</span>
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <LucideFlame
                                            key={i}
                                            size={18}
                                            fill={i < sauce.heat ? sauce.color : "none"}
                                            className={`transition-all duration-300 ${i < sauce.heat ? "scale-100" : "text-gray-800 scale-90"}`}
                                            style={{
                                                color: i < sauce.heat ? sauce.color : undefined,
                                                transitionDelay: `${i * 80}ms`
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Cena</span>
                                {isTrio && (sauce as any).oldPrice && (
                                    <span className="block text-gray-500 line-through text-base">{(sauce as any).oldPrice} RSD</span>
                                )}
                                <span className="text-2xl md:text-3xl font-bold">{sauce.price} <span className="text-sm font-normal text-gray-500">RSD</span></span>
                            </div>
                            <div className="col-span-2">
                                <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Najbolje uz</span>
                                <span className="text-white text-sm md:text-base">{sauce.bestWith}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onOrder(isTrio ? 'Trio Paket (Sva tri sosa)' : `Sos ${sauce.name}`)}
                            className={`group w-full text-white font-black text-base md:text-lg py-3.5 md:py-4 px-8 md:px-12 rounded-full transition-all hover:scale-105 flex items-center justify-center gap-2 reveal-hidden ${isVisible ? 'reveal-scale stagger-6' : ''}`}
                            style={{
                                backgroundColor: sauce.color,
                                boxShadow: `0 0 30px ${sauce.color}44`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = `0 0 40px ${sauce.color}88`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = `0 0 30px ${sauce.color}44`;
                            }}
                        >
                            {isTrio ? 'Naruči Sve' : 'Dodaj u korpu'}
                            <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
