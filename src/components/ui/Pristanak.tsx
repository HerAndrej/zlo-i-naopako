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

    return (
        <div
            role="dialog"
            aria-label="Pristanak za kolačić"
            className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-sm z-[90] bg-[#0a0a0a]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl animate-fade-in"
            style={{ opacity: 0, animationDelay: '0.8s' }}
        >
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
                Smemo li da koristimo kolačić za merenje naših oglasa na Facebooku i Instagramu? Sajt radi i bez njega.
            </p>
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => sacuvajPristanak('da')}
                    className="bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                >
                    U redu
                </button>
                <button
                    type="button"
                    onClick={() => sacuvajPristanak('ne')}
                    className="bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                >
                    Ne, hvala
                </button>
            </div>
        </div>
    );
}
