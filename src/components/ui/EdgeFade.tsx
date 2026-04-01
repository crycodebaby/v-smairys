// src/components/ui/EdgeFade.tsx
import React from "react";

export default function EdgeFade() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
      style={{
        background:
          "linear-gradient(to bottom, transparent 0%, hsl(var(--background) / 0.6) 100%)",
      }}
    />
  );
}
