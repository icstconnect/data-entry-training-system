import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Target, CheckCircle2, XCircle, RotateCcw, Unlock, Lock, 
  Activity, Keyboard, Sparkles, AlertTriangle, Eye, EyeOff, 
  BarChart3, Layers, ChevronDown, ChevronUp, SlidersHorizontal,
  Sun, Moon, Volume2, VolumeX, ArrowLeft, Zap, Award
} from 'lucide-react';

import { TypingTheme, FingerId } from '../../types/typing';
import { TouchTypingLevel, EvaluationResult } from '../../types/touchTyping';
import { StudentProgress } from '../../types';
import { TOUCH_TYPING_LEVELS, getTouchTypingLevelById } from '../../data/touchTypingLevels';
import { KEYBOARD_ROWS, CHAR_MAP, FINGER_META } from '../../data/touchTypingGeometry';
import { 
  playKeyClickSound, 
  playRhythmChimeSound, 
  playErrorBuzzSound, 
  playCompletionFanfareSound, 
  playLevelFailSound, 
  toggleTouchTypingMute, 
  isTouchTypingMuted 
} from '../../utils/touchTypingSound';
import { 
  loadTouchTypingProgress, 
  saveTouchTypingRecord, 
  evaluateTouchTypingRun, 
  isTouchTypingLevelUnlocked,
  TOTAL_TOUCH_TYPING_LEVELS
} from '../../services/touchTypingStorageService';
import { 
  isMasterUnlocked, 
  verifyAndApplyMasterPassword, 
  setMasterUnlocked 
} from '../../services/masterUnlockService';

import { IllustratedHandsSVG } from './IllustratedHandsSVG';
import { SummaryBadgeSlot } from './SummaryBadgeSlot';
import { TypingCurriculumModal } from './TypingCurriculumModal';
import { TypingTrackBars } from './TypingTrackBars';
import './touchTyping.css';

export interface TouchTypingWorkbenchProps {
  levelNumber: number;
  onBackToDashboard: () => void;
  onSelectLevel?: (level: number) => void;
  studentProgress?: StudentProgress;
  onExpAwarded?: (exp: number, source?: 'practice' | 'excel' | 'windows' | 'terminal' | 'typing') => void;
  theme?: TypingTheme;
  onToggleTheme?: () => void;
}

export const TouchTypingWorkbench: React.FC<TouchTypingWorkbenchProps> = ({
  levelNumber,
  onBackToDashboard,
  onSelectLevel,
  studentProgress,
  onExpAwarded,
  theme: controlledTheme,
  onToggleTheme: controlledToggleTheme
}) => {
  // Theme state: dual light/dark mode support with localStorage persistence (default: light)
  const [localTheme, setLocalTheme] = useState<TypingTheme>(() => {
    try {
      const saved = localStorage.getItem('icst_typing_theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const activeTheme = controlledTheme || localTheme;

  const handleToggleTheme = () => {
    if (controlledToggleTheme) {
      controlledToggleTheme();
    } else {
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      setLocalTheme(nextTheme);
      try {
        localStorage.setItem('icst_typing_theme', nextTheme);
      } catch {}
    }
  };

  const isDark = activeTheme === 'dark';

  // Sound mute state
  const [isMuted, setIsMuted] = useState<boolean>(() => isTouchTypingMuted());
  const handleToggleMute = () => {
    const updated = toggleTouchTypingMute();
    setIsMuted(updated);
  };

  // Master unlock state
  const [masterActive, setMasterActive] = useState<boolean>(() => isMasterUnlocked());
  const [unlockPromptOpen, setUnlockPromptOpen] = useState(false);
  const [masterInput, setMasterInput] = useState('');
  const [masterError, setMasterError] = useState<string | null>(null);

  useEffect(() => {
    const handleMasterChanged = (e: CustomEvent<{ unlocked: boolean }>) => {
      setMasterActive(e.detail?.unlocked ?? isMasterUnlocked());
    };
    window.addEventListener('icst_master_unlock_changed' as any, handleMasterChanged);
    return () => window.removeEventListener('icst_master_unlock_changed' as any, handleMasterChanged);
  }, []);

  // Level & Progression State
  const [currentLevelId, setCurrentLevelId] = useState<number>(() => {
    return Math.max(1, Math.min(TOTAL_TOUCH_TYPING_LEVELS, levelNumber || 1));
  });

  useEffect(() => {
    if (levelNumber && levelNumber !== currentLevelId) {
      setCurrentLevelId(Math.max(1, Math.min(TOTAL_TOUCH_TYPING_LEVELS, levelNumber)));
    }
  }, [levelNumber]);

  const [touchProgress, setTouchProgress] = useState(() => loadTouchTypingProgress());
  const [isCurriculumOpen, setIsCurriculumOpen] = useState<boolean>(false);

  // Sync progress on changes
  useEffect(() => {
    const handleProgressChanged = () => {
      setTouchProgress(loadTouchTypingProgress());
    };
    window.addEventListener('icst_touch_typing_progress_changed', handleProgressChanged);
    return () => window.removeEventListener('icst_touch_typing_progress_changed', handleProgressChanged);
  }, []);

  // Active level data
  const currentLevel: TouchTypingLevel = useMemo(() => {
    return getTouchTypingLevelById(currentLevelId) || TOUCH_TYPING_LEVELS[0];
  }, [currentLevelId]);

  const targetText = currentLevel.text;

  // View state: 'typing' (in-session) | 'report' (post-level summary card)
  const [viewMode, setViewMode] = useState<'typing' | 'report'>('typing');

  // Minimalist utility toggles
  const [showHands, setShowHands] = useState<boolean>(true);
  const [showKeyLabels, setShowKeyLabels] = useState<boolean>(true); // Blind mode when false
  const [showLiveHud, setShowLiveHud] = useState<boolean>(false);
  const [showDetailedReport, setShowDetailedReport] = useState<boolean>(false);
  const [useContinuousStream, setUseContinuousStream] = useState<boolean>(false); // toggle between 3-track triplet and continuous stream

  // Active Typing Session Telemetry
  const [cursor, setCursor] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [capsLockOn, setCapsLockOn] = useState<boolean>(false);

  // Key feedback states
  const [lastTypedStatus, setLastTypedStatus] = useState<'correct' | 'error' | null>(null);
  const [errorKeyId, setErrorKeyId] = useState<string | null>(null);
  const [errorFinger, setErrorFinger] = useState<FingerId | null>(null);
  const [pressedKeyIds, setPressedKeyIds] = useState<Set<string>>(new Set());
  const [pressedFinger, setPressedFinger] = useState<FingerId | null>(null);

  // Cadence & Error mapping
  const lastKeyTimeRef = useRef<number | null>(null);
  const [keystrokeHistory, setKeystrokeHistory] = useState<Array<{
    char: string;
    latency: number;
    correct: boolean;
    finger: FingerId;
  }>>([]);
  const [fingerStats, setFingerStats] = useState<Record<string, { hits: number; total: number }>>({});
  const [keyErrorMap, setKeyErrorMap] = useState<Record<string, number>>({});

  // Active character and key metadata
  const activeChar = targetText[cursor] || '';
  const activeKeyMeta = CHAR_MAP[activeChar] || CHAR_MAP[' '];

  // Reset Session
  const resetLevelSession = useCallback(() => {
    setCursor(0);
    setStartTime(null);
    setElapsedSec(0);
    setErrorCount(0);
    setTotalKeystrokes(0);
    setCurrentStreak(0);
    setBestStreak(0);
    setLastTypedStatus(null);
    setErrorKeyId(null);
    setErrorFinger(null);
    setKeystrokeHistory([]);
    setFingerStats({});
    setKeyErrorMap({});
    lastKeyTimeRef.current = null;
    setViewMode('typing');
    setShowDetailedReport(false);
  }, []);

  // Switch level
  const handleSelectLevel = useCallback((lvlId: number) => {
    const validId = Math.max(1, Math.min(TOTAL_TOUCH_TYPING_LEVELS, lvlId));
    setCurrentLevelId(validId);
    if (onSelectLevel) onSelectLevel(validId);
    setIsCurriculumOpen(false);
    resetLevelSession();
  }, [onSelectLevel, resetLevelSession]);

  // Live Timer for accurate speed calculations
  useEffect(() => {
    if (!startTime || viewMode !== 'typing') return;
    const interval = setInterval(() => {
      setElapsedSec((performance.now() - startTime) / 1000);
    }, 100);
    return () => clearInterval(interval);
  }, [startTime, viewMode]);

  // Live WPM & Accuracy
  const liveStats = useMemo(() => {
    const minutes = Math.max(elapsedSec / 60, 0.01);
    const wordsTyped = cursor / 5;
    const wpm = startTime && cursor > 0 ? Math.round(wordsTyped / minutes) : 0;
    const rawWpm = startTime && totalKeystrokes > 0 ? Math.round((totalKeystrokes / 5) / minutes) : 0;
    const accuracy = totalKeystrokes > 0
      ? Math.max(0, Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100))
      : 100;

    return { wpm, rawWpm, accuracy };
  }, [elapsedSec, cursor, startTime, totalKeystrokes, errorCount]);

  // Comprehensive Evaluation & Golden Badges Calculation
  const evaluation = useMemo(() => {
    if (viewMode !== 'report') return null;

    const { minWpm, minAcc, maxErrors, minStreak } = currentLevel.criteria;
    const wpmPassed = liveStats.wpm >= minWpm;
    const accPassed = liveStats.accuracy >= minAcc;
    const errPassed = maxErrors === null || errorCount <= maxErrors;
    const streakPassed = minStreak === null || bestStreak >= minStreak;

    const passedAll = wpmPassed && accPassed && errPassed && streakPassed;

    // 3 Golden Badges:
    // Badge 1: All criteria passed
    const badge1 = passedAll;
    // Badge 2: High accuracy benchmark
    const badge2 = passedAll && liveStats.accuracy >= Math.min(98, minAcc + 4);
    // Badge 3: High speed velocity benchmark
    const badge3 = passedAll && liveStats.wpm >= minWpm + 8;
    const starsCount = (badge1 ? 1 : 0) + (badge2 ? 1 : 0) + (badge3 ? 1 : 0);

    const validLatencies = keystrokeHistory.filter(k => k.latency > 0 && k.latency < 2500);
    const avgLatency = validLatencies.length > 0
      ? Math.round(validLatencies.reduce((acc, item) => acc + item.latency, 0) / validLatencies.length)
      : 0;

    return {
      passedAll,
      wpmPassed,
      accPassed,
      errPassed,
      streakPassed,
      badge1,
      badge2,
      badge3,
      starsCount,
      avgLatency
    };
  }, [viewMode, currentLevel, liveStats, errorCount, bestStreak, keystrokeHistory]);

  // Persist record, dispatch EXP, and play sound when report opens
  const recordedRef = useRef<boolean>(false);
  useEffect(() => {
    if (viewMode === 'report' && evaluation && !recordedRef.current) {
      recordedRef.current = true;

      // Play pass fanfare or fail chime
      if (evaluation.passedAll) {
        playCompletionFanfareSound(evaluation.starsCount);
      } else {
        playLevelFailSound();
      }

      // Format per-finger stats
      const formattedFingerStats: any = {};
      Object.entries(fingerStats).forEach(([fKey, st]) => {
        formattedFingerStats[fKey] = {
          finger: fKey,
          totalHits: st.total,
          correctHits: st.hits,
          accuracy: st.total > 0 ? Math.round((st.hits / st.total) * 100) : 0
        };
      });

      // Storage & EXP
      const result: EvaluationResult = evaluateTouchTypingRun(
        currentLevel,
        liveStats.wpm,
        liveStats.rawWpm,
        liveStats.accuracy,
        elapsedSec,
        totalKeystrokes,
        errorCount,
        bestStreak,
        formattedFingerStats
      );

      const updatedProgress = saveTouchTypingRecord(result);
      setTouchProgress(updatedProgress);

      // Dispatch EXP to parent
      if (result.expEarned > 0 && onExpAwarded) {
        onExpAwarded(result.expEarned, 'typing');
      }
    } else if (viewMode === 'typing') {
      recordedRef.current = false;
    }
  }, [viewMode, evaluation, currentLevel, liveStats, elapsedSec, totalKeystrokes, errorCount, bestStreak, fingerStats, onExpAwarded]);

  // Advance to next level or retry
  const handleNextOrRetry = useCallback(() => {
    if (!evaluation) return;
    if (evaluation.passedAll && currentLevelId < TOTAL_TOUCH_TYPING_LEVELS) {
      handleSelectLevel(currentLevelId + 1);
    } else {
      resetLevelSession();
    }
  }, [evaluation, currentLevelId, handleSelectLevel, resetLevelSession]);

  // Real-time Keydown and Keyup Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (typeof e.getModifierState === 'function') {
        setCapsLockOn(e.getModifierState('CapsLock'));
      }

      if (isCurriculumOpen || unlockPromptOpen) {
        if (e.key === 'Escape') {
          setIsCurriculumOpen(false);
          setUnlockPromptOpen(false);
        }
        return;
      }

      if (viewMode === 'report') {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleNextOrRetry();
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          resetLevelSession();
        }
        return;
      }

      setPressedKeyIds(prev => new Set(prev).add(e.code));

      // Ignore modifiers
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) {
        return;
      }

      // Prevent default page scroll and browser hotkeys for space, slash, quotes
      if (e.key === ' ' || e.key === '/' || e.key === "'" || e.key === '"') {
        e.preventDefault();
      }

      if (e.key.length !== 1) return;

      const now = performance.now();
      if (!startTime) {
        setStartTime(now);
      }

      const latency = lastKeyTimeRef.current ? Math.round(now - lastKeyTimeRef.current) : 0;
      lastKeyTimeRef.current = now;

      const expectedChar = targetText[cursor];
      if (!expectedChar) return;

      const expectedMeta = CHAR_MAP[expectedChar] || CHAR_MAP[' '];
      const fingerCode = (expectedMeta.finger as FingerId) || 'THUMB';
      const isSpaceKey = expectedChar === ' ';

      setTotalKeystrokes(prev => prev + 1);
      setPressedFinger(fingerCode);
      setTimeout(() => setPressedFinger(null), 120);

      if (e.key === expectedChar) {
        // Correct Keystroke
        playKeyClickSound(true, isSpaceKey);

        const nextCursor = cursor + 1;
        const newStreak = currentStreak + 1;

        // Chime every 10 streaks
        if (newStreak > 0 && newStreak % 10 === 0) {
          playRhythmChimeSound(newStreak);
        }

        setCursor(nextCursor);
        setCurrentStreak(newStreak);
        setBestStreak(prev => Math.max(prev, newStreak));
        setLastTypedStatus('correct');
        setErrorKeyId(null);
        setErrorFinger(null);

        setFingerStats(prev => {
          const cur = prev[fingerCode] || { hits: 0, total: 0 };
          return { ...prev, [fingerCode]: { hits: cur.hits + 1, total: cur.total + 1 } };
        });

        setKeystrokeHistory(prev => [
          ...prev,
          { char: expectedChar, latency, correct: true, finger: fingerCode }
        ]);

        if (nextCursor >= targetText.length) {
          setElapsedSec((now - (startTime || now)) / 1000);
          setTimeout(() => {
            setViewMode('report');
          }, 200);
        }
      } else {
        // Error Keystroke
        playErrorBuzzSound();

        setErrorCount(prev => prev + 1);
        setCurrentStreak(0);
        setLastTypedStatus('error');
        setErrorKeyId(e.code);
        setErrorFinger(fingerCode);

        setTimeout(() => {
          setErrorKeyId(null);
          setErrorFinger(null);
        }, 300);

        setFingerStats(prev => {
          const cur = prev[fingerCode] || { hits: 0, total: 0 };
          return { ...prev, [fingerCode]: { hits: cur.hits, total: cur.total + 1 } };
        });

        const labelKey = expectedChar === ' ' ? 'Space' : expectedChar;
        setKeyErrorMap(prev => ({
          ...prev,
          [labelKey]: (prev[labelKey] || 0) + 1
        }));

        setKeystrokeHistory(prev => [
          ...prev,
          { char: expectedChar, latency, correct: false, finger: fingerCode }
        ]);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeyIds(prev => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    cursor,
    targetText,
    startTime,
    currentStreak,
    viewMode,
    isCurriculumOpen,
    unlockPromptOpen,
    handleNextOrRetry,
    resetLevelSession
  ]);

  // Progress percentage
  const progressPct = Math.min(100, Math.round((cursor / targetText.length) * 100));

  // 3-Row Horizontal Track Bar Grouping (Triplets)
  const tripletState = useMemo(() => {
    const groupStart = Math.floor(cursor / 3) * 3;
    const activeRowIndex = cursor % 3; // 0 = Top, 1 = Mid, 2 = Bottom
    const rows = [0, 1, 2].map(rIdx => {
      const charIndex = groupStart + rIdx;
      const exists = charIndex < targetText.length;
      const ch = exists ? targetText[charIndex] : null;
      const meta = ch !== null ? (CHAR_MAP[ch] || CHAR_MAP[' ']) : null;
      const status = !exists
        ? 'empty'
        : rIdx < activeRowIndex
        ? 'completed'
        : rIdx === activeRowIndex
        ? 'active'
        : 'upcoming';

      return {
        rIdx,
        charIndex,
        exists,
        char: ch,
        meta,
        status
      };
    });

    return { groupStart, activeRowIndex, rows };
  }, [cursor, targetText]);

  // Vertical glowing cyan-blue light beam geometry
  const beamGeometry = useMemo(() => {
    if (!activeKeyMeta) return null;
    const activeRow = tripletState.activeRowIndex;
    const topPx = activeRow * 52 + 44;
    const heightPx = (2 - activeRow) * 52 + 38 + ((activeKeyMeta.rowIndex ?? 2) + 1) * 44;

    return {
      topPx,
      heightPx,
      centerPct: activeKeyMeta.centerPct,
      widthPx: activeKeyMeta.isSpace ? 268 : 46
    };
  }, [activeKeyMeta, tripletState.activeRowIndex]);

  // Master unlock submission
  const handleApplyMasterUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const res = verifyAndApplyMasterPassword(masterInput);
    if (res.success) {
      setMasterActive(true);
      setUnlockPromptOpen(false);
      setMasterInput('');
      setMasterError(null);
    } else {
      setMasterError(res.error || 'Invalid password');
    }
  };

  return (
    <div className={`typing-root theme-${activeTheme} min-h-screen w-full flex flex-col font-sans select-none overflow-x-hidden`}>
      {/* ==================================================================== */}
      {/* 1. TOP MINIMALIST HEADER BAR & BLUE PROGRESS LINE                    */}
      {/* ==================================================================== */}
      <header
        style={{
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${isDark ? '#2b2f36' : '#e5decfe0'}`,
          background: isDark ? '#191b1f' : '#ffffff',
          zIndex: 40
        }}
      >
        {/* Left: Navigation and Level Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={onBackToDashboard}
            title="Return to Touch Typing Dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? '#3d4452' : '#d5cbba'}`,
              background: isDark ? '#212429' : '#f5eee3',
              color: isDark ? '#e2e8f0' : '#1c1915',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={14} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCurriculumOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              color: isDark ? '#cbd5e1' : '#334155',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.2px'
            }}
          >
            <span style={{ color: isDark ? '#64748b' : '#94a3b8' }}>—</span>
            <span>Level {currentLevel.id} of {TOTAL_TOUCH_TYPING_LEVELS}</span>
            <span style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
              ({currentLevel.title})
            </span>
            <ChevronDown size={14} style={{ opacity: 0.7 }} />
          </button>

          {capsLockOn && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#f59e0b',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              <AlertTriangle size={12} />
              <span>CAPS LOCK</span>
            </div>
          )}
        </div>

        {/* Center/Right: Live HUD, Goal criteria, Sound & Theme Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {showLiveHud && viewMode === 'typing' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '4px 12px',
                borderRadius: '20px',
                background: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.06)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                fontSize: '11px',
                fontFamily: 'monospace',
                color: isDark ? '#e2e8f0' : '#1c1915'
              }}
            >
              <span>{liveStats.wpm} WPM</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>{liveStats.accuracy}% ACC</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ color: '#38bdf8' }}>Streak {currentStreak}</span>
            </div>
          )}

          <div
            title="Target Passing Requirement"
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: isDark ? 'rgba(255,255,255,0.04)' : '#efe7d8',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#dfd4c0'}`,
              fontSize: '11px',
              color: isDark ? '#94a3b8' : '#574f42',
              fontWeight: 500
            }}
          >
            Goal: {currentLevel.criteriaDesc}
          </div>

          {/* Master Unlock indicator button */}
          <button
            type="button"
            onClick={() => {
              if (masterActive) {
                setMasterUnlocked(false);
                setMasterActive(false);
              } else {
                setUnlockPromptOpen(true);
              }
            }}
            title={masterActive ? 'Master Unlock Active (ICST) - Click to lock' : 'Enter Master Password to unlock all levels'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: `1px solid ${masterActive ? '#10b981' : (isDark ? '#3d4452' : '#d5cbba')}`,
              background: masterActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: masterActive ? '#10b981' : (isDark ? '#94a3b8' : '#64748b'),
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {masterActive ? <Unlock size={13} /> : <Lock size={13} />}
            <span>{masterActive ? 'ICST Unlocked' : 'Unlock All'}</span>
          </button>

          {/* Audio mute toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Typing Sounds' : 'Mute Typing Sounds'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? '#3d4452' : '#d5cbba'}`,
              background: isDark ? '#212429' : '#f5eee3',
              color: isMuted ? (isDark ? '#64748b' : '#a89d8d') : (isDark ? '#38bdf8' : '#0284c7'),
              cursor: 'pointer'
            }}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Dual Theme Toggle */}
          <button
            type="button"
            onClick={handleToggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? '#3d4452' : '#d5cbba'}`,
              background: isDark ? '#212429' : '#f5eee3',
              color: isDark ? '#f59e0b' : '#0369a1',
              cursor: 'pointer'
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      {/* Razor-thin glowing progress bar */}
      <div style={{ width: '100%', height: '2px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${Math.max(3, progressPct)}%`,
            background: '#3b82f6',
            boxShadow: '0 0 10px #38bdf8',
            transition: 'width 0.18s ease'
          }}
        />
      </div>

      {/* ==================================================================== */}
      {/* 2. MAIN CENTERED CANVAS                                              */}
      {/* ==================================================================== */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          maxWidth: '960px',
          margin: '0 auto',
          width: '100%',
          position: 'relative'
        }}
      >
        {viewMode === 'typing' ? (
          <div style={{ width: '100%', maxWidth: '780px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Mode switch (Triplet Spatial vs Continuous Stream) */}
            {useContinuousStream ? (
              <div style={{ width: '100%', marginBottom: '10px' }}>
                <TypingTrackBars
                  completedText={targetText.slice(0, cursor)}
                  activeChar={activeChar}
                  upcomingText={targetText.slice(cursor + 1)}
                  isError={lastTypedStatus === 'error'}
                  beamCenterPct={activeKeyMeta?.centerPct || 50}
                  wpm={liveStats.wpm}
                  accuracy={liveStats.accuracy}
                  streak={currentStreak}
                  theme={activeTheme}
                />
              </div>
            ) : (
              /* ================================================================ */
              /* 3-ROW HORIZONTAL TRACK BARS (MATCHING SCREENSHOTS)               */
              /* ================================================================ */
              <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 20 }}>
                {tripletState.rows.map(row => {
                  if (!row.exists || !row.meta) {
                    return (
                      <div
                        key={row.rIdx}
                        style={{
                          width: '100%',
                          height: '46px',
                          borderRadius: '6px',
                          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
                        }}
                      />
                    );
                  }

                  const isCompleted = row.status === 'completed';
                  const isActive = row.status === 'active';
                  const isRowError = isActive && lastTypedStatus === 'error';

                  // Dynamic bar background
                  let barBg = isDark ? 'rgba(42, 46, 53, 0.75)' : '#efe7d8';
                  if (isCompleted) {
                    barBg = isDark ? 'rgba(43, 76, 63, 0.7)' : '#d4ebd6';
                  } else if (isRowError) {
                    barBg = isDark ? 'rgba(127, 29, 29, 0.5)' : '#fecaca';
                  } else if (isActive) {
                    barBg = isDark ? 'rgba(37, 57, 92, 0.8)' : '#e0f2fe';
                  }

                  // Keycap box style
                  let boxBorder = isDark ? '1px solid rgba(255,255,255,0.22)' : '1px solid #c8beac';
                  let boxBg = isDark ? '#262a30' : '#ffffff';
                  let boxColor = isDark ? '#e2e8f0' : '#1c1915';
                  let boxGlow = 'none';

                  if (isCompleted) {
                    boxBg = isDark ? 'rgba(76, 169, 80, 0.85)' : '#22c55e';
                    boxBorder = '2px solid #76e07a';
                    boxColor = '#ffffff';
                    boxGlow = '0 0 12px rgba(74, 222, 128, 0.4)';
                  } else if (isRowError) {
                    boxBg = 'rgba(239, 68, 68, 0.5)';
                    boxBorder = '2px solid #ef4444';
                    boxColor = '#ffffff';
                    boxGlow = '0 0 14px rgba(239, 68, 68, 0.6)';
                  } else if (isActive) {
                    boxBg = isDark ? '#25354d' : '#ffffff';
                    boxBorder = isDark ? '2px solid #7dd3fc' : '2px solid #0284c7';
                    boxColor = isDark ? '#ffffff' : '#0284c7';
                    boxGlow = isDark ? '0 0 14px rgba(56, 189, 248, 0.5)' : '0 0 12px rgba(2, 132, 199, 0.35)';
                  }

                  const isSpace = row.meta.isSpace;

                  return (
                    <div
                      key={row.rIdx}
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '46px',
                        borderRadius: '6px',
                        background: barBg,
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: `${row.meta.centerPct}%`,
                          top: '3px',
                          transform: 'translateX(-50%)',
                          width: isSpace ? '268px' : '42px',
                          height: '40px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'inherit',
                          fontSize: '18px',
                          fontWeight: 600,
                          background: boxBg,
                          border: boxBorder,
                          color: boxColor,
                          boxShadow: boxGlow,
                          transition: 'all 0.14s ease'
                        }}
                      >
                        {isSpace ? (
                          /* Spacebar bracket indicator */
                          <span
                            style={{
                              display: 'inline-block',
                              width: '18px',
                              height: '8px',
                              borderBottom: '2px solid currentColor',
                              borderLeft: '2px solid currentColor',
                              borderRight: '2px solid currentColor',
                              transform: 'translateY(2px)',
                              opacity: 0.9
                            }}
                          />
                        ) : (
                          row.meta.display
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Vertical Glowing Cyan-Blue Beam */}
                {beamGeometry && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${beamGeometry.centerPct}%`,
                      top: `${beamGeometry.topPx}px`,
                      width: `${beamGeometry.widthPx}px`,
                      height: `${beamGeometry.heightPx}px`,
                      transform: 'translateX(-50%)',
                      zIndex: 15,
                      pointerEvents: 'none',
                      transition: 'all 0.14s ease',
                      filter: 'blur(0.5px)',
                      background: lastTypedStatus === 'error'
                        ? 'linear-gradient(180deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.4) 70%, rgba(239,68,68,0.6) 100%)'
                        : isDark
                        ? 'linear-gradient(180deg, rgba(56,189,248,0.18) 0%, rgba(56,189,248,0.36) 65%, rgba(0,216,255,0.6) 100%)'
                        : 'linear-gradient(180deg, rgba(2,132,199,0.12) 0%, rgba(2,132,199,0.25) 65%, rgba(2,132,199,0.45) 100%)'
                    }}
                  />
                )}
              </div>
            )}

            {/* ================================================================ */}
            {/* 4 MINIMALIST UTILITY ICONS (RIGHT-ALIGNED)                       */}
            {/* ================================================================ */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                padding: '10px 4px 6px 4px',
                zIndex: 30
              }}
            >
              <button
                type="button"
                onClick={() => setUseContinuousStream(prev => !prev)}
                title={useContinuousStream ? 'Switch to Triplet Spatial Alignment' : 'Switch to Continuous Stream Mode'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '4px',
                  borderRadius: '4px',
                  color: useContinuousStream ? '#38bdf8' : (isDark ? '#94a3b8' : '#78716c'),
                  cursor: 'pointer'
                }}
              >
                <Layers size={15} />
              </button>

              <button
                type="button"
                onClick={() => setShowKeyLabels(prev => !prev)}
                title={showKeyLabels ? 'Hide Key Labels (Blind Typing Mode)' : 'Show Key Labels'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '4px',
                  borderRadius: '4px',
                  color: showKeyLabels ? (isDark ? '#94a3b8' : '#78716c') : '#38bdf8',
                  cursor: 'pointer'
                }}
              >
                <Keyboard size={15} />
              </button>

              <button
                type="button"
                onClick={() => setShowHands(prev => !prev)}
                title={showHands ? 'Hide Hand Overlay' : 'Show Hand Overlay'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '4px',
                  borderRadius: '4px',
                  color: showHands ? (isDark ? '#94a3b8' : '#78716c') : '#38bdf8',
                  cursor: 'pointer'
                }}
              >
                {showHands ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>

              <button
                type="button"
                onClick={() => setShowLiveHud(prev => !prev)}
                title="Toggle Live Telemetry HUD"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '4px',
                  borderRadius: '4px',
                  color: showLiveHud ? '#38bdf8' : (isDark ? '#94a3b8' : '#78716c'),
                  cursor: 'pointer'
                }}
              >
                <SlidersHorizontal size={15} />
              </button>

              <button
                type="button"
                onClick={resetLevelSession}
                title="Restart Level (R)"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '4px',
                  borderRadius: '4px',
                  color: isDark ? '#94a3b8' : '#78716c',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={15} />
              </button>
            </div>

            {/* ================================================================ */}
            {/* KEYBOARD WIREFRAME + ILLUSTRATED HANDS OVERLAY                   */}
            {/* ================================================================ */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '4px', paddingBottom: '36px' }}>
              {/* Keyboard keys */}
              <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                {KEYBOARD_ROWS.map((row, rIdx) => (
                  <div key={rIdx} style={{ position: 'relative', width: '100%', height: '38px' }}>
                    {row.map(keyObj => {
                      const leftPct = (keyObj.x / 15) * 100;
                      const widthPct = (keyObj.w / 15) * 100;

                      const isTargetKey = activeKeyMeta?.id === keyObj.id;
                      const isTargetShift = activeKeyMeta?.needsShift === keyObj.id;
                      const isPhysicalPressed = pressedKeyIds.has(keyObj.id);
                      const isErrorKey = errorKeyId === keyObj.id;

                      let keyBorder = isDark ? '1.5px solid rgba(255,255,255,0.08)' : '1.5px solid rgba(0,0,0,0.1)';
                      let keyBg = 'transparent';
                      let keyText = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)';
                      let keyGlow = 'none';

                      if (isErrorKey) {
                        keyBorder = '1.5px solid rgba(239, 68, 68, 0.8)';
                        keyBg = 'rgba(239, 68, 68, 0.2)';
                        keyText = '#fca5a5';
                      } else if (isTargetKey || isTargetShift) {
                        keyBorder = isDark ? '1.5px solid rgba(56, 189, 248, 0.7)' : '1.5px solid #0284c7';
                        keyBg = isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.1)';
                        keyText = isDark ? '#7dd3fc' : '#0284c7';
                        keyGlow = isDark ? '0 0 12px rgba(56, 189, 248, 0.25)' : '0 0 8px rgba(2, 132, 199, 0.2)';
                      } else if (isPhysicalPressed) {
                        keyBorder = isDark ? '1.5px solid rgba(255,255,255,0.35)' : '1.5px solid rgba(0,0,0,0.3)';
                        keyBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
                        keyText = isDark ? '#ffffff' : '#1c1915';
                      }

                      return (
                        <div
                          key={keyObj.id}
                          style={{
                            position: 'absolute',
                            left: `${leftPct}%`,
                            width: `calc(${widthPct}% - 5px)`,
                            top: 0,
                            height: '100%',
                            margin: '0 2.5px',
                            borderRadius: '5px',
                            border: keyBorder,
                            background: keyBg,
                            color: keyText,
                            boxShadow: keyGlow,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.1s ease',
                            userSelect: 'none'
                          }}
                        >
                          {showKeyLabels && !keyObj.isSpace && (
                            <span
                              style={{
                                fontSize: keyObj.isSpecial ? '9px' : '11px',
                                fontWeight: (isTargetKey || isTargetShift) ? 700 : 500
                              }}
                            >
                              {isTargetKey && activeKeyMeta?.needsShift && keyObj.shift
                                ? keyObj.shift
                                : keyObj.label}
                            </span>
                          )}

                          {/* Home Row Tactile Bumps on F and J */}
                          {keyObj.bump && (
                            <span
                              style={{
                                width: '10px',
                                height: '1.5px',
                                borderRadius: '999px',
                                background: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
                                marginTop: '2px'
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Realistic Illustrated Hands Overlay */}
              {showHands && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    top: '20px',
                    bottom: '-12px',
                    pointerEvents: 'none',
                    zIndex: 25,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center'
                  }}
                >
                  <IllustratedHandsSVG
                    activeFinger={activeKeyMeta?.finger as FingerId}
                    shiftFinger={activeKeyMeta?.shiftFinger as FingerId}
                    isPressed={Boolean(pressedFinger)}
                    isError={lastTypedStatus === 'error'}
                    theme={activeTheme}
                    className="w-full max-w-[840px]"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ==================================================================== */
          /* 3. POST-LEVEL SUMMARY CARD (MATCHING SCREENSHOT 1)                  */
          /* ==================================================================== */
          evaluation && (
            <div style={{ width: '100%', maxWidth: '720px', margin: 'auto 0' }}>
              {/* Headline */}
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: isDark ? '#ffffff' : '#1c1915',
                  marginBottom: '16px',
                  textAlign: 'left'
                }}
              >
                {evaluation.passedAll
                  ? evaluation.starsCount === 3
                    ? 'Great job! All awards earned!'
                    : 'Good work! Level passed!'
                  : 'Keep practicing! Level criteria not met yet.'}
              </h1>

              {/* Main Dark Card */}
              <div
                style={{
                  background: isDark ? '#2b2f36' : '#ffffff',
                  borderRadius: '16px',
                  padding: '32px 36px',
                  boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.45)' : '0 8px 24px rgba(0,0,0,0.08)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e6dfd1'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '32px',
                  flexWrap: 'wrap'
                }}
              >
                {/* Left Stats Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', color: isDark ? '#94a3b8' : '#756c5e', marginBottom: '2px' }}>
                      speed
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: isDark ? '#ffffff' : '#1c1915' }}>
                      {liveStats.wpm} WPM
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', color: isDark ? '#94a3b8' : '#756c5e', marginBottom: '2px' }}>
                      accuracy
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: isDark ? '#ffffff' : '#1c1915' }}>
                      {liveStats.accuracy}%
                    </div>
                  </div>
                </div>

                {/* Right Badge Slots: 3 Golden Sunburst Pixels or Recessed Rings */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                  <SummaryBadgeSlot
                    earned={evaluation.badge1}
                    size="lg"
                    theme={activeTheme}
                    label="Passing"
                    subLabel="Met Criteria"
                  />
                  <SummaryBadgeSlot
                    earned={evaluation.badge2}
                    size="lg"
                    theme={activeTheme}
                    label="Accuracy"
                    subLabel="High Precision"
                  />
                  <SummaryBadgeSlot
                    earned={evaluation.badge3}
                    size="lg"
                    theme={activeTheme}
                    label="Velocity"
                    subLabel="High Speed"
                  />
                </div>
              </div>

              {/* Action Bar below card: Press [Enter] / Retry (R) */}
              <div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowDetailedReport(prev => !prev)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '12px',
                    color: isDark ? '#94a3b8' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  <BarChart3 size={14} color="#38bdf8" />
                  <span>{showDetailedReport ? 'Hide Detailed Telemetry' : 'View Criteria & Finger Telemetry'}</span>
                  {showDetailedReport ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
                  <button
                    type="button"
                    onClick={resetLevelSession}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isDark ? '#94a3b8' : '#64748b',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Retry (R)
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: isDark ? '#cbd5e1' : '#334155' }}>
                    <span>Press</span>
                    <button
                      type="button"
                      onClick={handleNextOrRetry}
                      style={{
                        padding: '4px 14px',
                        borderRadius: '999px',
                        background: '#0ea5e9',
                        border: 'none',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '12px',
                        boxShadow: '0 0 12px rgba(14, 165, 233, 0.45)',
                        cursor: 'pointer'
                      }}
                    >
                      Enter
                    </button>
                    <span>
                      {evaluation.passedAll && currentLevelId < TOTAL_TOUCH_TYPING_LEVELS
                        ? 'to continue'
                        : 'to try again'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expandable Criteria & Finger Telemetry Panel */}
              {showDetailedReport && (
                <div
                  style={{
                    marginTop: '16px',
                    background: isDark ? '#212429' : '#f8f4ec',
                    borderRadius: '12px',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2dbcd'}`,
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    fontSize: '12px'
                  }}
                >
                  {/* Criteria Checklist */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#756c5e', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Target size={14} color="#38bdf8" />
                      <span>Level {currentLevel.id} Criteria Breakdown</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                      <div
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: `1px solid ${evaluation.wpmPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                          background: evaluation.wpmPassed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '10px', opacity: 0.75 }}>Min Speed</div>
                          <div style={{ fontFamily: 'monospace', fontWeight: 700 }}>{liveStats.wpm} / {currentLevel.criteria.minWpm} WPM</div>
                        </div>
                        {evaluation.wpmPassed ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}
                      </div>

                      <div
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: `1px solid ${evaluation.accPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                          background: evaluation.accPassed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '10px', opacity: 0.75 }}>Min Accuracy</div>
                          <div style={{ fontFamily: 'monospace', fontWeight: 700 }}>{liveStats.accuracy}% / {currentLevel.criteria.minAcc}%</div>
                        </div>
                        {evaluation.accPassed ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}
                      </div>

                      <div
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: `1px solid ${evaluation.errPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                          background: evaluation.errPassed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '10px', opacity: 0.75 }}>Error Limit</div>
                          <div style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                            {currentLevel.criteria.maxErrors !== null ? `${errorCount} / Max ${currentLevel.criteria.maxErrors}` : `${errorCount} Errors`}
                          </div>
                        </div>
                        {evaluation.errPassed ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}
                      </div>

                      <div
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: `1px solid ${evaluation.streakPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                          background: evaluation.streakPassed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '10px', opacity: 0.75 }}>Streak Combo</div>
                          <div style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                            {currentLevel.criteria.minStreak !== null ? `${bestStreak} / ${currentLevel.criteria.minStreak}` : `${bestStreak} Best`}
                          </div>
                        </div>
                        {evaluation.streakPassed ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}
                      </div>
                    </div>
                  </div>

                  {/* Finger Breakdown & Problem Keys */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', paddingTop: '12px', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e6dfd1'}` }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#756c5e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Activity size={14} color="#38bdf8" />
                        <span>Per-Finger Precision</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {Object.entries(FINGER_META).map(([fCode, meta]) => {
                          const stat = fingerStats[fCode];
                          if (!stat || stat.total === 0) return null;
                          const pct = Math.round((stat.hits / stat.total) * 100);
                          return (
                            <div key={fCode} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                              <span style={{ width: '60px', color: isDark ? '#94a3b8' : '#756c5e' }}>{meta.short}</span>
                              <div style={{ flex: 1, height: '6px', borderRadius: '999px', background: isDark ? '#333842' : '#e0d8ca', overflow: 'hidden' }}>
                                <div
                                  style={{
                                    height: '100%',
                                    width: `${pct}%`,
                                    background: pct >= 95 ? '#10b981' : pct >= 85 ? '#38bdf8' : '#f59e0b',
                                    borderRadius: '999px'
                                  }}
                                />
                              </div>
                              <span style={{ width: '36px', textAlign: 'right', fontFamily: 'monospace' }}>{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#756c5e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={14} color="#f59e0b" />
                        <span>Problem Keys & Cadence ({evaluation.avgLatency}ms)</span>
                      </div>
                      {Object.keys(keyErrorMap).length === 0 ? (
                        <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10b981', fontSize: '11px' }}>
                          Flawless precision! Zero missed characters during this session.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {Object.entries(keyErrorMap)
                            .sort((a, b) => b[1] - a[1])
                            .map(([k, count]) => (
                              <span
                                key={k}
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  background: 'rgba(239, 68, 68, 0.12)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: isDark ? '#fca5a5' : '#dc2626',
                                  fontFamily: 'monospace',
                                  fontSize: '11px'
                                }}
                              >
                                "{k}" ({count}x)
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </main>

      {/* ==================================================================== */}
      {/* 4. MODALS: CURRICULUM DRAWER & MASTER UNLOCK PROMPT                  */}
      {/* ==================================================================== */}
      <TypingCurriculumModal
        isOpen={isCurriculumOpen}
        onClose={() => setIsCurriculumOpen(false)}
        currentLevelId={currentLevelId}
        progress={touchProgress}
        onSelectLevel={handleSelectLevel}
        theme={activeTheme}
      />

      {unlockPromptOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
          onClick={e => {
            if (e.target === e.currentTarget) setUnlockPromptOpen(false);
          }}
        >
          <div
            style={{
              background: isDark ? '#212429' : '#ffffff',
              border: `1px solid ${isDark ? '#383f4c' : '#ded5c5'}`,
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '380px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Unlock size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: isDark ? '#ffffff' : '#1c1915' }}>Instructor Master Unlock</h3>
                <span style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b' }}>Enter master password to unlock all 25 levels</span>
              </div>
            </div>

            <form onSubmit={handleApplyMasterUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="password"
                placeholder="Enter password (e.g. ICST)"
                value={masterInput}
                onChange={e => {
                  setMasterInput(e.target.value);
                  setMasterError(null);
                }}
                autoFocus
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${masterError ? '#ef4444' : (isDark ? '#414856' : '#d2c8b7')}`,
                  background: isDark ? '#191b1f' : '#f9f6f0',
                  color: isDark ? '#ffffff' : '#1c1915',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />

              {masterError && (
                <span style={{ color: '#ef4444', fontSize: '11px' }}>{masterError}</span>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setUnlockPromptOpen(false)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${isDark ? '#3d4452' : '#d5cbba'}`,
                    background: 'transparent',
                    color: isDark ? '#cbd5e1' : '#64748b',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#10b981',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Unlock All Levels
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
