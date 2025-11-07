// src/components/leistungen/CanvasClient.tsx
"use client";

import dynamic from "next/dynamic";

// CanvasRoot ist selbst eine Client-Komponente, aber hier verhindern wir SSR komplett:
const CanvasRoot = dynamic(() => import("@/components/leistungen/CanvasRoot"), {
  ssr: false,
  loading: () => null,
});

export default function CanvasClient() {
  return <CanvasRoot />;
}
