/**
 * @jest-environment node
 */
import { onRequestGet, verifyPaidSession } from './download';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const env = { STRIPE_SECRET_KEY: 'rk_test_key', STRIPE_PRICE_ID: 'price_123' };

function get(url: string): Request {
  return new Request(url, { method: 'GET' });
}

function call(request: Request, callEnv: Partial<typeof env> = env): Promise<Response> {
  return Promise.resolve(onRequestGet({ request, env: callEnv, params: {}, data: {} }));
}

describe('onRequestGet', () => {
  beforeEach(() => mockFetch.mockReset());

  it('serves the guide when the session is paid and matches the configured price', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        payment_status: 'paid',
        line_items: { data: [{ price: { id: 'price_123' } }] },
      }),
    });

    const res = await call(get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-disposition')).toMatch(/attachment/);
    expect((await res.text()).length).toBeGreaterThan(0);
  });

  it('returns 403 when the session has not been paid', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        payment_status: 'unpaid',
        line_items: { data: [{ price: { id: 'price_123' } }] },
      }),
    });

    const res = await call(get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'));
    expect(res.status).toBe(403);
  });

  it('returns 403 when the paid line item is for a different price', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        payment_status: 'paid',
        line_items: { data: [{ price: { id: 'price_other' } }] },
      }),
    });

    const res = await call(get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'));
    expect(res.status).toBe(403);
  });

  it('returns 403 for a missing session id, without calling Stripe', async () => {
    const res = await call(get('https://www.helpfulmoney.site/api/download'));
    expect(res.status).toBe(403);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 403 for a garbage session id, without calling Stripe', async () => {
    const res = await call(get('https://www.helpfulmoney.site/api/download?session_id=not-a-real-id'));
    expect(res.status).toBe(403);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 403 and never echoes Stripe error text when the lookup fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'No such checkout.session: cs_test_abc' } }),
    });

    const res = await call(get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'));
    expect(res.status).toBe(403);
    expect(await res.text()).not.toMatch(/No such checkout/);
  });

  it('returns 503 when not configured', async () => {
    const res = await call(get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'), {});
    expect(res.status).toBe(503);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

describe('verifyPaidSession', () => {
  beforeEach(() => mockFetch.mockReset());

  it('returns false without calling Stripe for an empty id', async () => {
    const result = await verifyPaidSession('', 'price_123', 'rk_test_key');
    expect(result).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns false when the Stripe request throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network down'));
    const result = await verifyPaidSession('cs_test_abc', 'price_123', 'rk_test_key');
    expect(result).toBe(false);
  });
});
