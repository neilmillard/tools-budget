'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';

function subscribe(onChange: () => void) {
  window.addEventListener('consentUpdated', onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener('consentUpdated', onChange);
    window.removeEventListener('storage', onChange);
  };
}

export default function CookieBanner() {
  // Hidden during SSR; shown on the client until a choice has been stored.
  const showBanner = useSyncExternalStore(
    subscribe,
    () => !localStorage.getItem('tac_consent'),
    () => false,
  );

  const handleAccept = () => {
    localStorage.setItem('tac_consent', 'granted');
    window.dispatchEvent(new Event('consentUpdated'));
  };

  const handleDecline = () => {
    localStorage.setItem('tac_consent', 'denied');
    window.dispatchEvent(new Event('consentUpdated'));
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            We use cookies to enhance your experience and analyze site traffic.
            By clicking &quot;Accept&quot;, you consent to our use of cookies.{' '}
            <Link href="/privacy-policy/" className="underline hover:text-gray-300">
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm border border-white rounded hover:bg-gray-800 transition"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-[#8C4C8D] rounded hover:bg-[#7a3c7b] transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
