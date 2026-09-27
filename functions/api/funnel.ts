import { isFunnelStep } from '../../src/lib/funnelSteps';

interface PagesContext<E> {
  request: Request;
  env: E;
  params: Record<string, string | string[]>;
  data: Record<string, unknown>;
}

type PagesFunction<E> = (context: PagesContext<E>) => Response | Promise<Response>;

// DEL-519: same-origin counterpart of confident-contractor.co.uk's
// worker-api/src/routes/funnel.ts (DEL-482). Deliberately stateless — the
// Workers Logs line is the record, so the step and any click id ride in the
// query string (see src/lib/funnelSteps.ts) rather than a stored row.
export const onRequestPost: PagesFunction<Record<string, never>> = async (context) => {
  const step = new URL(context.request.url).searchParams.get('step');
  if (!isFunnelStep(step)) {
    return Response.json({ message: 'Unknown funnel step.' }, { status: 400 });
  }
  return new Response(null, { status: 204 });
};
