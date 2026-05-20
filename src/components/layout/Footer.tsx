import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { TrackedLink } from '../analytics/TrackedLink';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 md:pt-24 md:pb-12 text-foreground">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          <div className="flex flex-col gap-6">
            <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2" aria-label="Startseite">
              <div className="w-6 h-6 bg-foreground rounded-sm" />
              Smairys
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Digitale Maßarbeit für den Mittelstand. Hochwertige Infrastrukturen und messbare Vertriebsprozesse.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-medium text-sm tracking-widest uppercase mb-2">Leistungen</h4>
            <Link href="/leistungen/webseiten" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Next.js Webentwicklung</Link>
            <Link href="/leistungen/seo" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Premium SEO</Link>
            <Link href="/leistungen/google-ads" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Google Ads Systematik</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-medium text-sm tracking-widest uppercase mb-2">Unternehmen</h4>
            <Link href="/ueber-uns" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Über uns & Philosophie</Link>
            <Link href="/projekte" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Projekte</Link>
            <Link href="/kontakt" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Kontakt aufnehmen</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-medium text-sm tracking-widest uppercase mb-2">Smairys Netz-Manufaktur</h4>
            <address className="not-italic text-sm text-muted-foreground flex flex-col gap-1">
              <span>Robin Schmeiries</span>
              <span>66822 Lebach, Saarland</span>
            </address>
            <div className="flex flex-col gap-1 mt-2">
              <TrackedLink
                href="mailto:hallo@smairys.de"
                cta="footer-mail"
                location="footer"
                intent="email"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                hallo@smairys.de
              </TrackedLink>
              <TrackedLink
                href="tel:+49123456789"
                cta="footer-phone"
                location="footer"
                intent="phone"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                +49 (0) 123 456 789
              </TrackedLink>
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50 text-xs text-muted-foreground">
          <div>
            &copy; {new Date().getFullYear()} Smairys Netz-Manufaktur. Alle Rechte vorbehalten.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
