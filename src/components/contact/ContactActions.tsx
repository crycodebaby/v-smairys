"use client";

import React from "react";
import { SITE, getPrimaryBookingTarget } from "@/config/site";
import {
  trackCalendarClick,
  trackEmailClick,
  trackPhoneClick,
  type CtaLocation,
} from "@/lib/analytics";

type ActionVariant = "solid" | "outline" | "ghost";

type BaseActionProps = {
  location: CtaLocation;
  className?: string;
  variant?: ActionVariant;
  children?: React.ReactNode;
};

const baseClass =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold " +
  "transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-glow focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "active:scale-[0.98]";

const variantClass: Record<ActionVariant, string> = {
  solid:
    "border border-[#d47115]/80 bg-[#d47115] text-white shadow-[0_12px_30px_-18px_#d47115] hover:bg-brand-soft",
  outline:
    "border border-[#d47115]/45 bg-background/70 text-foreground hover:border-[#d47115] hover:bg-[#d47115]/10 hover:text-brand-soft",
  ghost:
    "border border-border/60 bg-card/60 text-foreground hover:border-[#d47115]/45 hover:text-brand-soft",
};

function mergeClassName(
  variant: ActionVariant,
  className: string | undefined
) {
  return `${baseClass} ${variantClass[variant]} ${className ?? ""}`;
}

export function PhoneCallButton({
  location,
  className,
  variant = "solid",
  children = "Anrufen",
}: BaseActionProps) {
  return (
    <a
      href={SITE.phone.tel}
      onClick={() => trackPhoneClick({ location })}
      className={mergeClassName(variant, className)}
      aria-label="Telefonisch Kontakt aufnehmen"
    >
      <PhoneIcon />
      <span>{children}</span>
    </a>
  );
}

export function EmailButton({
  location,
  className,
  variant = "outline",
  children = "E-Mail schreiben",
}: BaseActionProps) {
  return (
    <a
      href={SITE.email.mailto}
      onClick={() => trackEmailClick({ location })}
      className={mergeClassName(variant, className)}
      aria-label="Per E-Mail Kontakt aufnehmen"
    >
      <MailIcon />
      <span>{children}</span>
    </a>
  );
}

export function CalendarBookingButton({
  location,
  className,
  variant = "solid",
  children = "Termin buchen",
}: BaseActionProps) {
  const booking = getPrimaryBookingTarget();
  const isCalendar = SITE.booking.enabled && SITE.booking.calendarUrl;

  return (
    <a
      href={booking.href}
      target={booking.external ? "_blank" : undefined}
      rel={booking.external ? "noopener noreferrer" : undefined}
      onClick={() => {
        if (isCalendar) {
          trackCalendarClick({ location });
        }
      }}
      className={mergeClassName(variant, className)}
      aria-label={
        isCalendar
          ? "Termin im Kalender buchen"
          : "Zum Kontaktformular wechseln"
      }
    >
      <CalendarIcon />
      <span>{children}</span>
    </a>
  );
}

type ContactActionBarProps = {
  location: CtaLocation;
  className?: string;
  showCalendar?: boolean;
};

export function ContactActionBar({
  location,
  className = "",
  showCalendar = true,
}: ContactActionBarProps) {
  return (
    <div className={`flex flex-col gap-2 sm:flex-row sm:flex-wrap ${className}`}>
      {showCalendar && (
        <CalendarBookingButton location={location} className="w-full sm:w-auto" />
      )}
      <PhoneCallButton
        location={location}
        variant={showCalendar ? "outline" : "solid"}
        className="w-full sm:w-auto"
      />
      <EmailButton location={location} className="w-full sm:w-auto" />
    </div>
  );
}

export function ContactActionCard({
  location,
  className = "",
}: {
  location: CtaLocation;
  className?: string;
}) {
  return (
    <aside
      className={
        "rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-xl " +
        className
      }
      aria-label="Schnelle Kontaktaktionen"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Direkter Kontakt
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
        Lieber direkt sprechen?
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Kurzer Anruf, Mail oder Termin – ohne Personen-Tracking in Plausible.
      </p>
      <ContactActionBar location={location} className="mt-5" />
    </aside>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 4h3l1.5 4-2 1.5a12 12 0 0 0 6 6L16 13.5l4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 4 6a2 2 0 0 1 2-2Z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.5 7.5h17v9A1.5 1.5 0 0 1 19 18H5a1.5 1.5 0 0 1-1.5-1.5v-9Zm0 0L12 13l8.5-5.5"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3.5v3M17 3.5v3M4.5 9h15M6 5h12a1.5 1.5 0 0 1 1.5 1.5V18A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6.5A1.5 1.5 0 0 1 6 5Zm4 8h4"
      />
    </svg>
  );
}
