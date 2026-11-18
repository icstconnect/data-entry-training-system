# Workspace Agent Rules — ICST LAB (icstconnect.in)

This application (**ICST LAB**) is an official interactive training property of **ICST Connect (`https://icstconnect.in`)**, developed for the **Institute of Computer Science and Technology, Chowberia**.

Every agent operating in this repository MUST follow these rules on every task.

---

## 1. Mandatory Project Memory Maintenance (`MEMORY.md`)

- **Read Before Large Changes**: Consult `MEMORY.md` at the repository root before refactoring architecture, routes, branding, SEO, or core services.
- **Always Update After Changes**: Whenever you add, rename, redesign, or remove a lab module, route/hash view, shared component, configuration constant, dependency, SEO artifact, or animation convention, you **MUST** update `MEMORY.md` before finishing the task:
  1. Update the relevant architecture / route / asset section if it changed.
  2. Append a concise dated entry (`YYYY-MM-DD`) under **Change Log** noting what changed and which key files were touched.
- Keep `MEMORY.md` concise, factual, and scannable so future sessions start with accurate context.

---

## 2. Mandatory Full SEO & Sitemap Optimization Protocol

Whenever adding or updating pages, views, labs, headings, logos, or public routes, enforce complete SEO hygiene:

1. **Sitemap & Crawlers (`public/sitemap.xml`, `public/robots.txt`)**:
   - Every public view or lab route (`#practice`, `#excel`, `#windows`, `#terminal`, `#typing`, `#word-express`, `#showcase`, `#dashboard`, and any new public view) MUST be listed in `public/sitemap.xml` with an updated `<lastmod>` (`YYYY-MM-DD`), `<changefreq>`, and `<priority>`.
   - Keep `public/robots.txt` valid, allowing public routes, disallowing instructor-only portals (`/#teacher`), and referencing `Sitemap: /sitemap.xml` and `Sitemap: https://icstconnect.in/sitemap.xml`.
2. **Static HTML & Structured Data (`index.html`)**:
   - Maintain complete primary meta tags (`title`, `description`, `keywords`, `robots`, `author`, `publisher`), `<link rel="canonical">`, `<link rel="sitemap">`, Open Graph (`og:*`), and Twitter Card (`twitter:*`) metadata.
   - Keep the JSON-LD `@graph` (`EducationalOrganization`, `WebSite`, `WebApplication`, `ItemList`) valid JSON and synchronized with all active labs and `isPartOf: https://icstconnect.in`.
   - Maintain the `<noscript>` semantic fallback with a direct link to `https://icstconnect.in`.
3. **Runtime Per-View SEO (`src/utils/dynamicTitle.ts`)**:
   - Every view in `App.tsx` MUST have a dedicated entry in `src/utils/dynamicTitle.ts` that updates `document.title`, `meta[name="description"]`, `og:title`, `og:description`, `twitter:title`, `twitter:description`, and canonical URL.
4. **Semantic HTML, Accessibility & Core Web Vitals**:
   - Use exactly one `<h1>` per active view and maintain logical `<h2>`/`<h3>` hierarchy.
   - Provide descriptive `alt`, explicit `width` and `height`, and `loading="lazy"` (for below-the-fold images) on all `<img>` tags to prevent layout shift (CLS).
   - Keep all public images web-optimized (avoid multi-megabyte PNGs in `public/`).
   - Preserve GIGW accessibility bar compatibility (`html[data-contrast="high"]`, zoom/font presets).

---

## 3. Official ICST Connect (`icstconnect.in`) Brand & Dual-Logo Attribution

- Always clearly communicate that this site is an **official property and interactive lab of ICST Connect (`https://icstconnect.in`)**.
- Use the centralized constants from `src/config/appConfig.ts` (`ICST_CONNECT` & `APP_CONFIG`) for all external portal links (`https://icstconnect.in`, `/courses`, `/online-test`, `/scholarships`, `/connect`).
- Always use the official project brand name **`ICST LAB`** consistently across all UI headers, footers, page titles, metadata, certificates, and manifests (never revert to "ICST Data Entry Lab").
- Preserve **both** official brand assets:
  - `/logo.png` — ICST LAB emblem.
  - `/icstconnect-logo.png` — Official ICST Connect logo fetched from `https://icstconnect.in/logo.png`.
- Ensure direct connections to `https://icstconnect.in` remain visible and accessible in the Header, Home Page, and Footer (`target="_blank" rel="noopener noreferrer"`).

---

## 4. UI Animation (`animejs` v4), PWA Cache & Build Verification

- **Anime.js v4**: Use named imports from `'animejs'` (`animate`, `createScope`, `stagger`, `spring`, etc.). Always wrap animations in `createScope({ root })` inside `useEffect` and call `scope.revert()` on cleanup. Animate GPU-composited properties (`transform`, `opacity`, `strokeDashoffset`) and respect `prefers-reduced-motion: reduce`.
- **Service Worker (`public/sw.js`)**: Whenever adding new critical public assets (logos, icons, sitemap, manifest), include them in `PRECACHE_ASSETS` and bump `CACHE_NAME`.
- **Build Gate**: Always run `npm run build` (`tsc -b && vite build`) after edits and resolve all TypeScript or bundler errors before concluding.
