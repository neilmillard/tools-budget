import { Metadata } from 'next';
import ChallengeSalesPageContent from '@/app/components/ChallengeSalesPageContent';

const TITLE = 'The 30-Day Give-Every-Pound-A-Job Challenge | Helpful Money';
const DESCRIPTION =
  'A free 30-day zero-based/envelope budgeting challenge: one daily action, build a working budget from scratch and live on it for a month.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: '/challenge/give-every-pound-a-job/',
  },
};

export default function GiveEveryPoundAJobChallenge() {
  return <ChallengeSalesPageContent />;
}
