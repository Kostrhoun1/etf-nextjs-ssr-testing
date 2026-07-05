import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Eliminates invalid meta tags in head - helps with SEO
    strictNextHead: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async redirects() {
    return [
      // Strip _rsc query parameter to fix Google indexing issues
      {
        source: '/:path*',
        has: [
          {
            type: 'query',
            key: '_rsc',
          },
        ],
        destination: '/:path*',
        permanent: true,
      },
      // Redirect non-www to www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'etfpruvodce.cz',
          },
        ],
        destination: 'https://www.etfpruvodce.cz/:path*',
        permanent: true,
      },
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
