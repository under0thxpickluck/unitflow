import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GENRES, genreHeading, getGenre } from '@/lib/genres'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return GENRES.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const genre = getGenre(slug)
  if (!genre) return {}
  return {
    title: genreHeading(genre),
    description: genre.summary,
    alternates: { canonical: `${SITE_URL}/genres/${genre.slug}` },
    // 商品が無い間は検索エンジンに載せない（lib/genres.ts の hasStock）
    robots: genre.hasStock ? { index: true, follow: true } : { index: false, follow: true },
  }
}

export default async function GenrePage({ params }: Props) {
  const { slug } = await params
  const genre = getGenre(slug)
  if (!genre) notFound()

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: `${SITE_URL}/categories` },
      { '@type': 'ListItem', position: 3, name: genre.name, item: `${SITE_URL}/genres/${genre.slug}` },
    ],
  }

  const others = GENRES.filter((g) => g.slug !== genre.slug)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-8 font-mono flex flex-wrap gap-1">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-gray-300">Categories</Link>
          <span>/</span>
          <span className="text-gray-400">{genre.name}</span>
        </nav>

        <div className="mb-10 max-w-2xl">
          <span className="inline-block text-[11px] font-mono text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded mb-4">
            Coming soon
          </span>
          <h1 className="text-2xl font-bold text-white mb-3">{genreHeading(genre)}</h1>
          <p className="text-gray-400 leading-relaxed">{genre.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-bg-secondary border border-white/10 rounded p-8 text-center">
            <p className="text-white font-medium mb-2">No items listed in this genre yet.</p>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              We are preparing this genre. If you are looking for something specific, tell us what you need and we will
              let you know if we can source it in Japan.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={`/contact?genre=${genre.slug}`}
                className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-5 py-2.5 rounded transition-colors text-sm"
              >
                Request an item →
              </Link>
              <Link
                href="/inventory"
                className="border border-white/20 text-gray-300 hover:border-white/40 hover:text-white px-5 py-2.5 rounded transition-colors text-sm"
              >
                Browse current inventory
              </Link>
            </div>
          </div>

          <div className="bg-bg-secondary border border-white/10 rounded p-6">
            <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">What we plan to carry</h2>
            <ul className="space-y-2">
              {genre.examples.map((e) => (
                <li key={e} className="text-sm text-gray-300 flex gap-2">
                  <span className="text-gray-600">·</span>
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-sm font-bold text-white mb-4">Other genres</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/categories" className="text-xs border border-white/10 text-gray-300 hover:text-white hover:border-white/30 px-3 py-1.5 rounded transition-colors">
              PC Parts
            </Link>
            {others.map((g) => (
              <Link key={g.slug} href={`/genres/${g.slug}`} className="text-xs border border-white/10 text-gray-400 hover:text-white hover:border-white/30 px-3 py-1.5 rounded transition-colors">
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
