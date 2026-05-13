'use client'
import { ProductCategory, ProductCondition } from '@/types/product'

interface FilterState {
  category: ProductCategory | ''
  condition: ProductCondition | ''
  socket: string
  brand: string
}

interface Props {
  filters: FilterState
  onChange: (filters: FilterState) => void
  availableSockets: string[]
  availableBrands: string[]
}

const CATEGORIES: ProductCategory[] = ['CPU', 'GPU', 'Memory', 'Motherboard', 'PSU', 'Storage']
const CONDITIONS: ProductCondition[] = ['Tested', 'Untested', 'For Parts', 'As-is']

export default function ProductFilter({ filters, onChange, availableSockets, availableBrands }: Props) {
  const set = (key: keyof FilterState) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    onChange({ ...filters, [key]: e.target.value })

  const reset = () => onChange({ category: '', condition: '', socket: '', brand: '' })
  const hasFilter = Object.values(filters).some(Boolean)

  const selectClass = 'bg-bg-primary border border-white/10 text-gray-300 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-white/30'

  return (
    <div className="bg-bg-secondary border border-white/10 rounded p-4 flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Category</label>
        <select value={filters.category} onChange={set('category')} className={selectClass}>
          <option value="">All</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Condition</label>
        <select value={filters.condition} onChange={set('condition')} className={selectClass}>
          <option value="">All</option>
          {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Socket</label>
        <select value={filters.socket} onChange={set('socket')} className={selectClass}>
          <option value="">All</option>
          {availableSockets.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Brand</label>
        <select value={filters.brand} onChange={set('brand')} className={selectClass}>
          <option value="">All</option>
          {availableBrands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      {hasFilter && (
        <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-300 underline self-end pb-1.5">
          Clear filters
        </button>
      )}
    </div>
  )
}
