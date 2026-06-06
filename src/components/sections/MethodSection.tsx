import React from "react";
import { Section } from "../ui/Section";
import { Container } from "../ui/Container";
import { Kicker } from "../ui/Kicker";
import { Button } from "../ui/Button";
import { Reveal } from "../motion/Reveal";
import { getPrimaryBookingTarget } from "@/config/site";
import { HOMEPAGE_CTA, HOMEPAGE_METHOD } from "@/content/homepage";

export function MethodSection() {
  const booking = getPrimaryBookingTarget();
  const { kicker, headline, intro, blocks } = HOMEPAGE_METHOD;

  const serviceCtas = [
    { id: "web", label: HOMEPAGE_CTA.services.web, ctaId: "CTA_METHOD_WEB" },
    { id: "seo", label: HOMEPAGE_CTA.services.seo, ctaId: "CTA_METHOD_SEO" },
    { id: "ads", label: HOMEPAGE_CTA.services.ads, ctaId: "CTA_METHOD_ADS" },
  ] as const;

  return (
    <Section className="bg-background" id="leistungen">
      <Container>
        <Reveal as="div" className="mb-10 max-w-3xl sm:mb-14 lg:mb-16">
          <Kicker accent="brand">{kicker}</Kicker>
          <h2 className="mt-4 text-fluid-h2 font-bold leading-[1.12] tracking-tight text-foreground">
            {headline}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {intro}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {blocks.map((block, idx) => (
            <Reveal key={block.id} delay={idx * 100}>
              <article className="flex h-full flex-col border-t border-border/60 pt-6 lg:pt-8">
                <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {block.title}
                </h3>
                <p className="mt-4 max-w-prose flex-1 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  {block.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal as="div" delay={280} className="mt-12 border-t border-border/60 pt-10 sm:mt-14">
          <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
            Ergänzend — wenn Sie einen konkreten Einstieg suchen:
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {serviceCtas.map((svc) => (
              <Button
                key={svc.id}
                variant="brand-outline"
                size="md"
                href={booking.href}
                external={booking.external}
                cta_id={svc.ctaId}
                cta_label={svc.label}
                cta_position="method_services"
                page_type="homepage"
                className="w-full sm:w-auto"
              >
                {svc.label}
              </Button>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
