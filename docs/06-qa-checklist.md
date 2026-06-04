# 06 · QA-Checkliste vor Deploy / Druck

## Vor dem Deploy

- [ ] `npm run build` läuft ohne TypeScript-Errors durch
- [ ] `npm run lint` (optional) gibt nur bekannte Lints – keine neuen Warnings durch eigene Änderungen
- [ ] `.env.local` / Vercel-ENV: `ADMIN_DASHBOARD_PIN` gesetzt
- [ ] `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` gesetzt
- [ ] `NEXT_PUBLIC_PLAUSIBLE_SRC` zeigt auf eine `script.exclusions.js`-Variante
- [ ] `NEXT_PUBLIC_SITE_URL` gesetzt (sonst nutzt der QR-Code `https://smairys.de` als Fallback)
- [ ] `FORMCARRY_ENDPOINT` gesetzt (server-only, **kein** `NEXT_PUBLIC_`) – Wert: `https://formcarry.com/s/JOH5HI9XWVI`

## Kontaktformular → Formcarry (kanonischer Lead-Flow)

Kanonischer Pfad: `ContactFormBase` → `POST /api/contact` → Formcarry. Es gibt
**keinen** clientseitigen Direkt-Post mehr.

- [ ] DevTools → Network: Formular-Submit geht an `/api/contact` (POST), **nicht** direkt an `formcarry.com`
- [ ] Quelltext/JS-Bundle: kein clientseitiger `formcarry.com`-Request (Search im Sources-Tab nach `formcarry`)
- [ ] Gültiger Submit → UI zeigt Success-Panel („Vielen Dank.")
- [ ] Pflichtfeld fehlt / ungültige E-Mail → 400, UI zeigt Fehler-Alert, kein Erfolg
- [ ] Honeypot (`honeypot`) gefüllt → Submit wird abgelehnt (kein Lead)
- [ ] Rate-Limit: > 5 Submits/Minute pro IP → 429 mit Hinweistext
- [ ] `FORMCARRY_ENDPOINT` fehlt/leer → API antwortet 502, UI zeigt sichere Fehlermeldung, Server-Log: `FORMCARRY_ENDPOINT ist nicht gesetzt`
- [ ] Formcarry-Fehler (z. B. falscher Endpoint) → 502 + **redacted** Server-Log (nur HTTP-Status/Reason, **kein** Name/E-Mail/Telefon)
- [ ] Server-Log enthält **keine** PII (Name/E-Mail/Telefon) – nur Service/Budget/Attribution-Block
- [ ] Tracking-Events feuern weiterhin: `form_start`, `form_submit_success`, `form_submit_error`
- [ ] **Manueller End-to-End-Test (echter Lead):** Submit → Eintrag erscheint im Formcarry-Dashboard inkl. UTM/Attribution-Felder
- [ ] Lead nach QR-Scan: First-/Last-Touch-UTMs (`utm_source=visitenkarte`, `utm_campaign=…`) landen im Formcarry-Eintrag

## CTA-Navigation (öffentliche Seiten)

Primäre Conversion = **Erstgespräch buchen**. Buchungslink zentral in
`SITE.booking.calendarUrl` (`https://calendar.app.google/PAdzgiQrN6h5RmqY8`).
Jeder öffentliche CTA muss navigieren **und** weiterhin tracken.

- [ ] **Booking-Link öffnet korrekt**: alle Primär-CTAs öffnen die Google-Calendar-URL in neuem Tab (`target="_blank"`, `rel="noopener noreferrer"`)
- [ ] **Header primär „Kontakt aufnehmen"**: öffnet Booking-Link – bzw. `/#kontakt`, falls `booking.enabled = false`
- [ ] **Header „Kundenlogin"-Pille**: routet weiterhin nach `/kundenlogin` (kein Tracking)
- [ ] **Hero primär „Projektanfrage starten"**: öffnet Booking-Link
- [ ] **Hero sekundär „Unsere Expertise"**: navigiert nach `/leistungen`
- [ ] **Service-Detail-Hero** (`/leistungen/webseiten`, `/leistungen/seo`): Primär-CTA öffnet Booking-Link
- [ ] **SEO „Reporting-Ansatz ansehen"**: scrollt zur seiteneigenen Form-Sektion `#anfrage` (kein toter Anker)
- [ ] **Services-Karten** (Startseite): führen nach `/leistungen/webseiten` · `/leistungen/seo` · `/leistungen/google-ads`
- [ ] **Kontakt-Sektion**: Anker `#kontakt` existiert auf der Startseite; Scroll-Ziel sichtbar
- [ ] **`/leistungen`-Übersicht**: „Erstgespräch anfragen" + Service-Kacheln → `/#kontakt`; „Ergebnisse ansehen" → `/projekte` (kein toter `#testimonials`-Anker mehr); BookingCard → Booking-Link
- [ ] **Keine toten Anker**: jedes `#`-Ziel (`#kontakt`, `#anfrage`) existiert auf der jeweiligen Seite
- [ ] **Footer-CTAs**: `mailto:`/`tel:` aus Footer + `ContactInfoCard` funktionieren (Contact-Intent-Event feuert)
- [ ] **Mobile-CTA**: Drawer zeigt „Erstgespräch buchen" (Booking, neuer Tab) als Primär-CTA + Telefon (`tel:`) + „Anfrage schreiben" (`mailto:`)
- [ ] Kein öffentlicher CTA mit `href="#"`, leerem `href` oder reinem `<button>` ohne Aktion
- [ ] Tastatur: alle CTAs fokussierbar und per Enter auslösbar; externe Links mit sichtbarem Fokusring
- [ ] **Tracking feuert weiter**: `cta_click` (Header/Hero/Services) + `Contact Intent` (Booking/`tel:`/`mailto:`) auf `/`; **keine** Events auf `/intern/*` oder `/kundenlogin`
- [ ] **Kontaktformular** postet weiterhin über `ContactFormBase → /api/contact` (Formcarry-Flow unverändert)
- [ ] **CEO-Portrait**: lädt auf Startseite (`TrustSection`) und `/ueber-uns` ohne Verzerrung; Alt-Text „Robin Schmeiries, Inhaber der Smairys Netz-Manufaktur"

## Login / interner Bereich

- [ ] `/kundenlogin` öffnet und zeigt den PIN-Block
- [ ] Falscher PIN: Shake-Animation, Fehlertext, Cookie wird **nicht** gesetzt
- [ ] Korrekter PIN: Redirect nach `/intern/marketing`
- [ ] DevTools → Application → Cookies: `smairys_intern_session` ist `httpOnly`, in Production `Secure`, `SameSite=Lax`
- [ ] Nach 5 falschen Versuchen kommt Rate-Limit-Meldung mit Retry-Zeit
- [ ] `/intern/marketing` ohne Cookie → Redirect zu `/kundenlogin?next=/intern/marketing`
- [ ] Logout-Button: Cookie wird gelöscht, Redirect zur Startseite

## Plausible-Ausschluss

- [ ] DevTools → Network: auf `/intern/marketing` darf **kein** Request an `plausible.io/api/event` rausgehen
- [ ] DevTools → Network: auf `/kundenlogin` darf **kein** Request an `plausible.io/api/event` rausgehen
- [ ] DevTools → Application → Local Storage: nach `?utm_source=test` auf `/intern/marketing` wird **kein** `smairys_first_touch_v2` geschrieben
- [ ] Auf der Startseite `/` werden Pageviews und Events gefeuert (sichtbar in Plausible Realtime)
- [ ] Marketing-Footer ist auf `/intern/*` und `/kundenlogin` **nicht** sichtbar

## Marketing-Dashboard

- [ ] Kampagne `vk-sommer-saarmitte-2026` ist sichtbar und Status = `active`
- [ ] „QR-Link kopieren" legt `https://smairys.de/go/vk-sommer-saarmitte-2026` in die Zwischenablage
- [ ] „UTM-Ziel-URL kopieren" legt die UTM-URL in die Zwischenablage
- [ ] „Plausible-Kampagne kopieren" legt `vk-sommer-saarmitte-2026` in die Zwischenablage
- [ ] „QR-SVG öffnen" liefert ein druckbares SVG (Content-Type `image/svg+xml`)
- [ ] Großer QR-Code wird inline angezeigt
- [ ] Druck-Checkliste: Haken bleiben nach Reload erhalten (localStorage)
- [ ] Debug-Karte ist standardmäßig eingeklappt, Chevron öffnet die Sektion
- [ ] Debug-Karte zeigt nur: `ADMIN_DASHBOARD_PIN` (Pflicht), `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PLAUSIBLE_SRC`, `ADMIN_DASHBOARD_SECRET` (alle optional) – keine Supabase-Variablen
- [ ] Master-Detail: Klick auf eine Kampagne in der Liste lädt das Detail mit `animate-panel-in`-Transition

## Responsive QA

- [ ] Mobile (~390 px): `/kundenlogin` PIN-Tastatur passt ohne horizontalen Scroll
- [ ] Mobile (~390 px): `/intern/marketing` zeigt Liste über Detail, QR-Code skaliert proportional
- [ ] iPad Portrait (768 px): Master-Detail steht in 2 Spalten, QR liegt unter dem Hero
- [ ] iPad Pro Landscape (1366 px): QR liegt rechts neben dem Hero (`md:grid-cols-[1fr_15rem]`/`lg:1fr_18rem`)
- [ ] Desktop (≥ 1440 px): Container bricht auf `max-w-7xl`, Layout bleibt zentriert
- [ ] Keine ausgewaschenen Buttons – Glass-Tiles haben Top-Highlight + Hover-Chroma sichtbar
- [ ] Header-Kundenlogin-Pille: Lock-Icon sichtbar, auf Mobile Label „Login", auf `sm+` „Kundenlogin"

## Visitenkarten-Test (Druckfreigabe)

- [ ] `https://smairys.de/go/vk-sommer-saarmitte-2026` → 307 Redirect mit UTMs im `Location`-Header
- [ ] `curl -I` zeigt `Cache-Control: no-store, max-age=0` und `X-Robots-Tag: noindex, nofollow`
- [ ] iPhone Standard-Kamera: Scan funktioniert, Redirect öffnet die Startseite
- [ ] Android Standard-Kamera / Google Lens: Scan funktioniert
- [ ] Plausible Realtime zeigt den Scan binnen 30 s mit UTMs
- [ ] Lead-Test: Kontaktformular abschicken nach QR-Scan → Server-Log zeigt First-Touch-Block mit `utm_source=visitenkarte`, `utm_campaign=vk-sommer-saarmitte-2026`

## SEO / robots

- [ ] `/robots.txt` enthält `Disallow: /intern/` und `Disallow: /go/`
- [ ] HTML von `/intern/marketing` enthält `<meta name="robots" content="noindex,nofollow,nocache">`
- [ ] HTML von `/kundenlogin` enthält dieselben Robots-Direktiven
- [ ] `Sitemap.xml` listet **keine** internen Routen

## Security

- [ ] PIN wird nirgends in HTML, JS-Bundle oder Console geloggt (Sanity-Check: Browser-DevTools → Sources → Search "ADMIN_DASHBOARD_PIN")
- [ ] Server-Log nach erfolglosem Login enthält keine PIN-Versuche
- [ ] Cookie `smairys_intern_session` ist nur via JS **nicht** lesbar (httpOnly, prüfen via `document.cookie` in DevTools-Console)
