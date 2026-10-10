/**
 * @jest-environment node
 */
import { onRequestPost, subscribeToChallenge } from './challenge-signup';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const env = { BREVO_API_KEY: 'test-api-key', BREVO_CHALLENGE_LIST_ID: '7', CF_PAGES_BRANCH: 'main' };

function post(body: Record<string, unknown>): Request {
  return new Request('https://helpfulmoney.site/api/challenge-signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function call(request: Request, callEnv: typeof env = env): Promise<Response> {
  return Promise.resolve(onRequestPost({ request, env: callEnv, params: {}, data: {} }));
}

describe('onRequestPost', () => {
  beforeEach(() => mockFetch.mockReset());

  it('subscribes a valid email and returns success', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    const res = await call(post({ email: 'reader@example.com' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toMatch(/day 1/i);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.brevo.com/v3/contacts',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('drops a submission with the honeypot filled, without calling Brevo', async () => {
    const res = await call(post({ email: 'bot@example.com', _gotcha: 'x' }));
    expect(res.status).toBe(200);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('rejects a missing email without calling Brevo', async () => {
    const res = await call(post({}));
    expect(res.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('rejects a malformed email without calling Brevo', async () => {
    const res = await call(post({ email: 'not-an-email' }));
    expect(res.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns a 4xx for malformed JSON', async () => {
    const res = await onRequestPost({
      request: new Request('https://helpfulmoney.site/api/challenge-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{not valid json',
      }),
      env,
      params: {},
      data: {},
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns a preview-mode message when Brevo is not configured on a non-main branch', async () => {
    const res = await call(post({ email: 'reader@example.com' }), {
      BREVO_API_KEY: '',
      BREVO_CHALLENGE_LIST_ID: '7',
      CF_PAGES_BRANCH: 'preview',
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toMatch(/preview/i);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns 503 when Brevo is not configured on main', async () => {
    const res = await call(post({ email: 'reader@example.com' }), {
      BREVO_API_KEY: '',
      BREVO_CHALLENGE_LIST_ID: '7',
      CF_PAGES_BRANCH: 'main',
    });
    expect(res.status).toBe(503);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

describe('subscribeToChallenge', () => {
  beforeEach(() => mockFetch.mockReset());

  it('sends the email to the configured Brevo list with updateEnabled so re-signups do not error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    await subscribeToChallenge('reader@example.com', '7', 'k');
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.brevo.com/v3/contacts');
    const body = JSON.parse(init.body);
    expect(body).toEqual({ email: 'reader@example.com', listIds: [7], updateEnabled: true });
    expect(init.headers).toEqual(expect.objectContaining({ 'api-key': 'k', 'Content-Type': 'application/json' }));
  });

  it('returns ok:false when Brevo responds with failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 400 });
    const result = await subscribeToChallenge('reader@example.com', '7', 'k');
    expect(result.ok).toBe(false);
  });
});
