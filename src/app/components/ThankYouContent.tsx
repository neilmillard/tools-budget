'use client';

export default function ThankYouContent() {
  const sessionId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('session_id') : null;

  return (
    <div className="w-[83%] mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 text-center">
      <h1 className="text-2xl font-semibold mb-4">Thank you!</h1>
      <p className="mb-2">Your payment was successful — a confirmation will be on its way shortly.</p>
      {sessionId && (
        <>
          <a
            href={`/api/download?session_id=${encodeURIComponent(sessionId)}`}
            className="inline-block mt-4 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold"
          >
            Download your guide
          </a>
          <p className="text-sm text-gray-500 mt-4">
            If the download doesn&apos;t work, email us at the address on the contact page and we&apos;ll sort it out.
          </p>
          <p className="text-sm text-gray-400 mt-2">Reference: {sessionId}</p>
        </>
      )}
    </div>
  );
}
