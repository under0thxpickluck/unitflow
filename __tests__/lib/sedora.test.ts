import { getProducts, getProduct, getProductBySlug, filterProducts } from '@/lib/sedora'
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

  describe('getProductBySlug', () => {
    it('returns a product when slug matches', async () => {
      const products = await getProducts()
      const slug = products[0].slug
      const product = await getProductBySlug(slug)
      expect(product).not.toBeNull()
      expect(product?.slug).toBe(slug)
    })

    it('returns null when slug does not match', async () => {
      const product = await getProductBySlug('nonexistent-slug-xyz')
      expect(product).toBeNull()
    })
  })

  describe('filterProducts', () => {
    it('filters by category', () => {
      const products: Product[] = [
        { id: '1', slug: 'intel-i5-3470-cpu', category: 'CPU', title_en: 'i5', title_ja: '', brand: 'Intel', model: 'i5-3470', condition: 'Tested', tested: true, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
        { id: '2', slug: 'nvidia-gtx-1050-gpu', category: 'GPU', title_en: 'GTX', title_ja: '', brand: 'NVIDIA', model: 'GTX 1050', condition: 'Tested', tested: true, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
      ]
      const result = filterProducts(products, { category: 'CPU' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('filters by condition', () => {
      const products: Product[] = [
        { id: '1', slug: 'intel-i5-3470-cpu', category: 'CPU', title_en: 'i5', title_ja: '', brand: 'Intel', model: 'i5-3470', condition: 'Tested', tested: true, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
        { id: '2', slug: 'intel-i3-3220-cpu', category: 'CPU', title_en: 'i3', title_ja: '', brand: 'Intel', model: 'i3-3220', condition: 'Untested', tested: false, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
      ]
      const result = filterProducts(products, { condition: 'Tested' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('returns all products when no filter applied', () => {
      const products: Product[] = [
        { id: '1', slug: 'intel-i5-3470-cpu', category: 'CPU', title_en: 'i5', title_ja: '', brand: 'Intel', model: 'i5-3470', condition: 'Tested', tested: true, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
      ]
      const result = filterProducts(products, {})
      expect(result).toHaveLength(1)
    })

    it('filters by socket', () => {
      const products: Product[] = [
        { id: '1', slug: 'intel-i5-3470-lga1155-cpu', category: 'CPU', title_en: 'i5', title_ja: '', brand: 'Intel', model: 'i5-3470', socket: 'LGA1155', condition: 'Tested', tested: true, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
        { id: '2', slug: 'amd-fx-8350-am3-cpu', category: 'CPU', title_en: 'FX', title_ja: '', brand: 'AMD', model: 'FX-8350', socket: 'AM3+', condition: 'Tested', tested: true, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
      ]
      const result = filterProducts(products, { socket: 'LGA1155' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('filters by brand', () => {
      const products: Product[] = [
        { id: '1', slug: 'intel-i5-3470-cpu', category: 'CPU', title_en: 'i5', title_ja: '', brand: 'Intel', model: 'i5-3470', condition: 'Tested', tested: true, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
        { id: '2', slug: 'amd-fx-8350-cpu', category: 'CPU', title_en: 'FX', title_ja: '', brand: 'AMD', model: 'FX-8350', condition: 'Tested', tested: true, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
      ]
      const result = filterProducts(products, { brand: 'Intel' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('filters by memoryType', () => {
      const products: Product[] = [
        { id: '1', slug: 'samsung-m378b-memory', category: 'Memory', title_en: 'DDR3', title_ja: '', brand: 'Samsung', model: 'M378B', memoryType: 'DDR3', condition: 'Tested', tested: true, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
        { id: '2', slug: 'crucial-ct8g4-memory', category: 'Memory', title_en: 'DDR4', title_ja: '', brand: 'Crucial', model: 'CT8G4', memoryType: 'DDR4', condition: 'Tested', tested: true, ebay_url: '', ebay_image_url: '', stock: 1, listed_at: '' },
      ]
      const result = filterProducts(products, { memoryType: 'DDR3' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })
  })
})
