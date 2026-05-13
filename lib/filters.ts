import { Product, ProductCategory, ProductCondition } from '@/types/product'

export interface ProductFilter {
  category?: ProductCategory
  condition?: ProductCondition
  socket?: string
  brand?: string
  memoryType?: string
}

export function filterProducts(products: Product[], filter: ProductFilter): Product[] {
  return products.filter((p) => {
    if (filter.category && p.category !== filter.category) return false
    if (filter.condition && p.condition !== filter.condition) return false
    if (filter.socket && p.socket !== filter.socket) return false
    if (filter.brand && p.brand !== filter.brand) return false
    if (filter.memoryType && p.memoryType !== filter.memoryType) return false
    return true
  })
}
