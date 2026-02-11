"use client";

import { useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const EVENTS = [
    {
        year: '2021',
        title: 'Početak',
        desc: 'Prva tura kuvana u kućnom loncu. Testirano na najhrabrijim prijateljima. Etikete lepljene ručno, često krivo, ali sa puno ljubavi. Nismo znali šta radimo — ali smo znali kako treba da bude ljuto.',
        image: '/1.jpeg'
    },
    {
        year: '2022',
        title: 'Eksperiment',
        desc: 'Otkrivanje tajni fermentacije. Bacili smo 50kg paprike da bismo dobili pravi ukus. Dimili smo paprike danima dok komšije nisu poludele. Kuhinja je postala laboratorija, a mi naučnici u kecelja.',
        image: '/4.jpeg'
    },
    {
        year: '2023',
        title: 'Širenje',
        desc: 'Nove recepture, ozbiljnija oprema. Zlo postaje prepoznatljivo. Nastaje Čongo i Bafalo kao odgovor na "hoćemo još". Prva saradnja sa restoranima i prvi put da nas neko van ekipe traži po imenu.',
        image: '/IMG_20201230_113324.jpg'
    },
    {
        year: '2024',
        title: 'Prepoznatljivost',
        desc: 'Zlo dobija svoj identitet — novi dizajn, nova energija, ali ista filozofija. Počinjemo da stižemo na police, festivale hrane i u ruke ljudi koji cene kvalitet. Brend raste, ali ostaje ručni.',
        image: '/3.jpeg'
    },
    {
        year: '2025',
        title: 'Evolucija',
        desc: 'Unapredili smo proces, proširili tim i pokrenuli online prodaju. Trio Paket postaje hit — ljudi naručuju za sebe, za poklon, za inat. Ljutina se širi brže nego ikada.',
        image: '/2.jpeg'
    },
    {
        year: '2026',
        title: 'Danas',
        desc: 'Mala manufaktura sa velikom pričom. I dalje ručno, i dalje ljuto, ali sada sa stilom i zajednicom koja raste svakog dana. Tri sosa, hiljadu zadovoljnih nepaca — i tek smo počeli.',
        image: '/svi.png'
    }
];

function JourneyItem({ ev, i, isActive }: { ev: typeof EVENTS[0]; i: number; isActive: boolean }) {
    const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
    const isEven = i % 2 === 0;

    return (
        <div
            ref={ref}
            className={`
                journey-item relative flex flex-col md:flex-row items-center gap-4 md:gap-24
                transition-all duration-700
                ${isEven ? '' : 'md:flex-row-reverse'}
                ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-[0.97] md:scale-95'}
            `}
        >
            {/* Center Dot */}
            <div className={`
                absolute left-1/2 w-4 h-4 rounded-full -translate-x-1/2 z-10 top-8 hidden md:block transition-all duration-700
                ${isActive ? 'bg-primary shadow-[0_0_20px_var(--color-primary)] scale-150' : 'bg-white/20 scale-100'}
            `} />

            {/* Mobile Year Badge */}
            <div className="md:hidden w-full flex items-center gap-3 mb-1">
                <span
                    className={`text-2xl font-black transition-colors duration-500 ${isActive ? 'text-primary' : 'text-white/20'}`}
                >
                    {ev.year}
                </span>
                <div className={`flex-1 h-px transition-all duration-500 ${isActive ? 'bg-primary/40' : 'bg-white/10'}`} />
            </div>

            {/* Text Content */}
            <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'} text-left relative z-10`}>
                <span
                    className="text-[5rem] md:text-[10rem] font-black text-white/5 leading-none absolute -top-6 md:-top-20 left-0 w-full select-none -z-10 hidden md:block"
                    style={{ transform: isActive ? 'translateY(0)' : 'translateY(20px)', transition: 'transform 1.2s ease-out' }}
                >
                    {ev.year}
                </span>
                <h3 className={`text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4 relative reveal-hidden ${isVisible ? (isEven ? 'reveal-right' : 'reveal-left') : ''}`}>
                    {ev.title}
                </h3>
                <p className={`text-gray-400 font-light text-sm md:text-lg leading-relaxed relative reveal-hidden ${isVisible ? (isEven ? 'reveal-right stagger-2' : 'reveal-left stagger-2') : ''}`}>
                    {ev.desc}
                </p>
            </div>

            {/* Image Content */}
            <div className="flex-1 w-full relative group">
                <div
                    className={`
                        w-full overflow-hidden rounded-xl md:rounded-2xl relative transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                        ${isActive ? 'h-[200px] md:h-[400px] grayscale-0 shadow-2xl' : 'h-[60px] md:h-[100px] grayscale opacity-50'}
                    `}
                >
                    <img
                        src={ev.image}
                        alt={ev.title}
                        className={`w-full h-full object-cover transition-transform duration-[2s] ${isActive ? 'scale-110' : 'scale-100'}`}
                    />
                    <div className={`absolute inset-0 bg-black/50 transition-opacity duration-700 ${isActive ? 'opacity-0' : 'opacity-100'}`} />
                </div>
            </div>
        </div>
    );
}

export default function Journey() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.3 });

    useEffect(() => {
        const handleScroll = () => {
            const items = document.querySelectorAll('.journey-item');
            const center = window.innerHeight / 2;

            let closestIndex = -1;
            let closestDistance = Infinity;

            items.forEach((item, index) => {
                const rect = item.getBoundingClientRect();
                const itemCenter = rect.top + rect.height / 2;
                const distance = Math.abs(center - itemCenter);

                if (distance < closestDistance && distance < window.innerHeight * 0.4) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            setActiveIndex(closestIndex);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="py-12 md:py-40 relative z-10 overflow-hidden bg-black text-white">
            <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
                <h2
                    ref={titleRef}
                    className={`text-3xl md:text-7xl font-black mb-12 md:mb-24 text-center reveal-hidden ${titleVisible ? 'reveal-up' : ''}`}
                >
                    NAŠ PUT
                </h2>

                {/* Vertical Line (desktop only) */}
                <div className="absolute left-6 md:left-1/2 top-40 bottom-20 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-x-1/2 z-0 hidden md:block" />

                <div className="space-y-12 md:space-y-32">
                    {EVENTS.map((ev, i) => (
                        <JourneyItem key={i} ev={ev} i={i} isActive={i === activeIndex} />
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-16 md:mt-24">
                    <a
                        href="#sosevi"
                        className="group bg-white text-black font-black text-base md:text-lg py-3.5 md:py-4 px-8 md:px-10 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] inline-flex items-center gap-2"
                    >
                        Probaj naše soseve
                        <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
