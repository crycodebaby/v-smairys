"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  PLAUSIBLE_EXCLUDE_ATTRIBUTE,
  isAnalyticsExcludedPath,
} from "@/lib/analytics-config";

/**
 * Plausible Analytics Loader.
 *
 * Datenschutzfreundlich:
 *  - kein Cookie
 *  - keine personenbezogenen Profile
 *  - keine Cross-Site-Verfolgung
 *
 * Konfiguration über ENV (NEXT_PUBLIC_*, damit clientseitig verfügbar):
 *   - NEXT_PUBLIC_PLAUSIBLE_DOMAIN
 *       Domain, die du in Plausible angelegt hast (z. B. "smairys.de").
 *   - NEXT_PUBLIC_PLAUSIBLE_SRC (optional)
 *       Vollständige Script-URL.
 *       Standard ist `https://plausible.io/js/script.exclusions.js`,
 *       weil wir interne Routen (/intern/*, /kundenlogin) per
 *       `data-exclude` ausschließen.
 *
 * Interner Tracking-Ausschluss (Defense in Depth, drei Layer):
 *  1. **Render-Gate (hier):** Auf ausgeschlossenen Routen
 *     (`/intern/*`, `/kundenlogin`, `/login`) wird das Plausible-Snippet
 *     **gar nicht erst in die Seite gerendert**. Das ist die härteste Linie:
 *     kein Script-Tag, kein Auto-Pageview, kein Netzwerk-Request – egal welche
 *     Script-Variante geladen würde. Greift bei Hard-Loads (so werden
 *     `/kundenlogin` & `/intern/*` praktisch immer aufgerufen: per Redirect/
 *     Login-Pille).
 *  2. **`data-exclude` (Script-Attribut):** Fängt Soft-Navigations
 *     (App-Router-Client-Routing) ab, falls man aus einer öffentlichen Seite
 *     in eine interne wechselt, ohne die Seite neu zu laden. Hinweis: Plausible
 *     hat `data-exclude` in der NEUEN Script-Generation entfernt – es wirkt nur
 *     mit der Legacy-Datei `script.exclusions.js`. Die robuste, zukunftssichere
 *     Linie ist daher zusätzlich der Pages-Shield im Plausible-Dashboard
 *     (siehe `docs/analytics/plausible-setup.md`).
 *  3. **Custom-Event-Guards:** `lib/analytics.ts`, `lib/tracking/plausible.ts`
 *     und `lib/tracking/events.ts` prüfen den Pathname und feuern auf internen
 *     Routen gar keine Custom-Events.
 *
 * Wir rendern das Script nicht, wenn keine Domain konfiguriert ist
 * (z. B. lokaler Build ohne ENV) – so vermeiden wir Fehler in der Konsole
 * und versehentliches Tracking gegen ein falsches Property.
 */

const DEFAULT_PLAUSIBLE_SRC = "https://plausible.io/js/script.exclusions.js";

export function PlausibleAnalytics() {
  const pathname = usePathname();
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || DEFAULT_PLAUSIBLE_SRC;

  if (!domain) {
    return null;
  }

  // Layer 1: Auf internen/ausgeschlossenen Routen das Snippet nie laden.
  // Verhindert jeden Pageview gegen das Marketing-Property auf z. B.
  // `/kundenlogin` und `/intern/marketing` (Hard-Loads).
  if (pathname && isAnalyticsExcludedPath(pathname)) {
    return null;
  }

  return (
    <>
      <Script
        id="plausible-analytics"
        src={src}
        data-domain={domain}
        data-exclude={PLAUSIBLE_EXCLUDE_ATTRIBUTE}
        strategy="afterInteractive"
        defer
      />
      {/*
        Initialisiert die globale `plausible()`-Funktion synchron, damit
        Events vor dem vollständigen Laden des Snippets nicht verloren gehen.
        Plausible queued sie in `window.plausible.q` und feuert sie nach.
      */}
      <Script id="plausible-analytics-init" strategy="afterInteractive">
        {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
      </Script>
    </>
  );
}
