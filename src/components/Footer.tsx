"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      id="footer"
      className="relative overflow-hidden border-t bg-gradient-to-b from-background via-background to-background/95 border-border/60"
    >
      {/* Atmosphärische Lichter / Afterglow */}
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        {/* sanfte vertikale Aura */}
        <div className="absolute inset-0 bg-[radial-gradient(80%_100%_at_50%_100%,hsl(var(--primary)/0.08)_0%,transparent_80%)]" />
        {/* farbiger Akzent */}
        <div className="absolute left-1/2 top-0 h-[22rem] w-[36rem] -translate-x-1/2 rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.12),transparent_70%)]" />
      </div>

      <div className="container py-16 sm:py-20 lg:py-24">
        {/* ---------- 2 Spalten ---------- */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* ---------- Spalte 1: Logo, Claim, Social ---------- */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Link href="/" aria-label="Zur Startseite">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-[320px] max-w-full"
              >
                {/* Größeres Logo mit edler Bühne */}
                <div className="relative aspect-[11/3]">
                  <Image
                    src="/logo/smairys-black.png"
                    alt="SMAIRYS Netz-Manufaktur Logo (helles Theme)"
                    fill
                    className="object-contain dark:hidden"
                    sizes="(max-width: 640px) 85vw, 320px"
                    priority={false}
                  />
                  <Image
                    src="/logo/smairys.png"
                    alt="SMAIRYS Netz-Manufaktur Logo (dunkles Theme)"
                    fill
                    className="hidden object-contain dark:block"
                    sizes="(max-width: 640px) 85vw, 320px"
                    priority={false}
                  />
                </div>

                {/* Unterlicht-Glow / Wasserzeichen */}
                <div
                  aria-hidden
                  className="absolute inset-x-8 -bottom-2 h-2 rounded-full blur-md bg-[radial-gradient(closest-side,hsl(var(--primary)/0.35),transparent_70%)]"
                />
              </motion.div>
            </Link>

            <p className="max-w-md mt-6 text-[15px] leading-relaxed text-foreground/70">
              Technische Präzision und markenstarkes Design – Websites, die
              Vertrauen schaffen und wirken.
            </p>

            {/* Social */}
            <ul className="flex justify-center gap-5 mt-6 sm:justify-start">
              {[
                {
                  icon: <Linkedin size={20} />,
                  href: "https://www.linkedin.com/in/robin-schmeiries-927b682ba/",
                  label: "LinkedIn",
                },
                {
                  icon: <Github size={20} />,
                  href: "https://github.com/crycodebaby",
                  label: "GitHub",
                },
                {
                  icon: <Youtube size={20} />,
                  href: "http://www.youtube.com/@RobinSmairys",
                  label: "YouTube",
                },
              ].map((item) => (
                <motion.li
                  key={item.href}
                  whileHover={{ y: -2, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16 }}
                >
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex items-center justify-center transition-all border rounded-full shadow-sm group h-11 w-11 border-border/60 bg-card/80 hover:shadow-md hover:border-border/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <span className="transition-colors text-foreground/70 group-hover:text-primary">
                      {item.icon}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* ---------- Spalte 2: Navigation (2 Blöcke) ---------- */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            {/* Hauptnavigation */}
            <nav aria-label="Hauptnavigation">
              <h3 className="text-xs font-semibold tracking-[0.12em] uppercase font-heading text-foreground/80">
                Navigation
              </h3>
              <ul className="mt-4 space-y-2">
                {[
                  { href: "/leistungen", label: "Leistungen" },
                  { href: "/#prozess", label: "Aktuelles Projekt" }, // konsistent mit Header
                  { href: "/#testimonials", label: "Partner" },
                  { href: "/#faq", label: "FAQ" },
                  { href: "/#kontakt", label: "Kontakt" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors text-foreground/75 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm px-1 py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Rechtliches */}
            <nav aria-label="Rechtliches">
              <h3 className="text-xs font-semibold tracking-[0.12em] uppercase font-heading text-foreground/80">
                Rechtliches
              </h3>
              <ul className="mt-4 space-y-2">
                {[
                  { href: "/impressum", label: "Impressum" },
                  { href: "/datenschutz", label: "Datenschutz" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors text-foreground/75 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm px-1 py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* ---------- Signatur / Deluxe-Line ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative pt-8 mt-16 text-center border-t border-border/60"
        >
          {/* zentrierter Lichtstrich */}
          <div
            aria-hidden
            className="absolute left-1/2 top-0 h-px w-[200px] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          />

          <p className="text-sm sm:text-[15px] font-light tracking-wide text-foreground/65">
            <span className="font-heading text-foreground/80">© {year}</span>{" "}
            <span className="text-foreground/70">
              SMAIRYS&nbsp;Netz-Manufaktur
            </span>
            <span className="block mt-1 text-[12px] text-foreground/55 sm:inline sm:mt-0 sm:ml-1">
              Exklusive digitale Erlebnisse
            </span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
