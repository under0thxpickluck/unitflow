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
          alt={`${product.title_en} from Japan`}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
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

        <span className={`text-xs block mb-3 ${product.stock > 0 ? 'text-green-400' : 'text-gray-500'}`}>
          {product.stock > 0 ? `● In Stock (${product.stock})` : '○ Out of Stock'}
        </span>

        <div className="flex gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 text-xs text-center border border-white/20 hover:border-white/40 text-gray-400 hover:text-white px-2 py-1.5 rounded transition-colors"
          >
            Details
          </Link>
          <a
            href={product.ebay_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-xs text-center bg-blue-600 hover:bg-blue-500 text-white px-2 py-1.5 rounded transition-colors"
          >
            Buy on eBay
          </a>
        </div>
      </div>
    </div>
  )
}
