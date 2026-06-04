import Image from "next/image";
import React from "react";
import { Reveal } from "@/components/motion/Reveal";
import { CLIENT_LOGOS, type ClientLogo } from "@/config/clients";

type ClientLogoStripProps = {
  /**
   * Auf welchem Untergrund stehen die Logos?
   *  - `dark` → helle Logo-Varianten
   *  - `light` → dunkle Logo-Varianten
   *  - `auto` → wechselt anhand `.light`-Class (für späteren Theme-Toggle).
   */
  surface?: "dark" | "light" | "auto";
  /** Höhe der Logo-Container (Logo wird `object-contain` skaliert). */
  height?: number;
  /** Welche Logos anzeigen (Slice). Default: alle. */
  logos?: readonly ClientLogo[];
  className?: string;
};

/**
 * Logo-Streifen.
 *
 * - Auf großen Viewports: gleichmäßiges Grid (`grid-cols-4`).
 * - Auf Mobile/Tablet: 2-Spalten-Layout.
 * - Logos sind in Glas-Tiles eingebettet (dezent), damit unterschiedliche
 *   Logo-Formate visuell konsistent wirken.
 * - Jedes Logo ist `<Reveal>` mit Stagger-Delay – einläufige Eleganz, kein
 *   Karussell, kein Marquee.
 */
export function ClientLogoStrip({
  surface = "dark",
  height = 44,
  logos = CLIENT_LOGOS,
  className = "",
}: ClientLogoStripProps) {
  return (
    <ul
      className={
        "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 " +
        className
      }
      aria-label="Auswahl unserer Kunden"
    >
      {logos.map((logo, idx) => (
        <Reveal as="li" key={logo.name} delay={idx * 90} className="list-none">
          <LogoTile logo={logo} surface={surface} height={height} />
        </Reveal>
      ))}
    </ul>
  );
}

function LogoTile({
  logo,
  surface,
  height,
}: {
  logo: ClientLogo;
  surface: "dark" | "light" | "auto";
  height: number;
}) {
  const tile = (
    <div
      className={
        "group relative flex h-full w-full items-center justify-center rounded-xl border border-border/40 " +
        "bg-card/40 px-4 transition-all duration-300 " +
        "hover:border-brand/40 hover:bg-card/60 " +
        "shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.04),0_8px_28px_-18px_hsl(0_0%_0%/0.7)]"
      }
      style={{ minHeight: height + 36 }}
    >
      {/* feiner Top-Highlight wie bei den Glass-Komponenten */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      {/* dezenter Hover-Glow in Brand */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 0%, hsl(var(--brand-glow) / 0.18), transparent 70%)",
        }}
      />
      <LogoImage logo={logo} surface={surface} height={height} />
    </div>
  );

  if (logo.href) {
    return (
      <a
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-glow rounded-xl"
        aria-label={`${logo.name} – Website öffnen`}
      >
        {tile}
      </a>
    );
  }

  return tile;
}

function LogoImage({
  logo,
  surface,
  height,
}: {
  logo: ClientLogo;
  surface: "dark" | "light" | "auto";
  height: number;
}) {
  const width = logo.width ?? 220;
  const renderHeight = logo.height ?? 64;

  if (surface === "auto") {
    return (
      <span className="relative inline-flex items-center justify-center" style={{ height }}>
        <Image
          src={logo.dark}
          alt={`${logo.name} Logo`}
          width={width}
          height={renderHeight}
          className="block max-h-full w-auto object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100 dark:block light:hidden"
          style={{ height: "100%", width: "auto" }}
        />
      </span>
    );
  }

  const src = surface === "light" ? logo.light : logo.dark;
  return (
    <Image
      src={src}
      alt={`${logo.name} Logo`}
      width={width}
      height={renderHeight}
      className="max-h-full w-auto object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100"
      style={{ height }}
    />
  );
}
