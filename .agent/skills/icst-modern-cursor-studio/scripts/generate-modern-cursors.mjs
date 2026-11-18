import fs from 'node:fs';
import path from 'node:path';

const ROOT_OUT = path.resolve(process.cwd(), 'public/cursors');
fs.mkdirSync(ROOT_OUT, { recursive: true });

// Surface tones:
// - 'light' = cursor rendered over a LIGHT website surface (dark crisp ink + white halo)
// - 'dark'  = cursor rendered over a DARK website surface (bright white/glowing ink + dark halo)
const TONES = ['light', 'dark'];
const THEMES = ['fluent', 'outlier', 'stealth', 'pulse-orbit', 'prism-aurora'];

function getPalette(theme, surface) {
  const isLightSurface = surface === 'light';

  if (theme === 'fluent') {
    return {
      fill: isLightSurface ? '#111827' : '#ffffff',
      fill2: isLightSurface ? '#1e293b' : '#e2e8f0',
      stroke: isLightSurface ? '#ffffff' : '#0f172a',
      accent1: isLightSurface ? '#0284c7' : '#38bdf8',
      accent2: isLightSurface ? '#0ea5e9' : '#22d3ee',
      muted: isLightSurface ? '#475569' : '#cbd5e1',
      badgeBg: isLightSurface ? '#ffffff' : '#0f172a',
      badgeFg: isLightSurface ? '#111827' : '#ffffff',
      shadowOpacity: isLightSurface ? '0.26' : '0.45',
      glow: false,
    };
  }

  if (theme === 'outlier') {
    return {
      fill: 'none',
      fill2: isLightSurface ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.55)',
      stroke: isLightSurface ? '#0f172a' : '#f8fafc',
      halo: isLightSurface ? '#ffffff' : '#090d16',
      accent1: isLightSurface ? '#6366f1' : '#f97316',
      accent2: isLightSurface ? '#0ea5e9' : '#fb923c',
      muted: isLightSurface ? '#64748b' : '#94a3b8',
      badgeBg: isLightSurface ? '#ffffff' : '#111827',
      badgeFg: isLightSurface ? '#0f172a' : '#f8fafc',
      shadowOpacity: isLightSurface ? '0.22' : '0.48',
      glow: !isLightSurface,
    };
  }

  if (theme === 'stealth') {
    return {
      fill: isLightSurface ? '#18181b' : '#1e2430',
      fill2: isLightSurface ? '#27272a' : '#334155',
      stroke: isLightSurface ? '#ffffff' : '#f8fafc',
      accent1: isLightSurface ? '#0ea5e9' : '#f472b6',
      accent2: isLightSurface ? '#6366f1' : '#fb923c',
      muted: isLightSurface ? '#52525b' : '#cbd5e1',
      badgeBg: isLightSurface ? '#18181b' : '#0f172a',
      badgeFg: '#ffffff',
      shadowOpacity: isLightSurface ? '0.30' : '0.50',
      glow: true,
    };
  }

  if (theme === 'pulse-orbit') {
    return {
      fill: isLightSurface ? '#0f172a' : '#f8fafc',
      fill2: isLightSurface ? '#1e3a5f' : '#e0f2fe',
      stroke: isLightSurface ? '#ffffff' : '#0c192c',
      accent1: isLightSurface ? '#0284c7' : '#22d3ee',
      accent2: isLightSurface ? '#38bdf8' : '#818cf8',
      muted: isLightSurface ? '#475569' : '#94a3b8',
      badgeBg: isLightSurface ? '#0f172a' : '#0c2238',
      badgeFg: '#ffffff',
      shadowOpacity: isLightSurface ? '0.28' : '0.48',
      glow: true,
    };
  }

  // prism-aurora
  return {
    fill: isLightSurface ? 'rgba(255,255,255,0.88)' : 'rgba(10,14,26,0.78)',
    fill2: isLightSurface ? '#ffffff' : '#0f172a',
    stroke: isLightSurface ? '#0f172a' : '#ffffff',
    halo: isLightSurface ? '#ffffff' : '#020617',
    accent1: '#22d3ee',
    accent2: '#a855f7',
    accent3: '#34d399',
    muted: isLightSurface ? '#475569' : '#cbd5e1',
    badgeBg: isLightSurface ? '#ffffff' : '#0f172a',
    badgeFg: isLightSurface ? '#0f172a' : '#ffffff',
    shadowOpacity: isLightSurface ? '0.24' : '0.52',
    glow: true,
  };
}

function wrapSvg(body, p, extraDefs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <defs>
    <linearGradient id="gBody" x1="4" y1="3" x2="26" y2="27" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${p.fill === 'none' ? p.stroke : p.fill}"/>
      <stop offset="100%" stop-color="${p.fill2}"/>
    </linearGradient>
    <linearGradient id="gAccent" x1="3" y1="3" x2="28" y2="28" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${p.accent1}"/>
      <stop offset="100%" stop-color="${p.accent2}"/>
    </linearGradient>
    <linearGradient id="gPrism" x1="4" y1="24" x2="22" y2="6" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#34d399"/>
    </linearGradient>
    <filter id="ds" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0.5" dy="1.1" stdDeviation="0.9" flood-color="#020617" flood-opacity="${p.shadowOpacity}"/>
    </filter>
    ${extraDefs}
  </defs>
  <g filter="url(#ds)">
    ${body}
  </g>
</svg>
`;
}

// === MODERN POINTER ARROW SILHOUETTES PER THEME (tip at 4,3) ===
function renderArrow(theme, p, variant = 'default') {
  const isAuto = variant === 'auto';

  if (theme === 'fluent') {
    // Win11 Concept / Remus modern soft-cornered tail-less delta arrow
    const fill = isAuto ? p.muted : 'url(#gBody)';
    return `
      <path d="M4.4 4.2C4.2 3.1 5.4 2.4 6.3 3.0L21.3 13.7C22.2 14.3 21.9 15.8 20.8 16.0L14.5 17.2C13.9 17.3 13.4 17.7 13.1 18.2L9.9 23.7C9.3 24.7 7.8 24.4 7.6 23.3L4.4 4.2Z"
            fill="${fill}" stroke="${p.stroke}" stroke-width="1.9" stroke-linejoin="round"/>
      ${variant === 'icst' ? `<circle cx="10.8" cy="13.0" r="1.9" fill="url(#gAccent)"/>` : `<path d="M6.4 5.9L17.4 13.8L12.6 14.7L9.4 20.2L6.4 5.9Z" fill="url(#gAccent)" opacity="0.22"/>`}
    `;
  }

  if (theme === 'outlier') {
    // Outlier clean hollow rounded delta outline
    const strokeCol = isAuto ? p.muted : p.stroke;
    return `
      <path d="M4.6 4.4C4.4 3.4 5.4 2.7 6.3 3.2L19.8 11.9C20.7 12.5 20.5 13.9 19.5 14.2L13.7 15.8C13.2 15.9 12.8 16.3 12.5 16.8L9.6 21.8C9.0 22.7 7.6 22.4 7.4 21.4L4.6 4.4Z"
            fill="${p.fill2}" stroke="${p.halo}" stroke-width="4.2" stroke-linejoin="round"/>
      <path d="M4.6 4.4C4.4 3.4 5.4 2.7 6.3 3.2L19.8 11.9C20.7 12.5 20.5 13.9 19.5 14.2L13.7 15.8C13.2 15.9 12.8 16.3 12.5 16.8L9.6 21.8C9.0 22.7 7.6 22.4 7.4 21.4L4.6 4.4Z"
            fill="none" stroke="${strokeCol}" stroke-width="2.0" stroke-linejoin="round"/>
      ${variant === 'icst' ? `<path d="M7.6 20.4L12.1 15.9L18.4 13.7" stroke="url(#gAccent)" stroke-width="1.6" stroke-linecap="round"/>` : ''}
    `;
  }

  if (theme === 'stealth') {
    // MMXX / Modest sleek stealth arrow with glowing gradient concave bottom edge
    return `
      <path d="M4.3 3.4L20.8 16.1C16.2 15.5 12.2 17.5 8.8 22.6L4.3 3.4Z"
            fill="${isAuto ? p.muted : 'url(#gBody)'}" stroke="${p.stroke}" stroke-width="1.55" stroke-linejoin="round"/>
      <path d="M8.8 22.2C11.9 17.4 15.8 15.6 20.3 16.0"
            stroke="url(#gAccent)" stroke-width="2.4" stroke-linecap="round"/>
      ${variant === 'icst' ? `<circle cx="9.2" cy="11.6" r="1.4" fill="url(#gAccent)"/>` : ''}
    `;
  }

  if (theme === 'pulse-orbit') {
    // Sleek futuristic dart + glowing orbital dot near notch
    return `
      <path d="M4.5 3.6C4.4 2.9 5.2 2.5 5.8 2.9L21.0 13.9C21.6 14.3 21.4 15.3 20.6 15.5L13.9 16.8L9.6 22.7C9.1 23.3 8.1 23.1 7.9 22.3L4.5 3.6Z"
            fill="${isAuto ? p.muted : 'url(#gBody)'}" stroke="${p.stroke}" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M10.4 18.8C13.0 17.2 15.4 16.4 18.6 15.7" stroke="url(#gAccent)" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="16.2" cy="21.0" r="2.2" fill="url(#gAccent)" stroke="${p.stroke}" stroke-width="1.1"/>
    `;
  }

  // prism-aurora: Neon-rimmed hollow rounded triangle with vibrant cyan-violet-emerald corner arc (Image #5)
  return `
    <path d="M4.6 4.4C4.4 3.3 5.5 2.5 6.4 3.1L20.4 12.8C21.3 13.4 21.0 14.9 19.9 15.1L13.8 16.4C13.2 16.5 12.7 16.9 12.4 17.4L9.5 22.6C8.9 23.6 7.5 23.3 7.3 22.2L4.6 4.4Z"
          fill="${p.fill}" stroke="${p.halo}" stroke-width="4.0" stroke-linejoin="round"/>
    <path d="M4.6 4.4C4.4 3.3 5.5 2.5 6.4 3.1L20.4 12.8C21.3 13.4 21.0 14.9 19.9 15.1L13.8 16.4C13.2 16.5 12.7 16.9 12.4 17.4L9.5 22.6C8.9 23.6 7.5 23.3 7.3 22.2L4.6 4.4Z"
          fill="none" stroke="${isAuto ? p.muted : p.stroke}" stroke-width="2.0" stroke-linejoin="round"/>
    <path d="M6.4 16.2L7.3 22.2C7.5 23.3 8.9 23.6 9.5 22.6L12.4 17.4C12.7 16.9 13.2 16.5 13.8 16.4L17.0 15.7"
          stroke="url(#gPrism)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  `;
}

// === MODERN HAND POINTER (fingertip at 10,3) ===
function renderPointerHand(theme, p, clicked = false) {
  const isHollow = theme === 'outlier' || theme === 'prism-aurora';
  const fill = isHollow ? p.fill2 : (p.fill === '#111827' || p.fill === '#18181b' || p.fill === '#0f172a' ? p.fill : '#ffffff');
  const stroke = isHollow ? p.stroke : (fill === '#ffffff' ? '#111827' : p.stroke);
  const accentGrad = theme === 'prism-aurora' ? 'url(#gPrism)' : 'url(#gAccent)';

  return `
    ${clicked ? `
      <path d="M10 0.8V2.5M5.2 2.2L6.6 3.5M14.8 2.2L13.4 3.5" stroke="${p.accent1}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="10" cy="4.2" r="3.6" fill="${p.accent1}" opacity="0.28"/>
    ` : ''}
    <g transform="${clicked ? 'translate(0, 1.3) scale(0.96)' : ''}">
      ${isHollow ? `
        <path d="M10 3.3C8.8 3.3 7.9 4.2 7.9 5.4V14.0L6.1 12.6C5.2 11.9 3.9 12.0 3.3 12.9C2.7 13.7 2.8 14.8 3.6 15.5L8.6 21.1C9.6 22.2 11.0 22.8 12.5 22.8H18.1C20.8 22.8 23.0 20.6 23.0 17.9V13.4C23.0 12.2 22.1 11.3 20.9 11.3C20.3 11.3 19.7 11.6 19.3 12.0C19.1 11.0 18.2 10.3 17.2 10.3C16.5 10.3 15.9 10.6 15.5 11.1C15.2 10.1 14.3 9.4 13.3 9.4C12.7 9.4 12.3 9.6 12.0 9.9V5.4C12.0 4.2 11.1 3.3 10 3.3Z"
              fill="${fill}" stroke="${p.halo || p.stroke}" stroke-width="3.8" stroke-linejoin="round"/>
      ` : ''}
      <path d="M10 3.3C8.8 3.3 7.9 4.2 7.9 5.4V14.0L6.1 12.6C5.2 11.9 3.9 12.0 3.3 12.9C2.7 13.7 2.8 14.8 3.6 15.5L8.6 21.1C9.6 22.2 11.0 22.8 12.5 22.8H18.1C20.8 22.8 23.0 20.6 23.0 17.9V13.4C23.0 12.2 22.1 11.3 20.9 11.3C20.3 11.3 19.7 11.6 19.3 12.0C19.1 11.0 18.2 10.3 17.2 10.3C16.5 10.3 15.9 10.6 15.5 11.1C15.2 10.1 14.3 9.4 13.3 9.4C12.7 9.4 12.3 9.6 12.0 9.9V5.4C12.0 4.2 11.1 3.3 10 3.3Z"
            fill="${fill}" stroke="${stroke}" stroke-width="1.8" stroke-linejoin="round"/>
      <rect x="10.4" y="23.0" width="10.6" height="3.8" rx="1.9" fill="${accentGrad}" stroke="${p.stroke}" stroke-width="1.2"/>
    </g>
  `;
}

function renderOpenHand(theme, p) {
  const isHollow = theme === 'outlier' || theme === 'prism-aurora';
  const fill = isHollow ? p.fill2 : (p.fill === '#111827' || p.fill === '#18181b' || p.fill === '#0f172a' ? p.fill : '#ffffff');
  const stroke = isHollow ? p.stroke : (fill === '#ffffff' ? '#111827' : p.stroke);
  const accentGrad = theme === 'prism-aurora' ? 'url(#gPrism)' : 'url(#gAccent)';
  return `
    <path d="M12.2 6.6C11.2 6.6 10.5 7.4 10.5 8.4V13.8L9.0 12.6C8.2 11.9 7.0 12.0 6.4 12.8C5.8 13.6 5.9 14.7 6.6 15.4L10.7 20.8C11.7 22.0 13.1 22.7 14.6 22.7H19.6C22.2 22.7 24.3 20.6 24.3 18.0V10.7C24.3 9.7 23.5 9.0 22.5 9.0C21.7 9.0 21.1 9.5 20.8 10.2V7.8C20.8 6.8 20.0 6.1 19.0 6.1C18.1 6.1 17.3 6.8 17.3 7.8V6.7C17.3 5.7 16.5 5.0 15.6 5.0C14.6 5.0 13.9 5.7 13.9 6.7V8.4C13.9 7.4 13.1 6.6 12.2 6.6Z"
          fill="${fill}" stroke="${stroke}" stroke-width="1.8" stroke-linejoin="round"/>
    <rect x="12.0" y="23.0" width="10.2" height="3.6" rx="1.8" fill="${accentGrad}" stroke="${p.stroke}" stroke-width="1.2"/>
  `;
}

function renderClosedHand(theme, p, yShift = 0) {
  const isHollow = theme === 'outlier' || theme === 'prism-aurora';
  const fill = isHollow ? p.fill2 : (p.fill === '#111827' || p.fill === '#18181b' || p.fill === '#0f172a' ? p.fill : '#ffffff');
  const stroke = isHollow ? p.stroke : (fill === '#ffffff' ? '#111827' : p.stroke);
  const accentGrad = theme === 'prism-aurora' ? 'url(#gPrism)' : 'url(#gAccent)';
  return `
    <g transform="translate(0, ${yShift})">
      <path d="M9.4 13.2C8.3 13.2 7.5 14.1 7.5 15.2V17.2C7.5 20.3 10.0 22.8 13.1 22.8H19.2C22.0 22.8 24.3 20.5 24.3 17.7V13.4C24.3 12.2 23.4 11.3 22.2 11.3C21.5 11.3 20.9 11.6 20.5 12.1C20.2 11.1 19.3 10.4 18.2 10.4C17.4 10.4 16.7 10.8 16.3 11.4C15.9 10.6 15.1 10.1 14.2 10.1C13.1 10.1 12.2 10.8 11.9 11.8C11.5 11.4 11.0 11.2 10.5 11.2C9.8 11.2 9.4 11.8 9.4 12.5V13.2Z"
            fill="${fill}" stroke="${stroke}" stroke-width="1.8" stroke-linejoin="round"/>
      <rect x="11.2" y="23.0" width="10.6" height="3.6" rx="1.8" fill="${accentGrad}" stroke="${p.stroke}" stroke-width="1.2"/>
    </g>
  `;
}

// === MODERN RESIZE GENERATORS (Outlier chevrons / Stealth MMXX needles / Fluent crisp arrows) ===
function renderDoubleResize(theme, p, deg) {
  const accentGrad = theme === 'prism-aurora' ? 'url(#gPrism)' : 'url(#gAccent)';
  if (theme === 'outlier') {
    // Outlier minimal chevron pairs
    return `
      <g transform="rotate(${deg} 16 16)">
        <path d="M11.2 11.2L16 6.2L20.8 11.2M11.2 20.8L16 25.8L20.8 20.8" stroke="${p.halo}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11.2 11.2L16 6.2L20.8 11.2M11.2 20.8L16 25.8L20.8 20.8" stroke="${p.stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="16" cy="16" r="1.6" fill="url(#gAccent)"/>
      </g>
    `;
  }
  if (theme === 'stealth' || theme === 'pulse-orbit') {
    // MMXX precision segmented twin needles with glowing center dot
    return `
      <g transform="rotate(${deg} 16 16)">
        <path d="M16 4.4L20.2 11.8H11.8L16 4.4Z" fill="url(#gBody)" stroke="${p.stroke}" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M16 27.6L20.2 20.2H11.8L16 27.6Z" fill="url(#gBody)" stroke="${p.stroke}" stroke-width="1.6" stroke-linejoin="round"/>
        <circle cx="16" cy="16" r="2.2" fill="${accentGrad}" stroke="${p.stroke}" stroke-width="1.1"/>
      </g>
    `;
  }
  // fluent & prism-aurora
  return `
    <g transform="rotate(${deg} 16 16)">
      <path d="M16 4.4L21.4 10.2H18.0V21.8H21.4L16 27.6L10.6 21.8H14.0V10.2H10.6L16 4.4Z"
            fill="${theme === 'prism-aurora' ? p.fill : 'url(#gBody)'}" stroke="${p.stroke}" stroke-width="1.9" stroke-linejoin="round"/>
      <circle cx="16" cy="16" r="1.6" fill="${accentGrad}"/>
    </g>
  `;
}

function renderEdgeResize(theme, p, deg) {
  const accentGrad = theme === 'prism-aurora' ? 'url(#gPrism)' : 'url(#gAccent)';
  if (theme === 'outlier') {
    return `
      <g transform="rotate(${deg} 16 16)">
        <line x1="9" y1="6.2" x2="23" y2="6.2" stroke="${p.halo}" stroke-width="4.4" stroke-linecap="round"/>
        <line x1="9" y1="6.2" x2="23" y2="6.2" stroke="url(#gAccent)" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M11.2 15.8L16 10.8L20.8 15.8M16 11.4V25.5" stroke="${p.halo}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11.2 15.8L16 10.8L20.8 15.8M16 11.4V25.5" stroke="${p.stroke}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    `;
  }
  return `
    <g transform="rotate(${deg} 16 16)">
      <rect x="8.8" y="4.5" width="14.4" height="3.0" rx="1.5" fill="${accentGrad}" stroke="${p.stroke}" stroke-width="1.4"/>
      <path d="M16 9.4L21.4 15.8H18.0V26.0H14.0V15.8H10.6L16 9.4Z"
            fill="${theme === 'prism-aurora' ? p.fill : 'url(#gBody)'}" stroke="${p.stroke}" stroke-width="1.8" stroke-linejoin="round"/>
    </g>
  `;
}

function renderCornerResize(theme, p, deg) {
  const accentGrad = theme === 'prism-aurora' ? 'url(#gPrism)' : 'url(#gAccent)';
  if (theme === 'outlier') {
    return `
      <g transform="rotate(${deg} 16 16)">
        <path d="M15.8 6.0H26.0V16.2" stroke="${p.halo}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.8 6.0H26.0V16.2" stroke="url(#gAccent)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.8 11.2H20.8V16.2M20.4 11.6L10.6 21.4" stroke="${p.halo}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.8 11.2H20.8V16.2M20.4 11.6L10.6 21.4" stroke="${p.stroke}" stroke-width="2.0" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    `;
  }
  return `
    <g transform="rotate(${deg} 16 16)">
      <path d="M15.6 5.4H26.6V16.4" stroke="${p.stroke}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15.6 5.4H26.6V16.4" stroke="${accentGrad}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22.8 9.2L22.0 17.5L19.4 14.9L11.2 23.1L8.9 20.8L17.1 12.6L14.5 10.0L22.8 9.2Z"
            fill="${theme === 'prism-aurora' ? p.fill : 'url(#gBody)'}" stroke="${p.stroke}" stroke-width="1.65" stroke-linejoin="round"/>
    </g>
  `;
}

function buildThemeCursors(theme, surface) {
  const p = getPalette(theme, surface);
  const accentGrad = theme === 'prism-aurora' ? 'url(#gPrism)' : 'url(#gAccent)';
  const halo = p.halo || p.stroke;
  const ink = theme === 'outlier' || theme === 'prism-aurora' ? p.stroke : (p.fill === '#111827' || p.fill === '#18181b' || p.fill === '#0f172a' ? p.fill : '#ffffff');
  const outer = ink === '#ffffff' ? '#0f172a' : '#ffffff';

  return {
    // === Standard & navigation (7) ===
    'default': renderArrow(theme, p, 'default'),
    'auto': renderArrow(theme, p, 'auto'),
    'pointer': renderPointerHand(theme, p, false),

    'context-menu': `
      ${renderArrow(theme, p, 'default')}
      <rect x="17.2" y="17.6" width="12.0" height="11.4" rx="2.8" fill="${p.badgeBg}" stroke="${p.accent1}" stroke-width="1.6"/>
      <line x1="19.8" y1="21.0" x2="26.6" y2="21.0" stroke="${p.accent1}" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="19.8" y1="23.4" x2="26.6" y2="23.4" stroke="${p.badgeFg}" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="19.8" y1="25.8" x2="24.4" y2="25.8" stroke="${p.badgeFg}" stroke-width="1.5" stroke-linecap="round"/>
    `,

    'help': `
      ${renderArrow(theme, p, 'default')}
      <circle cx="22.8" cy="23.0" r="6.4" fill="${accentGrad}" stroke="${p.stroke}" stroke-width="1.6"/>
      <path d="M21.0 21.2C21.0 20.1 21.8 19.3 22.9 19.3C24.0 19.3 24.8 20.0 24.8 20.9C24.8 21.7 24.3 22.1 23.5 22.5C23.0 22.8 22.8 23.1 22.8 23.8"
            stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="22.8" cy="26.0" r="1.0" fill="#ffffff"/>
    `,

    'progress': `
      ${renderArrow(theme, p, 'default')}
      <circle cx="22.8" cy="22.8" r="6.2" fill="${p.badgeBg}" stroke="${p.stroke}" stroke-width="1.4"/>
      <circle cx="22.8" cy="22.8" r="4.0" stroke="${p.muted}" stroke-width="2" opacity="0.35"/>
      <path d="M22.8 18.8A4.0 4.0 0 0 1 26.8 22.8" stroke="${accentGrad}" stroke-width="2.2" stroke-linecap="round"/>
    `,

    'wait': `
      <circle cx="16" cy="16" r="10.4" fill="${p.badgeBg}" fill-opacity="0.92" stroke="${p.stroke}" stroke-width="1.8"/>
      <circle cx="16" cy="16" r="7.2" stroke="${p.muted}" stroke-width="2.4" opacity="0.28"/>
      <path d="M16 8.8A7.2 7.2 0 0 1 23.2 16" stroke="${accentGrad}" stroke-width="2.7" stroke-linecap="round"/>
      <circle cx="16" cy="8.8" r="1.6" fill="${p.accent1}"/>
    `,

    // === Selection & interaction (7) ===
    'text': `
      <path d="M12.2 6.8H19.8M12.2 25.2H19.8M16 6.8V25.2" stroke="${outer}" stroke-width="4.4" stroke-linecap="round"/>
      <path d="M12.6 6.8H19.4M12.6 25.2H19.4M16 6.8V25.2" stroke="${ink}" stroke-width="2.0" stroke-linecap="round"/>
      <line x1="13.8" y1="16" x2="18.2" y2="16" stroke="${accentGrad}" stroke-width="1.8" stroke-linecap="round"/>
    `,

    'vertical-text': `
      <path d="M6.8 12.2V19.8M25.2 12.2V19.8M6.8 16H25.2" stroke="${outer}" stroke-width="4.4" stroke-linecap="round"/>
      <path d="M6.8 12.6V19.4M25.2 12.6V19.4M6.8 16H25.2" stroke="${ink}" stroke-width="2.0" stroke-linecap="round"/>
      <line x1="16" y1="13.8" x2="16" y2="18.2" stroke="${accentGrad}" stroke-width="1.8" stroke-linecap="round"/>
    `,

    'crosshair': `
      <path d="M16 4.8V12.4M16 19.6V27.2M4.8 16H12.4M19.6 16H27.2" stroke="${outer}" stroke-width="4.0" stroke-linecap="round"/>
      <path d="M16 4.8V12.4M16 19.6V27.2M4.8 16H12.4M19.6 16H27.2" stroke="${ink}" stroke-width="1.9" stroke-linecap="round"/>
      <circle cx="16" cy="16" r="2.2" fill="${accentGrad}" stroke="${outer}" stroke-width="1.1"/>
    `,

    'cell': `
      <path d="M13.2 5.4H18.8V13.2H26.6V18.8H18.8V26.6H13.2V18.8H5.4V13.2H13.2V5.4Z"
            fill="${surface === 'light' ? '#ffffff' : '#0f172a'}" stroke="${ink}" stroke-width="2.0" stroke-linejoin="round"/>
      <rect x="14.5" y="14.5" width="3.0" height="3.0" rx="0.8" fill="${p.accent1}"/>
    `,

    'alias': `
      ${renderArrow(theme, p, 'default')}
      <rect x="17.0" y="17.2" width="12.2" height="12.0" rx="3.4" fill="${p.badgeBg}" stroke="${p.accent1}" stroke-width="1.7"/>
      <path d="M19.8 25.6C19.8 22.8 21.5 21.4 24.8 21.4H26.0M24.0 19.5L26.2 21.4L24.0 23.3"
            stroke="${p.accent1}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
    `,

    'copy': `
      ${renderArrow(theme, p, 'default')}
      <circle cx="22.8" cy="23.0" r="6.4" fill="#16a34a" stroke="${p.stroke}" stroke-width="1.6"/>
      <path d="M22.8 19.7V26.3M19.5 23.0H26.1" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
    `,

    'move': theme === 'outlier' ? `
      <path d="M12.6 9.8L16 6.2L19.4 9.8M12.6 22.2L16 25.8L19.4 22.2M9.8 12.6L6.2 16L9.8 19.4M22.2 12.6L25.8 16L22.2 19.4"
            stroke="${halo}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12.6 9.8L16 6.2L19.4 9.8M12.6 22.2L16 25.8L19.4 22.2M9.8 12.6L6.2 16L9.8 19.4M22.2 12.6L25.8 16L22.2 19.4"
            stroke="${p.stroke}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="16" cy="16" r="2.0" fill="url(#gAccent)"/>
    ` : `
      <path d="M16 3.8L20.4 8.4H17.8V14.2H23.6V11.6L28.2 16L23.6 20.4V17.8H17.8V23.6H20.4L16 28.2L11.6 23.6H14.2V17.8H8.4V20.4L3.8 16L8.4 11.6V14.2H14.2V8.4H11.6L16 3.8Z"
            fill="${theme === 'prism-aurora' ? p.fill : 'url(#gBody)'}" stroke="${p.stroke}" stroke-width="1.7" stroke-linejoin="round"/>
      <circle cx="16" cy="16" r="2.1" fill="${accentGrad}"/>
    `,

    // === Drag & drop (5) ===
    'grab': renderOpenHand(theme, p),
    'grabbing': renderClosedHand(theme, p, 0),

    'no-drop': `
      ${renderArrow(theme, p, 'default')}
      <circle cx="22.8" cy="23.0" r="6.3" fill="#dc2626" stroke="${p.stroke}" stroke-width="1.6"/>
      <circle cx="22.8" cy="23.0" r="3.9" stroke="#ffffff" stroke-width="1.7"/>
      <line x1="20.1" y1="20.3" x2="25.5" y2="25.7" stroke="#ffffff" stroke-width="1.9" stroke-linecap="round"/>
    `,

    'not-allowed': `
      <circle cx="16" cy="16" r="10.4" fill="#dc2626" stroke="${outer}" stroke-width="2.0"/>
      <circle cx="16" cy="16" r="6.8" stroke="#ffffff" stroke-width="2.2"/>
      <line x1="11.2" y1="11.2" x2="20.8" y2="20.8" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/>
    `,

    'dragging': `
      <rect x="4.0" y="3.2" width="13.2" height="9.2" rx="2.4" fill="${p.badgeBg}" stroke="${p.accent1}" stroke-width="1.6"/>
      <line x1="6.8" y1="6.4" x2="14.4" y2="6.4" stroke="${p.accent1}" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="6.8" y1="9.2" x2="12.2" y2="9.2" stroke="${p.badgeFg}" stroke-width="1.3" stroke-linecap="round" opacity="0.7"/>
      <path d="M20.2 5.4H26.4M22.2 8.2H27.6" stroke="${p.accent1}" stroke-width="1.6" stroke-linecap="round"/>
      ${renderClosedHand(theme, p, 2.5)}
    `,

    // === Resize (14) ===
    'col-resize': `
      <path d="M14.2 6.0V26.0M17.8 6.0V26.0" stroke="${outer}" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M14.2 6.4V25.6M17.8 6.4V25.6" stroke="${accentGrad}" stroke-width="1.7" stroke-linecap="round"/>
      <path d="M4.2 16L10.2 10.8V14.0H12.0V18.0H10.2V21.2L4.2 16Z" fill="${theme === 'outlier' || theme === 'prism-aurora' ? p.fill : 'url(#gBody)'}" stroke="${p.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M27.8 16L21.8 10.8V14.0H20.0V18.0H21.8V21.2L27.8 16Z" fill="${theme === 'outlier' || theme === 'prism-aurora' ? p.fill : 'url(#gBody)'}" stroke="${p.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    `,

    'row-resize': `
      <g transform="rotate(90 16 16)">
        <path d="M14.2 6.0V26.0M17.8 6.0V26.0" stroke="${outer}" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M14.2 6.4V25.6M17.8 6.4V25.6" stroke="${accentGrad}" stroke-width="1.7" stroke-linecap="round"/>
        <path d="M4.2 16L10.2 10.8V14.0H12.0V18.0H10.2V21.2L4.2 16Z" fill="${theme === 'outlier' || theme === 'prism-aurora' ? p.fill : 'url(#gBody)'}" stroke="${p.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M27.8 16L21.8 10.8V14.0H20.0V18.0H21.8V21.2L27.8 16Z" fill="${theme === 'outlier' || theme === 'prism-aurora' ? p.fill : 'url(#gBody)'}" stroke="${p.stroke}" stroke-width="1.5" stroke-linejoin="round"/>
      </g>
    `,

    'n-resize': renderEdgeResize(theme, p, 0),
    'e-resize': renderEdgeResize(theme, p, 90),
    's-resize': renderEdgeResize(theme, p, 180),
    'w-resize': renderEdgeResize(theme, p, 270),
    'ne-resize': renderCornerResize(theme, p, 0),
    'se-resize': renderCornerResize(theme, p, 90),
    'sw-resize': renderCornerResize(theme, p, 180),
    'nw-resize': renderCornerResize(theme, p, 270),
    'ns-resize': renderDoubleResize(theme, p, 0),
    'ew-resize': renderDoubleResize(theme, p, 90),
    'nesw-resize': renderDoubleResize(theme, p, 45),
    'nwse-resize': renderDoubleResize(theme, p, -45),

    // === Zoom (2) ===
    'zoom-in': `
      <line x1="19.6" y1="19.6" x2="27.0" y2="27.0" stroke="${outer}" stroke-width="5.0" stroke-linecap="round"/>
      <line x1="19.6" y1="19.6" x2="27.0" y2="27.0" stroke="${ink}" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="13.2" cy="13.2" r="8.2" fill="${p.badgeBg}" stroke="${ink}" stroke-width="2.2"/>
      <path d="M13.2 9.4V17.0M9.4 13.2H17.0" stroke="${accentGrad}" stroke-width="2.2" stroke-linecap="round"/>
    `,

    'zoom-out': `
      <line x1="19.6" y1="19.6" x2="27.0" y2="27.0" stroke="${outer}" stroke-width="5.0" stroke-linecap="round"/>
      <line x1="19.6" y1="19.6" x2="27.0" y2="27.0" stroke="${ink}" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="13.2" cy="13.2" r="8.2" fill="${p.badgeBg}" stroke="${ink}" stroke-width="2.2"/>
      <path d="M9.4 13.2H17.0" stroke="${accentGrad}" stroke-width="2.2" stroke-linecap="round"/>
    `,

    // === Custom ICST Labs cursor states (6) ===
    'icst-default': renderArrow(theme, p, 'icst'),
    'icst-pointer': renderPointerHand(theme, p, false),
    'icst-click': renderPointerHand(theme, p, true),

    'icst-loading': `
      <circle cx="16" cy="16" r="11.4" fill="${p.badgeBg}" stroke="${p.stroke}" stroke-width="1.8"/>
      <circle cx="16" cy="16" r="8.6" stroke="${p.muted}" stroke-width="2.1" opacity="0.28"/>
      <path d="M16 7.4A8.6 8.6 0 0 1 24.6 16" stroke="${accentGrad}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M13.8 10.6H18.2M14.7 10.6V13.8L12.1 19.1C11.8 19.7 12.2 20.4 12.9 20.4H19.1C19.8 20.4 20.2 19.7 19.9 19.1L17.3 13.8V10.6"
            fill="${p.accent1}" fill-opacity="0.25" stroke="${p.badgeFg}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M13.1 17.5H18.9L19.5 19.4C19.6 19.7 19.4 19.9 19.0 19.9H13.0C12.6 19.9 12.4 19.7 12.5 19.4L13.1 17.5Z" fill="${p.accent1}"/>
    `,

    'icst-success': `
      ${renderArrow(theme, p, 'icst')}
      <circle cx="22.8" cy="23.0" r="6.6" fill="#16a34a" stroke="${p.stroke}" stroke-width="1.6"/>
      <path d="M19.6 23.1L21.8 25.3L26.2 20.7" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    `,

    'icst-error': `
      ${renderArrow(theme, p, 'icst')}
      <circle cx="22.8" cy="23.0" r="6.6" fill="#dc2626" stroke="${p.stroke}" stroke-width="1.6"/>
      <path d="M20.2 20.4L25.4 25.6M25.4 20.4L20.2 25.6" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
    `,
  };
}

let totalFiles = 0;

for (const theme of THEMES) {
  for (const surface of TONES) {
    const outDir = path.join(ROOT_OUT, theme, surface);
    fs.mkdirSync(outDir, { recursive: true });
    const palette = getPalette(theme, surface);
    const map = buildThemeCursors(theme, surface);
    for (const [name, body] of Object.entries(map)) {
      const svg = wrapSvg(body, palette);
      fs.writeFileSync(path.join(outDir, `${name}.svg`), svg, 'utf8');
      totalFiles++;

      // Keep root /cursors/<name>.svg updated to fluent/light (modern default fallback)
      if (theme === 'fluent' && surface === 'light') {
        fs.writeFileSync(path.join(ROOT_OUT, `${name}.svg`), svg, 'utf8');
      }
    }
  }
}

console.log(`Generated ${totalFiles} themed modern SVG cursors (5 themes x 2 surfaces x 41 cursors) + 41 root fallbacks.`);

