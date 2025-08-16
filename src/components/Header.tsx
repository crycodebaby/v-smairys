// src/components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { name: "Leistungen", href: "/leistungen" },
  { name: "Unser Prozess", href: "/prozess" },
  { name: "Kontakt", href: "/kontakt" },
];

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const logoSrc =
    mounted && theme === "light"
      ? "/logo/smairys-black.png"
      : "/logo/smairys.png";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-background/80 backdrop-blur-lg dark:border-white/10">
        <div className="container flex items-center justify-between h-24 mx-auto">
          <Link href="/" aria-label="Zurück zur Startseite">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {mounted ? (
                <Image
                  src={logoSrc}
                  alt="Smairys Netz-Manufaktur Logo"
                  width={500}
                  height={500}
                  className="w-auto h-16"
                  priority
                  key={logoSrc}
                />
              ) : (
                <div className="w-48 h-16 rounded-md bg-white/10 animate-pulse" />
              )}
            </motion.div>
          </Link>

          <nav className="items-center hidden md:flex gap-x-8">
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

          <div className="flex items-center gap-x-2 sm:gap-x-4">
            <div className="items-center hidden sm:flex gap-x-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-sm transition-all border rounded-full group gap-x-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary"
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

            <ThemeToggle />

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menü öffnen"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-0 z-40 p-4 shadow-lg bg-background pt-28 md:hidden"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-9 right-5"
              aria-label="Menü schließen"
            >
              <X size={24} />
            </button>
            <nav className="flex flex-col items-center space-y-8">
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
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xl gap-x-2"
              >
                <User size={22} />
                <span>Kunden-Login</span>
              </a>
              <div className="pt-6">
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      {/* HIER WAR DER TIPPFEHLER: Ich habe 'AnPresence' zu 'AnimatePresence' korrigiert. */}
    </>
  );
};

export default Header;
