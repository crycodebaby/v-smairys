# AGENTS.md – Smairys Netz-Manufaktur

Diese Datei ist der Kurz-Briefing-Block für jeden KI-Agenten oder neuen
Entwickler, der am Projekt arbeitet. **Bitte vor dem ersten Edit komplett lesen.**

## Projekt im Klartext

- **Stack:** Next.js 15 (App Router), React 19, TypeScript strict, Tailwind 3, Plausible Analytics.
- **Zweck:** öffentliche Marketing-Website + interne Tracking-/Kampagnen-Verwaltung für genau einen Nutzer (Robin).
- **Kein SaaS.** Kein Kundenportal. Kein Multi-Tenant.
- **Kein Supabase Auth, kein Clerk, kein NextAuth** – Authentifizierung ist absichtlich minimal.

## Architektur-Eckpfeiler

- `src/app/` – App Router. Öffentliche Seiten + `/intern/*` (geschützt) + `/kundenlogin`.
- `src/middleware.ts` – schützt `/intern/*` durch PIN-Session-Cookie.
- `src/lib/auth/` – PIN-Session (HMAC-signiertes Cookie, Web-Crypto, Edge-kompatibel) + Rate-Limit.
- `src/lib/marketing-campaigns.ts` – zentrale Kampagnen-Registry (typisierter `as const satisfies`-Block).
- `src/lib/analytics.ts` – typisierter Plausible-Helper.
- `src/lib/analytics-config.ts` – Liste der von Plausible auszuschließenden Pfade.
- `src/lib/attribution/attribution.ts` – First-Touch (localStorage) + Last-Touch (sessionStorage).
- `src/components/ui/glass/` – wiederverwendbare Liquid-Glass-Primitive (`GlassPanel`, `GlassButton`, `GlassCard`, `PinDots`, `PinKeypad`).
- `src/components/ui/CopyButton.tsx` – Clipboard-Helper für Dashboard & intern.
- `src/components/intern/` – nur fürs interne Dashboard genutzte Komponenten (`DebugCard`, `PrintChecklist`).

## Interner Zugang

- Öffentlicher Einstieg: `/kundenlogin` (Link unauffällig im Header).
- Auth-Mechanik: PIN-Eingabe → Server Action `loginWithPin` → HMAC-Cookie `smairys_intern_session` (httpOnly, secure in prod, sameSite=lax, 7 Tage).
- Geschützt: alles unter `/intern/*` (via Middleware).
- Dashboard (Marketing): `/intern/marketing`.
- ENV-Variablen für den Login (siehe `.env.example`):
  - `ADMIN_DASHBOARD_PIN` – 4-stellige Ziffernfolge (PFLICHT).
  - `ADMIN_DASHBOARD_SECRET` – optional, ≥ 16 Zeichen. Wenn leer, wird das HMAC-Secret deterministisch aus dem PIN abgeleitet.
- Logout: Server Action `logoutIntern` (Button im Dashboard rechts oben).
- **Niemals PIN/SECRET loggen, niemals an Client streamen.**

## Tracking-Regeln

- Plausible-Snippet liegt im Root-Layout (`<PlausibleAnalytics />`).
- Standard-Skript ist `https://plausible.io/js/script.exclusions.js` mit `data-exclude="/intern/*, /kundenlogin, /login"`.
- Zusätzlich: `lib/analytics.ts` und `lib/tracking/plausible.ts` no-open Events auf den ausgeschlossenen Pfaden.
- **Niemals PII (E-Mail, Name, Telefon, IP) als Plausible-Prop senden.** Properties sind ausschließlich kategoriale Werte.
- Attribution für Lead-Submits läuft separat (siehe `docs/01-marketing-dashboard.md`).

## Build-Notizen

- `npm run build` ist Pflichtchecks vor jedem Push. TypeScript-Errors blockieren den Build, ESLint nicht (bewusst entkoppelt in `next.config.ts`; `npm run lint` separat fahren).
- Keine neuen Dependencies ohne Grund. Aktuell zugekauft: `qrcode` (server-side QR-SVG).

## Docs

- `docs/01-marketing-dashboard.md` – Marketing-Dashboard & QR-Workflow.
- `docs/04-ui-design-system.md` – Glass-Komponenten & Conventions.
- `docs/06-qa-checklist.md` – QA-Checkliste vor Deploy/Druck.

## Don'ts

- Keine PII in localStorage/sessionStorage.
- Keine Auth-Erweiterung Richtung User-System ohne explizite Anfrage.
- Keine Tracking-Events auf `/intern/*` oder `/kundenlogin`.
- Keine Secrets in Code/Client/Logs.
- Kein „kleines bisschen `any`". Wenn nötig: `unknown` + Narrowing.
