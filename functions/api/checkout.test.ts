/**
 * @jest-environment node
 */
import { onRequestPost, createCheckoutSession } from './checkout';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const env = {
  STRIPE_SECRET_KEY: 'rk_test_key',
  STRIPE_PRICE_ID: 'price_123',
  NEXT_PUBLIC_SITE_URL: 'https://www.helpfulmoney.site',
};

function post(body: Record<string, unknown> = {}): Request {
  return new Request('https://www.helpfulmoney.site/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function call(request: Request, callEnv: Partial<typeof env> = env): Promise<Response> {
  return Promise.resolve(onRequestPost({ request, env: callEnv, params: {}, data: {} }));
}

describe('onRequestPost', () => {
  beforeEach(() => mockFetch.mockReset());

  it('returns the hosted Checkout url on success', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ url: 'https://checkout.stripe.com/c/pay/cs_test_abc' }) });
    const res = await call(post());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: 'https://checkout.stripe.com/c/pay/cs_test_abc' });
  });

  it('sends the configured price, quantity and redirect urls to Stripe', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ url: 'https://checkout.stripe.com/c/pay/cs_test_abc' }) });
    await call(post());

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.stripe.com/v1/checkout/sessions');
    expect(init.headers.Authorization).toBe('Bearer rk_test_key');
    const body = new URLSearchParams(init.body);
    expect(body.get('mode')).toBe('payment');
    expect(body.get('line_items[0][price]')).toBe('price_123');
    expect(body.get('line_items[0][quantity]')).toBe('1');
    expect(body.get('success_url')).toBe('https://www.helpfulmoney.site/thank-you?session_id={CHECKOUT_SESSION_ID}');
    expect(body.get('cancel_url')).toBe('https://www.helpfulmoney.site/checkout-cancelled');
    expect(body.get('custom_text[submit][message]')).toMatch(/lose the right to cancel/i);
    expect(body.get('metadata[marketing_consent]')).toBe('false');
  });

  it('sends marketing_consent true in metadata when the buyer opted in', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ url: 'https://checkout.stripe.com/c/pay/cs_test_abc' }) });
    await call(post({ marketingConsent: true }));

    const [, init] = mockFetch.mock.calls[0];
    const body = new URLSearchParams(init.body);
    expect(body.get('metadata[marketing_consent]')).toBe('true');
  });

  it('returns 503 when Stripe is not configured yet', async () => {
    const res = await call(post(), {});
    expect(res.status).toBe(503);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 500 when Stripe rejects the request', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    const res = await call(post());
    expect(res.status).toBe(500);
  });

  it('returns 500 when Stripe responds without a url', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    const res = await call(post());
    expect(res.status).toBe(500);
  });
});

describe('createCheckoutSession', () => {
  beforeEach(() => mockFetch.mockReset());

  it('returns ok:false with a message when the request fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    const result = await createCheckoutSession('price_123', 'https://www.helpfulmoney.site', 'rk_test_key', false);
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/failed/i);
  });
});
