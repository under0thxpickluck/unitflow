import { createSlug } from '@/lib/slug'

describe('createSlug', () => {
  it('combines brand, model, socket, category', () => {
    expect(createSlug({ brand: 'Intel', model: 'i5-3470', socket: 'LGA1155', category: 'CPU' }))
      .toBe('intel-i5-3470-lga1155-cpu')
  })

  it('works without socket', () => {
    expect(createSlug({ brand: 'Samsung', model: 'M378B5273DH0-CK0', category: 'Memory' }))
      .toBe('samsung-m378b5273dh0-ck0-memory')
  })

  it('lowercases everything', () => {
    expect(createSlug({ brand: 'ASUS', model: 'P8H61-M LX', socket: 'LGA1155', category: 'Motherboard' }))
      .toBe('asus-p8h61-m-lx-lga1155-motherboard')
  })

  it('collapses multiple separators', () => {
    expect(createSlug({ brand: 'HP', model: 'ProDesk 400 G1', category: 'CPU' }))
      .toBe('hp-prodesk-400-g1-cpu')
  })

  it('strips leading and trailing hyphens', () => {
    // brand starting with special char produces a leading hyphen that must be stripped
    expect(createSlug({ brand: '!Intel', model: 'i7-4770', category: 'CPU' }))
      .toBe('intel-i7-4770-cpu')
  })
})
