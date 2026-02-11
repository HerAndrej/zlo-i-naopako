"use client";

import { useState, useRef, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const REVIEWS = [
    {
        name: 'Marko P.',
        role: 'Ljubitelj roštilja',
        text: 'Mislio sam da znam šta je ljuto dok nisam probao Čongo. Oznojio sam se momentalno, ali ukus je neverovatan. Ne mogu da prestanem da ga jedem.',
        sauce: 'Čongo'
    },
    {
        name: 'Jelena S.',
        role: 'Avanturista',
        text: 'Bafalo je nešto najkremastije što sam probala. Savršeno ide uz krilca, bukvalno ne moram ništa više da dodajem. Oduševljena sam!',
        sauce: 'Bafalo'
    },
    {
        name: 'Stefan K.',
        role: 'Chili Head',
        text: 'Smokiša je postao obavezan deo svakog mog sendviča. Taj dimljeni šmek je unreal. Konačno domaći sos koji parira stranim brendovima.',
        sauce: 'Smokiša'
    }
];

function ReviewCard({ review, index }: { review: typeof REVIEWS[0]; index: number }) {
    const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

    return (
        <div
            ref={ref}
            className={`bg-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 transition-all duration-500 group
                hover:border-primary/30 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)] hover:-translate-y-2
                min-w-[280px] md:min-w-0 snap-center flex-shrink-0 md:flex-shrink
                reveal-hidden ${isVisible ? `reveal-up stagger-${index + 2}` : ''}`}
        >
            {/* Stars */}
            <div className="flex gap-1 mb-4 md:mb-6 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        fill="currentColor"
                        size={16}
                        className={`reveal-hidden ${isVisible ? 'animate-star-pop' : ''}`}
                        style={{ animationDelay: isVisible ? `${0.3 + i * 0.1}s` : '0s' }}
                    />
                ))}
            </div>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6 md:mb-8 font-light italic">
                &ldquo;{review.text}&rdquo;
            </p>

            <div className="flex items-center justify-between mt-auto">
                <div>
                    <h4 className="font-bold text-white text-sm md:text-base">{review.name}</h4>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{review.role}</span>
                </div>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-gray-400 group-hover:text-white group-hover:bg-primary/20 transition-all duration-300">
                    {review.sauce}
                </span>
            </div>
        </div>
    );
}

export default function Testimonials() {
    const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.3 });
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();
        return () => el.removeEventListener('scroll', checkScroll);
    }, []);

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const amount = scrollRef.current.clientWidth * 0.85;
        scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    return (
        <section className="py-16 md:py-24 bg-black border-t border-white/5 relative overflow-hidden">
            {/* Subtle shimmer background */}
            <div className="absolute inset-0 animate-shimmer opacity-30" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div ref={headerRef} className="text-center mb-10 md:mb-16">
                    <span className={`text-gray-500 font-bold tracking-widest uppercase mb-3 block text-xs md:text-sm reveal-hidden ${headerVisible ? 'reveal-up' : ''}`}>
                        Zid Plača (od sreće)
                    </span>
                    <h2 className={`text-3xl md:text-6xl font-black text-white mb-4 reveal-hidden ${headerVisible ? 'reveal-up stagger-1' : ''}`}>
                        REČI PREŽIVELIH
                    </h2>
                </div>

                {/* Mobile: horizontal scroll, Desktop: grid */}
                <div className="relative">
                    {/* Scroll arrows (mobile only) */}
                    <button
                        onClick={() => scroll('left')}
                        className={`absolute -left-1 top-1/2 -translate-y-1/2 z-20 md:hidden w-8 h-8 bg-black/80 border border-white/10 rounded-full flex items-center justify-center transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        <ChevronLeft size={16} className="text-white" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className={`absolute -right-1 top-1/2 -translate-y-1/2 z-20 md:hidden w-8 h-8 bg-black/80 border border-white/10 rounded-full flex items-center justify-center transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        <ChevronRight size={16} className="text-white" />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0"
                    >
                        {REVIEWS.map((review, i) => (
                            <ReviewCard key={i} review={review} index={i} />
                        ))}
                    </div>

                    {/* Scroll indicator dots (mobile only) */}
                    <div className="flex justify-center gap-2 mt-4 md:hidden">
                        {REVIEWS.map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
