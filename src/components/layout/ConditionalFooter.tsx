"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { isAnalyticsExcludedPath } from "@/lib/analytics-config";

/**
 * Rendert die Footer-Children **nur auf öffentlichen Routen**.
 *
 * Begründung:
 *  - /kundenlogin und /intern/* sind interne, vollformatige Glas-Layouts
 *    mit eigenem Hintergrund. Der Marketing-Footer (mit Logo, CTA-Mail,
 *    Standort, Rechtslinks) wirkt darunter falsch und würde die
 *    Liquid-Glass-Optik brechen.
 *  - Die Liste der ausgeschlossenen Pfade ist identisch mit der für
 *    Plausible-Tracking-Exklusion – ein zentraler Ort, eine einzige
 *    Wahrheit. Wir nutzen sie hier semantisch passend wieder.
 *
 * Implementiert als Children-Slot, damit der eigentliche `<Footer />` eine
 * Server-Komponente bleibt (kleinerer Client-Bundle).
 */
export function ConditionalFooter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname && isAnalyticsExcludedPath(pathname)) {
    return null;
  }
  return <>{children}</>;
}
