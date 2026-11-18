# Project Memory — ICST LAB

> Living architectural memory for **ICST LAB** — an official interactive training property of **ICST Connect (`https://icstconnect.in`)**, Institute of Computer Science and Technology, Chowberia, Nadia, West Bengal.
>
> Maintained automatically per `AGENTS.md`.

---

## 1. Identity & Parent Ecosystem

- **Application Brand**: **ICST LAB** (unified brand name across all UI, SEO, PWA manifest, and certificates)
- **Parent Portal**: ICST Connect — `https://icstconnect.in`
- **Official Brand Logos**:
  - App Logo: `public/logo.png`
  - ICST Connect Logo (fetched from `https://icstconnect.in/logo.png`, optimized to 256×256 PNG): `public/icstconnect-logo.png`
- **Config Source of Truth**: `src/config/appConfig.ts` (`ICST_CONNECT` & `APP_CONFIG`)
- **Theme**: Eye-Care Warm Tone Palette (`--bg-main: #f9f6f0`, `--bg-surface: #fffdf9`, `--icst-blue: #1c6aa7`, `--icst-charcoal: #221e1a`) + GIGW Accessibility Bar (font size, page zoom, screen magnifier, speech reader, High Contrast yellow-on-black mode).

---

## 2. Tech Stack

- **UI**: React 19 + TypeScript 6 (`strict` build via `tsc -b`)
- **Bundler**: Vite 8 (`vite.config.ts`)
- **Animation**: `animejs` v4.5 (`animate`, `createScope`, `stagger`, `spring`)
- **Icons**: `lucide-react`
- **Effects**: `canvas-confetti` + HTML5 Canvas 2D achievement/certificate renderer
- **Offline**: Service Worker (`public/sw.js`, cache `icst-lab-v5`) + Web App Manifest (`public/manifest.json`) + `localStorage` persistence

---

## 3. Active Views & Interactive Labs (`src/App.tsx`)

| View ID | Hash Route | Module | Highlights |
| :--- | :--- | :--- | :--- |
| `landing` | `#home` / `/` | `src/components/landing/LandingPage.tsx` | Anime.js graphical hero, live 3-mode interactive preview (`Type`, `Grid`, `Sort`), filterable 6-lab explorer, 4-step animated journey, ICST Connect ecosystem bridge |
| `practice` | `#practice` | `src/components/practice/PracticeWorkbench.tsx` | Single-form & WBBSE/WBCHSE marksheets (5 Levels, 18 Stages) |
| `excel` | `#excel` | `src/components/excel/ExcelDashboard.tsx` & `ExcelWorkbench.tsx` | Excel 365 mass data entry (5 Scenarios, 5 SVG Trophies) |
| `windows` | `#windows` | `src/components/windows/WindowsDashboard.tsx` & `WindowsWorkbench.tsx` | Windows 11 file & folder organization (12 Levels) |
| `terminal` | `#terminal` | `src/components/terminal/TerminalDashboard.tsx` & `TerminalWorkbench.tsx` | Keyboard-driven Heads-Down Data Entry (5 Domains) |
| `typing` | `#typing` | `src/components/typing/TypingDashboard.tsx` & `TouchTypingWorkbench.tsx` | Light-beam kinesthetic touch typing (25 Levels) |
| `word-express` | `#word-express` | `src/components/wordExpress/WordExpressDashboard.tsx` & `WordExpressWorkbench.tsx` | Rapid word typing courier game (25 Stages, 16-Vehicle Fleet) |
| `student-dashboard` | `#dashboard` | `src/components/student/StudentDashboard.tsx` & `studentDashboard.css` | Anime.js v4 interactive Trainee Command Center: orbital EXP ring, rolling counter, clickable 5-rank ladder, 4 animated KPI cards, 6-lab mastery & quick-launch matrix, and tabbed Curriculum / Unified Trophy Vault (22 badges) / Animated Activity Chart |
| `showcase` | `#showcase` | `src/components/showcase/ShowcasePage.tsx` | Live promotional showcase & honors |
| `teacher-dashboard` | `#teacher` | `src/components/teacher/TeacherDashboard.tsx` | Instructor portal (passcode gated) |

---

## 4. SEO & Discoverability Assets

- **`index.html`**: Full SEO meta tags, Open Graph, Twitter Card, canonical URL, `<link rel="sitemap">`, JSON-LD `@graph` (`EducationalOrganization`, `WebSite`, `WebApplication`, `ItemList` linked to `https://icstconnect.in`), and `<noscript>` fallback.
- **`src/utils/dynamicTitle.ts`**: Runtime per-view updater for `document.title`, `meta[name="description"]`, `og:title`, `og:description`, `twitter:title`, `twitter:description`, and canonical URL.
- **`public/sitemap.xml`**: Complete XML sitemap covering ICST Connect root and all lab/public routes.
- **`public/robots.txt`**: Crawler directives allowing public pages, disallowing `/#teacher`, and declaring both `/sitemap.xml` and `https://icstconnect.in/sitemap.xml`.

---

## 5. Key Conventions & Gotchas

- Always wrap `animejs` v4 animations in `createScope({ root })` and revert on unmount to stay safe under React 19 StrictMode.
- Any new landing/header/footer CSS must include `html[data-contrast="high"]` overrides so GIGW High Contrast mode stays 100% legible.
- Never hardcode `localhost` in share URLs or canonical metadata.
- Keep `public/sw.js` `PRECACHE_ASSETS` synced and bump `CACHE_NAME` when adding new static public assets.

---

## 6. Change Log

- **2026-11-18**:
  - Fetched and optimized official ICST Connect logo (`https://icstconnect.in/logo.png` -> `public/icstconnect-logo.png`, 256×256, ~95 KB).
  - Added centralized `ICST_CONNECT` branding/portal URLs in `src/config/appConfig.ts`.
  - Upgraded `Header.tsx` and `Footer.tsx` with dual-logo brand lockups (`/logo.png` × `/icstconnect-logo.png`), direct `icstconnect.in` portal links, and interactive lab sitemap navigation.
  - Added full SEO stack: `public/sitemap.xml`, `public/robots.txt`, JSON-LD `@graph` & full OG/Twitter/canonical tags in `index.html`, and runtime per-view SEO meta syncing in `src/utils/dynamicTitle.ts`.
  - Redesigned `LandingPage.tsx` + `src/components/landing/landing.css` powered by `animejs` v4 with a live interactive hero playground (`Type`, `Grid`, `Sort`), custom graphical SVG lab cards with category filtering, animated 4-step journey, and ICST Connect ecosystem bridge.
  - Bumped Service Worker cache to `icst-data-entry-v4` in `public/sw.js` and updated `public/manifest.json`.
  - Established `AGENTS.md` workspace rules for mandatory memory updates, full SEO optimization, and ICST Connect brand integrity.
  - Unified project branding exclusively to **`ICST LAB`** across UI (`Header.tsx`, `Footer.tsx`, `LandingPage.tsx`, `ShowcasePage.tsx`, `AchievementShareModal.tsx`), config (`appConfig.ts`), SEO/PWA (`index.html`, `dynamicTitle.ts`, `manifest.json`, `sitemap.xml`, `robots.txt`, `sw.js` -> `icst-lab-v5`), and documentation (`AGENTS.md`, `MEMORY.md`, `README.md`).
  - Redesigned `#dashboard` (`src/components/student/StudentDashboard.tsx` + `studentDashboard.css`, wired all 6 lab launchers in `src/App.tsx`) with `animejs` v4 scoped animations: animated SVG orbital EXP ring, rolling EXP counter, clickable 5-rank career ladder with signal beam, 4 animated KPI telemetry cards, 6-lab interactive command matrix with proportional EXP stack bar, and a 3-tab interactive explorer (5-level Curriculum Roadmap, Unified 22-badge Trophy Vault with filters, and animated Activity & Speed accuracy bar chart).
  - Redesigned and animated with `animejs` v4 the 4 Module Landing / Dashboard Views ONLY (workbenches untouched) via shared `src/components/common/moduleDashboard.css`:
    - `#excel` (`ExcelDashboard.tsx`): Emerald hero, orbital completion ring, rolling EXP, interactive 3×3 cell ripple preview, scenario filters, animated trophy vault, and wired `ExcelEvaluationModal` record preview.
    - `#windows` (`WindowsDashboard.tsx`): Fluent Windows 11 hero, animated SVG folder-tree signal, orbital completion ring, dual File/Folder progress tracks with bouncing level pills, tabbed Pedagogical Curriculum Explorer, and Master Unlock modal.
    - `#typing` (`TypingDashboard.tsx`): Cyan kinesthetic hero, live interactive Home-Row keycap warmup (`A S D F J K L ;`), orbital 25-level ring, rolling WPM, animated KPIs, and Learning/Challenge stage filters (preserving Light/Dark theme & Fullscreen).
    - `#word-express` (`WordExpressDashboard.tsx`): Electric Violet courier runway hero with gliding SVG vehicle, orbital progress ring, spring-animated cookie-backed Toughness selector, interactive 16-Tier Fleet Spotlight showroom, and 25-stage grid.
    - `#terminal` (`TerminalDashboard.tsx`): Midnight Cyan HDDE dispatch hero, animated orbital batch ring, rolling Peak KPH & EXP counters, interactive voucher audit radar scanner, filterable 5-domain stream cards, animated operator certification badges, and preserved evaluation/share modals.
  - Animated persistent navigation bar (`src/components/common/Header.tsx`) with `animejs` v4: scoped initial mount stagger, brand logo hover spring, spring-animated desktop & mobile dropdown menus with staggered items, slide-over mobile drawer animation, EXP badge pop on gain, active-view spring feedback, and Practice sub-toolbar slide-down.
