import Link from 'next/link';
import ChallengeSignupForm from '@/app/components/ChallengeSignupForm';

export default function ChallengeSalesPageContent() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-white rounded-2xl shadow-md mt-10">
      <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Ancient wisdom. Modern tools.</p>
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        The 30-Day Give-Every-Pound-A-Job Challenge
      </h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-8">
        Free, 30 daily actions, one method: zero-based / envelope budgeting. By Day 30 you&apos;ve built a
        working budget from scratch and lived on it for most of a month. No spreadsheet literacy assumed.
      </p>

      <div className="mb-10">
        <ChallengeSignupForm />
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">The four weeks</h2>
        <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700 leading-relaxed">
          <li>
            <strong>Week 1 — See it.</strong> Get honest about where money actually goes today.
          </li>
          <li>
            <strong>Week 2 — Name it.</strong> Give every pound a job, zero-based, before the month starts.
          </li>
          <li>
            <strong>Week 3 — Live it.</strong> Run the plan against real spending and adjust without guilt.
          </li>
          <li>
            <strong>Week 4 — Keep it.</strong> Build the habit that survives past day 30.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">What you get</h2>
        <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700 leading-relaxed">
          <li>One short daily email with that day&apos;s action — no app, no spreadsheet literacy required.</li>
          <li>The free budget worksheet, linked on Day 3.</li>
          <li>
            Want the full method with worked examples once you&apos;ve felt it work? The{' '}
            <Link href="/guide/give-every-pound-a-job/" className="text-blue-600 underline">
              Give Every Pound a Job
            </Link>{' '}
            guide goes deeper — £7, entirely optional.
          </li>
        </ul>
      </section>

      <section className="text-sm text-gray-500 space-y-2 border-t pt-6">
        <p>
          General information about budgeting, not financial advice. This challenge does not recommend any
          specific bank, app, savings product or investment.
        </p>
      </section>
    </div>
  );
}
