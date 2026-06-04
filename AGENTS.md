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
- `src/components/ui/glass/` – wiederverwendbare Liquid-Glass-Primitive (`GlassPanel`, `GlassButton`, `GlassCard`, `StatusChip`, `Toolbar`, `ToolbarBrand`, `PinDots`, `PinKeypad`).
- `src/components/ui/CopyButton.tsx` – Clipboard-Helper für Dashboard & intern.
- `src/components/intern/` – nur fürs interne Dashboard genutzte Komponenten (`DebugCard`, `PrintChecklist`).
- `src/components/layout/ConditionalFooter.tsx` – versteckt den Marketing-Footer auf `/intern/*` und `/kundenlogin`, wiederverwendet `analytics-config`-Liste.
- `src/app/intern/marketing/_components/` – Master-Detail-Shell des Dashboards (`MarketingDashboard`, `CampaignList`, `CampaignDetail`). Private Folder → nie als Route.

## Interner Zugang

- Öffentlicher Einstieg: Kundenlogin-Pille im `Header` (`src/components/layout/Header.tsx`), `prefetch={false}`, kein Tracking, Lock-Icon + Chroma-Hover. Auf Mobile zeigt sie nur „Login", auf `sm+` den vollen Text „Kundenlogin".
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
- Defense in Depth: drei Layer prüfen die Exclusion-Liste:
  1. `lib/analytics.ts` → `trackEvent` (no-op bei excluded path)
  2. `lib/tracking/plausible.ts` → `trackPlausibleEvent` (no-op)
  3. `lib/tracking/events.ts` → `dispatchEvent` (no-op, blockt auch GTM)
- Auch die Attribution-Erfassung (`AttributionCapture`) ist auf internen Routen no-op.
- **Niemals PII (E-Mail, Name, Telefon, IP) als Plausible-Prop senden.** Properties sind ausschließlich kategoriale Werte.
- Attribution für Lead-Submits läuft separat (siehe `docs/01-marketing-dashboard.md`).

## Build-Notizen

- `npm run build` ist Pflichtchecks vor jedem Push. TypeScript-Errors blockieren den Build, ESLint nicht (bewusst entkoppelt in `next.config.ts`; `npm run lint` separat fahren).
- Keine neuen Dependencies ohne Grund. Aktuell zugekauft: `qrcode` (server-side QR-SVG).

## Docs

- `docs/README.md` – Doku-Index / Einstieg.
- `docs/01-marketing-dashboard.md` – Marketing-Dashboard & QR-Workflow.
- `docs/02-positioning-conversion.md` – Positionierung, Pakete, Conversion-Strategie.
- `docs/03-seo-content-architecture.md` – SEO-Fokus (Website-Erstellung) & Seitenarchitektur.
- `docs/04-ui-design-system.md` – Glass-Komponenten & Conventions.
- `docs/05-frontend-implementation-plan.md` – Priorisierter Umsetzungsplan (Phasen).
- `docs/06-qa-checklist.md` – QA-Checkliste vor Deploy/Druck.
- `docs/audits/seo-conversion-audit.md` – Technisches Inventar / Audit (Bestand).

## Don'ts

- Keine PII in localStorage/sessionStorage.
- Keine Auth-Erweiterung Richtung User-System ohne explizite Anfrage.
- Keine Tracking-Events auf `/intern/*` oder `/kundenlogin`.
- Keine Secrets in Code/Client/Logs.
- Kein „kleines bisschen `any`". Wenn nötig: `unknown` + Narrowing.
