// src/components/PrestigeCTA.tsx
export default function PrestigeCTA() {
  return (
    <div className="fixed inset-x-0 z-40 px-4 bottom-3 sm:hidden">
      <div className="max-w-md p-2 mx-auto border shadow-lg rounded-2xl border-border/60 bg-background/80 backdrop-blur">
        <button
          className="w-full btn-premium"
          aria-label="Projektanfrage starten"
        >
          Bewerbung starten
        </button>
      </div>
    </div>
  );
}
