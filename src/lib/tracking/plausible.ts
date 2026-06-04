import { trackEvent } from "@/lib/analytics";
import { isAnalyticsExcludedPath } from "@/lib/analytics-config";
import type { TrackingEventName } from "./event-names";

/**
 * Adapter: leitet alle Events aus der zentralen `dispatchEvent`-Pipeline
 * (events.ts) an Plausible weiter.
 *
 * Wichtig:
 *  - Wir senden **keine PII** in den Props (Mails, Telefonnummern, Namen).
 *  - Werte werden auf strings/numbers/booleans reduziert; alles andere
 *    wird verworfen, da Plausible nur Skalare als Properties akzeptiert.
 *  - Auf internen Routen (`/intern/*`, `/kundenlogin`) wird kein Event
 *    gesendet – sowohl `trackEvent` als auch dieser Adapter prüfen das.
 *  - Falls Plausible nicht geladen ist, ist `trackEvent` ein no-op.
 */
export function trackPlausibleEvent(
  payload: Record<string, unknown> & { event_name: TrackingEventName }
): void {
  if (typeof window === "undefined") return;
  if (isAnalyticsExcludedPath(window.location.pathname)) return;

  const { event_name, ...rest } = payload;

  const props: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      props[key] = value;
    }
  }

  trackEvent(event_name, props);
}
