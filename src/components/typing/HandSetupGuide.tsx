import React, { useMemo } from 'react';
import { Hand, Play, Sparkles, Target, CheckCircle2, X } from 'lucide-react';
import { TouchTypingLevel, FingerCode, TypingTheme } from '../../types/touchTyping';
import { CHAR_MAP, FINGER_META } from '../../data/touchTypingGeometry';

export interface HandSetupGuideProps {
  level: TouchTypingLevel;
  theme: TypingTheme;
  onStart: () => void;
  isMidSession?: boolean;
}

interface HomeAnchor {
  finger: FingerCode;
  keyLabel: string;
  fingerName: string;
  bump?: boolean;
  hand: 'left' | 'right' | 'thumb';
  tipX: number;
  tipY: number;
}

const HOME_ANCHORS: HomeAnchor[] = [
  { finger: 'LP', keyLabel: 'A', fingerName: 'L. Pinky', hand: 'left', tipX: 112, tipY: 56 },
  { finger: 'LR', keyLabel: 'S', fingerName: 'L. Ring', hand: 'left', tipX: 162, tipY: 32 },
  { finger: 'LM', keyLabel: 'D', fingerName: 'L. Middle', hand: 'left', tipX: 214, tipY: 22 },
  { finger: 'LI', keyLabel: 'F', fingerName: 'L. Index', bump: true, hand: 'left', tipX: 266, tipY: 36 },
  { finger: 'THUMB', keyLabel: '␣', fingerName: 'Thumbs', hand: 'thumb', tipX: 334, tipY: 116 },
  { finger: 'RI', keyLabel: 'J', fingerName: 'R. Index', bump: true, hand: 'right', tipX: 494, tipY: 36 },
  { finger: 'RM', keyLabel: 'K', fingerName: 'R. Middle', hand: 'right', tipX: 546, tipY: 22 },
  { finger: 'RR', keyLabel: 'L', fingerName: 'R. Ring', hand: 'right', tipX: 598, tipY: 32 },
  { finger: 'RP', keyLabel: ';', fingerName: 'R. Pinky', hand: 'right', tipX: 648, tipY: 56 }
];

const FINGER_HOME_KEY: Record<FingerCode, string> = {
  LP: 'A',
  LR: 'S',
  LM: 'D',
  LI: 'F',
  THUMB: 'Space',
  RI: 'J',
  RM: 'K',
  RR: 'L',
  RP: ';'
};

const FINGER_ORDER: FingerCode[] = ['LP', 'LR', 'LM', 'LI', 'THUMB', 'RI', 'RM', 'RR', 'RP'];

export const HandSetupGuide: React.FC<HandSetupGuideProps> = ({
  level,
  theme,
  onStart,
  isMidSession = false
}) => {
  const isDark = theme === 'dark';
  const focusMode = level.focusMode || (level.id <= 12 ? 'learning' : 'challenge');

  // Deduplicated practiced keys & finger mapping for this level
  const { activeFingers, fingerKeyGroups, usesShift } = useMemo(() => {
    const seen = new Set<string>();
    const uniqueKeys: string[] = [];
    for (const k of level.focusKeys) {
      if (!seen.has(k)) {
        seen.add(k);
        uniqueKeys.push(k);
      }
    }

    const fingerSet = new Set<FingerCode>();
    const grouped: Partial<Record<FingerCode, string[]>> = {};
    let needsShiftAny = false;

    uniqueKeys.forEach(ch => {
      const meta = CHAR_MAP[ch] || (ch === ' ' ? CHAR_MAP[' '] : undefined);
      if (!meta) return;
      fingerSet.add(meta.finger);
      if (!grouped[meta.finger]) grouped[meta.finger] = [];
      grouped[meta.finger]!.push(ch === ' ' ? 'Space' : ch);
      if (meta.shiftFinger) {
        needsShiftAny = true;
        fingerSet.add(meta.shiftFinger);
      }
    });

    const orderedGroups = FINGER_ORDER
      .filter(f => grouped[f] && grouped[f]!.length > 0)
      .map(f => ({
        finger: f,
        meta: FINGER_META[f],
        homeKey: FINGER_HOME_KEY[f],
        keys: grouped[f]!
      }));

    return {
      activeFingers: fingerSet,
      fingerKeyGroups: orderedGroups,
      usesShift: needsShiftAny
    };
  }, [level.focusKeys]);

  const leftAnchors = HOME_ANCHORS.filter(a => a.hand === 'left');
  const rightAnchors = HOME_ANCHORS.filter(a => a.hand === 'right');

  const skinFill = isDark ? '#272c36' : '#f5ede0';
  const palmFill = isDark ? '#21252e' : '#ece1d1';
  const outlineStroke = isDark ? '#4b5568' : '#b7a892';

  const getFingerFill = (finger: FingerCode) => {
    const color = FINGER_META[finger]?.color || '#38bdf8';
    if (activeFingers.has(finger)) {
      return isDark ? `${color}40` : `${color}38`;
    }
    return skinFill;
  };

  const getFingerStroke = (finger: FingerCode) => {
    const color = FINGER_META[finger]?.color || '#38bdf8';
    return activeFingers.has(finger) ? color : outlineStroke;
  };

  return (
    <div
      className="hand-guide-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hand-guide-title"
      onClick={e => {
        if (e.target === e.currentTarget) onStart();
      }}
    >
      <div className={`hand-guide-card ${isDark ? 'is-dark' : 'is-light'}`}>
        {/* Top Row: Level & Mode Pills + Close */}
        <div className="hand-guide-header">
          <div className="hand-guide-title-block">
            <div className="hand-guide-badges">
              <span className="hand-guide-level-pill">
                Level {level.id} • Stage {level.stage}
              </span>
              <span className={`hand-guide-mode-pill ${focusMode}`}>
                <Sparkles size={11} />
                <span>{focusMode === 'learning' ? 'Learning Focus' : 'Challenge Focus'}</span>
              </span>
            </div>
            <h2 id="hand-guide-title" className="hand-guide-title">
              <Hand size={18} color={isDark ? '#38bdf8' : '#0284c7'} />
              <span>Set Your Fingers Before Starting</span>
            </h2>
            <p className="hand-guide-subtitle">
              Rest your index fingers on the raised bumps on <strong>F</strong> and <strong>J</strong>, align your remaining fingers on <strong>A S D F</strong> — <strong>J K L ;</strong>, and hover thumbs over <strong>Space</strong>.
            </p>
          </div>

          <button
            type="button"
            className="hand-guide-close-btn"
            onClick={onStart}
            aria-label="Close hand placement guide"
            title="Dismiss guide"
          >
            <X size={16} />
          </button>
        </div>

        {/* Visual Home-Row Keycaps + Illustrated Hand Placement Diagram */}
        <div className="hand-guide-stage">
          {/* Home Row Anchor Keycaps */}
          <div className="hand-guide-homerow">
            <div className="hand-guide-key-group">
              <span className="hand-guide-hand-label">LEFT HAND</span>
              <div className="hand-guide-keys-row">
                {leftAnchors.map(anchor => {
                  const color = FINGER_META[anchor.finger]?.color || '#38bdf8';
                  const isUsed = activeFingers.has(anchor.finger);
                  return (
                    <div
                      key={anchor.finger}
                      className={`hand-guide-keycap ${isUsed ? 'is-used' : ''}`}
                      style={{
                        borderColor: isUsed ? color : undefined,
                        boxShadow: isUsed ? `0 0 0 2px ${color}30` : undefined
                      }}
                    >
                      <span className="hand-guide-key-letter">{anchor.keyLabel}</span>
                      {anchor.bump && (
                        <span
                          className="hand-guide-bump"
                          style={{ background: color }}
                          title="Tactile index bump"
                        />
                      )}
                      <span className="hand-guide-key-finger" style={{ color }}>
                        {anchor.fingerName.replace('L. ', '')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="hand-guide-key-divider" aria-hidden="true">
              <span>G</span>
              <span>H</span>
            </div>

            <div className="hand-guide-key-group">
              <span className="hand-guide-hand-label">RIGHT HAND</span>
              <div className="hand-guide-keys-row">
                {rightAnchors.map(anchor => {
                  const color = FINGER_META[anchor.finger]?.color || '#38bdf8';
                  const isUsed = activeFingers.has(anchor.finger);
                  return (
                    <div
                      key={anchor.finger}
                      className={`hand-guide-keycap ${isUsed ? 'is-used' : ''}`}
                      style={{
                        borderColor: isUsed ? color : undefined,
                        boxShadow: isUsed ? `0 0 0 2px ${color}30` : undefined
                      }}
                    >
                      <span className="hand-guide-key-letter">{anchor.keyLabel}</span>
                      {anchor.bump && (
                        <span
                          className="hand-guide-bump"
                          style={{ background: color }}
                          title="Tactile index bump"
                        />
                      )}
                      <span className="hand-guide-key-finger" style={{ color }}>
                        {anchor.fingerName.replace('R. ', '')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dual-Hand SVG Placement Visual */}
          <svg
            viewBox="0 0 760 205"
            className="hand-guide-svg"
            role="img"
            aria-label="Visual finger placement diagram for left hand on A S D F, right hand on J K L semicolon, and thumbs on Spacebar"
          >
            {/* LEFT HAND */}
            <g>
              {/* Left Palm */}
              <path
                d="M 118 202 L 106 146 C 102 126, 114 112, 134 106 L 274 108 C 296 116, 306 134, 298 160 L 288 202 Z"
                fill={palmFill}
                stroke={outlineStroke}
                strokeWidth="1.8"
              />
              {/* Left Pinky (A) */}
              <rect x="97" y="42" width="30" height="78" rx="15" fill={getFingerFill('LP')} stroke={getFingerStroke('LP')} strokeWidth={activeFingers.has('LP') ? 2.4 : 1.6} />
              {/* Left Ring (S) */}
              <rect x="146" y="18" width="32" height="96" rx="16" fill={getFingerFill('LR')} stroke={getFingerStroke('LR')} strokeWidth={activeFingers.has('LR') ? 2.4 : 1.6} />
              {/* Left Middle (D) */}
              <rect x="198" y="8" width="32" height="106" rx="16" fill={getFingerFill('LM')} stroke={getFingerStroke('LM')} strokeWidth={activeFingers.has('LM') ? 2.4 : 1.6} />
              {/* Left Index (F) */}
              <rect x="250" y="22" width="32" height="94" rx="16" fill={getFingerFill('LI')} stroke={getFingerStroke('LI')} strokeWidth={activeFingers.has('LI') ? 2.4 : 1.6} />
              {/* Left Thumb */}
              <path
                d="M 288 134 C 308 118, 336 96, 352 102 C 362 106, 360 122, 346 136 C 328 154, 306 168, 292 172 Z"
                fill={getFingerFill('THUMB')}
                stroke={getFingerStroke('THUMB')}
                strokeWidth={activeFingers.has('THUMB') ? 2.4 : 1.6}
              />
            </g>

            {/* RIGHT HAND */}
            <g>
              {/* Right Palm */}
              <path
                d="M 642 202 L 654 146 C 658 126, 646 112, 626 106 L 486 108 C 464 116, 454 134, 462 160 L 472 202 Z"
                fill={palmFill}
                stroke={outlineStroke}
                strokeWidth="1.8"
              />
              {/* Right Thumb */}
              <path
                d="M 472 134 C 452 118, 424 96, 408 102 C 398 106, 400 122, 414 136 C 432 154, 454 168, 468 172 Z"
                fill={getFingerFill('THUMB')}
                stroke={getFingerStroke('THUMB')}
                strokeWidth={activeFingers.has('THUMB') ? 2.4 : 1.6}
              />
              {/* Right Index (J) */}
              <rect x="478" y="22" width="32" height="94" rx="16" fill={getFingerFill('RI')} stroke={getFingerStroke('RI')} strokeWidth={activeFingers.has('RI') ? 2.4 : 1.6} />
              {/* Right Middle (K) */}
              <rect x="530" y="8" width="32" height="106" rx="16" fill={getFingerFill('RM')} stroke={getFingerStroke('RM')} strokeWidth={activeFingers.has('RM') ? 2.4 : 1.6} />
              {/* Right Ring (L) */}
              <rect x="582" y="18" width="32" height="96" rx="16" fill={getFingerFill('RR')} stroke={getFingerStroke('RR')} strokeWidth={activeFingers.has('RR') ? 2.4 : 1.6} />
              {/* Right Pinky (;) */}
              <rect x="633" y="42" width="30" height="78" rx="15" fill={getFingerFill('RP')} stroke={getFingerStroke('RP')} strokeWidth={activeFingers.has('RP') ? 2.4 : 1.6} />
            </g>

            {/* Fingertip Home-Row Anchor Badges */}
            {HOME_ANCHORS.filter(a => a.hand !== 'thumb').map(anchor => {
              const color = FINGER_META[anchor.finger]?.color || '#38bdf8';
              const isUsed = activeFingers.has(anchor.finger);
              return (
                <g key={anchor.finger}>
                  {isUsed && (
                    <circle
                      cx={anchor.tipX}
                      cy={anchor.tipY}
                      r="16"
                      fill="none"
                      stroke={color}
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                      opacity="0.85"
                    />
                  )}
                  <circle
                    cx={anchor.tipX}
                    cy={anchor.tipY}
                    r="11.5"
                    fill={isUsed ? color : (isDark ? '#1c2029' : '#ffffff')}
                    stroke={color}
                    strokeWidth="1.8"
                  />
                  <text
                    x={anchor.tipX}
                    y={anchor.tipY + 4}
                    textAnchor="middle"
                    fontSize="11.5"
                    fontWeight="800"
                    fill={isUsed ? '#0f172a' : (isDark ? '#e2e8f0' : '#1c1915')}
                  >
                    {anchor.keyLabel}
                  </text>
                </g>
              );
            })}

            {/* Spacebar Pill Between Thumbs */}
            <g>
              <rect
                x="315"
                y="152"
                width="130"
                height="28"
                rx="8"
                fill={activeFingers.has('THUMB') ? (isDark ? 'rgba(56,189,248,0.22)' : '#e0f2fe') : (isDark ? '#1c2029' : '#ffffff')}
                stroke={activeFingers.has('THUMB') ? '#38bdf8' : outlineStroke}
                strokeWidth={activeFingers.has('THUMB') ? 2 : 1.4}
              />
              <text
                x="380"
                y="170"
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="700"
                letterSpacing="0.8"
                fill={activeFingers.has('THUMB') ? (isDark ? '#7dd3fc' : '#0369a1') : (isDark ? '#94a3b8' : '#64748b')}
              >
                SPACEBAR (THUMBS)
              </text>
            </g>
          </svg>
        </div>

        {/* Practiced Keys & Assigned Fingers for This Level */}
        <div className="hand-guide-level-keys">
          <div className="hand-guide-section-title">
            <CheckCircle2 size={14} color="#10b981" />
            <span>
              Keys Practiced in Level {level.id}: <strong>{level.title}</strong>
            </span>
            {usesShift && (
              <span className="hand-guide-shift-note">
                Use opposite-hand Pinky for Shift
              </span>
            )}
          </div>

          <div className="hand-guide-finger-map">
            {fingerKeyGroups.map(group => {
              const color = group.meta.color || '#38bdf8';
              return (
                <div
                  key={group.finger}
                  className="hand-guide-finger-chip"
                  style={{ borderLeftColor: color }}
                >
                  <span className="hand-guide-finger-chip-label">
                    <span className="hand-guide-dot" style={{ background: color }} />
                    <span>{group.meta.short}</span>
                    <span className="hand-guide-home-ref">({group.homeKey})</span>
                  </span>
                  <span className="hand-guide-finger-chip-keys">
                    {group.keys.map((k, idx) => (
                      <kbd key={`${group.finger}-${k}-${idx}`} className="hand-guide-mini-kbd">
                        {k}
                      </kbd>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Goal & Start Action */}
        <div className="hand-guide-footer">
          <div className="hand-guide-goal">
            <Target size={14} color={isDark ? '#38bdf8' : '#0284c7'} />
            <span>Target: <strong>{level.criteriaDesc}</strong></span>
          </div>

          <div className="hand-guide-actions">
            <span className="hand-guide-kbd-hint">
              Press <kbd>Space</kbd> or <kbd>Enter</kbd>
            </span>
            <button
              type="button"
              className="hand-guide-start-btn"
              onClick={onStart}
            >
              <Play size={15} />
              <span>{isMidSession ? 'Resume Level' : 'Hands Ready — Start Level'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

