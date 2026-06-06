# SEO, Conversion & KI-Crawler Audit – smairys.de

Stand: 2026-05-21 · Auditor-Rolle: Senior Technical SEO Engineer / Next.js Architect / Conversion Strategist / AI Search Optimization Specialist

> Dieses Dokument ist **ein Audit + Maßnahmenplan**, keine Vollumsetzung. Im selben Commit wurden nur klar abgegrenzte, dokumentierte No-Risk-Fixes vorgenommen (siehe Abschnitt 1.3).
> Schätzungen zu Keyword-Prioritäten sind als „Einschätzung" markiert. Es wurden **keine Suchvolumen**, Rankings oder Click-Through-Raten erfunden.

---

## 1. Executive Summary

### 1.1 Gesamteindruck
- **Brand & UI-System** sind nach der jüngsten Welle (Brand-Token #d47115, Glas-Komponenten, ContactFormSection, Case-Study-Struktur, SocialProof) konsistent und hochwertig.
- **SEO-Substrat ist erst zu ~40 % nutzbar**: `metadataBase`, Title-Template, OG-Defaults, Plausible, robots, sitemap existieren – aber die **Sitemap ist unvollständig**, **JSON-LD fehlt komplett**, **lokale Begriffe fehlen in Titles/H1**, und es gibt **mindestens eine inkonsistente Service-Seite** (`/leistungen`) sowie **eine Placeholder-Seite** (`/leistungen/google-ads`), die ungewollt indexiert werden würden.
- **Conversion-Pfad hat eine harte Lücke**: Die Hero-CTAs auf `/` und mehreren Service-Seiten sind reine `<button>`-Elemente ohne Anker- oder Routing-Verhalten. Ein Klick triggert das Tracking, navigiert aber nicht zum Formular.
- **AI-Crawler-Lesbarkeit** ist mittel: Es gibt sichtbares HTML mit echten Antworten (FAQs in `<details>` auf Webseiten- und SEO-Seite), aber **keine Schema-Markups**, **keine semantisch klar abgegrenzte „Who/What/Where"-Sektion** mit Bezug zum Saarland.
- **Tracking** ist sauber: Plausible cookielos, Internal-Routes exkludiert auf vier Ebenen (`data-exclude`, `trackEvent`-Guard, `dispatchEvent`-Guard, `AttributionCapture`-Guard). Hier ist kein Handlungsbedarf.

### 1.2 Top 5 Risiken (Money-relevant)
1. **Hero-CTA-Bruch** – `Button variant="brand" ...>Projektanfrage starten</Button>` ist ein nackter `<button>` ohne Action. Verlorene Conversions auf jeder Money-Seite.
2. **Sitemap deckt nur 4 von 11 öffentlichen Routen ab** – Service- und Projektseiten werden nicht in Google angemeldet.
3. **`/leistungen` ist ein Stilbruch + 432 kB First-Load-JS** – alte Datei aus einer früheren Iteration, nicht auf das aktuelle Design-System gehoben, importiert verwaiste Komponenten (`BookingCard`, `ServicesTOC`).
4. **OG-Image-URL bricht**: `metadata.openGraph.images = "/og-image.jpg"` – diese Datei existiert nicht. Next generiert `/opengraph-image.png` automatisch, das wird durch das explizite Manifest aber überschrieben.
5. **`/leistungen/google-ads` ist Platzhalter mit `[PLATZHALTER...]`-Text** – ohne `noindex` würde Google diese Soft-404-ähnliche Seite indexieren.

### 1.3 No-Risk-Fixes im selben Commit
Die folgenden Änderungen sind **nicht Teil der späteren Phase**, sondern sofort umgesetzt, weil sie kein Risiko für Tracking, Dashboard oder Brand bergen:

- `src/app/sitemap.ts` → vollständige Liste aller öffentlichen Routen + dynamische Case-Studies via `CASE_STUDIES`.
- `src/app/robots.ts` → `/kundenlogin`, `/login`, `/api/`, `/admin/`, `/intern/`, `/go/` explizit disallow; freundliche, namentliche Whitelist für seriöse KI-Crawler (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot) konsolidiert.
- `src/app/layout.tsx` → entfernt verbose `/og-image.jpg`-Referenz (Next nutzt jetzt automatisch `src/app/opengraph-image.png`), `themeColor` auf Dark-First (`#000000`) angepasst, root-Canonical entfernt (damit pro-Route-Canonical sauber überschreibt).
- `src/app/leistungen/google-ads/page.tsx` → `robots: { index: false, follow: true }` solange Placeholder.

Alles andere bleibt **Pending** und ist im Implementierungsplan priorisiert.

---

## 2. Kritische P0-Maßnahmen (vor nächstem Live-Release)

| # | Maßnahme | Datei(en) | Wirkung |
|---|----------|-----------|---------|
| P0-1 | **Hero-CTAs verlinken**: `Projektanfrage starten` → `#kontakt` (homepage) bzw. `/kontakt` (Service-Detail). Lösung: `Button` polymorph machen (`as="a"` / Next-Link-Wrapper). | `src/components/ui/Button.tsx`, `src/components/sections/Hero.tsx`, `src/app/leistungen/{webseiten,seo,google-ads}/page.tsx` | Verlorene Conversions stoppen |
| P0-2 | **`/leistungen` neu aufbauen** im aktuellen Brand-System: Übersicht der drei Disziplinen + Brand-Akzent, ohne `BookingCard`/`ServicesTOC` (Bundle-Reduktion). | `src/app/leistungen/page.tsx` | UX-Bruch beheben, Bundle von 432 kB → < 130 kB |
| P0-3 | **`/leistungen/google-ads` mit echten Inhalten füllen** (Methodik, Audit-Versprechen, FAQ) ODER bis dahin `noindex` (No-Risk-Fix erledigt). | `src/app/leistungen/google-ads/page.tsx` | Kein Soft-404-Risiko in Google |
| P0-4 | **JSON-LD-Architektur** anlegen: zentrale `src/lib/seo/schema.ts` mit `Organization`, `LocalBusiness` (Eppelborn / Saarland), `ContactPoint`, `BreadcrumbList`, `Service` pro Service-Detail-Seite, optional `WebSite` für Sitelinks-Searchbox. | neue Datei + Render-Helper, eingebunden in `layout.tsx` (global) + Service-Pages | KI-Crawler + Rich-Results, lokale Sichtbarkeit |
| P0-5 | **Lokales SEO in Titles und H1** – Saarland/Eppelborn/Saarbrücken erscheinen aktuell **nirgends** prominent. Auf `/`, `/leistungen/webseiten`, `/kontakt` ergänzen, ohne Keyword-Stuffing. | siehe Tabelle Abschnitt 4 | regionale Relevanz, Maps-Eligibility |
| P0-6 | **Echtes OG-Bild** mit Brand-Akzent (oder Default beibehalten + überprüfen) – aktuell ist im `src/app/opengraph-image.png` ein Bild, das nicht kontrolliert ist. Stichprobenprüfung + ggf. Neuerstellen mit Brand-Token. | `src/app/opengraph-image.png` | Social-Sharing Eindruck |
| P0-7 | **`not-found.tsx`** Brand-konform anlegen mit `NotFoundState`-Komponente + Links auf `/`, `/projekte`, `/kontakt`. Aktuell zeigt Next die Default-404-Seite. | neu `src/app/not-found.tsx` | UX + Crawl-Verständnis |

## 3. P1-Maßnahmen (nächste Phase)

| # | Maßnahme |
|---|----------|
| P1-1 | **Service-Pages H1/H2 strukturieren** entlang Käufer-Intent und Keyword-Cluster (siehe Abschnitt 5.3 Empfehlungen). |
| P1-2 | **FAQPage-JSON-LD** auf `/leistungen/webseiten` und `/leistungen/seo` (FAQs existieren bereits als `<details>` im HTML, nur Schema fehlt). |
| P1-3 | **Stats neutralisieren**: in `/leistungen/seo` werden `~68 %` und `< 1 %` als Fakten dargestellt – ohne Quelle riskant. Entweder Quelle nennen oder neutral umformulieren. Auch `/leistungen/webseiten` „90 % aller gehackten Sites" prüfen. |
| P1-4 | **Lokale Landingpages**: `/standorte/saarbruecken`, `/standorte/saarlouis`, `/standorte/neunkirchen` als dünne, aber nicht doorway-artige Seiten (jeweils Hero + Geltungsbereich + Process + Kontakt). |
| P1-5 | **Branchen-Landingpages**: `/branchen/handwerk`, `/branchen/restaurants`, `/branchen/friseure`, `/branchen/dienstleister`. Erst dann sinnvoll, wenn 1–2 Case-Studies pro Branche existieren. |
| P1-6 | **TestimonialsSection** wird im Repo bereitgehalten (`src/components/TestimonialsSection.tsx` mit JSON-LD), wird aber nicht mehr verwendet – entweder reintegrieren (Brand-konform) oder löschen. |
| P1-7 | **Booking-Pfad neu denken**: aktuell gibt es `/leistungen` mit `BookingCard` (Google Calendar) – die Architektur sollte konsistent sein: entweder Booking überall, oder Booking nirgends. |
| P1-8 | **Image-Optimierung**: `public/CaseStudies/AlexanderErgart_CaseStudy/Inhaber_Ergart_Portrait.png` ist ein PNG-Portrait → in WebP/AVIF konvertieren. |

## 4. P2-Maßnahmen (später)

- Mehrsprachigkeit (de/en) per `alternates.languages`.
- Sitelinks-Searchbox / `SearchAction` Schema.
- Blog/Insights-Bereich für Long-Tail-Themen (z. B. „Was kostet eine Website im Saarland?", „SEO für Handwerker").
- Erfolgsmessungs-Page intern (nicht öffentlich), die zeigt, welche organischen Seiten Anfragen generiert haben.

---

## 5. Routen-Tabelle (Inventar)

### 5.1 Öffentliche Routen

| Route | Zweck | Suchintention (geschätzt) | aktueller SEO-Wert | Conversion-Ziel | Aktuelle CTAs | Fehlende CTAs | Risiken | Prio |
|---|---|---|---|---|---|---|---|---|
| `/` | Marken-Startseite, Übersicht aller Disziplinen | Brand + „Webdesign Saarland" (informational/navigational) | mittel – kein lokaler Bezug im Title, Hero-CTA bricht | Lead via ContactFormSection | Hero × 2, Header-CTA, Service-Cards, Footer | Sticky-Mobile-CTA, Telefon-CTA im Hero | Hero-Button kein `href`, Headline ohne Region | P0 |
| `/leistungen` | Übersicht aller Leistungen | „Webdesign Agentur Saarland" (commercial) | niedrig – inkonsistentes Layout, 432 kB JS | Klick auf Detail-Seite | `BookingCard`, anchored Links | Brand-CTA, klare Top-3-Kacheln | Stilbruch + Bundle, JPP-Wording verwirrt | P0 |
| `/leistungen/webseiten` | High-Intent Money-Page Web | „Website erstellen lassen Eppelborn/Saarland" (commercial) | mittel – guter Content, ohne Schema | Formular-Submit | Hero-CTA, Footer-Formular | Lokal-CTA, Telefon, Trust-Logos | Hero-Button kein `href` | P0 |
| `/leistungen/seo` | High-Intent Money-Page SEO | „SEO Saarland" / „SEO Agentur" (commercial) | mittel – guter Content, Stats unsicher | Formular-Submit | Hero-CTA, Reporting-CTA, Footer-Formular | Lokal-CTA, Branchen-Anker | erfundene Stats, kein Schema | P0/P1 |
| `/leistungen/google-ads` | High-Intent Money-Page Ads | „Google Ads Saarland" (commercial) | niedrig – Platzhaltertext | Lead | – | komplette Page | Soft-404 ohne noindex (jetzt gefixt) | P0 |
| `/ueber-uns` | Trust, Philosophie, Stack | „smairys robin schmeiries" (branded) | mittel – sehr persönlich, gut | Klick auf Projekte oder Kontakt | TechStack ist Inhalt, finales Kontaktformular | sichtbare Erfolgs-Belege | persönliche Story knapp | P1 |
| `/projekte` | Übersicht Case Studies | „smairys projekte" + „webdesign referenzen saarland" | mittel – noch nur 1 aktive CS | Detail-Klick | CaseStudyCards | Filter/Sortierung erst sinnvoll bei n ≥ 6 | – | P1 |
| `/projekte/alexander-ergart` | Erste Case Study | branded + „stahlhandel saarland website" | mittel – belegbares Reporting | Form-Lead | Hero + Final-Formular | Testimonial, evtl. Live-URL | – | P1 |
| `/kontakt` | Lead-Page | „smairys kontakt" | hoch – Lead-Ziel | Form-Submit, Phone, Mail | Form, Info, Standards | – | – | OK |
| `/impressum` | Rechtspflicht | – | – | – | – | – | OK | OK |
| `/datenschutz` | Rechtspflicht + Plausible-Transparenz | – | – | – | – | Plausible-Block ist gut | OK | OK |

### 5.2 Interne Routen

| Route | Status |
|---|---|
| `/kundenlogin` | `robots: noindex/nofollow` ✓ · No-Risk-Fix ergänzt explizit `/kundenlogin` in robots.txt |
| `/intern/*` | `robots: noindex` ✓ + Disallow ✓ + Middleware-Schutz ✓ |
| `/go/*` | Disallow ✓ + Server-307 mit `X-Robots-Tag: noindex` aus Phase 2 |

### 5.3 Empfohlene H1/H2-Struktur (Beispiel `/leistungen/webseiten`)

```
H1: Webseiten erstellen lassen im Saarland – handgebaut von Smairys
H2: Wer wir sind & für wen wir arbeiten
H2: Wie eine Smairys-Website entsteht (Prozess)
H2: Beispiele aus unserer Werkstatt (Link zu /projekte)
H2: Was kostet eine Website? (Budget-Orientierung)
H2: Häufige Fragen
H2: Projektanfrage starten
```

---

## 6. Metadata-Tabelle

| Route | aktueller Title | empfohlener Title | aktuelle Description | empfohlene Description | Prio |
|---|---|---|---|---|---|
| `/` | `Smairys Netz-Manufaktur \| Premium Webentwicklung, SEO & Ads` | `Webdesign & SEO aus dem Saarland – Smairys Netz-Manufaktur` | `Die Premium-Vertriebswebsite für qualitätsbewusste KMU…` | `Handgebaute Websites, SEO und Google Ads für mittelständische Unternehmen im Saarland. Inhabergeführt, technisch sauber, mit messbaren Anfragen.` | P0 |
| `/leistungen` | `Leistungen – SMAIRYS Netz-Manufaktur` | `Leistungen – Webdesign, SEO und Google Ads im Saarland` | `Website-Programmierung, JPP-Check, SEO und Hosting…` | `Drei Disziplinen, exzellent umgesetzt: hochwertige Websites, organisches Wachstum, profitables Google Ads – aus Eppelborn für den Saarland-Mittelstand.` | P0 |
| `/leistungen/webseiten` | `Next.js Webseiten & digitale Infrastruktur \| …` | `Website erstellen lassen im Saarland – maßgefertigt von Smairys` | `Maßgeschneiderte, sichere…` | `Hochwertige Websites für Unternehmen aus Eppelborn, Saarbrücken, Saarlouis und Umgebung. Handgeschriebener Code, Hosting inklusive, ab 3.000 €.` | P0 |
| `/leistungen/seo` | `Premium SEO \| Nachhaltige Suchmaschinenoptimierung…` | `SEO im Saarland – nachhaltige Sichtbarkeit für KMU` | `Organisches Wachstum ohne Tricks…` | `Suchmaschinenoptimierung für saarländische Unternehmen. Technisches SEO, Content-Cluster, monatliches Reporting ohne Blackbox.` | P0 |
| `/leistungen/google-ads` | `Google Ads Systematik \| Profitables B2B Lead-Management` | (zunächst `noindex`) `Google Ads im Saarland – planbare Anfragen für KMU` | (Placeholder) | `Datengetriebene Google-Ads-Kampagnen für saarländische Mittelständler. Klare ROAS, keine versteckten Setup-Kosten, monatlich kündbar.` | P0 |
| `/ueber-uns` | `Über uns & Philosophie` | `Über Robin Schmeiries – Inhaber Smairys Netz-Manufaktur, Eppelborn` | `Die Haltung der Smairys Netz-Manufaktur…` | `Smairys ist die Inhaber-Werkstatt von Robin Schmeiries in Eppelborn. Sechs Jahre Erfahrung, Inhouse-Entwicklung, persönliche Verantwortung.` | P1 |
| `/projekte` | `Projekte & Case Studies` | `Webdesign- und SEO-Projekte aus dem Saarland – Smairys` | `Ausgewählte Projekte der Smairys Netz-Manufaktur…` | `Ausgewählte Kundenprojekte aus dem Saarland und der Region – belegbar über Reportings und Search-Console-Daten.` | P1 |
| `/projekte/alexander-ergart` | `Ergart · Case Study` | `Case Study Ergart: Mehr Sichtbarkeit für einen saarländischen Stahlhandel` | (auto) | `Wie Ergart aus dem Saarland seine organischen Klicks deutlich erhöht hat – Architektur, Vorgehen, Ergebnis.` | P1 |
| `/kontakt` | `Kontakt aufnehmen` | `Kontakt – Smairys Netz-Manufaktur Eppelborn / Saarland` | `Starten Sie Ihre Projektanfrage…` | `Projektanfrage an Smairys: Webdesign, SEO und Google Ads aus dem Saarland. Antwort innerhalb von 24 Stunden, persönlich von Robin.` | P0 |
| `/impressum` | `Impressum` | `Impressum – Smairys Netz-Manufaktur` | – | (`noindex` optional, nicht zwingend) | OK |
| `/datenschutz` | `Datenschutzerklärung` | `Datenschutz – Smairys Netz-Manufaktur` | – | – | OK |

Regelwerk:
- Titles **≤ 60 Zeichen**, Brandname konsistent als Suffix.
- Descriptions **140–160 Zeichen**, immer eine Standort-Information + eine Differentialaussage.
- Keine Mehrfachverwendung identischer Descriptions.

---

## 7. Schema / JSON-LD – Empfehlung

### 7.1 Architektur

**Eine zentrale Helper-Datei**: `src/lib/seo/schema.ts`

```
buildOrganizationSchema()      // global – im RootLayout
buildLocalBusinessSchema()     // global – im RootLayout
buildWebsiteSchema()           // global – im RootLayout
buildBreadcrumbList(items)     // pro Seite
buildServiceSchema(slug)       // pro Service-Detail-Seite
buildFAQPageSchema(faqs)       // pro Seite mit sichtbarer FAQ
buildCaseStudySchema(cs)       // pro Case Study (CreativeWork/Article)
```

Render-Pattern: ein **`<JsonLd>`-Server-Component** rendert ein `<script type="application/ld+json">` mit `JSON.stringify(...)`. Es darf **kein** Client-State / kein "use client" enthalten – JSON-LD muss im initialen HTML stehen.

### 7.2 Globaler Block (Layout)

```jsonc
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",   // bewusst spezifischer als LocalBusiness
  "@id": "https://smairys.de/#organization",
  "name": "Smairys Netz-Manufaktur",
  "alternateName": "Smairys",
  "url": "https://smairys.de",
  "logo": "https://smairys.de/logo/smairys-white.png",
  "image": "https://smairys.de/opengraph-image.png",
  "email": "robin@smairys.de",
  "telephone": "+491603005518",
  "founder": { "@type": "Person", "name": "Robin Schmeiries" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Zur Steinrausche 22",
    "postalCode": "66571",
    "addressLocality": "Eppelborn",
    "addressRegion": "Saarland",
    "addressCountry": "DE"
  },
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "Saarland" },
    { "@type": "City", "name": "Saarbrücken" },
    { "@type": "City", "name": "Saarlouis" },
    { "@type": "City", "name": "Neunkirchen" },
    { "@type": "City", "name": "St. Wendel" },
    { "@type": "City", "name": "Lebach" },
    { "@type": "City", "name": "Illingen" },
    { "@type": "City", "name": "Heusweiler" },
    { "@type": "City", "name": "Eppelborn" }
  ],
  "knowsAbout": [
    "Webdesign","Webentwicklung","Next.js","SEO","Google Ads","Online-Präsenz","Webhosting"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "robin@smairys.de",
    "telephone": "+491603005518",
    "availableLanguage": ["de","en"],
    "areaServed": "DE"
  }
}
```

**Bewusst nicht enthalten:**
- `aggregateRating` / `review` – keine echten Bewertungen vorliegen.
- `openingHours` – keine festen Bürozeiten.
- `priceRange` – nur dann, wenn der Hinweis im Sichtbaren steht (auf `/leistungen/webseiten` steht „ab 3.000 €" – dort kann `priceRange: "€€"` ergänzt werden).

### 7.3 Pro-Page-Blöcke

- **`BreadcrumbList`** auf allen Unterseiten: `Home → Leistungen → Webseiten` etc.
- **`Service`** pro `/leistungen/*`-Page, jeweils mit `provider` referenziert auf `#organization`.
- **`FAQPage`** dort, wo FAQ sichtbar im HTML steht (heute: `/leistungen/webseiten`, `/leistungen/seo`).
- **`CreativeWork`** oder **`Article`** für `/projekte/[slug]` – mit `about`/`mentions` für den Kunden, **ohne** erfundene Ergebnis-Zahlen.

---

## 8. AI-Crawler / KI-Optimierung

### 8.1 Aktueller Zustand
- **Wer ist Smairys?** – nur in `/ueber-uns` klar (gut). In `/` als Brand-Tagline. **AI-Summary-Block fehlt**.
- **Was bietet Smairys an?** – auf `/` und `/leistungen` sichtbar, jedoch ohne Schema-Bindung.
- **Wo arbeitet Smairys?** – steht im Footer + Impressum + Kontaktseite, aber **nicht im Above-the-Fold** der Homepage.
- **Für wen?** – sichtbar als „mittelständische Unternehmen". Branchen (Handwerk, Restaurants, Friseure) sind nicht explizit benannt.
- **Wie läuft ein Projekt?** – auf `/` (ProcessSection) und `/leistungen/webseiten` (Pillars) sichtbar. Gut.
- **FAQ** – nur auf `/leistungen/webseiten` und `/leistungen/seo` sichtbar.
- **Kontakt** – an mehreren Stellen, jedoch ohne `ContactPoint`-Schema.

### 8.2 Empfehlung: „AI-Summary"-Block

Auf der **Homepage** direkt nach dem Hero einen kurzen, sichtbaren Block einfügen mit semantisch klarer Struktur:

```
<section aria-label="Über Smairys">
  <h2>Smairys auf einen Blick</h2>
  <dl>
    <dt>Wer</dt><dd>Inhabergeführte Werkstatt – Robin Schmeiries, Eppelborn (Saarland).</dd>
    <dt>Was</dt><dd>Websites, SEO und Google Ads für mittelständische Unternehmen.</dd>
    <dt>Für wen</dt><dd>Handwerk, Gastronomie, Dienstleister und B2B-Mittelstand im Saarland.</dd>
    <dt>Wie</dt><dd>Handgeschriebener Code (Next.js), inhouse, kein Outsourcing.</dd>
  </dl>
</section>
```

KI-Crawler lieben semantische `<dl>`-Definitionslisten – sie geben kontextuelle Struktur ohne Keyword-Stuffing.

### 8.3 Regional-Strategie

- **Eine starke Homepage** (national + Saarland-Anker).
- **Drei Money-Service-Pages** mit lokalem Aufhänger im Title und H1.
- **Optionale lokale Spitzen** (`/standorte/saarbruecken` …) erst, wenn Branchen-/Case-Tiefe vorhanden ist – sonst Doorway-Risiko.

---

## 9. Conversion-Funnel-Bewertung

| Touchpoint | Bewertung | Maßnahme |
|---|---|---|
| Hero CTA | **kritisch defekt** (Button ohne `href`) | P0-1 |
| Telefon-CTA im Hero | fehlt | P0 ergänzen (`+49 160 300 5518` als sekundärer Link) |
| Social Proof | vorhanden (`SocialProofSection`) – stark | Logos austauschen, sobald freigegeben |
| Trust (Persona Robin) | Placeholder-Portrait, schwach | echtes Portrait einfügen |
| Service-Klarheit | gut auf Detail-Seiten | konsistent mit `/leistungen` ziehen |
| Preise / Budget | „ab 3.000 €" auf `/leistungen/webseiten` – sehr gut; auf `/leistungen/seo` fehlt eine ähnliche Orientierung | P1: SEO-„ab"-Hinweis ergänzen |
| Kontaktformular | aktualisiert (Brand-Variante), gute Reibung | „Kostenlos anfragen" → besser „Projektanfrage starten" für Konsistenz; CTA-Text-Test P1 |
| sticky Mobile-CTA | fehlt | P1: Mobile-Sticky-Bar mit Call-/Mail-Button |
| Footer Kontakt | vollständig, aus `site.ts` | OK |

CTA-Sprache aktuell:
- „Projektanfrage starten" (gut, präzise, kein Verkaufsdruck)
- „SEO-Audit anfordern" (gut)
- „Unsere Expertise" (schwach – könnte „Methodik ansehen" werden)
- „Mehr erfahren →" auf `/leistungen/seo` (zu generisch)

---

## 10. Technisches SEO

| Punkt | Status | Maßnahme |
|---|---|---|
| `robots.ts` | gut, jetzt erweitert um `/kundenlogin`, `/login` (No-Risk-Fix) | – |
| `sitemap.ts` | jetzt vollständig (No-Risk-Fix) | – |
| canonical | Root-Canonical entfernt (No-Risk-Fix). Pro-Page canonical: nur `/leistungen` setzt es derzeit | P0: pro Service-Page `alternates.canonical` setzen |
| `noindex` interne Routen | OK + jetzt explizit im robots | – |
| 404 / not-found | fehlt | P0-7 |
| Image-Alts | meist OK; im Hero-Wrapper teilweise dekorativ | OK |
| `next/image` | konsequent verwendet | OK |
| OG-Bild | Pfad-Konflikt (jetzt gefixt – kein expliziter Override mehr, `opengraph-image.png` greift automatisch) | – |
| URL-Struktur | sauber, kurze Slugs, keine Stop-Wörter | OK |
| Lighthouse-Risiko | `/leistungen` Bundle 432 kB → CLS/LCP-Risiko | P0-2 |

---

## 11. Responsive / Container-First UX

### Audit-Notizen pro Viewport

- **Mobile ≤ 430 px**:
  - Header: Navigation `Leistungen / Projekte / Über uns` ist `hidden md:flex` – **auf Mobile sind diese Links unsichtbar**. Es fehlt eine Off-Canvas- oder Bottom-Sheet-Lösung. **P0**.
  - Hero CTAs sind `w-full` auf Mobile – gut.
  - Service-Cards stacken sauber.
  - ContactFormSection-Grid stackt zu 1-Spalte – gut.

- **iPad Portrait (≈ 820×1180)**:
  - Trust-/Process-/Über-uns-Doppelspalte greifen erst ab `lg:` – Tablet sieht häufig wie Mobile aus. **P1**: iPad-Breakpoint zwischen `md` und `lg` testen.
  - Marketing-Footer 4-Spalten → 2-Spalten (passt).

- **iPad Pro 13" Landscape (≈ 1366×1024)**:
  - greift mit `lg:` – passt.
  - Case-Study-Hero-Grid ist `lg:grid-cols-12` und sieht ausgewogen aus.

- **Desktop 1440 px+**:
  - Container 1400 px max – OK.
  - Hero kann auf 1920 px etwas leer wirken (3D-Logo ist subtil). Kein Handlungsbedarf.

### Hotspots

- **Mobile-Header ohne Navi** → P0
- **iPad Portrait fällt auf Mobile-Layout** → P1
- **Footer 4-Spalten auf 1024 px Landscape** ist eng – OK, aber kontrollieren

---

## 12. Performance / Bundle

Letzter Build (siehe Phase-1-Report):

| Route | First Load JS | Befund |
|---|---|---|
| `/` | **119 kB** | OK |
| `/leistungen` | **538 kB** | **kritisch** – alte Datei mit `BookingCard`/`ServicesTOC` |
| `/leistungen/webseiten` | 118 kB | OK |
| `/leistungen/seo` | 118 kB | OK |
| `/leistungen/google-ads` | 116 kB | OK |
| `/kontakt` | 119 kB | OK |
| `/projekte` | 116 kB | OK |
| `/projekte/[slug]` | 119 kB | OK |
| `/ueber-uns` | 119 kB | OK |
| `/intern/marketing` | 111 kB | OK |
| `/kundenlogin` | 105 kB | OK |

Konkrete Empfehlungen:
1. **`/leistungen`** komplett auf Brand-System ziehen → Ziel < 130 kB First Load.
2. **3D-Logo (`ThreeLogoWrapper`)** wird auf Homepage geladen. Aktuell First Load der `/` bei 119 kB – akzeptabel. Wenn JS-Budget weiter sinken soll, `dynamic(() => …, { ssr: false })` schon vorhanden – ggf. nur auf `> md`-Viewports rendern.
3. **`SocialProofSection`** + `Reveal` sind Client-Components mit IntersectionObserver. OK, da sehr leichtgewichtig.
4. **Image-Optimierung**: `ergart_firmenzentrale.webp` ist bereits WebP (gut). Portrait und GSC-Screenshots als PNG → in WebP konvertieren spart ~40 % LCP-Bytes.
5. **Keine framer-motion / three.js** mehr auf öffentlichen Money-Pages (nur im 3D-Hero) – sauber.

---

## 13. Tracking / Plausible

### Aktueller Zustand (gut)
- Cookielos, `script.exclusions.js` mit `data-exclude` (`/intern/*, /kundenlogin, /login`).
- Vier Exclusion-Layer (Plausible-DOM, `trackEvent`, `dispatchEvent`, `AttributionCapture`).
- UTM First-Touch + Last-Touch im LocalStorage / SessionStorage, an Form-Submit attached.
- `CTA Click`, `Contact Intent`, `form_start`, `form_submit_success`, `form_submit_error` werden gefeuert.

### Empfehlungen (keine Implementierung jetzt)
- **Plausible-Goals einrichten** (im Plausible-Dashboard, kein Code-Change):
  1. `form_submit_success` – primäres Money-Goal
  2. `Contact Intent` (mit Filter `type=phone`) – Telefon-Anfrage
  3. `Contact Intent` (mit Filter `type=email`) – E-Mail-Anfrage
  4. `CTA Click` (mit Filter `cta=hero-primary`) – Hero-Aktivität
- **`form_field_focus`** oder Dropoff-Tracking **nicht** einführen – würde Bouncerate verfälschen, ist heute kein Engpass.
- **Keine GTM-Aktivierung** ohne Consent-Banner – aktuell Tag nicht geladen, das ist OK so.

---

## 14. Content-Gap-Audit

Inhaltsblöcke, die fehlen (aber noch nicht implementieren):

1. **„Was passiert nach Kontaktaufnahme?"** – 3-Schritte-Mini-Block auf `/` und `/kontakt`. Reduziert Anrufangst.
2. **„Was eine Website wirklich kostet"** – ein neutraler Erklär-Block (kein Pricing-Table) mit Faktoren: Scope, Hosting, Pflege.
3. **„Was ist mit der Pflege nach Launch?"** – Wartungspaket-Hinweis (auch wenn kein fertiges Produkt) – Trust-Signal.
4. **„Warum nicht Wix/Squarespace?"** – existiert bereits auf `/leistungen/webseiten`, sollte auf `/leistungen` (Übersicht) gespiegelt sein.
5. **„Was zeichnet einen guten Web-Dienstleister im Saarland aus?"** – Long-Tail-Content, „Auswahl-Hilfe" für KMU – KI-/Google-Relevanz.
6. **„Branchen-Beispiele"** – kleine Block-Liste „Wir haben gearbeitet mit/für Stahlhandel, Gastronomie, Friseure …" – belegbar oder klar als Branchen-Fokus formuliert.

---

## 15. Konkreter Implementierungsplan – siehe `docs/audits/next-implementation-plan.md`
