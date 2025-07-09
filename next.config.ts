import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Removed proxy configuration - using Next.js API routes directly
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporarily disable ESLint during builds
  },
  // Exclude external directories from compilation
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;