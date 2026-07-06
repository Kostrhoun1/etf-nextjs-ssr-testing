import type { MetadataRoute } from 'next';
import { categoryConfigs } from '@/lib/etf-data';
import { portfolioModels } from '@/components/design-preview/portfolioData';

/* Dynamická sitemapa – jen INDEXOVATELNÉ produkční URL (root routy nového webu).
   Vynecháno záměrně: /etf/[isin] (noindex – tenký obsah), /broker, /srovnani/porovnani,
   /prehled (noindex). etf detaily otevřeme do indexace později. */
const BASE = 'https://etfpruvodce.cz';
const BROKERS = ['degiro', 'xtb', 'trading212', 'ibkr', 'fio', 'portu'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths: { p: string; pr: number }[] = [
    { p: '', pr: 1 },
    { p: '/srovnani', pr: 0.9 },
    { p: '/zebricky', pr: 0.9 },
    { p: '/kategorie', pr: 0.7 },
    { p: '/portfolio-strategie', pr: 0.8 },
    { p: '/kde-koupit', pr: 0.8 },
    { p: '/srovnani-brokeru', pr: 0.7 },
    { p: '/pruvodce', pr: 0.7 },
    { p: '/jak-zacit', pr: 0.7 },
    { p: '/vyber-etf', pr: 0.6 },
    { p: '/kalkulacky', pr: 0.6 },
    { p: '/fire', pr: 0.8 },
    { p: '/dane-z-etf', pr: 0.8 },
    { p: '/investicni-kalkulacka', pr: 0.6 },
    { p: '/fire-kalkulacka', pr: 0.6 },
    { p: '/backtest', pr: 0.6 },
    { p: '/monte-carlo', pr: 0.5 },
    { p: '/kurzovy-dopad', pr: 0.5 },
    { p: '/kalkulacka', pr: 0.5 },
    { p: '/hypotecni-kalkulacka', pr: 0.5 },
    { p: '/uverova-kalkulacka', pr: 0.5 },
    { p: '/nouzova-rezerva', pr: 0.5 },
    { p: '/cisty-plat', pr: 0.5 },
    { p: '/infografiky', pr: 0.5 },
    { p: '/o-nas', pr: 0.3 },
  ];
  for (const s of Object.keys(categoryConfigs)) paths.push({ p: `/nejlepsi-etf/${s}`, pr: 0.7 });
  for (const m of portfolioModels) paths.push({ p: `/portfolio-strategie/${m.slug}`, pr: 0.6 });
  for (const b of BROKERS) paths.push({ p: `/recenze/${b}`, pr: 0.6 });

  return paths.map(({ p, pr }) => ({
    url: BASE + p,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: pr,
  }));
}
