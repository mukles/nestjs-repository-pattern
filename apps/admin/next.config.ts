import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  allowedDevOrigins: ['http://localhost:3000'],
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
