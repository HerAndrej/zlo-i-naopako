"use client";

import { useEffect, useSyncExternalStore } from 'react';
import { procitajPristanak, pratiPristanak, sacuvajPristanak } from '@/lib/pristanak';
import { uskladiPixel } from '@/lib/meta';

// Na serveru odgovor nije poznat, pa se pitanje ne iscrtava (nema bljeska pri hidrataciji)
const naServeru = () => undefined;

export default function Pristanak() {
    const pristanak = useSyncExternalStore(pratiPristanak, procitajPristanak, naServeru);

    useEffect(() => {
        if (pristanak !== undefined) uskladiPixel(pristanak);
    }, [pristanak]);

    if (pristanak !== null) return null;

    // Uska traka uz dno ekrana: ne pokriva cenu i dugme „Dodaj u korpu" kupcu iz reklame (ni na telefonu ni na računaru)
    return (
        <div
            role="dialog"
            aria-label="Pristanak za kolačić"
            className="fixed bottom-0 inset-x-0 z-[90] bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/10 px-3 md:px-6 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl animate-fade-in"
            style={{ opacity: 0, animationDelay: '0.8s' }}
        >
            <div className="max-w-4xl mx-auto flex items-center gap-3 md:gap-6">
                <p className="flex-1 text-xs md:text-sm text-gray-300 leading-snug">
                    Smemo li da koristimo kolačić za merenje oglasa na Facebooku i Instagramu? Sajt radi i bez njega.
                </p>
                <div className="shrink-0 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => sacuvajPristanak('da')}
                        className="bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs md:text-sm font-bold px-3 py-2 md:py-2.5 rounded-xl transition-colors"
                    >
                        U redu
                    </button>
                    <button
                        type="button"
                        onClick={() => sacuvajPristanak('ne')}
                        className="bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs md:text-sm font-bold px-3 py-2 md:py-2.5 rounded-xl transition-colors"
                    >
                        Ne, hvala
                    </button>
                </div>
            </div>
        </div>
    );
}
