'use client';

import Script from "next/script";
import {useEffect, useState} from "react";

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

export function GoogleTagManager(props: GTMParams) {
  const [consent, setConsent] = useState<string | null>(null);
  const { gtmId } = props;

  // Set the consent value from localStorage after the client loads
  // Assuming the answer is stored in localStorage called cookie
  useEffect(() => {
    setConsent(localStorage.getItem('tac_consent') === "granted" ? 'granted' : 'denied');
  }, [gtmId]);

  useEffect(() => {
    const handleConsentUpdated = () => {
      setConsent(localStorage.getItem('tac_consent') === "granted" ? 'granted' : 'denied');
    };
    window.addEventListener('consentUpdated', handleConsentUpdated);
    return () => {
      window.removeEventListener('consentUpdated', handleConsentUpdated);
    };
  }, []);

  // Initialise gtag with consent value
  useEffect(() => {
    if (consent === null) return;
    console.log("consent", consent);

    window.dataLayer = window.dataLayer || [];

    function gtag(
      command: 'js' | 'config' | 'consent',
      ...args: [Date] | [string, object] | ['default', object]
    ): void {
      window.dataLayer!.push([command, ...args] as unknown as GTMEvent);
    }
    gtag('consent', 'update', {
      'ad_storage': consent,
      'ad_user_data': consent,
      'ad_personalization': consent,
      'analytics_storage': consent
    })
  }, [consent, gtmId]);

  const gtmScriptUrl = 'https://www.googletagmanager.com/gtag/js';
  const gtmScript = `${gtmScriptUrl}?id=${gtmId}`

  return (
    <>
      <Script strategy="afterInteractive" src={gtmScript}/>
      <Script id="gtm-script" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() {window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {})
          gtag('config', '${gtmId}');
          `}
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
