import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/autocite/:path*',
        destination: 'https://www.mybib.com/api/autocite/:path*',
      },
    ]
  },
};

export default nextConfig;
