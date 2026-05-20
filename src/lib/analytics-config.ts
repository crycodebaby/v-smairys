/**
 * Zentral verwaltete Liste an Pfaden, die niemals in Plausible landen sollen.
 *
 * Sowohl als String-Liste (für das Plausible-`data-exclude`-Attribut) als auch
 * als reine Pfad-Prefix-Liste für client-seitige Guards in `lib/analytics.ts`.
 *
 * Wenn du eine neue interne Route ergänzt (z. B. `/intern/leads`), brauchst
 * du nur diesen einen Wert zu erweitern.
 */

export const ANALYTICS_EXCLUDED_PATHS = [
  "/intern/*",
  "/kundenlogin",
  "/login",
] as const;

/**
 * Liefert `true`, wenn der gegebene Pfad zu einem der ausgeschlossenen
 * Bereiche gehört. Wir matchen nur das Prefix (alles vor dem optionalen `*`).
 */
export function isAnalyticsExcludedPath(pathname: string): boolean {
  for (const pattern of ANALYTICS_EXCLUDED_PATHS) {
    if (pattern.endsWith("/*")) {
      const prefix = pattern.slice(0, -2);
      if (pathname === prefix || pathname.startsWith(prefix + "/")) {
        return true;
      }
    } else if (pathname === pattern) {
      return true;
    }
  }
  return false;
}

/**
 * Wert für das Plausible-`data-exclude`-Attribut. Plausible nutzt ein eigenes
 * Globbing-Format (kommagetrennte Patterns mit `*`-Wildcards). Wir liefern
 * exakt das, was im Snippet stehen muss.
 */
export const PLAUSIBLE_EXCLUDE_ATTRIBUTE = ANALYTICS_EXCLUDED_PATHS.join(", ");
