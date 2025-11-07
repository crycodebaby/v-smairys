// src/app/datenschutz/page.tsx
import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung – Smairys Netz-Manufaktur",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten nach DSGVO.",
  alternates: { canonical: "/datenschutz" },
  openGraph: {
    title: "Datenschutzerklärung – Smairys Netz-Manufaktur",
    url: "/datenschutz",
    type: "website",
  },
};

export default function DatenschutzPage() {
  return (
    <main>
      <LegalLayout
        title="Datenschutzerklärung"
        subtitle="Informationen zur Verarbeitung personenbezogener Daten (Art. 13/14 DSGVO)"
        breadcrumbs={[
          { label: "Startseite", href: "/" },
          { label: "Datenschutzerklärung" },
        ]}
        peerLink={{ label: "Zum Impressum", href: "/impressum" }}
      >
        <LegalSection title="Verantwortlicher">
          <p>
            <strong>Smairys Netz-Manufaktur</strong> – Robin Schmeiries
            <br />
            Kirschhofer Straße 15b, 66265 Heusweiler, Deutschland
            <br />
            E-Mail:{" "}
            <a
              href="mailto:robin@smairys-netz-manufaktur.de"
              className="underline hover:no-underline"
            >
              robin@smairys-netz-manufaktur.de
            </a>
          </p>
        </LegalSection>

        <LegalSection title="Allgemeines zur Datenverarbeitung">
          <p>
            Wir verarbeiten personenbezogene Daten nur, soweit dies zur
            Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte
            und Leistungen erforderlich ist. Die Verarbeitung erfolgt auf Basis
            der DSGVO, insbesondere Art. 6 Abs. 1 lit. b (Vertrag/Anbahnung),
            lit. f (berechtigte Interessen) und, soweit erforderlich, lit. a
            (Einwilligung).
          </p>
        </LegalSection>

        <LegalSection title="Server-Logs">
          <p>
            Bei jedem Aufruf werden technisch notwendige Daten verarbeitet:
            IP-Adresse (gekürzt/anonymisiert soweit möglich), Datum/Uhrzeit,
            User-Agent, Referrer, aufgerufene Ressourcen. Zweck: Betrieb,
            Sicherheit, Stabilität (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
        </LegalSection>

        <LegalSection title="Kontaktformulare & E-Mail">
          <p>
            Bei Kontaktaufnahme verarbeiten wir Ihre Angaben zur Bearbeitung der
            Anfrage (Art. 6 Abs. 1 lit. b DSGVO). Die Daten werden gelöscht,
            sobald sie für den Zweck nicht mehr erforderlich sind und keine
            Aufbewahrungspflichten entgegenstehen.
          </p>
        </LegalSection>

        <LegalSection title="Einsatz von Analysetools">
          <p>
            Sofern Analysen (z. B. <em>Vercel Analytics</em>) eingesetzt werden,
            erfolgt dies nur auf rechtlicher Grundlage (berechtigtes Interesse
            oder Einwilligung) und mit Anonymisierung/Pseudonymisierung, wo
            möglich. Details (Art, Zweck, Speicherdauer) werden im
            Consent-Banner bzw. hier ausgewiesen.
          </p>
        </LegalSection>

        <LegalSection title="Cookies & lokale Speicherung">
          <p>
            Wir verwenden nur notwendige Cookies oder lokal gespeicherte
            Einstellungen (z. B. Dark-Mode). Darüber hinausgehende Cookies
            (Marketing/Analyse) werden nur nach Einwilligung gesetzt.
          </p>
        </LegalSection>

        <LegalSection title="Drittlandtransfer">
          <p>
            Soweit Diensteanbieter außerhalb der EU/EWR eingesetzt werden,
            stellen wir ein angemessenes Datenschutzniveau sicher (z. B. durch
            EU-Standardvertragsklauseln).
          </p>
        </LegalSection>

        <LegalSection title="Ihre Rechte">
          <ul className="pl-5 space-y-1 text-sm leading-7 list-disc text-foreground/80">
            <li>
              Auskunft, Berichtigung, Löschung, Einschränkung (Art. 15–18)
            </li>
            <li>Datenübertragbarkeit (Art. 20)</li>
            <li>Widerspruch gegen Verarbeitung (Art. 21)</li>
            <li>Widerruf erteilter Einwilligungen (Art. 7 Abs. 3)</li>
            <li>
              Beschwerde bei einer Aufsichtsbehörde, z. B. LfDI Saarland (
              <Link
                href="https://datenschutz.saarland.de"
                target="_blank"
                className="underline hover:no-underline"
              >
                datenschutz.saarland.de
              </Link>
              )
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="Aufbewahrung & Löschung">
          <p>
            Daten werden gelöscht, sobald der Zweck entfällt und keine
            gesetzlichen Aufbewahrungsfristen entgegenstehen.
          </p>
        </LegalSection>

        <LegalSection title="Änderungen">
          <p>
            Wir passen diese Erklärung an, wenn Dienste/Prozesse geändert
            werden. Die jeweils aktuelle Fassung ist hier abrufbar.
          </p>
        </LegalSection>
      </LegalLayout>
    </main>
  );
}
