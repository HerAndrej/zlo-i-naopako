---
name: order-email-notifications
description: >
  Skill za slanje email notifikacija o narudžbi koristeći Resend MCP i Supabase MCP.
  Koristi ovaj skill kad god:
  - kupac završi kupovinu ili se narudžba kreira
  - treba poslati potvrdu narudžbe kupcu
  - treba obavijestiti ownera o novoj narudžbi
  - korisnik kaže "pošalji mejl o narudžbi", "obavijesti kupca", "pošalji potvrdu"
  - status narudžbe se promijeni (odobrena, poslata, isporučena)
  Uvijek koristi ISTI poziv za oba emaila (owner + kupac) paralelno u istom koraku.
---

# Order Email Notifications — Zlo i Naopako 🕯️

Ovaj skill automatski šalje **dva emaila** kad neko kupi svjećicu:
1. **Email kupcu** — potvrda narudžbe s detaljima
2. **Email owneru** — notifikacija da je stigla nova narudžba

## Konfiguracija projekta

- **Supabase project_id**: `ijigcmkemfnieqqhjcup`
- **Owner email**: dohvati iz `settings` tablice (`key = 'owner_email'`), ili koristi `bvujasinovic76@gmail.com` kao fallback
- **From adresa**: `noreply@zloinaopako.com` (Resend, domena zloinaopako.com)

## Tablice u Supabase bazi

```
orders           → narudžbe (customer_name, customer_email, order_number, total, status...)
order_items      → stavke narudžbe (quantity, price, product_snapshot)
email_logs       → log svakog poslatog emaila
settings         → podešavanja aplikacije (key/value)
```

## Korak po korak

### 1. Dohvati podatke o narudžbi iz Supabase

Koristi `mcp_supabase-mcp-server_execute_sql` da dobiješ sve detalje:

```sql
-- Dohvati narudžbu i njene stavke
SELECT 
  o.id,
  o.order_number,
  o.customer_name,
  o.customer_email,
  o.customer_phone,
  o.shipping_address,
  o.status,
  o.payment_method,
  o.subtotal,
  o.shipping_cost,
  o.discount_amount,
  o.total,
  o.notes,
  o.gift_message,
  o.created_at,
  json_agg(
    json_build_object(
      'name', COALESCE(oi.product_snapshot->>'name', p.name),
      'quantity', oi.quantity,
      'price', oi.price,
      'total', oi.quantity * oi.price
    )
  ) AS items
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
LEFT JOIN products p ON p.id = oi.product_id
WHERE o.id = '<ORDER_ID>'   -- ili o.order_number = '<ORDER_NUMBER>'
GROUP BY o.id;
```

### 2. Dohvati owner email iz settings

```sql
SELECT value FROM settings WHERE key = 'owner_email';
```

Ako ne postoji u settings, usar `bvujasinovic76@gmail.com`.

### 3. Pošalji oba emaila PARALELNO

Pozovi `mcp_resend_send_email` **dva puta u istom tool bloku** (paralelno) — jednom za kupca, jednom za ownera.

#### 📧 Email kupcu (potvrda narudžbe)

```
subject: "✅ Potvrda narudžbe #<ORDER_NUMBER> – Zlo i Naopako"
to: <customer_email>
```

HTML template za kupca:
```html
<div style="font-family: 'Outfit', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px 30px; border-radius: 12px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #DC2626; font-size: 28px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">ZLO I NAOPAKO 🕯️</h1>
    <p style="color: #888; margin-top: 8px;">Hvala na narudžbi!</p>
  </div>
  
  <div style="background: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #DC2626;">
    <h2 style="color: #fff; margin: 0 0 10px 0; font-size: 18px;">Narudžba #<ORDER_NUMBER></h2>
    <p style="color: #888; margin: 0;">Datum: <DATUM></p>
  </div>

  <h3 style="color: #DC2626; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Naručeni proizvodi:</h3>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <thead>
      <tr style="border-bottom: 1px solid #333;">
        <th style="text-align: left; color: #888; padding: 8px 0; font-size: 13px;">Proizvod</th>
        <th style="text-align: center; color: #888; padding: 8px 0; font-size: 13px;">Kom.</th>
        <th style="text-align: right; color: #888; padding: 8px 0; font-size: 13px;">Cijena</th>
      </tr>
    </thead>
    <tbody>
      <!-- RED PO PROIZVOD: -->
      <tr style="border-bottom: 1px solid #1f1f1f;">
        <td style="padding: 12px 0; color: #fff; font-size: 15px;"><IME_PROIZVODA></td>
        <td style="padding: 12px 0; color: #aaa; text-align: center;"><KOLIČINA></td>
        <td style="padding: 12px 0; color: #fff; text-align: right;"><CIJENA> KM</td>
      </tr>
    </tbody>
  </table>

  <div style="border-top: 1px solid #333; padding-top: 15px; margin-bottom: 25px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
      <span style="color: #888;">Međuzbroj:</span>
      <span style="color: #fff;"><SUBTOTAL> KM</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
      <span style="color: #888;">Dostava:</span>
      <span style="color: #fff;"><SHIPPING> KM</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #333;">
      <span style="color: #DC2626; font-size: 18px; font-weight: bold;">UKUPNO:</span>
      <span style="color: #DC2626; font-size: 18px; font-weight: bold;"><TOTAL> KM</span>
    </div>
  </div>

  <div style="background: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
    <h3 style="color: #DC2626; margin: 0 0 12px 0; font-size: 15px; text-transform: uppercase;">Adresa isporuke:</h3>
    <p style="color: #ddd; margin: 0; line-height: 1.6;"><ADRESA_ISPORUKE></p>
  </div>

  <div style="text-align: center; padding: 20px; background: #1a1a1a; border-radius: 8px;">
    <p style="color: #888; margin: 0; font-size: 14px;">Vaša narudžba će biti isporučena u roku od <b style="color: #fff;">2-5 radnih dana</b>.</p>
    <p style="color: #888; margin: 8px 0 0 0; font-size: 13px;">Pitanja? Pišite nam na Instagram ili email.</p>
  </div>
  
  <div style="text-align: center; margin-top: 30px;">
    <p style="color: #555; font-size: 12px;">© 2025 Zlo i Naopako • Ručno rađene svjećice 🕯️</p>
  </div>
</div>
```

#### 📧 Email owneru (notifikacija nove narudžbe)

```
subject: "🔔 Nova narudžba #<ORDER_NUMBER> – <CUSTOMER_NAME>"
to: <owner_email>
```

HTML template za ownera (kratak, informativan):
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 12px;">
  <h1 style="color: #DC2626; font-size: 24px; margin: 0 0 20px 0;">🔔 Nova narudžba stigla!</h1>
  
  <div style="background: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <p style="margin: 0 0 8px 0; color: #888; font-size: 13px; text-transform: uppercase;">Narudžba</p>
    <p style="margin: 0; color: #fff; font-size: 20px; font-weight: bold;">#<ORDER_NUMBER></p>
  </div>

  <div style="background: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <h3 style="color: #DC2626; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase;">Kupac:</h3>
    <p style="color: #fff; margin: 0 0 5px 0;"><b><IME_KUPCA></b></p>
    <p style="color: #aaa; margin: 0 0 5px 0;">📧 <EMAIL_KUPCA></p>
    <p style="color: #aaa; margin: 0;">📞 <TELEFON_KUPCA></p>
  </div>

  <div style="background: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <h3 style="color: #DC2626; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase;">Naručeno:</h3>
    <!-- STAVKE NARUDŽBE -->
    <p style="color: #ddd; margin: 4px 0;"><KOLIČINA>x <IME_PROIZVODA> — <CIJENA> KM</p>
  </div>

  <div style="background: #DC2626; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
    <p style="margin: 0; color: #fff; font-size: 13px; text-transform: uppercase;">Ukupno</p>
    <p style="margin: 5px 0 0 0; color: #fff; font-size: 28px; font-weight: bold;"><TOTAL> KM</p>
  </div>

  <div style="background: #1a1a1a; border-radius: 8px; padding: 20px;">
    <h3 style="color: #DC2626; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase;">Adresa isporuke:</h3>
    <p style="color: #ddd; margin: 0; line-height: 1.5;"><ADRESA_ISPORUKE></p>
  </div>
  
  <div style="text-align: center; margin-top: 25px;">
    <p style="color: #555; font-size: 12px;">Zlo i Naopako Admin • <DATUM_NARUDŽBE></p>
  </div>
</div>
```

### 4. Logiraj u email_logs tablicu

Nakon slanja oba emaila, logiraj u Supabase:

```sql
INSERT INTO email_logs (order_id, type, status, resend_id, recipient_email, subject, template)
VALUES 
  ('<ORDER_ID>', 'order_confirmation', 'sent', '<RESEND_ID_KUPCA>', '<CUSTOMER_EMAIL>', 'Potvrda narudžbe #<ORDER_NUMBER>', 'order_confirmation'),
  ('<ORDER_ID>', 'owner_notification', 'sent', '<RESEND_ID_OWNER>', '<OWNER_EMAIL>', 'Nova narudžba #<ORDER_NUMBER>', 'owner_notification');
```

Ako slanje ne uspije, postavi `status = 'failed'` i upiši grešku u `error_message`.

## Formatiranje adrese isporuke

`shipping_address` je JSON objekat. Formatiraj ga ovako:
```
<ulica i broj>
<grad>, <poštanski broj>
<država>
```

## Primjer poziva (kompletan flow)

```
Korisnik: "Pošalji email notifikacije za narudžbu #ZIN-001"

1. execute_sql → dohvati podatke narudžbe i stavki
2. execute_sql → dohvati owner email iz settings
3. PARALELNO:
   - send_email → kupcu (order confirmation)
   - send_email → owneru (new order notification)
4. execute_sql → upiši u email_logs (oba emaila)
5. Javi korisniku: "✅ Emailovi sent! Kupac: jana@email.ba | Owner: bvujasinovic@gmail.com"
```

## Greške i edge-case-ovi

- **Nema email-a kupca**: Javi grešku, ne šalji ništa
- **Resend greška**: Logiraj u `email_logs` sa `status = 'failed'` i `error_message`
- **Prazna narudžba (bez stavki)**: Svejedno pošalji, napiši "stavke nisu dostupne"
- **Već poslan email**: Provjeri `email_logs` — ako postoji zapis za isti `order_id` i `type`, upozori (ali ne blokiraj)
