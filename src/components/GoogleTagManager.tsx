'use client';

import Script from "next/script";
import {useEffect} from "react";
import {queueGtag} from "@/lib/analytics";

type DataLayerArray = GTMEvent[];

declare global {
  interface Window {
    dataLayer?: DataLayerArray;
    [key: string]: DataLayerArray | undefined;
  }
}

export type GTMParams = {
  gtmId: string;
};

type ConsentState = 'granted' | 'denied';

const CONSENT_SIGNALS = ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'] as const;

function consentParams(state: ConsentState): Record<string, ConsentState> {
  return Object.fromEntries(CONSENT_SIGNALS.map((signal) => [signal, state]));
}

// Runs before gtag config: everything denied until the visitor chooses,
// then granted straight away if they accepted on an earlier visit.
export function gtagInitScript(gtmId: string): string {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag() {window.dataLayer.push(arguments);}
    gtag('consent', 'default', ${JSON.stringify({ ...consentParams('denied'), wait_for_update: 500 })});
    try {
      if (localStorage.getItem('tac_consent') === 'granted') {
        gtag('consent', 'update', ${JSON.stringify(consentParams('granted'))});
      }
    } catch (e) {}
    gtag('js', new Date());
    gtag('config', ${JSON.stringify(gtmId)});
  `;
}

function applyStoredConsent(): void {
  const state: ConsentState = localStorage.getItem('tac_consent') === 'granted' ? 'granted' : 'denied';
  const send = typeof window.gtag === 'function' ? window.gtag : queueGtag;
  send('consent', 'update', consentParams(state));
}

export function GoogleTagManager(props: GTMParams) {
  const { gtmId } = props;

  // The stored choice is applied by the init script; this handles the banner.
  useEffect(() => {
    window.addEventListener('consentUpdated', applyStoredConsent);
    return () => {
      window.removeEventListener('consentUpdated', applyStoredConsent);
    };
  }, []);

  const gtmScriptUrl = 'https://www.googletagmanager.com/gtag/js';
  const gtmScript = `${gtmScriptUrl}?id=${gtmId}`

  return (
    <>
      <Script strategy="afterInteractive" src={gtmScript} async/>
      <Script id="gtm-script" strategy="afterInteractive">
        {gtagInitScript(gtmId)}
      </Script>
    </>
  )
}

interface GTMEvent {
  event: string;
  [key: string]: string | number | boolean | undefined;
}

export const sendGTMEvent = (data: GTMEvent) => {
  // special case if we are sending events before GTM init and we have custom dataLayerName
  const dataLayer: string = 'dataLayer';
  // define dataLayer so we can still queue up events before GTM init
  if (!window[dataLayer]) {
    window[dataLayer] = [];
  }
  window[dataLayer].push(data);
};
