import { getConsentState } from '../consent/consent-helper';
import { getAttributionData } from '../attribution/attribution';
import { trackGtmEvent } from './gtm';
import { trackPlausibleEvent } from './plausible';
import { isAnalyticsExcludedPath } from '../analytics-config';
import { type TrackingEventName } from './event-names';

export type TrackingPayload = {
  event_name: TrackingEventName;
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
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  consent_state: 'granted' | 'denied' | 'pending';
};

export function dispatchEvent(basePayload: Partial<TrackingPayload> & { event_name: TrackingPayload['event_name'] }) {
  if (typeof window === 'undefined') return;

  // Defense in Depth: keine Marketing-Events von internen Routen, auch dann
  // nicht, wenn jemand versehentlich einen TrackedButton im Dashboard verwendet.
  // `trackPlausibleEvent` prüft das ebenfalls; hier blocken wir zusätzlich GTM.
  if (isAnalyticsExcludedPath(window.location.pathname)) return;

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
