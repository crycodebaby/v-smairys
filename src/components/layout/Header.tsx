'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

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
            Unauffälliger Kundenlogin-Button.
            - prefetch={false}: keine vorzeitige Prerender-Anforderung
            - keinerlei Plausible-Tracking-Hooks
            - Liquid-Glass-Optik, ein Tick zurückhaltender als der Haupt-CTA
            - mobil sichtbar (kein hidden), aber kompakter
          */}
          <Link
            href="/kundenlogin"
            prefetch={false}
            aria-label="Kundenlogin (interner Zugang)"
            className={
              "inline-flex items-center justify-center rounded-full " +
              "border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium " +
              "text-foreground/85 backdrop-blur-xl transition-all duration-200 " +
              "hover:border-white/50 hover:bg-white/20 hover:text-foreground " +
              "active:scale-[0.97] " +
              "sm:px-4 sm:py-2 sm:text-sm"
            }
          >
            Kundenlogin
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
