---
name: icst-lab-branding-seo-pwa
description: >-
  Use when updating ICST LAB branding, logos, favicons, PWA icons, SEO metadata,
  sitemaps, Service Worker precache, or project memory (MEMORY.md). Enforces
  official ICST Connect (icstconnect.in) dual-logo attribution and full SEO/PWA hygiene.
---

# ICST LAB Branding, SEO, Icons & PWA Protocol

Follow this runbook whenever adding routes/labs or updating logos, favicons, metadata, or static public assets in **ICST LAB**.

## 1. Brand Identity & Dual-Logo Rules

- Always use the unified brand name **`ICST LAB`** across UI, titles, manifests, certificates, and docs (never revert to "ICST Data Entry Lab").
- Always preserve **both** brand logos and keep direct `https://icstconnect.in` links (`target="_blank" rel="noopener noreferrer"`) visible in Header, Home Page, and Footer:
  - `/logo.png` (and `/logo-icst.png`, `src/assets/logo.png`) — ICST LAB flask-ribbon emblem (512×512 transparent PNG).
  - `/icstconnect-logo.png` — Official ICST Connect logo (256×256 PNG, never overwrite when changing the ICST LAB emblem).
- Read portal URLs from `src/config/appConfig.ts` (`ICST_CONNECT` and `APP_CONFIG`) instead of hardcoding URLs or `localhost`.

## 2. Logo, Favicon & PWA Icon Pipeline

When replacing the website emblem from a source PNG:
1. Remove any lingering SVG Vite placeholders (`public/favicon.svg`, `src/assets/vite.svg`) — browsers prioritize `<link rel="icon" type="image/svg+xml">` over PNG favicons.
2. Compute the tight non-transparent alpha bounding box of the source PNG and render square-centered bicubic outputs:
   - Logos: `public/logo.png`, `public/logo-icst.png`, `src/assets/logo.png` (`512×512`)
   - Favicons: `public/favicon-32x32.png` (`32×32`), `public/favicon.png` (`64×64`)
   - Standard PWA icons: `public/icon-192.png`, `public/icon-512.png`
   - Maskable PWA icons: `public/icon-maskable-192.png`, `public/icon-maskable-512.png` (`#ffffff` background + 16% safe-zone padding)
3. Update `index.html` `<link rel="icon">` and `<link rel="apple-touch-icon">` tags exclusively to the PNG icons.
4. Keep all `public/` images web-optimized (avoid multi-MB PNGs) and provide explicit `width`, `height`, `alt`, and `loading="lazy"` (below the fold) on `<img>` tags.

## 3. Full SEO & Sitemap Sync

Whenever adding or renaming a public view/lab:
1. **`public/sitemap.xml`**: Add/update the hash route with `<lastmod>` (`YYYY-MM-DD`), `<changefreq>`, and `<priority>`.
2. **`public/robots.txt`**: Allow public routes, disallow `/#teacher`, and keep both `Sitemap: /sitemap.xml` and `Sitemap: https://icstconnect.in/sitemap.xml`.
3. **`index.html`**: Keep primary meta tags, canonical link, OG/Twitter tags, `<noscript>` fallback linking to `https://icstconnect.in`, and valid JSON-LD `@graph` (`EducationalOrganization`, `WebSite`, `WebApplication`, `ItemList`) synchronized.
4. **`src/utils/dynamicTitle.ts`**: Add a dedicated runtime SEO entry updating `document.title`, `meta[name="description"]`, `og:*`, `twitter:*`, and canonical URL.
5. Maintain exactly one `<h1>` per active view and logical `<h2>`/`<h3>` hierarchy.

## 4. Service Worker & Memory Verification Gate

1. **`public/sw.js`**: Add new critical static assets to `PRECACHE_ASSETS` and bump `CACHE_NAME` (e.g., `icst-lab-v8` -> `icst-lab-v9`).
2. **`MEMORY.md`**: Update relevant architecture sections and append a dated (`YYYY-MM-DD`) bullet under **Change Log**.
3. Run `npm run build` (`tsc -b && vite build`) and inspect `dist/` to confirm zero TypeScript/bundler errors and all expected public assets copied cleanly.
