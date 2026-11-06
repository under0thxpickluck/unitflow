import { normalizeProduct, toProducts } from '@/lib/sedora'

describe('sedora から届いたデータの整形', () => {
  it('写真の配列を受け取り、1枚目を代表写真にする', () => {
    const p = normalizeProduct({
      id: 'a', title_en: 'Intel Core i7-4770', category: 'CPU', condition: 'Tested', brand: 'Intel', model: 'Core i7-4770',
      ebay_url: 'https://www.ebay.com/itm/1', stock: 1, listed_at: '2026-11-01',
      images: ['https://x.supabase.co/storage/v1/object/public/listing-images/1.jpg', 'https://x.supabase.co/storage/v1/object/public/listing-images/2.jpg'],
      status: 'listed',
    })
    expect(p.ebay_image_url).toBe('https://x.supabase.co/storage/v1/object/public/listing-images/1.jpg')
    expect(p.images).toHaveLength(2)
    expect(p.status).toBe('listed')
  })

  it('古い sedora の値（Junk / Parts / OEM Parts）をサイトの値に直す', () => {
    expect(normalizeProduct({ id: 'a', title_en: 'x', category: 'OEM Parts', condition: 'Junk' })).toMatchObject({
      category: 'Other',
      condition: 'For Parts',
    })
    expect(normalizeProduct({ id: 'a', title_en: 'x', category: 'CPU', condition: 'Parts' }).condition).toBe('For Parts')
  })

  it('写真が1枚目だけ（古い形）でも配列にする。http や空は捨てる', () => {
    expect(normalizeProduct({ id: 'a', title_en: 'x', ebay_image_url: 'https://i.ebayimg.com/a.jpg' }).images).toEqual([
      'https://i.ebayimg.com/a.jpg',
    ])
    const none = normalizeProduct({ id: 'a', title_en: 'x', images: ['http://insecure/a.jpg', ''] })
    expect(none.images).toEqual([])
    expect(none.ebay_image_url).toBeUndefined()
  })

  it('メーカー・型番が無くても URL がカテゴリ名だけにならず、重ならない', () => {
    const products = toProducts([
      { id: 'a', title_en: 'Core i5-3470', category: 'CPU', condition: 'Tested' },
      { id: 'b', title_en: 'Core i7-3770', category: 'CPU', condition: 'Tested' },
      { id: 'c', title_en: 'ジャンク PC', category: 'Other', condition: 'For Parts' },
      { id: 'd', title_en: 'ジャンク ノート', category: 'Other', condition: 'For Parts' },
    ])
    const slugs = products.map((p) => p.slug)
    expect(slugs).not.toContain('cpu')
    expect(new Set(slugs).size).toBe(4)
  })

  it('配列でないものや id の無い行は捨てる', () => {
    expect(toProducts({ error: 'x' })).toEqual([])
    expect(toProducts([{ title_en: 'no id' }, null, 'x'])).toEqual([])
  })
})
