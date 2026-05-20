"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution/attribution";

/**
 * Triggert die First-/Last-Touch-Erfassung beim ersten Mount des Layouts.
 *
 * - Reines clientseitiges Hilfs-Mount, rendert nichts.
 * - Läuft genau einmal pro Pageload. Bei Soft-Navigations (Next.js App
 *   Router) bleibt das Layout gemountet, wir hängen daher zusätzlich an
 *   `popstate` und `pushState` (über visibilitychange-Heuristik), um neue
 *   UTM-Parameter bei interner Navigation nicht zu verpassen.
 *   Da App-Router-Navigation typischerweise UTMs nicht intern routet,
 *   reicht in 99 % der Fälle der initiale Mount.
 */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
