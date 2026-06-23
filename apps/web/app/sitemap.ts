import type { MetadataRoute } from 'next';
import { blogArticles } from '@/lib/blog-articles';

export const dynamic = 'force-static';
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://tax.hubs.dpdns.org';
  const blogUrls: MetadataRoute.Sitemap = blogArticles.map((article) => ({
    url: `${base}/blogs/${article.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: `${base}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/income-tax`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/blogs`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/privacy`,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${base}/terms`,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${base}/copyright`,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${base}/continues`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...blogUrls,
  ];
}
