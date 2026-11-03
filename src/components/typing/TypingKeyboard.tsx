import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { KEYBOARD_ROWS, FINGER_META } from './typingData';
import { KeyDef, FingerId, TypingTheme } from '../../types/typing';

export interface TypingKeyboardProps {
  activeKeyId?: string;
  shiftKeyId?: string | null; // 'ShiftLeft' | 'ShiftRight' | null
  pressedKeys?: Set<string>;
  isError?: boolean;
  blindMode?: boolean;
  onToggleBlindMode?: () => void;
  showFingerPips?: boolean;
  theme: TypingTheme;
  className?: string;
}

export const TypingKeyboard: React.FC<TypingKeyboardProps> = ({
  activeKeyId,
  shiftKeyId = null,
  pressedKeys = new Set(),
  isError = false,
  blindMode = false,
  onToggleBlindMode,
  showFingerPips = true,
  theme,
  className = ''
}) => {
  const isDark = theme === 'dark';

  // Helper to get finger indicator color
  const getFingerPipColor = (finger: FingerId): string => {
    switch (finger) {
      case 'LP':
      case 'RP':
        return '#8b5cf6'; // Violet
      case 'LR':
      case 'RR':
        return '#3b82f6'; // Blue
      case 'LM':
      case 'RM':
        return '#10b981'; // Emerald
      case 'LI':
      case 'RI':
        return '#f59e0b'; // Amber
      case 'THUMB':
      default:
        return '#06b6d4'; // Cyan
    }
  };

  return (
    <div className={`typing-keyboard-wrap ${blindMode ? 'blind-mode' : ''} ${className}`}>
      {/* Keyboard Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '8px',
          borderBottom: `1px solid ${isDark ? '#333842' : '#e4ddd0'}`,
          marginBottom: '6px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: isDark ? '#94a3b8' : '#756c5e'
            }}
          >
            15-Unit Normalized Spatial Guide
          </span>
          {shiftKeyId && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                background: isDark ? '#422006' : '#fef3c7',
                color: '#f59e0b',
                border: '1px solid #f59e0b'
              }}
            >
              Opposite Shift Required ({shiftKeyId === 'ShiftLeft' ? 'Left Shift' : 'Right Shift'})
            </span>
          )}
        </div>

        {/* Blind Mode Toggle Button */}
        {onToggleBlindMode && (
          <button
            type="button"
            onClick={onToggleBlindMode}
            title={blindMode ? 'Disable Blind Mode (Show Key Labels)' : 'Enable Blind Mode (Hide Key Labels for Muscle Memory)'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              border: `1px solid ${blindMode ? '#f59e0b' : (isDark ? '#414856' : '#d2c8b7')}`,
              background: blindMode ? (isDark ? '#382d1a' : '#fef3c7') : (isDark ? '#272a32' : '#ffffff'),
              color: blindMode ? '#f59e0b' : (isDark ? '#cbd5e1' : '#4d463b'),
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {blindMode ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{blindMode ? 'Blind Mode Active' : 'Blind Mode'}</span>
          </button>
        )}
      </div>

      {/* 5 Rows of Normalized Keys */}
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="typing-keyboard-row">
          {row.map((key: KeyDef) => {
            const isActive = activeKeyId === key.id;
            const isShiftActive = shiftKeyId === key.id;
            const isPressed = pressedKeys.has(key.id) || pressedKeys.has(key.label);
            const widthPct = (key.w / 15) * 100;
            const pipColor = getFingerPipColor(key.finger);

            return (
              <div
                key={key.id}
                className={`typing-keycap 
                  ${isActive ? 'is-target' : ''} 
                  ${isShiftActive ? 'is-shift-guide' : ''} 
                  ${isPressed ? 'is-pressed' : ''} 
                  ${key.isSpecial ? 'is-special' : ''}
                `}
                style={{
                  width: `${widthPct}%`,
                  flexShrink: 0
                }}
                data-key-id={key.id}
                title={`${key.label} (${FINGER_META[key.finger]?.name || key.finger})`}
              >
                {/* Finger pip indicator */}
                {showFingerPips && !key.isSpecial && (
                  <span
                    className="typing-finger-pip"
                    style={{ backgroundColor: pipColor }}
                  />
                )}

                {/* Primary & Shift Labels */}
                {key.shift && (
                  <span
                    className="key-label-shift"
                    style={{
                      fontSize: '10px',
                      opacity: 0.65,
                      marginBottom: '-2px',
                      lineHeight: 1
                    }}
                  >
                    {key.shift}
                  </span>
                )}
                <span
                  className="key-label-primary"
                  style={{
                    fontSize: key.isSpecial ? '12px' : '15px',
                    fontWeight: isActive || isShiftActive ? 800 : 600,
                    lineHeight: 1.2
                  }}
                >
                  {key.isSpace ? '␣' : key.label}
                </span>

                {/* Tactile bumps for F and J keys */}
                {key.bump && <div className="typing-keycap-bump" />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
