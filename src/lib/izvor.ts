// Odakle je kupac došao (Meta reklama, Instagram, direktno) — upisuje se uz porudžbinu.
// Čita se iz adrese pri prvom učitavanju i drži samo u memoriji: bez kolačića i localStorage-a,
// pa ne zavisi od pristanka za Meta Pixel.

const PARAMETRI = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;

export type Izvor = Partial<Record<(typeof PARAMETRI)[number] | 'referrer', string>> & { landing_at: string };

let zapamcen: Izvor | null = null;

function procitajIzvor(): Izvor {
    const parametri = new URLSearchParams(location.search);
    // Link reklame je zloinaopako.com/#sosevi, pa parametri mogu da završe i iza #
    const upitnik = location.hash.indexOf('?');
    if (upitnik !== -1) {
        new URLSearchParams(location.hash.slice(upitnik + 1)).forEach((vrednost, kljuc) => {
            if (!parametri.has(kljuc)) parametri.set(kljuc, vrednost);
        });
    }

    const izvor: Izvor = { landing_at: new Date().toISOString() };
    for (const kljuc of PARAMETRI) {
        const vrednost = parametri.get(kljuc);
        if (vrednost) izvor[kljuc] = vrednost.slice(0, 500);
    }

    // Samo domen (npr. l.instagram.com), ne cela adresa
    if (document.referrer) {
        try {
            const domen = new URL(document.referrer).hostname;
            if (domen !== location.hostname) izvor.referrer = domen;
        } catch {
            // neispravan referrer: preskačemo
        }
    }
    return izvor;
}

// Poziva se pri učitavanju sajta, pre nego što klik na meni promeni # u adresi
export function zapamtiIzvor() {
    if (!zapamcen) zapamcen = procitajIzvor();
}

export function izvorPorudzbine(): Izvor {
    zapamtiIzvor();
    return zapamcen!;
}
