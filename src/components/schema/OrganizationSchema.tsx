import React from 'react';

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Helpful Money",
    "url": "https://www.helpfulmoney.site",
    "sameAs": [
      "https://www.linkedin.com/in/neilmillard/",
      "https://twitter.com/neil_millard",
      "https://github.com/neilmillard",
      "https://www.facebook.com/neil.millard/",
      "https://www.youtube.com/channel/UCAaoh3jk1qtvD3ALPp48_8w",
      "https://neilmillard.com",
      "https://devops-answers.com",
      "https://www.confident-contractor.co.uk"
    ],
    "founder": {
      "@type": "Person",
      "name": "Neil Millard",
      "url": "https://neilmillard.com"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": "https://www.helpfulmoney.site/contact/"
    },
    "knowsAbout": ["Debt", "Saving", "Buying a Home", "Investing"],
    "talksAbout": ["Weekly personal finance blog"]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
