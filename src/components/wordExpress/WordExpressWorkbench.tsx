import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  AlertTriangle,
  Unlock,
  Lock,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Hand,
  Keyboard,
  Eye,
  EyeOff,
  SlidersHorizontal,
  RotateCcw,
  X,
  Star,
  Play
} from 'lucide-react';

import { FingerId, TypingTheme, TouchTypingLevel } from '../../types/touchTyping';
import { CarrierTier, WordExpressLevel, WordToughness } from '../../types/wordExpress';
import { KEYBOARD_ROWS, CHAR_MAP, FINGER_META } from '../../data/touchTypingGeometry';
import {
  WORD_EXPRESS_LEVELS,
  WORD_EXPRESS_STAGES_META,
  getWordExpressLevelById,
  getCriteriaForToughness,
  getCarrierForStreak,
  getCarrierByTier
} from '../../data/wordExpressData';
import {
  loadWordExpressProgress,
  saveWordExpressRecord,
  evaluateWordExpressRun,
  getWordExpressToughnessCookie,
  setWordExpressToughnessCookie,
  TOTAL_WORD_EXPRESS_LEVELS
} from '../../services/wordExpressStorageService';
import {
  isMasterUnlocked,
  verifyAndApplyMasterPassword,
  setMasterUnlocked
} from '../../services/masterUnlockService';
import {
  playKeyClickSound,
  playRhythmChimeSound,
  playErrorBuzzSound,
  playCompletionFanfareSound,
  playLevelFailSound,
  toggleTouchTypingMute,
  isTouchTypingMuted
} from '../../utils/touchTypingSound';
import { useFullscreen } from '../../utils/useFullscreen';

import { IllustratedHandsSVG } from '../typing/IllustratedHandsSVG';
import { HandSetupGuide } from '../typing/HandSetupGuide';
import { FullscreenRequiredGate } from '../common/FullscreenRequiredGate';
import { LabGuideAssistant } from '../common/LabGuideAssistant';
import {
  WordDeliveryRunway,
  DepartingDeliveryItem,
  FleetDowngradeEvent
} from './WordDeliveryRunway';
import { WordExpressReportView, WordRunMetric } from './WordExpressReportView';
import '../typing/touchTyping.css';
import './wordExpress.css';

export interface WordExpressWorkbenchProps {
  levelNumber: number;
  onBackToDashboard: () => void;
  onSelectLevel?: (level: number) => void;
  onExpAwarded?: (exp: number, source?: 'word-express') => void;
  theme?: TypingTheme;
  onToggleTheme?: () => void;
}

const TOUGHNESS_OPTIONS: Array<{ id: WordToughness; label: string }> = [
  { id: 'easy', label: 'Easy' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'hard', label: 'Hard' }
];

export const WordExpressWorkbench: React.FC<WordExpressWorkbenchProps> = ({
  levelNumber,
  onBackToDashboard,
  onSelectLevel,
  onExpAwarded,
  theme: controlledTheme,
  onToggleTheme: controlledToggleTheme
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, isPseudoFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen } = useFullscreen(
    rootRef,
    { useDocumentRoot: true, mandatory: true }
  );

  const handleReturnToDashboard = useCallback(() => {
    void exitFullscreen();
    onBackToDashboard();
  }, [exitFullscreen, onBackToDashboard]);

  const [localTheme, setLocalTheme] = useState<TypingTheme>(() => {
    try {
      return localStorage.getItem('icst_typing_theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const activeTheme = controlledTheme || localTheme;
  const isDark = activeTheme === 'dark';

  const handleToggleTheme = () => {
    if (controlledToggleTheme) {
      controlledToggleTheme();
    } else {
      const next = activeTheme === 'dark' ? 'light' : 'dark';
      setLocalTheme(next);
      try {
        localStorage.setItem('icst_typing_theme', next);
      } catch { }
    }
  };

  // Cookie-stored Lab Toughness
  const [toughness, setToughness] = useState<WordToughness>(() => getWordExpressToughnessCookie());
  useEffect(() => {
    const syncCookie = (e: Event) => {
      const custom = e as CustomEvent<{ toughness?: WordToughness }>;
      setToughness(custom.detail?.toughness || getWordExpressToughnessCookie());
    };
    window.addEventListener('icst_word_express_toughness_changed', syncCookie);
    window.addEventListener('icst_data_cleared', syncCookie);
    return () => {
      window.removeEventListener('icst_word_express_toughness_changed', syncCookie);
      window.removeEventListener('icst_data_cleared', syncCookie);
    };
  }, []);

  const handleChangeToughness = (next: WordToughness) => {
    setToughness(next);
    setWordExpressToughnessCookie(next);
  };

  // Sound mute
  const [isMuted, setIsMuted] = useState<boolean>(() => isTouchTypingMuted());
  const handleToggleMute = () => setIsMuted(toggleTouchTypingMute());

  // Master Unlock
  const [masterActive, setMasterActive] = useState<boolean>(() => isMasterUnlocked());
  const [unlockPromptOpen, setUnlockPromptOpen] = useState(false);
  const [masterInput, setMasterInput] = useState('');
  const [masterError, setMasterError] = useState<string | null>(null);

  useEffect(() => {
    const onMasterChange = (e: Event) => {
      const custom = e as CustomEvent<{ unlocked?: boolean }>;
      setMasterActive(custom.detail?.unlocked ?? isMasterUnlocked());
    };
    window.addEventListener('icst_master_unlock_changed', onMasterChange);
    return () => window.removeEventListener('icst_master_unlock_changed', onMasterChange);
  }, []);

  // Level & Progress State
  const [currentLevelId, setCurrentLevelId] = useState<number>(() =>
    Math.max(1, Math.min(TOTAL_WORD_EXPRESS_LEVELS, levelNumber || 1))
  );
  const [weProgress, setWeProgress] = useState(() => loadWordExpressProgress());
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);

  useEffect(() => {
    const onProgressChange = () => setWeProgress(loadWordExpressProgress());
    window.addEventListener('icst_word_express_progress_changed', onProgressChange);
    window.addEventListener('icst_data_cleared', onProgressChange);
    return () => {
      window.removeEventListener('icst_word_express_progress_changed', onProgressChange);
      window.removeEventListener('icst_data_cleared', onProgressChange);
    };
  }, []);

  const currentLevel: WordExpressLevel = useMemo(
    () => getWordExpressLevelById(currentLevelId) || WORD_EXPRESS_LEVELS[0],
    [currentLevelId]
  );

  const resolvedCriteria = useMemo(
    () => getCriteriaForToughness(currentLevel, toughness),
    [currentLevel, toughness]
  );

  // Adapter for HandSetupGuide compatibility
  const levelGuideAdapter: TouchTypingLevel = useMemo(
    () => ({
      id: currentLevel.id,
      stage: currentLevel.stage,
      stageName: currentLevel.stageName,
      focusMode: toughness === 'easy' ? 'learning' : 'challenge',
      title: currentLevel.title,
      subtitle: currentLevel.subtitle,
      focusKeys: currentLevel.focusKeys,
      text: currentLevel.words.join(' '),
      criteria: {
        minWpm: resolvedCriteria.minWpm,
        minAcc: resolvedCriteria.minAcc,
        maxErrors: resolvedCriteria.maxErrors,
        minStreak: resolvedCriteria.minStreak
      },
      criteriaDesc: `${toughness.toUpperCase()}: ${resolvedCriteria.desc}`
    }),
    [currentLevel, resolvedCriteria, toughness]
  );

  // UI toggles
  const [viewMode, setViewMode] = useState<'typing' | 'report'>('typing');
  const [showHandGuide, setShowHandGuide] = useState<boolean>(true);
  const [showHands, setShowHands] = useState<boolean>(true);
  const [showKeyLabels, setShowKeyLabels] = useState<boolean>(true);
  const [showLiveHud, setShowLiveHud] = useState<boolean>(false);

  // Word Queue & Typing Session State
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [letterIndex, setLetterIndex] = useState<number>(0);
  const [charsCompleted, setCharsCompleted] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [peakCarrierTier, setPeakCarrierTier] = useState<number>(1);
  const [capsLockOn, setCapsLockOn] = useState<boolean>(false);

  // Visual Feedback & Delivery Queue Animation
  const [lastTypedStatus, setLastTypedStatus] = useState<'correct' | 'error' | null>(null);
  const [errorKeyId, setErrorKeyId] = useState<string | null>(null);
  const [errorVibrationTick, setErrorVibrationTick] = useState<number>(0);
  const [downgradeEvent, setDowngradeEvent] = useState<FleetDowngradeEvent | null>(null);
  const downgradeTickRef = useRef<number>(1);
  const [pressedKeyIds, setPressedKeyIds] = useState<Set<string>>(new Set());
  const [pressedFinger, setPressedFinger] = useState<FingerId | null>(null);
  const [departingItems, setDepartingItems] = useState<DepartingDeliveryItem[]>([]);
  const departingUidRef = useRef<number>(1);

  // Carrier locked to the current center word (stays fixed in center until the word is completed)
  const [centerCarrier, setCenterCarrier] = useState<CarrierTier>(() => getCarrierForStreak(0));

  const [fingerStats, setFingerStats] = useState<Record<string, { hits: number; total: number }>>({});
  const [wordErrorMap, setWordErrorMap] = useState<Record<string, number>>({});
  const [wordMetrics, setWordMetrics] = useState<WordRunMetric[]>([]);
  const [avgLatencyMs, setAvgLatencyMs] = useState<number>(0);
  const [lastExpEarned, setLastExpEarned] = useState<number>(0);
  const wordStartTimeRef = useRef<number | null>(null);
  const currentWordErrorsRef = useRef<number>(0);
  const lastKeyTimeRef = useRef<number | null>(null);
  const latencySumRef = useRef<number>(0);
  const latencyCountRef = useRef<number>(0);

  const totalCharsInLevel = useMemo(
    () => currentLevel.words.reduce((sum, w) => sum + w.length, 0),
    [currentLevel.words]
  );

  const currentWord = currentLevel.words[wordIndex] || '';
  const nextWord = currentLevel.words[wordIndex + 1] || null;
  const upcomingWordAfterNext = currentLevel.words[wordIndex + 2] || null;
  const activeChar = currentWord[letterIndex] || '';
  const activeKeyMeta = CHAR_MAP[activeChar] || CHAR_MAP[' '];

  // Next queued fleet reflects the live streak immediately (downgrades to previous fleet on wrong key!)
  const nextCarrier = useMemo(() => getCarrierForStreak(currentStreak), [currentStreak]);

  // Practiced keys top strip
  const practicedKeys = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<{ raw: string; display: string; finger: FingerId; color: string; fingerName: string }> = [];
    for (const k of currentLevel.focusKeys) {
      if (seen.has(k)) continue;
      seen.add(k);
      const meta = CHAR_MAP[k];
      const finger = (meta?.finger as FingerId) || 'THUMB';
      const fMeta = FINGER_META[finger];
      list.push({
        raw: k,
        display: k === ' ' ? 'Space' : k,
        finger,
        color: fMeta?.color || '#38bdf8',
        fingerName: fMeta?.name || 'Finger'
      });
    }
    return list;
  }, [currentLevel.focusKeys]);

  // Reset level session (preserves active streak & fleet when crossing to next stage!)
  const resetLevelSession = useCallback((preserveStreak: boolean = false, carryStreakVal?: number) => {
    const nextStreak = preserveStreak ? (carryStreakVal ?? 0) : 0;
    const startingCarrier = getCarrierForStreak(nextStreak);

    setWordIndex(0);
    setLetterIndex(0);
    setCharsCompleted(0);
    setStartTime(null);
    setElapsedSec(0);
    setErrorCount(0);
    setTotalKeystrokes(0);
    setCurrentStreak(nextStreak);
    setBestStreak(nextStreak);
    setPeakCarrierTier(startingCarrier.tier);
    setCenterCarrier(startingCarrier);
    setLastTypedStatus(null);
    setErrorKeyId(null);
    setDowngradeEvent(null);
    setDepartingItems([]);
    setFingerStats({});
    setWordErrorMap({});
    setWordMetrics([]);
    setAvgLatencyMs(0);
    setLastExpEarned(0);
    wordStartTimeRef.current = null;
    currentWordErrorsRef.current = 0;
    lastKeyTimeRef.current = null;
    latencySumRef.current = 0;
    latencyCountRef.current = 0;
    setViewMode('typing');
  }, []);

  const handleSelectLevel = useCallback(
    (lvlId: number, preserveStreak: boolean = false) => {
      const validId = Math.max(1, Math.min(TOTAL_WORD_EXPRESS_LEVELS, lvlId));
      setCurrentLevelId(validId);
      if (onSelectLevel) onSelectLevel(validId);
      setIsCurriculumOpen(false);
      resetLevelSession(preserveStreak, currentStreak);
      setShowHandGuide(true);
    },
    [onSelectLevel, resetLevelSession, currentStreak]
  );

  // Live timer (pauses automatically if Hand Guide or Mandatory Full Screen gate is open)
  useEffect(() => {
    if (!startTime || viewMode !== 'typing' || showHandGuide || !isFullscreen) return;
    const timer = setInterval(() => {
      setElapsedSec((performance.now() - startTime) / 1000);
    }, 100);
    return () => clearInterval(timer);
  }, [startTime, viewMode, showHandGuide, isFullscreen]);

  // Live stats
  const liveStats = useMemo(() => {
    const minutes = Math.max(elapsedSec / 60, 0.01);
    const wpm = startTime && charsCompleted > 0 ? Math.round((charsCompleted / 5) / minutes) : 0;
    const rawWpm = startTime && totalKeystrokes > 0 ? Math.round((totalKeystrokes / 5) / minutes) : 0;
    const accuracy =
      totalKeystrokes > 0
        ? Math.max(0, Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100))
        : 100;
    return { wpm, rawWpm, accuracy };
  }, [elapsedSec, charsCompleted, startTime, totalKeystrokes, errorCount]);

  // Evaluation
  const evaluation = useMemo(() => {
    if (viewMode !== 'report') return null;

    const wpmPassed = liveStats.wpm >= resolvedCriteria.minWpm;
    const accPassed = liveStats.accuracy >= resolvedCriteria.minAcc;
    const errPassed = resolvedCriteria.maxErrors === null || errorCount <= resolvedCriteria.maxErrors;
    const streakPassed = resolvedCriteria.minStreak === null || bestStreak >= resolvedCriteria.minStreak;
    const passedAll = wpmPassed && accPassed && errPassed && streakPassed;

    const badge1 = passedAll;
    const badge2 = passedAll && liveStats.accuracy >= Math.min(97, resolvedCriteria.minAcc + 3);
    const badge3 = passedAll && liveStats.wpm >= resolvedCriteria.minWpm + 5;
    const starsCount = (badge1 ? 1 : 0) + (badge2 ? 1 : 0) + (badge3 ? 1 : 0);

    return {
      passedAll,
      wpmPassed,
      accPassed,
      errPassed,
      streakPassed,
      badge1,
      badge2,
      badge3,
      starsCount
    };
  }, [viewMode, resolvedCriteria, liveStats, errorCount, bestStreak]);

  // Save record once on report open
  const recordedRef = useRef<boolean>(false);
  useEffect(() => {
    if (viewMode === 'report' && evaluation && !recordedRef.current) {
      recordedRef.current = true;
      if (evaluation.passedAll) {
        playCompletionFanfareSound(evaluation.starsCount);
      } else {
        playLevelFailSound();
      }

      const formattedFingerStats: Record<string, { finger: FingerId; totalHits: number; correctHits: number; accuracy: number }> = {};
      Object.entries(fingerStats).forEach(([fKey, st]) => {
        formattedFingerStats[fKey] = {
          finger: fKey as FingerId,
          totalHits: st.total,
          correctHits: st.hits,
          accuracy: st.total > 0 ? Math.round((st.hits / st.total) * 100) : 0
        };
      });

      const result = evaluateWordExpressRun(
        currentLevel,
        toughness,
        liveStats.wpm,
        liveStats.rawWpm,
        liveStats.accuracy,
        elapsedSec,
        totalKeystrokes,
        currentLevel.words.length,
        errorCount,
        bestStreak,
        peakCarrierTier,
        formattedFingerStats
      );

      const updated = saveWordExpressRecord(result);
      setWeProgress(updated);
      setLastExpEarned(result.expEarned);

      if (result.expEarned > 0 && onExpAwarded) {
        onExpAwarded(result.expEarned, 'word-express');
      }
    } else if (viewMode === 'typing') {
      recordedRef.current = false;
    }
  }, [
    viewMode,
    evaluation,
    currentLevel,
    toughness,
    liveStats,
    elapsedSec,
    totalKeystrokes,
    errorCount,
    bestStreak,
    peakCarrierTier,
    fingerStats,
    onExpAwarded
  ]);

  const handleNextOrRetry = useCallback(() => {
    if (!evaluation) return;
    if (evaluation.passedAll && currentLevelId < TOTAL_WORD_EXPRESS_LEVELS) {
      // Continue active streak & fleet seamlessly into the next stage!
      handleSelectLevel(currentLevelId + 1, true);
    } else {
      resetLevelSession(false);
    }
  }, [evaluation, currentLevelId, handleSelectLevel, resetLevelSession]);

  // Keyboard listener (mandatory Full Screen gate + Hand Guide gate + zero-lag queue delivery)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (typeof e.getModifierState === 'function') {
        setCapsLockOn(e.getModifierState('CapsLock'));
      }

      // Fullscreen toggle shortcut (Alt+F)
      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // Mandatory Full Screen Gate: block typing until Full Screen is active
      if (!isFullscreen) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          void enterFullscreen();
        }
        return;
      }

      if (isCurriculumOpen || unlockPromptOpen) {
        if (e.key === 'Escape') {
          setIsCurriculumOpen(false);
          setUnlockPromptOpen(false);
        }
        return;
      }

      if (showHandGuide && viewMode === 'typing') {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          setShowHandGuide(false);
        }
        return;
      }

      if (viewMode === 'report') {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleNextOrRetry();
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          resetLevelSession(false);
        }
        return;
      }

      setPressedKeyIds(prev => new Set(prev).add(e.code));

      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) {
        return;
      }

      if (e.key === ' ' || e.key === '/' || e.key === "'" || e.key === '"') {
        e.preventDefault();
      }

      if (e.key.length !== 1) return;

      const expectedWord = currentLevel.words[wordIndex];
      if (!expectedWord) return;
      const expectedChar = expectedWord[letterIndex];
      if (!expectedChar) return;

      const now = performance.now();
      if (!startTime) {
        setStartTime(now);
      }
      if (!wordStartTimeRef.current) {
        wordStartTimeRef.current = now;
      }
      if (lastKeyTimeRef.current !== null) {
        const dt = now - lastKeyTimeRef.current;
        if (dt > 10 && dt < 3000) {
          latencySumRef.current += dt;
          latencyCountRef.current += 1;
        }
      }
      lastKeyTimeRef.current = now;

      const expectedMeta = CHAR_MAP[expectedChar] || CHAR_MAP[' '];
      const fingerCode = (expectedMeta.finger as FingerId) || 'THUMB';

      setTotalKeystrokes(prev => prev + 1);
      setPressedFinger(fingerCode);
      setTimeout(() => setPressedFinger(null), 110);

      if (e.key === expectedChar) {
        playKeyClickSound(true, false);

        const nextStreak = currentStreak + 1;
        const nextTier = getCarrierForStreak(nextStreak);
        const prevTier = getCarrierForStreak(currentStreak);

        if (nextTier.tier > prevTier.tier) {
          playRhythmChimeSound(nextStreak);
        }

        setCurrentStreak(nextStreak);
        setBestStreak(prev => Math.max(prev, nextStreak));
        setPeakCarrierTier(prev => Math.max(prev, nextTier.tier));
        setCharsCompleted(prev => prev + 1);
        setLastTypedStatus('correct');
        setErrorKeyId(null);

        setFingerStats(prev => {
          const cur = prev[fingerCode] || { hits: 0, total: 0 };
          return { ...prev, [fingerCode]: { hits: cur.hits + 1, total: cur.total + 1 } };
        });

        const nextLetterIdx = letterIndex + 1;

        if (nextLetterIdx >= expectedWord.length) {
          // Record detailed per-word analytics for the interactive report screen
          const wordDurMs = Math.max(180, Math.round(now - (wordStartTimeRef.current || now)));
          const wordWpm = Math.min(
            200,
            Math.max(1, Math.round((expectedWord.length / 5) / (wordDurMs / 60000)))
          );
          const wordErrs = currentWordErrorsRef.current;
          setWordMetrics(prev => [
            ...prev,
            {
              word: expectedWord,
              durationMs: wordDurMs,
              wpm: wordWpm,
              errors: wordErrs,
              carrierTier: centerCarrier.tier,
              perfect: wordErrs === 0
            }
          ]);
          wordStartTimeRef.current = now;
          currentWordErrorsRef.current = 0;

          // Word properly typed! Depart the locked center carrier to the RIGHT,
          // and move the queued next fleet into center for the next word!
          const uid = departingUidRef.current++;
          const departingCarrier = centerCarrier;
          setDepartingItems(prev => [...prev, { uid, word: expectedWord, carrier: departingCarrier }]);
          setTimeout(() => {
            setDepartingItems(prev => prev.filter(item => item.uid !== uid));
          }, departingCarrier.exitMs + 120);

          const nextWordIdx = wordIndex + 1;
          if (nextWordIdx >= currentLevel.words.length) {
            setElapsedSec((now - (startTime || now)) / 1000);
            if (latencyCountRef.current > 0) {
              setAvgLatencyMs(Math.round(latencySumRef.current / latencyCountRef.current));
            }
            setWordIndex(nextWordIdx);
            setLetterIndex(0);
            setTimeout(() => {
              setViewMode('report');
            }, 340);
          } else {
            // Lock the incoming word's carrier to the current live fleet tier
            setCenterCarrier(nextTier);
            setWordIndex(nextWordIdx);
            setLetterIndex(0);
          }
        } else {
          setLetterIndex(nextLetterIdx);
        }
      } else {
        // Error keystroke:
        // 1. Center fleet stays locked in place and vibrates visually!
        // 2. Next fleet decreases by 1 tier to the PREVIOUS fleet with smooth animation!
        playErrorBuzzSound();
        currentWordErrorsRef.current += 1;
        setErrorCount(prev => prev + 1);
        setLastTypedStatus('error');
        setErrorVibrationTick(prev => prev + 1);
        setErrorKeyId(e.code);
        setTimeout(() => setErrorKeyId(null), 280);

        const currTier = getCarrierForStreak(currentStreak);
        if (currTier.tier > 1) {
          const prevTier = getCarrierByTier(currTier.tier - 1);
          setCurrentStreak(prevTier.minStreak);
          setDowngradeEvent({
            tick: downgradeTickRef.current++,
            fromName: currTier.name,
            toCarrier: prevTier
          });
        } else {
          setCurrentStreak(0);
        }

        setFingerStats(prev => {
          const cur = prev[fingerCode] || { hits: 0, total: 0 };
          return { ...prev, [fingerCode]: { hits: cur.hits, total: cur.total + 1 } };
        });

        setWordErrorMap(prev => ({
          ...prev,
          [expectedWord]: (prev[expectedWord] || 0) + 1
        }));
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
    wordIndex,
    letterIndex,
    currentLevel.words,
    startTime,
    currentStreak,
    centerCarrier,
    viewMode,
    isFullscreen,
    showHandGuide,
    isCurriculumOpen,
    unlockPromptOpen,
    handleNextOrRetry,
    resetLevelSession,
    enterFullscreen,
    toggleFullscreen
  ]);

  const progressPct = Math.min(100, Math.round((charsCompleted / Math.max(1, totalCharsInLevel)) * 100));

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
    <div
      ref={rootRef}
      className={`typing-root we-workbench-root theme-${activeTheme} ${isPseudoFullscreen ? 'is-pseudo-fullscreen' : ''} ${isFullscreen ? 'is-fullscreen' : ''}`}
      style={{ height: '100%', minHeight: 'calc(100vh - 60px)', overflowY: 'auto' }}
    >
      {/* 1. TOP WORKBENCH HEADER BAR */}
      <header
        className="we-top-header"
        style={{
          borderBottom: `1px solid ${isDark ? '#2b2f36' : '#e5decfe0'}`,
          background: isDark ? '#191b1f' : '#ffffff'
        }}
      >
        <div className="we-top-left">
          <button
            type="button"
            onClick={handleReturnToDashboard}
            className="we-back-btn"
            title="Exit Full Screen & Return to Word Express Dashboard"
          >
            <ArrowLeft size={14} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCurriculumOpen(true)}
            className="we-level-picker-btn"
          >
            <span className="we-level-num">Stage {currentLevel.id} / {TOTAL_WORD_EXPRESS_LEVELS}</span>
            <span className="we-level-title">({currentLevel.title})</span>
            <ChevronDown size={14} style={{ opacity: 0.7 }} />
          </button>

          {capsLockOn && (
            <div className="we-capslock-pill">
              <AlertTriangle size={12} />
              <span>CAPS LOCK</span>
            </div>
          )}
        </div>

        <div className="we-top-right">
          {/* Cookie-Backed Toughness Switcher (Easy / Moderate / Hard) */}
          <div className="we-toughness-segmented" role="group" aria-label="Level Crossing Toughness (Saved in Cookies)">
            {TOUGHNESS_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                className={`we-toughness-btn ${opt.id} ${toughness === opt.id ? 'active' : ''}`}
                onClick={() => handleChangeToughness(opt.id)}
                title={`Set lab toughness to ${opt.label} (saved in browser cookie)`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {showLiveHud && viewMode === 'typing' && (
            <div className="we-live-hud-pill">
              <span>{liveStats.wpm} WPM</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>{liveStats.accuracy}% ACC</span>
            </div>
          )}

          <div className="we-goal-pill" title={`Passing target (${toughness})`}>
            Goal: {resolvedCriteria.desc}
          </div>

          {/* Master Unlock */}
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
            className={`we-master-btn ${masterActive ? 'is-unlocked' : ''}`}
            title={masterActive ? 'Master Unlocked (ICST) - Click to lock' : 'Enter Master Password to unlock all 25 stages'}
          >
            {masterActive ? <Unlock size={13} /> : <Lock size={13} />}
            <span>{masterActive ? 'ICST' : 'Unlock'}</span>
          </button>

          {/* Full Screen Mode Status / Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`we-fullscreen-btn ${isFullscreen ? 'is-active' : ''}`}
            title={isFullscreen ? 'Full Screen Active (Mandatory in Workbench)' : 'Enter Full Screen Mode (Alt+F)'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{isFullscreen ? 'Full Screen On' : 'Full Screen'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            className="we-icon-btn"
            title={isMuted ? 'Unmute Typing Sounds' : 'Mute Typing Sounds'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={handleToggleTheme}
            className="we-icon-btn"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#0369a1" />}
          </button>
        </div>
      </header>

      {/* Progress Line */}
      <div style={{ width: '100%', height: '2.5px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', flexShrink: 0 }}>
        <div
          style={{
            height: '100%',
            width: `${Math.max(2, progressPct)}%`,
            background: centerCarrier.accent,
            boxShadow: `0 0 10px ${centerCarrier.accent}`,
            transition: 'width 0.16s ease'
          }}
        />
      </div>

      {/* Persistent Practicing Keys Strip */}
      {viewMode === 'typing' && (
        <div className={`practicing-keys-bar ${isDark ? 'is-dark' : 'is-light'}`}>
          <div className="practicing-keys-inner">
            <div className="practicing-keys-meta">
              <span className="practicing-keys-label">
                <Keyboard size={13} />
                <span>Practicing Keys</span>
              </span>
              <span className={`practicing-mode-tag ${toughness === 'easy' ? 'learning' : 'challenge'}`}>
                {toughness}
              </span>
            </div>

            <div className="practicing-keys-list">
              {practicedKeys.map(pk => {
                const isCurrentKey = activeChar === pk.raw;
                return (
                  <span
                    key={pk.raw}
                    className={`practicing-keycap ${isCurrentKey ? 'is-active' : ''}`}
                    title={`Key "${pk.display}" — ${pk.fingerName}`}
                    style={{
                      borderColor: isCurrentKey ? pk.color : undefined,
                      boxShadow: isCurrentKey ? `0 0 0 2px ${pk.color}40` : undefined
                    }}
                  >
                    <span className="practicing-key-pip" style={{ background: pk.color }} />
                    <span>{pk.display}</span>
                  </span>
                );
              })}
            </div>

            <div className="practicing-keys-actions">
              {activeKeyMeta && (
                <div className="active-finger-cue">
                  <span
                    className="active-finger-dot"
                    style={{ background: FINGER_META[activeKeyMeta.finger]?.color || '#38bdf8' }}
                  />
                  <span>
                    {activeKeyMeta.shiftFinger
                      ? `${FINGER_META[activeKeyMeta.shiftFinger]?.short} Shift + ${FINGER_META[activeKeyMeta.finger]?.short}`
                      : FINGER_META[activeKeyMeta.finger]?.name}
                  </span>
                </div>
              )}

              <button
                type="button"
                className="hand-guide-reopen-btn"
                onClick={() => setShowHandGuide(true)}
                title="View visual hand & finger placement guide"
              >
                <Hand size={13} />
                <span>Hand Guide</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN WORKBENCH CANVAS */}
      <main className="we-main-canvas">
        {viewMode === 'typing' ? (
          <div className="we-canvas-column">
            {/* ANIMATED WORD DELIVERY RUNWAY RIGHT AT THE TOP OF THE HAND KEYBOARD */}
            <WordDeliveryRunway
              currentWord={currentWord}
              wordIndex={wordIndex}
              totalWords={currentLevel.words.length}
              letterIndex={letterIndex}
              nextWord={nextWord}
              upcomingWordAfterNext={upcomingWordAfterNext}
              centerCarrier={centerCarrier}
              nextCarrier={nextCarrier}
              departingItems={departingItems}
              streak={currentStreak}
              isError={lastTypedStatus === 'error'}
              errorVibrationTick={errorVibrationTick}
              downgradeEvent={downgradeEvent}
              beamCenterPct={activeKeyMeta?.centerPct || 50}
              theme={activeTheme}
            />

            {/* Minimalist Utility Icons */}
            <div className="we-utility-row">
              <button
                type="button"
                onClick={() => setShowKeyLabels(prev => !prev)}
                title={showKeyLabels ? 'Hide Key Labels (Blind Mode)' : 'Show Key Labels'}
                style={{ color: showKeyLabels ? (isDark ? '#94a3b8' : '#78716c') : '#38bdf8' }}
              >
                <Keyboard size={15} />
              </button>
              <button
                type="button"
                onClick={() => setShowHands(prev => !prev)}
                title={showHands ? 'Hide Hand Overlay' : 'Show Hand Overlay'}
                style={{ color: showHands ? (isDark ? '#94a3b8' : '#78716c') : '#38bdf8' }}
              >
                {showHands ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <button
                type="button"
                onClick={() => setShowLiveHud(prev => !prev)}
                title="Toggle Live Telemetry HUD"
                style={{ color: showLiveHud ? '#38bdf8' : (isDark ? '#94a3b8' : '#78716c') }}
              >
                <SlidersHorizontal size={15} />
              </button>
              <button
                type="button"
                onClick={() => resetLevelSession(false)}
                title="Restart Stage (Resets Streak)"
                style={{ color: isDark ? '#94a3b8' : '#78716c' }}
              >
                <RotateCcw size={15} />
              </button>
            </div>

            {/* 15-UNIT WIREFRAME KEYBOARD + ILLUSTRATED HANDS OVERLAY */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '4px', paddingBottom: '34px' }}>
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
                      let keyText = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.32)';
                      let keyGlow = 'none';

                      if (isErrorKey) {
                        keyBorder = '1.5px solid rgba(239, 68, 68, 0.85)';
                        keyBg = 'rgba(239, 68, 68, 0.2)';
                        keyText = '#fca5a5';
                      } else if (isTargetKey || isTargetShift) {
                        keyBorder = `1.5px solid ${centerCarrier.accent}`;
                        keyBg = isDark ? `${centerCarrier.accent}24` : `${centerCarrier.accent}18`;
                        keyText = isDark ? '#ffffff' : centerCarrier.accent;
                        keyGlow = `0 0 12px ${centerCarrier.glow}`;
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
                                fontWeight: isTargetKey || isTargetShift ? 800 : 500
                              }}
                            >
                              {isTargetKey && activeKeyMeta?.needsShift && keyObj.shift
                                ? keyObj.shift
                                : keyObj.label}
                            </span>
                          )}
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
          /* 3. REDESIGNED ANIMATED & INTERACTIVE FULL ANALYTICS REPORT VIEW */
          evaluation && (
            <WordExpressReportView
              level={currentLevel}
              totalLevels={TOTAL_WORD_EXPRESS_LEVELS}
              toughness={toughness}
              criteria={resolvedCriteria}
              evaluation={evaluation}
              wpm={liveStats.wpm}
              accuracy={liveStats.accuracy}
              elapsedSec={elapsedSec}
              totalKeystrokes={totalKeystrokes}
              errorCount={errorCount}
              currentStreak={currentStreak}
              bestStreak={bestStreak}
              peakCarrierTier={peakCarrierTier}
              expEarned={lastExpEarned}
              avgLatencyMs={avgLatencyMs}
              wordMetrics={wordMetrics}
              fingerStats={fingerStats}
              wordErrorMap={wordErrorMap}
              theme={activeTheme}
              onRetry={() => resetLevelSession(false)}
              onNextOrRetry={handleNextOrRetry}
              onBackToDashboard={handleReturnToDashboard}
            />
          )
        )}
      </main>

      {/* Non-Blocking English / সহজ বাংলা Floating Lab Guide */}
      <LabGuideAssistant
        context={viewMode === 'report' ? 'word-express-report' : 'word-express-typing'}
        theme={activeTheme}
      />

      {/* Mandatory Full Screen Gate (Blocks typing whenever Full Screen is exited) */}
      {!isFullscreen && (
        <FullscreenRequiredGate
          labName="Word Express Delivery Lab"
          theme={activeTheme}
          onEnterFullscreen={() => {
            void enterFullscreen();
          }}
          onBackToDashboard={handleReturnToDashboard}
          isMidSession={charsCompleted > 0 || viewMode === 'report'}
        />
      )}

      {/* Pre-Start Hand-Set Visual Guide (Shown once in Full Screen) */}
      {isFullscreen && showHandGuide && viewMode === 'typing' && (
        <HandSetupGuide
          level={levelGuideAdapter}
          theme={activeTheme}
          onStart={() => setShowHandGuide(false)}
          isMidSession={charsCompleted > 0}
        />
      )}

      {/* 25-Stage Curriculum Selector Drawer */}
      {isCurriculumOpen && (
        <div
          className="typing-curriculum-drawer-backdrop"
          onClick={e => {
            if (e.target === e.currentTarget) setIsCurriculumOpen(false);
          }}
        >
          <div className={`typing-curriculum-drawer theme-${activeTheme}`}>
            <div style={{ padding: '18px 22px', borderBottom: `1px solid ${isDark ? '#333842' : '#e4ddd0'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>Word Express Stages (1–25)</h2>
                <span style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                  Current Toughness: <strong style={{ textTransform: 'uppercase' }}>{toughness}</strong> (Saved in Cookie)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCurriculumOpen(false)}
                className="we-icon-btn"
                aria-label="Close stage selector"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {WORD_EXPRESS_STAGES_META.map(stageMeta => {
                const stageLevels = WORD_EXPRESS_LEVELS.filter(
                  l => l.id >= stageMeta.levelRange[0] && l.id <= stageMeta.levelRange[1]
                );
                return (
                  <div key={stageMeta.stage} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: stageMeta.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {stageMeta.title}
                    </div>
                    {stageLevels.map(lvl => {
                      const rec = weProgress.completedLevels[lvl.id];
                      const unlocked = masterActive || lvl.id <= weProgress.maxUnlockedLevel;
                      const crit = getCriteriaForToughness(lvl, toughness);
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          disabled={!unlocked}
                          onClick={() => handleSelectLevel(lvl.id)}
                          className={`we-drawer-level-btn ${lvl.id === currentLevelId ? 'is-current' : ''} ${!unlocked ? 'is-locked' : ''}`}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700 }}>
                              Stage {lvl.id}: {lvl.title}
                            </span>
                            <span style={{ fontSize: '11px', opacity: 0.75 }}>{crit.desc}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {rec?.passed && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '11px', fontWeight: 700 }}>
                                <Star size={12} fill="#f59e0b" /> {rec.stars}
                              </span>
                            )}
                            {unlocked ? <Play size={13} color={stageMeta.color} /> : <Lock size={13} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Master Unlock Modal */}
      {unlockPromptOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}
          onClick={e => {
            if (e.target === e.currentTarget) setUnlockPromptOpen(false);
          }}
        >
          <div style={{ background: isDark ? '#212429' : '#ffffff', border: `1px solid ${isDark ? '#383f4c' : '#ded5c5'}`, borderRadius: '16px', padding: '24px', maxWidth: '380px', width: '100%' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 800 }}>Instructor Master Unlock</h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b' }}>
              Enter passcode (ICST) to unlock all 25 Word Express stages.
            </p>
            <form onSubmit={handleApplyMasterUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="password"
                placeholder="Enter password (ICST)"
                value={masterInput}
                onChange={e => {
                  setMasterInput(e.target.value);
                  setMasterError(null);
                }}
                autoFocus
                style={{ padding: '10px 12px', borderRadius: '8px', border: `1px solid ${masterError ? '#ef4444' : (isDark ? '#414856' : '#d2c8b7')}`, background: isDark ? '#191b1f' : '#f9f6f0', color: isDark ? '#ffffff' : '#1c1915' }}
              />
              {masterError && <span style={{ color: '#ef4444', fontSize: '11px' }}>{masterError}</span>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                <button type="button" onClick={() => setUnlockPromptOpen(false)} className="we-back-btn">Cancel</button>
                <button type="submit" style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#ffffff', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                  Unlock All
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
