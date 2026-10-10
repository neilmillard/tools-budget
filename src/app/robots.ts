import { MetadataRoute } from 'next';

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/thank-you/', '/checkout-cancelled/'],
      },
      {
        // A crawler matching this named group ignores the `*` group above,
        // so the same disallow list needs repeating here.
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'Anthropic-AI', 'Claude-Web', 'CCBot'],
        allow: '/',
        disallow: ['/api/', '/thank-you/', '/checkout-cancelled/'],
      }
    ],
    sitemap: 'https://www.helpfulmoney.site/sitemap.xml',
  };
}
