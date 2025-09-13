// src/components/ui/EdgeFade.tsx
import React from "react";

export default function EdgeFade() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0 z-20 h-32 pointer-events-none"
      style={{
        background:
          // Ein linearer Verlauf von "durchsichtig" zur Hintergrundfarbe
          "linear-gradient(to bottom, transparent 0%, hsl(var(--background)) 100%)",
      }}
    />
  );
}
