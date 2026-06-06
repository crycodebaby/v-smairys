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
    <Section
      isHero
      className="relative flex items-center overflow-hidden bg-background min-h-[100svh] sm:min-h-[88svh] lg:min-h-[92vh]"
    >
      <ThreeLogoWrapper />
      <BackdropIcons preset="tech" showFrom="sm" />

      <Container
        size="wide"
        className="relative z-10 grid items-center gap-8 pt-24 sm:pt-28 md:grid-cols-12 md:pt-20"
      >
        <div className="flex flex-col items-start gap-5 sm:gap-7 md:col-span-10 lg:col-span-9">
          <Kicker>{HOMEPAGE_HERO.kicker}</Kicker>

          <h1 className="max-w-3xl text-balance text-fluid-h1 font-bold leading-[1.08] tracking-tight text-foreground">
            {HOMEPAGE_HERO.headline}
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.65]">
            {HOMEPAGE_HERO.subheadline}
          </p>

          <div className="flex w-full flex-col items-stretch gap-3 pt-1 sm:w-auto sm:flex-row sm:items-center sm:gap-4 sm:pt-3">
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
