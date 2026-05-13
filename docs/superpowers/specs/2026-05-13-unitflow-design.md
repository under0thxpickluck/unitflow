# UNITFLOW JAPAN — Site Design Spec

**Date:** 2026-05-13  
**Project:** UNITFLOW JAPAN / JUNKFLOW AI  
**Purpose:** 海外向け中古PCパーツ輸出サイト

---

## 1. 目的・コンセプト

"日本の実在する中古PCパーツ輸出業者" として見えること。  
eBay補助・海外信用獲得・固定客・卸業者化・SEO流入・JUNKFLOW AIの母体構築が最終ゴール。

**デザイン思想:** Industrial Japanese Tech Supplier  
AIっぽさ・ノーコード感・未来感を徹底排除し、「実在感・倉庫感・現場感」を出す。

---

## 2. 技術スタック

| 項目 | 選択 |
|------|------|
| フレームワーク | Next.js 14（App Router） |
| スタイリング | Tailwind CSS |
| デプロイ | Vercel |
| 在庫データ | Sedora API（環境変数で設定） |
| メール送信 | Resend |
| 言語 | 英語メイン（SEO最大化） |

---

## 3. アーキテクチャ

```
unitflow/
├── app/
│   ├── page.tsx                    # Home
│   ├── layout.tsx                  # 共通レイアウト（Header/Footer）
│   ├── inventory/
│   │   ├── page.tsx                # 商品一覧（フィルター付き）
│   │   └── [id]/page.tsx           # 商品詳細
│   ├── categories/page.tsx         # カテゴリ一覧
│   ├── bulk-orders/page.tsx        # Bulk Orders
│   ├── about/page.tsx              # About Us
│   ├── quality/page.tsx            # Quality / Testing Policy
│   ├── shipping/page.tsx           # Shipping
│   ├── faq/page.tsx                # FAQ
│   ├── contact/page.tsx            # Contact
│   ├── privacy/page.tsx            # Privacy Policy
│   ├── terms/page.tsx              # Terms
│   ├── api/
│   │   ├── inventory/route.ts      # Sedoraフェッチ（60分キャッシュ）
│   │   └── contact/route.ts        # Resendメール送信
│   ├── sitemap.ts                  # 動的sitemap生成
│   └── robots.ts                   # robots.txt生成
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── ProductFilter.tsx
│   ├── StatusBadge.tsx
│   └── ContactForm.tsx
├── lib/
│   ├── sedora.ts                   # Sedora APIクライアント
│   └── resend.ts                   # メール送信ユーティリティ
├── types/
│   └── product.ts                  # Product型定義
└── .env.local
```

---

## 4. カラーパレット & フォント

```css
/* 背景 */
--bg-primary:   #0f1115
--bg-secondary: #161a20
--bg-tertiary:  #1d222b

/* テキスト */
--text-primary:   #ffffff
--text-secondary: #d1d5db
--text-muted:     #9ca3af

/* 状態色 */
--status-in-stock: green-500    /* 在庫あり */
--status-listed:   blue-500     /* 出品中 */
--status-junk:     orange-500   /* ジャンク */
--status-sold:     gray-500     /* 売却済 */
```

**フォント:** Inter + IBM Plex Sans（英語）、Noto Sans JP（日本語）

---

## 5. ページ構成

### 5.1 Home（`/`）

1. **Hero Section** — キャッチコピー "Reliable Used PC Parts from Japan" + CTAボタン3つ（Browse Inventory / Visit eBay Store / Bulk Orders）+ 右側実写写真プレースホルダー
2. **Live Inventory** — Sedoraから最新6件を動的表示（カテゴリ別）
3. **Inside Our Workshop** — 実写4枚グリッド（分解/検品/清掃/梱包）
4. **Why Buy From Japan** — 5カード（Carefully Tested / Genuine OEM Parts / Clean Business PCs / Reliable Packaging / Long-Term Supply）
5. **Bulk Orders CTA** — バナー形式、対象顧客（Repair shops / Schools / Linux server builders / Resellers / PC refurbishers）
6. **Today's Processing** — 毎日更新セクション（今日分解したPC・追加パーツ）。データは `public/today.json` を手動編集して更新

### 5.2 Inventory（`/inventory`）

- 商品一覧（グリッド表示）
- フィルター: カテゴリ / 状態 / Socket / メモリ規格 / ブランド（クライアントサイド）
- 商品カード: 画像・型番・状態バッジ・在庫状況・Buy on eBayボタン

### 5.3 Product Detail（`/inventory/[id]`）

- 左: 大画像
- 右: title / model / condition / tested / pulled from / socket / memory / watt / shipping
- 下部: 関連商品
- JSON-LD structured data（Product schema）

### 5.4 その他ページ

| ページ | 主要コンテンツ |
|--------|--------------|
| Categories | カテゴリグリッド（CPU/GPU/Memory等） |
| Bulk Orders | Mixed lots / Monthly sourcing / Long-term supply |
| About Us | 日本中古PC専門・法人PC中心・分解検品・海外発送 |
| Quality | 状態定義（Tested/Pulled from working PC/Untested/For parts/As-is） |
| Shipping | Ships from Japan・Tracking・Secure packaging・eBay global shipping |
| FAQ | 5項目（世界配送/テスト済/Bulk/組み合わせ/特定パーツ調達） |
| Contact | フォーム（Name/Company/Country/Email/eBay username/Parts/Quantity/Message） |
| eBay Store | eBay出品ページへの外部リダイレクト（`next.config.js` の `redirects` で設定） |

---

## 6. データモデル

```typescript
type Product = {
  id: string
  title_en: string
  title_ja: string
  category: 'CPU' | 'GPU' | 'Memory' | 'Motherboard' | 'PSU' | 'Storage'
  brand: string
  model: string
  socket?: string
  condition: 'Tested' | 'Untested' | 'For Parts' | 'As-is'
  tested: boolean
  ebay_url: string
  ebay_image_url: string
  stock: number
  listed_at: string
  sold_at?: string
}
```

---

## 7. データフロー

```
Sedora API
    ↓  GET /api/inventory（Next.js API Route）
    ↓  next: { revalidate: 3600 }（60分ISRキャッシュ）
    ↓
商品一覧ページ → 商品詳細ページ（generateStaticParams）
```

SedoraのAPIが未設定の場合、ダミーデータ（`lib/sedora.ts`内のfallback）を返す。

---

## 8. 環境変数

```env
SEDORA_API_URL=          # SedoraのAPIエンドポイント
SEDORA_API_KEY=          # SedoraのAPIキー
RESEND_API_KEY=          # ResendのAPIキー
CONTACT_TO_EMAIL=unitegawa@outlook.jp
```

---

## 9. SEO対策

- 全ページ個別 `metadata`（title / description / OGP / canonical）
- `sitemap.ts` で商品ページを動的生成
- `robots.ts` で自動生成
- JSON-LD structured data（商品ページ: Product schema、サイト全体: Organization schema）
- 狙うキーワード: `used PC parts Japan` / `used CPU Japan` / `used DDR3 memory Japan` / `OEM PC parts Japan`

---

## 10. eBay規約対策

**OK:** 商品カタログ化 / eBayリンク / "Buy on eBay" ボタン / 問い合わせフォーム  
**NG:** PayPal直接誘導 / eBay外決済 / "直接買えば安い" 表記

フッター必須文言:  
> All purchases are completed securely through eBay.

---

## 11. 写真プレースホルダー方針

実写写真が揃うまで、グレーのプレースホルダー（`next/image` + `placeholder="blur"`）を使用。  
写真が用意でき次第、`/public/images/` に追加するだけで反映される構造にする。

必要写真カテゴリ: 倉庫 / 作業（分解・検品・清掃） / 日本感 / 梱包 / 大量在庫
