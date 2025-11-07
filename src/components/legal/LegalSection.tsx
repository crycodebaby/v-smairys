// src/components/legal/LegalSection.tsx
import type { ReactNode } from "react";

export default function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="py-5 first:pt-0 last:pb-0">
      <h2 className="text-xl font-semibold tracking-tight font-heading">
        {title}
      </h2>
      <div className="mt-2 space-y-2 text-sm leading-7 text-foreground/80">
        {children}
      </div>
    </section>
  );
}
