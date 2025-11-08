// src/components/contact/BookingCard.tsx
"use client";

import { motion } from "framer-motion";

const CAL_URL = "https://calendar.app.google/xZDxJVbdPxonZAqh7";

/** Minimalistisches Google-Calendar-Icon als Inline-SVG (Markenfarben angedeutet) */
function GoogleCalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
      role="img"
    >
      {/* Rahmen */}
      <rect x="4" y="6" width="40" height="38" rx="8" fill="#1a73e8" />
      {/* oberer Reiter mit Google-Farben */}
      <rect x="4" y="6" width="40" height="10" rx="8" fill="#e8f0fe" />
      <rect x="8" y="6" width="8" height="10" fill="#ea4335" />
      <rect x="16" y="6" width="8" height="10" fill="#fbbc05" />
      <rect x="24" y="6" width="8" height="10" fill="#34a853" />
      <rect x="32" y="6" width="12" height="10" rx="8" fill="#4285f4" />
      {/* Blatt */}
      <rect x="8" y="18" width="32" height="22" rx="4" fill="#ffffff" />
      {/* dezente Zahl / Terminfläche */}
      <rect x="12" y="22" width="24" height="14" rx="3" fill="#e8f0fe" />
    </svg>
  );
}

export default function BookingCard() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative p-6 overflow-hidden border shadow-sm  rounded-2xl border-border/60 bg-card/80 backdrop-blur-xl sm:p-7"
      aria-label="Schnelltermin per Google Kalender buchen"
    >
      {/* weiche Brand-Glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -left-10 top-[-30%] h-[16rem] w-[16rem] rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.18),transparent_70%)]" />
        <div className="absolute -right-8 bottom-[-30%] h-[14rem] w-[14rem] rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.12),transparent_70%)]" />
      </div>

      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <GoogleCalendarIcon className="w-12 h-12" />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight font-heading">
            Termin sofort buchen
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-foreground/75">
            20-minütiges Erstgespräch: Ziele klären, Machbarkeit prüfen,
            nächster Schritt. Direkt im Kalender reservieren.
          </p>

          {/* kleine „Meta“-Badges */}
          <ul className="mt-3 flex flex-wrap gap-2 text-[11px] text-foreground/70">
            <li className="rounded-full border border-border/60 bg-background/60 px-2 py-0.5">
              Kostenlos & unverbindlich
            </li>
            <li className="rounded-full border border-border/60 bg-background/60 px-2 py-0.5">
              Online via Google Meet
            </li>
            <li className="rounded-full border border-border/60 bg-background/60 px-2 py-0.5">
              20–25&nbsp;Minuten
            </li>
          </ul>

          <div className="mt-5">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition rounded-md  bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Google Kalender – Termin buchen"
            >
              Im Google Kalender buchen
              <span
                aria-hidden
                className="inline-block h-[1.15em] w-[1.15em] rounded-[4px] bg-white/20"
              />
            </a>
          </div>
        </div>
      </div>

      {/* zartes Lichtband unten */}
      <div
        aria-hidden
        className="w-full h-px mt-6 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
    </motion.aside>
  );
}
