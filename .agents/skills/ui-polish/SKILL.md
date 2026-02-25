---
name: ui-polish
description: >
  Skill za poboljšanje UI-ja aplikacije "Zlo i Naopako". Koristi ovaj skill kad god:
  - tekst izgleda previše krupno ili previše sitno
  - spacing/padding između elemenata nije uravnotežen
  - nešto ne izgleda dobro na mobilnoj verziji (responsive problemi)
  - font weight, veličina headinga, ili line-height treba da se prilagodi
  - dizajn izgleda "čorokato" ili neravnomjerno
  - korisnik kaže "slova su prevelika", "ne staje na mobilnom", "ne izgleda lijepo", "uglavi to"
  Koristi UVIJEK kada korisnik pomene da nešto vizuelno ne izgleda dobro ili ne staje.
---

# UI Polish Skill — Zlo i Naopako

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Font**: Outfit (Google Fonts, varijable: `--font-outfit`)
- **Boje**: `primary` = crvena (`#DC2626`), pozadina = crna (`#000`)
- **Src folder**: `c:\Users\User\Desktop\Aplikacije1\zloInaopako\zlo-web\src`

## Principi dizajna aplikacije

Ova aplikacija je **bold, brutalist food brand** — ali "bold" ne znači ogromna slova svuda. Postoji hijerarhija:

1. **Hero heading** (`ZLO I NAOPAKO`) → smije biti velik, to je brand statement
2. **Section headings** → umjereno velik, uočljiv ali ne prenatrpan
3. **Body text, labele, dugmad** → čitljivo, kompaktno, ne predimenzionisano

## Tipografija — smjernice

### Headings

```
H1 (Hero):     text-5xl md:text-7xl lg:text-8xl   (ne ići iznad 8xl)
H2 (Section):  text-3xl md:text-4xl lg:text-5xl
H3:            text-2xl md:text-3xl
```

### Body / UI

```
Body tekst:    text-sm md:text-base   (14–16px)
Labele:        text-xs md:text-sm
Dugmad:        text-sm font-bold
Nav linkovi:   text-sm font-medium
```

### Česte greške koje treba popraviti

- `text-6xl` ili više za section headings → smanji na `text-4xl md:text-5xl`
- `text-lg` za body tekst → smanji na `text-base` ili `text-sm`
- `text-4xl` na mobilnom bez `md:` breakpointa → dodaj responsive

## Spacing — smjernice

```
Section padding:  py-16 md:py-24     (ne ići ispod 12 ili iznad 32)
Card padding:     p-4 md:p-6
Gap između elemenata: gap-4 md:gap-8
Margin između sekcija: mb-8 md:mb-16
```

## Mobilna verzija — checklista

Kada popravljaš mobilne probleme, provjeri:

1. Je li tekst čitljiv bez zoomiranja? (`text-sm` minimum)
2. Ima li dovoljno padding-a sa strana? (`px-4` minimum)
3. Da li dugmad stanu sa svim tekstom? (`py-2 px-4` minimum)
4. Jesu li slike ispravno skalirane? (`w-full object-contain` ili `object-cover`)
5. Jesu li flex/grid layouti promijenili smjer? (`flex-col md:flex-row`)

## Workflow za svaki fix

1. **Pročitaj fajl** koji treba popraviti
2. **Identifikuj problem** (preveliki tekst, loš spacing, mobile layout)
3. **Primijeni minimalnu promjenu** — mijenjaj samo što je potrebno
4. **Objasni korisniku** šta si promijenio i zašto (kratko, jasno)

## Fajlovi aplikacije

```
src/app/page.tsx              ← Navbar + root layout
src/components/sections/
  Hero.tsx                    ← Glavni hero
  Sauces.tsx                  ← Prikaz soseva
  Story.tsx                   ← O nama sekcija
  Contact.tsx                 ← Kontakt forma
  Journey.tsx                 ← Proces/journey
  Founder.tsx                 ← Founder sekcija
  Testimonials.tsx            ← Recenzije
src/components/ui/
  CheckoutModal.tsx           ← Košarica modal
```

## Primjer ispravke

**Problem:** "Slova su prevelika na mobilnom u sekciji Sosevi"

Pronađi heading u `Sauces.tsx`:
```tsx
// Prije (loše)
<h2 className="text-6xl font-black uppercase">Naši sosevi</h2>

// Poslije (dobro)
<h2 className="text-3xl md:text-5xl font-black uppercase">Naši sosevi</h2>
```

Uvijek koristiti responsive prefix (`md:`, `lg:`) umjesto jedne fiksne vrijednosti.
