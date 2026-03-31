// src/components/Header.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { name: "Leistungen", href: "/leistungen" },
  { name: "Case Study", href: "/projekte/ergart" },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) =>
        e.key === "Escape" && setMobileMenuOpen(false);
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = original;
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-background/80 backdrop-blur-lg dark:border-white/10">
        <div className="container flex items-center justify-between h-24 mx-auto">
          {/* Logo */}
          <Link href="/" aria-label="Zurück zur Startseite">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative w-48 h-16">
                <Image
                  src="/logo/smairys-black.png"
                  alt="SMAIRYS Netz-Manufaktur Logo (helles Theme)"
                  fill
                  priority
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/logo/smairys.png"
                  alt="SMAIRYS Netz-Manufaktur Logo (dunkles Theme)"
                  fill
                  priority
                  className="hidden object-contain dark:block"
                />
              </div>
            </motion.div>
          </Link>

          {/* Desktop-Navigation */}
          <nav className="items-center hidden gap-x-8 md:flex" aria-label="Hauptnavigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors text-foreground/80 hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Rechts: CTA + Theme */}
          <div className="flex items-center gap-x-2 sm:gap-x-4">
            <Link
              href="/kontakt"
              className="items-center justify-center hidden px-4 py-2 text-sm font-semibold transition-colors rounded-md shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 md:inline-flex"
            >
              Gespräch buchen
            </Link>

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Menü öffnen"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobilmenü"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden"
          >
            <div className="container flex items-center justify-end h-24 mx-auto">
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Menü schließen"
                className="p-2 rounded"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col items-center mt-6 space-y-8" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xl font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="w-full my-6 border-t border-border/30" />

              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center px-8 py-3 text-xl font-semibold transition-colors rounded-md shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gespräch buchen
              </Link>

              <div className="mt-4">
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
