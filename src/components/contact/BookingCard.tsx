// src/components/contact/BookingCard.tsx
"use client";

import { CalendarClock, Clock3, ShieldCheck, Video } from "lucide-react";
import { CalendarBookingButton } from "./ContactActions";
import { HOMEPAGE_BOOKING, HOMEPAGE_CTA } from "@/content/homepage";

type BookingCardVariant = "inline" | "sidebar" | "footer";

type BookingCardProps = {
  variant?: BookingCardVariant;
  className?: string;
  /** Button ausblenden, wenn ein primärer CTA bereits oberhalb steht. */
  hideButton?: boolean;
};

const META_ICONS = [ShieldCheck, Video, Clock3] as const;

export default function BookingCard({
  variant = "inline",
  className = "",
  hideButton = false,
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
      aria-label="Strategisches Erstgespräch per Google Kalender buchen"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      <div className="flex flex-col gap-4">
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
              Beratung
            </p>
            <h2
              className={[
                "font-heading font-semibold tracking-tight text-foreground",
                isSidebar
                  ? "mt-1 text-lg leading-snug"
                  : "mt-1 text-xl leading-snug sm:text-[1.35rem]",
              ].join(" ")}
            >
              {HOMEPAGE_BOOKING.headline}
            </h2>
          </div>
        </div>

        <div
          className={[
            "space-y-3 leading-relaxed text-muted-foreground",
            isSidebar ? "text-[13px]" : "text-sm",
          ].join(" ")}
        >
          {HOMEPAGE_BOOKING.copy.map((paragraph) => (
            <p key={paragraph.slice(0, 20)}>{paragraph}</p>
          ))}
        </div>

        <ul
          className={[
            "grid gap-2",
            isFooter ? "sm:grid-cols-3" : "grid-cols-1",
          ].join(" ")}
          aria-label="Termin-Details"
        >
          {HOMEPAGE_BOOKING.meta.map((label, i) => {
            const Icon = META_ICONS[i] ?? ShieldCheck;
            return (
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
            );
          })}
        </ul>

        {!hideButton && (
          <div className={isSidebar ? "pt-1" : "pt-0.5"}>
            <CalendarBookingButton
              location="booking"
              className={[
                "w-full rounded-sm text-sm",
                isSidebar ? "min-h-10 px-4" : "min-h-11 px-5",
              ].join(" ")}
            >
              {HOMEPAGE_CTA.bookingCard}
            </CalendarBookingButton>
          </div>
        )}
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent"
      />
    </aside>
  );
}
