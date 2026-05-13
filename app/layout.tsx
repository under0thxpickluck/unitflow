import type { Metadata } from 'next'
import { Inter, IBM_Plex_Mono, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const ibmPlex = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-ibm-plex' })
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://unitflow.jp'),
  title: {
    default: 'UNITFLOW JAPAN — Used PC Parts from Japan',
    template: '%s | UNITFLOW JAPAN',
  },
  description: 'Tested CPUs, memory, motherboards, GPUs and OEM parts sourced from business PCs in Japan. Ships worldwide via eBay.',
  keywords: ['used PC parts Japan', 'used CPU Japan', 'used DDR3 memory Japan', 'OEM PC parts Japan', 'Japanese used computer parts'],
  openGraph: {
    title: 'UNITFLOW JAPAN — Used PC Parts from Japan',
    description: 'Tested CPUs, memory, motherboards and more. Sourced from business PCs in Japan.',
    type: 'website',
    locale: 'en_US',
    siteName: 'UNITFLOW JAPAN',
    url: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://unitflow.jp',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'UNITFLOW JAPAN' }],
  },
  robots: { index: true, follow: true },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'UNITFLOW JAPAN',
  url: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://unitflow.jp',
  description: 'Used PC parts specialist in Japan. Sourced from business PCs. Tested and shipped worldwide.',
  areaServed: 'Worldwide',
  knowsAbout: ['used PC parts', 'used CPU', 'used memory', 'DDR3', 'OEM PC parts', 'Japan electronics'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlex.variable} ${notoSansJP.variable}`}>
      <body className="bg-bg-primary text-white font-sans antialiased min-h-screen flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
