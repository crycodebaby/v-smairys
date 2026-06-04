# 03 · SEO- & Content-Architektur

> Leitlinie für SEO, Seitenstruktur und Content. Setzt die Strategie aus
> `docs/02-positioning-conversion.md` technisch um. Bestandsaufnahme der
> aktuellen SEO-Implementierung: `docs/audits/seo-conversion-audit.md`.

Stand: 2026-06 · Status: aktive Strategie · Website live unter `smairys.de`.

---

## 1. SEO-Fokus (Strategiewechsel)

Der SEO-Schwerpunkt liegt ab sofort **ausschließlich auf Website-Erstellung /
Webdesign**. SEO und Google Ads sind sekundäre Add-ons und werden **nicht** mehr
als eigenständige Haupt-Money-Pages priorisiert.

Konsequenzen:
- Title/H1/Descriptions der Startseite und der Webdesign-Seiten führen mit
  Website-Begriffen + lokalem Bezug.
- `/leistungen/seo` und `/leistungen/google-ads` bleiben bestehen, werden aber
  als **Add-on-/Sekundärseiten** behandelt (kein primärer Linkjuice-Fokus).
- `/leistungen/google-ads` bleibt `noindex`, solange Platzhalter-Content
  vorhanden ist (`src/app/leistungen/google-ads/page.tsx`).

---

## 2. Ziel-Keyword-Cluster

Primärer Cluster (Website-Erstellung, regional):

| Keyword | Intent | Ziel-URL |
|---------|--------|----------|
| Webdesign Saarland | commercial | `/` + `/leistungen/webseiten` |
| Webdesign Saarbrücken | commercial/local | `/leistungen/webseiten` (+ optionale Standortseite) |
| Website erstellen lassen Saarland | commercial | `/leistungen/webseiten` |
| Unternehmenswebsite erstellen lassen | commercial | `/leistungen/webseiten` |
| Webseite für Handwerker | commercial/vertical | `/branchen/handwerk` |
| Webseite für Immobilienunternehmen | commercial/vertical | `/branchen/immobilien` |
| Webseite Gastronomie | commercial/vertical | `/branchen/gastronomie` |

Regeln:
- **Keine** erfundenen Suchvolumina/Rankings in Content oder Docs.
- Lokalbezug (Saarland/Saarbrücken/Eppelborn) in Titles & H1 der Money-Pages,
  ohne Keyword-Stuffing.
- Sekundäre Add-on-Keywords (SEO, Google Ads) nur auf den jeweiligen
  Add-on-Seiten, nicht auf der Startseite führend.

---

## 3. Empfohlene Seitenarchitektur

```
/                              Startseite – Website-Fokus + lokal + 3 Verticals
/leistungen                    Übersicht (Website führend, SEO/Ads als Add-on)
/leistungen/webseiten          PRIMÄRE Money-Page: Website erstellen lassen
/leistungen/seo                Sekundär (Add-on)
/leistungen/google-ads         Sekundär (Add-on, noindex bis Content steht)
/branchen/handwerk             Industrie-Landingpage (neu)
/branchen/immobilien           Industrie-Landingpage (neu)
/branchen/gastronomie          Industrie-Landingpage (neu)
/projekte                      Case-Study-Übersicht
/projekte/[slug]               Case Study Detail
/preise (optional)             eigenständige Paket-/Preisseite ODER Anker auf /
/ueber-uns                     Trust / Inhaber / Stack
/kontakt                       Erstgespräch (Booking + Telefon primär)
/impressum, /datenschutz       Rechtliches
```

Hinweise:
- Pakete/Preise können als eigene Route `/preise` **oder** als Sektion auf `/`
  und `/leistungen/webseiten` leben. Entscheidung offen (siehe
  `docs/02-positioning-conversion.md` Abschnitt 10). Falls eigene Route: in
  Sitemap aufnehmen.
- Industrie-Landingpages erst veröffentlichen, wenn echter Content + möglichst
  eine passende Referenz vorhanden ist (Doorway-Risiko vermeiden).

---

## 4. Lokale SEO-Ziele

- **Primärregion:** Saarland, Schwerpunkt Saarbrücken; Sitz Eppelborn.
- Lokale Signale konsistent halten – Quelle ist `src/config/site.ts`
  (Name, Adresse, Telefon, E-Mail). NAP überall identisch.
- Lokalbezug above-the-fold auf `/` (aktuell fehlt er im Hero – siehe Audit).
- Optionale Standortseiten (`/standorte/saarbruecken` etc.) erst **nach** den
  Industrie-Landingpages und nur mit eigenständigem Content (kein Doorway).
- Google Business Profile (extern) konsistent zur Website pflegen – außerhalb
  des Repos, hier nur als To-do vermerkt.

---

## 5. Industrie-Landingpage-Chancen

Drei Verticals = drei Landingpages, jeweils gleicher Aufbau:

| Page | Ziel-Keyword | Inhalts-Bausteine |
|------|--------------|-------------------|
| `/branchen/handwerk` | Webseite für Handwerker | Hero (lokal), Probleme der Branche, Website-Nutzen, Referenz (Ergart), FAQ, CTA Erstgespräch |
| `/branchen/immobilien` | Webseite für Immobilienunternehmen | Hero, Branchen-Trust, Objekt-/Vertrauensdarstellung, Referenz (offen), FAQ, CTA |
| `/branchen/gastronomie` | Webseite Gastronomie | Hero, Reservierungs-/Marken-Nutzen, Referenz (offen), FAQ, CTA |

Aufbau-Konvention pro Industrie-Seite:
1. Lokaler, branchenspezifischer Hero + Rang-1-CTAs (Booking/Telefon).
2. „Warum eine starke Website für [Branche]" (3–4 Nutzenpunkte).
3. Mini-Case/Referenz, falls vorhanden.
4. Paket-Verweis (Anker/Link auf Pakete).
5. Branchen-FAQ (Basis für `FAQPage`-JSON-LD).
6. Abschluss-CTA (Erstgespräch).

Wiederverwenden: `Section`, `Container`, `Kicker`, `ContactFormSection`,
`BackdropIcons` (siehe `docs/04-ui-design-system.md`).

---

## 6. Blog / Sanity Content-Strategie

Aktueller Stand (verifiziert): Sanity-**Schemas** existieren
(`sanity/schemas/post.ts`, `caseStudy.ts`, `faq.ts`, `landingPage.ts`), aber
**kein** Sanity-Client/-Package ist eingebunden – Content ist heute statisch
(`src/config/*`, lokale Arrays). `post.ts` referenziert ein `author`-Schema,
das fehlt.

Strategie:
- **Kurzfristig:** Kein Blog nötig. Fokus auf Money-Pages + Industrie-Seiten.
  Content statisch in `src/config/*` / Page-Dateien halten.
- **Mittelfristig (optional):** Wenn Long-Tail-Content sinnvoll wird, Blog unter
  `/insights` oder `/ratgeber` aufsetzen.
- **CMS-Entscheidung offen:** Entweder Sanity aktiv anbinden (Client + Config +
  `author`-Schema ergänzen) **oder** Schemas als Dead Code entfernen. Nicht
  beides halb. Bis zur Entscheidung: Schemas nicht weiter ausbauen.
- Erste Blog-Themen entlang Käufer-Intent (kein Keyword-Stuffing):
  - „Was kostet eine professionelle Website im Saarland?"
  - „Website für Handwerksbetriebe – worauf es ankommt"
  - „Baukasten vs. individuelle Website"

---

## 7. Internes Verlinkungs-Konzept

- **Startseite** verlinkt auf: `/leistungen/webseiten`, die drei
  `/branchen/*`-Seiten, `/projekte`, `/preise` (bzw. Paket-Anker), `/kontakt`.
- **`/leistungen/webseiten`** verlinkt auf: relevante `/branchen/*`,
  passende Case Studies, Pakete, `/kontakt`.
- **Industrie-Seiten** verlinken auf: `/leistungen/webseiten`, passende Case
  Study, Pakete, `/kontakt`.
- **Case Studies** verlinken auf: passende Industrie-Seite + `/kontakt`.
- Add-on-Seiten (`/leistungen/seo`, `/leistungen/google-ads`) verlinken zurück
  auf `/leistungen/webseiten` als Hauptangebot.
- Footer/Header-Navigation um die Industrie-Seiten ergänzen (Header-Nav:
  `src/components/layout/Header.tsx`, Mobile: `src/components/layout/MobileNav.tsx`).
- Keine Orphan-Pages: jede indexierbare Route ist von mindestens einer anderen
  Seite verlinkt **und** in `src/app/sitemap.ts` enthalten.

---

## 8. Metadata-, Canonical- & JSON-LD-Anforderungen

### 8.1 Metadata
- Pro Route eigene `title` (≤ 60 Zeichen) + `description` (140–160 Zeichen).
- Titles der Money-Pages mit Website-Fokus + Lokalbezug (vgl.
  `docs/audits/seo-conversion-audit.md` Abschnitt 6).
- Keine doppelten Descriptions.
- Globale Defaults bleiben in `src/app/layout.tsx`.

### 8.2 Canonical
- Pro Money-Page `alternates.canonical` setzen (aktuell nur `/leistungen`).
- Root-Canonical bleibt entfernt, damit Pro-Page-Canonicals greifen.

### 8.3 Open Graph / Social
- **Offenes Problem:** Layout/Docs referenzieren ein automatisches OG-Bild
  (`src/app/opengraph-image.png`), die Datei wurde im Inventar **nicht
  gefunden**. Vor Launch: echtes OG-Bild (1200×630, Brand) bereitstellen oder
  Referenz korrigieren.

### 8.4 JSON-LD (strukturierte Daten – fehlt aktuell komplett auf öffentl. Routen)
Zentrale Helper-Datei `src/lib/seo/schema.ts` + Server-`<JsonLd>`-Komponente
(kein `"use client"`), eingebunden im Initial-HTML:

- `ProfessionalService` / `LocalBusiness` global (Name, Adresse, `areaServed`
  Saarland, `contactPoint`) – Daten aus `src/config/site.ts`.
- `Service` pro `/leistungen/webseiten` und pro `/branchen/*` (Provider-Referenz
  auf die Organisation).
- `BreadcrumbList` auf allen Unterseiten.
- `FAQPage` dort, wo FAQ sichtbar im HTML steht (Webdesign-Seite,
  Industrie-Seiten).
- `CreativeWork`/`Article` für `/projekte/[slug]` – **ohne** erfundene Zahlen.
- Bewusst **nicht**: `aggregateRating`/`review` ohne echte Bewertungen,
  `openingHours`/`priceRange` ohne sichtbare Entsprechung.

---

## 9. Robots & Sitemap
- `src/app/robots.ts`: interne Routen, `/go/`, `/api/`, Login weiterhin
  disallow. Industrie-Seiten **nicht** blockieren.
- `src/app/sitemap.ts`: neue indexierbare Routen (`/branchen/*`, ggf. `/preise`)
  ergänzen. `/leistungen/google-ads` erst aufnehmen, wenn `noindex` entfällt.

---

## 10. Offene SEO-Entscheidungen
- Eigene `/preise`-Route oder Paket-Sektion auf `/` + `/leistungen/webseiten`?
- Sanity aktiv anbinden oder Schemas entfernen?
- Standortseiten (`/standorte/*`) – ja/nein, und wann?
- Reihenfolge der Industrie-Seiten-Veröffentlichung (abhängig von Referenzen).
