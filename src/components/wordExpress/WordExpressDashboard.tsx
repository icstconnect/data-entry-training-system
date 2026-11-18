import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Lock,
  Unlock,
  Sun,
  Moon,
  Sparkles,
  Rocket,
  Maximize2,
  Minimize2,
  Gauge,
  Cookie,
  ArrowRight,
  TrendingUp,
  Target,
  Star
} from 'lucide-react';
import { animate, createScope, stagger, spring } from 'animejs';

import { TypingTheme } from '../../types/touchTyping';
import { WordExpressProgress, WordToughness } from '../../types/wordExpress';
import {
  CARRIER_TIERS,
  WORD_EXPRESS_LEVELS,
  WORD_EXPRESS_STAGES_META,
  getCriteriaForToughness,
  getCarrierByTier
} from '../../data/wordExpressData';
import {
  getWordExpressToughnessCookie,
  setWordExpressToughnessCookie
} from '../../services/wordExpressStorageService';
import {
  isMasterUnlocked,
  verifyAndApplyMasterPassword,
  lockToStudentProgression
} from '../../services/masterUnlockService';
import { useFullscreen, requestDocumentFullscreen } from '../../utils/useFullscreen';
import { SummaryBadgeSlot } from '../typing/SummaryBadgeSlot';
import { DeliveryCarrierSVG } from './DeliveryCarrierSVG';
import { LabGuideAssistant } from '../common/LabGuideAssistant';
import { PhysicalKeyboardNotice } from '../common/PhysicalKeyboardNotice';
import { useIsMobileOrTablet } from '../../utils/mobileKeyboardDetect';
import '../common/moduleDashboard.css';
import '../typing/touchTyping.css';
import './wordExpress.css';

export interface WordExpressDashboardProps {
  progress: WordExpressProgress;
  onLaunchLevel: (levelId: number) => void;
  theme: TypingTheme;
  onToggleTheme: () => void;
  onBackToMainHub?: () => void;
}

const TOUGHNESS_CARDS: Array<{
  id: WordToughness;
  label: string;
  desc: string;
  badge: string;
}> = [
    {
      id: 'easy',
      label: 'Easy',
      desc: 'Relaxed pace (6–22 WPM), 78–88% accuracy & zero error caps — ideal for learning.',
      badge: 'Learning Friendly'
    },
    {
      id: 'moderate',
      label: 'Moderate',
      desc: 'Balanced pace (10–32 WPM), 84–93% accuracy & fair streak targets.',
      badge: 'Balanced Default'
    },
    {
      id: 'hard',
      label: 'Hard',
      desc: 'High velocity (13–42 WPM), 88–97% accuracy & tight error limits for pro runners.',
      badge: 'Pro Challenge'
    }
  ];

export const WordExpressDashboard: React.FC<WordExpressDashboardProps> = ({
  progress,
  onLaunchLevel,
  theme,
  onToggleTheme,
  onBackToMainHub
}) => {
  const isDark = theme === 'dark';
  const isMobileOrTablet = useIsMobileOrTablet();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const wpmRef = useRef<HTMLSpanElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  const { isFullscreen, isPseudoFullscreen, toggleFullscreen } = useFullscreen(rootRef);

  const [toughness, setToughness] = useState<WordToughness>(() => getWordExpressToughnessCookie());
  const [masterActive, setMasterActive] = useState<boolean>(() => isMasterUnlocked());
  const [unlockPromptOpen, setUnlockPromptOpen] = useState(false);
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [selectedCarrierTier, setSelectedCarrierTier] = useState<number>(() => progress.highestCarrierTier || 1);

  useEffect(() => {
    const syncToughness = (e: Event) => {
      const custom = e as CustomEvent<{ toughness?: WordToughness }>;
      setToughness(custom.detail?.toughness || getWordExpressToughnessCookie());
    };
    const syncMaster = (e: Event) => {
      const custom = e as CustomEvent<{ unlocked?: boolean }>;
      setMasterActive(Boolean(custom.detail?.unlocked ?? isMasterUnlocked()));
    };
    window.addEventListener('icst_word_express_toughness_changed', syncToughness);
    window.addEventListener('icst_data_cleared', syncToughness);
    window.addEventListener('icst_master_unlock_changed', syncMaster);
    return () => {
      window.removeEventListener('icst_word_express_toughness_changed', syncToughness);
      window.removeEventListener('icst_data_cleared', syncToughness);
      window.removeEventListener('icst_master_unlock_changed', syncMaster);
    };
  }, []);

  const records = progress.completedLevels || {};
  const completedCount = Object.values(records).filter(r => r.passed).length;
  const completionPct = Math.round((completedCount / 25) * 100);
  const totalStars = Object.values(records).reduce((sum, r) => sum + (r.stars || 0), 0);
  const currentLevelId = progress.currentLevel || 1;
  const currentLevelData = WORD_EXPRESS_LEVELS.find(l => l.id === currentLevelId) || WORD_EXPRESS_LEVELS[0];
  const currentCriteria = getCriteriaForToughness(currentLevelData, toughness);
  const highestCarrier = getCarrierByTier(progress.highestCarrierTier || 1);
  const inspectedCarrier = getCarrierByTier(selectedCarrierTier);
  const ringCirc = 2 * Math.PI * 31;

  // Master anime.js v4 choreography
  useEffect(() => {
    if (!rootRef.current) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const scope = createScope({ root: rootRef.current }).add(() => {
      if (reduced) {
        if (wpmRef.current) wpmRef.current.textContent = String(progress.bestWpm || 0);
        rootRef.current?.querySelectorAll<HTMLElement>('[data-target-width]').forEach(el => {
          el.style.width = `${el.dataset.targetWidth}%`;
        });
        return;
      }

      animate('.we-reveal', {
        translateY: [22, 0],
        opacity: [0, 1],
        duration: 620,
        delay: stagger(65),
        ease: 'outExpo'
      });

      animate('.md-hero-glow', {
        translateX: [0, -24, 16, 0],
        translateY: [0, 16, -12, 0],
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

      // Live speed track dash + floating courier glide
      animate('.we-track-dash', {
        strokeDashoffset: [48, 0],
        duration: 1100,
        loop: true,
        ease: 'linear'
      });

      animate('.we-hero-courier', {
        translateY: [-4, 4],
        translateX: [-3, 5],
        duration: 1900,
        loop: true,
        alternate: true,
        ease: 'inOutSine'
      });

      const targetOffset = ringCirc * (1 - completionPct / 100);
      animate('.we-ring-progress', {
        strokeDashoffset: [ringCirc, targetOffset],
        duration: 1050,
        delay: 160,
        ease: 'outExpo'
      });

      if (wpmRef.current) {
        const obj = { v: 0 };
        animate(obj, {
          v: progress.bestWpm || 0,
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

      animate('.we-stage-card', {
        translateY: [18, 0],
        scale: [0.97, 1],
        opacity: [0, 1],
        duration: 540,
        delay: stagger(60, { start: 180 }),
        ease: 'outExpo'
      });
    });

    return () => scope.revert();
  }, [progress.bestWpm, completionPct, ringCirc]);

  const handleSelectToughness = (next: WordToughness, e: React.MouseEvent<HTMLButtonElement>) => {
    setToughness(next);
    setWordExpressToughnessCookie(next);
    animate(e.currentTarget, {
      scale: [1, 0.95, 1.03, 1],
      duration: 320,
      ease: spring({ stiffness: 360, damping: 16 })
    });
  };

  const handleSelectCarrier = (tier: number, e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedCarrierTier(tier);
    animate(e.currentTarget, {
      scale: [1, 0.92, 1.06, 1],
      duration: 300,
      ease: spring({ stiffness: 380, damping: 16 })
    });
    if (spotlightRef.current) {
      animate(spotlightRef.current, {
        translateX: [-12, 0],
        opacity: [0.4, 1],
        duration: 340,
        ease: 'outExpo'
      });
    }
  };

  const handleMasterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = verifyAndApplyMasterPassword(enteredPasscode);
    if (res.success) {
      setMasterActive(true);
      setUnlockPromptOpen(false);
      setEnteredPasscode('');
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleToggleMasterLock = () => {
    if (masterActive) {
      lockToStudentProgression();
      setMasterActive(false);
    } else {
      setUnlockPromptOpen(true);
    }
  };

  const handleLaunchWithFullscreen = (levelId: number) => {
    void requestDocumentFullscreen();
    onLaunchLevel(levelId);
  };

  return (
    <div
      ref={rootRef}
      className={`typing-root theme-${theme} ${isPseudoFullscreen ? 'is-pseudo-fullscreen' : ''} ${isFullscreen ? 'is-fullscreen' : ''}`}
      style={{ overflowY: isFullscreen ? 'auto' : undefined }}
    >
      {/* Top Utility Bar */}
      <header className="typing-header-bar">
        <div className="typing-header-left">
          {onBackToMainHub && (
            <button type="button" onClick={onBackToMainHub} className="we-back-btn">
              ← All Labs Hub
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: isDark ? '#312e81' : '#ede9fe',
                color: isDark ? '#c084fc' : '#7c3aed'
              }}
            >
              <Rocket size={18} />
            </span>
            <div>
              <div style={{ fontSize: '14.5px', fontWeight: 800, lineHeight: 1.15 }}>
                ICST LAB • Word Express
              </div>
              <span style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                25 Word Stages • 16-Tier Delivery Fleet • Easy / Moderate / Hard
              </span>
            </div>
          </div>
        </div>

        <div className="typing-header-right">
          <button
            type="button"
            onClick={handleToggleMasterLock}
            className={`we-master-btn ${masterActive ? 'is-unlocked' : ''}`}
          >
            {masterActive ? <Unlock size={13} /> : <Lock size={13} />}
            <span>{masterActive ? 'Master Unlocked' : 'Instructor Unlock'}</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className={`we-fullscreen-btn ${isFullscreen ? 'is-active' : ''}`}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen Mode'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{isFullscreen ? 'Exit Full' : 'Full Screen'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="typing-theme-toggle-btn"
          >
            {isDark ? <Sun size={14} color="#facc15" /> : <Moon size={14} color="#0284c7" />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </header>

      {/* MAIN ANIMATED MODULE DASHBOARD */}
      <div
        className="md-root"
        style={{
          '--md-accent': '#7c3aed',
          '--md-accent-dark': '#4c1d95',
          '--md-hero-bg': 'linear-gradient(135deg, #1e1044 0%, #4c1d95 52%, #7c3aed 100%)',
          '--md-glow': 'radial-gradient(circle, rgba(192, 132, 252, 0.38), transparent 70%)'
        } as React.CSSProperties}
      >
        {/* Mobile & Tablet Physical Keyboard Recommendation (English + সহজ বাংলা) */}
        {isMobileOrTablet && (
          <PhysicalKeyboardNotice
            variant="banner"
            labName="Word Express Lab"
            labNameBn="ওয়ার্ড এক্সপ্রেস ল্যাব"
            theme={theme}
          />
        )}

        {/* ELECTRIC VIOLET COURIER RUNWAY HERO */}
        <section className="md-hero we-reveal" aria-label="Word Express Lab Overview">
          <div className="md-hero-glow" aria-hidden="true" />
          <div className="md-hero-dots" aria-hidden="true" />

          <div className="md-hero-grid">
            <div>
              <span className="md-brand-eyebrow">
                <span className="md-pulse-dot" aria-hidden="true" />
                <span>ICST LAB • STAGE {currentLevelId} OF 25 • {toughness.toUpperCase()} MODE</span>
              </span>

              <h1 className="md-hero-h1">
                {currentLevelData.title}
              </h1>

              <p className="md-hero-desc">
                {currentLevelData.words.length} crisp words • {currentLevelData.subtitle}. <strong>Goal: {currentCriteria.desc}</strong>. Chain clean words to upgrade your courier all the way from Runner to UFO 3!
              </p>

              <div className="md-hero-actions">
                <button
                  type="button"
                  className="md-btn-hero primary"
                  onClick={() => handleLaunchWithFullscreen(currentLevelId)}
                >
                  <Play size={15} fill="currentColor" />
                  <span>Start Stage {currentLevelId}</span>
                  <ArrowRight size={15} />
                </button>

                <span className="md-btn-hero ghost" style={{ cursor: 'default' }}>
                  <Rocket size={14} color="#e9d5ff" />
                  <span>Top Vehicle: {highestCarrier.name}</span>
                </span>
              </div>
            </div>

            {/* Right Console: Orbital Ring + Live Gliding Courier Track */}
            <div className="md-hero-console">
              <div className="md-console-top">
                <div className="md-ring-wrap">
                  <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
                    <circle cx="38" cy="38" r="31" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="6.5" />
                    <circle
                      className="we-ring-progress"
                      cx="38"
                      cy="38"
                      r="31"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="6.5"
                      strokeLinecap="round"
                      strokeDasharray={ringCirc}
                      strokeDashoffset={ringCirc}
                      transform="rotate(-90 38 38)"
                    />
                  </svg>
                  <div className="md-ring-center">
                    <div className="md-ring-val" style={{ color: '#e9d5ff' }}>{completionPct}%</div>
                    <div className="md-ring-lbl">FLEET</div>
                  </div>
                </div>

                <div className="md-exp-stack">
                  <span className="md-exp-lbl">Express Velocity</span>
                  <div className="md-exp-num" style={{ color: '#e9d5ff' }}>
                    <span ref={wpmRef}>{progress.bestWpm || 0}</span>
                    <span style={{ fontSize: '12px', marginLeft: '4px', color: '#ddd6fe' }}>WPM</span>
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#f3e8ff', fontWeight: 700 }}>
                    {completedCount}/25 Stages • {totalStars}/75 ★
                  </span>
                </div>
              </div>

              {/* Animated Courier Runway */}
              <div style={{
                position: 'relative',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.35)',
                border: '1px solid rgba(255,255,255,0.14)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div className="we-hero-courier">
                  <DeliveryCarrierSVG carrierId={highestCarrier.id} accent={highestCarrier.accent} size={52} />
                </div>
                <svg viewBox="0 0 140 16" style={{ flex: 1, height: '16px' }} aria-hidden="true">
                  <line x1="0" y1="8" x2="140" y2="8" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeDasharray="6 6" />
                  <line x1="0" y1="8" x2="140" y2="8" stroke="#c084fc" strokeWidth="2.5" strokeDasharray="12 16" className="we-track-dash" />
                </svg>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, color: '#e9d5ff' }}>
                  T{highestCarrier.tier}/16
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ANIMATED KPI ROW */}
        <section className="md-kpi-grid" aria-label="Word Express Metrics">
          <div className="md-kpi-card we-reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#756c5e' }}>Stages Cleared</span>
              <Rocket size={15} color="#7c3aed" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 900 }}>
              {completedCount} <span style={{ fontSize: '13px', opacity: 0.65 }}>/ 25</span>
            </div>
            <div className="md-bar-track" style={{ marginTop: '8px' }}>
              <div className="md-bar-fill" data-target-width={completionPct} style={{ background: '#7c3aed' }} />
            </div>
          </div>

          <div className="md-kpi-card we-reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#756c5e' }}>Peak Speed</span>
              <TrendingUp size={15} color="#0284c7" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 900, color: '#0284c7' }}>
              {progress.bestWpm || 0} <span style={{ fontSize: '13px' }}>WPM</span>
            </div>
            <div className="md-bar-track" style={{ marginTop: '8px' }}>
              <div className="md-bar-fill" data-target-width={Math.min(100, Math.round(((progress.bestWpm || 0) / 60) * 100))} style={{ background: '#0284c7' }} />
            </div>
          </div>

          <div className="md-kpi-card we-reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#756c5e' }}>Avg Accuracy</span>
              <Target size={15} color="#10b981" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 900, color: '#10b981' }}>
              {progress.averageAccuracy || 100}%
            </div>
            <div className="md-bar-track" style={{ marginTop: '8px' }}>
              <div className="md-bar-fill" data-target-width={progress.averageAccuracy || 100} style={{ background: '#10b981' }} />
            </div>
          </div>

          <div className="md-kpi-card we-reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#756c5e' }}>Stars Earned</span>
              <Star size={15} color="#f59e0b" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 900, color: '#f59e0b' }}>
              {totalStars} <span style={{ fontSize: '13px', opacity: 0.7 }}>/ 75 ★</span>
            </div>
            <div className="md-bar-track" style={{ marginTop: '8px' }}>
              <div className="md-bar-fill" data-target-width={Math.round((totalStars / 75) * 100)} style={{ background: '#f59e0b' }} />
            </div>
          </div>
        </section>

        {/* COOKIE-BACKED TOUGHNESS SELECTOR */}
        <section className="we-toughness-panel we-reveal">
          <div className="we-toughness-panel-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gauge size={17} color="#7c3aed" />
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                Choose Level Crossing Toughness
              </h2>
            </div>
            <span className="we-cookie-pill">
              <Cookie size={12} />
              <span>Stored in Browser Cookie • Cleared with Clear Data</span>
            </span>
          </div>

          <div className="we-toughness-grid">
            {TOUGHNESS_CARDS.map(card => {
              const active = toughness === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={(e) => handleSelectToughness(card.id, e)}
                  className={`we-toughness-card ${card.id} ${active ? 'is-selected' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800 }}>{card.label}</span>
                    <span className={`we-toughness-card-tag ${card.id}`}>{card.badge}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.45, opacity: 0.85, textAlign: 'left' }}>
                    {card.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* INTERACTIVE 16-TIER STREAK DELIVERY FLEET SHOWROOM */}
        <section className="md-panel we-reveal" aria-labelledby="we-fleet-heading">
          <div className="md-panel-head" style={{ marginBottom: '14px' }}>
            <div>
              <span className="md-eyebrow">
                <Rocket size={13} />
                <span>Interactive Courier Showroom</span>
              </span>
              <h2 id="we-fleet-heading" className="md-h2">
                16-Tier Streak Delivery Fleet (Runner → UFO 3)
              </h2>
              <p className="md-sub">
                Click any carrier below to inspect its streak milestone and vector craft!
              </p>
            </div>
          </div>

          <div ref={spotlightRef} className="md-fleet-spotlight">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <DeliveryCarrierSVG carrierId={inspectedCarrier.id} accent={inspectedCarrier.accent} size={68} />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: inspectedCarrier.accent, textTransform: 'uppercase' }}>
                  TIER {inspectedCarrier.tier} OF 16 • {inspectedCarrier.tier <= (progress.highestCarrierTier || 1) ? '✓ UNLOCKED' : 'LOCKED TARGET'}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, marginTop: '2px' }}>
                  {inspectedCarrier.name}
                </div>
                <div style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#5e564b', marginTop: '2px' }}>
                  Hit a clean streak of <strong>{inspectedCarrier.minStreak}+ consecutive words</strong> to summon this courier live!
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ background: '#7c3aed', borderColor: '#6d28d9' }}
              onClick={() => handleLaunchWithFullscreen(currentLevelId)}
            >
              Ride Now →
            </button>
          </div>

          <div className="we-fleet-grid">
            {CARRIER_TIERS.map(c => {
              const reached = c.tier <= (progress.highestCarrierTier || 1);
              const selected = c.tier === selectedCarrierTier;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`we-fleet-item ${reached ? 'is-reached' : ''}`}
                  onClick={(e) => handleSelectCarrier(c.tier, e)}
                  style={{
                    borderColor: selected ? c.accent : reached ? c.accent : undefined,
                    boxShadow: selected ? `0 0 0 2px ${c.accent}55` : undefined,
                    cursor: 'pointer'
                  }}
                  title={`Tier ${c.tier}: ${c.name} — Requires ${c.minStreak} streak`}
                >
                  <div className="we-fleet-tier-row">
                    <span className="we-fleet-tier" style={{ background: reached || selected ? c.accent : undefined }}>
                      T{c.tier}
                    </span>
                    <span className="we-fleet-streak">{c.minStreak}+</span>
                  </div>
                  <DeliveryCarrierSVG carrierId={c.id} accent={c.accent} size={54} />
                  <span className="we-fleet-name">{c.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5 STAGES (25 WORD STAGES) CURRICULUM */}
        <section className="md-panel we-reveal" aria-labelledby="we-stages-heading">
          <div className="md-panel-head">
            <div>
              <span className="md-eyebrow">
                <Sparkles size={13} />
                <span>25 Express Delivery Routes</span>
              </span>
              <h2 id="we-stages-heading" className="md-h2">
                Word Express Curriculum
              </h2>
              <p className="md-sub">
                Click any unlocked stage keycap to launch straight into the delivery workbench.
              </p>
            </div>
          </div>

          <div className="md-cards-grid">
            {WORD_EXPRESS_STAGES_META.map(stageMeta => {
              const [startLvl, endLvl] = stageMeta.levelRange;
              const stageLevels = WORD_EXPRESS_LEVELS.filter(l => l.id >= startLvl && l.id <= endLvl);
              const completedInStage = stageLevels.filter(l => records[l.id]?.passed).length;
              const isMastered = completedInStage === stageLevels.length;
              const isCurrentStage = !isMastered && currentLevelId >= startLvl && currentLevelId <= endLvl;
              const isLocked = !masterActive && currentLevelId < startLvl && completedInStage === 0;
              const stagePct = Math.round((completedInStage / stageLevels.length) * 100);

              return (
                <div
                  key={stageMeta.stage}
                  className={`md-card we-stage-card ${isLocked ? 'is-locked' : ''}`}
                  style={{ '--card-accent': stageMeta.color } as React.CSSProperties}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: stageMeta.color, textTransform: 'uppercase' }}>
                          STAGE {stageMeta.stage} (S{startLvl}–S{endLvl}) {isCurrentStage ? '• ACTIVE' : ''}
                        </span>
                        <h3 style={{ fontSize: '16.5px', fontWeight: 800, margin: '4px 0 3px' }}>
                          {stageMeta.title.replace(`Stage ${stageMeta.stage}: `, '')}
                        </h3>
                        <span style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                          {stageMeta.tagline}
                        </span>
                      </div>
                      <SummaryBadgeSlot earned={isMastered} stars={isMastered ? 3 : 0} size="sm" theme={theme} />
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, marginBottom: '5px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                        <span>Completed</span>
                        <span>{completedInStage}/{stageLevels.length}</span>
                      </div>
                      <div className="md-bar-track">
                        <div className="md-bar-fill" data-target-width={stagePct} style={{ background: stageMeta.color }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginTop: '12px' }}>
                      {stageLevels.map(lvl => {
                        const rec = records[lvl.id];
                        const unlocked = masterActive || lvl.id <= (progress.maxUnlockedLevel || 1);
                        const isCurrent = currentLevelId === lvl.id;
                        const crit = getCriteriaForToughness(lvl, toughness);

                        return (
                          <button
                            key={lvl.id}
                            type="button"
                            className="md-level-btn"
                            disabled={!unlocked}
                            onClick={() => unlocked && handleLaunchWithFullscreen(lvl.id)}
                            title={`Stage ${lvl.id}: ${lvl.title} (${crit.desc})`}
                            style={{
                              borderColor: isCurrent ? stageMeta.color : rec?.passed ? '#10b981' : undefined,
                              background: rec?.passed
                                ? (isDark ? '#14382c' : '#ecfdf5')
                                : isCurrent
                                  ? (isDark ? '#1e293b' : '#ede9fe')
                                  : undefined,
                              color: rec?.passed
                                ? (isDark ? '#34d399' : '#059669')
                                : isCurrent
                                  ? stageMeta.color
                                  : undefined
                            }}
                          >
                            <span>S{lvl.id}</span>
                            <span style={{ fontSize: '9px' }}>
                              {rec?.passed ? '★'.repeat(rec.stars || 1) : (unlocked ? '•' : '🔒')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => {
                      const targetLvl = stageLevels.find(l => !records[l.id]?.passed)?.id || startLvl;
                      handleLaunchWithFullscreen(targetLvl);
                    }}
                    style={{
                      padding: '11px 16px',
                      borderRadius: '11px',
                      border: isLocked ? `1px solid ${isDark ? '#333842' : '#d2c8b7'}` : 'none',
                      background: isLocked ? (isDark ? '#1a1c20' : '#f2ece0') : stageMeta.color,
                      color: isLocked ? (isDark ? '#64748b' : '#a89d8d') : '#ffffff',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {isLocked ? <Lock size={14} /> : <Play size={14} fill="currentColor" />}
                    <span>{isLocked ? 'Stage Locked' : `Launch Stage ${stageMeta.stage} →`}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Master Unlock Modal */}
      {unlockPromptOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={e => {
            if (e.target === e.currentTarget) setUnlockPromptOpen(false);
          }}
        >
          <div style={{ width: '100%', maxWidth: '380px', background: isDark ? '#212429' : '#ffffff', borderRadius: '16px', padding: '24px', border: `1.5px solid ${isDark ? '#3b4252' : '#d2c8b7'}` }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800 }}>Master Lab Override</h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: isDark ? '#94a3b8' : '#756c5e' }}>
              Enter Master Passcode (ICST) to unlock all 25 stages.
            </p>
            <form onSubmit={handleMasterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="password"
                value={enteredPasscode}
                onChange={e => {
                  setEnteredPasscode(e.target.value);
                  setPasscodeError(false);
                }}
                placeholder="Enter ICST"
                autoFocus
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1.5px solid ${passcodeError ? '#ef4444' : (isDark ? '#414856' : '#d2c8b7')}`, background: isDark ? '#191b1f' : '#f9f6f0', color: isDark ? '#f8fafc' : '#1c1915' }}
              />
              {passcodeError && <span style={{ color: '#ef4444', fontSize: '11px' }}>Invalid passcode. Enter &apos;ICST&apos;.</span>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setUnlockPromptOpen(false)} className="we-back-btn">Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#7c3aed', color: '#ffffff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  Unlock All
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <LabGuideAssistant context="word-express-dashboard" theme={theme} />
    </div>
  );
};
