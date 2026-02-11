"use client";

import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Hero() {
    const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-20 relative z-10 pt-24 md:pt-0"
        >
            {/* Ambient Background Light */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] md:w-[80vw] h-[50vh] bg-primary/20 blur-[120px] md:blur-[150px] rounded-full -z-10 pointer-events-none ${isVisible ? 'animate-glow-pulse' : 'opacity-0'}`} suppressHydrationWarning />

            <div className="max-w-4xl relative md:w-1/2 z-20 text-center md:text-left">
                {/* Title */}
                <h1 className="text-5xl md:text-[9rem] font-black leading-[0.85] tracking-tighter mb-6 md:mb-8 uppercase">
                    <span className={`block reveal-hidden ${isVisible ? 'reveal-up' : ''}`}>
                        Zlo i
                    </span>
                    <span className={`relative block reveal-hidden ${isVisible ? 'reveal-up stagger-2' : ''}`}>
                        <span className="text-white">naopako</span>
                        <span className={`absolute -bottom-1 md:-bottom-4 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 w-1/3 h-1.5 md:h-4 bg-primary ${isVisible ? 'animate-line-grow stagger-4' : 'scale-x-0'}`} />
                    </span>
                </h1>

                {/* Subtitle */}
                <p className={`text-lg md:text-2xl text-gray-400 mb-8 md:mb-12 max-w-xl mx-auto md:mx-0 font-light leading-relaxed reveal-hidden ${isVisible ? 'reveal-up stagger-3' : ''}`}>
                    Mala kuhinja. <span className="text-white font-medium">Veliki haos.</span><br />
                    Ručno rađeni ljuti sosevi koji ne praštaju.
                </p>

                {/* CTA Button */}
                <div className={`flex justify-center md:justify-start gap-6 reveal-hidden ${isVisible ? 'reveal-scale stagger-4' : ''}`}>
                    <a href="#sosevi" className="group bg-white text-black font-black text-base md:text-lg py-3.5 md:py-4 px-8 md:px-10 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        Upoznaj
                        <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
                    </a>
                </div>
            </div>

            {/* Hero Image */}
            <div className={`md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0 relative z-10 reveal-hidden ${isVisible ? 'reveal-right stagger-3' : ''}`}>
                <img
                    src="/svi.png"
                    alt="Svi sosevi"
                    className={`w-[70%] md:w-[120%] max-w-none md:-mr-20 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 ${isVisible ? 'animate-float' : ''}`}
                />
            </div>
        </section>
    );
}
