# 04 · UI Design System

## Grundsätze

- True Black / Off-White Theme (siehe `src/app/globals.css`).
- Sehr kleine Border-Radien (`--radius: 0.125rem`) – Ausnahme: Liquid-Glass-Komponenten (rounded-xl/2xl/full).
- Bewegungs-Reduktion ist global respektiert (`@media (prefers-reduced-motion)`).
- Keine Emojis im UI, sofern nicht explizit verlangt.

## Liquid-Glass-Primitive

Alle in `src/components/ui/glass/`. Hülle ist semi-transparent + `backdrop-blur`.
Funktioniert hell + dunkel.

### `GlassPanel`

Reine Hülle. Inhalt + Padding bestimmt der Aufrufer.

```tsx
<GlassPanel emphasis="default">{children}</GlassPanel>
```

Varianten via `emphasis`:
- `subtle` – dezente Container (z. B. Debug-Karte).
- `default` – Standard für Card-Inhalte.
- `strong` – Hero-Container (z. B. Login-Card).

### `GlassCard`

`GlassPanel` mit konsistentem Padding (`p-6 sm:p-7`), optionalem Header-Block
(`label`/`title`/`description`) und Actions-Slot.

```tsx
<GlassCard
  label="Kampagne"
  title="Deine neue Website"
  description="Visitenkarte Sommer 2026"
  actions={<StatusBadge status="active" />}
>
  …Inhalt…
</GlassCard>
```

### `GlassButton`

Glass-Optik, abgerundet-`full`. Vier Varianten:
- `subtle` – dezent, sekundäre Aktionen (Default).
- `solid` – stärkerer Akzent, primärer CTA innerhalb einer Glas-Oberfläche.
- `ghost` – nur Hover-Glow, kein dauerhafter Hintergrund.
- `tonal` – heller, z. B. für Detail-Toolbar.

Drei Größen: `sm`, `md`, `lg`. Optionaler `leadingIcon`-Slot.

Microinteractions: Hover-Chroma-Glow (Fuchsia/Sky/Violet), Pressed-Skalierung,
Focus-Ring. Kein eigenes Tracking. Wer Tracking will, nutzt `TrackedButton`
(`src/components/ui/TrackedButton.tsx`) – dieser ist auf internen Routen no-op.

### `StatusChip`

Status-Pille für Dashboard-Listen und Cards.

```tsx
<StatusChip variant="active" withDot>Live</StatusChip>
```

Varianten: `draft`, `active`, `paused`, `archived`, `info`, `warning`, `danger`,
`neutral`. Sizes: `sm` (Default), `md`. `withDot`: blinkender Live-Indikator,
ideal für `active`-Status.

### `Toolbar` + `ToolbarBrand`

Sticky-fähige Glas-TopBar mit Brand-, Title-, Description- und Actions-Slot.
`ToolbarBrand` rendert ein quadratisches Logo-Tile + zwei Textzeilen (Label
groß-uppercase, Sublabel normal). Description ist auf Mobile ausgeblendet.

```tsx
<Toolbar
  brand={<ToolbarBrand label="Smairys · Intern" sublabel="Marketing" />}
  title="Kampagnen-Dashboard"
  description="Zentrale Übersicht für QR, UTM, Druck-Workflows"
  actions={<>…</>}
/>
```

### `PinDots`

Vier (oder N) iOS-Lockscreen-Punkte. Bei `shake={true}` wird die CSS-Animation
`animate-pin-shake` aus `globals.css` getriggert.

### `PinKeypad`

3×4-Ziffernblock mit großem Touch-Target (h-16). Standard-Layout:

```
1 2 3
4 5 6
7 8 9
  0 ⌫
```

Tastatur-Bindings macht der Aufrufer (siehe `app/kundenlogin/PinForm.tsx`).

## CopyButton (`src/components/ui/CopyButton.tsx`)

- `variant="plain"` – schlicht, mit Border (klassisch).
- `variant="glass"` (Default) – passt zur Glass-Optik.
- `variant="tonal"` – stärker betont, z. B. für Primärkopie im Hero.
- Sizes: `xs`, `sm` (Default), `md`.
- Optional `leadingIcon`.
- 2 Sekunden Erfolgs-Feedback (Check-Icon + "Kopiert"), dann Reset.
- Fallback ohne Clipboard-API über versteckte Textarea.

## Chroma-Stage (`.chroma-stage`)

Utility-Klasse in `globals.css` für Hero-Container mit lebendigem
Light-Blob-Hintergrund (drei langsam driftende Radial-Gradienten in
Violet/Cyan/Pink). Bewegung respektiert `prefers-reduced-motion`. Bewusst
sparsam einsetzen – aktuell nur `/kundenlogin` und `/intern/marketing`.

## ConditionalFooter (`src/components/layout/ConditionalFooter.tsx`)

Wrapper im Root-Layout, der den `<Footer />` per `usePathname()` auf
`/kundenlogin` und `/intern/*` ausblendet. Verwendet die zentrale
Exclusion-Liste aus `lib/analytics-config.ts`. `<Footer />` bleibt Server
Component – die Children werden über den Slot übergeben.

## Tracking-Komponenten (öffentlich)

- `TrackedButton` (`src/components/ui/TrackedButton.tsx`) – feuert das
  bestehende `dispatchEvent`-System (cta_click).
- `TrackedLink` (`src/components/analytics/TrackedLink.tsx`) – mailto/tel/
  Booking-Links mit `Contact Intent` + `CTA Click`.

Auf internen Routen feuern beide nichts (siehe Plausible-Ausschluss).

## Konventionen

- Komponenten-Imports: bevorzugt `@/components/ui/...` oder
  `@/components/ui/glass/...`.
- Keine eigenen one-off Glass-Effekte mehr inline schreiben – stattdessen
  `GlassPanel`/`GlassCard` verwenden.
- Alle Buttons mit Glass-Optik: aktiv-State über `active:scale-[0.97]`
  oder kleiner. Konsistent halten.
