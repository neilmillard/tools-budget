import { isPreviewDeployment } from './contact';

interface Env {
  BREVO_API_KEY?: string;
  BREVO_CHALLENGE_LIST_ID?: string;
  CF_PAGES_BRANCH?: string;
}

interface PagesContext<E> {
  request: Request;
  env: E;
  params: Record<string, string | string[]>;
  data: Record<string, unknown>;
}

type PagesFunction<E> = (context: PagesContext<E>) => Response | Promise<Response>;

export interface ChallengeSignupBody {
  email: string;
  _gotcha?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// DEL-586: the challenge's only job is email capture into the Brevo list the
// Day 0-34 drip (docs/30-day-budgeting-challenge.md) runs against — so this
// calls the Contacts API, not the smtp/email endpoint contact.ts uses.
// updateEnabled lets a reader who signs up twice re-subscribe instead of 400ing.
export async function subscribeToChallenge(
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

  let body: ChallengeSignupBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  if (body._gotcha) {
    return Response.json({ message: "You're signed up. Check your inbox for Day 1." }, { status: 200 });
  }

  if (!body.email || !EMAIL_PATTERN.test(body.email)) {
    return Response.json({ message: 'A valid email address is required.' }, { status: 400 });
  }

  if (!env.BREVO_API_KEY || !env.BREVO_CHALLENGE_LIST_ID) {
    if (isPreviewDeployment(env)) {
      return Response.json({ message: 'Preview mode: not subscribed.' }, { status: 200 });
    }
    return Response.json({ message: 'Service unavailable.' }, { status: 503 });
  }

  const result = await subscribeToChallenge(body.email, env.BREVO_CHALLENGE_LIST_ID, env.BREVO_API_KEY);

  if (!result.ok) {
    return Response.json({ message: 'Failed to sign up. Please try again later.' }, { status: 500 });
  }

  return Response.json({ message: "You're signed up — Day 1 starts now. Check your inbox." }, { status: 200 });
};
