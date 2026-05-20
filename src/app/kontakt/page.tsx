import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { ContactFormBase } from '@/components/forms/ContactFormBase';
import { Header } from '@/components/layout/Header';
import { Kicker } from '@/components/ui/Kicker';
import { TrackedLink } from '@/components/analytics/TrackedLink';

export const metadata = {
  title: 'Kontakt aufnehmen',
  description: 'Starten Sie Ihre Projektanfrage bei der Netz-Manufaktur Smairys.',
};

export default function KontaktPage() {
  return (
    <>
      <Header />
      <Section className="bg-background min-h-screen pt-32 pb-16 flex items-center">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            
            {/* Kontaktinformationen (Sichtbar & Direkt) */}
            <div className="flex flex-col">
              <Kicker>Initiative ergreifen</Kicker>
              <h1 className="text-fluid-h1 font-bold mt-2 leading-[1.05] tracking-tight">
                Lassen Sie uns über Ihre Architektur sprechen.
              </h1>
              <p className="mt-6 text-fluid-p text-muted-foreground leading-relaxed max-w-lg">
                Wir bewerten Ihr Projektvorhaben unverbindlich und transparent. Hinterlassen Sie Ihre Eckdaten, und wir melden uns zeitnah für eine erste Einschätzung.
              </p>

              <div className="mt-12 flex flex-col gap-8 border-t border-border pt-8">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground tracking-widest uppercase mb-3">Direkter Kontakt</h3>
                  <div className="flex flex-col gap-2">
                    <TrackedLink
                      href="mailto:hallo@smairys.de"
                      cta="kontakt-mail"
                      location="kontakt"
                      intent="email"
                      className="text-xl font-medium hover:text-primary transition-colors"
                    >
                      hallo@smairys.de
                    </TrackedLink>
                    <TrackedLink
                      href="tel:+49123456789"
                      cta="kontakt-phone"
                      location="kontakt"
                      intent="phone"
                      className="text-xl font-medium hover:text-primary transition-colors"
                    >
                      +49 (0) 123 456 789
                    </TrackedLink>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground tracking-widest uppercase mb-3">Standort</h3>
                  <address className="not-italic text-lg text-foreground bg-accent/30 p-6 rounded-sm border border-border inline-block">
                    Smairys Netz-Manufaktur<br/>
                    Robin Schmeiries<br/>
                    66822 Lebach<br/>
                    Saarland, Deutschland
                  </address>
                </div>
              </div>
            </div>

            {/* Formular Integration aus Phase 3.5 */}
            <div className="bg-card text-card-foreground p-8 md:p-12 rounded-sm border border-border/50 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <h2 className="text-2xl font-bold mb-8">Projektanfrage starten</h2>
              <ContactFormBase page_type="contact_page" />
            </div>

          </div>
        </Container>
      </Section>
    </>
  );
}
