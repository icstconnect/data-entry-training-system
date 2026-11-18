---
name: icst-animejs-v4-ui-motion
description: >-
  Use when adding or editing UI animations, hero choreography, SVG orbital rings,
  rolling stat counters, spring dropdowns, or particle effects in ICST LAB using
  animejs v4.5 with React 19 and strict TypeScript 6.
---

# ICST LAB Anime.js v4 UI Motion Guide

All interactive motion in ICST LAB uses **`animejs` v4.5** with React 19 StrictMode and strict TypeScript (`tsc -b`).

## 1. Mandatory Import & Cleanup Pattern

- Use named imports from `'animejs'` (`animate`, `createScope`, `stagger`, `spring`).
- Always wrap animations inside `createScope({ root })` in `useEffect` and call `scope.revert()` on cleanup so React 19 StrictMode double-mounts never leave orphaned animations or stuck inline styles.
- Always short-circuit when the user prefers reduced motion:

```tsx
useEffect(() => {
  const root = rootRef.current;
  if (!root) return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const scope = createScope({ root }).add(() => {
    animate('.card-item', {
      translateY: [14, 0],
      opacity: [0, 1],
      duration: 460,
      delay: stagger(36),
      ease: 'outExpo',
    });
  });

  return () => scope.revert();
}, []);
```

## 2. Strict TypeScript 6 Gotchas (`tsc -b`)

- Function-based property values in `animejs` v4 can infer `i` as `number | undefined` and `_el` as implicit `any` under strict config.
- Always annotate both parameters explicitly with a default index:

```ts
animate(targets, {
  translateX: (_el: unknown, i = 0) => Math.cos((i * Math.PI * 2) / count) * 24,
  translateY: (_el: unknown, i = 0) => Math.sin((i * Math.PI * 2) / count) * 24,
  duration: 420,
  ease: 'outExpo',
});
```

## 3. Performance & Accessibility Guardrails

- Animate **only GPU-composited properties** (`transform`, `opacity`, `strokeDashoffset`) — avoid animating `width`, `height`, `top`, `left`, or `box-shadow` in loops.
- For high-frequency pointer loops (like animated cursors or kinetic trails), use `requestAnimationFrame` + direct DOM `style.transform = translate3d(...)` with zero React state updates per frame, reserving `animejs` for discrete events (click ripples, spark bursts, dropdown mounts, stat rollups).
- For rolling numeric counters (EXP, WPM, KPH), animate a plain JS `{ val: 0 }` object and write `Math.round(obj.val).toLocaleString()` directly to a ref's `textContent`.
- For spring dropdowns/drawers, use `ease: spring({ stiffness: 360, damping: 22 })` inside `window.requestAnimationFrame` right after conditional mount.
- Ensure every animated surface remains 100% legible in GIGW High Contrast mode (`html[data-contrast="high"]`).

## 4. Verification

- Run `npm run build` (`tsc -b && vite build`) to confirm strict TypeScript compliance on all `animejs` callbacks.
- Confirm every `useEffect` that creates an `animejs` scope returns `() => scope.revert()`.
