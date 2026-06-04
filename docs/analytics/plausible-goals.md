# Plausible Goals & Custom Events

Quelle der Wahrheit ist `src/lib/tracking/event-names.ts`. Plausible-Goal-Namen
sind exakt und case-sensitiv.

## Canonical Events

| Event | Display Name | Ausgelöst wann | Props | PII? | Goal | Prio |
| --- | --- | --- | --- | --- | --- | --- |
| `form_submit_success` | Anfrage gesendet | Kontaktformular wurde erfolgreich an `/api/contact` gesendet | `form_id`, `page_type`, `service_name`, `budget_range`, UTM-/Attribution-Felder | Nein | Ja | P0 |
| `phone_click` | Telefon geklickt | Klick auf Telefon-CTA (`tel:`) | `location` | Nein | Ja | P0 |
| `calendar_click` | Terminbuchung geklickt | Klick auf Kalender-/Termin-CTA | `location` | Nein | Ja | P0 |
| `email_click` | E-Mail geklickt | Klick auf E-Mail-CTA (`mailto:`) | `location` | Nein | Ja | P1 |
| `form_start` | Formular gestartet | Kontaktformular wurde in der Session erstmals gestartet | `form_id`, `page_type`, UTM-/Attribution-Felder | Nein | Ja | P1 |
| `cta_click` | CTA geklickt | Generischer CTA ohne eigene Business-Event-Kategorie | `cta`, `location` oder `cta_id`, `cta_label`, `cta_position`, `page_type` | Nein | Ja | P1 |
| Pageview `/kontakt` | Kontaktseite besucht | Besuch der öffentlichen Kontaktseite | keine Custom-Props | Nein | Ja, als Pageview-Goal | P1 |
| `form_submit_error` | Formularfehler | Kontaktformular konnte nicht erfolgreich gesendet werden | `form_id`, `page_type`, `service_name`, UTM-/Attribution-Felder | Nein | Optional | P2 |

## Reserviert, aktuell nicht als Plausible-Goal

| Event | Zweck |
| --- | --- |
| `qr_redirect` | Reservierter Name für eine mögliche spätere serverseitige Shortlink-Nutzung. Aktuell bleibt Plausible Quelle für echte Websitebesuche und Conversions; die vorbereitete DB-Zählung wäre nur technisch aggregiert pro Slug/Tag. |

Hinweis: Die aktuell implementierte Supabase-Redirect-Zählung sendet kein
Plausible-Event `qr_redirect`. Sie zählt serverseitig nur
`campaign_slug`/`date`/`count`. Plausible bleibt für Websitebesuche und
Conversions zuständig.

## Entfernte Legacy-Namen

Nicht mehr als Goal anlegen und nach der Umstellung nicht mehr im Code feuern:

- `CTA Click`
- `Contact Intent`
- `Section Viewed`

## Datenschutz

- Telefonnummer, E-Mail-Adresse und Kalender-URL werden **nicht** als Plausible-Props gesendet.
- Formular-PII (Name, E-Mail, Telefon) geht nur an `/api/contact`, nicht an Plausible.
- Interne Routen `/intern/*`, `/kundenlogin`, `/login` laden kein Plausible-Script und senden keine Events.
- Custom Properties sind nice-to-have für spätere Business-Auswertung, aber für die aktuelle Goal- und UTM-Auswertung keine Voraussetzung.

## Plausible Goals Anlegen

P0:

- `form_submit_success` → **Anfrage gesendet**
- `phone_click` → **Telefon geklickt**
- `calendar_click` → **Terminbuchung geklickt**

P1:

- `email_click` → **E-Mail geklickt**
- `form_start` → **Formular gestartet**
- `cta_click` → **CTA geklickt**
- Pageview `/kontakt` → **Kontaktseite besucht**

P2:

- `form_submit_error` → **Formularfehler**

UTM-Kampagnen brauchen kein Goal. Sie sind in Plausible unter Sources/Campaigns sichtbar (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`).
