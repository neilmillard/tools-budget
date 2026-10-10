import Link from 'next/link';

const WORKSHEET_HREF = '/download/Give%20Every%20Pound%20a%20Job%20-%20Budget%20Worksheet.xlsx';

export default function WorksheetDownloadPageContent() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-white rounded-2xl shadow-md mt-10">
      <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Ancient wisdom. Modern tools.</p>
      <h1 className="text-3xl font-bold mb-4 text-gray-900">The Budget Worksheet</h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-8">
        A free, ready-made spreadsheet for zero-based / envelope budgeting: give every pound a job until
        there&apos;s nothing left to assign.
      </p>

      <div className="mb-10">
        <a
          href={WORKSHEET_HREF}
          className="inline-block px-6 py-3 rounded-lg bg-green-600 text-white font-semibold"
        >
          Download the worksheet — free
        </a>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">What&apos;s next</h2>
        <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700 leading-relaxed">
          <li>
            Want a daily nudge to actually use it? Try the{' '}
            <Link href="/challenge/give-every-pound-a-job/" className="text-blue-600 underline">
              30-day challenge
            </Link>{' '}
            — free.
          </li>
          <li>
            Want the full method with worked examples? The{' '}
            <Link href="/guide/give-every-pound-a-job/" className="text-blue-600 underline">
              Give Every Pound a Job
            </Link>{' '}
            guide goes deeper — £7, entirely optional.
          </li>
        </ul>
      </section>

      <section className="text-sm text-gray-500 space-y-2 border-t pt-6">
        <p>
          General information about budgeting, not financial advice. This worksheet does not recommend any
          specific bank, app, savings product or investment.
        </p>
      </section>
    </div>
  );
}
