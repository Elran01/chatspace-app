import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Enable faster builds
    turbo: {},
  },
  images: {
    // Optimize images for better performance
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/chatspace-kai-workspace.appspot.com/**',
      },
    ],
  },
  // Enable compression for better performance
  compress: true,
  // Optimize for Vercel deployment
  poweredByHeader: false,
};

export default nextConfig;
