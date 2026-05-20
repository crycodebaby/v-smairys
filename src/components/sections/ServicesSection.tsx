import React from 'react';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { Kicker } from '../ui/Kicker';
import { Button } from '../ui/Button';

export function ServicesSection() {
  const services = [
    {
      id: 'web',
      title: 'Digitales Fundament',
      subtitle: 'Next.js Webentwicklung',
      description: 'Hochperformante, conversion-optimierte Webseiten als zentraler Vertriebskanal. Millisekunden-Ladezeiten und perfekte technische Architektur.',
      ctaLabel: 'Webentwicklung anfragen',
      ctaId: 'CTA_SERVICES_WEB',
    },
    {
      id: 'seo',
      title: 'Zehnkämpfer im Netz',
      subtitle: 'Premium SEO-Strategien',
      description: 'Strukturierter Aufbau organischer Reichweite. Lokale und nationale Sichtbarkeit für relevante, hochqualifizierte Suchanfragen.',
      ctaLabel: 'SEO-Audit anfordern',
      ctaId: 'CTA_SERVICES_SEO',
    },
    {
      id: 'ads',
      title: 'Messbarer Vertrieb',
      subtitle: 'Google Ads Systematik',
      description: 'Profitables Lead-Management. Wir entwickeln Ads-Kampagnen, die genau Ihre Zielgruppe ansprechen und Budgets präzise skalieren.',
      ctaLabel: 'Kampagne planen',
      ctaId: 'CTA_SERVICES_ADS',
    }
  ];

  return (
    <Section className="bg-background" id="leistungen">
      <Container>
        <div className="mb-16 md:mb-24">
          <Kicker>Kernkompetenzen</Kicker>
          <h2 className="text-fluid-h2 font-bold text-foreground max-w-2xl mt-4 leading-tight">
            Wir kompromittieren nicht bei Qualität. Drei Disziplinen. Exzellent umgesetzt.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((svc) => (
            <Card 
              key={svc.id} 
              className="flex flex-col group relative overflow-hidden bg-card hover:bg-card/80 transition-all duration-500"
            >
              {/* Subtle liquid glass hover effect as requested */}
              <div className="absolute inset-0 bg-primary/5 transition-opacity duration-500 opacity-0 group-hover:opacity-100 mix-blend-screen pointer-events-none" />
              
              <div className="flex-1 relative z-10">
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  {svc.title}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  {svc.subtitle}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {svc.description}
                </p>
              </div>

              <div className="mt-auto relative z-10 pt-6 border-t border-border/50">
                <Button
                  variant="ghost"
                  className="w-full justify-between px-0 hover:bg-transparent hover:text-foreground text-muted-foreground font-semibold uppercase tracking-wider text-sm group/btn"
                  cta_id={svc.ctaId}
                  cta_label={svc.ctaLabel}
                  cta_position="services_grid"
                  page_type="homepage"
                  service_name={svc.title}
                >
                  <span>{svc.ctaLabel}</span>
                  <span className="transform transition-transform group-hover/btn:translate-x-2">→</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
