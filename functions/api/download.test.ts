/**
 * @jest-environment node
 */
import {
  base64ToUint8Array,
  onRequestGet,
  recordDownload,
  sendDownloadEmail,
  subscribeBuyerToBrevo,
  verifyPaidSession,
} from './download';

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

function paidSession(
  charge: Record<string, unknown> = { refunded: false, disputed: false },
  email: string | null = 'buyer@example.com',
  marketingConsent = false
) {
  return {
    payment_status: 'paid',
    line_items: { data: [{ price: { id: 'price_123' } }] },
    payment_intent: { latest_charge: charge },
    customer_details: email ? { email } : null,
    metadata: { marketing_consent: String(marketingConsent) },
  };
}

describe('onRequestGet', () => {
  beforeEach(() => mockFetch.mockReset());

  it('serves the guide as a PDF when the session is paid, unrefunded and matches the configured price', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession() });

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

  it('still serves the PDF for a partial refund', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => paidSession({ refunded: false, disputed: false, amount_refunded: 300 }),
    });

    const res = await call(get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/pdf');
  });

  it('requests both line_items and payment_intent.latest_charge from Stripe', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession() });

    await call(get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'));

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('expand[]=line_items');
    expect(url).toContain('expand[]=payment_intent.latest_charge');
  });

  it('returns 410 and an HTML "refunded" message for a fully refunded session, without serving the PDF', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => paidSession({ refunded: true, disputed: false }),
    });

    const res = await call(get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'));
    expect(res.status).toBe(410);
    expect(res.headers.get('content-type')).toMatch(/^text\/html/);
    const body = await res.text();
    expect(body).toMatch(/refunded/i);
    expect(body).not.toMatch(/%PDF/);
  });

  it('returns 410 for a disputed charge, same as a refund', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => paidSession({ refunded: false, disputed: true }),
    });

    const res = await call(get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'));
    expect(res.status).toBe(410);
    expect(res.headers.get('content-type')).toMatch(/^text\/html/);
  });

  it('includes the session id as a reference on the refunded page', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => paidSession({ refunded: true, disputed: false }),
    });

    const res = await call(get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc123'));
    const body = await res.text();
    expect(body).toContain('cs_test_abc123');
  });

  it('returns 403 as HTML, not JSON, when the session has not been paid', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        payment_status: 'unpaid',
        line_items: { data: [{ price: { id: 'price_123' } }] },
      }),
    });

    const res = await call(get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'));
    expect(res.status).toBe(403);
    expect(res.headers.get('content-type')).toMatch(/^text\/html/);
    expect(await res.text()).toMatch(/isn't valid/i);
  });

  it('returns 403 when the paid line item is for a different price', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        payment_status: 'paid',
        line_items: { data: [{ price: { id: 'price_other' } }] },
        payment_intent: { latest_charge: { refunded: false, disputed: false } },
      }),
    });

    const res = await call(get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'));
    expect(res.status).toBe(403);
    expect(res.headers.get('content-type')).toMatch(/^text\/html/);
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
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession() });
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
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession() });
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

  it('does not record a download for a refunded session', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => paidSession({ refunded: true, disputed: false }),
    });
    const kv = fakeKv();

    await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, DOWNLOAD_LOG: kv }
    );

    expect(kv.put).not.toHaveBeenCalled();
  });

  it('does not record a download for an invalid session', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        payment_status: 'unpaid',
        line_items: { data: [{ price: { id: 'price_123' } }] },
      }),
    });
    const kv = fakeKv();

    await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, DOWNLOAD_LOG: kv }
    );

    expect(kv.put).not.toHaveBeenCalled();
  });

  it("captures the buyer's email into the download KV record when present", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession() });
    const kv = fakeKv();

    await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, DOWNLOAD_LOG: kv }
    );

    const stored = JSON.parse(kv.store.get('cs_test_abc') as string);
    expect(stored.email).toBe('buyer@example.com');
  });

  it('subscribes the buyer to the Brevo list when BREVO_API_KEY and BREVO_LIST_ID are configured', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession() });
    mockFetch.mockResolvedValueOnce({ ok: true });

    const res = await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, BREVO_API_KEY: 'brevo-key', BREVO_LIST_ID: '22' }
    );

    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    const [url, init] = mockFetch.mock.calls[1];
    expect(url).toBe('https://api.brevo.com/v3/contacts');
    expect(JSON.parse(init.body)).toEqual({
      email: 'buyer@example.com',
      listIds: [22],
      attributes: { MARKETING_CONSENT: false },
      updateEnabled: true,
    });
  });

  it('also adds the buyer to the marketing list when they opted in and BREVO_MARKETING_LIST_ID is configured', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession(undefined, undefined, true) });
    mockFetch.mockResolvedValueOnce({ ok: true });

    await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, BREVO_API_KEY: 'brevo-key', BREVO_LIST_ID: '22', BREVO_MARKETING_LIST_ID: '23' }
    );

    const [, init] = mockFetch.mock.calls[1];
    expect(JSON.parse(init.body)).toEqual({
      email: 'buyer@example.com',
      listIds: [22, 23],
      attributes: { MARKETING_CONSENT: true },
      updateEnabled: true,
    });
  });

  it('does not add the marketing list when the buyer did not opt in, even if configured', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession(undefined, undefined, false) });
    mockFetch.mockResolvedValueOnce({ ok: true });

    await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, BREVO_API_KEY: 'brevo-key', BREVO_LIST_ID: '22', BREVO_MARKETING_LIST_ID: '23' }
    );

    const [, init] = mockFetch.mock.calls[1];
    expect(JSON.parse(init.body)).toEqual({
      email: 'buyer@example.com',
      listIds: [22],
      attributes: { MARKETING_CONSENT: false },
      updateEnabled: true,
    });
  });

  it('does not call Brevo when BREVO_LIST_ID is not configured', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession() });

    await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, BREVO_API_KEY: 'brevo-key' }
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('still serves the file when the Brevo subscribe call fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession() });
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const res = await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, BREVO_API_KEY: 'brevo-key', BREVO_LIST_ID: '22' }
    );

    expect(res.status).toBe(200);
  });

  it('does not call Brevo for a refunded session even when configured', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => paidSession({ refunded: true, disputed: false }),
    });

    await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, BREVO_API_KEY: 'brevo-key', BREVO_LIST_ID: '22' }
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('sends the buyer a download-link email on the first download when configured', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession() });
    mockFetch.mockResolvedValueOnce({ ok: true }); // Brevo smtp/email
    const kv = fakeKv();

    const res = await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, DOWNLOAD_LOG: kv, BREVO_API_KEY: 'brevo-key', NEXT_PUBLIC_SITE_URL: 'https://www.helpfulmoney.site' }
    );

    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    const [url, init] = mockFetch.mock.calls[1];
    expect(url).toBe('https://api.brevo.com/v3/smtp/email');
    const body = JSON.parse(init.body);
    expect(body.to).toEqual([{ email: 'buyer@example.com' }]);
    expect(body.htmlContent).toContain('cs_test_abc');
  });

  it('does not re-send the download-link email on a repeat download', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession() });
    const kv = fakeKv({
      cs_test_abc: JSON.stringify({
        count: 1,
        firstDownloadedAt: '2026-10-09T00:00:00.000Z',
        lastDownloadedAt: '2026-10-09T00:00:00.000Z',
        email: 'buyer@example.com',
      }),
    });

    const res = await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, DOWNLOAD_LOG: kv, BREVO_API_KEY: 'brevo-key', NEXT_PUBLIC_SITE_URL: 'https://www.helpfulmoney.site' }
    );

    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not send the download-link email when BREVO_API_KEY is not configured', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession() });
    const kv = fakeKv();

    await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, DOWNLOAD_LOG: kv, NEXT_PUBLIC_SITE_URL: 'https://www.helpfulmoney.site' }
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('still serves the file when sending the download-link email fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession() });
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
    const kv = fakeKv();

    const res = await call(
      get('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc'),
      { ...env, DOWNLOAD_LOG: kv, BREVO_API_KEY: 'brevo-key', NEXT_PUBLIC_SITE_URL: 'https://www.helpfulmoney.site' }
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

  it('stores the buyer email when provided', async () => {
    const kv = fakeKv();
    await recordDownload('cs_test_abc', kv, new Date('2026-10-10T12:00:00Z'), 'buyer@example.com');

    const stored = JSON.parse(kv.store.get('cs_test_abc') as string);
    expect(stored.email).toBe('buyer@example.com');
  });

  it('keeps the previously stored email on a repeat call that does not pass one', async () => {
    const kv = fakeKv();
    await recordDownload('cs_test_abc', kv, new Date('2026-10-10T12:00:00Z'), 'buyer@example.com');
    await recordDownload('cs_test_abc', kv, new Date('2026-10-11T09:30:00Z'));

    const stored = JSON.parse(kv.store.get('cs_test_abc') as string);
    expect(stored.email).toBe('buyer@example.com');
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

  it('returns "ok" and the buyer\'s email for a paid, unrefunded session with a matching price', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => paidSession() });
    const result = await verifyPaidSession('cs_test_abc', 'price_123', 'rk_test_key');
    expect(result).toEqual({ status: 'ok', email: 'buyer@example.com', marketingConsent: false });
  });

  it('returns "ok" with a null email when Stripe has no customer details', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => paidSession({ refunded: false, disputed: false }, null),
    });
    const result = await verifyPaidSession('cs_test_abc', 'price_123', 'rk_test_key');
    expect(result).toEqual({ status: 'ok', email: null, marketingConsent: false });
  });

  it('returns marketingConsent true when the Checkout session metadata says so', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => paidSession(undefined, undefined, true),
    });
    const result = await verifyPaidSession('cs_test_abc', 'price_123', 'rk_test_key');
    expect(result.marketingConsent).toBe(true);
  });

  it('returns "refunded" when the latest charge was refunded', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => paidSession({ refunded: true, disputed: false }),
    });
    const result = await verifyPaidSession('cs_test_abc', 'price_123', 'rk_test_key');
    expect(result.status).toBe('refunded');
  });

  it('returns "refunded" when the latest charge is disputed', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => paidSession({ refunded: false, disputed: true }),
    });
    const result = await verifyPaidSession('cs_test_abc', 'price_123', 'rk_test_key');
    expect(result.status).toBe('refunded');
  });

  it('returns "invalid" without calling Stripe for an empty id', async () => {
    const result = await verifyPaidSession('', 'price_123', 'rk_test_key');
    expect(result).toEqual({ status: 'invalid', email: null, marketingConsent: false });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns "invalid" when the Stripe request throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network down'));
    const result = await verifyPaidSession('cs_test_abc', 'price_123', 'rk_test_key');
    expect(result.status).toBe('invalid');
  });
});

describe('subscribeBuyerToBrevo', () => {
  beforeEach(() => mockFetch.mockReset());

  it('sends the email to the configured Brevo list with updateEnabled so repeat buyers do not error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    await subscribeBuyerToBrevo('buyer@example.com', '22', 'k', false);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.brevo.com/v3/contacts');
    expect(JSON.parse(init.body)).toEqual({
      email: 'buyer@example.com',
      listIds: [22],
      attributes: { MARKETING_CONSENT: false },
      updateEnabled: true,
    });
    expect(init.headers).toEqual(expect.objectContaining({ 'api-key': 'k', 'Content-Type': 'application/json' }));
  });

  it('appends the marketing list id when consent is given and a marketing list is configured', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    await subscribeBuyerToBrevo('buyer@example.com', '22', 'k', true, '23');
    const [, init] = mockFetch.mock.calls[0];
    expect(JSON.parse(init.body)).toEqual({
      email: 'buyer@example.com',
      listIds: [22, 23],
      attributes: { MARKETING_CONSENT: true },
      updateEnabled: true,
    });
  });

  it('returns ok:false when Brevo responds with failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 400 });
    const result = await subscribeBuyerToBrevo('buyer@example.com', '22', 'k', false);
    expect(result.ok).toBe(false);
  });
});

describe('sendDownloadEmail', () => {
  beforeEach(() => mockFetch.mockReset());

  it('sends a transactional email with the re-download link, contact fallback and a one-line challenge mention', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    await sendDownloadEmail(
      'buyer@example.com',
      'https://www.helpfulmoney.site/api/download?session_id=cs_test_abc',
      'https://www.helpfulmoney.site',
      'k'
    );

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.brevo.com/v3/smtp/email');
    expect(init.headers).toEqual(expect.objectContaining({ 'api-key': 'k', 'Content-Type': 'application/json' }));
    const body = JSON.parse(init.body);
    expect(body.to).toEqual([{ email: 'buyer@example.com' }]);
    expect(body.htmlContent).toContain('https://www.helpfulmoney.site/api/download?session_id=cs_test_abc');
    expect(body.htmlContent).toContain('https://www.helpfulmoney.site/contact/');
    expect(body.htmlContent).toContain('https://www.helpfulmoney.site/challenge/give-every-pound-a-job/');
  });

  it('returns ok:false when Brevo responds with failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
    const result = await sendDownloadEmail(
      'buyer@example.com',
      'https://www.helpfulmoney.site/api/download?session_id=cs_test_abc',
      'https://www.helpfulmoney.site',
      'k'
    );
    expect(result.ok).toBe(false);
  });
});
