// src/components/Footer.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      id="footer"
      className="border-t border-white/10 bg-background"
    >
      <div className="container py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Spalte 1: Logo + Tagline */}
          <div>
            <Link
              href="/"
              aria-label="Zurück zur Startseite"
              className="inline-block"
            >
              <div className="relative h-12 w-44">
                <Image
                  src="/logo/smairys-black.png"
                  alt="Smairys Netz-Manufaktur Logo (helles Theme)"
                  fill
                  className="object-contain dark:hidden"
                  sizes="176px"
                />
                <Image
                  src="/logo/smairys.png"
                  alt="Smairys Netz-Manufaktur Logo (dunkles Theme)"
                  fill
                  className="hidden object-contain dark:block"
                  sizes="176px"
                />
              </div>
            </Link>
            <p className="mt-4 text-sm text-foreground/60">
              Handgefertigte digitale Erlebnisse für ambitionierte Unternehmen.
            </p>
          </div>

          {/* Spalten 2–3: Navigation */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <nav aria-label="Hauptnavigation">
              <h3 className="text-sm font-semibold font-heading">Navigation</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="#leistungen"
                    className="text-sm transition-colors text-foreground/80 hover:text-primary"
                  >
                    Leistungen
                  </Link>
                </li>
                <li>
                  <Link
                    href="#prozess"
                    className="text-sm transition-colors text-foreground/80 hover:text-primary"
                  >
                    Prozess
                  </Link>
                </li>
                <li>
                  <Link
                    href="#testimonials"
                    className="text-sm transition-colors text-foreground/80 hover:text-primary"
                  >
                    Partner
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="text-sm transition-colors text-foreground/80 hover:text-primary"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#kontakt"
                    className="text-sm transition-colors text-foreground/80 hover:text-primary"
                  >
                    Kontakt
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Rechtliches">
              <h3 className="text-sm font-semibold font-heading">
                Rechtliches
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/impressum"
                    className="text-sm transition-colors text-foreground/80 hover:text-primary"
                  >
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link
                    href="/datenschutz"
                    className="text-sm transition-colors text-foreground/80 hover:text-primary"
                  >
                    Datenschutz
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Spalte 4: Social */}
          <div>
            <h3 className="text-sm font-semibold font-heading">
              Folgen Sie uns
            </h3>
            <div className="flex mt-4 space-x-4">
              <a
                href="#"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors text-foreground/60 hover:text-primary"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors text-foreground/60 hover:text-primary"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter/X"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors text-foreground/60 hover:text-primary"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-16 text-sm text-center border-t border-white/10 text-foreground/60">
          <p>&copy; {year} Smairys Netz-Manufaktur. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
