import React from 'react';

interface ContactFormProps {
  siteEmail: string;
}

export default function ContactForm(props: ContactFormProps) {
  const {siteEmail} = props;
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
          action={`https://formspree.io/${siteEmail}`}
          method="post"
          className="space-y-4"
        >
          <input
            type="hidden"
            name="_next"
            value={`/thanks/`}
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
              name="_replyto"
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

          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>

    </div>
      </>
  );
}
