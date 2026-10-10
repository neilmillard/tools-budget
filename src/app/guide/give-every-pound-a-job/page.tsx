import { Metadata } from 'next';
import GuideSalesPageContent from '@/app/components/GuideSalesPageContent';

const TITLE = 'Give Every Pound a Job — A Budgeting Guide | Helpful Money';
const DESCRIPTION =
  "A zero-based/envelope budgeting guide: give every pound a job, handle bills that don't come every month, and a full worked example. £7, one-off.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: '/guide/give-every-pound-a-job/',
  },
};

export default function GiveEveryPoundAJobGuide() {
  return <GuideSalesPageContent />;
}
