'use client';

import React, { forwardRef } from 'react';
import { dispatchEvent } from '@/lib/tracking/events';

export interface TrackedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  cta_id: string;
  cta_label: string;
  cta_position: string;
  page_type: string;
  service_name?: string;
}

export const TrackedButton = forwardRef<HTMLButtonElement, TrackedButtonProps>(({
  cta_id,
  cta_label,
  cta_position,
  page_type,
  service_name,
  onClick,
  children,
  ...props
}, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatchEvent({
      event_name: 'cta_click',
      page_type,
      cta_id,
      cta_label,
      cta_position,
      service_name
    });

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button ref={ref} onClick={handleClick} {...props}>
      {children}
    </button>
  );
});

TrackedButton.displayName = 'TrackedButton';
