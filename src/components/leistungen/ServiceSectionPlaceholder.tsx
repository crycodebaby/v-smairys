/**
 * Leichtgewichtiger Platzhalter während ServiceSection (3D/Framer) lazy lädt.
 */
export function ServiceSectionPlaceholder() {
  return (
    <div
      className="py-12 sm:py-16"
      aria-hidden="true"
    >
      <div className="h-[320px] w-full min-w-0 animate-pulse rounded-2xl border border-border/40 bg-card/40 sm:h-[360px]" />
    </div>
  );
}
