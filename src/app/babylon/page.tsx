import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Babylon Series: Timeless Money Wisdom | Helpful Money",
  description: "Ancient Babylonian wisdom for modern financial success. Discover the Seven Cures for a Lean Purse and build your wealth.",
  alternates: {
    canonical: "/babylon/",
  },
};

export default function BabylonLanding() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-white rounded-2xl shadow-lg mt-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-amber-900 mb-6">The Babylon Series</h1>
        <p className="text-2xl text-amber-800 italic mb-8">
          "Timeless money wisdom, written 4,000 years ago — still true today"
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Ancient Babylon?</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            George S. Clason's 1926 classic, <span className="italic font-medium">The Richest Man in Babylon</span>, 
            is one of the most influential personal finance books ever written. 
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            By using parables set in ancient Babylon, it distills complex financial principles into simple, 
            memorable lessons that have helped millions of people gain control of their money.
          </p>
        </div>
        <div className="bg-amber-50 p-8 rounded-xl border border-amber-100 shadow-inner">
          <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">The Seven Cures</h3>
          <ul className="space-y-2 text-amber-900">
            <li>1. Start thy purse to fattening</li>
            <li>2. Control thy expenditures</li>
            <li>3. Make thy gold multiply</li>
            <li>4. Guard thy treasures from loss</li>
            <li>5. Make of thy dwelling a profitable investment</li>
            <li>6. Insure a future income</li>
            <li>7. Increase thy ability to earn</li>
          </ul>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ancient Wisdom, Modern Tools</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
          We've taken these seven timeless cures and mapped them directly to our 4-stage money journey. 
          Each lesson is paired with a modern tool to help you put the philosophy into immediate practice.
        </p>
        
        <div className="flex justify-center">
          <Link 
            href="/babylon/series/" 
            className="px-10 py-5 bg-amber-600 text-white text-xl font-bold rounded-full hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start the Series →
          </Link>
        </div>
      </div>

      <div className="border-t border-amber-100 pt-12">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommended for Beginners</h3>
          <p className="text-gray-600 mb-6 italic">
            "For a new visitor who feels overwhelmed by investing jargon, starting with ancient Babylonian 
            wisdom is far less intimidating than jumping straight into index funds."
          </p>
          <p className="text-amber-800 font-medium">
            Join the journey from the very beginning.
          </p>
        </div>
      </div>
    </div>
  );
}
