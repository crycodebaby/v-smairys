// src/components/contact/BookingCard.tsx
"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Video } from "lucide-react";

const CAL_URL = "https://calendar.app.google/xZDxJVbdPxonZAqh7";

export default function BookingCard() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative p-6 overflow-hidden border shadow-sm rounded-2xl border-border/60 bg-card/80 backdrop-blur-xl sm:p-7"
      aria-label="Kostenfreies Erstgespräch buchen"
    >
      {/* Brand-Glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -left-10 top-[-30%] h-[16rem] w-[16rem] rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.18),transparent_70%)]" />
        <div className="absolute -right-8 bottom-[-30%] h-[14rem] w-[14rem] rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.12),transparent_70%)]" />
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
          <Calendar className="w-6 h-6 text-primary" />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight font-heading">
            Kostenfreies Erstgespräch buchen
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-foreground/75">
            20 Minuten – Ihre Ziele, meine Einschätzung. Direkt im Kalender
            reservieren, kein Verkaufsgespräch.
          </p>

          {/* Meta-Badges */}
          <ul className="mt-3 flex flex-wrap gap-2 text-[11px] text-foreground/70">
            <li className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2 py-0.5">
              <Clock className="w-3 h-3" />
              20–25 Minuten
            </li>
            <li className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2 py-0.5">
              <Video className="w-3 h-3" />
              Online via Google Meet
            </li>
            <li className="rounded-full border border-border/60 bg-background/60 px-2 py-0.5">
              Kostenlos &amp; unverbindlich
            </li>
          </ul>

          <div className="mt-5">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Termin im Google Kalender buchen"
            >
              Termin reservieren
            </a>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="w-full h-px mt-6 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
    </motion.aside>
  );
}
