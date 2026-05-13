import { getProducts, getProduct, filterProducts } from '@/lib/sedora'
import { Product } from '@/types/product'

describe('sedora lib', () => {
  describe('getProducts', () => {
    it('returns an array of products', async () => {
      const products = await getProducts()
      expect(Array.isArray(products)).toBe(true)
      expect(products.length).toBeGreaterThan(0)
    })

    it('each product has required fields', async () => {
      const products = await getProducts()
      const p = products[0]
      expect(p).toHaveProperty('id')
      expect(p).toHaveProperty('title_en')
      expect(p).toHaveProperty('category')
      expect(p).toHaveProperty('condition')
      expect(p).toHaveProperty('ebay_url')
    })
  })

  describe('getProduct', () => {
    it('returns a single product by id', async () => {
      const products = await getProducts()
      const id = products[0].id
      const product = await getProduct(id)
      expect(product).not.toBeNull()
      expect(product?.id).toBe(id)
    })

    it('returns null for unknown id', async () => {
      const product = await getProduct('nonexistent-id-12345')
      expect(product).toBeNull()
    })
  })

  describe('filterProducts', () => {
    it('filters by category', () => {
      const products: Product[] = [
        { id: '1', category: 'CPU', title_en: 'i5', title_ja: '', brand: 'Intel', model: 'i5-3470', condition: 'Tested', tested: true, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
        { id: '2', category: 'GPU', title_en: 'GTX', title_ja: '', brand: 'NVIDIA', model: 'GTX 1050', condition: 'Tested', tested: true, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
      ]
      const result = filterProducts(products, { category: 'CPU' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('filters by condition', () => {
      const products: Product[] = [
        { id: '1', category: 'CPU', title_en: 'i5', title_ja: '', brand: 'Intel', model: 'i5-3470', condition: 'Tested', tested: true, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
        { id: '2', category: 'CPU', title_en: 'i3', title_ja: '', brand: 'Intel', model: 'i3-3220', condition: 'Untested', tested: false, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
      ]
      const result = filterProducts(products, { condition: 'Tested' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('returns all products when no filter applied', () => {
      const products: Product[] = [
        { id: '1', category: 'CPU', title_en: 'i5', title_ja: '', brand: 'Intel', model: 'i5-3470', condition: 'Tested', tested: true, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
      ]
      const result = filterProducts(products, {})
      expect(result).toHaveLength(1)
    })
  })
})
