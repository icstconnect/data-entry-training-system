# Project Memory — ICST LAB

> Living architectural memory for **ICST LAB** — an official interactive training property of **ICST Connect (`https://icstconnect.in`)**, Institute of Computer Science and Technology, Chowberia, Nadia, West Bengal.
>
> Maintained automatically per `AGENTS.md`.

---

## 1. Identity & Parent Ecosystem

- **Application Brand**: **ICST LAB** (unified brand name across all UI, SEO, PWA manifest, and certificates)
- **Parent Portal**: ICST Connect — `https://icstconnect.in`
- **Official Brand Logos & Icons**:
  - App Logo (ICST LAB flask-ribbon emblem, 512×512 PNG): `public/logo.png`, `public/logo-icst.png`, `src/assets/logo.png`
  - Favicons & PWA Icons: `public/favicon-32x32.png`, `public/favicon.png` (64×64), `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-192.png`, `public/icon-maskable-512.png`
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
- **Offline**: Service Worker (`public/sw.js`, cache `icst-lab-v8`) + Web App Manifest (`public/manifest.json`) + `localStorage` persistence
- **Modern Multi-Theme Cursor Studio**: 5 selectable modern cursor themes (`ICST Fluent`, `Outlier Minimal`, `Stealth Rim`, animated `Pulse Orbit`, animated `Prism Aurora`) × 2 auto-switching surface tones (Light & Dark) × 41 SVG cursors (`public/cursors/<theme>/<surface>/*.svg`), selectable from the `Header.tsx` Navigation Cursor Selector (persisted in `localStorage` as default), with automatic real-time Light/Dark surface luminance detection (`src/utils/icstCursor.ts`), manual `Auto | Light | Dark` override, GIGW High Contrast adaptation, and GPU-composited 60fps `animejs` v4 animated companion overlay (`src/components/common/IcstAnimatedCursorOverlay.tsx`, fullscreen-portal aware).

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
  - Added mobile & tablet physical keyboard guidance (`src/components/common/PhysicalKeyboardNotice.tsx` + `physicalKeyboardNotice.css`) for both typing labs (`TypingDashboard.tsx`, `TouchTypingWorkbench.tsx`, `WordExpressDashboard.tsx`, `WordExpressWorkbench.tsx`): auto-detects mobile/tablet viewports and touch devices, renders an `animejs` v4 scoped SVG illustration (OTG cable plug + signal pulse + Bluetooth waves + home-row keyboard ripple) with bilingual **English + সহজ বাংলা** instructions, live physical key detection feedback, inline banner on dashboards, dismissible entry modal on workbenches, and GIGW High Contrast support.
  - Replaced default Vite logo/favicon (`public/favicon.svg`, `src/assets/vite.svg` removed) with the new ICST LAB flask-ribbon emblem across website logos (`public/logo.png`, `public/logo-icst.png`, `src/assets/logo.png`), browser favicons (`public/favicon-32x32.png`, `public/favicon.png`), and PWA icons (`public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-192.png`, `public/icon-maskable-512.png`); updated `index.html` favicon links and bumped Service Worker cache (`public/sw.js` -> `icst-lab-v6`) while preserving `public/icstconnect-logo.png`.
  - Generated and integrated a complete 41-cursor brand-matched ICST LAB SVG cursor suite (`public/cursors/*.svg`) covering all Standard & navigation (7), Selection & interaction (7), Drag & drop (5 incl. custom `dragging`), Resize (14), Zoom (2), and Custom ICST Labs states (6: `icst-default`, `icst-pointer`, `icst-click`, `icst-loading`, `icst-success`, `icst-error`); added CSS token/utility/semantic stylesheet (`src/styles/icstCursors.css`), typed registry & runtime controller (`src/utils/icstCursor.ts`), wired into `src/main.tsx` and all app CSS files, and bumped Service Worker cache (`public/sw.js` -> `icst-lab-v7`).
  - Modernized the entire cursor suite into **5 selectable cursor themes** inspired by Windows 11 Concept, Outlier / Lightsout, MMXX, Modest, Remus, and Neon Rim packs (`public/cursors/<theme>/<surface>/*.svg` — 410 themed SVGs + 41 fallbacks): 3 crisp static themes (**ICST Fluent**, **Outlier Minimal**, **Stealth Rim**) + 2 animated themes (**Pulse Orbit** & **Prism Aurora** powered by GPU-composited `IcstAnimatedCursorOverlay.tsx` + `animejs` v4 click sonar/sparks with Fullscreen portal support); added real-time **Auto Dark/Light** surface luminance switcher (+ manual `Auto | Light | Dark` control & GIGW High Contrast sync) and the **Navigation Cursor Selector** dropdown in `Header.tsx` (desktop + mobile drawer), persisted in `localStorage`, and bumped Service Worker cache (`public/sw.js` -> `icst-lab-v8`).
  - Exported 6 reusable project-specific Antigravity workspace skills to `.agent/skills/` (`icst-lab-branding-seo-pwa`, `icst-animejs-v4-ui-motion`, `icst-typing-labs-architecture`, `icst-modern-cursor-studio` + portable `scripts/generate-modern-cursors.mjs`, `icst-module-dashboard-design`, and `icst-windows-powershell-build-ops`) along with `.agent/README.md`.
  - Captured 9 live high-resolution website screenshots into `docs/screenshots/` (`01-landing-home.png` through `09-mobile-home.png`) via headless Chrome and rewrote `README.md` into a full graphical showcase featuring dual-logo hero banner, shields badges, side-by-side screenshot gallery, Mermaid architecture diagram, live SVG Cursor Studio preview table, all 6 labs breakdown, and `.agent/` skills index.
