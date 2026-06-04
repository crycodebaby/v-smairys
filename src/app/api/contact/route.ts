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
 *  - Strukturiertes Server-Log mit Attribution-Block (KEINE PII).
 *  - Dient als zweiter, providerunabhängiger Nachweis im Vercel-Log,
 *    zusätzlich zur Formcarry-Zustellung.
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

/** Request-Metadaten, die nicht im Body stecken (aus Headern abgeleitet). */
type RequestMeta = {
  user_agent: string;
  referer: string;
};

/**
 * Resultat der Formcarry-Zustellung. `ok=false` führt zu einer sicheren
 * Client-Fehlermeldung; Details landen ausschließlich (redacted) im Server-Log.
 */
type DeliveryResult = { ok: true } | { ok: false; reason: string };

/**
 * Baut die flache UTM-Sicht für die Formcarry-Übersicht.
 * Priorität: Last-Touch > First-Touch (analog `getAttributionData`).
 */
function flattenAttribution(
  attribution: ContactPayload['attribution']
): Record<string, string> {
  if (!attribution) return {};
  const { first, last } = attribution;
  const pick = (key: keyof typeof first) => last[key] ?? first[key];

  const flat: Record<string, string | undefined> = {
    utm_source: pick('utm_source'),
    utm_medium: pick('utm_medium'),
    utm_campaign: pick('utm_campaign'),
    utm_content: pick('utm_content'),
    utm_term: pick('utm_term'),
    first_touch_landing_page: first.landing_page,
    first_touch_referrer: first.referrer,
    first_seen_at: first.first_seen_at,
    last_touch_landing_page: last.landing_page,
    last_seen_at: last.last_seen_at,
  };

  return Object.fromEntries(
    Object.entries(flat).filter(([, v]) => typeof v === 'string' && v !== '')
  ) as Record<string, string>;
}

/**
 * Leitet einen validierten Lead serverseitig an Formcarry weiter.
 *
 * - Endpoint kommt ausschließlich aus der Server-ENV `FORMCARRY_ENDPOINT`
 *   (kein NEXT_PUBLIC_ → nie im Client-Bundle).
 * - JSON-Payload mit allen Formularfeldern, Attribution (flach + voll) und
 *   nicht-PII-Metadaten (Page-Path, Referrer, User-Agent, Timestamp).
 * - Fehler werden NUR redacted geloggt (Status/Reason), niemals der Body
 *   inkl. PII.
 */
async function forwardToFormcarry(
  data: ContactPayload,
  meta: RequestMeta
): Promise<DeliveryResult> {
  const endpoint = process.env.FORMCARRY_ENDPOINT;

  if (!endpoint) {
    // Klares Server-Log OHNE PII. Fehlende Config = Zustellung unmöglich.
    console.error(
      '[contact] FORMCARRY_ENDPOINT ist nicht gesetzt – Lead konnte nicht zugestellt werden.'
    );
    return { ok: false, reason: 'missing_endpoint' };
  }

  const submittedAt = data.submitted_at ?? new Date().toISOString();
  const flatAttribution = flattenAttribution(data.attribution);

  const payload = {
    // Formcarry-Steuerfelder (verbessern Lesbarkeit der Benachrichtigung).
    _subject: `Neuer Lead: ${data.service} – ${data.name}`,
    _replyto: data.email,

    // Formularfelder.
    name: data.name,
    email: data.email,
    phone: data.phone ?? '',
    service: data.service,
    budget_range: data.budget_range,
    start_time: data.start_time,

    // Nicht-PII-Metadaten.
    submitted_at: submittedAt,
    page_path: data.attribution?.last.landing_page ?? '',
    referer: meta.referer,
    user_agent: meta.user_agent,

    // Attribution: flach (Dashboard-freundlich) + vollständig (Audit).
    ...flatAttribution,
    attribution: data.attribution ?? null,
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = (await res.json().catch(() => ({}))) as {
      status?: string;
      message?: string;
    };

    // Formcarry liefert bei Erfolg `status: "success"`. Manche Konten
    // antworten ohne `status`-Feld → bei 2xx ebenfalls als Erfolg werten.
    if (res.ok && json.status !== 'error') {
      return { ok: true };
    }

    // Redacted: nur Status + Formcarry-Statuswort, KEIN Body mit PII.
    console.error(
      `[contact] Formcarry-Zustellung fehlgeschlagen (HTTP ${res.status}, status=${
        json.status ?? 'n/a'
      }).`
    );
    return { ok: false, reason: `formcarry_http_${res.status}` };
  } catch (err) {
    // Nur Fehlertyp/-name loggen, niemals den Payload.
    const reason = err instanceof Error ? err.name : 'unknown';
    console.error(`[contact] Formcarry-Request-Fehler (${reason}).`);
    return { ok: false, reason: 'formcarry_network_error' };
  }
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

    // Lead-Notification (Server-Log inkl. Attribution, KEINE PII).
    logLeadNotification(validatedData);

    // Kanonische Zustellung: serverseitig an Formcarry weiterleiten.
    const meta: RequestMeta = {
      user_agent: req.headers.get('user-agent') ?? 'unknown',
      referer: req.headers.get('referer') ?? '',
    };
    const delivery = await forwardToFormcarry(validatedData, meta);

    if (!delivery.ok) {
      // Sichere, generische Client-Meldung – technische Details bleiben im Log.
      return NextResponse.json(
        {
          message:
            'Ihre Anfrage konnte gerade nicht zugestellt werden. Bitte versuchen Sie es in Kürze erneut oder rufen Sie uns direkt an.',
        },
        { status: 502 }
      );
    }

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
