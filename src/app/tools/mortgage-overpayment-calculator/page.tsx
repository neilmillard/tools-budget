import MortgageOverpaymentCalculator from "@/app/components/calculators/MortgageOverpaymentCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Overpayment Calculator | Helpful Money",
  description: "Calculate how much time and interest you can save by making overpayments on your mortgage. See the impact of monthly and one-off overpayments on your mortgage term.",
  openGraph: {
    title: "Mortgage Overpayment Calculator | Helpful Money",
    description: "Calculate how much time and interest you can save by making overpayments on your mortgage. See the impact of monthly and one-off overpayments on your mortgage term.",
  },
};

export default function Mortgage() {
  return (
    <div>
      <MortgageOverpaymentCalculator />
    </div>
  )
}
