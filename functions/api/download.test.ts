/**
 * @jest-environment node
 */
import { base64ToUint8Array, onRequestGet, recordDownload, verifyPaidSession } from './download';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const env = { STRIPE_SECRET_KEY: 'rk_test_key', STRIPE_PRICE_ID: 'price_123' };

function get(url: string): Request {
  return new Request(url, { method: 'GET' });
}

function call(request: Request, callEnv: Record<string, unknown> = env): Promise<Response> {
  return Promise.resolve(onRequestGet({ request, env: callEnv, params: {}, data: {} }));
}

function fakeKv(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  return {
    get: jest.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
    put: jest.fn((key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve();
    }),
    store,
  };
}

describe('onRequestGet', () => {
  beforeEach(() => mockFetch.mockReset());

  it('serves the guide as a PDF when the session is paid and matches the configured price', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        payment_status: 'paid',
        line_items: { data: [{ price: { id: 'price_123' } }] },
      }),
    });

    const res = await call(get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/pdf');
    expect(res.headers.get('content-disposition')).toBe(
      'attachment; filename="give-every-pound-a-job.pdf"'
    );

    const bytes = new Uint8Array(await res.arrayBuffer());
    expect(bytes.length).toBeGreaterThan(0);
    // "%PDF" magic bytes — confirms this is a real PDF, not placeholder text.
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe('%PDF');
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

  it('records a download against the session when a KV binding is present', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        payment_status: 'paid',
        line_items: { data: [{ price: { id: 'price_123' } }] },
      }),
    });
    const kv = fakeKv();

    const res = await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, DOWNLOAD_LOG: kv }
    );

    expect(res.status).toBe(200);
    expect(kv.put).toHaveBeenCalledWith('cs_test_abc', expect.any(String));
    const stored = JSON.parse(kv.store.get('cs_test_abc') as string);
    expect(stored.count).toBe(1);
  });

  it('still serves the file when the KV binding throws', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        payment_status: 'paid',
        line_items: { data: [{ price: { id: 'price_123' } }] },
      }),
    });
    const kv = {
      get: jest.fn().mockRejectedValue(new Error('kv down')),
      put: jest.fn(),
    };

    const res = await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, DOWNLOAD_LOG: kv }
    );

    expect(res.status).toBe(200);
  });
});

describe('recordDownload', () => {
  it('starts a new record at count 1 on the first download', async () => {
    const kv = fakeKv();
    await recordDownload('cs_test_abc', kv, new Date('2026-10-10T12:00:00Z'));

    const stored = JSON.parse(kv.store.get('cs_test_abc') as string);
    expect(stored).toEqual({
      count: 1,
      firstDownloadedAt: '2026-10-10T12:00:00.000Z',
      lastDownloadedAt: '2026-10-10T12:00:00.000Z',
    });
  });

  it('increments the count and keeps the first timestamp on repeat downloads', async () => {
    const kv = fakeKv();
    await recordDownload('cs_test_abc', kv, new Date('2026-10-10T12:00:00Z'));
    await recordDownload('cs_test_abc', kv, new Date('2026-10-11T09:30:00Z'));

    const stored = JSON.parse(kv.store.get('cs_test_abc') as string);
    expect(stored).toEqual({
      count: 2,
      firstDownloadedAt: '2026-10-10T12:00:00.000Z',
      lastDownloadedAt: '2026-10-11T09:30:00.000Z',
    });
  });
});

describe('base64ToUint8Array', () => {
  it('decodes base64 back to the original bytes', () => {
    const original = new Uint8Array([0, 1, 2, 253, 254, 255, 37, 80, 68, 70]); // includes "%PDF"
    const base64 = Buffer.from(original).toString('base64');

    expect(base64ToUint8Array(base64)).toEqual(original);
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
