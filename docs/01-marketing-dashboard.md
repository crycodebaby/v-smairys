# 01 · Marketing-Dashboard & QR-Workflow

## Zweck

Internes Dashboard für Robin, um Marketing- und Print-Kampagnen zu pflegen,
QR-Codes zu erzeugen und Kampagnen-Performance in Plausible nachzuvollziehen.
Bewusst kein SaaS, keine Mehrbenutzer-Funktion.

## Einstieg

- Öffentliche Login-URL: `https://smairys.de/kundenlogin`
- Sichtbar im Header über den unauffälligen „Kundenlogin"-Button
- Nach erfolgreicher PIN-Eingabe Redirect nach `/intern/marketing`
- Kein anderer Weg ins Dashboard – `/intern/*` ist Middleware-geschützt

## Konfiguration

In `.env.local` müssen mindestens diese Variablen gesetzt sein:

```env
# Login
ADMIN_DASHBOARD_PIN=1234              # 4-stellig
ADMIN_DASHBOARD_SECRET=…              # optional, ≥ 16 Zeichen

# Marketing & Site
NEXT_PUBLIC_SITE_URL=https://smairys.de
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=smairys.de
NEXT_PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.exclusions.js
```

`script.exclusions.js` ist Pflicht, damit `data-exclude` greift. Wenn du im
Plausible-Dashboard erweiterte Tracker brauchst (Outbound Links, File Downloads,
Tagged Events), kombinierst du die Suffixe – z. B.
`script.exclusions.outbound-links.js`. Im Plausible-Dashboard wird die exakt
benötigte URL angezeigt.

## Kampagne anlegen

Kampagnen sind statisch in `src/lib/marketing-campaigns.ts` definiert. Eintrag
hinzufügen, deploy, fertig.

Pflichtfelder:

| Feld | Beispiel |
|------|----------|
| `slug` | `vk-sommer-saarmitte-2026` |
| `internalName` | `VK_Sommer_SaarMitte_2026` |
| `externalTitle` | `Deine neue Website – Sommer 2026` |
| `status` | `draft` / `active` / `paused` / `archived` |
| `destinationPath` | `/` |
| `utm_source` | `visitenkarte` |
| `utm_medium` | `print` |
| `utm_campaign` | identisch zum `slug` |
| `utm_content` | z. B. `qr-v1` |

Konvention: `utm_campaign === slug`, alle Felder lowercase-kebab-case.
Verstöße erzeugen Warnings im Dashboard.

## Druck-Workflow

1. Im Dashboard `/intern/marketing` die Kampagne auswählen.
2. **QR-SVG öffnen** klicken → SVG wird unter `/intern/marketing/<slug>/qr.svg` ausgeliefert.
3. SVG ins Druck-Layout einbetten:
   - Mind. 2,0 × 2,0 cm (besser 2,5 × 2,5 cm bei Visitenkarte).
   - Quiet Zone (2 Module weißer Rand) **nicht beschneiden**.
   - Keine Logo-Overlays. Kontrast schwarz/weiß ist Pflicht.
4. Vor Druckfreigabe die Checkliste „Vor Druck testen" im Dashboard abhaken.
5. Druckdaten an Druckerei.

## Datenfluss QR-Scan

```
Scan QR-Code
   │
   ▼
https://smairys.de/go/<slug>
   │  (Server-Resolver, 307 Redirect)
   ▼
https://smairys.de/<destinationPath>?utm_source=…&utm_medium=…&utm_campaign=…&utm_content=…
   │  (Layout mountet <AttributionCapture />)
   ▼
First-Touch in localStorage  +  Last-Touch in sessionStorage
   │
   ▼
Optional: Lead-Submit (ContactFormBase)
   │  attribution.first + attribution.last in Payload
   ▼
/api/contact  →  Zod-Validierung + Rate-Limit
   │  ├─ Server-Log "NEUER LEAD" mit Attribution-Block (ohne PII)
   │  └─ serverseitige Weiterleitung an Formcarry (FORMCARRY_ENDPOINT)
   ▼
Formcarry-Dashboard / Mail (Lead inkl. UTM/Attribution)
```

## Plausible-Auswertung

- Top Sources / Top Campaigns → Filter nach `utm_source = visitenkarte` oder
  `utm_campaign = vk-sommer-saarmitte-2026`.
- Im Dashboard erzeugt der Button **„In Plausible öffnen"** direkt einen
  Filter-Link.
- Empfohlene Goals (Custom Events):
  1. `form_submit_success` – harte Conversion
  2. `Contact Intent` – mailto / tel / Booking
  3. `cta_click` – Engagement
  4. `form_start` – Funnel-Beginn

## Was nicht in Plausible landet

- Pageviews und Custom Events auf `/intern/*`, `/kundenlogin` und `/login`
  werden über `data-exclude` ausgeschlossen und zusätzlich client-seitig
  in `lib/analytics.ts` geblockt.
