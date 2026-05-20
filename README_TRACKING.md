# Smairys Tracking & Event Architektur

Diese Architektur stellt den Foundation-Layer für alle Tracking- und Conversion-Events der Smairys Website dar, optimiert für High-Ticket Google Ads Kampagnen und B2B-Leadgenerierung.

## 🏗️ Kernkomponenten

1. **`lib/tracking/events.ts`**: Die zentrale Schaltstelle für alle Events. Verhindert verstreute `window.dataLayer`-Aufrufe im Component-Tree.
2. **`lib/consent/consent-helper.ts`**: Liefert den aktuellen Consent-Status synchron zurück.
3. **`lib/attribution/attribution.ts`**: Sichert First-Touch Attribution-Daten (UTMs, Referrer) persistent im `sessionStorage`.
4. **`components/ui/TrackedButton.tsx`**: Drop-In Replacement für reguläre Buttons, welches automatisch korrekte Klick-Events mit sauberen Payload-Daten an die zentrale Schaltstelle feuert.
5. **`components/forms/ContactFormBase.tsx`**: Hochsichere, deduplizierende Formular-Komponente mit dynamischer Budgetlogik.

## 📝 Event Taxonomy
Es existiert ein strikt typisierter `TrackingPayload`, der u.a. folgende Schlüsselwerte voraussetzt:
- `event_name` (z.B. `form_submit_success`, `cta_click`)
- `page_type` & `page_path`
- Optional aber kritisch: `cta_id`, `form_id`, `service_name`, `budget_range`
- Automatisch angehängt: `utm_source`, `utm_medium`, `utm_campaign`, `referrer`, `consent_state`

## 🔒 Best Practices
- **Kein direkter gtag/dataLayer Aufruf** im UI. Immer `dispatchEvent()` aus `events.ts` nutzen.
- Das Event `form_submit_success` wird nur bei Status 200 der API ausgelöst.
- Eine ID/Session-Sperre in `ContactFormBase.tsx` verhindert, dass Leads mehrfach gefeuert werden, wenn der Nutzer die Seite neu lädt.
- Plausible (ohne Cookies) und GTM (nur bei `consent_state === 'granted'`) laufen parallel über dieselbe Pipeline.
