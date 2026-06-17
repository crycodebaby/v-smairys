import React from 'react';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Kicker } from '../ui/Kicker';
import { ThreeLogoWrapper } from '../3d/ThreeLogoWrapper';
import { BackdropIcons } from '../backdrop/BackdropIcons';
import { getPrimaryBookingTarget } from '@/config/site';
import { HOMEPAGE_CTA, HOMEPAGE_HERO } from '@/content/homepage';

export function Hero() {
  const booking = getPrimaryBookingTarget();

  return (
    <Section variant="hero" className="relative overflow-hidden bg-background">
      <ThreeLogoWrapper />
      <BackdropIcons preset="tech" showFrom="sm" />

      <Container
        size="wide"
        className="relative z-10 grid items-center gap-8 md:grid-cols-12"
      >
        <div className="flex min-w-0 flex-col items-start gap-3 sm:gap-5 md:gap-7 md:col-span-10 lg:col-span-9">
          <Kicker>{HOMEPAGE_HERO.kicker}</Kicker>

          <h1 className="max-w-3xl text-balance text-fluid-h1 font-bold leading-[1.08] tracking-tight text-foreground">
            {HOMEPAGE_HERO.headline}
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.65]">
            {HOMEPAGE_HERO.subheadline}
          </p>

          <div className="flex w-full min-w-0 flex-col items-stretch gap-2.5 pt-0 sm:w-auto sm:flex-row sm:items-center sm:gap-4 sm:pt-2">
            <Button
              variant="brand"
              size="lg"
              href={booking.href}
              external={booking.external}
              cta_id="CTA_HERO_PRIMARY"
              cta_label={HOMEPAGE_CTA.primary}
              cta_position="hero_main"
              page_type="homepage"
              className="w-full sm:w-auto"
            >
              {HOMEPAGE_CTA.primary}
            </Button>

            <Button
              variant="brand-outline"
              size="lg"
              href="/leistungen"
              cta_id="CTA_HERO_SECONDARY"
              cta_label={HOMEPAGE_CTA.secondaryServices}
              cta_position="hero_secondary"
              page_type="homepage"
              className="w-full sm:w-auto"
            >
              {HOMEPAGE_CTA.secondaryServices}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
