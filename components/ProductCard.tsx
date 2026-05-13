import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'
import StatusBadge from './StatusBadge'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-bg-secondary border border-white/10 rounded hover:border-white/20 transition-colors group">
      <div className="relative aspect-square overflow-hidden rounded-t bg-bg-tertiary">
        <Image
          src={product.ebay_image_url || 'https://placehold.co/400x400/1d222b/9ca3af?text=No+Image'}
          alt={product.title_en}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      <div className="p-4">
        <Link href={`/inventory/${product.id}`}>
          <h3 className="text-sm text-white font-medium leading-snug group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
            {product.title_en}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs font-mono text-gray-500 bg-bg-tertiary px-1.5 py-0.5 rounded">
            {product.model}
          </span>
          {product.socket && (
            <span className="text-xs font-mono text-gray-500 bg-bg-tertiary px-1.5 py-0.5 rounded">
              {product.socket}
            </span>
          )}
          <span className="text-xs font-mono text-gray-500 bg-bg-tertiary px-1.5 py-0.5 rounded">
            {product.category}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <StatusBadge condition={product.condition} />
          {product.tested && (
            <span className="text-xs text-gray-500">✓ Tested</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs ${product.stock > 0 ? 'text-green-400' : 'text-gray-500'}`}>
            {product.stock > 0 ? `● In Stock (${product.stock})` : '○ Out of Stock'}
          </span>
          <a
            href={product.ebay_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition-colors"
          >
            Buy on eBay →
          </a>
        </div>
      </div>
    </div>
  )
}
