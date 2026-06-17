import { Container } from "@/components/ui/Container";

/**
 * Route-level Fallback während /leistungen kompiliert/lädt.
 * Verhindert harte ChunkLoadError-Oberfläche bei schweren Dev-Compiles.
 */
export default function LeistungenLoading() {
  return (
    <div className="relative overflow-x-clip pt-[var(--scroll-padding-top,5.5rem)] pb-16 sm:pb-24">
      <Container size="wide">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto h-6 w-24 animate-pulse rounded-sm bg-muted/30" />
          <div className="mx-auto mt-4 h-10 w-full max-w-lg animate-pulse rounded-sm bg-muted/25" />
          <div className="mx-auto mt-4 h-20 w-full max-w-2xl animate-pulse rounded-sm bg-muted/20" />
        </div>
        <div className="mx-auto mt-16 max-w-[1280px] space-y-8">
          {[0, 1, 2].map((key) => (
            <div
              key={key}
              className="h-[320px] animate-pulse rounded-2xl border border-border/30 bg-card/30"
              aria-hidden
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
