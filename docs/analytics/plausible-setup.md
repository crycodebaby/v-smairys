# Plausible-Setup & QR-/UTM-Auswertung – smairys.de

Praxisanleitung: Wie du Print-/QR-Kampagnen in Plausible auswertest, welche
Goals du manuell anlegen musst, was ohne Business-Plan geht – und wie du eine
QR-Kampagne live testest.

Voraussetzung im Code (bereits erledigt):

- Snippet liegt im Root-Layout (`<PlausibleAnalytics />`), Standard-Script
  `https://plausible.io/js/script.exclusions.js`.
- Auf `/intern/*`, `/kundenlogin`, `/login` wird das Snippet **nicht gerendert**.
- ENV: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` muss gesetzt sein (z. B. `smairys.de`),
  sonst lädt Plausible gar nicht.

---

## 1. QR-Kampagnen in Plausible finden

Eine Kampagne ist über ihre UTM-Parameter identifizierbar. Für
`vk-sommer-saarmitte-2026` (siehe `src/lib/marketing-campaigns.ts`):

| Parameter | Wert |
| --- | --- |
| `utm_source` | `visitenkarte` |
| `utm_medium` | `print` |
| `utm_campaign` | `vk-sommer-saarmitte-2026` |
| `utm_content` | `qr-v1` |

In Plausible:

1. Dashboard für `smairys.de` öffnen.
2. Im **„Top Sources"**-Block auf den Reiter wechseln:
   - **Campaigns** → zeigt `utm_campaign` (`vk-sommer-saarmitte-2026`).
   - **Sources** / **UTM Sources** → zeigt `utm_source` (`visitenkarte`).
   - **UTM Medium** → `print`.
   - **UTM Content** → `qr-v1` (unterscheidet QR-Varianten / Auflagen).
3. Auf einen Wert klicken = Filter setzen. So sieht man z. B. nur Besucher,
   die per Visitenkarten-QR kamen, inkl. deren Pageviews und Goal-Conversions.

---

## 2. UTM-Filter zum Auswerten

Empfohlene Filter-Kombination für eine Print-Kampagne:

- `utm_campaign = vk-sommer-saarmitte-2026` → alles dieser Kampagne.
- zusätzlich `utm_content = qr-v1` → nur diese QR-/Asset-Variante (wichtig,
  sobald es `qr-v2`, eine zweite Auflage o. ä. gibt).

Damit beantwortest du: „Wie viele Besucher/Goals brachte die Visitenkarte?"
Filter lassen sich kombinieren und als Segment speichern.

---

## 3. Goals manuell in Plausible anlegen

Plausible legt Custom-Event-Goals **nicht automatisch** an – nur Events, für die
ein Goal existiert, erscheinen als Conversion. Anlegen unter:

**Site Settings → Goals → + Add Goal → „Custom event"** und den Event-Namen
**exakt** eintragen (case-sensitiv!).

Anzulegen (Details + Prio siehe `plausible-goals.md`):

P0:

1. `form_submit_success` → Display Name: **Anfrage gesendet**
2. `phone_click` → Display Name: **Telefon geklickt**
3. `calendar_click` → Display Name: **Terminbuchung geklickt**

P1:

1. `email_click` → Display Name: **E-Mail geklickt**
2. `form_start` → Display Name: **Formular gestartet**
3. `cta_click` → Display Name: **CTA geklickt**
4. Pageview `/kontakt` → Display Name: **Kontaktseite besucht**

P2:

1. `form_submit_error` → Display Name: **Formularfehler**

Wichtig: Kein Legacy-Goal mehr für `CTA Click` oder `Contact Intent` anlegen.
Diese Namen wurden durch `cta_click`, `phone_click`, `email_click` und
`calendar_click` ersetzt.

UTM-Kampagnen sind **keine Goals**. Sie werden in Plausible unter
Sources/Campaigns ausgewertet (`utm_source`, `utm_medium`, `utm_campaign`,
`utm_content`).

---

## 4. Was geht OHNE Business-Plan?

Auf **allen** Plausible-Cloud-Plänen (inkl. Growth) sichtbar:

- Pageviews, Visitors, Visits, Bounce Rate, Visit Duration
- **UTM-Reports**: Campaign, Source, Medium, Content, Term → **die QR-/Print-
  Auswertung läuft vollständig hier.**
- Top Pages / Entry / Exit Pages
- Referrer / Sources
- Geräte, Browser, OS, Bildschirmgrößen, Länder
- **Goals / Conversions** (Custom Events + Pageview-Goals)
- **Realtime** (aktuelle Besucher, letzte 30 Min)

➡️ **Fazit: Für die QR-/UTM-Kampagnen-Messung ist KEIN Business-Plan nötig.**

---

## 5. Was würde Business zusätzlich freischalten?

- **Custom Property Breakdowns**: Aufschlüsselung von Events nach unseren Props
  (z. B. `cta_click` nach `location`/`cta_id`, `form_submit_success` nach
  `service_name`/`budget_range`). Auf Growth siehst du nur die Goal-Gesamtzahl,
  nicht die Aufschlüsselung nach Property.
- **Funnels** (z. B. `form_start` → `form_submit_success`).
- Längere Daten-Retention, mehr Team-Mitglieder, mehr Sites.

➡️ Business ist ein **Komfort-/Tiefe-Upgrade**, technisch **nicht erforderlich**
für die Kampagnen-Auswertung. Die aktuelle Auswertung funktioniert über Goals
und UTM-Reports ohne Custom-Property-Breakdowns. Business wird erst sinnvoll,
wenn du regelmäßig nach Props segmentieren oder Funnels bauen willst.

---

## 6. Warum sehen wir keine einzelnen Personen?

Plausible ist **bewusst** aggregiert und cookielos:

- Keine Cookies, kein localStorage-Identifier, keine persistente User-ID.
- Besucher werden über einen täglich rotierenden, gehashten, anonymen Schlüssel
  gezählt – nicht über die Zeit wiedererkennbar.
- Es gibt keine Personen-Profile, kein Cross-Site-Tracking, kein Fingerprinting.
- DSGVO-/ePrivacy-freundlich → deshalb betreiben wir es ohne Consent-Banner.

➡️ „Einzelne Personen" sind by design nicht abbildbar. Wer Personen-Zuordnung
zu Leads braucht, nutzt die separate, serverseitige Lead-Attribution
(`/api/contact`, siehe `docs/01-marketing-dashboard.md`) – getrennt von
Plausible und ohne PII an Plausible.

---

## 7. Live-Testplan: QR-Kampagne in Realtime prüfen

Minimaler End-to-End-Test (idealerweise auf der Produktions-Domain
`https://smairys.de`, weil das Snippet nur mit gesetzter
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` lädt):

1. **Inkognito-Fenster** öffnen (frische Session, keine alte Attribution).
2. `https://smairys.de/go/vk-sommer-saarmitte-2026` aufrufen.
3. Prüfen, dass die **finale URL** alle UTM-Parameter enthält:
   `https://smairys.de/?utm_source=visitenkarte&utm_medium=print&utm_campaign=vk-sommer-saarmitte-2026&utm_content=qr-v1`
   (Redirect ist **307**; Ziel ist die öffentliche Startseite, **keine** interne URL.)
4. In Plausible **Realtime** öffnen (Dashboard zeigt „Current visitors").
5. Prüfen, dass die Quelle **`visitenkarte`** (Source) bzw. die Kampagne
   `vk-sommer-saarmitte-2026` (Campaigns) auftaucht.
6. Auf der Seite einen **Kontakt-CTA** klicken (z. B. Hero-CTA, Mail-/Telefon-
   Link, „Im Google Kalender buchen").
7. Prüfen, dass das passende **Goal/Event** in Realtime/Goals erscheint
   (`cta_click`, `phone_click`, `email_click` oder `calendar_click`). Für den
   vollen Lead-Test das Kontaktformular absenden → `form_submit_success`.
8. Neues Inkognito-Fenster: **`https://smairys.de/kundenlogin`** öffnen.
9. Prüfen, dass diese interne Seite **NICHT** in Plausible auftaucht
   (kein neuer Pageview in Realtime; im DevTools-Network-Tab darf **kein**
   Request an `plausible.io/api/event` und **kein** Laden von
   `script.exclusions.js` erfolgen).

### Zusatz-Check für Altlasten

Falls `/kundenlogin` / `/intern/marketing` in **historischen** Berichten
auftauchen: Das sind Pageviews aus der Zeit **vor** diesem Fix. Going forward
werden keine mehr erfasst. Historische Daten lassen sich in Plausible nicht
selektiv löschen (nur „Reset stats" für die ganze Site).

---

## 8. Empfohlene Defense-in-Depth-Ergänzung im Dashboard (einmalig)

`data-exclude` ist eine **Legacy**-Funktion (nur `script.exclusions.js`).
Zukunftssicher ergänzend im Plausible-Dashboard:

**Site Settings → Shields → Pages → Add page**, jeweils hinzufügen:

- `/intern/*`
- `/kundenlogin`
- `/login`

So werden interne Pageviews serverseitig bei Plausible geblockt – unabhängig
davon, welche Script-Variante geladen wird. (Bis zu 30 Page-Patterns möglich.)
