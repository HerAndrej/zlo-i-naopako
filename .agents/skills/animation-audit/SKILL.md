---
name: animation-audit
description: >
  Skill za pregled i unapređenje animacija na sajtu "Zlo i Naopako".
  Koristi ovaj skill kad god:
  - korisnik hoće da doda nove animacije
  - sekcija izgleda statično i bez života
  - hovers, transitions ili scroll efekti nedostaju
  - korisnik kaže "dodaj animacije", "ozvivi sekciju", "nema pokreta"
  Uvijek pregledaj sve komponente i predloži konkretne animacione poboljšanja.
---

# Animation Audit Skill — Zlo i Naopako

## Stack & Animacioni sistem

- **Framework**: Next.js 14 (App Router), Tailwind CSS
- **Animacioni helper**: `useScrollReveal` hook (`src/hooks/useScrollReveal.ts`)
- **CSS animacije**: definirane u `src/app/globals.css`
- **Src folder**: `c:\Users\User\Desktop\Aplikacije1\zloInaopako\zlo-web\src`

## Postojeće animacije (već implementirane)

### Scroll reveal klase
```
.reveal-hidden          ← početno sakriveno stanje
.reveal-up              ← fade + translateY(60px → 0)
.reveal-left            ← fade + translateX(-60px → 0)
.reveal-right           ← fade + translateX(60px → 0)
.reveal-scale           ← fade + scale(0.85 → 1)
.reveal-rotate          ← fade + perspective rotateY
```

### Stagger delays
```
.stagger-1 … .stagger-8   ← animation-delay od 0.1s do 0.8s
```

### Ambient / loop animacije
```
.animate-float           ← float-gentle (blag float gore-dolje, 6s loop)
.animate-glow-pulse      ← glow-pulse (opacity + scale puls, 4s loop)
.animate-ken-burns       ← ken-burns (zoom efekt za slike, 20s loop)
.animate-shimmer         ← shimmer (refleksija svjetla, 3s loop)
.animate-icon-spin-in    ← spin-in za ikonice (jednom pri pojavi)
.animate-star-pop        ← pop za zvjezdice (jednom pri pojavi)
.animate-counter-reveal  ← blur-fade za brojeve
.animate-line-grow       ← scaleX 0→1 za linije (transform-origin: left)
.animate-fade-in         ← jednostavan fade-in
```

### CSS varijable / keyframes dostupni
Sve ove animacije su definirane u `globals.css` i odmah se mogu koristiti klasama.

---

## Workflow za animacioni audit

1. **Pročitaj sve komponente** u `src/components/sections/` i `src/app/page.tsx`
2. **Identifikuj mjesta bez animacija** — statični elementi koji bi mogli imati kretanje
3. **Provjeri hover efekte** — svaki interaktivni element trebao bi imati hover
4. **Provjeri scroll reveals** — svaki vizuelni block trebao bi imati `useScrollReveal`
5. **Predloži nove keyframes** ako nešto ne može pokrit postojeće klase
6. **Implementiraj minimalne, fokusirane izmjene** — ne dodavati animacije svuda nagrdo

---

## Prijedlozi animacija za "Zlo i Naopako"

### Kategorije animacija koje odgovaraju brutalist food brand stilu

| Tip | Opis | Kada koristiti |
|---|---|---|
| **Magnetic hover** | Elementi se blago pomjeraju prema kursoru | CTA dugmad, kartice |
| **Text scramble** | Slova se "scramblaju" pa se pojavi pravi tekst | Hero H1, section headings |
| **Parallax** | Pozadinski elementi se pomiču sporije od sadržaja | Slike u sekcijama |
| **Particle burst** | Čestice (spark/flame) pri hover/click | "Dodaj u korpu" dugme |
| **Number count-up** | Cijene i brojevi se animiraju (0 → X) | Stats u Founder sekciji |
| **Cursor custom** | Custom kursor (npr. plamen) | Cijela stranica |
| **Noise texture anim** | Suptilna grain/noise animacija na pozadini | Hero, SpecialOffer |
| **Color bleed** | Boja sosa se "razliva" u pozadinu na hover | Sauce selector dugmad |
| **Underline draw** | SVG linija se crta ispod teksta | Nav linkovi, headings |
| **Image reveal clip** | `clip-path` otkriva sliku pri scroll-u | Founder, Journey slike |

---

## Konkretni prijedlozi po sekcijama

### 🔴 Hero
- **Što nedostaje**: Tekst "ZLO I NAOPAKO" nema nikakvu looping animaciju nakon reveala
- **Prijedlog**: Dodati suptilan `letter-spacing` pulse na headline svakih 5s
- **Prijedlog**: Flicker efekt na crvenoj podlini ispod "naopako" (`animate-flicker`)
- **Implementacija**: Novi `@keyframes flicker` u globals.css + klasa `.animate-flicker`

### 🔴 Sauces / Sosevi
- **Što nedostaje**: Prijelaz između soseva nema ambient glow na selektoru
- **Prijedlog**: Flame particles pri hover na "Dodaj u korpu" dugme — CSS-only sparkle
- **Prijedlog**: Heat indicator vatreni ikonice koji se animiraju jedan po jedan s kasnjenjem (već radi, ali bez pulse efekta na aktivnim)
- **Implementacija**: Dodati `animate-flame-pulse` na aktivne `LucideFlame` ikonice

### 🔴 Journey / Naš Put
- **Što nedostaje**: Godina broj (2021, 2022...) u pozadini je statičan watermark
- **Prijedlog**: `translateY` drift na watermark broju dok je sekcija aktivna (spora parallax)
- **Implementacija**: inline style `transform: translateY(scrollProgress * offset)` u `JourneyItem`

### 🔴 Founder
- **Što nedostaje**: Stats kartice (10+, 3, ∞) se pojave bez animacije
- **Prijedlog**: Count-up animacija za "10+" i "3" kad sekcija postane vidljiva
- **Implementacija**: Custom `useCountUp` hook + primjena na `stat.value`

### 🔴 Testimonials
- **Što nedostaje**: Quote tekst je statičan unutar kartice
- **Prijedlog**: Suptilno `typewriter` reveal za quote tekst kad kartica postane vidljiva
- **Prijedlog**: Auto-scroll carousel (pause on hover) umjesto samo swipe-a
- **Implementacija**: CSS-only typewriter (steps()) ili JS interval

### 🔴 Contact
- **Što nedostaje**: Kontakt stavke (email, telefon, instagram) imaju reveal ali ne looping efekt
- **Prijedlog**: Na hover — ikonica se rotira 360° (spin)
- **Implementacija**: `group-hover:rotate-[360deg] transition-transform duration-700` na ikoni

### 🔴 Navbar
- **Što nedostaje**: "Kupi Odmah" dugme nema pažnju-privlačeći efekt pri scrollu
- **Prijedlog**: Blagi `pulse-border` animacija na CTA dugmetu u navbaru (prstenovi koji se šire)
- **Implementacija**: `@keyframes ping-border` + `.animate-ping-border`

---

## Prioriteti implementacije

| Prioritet | Animacija | Fajl | Složenost |
|---|---|---|---|
| 🔴 High | Flame pulse na heat ikonicama | `Sauces.tsx` | Nizak |
| 🔴 High | Icon spin na hover (Contact) | `Contact.tsx` | Nizak |
| 🟡 Medium | Count-up za stats | `Founder.tsx` | Srednji (`useCountUp` hook) |
| 🟡 Medium | Flicker na hero liniji | `Hero.tsx` + `globals.css` | Nizak |
| 🟡 Medium | Ping-border na nav CTA | `page.tsx` + `globals.css` | Nizak |
| 🟢 Low | Typewriter za quote | `Testimonials.tsx` | Srednji |
| 🟢 Low | Parallax na Journey watermark | `Journey.tsx` | Srednji |
| 🟢 Low | Custom cursor (plamen) | `page.tsx` + `globals.css` | Visok |

---

## Implementacioni workflow

1. **Čitaj fajl** koji treba animirati
2. **Provjeri globals.css** — postoji li keyframe koji možeš iskoristiti?
3. **Ako ne postoji** — dodaj novi `@keyframes` u `globals.css` pod `@layer base`
4. **Dodaj utility klasu** u `@layer utilities`
5. **Primijeni u komponenti** — minimalna izmjena, samo zahvaćeni elementi
6. **Objasni korisniku** šta je dodano i kako se animacija ponaša

---

## Primjeri brzih implementacija

### Contact icon spin na hover
```tsx
// Prije
<Icon size={20} />

// Poslije
<Icon size={20} className="transition-transform duration-700 group-hover:rotate-[360deg]" />
```

### Flame pulse na aktivnim heat ikonicama
```tsx
// Dodaj klasu na aktivne ikonice
className={`transition-all duration-300 ${i < sauce.heat ? "scale-100 animate-flame-pulse" : "text-gray-800 scale-90"}`}
```

```css
/* globals.css — novi keyframe */
@keyframes flame-pulse {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.15) rotate(5deg); }
}
.animate-flame-pulse {
  animation: flame-pulse 1.5s ease-in-out infinite;
}
```

### Ping border na nav CTA
```css
@keyframes ping-border {
  0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.6); }
  70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
  100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
}
.animate-ping-border {
  animation: ping-border 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```
