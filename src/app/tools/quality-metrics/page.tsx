import QualityMetricsDashboard from "@/app/components/calculators/QualityMetricsDashboard";
import { Metadata } from "next";
import SoftwareApplicationSchema from "@/components/schema/SoftwareApplicationSchema";

export const metadata: Metadata = {
  title: "Quality Company Metrics Dashboard | Helpful Money",
  description: "Screen companies against Fundsmith-style quality metrics. Analyze ROCE, Gross Margin, FCF Growth, and more for high-quality compounding businesses.",
  openGraph: {
    title: "Quality Company Metrics Dashboard | Helpful Money",
    description: "Screen companies against Fundsmith-style quality metrics. Analyze ROCE, Gross Margin, FCF Growth, and more for high-quality compounding businesses.",
  },
  alternates: {
    canonical: "/tools/quality-metrics/",
  },
};

export default function QualityMetricsPage() {
    return (
      <>
          <SoftwareApplicationSchema 
              name="Quality Company Metrics Dashboard"
              description="Screen companies against Fundsmith-style quality metrics including ROCE, Gross Margin, and Cash Conversion."
              url="https://www.helpfulmoney.site/tools/quality-metrics/"
              applicationCategory="FinanceApplication"
          />
          <main className="min-h-screen bg-slate-50/50">
            <QualityMetricsDashboard />
          </main>
      </>
    )
}
