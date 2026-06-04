"use client";

import React from "react";
import {
  trackCalendarClick,
  trackCtaClick,
  trackEmailClick,
  trackPhoneClick,
  trackAndNavigate,
  type CtaIdentifier,
  type CtaLocation,
} from "@/lib/analytics";
import { TRACKING_EVENTS } from "@/lib/tracking/event-names";

type CommonProps = {
  cta: CtaIdentifier;
  location: CtaLocation;
  /**
   * Wenn gesetzt, wird statt eines generischen `cta_click` genau das passende
   * Business-Event gefeuert. Keine Doppelzählung.
   */
  intent?: "phone" | "email" | "calendar";
};

export type TrackedLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  CommonProps;

/**
 * `<a>`-Wrapper mit Plausible-Tracking.
 *
 * - Feuert für normale Links `cta_click` mit `cta` + `location`.
 * - Feuert für Kontaktaktionen genau ein Business-Event:
 *   `phone_click`, `email_click` oder `calendar_click`.
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
    if (intent === "phone") {
      trackAndNavigate(event, TRACKING_EVENTS.PHONE_CLICK, { location });
    } else if (intent === "email") {
      trackAndNavigate(event, TRACKING_EVENTS.EMAIL_CLICK, { location });
    } else if (intent === "calendar") {
      trackCalendarClick({ location });
    } else if (isSpecialScheme) {
      trackAndNavigate(event, TRACKING_EVENTS.CTA_CLICK, { cta, location });
    } else {
      trackCtaClick({ cta, location });
    }

    onClick?.(event);
  };

  return <a href={href} onClick={handleClick} {...rest} />;
}
