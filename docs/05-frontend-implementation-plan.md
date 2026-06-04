# 05 · Frontend-Implementierungsplan

> Priorisierter Umsetzungsplan auf Basis des technischen Inventars
> (`docs/audits/seo-conversion-audit.md`) und der Strategie aus
> `docs/02-positioning-conversion.md` & `docs/03-seo-content-architecture.md`.
>
> **Dieses Dokument ist nur ein Plan. Es enthält keine Code-Änderungen.**
> Reihenfolge = Priorität. Phase 1 sind echte Launch-Blocker.

Stand: 2026-06 · Website live unter `smairys.de`.

---

## Phase 0 · Klärungen vor Code (Decisions)

Diese Punkte blockieren saubere Umsetzung und sollten zuerst entschieden werden:

1. **Lead-Delivery (Formcarry):** ✅ entschieden & umgesetzt (Option A,
   server-seitige Weiterleitung über `/api/contact`). Details in Phase 1.3.
2. **Pakete:** finale Namen/Preise (Entry ~1.200 € · Mitte ~2.600–2.800 € ·
   Premium ~3.600 €) und Ort (`/preise` vs. Sektion).
3. **Sanity:** aktiv anbinden oder Schemas entfernen.
4. **Booking-Link:** Google-Calendar-URL final + überall identisch.

---

## Phase 1 · Critical Fixes (Launch-Blocker)

### 1.1 CTA-Navigation reparieren ✅ UMGESETZT
- **Ausgangsproblem:** Primäre CTAs (Hero, Header, Service-Cards) waren reine
  `<button>` ohne Navigation – Klicks wurden getrackt, führten aber ins Leere.
- **Lösung:**
  - `src/components/ui/TrackedButton.tsx` unterstützt jetzt `href` + `external`.
    Mit `href` rendert die Komponente einen navigierbaren Link (Next `<Link>`
    für interne Routen, natives `<a>` für Hash/`mailto:`/`tel:`, externe URLs
    mit `target="_blank" rel="noopener noreferrer"`) – das identische
    `cta_click`-Event (`dispatchEvent`) bleibt erhalten. `Button.tsx` reicht
    `href`/`external` unverändert durch (Styling identisch).
  - Buchungs-URL zentralisiert in `src/config/site.ts`
    (`SITE.booking.calendarUrl` + `getPrimaryBookingTarget()`); `BookingCard`
    nutzt jetzt diese Quelle. Fällt `booking.enabled` auf `false`, fallen
    primäre CTAs automatisch auf den Kontakt-Anker `/#kontakt` zurück.
- **Primäre Conversion = Erstgespräch buchen.** Kanonischer Buchungslink
  zentral in `SITE.booking.calendarUrl`
  (`https://calendar.app.google/PAdzgiQrN6h5RmqY8`). Alle prominenten
  Brand-CTAs ziehen über `getPrimaryBookingTarget()` zentral nach; bei
  `booking.enabled = false` fallen sie automatisch auf `/#kontakt` zurück.
- **Verdrahtete Ziele (aktualisiert):**
  | CTA | Ziel |
  |-----|------|
  | Header „Kontakt aufnehmen" | Booking (extern, neuer Tab) / `/#kontakt`-Fallback |
  | Hero primär „Projektanfrage starten" | Booking (extern) |
  | Hero sekundär „Unsere Expertise" | `/leistungen` |
  | Services „Webentwicklung anfragen" | `/leistungen/webseiten` |
  | Services „SEO-Audit anfordern" | `/leistungen/seo` |
  | Services „Kampagne planen" | `/leistungen/google-ads` |
  | Webseiten-Hero „Projektanfrage starten" | Booking (extern) |
  | SEO-Hero „SEO-Audit anfordern" | Booking (extern) |
  | SEO „Reporting-Ansatz ansehen" | `#anfrage` (Form-Sektion derselben Seite) |
  | MobileNav „Erstgespräch buchen" | Booking (extern) |
  | MobileNav Telefon / „Anfrage schreiben" | `tel:` / `mailto:` |
  | BookingCard (`/leistungen`) | `SITE.booking.calendarUrl` (extern) |
- **Stabile Anker:** Kontakt-Sektion Startseite `#kontakt`
  (`ContactFormSection`, Default-`id`); Service-Detailseiten haben eine eigene
  Form-Sektion `#anfrage`. Keine toten Anker. Toter Anker `/#testimonials`
  auf `/leistungen` (Komponente `TestimonialsSection` wird nicht gerendert) →
  auf `/projekte` umgebogen. `/leistungen`-Service-Kacheln und „Erstgespräch
  anfragen" zeigen weiterhin auf `/#kontakt` (gültig, neben der BookingCard als
  Form-Alternative).
- **Externe Booking-Links:** `target="_blank"` + `rel="noopener noreferrer"`.
- **Beibehalten:** `cta_click`-Tracking auf allen Button-CTAs; `CTA Click`/
  `Contact Intent` via `TrackedLink` (Footer, ContactInfoCard, MobileNav inkl.
  neuem Booking-Intent); Analytics-Exclusion interner Routen intakt;
  Header-„Kundenlogin"-Pille → `/kundenlogin`.
- **CEO-Portrait:** `public/ceo-pictures/robin_smairys_portrait.webp` (WebP,
  optimiert) ersetzt die Platzhalter in `TrustSection` (Startseite) und
  `ueber-uns` via `next/image` (`fill` + `object-cover object-top`, Alt-Text).
  `ceo-portrait-linked-in.jpg` (768×1024) bleibt für Social/OG/LinkedIn.
- **Offen (echter Wert):** finale Buchungs-URL nur in
  `SITE.booking.calendarUrl` pflegen. Tote Komponenten (`PrestigeCTA`,
  `BentoGridSection`, `components/CtaSection.tsx`, `sections/CtaSection.tsx`,
  Legacy `Header.tsx`) werden nirgends gerendert → bewusst nicht angefasst.

### 1.2 Kaputte / fehlende Assets
- **Problem (Inventar):** mehrere referenzierte Dateien fehlen oder haben
  falsche Namen.
  - Logo-Referenzen in `src/components/brand/Brandmark.tsx`,
    `src/config/clients.ts`, Legacy-Header/Footer.
  - Umlaut-/Casing-Mismatch in `src/lib/testimonialsData.ts`
    (z. B. `eppelstyle-weiß.png` vs. tatsächliche Dateien).
  - 3D-Modell `/models/logo.final.glb` (`src/components/ui/ThreeLogo.tsx`) –
    Existenz prüfen.
  - OG-Bild `src/app/opengraph-image.png` – fehlt.
- **Akzeptanz:** keine 404 auf Assets; Logos/Testimonials/OG laden korrekt.

### 1.3 Lead-Delivery / Formcarry ✅ UMGESETZT
- **Ausgangslage:** Es existierten **zwei parallele** Flows – das aktive
  `ContactFormBase.tsx` → `/api/contact` (loggte den Lead nur via
  `console.info`, **kein** Versand) und ein **verwaistes**
  `src/components/contact/ContactForm.tsx`, das clientseitig direkt an Formcarry
  postete, aber nirgends eingebunden war.
- **Lösung (Option A – server-seitige Weiterleitung):**
  - `src/app/api/contact/route.ts` leitet den **validierten** Lead nach
    Zod-Check + Rate-Limit serverseitig an Formcarry weiter
    (`forwardToFormcarry`). Payload = JSON mit allen Formularfeldern,
    Attribution (flach + voll) und Nicht-PII-Metadaten (Page-Path, Referer,
    User-Agent, Timestamp).
  - Endpoint kommt aus **server-only** `FORMCARRY_ENDPOINT` (kein
    `NEXT_PUBLIC_`). Fehlt die Variable → sicherer 502-Client-Fehler + klares
    Server-Log, **kein** stiller Erfolg.
  - Formcarry-Fehler → generische Client-Fehlermeldung + **redacted**
    Server-Log (nur HTTP-Status/Reason, **nie** Body/PII). Erfolg → bisherige
    `{ message: 'Erfolgreich gesendet' }` (200).
  - Der `console.info`-Lead-Block (ohne PII) bleibt als zweiter Nachweis im
    Vercel-Log erhalten.
  - Das verwaiste `src/components/contact/ContactForm.tsx` wurde **entfernt**
    (kein clientseitiger Direkt-Post mehr; einziger Pfad ist jetzt
    `/api/contact`).
- **Beibehalten:** Zod-Validierung, Rate-Limit, `getLeadAttribution`-Daten,
  Tracking-Events (`form_start` / `form_submit_success` / `form_submit_error`),
  Loading-/Success-/Error-States im Formular.
- **Env:** `FORMCARRY_ENDPOINT=https://formcarry.com/s/JOH5HI9XWVI` (in
  `.env.example` dokumentiert; in Vercel + lokaler `.env` setzen).
- **Offen (manuell):** echter End-to-End-Testlead, um die Zustellung im
  Formcarry-Dashboard zu bestätigen (siehe `docs/06-qa-checklist.md`).

### 1.4 Lint & Build grün bekommen
- **Problem:** `npm run lint` schlägt fehl (deprecated `next lint`,
  `no-unescaped-entities`, `no-explicit-any`, `no-empty-object-type`).
- **Aktion:** auf ESLint-CLI migrieren; Fehler beheben; `npm run build`
  (TS-Errors blocken laut `AGENTS.md`) muss durchlaufen.
- **Akzeptanz:** `npm run build` ohne Fehler; `npm run lint` ohne Errors.

---

## Phase 2 · Design-System & Homepage-Conversion

- **Hero neu ausrichten** (`src/components/sections/Hero.tsx`): Website-Fokus +
  Lokalbezug Saarland/Saarbrücken in H1; Rang-1-CTAs (Booking + Telefon)
  above-the-fold; Sticky-Mobile-CTA-Bar.
- **„Auf einen Blick"-Block** (semantische `<dl>`) direkt nach Hero – Wer/Was/
  Für wen/Wie (siehe `docs/03` 8 & Audit 8.2).
- **ServicesSection** (`src/components/sections/ServicesSection.tsx`): Website
  visuell führend; SEO/Ads als Add-on-Zeile statt gleichrangig.
- **Mobile-Navigation** (`src/components/layout/Header.tsx`,
  `MobileNav.tsx`): alle Hauptlinks + Industrie-Seiten + Telefon/Booking
  sichtbar.
- **Design-Konsistenz** gemäß `docs/04-ui-design-system.md` (Brand-Amber sparsam,
  Motion-Reduktion respektieren).
- **`/leistungen` aufräumen** (`src/app/leistungen/page.tsx`): auf aktuelle
  Design-System-Komponenten umstellen; Legacy/ungenutztes entfernen.

---

## Phase 3 · Pricing-Sektion

- Drei sichtbare Pakete (Goldilocks) gemäß `docs/02` Abschnitt 7.
- Mittleres Paket optisch hervorgehoben („Empfohlen"-Badge, Brand-Amber).
- Preise als Richtwerte; Add-ons (SEO/Ads/Wartung) als Erweiterungen.
- CTA pro Paket → Erstgespräch buchen (nicht „kaufen").
- Ort: neue `src/components/sections/PricingSection.tsx`, eingebunden auf `/`
  und/oder `/leistungen/webseiten` (oder eigene `/preise`-Route – Phase 0).

---

## Phase 4 · Industrie-Sektionen / Landingpages

- Drei Landingpages: `/branchen/handwerk`, `/branchen/immobilien`,
  `/branchen/gastronomie` (Aufbau-Konvention in `docs/03` Abschnitt 5).
- Pro Seite: lokaler Hero, Branchennutzen, Referenz (falls vorhanden),
  Paket-Verweis, Branchen-FAQ, Abschluss-CTA.
- Wiederverwendung bestehender Sektions-Komponenten + `ContactFormSection`.
- Header/Footer/Sitemap um die neuen Routen ergänzen.
- Veröffentlichung nur mit echtem Content + möglichst einer Referenz.

---

## Phase 5 · SEO & strukturierte Daten

- **JSON-LD** zentral aufbauen (`src/lib/seo/schema.ts` + Server-`<JsonLd>`):
  `ProfessionalService`/`LocalBusiness` global, `Service` je Money-/Branchen-
  Seite, `BreadcrumbList`, `FAQPage`, `CreativeWork` für Case Studies
  (Details `docs/03` Abschnitt 8.4). Keine erfundenen Ratings/Zahlen.
- **Metadata/Canonical** pro Money-Page (Title/Description/Canonical) gemäß
  `docs/03` Abschnitt 8.
- **Lokal-Keywords** in Titles/H1 ohne Stuffing.
- **`not-found.tsx`** branded ergänzen (`src/components/states/NotFoundState.tsx`
  existiert bereits) mit Links zu Money-Pages.
- **Sitemap/robots** um neue Routen aktualisieren.

---

## Phase 6 · QA & Launch-Vorbereitung

- `docs/06-qa-checklist.md` vollständig durchlaufen (Login, Intern, Plausible-
  Exclusion, QR-Flows).
- **Lead-Test:** Testanfrage über das aktive Formular → Mail kommt an +
  Attribution korrekt.
- **Conversion-Pfade:** Booking-Link, `tel:`-Link, Formular auf Mobile/Desktop.
- **Performance:** Case-Study-PNGs → WebP/AVIF; `next/image` prüfen;
  Bundle von `/leistungen` nach Refactor beobachten.
- **Analytics:** `cta_click`, `Contact Intent`, `form_submit_success` feuern;
  Plausible-Goals konfigurieren; **keine** Events auf `/intern/*`,
  `/kundenlogin` (vgl. `AGENTS.md`).
- **ENV-Review:** `ADMIN_DASHBOARD_PIN`, `NEXT_PUBLIC_SITE_URL`, neuer
  Mail-/Formcarry-Key gesetzt.
- **Cross-Browser/Device** inkl. neuer Mobile-Nav & Pricing-Sektion.

---

## Referenz: Phasen-Überblick

| Phase | Fokus | Blocker? |
|-------|-------|----------|
| 0 | Entscheidungen (Form-Flow, Pakete, Sanity, Booking) | ja |
| 1 | CTA-Nav, Assets, Lead-Delivery, Lint/Build | ja |
| 2 | Design-System & Homepage-Conversion | nein |
| 3 | Pricing-Sektion | nein |
| 4 | Industrie-Landingpages | nein |
| 5 | SEO / strukturierte Daten | nein |
| 6 | QA & Launch | Gate |
