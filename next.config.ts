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
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
      {
        source: '/sitemap-static.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
      {
        source: '/sitemap-etf.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
    ];
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
      {
        source: '/tipy',
        destination: '/nejlepsi-etf',
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
