export type ProductCategory = 'CPU' | 'GPU' | 'Memory' | 'Motherboard' | 'PSU' | 'Storage' | 'Other'

export type ProductCondition = 'Tested' | 'Untested' | 'For Parts' | 'As-is'

export type StockStatus = 'in-stock' | 'listed' | 'junk' | 'sold'

export interface Product {
  id: string
  slug: string
  title_en: string
  title_ja: string
  category: ProductCategory
  brand: string
  model: string
  partNumber?: string
  socket?: string
  memoryType?: string
  condition: ProductCondition
  tested: boolean
  ebay_url: string
  /** 1枚目の写真。無ければ未設定 */
  ebay_image_url?: string
  /** 全写真（並び順どおり）。sedora の listing_assets から自動で届く */
  images?: string[]
  /** in-stock: 在庫あり / listed: eBay 出品中 */
  status?: 'in-stock' | 'listed'
  stock: number
  listed_at: string
  updatedAt?: string
  sold_at?: string
}

export interface TodaysProcessing {
  date: string
  disassembled: string[]
  added_cpu: string[]
  added_ddr3: string[]
  notes?: string
}
