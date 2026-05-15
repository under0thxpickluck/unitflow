export type ProductCategory = 'CPU' | 'GPU' | 'Memory' | 'Motherboard' | 'PSU' | 'Storage'

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
  ebay_image_url: string
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
