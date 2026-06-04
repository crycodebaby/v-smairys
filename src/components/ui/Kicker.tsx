import React from 'react';

type KickerProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Akzentfarbe der Trennlinie.
   *  - `brand` (Default) – feine orange-amber-Linie, Premium-Akzent
   *  - `foreground` – klassisch monochrom (Off-White auf Dark)
   *  - `muted` – sehr dezent, für untergeordnete Sektionen
   */
  accent?: 'brand' | 'foreground' | 'muted';
};

const ACCENT_LINE: Record<NonNullable<KickerProps['accent']>, string> = {
  brand:
    'bg-gradient-to-r from-brand to-brand-soft shadow-[0_0_10px_hsl(var(--brand-glow)/0.45)]',
  foreground: 'bg-foreground',
  muted: 'bg-muted-foreground/40',
};

export function Kicker({ children, className = '', accent = 'brand' }: KickerProps) {
  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      <span className={`h-[2px] w-8 rounded-sm ${ACCENT_LINE[accent]}`} aria-hidden="true" />
      <span className="text-sm uppercase tracking-[0.18em] font-semibold text-foreground/85">
        {children}
      </span>
    </div>
  );
}
