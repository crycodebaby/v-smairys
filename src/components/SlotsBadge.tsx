// src/components/SlotsBadge.tsx
export default function SlotsBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 backdrop-blur px-3 py-1.5">
      <span className="relative flex w-2 h-2">
        <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping bg-[hsl(var(--primary))]" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
      </span>
      <span className="text-xs font-medium">Nur 2 Slots verfügbar</span>
    </div>
  );
}
