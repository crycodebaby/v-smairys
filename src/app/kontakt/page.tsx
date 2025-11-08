// src/app/kontakt/page.tsx
import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import BookingCard from "@/components/contact/BookingCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kontakt – SMAIRYS Netz-Manufaktur",
  description:
    "Kontaktieren Sie SMAIRYS für ein fokussiertes Erstgespräch. Schnell, präzise und ohne Verkaufsdruck.",
  alternates: { canonical: "/kontakt" },
  openGraph: {
    title: "Kontakt – SMAIRYS Netz-Manufaktur",
    description:
      "Kontaktieren Sie SMAIRYS für ein fokussiertes Erstgespräch. Schnell, präzise und ohne Verkaufsdruck.",
    url: "/kontakt",
    type: "website",
  },
};

export default function KontaktPage() {
  return (
    <main className="relative isolate">
      {/* dezente Atmosphäre */}
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.03),transparent_20%,transparent_80%,rgba(0,0,0,0.04))]" />
        <div className="absolute left-1/2 top-[-6rem] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.10),transparent_70%)]" />
      </div>

      <section className="container py-16 sm:py-24">
        <header className="max-w-3xl mx-auto text-center">
          <p className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] font-medium text-foreground/70">
            Kontakt
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight font-heading sm:text-5xl">
            Sprechen wir über Ihr Vorhaben
          </h1>
          <p className="max-w-2xl mx-auto mt-3 text-base text-foreground/80 sm:text-lg">
            Kurz, konkret, wertschöpfend. Kein Verkaufsdruck – nur Klarheit.
          </p>
        </header>

        {/* Booking-CTA prominent oben, spannt auf mobilen Geräten über die volle Breite */}
        <div className="max-w-5xl mx-auto mt-10">
          <BookingCard />
        </div>

        {/* 2 Spalten ab md: links Info, rechts Formular */}
        <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto mt-8 md:grid-cols-2">
          {/* Info-Card */}
          <div className="p-6 border shadow-sm rounded-2xl border-border/60 bg-card/80 backdrop-blur-xl sm:p-7">
            <h2 className="text-xl font-semibold tracking-tight font-heading">
              Direkte Kontaktwege
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-foreground/80">
              <li>
                E-Mail:{" "}
                <a
                  href="mailto:robin@smairys-netz-manufaktur.de"
                  className="underline decoration-foreground/30 underline-offset-4 hover:text-primary"
                >
                  robin@smairys-netz-manufaktur.de
                </a>
              </li>
              <li>Telefon: 0160&nbsp;5539220</li>
              <li>Standort: 66265 Heusweiler (DE)</li>
            </ul>

            <div className="mt-6 text-sm text-foreground/70">
              <p>
                Sie bevorzugen einen festen Termin? Nutzen Sie die Buchung oben
                oder schreiben Sie kurz Ihr Ziel und Wunschzeitfenster; wir
                melden uns mit einem Slot.
              </p>
              <p className="mt-3">
                Rechtliches:{" "}
                <Link
                  href="/impressum"
                  className="underline decoration-foreground/30 underline-offset-4 hover:text-primary"
                >
                  Impressum
                </Link>{" "}
                ·{" "}
                <Link
                  href="/datenschutz"
                  className="underline decoration-foreground/30 underline-offset-4 hover:text-primary"
                >
                  Datenschutz
                </Link>
              </p>
            </div>
          </div>

          {/* Formular */}
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
