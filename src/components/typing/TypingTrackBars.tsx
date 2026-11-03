import React, { useMemo } from 'react';
import { TypingTheme } from '../../types/typing';

export interface TypingTrackBarsProps {
  completedText: string;
  activeChar: string;
  upcomingText: string;
  isError: boolean;
  beamCenterPct?: number; // 0 to 100% position of active key on the keyboard
  wpm: number;
  accuracy: number;
  streak: number;
  theme: TypingTheme;
  className?: string;
}

export const TypingTrackBars: React.FC<TypingTrackBarsProps> = ({
  completedText,
  activeChar,
  upcomingText,
  isError,
  beamCenterPct = 50,
  wpm,
  accuracy,
  streak,
  theme,
  className = ''
}) => {
  const isDark = theme === 'dark';

  // Format active character: show space as '␣'
  const displayActiveChar = activeChar === ' ' ? '␣' : (activeChar || '•');

  // Split completed text into recent window (e.g. last 32 chars)
  const recentCompleted = useMemo(() => {
    if (!completedText) return '';
    return completedText.length > 36 ? '...' + completedText.slice(-33) : completedText;
  }, [completedText]);

  // Window for upcoming text in active row (next 25 chars)
  const activeUpcomingSlice = useMemo(() => {
    return upcomingText.slice(0, 30);
  }, [upcomingText]);

  // Upcoming preview row (further ahead, next 45 chars)
  const nextLinePreview = useMemo(() => {
    if (upcomingText.length <= 30) return '— Final sequence of practice —';
    return upcomingText.slice(30, 80);
  }, [upcomingText]);

  return (
    <div className={`typing-track-container ${className}`}>
      {/* Top Metrics Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px',
          fontSize: '12px',
          color: isDark ? '#94a3b8' : '#756c5e',
          fontWeight: 600
        }}
      >
        <div style={{ display: 'flex', gap: '14px' }}>
          <span>
            Speed: <strong style={{ color: isDark ? '#38bdf8' : '#0284c7' }}>{wpm}</strong> WPM
          </span>
          <span>
            Accuracy: <strong style={{ color: accuracy >= 95 ? '#10b981' : '#f59e0b' }}>{accuracy}%</strong>
          </span>
          <span>
            Streak: <strong style={{ color: '#ec4899' }}>{streak}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isError ? '#ef4444' : '#10b981',
              boxShadow: isError ? '0 0 8px #ef4444' : '0 0 8px #10b981'
            }}
          />
          <span>{isError ? 'Strike Correct Key' : 'Flowing'}</span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 1. COMPLETED ROW (Top)                                            */}
      {/* ================================================================= */}
      <div className="typing-track-row completed-row" title="Typed text history">
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '12px', opacity: 0.7 }}>
          History:
        </span>
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', direction: 'rtl', textAlign: 'left', flex: 1 }}>
          <span style={{ color: '#10b981' }}>{recentCompleted}</span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. ACTIVE ROW WITH GLOWING BEAM (Middle Target Row)               */}
      {/* ================================================================= */}
      <div
        className={`typing-track-row active-row ${isError ? 'is-error' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Left trail: Last few chars leading up to current */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            overflow: 'hidden',
            paddingRight: '16px',
            color: isDark ? '#64748b' : '#a89d8d',
            fontSize: '22px',
            fontFamily: 'var(--font-mono, monospace)',
            whiteSpace: 'nowrap'
          }}
        >
          {completedText.slice(-14)}
        </div>

        {/* Center: Active Character Target Keycap */}
        <div
          className={`typing-char active-char ${isError ? 'has-error' : ''}`}
          style={{
            minWidth: '46px',
            flexShrink: 0
          }}
        >
          {displayActiveChar}
        </div>

        {/* Right stream: Upcoming characters */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-start',
            overflow: 'hidden',
            paddingLeft: '16px',
            color: isDark ? '#f8fafc' : '#1c1915',
            fontSize: '22px',
            fontFamily: 'var(--font-mono, monospace)',
            whiteSpace: 'nowrap'
          }}
        >
          {activeUpcomingSlice}
        </div>

        {/* Descending Light Beam from Active Target Keycap */}
        <div
          className="typing-vertical-beam"
          style={{
            left: `${beamCenterPct}%`,
            transition: 'left 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </div>

      {/* ================================================================= */}
      {/* 3. UPCOMING ROW (Bottom Preview Row)                              */}
      {/* ================================================================= */}
      <div className="typing-track-row upcoming-row" title="Upcoming sentence queue">
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '12px', opacity: 0.7 }}>
          Next:
        </span>
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1 }}>
          <span>{nextLinePreview}</span>
        </div>
      </div>
    </div>
  );
};
