/** @type {import('next').NextConfig} */
const nextConfig = {
  // Completely disable all Next.js dev indicators
  devIndicators: false,
  images: {
    minimumCacheTTL: 2678400 * 6, // 3 months
    // Allow all external images for vendor profiles
    // In production, restrict this to specific trusted domains
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Allow images from any HTTPS domain (for vendor profile images)
      {
        protocol: 'https',
        hostname: '**',
      },
      // Allow images from HTTP (for local development)
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },
  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Experimental optimizations
  experimental: {
    // Optimize package imports (tree-shaking for large packages)
    optimizePackageImports: ['@heroicons/react', 'framer-motion'],
  },
}

export default nextConfig
