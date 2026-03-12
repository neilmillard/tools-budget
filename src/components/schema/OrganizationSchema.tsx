import React from 'react';

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Helpful Money",
    "url": "https://www.helpfulmoney.site",
    "logo": "https://www.helpfulmoney.site/logo.png", // Assuming logo exists or will exist
    "sameAs": [
      "https://twitter.com/neil_millard",
      "https://github.com/neilmillard",
      "https://www.facebook.com/neil.millard/",
      "https://www.youtube.com/channel/UCAaoh3jk1qtvD3ALPp48_8w"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": "https://www.helpfulmoney.site/contact/"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
