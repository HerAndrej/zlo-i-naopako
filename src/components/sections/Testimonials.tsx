"use client";

import { Star } from 'lucide-react';
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
            className={`bg-white/5 p-8 rounded-3xl border border-white/5 transition-all duration-500 group
                hover:border-primary/30 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)] hover:-translate-y-2
                reveal-hidden ${isVisible ? `reveal-up stagger-${index + 2}` : ''}`}
        >
            {/* Stars - sequential pop */}
            <div className="flex gap-1 mb-6 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        fill="currentColor"
                        size={20}
                        className={`reveal-hidden ${isVisible ? 'animate-star-pop' : ''}`}
                        style={{ animationDelay: isVisible ? `${0.3 + i * 0.1}s` : '0s' }}
                    />
                ))}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 font-light italic">
                &ldquo;{review.text}&rdquo;
            </p>

            <div className="flex items-center justify-between mt-auto">
                <div>
                    <h4 className="font-bold text-white">{review.name}</h4>
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

    return (
        <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
            {/* Subtle shimmer background */}
            <div className="absolute inset-0 animate-shimmer opacity-30" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div ref={headerRef} className="text-center mb-16">
                    <span className={`text-gray-500 font-bold tracking-widest uppercase mb-4 block reveal-hidden ${headerVisible ? 'reveal-up' : ''}`}>
                        Zid Plača (od sreće)
                    </span>
                    <h2 className={`text-4xl md:text-6xl font-black text-white mb-4 reveal-hidden ${headerVisible ? 'reveal-up stagger-1' : ''}`}>
                        REČI PREŽIVELIH
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {REVIEWS.map((review, i) => (
                        <ReviewCard key={i} review={review} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
