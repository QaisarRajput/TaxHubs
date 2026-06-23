import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Tax Hubs - Income Tax Calculator',
    short_name: 'Tax Hubs',
    description:
      'Install Tax Hubs for a fast, app-like income tax calculator with slab-wise results and country/year support.',
    start_url: '/income-tax',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0A2313',
    theme_color: '#22C55E',
    categories: ['finance', 'productivity', 'utilities'],
    icons: [
      {
        src: '/assets/brand/pwa/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/brand/pwa/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/brand/pwa/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/assets/brand/pwa/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Open Calculator',
        short_name: 'Calculator',
        description: 'Go directly to income tax calculator',
        url: '/income-tax',
      },
      {
        name: 'Read Blogs',
        short_name: 'Blogs',
        description: 'Open tax guides and filing blogs',
        url: '/blogs',
      },
    ],
  };
}
