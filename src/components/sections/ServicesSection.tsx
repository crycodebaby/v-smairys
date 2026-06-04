import React from 'react';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { Kicker } from '../ui/Kicker';
import { Button } from '../ui/Button';
import { Reveal } from '../motion/Reveal';

export function ServicesSection() {
  const services = [
    {
      id: 'web',
      title: 'Digitales Fundament',
      subtitle: 'Next.js Webentwicklung',
      description: 'Hochperformante, conversion-optimierte Webseiten als zentraler Vertriebskanal. Millisekunden-Ladezeiten und perfekte technische Architektur.',
      ctaLabel: 'Webentwicklung anfragen',
      ctaId: 'CTA_SERVICES_WEB',
      href: '/leistungen/webseiten',
    },
    {
      id: 'seo',
      title: 'Zehnkämpfer im Netz',
      subtitle: 'Premium SEO-Strategien',
      description: 'Strukturierter Aufbau organischer Reichweite. Lokale und nationale Sichtbarkeit für relevante, hochqualifizierte Suchanfragen.',
      ctaLabel: 'SEO-Audit anfordern',
      ctaId: 'CTA_SERVICES_SEO',
      href: '/leistungen/seo',
    },
    {
      id: 'ads',
      title: 'Messbarer Vertrieb',
      subtitle: 'Google Ads Systematik',
      description: 'Profitables Lead-Management. Wir entwickeln Ads-Kampagnen, die genau Ihre Zielgruppe ansprechen und Budgets präzise skalieren.',
      ctaLabel: 'Kampagne planen',
      ctaId: 'CTA_SERVICES_ADS',
      href: '/leistungen/google-ads',
    }
  ];

  return (
    <Section className="bg-background" id="leistungen">
      <Container>
        <Reveal as="div" className="mb-10 sm:mb-16 lg:mb-24">
          <Kicker accent="brand">Kernkompetenzen</Kicker>
          <h2 className="mt-4 max-w-2xl text-fluid-h2 font-bold leading-tight text-foreground">
            Wir kompromittieren nicht bei Qualität. Drei Disziplinen. Exzellent umgesetzt.
          </h2>
        </Reveal>

        {/*
         * Responsive Grid:
         *  - Mobile (≤ 640): 1 Spalte, voller Fokus pro Karte
         *  - iPad Portrait (640–1024): 1 Spalte – die Karten haben viel Text,
         *    auf iPad portrait würden 3 nebeneinander zu schmal und reißerisch
         *  - iPad Landscape / Laptop (≥ 1024): 3 Spalten als finales Layout
         */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {services.map((svc, idx) => (
            <Reveal key={svc.id} delay={idx * 120}>
              <Card
                className="group relative flex h-full flex-col overflow-hidden bg-card/70 transition-all duration-500 hover:-translate-y-0.5 hover:border-brand/40"
              >
                {/* Top-Hairline */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
                />
                {/* Brand-Glow nur bei Hover, sehr dezent */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(140% 80% at 50% 0%, hsl(var(--brand-glow) / 0.14), transparent 70%)",
                  }}
                />

                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    <span className="brand-dot" aria-hidden="true" />
                    {svc.title}
                  </div>
                  <h3 className="mb-6 mt-3 text-2xl font-bold text-foreground">
                    {svc.subtitle}
                  </h3>
                  <p className="mb-8 leading-relaxed text-muted-foreground">
                    {svc.description}
                  </p>
                </div>

                <div className="relative z-10 mt-auto border-t border-border/50 pt-6">
                  <Button
                    variant="ghost"
                    href={svc.href}
                    className="w-full justify-between px-0 hover:bg-transparent hover:text-brand-soft text-muted-foreground font-semibold uppercase tracking-wider text-sm group/btn"
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
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
