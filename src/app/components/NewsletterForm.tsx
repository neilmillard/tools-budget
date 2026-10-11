'use client';
import { useState } from 'react';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const gotcha = new FormData(event.currentTarget).get('_gotcha');
    if (gotcha) return;

    setStatus('submitting');
    try {
      const response = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { message?: string };
      setMessage(data.message ?? '');
      setStatus(response.ok ? 'success' : 'error');
    } catch {
      setMessage('Failed to subscribe. Please try again later.');
      setStatus('error');
    }
  }

  return (
    <div className="brevo-form-container bg-white p-6 rounded-2xl shadow-sm border border-blue-100 my-4">
      <p className="mb-4 font-medium text-gray-800">
        Subscribe to our newsletter and get the 4-Stage Money Checklist.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
        <div>
          <label htmlFor="newsletter-email" className="block mb-2 font-medium text-gray-800">
            Enter your email address to subscribe
          </label>
          <input
            type="email"
            id="newsletter-email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-md p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="px-6 py-3 rounded-lg bg-[#3E4857] text-white font-semibold disabled:opacity-60"
        >
          {status === 'submitting' ? 'Subscribing…' : 'Get the Checklist'}
        </button>
        {status === 'success' && (
          <p className="mt-2 text-green-700" role="status">
            {message}
          </p>
        )}
        {status === 'error' && (
          <p className="mt-2 text-red-600" role="alert">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default NewsletterForm;
