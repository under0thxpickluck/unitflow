import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'i.ebayimg.com' },
      { protocol: 'https', hostname: '**.ebayimg.com' },
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
