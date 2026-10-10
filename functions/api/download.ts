interface Env {
  STRIPE_SECRET_KEY?: string;
  STRIPE_PRICE_ID?: string;
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

// DEL-585 swaps this placeholder for the real guide content. Bundled directly
// in the Function rather than an R2 bucket — small enough, and avoids needing
// Neil to provision a bucket for DEL-583.
const GUIDE_FILENAME = 'give-every-pound-a-job.txt';
const GUIDE_CONTENT = `Give Every Pound a Job

(placeholder — the real guide content lands with DEL-585)
`;

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

  return new Response(GUIDE_CONTENT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${GUIDE_FILENAME}"`,
    },
  });
};
