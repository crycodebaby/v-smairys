import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { ContactFormSection } from "@/components/contact/ContactFormSection";

export const metadata: Metadata = {
  title: "Kontakt aufnehmen",
  description: "Starten Sie Ihre Projektanfrage bei der Smairys Netz-Manufaktur.",
};

export default function KontaktPage() {
  return (
    <>
      <Header />
      <main className="bg-background pt-24">
        <ContactFormSection
          pageType="contact_page"
          contactLocation="kontakt"
          kicker="Initiative ergreifen"
          title="Lassen Sie uns über Ihre Architektur sprechen."
          description="Wir bewerten Ihr Projektvorhaben unverbindlich und transparent. Hinterlassen Sie Ihre Eckdaten – wir melden uns innerhalb von 24 Stunden mit einer ersten Einschätzung."
          withStandards
          withAvailabilityNote
        />
      </main>
    </>
  );
}
