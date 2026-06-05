# QR Campaign Builder

## Zielbild

Das interne Marketing Control Center unter `/intern/marketing` verwaltet
Print-/QR-Kampagnen. **Plausible** bleibt die einzige Quelle für Besucher,
Kampagnen-Auswertung und Conversions. Das Dashboard baut **kein** eigenes
Analytics-System und zeigt **keine** Besucherzahlen.

## Architektur

| Schicht | Aufgabe |
|--------|---------|
| Supabase `marketing_campaigns` | Persistente Kampagnen (CRUD) |
| `/go/[slug]` | 307-Redirect mit UTMs (nur `active`) |
| Plausible | Pageviews, Sources/Campaigns, Goals |
| Statischer Fallback | Nur wenn Supabase Env fehlt oder DB nicht erreichbar |

- Kein Supabase Auth, kein CRM, kein Kundenportal
- Service Role Key nur serverseitig (`src/lib/supabase/server.ts`)
- PIN-Schutz über Middleware für `/intern/*`
- MCP/Supabase: zuerst lesen, Migrationen nur gezielt ausführen

## Dashboard-Funktionen (MVP)

1. Kampagne erstellen / bearbeiten / duplizieren / archivieren
2. Status: `draft`, `active`, `paused`, `archived`
3. Shortlink `/go/<slug>`, UTM-Ziel-URL, QR-SVG (gebrandet), QR-PNG (Standard)
4. Copy: Shortlink, UTM-Ziel, Plausible-Suchwerte (Text, keine API)
5. QR-Style-Auswahl pro Kampagne im QR-Sheet (6 sichere Presets)
6. Einfache Suche: Name, Slug, Region, Stadt
7. Zielseite aus vordefinierten öffentlichen Pfaden wählen

## Supabase-Schema

SQL: `docs/analytics/qr-campaign-builder-schema.sql`

Tabellen:

- `marketing_campaigns` (Pflicht für MVP)
- `qr_redirect_daily_counts` (optional, nicht im Dashboard; keine IP/UA)

RLS ist aktiv, ohne öffentliche Policies – Zugriff nur über Service Role.

### MVP-Felder `marketing_campaigns`

- `internal_name`, `external_title`, `slug` (unique)
- `status`, `destination_path`
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- `medium_label`, `region`, `city`, `year`, `version`, `notes`

### Validierung (DB + App)

- `slug` und `utm_campaign`: lowercase-kebab-case
- `destination_path` relativ, nicht `/intern*`, `/kundenlogin*`, `/login*`
- `active` nur mit vollständigen Pflichtfeldern inkl. `utm_content`

## Env-Variablen

Lokal in `.env.local` (nicht committen):

- `NEXT_PUBLIC_SUPABASE_URL` (Pflicht)
- `SUPABASE_SERVICE_ROLE_KEY` (Pflicht, nur Server)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional, wird vom MVP nicht genutzt)

Siehe auch `.env.example`.

### Vercel ENV (Pflicht für Live/Preview)

Damit `/intern/marketing` und `/go/[slug]` Supabase nutzen (statt statischem
Fallback), müssen in Vercel folgende Variablen gesetzt sein:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (Server-only; niemals als `NEXT_PUBLIC_*`)

Schritte:

1. Vercel → Project → Settings → Environment Variables.
2. Beide Variablen für **Production** **und** **Preview** anlegen.
3. Nach dem Setzen **Redeploy** auslösen (ENV-Änderungen greifen erst beim
   nächsten Build/Deploy).
4. `.env.local` bleibt lokal und wird **nie committet** (steht in `.gitignore`).

Ohne diese ENV läuft die App im sichtbaren statischen Fallback; CRUD ist dann
deaktiviert.

## Manuelle Schritte (einmalig)

1. Supabase-Projekt verlinken, Env Vars in Vercel + lokal setzen
2. Migration ausführen (SQL Editor oder MCP `apply_migration`)
3. Seed-Kampagne per Upsert auf `slug` (oder Dashboard anlegen)
4. `npm run build`, deploy, `/intern/marketing` testen

## Redirect `/go/[slug]`

- Supabase-first, sonst statischer Fallback
- Nur `status = active` → 307 mit UTMs
- `draft` / `paused` / `archived` → 404
- Interne Ziele werden blockiert
- Keine Redirect-Zählung im MVP (Plausible zählt Besuche)

## QR-Branding (Style-Presets)

Grundsatz: **Scan-Sicherheit vor Optik.** Immer dunkle Module auf weißem
Grund, Quiet Zone bleibt erhalten, Finder-Ecken bleiben klar erkennbar.

Presets (`src/lib/qr/qr-styles.ts`):

| Preset | Module | Error Correction | Empfohlen für | Scan-Sicherheit |
|--------|--------|------------------|---------------|-----------------|
| `clean-print` (Clean Print) | eckig, schwarz/weiß | Q | **Visitenkarte** | Hoch |
| `smairys-brand` (Smairys Brand) | abgerundet, warmes Near-Black, dunkler Amber-Finder | H | Flyer | Hoch |
| `premium-poster` (Premium Poster) | runde Dots, gestylte Ecken, mehr Quiet Zone | H | Poster | Mittel |
| `rounded-classic` (Rounded Classic) | abgerundet, schwarz, runde Finder | H | Flyer | Hoch |
| `dense-safe` (Dense Safe) | eckig, schwarz, extra Quiet Zone | H | Visitenkarte | Hoch |
| `soft-amber` (Soft Amber) | abgerundet, Near-Black + Amber-Finder | H | Flyer | Hoch |

- **Empfehlung Visitenkarte:** `clean-print` oder `dense-safe` (maximale
  Scanbarkeit, robuste Quiet Zone auf kleiner Fläche).
- **SVG ist für Druck zu bevorzugen** (vektoriell, beliebige Auflösung). Das
  gebrandete Styling läuft ausschließlich über das SVG.
- **PNG bleibt Standard** (schwarz/weiß, eckig): `qrcode` rendert PNG nur
  klassisch; eine Rasterisierung des SVG würde eine zusätzliche Dependency
  erfordern. PNG ist im UI klar als „Standard" markiert (schnelle Vorschau).
- **Logo:** im MVP überall deaktiviert (kein passendes dunkles Logo-Asset für
  weißen Grund, Scan-Sicherheit hat Vorrang). Renderer unterstützt es vorbereitet.

Technik:

- QR-Matrix weiterhin via `qrcode` (`QRCode.create`); eigener, scan-sicherer
  SVG-Renderer in `src/lib/qr/render-qr-svg.ts` (keine neue Dependency).
- Routen: `/intern/marketing/<slug>/qr.svg?style=<preset>` und `…/qr.png?style=<preset>`
  (PNG nutzt `style` nur für Error-Correction/Quiet-Zone, bleibt optisch Standard).
- QR-Vorschau + Style-Auswahl + Export liegen im **QR-Sheet** (`QrSheet`,
  über „QR anzeigen" im Asset-Kit), nicht mehr dauerhaft im Hauptlayout.

### Warum keine `qr-code-styling`-Library?

Geprüft, aber **nicht** eingebaut. `qr-code-styling` ist eine DOM-/Browser-Lib:
serverseitiges SVG braucht `jsdom`, PNG braucht zusätzlich natives `canvas`
(cairo/pango). Unsere QR-Routen rendern serverseitig (Node-Runtime auf Vercel),
wo native Canvas-Deps unzuverlässig/aufwändig sind. Der eigene Renderer liefert
ohne jegliche Runtime-DOM-Abhängigkeit sauberes, scan-sicheres SVG. Daher:
**keine neue Dependency**, stattdessen den bestehenden Renderer auf 6 Presets
erweitert. Standard-Schwarz/Weiß (`clean-print`) bleibt als Fallback.

> **Vor Druck immer testen:** jeden finalen QR-Code mit **iPhone (Kamera)** und
> **Android** scannen, bevor er in den Druck geht.

## Plausible

- Keine Plausible-API im Dashboard
- Business-Plan für MVP **nicht** nötig
- Goals: `form_submit_success`, `phone_click`, `calendar_click`, …
- Filter: Top Sources → Campaigns nach `utm_campaign`

Details: `docs/analytics/plausible-setup.md`, `docs/analytics/plausible-goals.md`

## Builder-Presets (Supabase)

Tabelle `campaign_builder_presets` speichert die dynamischen Chips für
Medium, Region, Thema und Version. **Keine hard-coded Preset-Listen** mehr
als Hauptquelle im Code (`builder-presets.ts` enthält nur Ableitungslogik).

- Kategorien: `medium`, `region`, `topic`, `version`
- Zugriff: server-only via Service Role (`src/lib/campaign-builder-presets-db.ts`)
- RLS aktiv, keine öffentlichen Policies
- Presets werden **einmal serverseitig** in `page.tsx` geladen und an den
  Builder übergeben – nicht bei jedem Tastendruck
- Neues Wort: Eingabe + `+` → Server Action `createBuilderPresetAction` →
  Supabase Insert → `revalidatePath` → Chip erscheint sofort im Builder
- Leere Kategorie: Empty-State „Erstes Wort hinzufügen" (kein Code-Fallback)

Zielseiten im Builder sind bewusst auf drei Optionen begrenzt:

- `/` Startseite
- `/kontakt` Kontakt
- `/leistungen/webseiten` Website erstellen

Freie Zielseite nur im Advanced-Bereich (mit serverseitiger Validierung).

Scrollbars: Klasse `.intern-scrollbar` nur auf `/intern/*` (Layout + Sheets),
nicht auf der öffentlichen Website.

## Query-Schutz / Performance

- Kampagnen werden **einmal serverseitig** pro Request in `page.tsx`
  (`listMarketingCampaigns`) geladen – kein Client-Fetch, keine `useEffect`-Loops.
- Builder-Presets werden **ebenfalls einmal** pro Request geladen
  (`listCampaignBuilderPresets`).
- Suche und Status-Filter laufen **rein clientseitig** über die bereits
  geladene Liste (`useMemo`), also **keine DB-Abfrage pro Tastendruck**.
- Server Actions (`actions.ts`) validieren Inputs serverseitig und prüfen die
  PIN-Session (`requireInternSession`) bei Create/Edit/Archive/Preset-Anlage.
- Slug/`utm_campaign` werden serverseitig per `slugify` normalisiert
  (reparierend statt nur ablehnend).
- Service Role bleibt server-only (`src/lib/supabase/server.ts`,
  `import "server-only"`); alle DB-Zugriffe sind in
  `src/lib/marketing-campaigns-db.ts` zentralisiert.
- Keine rekursiven oder wiederholten DB-Zugriffe im Dashboard-Render.

## UI / Builder

- IA: linke Sidebar (Info-Counts + Datenquelle, touchfreundliche „Neue Kampagne"
  Action-Bar, Suche, Status-Filter, Liste), rechts das Print-Asset-Kit.
- Builder ist ein minimalistisches Glass-Sheet: Titel → Status → Zielseite →
  dynamische Preset-Chips (Supabase) → abgeleitete Werte → Advanced (zu) → Notizen.
- Archivieren **nicht** im Edit-Sheet – nur als eigene Aktion im Asset-Kit
  mit Confirm-Dialog.
- Native Selects ersetzt durch Glass-Komponenten: Status = Segmented Control,
  Zielseite = Glass-Listbox (3 feste Optionen), Presets = Chip-Auswahl + Inline-Add.
- Systemstatus liegt im Glass-Dialog (Button „Systemstatus"); ein dezenter
  Deployment-/Versionshinweis steht im Footer (`VERCEL_ENV`,
  `VERCEL_GIT_COMMIT_REF`, `VERCEL_GIT_COMMIT_SHA`; Fallback `local`).

## Fallback

Wenn Supabase nicht konfiguriert ist oder die DB nicht erreichbar:

- Dashboard zeigt einen sichtbaren Hinweis und nutzt `MARKETING_CAMPAIGNS`
  aus `src/lib/marketing-campaigns.ts`
- CRUD ist deaktiviert
- `/go/[slug]` nutzt ebenfalls den statischen Fallback
