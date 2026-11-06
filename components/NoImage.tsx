// 写真がまだ無い商品の代わりの表示（外部の仮画像サービスに頼らない）
export default function NoImage({ label = 'No Image' }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-gray-600" aria-hidden="true">
      {label}
    </div>
  )
}
