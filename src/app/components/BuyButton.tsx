'use client';
import { useState } from 'react';

interface BuyButtonProps {
  // Overridable for tests — jsdom's window.location can't be reassigned directly.
  navigate?: (url: string) => void;
}

export default function BuyButton({ navigate = (url) => { window.location.href = url; } }: BuyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleClick() {
    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/checkout', { method: 'POST' });
      const data = (await response.json()) as { url?: string; message?: string };

      if (!response.ok || !data.url) {
        setError(data.message ?? 'Failed to start checkout. Please try again later.');
        setStatus('error');
        return;
      }

      navigate(data.url);
    } catch {
      setError('Failed to start checkout. Please try again later.');
      setStatus('error');
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === 'loading'}
        className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-60"
      >
        {status === 'loading' ? 'Redirecting…' : 'Buy the guide — £7'}
      </button>
      {status === 'error' && <p role="alert" className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}
