import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      // Redirect www to non-www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.etfpruvodce.cz',
          },
        ],
        destination: 'https://etfpruvodce.cz/:path*',
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
};

export default nextConfig;
