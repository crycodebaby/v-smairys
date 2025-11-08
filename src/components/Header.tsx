// src/components/Header.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle"; // alias: robust, egal wo diese Datei liegt

const navLinks = [
  { name: "Leistungen", href: "/leistungen" },
  { name: "Aktuelles Projekt", href: "/projekt" },
  // Kontakt ist als Primary-CTA separat
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Body scroll lock + ESC zum Schließen
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
          {/* Flicker-freies Logo */}
          <Link href="/" aria-label="Zurück zur Startseite">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative w-48 h-16">
                <Image
                  src="/logo/smairys-black.png"
                  alt="Smairys Logo (helles Theme)"
                  fill
                  priority
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/logo/smairys.png"
                  alt="Smairys Logo (dunkles Theme)"
                  fill
                  priority
                  className="hidden object-contain dark:block"
                />
              </div>
            </motion.div>
          </Link>

          {/* Desktop-Navigation */}
          <nav className="items-center hidden gap-x-8 md:flex">
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

          {/* Right cluster */}
          <div className="flex items-center gap-x-2 sm:gap-x-4">
            {/* Optional: dezente Utility-Links ab sm */}
            <div className="items-center hidden gap-x-4 sm:flex">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm transition-all border rounded-full group gap-x-2 border-primary/50 text-primary hover:border-primary hover:bg-primary/10"
              >
                <User size={16} />
                <span>Kunden-Login</span>
              </a>
              <a
                href="#"
                aria-label="Admin Dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors text-foreground/50 hover:text-primary"
              >
                <Shield size={20} />
              </a>
            </div>

            {/* Primary CTA */}
            <Link
              href="/kontakt"
              className="items-center justify-center hidden px-4 py-2 text-sm font-semibold transition-colors rounded-md shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 md:inline-flex"
            >
              Kontakt
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

            <nav className="flex flex-col items-center mt-6 space-y-8">
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

              <div className="w-full my-6 border-t border-white/10" />

              <Link
                href="#kontakt"
                className="inline-flex items-center justify-center px-8 py-3 text-xl font-semibold transition-colors rounded-md shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kontakt
              </Link>

              {/* Utility-Links auch mobil verfügbar */}
              <div className="flex flex-col items-center gap-6 mt-4">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-lg gap-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Kunden-Login</span>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Admin Dashboard"
                  className="text-foreground/60"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield size={22} />
                </a>
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
