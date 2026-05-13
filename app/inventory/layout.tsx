import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inventory',
  description: 'Browse our full inventory of tested used PC parts from Japan. CPUs, memory, motherboards, GPUs and more.',
}

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
