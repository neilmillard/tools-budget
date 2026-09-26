'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { sendFunnelBeacon, type FunnelStep } from '@/lib/funnelSteps';

interface ContactFormProps {
  siteEmail: string;
}

export default function ContactForm(props: ContactFormProps) {
  const {siteEmail} = props;
  const api = '/api/contact';
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const sentSteps = useRef(new Set<FunnelStep>());

  // DEL-519: mirrors confident-contractor.co.uk's ContactForm (DEL-482).
  // Each step fires at most once per page view.
  const reportStep = useCallback((step: FunnelStep) => {
    if (sentSteps.current.has(step)) return;
    sentSteps.current.add(step);
    sendFunnelBeacon('/api/funnel', step, 'contact');
  }, []);

  useEffect(() => {
    reportStep('landing');
  }, [reportStep]);

  useEffect(() => {
    const form = formRef.current;
    if (!form || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reportStep('form_visible');
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, [reportStep]);

  return (
    <>
    <div className="w-[83%] mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <div className="flex flex-wrap">
        <div className="w-full h-full lg:w-1/2 mt-8 lg:mt-0">
          <address className="not-italic p-3">
            Neil Millard c/o Delta Famiglia Limited<br/>
            The Stable<br/>
            3-6 Wadham Street<br/>
            Weston-super-Mare<br/>
            BS23 1JY
          </address>
        </div>
      </div>
    </div>
    <div className="w-[83%] mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
        <form
          ref={formRef}
          action={api}
          method="post"
          className="space-y-4"
          onFocusCapture={() => reportStep('form_started')}
          onSubmit={async (e) => {
            e.preventDefault();
            reportStep('form_submitted');
            setFormStatus('submitting');

            const formData = new FormData(e.currentTarget);
            const formValues = Object.fromEntries(formData.entries());

            try {
              const response = await fetch(api, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
              });

              if (response.ok) {
                const data = await response.json();
                setResponseMessage(data.message);
                setFormStatus('success');
              } else {
                setResponseMessage('An error occurred. Please try again later.');
                setFormStatus('error');
              }
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
              setResponseMessage('An error occurred. Please try again later.');
              setFormStatus('error');
            }
          }}
        >
          <input
            type="hidden"
            name="siteEmail"
            value={siteEmail}
          />
          <input
            type="text"
            name="_gotcha"
            style={{display: 'none'}}
          />

          <div><p>Send a message:</p></div>
          <div>
            <label htmlFor="name" className="block mb-2">
              Your Name (required)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full max-w-md p-2 border rounded"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2">
              Your Email (required)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full max-w-md p-2 border rounded"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={10}
              className="w-full max-w-md p-2 border rounded"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              disabled={formStatus === 'submitting'}
            >
              {formStatus === 'submitting' ? 'Sending...' : 'Send'}
            </button>

            {formStatus === 'success' && (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
                {responseMessage}
              </div>
            )}

            {formStatus === 'error' && (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
                {responseMessage}
              </div>
            )}
          </div>
        </form>
      </div>

    </div>
      </>
  );
}
