'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { Brandmark } from '@/components/brand/Brandmark';
import { CalendarBookingButton } from '@/components/contact/ContactActions';
import { SITE } from '@/config/site';
import { MobileNav } from './MobileNav';

function LockIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 7V5a3 3 0 0 1 6 0v2M4 7h8a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
      />
    </svg>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass-header py-4' : 'bg-transparent py-6'
      }`}
    >
      <Container className="flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-foreground"
          aria-label={`${SITE.legalName} Startseite`}
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-md ring-1 ring-white/10 transition-shadow duration-300 group-hover:ring-brand/40">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 0%, hsl(var(--brand-glow) / 0.35), transparent 70%)",
              }}
            />
            <Brandmark variant="mark" surface="dark" size={28} />
          </span>
          <span className="text-lg font-semibold tracking-tight sm:text-xl">
            {SITE.shortName}
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4 md:gap-8">
          {/* Desktop-Menü ab `md`. Auf Mobile/iPad-Portrait übernimmt der
              MobileNav-Drawer am unteren Ende dieses `nav`. */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium tracking-wide">
            <NavLink href="/leistungen">Leistungen</NavLink>
            <NavLink href="/projekte">Projekte</NavLink>
            <NavLink href="/ueber-uns">Über uns</NavLink>
          </div>

          {/*
            Kundenlogin-Pille im Header.
            - prefetch={false}: keine vorzeitige Prerender-Anforderung
            - keinerlei Plausible-Tracking-Hooks (kein Marketing-Event)
            - Liquid-Glass-Optik, bewusst dezenter als der Haupt-CTA
            - Mobil: kompakter, nur Lock-Icon + Kurzlabel
            - Chroma-Hover-Glow konsistent mit GlassButton
          */}
          <Link
            href="/kundenlogin"
            prefetch={false}
            aria-label="Kundenlogin (interner Zugang)"
            className={
              "group relative inline-flex select-none items-center justify-center gap-1.5 " +
              "overflow-hidden rounded-full border border-white/15 bg-white/[0.06] " +
              "px-3 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur-xl " +
              "transition-[transform,background-color,border-color,color] duration-200 ease-out " +
              "hover:border-white/30 hover:bg-white/[0.12] hover:text-foreground " +
              "active:scale-[0.97] " +
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 " +
              "sm:px-4 sm:py-2 sm:text-sm"
            }
          >
            {/* Top-Highlight Hairline – setzt sich von einer flachen Pille ab */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
            />
            {/* Chroma-Glow: nur bei Hover/Press, sehr dezent */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
            >
              <span className="absolute -left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-fuchsia-500/25 blur-2xl" />
              <span className="absolute -right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-sky-400/25 blur-2xl" />
            </span>
            <LockIcon className="h-3.5 w-3.5 opacity-80 transition-opacity duration-200 group-hover:opacity-100" />
            <span className="relative">
              <span className="sm:hidden">Login</span>
              <span className="hidden sm:inline">Kundenlogin</span>
            </span>
          </Link>

          <CalendarBookingButton
            location="header"
            className="hidden min-h-9 rounded-sm px-4 md:inline-flex"
          >
            Kontakt aufnehmen
          </CalendarBookingButton>

          {/* Mobile/Tablet (< md): Hamburger-Drawer. */}
          <MobileNav />
        </nav>
      </Container>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-brand to-brand-soft transition-transform duration-300 group-hover:scale-x-100"
      />
    </Link>
  );
}
