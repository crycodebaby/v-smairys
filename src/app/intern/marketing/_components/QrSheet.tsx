"use client";

import React, { useState } from "react";
import { GlassSheet } from "@/components/ui/glass/GlassSheet";
import { dashButtonClasses } from "@/components/intern/DashButton";
import {
  DEFAULT_QR_STYLE,
  QR_STYLE_ORDER,
  QR_STYLE_PRESETS,
  type QrStyleId,
} from "@/lib/qr/qr-styles";

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
                  {p.safety.recommendedFor}
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
            value={preset.safety.scan === "high" ? "Hoch" : "Mittel"}
            tone={preset.safety.scan === "high" ? "good" : "warn"}
          />
          <SafetyRow label="Empfohlen für" value={preset.safety.recommendedFor} />
          <SafetyRow label="Error Correction" value={preset.errorCorrection} />
          <SafetyRow label="Quiet Zone" value="OK" />
          <SafetyRow label="Logo" value={preset.safety.logoLabel} />
        </dl>

        {/* Export */}
        <div className="flex flex-wrap gap-2">
          <a href={svgUrl} target="_blank" rel="noopener noreferrer" className={dashButtonClasses("primary", "sm")}>
            QR-SVG öffnen
          </a>
          <a href={pngUrl} target="_blank" rel="noopener noreferrer" className={dashButtonClasses("utility", "sm")}>
            QR-PNG (Standard)
          </a>
        </div>

        <p className="font-mono text-[11px] leading-snug text-foreground/50">
          Codiert: <span className="break-all text-foreground/70">{shortLink}</span>
        </p>
        <p className="text-[11px] leading-snug text-foreground/45">
          SVG ist für den Druck zu bevorzugen. Jeden QR-Code vor dem Druck mit iPhone und Android testen.
        </p>
      </div>
    </GlassSheet>
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
