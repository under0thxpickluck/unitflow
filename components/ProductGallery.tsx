'use client'
import Image from 'next/image'
import { useState } from 'react'
import NoImage from './NoImage'

interface Props {
  images: string[]
  alt: string
}

// 商品ページの写真。sedora に登録した写真が並び順どおりに全部届く
export default function ProductGallery({ images, alt }: Props) {
  const [index, setIndex] = useState(0)
  const current = images[index]

  return (
    <div>
      <div className="relative aspect-square bg-bg-secondary border border-white/10 rounded overflow-hidden">
        {current ? (
          <Image
            src={current}
            alt={images.length > 1 ? `${alt} — photo ${index + 1} of ${images.length}` : alt}
            fill
            className="object-contain p-8"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={index === 0}
          />
        ) : (
          <NoImage />
        )}
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 sm:grid-cols-6 gap-2" aria-label="Product photos">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={`relative block w-full aspect-square rounded overflow-hidden border bg-bg-secondary ${
                  i === index ? 'border-blue-500' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <Image src={src} alt="" fill className="object-contain p-1" sizes="96px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
