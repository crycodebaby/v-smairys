# 06 · QA-Checkliste vor Deploy / Druck

## Vor dem Deploy

- [ ] `npm run build` läuft ohne TypeScript-Errors durch
- [ ] `npm run lint` (optional) gibt nur bekannte Lints – keine neuen Warnings durch eigene Änderungen
- [ ] `.env.local` / Vercel-ENV: `ADMIN_DASHBOARD_PIN` gesetzt
- [ ] `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` gesetzt
- [ ] `NEXT_PUBLIC_PLAUSIBLE_SRC` zeigt auf eine `script.exclusions.js`-Variante
- [ ] `NEXT_PUBLIC_SITE_URL` gesetzt (sonst nutzt der QR-Code `https://smairys.de` als Fallback)

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
