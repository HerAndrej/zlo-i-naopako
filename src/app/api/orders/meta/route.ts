import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';

// Meta Conversions API: server javlja Purchase za porudžbinu koja je došla sa reklame
// (fbclid ili utm_medium=paid_social). event_id = id porudžbine, isti kao kod pixela,
// pa Meta spaja kupovinu iz pregledača i sa servera u jednu.
const PIXEL_ID = '1649540820032507';
const META_CAPI_TOKEN = process.env.META_CAPI_TOKEN || '';
// Kod iz Events Manager → Test events, samo za probu; u produkciji prazno
const META_CAPI_TEST_CODE = process.env.META_CAPI_TEST_CODE || '';

// Starije porudžbine se ne šalju (zaštita od ručnog pozivanja rute sa starim id-jem)
const MAKS_STAROST_MS = 60 * 60 * 1000;

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

interface OrderRow {
    id: string;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string;
    customer_city: string;
    total_amount: number;
    created_at: string;
    utm_medium: string | null;
    fbclid: string | null;
    landing_at: string | null;
    meta_capi_at: string | null;
    order_items: { product_id: string; quantity: number }[];
}

const sha256 = (vrednost: string) => createHash('sha256').update(vrednost).digest('hex');

// Meta traži broj sa pozivnim brojem zemlje, samo cifre: 064 123 4567 → 381641234567
function normalizujTelefon(telefon: string) {
    const cifre = telefon.replace(/\D/g, '');
    if (cifre.startsWith('00')) return cifre.slice(2);
    if (cifre.startsWith('381')) return cifre;
    if (cifre.startsWith('0')) return '381' + cifre.slice(1);
    return cifre;
}

// Grad: mala slova bez razmaka i kvačica (Čačak → cacak)
function normalizujGrad(grad: string) {
    return grad.toLowerCase().replace(/đ/g, 'dj').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
}

function korisnik(order: OrderRow, req: NextRequest) {
    const delovi = order.customer_name.trim().toLowerCase().split(/\s+/);
    const grad = normalizujGrad(order.customer_city);
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim();

    return {
        em: order.customer_email ? [sha256(order.customer_email.trim().toLowerCase())] : undefined,
        ph: [sha256(normalizujTelefon(order.customer_phone))],
        fn: delovi[0] ? [sha256(delovi[0])] : undefined,
        ln: delovi.length > 1 ? [sha256(delovi[delovi.length - 1])] : undefined,
        ct: grad ? [sha256(grad)] : undefined,
        country: [sha256('rs')],
        // Metin format kolačića _fbc, sastavljen od fbclid-a i trenutka dolaska na sajt
        fbc: order.fbclid ? `fb.1.${new Date(order.landing_at ?? order.created_at).getTime()}.${order.fbclid}` : undefined,
        client_ip_address: ip || undefined,
        client_user_agent: req.headers.get('user-agent') || undefined,
    };
}

export async function POST(req: NextRequest) {
    if (!META_CAPI_TOKEN) {
        return NextResponse.json({ skipped: 'META_CAPI_TOKEN nije podešen' });
    }

    let orderId: string;
    try {
        const body = await req.json();
        orderId = body.orderId;
        if (!orderId) throw new Error('Missing orderId');
    } catch {
        return NextResponse.json({ error: 'Neispravan request body' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('orders')
        .select(`
      id, customer_name, customer_email, customer_phone, customer_city, total_amount, created_at,
      utm_medium, fbclid, landing_at, meta_capi_at,
      order_items ( product_id, quantity )
    `)
        .eq('id', orderId)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: 'Narudžbina nije pronađena' }, { status: 404 });
    }
    const order = data as unknown as OrderRow;

    if (order.meta_capi_at) return NextResponse.json({ skipped: 'već poslato' });
    if (!order.fbclid && order.utm_medium !== 'paid_social') return NextResponse.json({ skipped: 'nije sa reklame' });
    if (Date.now() - new Date(order.created_at).getTime() > MAKS_STAROST_MS) {
        return NextResponse.json({ skipped: 'porudžbina je starija od sat vremena' });
    }

    const dogadjaj = {
        event_name: 'Purchase',
        event_time: Math.floor(new Date(order.created_at).getTime() / 1000),
        event_id: order.id,
        action_source: 'website',
        event_source_url: 'https://zloinaopako.com/',
        user_data: korisnik(order, req),
        custom_data: {
            content_ids: order.order_items.map(item => item.product_id),
            contents: order.order_items.map(item => ({ id: item.product_id, quantity: item.quantity })),
            content_type: 'product',
            num_items: order.order_items.reduce((sum, item) => sum + item.quantity, 0),
            value: order.total_amount,
            currency: 'RSD',
        },
    };

    const res = await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            data: [dogadjaj],
            access_token: META_CAPI_TOKEN,
            ...(META_CAPI_TEST_CODE ? { test_event_code: META_CAPI_TEST_CODE } : {}),
        }),
    });
    const odgovor = await res.json();

    if (!res.ok) {
        console.error('Meta CAPI greška:', JSON.stringify(odgovor.error ?? odgovor));
        return NextResponse.json({ error: odgovor.error?.message || 'Meta CAPI greška' }, { status: 502 });
    }

    // Probni događaji (test kod) ne obeležavaju porudžbinu, da prava ostane za slanje
    if (!META_CAPI_TEST_CODE) {
        await supabase.from('orders').update({ meta_capi_at: new Date().toISOString() }).eq('id', order.id);
    }

    return NextResponse.json({ success: true, events_received: odgovor.events_received, test: !!META_CAPI_TEST_CODE });
}
