import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'anthropic-ai',
          'ClaudeBot',
          'Google-Extended',
          'PerplexityBot',
          'Bytespider',
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://tax.hubs.dpdns.org/sitemap.xml',
    host: 'https://tax.hubs.dpdns.org',
  };
}
