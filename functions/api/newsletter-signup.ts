import { isPreviewDeployment } from './contact';

interface Env {
  BREVO_API_KEY?: string;
  BREVO_NEWSLETTER_LIST_ID?: string;
  CF_PAGES_BRANCH?: string;
}

interface PagesContext<E> {
  request: Request;
  env: E;
  params: Record<string, string | string[]>;
  data: Record<string, unknown>;
}

type PagesFunction<E> = (context: PagesContext<E>) => Response | Promise<Response>;

export interface NewsletterSignupBody {
  email: string;
  _gotcha?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// DEL-608: replaces the Brevo-hosted sibforms.com embed in NewsletterForm.tsx
// so the destination list is visible and configurable from this repo, same
// as challenge-signup.ts's subscribeToChallenge. Uses the Contacts API, not
// the smtp/email endpoint contact.ts uses, because this is a list
// subscription, not a one-off send. updateEnabled lets a reader who signs up
// twice re-subscribe instead of 400ing.
export async function subscribeToNewsletter(
  email: string,
  listId: string,
  apiKey: string
): Promise<{ ok: boolean }> {
  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, listIds: [Number(listId)], updateEnabled: true }),
  });

  return { ok: response.ok };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  let body: NewsletterSignupBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  if (body._gotcha) {
    return Response.json({ message: 'Subscribed.' }, { status: 200 });
  }

  if (!body.email || !EMAIL_PATTERN.test(body.email)) {
    return Response.json({ message: 'A valid email address is required.' }, { status: 400 });
  }

  if (!env.BREVO_API_KEY || !env.BREVO_NEWSLETTER_LIST_ID) {
    if (isPreviewDeployment(env)) {
      return Response.json({ message: 'Preview mode: not subscribed.' }, { status: 200 });
    }
    return Response.json({ message: 'Service unavailable.' }, { status: 503 });
  }

  const result = await subscribeToNewsletter(body.email, env.BREVO_NEWSLETTER_LIST_ID, env.BREVO_API_KEY);

  if (!result.ok) {
    return Response.json({ message: 'Failed to subscribe. Please try again later.' }, { status: 500 });
  }

  return Response.json({ message: "You're subscribed. Check your inbox for the checklist." }, { status: 200 });
};
