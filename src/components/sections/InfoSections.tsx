import { LucideFlaskConical, LucideFlame, LucideBan, LucideUtensilsCrossed } from 'lucide-react';

export function About() {
    return (
        <section id="o-nama" className="py-40 px-6 md:px-20 relative z-10 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 -z-10">
                <img 
                    src="/bg-chilli.png" 
                    alt="Chilli peppers" 
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block animate-fade-in">Naša Priča</span>
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                    Nije ljuto samo da bi bolelo.<br />
                    <span className="text-gray-400">Ljuto je da bi se pamtilo.</span>
                </h2>
                <p className="text-xl text-gray-200 leading-relaxed font-light drop-shadow-lg">
                    Krenuli smo 2021. iz male kuhinje, sa idejom da napravimo soseve koji imaju karakter. 
                    Koristimo samo prave paprike, fermentišemo ih strpljivo i ne dodajemo gluposti.
                    Svaka bočica je ručno punjena, etiketirana i poslata vama.
                </p>
            </div>
        </section>
    );
}

export function Process() {
    return (
        <section id="kako-pravimo" className="py-40 px-6 md:px-20 relative z-10 overflow-hidden">
             {/* Background Image with Overlay */}
             <div className="absolute inset-0 -z-10">
                <img 
                    src="/bg-barrels.png" 
                    alt="Barrels" 
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
            </div>

            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Kako nastaje jedno zlo</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors backdrop-blur-sm">
                        <LucideFlame className="w-12 h-12 text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Prave paprike</h3>
                        <p className="text-gray-400">Biramo kvalitetne paprike i čilije – od blagih do brutalno ljutih.</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors backdrop-blur-sm">
                        <LucideFlaskConical className="w-12 h-12 text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Mala šarža</h3>
                        <p className="text-gray-400">Kuvamo u manjim količinama da imamo kontrolu nad svakom bocom.</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors backdrop-blur-sm">
                        <LucideBan className="w-12 h-12 text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Bez gluposti</h3>
                        <p className="text-gray-400">U boci je samo ono što možeš da pročitaš. Fokus je na ukusu, ne na hemiji.</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors backdrop-blur-sm">
                        <LucideUtensilsCrossed className="w-12 h-12 text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Testirano na ljudima</h3>
                        <p className="text-gray-400">Svaki sos prolazi kroz realne tanjire pre nego što završi na polici.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Contact() {
    return (
        <section id="kontakt" className="py-20 px-8 md:px-20 relative z-10 bg-black/40">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-4xl font-black mb-6">Javi se</h2>
                <p className="text-gray-300">Imaš pitanje, želiš saradnju ili trebaš veću količinu? Piši nam.</p>
            </div>

            <form className="max-w-xl mx-auto space-y-4">
                <input type="text" placeholder="Tvoje ime" className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-primary outline-none" required />
                <input type="email" placeholder="Tvoj email" className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-primary outline-none" required />
                <textarea placeholder="Poruka" rows={5} className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-primary outline-none" required></textarea>
                <button type="submit" className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-lg transition-all">Pošalji</button>
            </form>
        </section>
    );
}
