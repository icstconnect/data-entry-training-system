---
name: icst-module-dashboard-design
description: >-
  Use when designing or updating ICST LAB's Header navigation, Landing Page,
  Student Command Center Dashboard, or module landing dashboards (Excel, Windows,
  Terminal, Typing, Word Express) while preserving Eye-Care Warm Tone theming,
  GIGW High Contrast mode, and untouched workbench isolation.
---

# ICST LAB Module Dashboard & Navigation Design System

## 1. Visual Theme & Accessibility Foundation

- **Eye-Care Warm Tone Palette** (`src/index.css`):
  - `--bg-main: #f9f6f0`, `--bg-surface: #fffdf9`, `--bg-subtle: #f2ece0`, `--border-light: #e4ddd0`
  - `--icst-blue: #1c6aa7`, `--icst-charcoal: #221e1a`, `--text-primary: #1c1915`
- **GIGW Accessibility Compliance**:
  - Every new UI surface, dropdown, card, pill, or modal MUST include `html[data-contrast="high"]` overrides (`#000000` background, `#ffff00` foreground/border, inverted `#ffff00` bg / `#000000` text for active states) so government accessibility presets stay 100% legible.
  - Keep layout resilient across GIGW font-size (`A-` to `A++`) and page-zoom presets.

## 2. Navigation Bar Pattern (`src/components/common/Header.tsx`)

- Group labs cleanly into semantic dropdowns rather than flat overflowing buttons:
  - `Data Entry ▾` (Practice, Excel, Terminal)
  - `OS & Typing ▾` (Windows, Typing, Word Express)
  - `Dashboard` (direct button)
  - `Portal ▾` (Teacher Mode, Live Showcase)
  - `Cursor ▾` (5-theme Cursor Studio + Auto Light/Dark switcher)
- Coordinate all desktop dropdowns through a single `openDropdown` state so opening one closes others, and close on outside `mousedown` or `Escape`.
- Mirror all navigation groups & controls cleanly inside the slide-over mobile drawer (`<= 1060px`).

## 3. Module Landing Dashboards (`src/components/common/moduleDashboard.css`)

- **Isolation Rule**: When redesigning a module's landing/dashboard view (`ExcelDashboard`, `WindowsDashboard`, `TerminalDashboard`, `TypingDashboard`, `WordExpressDashboard`), keep the actual interactive `*Workbench.tsx` untouched unless explicitly requested.
- **Shared Signature Pattern**:
  - Distinct themed hero card with live interactive micro-preview (e.g., 3×3 Excel cell ripple, Windows folder-tree signal, Home-Row warmup keycaps, gliding Word Express vehicle, Terminal voucher audit radar).
  - Animated SVG orbital completion ring + rolling EXP/WPM/KPH counters via `animejs` v4.
  - Filterable stage/scenario grids and preserved evaluation/trophy/share modals.
- **Student Command Center (`#dashboard`)**:
  - `StudentDashboard.tsx` + `studentDashboard.css`: Orbital EXP ring, clickable 5-rank career ladder with signal beam, 4 KPI cards, 6-lab quick-launch command matrix, and 3-tab explorer (Curriculum Roadmap, Unified 22-badge Trophy Vault, Activity & Speed Chart).

## 4. Verification

- Test that clicking every lab launcher routes cleanly through `App.tsx` hash state.
- Check GIGW High Contrast overrides in CSS and run `npm run build` (`tsc -b && vite build`).
