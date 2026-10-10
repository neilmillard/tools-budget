interface Env {
  STRIPE_SECRET_KEY?: string;
  STRIPE_PRICE_ID?: string;
  NEXT_PUBLIC_SITE_URL?: string;
}

interface PagesContext<E> {
  request: Request;
  env: E;
  params: Record<string, string | string[]>;
  data: Record<string, unknown>;
}

type PagesFunction<E> = (context: PagesContext<E>) => Response | Promise<Response>;

interface CheckoutResult {
  ok: boolean;
  url?: string;
  message?: string;
}

// Hosted Checkout only: the session's own `url` is where the browser is sent,
// so this never needs a publishable key or client-side Stripe.js.
export async function createCheckoutSession(
  priceId: string,
  siteUrl: string,
  secretKey: string
): Promise<CheckoutResult> {
  const body = new URLSearchParams({
    mode: 'payment',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    success_url: `${siteUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout-cancelled`,
    // Repeats the consent-checkbox wording above Stripe's own Pay button, since
    // the buyer already left the site's consent checkbox behind at this point.
    'custom_text[submit][message]':
      'Instant digital download: once downloaded, you lose the right to cancel and no refund is given. Technical issue? Contact us within 7 days.',
  });

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    return { ok: false, message: 'Failed to start checkout. Please try again later.' };
  }

  const session = (await response.json()) as { url?: string };
  if (!session.url) {
    return { ok: false, message: 'Failed to start checkout. Please try again later.' };
  }

  return { ok: true, url: session.url };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env } = context;

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PRICE_ID || !env.NEXT_PUBLIC_SITE_URL) {
    return Response.json({ message: 'Checkout is not configured yet.' }, { status: 503 });
  }

  const result = await createCheckoutSession(env.STRIPE_PRICE_ID, env.NEXT_PUBLIC_SITE_URL, env.STRIPE_SECRET_KEY);

  if (!result.ok || !result.url) {
    return Response.json({ message: result.message ?? 'Failed to start checkout.' }, { status: 500 });
  }

  return Response.json({ url: result.url });
};
