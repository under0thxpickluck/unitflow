import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'i.ebayimg.com' },
      { protocol: 'https', hostname: '**.ebayimg.com' },
      // sedora が写真を置いている Supabase Storage（公開バケットのみ）
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/ebay',
        destination: 'https://www.ebay.com/usr/unitflow-japan',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
