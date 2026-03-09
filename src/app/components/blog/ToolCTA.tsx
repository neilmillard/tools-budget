import React from 'react';
import Link from 'next/link';

interface ToolCTAProps {
  title: string;
  toolName: string;
  toolUrl: string;
  description: string;
}

export default function ToolCTA({ title, toolName, toolUrl, description }: ToolCTAProps) {
  return (
    <div className="my-8 p-6 bg-blue-50 border border-blue-100 rounded-xl shadow-sm transition-all hover:shadow-md">
      <h3 className="text-xl font-bold text-blue-900 mb-2">{title}</h3>
      <p className="text-blue-800 mb-4">{description}</p>
      <Link 
        href={toolUrl}
        className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try the {toolName}
      </Link>
    </div>
  );
}
