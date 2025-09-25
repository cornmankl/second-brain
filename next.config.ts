import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Optimize for Vercel deployment
  output: 'standalone',
  experimental: {
    // Enable optimized features for Vercel
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*'],
  },
  // Configure images for Vercel
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
