'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { dispatchEvent } from '@/lib/tracking/events';
import { TRACKING_EVENTS } from '@/lib/tracking/event-names';

export interface TrackedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  cta_id: string;
  cta_label: string;
  cta_position: string;
  page_type: string;
  service_name?: string;
  /**
   * Wenn gesetzt, rendert die Komponente einen navigierbaren Link statt eines
   * reinen `<button>`, behält aber das identische `cta_click`-Tracking:
   *  - interne Routen (z. B. `/leistungen`, `/#kontakt`) → Next `<Link>`
   *  - Hash-Anker / `mailto:` / `tel:` → natives `<a>`
   *  - externe URLs (oder `external`) → `<a target="_blank" rel="noopener noreferrer">`
   */
  href?: string;
  /** Externes Ziel: öffnet einen neuen Tab inkl. rel-Safety. */
  external?: boolean;
}

export const TrackedButton = forwardRef<HTMLButtonElement, TrackedButtonProps>(({
  cta_id,
  cta_label,
  cta_position,
  page_type,
  service_name,
  href,
  external,
  onClick,
  children,
  ...props
}, ref) => {
  const fireTracking = () => {
    dispatchEvent({
      event_name: TRACKING_EVENTS.CTA_CLICK,
      page_type,
      cta_id,
      cta_label,
      cta_position,
      service_name,
    });
  };

  // ── Link-Variante: navigiert UND trackt ────────────────────────────────────
  if (href) {
    const handleLinkClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
      fireTracking();
      onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
    };

    // Nur element-neutrale, auf <a> gültige Attribute weiterreichen.
    const { className, id, style, title, tabIndex } = props;
    const shared = { className, id, style, title, tabIndex };

    const isExternal =
      external || href.startsWith('http://') || href.startsWith('https://');

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          {...shared}
        >
          {children}
        </a>
      );
    }

    // Hash-Anker oder Spezial-Schema → kein Client-Routing nötig.
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) {
      return (
        <a href={href} onClick={handleLinkClick} {...shared}>
          {children}
        </a>
      );
    }

    // Interne Route → Next <Link> für Client-seitige Navigation.
    return (
      <Link href={href} onClick={handleLinkClick} {...shared}>
        {children}
      </Link>
    );
  }

  // ── Button-Variante: unverändertes Verhalten ────────────────────────────────
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    fireTracking();
    onClick?.(e);
  };

  return (
    <button ref={ref} onClick={handleClick} {...props}>
      {children}
    </button>
  );
});

TrackedButton.displayName = 'TrackedButton';
