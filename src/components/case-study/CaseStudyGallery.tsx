import Image from "next/image";
import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/motion/Reveal";
import type { CaseStudyImage } from "@/config/case-studies";

type CaseStudyGalleryProps = {
  images: readonly CaseStudyImage[];
  title?: string;
  description?: string;
};

const ASPECT_CLASS: Record<NonNullable<CaseStudyImage["aspect"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/9]",
};

/**
 * Galerie / Insights-Bereich.
 *
 * In der Ergart-Case zeigen wir hier die GSC-Performance-Grafiken als
 * neutrales Beweis-Material. Bilder werden mit `next/image` und
 * `object-contain` gerendert, damit Diagramme nicht beschnitten werden.
 */
export function CaseStudyGallery({
  images,
  title = "Insights & Ergebnisse",
  description = "Auszüge aus dem Reporting – belegbar via Google Search Console.",
}: CaseStudyGalleryProps) {
  if (images.length === 0) return null;
  return (
    <Section className="bg-background">
      <Container>
        <Reveal as="div" className="mb-10 max-w-2xl">
          <Kicker accent="brand">Reporting</Kicker>
          <h2 className="text-fluid-h3 font-bold leading-[1.2] tracking-tight text-foreground">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {images.map((image, idx) => (
            <Reveal as="figure" key={image.src} delay={idx * 120} className="m-0">
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-[0_24px_60px_-30px_hsl(0_0%_0%/0.7)]">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
                />
                <div
                  className={`relative w-full ${
                    ASPECT_CLASS[image.aspect ?? "wide"]
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-contain p-3"
                  />
                </div>
              </div>
              <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {image.alt}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
