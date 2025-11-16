import { MetadataRoute } from 'next'

// Force recrawl - Updated 2025-11-16 - Canonical URL fix deployed
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'],
    },
    sitemap: 'https://www.etfpruvodce.cz/sitemap.xml',
  }
}