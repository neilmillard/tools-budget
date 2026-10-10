import { GUIDE_PDF_BASE64 } from './guide-pdf';

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface Env {
  STRIPE_SECRET_KEY?: string;
  STRIPE_PRICE_ID?: string;
  DOWNLOAD_LOG?: KVNamespace;
  BREVO_API_KEY?: string;
  BREVO_LIST_ID?: string;
  BREVO_MARKETING_LIST_ID?: string;
  NEXT_PUBLIC_SITE_URL?: string;
}

interface DownloadRecord {
  count: number;
  firstDownloadedAt: string;
  lastDownloadedAt: string;
  email?: string;
}

interface PagesContext<E> {
  request: Request;
  env: E;
  params: Record<string, string | string[]>;
  data: Record<string, unknown>;
}

type PagesFunction<E> = (context: PagesContext<E>) => Response | Promise<Response>;

interface StripeCharge {
  refunded?: boolean;
  disputed?: boolean;
}

interface StripeCheckoutSession {
  payment_status?: string;
  line_items?: { data?: Array<{ price?: { id?: string } }> };
  payment_intent?: { latest_charge?: StripeCharge };
  customer_details?: { email?: string | null } | null;
  metadata?: { marketing_consent?: string };
}

type SessionCheck = 'ok' | 'refunded' | 'invalid';

interface SessionCheckResult {
  status: SessionCheck;
  email: string | null;
  marketingConsent: boolean;
}

const SESSION_ID_PATTERN = /^cs_[a-zA-Z0-9_]+$/;

const GUIDE_FILENAME = 'give-every-pound-a-job.pdf';

export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function htmlMessage(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body>
<p>${body}</p>
</body>
</html>
`;
}

export async function verifyPaidSession(
  sessionId: string,
  priceId: string,
  secretKey: string
): Promise<SessionCheckResult> {
  if (!SESSION_ID_PATTERN.test(sessionId)) {
    return { status: 'invalid', email: null, marketingConsent: false };
  }

  try {
    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}` +
        '?expand[]=line_items&expand[]=payment_intent.latest_charge',
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );

    if (!response.ok) {
      return { status: 'invalid', email: null, marketingConsent: false };
    }

    const session = (await response.json()) as StripeCheckoutSession;
    if (session.payment_status !== 'paid') {
      return { status: 'invalid', email: null, marketingConsent: false };
    }

    const paidPriceIds = session.line_items?.data?.map((item) => item.price?.id) ?? [];
    if (!paidPriceIds.includes(priceId)) {
      return { status: 'invalid', email: null, marketingConsent: false };
    }

    const email = session.customer_details?.email ?? null;
    const marketingConsent = session.metadata?.marketing_consent === 'true';
    const charge = session.payment_intent?.latest_charge;
    if (charge?.refunded || charge?.disputed) {
      return { status: 'refunded', email, marketingConsent };
    }

    return { status: 'ok', email, marketingConsent };
  } catch {
    return { status: 'invalid', email: null, marketingConsent: false };
  }
}

// DEL-586: mirrors challenge-signup.ts's subscribeToChallenge — same Brevo
// Contacts API, different list (BREVO_LIST_ID, the buyer list, vs.
// BREVO_CHALLENGE_LIST_ID). Kept separate rather than shared since each
// endpoint has its own small, self-contained Brevo call, matching contact.ts.
// List 22 (the buyer list) stays service-email-only: marketing consent only
// ever adds the separate marketing list/tag on top, it never gates list 22
// itself. The MARKETING_CONSENT attribute is set either way so a future
// campaign can filter on it even before a marketing list id exists.
export async function subscribeBuyerToBrevo(
  email: string,
  listId: string,
  apiKey: string,
  marketingConsent: boolean,
  marketingListId?: string
): Promise<{ ok: boolean }> {
  const listIds = [Number(listId)];
  if (marketingConsent && marketingListId) {
    listIds.push(Number(marketingListId));
  }

  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      listIds,
      attributes: { MARKETING_CONSENT: marketingConsent },
      updateEnabled: true,
    }),
  });

  return { ok: response.ok };
}

const CHALLENGE_URL_PATH = '/challenge/give-every-pound-a-job/';

// Reuses contact.ts's smtp/email Brevo call rather than the Contacts-list API
// subscribeBuyerToBrevo uses above — this is a one-off transactional send, not
// a list subscription.
export async function sendDownloadEmail(
  email: string,
  downloadUrl: string,
  siteUrl: string,
  apiKey: string
): Promise<{ ok: boolean }> {
  const contactUrl = `${siteUrl}/contact/`;
  const challengeUrl = `${siteUrl}${CHALLENGE_URL_PATH}`;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Helpful Money', email: 'neil@deltafamiglia.com' },
      to: [{ email }],
      subject: 'Your guide: Give Every Pound a Job',
      htmlContent: `
        <p>Thanks for buying the guide. Here's your download link:</p>
        <p><a href="${downloadUrl}">${downloadUrl}</a></p>
        <p>Having trouble? Get in touch via <a href="${contactUrl}">${contactUrl}</a>.</p>
        <p>P.S. If you haven't already, we also run a free <a href="${challengeUrl}">30-day budgeting challenge</a>.</p>
      `,
    }),
  });

  return { ok: response.ok };
}

// Records each successful download against the paying session, so a refund
// decision can check whether (and how many times) the file was actually
// pulled. Tracking is best-effort: a missing or failing KV binding must
// never block a paid download.
export async function recordDownload(
  sessionId: string,
  kv: KVNamespace,
  now: Date = new Date(),
  email?: string
): Promise<DownloadRecord> {
  const nowIso = now.toISOString();
  const existing = await kv.get(sessionId);
  const previous = existing ? (JSON.parse(existing) as DownloadRecord) : null;

  const record: DownloadRecord = {
    count: (previous?.count ?? 0) + 1,
    firstDownloadedAt: previous?.firstDownloadedAt ?? nowIso,
    lastDownloadedAt: nowIso,
    email: email ?? previous?.email,
  };

  await kv.put(sessionId, JSON.stringify(record));
  return record;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PRICE_ID) {
    return Response.json({ message: 'Download is not configured yet.' }, { status: 503 });
  }

  const sessionId = new URL(request.url).searchParams.get('session_id') ?? '';
  const check = await verifyPaidSession(sessionId, env.STRIPE_PRICE_ID, env.STRIPE_SECRET_KEY);

  if (check.status === 'refunded') {
    return new Response(
      htmlMessage(
        'Download not available',
        'This purchase was refunded, so the download is no longer available. If you think this is a ' +
          'mistake, get in touch via <a href="https://www.helpfulmoney.site/contact/">helpfulmoney.site/contact/</a> ' +
          `and quote your reference: ${escapeHtml(sessionId)}.`
      ),
      { status: 410, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  if (check.status === 'invalid') {
    return new Response(
      htmlMessage(
        'Download link not valid',
        "This download link isn't valid. If you've paid and can't get your guide, contact us via " +
          '<a href="https://www.helpfulmoney.site/contact/">helpfulmoney.site/contact/</a>.'
      ),
      { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  let isFirstDownload = true;
  if (env.DOWNLOAD_LOG) {
    try {
      const record = await recordDownload(sessionId, env.DOWNLOAD_LOG, new Date(), check.email ?? undefined);
      isFirstDownload = record.count === 1;
    } catch {
      // Tracking is a nice-to-have; never fail the download because of it.
    }
  }

  if (check.email && env.BREVO_API_KEY && env.BREVO_LIST_ID) {
    try {
      await subscribeBuyerToBrevo(
        check.email,
        env.BREVO_LIST_ID,
        env.BREVO_API_KEY,
        check.marketingConsent,
        env.BREVO_MARKETING_LIST_ID
      );
    } catch {
      // Buyer-list capture is a nice-to-have; never fail the download because of it.
    }
  }

  // A service email (receipt + delivery), sent regardless of marketing
  // consent — same as the download itself. Only sent once per session so a
  // buyer who re-opens the download link doesn't get repeat emails.
  if (check.email && env.BREVO_API_KEY && env.NEXT_PUBLIC_SITE_URL && isFirstDownload) {
    try {
      const downloadUrl = `${env.NEXT_PUBLIC_SITE_URL}/api/download?session_id=${encodeURIComponent(sessionId)}`;
      await sendDownloadEmail(check.email, downloadUrl, env.NEXT_PUBLIC_SITE_URL, env.BREVO_API_KEY);
    } catch {
      // Delivery already succeeded via the page itself; never fail because of this.
    }
  }

  return new Response(base64ToUint8Array(GUIDE_PDF_BASE64).buffer as ArrayBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${GUIDE_FILENAME}"`,
    },
  });
};
