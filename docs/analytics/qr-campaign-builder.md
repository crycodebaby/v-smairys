# QR Campaign Builder Status

## Aktueller Stand

1. Kampagnen werden aktuell **statisch aus Code** geladen:
   `src/lib/marketing-campaigns.ts`.
2. `/intern/marketing` hat bereits eine interne, PIN-geschützte
   Listen-/Detail-UI mit QR-Code, Shortlink, UTM-Zielvorschau, Copy-Buttons,
   Plausible-Link und Validierungshinweisen.
3. Es gibt noch **keine UI zum Erstellen** neuer Kampagnen.
4. Es gibt noch **keine UI zum Bearbeiten, Pausieren oder Archivieren**.
5. Es gibt noch **keine Persistenz** für Kampagnen außerhalb des Codes.
6. Es gibt noch **keine eigene Redirect-Zählung**. Plausible bleibt die Quelle
   für echte Websitebesuche und Conversions.
7. Supabase ist im aktuellen Code nicht angebunden. Es gibt keine
   Supabase-Client-Erzeugung, keine Supabase-ENV-Konfiguration und keine
   Tabellenzugriffe.

## Warum noch kein Fake-Builder implementiert wurde

Ein Campaign Builder ohne echte serverseitige Speicherung würde Robin eine
Scheinsicherheit geben: Kampagnen könnten im Browser angelegt wirken, wären
aber nach Reload/Deploy weg und würden nicht von `/go/[slug]` oder der QR-Route
aufgelöst. Deshalb wurde bewusst **keine localStorage-Persistenz** und kein
halb angebundener Builder gebaut.

## Nächster technischer Schritt

1. Supabase-Projekt anbinden (serverseitig, keine Service-Credentials im Client).
2. Schema aus `docs/analytics/qr-campaign-builder-schema.sql` ausführen.
3. Serverfunktionen für Create/Update/Archive implementieren, nur hinter
   `/intern/*` und PIN-Session.
4. `/intern/marketing`, `/go/[slug]` und die QR-SVG-Route auf DB-Lookups
   umstellen, mit Code-Registry höchstens als Migration/Seed.
5. Optional `qr_redirect_daily_counts` in `/go/[slug]` inkrementieren.

## MVP-Felder

- `internal_name`
- `external_title`
- `slug`
- `status` (`draft`, `active`, `paused`, `archived`)
- `destination_path`
- `utm_source`
- `utm_medium` (Default `print`)
- `utm_campaign`
- `utm_content`
- `utm_term` optional
- `notes` optional

## Validierungsregeln

- `slug` lowercase-kebab-case
- `utm_campaign` lowercase-kebab-case
- Pflichtfelder nicht leer
- `destination_path` relativ mit `/`
- keine internen Ziele: `/intern/*`, `/kundenlogin`, `/login`, `/api/*`
- `active` nur bei validen Pflichtfeldern

## Redirect-Zählung

Die vorbereitete Tabelle `qr_redirect_daily_counts` zählt nur technische
Shortlink-Nutzung aggregiert pro `slug` und `date`.

Nicht speichern:

- keine IP
- kein User-Agent
- kein Fingerprint
- keine personenbezogenen Profile

Plausible bleibt maßgeblich für Besucher, Quellen, Kampagnen und Conversions.
