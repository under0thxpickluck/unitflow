import { permanentRedirect, notFound } from 'next/navigation'
import { getProduct } from '@/lib/sedora'

interface Props {
  params: Promise<{ id: string }>
}

export default async function OldProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()
  return permanentRedirect(`/products/${product.slug}`)
}
