import React from 'react';
import { TypingTheme } from '../../types/typing';

export interface SummaryBadgeSlotProps {
  earned: boolean;
  stars?: number; // 0, 1, 2, or 3
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  subLabel?: string;
  tooltip?: string;
  theme: TypingTheme;
  onClick?: () => void;
  className?: string;
}

export const SummaryBadgeSlot: React.FC<SummaryBadgeSlotProps> = ({
  earned,
  stars = 0,
  size = 'md',
  label,
  subLabel,
  tooltip,
  theme,
  onClick,
  className = ''
}) => {
  const isDark = theme === 'dark';

  // Sizing mapping
  const sizeMap = {
    sm: { diameter: 38, iconSize: 18, fontSize: '10px', subSize: '9px', rayCount: 8 },
    md: { diameter: 58, iconSize: 28, fontSize: '12px', subSize: '10px', rayCount: 12 },
    lg: { diameter: 86, iconSize: 42, fontSize: '14px', subSize: '12px', rayCount: 16 }
  };

  const currentSize = sizeMap[size];

  return (
    <div
      className={`summary-badge-slot ${earned ? 'is-earned' : 'is-unearned'} ${className}`}
      onClick={onClick}
      title={tooltip || label}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      <div
        className={`summary-badge-circle ${earned ? 'is-earned' : ''}`}
        style={{
          width: `${currentSize.diameter}px`,
          height: `${currentSize.diameter}px`,
          position: 'relative'
        }}
      >
        {earned ? (
          /* ============================================================= */
          /* GOLDEN SUNBURST PIXEL MEDAL BADGE                             */
          /* ============================================================= */
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Rotating / Glowing Sunburst Rays Behind Disc */}
            <svg
              viewBox="0 0 100 100"
              style={{
                position: 'absolute',
                inset: '-12%',
                width: '124%',
                height: '124%',
                animation: 'sunburstRotate 14s linear infinite',
                pointerEvents: 'none'
              }}
            >
              <g fill="#facc15" opacity="0.35">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                  <path
                    key={deg}
                    d="M 50 50 L 46 0 L 54 0 Z"
                    transform={`rotate(${deg} 50 50)`}
                  />
                ))}
              </g>
            </svg>

            {/* Radiant Golden Medal Core */}
            <svg
              viewBox="0 0 100 100"
              style={{
                width: '100%',
                height: '100%',
                zIndex: 2,
                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))'
              }}
            >
              <defs>
                <radialGradient id="goldGrad" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="35%" stopColor="#fde047" />
                  <stop offset="75%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#a16207" />
                </radialGradient>
                <linearGradient id="rimGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#ca8a04" />
                  <stop offset="100%" stopColor="#713f12" />
                </linearGradient>
              </defs>

              {/* Beveled Outer Ring */}
              <circle cx="50" cy="50" r="44" fill="url(#rimGrad)" stroke="#fef08a" strokeWidth="2" />
              {/* Inner Medal Disc */}
              <circle cx="50" cy="50" r="37" fill="url(#goldGrad)" stroke="#ca8a04" strokeWidth="1.5" />

              {/* Center Iconography: 1, 2, or 3 Stars OR Ribbon Crest */}
              {stars > 0 ? (
                <g fill="#ffffff" filter="drop-shadow(0 1px 2px rgba(113, 63, 18, 0.6))">
                  {stars === 1 && (
                    <polygon
                      points="50,28 54,40 67,40 57,48 61,60 50,52 39,60 43,48 33,40 46,40"
                      transform="scale(1.1) translate(-5, -4)"
                    />
                  )}
                  {stars === 2 && (
                    <>
                      <polygon
                        points="42,35 45,43 54,43 47,48 50,56 42,51 34,56 37,48 30,43 39,43"
                        transform="scale(0.85) translate(4, 8)"
                      />
                      <polygon
                        points="58,35 61,43 70,43 63,48 66,56 58,51 50,56 53,48 46,43 55,43"
                        transform="scale(0.85) translate(14, 8)"
                      />
                    </>
                  )}
                  {stars >= 3 && (
                    <>
                      <polygon points="50,25 53,33 62,33 55,38 58,46 50,41 42,46 45,38 38,33 47,33" transform="scale(0.9) translate(5, 5)" />
                      <polygon points="34,42 36,48 43,48 37,52 39,58 34,54 29,58 31,52 25,48 32,48" transform="scale(0.75) translate(8, 14)" />
                      <polygon points="66,42 68,48 75,48 69,52 71,58 66,54 61,58 63,52 57,48 64,48" transform="scale(0.75) translate(18, 14)" />
                    </>
                  )}
                </g>
              ) : (
                /* Star Crown Crest */
                <g fill="#713f12" opacity="0.85">
                  <path d="M 36 62 L 64 62 L 60 42 L 50 50 L 40 42 Z" />
                  <circle cx="37" cy="40" r="2.5" />
                  <circle cx="50" cy="36" r="3" />
                  <circle cx="63" cy="40" r="2.5" />
                </g>
              )}

              {/* Pixel Notch Accents on Rim */}
              <rect x="48" y="7" width="4" height="3" fill="#ffffff" opacity="0.8" />
              <rect x="48" y="90" width="4" height="3" fill="#713f12" opacity="0.8" />
              <rect x="7" y="48" width="3" height="4" fill="#ffffff" opacity="0.8" />
              <rect x="90" y="48" width="3" height="4" fill="#713f12" opacity="0.8" />
            </svg>
          </div>
        ) : (
          /* ============================================================= */
          /* RECESSED CIRCULAR RING SLOT (Unearned / Locked)               */
          /* ============================================================= */
          <svg
            viewBox="0 0 100 100"
            style={{
              width: '100%',
              height: '100%',
              opacity: isDark ? 0.45 : 0.6
            }}
          >
            {/* Outer Inset Socket */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={isDark ? '#383f4c' : '#c9bcab'}
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* Subtle Inner Ring */}
            <circle
              cx="50"
              cy="50"
              r="34"
              fill="none"
              stroke={isDark ? '#2b313c' : '#ded5c5'}
              strokeWidth="1.5"
            />
            {/* Center Lock / Keyhole Silhouette */}
            <circle cx="50" cy="46" r="6" fill={isDark ? '#465063' : '#a89d8d'} />
            <polygon
              points="47,48 53,48 54,62 46,62"
              fill={isDark ? '#465063' : '#a89d8d'}
            />
          </svg>
        )}
      </div>

      {/* Optional Badge Label & Subtext */}
      {label && (
        <span
          style={{
            fontSize: currentSize.fontSize,
            fontWeight: 700,
            color: earned ? (isDark ? '#f8fafc' : '#1c1915') : (isDark ? '#64748b' : '#8c8172'),
            textAlign: 'center',
            lineHeight: 1.2
          }}
        >
          {label}
        </span>
      )}

      {subLabel && (
        <span
          style={{
            fontSize: currentSize.subSize,
            fontWeight: 500,
            color: isDark ? '#94a3b8' : '#756c5e',
            textAlign: 'center',
            lineHeight: 1.1
          }}
        >
          {subLabel}
        </span>
      )}
    </div>
  );
};
