'use client';

import React, { useState, useEffect } from 'react';
import { dispatchEvent } from '@/lib/tracking/events';
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

export const ContactFormBase: React.FC<{ page_type: string }> = ({ page_type }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: 'Webseiten',
    budget_range: '',
    start_time: 'Asap',
    honeypot: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Track Form Start (only once per session)
  useEffect(() => {
    const lock = sessionStorage.getItem(`${FORM_ID}_started`);
    if (!lock) {
      sessionStorage.setItem(`${FORM_ID}_started`, 'true');
      dispatchEvent({ event_name: 'form_start', form_id: FORM_ID, page_type });
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

    // Deduplication Lock Check
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
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Ein Fehler ist aufgetreten.');
      }

      // Success
      setStatus('success');
      sessionStorage.setItem(SUBMIT_LOCK_KEY, 'true');

      dispatchEvent({
        event_name: 'form_submit_success',
        form_id: FORM_ID,
        page_type,
        service_name: formData.service,
        budget_range: formData.budget_range
      });

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten.';
      setStatus('error');
      setErrorMessage(message);

      dispatchEvent({
        event_name: 'form_submit_error',
        form_id: FORM_ID,
        page_type,
        service_name: formData.service
        // Additional error logging payload can be added
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      {/* Honeypot - hidden from users */}
      <input 
        type="text" 
        name="honeypot" 
        style={{ display: 'none' }} 
        tabIndex={-1} 
        autoComplete="off"
        value={formData.honeypot}
        onChange={(e) => setFormData({...formData, honeypot: e.target.value})}
      />

      <div>
        <label>Service</label>
        <select 
          required
          value={formData.service}
          onChange={(e) => setFormData({...formData, service: e.target.value as ServiceType, budget_range: ''})}
          className="w-full border p-2"
        >
          <option value="Webseiten">Webseiten</option>
          <option value="SEO">SEO</option>
          <option value="Ads">Ads</option>
        </select>
      </div>

      <div>
        <label>Budget</label>
        <select 
          required
          value={formData.budget_range}
          onChange={(e) => setFormData({...formData, budget_range: e.target.value})}
          className="w-full border p-2"
        >
          <option value="" disabled>Bitte wählen...</option>
          {getBudgetOptions(formData.service).map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Basic fields excerpt */}
      <div>
        <label>Name</label>
        <input required type="text" className="w-full border p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
      </div>

      <div>
        <label>Email</label>
        <input required type="email" className="w-full border p-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
      </div>

      <div>
        <label>Telefonnummer (optional)</label>
        <input type="tel" className="w-full border p-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
      </div>

      <div>
        <label>Projektstart</label>
        <select required className="w-full border p-2" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})}>
          <option value="Asap">So schnell wie möglich</option>
          <option value="1_month">In 1 Monat</option>
          <option value="3_months">In 3 Monaten</option>
        </select>
      </div>

      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="bg-primary text-primary-foreground p-3 rounded"
      >
        {status === 'loading' ? 'Sendet...' : 'Kostenlos anfragen'}
      </button>

      {status === 'error' && <p className="text-red-500">{errorMessage}</p>}
      {status === 'success' && <p className="text-green-500">Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet.</p>}
    </form>
  );
};
