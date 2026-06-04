import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Header } from '@/components/layout/Header';
import { Kicker } from '@/components/ui/Kicker';

// 1. Seitenspezifische Metadata.
//    No-Risk-Fix aus SEO-Audit: solange die Seite nur aus Platzhalter-Sektionen
//    besteht, wird sie auf `noindex` gestellt. Sie bleibt für Links erreichbar
//    (`follow: true`), erscheint aber nicht in Google. Sobald echter Content
//    eingepflegt ist, kann das Robots-Flag entfernt werden.
export const metadata = {
  title: 'Google Ads Systematik | Profitables B2B Lead-Management',
  description:
    'Wir entwickeln Ads-Kampagnen, die genau Ihre Zielgruppe ansprechen und Budgets präzise skalieren.',
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

// 2. Tracking Prep
const PAGE_TYPE = 'service_ads';

export default function GoogleAdsPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col w-full">
        
        {/* Hero/Intro-Slot */}
        <Section className="bg-background pt-32 pb-16 min-h-[60vh] flex items-center border-b border-border">
          <Container>
            <Kicker>Messbarer Vertrieb</Kicker>
            <h1 className="text-fluid-h1 font-bold mt-2 leading-[1.05] tracking-tight max-w-4xl">
              Planbare B2B-Leads durch Google Ads.
            </h1>
            <p className="mt-6 text-fluid-p text-muted-foreground leading-relaxed max-w-2xl">
              [HERO INTRO TEXT PLATZHALTER AUS BLUEPRINT]
            </p>
          </Container>
        </Section>

        {/* Content-Wrapper Platzhalter für Features */}
        <Section className="bg-background">
          <Container>
            <div className="w-full min-h-[30vh] border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm font-mono p-8 rounded-sm">
              [PLATZHALTER: Blueprint Sektion "Search Intent & ROAS Garantie"]
            </div>
          </Container>
        </Section>

        {/* Platzhalter Final CTA */}
        <Section className="bg-foreground text-background">
          <Container>
            <div className="w-full min-h-[30vh] border border-dashed border-background/20 flex items-center justify-center opacity-80 text-sm font-mono p-8 rounded-sm">
              [PLATZHALTER: Blueprint Sektion "Ads Audit CTA" - Tracking: page_type="{PAGE_TYPE}"]
            </div>
          </Container>
        </Section>

      </main>
    </>
  );
}
