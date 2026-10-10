import { GUIDE_PDF_BASE64 } from './guide-pdf';

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface Env {
  STRIPE_SECRET_KEY?: string;
  STRIPE_PRICE_ID?: string;
  DOWNLOAD_LOG?: KVNamespace;
}

interface DownloadRecord {
  count: number;
  firstDownloadedAt: string;
  lastDownloadedAt: string;
}

interface PagesContext<E> {
  request: Request;
  env: E;
  params: Record<string, string | string[]>;
  data: Record<string, unknown>;
}

type PagesFunction<E> = (context: PagesContext<E>) => Response | Promise<Response>;

interface StripeCheckoutSession {
  payment_status?: string;
  line_items?: { data?: Array<{ price?: { id?: string } }> };
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

export async function verifyPaidSession(sessionId: string, priceId: string, secretKey: string): Promise<boolean> {
  if (!SESSION_ID_PATTERN.test(sessionId)) {
    return false;
  }

  try {
    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=line_items`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );

    if (!response.ok) {
      return false;
    }

    const session = (await response.json()) as StripeCheckoutSession;
    if (session.payment_status !== 'paid') {
      return false;
    }

    const paidPriceIds = session.line_items?.data?.map((item) => item.price?.id) ?? [];
    return paidPriceIds.includes(priceId);
  } catch {
    return false;
  }
}

// Records each successful download against the paying session, so a refund
// decision can check whether (and how many times) the file was actually
// pulled. Tracking is best-effort: a missing or failing KV binding must
// never block a paid download.
export async function recordDownload(sessionId: string, kv: KVNamespace, now: Date = new Date()): Promise<void> {
  const nowIso = now.toISOString();
  const existing = await kv.get(sessionId);
  const previous = existing ? (JSON.parse(existing) as DownloadRecord) : null;

  const record: DownloadRecord = {
    count: (previous?.count ?? 0) + 1,
    firstDownloadedAt: previous?.firstDownloadedAt ?? nowIso,
    lastDownloadedAt: nowIso,
  };

  await kv.put(sessionId, JSON.stringify(record));
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PRICE_ID) {
    return Response.json({ message: 'Download is not configured yet.' }, { status: 503 });
  }

  const sessionId = new URL(request.url).searchParams.get('session_id') ?? '';
  const paid = await verifyPaidSession(sessionId, env.STRIPE_PRICE_ID, env.STRIPE_SECRET_KEY);

  if (!paid) {
    return Response.json({ message: 'This download link is not valid.' }, { status: 403 });
  }

  if (env.DOWNLOAD_LOG) {
    try {
      await recordDownload(sessionId, env.DOWNLOAD_LOG);
    } catch {
      // Tracking is a nice-to-have; never fail the download because of it.
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
