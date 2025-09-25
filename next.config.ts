import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Remove standalone output for better compatibility
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
