"use client";

import { TrackedLink } from "@/components/analytics/TrackedLink";
import { CalendarBookingButton } from "@/components/contact/ContactActions";
import { Container } from "@/components/ui/Container";
import { LEISTUNGEN_FINAL_CTA } from "@/content/leistungen";

/**
 * Abschluss-CTA für /leistungen – bewusst leichter als die BookingCard.
 * Kein zweites „Strategisches Erstgespräch"-Modul, nur Headline + zwei Aktionen.
 */
export default function LeistungenFinalCta() {
  const { headline, description, primary, secondary } = LEISTUNGEN_FINAL_CTA;

  return (
    <section
      className="border-t border-white/6 py-14 sm:py-20 lg:py-24"
      aria-labelledby="leistungen-final-cta-heading"
    >
      <Container size="wide">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="leistungen-final-cta-heading"
            className="font-heading text-2xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-3xl lg:text-[2rem]"
          >
            {headline}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-foreground/80 sm:mt-5 sm:text-lg sm:leading-[1.65]">
            {description}
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
            <CalendarBookingButton
              location="final-cta"
              className="w-full min-h-11 rounded-sm px-6 sm:w-auto"
            >
              {primary}
            </CalendarBookingButton>

            <TrackedLink
              href="/projekte"
              cta="final-cta-secondary"
              location="final-cta"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-border/60 bg-background/70 px-6 text-sm font-semibold text-foreground transition hover:border-foreground/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-glow sm:w-auto"
            >
              {secondary}
            </TrackedLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
