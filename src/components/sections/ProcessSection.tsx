import React from 'react';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Kicker } from '../ui/Kicker';
import { BackdropIcons } from '../backdrop/BackdropIcons';
import { HOMEPAGE_PROCESS } from '@/content/homepage';

export function ProcessSection() {
  const { kicker, headline, steps } = HOMEPAGE_PROCESS;

  return (
    <Section className="relative overflow-hidden bg-background">
      <BackdropIcons preset="tech" showFrom="md" />

      <Container className="relative z-10">
        <div className="flex flex-col gap-10 md:gap-14 lg:flex-row lg:gap-24 xl:gap-32">
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-32">
              <Kicker accent="brand">{kicker}</Kicker>
              <h2 className="mb-4 mt-4 text-fluid-h2 font-bold leading-[1.12] tracking-tight text-foreground sm:mb-6">
                {headline}
              </h2>
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="flex flex-col border-t border-border/60">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="group relative flex gap-4 border-b border-border/60 py-8 sm:gap-6 sm:py-10 md:gap-12 md:py-12"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-8 left-0 w-px bg-gradient-to-b from-brand/0 via-brand/0 to-brand/0 transition-colors duration-500 group-hover:via-brand/50 sm:inset-y-10 md:inset-y-12"
                  />
                  <div className="w-10 shrink-0 font-mono text-2xl font-light tracking-tighter text-muted-foreground transition-colors group-hover:text-brand-soft sm:w-12 sm:text-3xl md:text-4xl">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground sm:mb-3 sm:text-xl md:text-2xl">
                      {step.title}
                    </h3>
                    <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-[1.65]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
