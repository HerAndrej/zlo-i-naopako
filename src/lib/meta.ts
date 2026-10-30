import { procitajPristanak, type Pristanak } from '@/lib/pristanak';

const PIXEL_ID = '1649540820032507';

type Fbq = ((...args: unknown[]) => void) & {
    callMethod?: (...args: unknown[]) => void;
    queue: unknown[];
    push: Fbq;
    loaded: boolean;
    version: string;
};

declare global {
    interface Window {
        fbq?: Fbq;
        _fbq?: Fbq;
    }
}

let ucitan = false;

// Metin isečak, ali tek posle pristanka (noscript deo namerno nije tu: bez JS-a ne može da se pita za pristanak)
function ucitajPixel() {
    const fbq = function (...args: unknown[]) {
        if (fbq.callMethod) fbq.callMethod(...args);
        else fbq.queue.push(args);
    } as Fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;

    const skripta = document.createElement('script');
    skripta.async = true;
    skripta.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(skripta);

    // Bez automatskog čitanja dugmadi i teksta sa strane
    fbq('set', 'autoConfig', false, PIXEL_ID);
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
}

function obrisiMetaKolacice() {
    const domen = location.hostname.replace(/^www\./, '');
    for (const ime of ['_fbp', '_fbc']) {
        document.cookie = `${ime}=; Max-Age=0; path=/`;
        document.cookie = `${ime}=; Max-Age=0; path=/; domain=.${domen}`;
    }
}

// Uključuje ili gasi pixel prema odgovoru posetioca
export function uskladiPixel(pristanak: Pristanak) {
    if (pristanak === 'da') {
        if (!ucitan) {
            ucitan = true;
            ucitajPixel();
        } else {
            window.fbq?.('consent', 'grant');
        }
        return;
    }

    if (ucitan) window.fbq?.('consent', 'revoke');
    obrisiMetaKolacice();
}

// Standardni Meta događaj; ne šalje ništa bez pristanka
export function pratiDogadjaj(ime: string, podaci: Record<string, unknown>, eventID?: string) {
    if (!ucitan || procitajPristanak() !== 'da') return;
    window.fbq?.('track', ime, podaci, eventID ? { eventID } : undefined);
}
