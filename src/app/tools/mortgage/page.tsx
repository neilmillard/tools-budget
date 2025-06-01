import MortgageCalculator from "@/app/components/calculators/MortgageCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Calculator | Helpful Money",
  description: "Calculate your monthly mortgage payments, total amount paid, and total interest over the term with our free mortgage calculator. Adjust property price, deposit, interest rate, and term.",
  openGraph: {
    title: "Mortgage Calculator | Helpful Money",
    description: "Calculate your monthly mortgage payments, total amount paid, and total interest over the term with our free mortgage calculator. Adjust property price, deposit, interest rate, and term.",
  },
};

export default function Mortgage() {
    return (
      <div>
          <MortgageCalculator />
      </div>
    )
}
