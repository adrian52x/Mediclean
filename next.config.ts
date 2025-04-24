import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sfnpgydezdiiexmftraz.supabase.co',
      },
    ], //Supabase storage domain
  },
};

export default nextConfig;
