import { KeyDefinition, CharMeta, FingerCode, FingerMetaItem } from '../types/touchTyping';

// ============================================================================
// KEYBOARD GEOMETRY & FINGER MAPPING (15-Unit Normalized Width Coordinate System)
// Precisely maps each key's horizontal X position to the 3 track bars and 10 fingers
// ============================================================================
export const KEYBOARD_ROWS: KeyDefinition[][] = [
  // Row 0: Number / Symbol Row (14 keys, 15 units wide)
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

  // Row 1: Top / QWERTY Row (14 keys, 15 units wide)
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

  // Row 2: Home Row (13 keys, 15 units wide)
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

  // Row 3: Bottom Row (12 keys, 15 units wide)
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

  // Row 4: Space Row (15 units wide, centered spacebar)
  [
    { id: 'Space', label: '␣', x: 3.8, w: 5.4, finger: 'THUMB', isSpace: true }
  ]
];

// Finger metadata and exact beam alignment coordinates
export const FINGER_META: Record<FingerCode, FingerMetaItem> = {
  LP: { name: 'Left Pinky', short: 'L-Pinky', beamCenterPct: 16.5, hand: 'left', color: '#f43f5e' },
  LR: { name: 'Left Ring', short: 'L-Ring', beamCenterPct: 22.8, hand: 'left', color: '#fb923c' },
  LM: { name: 'Left Middle', short: 'L-Mid', beamCenterPct: 29.2, hand: 'left', color: '#facc15' },
  LI: { name: 'Left Index', short: 'L-Index', beamCenterPct: 36.2, hand: 'left', color: '#4ade80' },
  THUMB: { name: 'Thumbs', short: 'Thumbs', beamCenterPct: 49.5, hand: 'thumb', color: '#38bdf8' },
  RI: { name: 'Right Index', short: 'R-Index', beamCenterPct: 57.5, hand: 'right', color: '#60a5fa' },
  RM: { name: 'Right Middle', short: 'R-Mid', beamCenterPct: 63.8, hand: 'right', color: '#818cf8' },
  RR: { name: 'Right Ring', short: 'R-Ring', beamCenterPct: 70.2, hand: 'right', color: '#c084fc' },
  RP: { name: 'Right Pinky', short: 'R-Pinky', beamCenterPct: 76.8, hand: 'right', color: '#f472b6' }
};

/**
 * Fast lookup dictionary for every typed character to its exact physical key,
 * coordinate percentages, finger mapping, and shift requirement.
 */
function buildCharMap(): Record<string, CharMeta> {
  const map: Record<string, CharMeta> = {};

  KEYBOARD_ROWS.forEach((row, rowIndex) => {
    row.forEach((key) => {
      const centerPct = ((key.x + key.w / 2) / 15) * 100;
      const widthPct = (key.w / 15) * 100;

      if (key.isSpace) {
        map[' '] = {
          ...key,
          rowIndex,
          centerPct,
          widthPct,
          display: '␣',
          needsShift: null
        };
      } else if (!key.isSpecial) {
        // Unshifted base character
        map[key.label] = {
          ...key,
          rowIndex,
          centerPct,
          widthPct,
          display: key.label,
          needsShift: null
        };

        // Shifted character if available
        if (key.shift) {
          const isLeftHandKey = key.finger.startsWith('L');
          map[key.shift] = {
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

  return map;
}

export const CHAR_MAP: Record<string, CharMeta> = buildCharMap();

/**
 * Lookup character metadata safely
 */
export function getCharMeta(char: string): CharMeta | undefined {
  return CHAR_MAP[char];
}

/**
 * Get assigned finger for a given character
 */
export function getFingerForChar(char: string): FingerCode | undefined {
  return CHAR_MAP[char]?.finger;
}

/**
 * Determines whether the character requires pressing Shift
 */
export function isShiftRequired(char: string): boolean {
  return Boolean(CHAR_MAP[char]?.needsShift);
}
