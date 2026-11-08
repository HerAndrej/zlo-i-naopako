import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const OWNER_EMAIL_FALLBACK = 'zloinaopakososevi@gmail.com';
const FROM_EMAIL = 'Zlo i naopako <noreply@zloinaopako.com>';
// Samo za probu: oba mejla idu na ovu adresu umesto kupcu i vlasniku; u produkciji prazno
const EMAIL_TEST_PRIMALAC = process.env.EMAIL_TEST_PRIMALAC || '';

// Starije porudžbine se ne šalju (zaštita od ručnog pozivanja rute sa starim id-jem)
const MAKS_STAROST_MS = 60 * 60 * 1000;

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('sr-Latn-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Belgrade',
    });
}

const formatPrice = (iznos: number) => iznos.toLocaleString('sr-Latn-RS');

// Podaci iz forme idu u HTML mejla, pa se escape-uju
function esc(tekst: string | null | undefined) {
    return (tekst ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

interface OrderItem {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface OrderRow {
    id: string;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string;
    customer_address: string;
    customer_city: string;
    total_amount: number;
    created_at: string;
    order_items: OrderItem[];
}

async function sendEmail(to: string, subject: string, html: string, replyTo?: string): Promise<string | null> {
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: FROM_EMAIL, to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Resend error');
    return data.id || null;
}

const brojPorudzbine = (order: OrderRow) => order.id.slice(0, 8).toUpperCase();

function buildCustomerHtml(order: OrderRow, ownerEmail: string, sosSePravi: boolean): string {
    const itemsHtml = order.order_items.map(item => `
    <tr style="border-bottom:1px solid #1f1f1f;">
      <td style="padding:12px 0;color:#fff;font-size:15px;">${esc(item.product_name)}</td>
      <td style="padding:12px 0;color:#aaa;text-align:center;">${item.quantity}</td>
      <td style="padding:12px 0;color:#fff;text-align:right;">${formatPrice(item.total_price)} RSD</td>
    </tr>
  `).join('');

    return `
<div style="font-family:'Outfit',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px 30px;border-radius:12px;">
  <div style="text-align:center;margin-bottom:30px;">
    <h1 style="color:#DC2626;font-size:28px;margin:0;text-transform:uppercase;letter-spacing:2px;">ZLO I NAOPAKO 🌶️</h1>
    <p style="color:#888;margin-top:8px;">Hvala na porudžbini!</p>
  </div>

  <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:20px;border-left:4px solid #DC2626;">
    <h2 style="color:#fff;margin:0 0 10px 0;font-size:18px;">Porudžbina #${brojPorudzbine(order)}</h2>
    <p style="color:#888;margin:0;">Datum: ${formatDate(order.created_at)}</p>
  </div>

  <h3 style="color:#DC2626;font-size:16px;text-transform:uppercase;letter-spacing:1px;">Poručeno:</h3>
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
    <thead>
      <tr style="border-bottom:1px solid #333;">
        <th style="text-align:left;color:#888;padding:8px 0;font-size:13px;">Proizvod</th>
        <th style="text-align:center;color:#888;padding:8px 0;font-size:13px;">Kom.</th>
        <th style="text-align:right;color:#888;padding:8px 0;font-size:13px;">Cena</th>
      </tr>
    </thead>
    <tbody>${itemsHtml}</tbody>
  </table>

  <div style="border-top:1px solid #333;padding-top:15px;margin-bottom:25px;text-align:right;">
    <span style="color:#DC2626;font-size:18px;font-weight:bold;">UKUPNO: ${formatPrice(order.total_amount)} RSD</span>
  </div>

  <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:25px;">
    <h3 style="color:#DC2626;margin:0 0 12px 0;font-size:15px;text-transform:uppercase;">Adresa isporuke:</h3>
    <p style="color:#ddd;margin:0;line-height:1.6;">${esc(order.customer_address)}, ${esc(order.customer_city)}</p>
  </div>

  <div style="text-align:center;padding:20px;background:#1a1a1a;border-radius:8px;">
    <p style="color:#888;margin:0;font-size:14px;">Plaćanje je <b style="color:#fff;">pouzećem</b> kuriru prilikom preuzimanja. ${sosSePravi
        ? 'Sosevi se upravo prave, pa je rok isporuke <b style="color:#fff;">7 dana</b>.'
        : 'Isporuka je obično u roku od <b style="color:#fff;">1–2 radna dana</b>.'}</p>
    <p style="color:#888;margin:8px 0 0 0;font-size:13px;">Pitanja? Odgovori na ovaj mejl ili piši na ${esc(ownerEmail)}.</p>
  </div>

  <div style="text-align:center;margin-top:30px;">
    <p style="color:#555;font-size:12px;">© ${new Date().getFullYear()} Zlo i naopako • Ručno rađeni ljuti sosevi 🌶️</p>
  </div>
</div>`;
}

function buildOwnerHtml(order: OrderRow): string {
    const itemsHtml = order.order_items.map(item =>
        `<p style="color:#ddd;margin:4px 0;">${item.quantity}x ${esc(item.product_name)} — ${formatPrice(item.total_price)} RSD</p>`
    ).join('');

    return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:30px;border-radius:12px;">
  <h1 style="color:#DC2626;font-size:24px;margin:0 0 20px 0;">🔔 Stigla je nova porudžbina!</h1>

  <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:20px;">
    <p style="margin:0 0 8px 0;color:#888;font-size:13px;text-transform:uppercase;">Porudžbina</p>
    <p style="margin:0;color:#fff;font-size:20px;font-weight:bold;">#${brojPorudzbine(order)}</p>
  </div>

  <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:20px;">
    <h3 style="color:#DC2626;margin:0 0 12px 0;font-size:14px;text-transform:uppercase;">Kupac:</h3>
    <p style="color:#fff;margin:0 0 5px 0;"><b>${esc(order.customer_name)}</b></p>
    ${order.customer_email ? `<p style="color:#aaa;margin:0 0 5px 0;">📧 ${esc(order.customer_email)}</p>` : ''}
    <p style="color:#aaa;margin:0;">📞 ${esc(order.customer_phone)}</p>
  </div>

  <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:20px;">
    <h3 style="color:#DC2626;margin:0 0 12px 0;font-size:14px;text-transform:uppercase;">Poručeno:</h3>
    ${itemsHtml}
  </div>

  <div style="background:#DC2626;border-radius:8px;padding:20px;text-align:center;margin-bottom:20px;">
    <p style="margin:0;color:#fff;font-size:13px;text-transform:uppercase;">Ukupno (pouzećem)</p>
    <p style="margin:5px 0 0 0;color:#fff;font-size:28px;font-weight:bold;">${formatPrice(order.total_amount)} RSD</p>
  </div>

  <div style="background:#1a1a1a;border-radius:8px;padding:20px;">
    <h3 style="color:#DC2626;margin:0 0 10px 0;font-size:14px;text-transform:uppercase;">Adresa isporuke:</h3>
    <p style="color:#ddd;margin:0;line-height:1.5;">${esc(order.customer_address)}, ${esc(order.customer_city)}</p>
  </div>

  <div style="text-align:center;margin-top:25px;">
    <p style="color:#555;font-size:12px;">Zlo i naopako admin • ${formatDate(order.created_at)}</p>
  </div>
</div>`;
}

export async function POST(req: NextRequest) {
    if (!RESEND_API_KEY) {
        return NextResponse.json({ error: 'RESEND_API_KEY nije podešen' }, { status: 500 });
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

    // 1. Porudžbina + stavke (samo kolone koje postoje u bazi)
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
      id, customer_name, customer_email, customer_phone, customer_address, customer_city,
      total_amount, created_at,
      order_items ( product_id, product_name, quantity, unit_price, total_price )
    `)
        .eq('id', orderId)
        .single();

    if (orderError || !orderData) {
        if (orderError) console.error('Porudžbina za mejl nije učitana:', orderError.message);
        return NextResponse.json({ error: 'Porudžbina nije pronađena' }, { status: 404 });
    }
    const order = orderData as unknown as OrderRow;

    if (!order.customer_email) {
        return NextResponse.json({ error: 'Kupac nema email adresu' }, { status: 400 });
    }
    if (Date.now() - new Date(order.created_at).getTime() > MAKS_STAROST_MS) {
        return NextResponse.json({ skipped: 'porudžbina je starija od sat vremena' });
    }

    // 2. Ne šalji dvaput za istu porudžbinu
    const { data: poslato } = await supabase
        .from('email_logs')
        .select('id')
        .eq('order_id', orderId)
        .eq('status', 'sent')
        .limit(1);
    if (poslato?.length) {
        return NextResponse.json({ skipped: 'mejlovi su već poslati' });
    }

    // 3. Adresa vlasnika iz settings
    let ownerEmail = OWNER_EMAIL_FALLBACK;
    const { data: settingsData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'owner_email')
        .single();
    if (settingsData?.value) ownerEmail = settingsData.value;

    // Rok isporuke: 7 dana ako se bar jedan poručeni sos još pravi (ako stanje ne može da se pročita, duži rok)
    const { data: uIzradi, error: stanjeError } = await supabase
        .from('product_stock')
        .select('product_id')
        .eq('in_stock', false);
    const sosSePravi = !!stanjeError || order.order_items.some(s => uIzradi?.some(p => p.product_id === s.product_id));

    const customerTo = EMAIL_TEST_PRIMALAC || order.customer_email;
    const ownerTo = EMAIL_TEST_PRIMALAC || ownerEmail;
    const customerSubject = `✅ Potvrda porudžbine #${brojPorudzbine(order)} – Zlo i naopako`;
    const ownerSubject = `🔔 Nova porudžbina #${brojPorudzbine(order)} – ${order.customer_name}`;

    // 4. Oba mejla paralelno; kupac odgovorom piše vlasniku
    const [customerResult, ownerResult] = await Promise.allSettled([
        sendEmail(customerTo, customerSubject, buildCustomerHtml(order, ownerEmail, sosSePravi), ownerEmail),
        sendEmail(ownerTo, ownerSubject, buildOwnerHtml(order), order.customer_email),
    ]);

    const rezultat = (r: PromiseSettledResult<string | null>) => r.status === 'fulfilled'
        ? { status: 'sent', resend_id: r.value, error_message: null }
        : { status: 'failed', resend_id: null, error_message: String(r.reason?.message ?? r.reason) };
    const kupac = rezultat(customerResult);
    const vlasnik = rezultat(ownerResult);

    // 5. Dnevnik u email_logs
    const { error: logError } = await supabase.from('email_logs').insert([
        { order_id: orderId, type: 'order_confirmation', template: 'order_confirmation', recipient_email: customerTo, subject: customerSubject, ...kupac },
        { order_id: orderId, type: 'owner_notification', template: 'owner_notification', recipient_email: ownerTo, subject: ownerSubject, ...vlasnik },
    ]);
    if (logError) console.error('email_logs upis nije uspeo:', logError.message);

    return NextResponse.json({
        success: kupac.status === 'sent' && vlasnik.status === 'sent',
        customer: { status: kupac.status, error: kupac.error_message },
        owner: { status: vlasnik.status, error: vlasnik.error_message },
    });
}
