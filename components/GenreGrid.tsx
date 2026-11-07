import Link from 'next/link'
import { GENRES } from '@/lib/genres'

// PC パーツ以外のジャンルの一覧（トップページと Categories ページで使う）
export default function GenreGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {GENRES.map((g) => (
        <Link
          key={g.slug}
          href={`/genres/${g.slug}`}
          className="bg-bg-secondary border border-white/10 hover:border-white/20 rounded p-5 transition-colors group"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">{g.name}</h3>
            {!g.hasStock && (
              <span className="shrink-0 text-[10px] font-mono text-amber-300/90 border border-amber-800/60 px-1.5 py-0.5 rounded">
                Coming soon
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs leading-relaxed">{g.summary}</p>
        </Link>
      ))}
    </div>
  )
}
