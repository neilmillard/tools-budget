/**
 * @jest-environment node
 */
import { onRequestPost, sendContactEmail, isPreviewDeployment } from './contact';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const env = { BREVO_API_KEY: 'test-api-key', CF_PAGES_BRANCH: 'main' };

function post(body: BodyInit, contentType?: string): Request {
  const headers: Record<string, string> = { 'CF-Connecting-IP': '1.2.3.4' };
  if (contentType) headers['Content-Type'] = contentType;
  return new Request('https://helpfulmoney.stuff/api/contact', { method: 'POST', headers, body });
}

function call(request: Request): Promise<Response> {
  return Promise.resolve(onRequestPost({ request, env, params: {}, data: {} }));
}

describe('onRequestPost spam handling', () => {
  beforeEach(() => mockFetch.mockReset());

  it('emails a normal JSON submission', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    const res = await call(
      post(JSON.stringify({ name: 'Jane', email: 'jane@example.com', message: 'Hi', _gotcha: '' }), 'application/json')
    );
    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('drops a JSON submission with the honeypot filled, without emailing', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    const res = await call(
      post(JSON.stringify({ name: 'Bot', email: 'bot@example.com', message: 'buy', _gotcha: 'x' }), 'application/json')
    );
    expect(res.status).toBe(200);
    expect(mockFetch).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(expect.objectContaining({ event: 'contact_dropped', reason: 'honeypot' }));
    log.mockRestore();
  });

  it('drops a url-encoded (no-JS) post without emailing and returns a helpful HTML page', async () => {
    const res = await call(
      post(
        new URLSearchParams({ name: 'Bot', email: 'bot@example.com', message: 'spam' }).toString(),
        'application/x-www-form-urlencoded'
      )
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/text\/html/);
    expect(await res.text()).toMatch(/email address on the page/i);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns a 4xx for malformed JSON', async () => {
    const res = await call(post('{not valid json', 'application/json'));
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

describe('sendContactEmail validation and escaping', () => {
  beforeEach(() => mockFetch.mockReset());

  it('returns error when a required field is missing', async () => {
    const result = await sendContactEmail({ name: '', email: 'a@b.com', message: 'hi' }, '1.2.3.4', 'k');
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/required/i);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('escapes HTML in the submitted fields', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    await sendContactEmail(
      { name: '<b>Eve</b>', email: 'eve@example.com', message: '<a href="http://x">click</a>' },
      '1.2.3.4',
      'k'
    );
    const html = JSON.parse(mockFetch.mock.calls[0][1].body).htmlContent;
    expect(html).not.toContain('<a href="http://x">');
    expect(html).toContain('&lt;a href=&quot;http://x&quot;&gt;click&lt;/a&gt;');
    expect(html).toContain('&lt;b&gt;Eve&lt;/b&gt;');
  });

  it('returns success when Brevo responds ok', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    const result = await sendContactEmail({ name: 'Jane', email: 'jane@example.com', message: 'Hi' }, '1.2.3.4', 'k');
    expect(result.ok).toBe(true);
    expect(result.message).toMatch(/thank you/i);
  });

  it('returns error when Brevo responds with failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 });
    const result = await sendContactEmail({ name: 'Jane', email: 'jane@example.com', message: 'Hi' }, '1.2.3.4', 'k');
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/failed to send/i);
  });
});

describe('isPreviewDeployment', () => {
  it('returns false when branch is main', () => {
    expect(isPreviewDeployment({ CF_PAGES_BRANCH: 'main' })).toBe(false);
  });

  it('returns true when branch is a feature branch', () => {
    expect(isPreviewDeployment({ CF_PAGES_BRANCH: 'contact' })).toBe(true);
  });

  it('returns true when CF_PAGES_BRANCH is not set', () => {
    expect(isPreviewDeployment({})).toBe(true);
  });
});
