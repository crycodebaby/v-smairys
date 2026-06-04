import React from 'react';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Kicker } from '../ui/Kicker';
import { ThreeLogoWrapper } from '../3d/ThreeLogoWrapper';
import { BackdropIcons } from '../backdrop/BackdropIcons';
import { getPrimaryBookingTarget } from '@/config/site';

/**
 * Hero – Startseite.
 *
 * Responsive-Anforderungen, die hier umgesetzt sind:
 *  - Mobile-Höhe nutzt `svh` (Small-Viewport-Height) statt `vh`, damit Safari/
 *    Chrome-Mobile-Adressleisten den Hero nicht abschneiden.
 *  - Tablet (iPad Portrait/Landscape) bekommt etwas mehr Vertikalraum.
 *  - Auf `< sm` werden CTAs in voller Breite untereinander gerendert, damit
 *    sie auch mit Daumenreichweite gut tippbar sind.
 *  - 3D-Logo bleibt rein dekorativer Hintergrund (z-0); Inhalt liegt auf z-10.
 *  - Zusätzliche `BackdropIcons` legen eine subtile Programmier-Ikonografie
 *    in den Hintergrund, sichtbar ab `sm` – auf Mobile bewusst aus, damit
 *    der 3D-Wrapper alleine die Tiefe trägt.
 */
export function Hero() {
  const booking = getPrimaryBookingTarget();
  return (
    <Section
      isHero
      className="relative flex items-center overflow-hidden bg-background min-h-[100svh] sm:min-h-[88svh] lg:min-h-[92vh]"
    >
      {/* 3D Logo (transparent, dekorativ) */}
      <ThreeLogoWrapper />

      {/* Tiefenschärfe-Layer: Programmier-Icons. Bewusst dezent unter dem 3D. */}
      <BackdropIcons preset="tech" showFrom="sm" />

      <Container
        size="wide"
        className="relative z-10 grid items-center gap-8 pt-24 sm:pt-28 md:grid-cols-12 md:pt-20"
      >
        <div className="flex flex-col items-start gap-6 sm:gap-8 md:col-span-9 lg:col-span-8">
          <Kicker>Smairys Netz-Manufaktur</Kicker>

          <h1 className="max-w-[820px] text-fluid-h1 font-bold leading-[1.08] tracking-tight text-foreground">
            Digitale Maßarbeit:{' '}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10">hochwertige Webseiten</span>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1 h-[6px] rounded-sm bg-gradient-to-r from-brand to-brand-soft opacity-80"
              />
            </span>
            , SEO und Google Ads.
          </h1>

          <h2 className="max-w-[620px] text-fluid-p leading-relaxed text-muted-foreground">
            Wir entwickeln performante digitale Infrastrukturen und messbare
            Vertriebsprozesse für qualitätsbewusste mittelständische Unternehmen.
          </h2>

          <div className="flex w-full flex-col items-stretch gap-3 pt-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4 sm:pt-4">
            <Button
              variant="brand"
              size="lg"
              href={booking.href}
              external={booking.external}
              cta_id="CTA_HERO_PRIMARY"
              cta_label="Projektanfrage starten"
              cta_position="hero_main"
              page_type="homepage"
              className="w-full sm:w-auto"
            >
              Projektanfrage starten
            </Button>

            <Button
              variant="brand-outline"
              size="lg"
              href="/leistungen"
              cta_id="CTA_HERO_SECONDARY"
              cta_label="Unsere Expertise"
              cta_position="hero_secondary"
              page_type="homepage"
              className="w-full sm:w-auto"
            >
              Unsere Expertise
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
