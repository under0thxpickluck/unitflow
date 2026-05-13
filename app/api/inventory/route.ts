import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/sedora'

export const revalidate = 3600

export async function GET() {
  const products = await getProducts()
  return NextResponse.json(products)
}
