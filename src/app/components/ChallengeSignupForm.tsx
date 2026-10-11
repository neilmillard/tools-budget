'use client';
import { useState } from 'react';

export default function ChallengeSignupForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const gotcha = new FormData(event.currentTarget).get('_gotcha');
    if (gotcha) return;

    setStatus('submitting');
    try {
      const response = await fetch('/api/challenge-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { message?: string };
      setMessage(data.message ?? '');
      setStatus(response.ok ? 'success' : 'error');
    } catch {
      setMessage('Failed to sign up. Please try again later.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
      <div>
        <label htmlFor="challenge-email" className="block mb-2 font-medium text-gray-800">
          Email address
        </label>
        <input
          type="email"
          id="challenge-email"
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
        className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-60"
      >
        {status === 'submitting' ? 'Starting…' : 'Start Day 1 — free'}
      </button>
      {status === 'success' && (
        <div className="mt-2 text-green-700" role="status">
          <p>{message}</p>
          <p className="mt-2">
            <strong>Day 1:</strong> Write down every pound you spent yesterday. No judgment, just the list.
          </p>
          <p className="mt-2">
            <a href="/download/Give Every Pound a Job - Budget Worksheet.xlsx" className="text-blue-600 underline">
              Download the free worksheet
            </a>
          </p>
        </div>
      )}
      {status === 'error' && (
        <p className="mt-2 text-red-600" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
