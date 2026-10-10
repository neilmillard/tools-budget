'use client';

export default function ThankYouContent() {
  const sessionId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('session_id') : null;

  return (
    <div className="w-[83%] mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 text-center">
      <h1 className="text-2xl font-semibold mb-4">Thank you!</h1>
      <p className="mb-2">Your payment was successful — a confirmation will be on its way shortly.</p>
      {sessionId && <p className="text-sm text-gray-500 mt-4">Reference: {sessionId}</p>}
    </div>
  );
}
