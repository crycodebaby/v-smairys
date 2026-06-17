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
- [ ] **Hero primär „Kostenfreie Projektanalyse anfordern"**: öffnet Booking-Link
- [ ] **Hero sekundär „Leistungen ansehen"**: navigiert nach `/leistungen`
- [ ] **Service-Detail-Hero** (`/leistungen/webseiten`, `/leistungen/seo`): Primär-CTA öffnet Booking-Link
- [ ] **SEO „Reporting-Ansatz ansehen"**: scrollt zur seiteneigenen Form-Sektion `#anfrage` (kein toter Anker)
- [ ] **Services-Karten** (Startseite): führen nach `/leistungen/webseiten` · `/leistungen/seo` · `/leistungen/google-ads`
- [ ] **Kontakt-Sektion**: Anker `#kontakt` existiert auf der Startseite; Scroll-Ziel sichtbar
- [ ] **Homepage Abschluss-CTA**: „Kostenfreie Projektanalyse anfordern" (primär) + BookingCard-Rahmen ohne zweiten Kalender-Button; Formular rechts postet über `/api/contact`
- [ ] **Homepage Methode-CTAs**: Website-Potenzial / Lokale Marktchancen / Werbe-ROI → Booking-Link
- [ ] **Homepage Metadata**: Title „Premium-Websites für Unternehmen im Saarland | Smairys Netz-Manufaktur"
- [ ] **`/leistungen`-Übersicht CTA-Hierarchie**: genau **eine** BookingCard sichtbar (Mobile in-flow unter TOC, Desktop sticky Sidebar); **kein** zweites BookingCard im Footer
- [ ] **`/leistungen` Abschluss-CTA** (`LeistungenFinalCta`): „Erstgespräch buchen" → Booking-Link; „Ergebnisse ansehen" → `/projekte`
- [ ] **`/leistungen` Service-Kacheln**: weiche CTAs → `/#kontakt` (gültiger Formular-Anker auf Startseite)
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

### `/leistungen`

- [ ] **320 / 375 / 390 / 430 px**: kein horizontaler Seiten-Scroll; TOC horizontal scrollbar nur innerhalb der Nav (`overscroll-behavior-x: contain`)
- [ ] **Mobile**: Header-CTA + eine in-flow BookingCard – keine doppelte BookingCard im Footer
- [ ] **768 / 834 px (iPad Portrait)**: BookingCard in-flow, Final-CTA gestapelt, TOC-Tabs zentriert ab `md`
- [ ] **1024 px (Landscape)**: Sticky Booking-Sidebar aktiv (`lg+`), Final-CTA unterhalb des Grids
- [ ] **1366 / 1440 px+**: Sticky Sidebar kollidiert nicht mit Final-CTA; Anchor-Scroll landet unter TOC (`--leistungen-scroll-offset`)
- [ ] Service-Sections: `min-w-0` im Grid, keine Überbreite durch 3D-Figuren

### Homepage (`/`)

- [ ] **Pricing `#preise`**: drei Karten lesbar; Performance-System mit „Meistgewählt"-Badge visuell hervorgehoben; Branchen-Autorität als glaubwürdiger Preisanker
- [ ] **Pricing-CTAs**: Einstieg prüfen / Projektanalyse anfordern / Manufaktur-Projekt besprechen → Google Calendar; `cta_click` mit `pricing-digitales-fundament` · `pricing-performance-system` · `pricing-branchen-autoritaet`
- [ ] **320 / 375 / 390 / 430 px**: H1 mit `text-balance`, kein horizontaler Scroll; Pricing-Karten gestapelt, kein Overflow
- [ ] **iPad / Desktop**: Pricing 3-spaltig ab `lg`; mittlere Karte leicht angehoben (`-translate-y-1`)
- [ ] **Tablet (768 / 834 px)**: Branchen-Karten 1→3 Spalten; Prozess sticky links
- [ ] **Desktop (1366 / 1440 px+)**: klare Typo-Hierarchie (Kicker → H2 → Body); copper-Akzent sparsam
- [ ] **Keine Emojis, keine ROI-Garantien** in sichtbarer Copy
- [ ] Robin-Portrait: Alt-Text „Robin Schmeiries, Inhaber der Smairys Netz-Manufaktur"

### Allgemein

- [ ] **Kein horizontaler Overflow** auf öffentlichen Routen (siehe `npm run test:responsive`)
- [ ] **Hero** füllt genau einen Viewport (`100dvh`), Header-Offset via `--scroll-padding-top`
- [ ] **Anker-Links** (`#kontakt`, `#preise`) landen unter dem fixed Header
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
