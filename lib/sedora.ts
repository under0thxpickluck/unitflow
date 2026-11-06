import { Product, ProductCategory, ProductCondition } from '@/types/product'
import { createSlug, slugify, uniqueSlugs } from '@/lib/slug'

type RawProduct = Omit<Product, 'slug'> & { slug?: string }

// 開発用の見本データ。本番では絶対に出さない（実在しない在庫を見せないため）
const SAMPLE_PRODUCTS: RawProduct[] = [
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
    stock: 3,
    listed_at: '2026-05-06',
  },
]

const CATEGORIES: ProductCategory[] = ['CPU', 'GPU', 'Memory', 'Motherboard', 'PSU', 'Storage', 'Other']
const CONDITIONS: ProductCondition[] = ['Tested', 'Untested', 'For Parts', 'As-is']

// 古い sedora が送っていた値も受けられるようにする
const LEGACY_CONDITION: Record<string, ProductCondition> = { Junk: 'For Parts', Parts: 'For Parts' }
const LEGACY_CATEGORY: Record<string, ProductCategory> = { 'OEM Parts': 'Other' }

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

/** sedora から届いた1件を、サイトで安全に使える形に整える（欠けた値・知らない値に備える） */
export function normalizeProduct(raw: Record<string, unknown>): Omit<Product, 'slug'> & { slug: string } {
  const rawCategory = str(raw.category)
  const category: ProductCategory = CATEGORIES.includes(rawCategory as ProductCategory)
    ? (rawCategory as ProductCategory)
    : LEGACY_CATEGORY[rawCategory] ?? 'Other'
  const rawCondition = str(raw.condition)
  const condition: ProductCondition = CONDITIONS.includes(rawCondition as ProductCondition)
    ? (rawCondition as ProductCondition)
    : LEGACY_CONDITION[rawCondition] ?? 'Untested'

  const images = (Array.isArray(raw.images) ? raw.images : [])
    .filter((u): u is string => typeof u === 'string' && u.startsWith('https://'))
  const first = str(raw.ebay_image_url)
  if (images.length === 0 && first.startsWith('https://')) images.push(first)

  const title_en = str(raw.title_en)
  const brand = str(raw.brand)
  const model = str(raw.model)
  const socket = str(raw.socket) || undefined
  const slug =
    str(raw.slug) ||
    (brand || model ? createSlug({ brand, model, socket, category }) : slugify(`${title_en} ${category}`))

  const product: Omit<Product, 'slug'> & { slug: string } = {
    id: str(raw.id),
    slug,
    title_en,
    title_ja: str(raw.title_ja) || title_en,
    category,
    brand,
    model,
    condition,
    tested: raw.tested === true || condition === 'Tested',
    ebay_url: str(raw.ebay_url) || 'https://www.ebay.com',
    images,
    stock: typeof raw.stock === 'number' ? raw.stock : 0,
    listed_at: str(raw.listed_at),
  }
  if (images[0]) product.ebay_image_url = images[0]
  if (socket) product.socket = socket
  if (str(raw.memoryType)) product.memoryType = str(raw.memoryType)
  if (str(raw.partNumber)) product.partNumber = str(raw.partNumber)
  if (raw.status === 'listed' || raw.status === 'in-stock') product.status = raw.status
  if (str(raw.updatedAt)) product.updatedAt = str(raw.updatedAt)
  return product
}

/** 届いた一覧を整え、URL（slug）が重ならないようにする */
export function toProducts(raw: unknown): Product[] {
  if (!Array.isArray(raw)) return []
  const normalized = raw
    .filter((r): r is Record<string, unknown> => typeof r === 'object' && r !== null)
    .map((r) => normalizeProduct(r))
    .filter((p) => p.id && p.title_en)
  return uniqueSlugs(normalized)
}

function sampleDataAllowed(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.USE_SAMPLE_PRODUCTS === 'true'
}

async function fetchFromSedora(): Promise<Product[]> {
  const url = process.env.SEDORA_API_URL
  const key = process.env.SEDORA_API_KEY
  if (!url || !key) {
    if (sampleDataAllowed()) return toProducts(SAMPLE_PRODUCTS)
    console.error('[sedora] SEDORA_API_URL / SEDORA_API_KEY が未設定のため在庫を表示できません')
    return []
  }

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${key}` },
      // 在庫・写真の更新を10分以内に反映する
      next: { revalidate: 600 },
    })
    if (!res.ok) {
      console.error(`[sedora] 在庫の取得に失敗しました (${res.status})`)
      return []
    }
    return toProducts(await res.json())
  } catch (e) {
    console.error('[sedora] 在庫の取得でエラー', e)
    return []
  }
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
