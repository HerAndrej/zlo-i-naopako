// Pristanak posetioca za kolačić Meta Pixela: 'da', 'ne' ili null (još nije odgovorio).
export type Pristanak = 'da' | 'ne' | null;

const KLJUC = 'zin_pristanak_v1';
const slusaoci = new Set<() => void>();

export function procitajPristanak(): Pristanak {
    try {
        const vrednost = localStorage.getItem(KLJUC);
        return vrednost === 'da' || vrednost === 'ne' ? vrednost : null;
    } catch {
        return null;
    }
}

export function sacuvajPristanak(vrednost: Pristanak) {
    try {
        if (vrednost) localStorage.setItem(KLJUC, vrednost);
        else localStorage.removeItem(KLJUC);
    } catch {
        // privatni prozor ili blokiran storage: odgovor važi samo do osvežavanja
    }
    slusaoci.forEach(f => f());
}

// Za useSyncExternalStore
export function pratiPristanak(f: () => void) {
    slusaoci.add(f);
    return () => { slusaoci.delete(f); };
}
