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
      {/* atmosphärisches Licht / „Afterglow“ */}
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        {/* sanfte vertikale Aura */}
        <div className="absolute inset-0 bg-[radial-gradient(80%_100%_at_50%_100%,hsl(var(--primary)/0.08)_0%,transparent_80%)]" />
        {/* farbiger Akzent – bewegt den Blick nach oben */}
        <div className="absolute left-1/2 top-0 h-[18rem] w-[28rem] -translate-x-1/2 rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.12),transparent_70%)]" />
      </div>

      <div className="container py-16 sm:py-20 lg:py-24">
        {/* ---------- GRID ---------- */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* ---------- Logo + Claim ---------- */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Link href="/" aria-label="Zur Startseite">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-[260px] max-w-full"
              >
                <div className="relative aspect-[11/3]">
                  <Image
                    src="/logo/smairys-black.png"
                    alt="Smairys Netz-Manufaktur Logo (helles Theme)"
                    fill
                    className="object-contain dark:hidden"
                    sizes="(max-width: 640px) 70vw, 260px"
                  />
                  <Image
                    src="/logo/smairys.png"
                    alt="Smairys Netz-Manufaktur Logo (dunkles Theme)"
                    fill
                    className="hidden object-contain dark:block"
                    sizes="(max-width: 640px) 70vw, 260px"
                  />
                </div>

                {/* edler Unterlicht-Glow */}
                <div
                  aria-hidden
                  className="absolute inset-x-6 -bottom-2 h-2 rounded-full blur-md bg-[radial-gradient(closest-side,hsl(var(--primary)/0.3),transparent_70%)]"
                />
              </motion.div>
            </Link>

            <p className="max-w-xs mt-5 text-sm leading-relaxed text-foreground/70">
              Technische Expertise & Design erschaffen eine Website gebaut für
              Unternehmen, die nicht Durchschnitt sein wollen.
            </p>
          </div>

          {/* ---------- Navigation ---------- */}
          <div className="grid grid-cols-2 gap-10 text-center md:col-span-2 sm:text-left">
            <nav aria-label="Hauptnavigation">
              <h3 className="text-sm font-semibold tracking-wide uppercase font-heading text-foreground/90">
                Navigation
              </h3>
              <ul className="mt-4 space-y-2">
                {[
                  { href: "#leistungen", label: "Leistungen" },
                  { href: "#prozess", label: "Prozess" },
                  { href: "#testimonials", label: "Partner" },
                  { href: "#faq", label: "FAQ" },
                  { href: "#kontakt", label: "Kontakt" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors text-foreground/75 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Rechtliches">
              <h3 className="text-sm font-semibold tracking-wide uppercase font-heading text-foreground/90">
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
                      className="text-sm transition-colors text-foreground/75 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ---------- Social ---------- */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold tracking-wide uppercase font-heading text-foreground/90">
              Verbunden bleiben
            </h3>

            <ul className="flex justify-center gap-5 mt-5 sm:justify-start">
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
                    className="flex items-center justify-center transition-all border rounded-full shadow-sm group h-11 w-11 border-border/60 bg-card/80 hover:shadow-md hover:border-border/40"
                  >
                    <span className="transition-colors text-foreground/70 group-hover:text-primary">
                      {item.icon}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <p className="mt-4 text-xs leading-relaxed text-foreground/60">
              Folgen Sie meiner Arbeit auf LinkedIn, GitHub & YouTube.
            </p>
          </div>
        </div>

        {/* ---------- Signatur ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative pt-8 mt-16 text-center border-t border-border/60"
        >
          {/* sanftes Lichtband */}
          <div
            aria-hidden
            className="absolute left-1/2 top-0 h-px w-[160px] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          />

          <p className="text-sm font-light tracking-wide sm:text-base text-foreground/65">
            <span className="font-heading text-foreground/80">© {year}</span>{" "}
            <span className="text-foreground/70">
              SMAIRYS&nbsp;Netz-Manufaktur
            </span>{" "}
            <span className="block mt-1 text-xs text-foreground/55 sm:inline sm:mt-0 sm:ml-1">
              Exklusive digitale Erlebnisse
            </span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
