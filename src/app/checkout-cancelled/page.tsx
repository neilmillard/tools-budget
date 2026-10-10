import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout Cancelled",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutCancelled() {
  return (
    <div className="w-[83%] mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 text-center">
      <h1 className="text-2xl font-semibold mb-4">Checkout cancelled</h1>
      <p className="mb-6">No payment was taken. You can try again whenever you&apos;re ready.</p>
      <Link href="/test-checkout/" className="text-blue-600 underline">
        Back to checkout
      </Link>
    </div>
  );
}
