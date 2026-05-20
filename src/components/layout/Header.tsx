'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

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
          className="text-foreground tracking-tighter text-2xl font-bold flex items-center gap-2"
          aria-label="Smairys Netz-Manufaktur Startseite"
        >
          {/* Logo Placeholder (Wird später durch SVG ersetzt) */}
          <div className="w-8 h-8 bg-foreground rounded-sm" />
          <span>Smairys</span>
        </Link>
        
        <nav className="flex items-center gap-4 sm:gap-6 md:gap-8">
          {/* Minimalistisches Menü für Desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium tracking-wide">
            <Link href="/leistungen" className="text-muted-foreground hover:text-foreground transition-colors">Leistungen</Link>
            <Link href="/projekte" className="text-muted-foreground hover:text-foreground transition-colors">Projekte</Link>
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

          <Button
            variant={isScrolled ? 'primary' : 'secondary'}
            size="sm"
            cta_id="CTA_HEADER_CONTACT"
            cta_label="Kontakt aufnehmen"
            cta_position="header"
            page_type="general"
            className="hidden sm:inline-flex"
          >
            Kontakt aufnehmen
          </Button>
        </nav>
      </Container>
    </header>
  );
}
