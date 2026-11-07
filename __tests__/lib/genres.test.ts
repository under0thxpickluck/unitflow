import { GENRES, genreHeading, getGenre, inquiryPrefill } from '@/lib/genres'

describe('PC パーツ以外のジャンル', () => {
  it('URL に使える slug で、重ならない', () => {
    const slugs = GENRES.map((g) => g.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it('どれも名前・説明・例がある', () => {
    for (const g of GENRES) {
      expect(g.name.length).toBeGreaterThan(0)
      expect(g.summary.length).toBeGreaterThan(0)
      expect(g.description.length).toBeGreaterThan(0)
      expect(g.examples.length).toBeGreaterThan(0)
    }
  })

  it('今は掲載だけ（商品なし）', () => {
    expect(GENRES.every((g) => g.hasStock === false)).toBe(true)
  })

  it('slug で引け、問い合わせの欄にジャンル名を入れる', () => {
    expect(getGenre('trading-cards')?.name).toBe('Japanese Trading Cards')
    expect(getGenre('nope')).toBeUndefined()
    expect(inquiryPrefill(getGenre('watches')!)).toBe('Japanese Watches: ')
  })

  it('見出しで Japan を重ねない', () => {
    expect(genreHeading(getGenre('trading-cards')!)).toBe('Japanese Trading Cards')
    expect(genreHeading(getGenre('figures-hobby')!)).toBe('Figures & Hobby from Japan')
  })
})
