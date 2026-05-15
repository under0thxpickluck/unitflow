# UNITFLOW JAPAN SEO Complete Improvement — Design Spec

**Date:** 2026-05-15  
**Status:** Approved

---

## Goal

Improve UNITFLOW JAPAN from a basic showcase site to a fully SEO-optimized used PC parts export site targeting international buyers. The site supports eBay sales, Google search acquisition, and bulk order inquiries.

---

## Constraints

- All purchases must funnel through eBay (no off-platform payment)
- English-first content
- Existing dark/industrial design direction is preserved
- Sedora API returns the current `Product` type fields only (no partNumber, slug, price from API)
- Domain and eBay Store URL are still TBD — use environment variables throughout

---

## Section 1: Data Layer

### Product type changes (`types/product.ts`)

Add `slug` and `partNumber` fields:

```ts
export interface Product {
  id: string
  slug: string           // computed in sedora.ts on load
  title_en: string
  title_ja: string
  category: ProductCategory
  brand: string
  model: string
  partNumber?: string    // used in SEO if available; falls back to model
  socket?: string
  memoryType?: string
  condition: ProductCondition
  tested: boolean
  ebay_url: string
  ebay_image_url: string
  stock: number
  listed_at: string
  updatedAt?: string     // used in sitemap lastModified
  sold_at?: string
}
```

### Slug generation (`lib/sedora.ts`)

`createSlug()` is a pure utility function — single source of truth:

```ts
export function createSlug(p: Omit<Product, 'slug'>): string {
  return [p.brand, p.model, p.socket, p.category]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

`getProducts()` attaches `slug` to every product after fetching from Sedora.

`getProductBySlug(slug: string)` scans all products and returns the first match. If two products produce the same slug (same model, multiple units), the first one wins — this is intentional since one model = one SEO page.

---

## Section 2: Routing Architecture

### New and changed routes

```
app/
  products/
    [slug]/page.tsx          # NEW: main product detail page
  inventory/
    [id]/page.tsx            # CHANGED: fetches product, calls permanentRedirect() to /products/[slug]
    layout.tsx               # keep (wraps inventory list page)
  categories/
    page.tsx                 # EXISTING: improve with sub-category links
    [category]/page.tsx      # NEW: cpu | memory | motherboard | gpu | psu | storage | oem-parts
  socket/
    [socket]/page.tsx        # NEW: lga1150 | lga1155 | etc.
  memory/
    [type]/page.tsx          # NEW: ddr3 | ddr4 | etc.
  guides/
    page.tsx                 # NEW: guide index
    [slug]/page.tsx          # NEW: 4 static guide articles
  not-found.tsx              # NEW: 404 page
  quality/page.tsx           # EXISTING: add permanentRedirect() → /quality-policy
  quality-policy/page.tsx    # NEW: canonical quality page (move content from /quality)
```

### Redirect strategy for `/inventory/[id]`

`next.config` redirects cannot handle dynamic slug lookup, so `app/inventory/[id]/page.tsx` is converted to:

```ts
export default async function OldProductPage({ params }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()
  permanentRedirect(`/products/${product.slug}`)  // 308
}
```

### Guide articles (static TSX)

Four guide pages implemented as plain TSX files (no MDX). Content is written directly in the component. Structure is MDX-compatible for future migration.

Files:
- `guides/buying-used-pc-parts-from-japan/page.tsx`
- `guides/lga1150-cpus-worth-buying/page.tsx`
- `guides/ddr3-memory-buying-guide/page.tsx`
- `guides/oem-motherboards-explained/page.tsx`

---

## Section 3: SEO & Schema Strategy

### Canonical

Every page sets `alternates.canonical`. `metadataBase` in `app/layout.tsx` is already configured.

| Page | Canonical |
|------|-----------|
| `/products/[slug]` | `/products/${slug}` |
| `/categories/cpu` | `/categories/cpu` |
| `/socket/lga1150` | `/socket/lga1150` |
| `/memory/ddr3` | `/memory/ddr3` |
| `/guides/[slug]` | `/guides/${slug}` |

### JSON-LD per page

| Page | Schemas |
|------|---------|
| `layout.tsx` (all pages) | Organization (improve existing) |
| `/products/[slug]` | Product + BreadcrumbList |
| `/categories/[category]` | BreadcrumbList |
| `/socket/[socket]` | BreadcrumbList |
| `/faq` | FAQPage (add to existing page) |
| `/guides/[slug]` | Article + BreadcrumbList |

### Meta title templates

```
Product:   "[Product Name] | Used PC Parts from Japan | UNITFLOW JAPAN"
Category:  "Used [Category] from Japan | UNITFLOW JAPAN"
Socket:    "[Socket] CPUs and Motherboards from Japan | UNITFLOW JAPAN"
Memory:    "Used [Type] Memory from Japan | UNITFLOW JAPAN"
Guide:     "[Guide Title] | UNITFLOW JAPAN"
```

### sitemap.ts changes

Add URLs:
- `/products/[slug]` for all products (priority 0.8, daily)
- `/categories/cpu`, `/categories/memory`, `/categories/motherboard`, `/categories/gpu`, `/categories/psu`, `/categories/storage`, `/categories/oem-parts` (priority 0.7, weekly)
- `/socket/lga1150`, `/socket/lga1155` (priority 0.6, weekly)
- `/memory/ddr3` (priority 0.6, weekly)
- `/guides`, `/guides/buying-used-pc-parts-from-japan`, `/guides/lga1150-cpus-worth-buying`, `/guides/ddr3-memory-buying-guide`, `/guides/oem-motherboards-explained` (priority 0.6, monthly)
- `/quality-policy` (priority 0.5, monthly)

Remove: `/inventory/[id]` (301 redirects only, do not index)

### robots.ts changes

Add `Disallow: /inventory/` to prevent crawlers from following redirect URLs and wasting crawl budget.

---

## Section 4: New Pages & Component Changes

### `/products/[slug]` (main product detail page)

Replaces `/inventory/[id]` as the canonical product page.

Content:
1. Breadcrumb: Home > Inventory > [Category] > [Product Name]
2. H1: product title
3. Product image (next/image, priority, optimized alt)
4. Spec table: model, brand, category, socket, condition, tested, pulled from, ships from
5. Auto-generated condition description paragraph
6. "Buy on eBay" CTA button (full width)
7. "View eBay Listing" secondary link
8. "All purchases are completed securely through eBay." trust line
9. Related products: same category, same socket (up to 4)
10. Internal links: category page, socket page if applicable

Product schema includes: name, image, brand, sku (id), itemCondition, offers (url=ebayUrl, availability, seller).

### `/categories/[category]`

Dynamic route supporting: `cpu | memory | motherboard | gpu | psu | storage | oem-parts`

Content:
- H1 + description from spec
- Product grid (filtered from Sedora)
- Internal links to related socket/memory pages
- Link to Bulk Orders

### `/socket/[socket]` and `/memory/[type]`

Same pattern: H1 + body text + filtered product grid + internal links.

### `/guides/[slug]` (4 static articles)

Each article:
- Full Article JSON-LD (headline, datePublished, author: UNITFLOW JAPAN)
- H1 from spec
- Body content organized into H2 sections
- Internal links to relevant category/product pages and Bulk Orders CTA at end

### `app/not-found.tsx`

```
Part Not Found
The item may have been sold or removed from inventory.
[Browse Inventory]  [Visit eBay Store]
```

### Component: `ProductCard.tsx`

Add "Details →" button linking to `/products/${product.slug}`.  
Keep "Buy on eBay →" button.  
Update `href` from `/inventory/${product.id}` on title link to `/products/${product.slug}`.

### Component: `Footer.tsx`

Ensure "All purchases are completed securely through eBay." is present.  
"Visit eBay Store" button uses `NEXT_PUBLIC_EBAY_STORE_URL`.

### Environment variables

Add to `.env.local.example`:
```env
NEXT_PUBLIC_SITE_URL=https://unitflow.jp
NEXT_PUBLIC_EBAY_STORE_URL=https://www.ebay.com/str/YOUR_EBAY_STORE
```

---

## Implementation Phases (all in one pass)

### Phase 1 — Core SEO (highest priority)
1. Extend `Product` type with `slug`
2. Add `createSlug()` + `getProductBySlug()` to `lib/sedora.ts`
3. Build `/products/[slug]` page with full metadata, Product schema, BreadcrumbList
4. Convert `/inventory/[id]` to permanent redirect
5. Update `ProductCard` with `slug`-based links + "Details" button
6. Update `sitemap.ts` (add product slugs, remove `/inventory/[id]`)
7. Update `robots.ts` (disallow `/inventory/`)
8. Add canonical to all existing pages

### Phase 2 — Category & Structure SEO
1. Build `/categories/[category]` (7 sub-pages)
2. Build `/socket/[socket]` (lga1150, lga1155)
3. Build `/memory/[type]` (ddr3)
4. Add FAQPage schema to `/faq`
5. Add BreadcrumbList schema to category/socket/memory pages
6. Strengthen internal links across all pages

### Phase 3 — Content & Trust
1. Build `/guides` index + 4 guide articles
2. Build `app/not-found.tsx`
3. Add Article schema to guide pages
4. Review and improve `/about`, `/quality`, `/shipping`, `/bulk-orders` H1/H2 structure
5. Validate Organization schema in layout
6. Final sitemap review

---

## Completion Criteria

- [ ] `/products/[slug]` opens for all products with unique title/description
- [ ] Product schema present on all product pages
- [ ] sitemap.xml contains product slug URLs (not `/inventory/[id]`)
- [ ] robots.txt disallows `/inventory/`
- [ ] canonical set on every page
- [ ] Top / Inventory / Product / Category pages are internally linked
- [ ] No off-platform payment prompts
- [ ] "Buy on eBay" CTA present on all product pages
- [ ] SEO-correct H1/H2 structure on all pages
- [ ] All images have descriptive alt attributes
- [ ] Mobile layout intact
