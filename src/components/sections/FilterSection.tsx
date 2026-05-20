import React from 'react';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';

export function FilterSection() {
  return (
    <Section className="bg-background min-h-[50vh] flex items-center justify-center border-t border-border">
      <Container className="text-center">
        <h2 className="text-fluid-h2 font-bold text-foreground max-w-4xl mx-auto leading-[1.2] tracking-tighter">
          "Wenn Sie die schnellste und billigste Lösung suchen, sind wir nicht der richtige Partner."
        </h2>
        <p className="mt-8 text-fluid-p text-muted-foreground font-medium uppercase tracking-widest max-w-2xl mx-auto">
          Wir arbeiten ausschließlich mit Unternehmen, die digitale Qualität als Wettbewerbsvorteil verstehen.
        </p>
      </Container>
    </Section>
  );
}
