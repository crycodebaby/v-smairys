'use client';

import React, { useState, useEffect, useId } from 'react';
import { dispatchEvent } from '@/lib/tracking/events';
import { TRACKING_EVENTS } from '@/lib/tracking/event-names';
import { getLeadAttribution, type LeadAttribution } from '@/lib/attribution/attribution';

type ServiceType = 'Webseiten' | 'SEO' | 'Ads';

interface FormData {
  name: string;
  email: string;
  phone?: string;
  service: ServiceType;
  budget_range: string;
  start_time: string;
  honeypot: string; // Anti-Spam
}

interface SubmitPayload extends FormData {
  attribution: LeadAttribution;
  submitted_at: string;
}

const FORM_ID = 'contact_lead_gen_01';
const SUBMIT_LOCK_KEY = 'smairys_form_submitted_session';

/**
 * Wiederverwendbares Kontaktformular.
 *
 * - State, Validierung (HTML5), Honeypot, Server-API, Tracking-Logik bleiben
 *   funktional unverändert (kompatibel zu `/api/contact`).
 * - Visuell auf Glass-Theme + Brand-Akzent gehoben:
 *   - dark Inputs mit border-Hover in Brand
 *   - Focus-Ring in Brand-Glow
 *   - Brand-Submit-Button
 *   - Success-/Error-Cards mit Brand- bzw. Rose-Border
 *
 * Tracking-Events: `form_start`, `form_submit_success`, `form_submit_error`.
 * Auf internen Routen sind die `dispatchEvent`-Aufrufe no-op
 * (Plausible-Exclusion in `analytics-config`).
 */
export const ContactFormBase: React.FC<{ page_type: string }> = ({ page_type }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: 'Webseiten',
    budget_range: '',
    start_time: 'Asap',
    honeypot: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Eindeutige IDs für `label` <-> `input`-Verknüpfung (a11y).
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  useEffect(() => {
    const lock = sessionStorage.getItem(`${FORM_ID}_started`);
    if (!lock) {
      sessionStorage.setItem(`${FORM_ID}_started`, 'true');
      dispatchEvent({ event_name: TRACKING_EVENTS.FORM_START, form_id: FORM_ID, page_type });
    }
  }, [page_type]);

  const getBudgetOptions = (service: ServiceType) => {
    switch (service) {
      case 'Webseiten':
        return ['1.000€ - 3.000€', '3.000€ - 5.000€', '5.000€+'];
      case 'SEO':
        return ['500€ - 1.000€ mtl.', '1.000€ - 2.000€ mtl.', '2.000€+ mtl.'];
      case 'Ads':
        return ['Bis 1.000€ AdSpend', '1.000€ - 5.000€ AdSpend', '5.000€+ AdSpend'];
      default:
        return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    if (sessionStorage.getItem(SUBMIT_LOCK_KEY)) {
      setErrorMessage('Formular wurde bereits erfolgreich gesendet.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const payload: SubmitPayload = {
      ...formData,
      attribution: getLeadAttribution(),
      submitted_at: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ein Fehler ist aufgetreten.');
      }

      setStatus('success');
      sessionStorage.setItem(SUBMIT_LOCK_KEY, 'true');

      dispatchEvent({
        event_name: TRACKING_EVENTS.FORM_SUBMIT_SUCCESS,
        form_id: FORM_ID,
        page_type,
        service_name: formData.service,
        budget_range: formData.budget_range,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten.';
      setStatus('error');
      setErrorMessage(message);

      dispatchEvent({
        event_name: TRACKING_EVENTS.FORM_SUBMIT_ERROR,
        form_id: FORM_ID,
        page_type,
        service_name: formData.service,
      });
    }
  };

  if (status === 'success') {
    return <SuccessPanel />;
  }

  const baseField =
    'block w-full rounded-md border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground ' +
    'placeholder:text-muted-foreground/60 transition-all duration-200 ' +
    'hover:border-brand/40 ' +
    'focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand-glow/40';

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        name="honeypot"
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Service" htmlFor={id('service')}>
          <select
            id={id('service')}
            required
            value={formData.service}
            onChange={(e) =>
              setFormData({
                ...formData,
                service: e.target.value as ServiceType,
                budget_range: '',
              })
            }
            className={baseField}
          >
            <option value="Webseiten">Webseiten</option>
            <option value="SEO">SEO</option>
            <option value="Ads">Ads</option>
          </select>
        </Field>

        <Field label="Budget" htmlFor={id('budget')}>
          <select
            id={id('budget')}
            required
            value={formData.budget_range}
            onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
            className={baseField}
          >
            <option value="" disabled>
              Bitte wählen…
            </option>
            {getBudgetOptions(formData.service).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Name" htmlFor={id('name')}>
        <input
          id={id('name')}
          required
          type="text"
          autoComplete="name"
          className={baseField}
          placeholder="Max Mustermann"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </Field>

      <Field label="E-Mail" htmlFor={id('email')}>
        <input
          id={id('email')}
          required
          type="email"
          autoComplete="email"
          inputMode="email"
          className={baseField}
          placeholder="name@firma.de"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </Field>

      <Field label="Telefon (optional)" htmlFor={id('phone')}>
        <input
          id={id('phone')}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          className={baseField}
          placeholder="+49 …"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </Field>

      <Field label="Projektstart" htmlFor={id('start')}>
        <select
          id={id('start')}
          required
          className={baseField}
          value={formData.start_time}
          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
        >
          <option value="Asap">So schnell wie möglich</option>
          <option value="1_month">In 1 Monat</option>
          <option value="3_months">In 3 Monaten</option>
        </select>
      </Field>

      <button
        type="submit"
        disabled={status === 'loading'}
        className={
          'group relative mt-2 inline-flex h-12 w-full select-none items-center justify-center gap-2 ' +
          'overflow-hidden rounded-md bg-brand px-6 text-sm font-semibold tracking-tight text-brand-foreground ' +
          'shadow-[0_10px_28px_-12px_hsl(var(--brand-glow)/0.7)] ' +
          'transition-[transform,background-color,box-shadow] duration-200 ease-out ' +
          'hover:bg-brand-soft hover:shadow-[0_14px_38px_-14px_hsl(var(--brand-glow)/0.85)] ' +
          'active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ' +
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-glow focus-visible:ring-offset-2 focus-visible:ring-offset-background'
        }
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
        {status === 'loading' ? 'Sendet…' : 'Kostenlos anfragen'}
        {status !== 'loading' && (
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        )}
      </button>

      {status === 'error' && (
        <div
          role="alert"
          className="mt-2 rounded-md border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-100"
        >
          {errorMessage || 'Etwas ist schiefgelaufen. Bitte erneut versuchen.'}
        </div>
      )}

      <p className="pt-2 text-[11px] leading-relaxed text-muted-foreground">
        Mit dem Absenden bestätigen Sie unsere{' '}
        <a
          href="/datenschutz"
          className="underline-offset-2 hover:text-foreground hover:underline"
        >
          Datenschutzerklärung
        </a>
        . Wir nutzen Ihre Daten ausschließlich zur Beantwortung Ihrer Anfrage.
      </p>
    </form>
  );
};

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function SuccessPanel() {
  return (
    <div
      role="status"
      className="relative overflow-hidden rounded-xl border border-brand/40 bg-brand/[0.06] px-6 py-8 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent"
      />
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-brand/50 bg-brand/10">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="text-brand-soft">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12.5l4 4 10-10"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        Vielen Dank.
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Ihre Anfrage ist eingegangen. Wir melden uns innerhalb von 24 Stunden mit
        einer ersten Einschätzung – Mo–Fr.
      </p>
    </div>
  );
}
