import Link from 'next/link';
import BuyButton from '@/app/components/BuyButton';

const WORKSHEET_HREF = '/download/Give%20Every%20Pound%20a%20Job%20-%20Budget%20Worksheet.xlsx';

export default function GuideSalesPageContent() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-white rounded-2xl shadow-md mt-10">
      <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Ancient wisdom. Modern tools.</p>
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        Give Every Pound a Job: a budgeting method you can start this month
      </h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-8">
        Most budgets fail because money with no plan drifts away. This guide shows you one simple method:
        before the month starts, give every pound of your take-home pay a job, until there&apos;s nothing
        left to assign.
      </p>

      <div className="mb-10">
        <BuyButton />
        <p className="text-sm text-gray-500 mt-2">
          Secure payment by Stripe. You&apos;ll get the download link straight after paying, and your
          receipt by email.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">What you get</h2>
        <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700 leading-relaxed">
          <li>
            <strong>The guide</strong> (a PDF, 15–20 minute read): zero-based/envelope budgeting step by step, how
            to handle bills that don&apos;t come every month, what to do when a category runs over, and a
            full worked example you can copy row by row.
          </li>
          <li>
            Pairs with Helpful Money&apos;s{' '}
            <a href={WORKSHEET_HREF} className="text-blue-600 underline">
              free budget worksheet
            </a>{' '}
            — a ready-made spreadsheet with the same categories as the guide&apos;s worked example, so you
            can start straight away.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Who it&apos;s for</h2>
        <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700 leading-relaxed">
          <li>You get paid monthly and the money is gone before the next payday.</li>
          <li>You&apos;ve tried budgeting apps and want a method you actually understand.</li>
        </ul>
      </section>

      <section className="mb-10">
        <p className="text-lg text-gray-700 leading-relaxed">
          Not ready to buy yet? Try the free{' '}
          <Link href="/challenge/give-every-pound-a-job/" className="text-blue-600 underline">
            30-day budgeting challenge
          </Link>{' '}
          first.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Who it&apos;s not for</h2>
        <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700 leading-relaxed">
          <li>
            You need debt advice. For free, impartial help, see{' '}
            <a
              href="https://www.moneyhelper.org.uk/"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MoneyHelper
            </a>
            .
          </li>
          <li>You want investment or product recommendations. This guide doesn&apos;t make any.</li>
        </ul>
      </section>

      <div className="mb-10">
        <BuyButton />
      </div>

      <section className="text-sm text-gray-500 space-y-2 border-t pt-6">
        <p>
          This is an instant digital download. Because the file unlocks immediately, we don&apos;t offer
          refunds once the guide has been downloaded. Haven&apos;t downloaded it, or hit a technical
          issue? Email us via the{' '}
          <Link href="/contact/" className="text-blue-600 underline">
            contact page
          </Link>{' '}
          within 7 days of purchase and we&apos;ll sort it out.
        </p>
        <p>
          General information about budgeting, not financial advice. This guide does not recommend any
          specific bank, app, savings product or investment.
        </p>
      </section>
    </div>
  );
}
