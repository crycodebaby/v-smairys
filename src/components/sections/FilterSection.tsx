import React from 'react';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Reveal } from '../motion/Reveal';

export function FilterSection() {
  return (
    <Section className="relative flex min-h-[40svh] items-center justify-center overflow-hidden border-t border-border/60 bg-background md:min-h-[50svh]">
      {/* sehr dezenter Amber-Ambient hinter dem Filterstatement */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--brand-glow) / 0.10), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <Container className="relative text-center">
        <Reveal as="div">
          <span className="brand-underline mx-auto mb-6 block" aria-hidden="true" />
          <h2 className="mx-auto max-w-4xl text-fluid-h2 font-bold leading-[1.2] tracking-tighter text-foreground">
            &laquo;Wenn Sie die schnellste und billigste Lösung suchen, sind wir nicht der richtige Partner.&raquo;
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-fluid-p font-medium uppercase tracking-widest text-muted-foreground">
            Wir arbeiten ausschließlich mit Unternehmen, die digitale Qualität als Wettbewerbsvorteil verstehen.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
