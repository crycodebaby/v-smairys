import React from 'react';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Kicker } from '../ui/Kicker';
import { Reveal } from '../motion/Reveal';
import { HOMEPAGE_QUALIFICATION } from '@/content/homepage';

export function FilterSection() {
  const { kicker, headline, paragraphs } = HOMEPAGE_QUALIFICATION;

  return (
    <Section className="relative border-t border-border/60 bg-background py-16 sm:py-20 lg:py-24">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--brand-glow) / 0.08), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <Container className="relative">
        <Reveal as="div" className="mx-auto max-w-3xl">
          <Kicker accent="brand">{kicker}</Kicker>
          <h2 className="mt-4 text-fluid-h2 font-bold leading-[1.12] tracking-tight text-foreground">
            {headline}
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.65]">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
