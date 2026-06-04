import React from "react";
import { SITE } from "@/config/site";
import { EmailButton, PhoneCallButton } from "./ContactActions";

type ContactInfoCardProps = {
  /** Standort, wo dieser Block lebt – wichtig für CTA-Tracking. */
  location: "kontakt" | "footer" | "homepage";
  /** Anzeige-Variante. `compact` für Sidebar/Footer, `full` für Kontaktseite. */
  variant?: "compact" | "full";
  className?: string;
};

/**
 * Zentral konfigurierte Kontaktinformationen.
 *
 * Bezieht **alle** Daten aus `src/config/site.ts` – keine Hardcodes.
 * Trackt mailto/tel Klicks über eindeutige Business-Events:
 * `email_click` und `phone_click`. Keine PII als Plausible-Props.
 */
export function ContactInfoCard({
  location,
  variant = "full",
  className = "",
}: ContactInfoCardProps) {
  const isFull = variant === "full";
  return (
    <div className={`flex flex-col ${isFull ? "gap-8" : "gap-5"} ${className}`}>
      <ContactRow
        icon={<MailIcon />}
        label="E-Mail"
        value={
          <EmailButton
            location={location}
            variant="ghost"
            className={`justify-start rounded-lg px-0 ${isFull ? "text-lg" : "text-sm"}`}
          >
            {SITE.email.display}
          </EmailButton>
        }
        hint={isFull ? "Antwort innerhalb von 24 Stunden, Mo–Fr." : undefined}
      />
      <ContactRow
        icon={<PhoneIcon />}
        label="Telefon"
        value={
          <PhoneCallButton
            location={location}
            variant="ghost"
            className={`justify-start rounded-lg px-0 ${isFull ? "text-lg" : "text-sm"}`}
          >
            {SITE.phone.display}
          </PhoneCallButton>
        }
        hint={isFull ? "Direkt mit Robin Schmeiries." : undefined}
      />
      <ContactRow
        icon={<PinIcon />}
        label="Standort"
        value={
          <address className={`not-italic text-foreground ${isFull ? "text-base" : "text-sm"}`}>
            <span className="block font-medium">{SITE.legalName}</span>
            <span className="block text-muted-foreground">
              {SITE.address.street}
            </span>
            <span className="block text-muted-foreground">
              {SITE.address.postalCode} {SITE.address.city}, {SITE.address.country}
            </span>
          </address>
        }
      />
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="relative inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-border/60 bg-card/60 text-brand-soft">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl bg-brand/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </span>
        <span className="mt-0.5">{value}</span>
        {hint && (
          <span className="mt-1 text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}

/* ── Icons ───────────────────────────────────────────────────────────── */

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.5 7.5h17v9a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-9Zm0 0L12 13l8.5-5.5"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 4h3l1.5 4-2 1.5a12 12 0 0 0 6 6L16 13.5l4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 4 6a2 2 0 0 1 2-2Z"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12Zm0-9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
      />
    </svg>
  );
}
