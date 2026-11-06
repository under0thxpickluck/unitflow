export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function createSlug(fields: {
  brand: string
  model: string
  socket?: string
  category: string
}): string {
  return slugify([fields.brand, fields.model, fields.socket, fields.category].filter(Boolean).join(' '))
}

/** 決まった入力から決まった短い文字列 */
export function shortHash(text: string): string {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(36).padStart(6, '0').slice(0, 6)
}

/**
 * 同じ slug が2件以上あれば、その全員に「名前・カテゴリ・状態」由来の短いハッシュを付ける。
 * 別の商品ページが同じ URL になって片方が見えなくなるのを防ぐ（sedora 側でも同じことをしている）。
 */
export function uniqueSlugs<T extends { slug: string; title_en: string; category: string; condition: string }>(
  products: T[],
): T[] {
  const counts = new Map<string, number>()
  for (const p of products) counts.set(p.slug, (counts.get(p.slug) ?? 0) + 1)
  const used = new Set<string>()
  return products.map((p) => {
    let slug = p.slug
    if (!slug || (counts.get(slug) ?? 0) > 1) {
      slug = [slug, shortHash(`${p.category}::${p.title_en}::${p.condition}`)].filter(Boolean).join('-')
    }
    // それでも重なる（完全に同じ名前・状態が別 id で届いた）ときは番号を足す
    let candidate = slug
    for (let n = 2; used.has(candidate); n++) candidate = `${slug}-${n}`
    used.add(candidate)
    return { ...p, slug: candidate }
  })
}
