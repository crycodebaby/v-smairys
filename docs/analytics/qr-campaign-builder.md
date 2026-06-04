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

1. Kampagne erstellen / bearbeiten / archivieren
2. Status: `draft`, `active`, `paused`, `archived`
3. Shortlink `/go/<slug>`, UTM-Ziel-URL, QR-SVG, QR-PNG
4. Copy: Shortlink, UTM-Ziel, Plausible-Suchwerte (Text, keine API)
5. Druck- und Test-Checkliste (localStorage, nur UI-Hilfe)
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

## Plausible

- Keine Plausible-API im Dashboard
- Business-Plan für MVP **nicht** nötig
- Goals: `form_submit_success`, `phone_click`, `calendar_click`, …
- Filter: Top Sources → Campaigns nach `utm_campaign`

Details: `docs/analytics/plausible-setup.md`, `docs/analytics/plausible-goals.md`

## Fallback

Wenn Supabase nicht konfiguriert ist oder die DB nicht erreichbar:

- Dashboard zeigt einen sichtbaren Hinweis und nutzt `MARKETING_CAMPAIGNS`
  aus `src/lib/marketing-campaigns.ts`
- CRUD ist deaktiviert
- `/go/[slug]` nutzt ebenfalls den statischen Fallback
