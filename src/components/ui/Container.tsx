import React from "react";

/**
 * Container – Container-First Fundament.
 *
 * Ziele:
 *  - Konsistenter Innen-Padding-Rhythmus auf jeder Viewport-Größe
 *  - Fluide Padding-Skalierung via `clamp()` statt diskreter Breakpoint-Stufen
 *    → glattere Verläufe zwischen Mobile, iPad, Desktop, Wide-Screens
 *  - Optionales Größen-Preset (`size`), damit Section-Layouts gezielt schmaler
 *    oder breiter laufen können, ohne dass jede Page eigene max-w-Werte braucht
 *  - Drop-in-kompatibel zur vorherigen Version (alle bisherigen
 *    `<Container>`-Aufrufe ohne Props funktionieren unverändert).
 *
 * Breakpoint-Mapping der `clamp`-Werte (Padding-X):
 *  - 360 px (kleine Smartphones):     ~16 px (1 rem)
 *  - 430 px (iPhone Pro Max-Klasse):  ~20 px
 *  - 768 px (iPad Portrait):          ~32 px
 *  - 1024 px (iPad Landscape / Small Laptop): ~48 px
 *  - 1280 px (Standard-Desktop):      ~64 px
 *  - 1440 px+ (Wide):                 ~96 px (cap)
 *  Formel `clamp(1rem, 4.8vw, 6rem)` erfüllt die Werte ungefähr und bleibt
 *  smooth.
 */

export type ContainerSize =
  | "tight"   // schmale Lese-Container (z. B. Impressum, Datenschutz, Blog)
  | "default" // Standard für die meisten Pages
  | "wide"    // Hero / Master-Detail / Galerien
  | "flush";  // ohne Max-Width, nur Padding (z. B. Logo-Marquees)

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  /** Layout-Preset (siehe `ContainerSize`). Default: `"default"`. */
  size?: ContainerSize;
}

const MAX_WIDTH: Record<ContainerSize, string> = {
  tight: "max-w-[768px]",
  default: "max-w-[1280px]",
  wide: "max-w-[1440px]",
  flush: "max-w-none",
};

/**
 * Fluider Padding-Rhythmus via inline-Style (clamp). Wir setzen es als
 * Inline-Style, damit es **nicht** vom späteren className überschrieben werden
 * kann (`px-*` würde sonst gewinnen), aber der Aufrufer Padding über
 * `className` weiterhin erweitern kann (z. B. `pt-32`).
 */
const FLUID_PADDING_STYLE: React.CSSProperties = {
  paddingLeft: "clamp(1rem, 4.8vw, 6rem)",
  paddingRight: "clamp(1rem, 4.8vw, 6rem)",
};

export function Container({
  children,
  className = "",
  as: Component = "div",
  size = "default",
  style,
  ...props
}: ContainerProps) {
  // React 19 + TS-strict: dynamische `React.ElementType`-Komponenten erzeugen
  // im JSX-Body einen "children: never"-Fehler. `React.createElement` umgeht
  // diese Inferenz und ist semantisch identisch.
  return React.createElement(
    Component,
    {
      className: `mx-auto w-full ${MAX_WIDTH[size]} ${className}`,
      style: { ...FLUID_PADDING_STYLE, ...style },
      ...props,
    },
    children,
  );
}
