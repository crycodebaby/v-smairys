// src/components/ui/BlurCircle.tsx
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function BlurCircle({ className }: Props) {
  return (
    <div
      aria-hidden
      className={cn(
        // Basis-Styling: großer, weicher Glow hinter dem Content
        "absolute -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15 pointer-events-none",

        // NEU: Die "magische" CSS-Maske.
        // Sorgt dafür, dass der Kreis immer weich ausläuft und nie harte Kanten hat.
        "[mask-image:radial-gradient(closest-side,black_60%,transparent)]",

        // Optional: Ein Blend-Modus für elegantere Farbübergänge.
        // Kann bei Bedarf aktiviert werden, indem der Kommentar entfernt wird.
        // "mix-blend-soft-light",

        className
      )}
    />
  );
}
