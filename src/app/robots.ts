import { MetadataRoute } from 'next'

// Updated 2025-12-25 - Block _next/data and _rsc to fix Google indexing issues
// 20. 10. 2026 (SEO audit kola 6): /api/ zakázané – Seznam měl v indexu adresy /api/og?… (obrázky)
// a datová API (/api/etf/screener, /api/backtest) nejsou stránky. Výjimka /api/og: obrázky náhledů
// pro sociální sítě (og:image). Twitterbot robots.txt respektuje – bez výjimky by karty na X přišly
// o obrázek. Aby se /api/og samo neindexovalo, posílá X-Robots-Tag: noindex (next.config.ts).
// Kontrola: scripts/check-fund-data.mjs (blok kolo6 seo).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/og'],
        disallow: [
          '/private/',
          '/admin/',
          '/api/',
          '/_next/data/',  // Prevent duplicate JSON content
          '/*?_rsc=*',     // Block RSC parameter URLs
        ],
      },
    ],
    sitemap: 'https://etfpruvodce.cz/sitemap.xml',
  }
}
