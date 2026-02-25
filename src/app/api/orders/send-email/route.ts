import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const OWNER_EMAIL_FALLBACK = 'zloinaopakososevi@gmail.com';
const FROM_EMAIL = 'noreply@zloinaopako.com';

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatAddress(addr: string | Record<string, string> | null): string {
    if (!addr) return 'Nije navedena';
    if (typeof addr === 'string') {
        try {
            const parsed = JSON.parse(addr);
            return `${parsed.address || parsed.ulica || ''}${parsed.city || parsed.grad ? ', ' + (parsed.city || parsed.grad) : ''}${parsed.zip || parsed.postal_code ? ' ' + (parsed.zip || parsed.postal_code) : ''}`;
        } catch {
            return addr;
        }
    }
    return `${addr.address || addr.street || ''}, ${addr.city || ''} ${addr.zip || ''}`.trim();
}

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    total: number;
}

interface OrderRow {
    id: string;
    order_number: string | null;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string | null;
    customer_address: string | null;
    customer_city: string | null;
    shipping_address: string | null;
    status: string;
    payment_method: string | null;
    subtotal: number | null;
    shipping_cost: number | null;
    discount_amount: number | null;
    total: number | null;
    total_amount: number | null;
    notes: string | null;
    gift_message: string | null;
    created_at: string;
    items: OrderItem[] | null;
}

async function sendEmail(to: string, subject: string, html: string): Promise<string | null> {
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Resend error');
    return data.id || null;
}

function buildCustomerHtml(order: OrderRow): string {
    const orderNumber = order.order_number || order.id.slice(0, 8).toUpperCase();
    const total = order.total ?? order.total_amount ?? 0;
    const subtotal = order.subtotal ?? total;
    const shipping = order.shipping_cost ?? 0;
    const date = formatDate(order.created_at);
    const address = order.shipping_address
        ? formatAddress(order.shipping_address)
        : `${order.customer_address || ''}, ${order.customer_city || ''}`.trim().replace(/^,\s*/, '');

    const itemsHtml = (order.items || []).map(item => `
    <tr style="border-bottom:1px solid #1f1f1f;">
      <td style="padding:12px 0;color:#fff;font-size:15px;">${item.name}</td>
      <td style="padding:12px 0;color:#aaa;text-align:center;">${item.quantity}</td>
      <td style="padding:12px 0;color:#fff;text-align:right;">${item.total.toLocaleString('sr-RS')} RSD</td>
    </tr>
  `).join('') || `<tr><td colspan="3" style="color:#888;padding:12px 0;">Stavke nisu dostupne</td></tr>`;

    return `
<div style="font-family:'Outfit',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px 30px;border-radius:12px;">
  <div style="text-align:center;margin-bottom:30px;">
    <h1 style="color:#DC2626;font-size:28px;margin:0;text-transform:uppercase;letter-spacing:2px;">ZLO I NAOPAKO 🕯️</h1>
    <p style="color:#888;margin-top:8px;">Hvala na narudžbi!</p>
  </div>

  <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:20px;border-left:4px solid #DC2626;">
    <h2 style="color:#fff;margin:0 0 10px 0;font-size:18px;">Narudžba #${orderNumber}</h2>
    <p style="color:#888;margin:0;">Datum: ${date}</p>
  </div>

  <h3 style="color:#DC2626;font-size:16px;text-transform:uppercase;letter-spacing:1px;">Naručeni proizvodi:</h3>
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
    <thead>
      <tr style="border-bottom:1px solid #333;">
        <th style="text-align:left;color:#888;padding:8px 0;font-size:13px;">Proizvod</th>
        <th style="text-align:center;color:#888;padding:8px 0;font-size:13px;">Kom.</th>
        <th style="text-align:right;color:#888;padding:8px 0;font-size:13px;">Cijena</th>
      </tr>
    </thead>
    <tbody>${itemsHtml}</tbody>
  </table>

  <div style="border-top:1px solid #333;padding-top:15px;margin-bottom:25px;">
    <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
      <span style="color:#888;">Međuzbroj:</span>
      <span style="color:#fff;">${subtotal.toLocaleString('sr-RS')} RSD</span>
    </div>
    ${shipping > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px;">
      <span style="color:#888;">Dostava:</span>
      <span style="color:#fff;">${shipping.toLocaleString('sr-RS')} RSD</span>
    </div>` : ''}
    <div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid #333;">
      <span style="color:#DC2626;font-size:18px;font-weight:bold;">UKUPNO:</span>
      <span style="color:#DC2626;font-size:18px;font-weight:bold;">${total.toLocaleString('sr-RS')} RSD</span>
    </div>
  </div>

  <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:25px;">
    <h3 style="color:#DC2626;margin:0 0 12px 0;font-size:15px;text-transform:uppercase;">Adresa isporuke:</h3>
    <p style="color:#ddd;margin:0;line-height:1.6;">${address}</p>
  </div>

  <div style="text-align:center;padding:20px;background:#1a1a1a;border-radius:8px;">
    <p style="color:#888;margin:0;font-size:14px;">Vaša narudžba će biti isporučena u roku od <b style="color:#fff;">2-5 radnih dana</b>.</p>
    <p style="color:#888;margin:8px 0 0 0;font-size:13px;">Pitanja? Pišite nam na Instagram ili email.</p>
  </div>

  <div style="text-align:center;margin-top:30px;">
    <p style="color:#555;font-size:12px;">© 2025 Zlo i Naopako • Ručno rađene svjećice 🕯️</p>
  </div>
</div>`;
}

function buildOwnerHtml(order: OrderRow): string {
    const orderNumber = order.order_number || order.id.slice(0, 8).toUpperCase();
    const total = order.total ?? order.total_amount ?? 0;
    const date = formatDate(order.created_at);
    const address = order.shipping_address
        ? formatAddress(order.shipping_address)
        : `${order.customer_address || ''}, ${order.customer_city || ''}`.trim().replace(/^,\s*/, '');

    const itemsHtml = (order.items || []).map(item =>
        `<p style="color:#ddd;margin:4px 0;">${item.quantity}x ${item.name} — ${item.total.toLocaleString('sr-RS')} RSD</p>`
    ).join('') || `<p style="color:#888;margin:4px 0;">Stavke nisu dostupne</p>`;

    return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:30px;border-radius:12px;">
  <h1 style="color:#DC2626;font-size:24px;margin:0 0 20px 0;">🔔 Nova narudžba stigla!</h1>

  <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:20px;">
    <p style="margin:0 0 8px 0;color:#888;font-size:13px;text-transform:uppercase;">Narudžba</p>
    <p style="margin:0;color:#fff;font-size:20px;font-weight:bold;">#${orderNumber}</p>
  </div>

  <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:20px;">
    <h3 style="color:#DC2626;margin:0 0 12px 0;font-size:14px;text-transform:uppercase;">Kupac:</h3>
    <p style="color:#fff;margin:0 0 5px 0;"><b>${order.customer_name}</b></p>
    ${order.customer_email ? `<p style="color:#aaa;margin:0 0 5px 0;">📧 ${order.customer_email}</p>` : ''}
    ${order.customer_phone ? `<p style="color:#aaa;margin:0;">📞 ${order.customer_phone}</p>` : ''}
  </div>

  <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:20px;">
    <h3 style="color:#DC2626;margin:0 0 12px 0;font-size:14px;text-transform:uppercase;">Naručeno:</h3>
    ${itemsHtml}
  </div>

  <div style="background:#DC2626;border-radius:8px;padding:20px;text-align:center;margin-bottom:20px;">
    <p style="margin:0;color:#fff;font-size:13px;text-transform:uppercase;">Ukupno</p>
    <p style="margin:5px 0 0 0;color:#fff;font-size:28px;font-weight:bold;">${total.toLocaleString('sr-RS')} RSD</p>
  </div>

  <div style="background:#1a1a1a;border-radius:8px;padding:20px;">
    <h3 style="color:#DC2626;margin:0 0 10px 0;font-size:14px;text-transform:uppercase;">Adresa isporuke:</h3>
    <p style="color:#ddd;margin:0;line-height:1.5;">${address}</p>
  </div>

  <div style="text-align:center;margin-top:25px;">
    <p style="color:#555;font-size:12px;">Zlo i Naopako Admin • ${date}</p>
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

    // 1. Dohvati narudžbu + stavke
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
      id, order_number, customer_name, customer_email, customer_phone,
      customer_address, customer_city, shipping_address, status, payment_method,
      subtotal, shipping_cost, discount_amount, total, total_amount,
      notes, gift_message, created_at,
      order_items (
        quantity, unit_price, total_price, product_name,
        product_snapshot
      )
    `)
        .eq('id', orderId)
        .single();

    if (orderError || !orderData) {
        return NextResponse.json({ error: 'Narudžba nije pronađena' }, { status: 404 });
    }

    // Normalizuj stavke
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawItems: any[] = (orderData as any).order_items || [];
    const items: OrderItem[] = rawItems.map(item => ({
        name: item.product_name || item.product_snapshot?.name || 'Proizvod',
        quantity: item.quantity,
        price: item.unit_price ?? item.price ?? 0,
        total: item.total_price ?? item.quantity * (item.unit_price ?? 0),
    }));

    const order: OrderRow = { ...(orderData as unknown as OrderRow), items };

    // 2. Provjeri email kupca
    if (!order.customer_email) {
        return NextResponse.json({ error: 'Kupac nema email adresu' }, { status: 400 });
    }

    // 3. Dohvati owner email
    let ownerEmail = OWNER_EMAIL_FALLBACK;
    const { data: settingsData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'owner_email')
        .single();
    if (settingsData?.value) ownerEmail = settingsData.value;

    const orderNumber = order.order_number || order.id.slice(0, 8).toUpperCase();

    // 4. Pošalji emailove paralelno
    const customerSubject = `✅ Potvrda narudžbe #${orderNumber} – Zlo i Naopako`;
    const ownerSubject = `🔔 Nova narudžba #${orderNumber} – ${order.customer_name}`;

    let customerResendId: string | null = null;
    let ownerResendId: string | null = null;
    let customerStatus = 'sent';
    let ownerStatus = 'sent';
    let customerError: string | undefined;
    let ownerError: string | undefined;

    const [customerResult, ownerResult] = await Promise.allSettled([
        sendEmail(order.customer_email, customerSubject, buildCustomerHtml(order)),
        sendEmail(ownerEmail, ownerSubject, buildOwnerHtml(order)),
    ]);

    if (customerResult.status === 'fulfilled') {
        customerResendId = customerResult.value;
    } else {
        customerStatus = 'failed';
        customerError = customerResult.reason?.message;
    }

    if (ownerResult.status === 'fulfilled') {
        ownerResendId = ownerResult.value;
    } else {
        ownerStatus = 'failed';
        ownerError = ownerResult.reason?.message;
    }

    // 5. Logiraj u email_logs
    await supabase.from('email_logs').insert([
        {
            order_id: orderId,
            type: 'order_confirmation',
            status: customerStatus,
            resend_id: customerResendId,
            recipient_email: order.customer_email,
            subject: customerSubject,
            template: 'order_confirmation',
            error_message: customerError || null,
        },
        {
            order_id: orderId,
            type: 'owner_notification',
            status: ownerStatus,
            resend_id: ownerResendId,
            recipient_email: ownerEmail,
            subject: ownerSubject,
            template: 'owner_notification',
            error_message: ownerError || null,
        },
    ]);

    return NextResponse.json({
        success: true,
        customer: { status: customerStatus, email: order.customer_email },
        owner: { status: ownerStatus, email: ownerEmail },
    });
}
