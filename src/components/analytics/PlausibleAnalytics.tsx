import Script from "next/script";
import { PLAUSIBLE_EXCLUDE_ATTRIBUTE } from "@/lib/analytics-config";

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
 * Interner Tracking-Ausschluss:
 *  - `data-exclude` listet die Pfade aus `ANALYTICS_EXCLUDED_PATHS`.
 *    Plausible erkennt diese Pfade und sendet weder Pageviews noch
 *    Custom-Events, solange der Nutzer dort ist. Funktioniert auch über
 *    App-Router-Soft-Navigation.
 *  - Zusätzlich prüft `lib/analytics.ts` (`trackEvent`) clientseitig den
 *    Pathname und feuert dort gar keine Events – Belt-and-Suspenders.
 *
 * Wir rendern das Script nicht, wenn keine Domain konfiguriert ist
 * (z. B. lokaler Build ohne ENV) – so vermeiden wir Fehler in der Konsole
 * und versehentliches Tracking gegen ein falsches Property.
 */

const DEFAULT_PLAUSIBLE_SRC = "https://plausible.io/js/script.exclusions.js";

export function PlausibleAnalytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || DEFAULT_PLAUSIBLE_SRC;

  if (!domain) {
    if (process.env.NODE_ENV === "development") {
      console.info(
        "[analytics] NEXT_PUBLIC_PLAUSIBLE_DOMAIN nicht gesetzt – Plausible-Snippet wird nicht geladen."
      );
    }
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
