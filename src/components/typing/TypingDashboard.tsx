import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Lock,
  Unlock,
  Zap,
  BookOpen,
  Sun,
  Moon,
  Sparkles,
  Maximize2,
  Minimize2,
  ArrowRight,
  Keyboard,
  Target,
  Star,
  TrendingUp
} from 'lucide-react';
import { animate, createScope, stagger, spring } from 'animejs';
import { SummaryBadgeSlot } from './SummaryBadgeSlot';
import { TypingCurriculumModal } from './TypingCurriculumModal';
import { LabGuideAssistant } from '../common/LabGuideAssistant';
import { PhysicalKeyboardNotice } from '../common/PhysicalKeyboardNotice';
import { useIsMobileOrTablet } from '../../utils/mobileKeyboardDetect';
import { STAGES_META, LEVELS } from './typingData';
import { TypingTheme } from '../../types/typing';
import { TouchTypingProgress } from '../../types/touchTyping';
import {
  isMasterUnlocked,
  verifyAndApplyMasterPassword,
  lockToStudentProgression
} from '../../services/masterUnlockService';
import { useFullscreen, requestDocumentFullscreen } from '../../utils/useFullscreen';
import '../common/moduleDashboard.css';
import './touchTyping.css';

export interface TypingDashboardProps {
  progress: TouchTypingProgress;
  onLaunchLevel: (levelId: number) => void;
  onOpenCurriculum: () => void;
  onToggleMasterUnlock?: () => void;
  theme: TypingTheme;
  onToggleTheme: () => void;
  onBackToMainHub?: () => void;
  className?: string;
}

type StageFilter = 'all' | 'learning' | 'challenge';
const HOME_ROW_KEYS = ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'];

export const TypingDashboard: React.FC<TypingDashboardProps> = ({
  progress,
  onLaunchLevel,
  onOpenCurriculum,
  onToggleMasterUnlock,
  theme,
  onToggleTheme,
  onBackToMainHub,
  className = ''
}) => {
  const isDark = theme === 'dark';
  const isMobileOrTablet = useIsMobileOrTablet();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stagesGridRef = useRef<HTMLDivElement | null>(null);
  const wpmRef = useRef<HTMLSpanElement | null>(null);

  const { isFullscreen, isPseudoFullscreen, toggleFullscreen } = useFullscreen(rootRef);
  const [unlockPasswordPrompt, setUnlockPasswordPrompt] = useState(false);
  const [curriculumDrawerOpen, setCurriculumDrawerOpen] = useState(false);
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [masterActive, setMasterActive] = useState<boolean>(() => isMasterUnlocked());
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [litKeyIdx, setLitKeyIdx] = useState(0);

  useEffect(() => {
    const handleUnlockChange = (e: Event) => {
      const custom = e as CustomEvent<{ unlocked?: boolean }>;
      setMasterActive(Boolean(custom.detail?.unlocked ?? isMasterUnlocked()));
    };
    window.addEventListener('icst_master_unlock_changed', handleUnlockChange);
    return () => window.removeEventListener('icst_master_unlock_changed', handleUnlockChange);
  }, []);

  const records = progress.completedLevels || {};
  const completedLevelsCount = Object.values(records).filter(r => r.passed).length;
  const totalStars = Object.values(records).reduce((sum, r) => sum + (r.stars || 0), 0);
  const completionPct = Math.round((completedLevelsCount / 25) * 100);

  let bestWpm = progress.bestWpm || 0;
  let totalAccSum = 0;
  let accCount = 0;
  Object.values(records).forEach(r => {
    if (r.bestWpm > bestWpm) bestWpm = r.bestWpm;
    if (r.bestAccuracy > 0) {
      totalAccSum += r.bestAccuracy;
      accCount++;
    }
  });
  const avgAccuracy = accCount > 0 ? Math.round(totalAccSum / accCount) : (progress.averageAccuracy || 100);

  const currentLevelId = progress.currentLevel || 1;
  const currentLevelData = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];
  const ringCirc = 2 * Math.PI * 31;

  // Interactive Home-Row keycap spring pulse
  const triggerHomeKey = useCallback((idx: number) => {
    setLitKeyIdx((idx + 1) % HOME_ROW_KEYS.length);
    const btn = rootRef.current?.querySelector(`[data-home-key="${idx}"]`);
    if (btn) {
      animate(btn, {
        scale: [1, 0.82, 1.15, 1],
        duration: 300,
        ease: spring({ stiffness: 400, damping: 15 })
      });
    }
  }, []);

  // Listen to physical home-row keypresses right on the dashboard (when no modal/input is open)
  useEffect(() => {
    if (unlockPasswordPrompt || curriculumDrawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const idx = HOME_ROW_KEYS.indexOf(e.key.toUpperCase());
      if (idx >= 0) triggerHomeKey(idx);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [unlockPasswordPrompt, curriculumDrawerOpen, triggerHomeKey]);

  // Master anime.js v4 choreography
  useEffect(() => {
    if (!rootRef.current) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const scope = createScope({ root: rootRef.current }).add(() => {
      if (reduced) {
        if (wpmRef.current) wpmRef.current.textContent = String(bestWpm);
        rootRef.current?.querySelectorAll<HTMLElement>('[data-target-width]').forEach(el => {
          el.style.width = `${el.dataset.targetWidth}%`;
        });
        return;
      }

      animate('.tp-reveal', {
        translateY: [22, 0],
        opacity: [0, 1],
        duration: 620,
        delay: stagger(65),
        ease: 'outExpo'
      });

      animate('.md-hero-glow', {
        translateX: [0, -24, 16, 0],
        translateY: [0, 18, -12, 0],
        duration: 13000,
        loop: true,
        ease: 'inOutSine'
      });

      animate('.md-pulse-dot', {
        scale: [1, 1.38, 1],
        opacity: [1, 0.6, 1],
        duration: 1700,
        loop: true,
        ease: 'inOutSine'
      });

      const targetOffset = ringCirc * (1 - completionPct / 100);
      animate('.tp-ring-progress', {
        strokeDashoffset: [ringCirc, targetOffset],
        duration: 1050,
        delay: 160,
        ease: 'outExpo'
      });

      if (wpmRef.current) {
        const obj = { v: 0 };
        animate(obj, {
          v: bestWpm,
          duration: 900,
          delay: 120,
          ease: 'outExpo',
          onUpdate: () => {
            if (wpmRef.current) wpmRef.current.textContent = String(Math.round(obj.v));
          }
        });
      }

      rootRef.current?.querySelectorAll<HTMLElement>('[data-target-width]').forEach((el, idx) => {
        animate(el, {
          width: ['0%', `${el.dataset.targetWidth}%`],
          duration: 850,
          delay: 200 + idx * 55,
          ease: 'outExpo'
        });
      });

      animate('.tp-stage-card', {
        translateY: [18, 0],
        scale: [0.97, 1],
        opacity: [0, 1],
        duration: 540,
        delay: stagger(60, { start: 180 }),
        ease: 'outExpo'
      });
    });

    return () => scope.revert();
  }, [bestWpm, completionPct, ringCirc]);

  const handleStageFilter = (next: StageFilter) => {
    setStageFilter(next);
    window.requestAnimationFrame(() => {
      const cards = stagesGridRef.current?.querySelectorAll('.tp-stage-card');
      if (cards && cards.length > 0) {
        animate(cards, {
          translateY: [14, 0],
          scale: [0.97, 1],
          opacity: [0, 1],
          duration: 380,
          delay: stagger(48),
          ease: 'outExpo'
        });
      }
    });
  };

  const handleMasterUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = verifyAndApplyMasterPassword(enteredPasscode);
    if (result.success) {
      setMasterActive(true);
      setUnlockPasswordPrompt(false);
      setEnteredPasscode('');
      setPasscodeError(false);
      if (onToggleMasterUnlock) onToggleMasterUnlock();
    } else {
      setPasscodeError(true);
    }
  };

  const handleToggleMasterLock = () => {
    if (masterActive) {
      lockToStudentProgression();
      setMasterActive(false);
      if (onToggleMasterUnlock) onToggleMasterUnlock();
    } else {
      setUnlockPasswordPrompt(true);
    }
  };

  const handleLaunchWithFullscreen = (levelId: number) => {
    void requestDocumentFullscreen();
    onLaunchLevel(levelId);
  };

  const visibleStages = STAGES_META.filter(st => {
    if (stageFilter === 'learning') return st.levelRange[0] <= 12;
    if (stageFilter === 'challenge') return st.levelRange[1] >= 13;
    return true;
  });

  return (
    <div
      ref={rootRef}
      className={`typing-root theme-${theme} ${isPseudoFullscreen ? 'is-pseudo-fullscreen' : ''} ${isFullscreen ? 'is-fullscreen' : ''} ${className}`}
      style={{ overflowY: isFullscreen ? 'auto' : undefined }}
    >
      {/* TOP UTILITY BAR */}
      <header className="typing-header-bar">
        <div className="typing-header-left">
          {onBackToMainHub && (
            <button
              type="button"
              onClick={onBackToMainHub}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: `1px solid ${isDark ? '#414856' : '#d2c8b7'}`,
                background: isDark ? '#272a32' : '#ffffff',
                color: isDark ? '#f8fafc' : '#1c1915',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ← All Labs Hub
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                background: isDark ? '#0e7490' : '#ecfeff',
                color: isDark ? '#67e8f9' : '#0891b2'
              }}
            >
              <Zap size={17} />
            </span>
            <div>
              <div style={{ fontSize: '14.5px', fontWeight: 800, lineHeight: 1.15 }}>
                ICST LAB • Touch Typing
              </div>
              <span style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                25-Level Spatial Light-Beam Kinesthetic Lab
              </span>
            </div>
          </div>
        </div>

        <div className="typing-header-right">
          <button
            type="button"
            onClick={handleToggleMasterLock}
            title={masterActive ? 'Lock levels back to student progression' : 'Instructor Override: Unlock all 25 levels with passcode ICST'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              border: `1px solid ${masterActive ? '#10b981' : (isDark ? '#414856' : '#d2c8b7')}`,
              background: masterActive ? (isDark ? '#064e3b' : '#d1fae5') : (isDark ? '#272a32' : '#ffffff'),
              color: masterActive ? '#10b981' : (isDark ? '#cbd5e1' : '#4d463b'),
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {masterActive ? <Unlock size={13} /> : <Lock size={13} />}
            <span>{masterActive ? 'Master Unlocked' : 'Instructor Unlock'}</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              border: `1px solid ${isFullscreen ? '#0891b2' : (isDark ? '#38bdf8' : '#0891b2')}`,
              background: isFullscreen ? '#0891b2' : (isDark ? 'rgba(56,189,248,0.14)' : '#ecfeff'),
              color: isFullscreen ? '#ffffff' : (isDark ? '#67e8f9' : '#0e7490'),
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{isFullscreen ? 'Exit Full' : 'Full Screen'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="typing-theme-toggle-btn"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun size={14} color="#facc15" /> : <Moon size={14} color="#0284c7" />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurriculumDrawerOpen(true);
              if (onOpenCurriculum) onOpenCurriculum();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              background: '#0891b2',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(8, 145, 178, 0.3)'
            }}
          >
            <BookOpen size={13} />
            <span>Curriculum (25)</span>
          </button>
        </div>
      </header>

      {/* MAIN ANIMATED MODULE DASHBOARD */}
      <div
        className="md-root"
        style={{
          '--md-accent': '#0891b2',
          '--md-accent-dark': '#0e7490',
          '--md-hero-bg': 'linear-gradient(135deg, #082f49 0%, #0e4f68 55%, #0891b2 100%)',
          '--md-glow': 'radial-gradient(circle, rgba(34, 211, 238, 0.34), transparent 70%)'
        } as React.CSSProperties}
      >
        {/* Mobile & Tablet Physical Keyboard Recommendation (English + সহজ বাংলা) */}
        {isMobileOrTablet && (
          <PhysicalKeyboardNotice
            variant="banner"
            labName="Touch Typing Lab"
            labNameBn="টাচ টাইপিং ল্যাব"
            theme={theme}
          />
        )}

        {/* ANIMATED KINESTHETIC HERO + LIVE HOME-ROW PULSE CONSOLE */}
        <section className="md-hero tp-reveal" aria-label="Touch Typing Lab Overview">
          <div className="md-hero-glow" aria-hidden="true" />
          <div className="md-hero-dots" aria-hidden="true" />

          <div className="md-hero-grid">
            <div>
              <span className="md-brand-eyebrow">
                <span className="md-pulse-dot" aria-hidden="true" />
                <span>ICST LAB • LEVEL {currentLevelId} OF 25 • {currentLevelData.stageName}</span>
              </span>

              <h1 className="md-hero-h1">
                {currentLevelData.title}
              </h1>

              <p className="md-hero-desc">
                {currentLevelData.subtitle} — <strong>Goal: {currentLevelData.criteriaDesc}</strong>. Build effortless 10-finger muscle memory with spatial light-beam guidance and golden sunburst awards.
              </p>

              <div className="md-hero-actions">
                <button
                  type="button"
                  className="md-btn-hero primary"
                  onClick={() => handleLaunchWithFullscreen(currentLevelId)}
                >
                  <Play size={15} fill="currentColor" />
                  <span>Launch Level {currentLevelId}</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  className="md-btn-hero ghost"
                  onClick={() => {
                    setCurriculumDrawerOpen(true);
                    if (onOpenCurriculum) onOpenCurriculum();
                  }}
                >
                  <BookOpen size={14} />
                  <span>All 25 Levels</span>
                </button>
              </div>
            </div>

            {/* Right Console: Orbital Progress + Interactive Home-Row Warmup */}
            <div className="md-hero-console">
              <div className="md-console-top">
                <div className="md-ring-wrap">
                  <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
                    <circle cx="38" cy="38" r="31" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="6.5" />
                    <circle
                      className="tp-ring-progress"
                      cx="38"
                      cy="38"
                      r="31"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="6.5"
                      strokeLinecap="round"
                      strokeDasharray={ringCirc}
                      strokeDashoffset={ringCirc}
                      transform="rotate(-90 38 38)"
                    />
                  </svg>
                  <div className="md-ring-center">
                    <div className="md-ring-val" style={{ color: '#67e8f9' }}>{completionPct}%</div>
                    <div className="md-ring-lbl">25 LVL</div>
                  </div>
                </div>

                <div className="md-exp-stack">
                  <span className="md-exp-lbl">Peak Velocity</span>
                  <div className="md-exp-num" style={{ color: '#67e8f9' }}>
                    <span ref={wpmRef}>{bestWpm}</span>
                    <span style={{ fontSize: '12px', marginLeft: '4px', color: '#bae6fd' }}>WPM</span>
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#e0f2fe', fontWeight: 700 }}>
                    {completedLevelsCount}/25 Cleared • {totalStars}/75 ★
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#a5f3fc', marginBottom: '7px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Home-Row Warmup</span>
                  <span style={{ opacity: 0.85 }}>Tap or press keys</span>
                </div>
                <div className="md-mini-keys-row">
                  {HOME_ROW_KEYS.map((keyLabel, idx) => (
                    <button
                      key={keyLabel}
                      type="button"
                      data-home-key={idx}
                      className={`md-hero-keycap ${litKeyIdx === idx ? 'lit' : ''}`}
                      onClick={() => triggerHomeKey(idx)}
                      aria-label={`Warmup key ${keyLabel}`}
                    >
                      {keyLabel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 ANIMATED TELEMETRY KPI CARDS */}
        <section className="md-kpi-grid" aria-label="Touch Typing Statistics">
          <div className="md-kpi-card tp-reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#756c5e' }}>Curriculum</span>
              <Keyboard size={16} color="#0891b2" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 900 }}>
              {completedLevelsCount} <span style={{ fontSize: '13px', opacity: 0.65 }}>/ 25</span>
            </div>
            <div className="md-bar-track" style={{ marginTop: '8px' }}>
              <div className="md-bar-fill" data-target-width={completionPct} style={{ background: '#0891b2' }} />
            </div>
          </div>

          <div className="md-kpi-card tp-reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#756c5e' }}>Peak Velocity</span>
              <TrendingUp size={16} color="#0284c7" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 900, color: isDark ? '#38bdf8' : '#0284c7' }}>
              {bestWpm} <span style={{ fontSize: '13px' }}>WPM</span>
            </div>
            <div className="md-bar-track" style={{ marginTop: '8px' }}>
              <div className="md-bar-fill" data-target-width={Math.min(100, Math.round((bestWpm / 70) * 100))} style={{ background: '#0284c7' }} />
            </div>
          </div>

          <div className="md-kpi-card tp-reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#756c5e' }}>Average Precision</span>
              <Target size={16} color="#10b981" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 900, color: '#10b981' }}>
              {avgAccuracy}%
            </div>
            <div className="md-bar-track" style={{ marginTop: '8px' }}>
              <div className="md-bar-fill" data-target-width={avgAccuracy} style={{ background: '#10b981' }} />
            </div>
          </div>

          <div className="md-kpi-card tp-reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#756c5e' }}>Golden Stars</span>
              <Star size={16} color="#f59e0b" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 900, color: '#f59e0b' }}>
              {totalStars} <span style={{ fontSize: '13px', opacity: 0.7 }}>/ 75 ★</span>
            </div>
            <div className="md-bar-track" style={{ marginTop: '8px' }}>
              <div className="md-bar-fill" data-target-width={Math.round((totalStars / 75) * 100)} style={{ background: '#f59e0b' }} />
            </div>
          </div>
        </section>

        {/* 5 MASTERY STAGES EXPLORER */}
        <section className="md-panel tp-reveal" aria-labelledby="typing-stages-heading">
          <div className="md-panel-head">
            <div>
              <span className="md-eyebrow">
                <Sparkles size={13} />
                <span>Progressive 25-Level Curriculum</span>
              </span>
              <h2 id="typing-stages-heading" className="md-h2">
                Mastery Stages (1 to 5)
              </h2>
              <p className="md-sub">
                Select any unlocked keycap level or jump straight into your active stage.
              </p>
            </div>

            <div className="md-filter-bar" role="tablist">
              {([
                { id: 'all', label: 'All Stages (5)' },
                { id: 'learning', label: 'Learning (L1–12)' },
                { id: 'challenge', label: 'Challenge (L13–25)' }
              ] as const).map(f => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={stageFilter === f.id}
                  className={`md-filter-btn ${stageFilter === f.id ? 'active' : ''}`}
                  onClick={() => handleStageFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div ref={stagesGridRef} className="md-cards-grid">
            {visibleStages.map(stageMeta => {
              const [startLevel, endLevel] = stageMeta.levelRange;
              const stageLevels = LEVELS.filter(l => l.id >= startLevel && l.id <= endLevel);
              const completedInStage = stageLevels.filter(l => records[l.id]?.passed).length;
              const isStageMastered = completedInStage === stageLevels.length;
              const isCurrentStage = !isStageMastered && currentLevelId >= startLevel && currentLevelId <= endLevel;
              const isStageLocked = !masterActive && currentLevelId < startLevel && completedInStage === 0;
              const stagePct = Math.round((completedInStage / stageLevels.length) * 100);

              return (
                <div
                  key={stageMeta.stage}
                  className={`md-card tp-stage-card ${isStageLocked ? 'is-locked' : ''}`}
                  style={{ '--card-accent': stageMeta.color } as React.CSSProperties}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: stageMeta.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          STAGE {stageMeta.stage} {isCurrentStage ? '• ACTIVE' : ''}
                        </span>
                        <h3 style={{ fontSize: '16.5px', fontWeight: 800, margin: '4px 0 3px', lineHeight: 1.2 }}>
                          {stageMeta.title.replace(`Stage ${stageMeta.stage}: `, '')}
                        </h3>
                        <span style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                          {stageMeta.tagline}
                        </span>
                      </div>

                      <SummaryBadgeSlot
                        earned={isStageMastered}
                        stars={isStageMastered ? 3 : 0}
                        size="sm"
                        theme={theme}
                        tooltip={isStageMastered ? `${stageMeta.badgeName} Earned!` : `Complete all ${stageLevels.length} levels in Stage ${stageMeta.stage}`}
                      />
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, marginBottom: '5px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                        <span>Stage Progress</span>
                        <span>{completedInStage}/{stageLevels.length}</span>
                      </div>
                      <div className="md-bar-track">
                        <div className="md-bar-fill" data-target-width={stagePct} style={{ background: stageMeta.color }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginTop: '12px' }}>
                      {stageLevels.map(lvl => {
                        const rec = records[lvl.id];
                        const isLvlUnlocked = masterActive || lvl.id <= (progress.maxUnlockedLevel || 1);
                        const isCurrent = currentLevelId === lvl.id;

                        return (
                          <button
                            key={lvl.id}
                            type="button"
                            className="md-level-btn"
                            disabled={!isLvlUnlocked}
                            onClick={() => isLvlUnlocked && handleLaunchWithFullscreen(lvl.id)}
                            title={`Level ${lvl.id}: ${lvl.title}`}
                            style={{
                              borderColor: isCurrent ? stageMeta.color : rec?.passed ? '#10b981' : undefined,
                              background: rec?.passed
                                ? (isDark ? '#14382c' : '#ecfdf5')
                                : isCurrent
                                  ? (isDark ? '#1e293b' : '#e0f2fe')
                                  : undefined,
                              color: rec?.passed
                                ? (isDark ? '#34d399' : '#059669')
                                : isCurrent
                                  ? stageMeta.color
                                  : undefined
                            }}
                          >
                            <span>L{lvl.id}</span>
                            <span style={{ fontSize: '9px', lineHeight: 1 }}>
                              {rec?.passed ? '★'.repeat(rec.stars || 1) : (isLvlUnlocked ? '•' : '🔒')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isStageLocked}
                    onClick={() => {
                      const targetLvl = stageLevels.find(l => !records[l.id]?.passed)?.id || startLevel;
                      handleLaunchWithFullscreen(targetLvl);
                    }}
                    style={{
                      padding: '11px 16px',
                      borderRadius: '11px',
                      border: isStageLocked ? `1px solid ${isDark ? '#333842' : '#d2c8b7'}` : 'none',
                      background: isStageLocked ? (isDark ? '#1a1c20' : '#f2ece0') : stageMeta.color,
                      color: isStageLocked ? (isDark ? '#64748b' : '#a89d8d') : '#ffffff',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: isStageLocked ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {isStageLocked ? <Lock size={14} /> : <Play size={14} fill="currentColor" />}
                    <span>{isStageLocked ? 'Stage Locked' : `Practice Stage ${stageMeta.stage} →`}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* INSTRUCTOR UNLOCK POPUP MODAL */}
      {unlockPasswordPrompt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              background: isDark ? '#212429' : '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              border: `1.5px solid ${isDark ? '#3b4252' : '#d2c8b7'}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: isDark ? '#372d17' : '#fef3c7',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Unlock size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Master Lab Override</h3>
                <span style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                  Enter Master Passcode to unlock all 25 levels
                </span>
              </div>
            </div>

            <form onSubmit={handleMasterUnlockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Passcode (Hint: ICST)
                </label>
                <input
                  type="password"
                  value={enteredPasscode}
                  onChange={e => {
                    setEnteredPasscode(e.target.value);
                    setPasscodeError(false);
                  }}
                  placeholder="Enter ICST"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: `1.5px solid ${passcodeError ? '#ef4444' : (isDark ? '#414856' : '#d2c8b7')}`,
                    background: isDark ? '#191b1f' : '#f9f6f0',
                    color: isDark ? '#f8fafc' : '#1c1915',
                    fontSize: '14px',
                    fontFamily: 'var(--font-mono, monospace)',
                    outline: 'none'
                  }}
                />
                {passcodeError && (
                  <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                    Invalid passcode. Enter &apos;ICST&apos; to unlock.
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setUnlockPasswordPrompt(false);
                    setPasscodeError(false);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${isDark ? '#414856' : '#d2c8b7'}`,
                    background: 'transparent',
                    color: isDark ? '#cbd5e1' : '#4d463b',
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
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#0891b2',
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

      <TypingCurriculumModal
        isOpen={curriculumDrawerOpen}
        onClose={() => setCurriculumDrawerOpen(false)}
        currentLevelId={progress.currentLevel || 1}
        progress={progress}
        onSelectLevel={(lvlId) => {
          setCurriculumDrawerOpen(false);
          handleLaunchWithFullscreen(lvlId);
        }}
        theme={theme}
      />

      <LabGuideAssistant context="touch-typing-dashboard" theme={theme} />
    </div>
  );
};
