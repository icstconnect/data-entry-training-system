/**
 * ICST LAB — Modern Multi-Theme Custom Cursor Engine
 * - 5 Modern Cursor Packs (3 Static + 2 Animated)
 * - 41 brand-matched 32x32 SVG cursors per theme x 2 tones (Light & Dark surface adapted)
 * - Automatic real-time Light/Dark surface detection + manual Auto/Light/Dark switcher
 * - Persisted in localStorage as the website's default cursor
 */

export type CursorCategory =
  | 'Standard & navigation'
  | 'Selection & interaction'
  | 'Drag & drop'
  | 'Resize'
  | 'Zoom'
  | 'Custom ICST Labs cursor states';

export type IcstCursorThemeId =
  | 'fluent'
  | 'outlier'
  | 'stealth'
  | 'pulse-orbit'
  | 'prism-aurora';

/** User-selectable tone mode: auto-detect surface luminance, or force Light/Dark cursor ink */
export type CursorToneMode = 'auto' | 'light' | 'dark';

/** Resolved ink appearance of the cursor itself:
 * - 'dark'  = dark-ink cursor (ideal over light surfaces, assets in /light/)
 * - 'light' = bright white/luminous cursor (ideal over dark surfaces, assets in /dark/)
 */
export type CursorAppearance = 'dark' | 'light';

export interface IcstCursorThemeMeta {
  id: IcstCursorThemeId;
  name: string;
  tagline: string;
  animated: boolean;
  accentColor: string;
  previewBgLight: string;
  previewBgDark: string;
}

export const ICST_CURSOR_THEMES: readonly IcstCursorThemeMeta[] = [
  {
    id: 'fluent',
    name: 'ICST Fluent',
    tagline: 'Modern soft-corner delta & crisp pills',
    animated: false,
    accentColor: '#0284c7',
    previewBgLight: '#edf4fa',
    previewBgDark: '#0f172a',
  },
  {
    id: 'outlier',
    name: 'Outlier Minimal',
    tagline: 'Clean hollow outline & chevron resizers',
    animated: false,
    accentColor: '#6366f1',
    previewBgLight: '#f5f3ff',
    previewBgDark: '#18181b',
  },
  {
    id: 'stealth',
    name: 'Stealth Rim',
    tagline: 'Aerodynamic bevel & precision needles',
    animated: false,
    accentColor: '#ec4899',
    previewBgLight: '#fdf2f8',
    previewBgDark: '#111827',
  },
  {
    id: 'pulse-orbit',
    name: 'Pulse Orbit',
    tagline: 'Live orbital ring, satellite & click sonar',
    animated: true,
    accentColor: '#0ea5e9',
    previewBgLight: '#e0f2fe',
    previewBgDark: '#0c192c',
  },
  {
    id: 'prism-aurora',
    name: 'Prism Aurora',
    tagline: 'Chromatic neon aura, trail & click sparks',
    animated: true,
    accentColor: '#a855f7',
    previewBgLight: '#faf5ff',
    previewBgDark: '#090d16',
  },
] as const;

export type IcstCursorName =
  // Standard & navigation (7)
  | 'default'
  | 'auto'
  | 'pointer'
  | 'context-menu'
  | 'help'
  | 'progress'
  | 'wait'
  // Selection & interaction (7)
  | 'text'
  | 'vertical-text'
  | 'crosshair'
  | 'cell'
  | 'alias'
  | 'copy'
  | 'move'
  // Drag & drop (5)
  | 'grab'
  | 'grabbing'
  | 'no-drop'
  | 'not-allowed'
  | 'dragging'
  // Resize (14)
  | 'col-resize'
  | 'row-resize'
  | 'n-resize'
  | 's-resize'
  | 'e-resize'
  | 'w-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  // Zoom (2)
  | 'zoom-in'
  | 'zoom-out'
  // Custom ICST Labs cursor states (6)
  | 'icst-default'
  | 'icst-pointer'
  | 'icst-click'
  | 'icst-loading'
  | 'icst-success'
  | 'icst-error';

export interface CursorSpec {
  name: IcstCursorName;
  category: CursorCategory;
  hotspotX: number;
  hotspotY: number;
  fallback: string;
  cssVar: `--cursor-${IcstCursorName}`;
  description: string;
}

export const ICST_CURSOR_CATALOG: readonly CursorSpec[] = [
  // Standard & navigation
  { name: 'default', category: 'Standard & navigation', hotspotX: 4, hotspotY: 3, fallback: 'default', cssVar: '--cursor-default', description: 'Primary modern precision pointer' },
  { name: 'auto', category: 'Standard & navigation', hotspotX: 4, hotspotY: 3, fallback: 'auto', cssVar: '--cursor-auto', description: 'Neutral automatic pointer' },
  { name: 'pointer', category: 'Standard & navigation', hotspotX: 10, hotspotY: 3, fallback: 'pointer', cssVar: '--cursor-pointer', description: 'Interactive pointing hand' },
  { name: 'context-menu', category: 'Standard & navigation', hotspotX: 4, hotspotY: 3, fallback: 'context-menu', cssVar: '--cursor-context-menu', description: 'Arrow with context menu badge' },
  { name: 'help', category: 'Standard & navigation', hotspotX: 4, hotspotY: 3, fallback: 'help', cssVar: '--cursor-help', description: 'Arrow with help question badge' },
  { name: 'progress', category: 'Standard & navigation', hotspotX: 4, hotspotY: 3, fallback: 'progress', cssVar: '--cursor-progress', description: 'Arrow with background spinner' },
  { name: 'wait', category: 'Standard & navigation', hotspotX: 16, hotspotY: 16, fallback: 'wait', cssVar: '--cursor-wait', description: 'Centered busy orbital spinner' },

  // Selection & interaction
  { name: 'text', category: 'Selection & interaction', hotspotX: 16, hotspotY: 16, fallback: 'text', cssVar: '--cursor-text', description: 'Horizontal text selection I-beam' },
  { name: 'vertical-text', category: 'Selection & interaction', hotspotX: 16, hotspotY: 16, fallback: 'vertical-text', cssVar: '--cursor-vertical-text', description: 'Vertical text selection I-beam' },
  { name: 'crosshair', category: 'Selection & interaction', hotspotX: 16, hotspotY: 16, fallback: 'crosshair', cssVar: '--cursor-crosshair', description: 'Precision reticle crosshair' },
  { name: 'cell', category: 'Selection & interaction', hotspotX: 16, hotspotY: 16, fallback: 'cell', cssVar: '--cursor-cell', description: 'Spreadsheet cell selector' },
  { name: 'alias', category: 'Selection & interaction', hotspotX: 4, hotspotY: 3, fallback: 'alias', cssVar: '--cursor-alias', description: 'Arrow with alias/shortcut badge' },
  { name: 'copy', category: 'Selection & interaction', hotspotX: 4, hotspotY: 3, fallback: 'copy', cssVar: '--cursor-copy', description: 'Arrow with copy (+) badge' },
  { name: 'move', category: 'Selection & interaction', hotspotX: 16, hotspotY: 16, fallback: 'move', cssVar: '--cursor-move', description: 'Omnidirectional 4-way move arrows' },

  // Drag & drop
  { name: 'grab', category: 'Drag & drop', hotspotX: 16, hotspotY: 16, fallback: 'grab', cssVar: '--cursor-grab', description: 'Open hand ready to grab' },
  { name: 'grabbing', category: 'Drag & drop', hotspotX: 16, hotspotY: 16, fallback: 'grabbing', cssVar: '--cursor-grabbing', description: 'Closed hand actively holding item' },
  { name: 'no-drop', category: 'Drag & drop', hotspotX: 4, hotspotY: 3, fallback: 'no-drop', cssVar: '--cursor-no-drop', description: 'Arrow with invalid drop target sign' },
  { name: 'not-allowed', category: 'Drag & drop', hotspotX: 16, hotspotY: 16, fallback: 'not-allowed', cssVar: '--cursor-not-allowed', description: 'Prohibition circle for disabled elements' },
  { name: 'dragging', category: 'Drag & drop', hotspotX: 16, hotspotY: 16, fallback: 'grabbing', cssVar: '--cursor-dragging', description: 'Custom ICST dragging state with floating data card' },

  // Resize
  { name: 'col-resize', category: 'Resize', hotspotX: 16, hotspotY: 16, fallback: 'col-resize', cssVar: '--cursor-col-resize', description: 'Column divider horizontal resize' },
  { name: 'row-resize', category: 'Resize', hotspotX: 16, hotspotY: 16, fallback: 'row-resize', cssVar: '--cursor-row-resize', description: 'Row divider vertical resize' },
  { name: 'n-resize', category: 'Resize', hotspotX: 16, hotspotY: 16, fallback: 'n-resize', cssVar: '--cursor-n-resize', description: 'North edge resize' },
  { name: 's-resize', category: 'Resize', hotspotX: 16, hotspotY: 16, fallback: 's-resize', cssVar: '--cursor-s-resize', description: 'South edge resize' },
  { name: 'e-resize', category: 'Resize', hotspotX: 16, hotspotY: 16, fallback: 'e-resize', cssVar: '--cursor-e-resize', description: 'East edge resize' },
  { name: 'w-resize', category: 'Resize', hotspotX: 16, hotspotY: 16, fallback: 'w-resize', cssVar: '--cursor-w-resize', description: 'West edge resize' },
  { name: 'ne-resize', category: 'Resize', hotspotX: 16, hotspotY: 16, fallback: 'ne-resize', cssVar: '--cursor-ne-resize', description: 'North-East corner resize' },
  { name: 'nw-resize', category: 'Resize', hotspotX: 16, hotspotY: 16, fallback: 'nw-resize', cssVar: '--cursor-nw-resize', description: 'North-West corner resize' },
  { name: 'se-resize', category: 'Resize', hotspotX: 16, hotspotY: 16, fallback: 'se-resize', cssVar: '--cursor-se-resize', description: 'South-East corner resize' },
  { name: 'sw-resize', category: 'Resize', hotspotX: 16, hotspotY: 16, fallback: 'sw-resize', cssVar: '--cursor-sw-resize', description: 'South-West corner resize' },
  { name: 'ew-resize', category: 'Resize', hotspotX: 16, hotspotY: 16, fallback: 'ew-resize', cssVar: '--cursor-ew-resize', description: 'Bidirectional East-West resize' },
  { name: 'ns-resize', category: 'Resize', hotspotX: 16, hotspotY: 16, fallback: 'ns-resize', cssVar: '--cursor-ns-resize', description: 'Bidirectional North-South resize' },
  { name: 'nesw-resize', category: 'Resize', hotspotX: 16, hotspotY: 16, fallback: 'nesw-resize', cssVar: '--cursor-nesw-resize', description: 'Bidirectional NE-SW diagonal resize' },
  { name: 'nwse-resize', category: 'Resize', hotspotX: 16, hotspotY: 16, fallback: 'nwse-resize', cssVar: '--cursor-nwse-resize', description: 'Bidirectional NW-SE diagonal resize' },

  // Zoom
  { name: 'zoom-in', category: 'Zoom', hotspotX: 13, hotspotY: 13, fallback: 'zoom-in', cssVar: '--cursor-zoom-in', description: 'Magnifying glass zoom-in (+)' },
  { name: 'zoom-out', category: 'Zoom', hotspotX: 13, hotspotY: 13, fallback: 'zoom-out', cssVar: '--cursor-zoom-out', description: 'Magnifying glass zoom-out (−)' },

  // Custom ICST Labs cursor states
  { name: 'icst-default', category: 'Custom ICST Labs cursor states', hotspotX: 4, hotspotY: 3, fallback: 'default', cssVar: '--cursor-icst-default', description: 'Signature ICST LAB brand pointer' },
  { name: 'icst-pointer', category: 'Custom ICST Labs cursor states', hotspotX: 10, hotspotY: 3, fallback: 'pointer', cssVar: '--cursor-icst-pointer', description: 'Signature ICST LAB interactive hand' },
  { name: 'icst-click', category: 'Custom ICST Labs cursor states', hotspotX: 10, hotspotY: 3, fallback: 'pointer', cssVar: '--cursor-icst-click', description: 'Active click-spark press hand' },
  { name: 'icst-loading', category: 'Custom ICST Labs cursor states', hotspotX: 16, hotspotY: 16, fallback: 'progress', cssVar: '--cursor-icst-loading', description: 'ICST LAB flask inside orbital ring' },
  { name: 'icst-success', category: 'Custom ICST Labs cursor states', hotspotX: 4, hotspotY: 3, fallback: 'default', cssVar: '--cursor-icst-success', description: 'ICST arrow with emerald check badge' },
  { name: 'icst-error', category: 'Custom ICST Labs cursor states', hotspotX: 4, hotspotY: 3, fallback: 'not-allowed', cssVar: '--cursor-icst-error', description: 'ICST arrow with crimson cross badge' },
] as const;

const CURSOR_MAP = new Map<IcstCursorName, CursorSpec>(
  ICST_CURSOR_CATALOG.map((spec) => [spec.name, spec])
);

const STORAGE_THEME_KEY = 'icst_cursor_theme_v1';
const STORAGE_TONE_KEY = 'icst_cursor_tone_v1';

const VALID_THEMES = new Set<IcstCursorThemeId>(ICST_CURSOR_THEMES.map((t) => t.id));

export interface CursorPreferencesState {
  theme: IcstCursorThemeId;
  toneMode: CursorToneMode;
  resolvedAppearance: CursorAppearance;
}

type CursorListener = (state: CursorPreferencesState) => void;
const listeners = new Set<CursorListener>();

function loadStoredTheme(): IcstCursorThemeId {
  try {
    const raw = localStorage.getItem(STORAGE_THEME_KEY) as IcstCursorThemeId | null;
    if (raw && VALID_THEMES.has(raw)) return raw;
  } catch {
    // ignore storage errors
  }
  return 'fluent';
}

function loadStoredToneMode(): CursorToneMode {
  try {
    const raw = localStorage.getItem(STORAGE_TONE_KEY) as CursorToneMode | null;
    if (raw === 'auto' || raw === 'light' || raw === 'dark') return raw;
  } catch {
    // ignore storage errors
  }
  return 'auto';
}

let currentTheme: IcstCursorThemeId = typeof window !== 'undefined' ? loadStoredTheme() : 'fluent';
let currentToneMode: CursorToneMode = typeof window !== 'undefined' ? loadStoredToneMode() : 'auto';
let currentAppearance: CursorAppearance = currentToneMode === 'light' ? 'light' : 'dark';
let appliedThemeKey = '';

function notifyListeners(): void {
  const snapshot: CursorPreferencesState = {
    theme: currentTheme,
    toneMode: currentToneMode,
    resolvedAppearance: currentAppearance,
  };
  listeners.forEach((fn) => fn(snapshot));
}

export function getCursorPreferences(): CursorPreferencesState {
  return {
    theme: currentTheme,
    toneMode: currentToneMode,
    resolvedAppearance: currentAppearance,
  };
}

export function subscribeCursorPreferences(listener: CursorListener): () => void {
  listeners.add(listener);
  listener(getCursorPreferences());
  return () => {
    listeners.delete(listener);
  };
}

/** Maps appearance ('dark' ink vs 'light' ink) to asset surface subfolder ('light' vs 'dark'). */
export function getCursorSvgPath(
  theme: IcstCursorThemeId,
  appearance: CursorAppearance,
  name: IcstCursorName
): string {
  const surfaceFolder = appearance === 'light' ? 'dark' : 'light';
  return `/cursors/${theme}/${surfaceFolder}/${name}.svg`;
}

/** Applies all 41 CSS cursor tokens for the chosen theme & appearance cleanly onto :root */
function applyCursorTokensToDom(theme: IcstCursorThemeId, appearance: CursorAppearance): void {
  if (typeof document === 'undefined') return;
  const key = `${theme}:${appearance}`;
  if (key === appliedThemeKey) return;
  appliedThemeKey = key;

  const root = document.documentElement;
  root.setAttribute('data-cursor-theme', theme);
  root.setAttribute('data-cursor-appearance', appearance);
  root.setAttribute('data-cursor-tone-mode', currentToneMode);

  const surfaceFolder = appearance === 'light' ? 'dark' : 'light';
  const style = root.style;
  for (let i = 0; i < ICST_CURSOR_CATALOG.length; i++) {
    const spec = ICST_CURSOR_CATALOG[i];
    style.setProperty(
      spec.cssVar,
      `url('/cursors/${theme}/${surfaceFolder}/${spec.name}.svg') ${spec.hotspotX} ${spec.hotspotY}, ${spec.fallback}`
    );
  }
}

export function setCursorTheme(theme: IcstCursorThemeId): void {
  if (!VALID_THEMES.has(theme)) return;
  currentTheme = theme;
  try {
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  } catch {
    // ignore storage errors
  }
  applyCursorTokensToDom(currentTheme, currentAppearance);
  notifyListeners();
}

export function setCursorToneMode(mode: CursorToneMode): void {
  currentToneMode = mode;
  try {
    localStorage.setItem(STORAGE_TONE_KEY, mode);
  } catch {
    // ignore storage errors
  }
  if (mode === 'light') {
    currentAppearance = 'light';
  } else if (mode === 'dark') {
    currentAppearance = 'dark';
  } else {
    // Re-evaluate based on GIGW high contrast or body default
    const isHighContrast =
      typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-contrast') === 'high';
    currentAppearance = isHighContrast ? 'light' : 'dark';
  }
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-cursor-tone-mode', currentToneMode);
  }
  applyCursorTokensToDom(currentTheme, currentAppearance);
  notifyListeners();
}

export function getCursorCssValue(name: IcstCursorName): string {
  const spec = CURSOR_MAP.get(name);
  if (!spec) return 'default';
  const path = getCursorSvgPath(currentTheme, currentAppearance, name);
  return `url('${path}') ${spec.hotspotX} ${spec.hotspotY}, ${spec.fallback}`;
}

export type GlobalIcstCursorState = 'loading' | 'success' | 'error' | null;
let resetTimer: number | null = null;

/**
 * Temporarily or persistently switches the global ICST cursor feedback state
 * (`loading`, `success`, `error`, or `null` to restore normal behavior).
 */
export function setGlobalCursorState(
  state: GlobalIcstCursorState,
  autoResetMs?: number
): void {
  if (typeof document === 'undefined') return;

  if (resetTimer !== null) {
    window.clearTimeout(resetTimer);
    resetTimer = null;
  }

  const root = document.documentElement;
  if (!state) {
    root.removeAttribute('data-icst-cursor-state');
    return;
  }

  root.setAttribute('data-icst-cursor-state', state);

  if (autoResetMs && autoResetMs > 0) {
    resetTimer = window.setTimeout(() => {
      root.removeAttribute('data-icst-cursor-state');
      resetTimer = null;
    }, autoResetMs);
  }
}

// === AUTOMATIC DARK / LIGHT SURFACE LUMINANCE DETECTOR ===
const DARK_HINT_SELECTOR = [
  '[data-theme="dark"]',
  '.theme-dark',
  '.we-workbench',
  '.term-workbench',
  '.win-desktop',
  '.win-window-titlebar',
  '.site-footer',
  '.footer-icst-connect',
  '.md-hero--terminal',
  '.md-hero--word-express',
  '.md-hero--windows',
  '.md-hero--typing',
  '.lp-showcase-banner',
  '.lp-hero-visual-dark',
  '.tt-dark-shell',
  '.we-report-overlay',
  '.share-modal-overlay',
  '.fs-gate-backdrop',
  '.govt-a11y-bar',
].join(',');

const LIGHT_HINT_SELECTOR = [
  '[data-theme="light"]',
  '.theme-light',
  '.nav-dropdown-menu',
  '.excel-grid-container',
  '.excel-data-cell',
  '.practice-card',
  '.lp-lab-card',
].join(',');

function parseRgbLuminance(bg: string): { lum: number; alpha: number } | null {
  if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') return null;
  const match = bg.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (!match) return null;
  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  const a = match[4] !== undefined ? Number(match[4]) : 1;
  if (a < 0.18) return null;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return { lum, alpha: a };
}

function detectAppearanceAtElement(target: EventTarget | null): CursorAppearance {
  if (typeof document === 'undefined') return 'dark';

  // GIGW High Contrast mode is always yellow-on-black -> bright white/luminous cursor
  if (document.documentElement.getAttribute('data-contrast') === 'high') {
    return 'light';
  }

  let el = target instanceof Element ? target : null;
  let steps = 0;

  while (el && steps < 12) {
    // Explicit dark/light container hints take fast priority if background is gradient-only
    const style = window.getComputedStyle(el);
    const parsed = parseRgbLuminance(style.backgroundColor);
    if (parsed) {
      return parsed.lum < 142 ? 'light' : 'dark';
    }

    if (style.backgroundImage && style.backgroundImage !== 'none') {
      if (el.matches(DARK_HINT_SELECTOR)) return 'light';
      if (el.matches(LIGHT_HINT_SELECTOR)) return 'dark';
      // Check hex/rgb colors inside linear-gradient if present
      const gradMatch = style.backgroundImage.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
      if (gradMatch) {
        const lum = 0.299 * Number(gradMatch[1]) + 0.587 * Number(gradMatch[2]) + 0.114 * Number(gradMatch[3]);
        return lum < 142 ? 'light' : 'dark';
      }
    }

    if (el.matches(DARK_HINT_SELECTOR)) return 'light';
    if (el.matches(LIGHT_HINT_SELECTOR)) return 'dark';

    el = el.parentElement;
    steps++;
  }

  return 'dark';
}

let initialized = false;

/**
 * Initializes lightweight passive listeners for:
 * - Immediate theme & appearance CSS token hydration (zero FOUC)
 * - Auto Dark/Light surface detection on pointer target changes
 * - GIGW High Contrast mutation observation
 * - `icst-click` tactile press feedback & `dragging` drag-and-drop cursor state
 */
export function initIcstCursorController(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Always hydrate CSS tokens immediately (even if called before mount)
  applyCursorTokensToDom(currentTheme, currentAppearance);

  if (initialized) return () => {};
  initialized = true;

  const root = document.documentElement;
  let lastTarget: EventTarget | null = null;

  const updateAutoAppearance = (target: EventTarget | null) => {
    if (currentToneMode !== 'auto') return;
    const next = detectAppearanceAtElement(target);
    if (next !== currentAppearance) {
      currentAppearance = next;
      applyCursorTokensToDom(currentTheme, currentAppearance);
      notifyListeners();
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    if (e.target === lastTarget) return;
    lastTarget = e.target;
    updateAutoAppearance(e.target);
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    root.setAttribute('data-icst-cursor-pressed', 'true');
  };

  const onPointerUp = () => {
    root.removeAttribute('data-icst-cursor-pressed');
  };

  const onDragStart = () => {
    root.setAttribute('data-icst-dragging', 'true');
  };

  const onDragEnd = () => {
    root.removeAttribute('data-icst-dragging');
  };

  // Observe GIGW High Contrast toggle on <html>
  const contrastObserver = new MutationObserver(() => {
    if (currentToneMode === 'auto') {
      updateAutoAppearance(lastTarget || document.body);
    }
  });
  contrastObserver.observe(root, { attributes: true, attributeFilter: ['data-contrast'] });

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerUp, { passive: true });
  window.addEventListener('blur', onPointerUp, { passive: true });
  window.addEventListener('dragstart', onDragStart, { passive: true });
  window.addEventListener('dragend', onDragEnd, { passive: true });
  window.addEventListener('drop', onDragEnd, { passive: true });

  return () => {
    initialized = false;
    contrastObserver.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
    window.removeEventListener('blur', onPointerUp);
    window.removeEventListener('dragstart', onDragStart);
    window.removeEventListener('dragend', onDragEnd);
    window.removeEventListener('drop', onDragEnd);
  };
}
