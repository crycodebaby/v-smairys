# Next Implementation Plan – Geld-relevante Maßnahmen

> Maximal 10 Tasks, sortiert nach **direkter Conversion- / Money-Wirkung**. Jedes Item nennt betroffene Dateien und geschätztes Risiko.
> Voraussetzung: das Audit `docs/audits/seo-conversion-audit.md` wurde gelesen.

| # | Task | Wirkung | Betroffene Dateien | Risiko |
|---|------|---------|--------------------|--------|
| 1 | **Hero-CTA-Bug beheben** – `Button` polymorph (`as="a"`) oder `asLink`-Prop einführen, sodass Hero-CTAs auf `#kontakt` / `/kontakt` zeigen. Tracking bleibt durch `TrackedButton`-Hook erhalten (Migration auf `TrackedLink`-Wrapper möglich). | Stoppt unmittelbar verlorene Conversions auf jeder Money-Seite. | `src/components/ui/Button.tsx`, `src/components/ui/TrackedButton.tsx`, `src/components/sections/Hero.tsx`, `src/components/sections/ServicesSection.tsx`, `src/app/leistungen/{webseiten,seo,google-ads}/page.tsx` | **medium** – kleine API-Erweiterung in Button + Tracking-Path muss konsistent bleiben |
| 2 | **`/leistungen` neu auf Brand-System ziehen** – mit `Section`, `Container`, `Kicker`, drei Service-Tiles auf die Detail-Seiten verlinkend, Brand-CTAs, ohne `BookingCard`/`ServicesTOC`. Lokal-SEO (Saarland) in H1 + Description. | Behebt UX-Bruch + 432 kB-Bundle, gewinnt eine echte „Leistungen Saarland"-Landingpage. | `src/app/leistungen/page.tsx`, ggf. Löschen ungenutzter `BookingCard.tsx` / `ServicesTOC.tsx` (separat prüfen, was sonst noch verwendet wird) | **medium** – muss alte Imports prüfen |
| 3 | **JSON-LD-Architektur** – `src/lib/seo/schema.ts` + `<JsonLd>`-Server-Component im Root-Layout (Organization, ProfessionalService, ContactPoint, PostalAddress, areaServed). Pro Service-Page `Service`-Schema, pro Detail-Page `BreadcrumbList`. | KI-Crawler + Rich-Results, lokale Sichtbarkeit, klare Entity-Definition. | neu `src/lib/seo/schema.ts`, `src/components/seo/JsonLd.tsx`; eingebunden in `src/app/layout.tsx`, `src/app/leistungen/{webseiten,seo,google-ads}/page.tsx`, `src/app/projekte/[slug]/page.tsx` | **low** – server-rendert `<script>`-Tag, kein Bundle-Impact |
| 4 | **Lokale Titles + H1** auf `/`, `/leistungen`, `/leistungen/webseiten`, `/kontakt` – siehe Metadata-Tabelle Abschnitt 6 des Audits. Pro-Page-`alternates.canonical` setzen. | „Webdesign Saarland" / „Website erstellen lassen Eppelborn" werden überhaupt erst möglich. | `src/app/{page,leistungen/page,leistungen/webseiten/page,kontakt/page}.tsx`, `src/components/sections/Hero.tsx` (H1) | **low** – textuelle Änderung |
| 5 | **`not-found.tsx`** im Brand-System mit `NotFoundState`-Komponente + Links auf `/`, `/projekte`, `/kontakt`, optional Suchfeld später. | UX-Konsistenz, weniger Crawl-Verwirrung. | neu `src/app/not-found.tsx` | **low** |
| 6 | **AI-Summary-Block auf Homepage** – `<dl>`-Definitionsliste „Wer / Was / Für wen / Wie" direkt nach dem Hero, vor SocialProof. | KI-Crawler-Lesbarkeit + Snippet-Eligibility. | `src/app/page.tsx`, ggf. neue Komponente `src/components/sections/AtAGlanceSection.tsx` | **low** |
| 7 | **Mobile-Navigation** – Off-Canvas oder Bottom-Sheet mit Leistungen, Projekte, Über uns, Kontakt, Telefon. Aktuell sind Nav-Links unter `md` unsichtbar. | Mobile-Conversion + Crawl-Erkennung interner Links. | `src/components/layout/Header.tsx` (neuer Client-State + Animation), ggf. neuer `MobileNav.tsx` | **medium** – State + Focus-Trap + ESC-Handling |
| 8 | **FAQPage-JSON-LD** auf `/leistungen/webseiten` und `/leistungen/seo` (FAQ-Inhalte existieren). Aus #3 ableitbar, hier als eigene Task wegen Skript-Position. | Featured-Snippets in Google + Antworten in AI-Overviews. | dieselben Service-Pages + `src/lib/seo/schema.ts#buildFAQPageSchema` | **low** |
| 9 | **`/leistungen/google-ads`** mit echtem Inhalt füllen (Hero, Methodik, FAQ, Final-CTA – konsistent zu Webseiten/SEO-Page), dann `noindex` entfernen. | Eine dritte Money-Page wird wirksam. | `src/app/leistungen/google-ads/page.tsx` | **medium** – inhaltliche Arbeit |
| 10 | **Stats neutralisieren / belegen** – `/leistungen/seo` „~68 %" und „< 1 %"; `/leistungen/webseiten` „90 % aller gehackten Sites". Entweder Quelle (z. B. „lt. Sucharama Industry Report 2024…") oder neutral umformulieren. | Glaubwürdigkeit, Vermeidung von Abmahnrisiko. | `src/app/leistungen/{seo,webseiten}/page.tsx` | **low** |

## Ausdrücklich NICHT in dieser 10er-Liste
- Lokale Landingpages (`/standorte/*`) – frühestens nach #1–#5.
- Branchen-Landingpages – erst nach #1–#5 + 2 weiteren Case Studies.
- Booking-Workflow neu denken – design-strategisch, kein Hard-Money-Hebel.
- Blog/Insights – sinnvoll, aber nach den 10 Money-Hebeln.

## Reihenfolge-Vorschlag (Sprint-Plan)

**Sprint 1 (P0, dringend vor nächstem Live-Release):** 1, 2, 4, 5, 10
**Sprint 2 (P0/P1):** 3, 6, 7, 8, 9
