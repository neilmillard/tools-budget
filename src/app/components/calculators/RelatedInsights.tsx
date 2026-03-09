import React from 'react';
import Link from 'next/link';

interface RelatedPost {
  title: string;
  url: string;
}

interface RelatedInsightsProps {
  posts: RelatedPost[];
}

export default function RelatedInsights({ posts }: RelatedInsightsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="mr-2">💡</span> Why This Matters: Timeless Insights
      </h3>
      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post, index) => (
          <Link 
            key={index}
            href={post.url} 
            className="group block p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <h4 className="font-semibold text-blue-600 group-hover:text-blue-800 transition-colors mb-2">
              {post.title}
            </h4>
            <p className="text-sm text-gray-600">
              Discover the principles behind the numbers and how to apply them to your journey.
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
