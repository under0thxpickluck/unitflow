# SEO Improvement — Progress

**Plan:** `docs/superpowers/plans/2026-05-15-seo-improvement.md`  
**Last updated:** 2026-05-21

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
| 7 | `alternates.canonical` on all existing pages + keyword band on homepage + category links → `/categories/[slug]` | `15fc6d1` |
| 8 | Organization schema enriched (logo, sameAs) + `Footer.tsx` uses `NEXT_PUBLIC_EBAY_STORE_URL` + Guides link | `4a15703` |
| 9 | FAQPage JSON-LD + "Do you sell outside eBay?" FAQ item on `/faq` | `980fbfc` |
| 10 | `/categories/[category]` sub-pages (7 variants: cpu/memory/motherboard/gpu/psu/storage/oem-parts) | `d5ebc38` |
| 11 | `/socket/[socket]` (lga1150, lga1155) + `/memory/[type]` (ddr3, ddr4) filter pages | `34d7b58` |
| 12 | `/quality-policy` canonical page + `/quality` → `permanentRedirect` | `a24c20b` |
| 13 | Guide index + 4 guide articles (buying from Japan, LGA1150, DDR3 memory, OEM motherboards) | `ebfaed9` |
| 14 | `app/not-found.tsx` (404 page) | `85e9b20` |
| 15 | Final verification (tsc ✓, jest 28/28 ✓, build 42 pages ✓) | `c1cd1b7` |

---

## Pending

None — all tasks complete.
