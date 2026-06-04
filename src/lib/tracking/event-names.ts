/**
 * Canonical Plausible custom event names.
 *
 * Keep these strings stable: Plausible Goals are matched by exact event name
 * and are case-sensitive.
 */
export const TRACKING_EVENTS = {
  CTA_CLICK: "cta_click",
  FORM_START: "form_start",
  FORM_SUBMIT_SUCCESS: "form_submit_success",
  FORM_SUBMIT_ERROR: "form_submit_error",
  PHONE_CLICK: "phone_click",
  EMAIL_CLICK: "email_click",
  CALENDAR_CLICK: "calendar_click",
  QR_REDIRECT: "qr_redirect",
} as const;

export type TrackingEventName =
  (typeof TRACKING_EVENTS)[keyof typeof TRACKING_EVENTS];
