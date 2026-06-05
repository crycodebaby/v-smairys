// src/components/contact/BookingCard.tsx
"use client";

import { CalendarClock, Clock3, ShieldCheck, Video } from "lucide-react";
import { CalendarBookingButton } from "./ContactActions";

type BookingCardVariant = "inline" | "sidebar" | "footer";

type BookingCardProps = {
  /** Layout-Kontext auf /leistungen – beeinflusst Dichte, nicht die CTA-Logik. */
  variant?: BookingCardVariant;
  className?: string;
};

const META_POINTS = [
  { icon: ShieldCheck, label: "Kostenlos & unverbindlich" },
  { icon: Video, label: "Online via Google Meet" },
  { icon: Clock3, label: "20–25 Minuten" },
] as const;

export default function BookingCard({
  variant = "inline",
  className = "",
}: BookingCardProps) {
  const isSidebar = variant === "sidebar";
  const isFooter = variant === "footer";

  return (
    <aside
      className={[
        "relative overflow-hidden rounded-xl border border-white/10",
        "glass-surface ambient-glow-amber",
        isSidebar ? "p-5 xl:p-6" : isFooter ? "p-6 sm:p-7" : "p-5 sm:p-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Erstgespräch per Google Kalender buchen"
    >
      {/* Feine Oberkante – Premium-Hairline */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      <div className="flex flex-col gap-4">
        {/* Icon + Kicker */}
        <div className="flex items-start gap-3.5">
          <span
            className={[
              "inline-flex shrink-0 items-center justify-center rounded-md border border-white/12",
              "bg-white/[0.04] text-brand",
              isSidebar ? "h-10 w-10" : "h-11 w-11",
            ].join(" ")}
            aria-hidden="true"
          >
            <CalendarClock
              className={isSidebar ? "h-[1.15rem] w-[1.15rem]" : "h-5 w-5"}
              strokeWidth={1.5}
            />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Erstgespräch
            </p>
            <h2
              className={[
                "font-heading font-semibold tracking-tight text-foreground",
                isSidebar
                  ? "mt-1 text-lg leading-snug"
                  : "mt-1 text-xl leading-snug sm:text-[1.35rem]",
              ].join(" ")}
            >
              Termin vereinbaren
            </h2>
          </div>
        </div>

        {/* Explanatory copy */}
        <p
          className={[
            "leading-relaxed text-muted-foreground",
            isSidebar ? "text-[13px]" : "text-sm",
          ].join(" ")}
        >
          20-minütiges Erstgespräch: Ziele klären, Machbarkeit prüfen, nächster
          Schritt. Direkt im Kalender reservieren.
        </p>

        {/* Trust / meta – refined list, not playful pills */}
        <ul
          className={[
            "grid gap-2",
            isFooter ? "sm:grid-cols-3" : "grid-cols-1",
          ].join(" ")}
          aria-label="Termin-Details"
        >
          {META_POINTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 text-[12px] text-foreground/75"
            >
              <Icon
                className="h-3.5 w-3.5 shrink-0 text-brand/80"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        {/* Primary CTA – canonical booking URL via CalendarBookingButton */}
        <div className={isSidebar ? "pt-1" : "pt-0.5"}>
          <CalendarBookingButton
            location="booking"
            className={[
              "w-full rounded-sm text-sm",
              isSidebar ? "min-h-10 px-4" : "min-h-11 px-5",
            ].join(" ")}
          >
            Im Google Kalender buchen
          </CalendarBookingButton>
        </div>
      </div>

      {/* Untere Brand-Linie */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent"
      />
    </aside>
  );
}
