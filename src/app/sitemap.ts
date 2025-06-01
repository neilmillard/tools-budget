import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.helpfulmoney.site';

  // Define all static routes
  const routes = [
    '',
    '/about',
    '/babylon',
    '/blog',
    '/blog/newest',
    '/blog/oldest',
    '/contact',
    '/fiftythirtytwenty',
    '/investing',
    '/tools/afford',
    '/tools/budget',
    '/tools/mortgage',
    '/tools/mortgage-overpayment-calculator',
    '/tools/pension',
  ];

  // Create sitemap entries for static routes
  const staticRoutes = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Get all blog posts and add them to the sitemap
  const blogPosts = getAllBlogPosts();
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
