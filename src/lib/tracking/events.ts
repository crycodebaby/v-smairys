export type TrackingPayload = {
  event_name: 'cta_click' | 'form_start' | 'form_submit_success' | 'form_submit_error' | 'page_view' | 'scroll_depth';
  page_type: string;
  page_path: string;
  cta_id?: string;
  cta_label?: string;
  cta_position?: string;
  service_name?: string;
  form_id?: string;
  budget_range?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  consent_state: 'granted' | 'denied' | 'pending';
};

import { hasConsent, getConsentState } from '../consent/consent-helper';
import { getAttributionData } from '../attribution/attribution';
import { trackGtmEvent } from './gtm';
import { trackPlausibleEvent } from './plausible';

export function dispatchEvent(basePayload: Partial<TrackingPayload> & { event_name: TrackingPayload['event_name'] }) {
  if (typeof window === 'undefined') return;

  const authData = getAttributionData();
  const consent = getConsentState();

  const payload: TrackingPayload = {
    // Defaults
    page_path: window.location.pathname,
    page_type: 'unknown',
    consent_state: consent,
    // Add attribution
    ...authData,
    // Merge specific event details
    ...basePayload,
  };

  // If consent is missing or denied and we strictly require it for some reason, we can abort.
  // We track in plausible without cookies, but GTM needs consent.
  trackPlausibleEvent(payload);

  if (consent === 'granted') {
    trackGtmEvent(payload);
  }

  // Für Debugging in Development
  if (process.env.NODE_ENV === 'development') {
    console.group(`[TRACKING EVENT]: ${payload.event_name}`);
    console.table(payload);
    console.groupEnd();
  }
}
