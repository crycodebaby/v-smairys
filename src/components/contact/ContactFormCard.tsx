import React from "react";
import { ContactFormBase } from "@/components/forms/ContactFormBase";

type ContactFormCardProps = {
  /** Wird an `ContactFormBase` als `page_type` durchgereicht (Tracking-Kontext). */
  pageType: string;
  /** Headline der Karte. */
  title?: string;
  /** Sub-Text unter der Headline. */
  description?: string;
  className?: string;
};

/**
 * Kontaktformular-Karte mit Glass-Optik + Brand-Akzent.
 *
 * - Wiederverwendbar (Homepage, Kontaktseite, evtl. Service-Detailseiten).
 * - Reines Layout-Wrapper. Die Logik (State, Validierung, Tracking) bleibt
 *   in `ContactFormBase`.
 * - Top-Akzent-Linie in Brand-Gradient signalisiert Wichtigkeit, ohne den
 *   Rahmen optisch laut zu machen.
 */
export function ContactFormCard({
  pageType,
  title = "Projektanfrage starten",
  description = "Wir antworten innerhalb von 24 Stunden, Mo–Fr.",
  className = "",
}: ContactFormCardProps) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 sm:p-8 md:p-10 " +
        "shadow-[0_24px_70px_-30px_hsl(0_0%_0%/0.65)] " +
        className
      }
    >
      {/* Brand-Akzent oben + dezenter Inner-Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-10%] h-48 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--brand-glow) / 0.18), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <header className="mb-6 flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-soft">
          Kontaktanfrage
        </span>
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </header>

      <ContactFormBase page_type={pageType} />
    </div>
  );
}
