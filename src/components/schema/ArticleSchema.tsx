import React from 'react';

interface ArticleSchemaProps {
  headline: string;
  description?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
}

export default function ArticleSchema({
  headline,
  description,
  datePublished,
  dateModified,
  author,
  url,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    ...(description ? { "description": description } : {}),
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Helpful Money",
      "url": "https://www.helpfulmoney.site",
    },
    "url": url,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
