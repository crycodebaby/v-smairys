import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/motion/Reveal";
import { BackdropIcons } from "@/components/backdrop/BackdropIcons";
import { ContactInfoCard } from "./ContactInfoCard";
import { ContactFormCard } from "./ContactFormCard";
import {
  CalendarBookingButton,
  ContactActionBar,
} from "./ContactActions";
import BookingCard from "./BookingCard";

type ContactFormSectionProps = {
  /** Tracking-Kontext (z. B. "homepage_invert_cta", "contact_page"). */
  pageType: string;
  /** Standort für Kontakt-Tracking. */
  contactLocation: "kontakt" | "homepage" | "footer";
  /** Optionaler Section-Override (Kicker, Headline, Text). */
  kicker?: string;
  title?: string;
  description?: React.ReactNode;
  /** Ob die "Standards"-Liste links unter dem Text gezeigt wird. */
  withStandards?: boolean;
  /** Ob unter der Adresse ein „Kein Live-Chat"-Hinweis erscheint. */
  withAvailabilityNote?: boolean;
  /** Booking-Card oberhalb der Kontaktaktionen (Startseite). */
  showBookingCard?: boolean;
  /** Label für den primären Kalender-CTA in der Action-Bar. */
  calendarCtaLabel?: string;
  /** Prominenter Primär-CTA oberhalb der BookingCard (Startseite Abschluss). */
  primaryBookingLabel?: string;
  className?: string;
  id?: string;
};

/**
 * Zentrale Kontakt-Sektion für öffentliche Seiten.
 *
 * Layout: zwei Spalten ab `lg`.
 *  - Links: Kicker + Headline + Sub-Text + ContactInfoCard + Standards-Liste
 *  - Rechts: ContactFormCard
 *
 * Wiederverwendbar:
 *  - Homepage (statt der bisherigen `CtaSection`)
 *  - Kontaktseite (statt eigenem Hand-Layout)
 *
 * Tracking-Logik unverändert: `ContactFormBase` und `ContactInfoCard`
 * benutzen die bestehenden TrackedLink/dispatchEvent-Mechaniken.
 */
export function ContactFormSection({
  pageType,
  contactLocation,
  kicker = "Initiative ergreifen",
  title = "Ihre digitale Infrastruktur. Auf höchstem Niveau.",
  description = "Füllen Sie das Formular aus, um eine unverbindliche Projektbewertung zu erhalten. Wir prüfen Ihre Anfrage und melden uns mit einer Ersteinschätzung.",
  withStandards = true,
  withAvailabilityNote = true,
  showBookingCard = false,
  calendarCtaLabel,
  primaryBookingLabel,
  className = "",
  id = "kontakt",
}: ContactFormSectionProps) {
  return (
    <Section
      id={id}
      className={`ambient-glow-amber ambient-glow-amber-bottom relative overflow-hidden bg-background ${className}`}
    >
      {/* Dezente Tiefenschärfe – auf Kontakt-Sections sehr ruhig */}
      <BackdropIcons preset="generic" showFrom="md" />
      <Container className="relative z-10">
        <div className="grid items-start gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal as="div" className="flex flex-col">
            <Kicker accent="brand">{kicker}</Kicker>
            <h2 className="text-fluid-h2 font-bold leading-[1.1] tracking-tight text-foreground">
              {title}
            </h2>
            {description && (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg sm:leading-[1.65]">
                {description}
              </p>
            )}

            {primaryBookingLabel && (
              <div className="mt-8">
                <CalendarBookingButton
                  location={contactLocation}
                  className="w-full min-h-11 rounded-sm px-6 sm:w-auto"
                >
                  {primaryBookingLabel}
                </CalendarBookingButton>
              </div>
            )}

            {showBookingCard && (
              <div className={primaryBookingLabel ? "mt-6" : "mt-8"}>
                <BookingCard
                  variant="inline"
                  hideButton={Boolean(primaryBookingLabel)}
                />
              </div>
            )}

            <div className="mt-6">
              {calendarCtaLabel && !showBookingCard && !primaryBookingLabel ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <CalendarBookingButton
                    location={contactLocation}
                    className="w-full sm:w-auto"
                  >
                    {calendarCtaLabel}
                  </CalendarBookingButton>
                  <ContactActionBar
                    location={contactLocation}
                    showCalendar={false}
                    className="w-full sm:w-auto"
                  />
                </div>
              ) : (
                <ContactActionBar
                  location={contactLocation}
                  showCalendar={!showBookingCard && !primaryBookingLabel}
                  className="w-full"
                />
              )}
            </div>

            <div className="mt-8 border-t border-border/40 pt-6 sm:mt-10 sm:pt-8">
              <ContactInfoCard location={contactLocation} />
            </div>

            {withStandards && (
              <ul className="mt-8 flex flex-col gap-3 border-t border-border/40 pt-6 sm:mt-10 sm:pt-8">
                <Standard text="Strenges NDA auf Anfrage" />
                <Standard text="100 % DSGVO & TTDSG konform" />
                <Standard text="Kein Outsourcing – Inhouse Code im Saarland" />
              </ul>
            )}

            {withAvailabilityNote && (
              <AvailabilityNote />
            )}
          </Reveal>

          <Reveal as="div" delay={120}>
            <ContactFormCard pageType={pageType} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function Standard({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm font-medium text-foreground/85">
      <span className="brand-dot" aria-hidden="true" />
      {text}
    </li>
  );
}

/**
 * Dezenter Hinweis: Kein Live-Chat, kein automatischer Terminslot.
 * Nutzt das `not-found-16-svgrepo-com.svg` als neutrales „kein …"-Symbol.
 *
 * Bewusst klein, nicht wie eine Fehlermeldung.
 */
function AvailabilityNote() {
  return (
    <div
      className="mt-8 flex items-start gap-3 rounded-lg border border-border/40 bg-card/40 px-4 py-3"
      role="note"
    >
      <Image
        src="/svg_librarie/not-found-16-svgrepo-com.svg"
        alt=""
        aria-hidden="true"
        width={18}
        height={18}
        className="mt-0.5 flex-none opacity-70"
      />
      <p className="text-xs leading-relaxed text-muted-foreground">
        Kein Live-Chat, kein automatischer Terminslot – wir antworten persönlich.{" "}
        <Link
          href="/kontakt"
          className="text-foreground/85 underline-offset-2 hover:text-brand-soft hover:underline"
        >
          Zur Kontaktseite
        </Link>
        .
      </p>
    </div>
  );
}
