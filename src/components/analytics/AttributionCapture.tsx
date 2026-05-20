"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution/attribution";
import { isAnalyticsExcludedPath } from "@/lib/analytics-config";

/**
 * Triggert die First-/Last-Touch-Erfassung beim ersten Mount des Layouts.
 *
 * - Reines clientseitiges Hilfs-Mount, rendert nichts.
 * - Läuft genau einmal pro Pageload.
 * - **No-op auf internen Routen** (`/intern/*`, `/kundenlogin`, `/login`).
 *   Verhindert, dass jemand mit `?utm_*` auf /intern/marketing landet und
 *   damit die First-Touch-Attribution eines Leads überschreibt. Defense
 *   in Depth – die `data-exclude`-Plausible-Liste ist semantisch dieselbe.
 */
export function AttributionCapture() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isAnalyticsExcludedPath(window.location.pathname)) return;
    captureAttribution();
  }, []);

  return null;
}
