// src/app/impressum/page.tsx
import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";

export const metadata: Metadata = {
  title: "Impressum – Smairys Netz-Manufaktur",
  description:
    "Anbieterkennzeichnung (Impressum) der Smairys Netz-Manufaktur nach § 5 TMG und § 18 Abs. 2 MStV.",
  alternates: { canonical: "/impressum" },
  openGraph: {
    title: "Impressum – Smairys Netz-Manufaktur",
    url: "/impressum",
    type: "website",
  },
};

export default function ImpressumPage() {
  return (
    <main>
      <LegalLayout
        title="Impressum"
        subtitle="Anbieterkennzeichnung gemäß § 5 TMG"
        breadcrumbs={[
          { label: "Startseite", href: "/" },
          { label: "Impressum" },
        ]}
        peerLink={{ label: "Zur Datenschutzerklärung", href: "/datenschutz" }}
      >
        <LegalSection title="Diensteanbieter">
          <p>
            <strong>Smairys Netz-Manufaktur</strong>
            <br />
            Robin Schmeiries
            <br />
            Kirschhofer Straße 15b
            <br />
            66265 Heusweiler
            <br />
            Deutschland
          </p>
          <p>
            Telefon: 0160&nbsp;5539220
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

        <LegalSection title="Vertretungsberechtigt">
          <p>Robin Schmeiries (Einzelunternehmer).</p>
        </LegalSection>

        <LegalSection title="Umsatzsteuer-ID">
          <p>
            Kleinunternehmer gemäß § 19 UStG – keine Ausweisung der
            Umsatzsteuer. {/* Falls später vorhanden: USt-IdNr.: DE… */}
          </p>
        </LegalSection>

        <LegalSection title="Inhaltlich Verantwortlicher">
          <p>Gemäß § 18 Abs. 2 MStV: Robin Schmeiries, Anschrift wie oben.</p>
        </LegalSection>

        <LegalSection title="Berufsrechtliche Angaben">
          <p>
            Tätigkeit: Web-/Softwareentwicklung, Design und Beratung. Es
            bestehen keine berufsrechtlichen Kammerzugehörigkeiten.
          </p>
        </LegalSection>

        <LegalSection title="Haftung für Inhalte">
          <p>
            Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für
            die Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird
            jedoch keine Gewähr übernommen. Als Diensteanbieter sind wir gemäß §
            7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
            allgemeinen Gesetzen verantwortlich.
          </p>
        </LegalSection>

        <LegalSection title="Haftung für Links">
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter. Auf deren
            Inhalte haben wir keinen Einfluss; für diese Inhalte übernehmen wir
            keine Gewähr. Für die Inhalte der verlinkten Seiten ist stets der
            jeweilige Anbieter oder Betreiber verantwortlich.
          </p>
        </LegalSection>

        <LegalSection title="Urheberrecht">
          <p>
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung.
          </p>
        </LegalSection>
      </LegalLayout>
    </main>
  );
}
