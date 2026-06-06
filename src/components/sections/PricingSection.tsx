import React from "react";
import { Check } from "lucide-react";
import { Section } from "../ui/Section";
import { Container } from "../ui/Container";
import { Kicker } from "../ui/Kicker";
import { Button } from "../ui/Button";
import { Reveal } from "../motion/Reveal";
import { getPrimaryBookingTarget } from "@/config/site";
import { HOMEPAGE_PRICING } from "@/content/homepage";

export function PricingSection() {
  const booking = getPrimaryBookingTarget();
  const { kicker, headline, intro, note, packages } = HOMEPAGE_PRICING;

  return (
    <Section
      id="preise"
      className="relative border-t border-border/60 bg-background py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <Reveal as="div" className="mx-auto mb-10 max-w-3xl text-center sm:mb-14 lg:mb-16">
          <Kicker accent="brand" className="justify-center">
            {kicker}
          </Kicker>
          <h2 className="mt-4 text-fluid-h2 font-bold leading-[1.12] tracking-tight text-foreground">
            {headline}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.65]">
            {intro}
          </p>
        </Reveal>

        <div className="mx-auto grid w-full min-w-0 max-w-[1280px] grid-cols-1 gap-6 sm:gap-7 lg:grid-cols-3 lg:items-stretch lg:gap-6 xl:gap-8">
          {packages.map((pkg, idx) => (
            <Reveal key={pkg.id} delay={idx * 80} className="min-w-0">
              <PricingCard
                pkg={pkg}
                bookingHref={booking.href}
                bookingExternal={booking.external}
              />
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:mt-12">
          {note}
        </p>
      </Container>
    </Section>
  );
}

type Package = (typeof HOMEPAGE_PRICING.packages)[number];

function PricingCard({
  pkg,
  bookingHref,
  bookingExternal,
}: {
  pkg: Package;
  bookingHref: string;
  bookingExternal: boolean;
}) {
  const isRecommended = pkg.recommended;

  return (
    <article
      className={[
        "relative flex h-full min-w-0 flex-col rounded-xl border p-5 sm:p-6 lg:p-7",
        isRecommended
          ? "border-brand/50 bg-card/80 shadow-[0_0_0_1px_hsl(var(--brand-glow)/0.15),0_20px_48px_-28px_hsl(var(--brand-glow)/0.4)] lg:-translate-y-1"
          : "border-border/60 bg-card/50",
      ].join(" ")}
      aria-labelledby={`pricing-${pkg.id}-title`}
    >
      {"badge" in pkg && pkg.badge && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-sm border border-brand/40 bg-background px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
          {pkg.badge}
        </span>
      )}

      <div className="flex flex-col gap-1 border-b border-border/50 pb-5">
        <h3
          id={`pricing-${pkg.id}-title`}
          className="text-lg font-bold tracking-tight text-foreground sm:text-xl"
        >
          {pkg.name}
        </h3>
        <p
          className={[
            "font-heading font-bold tracking-tight text-foreground",
            isRecommended ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
          ].join(" ")}
          aria-label={`Preis ${pkg.price}`}
        >
          {pkg.price}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {pkg.positioning}
        </p>
      </div>

      <ul className="mt-5 flex flex-1 flex-col gap-2.5" aria-label={`Leistungen ${pkg.name}`}>
        {pkg.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[13px] leading-snug text-foreground/85 sm:text-sm">
            <Check
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 border-t border-border/40 pt-5 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
        {pkg.bestFor}
      </p>

      <div className="mt-6 pt-1">
        <Button
          variant={isRecommended ? "brand" : "brand-outline"}
          size={isRecommended ? "md" : "sm"}
          href={bookingHref}
          external={bookingExternal}
          cta_id={pkg.ctaId}
          cta_label={pkg.cta}
          cta_position="pricing"
          page_type="homepage"
          className="w-full"
        >
          {pkg.cta}
        </Button>
      </div>
    </article>
  );
}
