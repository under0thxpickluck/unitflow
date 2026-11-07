// PC パーツ以外のジャンル（掲載だけ。今は商品なし）。
//
// hasStock が false の間は：
//   - ページは「まだ出品なし・探してほしい物を問い合わせ」の案内だけ
//   - 検索エンジンには載せない（noindex・sitemap に入れない）。中身の無いページは評価を下げるため
// 商品を扱い始めたら hasStock を true にする。
//
// 並びは sedora のトレンド日次報告（日本の人気商品）と揃えている。

export interface Genre {
  slug: string
  name: string
  /** カードや一覧に出す短い説明 */
  summary: string
  /** ページ本文 */
  description: string
  /** 扱う予定の例 */
  examples: string[]
  hasStock: boolean
}

export const GENRES: Genre[] = [
  {
    slug: 'trading-cards',
    name: 'Japanese Trading Cards',
    summary: 'Pokémon, One Piece and Yu-Gi-Oh! cards in Japanese editions.',
    description:
      'Japanese-language trading card game singles, promos and sealed products, sourced in Japan. Card condition will be stated on every listing.',
    examples: ['Pokémon TCG (Japanese)', 'One Piece Card Game', 'Yu-Gi-Oh! OCG', 'Promo and prize cards', 'Sealed boxes and packs'],
    hasStock: false,
  },
  {
    slug: 'figures-hobby',
    name: 'Figures & Hobby',
    summary: 'Anime figures, Ichiban Kuji prizes and Gunpla model kits.',
    description:
      'Anime and game figures, Ichiban Kuji prize items and plastic model kits released in Japan, including Japan-only and limited releases.',
    examples: ['Scale and prize figures', 'Ichiban Kuji prizes', 'Gunpla model kits', 'Garage and limited releases'],
    hasStock: false,
  },
  {
    slug: 'video-games',
    name: 'Video Games & Consoles',
    summary: 'Japanese-region games, consoles and retro hardware.',
    description:
      'Japanese-region video games and consoles, from current platforms to retro hardware. Region compatibility will be noted on every listing.',
    examples: ['Famicom / Super Famicom', 'Game Boy / Game Boy Advance', 'Sega Saturn / PC Engine', 'Japanese-region Nintendo and PlayStation titles'],
    hasStock: false,
  },
  {
    slug: 'cameras-lenses',
    name: 'Cameras & Lenses',
    summary: 'Japanese film cameras, digital cameras and lenses.',
    description:
      'Film and digital cameras and lenses from Japanese makers, sourced in Japan. Functional checks and optical condition will be described on every listing.',
    examples: ['35mm film cameras', 'Compact digital cameras', 'Interchangeable lenses', 'Camera accessories'],
    hasStock: false,
  },
  {
    slug: 'watches',
    name: 'Japanese Watches',
    summary: 'Seiko, Citizen, Casio and other Japanese watches.',
    description: 'Wristwatches from Japanese brands, including Japan-domestic models.',
    examples: ['Seiko', 'Citizen', 'Casio G-SHOCK', 'Japan-domestic models'],
    hasStock: false,
  },
  {
    slug: 'character-goods',
    name: 'Character Goods',
    summary: 'Sanrio, Pokémon Center goods, Tamagotchi and more.',
    description: 'Character merchandise sold in Japan, including store-exclusive and Japan-only items.',
    examples: ['Sanrio goods', 'Pokémon Center items', 'Tamagotchi', 'Plush and stationery'],
    hasStock: false,
  },
  {
    slug: 'vinyl-music',
    name: 'Vinyl & Music',
    summary: 'Japanese pressings, city pop and records with obi.',
    description: 'Records and music media pressed in Japan, including city pop and releases with the original obi strip.',
    examples: ['City pop LPs', 'Japanese pressings with obi', 'Anime and game soundtracks', 'CDs and cassettes'],
    hasStock: false,
  },
  {
    slug: 'kitchen-crafts',
    name: 'Kitchen Knives & Crafts',
    summary: 'Japanese kitchen knives, pottery and tableware.',
    description: 'Japanese kitchen knives, pottery and tableware from regional makers.',
    examples: ['Gyuto, santoku and nakiri knives', 'Kutani, Imari and Arita ware', 'Tea bowls and tableware'],
    hasStock: false,
  },
  {
    slug: 'kimono-textiles',
    name: 'Kimono & Textiles',
    summary: 'Kimono, obi, haori and Japanese textiles.',
    description: 'Pre-owned kimono, obi, haori and other Japanese textiles. Size and condition will be stated on every listing.',
    examples: ['Kimono and yukata', 'Obi belts', 'Haori jackets', 'Fabric and accessories'],
    hasStock: false,
  },
  {
    slug: 'fishing-golf',
    name: 'Fishing & Golf',
    summary: 'Japanese fishing reels and golf clubs.',
    description: 'Fishing reels and tackle and golf clubs from Japanese makers, including Japan-domestic models.',
    examples: ['Shimano and Daiwa reels', 'Japan-domestic rods and tackle', 'Japanese golf clubs'],
    hasStock: false,
  },
  {
    slug: 'manga-books',
    name: 'Manga & Books',
    summary: 'Japanese-language manga sets and art books.',
    description: 'Japanese-language manga, complete sets and art books, sourced in Japan.',
    examples: ['Complete manga sets', 'Art books and guidebooks', 'Magazines'],
    hasStock: false,
  },
]

export function getGenre(slug: string): Genre | undefined {
  return GENRES.find((g) => g.slug === slug)
}

/** ページの見出し。名前に Japan が入っていれば「from Japan」を重ねない */
export function genreHeading(genre: Genre): string {
  return /japan/i.test(genre.name) ? genre.name : `${genre.name} from Japan`
}

/** 問い合わせフォームに入れておく文 */
export function inquiryPrefill(genre: Genre): string {
  return `${genre.name}: `
}
