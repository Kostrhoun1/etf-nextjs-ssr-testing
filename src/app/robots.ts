import { MetadataRoute } from 'next'

// Updated 2025-12-25 - Block _next/data and _rsc to fix Google indexing issues
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/private/',
          '/admin/',
          '/_next/data/',  // Prevent duplicate JSON content
          '/*?_rsc=*',     // Block RSC parameter URLs
        ],
      },
    ],
    sitemap: 'https://www.etfpruvodce.cz/sitemap.xml',
  }
}