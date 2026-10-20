import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // false od 17. 10. 2026: tsc má 0 chyb (dřív 146 a skrytý bug distKind) – build má
    // typové chyby zastavit, ne je tiše pustit na produkci.
    ignoreBuildErrors: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    return [
      // Indexovat smí jen ostrá doména. Náhledy (*.vercel.app), localhost atd. = noindex.
      // Dřív v middleware (běžel kvůli tomu na každém požadavku a pálil CPU free tieru), od 20. 10. 2026 tady.
      {
        source: '/:path*',
        missing: [{ type: 'host', value: 'etfpruvodce.cz' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      // OG obrázky (/api/og?…) smí sociální sítě stáhnout (robots.ts je povoluje), ale vyhledávač je nemá
      // vést jako samostatné výsledky – Seznam je měl v indexu (SEO audit 20. 10. 2026). Hlavička nestojí CPU.
      {
        source: '/api/og',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ];
  },
  async redirects() {
    return [
      // (Dřívější _rsc-strip redirect ODSTRANĚN – rozbíjel Next RSC prefetch → console
      //  errors „Failed to fetch RSC payload" a pomalé přechody. Indexaci _rsc URL
      //  řeší robots.ts disallow /*?_rsc=* .)
      // (www→apex řeší Vercel domény + middleware; kanonická doména je apex etfpruvodce.cz)
      // Smazaný Buffettův článek → rovnou plný backtest s předvyplněným 90/10.
      { source: '/buffettovo-portfolio', destination: '/backtest?portfolio=buffett-90-10&start=2002-07-01&amount=100000&contrib=none&run=1', permanent: true },
      // Zrušené žebříčky (17. 10. 2026): duplicity se stejnými fondy jako jiná kategorie a
      // „ETF zdarma na DEGIRO" (ukazovala jen 50 největších fondů; seznam zdarma nejde udržet ověřený).
      { source: '/nejlepsi-etf/etf-zdarma-degiro', destination: '/recenze/degiro', permanent: true },
      { source: '/nejlepsi-etf/nejlepsi-globalni-etf', destination: '/nejlepsi-etf/nejlepsi-celosvetove-etf', permanent: true },
      { source: '/nejlepsi-etf/nejlepsi-clean-energy-etf', destination: '/nejlepsi-etf/nejlepsi-obnovitelne-zdroje-etf', permanent: true },
      { source: '/nejlepsi-etf/nejlepsi-nemovitostni-etf', destination: '/nejlepsi-etf/nejlepsi-realitni-etf', permanent: true },
      { source: '/nejlepsi-etf/nejlepsi-zlate-etf', destination: '/nejlepsi-etf/nejlepsi-zlato-etf', permanent: true },
      // /kategorie: osiřelý duplikát žebříčku S&P 500 (nic na něj neodkazovalo), 17. 10. 2026.
      { source: '/kategorie', destination: '/nejlepsi-etf/nejlepsi-sp500-etf', permanent: true },
      // === CUTOVER: staré URL (starý web) → nové routy nového designu ===
      { source: '/srovnani-etf', destination: '/srovnani', permanent: true },
      { source: '/srovnani-etf/:pair', destination: '/srovnani/:pair', permanent: true },
      { source: '/kde-koupit-etf', destination: '/kde-koupit', permanent: true },
      { source: '/co-jsou-etf', destination: '/pruvodce', permanent: true },
      { source: '/co-jsou-etf/jak-zacit-investovat', destination: '/jak-zacit', permanent: true },
      { source: '/degiro-recenze', destination: '/recenze/degiro', permanent: true },
      { source: '/xtb-recenze', destination: '/recenze/xtb', permanent: true },
      { source: '/trading212-recenze', destination: '/recenze/trading212', permanent: true },
      { source: '/interactive-brokers-recenze', destination: '/recenze/ibkr', permanent: true },
      { source: '/fio-ebroker-recenze', destination: '/recenze/fio', permanent: true },
      { source: '/portu-recenze', destination: '/recenze/portu', permanent: true },
      // Kalkulačky: staré vnořené → nové ploché
      { source: '/kalkulacky/investicni-kalkulacka', destination: '/investicni-kalkulacka', permanent: true },
      { source: '/kalkulacky/fire-kalkulacka', destination: '/fire-kalkulacka', permanent: true },
      { source: '/kalkulacky/hypotecni-kalkulacka', destination: '/hypotecni-kalkulacka', permanent: true },
      { source: '/kalkulacky/uverova-kalkulacka', destination: '/uverova-kalkulacka', permanent: true },
      { source: '/kalkulacky/nouzova-rezerva', destination: '/nouzova-rezerva', permanent: true },
      { source: '/kalkulacky/monte-carlo-simulator', destination: '/monte-carlo', permanent: true },
      { source: '/kalkulacky/kurzovy-dopad-etf', destination: '/kurzovy-dopad', permanent: true },
      { source: '/kalkulacky/kalkulacka-poplatku-etf', destination: '/kalkulacka', permanent: true },
      { source: '/kalkulacky/backtest-portfolia', destination: '/backtest', permanent: true },
      { source: '/kalkulacky/cisty-plat-2026', destination: '/cisty-plat', permanent: true },
      // Rozcestník žebříčků: starý hub → nový
      { source: '/nejlepsi-etf', destination: '/zebricky', permanent: true },
      // Chybějící kategorie na novém webu → hub (aby stará indexovaná URL nespadla na 404)
      { source: '/nejlepsi-etf/nejlepsi-spotrebni-etf', destination: '/zebricky', permanent: true },

      // Rok 2025 → 2026 / staré aliasy (dest sjednoceny na nové routy, bez řetězení)
      {
        source: '/nejlepsi-etf/nejlepsi-etf-2025',
        destination: '/nejlepsi-etf/nejlepsi-etf-2026',
        permanent: true,
      },
      {
        source: '/kalkulacky/cisty-plat-2025',
        destination: '/cisty-plat',
        permanent: true,
      },
      {
        source: '/nejlepsi-etf-2025',
        destination: '/nejlepsi-etf/nejlepsi-etf-2026',
        permanent: true,
      },
      {
        source: '/tipy',
        destination: '/zebricky',
        permanent: true,
      },
      {
        source: '/tipy/:path*',
        destination: '/nejlepsi-etf/:path*',
        permanent: true,
      },
    ];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
