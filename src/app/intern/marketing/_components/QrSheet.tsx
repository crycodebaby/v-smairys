"use client";

import React, { useState } from "react";
import { GlassSheet } from "@/components/ui/glass/GlassSheet";
import { dashButtonClasses } from "@/components/intern/DashButton";

type QrStyleId =
  | "clean-print"
  | "smairys-brand"
  | "premium-poster"
  | "rounded-classic"
  | "dense-safe"
  | "soft-amber";

type QrStyleUiPreset = {
  id: QrStyleId;
  name: string;
  tagline: string;
  recommendedFor: "Visitenkarte" | "Flyer" | "Poster";
  scan: "high" | "medium";
  errorCorrection: "Q" | "H";
  logoLabel: string;
};

const DEFAULT_QR_STYLE: QrStyleId = "clean-print";

const QR_STYLE_PRESETS: Record<QrStyleId, QrStyleUiPreset> = {
  "clean-print": {
    id: "clean-print",
    name: "Clean Print",
    tagline: "Maximale Scanbarkeit – klassisch schwarz auf weiß.",
    recommendedFor: "Visitenkarte",
    scan: "high",
    errorCorrection: "Q",
    logoLabel: "Kein Logo",
  },
  "smairys-brand": {
    id: "smairys-brand",
    name: "Smairys Brand",
    tagline: "Dunkler Brand-Ton mit dezentem Amber-Akzent.",
    recommendedFor: "Flyer",
    scan: "high",
    errorCorrection: "H",
    logoLabel: "Kein Logo",
  },
  "premium-poster": {
    id: "premium-poster",
    name: "Premium Poster",
    tagline: "Runde Dots & gestylte Ecken – nur für große Flächen.",
    recommendedFor: "Poster",
    scan: "medium",
    errorCorrection: "H",
    logoLabel: "Kein Logo (MVP)",
  },
  "rounded-classic": {
    id: "rounded-classic",
    name: "Rounded Classic",
    tagline: "Abgerundete Module, klassisch schwarz – freundlicher Look.",
    recommendedFor: "Flyer",
    scan: "high",
    errorCorrection: "H",
    logoLabel: "Kein Logo",
  },
  "dense-safe": {
    id: "dense-safe",
    name: "Dense Safe",
    tagline: "Eckig + extra Quiet Zone – maximal robust für kleine Drucke.",
    recommendedFor: "Visitenkarte",
    scan: "high",
    errorCorrection: "H",
    logoLabel: "Kein Logo",
  },
  "soft-amber": {
    id: "soft-amber",
    name: "Soft Amber",
    tagline: "Warmes Near-Black mit Amber-Augen – dezenter Brand-Touch.",
    recommendedFor: "Flyer",
    scan: "high",
    errorCorrection: "H",
    logoLabel: "Kein Logo",
  },
};

const QR_STYLE_ORDER: readonly QrStyleId[] = [
  "clean-print",
  "smairys-brand",
  "premium-poster",
  "rounded-classic",
  "dense-safe",
  "soft-amber",
];

type QrSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  qrSvgUrl: string;
  qrPngUrl: string;
  shortLink: string;
};

/**
 * QR-Vorschau als Sheet/Drawer (mobile bottom-sheet, ab sm zentriert).
 *
 * Bündelt alles QR-bezogene an einem Ort: Style-Auswahl, Live-Vorschau,
 * SVG-/PNG-Export und kompakte Scan-Sicherheit. So bleibt das Asset-Kit
 * im Hauptlayout schlank.
 */
export function QrSheet({
  open,
  onClose,
  title,
  qrSvgUrl,
  qrPngUrl,
  shortLink,
}: QrSheetProps) {
  const [style, setStyle] = useState<QrStyleId>(DEFAULT_QR_STYLE);
  const preset = QR_STYLE_PRESETS[style];
  const svgUrl = `${qrSvgUrl}?style=${style}`;
  const pngUrl = `${qrPngUrl}?style=${style}`;
  const svgDownloadUrl = `${svgUrl}&download=1`;
  const pngDownloadUrl = `${pngUrl}&download=1`;

  return (
    <GlassSheet open={open} onClose={onClose} title={title} description="QR-Stil, Vorschau und Export">
      <div className="flex flex-col gap-5">
        {/* Vorschau */}
        <div className="mx-auto w-full max-w-[15rem]">
          <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-white p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={style}
              src={svgUrl}
              alt={`QR-Code (${preset.name})`}
              className="relative block aspect-square w-full"
              width={240}
              height={240}
            />
          </div>
        </div>

        {/* Style-Auswahl als Chips */}
        <div role="radiogroup" aria-label="QR-Stil" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {QR_STYLE_ORDER.map((id) => {
            const p = QR_STYLE_PRESETS[id];
            const isActive = id === style;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setStyle(id)}
                className={
                  "rounded-xl border px-3 py-2 text-left transition-[background-color,border-color] duration-200 " +
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-glow)/0.55)] " +
                  (isActive
                    ? "border-[hsl(var(--brand)/0.55)] bg-[hsl(var(--brand)/0.14)]"
                    : "border-white/10 bg-white/[0.035] hover:border-white/25 hover:bg-white/[0.06]")
                }
              >
                <span
                  className={
                    "block text-xs font-medium " +
                    (isActive ? "text-foreground" : "text-foreground/75")
                  }
                >
                  {p.name}
                </span>
                <span className="mt-0.5 block text-[10px] text-foreground/45">
                  {p.recommendedFor}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] leading-snug text-foreground/55">{preset.tagline}</p>

        {/* Scan-Sicherheit */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-3">
          <SafetyRow
            label="Scan-Sicherheit"
            value={preset.scan === "high" ? "Hoch" : "Mittel"}
            tone={preset.scan === "high" ? "good" : "warn"}
          />
          <SafetyRow label="Empfohlen für" value={preset.recommendedFor} />
          <SafetyRow label="Error Correction" value={preset.errorCorrection} />
          <SafetyRow label="Quiet Zone" value="OK" />
          <SafetyRow label="Logo" value={preset.logoLabel} />
        </dl>

        {/* Export */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <a href={svgUrl} target="_blank" rel="noopener noreferrer" className={dashButtonClasses("primary", "sm")}>
            QR-SVG öffnen
          </a>
          <a
            href={svgDownloadUrl}
            className={dashButtonClasses("utility", "sm")}
            aria-label="QR-SVG herunterladen"
          >
            <DownloadIcon />
            SVG
          </a>
          <a href={pngUrl} target="_blank" rel="noopener noreferrer" className={dashButtonClasses("utility", "sm")}>
            QR-PNG (Standard)
          </a>
          <a
            href={pngDownloadUrl}
            className={dashButtonClasses("utility", "sm")}
            aria-label="QR-PNG herunterladen"
          >
            <DownloadIcon />
            PNG
          </a>
        </div>

        <p className="font-mono text-[11px] leading-snug text-foreground/50">
          Codiert: <span className="break-all text-foreground/70">{shortLink}</span>
        </p>
      </div>
    </GlassSheet>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 2.5v7M5.25 7.25 8 10l2.75-2.75M3.5 12.5h9"
      />
    </svg>
  );
}

function SafetyRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "warn";
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/45">
        {label}
      </dt>
      <dd
        className={
          "text-[11px] " +
          (tone === "good"
            ? "font-semibold text-emerald-300"
            : tone === "warn"
              ? "font-semibold text-amber-300"
              : "text-foreground/80")
        }
      >
        {value}
      </dd>
    </div>
  );
}
