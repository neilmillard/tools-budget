/**
 * @jest-environment node
 */
import { onRequestPost } from './funnel';

function post(url: string): Request {
  return new Request(url, { method: 'POST' });
}

function call(request: Request): Promise<Response> {
  return Promise.resolve(onRequestPost({ request, env: {}, params: {}, data: {} }));
}

describe('funnel onRequestPost', () => {
  it('returns 204 for a valid step', async () => {
    const res = await call(post('https://helpfulmoney.stuff/api/funnel?step=landing&page=contact'));
    expect(res.status).toBe(204);
  });

  it('returns 400 for an unknown step', async () => {
    const res = await call(post('https://helpfulmoney.stuff/api/funnel?step=bogus&page=contact'));
    expect(res.status).toBe(400);
  });

  it('returns 400 when step is missing', async () => {
    const res = await call(post('https://helpfulmoney.stuff/api/funnel?page=contact'));
    expect(res.status).toBe(400);
  });
});
