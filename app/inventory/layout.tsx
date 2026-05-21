import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'Inventory — Used PC Parts from Japan',
  description: 'Browse used CPUs, memory, motherboards, GPUs, PSUs and storage from Japanese business PCs. Filter by category, socket, brand, and condition.',
  alternates: { canonical: `${SITE_URL}/inventory` },
}

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
