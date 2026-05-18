import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#0f1117',
          padding: '60px 80px',
          justifyContent: 'flex-end',
        }}
      >
        <div style={{ color: '#6b7280', fontSize: 18, marginBottom: 20, letterSpacing: 4 }}>
          SHIPS FROM JAPAN · EBAY VERIFIED SELLER
        </div>
        <div style={{ color: '#ffffff', fontSize: 64, fontWeight: 700, lineHeight: 1.1, marginBottom: 16 }}>
          UNITFLOW JAPAN
        </div>
        <div style={{ color: '#9ca3af', fontSize: 26 }}>
          Reliable Used PC Parts from Japan
        </div>
      </div>
    ),
    size
  )
}
