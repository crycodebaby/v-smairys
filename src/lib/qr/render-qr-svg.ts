import QRCode from "qrcode";
import { QR_STYLE_PRESETS, type QrStyleId, type QrStylePreset } from "./qr-styles";

/**
 * Eigener, scan-sicherer SVG-Renderer für gebrandete QR-Codes.
 *
 * Die QR-Matrix wird weiterhin vom geprüften `qrcode`-Paket erzeugt
 * (`QRCode.create`), nur das SVG-Rendering ist eigenständig – damit brauchen
 * wir keine neue Dependency für Modul-/Finder-Styling.
 *
 * Sicherheitsleitplanken:
 *  - dunkle Module auf weißem Grund (kein invertierter Code)
 *  - Quiet Zone (margin) bleibt immer erhalten
 *  - Finder-Pattern werden als eigene, klar erkennbare Form gerendert
 *    (nicht als Dots), damit die Erkennungsmarken robust bleiben
 *  - keine Verläufe innerhalb der Module
 */

type QrMatrix = {
  size: number;
  get: (row: number, col: number) => number;
};

const FINDER_SIZE = 7;

export function renderBrandedQrSvg(text: string, styleId: QrStyleId): string {
  const preset = QR_STYLE_PRESETS[styleId];

  const qr = QRCode.create(text, { errorCorrectionLevel: preset.errorCorrection });
  const matrix = qr.modules as QrMatrix;
  const n = matrix.size;
  const margin = preset.margin;
  const total = n + margin * 2;

  const finderOrigins = [
    { r: 0, c: 0 }, // top-left
    { r: 0, c: n - FINDER_SIZE }, // top-right
    { r: n - FINDER_SIZE, c: 0 }, // bottom-left
  ];

  const isInFinder = (r: number, c: number): boolean =>
    finderOrigins.some(
      (o) =>
        r >= o.r && r < o.r + FINDER_SIZE && c >= o.c && c < o.c + FINDER_SIZE
    );

  const parts: string[] = [];

  // Datenmodule (Finder-Bereiche werden ausgelassen und separat gerendert).
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!matrix.get(r, c)) continue;
      if (isInFinder(r, c)) continue;
      const x = c + margin;
      const y = r + margin;
      parts.push(moduleShape(x, y, preset));
    }
  }

  // Finder-Pattern (drei Ecken) separat, immer klar erkennbar.
  for (const o of finderOrigins) {
    parts.push(finderPattern(o.c + margin, o.r + margin, preset));
  }

  const body = parts.join("");

  const shapeRendering =
    preset.module === "square" && preset.finder === "square"
      ? "crispEdges"
      : "geometricPrecision";

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" `,
    `shape-rendering="${shapeRendering}" role="img" aria-label="QR-Code">`,
    `<rect width="${total}" height="${total}" fill="${preset.light}"/>`,
    `<g fill="${preset.dark}">${body}</g>`,
    `</svg>`,
  ].join("");
}

function moduleShape(x: number, y: number, preset: QrStylePreset): string {
  switch (preset.module) {
    case "dots":
      return `<circle cx="${fmt(x + 0.5)}" cy="${fmt(y + 0.5)}" r="0.44"/>`;
    case "rounded":
      return `<rect x="${x}" y="${y}" width="1" height="1" rx="0.28" ry="0.28"/>`;
    case "square":
    default:
      return `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
}

/**
 * Finder-Pattern: 7×7 dunkler Ring, 5×5 heller Spalt, 3×3 dunkler Kern.
 * Bei `finder: "rounded"` werden Außenring und Kern abgerundet, das Auge
 * erhält den Akzentton. Quadratisch bleibt es maximal robust.
 */
function finderPattern(x: number, y: number, preset: QrStylePreset): string {
  const rounded = preset.finder === "rounded";
  const outerR = rounded ? 2 : 0;
  const innerR = rounded ? 0.9 : 0;

  const outer = roundedRect(x, y, 7, 7, outerR, preset.dark);
  const gap = roundedRect(x + 1, y + 1, 5, 5, rounded ? 1.4 : 0, preset.light);
  const eye = roundedRect(x + 2, y + 2, 3, 3, innerR, preset.accent);

  return outer + gap + eye;
}

function roundedRect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string
): string {
  const rx = r > 0 ? ` rx="${fmt(r)}" ry="${fmt(r)}"` : "";
  return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${w}" height="${h}"${rx} fill="${fill}"/>`;
}

function fmt(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
