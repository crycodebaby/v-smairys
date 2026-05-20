export function trackGtmEvent(payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  // window.dataLayer access allowed exclusively in this generic module
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  
  w.dataLayer.push({
    event: payload.event_name,
    ...payload
  });
}
