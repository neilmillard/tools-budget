import AffordabilityCalculator from "@/app/components/calculators/AffordabilityCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Affordability Calculator | Helpful Money",
  description: "Calculate how much house you can afford based on your income, deposit, and expenses. See estimated affordable house prices and monthly mortgage payments.",
  openGraph: {
    title: "Mortgage Affordability Calculator | Helpful Money",
    description: "Calculate how much house you can afford based on your income, deposit, and expenses. See estimated affordable house prices and monthly mortgage payments.",
  },
};

export default function Afford() {
    return (
        <AffordabilityCalculator />
    )
}
