export type ConsentState = 'granted' | 'denied' | 'pending';

const CONSENT_KEY = 'smairys_tracking_consent';

export function getConsentState(): ConsentState {
  if (typeof window === 'undefined') return 'pending';
  
  const saved = localStorage.getItem(CONSENT_KEY);
  if (saved === 'granted' || saved === 'denied') {
    return saved;
  }
  return 'pending';
}

export function setConsentState(state: 'granted' | 'denied') {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, state);
  
  // Optional: Trigger custom event for UI updates
  window.dispatchEvent(new CustomEvent('consentChange', { detail: { state } }));
}

export function hasConsent(): boolean {
  return getConsentState() === 'granted';
}
