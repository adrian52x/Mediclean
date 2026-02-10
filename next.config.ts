import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // unoptimized: true, // Disabled - now using optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sfnpgydezdiiexmftraz.supabase.co',
      },
    ], //Supabase storage domain
    minimumCacheTTL: 31536000, // Cache for 1 year (reduces re-transformations)
    deviceSizes: [640, 750, 828, 1080, 1200], // Limit device variants
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Limit image sizes
  },
};

export default nextConfig;
