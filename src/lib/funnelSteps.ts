// DEL-519: mirrors confident-contractor.co.uk's frontend/lib/funnelSteps.ts
// (DEL-482) and executor-clock's lib/funnelSteps.ts (DEL-480). "landing"
// fires unconditionally on mount and must stay first — it is the only step
// not gated on the visitor doing something, and without it a visit that
// emits nothing at all is indistinguishable from a beacon that never fired.
export const FUNNEL_STEPS = ['landing', 'form_visible', 'form_started', 'form_submitted'] as const;

export type FunnelStep = (typeof FUNNEL_STEPS)[number];

export function isFunnelStep(value: unknown): value is FunnelStep {
  return typeof value === 'string' && (FUNNEL_STEPS as readonly string[]).includes(value);
}

// Unlike confident-contractor.co.uk (a static export posting cross-origin to
// a separate API worker), this site has its own same-origin Pages Function
// at /api/funnel, so apiUrl is a relative path, not another origin. `page` is
// required, not optional: every instrumented page posts the same four step
// names to the same endpoint, so without it two pages' "landing" steps are
// indistinguishable at read time. gclid rides along so paid traffic can be
// separated from organic at read time.
export function buildBeaconUrl(apiUrl: string, step: FunnelStep, page: string, search: string): string {
  const gclid = new URLSearchParams(search).get('gclid');
  const params = new URLSearchParams({ step, page });
  if (gclid) {
    params.set('gclid', gclid);
  }
  return `${apiUrl}?${params.toString()}`;
}

// Fire-and-forget: sendBeacon with a fetch(keepalive) fallback, and a
// deliberately swallowed rejection — a measurement must never be able to
// break the contact flow it exists to explain.
export function sendFunnelBeacon(apiUrl: string, step: FunnelStep, page: string): void {
  if (typeof window === 'undefined') return;
  const url = buildBeaconUrl(apiUrl, step, page, window.location.search);
  if (navigator.sendBeacon?.(url)) return;
  if (typeof fetch !== 'function') return;
  void fetch(url, { method: 'POST', keepalive: true }).catch(() => {});
}
