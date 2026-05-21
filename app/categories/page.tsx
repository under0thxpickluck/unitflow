import type { Metadata } from 'next'
import Link from 'next/link'
import { getProducts } from '@/lib/sedora'
import { ProductCategory } from '@/types/product'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'Categories — Used PC Parts from Japan',
  description: 'Browse used PC parts by category — CPU, GPU, Memory, Motherboard, PSU, Storage. Sourced from business PCs in Japan.',
  alternates: { canonical: `${SITE_URL}/categories` },
}

const CATEGORY_INFO: Record<ProductCategory, { desc: string }> = {
  CPU: { desc: 'Intel LGA1155, LGA1150, LGA1151 · AMD AM3, AM3+. Pulled from HP/Dell/Lenovo business PCs.' },
  GPU: { desc: 'NVIDIA and AMD discrete GPUs. Workstation and mainstream models.' },
  Memory: { desc: 'DDR2, DDR3, DDR4 DIMM modules. Samsung, Hynix, Micron OEM.' },
  Motherboard: { desc: 'LGA1155, LGA1150, AM3 motherboards. MicroATX and ATX. OEM and retail.' },
  PSU: { desc: '250W–500W power supplies from business desktops. Tested.' },
  Storage: { desc: 'SATA SSDs, HDDs, and 2.5" drives. Multiple capacity options.' },
}

export default async function CategoriesPage() {
  const products = await getProducts()
  const counts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Categories</h1>
      <p className="text-gray-500 text-sm mb-10">Browse by component type</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(CATEGORY_INFO) as ProductCategory[]).map((cat) => (
          <Link key={cat} href={`/categories/${cat.toLowerCase()}`}
            className="bg-bg-secondary border border-white/10 hover:border-white/20 rounded p-6 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-mono text-gray-600 bg-bg-primary px-2 py-1 rounded ml-auto">
                {counts[cat] ?? 0} items
              </span>
            </div>
            <h2 className="text-white font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors">{cat}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{CATEGORY_INFO[cat].desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
