import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { CaseStudy } from "@/config/case-studies";

type CaseStudyCardProps = {
  caseStudy: CaseStudy;
};

/**
 * Übersichts-Karte für die `/projekte`-Seite.
 *
 * Großes Hero-Bild, kleines Logo-Plakettchen, Headline, Sub-Text, "weiter
 * lesen"-Pfeil. Hover-States in Brand: feiner Glow + farbige Border.
 */
export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <Link
      href={`/projekte/${caseStudy.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-[0_24px_60px_-30px_hsl(0_0%_0%/0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={caseStudy.hero.src}
          alt={caseStudy.hero.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"
        />
        {caseStudy.logo && (
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-md border border-white/15 bg-black/40 px-2.5 py-1.5 backdrop-blur-sm">
            <Image
              src={caseStudy.logo.src}
              alt={caseStudy.logo.alt}
              width={90}
              height={24}
              className="h-5 w-auto object-contain"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {caseStudy.industry && <span>{caseStudy.industry}</span>}
          {caseStudy.region && (
            <>
              <span aria-hidden="true">·</span>
              <span>{caseStudy.region}</span>
            </>
          )}
        </div>
        <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand-soft sm:text-xl">
          {caseStudy.headline}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {caseStudy.summary}
        </p>
        <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground/85 transition-colors group-hover:text-brand-soft">
          Case Study lesen
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
