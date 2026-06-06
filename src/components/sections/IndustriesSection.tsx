import React from "react";
import { Building2, Hammer, UtensilsCrossed } from "lucide-react";
import { Section } from "../ui/Section";
import { Container } from "../ui/Container";
import { Kicker } from "../ui/Kicker";
import { Reveal } from "../motion/Reveal";
import { HOMEPAGE_INDUSTRIES } from "@/content/homepage";

const ICONS = {
  immobilien: Building2,
  handwerk: Hammer,
  gastronomie: UtensilsCrossed,
} as const;

export function IndustriesSection() {
  const { kicker, headline, intro, items } = HOMEPAGE_INDUSTRIES;

  return (
    <Section className="border-t border-border/60 bg-background">
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

        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
          {items.map((item, idx) => {
            const Icon = ICONS[item.id as keyof typeof ICONS];
            return (
              <Reveal key={item.id} delay={idx * 100}>
                <article className="flex h-full flex-col rounded-xl border border-border/60 bg-card/50 p-6 sm:p-7">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 bg-white/[0.04] text-brand"
                  >
                    <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {item.body}
                  </p>
                  <p className="mt-5 border-t border-border/50 pt-5 text-sm leading-relaxed text-foreground/85">
                    {item.result}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
