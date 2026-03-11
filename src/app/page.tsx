import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import { ChevronRight, Calculator, BookOpen, Map, Mail } from 'lucide-react';
import { journeySteps } from '@/app/journey/_components/JourneyNavigation';

export const metadata: Metadata = {
  title: "Helpful Money | Financial Tools to Manage Your Money Better",
  description: "Discover free financial tools including budget planner, mortgage calculator, pension calculator, and more to help you make smarter money decisions.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Helpful Money</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We combine ancient financial wisdom with modern tools to help you build a life of financial freedom and peace.
        </p>
      </div>

      {/* The Journey Section */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <Map size={24} />
          </div>
          <h2 className="text-3xl font-bold">1. Follow the Journey</h2>
        </div>
        <p className="text-lg text-gray-700 mb-8">
          Most financial advice is overwhelming because it's out of order. We've structured everything into four simple stages. Start where you are.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {journeySteps.map((step) => (
            <div key={step.number} className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: step.color }}>
                  {step.number}
                </div>
                <h3 className="text-xl font-bold">{step.titleTop} {step.titleBottom}</h3>
              </div>
              <div className="text-gray-600 mb-6 min-h-12">
                <p>
                    {step.description.split(/\[(.*?)]\((.*?)\)/).map((part, i) => {
                        if (i % 3 === 1) {
                            const href = step.description.split(/\[(.*?)]\((.*?)\)/)[i+1];
                            return (
                                <a key={i} href={href} className="text-blue-600 hover:underline font-medium">
                                    {part}
                                </a>
                            );
                        }
                        if (i % 3 === 2) return null;
                        return part;
                    })}
                </p>
              </div>
              <Link 
                href={step.href} 
                className="inline-flex items-center text-blue-600 font-semibold hover:gap-2 transition-all"
              >
                Explore Stage {step.number} <ChevronRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* The Wisdom Section */}
      <section className="mb-20 bg-amber-50 rounded-3xl p-8 md:p-12 border border-amber-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-amber-100 p-3 rounded-lg text-amber-600">
            <BookOpen size={24} />
          </div>
          <h2 className="text-3xl font-bold text-amber-900">2. Master the Basics</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-amber-900/80 mb-6 italic">
              "A part of all you earn is yours to keep. It should be not less than a tenth no matter how little you earn."
            </p>
            <p className="text-gray-700 mb-8">
              Based on the 1926 classic <i>The Richest Man in Babylon</i>, our Babylon Series translates ancient principles into modern actions. If you're new to personal finance, this is the best place to start.
            </p>
            <Link 
              href="/babylon/" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl"
            >
              Read the 7 Cures <ChevronRight size={18} />
            </Link>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-inner border border-amber-100/50">
            <h4 className="font-bold text-amber-900 mb-4 uppercase tracking-wider text-sm">Top Wisdom Articles</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/blog/the-forgotton-art-of-living-below-your-means/" className="group flex justify-between items-center hover:text-amber-700">
                  <span>Living Below Your Means</span>
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/blog/freedom-through-discipline/" className="group flex justify-between items-center hover:text-amber-700">
                  <span>Eliminating Consumer Debt</span>
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/blog/your-financial-safety-net/" className="group flex justify-between items-center hover:text-amber-700">
                  <span>Building an Emergency Fund</span>
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* The Tools Section */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <Calculator size={24} />
          </div>
          <h2 className="text-3xl font-bold">3. Use the Tools</h2>
        </div>
        <p className="text-lg text-gray-700 mb-8">
          We build our own software to help you visualize your progress. All our tools are free and privacy-focused.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/tools/budget/" className="p-4 border rounded-xl hover:border-green-300 hover:bg-green-50 transition-all">
            <h4 className="font-bold mb-1">Budget Planner</h4>
            <p className="text-sm text-gray-500">Master the 50/30/20 rule.</p>
          </Link>
          <Link href="/tools/mortgage-overpayment-calculator/" className="p-4 border rounded-xl hover:border-green-300 hover:bg-green-50 transition-all">
            <h4 className="font-bold mb-1">Mortgage Payoff</h4>
            <p className="text-sm text-gray-500">Save thousands in interest.</p>
          </Link>
          <Link href="/tools/pension/" className="p-4 border rounded-xl hover:border-green-300 hover:bg-green-50 transition-all">
            <h4 className="font-bold mb-1">Pension Planner</h4>
            <p className="text-sm text-gray-500">Retire with confidence.</p>
          </Link>
          <Link href="/tools/afford/" className="p-4 border rounded-xl hover:border-green-300 hover:bg-green-50 transition-all">
            <h4 className="font-bold mb-1">Affordability</h4>
            <p className="text-sm text-gray-500">Know what you can buy.</p>
          </Link>
          <Link href="/tools/mortgage/" className="p-4 border rounded-xl hover:border-green-300 hover:bg-green-50 transition-all">
            <h4 className="font-bold mb-1">Basic Mortgage</h4>
            <p className="text-sm text-gray-500">Simple monthly payment check.</p>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center p-12 bg-blue-600 rounded-3xl text-white">
        <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Mail size={32} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
          We're building a new kind of budgeting app to help you automate these principles. Join our survey and be the first to know when we launch.
        </p>
        <div data-tf-live="01JTDAGBS12DNVW9YS48YXE667"></div>
        <Script async src="//embed.typeform.com/next/embed.js" strategy="afterInteractive" />
      </section>
    </div>
  );
}
