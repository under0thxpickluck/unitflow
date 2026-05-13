import { ProductCondition } from '@/types/product'

const CONDITION_STYLES: Record<ProductCondition, string> = {
  Tested: 'bg-green-950 text-green-400 border border-green-800',
  Untested: 'bg-gray-900 text-gray-400 border border-gray-700',
  'For Parts': 'bg-orange-950 text-orange-400 border border-orange-800',
  'As-is': 'bg-gray-900 text-gray-500 border border-gray-800',
}

interface Props {
  condition: ProductCondition
}

export default function StatusBadge({ condition }: Props) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono ${CONDITION_STYLES[condition]}`}>
      {condition}
    </span>
  )
}
