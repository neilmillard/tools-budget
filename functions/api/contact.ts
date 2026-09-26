interface Env {
  BREVO_API_KEY?: string;
  CF_PAGES_BRANCH?: string;
}

export function isPreviewDeployment(env: Env): boolean {
  return env.CF_PAGES_BRANCH !== 'main';
}

interface PagesContext<E> {
  request: Request;
  env: E;
  params: Record<string, string | string[]>;
  data: Record<string, unknown>;
}

type PagesFunction<E> = (context: PagesContext<E>) => Response | Promise<Response>;

export interface ContactFormBody {
  name: string;
  email: string;
  message: string;
  _gotcha?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ContactForm.tsx submits JSON from JavaScript. A raw form post only happens
// when JS never ran, and in practice that is bot spam, so it is never emailed;
// the sender gets a page pointing them at the address on the site instead.
const NO_JS_REPLY = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Message not sent</title></head>
<body><p>Sorry, we couldn't send your message from this form.</p>
<p>Please use the email address on the page, or enable JavaScript and try again.</p>
<p><a href="/contact/">Back to the contact page</a></p></body></html>`;

function logDropped(reason: string, senderIp: string): void {
  console.log({ event: 'contact_dropped', reason, senderIp });
}

export async function sendContactEmail(
  body: ContactFormBody,
  senderIp: string,
  apiKey: string
): Promise<{ ok: boolean; message: string }> {
  if (!body.name || !body.email || !body.message) {
    return { ok: false, message: 'Name, email and message are required.' };
  }

  const emailBody = {
    sender: { name: 'Helpful Money Website', email: 'neil@deltafamiglia.com' },
    to: [{ name: 'Neil Millard', email: 'neil@deltafamiglia.com' }],
    replyTo: { name: body.name, email: body.email },
    subject: `Contact form: ${body.name}`,
    htmlContent: `
      <p><strong>From:</strong> ${escapeHtml(body.name)} &lt;${escapeHtml(body.email)}&gt;</p>
      <p><strong>Sender IP:</strong> ${escapeHtml(senderIp)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(body.message).replace(/\n/g, '<br>')}</p>
    `,
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailBody),
  });

  if (!response.ok) {
    return { ok: false, message: 'Failed to send email. Please try again later.' };
  }

  return { ok: true, message: 'Thank you for your message. We will be in touch soon.' };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const senderIp = request.headers.get('CF-Connecting-IP') ?? 'unknown';

  if (!(request.headers.get('Content-Type') ?? '').includes('application/json')) {
    logDropped('no_js_form_post', senderIp);
    return new Response(NO_JS_REPLY, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  let body: ContactFormBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  if (body._gotcha) {
    logDropped('honeypot', senderIp);
    return Response.json({ message: 'Thank you for your message. We will be in touch soon.' }, { status: 200 });
  }

  if (!env.BREVO_API_KEY) {
    if (isPreviewDeployment(env)) {
      return Response.json({ message: 'Preview mode: email not sent.' }, { status: 200 });
    }
    return Response.json({ message: 'Service unavailable.' }, { status: 503 });
  }

  const result = await sendContactEmail(body, senderIp, env.BREVO_API_KEY);

  return Response.json({ message: result.message }, { status: result.ok ? 200 : 500 });
};
