import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Attribution-Subschema. Alle Felder optional, max-Länge gegen Junk.
 * Wir geben uns hier weicher als beim eigentlichen Formularinhalt:
 * Attribution darf fehlen, ohne dass der Lead 400 wird.
 */
const attributionTouchSchema = z
  .object({
    utm_source: z.string().max(256).optional(),
    utm_medium: z.string().max(256).optional(),
    utm_campaign: z.string().max(256).optional(),
    utm_content: z.string().max(256).optional(),
    utm_term: z.string().max(256).optional(),
    landing_page: z.string().max(512).optional(),
    referrer: z.string().max(1024).optional(),
    first_seen_at: z.string().max(64).optional(),
    last_seen_at: z.string().max(64).optional(),
  })
  .strict();

const contactSchema = z.object({
  name: z.string().min(2, 'Name ist zu kurz'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().optional(),
  service: z.enum(['Webseiten', 'SEO', 'Ads']),
  budget_range: z.string().min(1, 'Budget-Auswahl erforderlich'),
  start_time: z.string().min(1, 'Startzeitpunkt erforderlich'),
  honeypot: z.string().max(0, 'Spam erkannt'), // Muss leer bleiben
  attribution: z
    .object({
      first: attributionTouchSchema,
      last: attributionTouchSchema,
    })
    .optional(),
  submitted_at: z.string().max(64).optional(),
});

type ContactPayload = z.infer<typeof contactSchema>;

// Mock Rate-Limiter (In Produktion z.B. mit Vercel KV / Upstash Redis)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();
const LIMIT = parseInt(process.env.API_RATE_LIMIT_MAX || '5');
const WINDOW_MS = parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || '60000');

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  if (!record) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return false;
  }
  if (now - record.timestamp > WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return false;
  }
  if (record.count >= LIMIT) {
    return true;
  }
  record.count += 1;
  return false;
}

/**
 * Erzeugt einen kompakten, menschenlesbaren Attribution-Block für die
 * Lead-Notification (Server-Log, später E-Mail/CRM).
 * Enthält ausschließlich Marketing-Daten – keine PII.
 */
function formatAttributionBlock(
  attribution: ContactPayload['attribution']
): string {
  if (!attribution) return 'Quelle: (keine Attribution-Daten übermittelt)';

  const fmt = (label: string, value?: string) =>
    value ? `  ${label.padEnd(13)}: ${value}` : null;

  const lines: string[] = [];

  lines.push('First Touch:');
  lines.push(
    fmt('Source', attribution.first.utm_source) ?? '  Source        : —'
  );
  lines.push(
    fmt('Medium', attribution.first.utm_medium) ?? '  Medium        : —'
  );
  lines.push(
    fmt('Campaign', attribution.first.utm_campaign) ?? '  Campaign      : —'
  );
  lines.push(
    fmt('Content', attribution.first.utm_content) ?? '  Content       : —'
  );
  if (attribution.first.utm_term) {
    lines.push(fmt('Term', attribution.first.utm_term) ?? '');
  }
  lines.push(
    fmt('Landing Page', attribution.first.landing_page) ??
      '  Landing Page  : —'
  );
  if (attribution.first.referrer) {
    lines.push(fmt('Referrer', attribution.first.referrer) ?? '');
  }
  lines.push(
    fmt('First Seen', attribution.first.first_seen_at) ?? '  First Seen    : —'
  );

  lines.push('');
  lines.push('Last Touch:');
  lines.push(fmt('Source', attribution.last.utm_source) ?? '  Source        : —');
  lines.push(fmt('Medium', attribution.last.utm_medium) ?? '  Medium        : —');
  lines.push(
    fmt('Campaign', attribution.last.utm_campaign) ?? '  Campaign      : —'
  );
  lines.push(
    fmt('Content', attribution.last.utm_content) ?? '  Content       : —'
  );
  if (attribution.last.utm_term) {
    lines.push(fmt('Term', attribution.last.utm_term) ?? '');
  }
  lines.push(
    fmt('Landing Page', attribution.last.landing_page) ?? '  Landing Page  : —'
  );
  if (attribution.last.referrer) {
    lines.push(fmt('Referrer', attribution.last.referrer) ?? '');
  }
  lines.push(
    fmt('Last Seen', attribution.last.last_seen_at) ?? '  Last Seen     : —'
  );

  return lines.filter((l) => l !== '').join('\n');
}

/**
 * Lead-Notification:
 *  - Aktuell: strukturiertes Server-Log mit Attribution-Block.
 *  - Sobald Resend/Mail-Provider angebunden ist, kann hier `sendMail()`
 *    die gleiche Struktur als HTML-/Plain-Text-Mail rausschicken.
 */
function logLeadNotification(data: ContactPayload): void {
  const block = [
    '────────────── NEUER LEAD ──────────────',
    `Service       : ${data.service}`,
    `Budget        : ${data.budget_range}`,
    `Projektstart  : ${data.start_time}`,
    `Eingegangen   : ${data.submitted_at ?? new Date().toISOString()}`,
    '',
    formatAttributionBlock(data.attribution),
    '────────────────────────────────────────',
  ].join('\n');

  // Bewusst console.info, damit Vercel-Logs den Lead-Eintrag eindeutig
  // als Info markieren (nicht als Error/Warning).
  console.info(block);
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { message: 'Zu viele Anfragen. Bitte versuchen Sie es in einigen Minuten erneut.' },
        { status: 429 }
      );
    }

    const body: unknown = await req.json();

    // Zod Validation & Honeypot Check
    const validatedData = contactSchema.parse(body);

    // Lead-Notification (Server-Log inkl. Attribution).
    // Sobald Mail-Provider angebunden ist, hier sendLeadEmail(validatedData).
    logLeadNotification(validatedData);

    return NextResponse.json(
      { message: 'Erfolgreich gesendet' },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zod v4: `error.errors` wurde in `error.issues` umbenannt.
      return NextResponse.json(
        { message: 'Validierungsfehler', errors: error.issues },
        { status: 400 }
      );
    }

    // Generic Error 500
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { message: 'Ein unerwarteter Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}
