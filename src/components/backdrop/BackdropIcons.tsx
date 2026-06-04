import Image from "next/image";
import React from "react";

/**
 * BackdropIcons
 * ────────────────────────────────────────────────────────────────────────────
 * Tiefenschärfe-Layer aus SVG-Icons der lokalen Asset-Bibliothek
 * (`public/svg_librarie/...`). Eingesetzt als dezenter Hintergrund hinter
 * Sections, um Räumlichkeit zu schaffen, ohne mit dem Vordergrund-Content zu
 * konkurrieren.
 *
 * Design-Regeln:
 *  - Maximal 6–8 Icons pro Section, sonst wird die Tiefenwirkung „rauschend".
 *  - Drei Drift-Animationen (a/b/c) laufen out-of-phase, sodass kein
 *    rhythmisch-synchrones „Atmen" entsteht.
 *  - Drei Blur-Stufen (`sm`/`md`/`lg`) simulieren Tiefen-Ebenen
 *    (Vordergrund = scharf, Hintergrund = stark unscharf).
 *  - Die Icons werden mit `next/image` als statische Asset-URLs gerendert;
 *    keine Inline-SVG-Streams → kein Bundle-Impact.
 *  - Komponente ist **rein dekorativ**, `aria-hidden`, kein Tab-Stop.
 *  - Respektiert `prefers-reduced-motion` global (CSS in `globals.css`).
 *
 * Verwendung:
 *  ```tsx
 *  <Section className="relative overflow-hidden">
 *    <BackdropIcons preset="tech" />
 *    <Container className="relative z-10">{children}</Container>
 *  </Section>
 *  ```
 */

type IconAsset = {
  src: string;
  width: number;
  height: number;
};

/** Wiederverwendbare Asset-Kataloge je Themenwelt. */
const ASSETS = {
  tech: [
    { src: "/svg_librarie/nonicons_programming_icons/typescript-16-svgrepo-com.svg", width: 16, height: 16 },
    { src: "/svg_librarie/nonicons_programming_icons/react-16-svgrepo-com.svg",      width: 16, height: 16 },
    { src: "/svg_librarie/nonicons_programming_icons/node-16-svgrepo-com.svg",       width: 16, height: 16 },
    { src: "/svg_librarie/nonicons_programming_icons/html-16-svgrepo-com.svg",       width: 16, height: 16 },
    { src: "/svg_librarie/nonicons_programming_icons/css-16-svgrepo-com.svg",        width: 16, height: 16 },
    { src: "/svg_librarie/nonicons_programming_icons/docker-16-svgrepo-com.svg",     width: 16, height: 16 },
  ] satisfies IconAsset[],
  generic: [
    { src: "/svg_librarie/keyword-16-svgrepo-com.svg",  width: 16, height: 16 },
    { src: "/svg_librarie/loading-16-svgrepo-com.svg",  width: 16, height: 16 },
    { src: "/svg_librarie/prettier-16-svgrepo-com.svg", width: 16, height: 16 },
    { src: "/svg_librarie/not-found-16-svgrepo-com.svg",width: 16, height: 16 },
  ] satisfies IconAsset[],
} as const;

type Spot = {
  asset: IconAsset;
  /** CSS-Position als Prozent (top/left/right/bottom). */
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  /** Render-Größe in px (quadratisch). Steuert auch die Tiefen-Ebene optisch. */
  size: number;
  /** Drift-Animation. */
  drift: "a" | "b" | "c";
  /** Blur-Stufe (Tiefen-Ebene). */
  depth: "sm" | "md" | "lg" | "xl";
  /** Eigene Opazität (Default kommt aus `.backdrop-icon`). */
  opacity?: number;
  /** Verzögerung der Animation, damit Icons asynchron laufen. */
  delay?: string;
};

/**
 * Curated Layouts – pro Preset eine Bühne von 6 Icons in einer
 * harmonischen Tiefenstaffelung. Positionen sind bewusst nicht symmetrisch.
 */
const LAYOUTS: Record<keyof typeof ASSETS, Spot[]> = {
  tech: [
    { asset: ASSETS.tech[0], top: "8%",  left: "6%",   size: 220, drift: "a", depth: "lg", opacity: 0.05, delay: "0s"  }, // TS, sehr groß, hinten
    { asset: ASSETS.tech[1], top: "18%", right: "8%",  size: 320, drift: "b", depth: "xl", opacity: 0.04, delay: "-3s" }, // React, riesig + sehr unscharf
    { asset: ASSETS.tech[2], bottom: "12%", left: "10%", size: 180, drift: "c", depth: "md", opacity: 0.06, delay: "-6s" }, // Node
    { asset: ASSETS.tech[3], top: "40%", left: "44%",   size: 120, drift: "a", depth: "sm", opacity: 0.05, delay: "-9s" }, // HTML, mittig, eher scharf
    { asset: ASSETS.tech[4], bottom: "8%", right: "14%", size: 200, drift: "b", depth: "lg", opacity: 0.045,delay: "-12s"}, // CSS
    { asset: ASSETS.tech[5], top: "62%", left: "18%",   size: 140, drift: "c", depth: "md", opacity: 0.055,delay: "-15s"}, // Docker
  ],
  generic: [
    { asset: ASSETS.generic[0], top: "12%", left: "8%",  size: 200, drift: "a", depth: "lg", opacity: 0.05, delay: "0s"  },
    { asset: ASSETS.generic[1], top: "22%", right: "10%",size: 240, drift: "b", depth: "xl", opacity: 0.04, delay: "-4s" },
    { asset: ASSETS.generic[2], bottom: "14%", left: "16%",size: 160, drift: "c", depth: "md", opacity: 0.06, delay: "-8s" },
    { asset: ASSETS.generic[3], bottom: "10%", right: "8%", size: 220, drift: "a", depth: "lg", opacity: 0.045,delay: "-12s"},
  ],
};

const DRIFT_CLASS: Record<Spot["drift"], string> = {
  a: "animate-icon-drift-a",
  b: "animate-icon-drift-b",
  c: "animate-icon-drift-c",
};

const DEPTH_CLASS: Record<Spot["depth"], string> = {
  sm: "",                       // Default = leichtes Blur (`.backdrop-icon`)
  md: "backdrop-icon--blur-md",
  lg: "backdrop-icon--blur-lg",
  xl: "backdrop-icon--blur-xl",
};

export type BackdropIconsProps = {
  /** Welche Asset-Bühne (`tech` für /ueber-uns, /leistungen; `generic` für Allzweck-Sektionen). */
  preset?: keyof typeof ASSETS;
  /** Optional: eigene Spot-Liste statt Preset. */
  spots?: Spot[];
  /** Sichtbarkeit ab Breakpoint (`md` = ab Tablet ein, kleiner aus → mobile Performance). */
  showFrom?: "always" | "sm" | "md" | "lg";
  className?: string;
};

const SHOW_CLASS: Record<NonNullable<BackdropIconsProps["showFrom"]>, string> = {
  always: "block",
  sm: "hidden sm:block",
  md: "hidden md:block",
  lg: "hidden lg:block",
};

export function BackdropIcons({
  preset = "tech",
  spots,
  showFrom = "sm",
  className = "",
}: BackdropIconsProps) {
  const items = spots ?? LAYOUTS[preset];

  return (
    <div
      aria-hidden="true"
      className={`backdrop-stage ${SHOW_CLASS[showFrom]} ${className}`}
    >
      {items.map((spot, i) => {
        const style: React.CSSProperties = {
          width: spot.size,
          height: spot.size,
          top: spot.top,
          left: spot.left,
          right: spot.right,
          bottom: spot.bottom,
          opacity: spot.opacity,
          animationDelay: spot.delay,
        };
        return (
          <span
            key={i}
            className={`backdrop-icon ${DEPTH_CLASS[spot.depth]} ${DRIFT_CLASS[spot.drift]}`}
            style={style}
          >
            <Image
              src={spot.asset.src}
              alt=""
              aria-hidden="true"
              width={spot.asset.width}
              height={spot.asset.height}
              className="h-full w-full select-none"
              draggable={false}
            />
          </span>
        );
      })}
    </div>
  );
}
