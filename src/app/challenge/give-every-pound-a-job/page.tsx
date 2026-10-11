import { Metadata } from 'next';
import ChallengeSalesPageContent from '@/app/components/ChallengeSalesPageContent';

const TITLE = 'The 30-Day Give-Every-Pound-A-Job Challenge | Helpful Money';
const DESCRIPTION =
  'A free 30-day zero-based/envelope budgeting challenge: one daily action, build a working budget from scratch and live on it for a month.';

const SHARE_IMAGE = '/images/give-every-pound-a-job-share.png';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.helpfulmoney.site/challenge/give-every-pound-a-job/',
    images: [SHARE_IMAGE],
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
    images: [SHARE_IMAGE],
  },
  alternates: {
    canonical: '/challenge/give-every-pound-a-job/',
  },
};

export default function GiveEveryPoundAJobChallenge() {
  return <ChallengeSalesPageContent />;
}
