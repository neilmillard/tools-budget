import BuyButton from "@/app/components/BuyButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Checkout",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TestCheckout() {
  return (
    <div className="w-[83%] mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 text-center">
      <h1 className="text-2xl font-semibold mb-4">Test checkout</h1>
      <p className="mb-6">
        Not a real page — exercises the Stripe hosted-checkout flow end to end against the configured test key.
      </p>
      <BuyButton />
    </div>
  );
}
