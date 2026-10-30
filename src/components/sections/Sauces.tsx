
"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LucideFlame, X } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useCart } from '@/context/CartContext';

const SAUCES = {
    smokisa: {
        id: 'smokisa',
        name: 'Smokiša',
        subtitle: 'Dim koji greje',
        description: 'Smokiša je mekano dimljeni ljuti sos za sve koji vole roštilj vibru čak i kad nema roštilja. Blaga kiselina, puno paprike i topla ljutina koja greje, a ne ubija.',
        color: '#F59E0B',
        colorRgb: '245, 158, 11',
        image: '/sosevi/smokisa.webp',
        heat: 3,
        bestWith: 'burger, krompiriće, sendviče, jaja, roštilj.',
        price: 650
    },
    congo: {
        id: 'congo',
        name: 'Čongo',
        subtitle: 'Voćniji, življi i ljući',
        description: 'Čongo je divlji brat iz ekipe – voćniji, življi i ljutiji. Citrusne note i ozbiljan šut kapsaicina za dane kad ti treba malo više buke u tanjiru.',
        color: '#EAB308',
        colorRgb: '234, 179, 8',
        image: '/sosevi/congo.webp',
        heat: 4,
        bestWith: 'tacos, piletinu, pizzu, testeninu, grilovano povrće.',
        price: 700
    },
    bafalo: {
        id: 'bafalo',
        name: 'Bafalo',
        subtitle: 'Krilca ili ništa',
        description: 'Bafalo je naš domaći buffalo‑style sos: kremast, pikantan i pravljen da se lepi za krilca i prste. Puterasti ukus, sirće i čili spojeni u savršen haos za sve prženo.',
        color: '#EA580C',
        colorRgb: '234, 88, 12',
        image: '/sosevi/bafalo.webp',
        heat: 3,
        bestWith: 'pileća krilca, burger, onion rings, pržene krompiriće, sendviče.',
        price: 750
    },
    trio: {
        id: 'trio',
        name: 'Trio Paket',
        subtitle: 'Sva tri zla',
        description: 'Zašto birati kad možeš da imaš sve? Sva tri jahača apokalipse u jednoj kutiji — Smokiša, Čongo i Bafalo. Savršen poklon za nekoga koga voliš (ili mrziš).',
        color: '#DC2626',
        colorRgb: '220, 38, 38',
        image: '/sosevi/trio.webp',
        heat: 5,
        bestWith: 'bukvalno sve. Od doručka do večere, od roštilja do pizze.',
        price: 1890,
        oldPrice: 2100
    }
};

interface SaucesProps {
    onSauceChange: (color: string) => void;
}

export default function Sauces({ onSauceChange }: SaucesProps) {
    const [activeSauce, setActiveSauce] = useState<keyof typeof SAUCES>('smokisa');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });

    // Esc zatvara uvećanu sliku
    useEffect(() => {
        if (!isZoomed) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsZoomed(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isZoomed]);
    const { addToCart, isInStock } = useCart();

    const handleSelect = (key: keyof typeof SAUCES) => {
        if (key === activeSauce) return;
        setIsAnimating(true);
        setTimeout(() => {
            setActiveSauce(key);
            onSauceChange(SAUCES[key].color);
            setIsAnimating(false);
        }, 300);
    };

    const handleAddToCart = () => {
        const s = SAUCES[activeSauce];
        addToCart({
            id: s.id,
            name: s.name,
            image: s.image,
            price: s.price,
        });
    };

    const sauce = SAUCES[activeSauce];
    const isTrio = activeSauce === 'trio';
    const inStock = isInStock(sauce.id);

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
                <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter">
                    IZABERI SVOJ <br />
                    <span className="transition-colors duration-500" style={{ color: sauce.color }}>SOS.</span>
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
                <div className="order-1 md:order-2 flex justify-center h-[34vh] md:h-[60vh] relative">
                    <button
                        type="button"
                        onClick={() => setIsZoomed(true)}
                        aria-label={`Uvećaj sliku: ${sauce.name}`}
                        className="h-full max-w-full flex justify-center cursor-zoom-in"
                    >
                        <img
                            src={sauce.image}
                            alt={sauce.name}
                            className={`
                                h-full w-auto max-w-full object-contain drop-shadow-2xl transition-all duration-500 transform
                                ${isAnimating ? 'opacity-0 scale-75 rotate-6' : 'opacity-100 scale-100 rotate-0'}
                            `}
                            style={{
                                filter: isAnimating ? 'blur(8px)' : 'blur(0px)',
                                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        />
                    </button>
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

                        <p className={`text-sm md:text-base text-gray-300 mb-6 md:mb-10 leading-relaxed font-light reveal-hidden ${isVisible ? 'reveal-left stagger-4' : ''}`}>
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
                                    <span className="block text-gray-500 line-through text-base">{(sauce as any).oldPrice.toLocaleString('sr-RS')} RSD</span>
                                )}
                                <span className="text-2xl md:text-3xl font-bold">{sauce.price.toLocaleString('sr-RS')} <span className="text-sm font-normal text-gray-500">RSD</span></span>
                                {!inStock && (
                                    <span className="block text-xs font-bold text-red-400 uppercase tracking-widest mt-2">Trenutno nema na stanju</span>
                                )}
                            </div>
                            <div className="col-span-2">
                                <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Najbolje uz</span>
                                <span className="text-white text-sm md:text-base">{sauce.bestWith}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!inStock}
                            className={`group w-full font-black text-base md:text-lg py-3.5 md:py-4 px-8 md:px-12 rounded-full transition-all flex items-center justify-center gap-2 reveal-hidden ${inStock ? 'text-white hover:scale-105' : 'text-gray-400 bg-white/5 border border-white/10 cursor-not-allowed'} ${isVisible ? 'reveal-scale stagger-6' : ''}`}
                            style={inStock ? {
                                backgroundColor: sauce.color,
                                boxShadow: `0 0 30px ${sauce.color}44`
                            } : {}}
                            onMouseEnter={(e) => {
                                if (inStock) e.currentTarget.style.boxShadow = `0 0 40px ${sauce.color}88`;
                            }}
                            onMouseLeave={(e) => {
                                if (inStock) e.currentTarget.style.boxShadow = `0 0 30px ${sauce.color}44`;
                            }}
                        >
                            {inStock ? (
                                <>
                                    {isTrio ? 'Naruči Sve' : 'Dodaj u korpu'}
                                    <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
                                </>
                            ) : (
                                'Trenutno nema na stanju'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Uvećana slika (portal u body da bude iznad menija) */}
            {isZoomed && createPortal(
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={sauce.name}
                    onClick={() => setIsZoomed(false)}
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
                >
                    <img
                        src={sauce.image}
                        alt={sauce.name}
                        className="max-h-[90vh] max-w-full object-contain drop-shadow-2xl"
                    />
                    <button
                        type="button"
                        onClick={() => setIsZoomed(false)}
                        aria-label="Zatvori"
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>,
                document.body
            )}
        </section>
    );
}
