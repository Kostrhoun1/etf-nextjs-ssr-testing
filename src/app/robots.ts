import { MetadataRoute } from 'next'

// Updated 2025-12-25 - Block _next/data and _rsc to fix Google indexing issues
// 20. 10. 2026 (SEO audit kola 6): /api/ zakázané – Seznam měl v indexu adresy /api/og?… (obrázky)
// a datová API (/api/etf/screener, /api/backtest) nejsou stránky. Výjimka /api/og: obrázky náhledů
// pro sociální sítě (og:image). Twitterbot robots.txt respektuje – bez výjimky by karty na X přišly
// o obrázek. Aby se /api/og samo neindexovalo, posílá X-Robots-Tag: noindex (next.config.ts).
// Kontrola: scripts/check-fund-data.mjs (blok kolo6 seo).
// 8. 11. 2026: komerční SEO roboti a sběr dat pro trénink AI bez přínosu pro web. Za 12 h (7.–8. 11.) SE Ranking 529,
// Ahrefs 101 požadavků – víc než všechny vyhledávače dohromady (Bing 7). Procházeli tisíce detailů fondů
// mimo cache CDN = většina přenosu z originu (Fast Origin Transfer 6,9 GB / 10 GB free tieru) i výpočetního času; free
// tier se kvůli tomu 7. 11. vyčerpal. NEBLOKOVAT vyhledávače (Google, Bing, Seznam, Apple, DuckDuckGo) ani AI vyhledávání
// (OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, GPTBot, meta-externalagent – Meta AI, majitel 8. 11.: AI nás má znát) – hlídá scripts/check-fund-data.mjs (blok robots).
const BLOKOVANI_ROBOTI = [
  'SERankingBacklinksBot', 'SERankingBot', 'AhrefsBot', 'AhrefsSiteAudit', 'SemrushBot', 'SiteAuditBot', 'MJ12bot',
  'DotBot', 'DataForSeoBot', 'BLEXBot', 'Barkrowler', 'serpstatbot', 'PetalBot', 'Bytespider', 'Baiduspider',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: BLOKOVANI_ROBOTI, disallow: '/' },
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
