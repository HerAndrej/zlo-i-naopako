"use client";

import { useEffect, useState } from 'react';

const SECTIONS = [
    {
        id: 'peppers',
        title: 'Nije ljuto samo da bi bolelo.',
        text: 'Mnogi misle da je poenta ljutog sosa da te rasplače. Mi mislimo drugačije. Ljutina je ovde da otvori čula, a ne da ih ugasi. Koristimo isključivo sveže Habanero i Carolina Reaper paprike – bez ekstrakta, bez hemije.',
        image: '/bg-chilli.png',
        highlight: 'Prave paprike'
    },
    {
        id: 'process',
        title: 'Vreme je naš tajni sastojak.',
        text: 'Dobre stvari ne mogu na brzinu. Naši sosevi fermentišu nedeljama u buradima dok ne razviju onaj duboki, kompleksni profil koji te tera da probaš još. Strpljenje se oseća u svakoj kapi.',
        image: '/bg-barrels.png',
        highlight: 'Fermentacija'
    },
    {
        id: 'sauces',
        title: 'Trio Fantastico.',
        text: 'Tri karaktera za tri raspoloženja. Smokiša za dimljeni šmek roštilja. Čongo za voćnu eksploziju i energiju. Bafalo za kremasti, puterasti užitak uz krilca.',
        image: '/svi.png',
        highlight: 'Tri sveta'
    }
];

export default function Story() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('.story-section');
            const triggerPoint = window.innerHeight * 0.5;

            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
                    if (index !== activeIndex) {
                        setPrevIndex(activeIndex);
                    }
                    setActiveIndex(index);
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeIndex]);

    return (
        <section id="o-nama" className="relative w-full bg-black">

            {/* Sticky Background Layer with Ken Burns */}
            <div className="sticky top-0 w-full h-screen overflow-hidden z-0">
                {SECTIONS.map((section, idx) => (
                    <div
                        key={section.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                    >
                        <div className="absolute inset-0 bg-black/70 md:bg-black/60 z-10" />
                        <img
                            src={section.image}
                            alt={section.title}
                            className={`w-full h-full object-cover transition-transform duration-[8s] ease-out ${idx === activeIndex ? 'scale-110' : 'scale-100'}`}
                        />
                    </div>
                ))}
            </div>

            {/* Scrolling Text Content */}
            <div className="relative z-10 -mt-[100vh]">
                {SECTIONS.map((section, idx) => (
                    <div
                        key={section.id}
                        className="story-section min-h-screen flex items-center justify-start px-4 md:px-24"
                    >
                        <div
                            className="max-w-2xl"
                            style={{
                                opacity: idx === activeIndex ? 1 : 0.15,
                                transform: idx === activeIndex
                                    ? 'translateY(0) translateX(0)'
                                    : 'translateY(30px) translateX(-20px)',
                                filter: idx === activeIndex ? 'blur(0px)' : 'blur(3px)',
                                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        >
                            <span
                                className="text-primary font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase mb-3 md:mb-4 block text-sm md:text-base"
                                style={{
                                    opacity: idx === activeIndex ? 1 : 0,
                                    transform: idx === activeIndex ? 'translateX(0)' : 'translateX(-30px)',
                                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
                                }}
                            >
                                {section.highlight}
                            </span>
                            <h2
                                className="text-3xl md:text-8xl font-black mb-5 md:mb-8 leading-[0.95] md:leading-[0.9] text-white"
                                style={{
                                    opacity: idx === activeIndex ? 1 : 0,
                                    transform: idx === activeIndex ? 'translateY(0)' : 'translateY(40px)',
                                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                                }}
                            >
                                {section.title}
                            </h2>
                            <p
                                className="text-base md:text-2xl text-gray-300 font-light leading-relaxed"
                                style={{
                                    opacity: idx === activeIndex ? 1 : 0,
                                    transform: idx === activeIndex ? 'translateY(0)' : 'translateY(30px)',
                                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
                                }}
                            >
                                {section.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Persistent CTA at bottom of story scroll */}
            <div className="sticky bottom-6 z-20 flex justify-center pointer-events-none">
                <a
                    href="#sosevi"
                    className="pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm md:text-base py-3 px-6 md:px-8 rounded-full hover:bg-primary hover:border-primary hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                >
                    🌶️ Kupi odmah
                </a>
            </div>

        </section>
    );
}
