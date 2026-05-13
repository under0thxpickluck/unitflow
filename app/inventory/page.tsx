'use client'
import { useState, useEffect } from 'react'
import { Product, ProductCategory, ProductCondition } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import ProductFilter from '@/components/ProductFilter'
import { filterProducts } from '@/lib/filters'

interface FilterState {
  category: ProductCategory | ''
  condition: ProductCondition | ''
  socket: string
  brand: string
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<FilterState>({ category: '', condition: '', socket: '', brand: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/inventory')
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const sockets = [...new Set(products.flatMap((p) => p.socket ? [p.socket] : []))]
  const brands = [...new Set(products.map((p) => p.brand))]

  const filtered = filterProducts(products, {
    category: filters.category || undefined,
    condition: filters.condition || undefined,
    socket: filters.socket || undefined,
    brand: filters.brand || undefined,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Inventory</h1>
        <p className="text-gray-500 text-sm mt-1">
          {loading ? 'Loading...' : `${filtered.length} items available`}
        </p>
      </div>
      <div className="mb-6">
        <ProductFilter filters={filters} onChange={setFilters} availableSockets={sockets} availableBrands={brands} />
      </div>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-bg-secondary border border-white/10 rounded aspect-square animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No items match your filters.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
