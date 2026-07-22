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
  async rewrites() {
    return [
      {
        // Serve product PDFs under our own domain (e.g. /docs/<file>.pdf)
        // instead of exposing the raw Supabase storage URL.
        source: '/docs/:path*',
        destination:
          'https://sfnpgydezdiiexmftraz.supabase.co/storage/v1/object/public/product-pdfs/:path*',
      },
    ];
  },
};

export default nextConfig;
