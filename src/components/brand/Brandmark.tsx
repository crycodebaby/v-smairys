import Image from "next/image";
import { SITE } from "@/config/site";

type BrandmarkProps = {
  /**
   * `mark` – nur das Logo-Quadrat (für Header/Mobile).
   * `wordmark` – mit seitlichem Schriftzug (Footer / Brand-Sektionen).
   */
  variant?: "mark" | "wordmark";
  /**
   * Auf welchem Hintergrund steht das Logo?
   *  - `dark` (Default) → weißes Logo
   *  - `light` → schwarzes Logo
   *  - `auto` → wechselt anhand `.light`-Class auf dem Root
   *    (aktuell verwenden wir Dark als Default; `light`-Variante steht aber
     bereit, sobald ein Theme-Toggle eingeführt wird).
   */
  surface?: "dark" | "light" | "auto";
  /** Größe der Logo-Marke in Pixeln (quadratisch). */
  size?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
};

/**
 * Wiederverwendbares Logo-Element.
 *
 * Pfade liegen unter `public/logo/`:
 *  - `smairys-black.png`
 *  - `smairys-white.png`
 *  - `smairys-seitlicher-schriftzug-logo-black.png`
 *  - `smairys-seitlicher-schriftzug-logo-white.png`
 *
 * Auf einer dunklen Oberfläche → weißes Logo, auf hellen Oberflächen →
 * schwarzes Logo. Für `auto` rendern wir beide Varianten und blenden sie
 * via Tailwind-`light:`-Selektor um (falls später ein Light-Theme aktiviert
 * wird).
 */
export function Brandmark({
  variant = "mark",
  surface = "dark",
  size = 36,
  className = "",
  priority = false,
  alt,
}: BrandmarkProps) {
  const aspect = variant === "wordmark" ? 240 / 60 : 1;
  const width = variant === "wordmark" ? size * aspect : size;
  const height = size;
  const baseAlt = alt ?? `${SITE.legalName} Logo`;

  if (surface === "auto") {
    return (
      <span
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <Image
          src={pathFor(variant, "white")}
          alt={baseAlt}
          width={width}
          height={height}
          priority={priority}
          className="block dark:block light:hidden"
          sizes={`${width}px`}
        />
        <Image
          src={pathFor(variant, "black")}
          alt={baseAlt}
          width={width}
          height={height}
          aria-hidden="true"
          className="hidden light:block absolute inset-0"
          sizes={`${width}px`}
        />
      </span>
    );
  }

  const color = surface === "light" ? "black" : "white";
  return (
    <Image
      src={pathFor(variant, color)}
      alt={baseAlt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      sizes={`${width}px`}
    />
  );
}

function pathFor(variant: "mark" | "wordmark", color: "white" | "black"): string {
  if (variant === "wordmark") {
    return color === "white"
      ? "/logo/smairys-seitlicher-schriftzug-logo-white.png"
      : "/logo/smairys-seitlicher-schriftzug-logo-black.png";
  }
  return color === "white" ? "/logo/smairys-white.png" : "/logo/smairys-black.png";
}
