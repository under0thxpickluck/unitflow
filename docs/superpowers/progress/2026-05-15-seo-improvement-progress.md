# SEO Improvement — Progress

**Plan:** `docs/superpowers/plans/2026-05-15-seo-improvement.md`  
**Last updated:** 2026-05-15

---

## Completed

| # | Task | Commit(s) |
|---|------|-----------|
| 1 | Slug utility (`lib/slug.ts`) + Product type (`slug`, `partNumber?`, `updatedAt?`) + `.env.local.example` | `9a88439`, `6938341` |
| 2 | `lib/sedora.ts` — `RawProduct`, `attachSlug()`, `getProductBySlug()` | `9f5d030` |
| 3 | `ProductCard` — "Details" button, slug-based title link, updated tests | `03ab78d` |
| 4 | `/products/[slug]` canonical product detail page (metadata, Product schema, BreadcrumbList, related products) | `d832880`, `8243b86` |
| 5 | `/inventory/[id]` → `permanentRedirect('/products/[slug]')` | `fd58516`, `aa5ea6c` |
| 6 | `sitemap.ts` (slug URLs, all new pages, no `/inventory/[id]`) + `robots.ts` (`Disallow: /inventory/`) | `d59ed8e` |

---

## Pending

| # | Task | Notes |
|---|------|-------|
| 7 | Add `alternates.canonical` to all existing pages; keyword band on homepage; update category links | — |
| 8 | Improve Organization schema in `layout.tsx`; update `Footer.tsx` to use `NEXT_PUBLIC_EBAY_STORE_URL`, add Guides link | — |
| 9 | FAQPage JSON-LD + "Do you sell outside eBay?" item on `/faq` | — |
| 10 | Build `/categories/[category]` (7 sub-pages: cpu/memory/motherboard/gpu/psu/storage/oem-parts) | — |
| 11 | Build `/socket/[socket]` + `/memory/[type]` filter pages | — |
| 12 | Build `/quality-policy` page + convert `/quality` to `permanentRedirect` | — |
| 13 | Build guide index + 4 guide articles (buying from Japan, LGA1150, DDR3 memory, OEM motherboards) | — |
| 14 | Build `app/not-found.tsx` (404 page) | — |
| 15 | Final verification (tsc, tests, build, dev server) | — |
