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

Glass-Optik, abgerundet-`full`. Zwei Varianten (`subtle`, `solid`), drei Größen
(`sm`, `md`, `lg`). Kein eigenes Tracking. Wer Tracking will, nutzt
`TrackedButton` aus `src/components/ui/TrackedButton.tsx`.

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

- `variant="plain"` (Default) – schlicht, mit Border.
- `variant="glass"` – passt zur Glass-Optik.
- 2 Sekunden Erfolgs-Feedback, dann Reset.
- Fallback ohne Clipboard-API über versteckte Textarea.

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
