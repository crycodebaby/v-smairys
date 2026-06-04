import Image from "next/image";
import React from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/motion/Reveal";
import { BackdropIcons } from "@/components/backdrop/BackdropIcons";

type TechItem = {
  name: string;
  src: string;
  /** Kurzer, sachlicher Verwendungs-Hinweis. */
  context: string;
};

/**
 * Inhouse-Stack der Netz-Manufaktur.
 *
 * Icons stammen aus `public/svg_librarie/nonicons_programming_icons/` –
 * 16×16-SVGs, die wir in einer 32–40 px Touch-Fläche rendern. Diese
 * Sektion wird primär unter `/ueber-uns` ausgespielt; sie ist aber bewusst
 * Section-portabel und kann auch unter „Leistungen / Tech" wiederverwendet
 * werden, sobald sich das ergibt.
 */
const STACK: readonly TechItem[] = [
  {
    name: "TypeScript",
    src: "/svg_librarie/nonicons_programming_icons/typescript-16-svgrepo-com.svg",
    context: "Strikte Typen sichern Wartbarkeit über Jahre.",
  },
  {
    name: "React",
    src: "/svg_librarie/nonicons_programming_icons/react-16-svgrepo-com.svg",
    context: "Komponentenarchitektur für komplexe Vertriebs-UIs.",
  },
  {
    name: "Node.js",
    src: "/svg_librarie/nonicons_programming_icons/node-16-svgrepo-com.svg",
    context: "Server-Logik, APIs, Edge-Funktionen.",
  },
  {
    name: "HTML",
    src: "/svg_librarie/nonicons_programming_icons/html-16-svgrepo-com.svg",
    context: "Semantische Markup-Basis für SEO und A11y.",
  },
  {
    name: "CSS",
    src: "/svg_librarie/nonicons_programming_icons/css-16-svgrepo-com.svg",
    context: "Tailwind + Custom-Tokens für Theme-Tiefe.",
  },
  {
    name: "Docker",
    src: "/svg_librarie/nonicons_programming_icons/docker-16-svgrepo-com.svg",
    context: "Reproduzierbare Build-/Deploy-Umgebungen.",
  },
] as const;

type TechStackSectionProps = {
  /** Verbergen / Anzeigen der Kicker- + Headline-Zeile (z. B. wenn die
   *  Sektion in eine bereits betitelte Page eingebettet ist). */
  withHeader?: boolean;
  className?: string;
};

export function TechStackSection({
  withHeader = true,
  className = "",
}: TechStackSectionProps) {
  return (
    <Section className={`relative overflow-hidden bg-background ${className}`}>
      {/*
       * Tiefenschärfe-Layer aus genau den Tech-Icons, die unten in den Tiles
       * sichtbar sind. Bewusst dezent (Opazität ~ 5 %), variable Blur-Stufen,
       * langsam driftend → hochwertige Räumlichkeit, kein „Bildschirmschoner".
       * Auf Mobile (`hidden sm:block`) ausgeblendet, damit die kompakte
       * Phone-View ruhig und CPU-arm bleibt.
       */}
      <BackdropIcons preset="tech" showFrom="sm" />

      <Container className="relative z-10">
        {withHeader && (
          <Reveal as="div" className="mb-10 max-w-2xl sm:mb-14">
            <Kicker accent="brand">Inhouse Stack</Kicker>
            <h2 className="text-fluid-h2 font-bold leading-[1.15] tracking-tight text-foreground">
              Eine schlanke, konsequente Werkzeugkiste.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Wir kompromittieren bei Tooling nicht. Folgende Technologien
              setzen wir täglich produktiv ein – ohne Outsourcing, ohne
              externe Subdienstleister.
            </p>
          </Reveal>
        )}

        {/*
         * Grid-Skalierung:
         *  - Mobile  (≤ 640 px): 2 Spalten, kompakter Gap
         *  - Tablet  (640–1024 px): 3 Spalten
         *  - iPad-Pro Landscape / Small Desktop: 4 Spalten
         *  - Wide-Desktop (≥ 1280 px): 6 Spalten (alle in einer Reihe)
         */}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {STACK.map((item, idx) => (
            <Reveal as="li" key={item.name} delay={idx * 80} className="list-none">
              <TechTile item={item} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function TechTile({ item }: { item: TechItem }) {
  return (
    <div
      className={
        "group relative flex h-full flex-col items-start gap-3 overflow-hidden rounded-xl " +
        "border border-border/50 bg-card/50 px-4 py-5 " +
        "shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.05),0_10px_30px_-18px_hsl(0_0%_0%/0.6)] " +
        "transition-[transform,border-color,background-color,box-shadow] duration-300 " +
        "hover:-translate-y-0.5 hover:border-brand/40 hover:bg-card/70"
      }
    >
      {/* Top-Highlight Hairline + Brand-Glow bei Hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120% 80% at 0% 0%, hsl(var(--brand-glow) / 0.18), transparent 65%)",
        }}
      />

      <span className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/70 transition-transform duration-300 group-hover:rotate-[-4deg] group-hover:scale-105">
        <Image
          src={item.src}
          alt={`${item.name} Logo`}
          width={22}
          height={22}
          className="opacity-90 transition-[filter,opacity] duration-300 group-hover:opacity-100"
          style={{
            // Die Nonicons-SVGs aus der Asset-Bibliothek haben feste schwarze
            // Fills. Da sie via next/image als externe SVG-Dateien gerendert
            // werden, kann `currentColor` hier nicht greifen. Der Filter macht
            // sie im Dark-UI sichtbar, ohne die Quelldateien anzufassen.
            filter:
              "invert(1) sepia(0.15) saturate(1.2) brightness(1.08)",
          }}
        />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          {item.name}
        </span>
        <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {item.context}
        </span>
      </div>
    </div>
  );
}
