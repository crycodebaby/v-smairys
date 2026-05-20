import React from 'react';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Kicker } from '../ui/Kicker';
import { ThreeLogoWrapper } from '../3d/ThreeLogoWrapper';

export function Hero() {
  return (
    <Section isHero className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* 3D Canvas Background - is visually subordinate entirely */}
      <ThreeLogoWrapper />

      <Container className="relative z-10 grid md:grid-cols-12 gap-8 items-center pt-20">
        <div className="md:col-span-8 lg:col-span-7 flex flex-col items-start gap-8">
          <Kicker>Smairys Netz-Manufaktur</Kicker>
          
          <h1 className="text-fluid-h1 leading-[1.1] font-bold text-foreground max-w-[800px] tracking-tight">
            Digitale Maßarbeit: Hochwertige Webseiten, SEO und Google Ads.
          </h1>
          
          <h2 className="text-fluid-p text-muted-foreground max-w-[600px] leading-relaxed">
            Wir entwickeln performante digitale Infrastrukturen und messbare Vertriebsprozesse für qualitätsbewusste mittelständische Unternehmen.
          </h2>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button 
              variant="primary" 
              size="lg"
              cta_id="CTA_HERO_PRIMARY"
              cta_label="Projektanfrage starten"
              cta_position="hero_main"
              page_type="homepage"
              className="w-full sm:w-auto"
            >
              Projektanfrage starten
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg"
              cta_id="CTA_HERO_SECONDARY"
              cta_label="Unsere Expertise"
              cta_position="hero_secondary"
              page_type="homepage"
              className="w-full sm:w-auto px-6 text-muted-foreground hover:text-foreground"
            >
              Unsere Expertise
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
