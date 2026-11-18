---
name: icst-modern-cursor-studio
description: >-
  Use when adding, editing, regenerating, or debugging ICST LAB's 5-theme modern
  SVG cursor system (41 cursors per theme x Light/Dark surface variants), Auto
  Dark/Light surface switching, Navigation Cursor Selector, or GPU-animated
  cursor overlays (Pulse Orbit & Prism Aurora).
---

# ICST LAB Modern Cursor Studio (5 Themes × 2 Tones × 41 Cursors)

ICST LAB uses a zero-lag native SVG cursor architecture paired with an optional GPU-composited 60fps animated companion layer for animated cursor themes.

## 1. System Architecture

| Layer | File(s) | Responsibility |
| :--- | :--- | :--- |
| **SVG Assets** | `public/cursors/<theme>/<surface>/*.svg` | 5 themes × 2 surfaces (`light`, `dark`) × 41 32×32 SVGs (`410` themed + `41` root fallbacks) |
| **Generator** | [generate-modern-cursors.mjs](./scripts/generate-modern-cursors.mjs) | Regenerates all 451 modern SVG cursors cleanly from palette + geometry specs |
| **CSS Tokens & UI** | `src/styles/icstCursors.css` | Defines `--cursor-*` tokens, `.cursor-*` & `[data-cursor="*"]` utilities, semantic bindings, inline `style` upgrades, animated overlay CSS, and Header Cursor Studio dropdown styles |
| **Engine & Auto Switch** | `src/utils/icstCursor.ts` | Persists theme (`icst_cursor_theme_v1`) & tone (`icst_cursor_tone_v1`), hydrates `:root` CSS vars synchronously (0 FOUC), runs passive surface luminance detection, and manages `icst-click`, `dragging`, and `setGlobalCursorState('loading'|'success'|'error'|null)` |
| **Animated Overlay** | `src/components/common/IcstAnimatedCursorOverlay.tsx` | 60fps `requestAnimationFrame` + `animejs` v4 companion layer for **Pulse Orbit** and **Prism Aurora**, portaled into `document.fullscreenElement || document.body` |
| **Navbar Selector** | `src/components/common/Header.tsx` | Desktop `Cursor` dropdown + Mobile drawer picker with live swatches, `Animated` badges, and `Auto | Light | Dark` switcher |

## 2. The 5 Cursor Themes

1. `fluent` (**ICST Fluent**, static) — Soft-cornered Win11-style delta arrow & floating pills.
2. `outlier` (**Outlier Minimal**, static) — Clean hollow rounded outline & chevron resizers (`< >`, `^ v`).
3. `stealth` (**Stealth Rim**, static) — Aerodynamic MMXX-style arrow with glowing concave bevel & dot-centered needles.
4. `pulse-orbit` (**Pulse Orbit**, animated) — Dart pointer + orbiting satellite ring, hover morph & `animejs` sonar click-ripple.
5. `prism-aurora` (**Prism Aurora**, animated) — Iridescent hollow prism + rotating conic aurora ring, 5-node kinetic comet trail & 6-spark click burst.

## 3. Critical Conventions

- **Asset Naming vs Appearance**:
  - `appearance: 'dark'` (dark-ink cursor over light pages) loads from `/cursors/<theme>/light/*.svg`.
  - `appearance: 'light'` (bright white/glowing cursor over dark pages or GIGW High Contrast) loads from `/cursors/<theme>/dark/*.svg`.
- **Auto Dark/Light Detection**: Only recompute surface luminance when `event.target !== lastTarget` to keep CPU overhead near zero; always force `'light'` appearance when `html[data-contrast="high"]` is active.
- **Fullscreen Compatibility**: Always portal animated cursor overlays into `document.fullscreenElement || document.body` via a `fullscreenchange` listener so animated cursors never disappear in Fullscreen Touch Typing or Word Express labs.
- **Browser SVG Cursor Rule**: Native `cursor: url(...)` SVGs are rasterized statically by browsers — keep base SVGs static and crisp (32×32, exact hotspot `x y`) and implement live motion inside `IcstAnimatedCursorOverlay.tsx`.
- **Stylesheet Consistency**: Use `cursor: var(--cursor-icst-pointer);`, `var(--cursor-cell)`, `var(--cursor-crosshair)`, `var(--cursor-move)`, `var(--cursor-not-allowed)` in CSS files rather than raw keywords.

## 4. Regenerating & Validating Cursors

1. Edit [generate-modern-cursors.mjs](./scripts/generate-modern-cursors.mjs) and run:
   ```powershell
   node .agent/skills/icst-modern-cursor-studio/scripts/generate-modern-cursors.mjs
   ```
2. Validate strict XML across all generated SVGs:
   ```powershell
   $files = Get-ChildItem public\cursors -Recurse -Filter *.svg; $bad = @(); foreach ($f in $files) { try { [void]([xml](Get-Content $f.FullName -Raw)) } catch { $bad += $f.FullName } }; Write-Output ("SVGs: {0} | InvalidXML: {1}" -f $files.Count, $bad.Count)
   ```
3. Update `public/sw.js` `PRECACHE_ASSETS` / bump `CACHE_NAME` if preview paths changed, then run `npm run build`.
