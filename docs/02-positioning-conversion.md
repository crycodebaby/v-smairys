# 02 · Positionierung & Conversion-Strategie

> Strategie-Grundlage für alle Frontend- und Content-Entscheidungen. Wenn ein
> Element der Website dieser Datei widerspricht, gewinnt diese Datei – bis sie
> bewusst aktualisiert wird. Bezieht sich auf das technische Inventar in
> `docs/audits/seo-conversion-audit.md`.

Stand: 2026-06 · Status: aktive Strategie · Website ist live unter `smairys.de`.

---

## 1. Kernaussage in einem Satz

Smairys baut **hochwertige, individuelle Unternehmenswebsites** für Betriebe im
Saarland, die online ernst genommen werden wollen und ihre Website als
Vertriebs- und Vertrauens-Asset nutzen – nicht als digitale Visitenkarte von der
Stange.

**Wichtiger Strategiewechsel:** Das primäre Angebot ist **Webdesign /
Website-Erstellung**. SEO und Google Ads sind **sekundäre Add-ons**, kein
Einstiegsversprechen mehr. Die Homepage und der SEO-Fokus führen ab jetzt mit
Website-Erstellung.

---

## 2. Brand-Positionierung

- **Tonalität:** brutalist, luxuriös, premium. Klare Kanten, viel Raum,
  starke Typografie, ruhige Flächen.
- **Farbwelt:** True Black / Off-White als Basis, zurückhaltender
  Kupfer-/Amber-Akzent (Brand-Token `--brand`, ~`#d47115`, definiert in
  `src/app/globals.css`). Inspiriert von der Visitenkarte. Akzent bewusst
  sparsam – niemals flächig orange.
- **Haltung:** Handwerk statt Fließband, Substanz statt Show. Keine
  Agenturfloskeln, kein Verkaufsdruck.
- **Abgrenzung:** Wir sind **nicht der billigste Anbieter** und kommunizieren
  das offen (siehe Abschnitt 7). Wir konkurrieren über Qualität, Vertrauen und
  Substanz – nicht über Preis.
- **Konsistenz mit Design-System:** siehe `docs/04-ui-design-system.md`
  (Glass-Primitive, Brand-Tokens, Motion-Reduktion).

---

## 3. Zielkunden-Segmente

Drei priorisierte Verticals, regional fokussiert auf **Saarland / Saarbrücken**:

| # | Segment | Typischer Kunde | Website-Kernnutzen |
|---|---------|-----------------|--------------------|
| 1 | **Handwerk / Trades** | Meisterbetriebe, Bau, Sanierung, Elektro, SHK | Seriöser Auftritt, Anfragen statt Telefonbuch, Fachkräfte-Gewinnung |
| 2 | **Immobilien / Hausverwaltung** | Makler, Verwaltungen, Bauträger | Vertrauen, Objektdarstellung, qualifizierte Kontaktanfragen |
| 3 | **Gastronomie** | Restaurants, Cafés, Eventgastronomie | Repräsentation, Reservierungen/Buchungen, Marken-Wahrnehmung |

**Gemeinsamer Nenner:** lokale, inhabergeführte Betriebe mit Qualitätsanspruch,
die ihren Online-Auftritt als Investition (nicht als Kostenstelle) sehen.

**Bewusst nicht Zielgruppe:** Preisjäger, Baukasten-Selbermacher, Startups mit
Funding-Optik, überregionale SaaS-Kunden.

---

## 4. Conversion-Ziele

### 4.1 Primär (harte Conversion)

**Erstgespräch buchen** – über zwei gleichwertige Wege:

1. **Google-Calendar-Buchung** (kanonischer Booking-Link, **zentral** in
   `src/config/site.ts` → `SITE.booking.calendarUrl` =
   `https://calendar.app.google/PAdzgiQrN6h5RmqY8`). Alle Primär-CTAs ziehen
   über `getPrimaryBookingTarget()` zentral nach; öffnet in neuem Tab.
2. **Telefonanruf** (`tel:`-Link aus `SITE.phone.tel`).

### 4.2 Sekundär (weiche Conversion)

**Kontaktformular** – für Interessenten, die (noch) nicht telefonieren oder
buchen wollen. Das Formular ist eine Auffangstufe, nicht der Haupt-CTA.

> Hinweis zur Formular-Infrastruktur siehe Abschnitt 9.

### 4.3 Micro-Conversions (Tracking, kein UX-Hauptziel)

- `CTA Click` (Hero, Pakete, Industrie-Sektionen)
- `Contact Intent` (`phone` / `email` / `booking`)
- `form_start`, `form_submit_success`

Event-Taxonomie unverändert aus `docs/01-marketing-dashboard.md` /
`README_TRACKING.md`.

---

## 5. CTA-Hierarchie

Pro Seite gilt eine klare Rangfolge. Es darf nie unklar sein, was der nächste
Schritt ist.

| Rang | CTA | Beispiel-Label | Ziel |
|------|-----|----------------|------|
| 1 | **Erstgespräch buchen** | „Kontakt aufnehmen", „Projektanfrage starten" | `SITE.booking.calendarUrl` (neuer Tab) |
| 1 | **Anrufen** | „Direkt anrufen" | `tel:`-Link |
| 2 | **Projektanfrage senden** | „Reporting-Ansatz ansehen" | Kontaktformular-Anker (`#kontakt` / `#anfrage`) |
| 3 | **Pakete ansehen / Referenzen** | „Unsere Expertise", „Projekte ansehen" | Navigation/Anker |

> Umsetzungsstand der Verdrahtung: siehe `docs/05-frontend-implementation-plan.md`
> Phase 1.1. Prominente Brand-Primär-CTAs (Header, Hero, Service-Hero,
> MobileNav) routen auf den zentralen Booking-Link; weiche/sekundäre CTAs auf
> den Kontaktformular-Anker.

Regeln:
- Auf **jeder** Money-Seite müssen Rang-1-CTAs above-the-fold erreichbar sein
  (Hero + Sticky-Mobile-Bar).
- Telefon und Booking stehen visuell gleichwertig nebeneinander.
- Das Formular ist nie der einzige Conversion-Pfad einer Seite.
- **Keine CTA-Dichte:** nicht zwei gleichwertige Kalender-Module im selben
  Viewport; BookingCard ist das Premium-Beratungsmodul, der Abschluss-CTA bleibt
  visuell leichter.

### `/leistungen` (Übersicht)

| Ebene | Komponente | Label (Beispiel) | Ziel |
|-------|------------|------------------|------|
| Global | Header / MobileNav | Erstgespräch buchen | `SITE.booking.calendarUrl` |
| Zentral (1×) | `BookingCard` | Termin im Kalender reservieren | Booking (extern) |
| Abschluss | `LeistungenFinalCta` | Erstgespräch buchen · Ergebnisse ansehen | Booking · `/projekte` |
| Service-Kacheln | `ServiceSection` | kontextabhängig | `/#kontakt` (Formular) |
- **Bekanntes Problem (siehe Inventar):** Hero-/Service-CTAs sind aktuell reine
  `<button>`-Elemente ohne Navigation
  (`src/components/sections/Hero.tsx`, `src/components/ui/Button.tsx`). Fix ist
  in `docs/05-frontend-implementation-plan.md` als Critical priorisiert.

---

## 6. Homepage-Message-Hierarchie

**Umsetzungsstand:** Copy zentral in `src/content/homepage.ts`. Reihenfolge in
`src/app/page.tsx`. Führt mit Premium-Website-Erstellung; SEO/Ads nur als
unterstützende Mechanismen in der Methode-Sektion.

| # | Sektion | Komponente | Kernbotschaft |
|---|---------|------------|---------------|
| 1 | Hero | `Hero.tsx` | Digitale Vertriebsmaschinen · Saarland · Primär-CTA Projektanalyse |
| 2 | Social Proof | `SocialProofSection` | Kundenlogos (bestehend) |
| 3 | Qualifizierung | `FilterSection.tsx` | Anti-Cheap, ruhig, kein Massenmarkt |
| 4 | Branchenfokus | `IndustriesSection.tsx` | Immobilien (Priorität), Handwerk, Gastronomie |
| 5 | Methode | `MethodSection.tsx` | Strategie · Design · Sichtbarkeit; Service-CTAs → Booking |
| 6 | Trust / Robin | `TrustSection.tsx` | Transparenz, Portrait, Trust-Stats |
| 7 | Prozess | `ProcessSection.tsx` | Analyse → Optimierung (4 Schritte) |
| 8 | Preise | `PricingSection.tsx` | Goldilocks-Pakete (`#preise`) |
| 9 | Abschluss | `ContactFormSection.tsx` | Final-CTA + BookingCard-Rahmen + Formular |

**Homepage-CTA-Labels** (`HOMEPAGE_CTA`):

| Kontext | Label | Ziel |
|---------|-------|------|
| Hero primär | Kostenfreie Projektanalyse anfordern | `getPrimaryBookingTarget()` |
| Hero sekundär | Leistungen ansehen | `/leistungen` |
| Header / MobileNav | Erstgespräch buchen | Booking |
| Methode (Web/SEO/Ads) | Website-Potenzial prüfen · Lokale Marktchancen prüfen · Werbe-ROI bewerten | Booking |
| Pakete (`#preise`) | Einstieg prüfen · Projektanalyse anfordern · Manufaktur-Projekt besprechen | Booking (`pricing-*`) |
| Abschluss primär | Kostenfreie Projektanalyse anfordern | Booking |
| BookingCard (Rahmen) | Termin im Kalender reservieren | Booking (Button nur ohne `hideButton`) |
| Formular | Kontaktformular | `/api/contact` → Formcarry |

**Preise auf der Startseite:** `HOMEPAGE_PRICING` in `src/content/homepage.ts`,
Sektion `#preise` nach Prozess, vor Abschluss-CTA.

**Bewusst nicht geändert:** neue Branchen-Landingpages, `/leistungen`-Redesign,
Booking-URL, Formcarry.

**Offen (später):** AI-/Klartext-Block „Smairys auf einen Blick" (Audit 8.2),
dedizierte Case-Study-Sektion auf der Startseite.

---

## 7. Pricing- / Paket-Framing

Drei **sichtbare** Pakete in Goldilocks-Struktur. Ziel: das mittlere Paket als
„vernünftige" Wahl ankern.

| Paket | Preis (Orientierung) | Rolle | CTA → Booking |
|-------|---------------------|-------|----------------|
| **Digitales Fundament** | 1.299 € | Entry, kompakt aber seriös | `pricing-digitales-fundament` · Einstieg prüfen |
| **Performance-System** | 2.850 € | **Meistgewählt** (Goldilocks) | `pricing-performance-system` · Projektanalyse anfordern |
| **Branchen-Autorität** | 5.600 € | Premium-Anker | `pricing-branchen-autoritaet` · Manufaktur-Projekt besprechen |

Umsetzung: `PricingSection.tsx` · Mittelkarte mit Badge, Brand-Border, stärkerem CTA.
Preishinweis: Orientierung, Scope im Erstgespräch — keine Garantie-Claims.

Framing-Regeln:
- Preise als **ab-Werte** / Richtwerte kommunizieren, nicht als starre Tarife.
- Mittleres Paket optisch betonen, „Empfohlen"-Badge in Brand-Amber.
- Add-ons (SEO, Google Ads, Wartung) als **Erweiterungen** der Pakete listen,
  nicht als eigene Hauptprodukte.
- Kein „ab 0 €"/„kostenlos"-Wording. Einstieg ist bewusst nicht billig.
- Konsistenz mit bestehender Budget-Logik im Formular
  (`src/components/forms/ContactFormBase.tsx`, Budget-Optionen für „Webseiten").

---

## 8. Anti-Cheap-Provider-Positionierung

Offen kommuniziertes Qualitätsversprechen, kein verstecktes Premium.

- Aussage-Linie (bereits angelegt in `src/components/sections/FilterSection.tsx`):
  „Wenn Sie die schnellste und billigste Lösung suchen, sind wir nicht der
  richtige Partner."
- Differenzierer prominent zeigen: handgeschriebener Code statt Baukasten,
  Inhouse im Saarland, kein Outsourcing, Hosting/Pflege inklusive.
- Vergleich „Handwerk vs. Massenware" aus
  `src/app/leistungen/webseiten/page.tsx` auf die Übersicht spiegeln.
- Vertrauenssignale: Inhaber sichtbar (echtes Portrait statt Platzhalter, vgl.
  `src/components/sections/TrustSection.tsx`), DSGVO/Standards, persönliche
  Antwort statt Live-Chat.
- **Keine erfundenen Statistiken.** Unbelegte Zahlen (`~68 %`, `< 1 %`,
  „90 % aller gehackten Sites") entweder mit Quelle versehen oder neutral
  umformulieren (vgl. Audit P1-3).

---

## 9. Trust- & Case-Study-Strategie

Case Studies sind **für die öffentliche Nutzung freigegeben** und sollen die
drei Verticals abdecken, wo möglich.

- Registry: `src/config/case-studies.ts` (aktuell 1 aktive Case Study: Ergart,
  Stahlhandel/Handwerk, Saarland).
- Ziel-Mapping pro Vertical:
  - **Handwerk:** Ergart (vorhanden) – ggf. weitere Handwerks-Referenz.
  - **Immobilien:** noch offen – Case Study oder Referenz ergänzen.
  - **Gastronomie:** noch offen – Case Study oder Referenz ergänzen.
- Darstellung: belegbare Ergebnisse (z. B. Search-Console-Verläufe), keine
  erfundenen Prozentzahlen. Neutral formulieren, wenn keine Zahl belegbar ist.
- Testimonials: Datenquelle `src/lib/testimonialsData.ts` vorhanden
  (Ergart, Eppelstyle, Crncic). Vor Verwendung Asset-Pfade prüfen (siehe
  Inventar – mehrere Logo-Dateien fehlen / Umlaut-Mismatch).
- Trust-Bausteine homepageweit: Kundenlogos (`src/config/clients.ts`),
  Inhaber-Portrait, Standort Saarland, Prozess-Transparenz.
- **Konsistenz-Regel:** Jede öffentliche Zahl muss belegbar oder als
  Einschätzung markiert sein.

---

## 10. Offene strategische Entscheidungen

- Finales Wording/Reihenfolge der drei Pakete (Namen, exakte Preise).
- Welche zweite/dritte Case Study deckt Immobilien & Gastronomie ab?
- Booking-Pfad: bleibt Google Calendar der Standard, oder zusätzlicher
  Telefon-Slot-Hinweis?
- Add-on-Darstellung von SEO/Ads: eigene Unterseiten behalten oder zu
  Add-on-Blöcken zusammenfassen (siehe `docs/03-seo-content-architecture.md`).
