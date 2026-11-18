import React, { useState, useEffect, useRef, useMemo } from 'react';
import { animate } from 'animejs';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Flame,
  Sparkles,
  Target,
  Activity,
  Gauge,
  Languages,
  Clock,
  Lightbulb,
  Hand,
  BarChart3
} from 'lucide-react';

import { FingerCode, TypingTheme } from '../../types/touchTyping';
import {
  WordExpressLevel,
  WordExpressResolvedCriteria,
  WordToughness
} from '../../types/wordExpress';
import { CHAR_MAP, FINGER_META } from '../../data/touchTypingGeometry';
import { CARRIER_TIERS, getCarrierByTier } from '../../data/wordExpressData';
import { GuideLang, loadGuideLang, saveGuideLang } from '../../services/labGuideService';
import { SummaryBadgeSlot } from '../typing/SummaryBadgeSlot';
import { DeliveryCarrierSVG } from './DeliveryCarrierSVG';

export interface WordRunMetric {
  word: string;
  durationMs: number;
  wpm: number;
  errors: number;
  carrierTier: number;
  perfect: boolean;
}

export interface WordExpressReportEvaluation {
  passedAll: boolean;
  wpmPassed: boolean;
  accPassed: boolean;
  errPassed: boolean;
  streakPassed: boolean;
  badge1: boolean;
  badge2: boolean;
  badge3: boolean;
  starsCount: number;
}

export interface WordExpressReportViewProps {
  level: WordExpressLevel;
  totalLevels: number;
  toughness: WordToughness;
  criteria: WordExpressResolvedCriteria;
  evaluation: WordExpressReportEvaluation;
  wpm: number;
  accuracy: number;
  elapsedSec: number;
  totalKeystrokes: number;
  errorCount: number;
  currentStreak: number;
  bestStreak: number;
  peakCarrierTier: number;
  expEarned: number;
  avgLatencyMs: number;
  wordMetrics: WordRunMetric[];
  fingerStats: Record<string, { hits: number; total: number }>;
  wordErrorMap: Record<string, number>;
  theme: TypingTheme;
  onRetry: () => void;
  onNextOrRetry: () => void;
  onBackToDashboard: () => void;
}

const FINGER_BN_NAMES: Record<FingerCode, string> = {
  LP: 'বাম কনিষ্ঠা আঙুল (A)',
  LR: 'বাম অনামিকা আঙুল (S)',
  LM: 'বাম মাঝের আঙুল (D)',
  LI: 'বাম তর্জনী আঙুল (F)',
  THUMB: 'বুড়ো আঙুল (Space)',
  RI: 'ডান তর্জনী আঙুল (J)',
  RM: 'ডান মাঝের আঙুল (K)',
  RR: 'ডান অনামিকা আঙুল (L)',
  RP: 'ডান কনিষ্ঠা আঙুল (;)'
};

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

const FINGER_ORDER: FingerCode[] = ['LP', 'LR', 'LM', 'LI', 'RI', 'RM', 'RR', 'RP', 'THUMB'];

function getAccuracyBandColor(pct: number | null): string {
  if (pct === null) return '#64748b';
  if (pct >= 90) return '#10b981';
  if (pct >= 75) return '#38bdf8';
  if (pct >= 55) return '#f59e0b';
  return '#ef4444';
}

export const WordExpressReportView: React.FC<WordExpressReportViewProps> = ({
  level,
  totalLevels,
  toughness,
  criteria,
  evaluation,
  wpm,
  accuracy,
  elapsedSec,
  totalKeystrokes,
  errorCount,
  currentStreak,
  bestStreak,
  peakCarrierTier,
  expEarned,
  avgLatencyMs,
  wordMetrics,
  fingerStats,
  wordErrorMap,
  theme,
  onRetry,
  onNextOrRetry,
  onBackToDashboard
}) => {
  const isDark = theme === 'dark';
  const [lang, setLang] = useState<GuideLang>(() => loadGuideLang());
  const isBn = lang === 'bn';

  // Sync EN / সহজ বাংলা language across the lab
  useEffect(() => {
    const syncLang = (e: Event) => {
      const custom = e as CustomEvent<{ lang?: GuideLang }>;
      setLang(custom.detail?.lang || loadGuideLang());
    };
    window.addEventListener('icst_guide_lang_changed', syncLang);
    return () => window.removeEventListener('icst_guide_lang_changed', syncLang);
  }, []);

  const handleToggleLang = (next: GuideLang) => {
    setLang(next);
    saveGuideLang(next);
  };

  // Interactive selections
  const [selectedWordIdx, setSelectedWordIdx] = useState<number>(() => {
    if (wordMetrics.length === 0) return -1;
    // Default focus on the trickiest word (most errors) or the fastest word
    let worstIdx = 0;
    wordMetrics.forEach((m, i) => {
      if (m.errors > wordMetrics[worstIdx].errors) worstIdx = i;
    });
    return worstIdx;
  });

  const fingerSummaryList = useMemo(() => {
    return FINGER_ORDER.map(code => {
      const st = fingerStats[code];
      const used = Boolean(st && st.total > 0);
      const pct = used ? Math.round((st.hits / st.total) * 100) : null;
      return {
        code,
        meta: FINGER_META[code],
        bnName: FINGER_BN_NAMES[code],
        homeKey: FINGER_HOME_KEY[code],
        hits: st?.hits || 0,
        total: st?.total || 0,
        used,
        pct,
        color: getAccuracyBandColor(pct)
      };
    });
  }, [fingerStats]);

  const usedFingers = useMemo(
    () => fingerSummaryList.filter(f => f.used),
    [fingerSummaryList]
  );

  const weakestFinger = useMemo(() => {
    if (usedFingers.length === 0) return null;
    return [...usedFingers].sort((a, b) => (a.pct ?? 100) - (b.pct ?? 100))[0];
  }, [usedFingers]);

  const strongestFinger = useMemo(() => {
    if (usedFingers.length === 0) return null;
    return [...usedFingers].sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0))[0];
  }, [usedFingers]);

  const [selectedFingerCode, setSelectedFingerCode] = useState<FingerCode | null>(
    () => weakestFinger?.code || usedFingers[0]?.code || 'LI'
  );

  const trickyWordsList = useMemo(
    () =>
      Object.entries(wordErrorMap)
        .sort((a, b) => b[1] - a[1])
        .map(([word, count]) => ({ word, count })),
    [wordErrorMap]
  );

  const [selectedTrickyWord, setSelectedTrickyWord] = useState<string | null>(
    () => trickyWordsList[0]?.word || null
  );

  // Refs for smooth anime.js entrance & gauge animations
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wpmNumRef = useRef<HTMLSpanElement | null>(null);
  const accNumRef = useRef<HTMLSpanElement | null>(null);
  const speedArcRef = useRef<SVGPathElement | null>(null);
  const accRingRef = useRef<SVGCircleElement | null>(null);

  const peakCarrier = getCarrierByTier(peakCarrierTier);
  const maxWordWpm = useMemo(
    () => Math.max(20, ...wordMetrics.map(m => m.wpm), wpm),
    [wordMetrics, wpm]
  );
  const spotlessWordsCount = useMemo(
    () => wordMetrics.filter(m => m.perfect).length,
    [wordMetrics]
  );
  const fastestWord = useMemo(() => {
    if (wordMetrics.length === 0) return null;
    return [...wordMetrics].sort((a, b) => b.wpm - a.wpm)[0];
  }, [wordMetrics]);

  // SVG Gauge Geometry
  const speedGaugeMax = Math.max(criteria.minWpm * 1.8, wpm + 6, 30);
  const speedFillRatio = Math.min(1, Math.max(0.04, wpm / speedGaugeMax));
  const speedTargetRatio = Math.min(0.95, Math.max(0.1, criteria.minWpm / speedGaugeMax));
  const speedArcLen = 176; // half-circle arc path length

  const accRadius = 44;
  const accCircumference = 2 * Math.PI * accRadius;
  const accTargetOffset = accCircumference * (1 - Math.min(100, Math.max(0, accuracy)) / 100);

  // Animate cards, gauges, counters, and bars on mount with anime.js!
  useEffect(() => {
    const anims: Array<{ pause: () => void }> = [];

    if (containerRef.current) {
      const blocks = containerRef.current.querySelectorAll('.wer-anim-block');
      if (blocks.length > 0) {
        anims.push(
          animate(blocks, {
            translateY: [18, 0],
            opacity: [0, 1],
            delay: (_el, i) => (i ?? 0) * 70,
            duration: 420,
            ease: 'outCubic'
          })
        );
      }

      const wordBars = containerRef.current.querySelectorAll('.wer-word-bar-fill');
      if (wordBars.length > 0) {
        anims.push(
          animate(wordBars, {
            scaleY: [0, 1],
            delay: (_el, i) => 180 + (i ?? 0) * 28,
            duration: 460,
            ease: 'outBack'
          })
        );
      }
    }

    // Animated WPM count-up
    const wpmObj = { val: 0 };
    anims.push(
      animate(wpmObj, {
        val: wpm,
        duration: 720,
        ease: 'outCubic',
        onUpdate: () => {
          if (wpmNumRef.current) wpmNumRef.current.textContent = String(Math.round(wpmObj.val));
        }
      })
    );

    // Animated Accuracy count-up
    const accObj = { val: 0 };
    anims.push(
      animate(accObj, {
        val: accuracy,
        duration: 760,
        ease: 'outCubic',
        onUpdate: () => {
          if (accNumRef.current) accNumRef.current.textContent = `${Math.round(accObj.val)}%`;
        }
      })
    );

    // Speedometer arc stroke animation
    if (speedArcRef.current) {
      anims.push(
        animate(speedArcRef.current, {
          strokeDashoffset: [speedArcLen, speedArcLen * (1 - speedFillRatio)],
          duration: 850,
          ease: 'outCubic'
        })
      );
    }

    // Accuracy donut ring stroke animation
    if (accRingRef.current) {
      anims.push(
        animate(accRingRef.current, {
          strokeDashoffset: [accCircumference, accTargetOffset],
          duration: 900,
          ease: 'outCubic'
        })
      );
    }

    return () => {
      anims.forEach(a => a.pause());
    };
  }, [wpm, accuracy, speedFillRatio, accCircumference, accTargetOffset]);

  // Helper: selected finger info
  const activeFingerDetail =
    fingerSummaryList.find(f => f.code === selectedFingerCode) || weakestFinger || fingerSummaryList[0];

  // Helper: selected word metric
  const activeWordMetric =
    selectedWordIdx >= 0 && selectedWordIdx < wordMetrics.length ? wordMetrics[selectedWordIdx] : null;

  // Smart plain-language coaching advice (EN + সহজ বাংলা)
  const coachTips = useMemo(() => {
    const tips: Array<{ icon: string; en: string; bn: string }> = [];

    if (weakestFinger && (weakestFinger.pct ?? 100) < 88) {
      tips.push({
        icon: '🖐️',
        en: `Focus on ${weakestFinger.meta.name} (${weakestFinger.pct}%): keep it resting gently over "${weakestFinger.homeKey}" before reaching.`,
        bn: `${weakestFinger.bnName}-এ একটু মন দিন (${weakestFinger.pct}%): চাপার আগে আঙুলটি "${weakestFinger.homeKey}" কী-এর ওপর হালকা করে রাখুন।`
      });
    } else if (strongestFinger) {
      tips.push({
        icon: '🌟',
        en: `Great finger control! ${strongestFinger.meta.name} hit ${strongestFinger.pct}% accuracy cleanly.`,
        bn: `দারুণ আঙুলের নিয়ন্ত্রণ! ${strongestFinger.bnName} ${strongestFinger.pct}% সঠিক হয়েছে।`
      });
    }

    if (!evaluation.wpmPassed) {
      const gap = Math.max(1, criteria.minWpm - wpm);
      tips.push({
        icon: '⚡',
        en: `You only need +${gap} more WPM to pass! Keep a steady rhythm instead of stopping between words.`,
        bn: `পাশ করতে আর মাত্র +${gap} WPM দরকার! শব্দের মাঝে না থেমে একটানা তালে টাইপ করুন।`
      });
    } else if (!evaluation.accPassed) {
      const gap = Math.max(1, criteria.minAcc - accuracy);
      tips.push({
        icon: '🎯',
        en: `Slow down slightly to raise accuracy by +${gap}% — fewer mistakes also keep your delivery vehicle higher!`,
        bn: `একটু ধীরে টাইপ করে সঠিকতা +${gap}% বাড়ান — ভুল কম হলে আপনার গাড়িও বড় হতে থাকবে!`
      });
    } else {
      tips.push({
        icon: '🚀',
        en: `Nice flow! Your streak (${currentStreak}) will carry directly into Stage ${Math.min(totalLevels, level.id + 1)}!`,
        bn: `চমৎকার গতি! আপনার বর্তমান স্ট্রিক (${currentStreak}) সরাসরি পরের স্টেজে নিয়ে যেতে পারবেন!`
      });
    }

    if (trickyWordsList.length > 0) {
      const top = trickyWordsList[0];
      tips.push({
        icon: '🔤',
        en: `"${top.word}" had ${top.count} slip${top.count > 1 ? 's' : ''}. Tap it on the right to see the exact finger sequence.`,
        bn: `"${top.word}" শব্দে ${top.count} বার ভুল হয়েছে। ডানদিকে শব্দটিতে ক্লিক করে কোন আঙুলে কোন অক্ষর চাপবেন দেখে নিন।`
      });
    }

    return tips;
  }, [weakestFinger, strongestFinger, evaluation, criteria, wpm, accuracy, currentStreak, totalLevels, level.id, trickyWordsList]);

  const correctHitsTotal = Math.max(0, totalKeystrokes - errorCount);
  const canAdvance = evaluation.passedAll && level.id < totalLevels;

  // Target marker angle on speedometer (-180deg left to 0deg right)
  const targetAngleRad = Math.PI * (1 - speedTargetRatio);
  const targetMarkerX = 70 + 56 * Math.cos(targetAngleRad);
  const targetMarkerY = 66 - 56 * Math.sin(targetAngleRad);

  const getFingerColorByCode = (code: FingerCode) => {
    const f = fingerSummaryList.find(item => item.code === code);
    if (!f || !f.used) return isDark ? '#2b313d' : '#e5ddd0';
    return f.color;
  };

  const getFingerPctLabel = (code: FingerCode) => {
    const f = fingerSummaryList.find(item => item.code === code);
    if (!f || !f.used || f.pct === null) return '—';
    return `${f.pct}%`;
  };

  return (
    <div ref={containerRef} className={`wer-shell ${isDark ? 'is-dark' : 'is-light'}`}>
      {/* ================================================================= */}
      {/* 1. HERO HEADER & INLINE LANGUAGE SWITCHER                         */}
      {/* ================================================================= */}
      <div className="wer-header-row wer-anim-block">
        <div className="wer-header-left">
          <div className={`wer-status-icon ${evaluation.passedAll ? 'is-pass' : 'is-retry'}`}>
            {evaluation.passedAll ? <Trophy size={22} /> : <RotateCcw size={22} />}
          </div>
          <div>
            <div className="wer-eyebrow">
              <span>
                {isBn ? `স্টেজ ${level.id} / ${totalLevels}` : `Stage ${level.id} of ${totalLevels}`} • {level.title}
              </span>
              <span className={`wer-tough-chip ${toughness}`}>
                {toughness.toUpperCase()}
              </span>
              {expEarned > 0 && (
                <span className="wer-exp-chip">
                  <Sparkles size={11} /> +{expEarned} EXP
                </span>
              )}
            </div>
            <h1 className="wer-headline">
              {evaluation.passedAll
                ? evaluation.starsCount === 3
                  ? isBn
                    ? 'অসাধারণ! সবগুলো গোল্ডেন মেডেল জিতেছেন!'
                    : 'Express Mastery! All 3 Golden Awards Earned!'
                  : isBn
                  ? 'দারুণ হয়েছে! স্টেজ পাশ করেছেন!'
                  : 'Delivery Complete! Stage Passed!'
                : isBn
                ? 'প্রায় হয়ে গেছে! আরেকবার চেষ্টা করুন।'
                : 'Almost There! Let’s Try One More Run.'}
            </h1>
          </div>
        </div>

        {/* Inline Simple English / সহজ বাংলা Toggle */}
        <div className="wer-header-right">
          <div className="wer-meta-time">
            <Clock size={13} />
            <span>{elapsedSec.toFixed(1)}s</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span>{avgLatencyMs > 0 ? `${avgLatencyMs}ms/key` : `${wordMetrics.length} words`}</span>
          </div>

          <div className="wer-lang-toggle" role="group" aria-label="Report Language">
            <Languages size={13} />
            <button
              type="button"
              className={`wer-lang-btn ${!isBn ? 'active' : ''}`}
              onClick={() => handleToggleLang('en')}
            >
              English
            </button>
            <button
              type="button"
              className={`wer-lang-btn ${isBn ? 'active' : ''}`}
              onClick={() => handleToggleLang('bn')}
            >
              সহজ বাংলা
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. TOP VISUAL GRAPHICS ROW (SPEED GAUGE, ACC DONUT, FLEET, MEDALS)*/}
      {/* ================================================================= */}
      <div className="wer-hero-grid wer-anim-block">
        {/* Graphic 1: Animated Speedometer Arc Gauge */}
        <div className="wer-visual-card">
          <div className="wer-card-kicker">
            <Gauge size={13} color="#38bdf8" />
            <span>{isBn ? 'টাইপিং গতি (WPM)' : 'Typing Speed'}</span>
          </div>

          <div className="wer-gauge-wrap">
            <svg viewBox="0 0 140 82" className="wer-speed-svg" aria-hidden="true">
              {/* Background Track Arc */}
              <path
                d="M 14 66 A 56 56 0 0 1 126 66"
                fill="none"
                stroke={isDark ? '#2e3440' : '#e5ded0'}
                strokeWidth="11"
                strokeLinecap="round"
              />
              {/* Animated Value Arc */}
              <path
                ref={speedArcRef}
                d="M 14 66 A 56 56 0 0 1 126 66"
                fill="none"
                stroke={evaluation.wpmPassed ? '#0ea5e9' : '#f59e0b'}
                strokeWidth="11"
                strokeLinecap="round"
                strokeDasharray={speedArcLen}
                strokeDashoffset={speedArcLen}
              />
              {/* Target Marker Dot */}
              <circle
                cx={targetMarkerX}
                cy={targetMarkerY}
                r="4.2"
                fill="#ffffff"
                stroke={evaluation.wpmPassed ? '#10b981' : '#ef4444'}
                strokeWidth="2.2"
              />
            </svg>
            <div className="wer-speed-center-num">
              <span ref={wpmNumRef} className="wer-big-num">{wpm}</span>
              <span className="wer-big-unit">WPM</span>
            </div>
          </div>

          <div className={`wer-verdict-pill ${evaluation.wpmPassed ? 'pass' : 'warn'}`}>
            {evaluation.wpmPassed
              ? isBn
                ? `✓ লক্ষ্যের ওপরে (লক্ষ্য ${criteria.minWpm})`
                : `✓ Beat target (${criteria.minWpm} WPM)`
              : isBn
              ? `লক্ষ্য: ${criteria.minWpm} WPM`
              : `Goal: ${criteria.minWpm} WPM`}
          </div>
        </div>

        {/* Graphic 2: Animated Accuracy Donut Ring */}
        <div className="wer-visual-card">
          <div className="wer-card-kicker">
            <Target size={13} color="#10b981" />
            <span>{isBn ? 'নির্ভুলতা (Accuracy)' : 'Accuracy Ring'}</span>
          </div>

          <div className="wer-donut-wrap">
            <svg viewBox="0 0 108 108" className="wer-donut-svg" aria-hidden="true">
              <circle
                cx="54"
                cy="54"
                r={accRadius}
                fill="none"
                stroke={isDark ? 'rgba(239,68,68,0.22)' : 'rgba(239,68,68,0.16)'}
                strokeWidth="10"
              />
              <circle
                ref={accRingRef}
                cx="54"
                cy="54"
                r={accRadius}
                fill="none"
                stroke={accuracy >= criteria.minAcc ? '#10b981' : '#f59e0b'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={accCircumference}
                strokeDashoffset={accCircumference}
                transform="rotate(-90 54 54)"
              />
            </svg>
            <div className="wer-donut-center">
              <span ref={accNumRef} className="wer-donut-val">{accuracy}%</span>
            </div>
          </div>

          <div className="wer-mini-breakdown">
            <span style={{ color: '#10b981' }}>
              {correctHitsTotal} {isBn ? 'ঠিক' : 'right'}
            </span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span style={{ color: errorCount > 0 ? '#ef4444' : '#10b981' }}>
              {errorCount} {isBn ? 'ভুল' : 'errors'}
            </span>
          </div>
        </div>

        {/* Graphic 3: Peak Delivery Courier + 16-Tier Fleet Ladder */}
        <div className="wer-visual-card wer-fleet-card" style={{ borderColor: peakCarrier.accent }}>
          <div className="wer-card-kicker">
            <Flame size={13} color={peakCarrier.accent} />
            <span>{isBn ? `সর্বোচ্চ গাড়ি (T${peakCarrier.tier}/16)` : `Peak Courier (T${peakCarrier.tier}/16)`}</span>
          </div>

          <div className="wer-peak-carrier-stage">
            <div className="wer-carrier-float">
              <DeliveryCarrierSVG carrierId={peakCarrier.id} accent={peakCarrier.accent} size={82} boosted />
            </div>
            <div className="wer-peak-carrier-name" style={{ color: peakCarrier.accent }}>
              {peakCarrier.name}
            </div>
            <div className="wer-peak-streak-sub">
              {isBn ? `সেরা স্ট্রিক: ${bestStreak}` : `Best Streak: ${bestStreak}`}
            </div>
          </div>

          {/* 16-Tier Mini Ladder Dots */}
          <div className="wer-fleet-ladder" title={isBn ? '১৬ ধাপের গাড়ির উন্নতি' : '16-tier vehicle progression'}>
            {CARRIER_TIERS.map(t => {
              const reached = t.tier <= peakCarrierTier;
              return (
                <span
                  key={t.id}
                  className={`wer-ladder-dot ${reached ? 'reached' : ''} ${t.tier === peakCarrierTier ? 'peak' : ''}`}
                  style={{ background: reached ? t.accent : undefined }}
                  title={`T${t.tier}: ${t.name} (${t.minStreak}+ streak)`}
                />
              );
            })}
          </div>
        </div>

        {/* Graphic 4: 3 Golden Awards Showcase */}
        <div className="wer-visual-card wer-awards-card">
          <div className="wer-card-kicker">
            <Sparkles size={13} color="#f59e0b" />
            <span>{isBn ? 'গোল্ডেন অ্যাওয়ার্ডস' : 'Stage Awards'}</span>
          </div>

          <div className="wer-medals-row">
            <SummaryBadgeSlot
              earned={evaluation.badge1}
              size="md"
              theme={theme}
              label={isBn ? 'পাশ' : 'Delivered'}
              subLabel={isBn ? 'স্টেজ সম্পন্ন' : 'Stage Pass'}
              tooltip={isBn ? 'সব শর্ত পূরণ করলে এই মেডেল পাবেন' : 'Meet all stage passing targets'}
            />
            <SummaryBadgeSlot
              earned={evaluation.badge2}
              size="md"
              theme={theme}
              label={isBn ? 'নির্ভুল' : 'Precision'}
              subLabel={`${Math.min(97, criteria.minAcc + 3)}%+`}
              tooltip={isBn ? `কমপক্ষে ${Math.min(97, criteria.minAcc + 3)}% নির্ভুলতা` : `Reach ${Math.min(97, criteria.minAcc + 3)}%+ accuracy`}
            />
            <SummaryBadgeSlot
              earned={evaluation.badge3}
              size="md"
              theme={theme}
              label={isBn ? 'দ্রুত' : 'Velocity'}
              subLabel={`${criteria.minWpm + 5}+ WPM`}
              tooltip={isBn ? `কমপক্ষে ${criteria.minWpm + 5} WPM গতি` : `Reach ${criteria.minWpm + 5}+ WPM speed`}
            />
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. CRITERIA GOAL METERS (SUPER EASY PASS / TARGET CHECKLIST)      */}
      {/* ================================================================= */}
      <div className="wer-criteria-grid wer-anim-block">
        {[
          {
            label: isBn ? 'সর্বনিম্ন গতি' : 'Min Speed',
            valueText: `${wpm} / ${criteria.minWpm} WPM`,
            passed: evaluation.wpmPassed,
            pct: Math.min(100, Math.round((wpm / Math.max(1, criteria.minWpm)) * 100))
          },
          {
            label: isBn ? 'সর্বনিম্ন নির্ভুলতা' : 'Min Accuracy',
            valueText: `${accuracy}% / ${criteria.minAcc}%`,
            passed: evaluation.accPassed,
            pct: Math.min(100, Math.round((accuracy / Math.max(1, criteria.minAcc)) * 100))
          },
          {
            label: isBn ? 'ভুলের সীমা' : 'Error Control',
            valueText:
              criteria.maxErrors !== null
                ? `${errorCount} / Max ${criteria.maxErrors}`
                : isBn
                ? `${errorCount} ভুল (সীমা নেই)`
                : `${errorCount} Errors (No Limit)`,
            passed: evaluation.errPassed,
            pct:
              criteria.maxErrors !== null
                ? Math.max(10, Math.min(100, Math.round(((criteria.maxErrors - Math.min(errorCount, criteria.maxErrors)) / Math.max(1, criteria.maxErrors)) * 100)))
                : 100
          },
          {
            label: isBn ? 'সেরা স্ট্রিক' : 'Best Streak',
            valueText:
              criteria.minStreak !== null
                ? `${bestStreak} / ${criteria.minStreak}`
                : isBn
                ? `${bestStreak} সেরা`
                : `${bestStreak} Best`,
            passed: evaluation.streakPassed,
            pct:
              criteria.minStreak !== null
                ? Math.min(100, Math.round((bestStreak / Math.max(1, criteria.minStreak)) * 100))
                : 100
          }
        ].map((item, idx) => (
          <div key={idx} className={`wer-goal-card ${item.passed ? 'pass' : 'fail'}`}>
            <div className="wer-goal-top">
              <span className="wer-goal-lbl">{item.label}</span>
              {item.passed ? (
                <CheckCircle2 size={16} color="#10b981" />
              ) : (
                <XCircle size={16} color="#ef4444" />
              )}
            </div>
            <div className="wer-goal-val">{item.valueText}</div>
            <div className="wer-goal-bar-track">
              <div
                className="wer-goal-bar-fill"
                style={{
                  width: `${item.pct}%`,
                  background: item.passed ? '#10b981' : '#ef4444'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ================================================================= */}
      {/* 4. TWO RICH INTERACTIVE VISUAL ANALYTICS CHARTS                   */}
      {/* ================================================================= */}
      <div className="wer-analytics-split wer-anim-block">
        {/* LEFT CHART: Interactive Word-by-Word Speed & Accuracy Timeline */}
        <section className="wer-panel">
          <div className="wer-panel-head">
            <div>
              <h3 className="wer-panel-title">
                <BarChart3 size={15} color="#38bdf8" />
                <span>{isBn ? 'শব্দ অনুযায়ী গতি ও নির্ভুলতা' : 'Word-by-Word Speed & Precision'}</span>
              </h3>
              <p className="wer-panel-sub">
                {isBn
                  ? 'যেকোনো বারে ক্লিক করুন: সবুজ = একদম ঠিক, কমলা = ১ ভুল, লাল = ২+ ভুল'
                  : 'Click or hover any word bar: green = spotless, amber = 1 slip, red = 2+ slips'}
              </p>
            </div>
            <div className="wer-quick-pills">
              <span className="wer-mini-pill green">
                {spotlessWordsCount}/{wordMetrics.length} {isBn ? 'নির্ভুল' : 'spotless'}
              </span>
              {fastestWord && (
                <span className="wer-mini-pill blue">
                  ⚡ "{fastestWord.word}" {fastestWord.wpm} WPM
                </span>
              )}
            </div>
          </div>

          <div className="wer-word-chart" role="list" aria-label="Word speed bar chart">
            {wordMetrics.map((m, idx) => {
              const heightPct = Math.max(18, Math.min(100, Math.round((m.wpm / maxWordWpm) * 100)));
              const barColor = m.errors === 0 ? '#10b981' : m.errors === 1 ? '#f59e0b' : '#ef4444';
              const isSelected = idx === selectedWordIdx;
              return (
                <button
                  key={`${m.word}-${idx}`}
                  type="button"
                  role="listitem"
                  className={`wer-word-bar-col ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setSelectedWordIdx(idx)}
                  onMouseEnter={() => setSelectedWordIdx(idx)}
                  title={`"${m.word}" — ${m.wpm} WPM, ${m.errors} errors`}
                >
                  <span className="wer-word-bar-wpm">{m.wpm}</span>
                  <div className="wer-word-bar-track">
                    <div
                      className="wer-word-bar-fill"
                      style={{ height: `${heightPct}%`, background: barColor }}
                    />
                  </div>
                  <span className="wer-word-bar-lbl">{m.word}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Word Inspector Footer */}
          {activeWordMetric && (
            <div className="wer-inspector-strip">
              <div className="wer-inspector-main">
                <span className="wer-inspector-word">"{activeWordMetric.word}"</span>
                <span className="wer-inspector-stat">
                  <strong>{activeWordMetric.wpm} WPM</strong> • {(activeWordMetric.durationMs / 1000).toFixed(2)}s
                </span>
                <span
                  className={`wer-inspector-err ${activeWordMetric.errors === 0 ? 'clean' : 'err'}`}
                >
                  {activeWordMetric.errors === 0
                    ? isBn
                      ? '✓ কোনো ভুল নেই'
                      : '✓ Zero errors'
                    : isBn
                    ? `${activeWordMetric.errors} বার ভুল`
                    : `${activeWordMetric.errors} mistake${activeWordMetric.errors > 1 ? 's' : ''}`}
                </span>
                <span className="wer-inspector-carrier">
                  {getCarrierByTier(activeWordMetric.carrierTier).name}
                </span>
              </div>

              {/* Letter-by-letter finger hint for inspected word */}
              <div className="wer-letter-finger-row">
                {activeWordMetric.word.split('').map((ch, i) => {
                  const meta = CHAR_MAP[ch];
                  const fColor = meta ? FINGER_META[meta.finger]?.color || '#38bdf8' : '#94a3b8';
                  const fShort = meta ? FINGER_META[meta.finger]?.short : '';
                  return (
                    <span key={i} className="wer-letter-chip" style={{ borderBottomColor: fColor }} title={fShort}>
                      <strong>{ch}</strong>
                      <small style={{ color: fColor }}>{fShort}</small>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* RIGHT CHART: Interactive Dual-Hand Finger Accuracy Heatmap */}
        <section className="wer-panel">
          <div className="wer-panel-head">
            <div>
              <h3 className="wer-panel-title">
                <Hand size={15} color="#10b981" />
                <span>{isBn ? 'আঙুলের নিখুঁততা (ইন্টারেক্টিভ হ্যান্ড ম্যাপ)' : 'Interactive Finger Accuracy Heatmap'}</span>
              </h3>
              <p className="wer-panel-sub">
                {isBn
                  ? 'যেকোনো আঙুলে ক্লিক করে তার সঠিকতা আর সহজ টিপস দেখুন'
                  : 'Click or hover any finger to inspect accuracy & home-row anchor'}
              </p>
            </div>
            <div className="wer-heat-legend">
              <span className="wer-leg-dot" style={{ background: '#10b981' }} /> 90%+
              <span className="wer-leg-dot" style={{ background: '#38bdf8' }} /> 75%+
              <span className="wer-leg-dot" style={{ background: '#f59e0b' }} /> 55%+
              <span className="wer-leg-dot" style={{ background: '#ef4444' }} /> &lt;55%
            </div>
          </div>

          {/* Interactive SVG Hands Heatmap */}
          <div className="wer-hand-heatmap-wrap">
            <svg viewBox="0 0 540 165" className="wer-hand-heatmap-svg" role="img" aria-label="Interactive 10-finger accuracy heatmap">
              {/* Left Palm */}
              <path
                d="M 55 162 L 46 116 C 44 100, 54 88, 72 84 L 188 86 C 206 94, 214 108, 208 130 L 200 162 Z"
                fill={isDark ? '#212630' : '#ece3d4'}
                stroke={isDark ? '#3b4252' : '#c6baa6'}
                strokeWidth="1.5"
              />
              {/* Right Palm */}
              <path
                d="M 485 162 L 494 116 C 496 100, 486 88, 468 84 L 352 86 C 334 94, 326 108, 332 130 L 340 162 Z"
                fill={isDark ? '#212630' : '#ece3d4'}
                stroke={isDark ? '#3b4252' : '#c6baa6'}
                strokeWidth="1.5"
              />

              {/* Interactive Fingers */}
              {[
                { code: 'LP' as FingerCode, x: 42, y: 36, w: 26, h: 62 },
                { code: 'LR' as FingerCode, x: 80, y: 16, w: 28, h: 78 },
                { code: 'LM' as FingerCode, x: 120, y: 8, w: 28, h: 86 },
                { code: 'LI' as FingerCode, x: 160, y: 20, w: 28, h: 76 },
                { code: 'RI' as FingerCode, x: 352, y: 20, w: 28, h: 76 },
                { code: 'RM' as FingerCode, x: 392, y: 8, w: 28, h: 86 },
                { code: 'RR' as FingerCode, x: 432, y: 16, w: 28, h: 78 },
                { code: 'RP' as FingerCode, x: 472, y: 36, w: 26, h: 62 }
              ].map(f => {
                const fill = getFingerColorByCode(f.code);
                const isSel = selectedFingerCode === f.code;
                const pctLbl = getFingerPctLabel(f.code);
                return (
                  <g
                    key={f.code}
                    className="wer-svg-finger"
                    onClick={() => setSelectedFingerCode(f.code)}
                    onMouseEnter={() => setSelectedFingerCode(f.code)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      x={f.x}
                      y={f.y}
                      width={f.w}
                      height={f.h}
                      rx={f.w / 2}
                      fill={fill}
                      stroke={isSel ? '#ffffff' : isDark ? '#191b1f' : '#ffffff'}
                      strokeWidth={isSel ? 2.6 : 1.4}
                      opacity={pctLbl === '—' ? 0.5 : 0.95}
                    />
                    <text
                      x={f.x + f.w / 2}
                      y={f.y + 18}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="800"
                      fill="#0f172a"
                    >
                      {FINGER_HOME_KEY[f.code]}
                    </text>
                    <text
                      x={f.x + f.w / 2}
                      y={f.y + f.h - 10}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight="800"
                      fill={pctLbl === '—' ? (isDark ? '#94a3b8' : '#475569') : '#0f172a'}
                    >
                      {pctLbl}
                    </text>
                  </g>
                );
              })}

              {/* Center Hand Labels */}
              <text x="125" y="138" textAnchor="middle" fontSize="10" fontWeight="800" fill={isDark ? '#94a3b8' : '#64748b'}>
                {isBn ? 'বাম হাত' : 'LEFT HAND'}
              </text>
              <text x="415" y="138" textAnchor="middle" fontSize="10" fontWeight="800" fill={isDark ? '#94a3b8' : '#64748b'}>
                {isBn ? 'ডান হাত' : 'RIGHT HAND'}
              </text>
            </svg>
          </div>

          {/* Interactive Finger Inspector Detail Bar */}
          {activeFingerDetail && (
            <div className="wer-finger-inspector" style={{ borderLeftColor: activeFingerDetail.color }}>
              <div className="wer-finger-insp-top">
                <strong>
                  {isBn ? activeFingerDetail.bnName : `${activeFingerDetail.meta.name} (Home: ${activeFingerDetail.homeKey})`}
                </strong>
                <span className="wer-finger-insp-pct" style={{ color: activeFingerDetail.color }}>
                  {activeFingerDetail.used
                    ? `${activeFingerDetail.pct}% (${activeFingerDetail.hits}/${activeFingerDetail.total})`
                    : isBn
                    ? 'এই স্টেজে ব্যবহৃত হয়নি'
                    : 'Not used in this stage'}
                </span>
              </div>
              <div className="wer-finger-insp-bar">
                <div
                  style={{
                    width: `${activeFingerDetail.pct ?? 0}%`,
                    background: activeFingerDetail.color
                  }}
                />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ================================================================= */}
      {/* 5. SMART COACH & INTERACTIVE TRICKY WORDS LAB                     */}
      {/* ================================================================= */}
      <div className="wer-coach-grid wer-anim-block">
        {/* Personal Coach Recommendations */}
        <section className="wer-panel">
          <h3 className="wer-panel-title" style={{ marginBottom: '10px' }}>
            <Lightbulb size={15} color="#f59e0b" />
            <span>{isBn ? 'আপনার জন্য সহজ পরামর্শ (কোচ টিপস)' : 'Smart Personal Coach Tips'}</span>
          </h3>
          <div className="wer-coach-list">
            {coachTips.map((tip, idx) => (
              <div key={idx} className="wer-coach-item">
                <span className="wer-coach-ico">{tip.icon}</span>
                <span>{isBn ? tip.bn : tip.en}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tricky Words Interactive Finger Breakdown */}
        <section className="wer-panel">
          <h3 className="wer-panel-title" style={{ marginBottom: '10px' }}>
            <Activity size={15} color="#ef4444" />
            <span>{isBn ? 'যে শব্দগুলোতে একটু ভুল হয়েছে' : 'Tricky Words Practice Breakdown'}</span>
          </h3>

          {trickyWordsList.length === 0 ? (
            <div className="wer-flawless-box">
              <CheckCircle2 size={18} color="#10b981" />
              <span>
                {isBn
                  ? `দারুণ! সবগুলো ${wordMetrics.length}টি শব্দই কোনো ভুল ছাড়া শেষ করেছেন!`
                  : `Flawless delivery! Zero typos across all ${wordMetrics.length} words!`}
              </span>
            </div>
          ) : (
            <>
              <div className="wer-tricky-chips">
                {trickyWordsList.map(item => (
                  <button
                    key={item.word}
                    type="button"
                    className={`wer-tricky-chip ${selectedTrickyWord === item.word ? 'active' : ''}`}
                    onClick={() => setSelectedTrickyWord(item.word)}
                  >
                    <span>"{item.word}"</span>
                    <small>{item.count}x</small>
                  </button>
                ))}
              </div>

              {selectedTrickyWord && (
                <div className="wer-tricky-guide-box">
                  <div className="wer-tricky-guide-lbl">
                    {isBn
                      ? `"${selectedTrickyWord}" টাইপ করার সঠিক আঙুল:`
                      : `Exact finger sequence for "${selectedTrickyWord}":`}
                  </div>
                  <div className="wer-letter-finger-row">
                    {selectedTrickyWord.split('').map((ch, idx) => {
                      const meta = CHAR_MAP[ch];
                      const color = meta ? FINGER_META[meta.finger]?.color || '#38bdf8' : '#94a3b8';
                      const short = meta ? FINGER_META[meta.finger]?.short : '';
                      return (
                        <span key={idx} className="wer-letter-chip" style={{ borderBottomColor: color }}>
                          <strong>{ch}</strong>
                          <small style={{ color }}>{short}</small>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* ================================================================= */}
      {/* 6. PROMINENT ACTION FOOTER                                        */}
      {/* ================================================================= */}
      <div className="wer-footer-bar wer-anim-block">
        <div className="wer-footer-left">
          <button type="button" className="we-back-btn" onClick={onBackToDashboard}>
            <ArrowLeft size={14} />
            <span>{isBn ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
          </button>

          <button type="button" className="wer-retry-btn" onClick={onRetry}>
            <RotateCcw size={14} />
            <span>{isBn ? 'আবার চেষ্টা করুন (R)' : 'Retry Stage (R)'}</span>
          </button>
        </div>

        <div className="wer-footer-right">
          {canAdvance && currentStreak > 0 && (
            <span className="wer-carry-streak-badge">
              <Flame size={13} color="#f59e0b" />
              <span>
                {isBn
                  ? `স্ট্রিক চলবে: ${currentStreak}`
                  : `Streak Continues: ${currentStreak}`}
              </span>
            </span>
          )}

          <button type="button" className="wer-next-btn" onClick={onNextOrRetry}>
            <span>
              {canAdvance
                ? isBn
                  ? `পরের স্টেজ ${level.id + 1}-এ যান`
                  : `Next Stage (${level.id + 1})`
                : isBn
                ? 'আবার চেষ্টা করুন'
                : 'Try Again'}
            </span>
            <kbd>Enter</kbd>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
