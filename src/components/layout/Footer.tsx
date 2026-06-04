import React from "react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { TrackedLink } from "../analytics/TrackedLink";
import { Brandmark } from "@/components/brand/Brandmark";
import { SITE } from "@/config/site";

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 bg-background pt-16 pb-8 text-foreground md:pt-24 md:pb-12">
      {/* feiner Brand-Akzent oben */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent"
      />

      <Container>
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5"
              aria-label={`${SITE.legalName} Startseite`}
            >
              <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-md ring-1 ring-white/10 transition-shadow duration-300 group-hover:ring-brand/40">
                <Brandmark variant="mark" surface="dark" size={28} />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                {SITE.shortName}
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {SITE.tagline}. Digitale Maßarbeit aus dem Saarland.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em]">
              Leistungen
            </h4>
            <FooterLink href="/leistungen/webseiten">Next.js Webentwicklung</FooterLink>
            <FooterLink href="/leistungen/seo">Premium SEO</FooterLink>
            <FooterLink href="/leistungen/google-ads">Google Ads Systematik</FooterLink>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em]">
              Unternehmen
            </h4>
            <FooterLink href="/ueber-uns">Über uns &amp; Philosophie</FooterLink>
            <FooterLink href="/projekte">Projekte</FooterLink>
            <FooterLink href="/kontakt">Kontakt aufnehmen</FooterLink>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em]">
              {SITE.legalName}
            </h4>
            <address className="flex flex-col gap-1 text-sm not-italic text-muted-foreground">
              <span>{SITE.owner.name}</span>
              <span>{SITE.address.street}</span>
              <span>
                {SITE.address.postalCode} {SITE.address.city}
              </span>
              <span>
                {SITE.address.region}, {SITE.address.country}
              </span>
            </address>
            <div className="mt-2 flex flex-col gap-1">
              <TrackedLink
                href={SITE.email.mailto}
                cta="footer-mail"
                location="footer"
                intent="email"
                className="text-sm text-muted-foreground transition-colors hover:text-brand-soft"
              >
                {SITE.email.display}
              </TrackedLink>
              <TrackedLink
                href={SITE.phone.tel}
                cta="footer-phone"
                location="footer"
                intent="phone"
                className="text-sm text-muted-foreground transition-colors hover:text-brand-soft"
              >
                {SITE.phone.display}
              </TrackedLink>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-xs text-muted-foreground md:flex-row">
          <div>
            &copy; {new Date().getFullYear()} {SITE.legalName}. Alle Rechte vorbehalten.
          </div>
          <div className="flex items-center gap-6">
            <FooterLink href="/impressum" inline>
              Impressum
            </FooterLink>
            <FooterLink href="/datenschutz" inline>
              Datenschutz
            </FooterLink>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  inline = false,
}: {
  href: string;
  children: React.ReactNode;
  inline?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        inline
          ? "transition-colors hover:text-foreground hover:underline underline-offset-4"
          : "text-sm text-muted-foreground transition-colors hover:text-foreground"
      }
    >
      {children}
    </Link>
  );
}
