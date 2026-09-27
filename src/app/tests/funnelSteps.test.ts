import { FUNNEL_STEPS, buildBeaconUrl, isFunnelStep } from '@/lib/funnelSteps';

describe('buildBeaconUrl', () => {
  const apiUrl = '/api/funnel';

  it('posts to the same-origin funnel endpoint', () => {
    expect(buildBeaconUrl(apiUrl, 'form_visible', 'contact', '')).toBe(
      `${apiUrl}?step=form_visible&page=contact`
    );
  });

  it('puts the page in the query string so multiple instrumented pages stay separable', () => {
    expect(buildBeaconUrl(apiUrl, 'landing', 'calculator', '')).toBe(
      `${apiUrl}?step=landing&page=calculator`
    );
  });

  it('carries gclid through so paid visits are separable from organic', () => {
    expect(buildBeaconUrl(apiUrl, 'form_started', 'contact', '?gclid=ABC123')).toBe(
      `${apiUrl}?step=form_started&page=contact&gclid=ABC123`
    );
  });

  it('omits gclid when absent rather than emitting an empty one', () => {
    expect(buildBeaconUrl(apiUrl, 'form_submitted', 'contact', '?utm_source=x')).toBe(
      `${apiUrl}?step=form_submitted&page=contact`
    );
  });

  it('declares the four steps with landing first', () => {
    expect(FUNNEL_STEPS).toEqual(['landing', 'form_visible', 'form_started', 'form_submitted']);
  });
});

describe('isFunnelStep', () => {
  it('accepts each declared step', () => {
    for (const step of FUNNEL_STEPS) {
      expect(isFunnelStep(step)).toBe(true);
    }
  });

  it('rejects an unknown step', () => {
    expect(isFunnelStep('bogus')).toBe(false);
  });

  it('rejects a non-string value', () => {
    expect(isFunnelStep(undefined)).toBe(false);
  });
});
