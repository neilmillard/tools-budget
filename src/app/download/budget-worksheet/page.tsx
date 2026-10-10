import { Metadata } from 'next';
import WorksheetDownloadPageContent from '@/app/components/WorksheetDownloadPageContent';

const TITLE = 'Free Budget Worksheet | Helpful Money';
const DESCRIPTION =
  'A free, ready-made zero-based / envelope budgeting spreadsheet: give every pound a job until there’s nothing left to assign.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: '/download/budget-worksheet/',
  },
};

export default function BudgetWorksheetDownload() {
  return <WorksheetDownloadPageContent />;
}
