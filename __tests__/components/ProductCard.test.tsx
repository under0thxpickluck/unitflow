import { render, screen } from '@testing-library/react'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/product'

const mockProduct: Product = {
  id: 'cpu-001',
  title_en: 'Intel Core i5-3470 3.20GHz LGA1155',
  title_ja: 'Intel Core i5-3470',
  category: 'CPU',
  brand: 'Intel',
  model: 'i5-3470',
  socket: 'LGA1155',
  condition: 'Tested',
  tested: true,
  ebay_url: 'https://www.ebay.com/itm/123',
  ebay_image_url: 'https://placehold.co/400x400',
  stock: 5,
  listed_at: '2026-05-10',
}

describe('ProductCard', () => {
  it('renders product title', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Intel Core i5-3470 3.20GHz LGA1155')).toBeInTheDocument()
  })

  it('renders model number', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('i5-3470')).toBeInTheDocument()
  })

  it('renders socket when present', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('LGA1155')).toBeInTheDocument()
  })

  it('renders eBay link', () => {
    render(<ProductCard product={mockProduct} />)
    const link = screen.getByRole('link', { name: /buy on ebay/i })
    expect(link).toHaveAttribute('href', 'https://www.ebay.com/itm/123')
  })

  it('renders In Stock when stock > 0', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText(/in stock/i)).toBeInTheDocument()
  })
})
