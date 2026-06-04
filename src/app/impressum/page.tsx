import React from "react";
import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/layout/Header";
import { Kicker } from "@/components/ui/Kicker";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum der ${SITE.legalName}.`,
};

export default function ImpressumPage() {
  return (
    <>
      <Header />
      <Section className="bg-background pt-32 pb-16">
        <Container className="max-w-3xl">
          <Kicker accent="brand">Rechtliches</Kicker>
          <h1 className="text-fluid-h1 font-bold leading-[1.05] tracking-tight">
            Impressum
          </h1>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-muted-foreground">
            <section>
              <h2 className="mb-3 text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Anbieter
              </h2>
              <address className="not-italic">
                <span className="block font-medium text-foreground">
                  {SITE.legalName}
                </span>
                <span className="block">{SITE.owner.name}</span>
                <span className="block">{SITE.address.street}</span>
                <span className="block">
                  {SITE.address.postalCode} {SITE.address.city}
                </span>
                <span className="block">
                  {SITE.address.region}, {SITE.address.country}
                </span>
              </address>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Kontakt
              </h2>
              <ul className="space-y-1">
                <li>
                  E-Mail:{" "}
                  <a
                    href={SITE.email.mailto}
                    className="text-foreground hover:text-brand-soft hover:underline underline-offset-4"
                  >
                    {SITE.email.display}
                  </a>
                </li>
                <li>
                  Telefon:{" "}
                  <a
                    href={SITE.phone.tel}
                    className="text-foreground hover:text-brand-soft hover:underline underline-offset-4"
                  >
                    {SITE.phone.display}
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Verantwortlich für den Inhalt
              </h2>
              <p>
                {SITE.owner.name}, {SITE.address.street},{" "}
                {SITE.address.postalCode} {SITE.address.city}
              </p>
              <p className="mt-2 text-sm">
                gem. § 18 Abs. 2 MStV
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Umsatzsteuer-ID
              </h2>
              <p>
                Die Umsatzsteuer-Identifikationsnummer wird ergänzt, sobald sie
                vorliegt. Bei Bedarf bitte direkt anfragen.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Streitschlichtung
              </h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-brand-soft hover:underline underline-offset-4"
                >
                  ec.europa.eu/consumers/odr
                </a>
                . Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold uppercase tracking-[0.18em] text-foreground">
                Haftung &amp; Urheberrecht
              </h2>
              <p>
                Inhalte dieser Seite wurden mit größter Sorgfalt erstellt. Für
                die Richtigkeit, Vollständigkeit und Aktualität wird jedoch
                keine Gewähr übernommen. Externe Links wurden zum Zeitpunkt der
                Verlinkung geprüft, auf den späteren Inhalt der verlinkten Seiten
                haben wir keinen Einfluss.
              </p>
              <p className="mt-3">
                Alle dargestellten Marken-, Produkt- und Firmenlogos sind
                Eigentum ihrer jeweiligen Inhaber und werden ausschließlich zu
                Referenzzwecken eingesetzt.
              </p>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
}
