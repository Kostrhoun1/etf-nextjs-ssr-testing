import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
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
