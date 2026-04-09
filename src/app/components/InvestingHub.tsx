'use client';

import React from 'react';
import Link from 'next/link';
import BenGrahamInvesting from "@/app/components/BenGrahamInvesting";

const sections = [
  {
    title: "Foundations",
    description: "The core principles that every investor must understand before buying their first asset.",
    posts: [
      { id: "taking-control-of-your-financial-future", title: "An Introduction to Smart Investing" },
      { id: "the-invisible-tax", title: "The Invisible Tax: Defeating Inflation" },
      { id: "the-forgotton-art-of-living-below-your-means", title: "Living Below Your Means" },
      { id: "freedom-through-discipline", title: "Eliminating Consumer Debt" }
    ]
  },
  {
    title: "Asset Classes",
    description: "The building blocks of a portfolio. Understand what you are buying and why.",
    posts: [
      { id: "owning-a-piece-of-the-future", title: "Stocks: Owning a Piece of the Future" },
      { id: "stability-and-income", title: "Bonds: The Role of Stability and Income" },
      { id: "building-wealth-through-property", title: "Real Estate Investing" },
      { id: "hard-assets-in-a-digital-age", title: "Commodities and Hard Assets" }
    ]
  },
  {
    title: "Strategy",
    description: "How to combine assets into a coherent, tax-efficient, and global portfolio.",
    posts: [
      { id: "beyond-borders", title: "Global Diversification" },
      { id: "the-art-of-balance", title: "Building a Diversified Portfolio" },
      { id: "keeping-what-you-earn", title: "Principles of Tax Efficiency" },
      { id: "protecting-your-progress", title: "Essential Risk Management" },
      { id: "profit-with-purpose", title: "Socially Responsible Investing" }
    ]
  },
  {
    title: "Mindset",
    description: "The psychological side of investing—often the difference between success and failure.",
    posts: [
      { id: "mastering-your-mind", title: "The Psychology of Investing" },
      { id: "beyond-the-numbers", title: "Defining Your Financial 'Why'" },
      { id: "beyond-your-lifetime", title: "Principles of Legacy and Long-Term Wealth" }
    ]
  }
];

const readingPath = [
  { id: "taking-control-of-your-financial-future", title: "1. Start Here: Smart Investing" },
  { id: "the-invisible-tax", title: "2. Defeating Inflation" },
  { id: "mastering-your-mind", title: "3. The Psychology of Investing" },
  { id: "owning-a-piece-of-the-future", title: "4. Understanding Stocks" },
  { id: "stability-and-income", title: "5. The Role of Bonds" },
  { id: "the-art-of-balance", title: "6. Building a Diversified Portfolio" }
];

export default function InvestingHub() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">Investing Resource Hub</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A curated reading path through the fundamental principles of wealth building. 
          No jargon, just timeless wisdom made actionable.
        </p>
      </div>

      {/* Recommended Reading Order / Start Here */}
      <section className="mb-20 bg-blue-50 border border-blue-100 rounded-2xl p-8 md:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Start Here: The Recommended Reading Path</h2>
            <p className="text-blue-800 opacity-80">Starting from zero? Follow this order to build your foundation correctly.</p>
          </div>
          <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
            6 Core Articles
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readingPath.map((post, index) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.id}/`}
              className="group bg-white p-6 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-blue-500 mb-2 block uppercase tracking-tighter">Step {index + 1}</span>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </div>
              <div className="mt-4 flex items-center text-blue-600 font-medium text-sm">
                Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Thematic Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <span className="w-8 h-1 bg-blue-600 mr-3 inline-block"></span>
                {section.title}
              </h2>
              <p className="text-gray-600">{section.description}</p>
            </div>
            <ul className="space-y-4 flex-grow">
              {section.posts.map((post) => (
                <li key={post.id}>
                  <Link 
                    href={`/blog/${post.id}/`}
                    className="group block p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all"
                  >
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                      {post.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Ben Graham Wisdom Section */}
      <section className="mt-24 pt-16 border-t border-gray-200">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Timeless Investing Wisdom</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Deep dive into the core principles of value investing from the father of security analysis, Benjamin Graham.
          </p>
        </div>
        <div className="bg-red-50 p-1 md:p-8 rounded-2xl border border-red-100 shadow-inner">
           <BenGrahamInvesting />
        </div>
      </section>

      <div className="mt-20 text-center">
        <Link 
          href="/blog/newest/" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Explore All Blog Posts
        </Link>
      </div>
    </div>
  );
}
