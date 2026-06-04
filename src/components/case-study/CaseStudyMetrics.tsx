import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import type { CaseStudyMetric } from "@/config/case-studies";

type CaseStudyMetricsProps = {
  metrics: readonly CaseStudyMetric[];
};

/**
 * Kennzahlen-Reihe. Pro Metric eine Glass-Tile mit großem Wert,
 * darunter Label + Hinweis. Wir vermeiden bewusst erfundene Prozentzahlen –
 * jede Tile gibt nur das wieder, was in `case-studies.ts` belegbar steht.
 */
export function CaseStudyMetrics({ metrics }: CaseStudyMetricsProps) {
  if (metrics.length === 0) return null;
  return (
    <Section className="bg-background">
      <Container>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {metrics.map((metric, idx) => (
            <Reveal as="li" key={metric.label} delay={idx * 90} className="list-none">
              <MetricTile metric={metric} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function MetricTile({ metric }: { metric: CaseStudyMetric }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 px-6 py-7 shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.05),0_18px_50px_-24px_hsl(0_0%_0%/0.65)] transition-all duration-300 hover:border-brand/40">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent"
      />
      <div className="flex items-center gap-2">
        <span className="brand-dot" aria-hidden="true" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {metric.label}
        </span>
      </div>
      <div className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
        {metric.value}
      </div>
      {metric.hint && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {metric.hint}
        </p>
      )}
    </div>
  );
}
