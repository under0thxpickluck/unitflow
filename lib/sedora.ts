import { Product } from '@/types/product'
import { createSlug } from '@/lib/slug'

type RawProduct = Omit<Product, 'slug'>

const FALLBACK_PRODUCTS: RawProduct[] = [
  {
    id: 'cpu-001',
    title_en: 'Intel Core i5-3470 3.20GHz LGA1155',
    title_ja: 'Intel Core i5-3470',
    category: 'CPU',
    brand: 'Intel',
    model: 'i5-3470',
    socket: 'LGA1155',
    condition: 'Tested',
    tested: true,
    ebay_url: 'https://www.ebay.com',
    ebay_image_url: 'https://placehold.co/400x400/1d222b/9ca3af?text=CPU',
    stock: 12,
    listed_at: '2026-05-10',
  },
  {
    id: 'cpu-002',
    title_en: 'Intel Core i7-3770 3.40GHz LGA1155',
    title_ja: 'Intel Core i7-3770',
    category: 'CPU',
    brand: 'Intel',
    model: 'i7-3770',
    socket: 'LGA1155',
    condition: 'Tested',
    tested: true,
    ebay_url: 'https://www.ebay.com',
    ebay_image_url: 'https://placehold.co/400x400/1d222b/9ca3af?text=CPU',
    stock: 5,
    listed_at: '2026-05-11',
  },
  {
    id: 'mem-001',
    title_en: 'Samsung 4GB DDR3-1600 PC3-12800 DIMM',
    title_ja: 'Samsung DDR3 4GB',
    category: 'Memory',
    brand: 'Samsung',
    model: 'M378B5273DH0-CK0',
    memoryType: 'DDR3',
    condition: 'Tested',
    tested: true,
    ebay_url: 'https://www.ebay.com',
    ebay_image_url: 'https://placehold.co/400x400/1d222b/9ca3af?text=RAM',
    stock: 40,
    listed_at: '2026-05-09',
  },
  {
    id: 'mem-002',
    title_en: 'Hynix 8GB DDR3-1333 PC3-10600 DIMM',
    title_ja: 'Hynix DDR3 8GB',
    category: 'Memory',
    brand: 'Hynix',
    model: 'HMT41GU6BFR8C-H9',
    memoryType: 'DDR3',
    condition: 'Tested',
    tested: true,
    ebay_url: 'https://www.ebay.com',
    ebay_image_url: 'https://placehold.co/400x400/1d222b/9ca3af?text=RAM',
    stock: 18,
    listed_at: '2026-05-08',
  },
  {
    id: 'mb-001',
    title_en: 'ASUS P8H61-M LX LGA1155 MicroATX Motherboard',
    title_ja: 'ASUS P8H61-M LX マザーボード',
    category: 'Motherboard',
    brand: 'ASUS',
    model: 'P8H61-M LX',
    socket: 'LGA1155',
    condition: 'Tested',
    tested: true,
    ebay_url: 'https://www.ebay.com',
    ebay_image_url: 'https://placehold.co/400x400/1d222b/9ca3af?text=MB',
    stock: 7,
    listed_at: '2026-05-07',
  },
  {
    id: 'gpu-001',
    title_en: 'NVIDIA GeForce GT 730 2GB DDR3',
    title_ja: 'NVIDIA GT 730',
    category: 'GPU',
    brand: 'NVIDIA',
    model: 'GT 730',
    condition: 'Tested',
    tested: true,
    ebay_url: 'https://www.ebay.com',
    ebay_image_url: 'https://placehold.co/400x400/1d222b/9ca3af?text=GPU',
    stock: 3,
    listed_at: '2026-05-06',
  },
]

function attachSlug(raw: RawProduct): Product {
  return { ...raw, slug: createSlug({ brand: raw.brand, model: raw.model, socket: raw.socket, category: raw.category }) }
}

async function fetchFromSedora(): Promise<Product[]> {
  const url = process.env.SEDORA_API_URL
  const key = process.env.SEDORA_API_KEY
  if (!url || !key) return FALLBACK_PRODUCTS.map(attachSlug)

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${key}` },
    next: { revalidate: 3600 },
  })
  if (!res.ok) return FALLBACK_PRODUCTS.map(attachSlug)
  const data = await res.json()
  return (data as RawProduct[]).map(attachSlug)
}

export async function getProducts(): Promise<Product[]> {
  return fetchFromSedora()
}

export async function getProduct(id: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find((p) => p.id === id) ?? null
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find((p) => p.slug === slug) ?? null
}

export { filterProducts } from './filters'
export type { ProductFilter } from './filters'
