import { FingerId, FingerInfo, KeyDef, CharLookupDef } from '../../types/typing';
import { TOUCH_TYPING_LEVELS } from '../../data/touchTypingLevels';

// ============================================================================
// KEYBOARD GEOMETRY & FINGER MAPPING (15-Unit Normalized Width Coordinate System)
// Precisely maps each key's horizontal X position to the 3 track bars and 10 fingers
// ============================================================================
export const KEYBOARD_ROWS: KeyDef[][] = [
  [
    { id: 'Backquote', label: '`', shift: '~', x: 0, w: 1, finger: 'LP' },
    { id: 'Digit1', label: '1', shift: '!', x: 1, w: 1, finger: 'LP' },
    { id: 'Digit2', label: '2', shift: '@', x: 2, w: 1, finger: 'LR' },
    { id: 'Digit3', label: '3', shift: '#', x: 3, w: 1, finger: 'LM' },
    { id: 'Digit4', label: '4', shift: '$', x: 4, w: 1, finger: 'LI' },
    { id: 'Digit5', label: '5', shift: '%', x: 5, w: 1, finger: 'LI' },
    { id: 'Digit6', label: '6', shift: '^', x: 6, w: 1, finger: 'RI' },
    { id: 'Digit7', label: '7', shift: '&', x: 7, w: 1, finger: 'RI' },
    { id: 'Digit8', label: '8', shift: '*', x: 8, w: 1, finger: 'RM' },
    { id: 'Digit9', label: '9', shift: '(', x: 9, w: 1, finger: 'RR' },
    { id: 'Digit0', label: '0', shift: ')', x: 10, w: 1, finger: 'RP' },
    { id: 'Minus', label: '-', shift: '_', x: 11, w: 1, finger: 'RP' },
    { id: 'Equal', label: '=', shift: '+', x: 12, w: 1, finger: 'RP' },
    { id: 'Backspace', label: '⌫', x: 13, w: 2, finger: 'RP', isSpecial: true }
  ],
  [
    { id: 'Tab', label: 'Tab', x: 0, w: 1.5, finger: 'LP', isSpecial: true },
    { id: 'KeyQ', label: 'q', shift: 'Q', x: 1.5, w: 1, finger: 'LP' },
    { id: 'KeyW', label: 'w', shift: 'W', x: 2.5, w: 1, finger: 'LR' },
    { id: 'KeyE', label: 'e', shift: 'E', x: 3.5, w: 1, finger: 'LM' },
    { id: 'KeyR', label: 'r', shift: 'R', x: 4.5, w: 1, finger: 'LI' },
    { id: 'KeyT', label: 't', shift: 'T', x: 5.5, w: 1, finger: 'LI' },
    { id: 'KeyY', label: 'y', shift: 'Y', x: 6.5, w: 1, finger: 'RI' },
    { id: 'KeyU', label: 'u', shift: 'U', x: 7.5, w: 1, finger: 'RI' },
    { id: 'KeyI', label: 'i', shift: 'I', x: 8.5, w: 1, finger: 'RM' },
    { id: 'KeyO', label: 'o', shift: 'O', x: 9.5, w: 1, finger: 'RR' },
    { id: 'KeyP', label: 'p', shift: 'P', x: 10.5, w: 1, finger: 'RP' },
    { id: 'BracketLeft', label: '[', shift: '{', x: 11.5, w: 1, finger: 'RP' },
    { id: 'BracketRight', label: ']', shift: '}', x: 12.5, w: 1, finger: 'RP' },
    { id: 'Backslash', label: '\\', shift: '|', x: 13.5, w: 1.5, finger: 'RP' }
  ],
  [
    { id: 'CapsLock', label: 'Caps', x: 0, w: 1.8, finger: 'LP', isSpecial: true },
    { id: 'KeyA', label: 'a', shift: 'A', x: 1.8, w: 1, finger: 'LP', home: true },
    { id: 'KeyS', label: 's', shift: 'S', x: 2.8, w: 1, finger: 'LR', home: true },
    { id: 'KeyD', label: 'd', shift: 'D', x: 3.8, w: 1, finger: 'LM', home: true },
    { id: 'KeyF', label: 'f', shift: 'F', x: 4.8, w: 1, finger: 'LI', home: true, bump: true },
    { id: 'KeyG', label: 'g', shift: 'G', x: 5.8, w: 1, finger: 'LI' },
    { id: 'KeyH', label: 'h', shift: 'H', x: 6.8, w: 1, finger: 'RI' },
    { id: 'KeyJ', label: 'j', shift: 'J', x: 7.8, w: 1, finger: 'RI', home: true, bump: true },
    { id: 'KeyK', label: 'k', shift: 'K', x: 8.8, w: 1, finger: 'RM', home: true },
    { id: 'KeyL', label: 'l', shift: 'L', x: 9.8, w: 1, finger: 'RR', home: true },
    { id: 'Semicolon', label: ';', shift: ':', x: 10.8, w: 1, finger: 'RP', home: true },
    { id: 'Quote', label: "'", shift: '"', x: 11.8, w: 1, finger: 'RP' },
    { id: 'Enter', label: 'Enter', x: 12.8, w: 2.2, finger: 'RP', isSpecial: true }
  ],
  [
    { id: 'ShiftLeft', label: 'Shift', x: 0, w: 2.3, finger: 'LP', isSpecial: true },
    { id: 'KeyZ', label: 'z', shift: 'Z', x: 2.3, w: 1, finger: 'LP' },
    { id: 'KeyX', label: 'x', shift: 'X', x: 3.3, w: 1, finger: 'LR' },
    { id: 'KeyC', label: 'c', shift: 'C', x: 4.3, w: 1, finger: 'LM' },
    { id: 'KeyV', label: 'v', shift: 'V', x: 5.3, w: 1, finger: 'LI' },
    { id: 'KeyB', label: 'b', shift: 'B', x: 6.3, w: 1, finger: 'LI' },
    { id: 'KeyN', label: 'n', shift: 'N', x: 7.3, w: 1, finger: 'RI' },
    { id: 'KeyM', label: 'm', shift: 'M', x: 8.3, w: 1, finger: 'RI' },
    { id: 'Comma', label: ',', shift: '<', x: 9.3, w: 1, finger: 'RM' },
    { id: 'Period', label: '.', shift: '>', x: 10.3, w: 1, finger: 'RR' },
    { id: 'Slash', label: '/', shift: '?', x: 11.3, w: 1, finger: 'RP' },
    { id: 'ShiftRight', label: 'Shift', x: 12.3, w: 2.7, finger: 'RP', isSpecial: true }
  ],
  [
    { id: 'Space', label: '␣', x: 3.8, w: 5.4, finger: 'THUMB', isSpace: true }
  ]
];

// Build fast lookup dictionary for every possible character
export const CHAR_MAP: Record<string, CharLookupDef> = {};
KEYBOARD_ROWS.forEach((row, rowIndex) => {
  row.forEach((key: KeyDef) => {
    const centerPct = ((key.x + key.w / 2) / 15) * 100;
    const widthPct = (key.w / 15) * 100;
    if (key.isSpace) {
      CHAR_MAP[' '] = {
        ...key,
        rowIndex,
        centerPct,
        widthPct,
        display: '␣',
        needsShift: null
      };
    } else if (!key.isSpecial) {
      CHAR_MAP[key.label] = {
        ...key,
        rowIndex,
        centerPct,
        widthPct,
        display: key.label,
        needsShift: null
      };
      if (key.shift) {
        const isLeftHandKey = key.finger.startsWith('L');
        CHAR_MAP[key.shift] = {
          ...key,
          rowIndex,
          centerPct,
          widthPct,
          display: key.shift,
          needsShift: isLeftHandKey ? 'ShiftRight' : 'ShiftLeft',
          shiftFinger: isLeftHandKey ? 'RP' : 'LP'
        };
      }
    }
  });
});

// Finger metadata and exact beam alignment coordinates
export const FINGER_META: Record<FingerId, FingerInfo> = {
  LP: { name: 'Left Pinky', short: 'L-Pinky', beamCenterPct: 16.5, hand: 'left', colorVar: '--finger-pinky' },
  LR: { name: 'Left Ring', short: 'L-Ring', beamCenterPct: 22.8, hand: 'left', colorVar: '--finger-ring' },
  LM: { name: 'Left Middle', short: 'L-Mid', beamCenterPct: 29.2, hand: 'left', colorVar: '--finger-mid' },
  LI: { name: 'Left Index', short: 'L-Index', beamCenterPct: 36.2, hand: 'left', colorVar: '--finger-index' },
  THUMB: { name: 'Thumbs', short: 'Thumbs', beamCenterPct: 49.5, hand: 'both', colorVar: '--finger-thumb' },
  RI: { name: 'Right Index', short: 'R-Index', beamCenterPct: 57.5, hand: 'right', colorVar: '--finger-index' },
  RM: { name: 'Right Middle', short: 'R-Mid', beamCenterPct: 63.8, hand: 'right', colorVar: '--finger-mid' },
  RR: { name: 'Right Ring', short: 'R-Ring', beamCenterPct: 70.2, hand: 'right', colorVar: '--finger-ring' },
  RP: { name: 'Right Pinky', short: 'R-Pinky', beamCenterPct: 76.8, hand: 'right', colorVar: '--finger-pinky' }
};

// Single source of truth for all 25 levels
export const LEVELS = TOUCH_TYPING_LEVELS;

export interface StageMeta {
  stage: number;
  title: string;
  tagline: string;
  levelRange: [number, number];
  badgeName: string;
  color: string;
}

export const STAGES_META: StageMeta[] = [
  {
    stage: 1,
    title: 'Stage 1: Core Rhythm Foundations',
    tagline: 'Learning Focus • Home Row Anchors & Relaxed Rhythm',
    levelRange: [1, 5],
    badgeName: 'Anchor Initiate',
    color: '#0ea5e9'
  },
  {
    stage: 2,
    title: 'Stage 2: Top Row Expansion',
    tagline: 'Learning Focus • Upward Reach, Vowels & Vocabulary',
    levelRange: [6, 10],
    badgeName: 'Upper Navigator',
    color: '#10b981'
  },
  {
    stage: 3,
    title: 'Stage 3: Bottom Row Integration',
    tagline: 'Learning → Challenge • Downward Reach & Full Alphabet',
    levelRange: [11, 15],
    badgeName: 'Alphabet Harmonizer',
    color: '#8b5cf6'
  },
  {
    stage: 4,
    title: 'Stage 4: Capitals & Punctuation',
    tagline: 'Challenge Focus • Opposite Shift, Numbers & Alphanumeric Data',
    levelRange: [16, 20],
    badgeName: 'Precision Typist',
    color: '#f59e0b'
  },
  {
    stage: 5,
    title: 'Stage 5: Speed, Code & Mastery',
    tagline: 'Challenge Focus • Developer Brackets, Prose Flow & 38+ WPM',
    levelRange: [21, 25],
    badgeName: 'Grandmaster Champion',
    color: '#ec4899'
  }
];
