"use client";

import React from "react";
import {
  trackCtaClick,
  trackContactIntent,
  trackAndNavigate,
  type CtaIdentifier,
  type CtaLocation,
  type ContactIntentType,
} from "@/lib/analytics";

type CommonProps = {
  cta: CtaIdentifier;
  location: CtaLocation;
  /**
   * Wenn gesetzt, wird zusätzlich ein "Contact Intent" Event mit diesem Typ
   * gefeuert. Sinnvoll bei mailto/tel/Booking-Links.
   */
  intent?: ContactIntentType;
};

export type TrackedLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  CommonProps;

/**
 * `<a>`-Wrapper mit Plausible-Tracking.
 *
 * - Feuert immer ein "CTA Click" Event mit `cta` + `location`.
 * - Optional zusätzlich "Contact Intent" mit `type` + `location`.
 * - mailto:/tel:/externe Links: verwendet `trackAndNavigate`, damit das Event
 *   sicher vor der Navigation rausgeht, aber kein "hängender" Klick entsteht.
 * - Für Modifier-Keys / Mittelklick wird der Browser-Default respektiert.
 *
 * Die Komponente ist optisch unsichtbar – Styling und Inhalt werden vollständig
 * vom Aufrufer geliefert (className, children).
 */
export function TrackedLink({
  cta,
  location,
  intent,
  href,
  onClick,
  ...rest
}: TrackedLinkProps) {
  const isSpecialScheme =
    typeof href === "string" &&
    (href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("sms:"));

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (intent) {
      trackContactIntent({ type: intent, location });
    }

    if (isSpecialScheme) {
      trackAndNavigate(event, "CTA Click", { cta, location });
    } else {
      trackCtaClick({ cta, location });
    }

    onClick?.(event);
  };

  return <a href={href} onClick={handleClick} {...rest} />;
}
