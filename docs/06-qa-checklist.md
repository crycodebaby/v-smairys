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
- [ ] Auf der Startseite `/` werden Pageviews und Events gefeuert (sichtbar in Plausible Realtime)

## Marketing-Dashboard

- [ ] Kampagne `vk-sommer-saarmitte-2026` ist sichtbar und Status = `active`
- [ ] „QR-Link kopieren" legt `https://smairys.de/go/vk-sommer-saarmitte-2026` in die Zwischenablage
- [ ] „UTM-Ziel-URL kopieren" legt die UTM-URL in die Zwischenablage
- [ ] „Plausible-Kampagne kopieren" legt `vk-sommer-saarmitte-2026` in die Zwischenablage
- [ ] „QR-SVG öffnen" liefert ein druckbares SVG (Content-Type `image/svg+xml`)
- [ ] Großer QR-Code wird inline angezeigt
- [ ] Druck-Checkliste: Haken bleiben nach Reload erhalten (localStorage)
- [ ] Debug-Karte: ADMIN_DASHBOARD_PIN = ja · NEXT_PUBLIC_PLAUSIBLE_DOMAIN = ja · Kampagnen geladen = 1

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
