import React, { useState, useEffect, useRef } from 'react';
import { StudentProgress } from '../../types';
import { TERMINAL_SCENARIOS, TERMINAL_ACHIEVEMENTS } from '../../data/terminalScenariosData';
import { loadTerminalProgress } from '../../services/terminalStorageService';
import { isMasterUnlocked } from '../../services/masterUnlockService';
import { TerminalProgress, TerminalEvaluationSummary, TerminalScenario } from '../../types/terminal';
import { TerminalEvaluationModal } from './TerminalEvaluationModal';
import { AchievementShareModal } from '../common/AchievementShareModal';
import { animate, createScope, stagger, spring } from 'animejs';
import '../common/moduleDashboard.css';
import './terminal.css';

import {
  Terminal,
  Zap,
  ShieldCheck,
  Trophy,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
  Gauge,
  FileCheck2,
  Lock,
  Unlock,
  FileText,
  Play,
  Radar
} from 'lucide-react';

interface TerminalDashboardProps {
  onSelectLevel: (lvl: number) => void;
  studentProgress: StudentProgress;
}

type TerminalFilter = 'all' | 'unlocked' | 'completed';

const SAMPLE_VOUCHERS = [
  { code: 'CHLN-2026-8420', status: 'VERIFIED CLEAN', ok: true, kph: '11,400 KPH' },
  { code: 'GST-INV-9104X', status: 'TRAP CAUGHT: CHECKSUM', ok: false, kph: '12,800 KPH' },
  { code: 'RTGS-7731-ICST', status: 'VERIFIED CLEAN', ok: true, kph: '14,200 KPH' }
];

export const TerminalDashboard: React.FC<TerminalDashboardProps> = ({
  onSelectLevel,
  studentProgress
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const expRef = useRef<HTMLSpanElement | null>(null);
  const kphRef = useRef<HTMLSpanElement | null>(null);
  const radarCardRef = useRef<HTMLDivElement | null>(null);

  const [progress, setProgress] = useState<TerminalProgress>(() => loadTerminalProgress());
  const [filter, setFilter] = useState<TerminalFilter>('all');
  const [sampleIdx, setSampleIdx] = useState(0);
  const [viewingEvaluation, setViewingEvaluation] = useState<{
    summary: TerminalEvaluationSummary;
    scenario: TerminalScenario;
  } | null>(null);
  const [shareModalEvaluation, setShareModalEvaluation] = useState<TerminalEvaluationSummary | null>(null);

  useEffect(() => {
    const refresh = () => setProgress(loadTerminalProgress());
    window.addEventListener('icst_data_cleared', refresh);
    window.addEventListener('icst_master_unlock_changed', refresh);
    return () => {
      window.removeEventListener('icst_data_cleared', refresh);
      window.removeEventListener('icst_master_unlock_changed', refresh);
    };
  }, []);

  const masterOpen = isMasterUnlocked();
  const completedCount = Object.keys(progress.completedScenarios).length;
  const completionPct = Math.round((completedCount / TERMINAL_SCENARIOS.length) * 100);
  const highestKPH = progress.highestKPH || 0;
  const nextRecommendedLevel = Math.min(TERMINAL_SCENARIOS.length, completedCount + 1);
  const ringCirc = 2 * Math.PI * 31;

  // Master anime.js v4 entrance & radar telemetry choreography
  useEffect(() => {
    if (!rootRef.current) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const scope = createScope({ root: rootRef.current }).add(() => {
      if (reduced) {
        if (expRef.current) expRef.current.textContent = progress.totalTerminalExp.toLocaleString();
        if (kphRef.current) kphRef.current.textContent = highestKPH > 0 ? highestKPH.toLocaleString() : '0';
        return;
      }

      animate('.tm-reveal', {
        translateY: [22, 0],
        opacity: [0, 1],
        duration: 620,
        delay: stagger(65),
        ease: 'outExpo'
      });

      animate('.md-hero-glow', {
        translateX: [0, -24, 16, 0],
        translateY: [0, 18, -12, 0],
        scale: [1, 1.08, 0.96, 1],
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

      animate('.tm-radar-dash', {
        strokeDashoffset: [48, 0],
        duration: 1400,
        loop: true,
        ease: 'linear'
      });

      const targetOffset = ringCirc * (1 - completionPct / 100);
      animate('.tm-ring-progress', {
        strokeDashoffset: [ringCirc, targetOffset],
        duration: 1050,
        delay: 160,
        ease: 'outExpo'
      });

      if (expRef.current) {
        const expObj = { v: 0 };
        animate(expObj, {
          v: progress.totalTerminalExp,
          duration: 950,
          delay: 120,
          ease: 'outExpo',
          onUpdate: () => {
            if (expRef.current) expRef.current.textContent = Math.round(expObj.v).toLocaleString();
          }
        });
      }

      if (kphRef.current) {
        const kphObj = { v: 0 };
        animate(kphObj, {
          v: highestKPH,
          duration: 950,
          delay: 140,
          ease: 'outExpo',
          onUpdate: () => {
            if (kphRef.current) kphRef.current.textContent = Math.round(kphObj.v).toLocaleString();
          }
        });
      }

      animate('.tm-scenario-card', {
        translateY: [18, 0],
        scale: [0.97, 1],
        opacity: [0, 1],
        duration: 540,
        delay: stagger(60, { start: 180 }),
        ease: 'outExpo'
      });
    });

    return () => scope.revert();
  }, [progress.totalTerminalExp, highestKPH, completionPct, ringCirc]);

  const handleCycleVoucherScan = () => {
    setSampleIdx(prev => (prev + 1) % SAMPLE_VOUCHERS.length);
    if (radarCardRef.current) {
      animate(radarCardRef.current, {
        scale: [1, 0.96, 1.03, 1],
        duration: 340,
        ease: spring({ stiffness: 360, damping: 16 })
      });
    }
  };

  const handleFilterChange = (next: TerminalFilter) => {
    setFilter(next);
    window.requestAnimationFrame(() => {
      const cards = cardsRef.current?.querySelectorAll('.tm-scenario-card');
      if (cards && cards.length > 0) {
        animate(cards, {
          translateY: [14, 0],
          scale: [0.97, 1],
          opacity: [0, 1],
          duration: 400,
          delay: stagger(48),
          ease: 'outExpo'
        });
      }
    });
  };

  const handleBadgeHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const icon = e.currentTarget.querySelector('.tm-badge-icon');
    if (icon) {
      animate(icon, {
        scale: [1, 1.18, 1.06],
        rotate: [0, -6, 0],
        duration: 340,
        ease: spring({ stiffness: 340, damping: 15 })
      });
    }
  };

  const handleBadgeLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const icon = e.currentTarget.querySelector('.tm-badge-icon');
    if (icon) {
      animate(icon, { scale: 1, rotate: 0, duration: 220, ease: 'outQuad' });
    }
  };

  const handleViewTestRecord = (sc: TerminalScenario) => {
    const completedData = progress.completedScenarios[sc.levelNumber];
    if (!completedData) return;

    const existing = (progress.recentEvaluations || []).find(e => e.levelNumber === sc.levelNumber);
    if (existing) {
      setViewingEvaluation({ summary: existing, scenario: sc });
      return;
    }

    const totalFields = sc.vouchers.length * sc.fields.length;
    const correctFields = Math.round(totalFields * (completedData.highestAccuracy / 100));
    const incorrectFields = totalFields - correctFields;

    const constructedSummary: TerminalEvaluationSummary = {
      levelNumber: sc.levelNumber,
      scenarioTitle: sc.title,
      domain: sc.domain,
      totalVouchers: sc.vouchers.length,
      dispatchedVouchers: sc.vouchers.length,
      totalFieldsEvaluated: totalFields,
      correctFields,
      incorrectFields,
      fieldAccuracyPercent: completedData.highestAccuracy,
      trapAccuracyPercent: completedData.trapCatchRate ?? 100,
      netScorePercent: completedData.highestAccuracy,
      passed: completedData.highestAccuracy >= sc.targetAccuracy,
      timeTakenSeconds: completedData.bestTimeSeconds || sc.timeLimitSeconds,
      calculatedKPH: completedData.bestKPH || 0,
      netWpm: Math.round((completedData.bestKPH || 0) / 50),
      backspaceCount: 2,
      maxStreak: Math.min(25, sc.vouchers.length * 3),
      expEarned: sc.expReward,
      decisions: sc.vouchers.map(v => ({
        voucherId: v.voucherId,
        traineeFlag: v.trapConfig.expectedFlag,
        selectedTrapType: v.trapConfig.trapType,
        operatorNotes: 'Verified during audit evaluation',
        isCorrect: true
      })),
      unlockedAchievements: [],
      submittedAt: completedData.completedAt || new Date().toISOString(),
      studentIdentity: studentProgress.studentIdentity
    };

    setViewingEvaluation({ summary: constructedSummary, scenario: sc });
  };

  const visibleScenarios = TERMINAL_SCENARIOS.filter(sc => {
    const unlocked = masterOpen || sc.levelNumber === 1 || !!progress.completedScenarios[sc.levelNumber - 1];
    const completed = !!progress.completedScenarios[sc.levelNumber];
    if (filter === 'unlocked') return unlocked;
    if (filter === 'completed') return completed;
    return true;
  });

  const activeSample = SAMPLE_VOUCHERS[sampleIdx];

  return (
    <div
      ref={rootRef}
      className="md-root"
      style={{
        '--md-accent': '#0284c7',
        '--md-accent-dark': '#0c4a6e',
        '--md-hero-bg': 'linear-gradient(135deg, #070d19 0%, #0d1f3c 55%, #0369a1 100%)',
        '--md-glow': 'radial-gradient(circle, rgba(56, 189, 248, 0.36), transparent 70%)'
      } as React.CSSProperties}
    >
      {/* ====================================================================
          ANIMATED MIDNIGHT CYAN HDDE DISPATCH HERO
         ==================================================================== */}
      <section className="md-hero tm-reveal" aria-label="Terminal Stream Lab Overview">
        <div className="md-hero-glow" aria-hidden="true" />
        <div className="md-hero-dots" aria-hidden="true" />

        <div className="md-hero-grid">
          <div>
            <span className="md-brand-eyebrow">
              <span className="md-pulse-dot" aria-hidden="true" />
              <span>ICST LAB • HDDE DISPATCH ENGINE • icstconnect.in</span>
            </span>

            <h1 className="md-hero-h1">
              Terminal Stream: Enterprise Dispatch
            </h1>

            <p className="md-hero-desc">
              Master 100% keyboard-driven Heads-Down Data Entry across municipal tax challans, container waybills, GST invoices, healthcare TPA claims, and RTGS streams with live discrepancy radar &amp; trap auditing.
            </p>

            <div className="md-hero-actions">
              <button
                type="button"
                className="md-btn-hero primary"
                onClick={() => onSelectLevel(nextRecommendedLevel)}
              >
                <Play size={15} fill="currentColor" />
                <span>{completedCount > 0 ? `Launch Stream L${nextRecommendedLevel}` : 'Start Level 1 Stream'}</span>
                <ArrowRight size={15} />
              </button>

              {masterOpen && (
                <span className="md-btn-hero unlocked" style={{ cursor: 'default' }}>
                  <Unlock size={14} />
                  <span>Master Unlocked (All 5 Open)</span>
                </span>
              )}
            </div>
          </div>

          {/* Right Console: Orbital Ring + Peak KPH + Interactive Audit Radar */}
          <div className="md-hero-console">
            <div className="md-console-top">
              <div className="md-ring-wrap">
                <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
                  <circle cx="38" cy="38" r="31" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="6.5" />
                  <circle
                    className="tm-ring-progress"
                    cx="38"
                    cy="38"
                    r="31"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="6.5"
                    strokeLinecap="round"
                    strokeDasharray={ringCirc}
                    strokeDashoffset={ringCirc}
                    transform="rotate(-90 38 38)"
                  />
                </svg>
                <div className="md-ring-center">
                  <div className="md-ring-val" style={{ color: '#7dd3fc' }}>{completionPct}%</div>
                  <div className="md-ring-lbl">BATCH</div>
                </div>
              </div>

              <div className="md-exp-stack">
                <span className="md-exp-lbl">Peak Throughput</span>
                <div className="md-exp-num" style={{ color: '#38bdf8' }}>
                  <span ref={kphRef}>{highestKPH.toLocaleString()}</span>
                  <span style={{ fontSize: '12px', marginLeft: '4px', color: '#bae6fd' }}>KPH</span>
                </div>
                <span style={{ fontSize: '11.5px', color: '#fde68a', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  <span ref={expRef}>{progress.totalTerminalExp.toLocaleString()}</span> EXP • {completedCount}/5 Cleared
                </span>
              </div>
            </div>

            {/* Interactive Live Voucher Audit Radar Preview */}
            <div
              ref={radarCardRef}
              style={{
                padding: '10px 12px',
                borderRadius: '12px',
                background: 'rgba(7, 13, 25, 0.55)',
                border: `1px solid ${activeSample.ok ? 'rgba(56, 189, 248, 0.35)' : 'rgba(251, 191, 36, 0.5)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 800, color: '#e0f2fe' }}>
                  <Radar size={13} color="#38bdf8" />
                  <span>{activeSample.code}</span>
                </span>
                <button
                  type="button"
                  onClick={handleCycleVoucherScan}
                  style={{
                    padding: '3px 9px',
                    borderRadius: '7px',
                    background: 'rgba(56, 189, 248, 0.2)',
                    border: '1px solid rgba(56, 189, 248, 0.45)',
                    color: '#7dd3fc',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Scan Next ↻
                </button>
              </div>

              <svg viewBox="0 0 240 8" style={{ width: '100%', height: '8px' }} aria-hidden="true">
                <line x1="0" y1="4" x2="240" y2="4" stroke="rgba(56,189,248,0.2)" strokeWidth="2.5" />
                <line x1="0" y1="4" x2="240" y2="4" stroke={activeSample.ok ? '#38bdf8' : '#fbbf24'} strokeWidth="2.5" strokeDasharray="16 20" className="tm-radar-dash" />
              </svg>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                <span style={{ color: activeSample.ok ? '#34d399' : '#fbbf24' }}>{activeSample.status}</span>
                <span style={{ color: '#94a3b8' }}>{activeSample.kph}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5 ENTERPRISE DISPATCH STREAMS EXPLORER
         ==================================================================== */}
      <section className="md-panel tm-reveal" aria-labelledby="terminal-streams-heading">
        <div className="md-panel-head">
          <div>
            <span className="md-eyebrow">
              <Gauge size={13} />
              <span>5 Enterprise HDDE Domains</span>
            </span>
            <h2 id="terminal-streams-heading" className="md-h2">
              Enterprise Dispatch Streams
            </h2>
            <p className="md-sub">
              Transcribe scanned vouchers at speed and flag arithmetic, checksum, or date traps in real time.
            </p>
          </div>

          <div className="md-filter-bar" role="tablist" aria-label="Filter Terminal Streams">
            {([
              { id: 'all', label: `All (${TERMINAL_SCENARIOS.length})` },
              { id: 'unlocked', label: 'Unlocked' },
              { id: 'completed', label: `Cleared (${completedCount})` }
            ] as const).map(f => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                className={`md-filter-btn ${filter === f.id ? 'active' : ''}`}
                onClick={() => handleFilterChange(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div ref={cardsRef} className="md-cards-grid">
          {visibleScenarios.map(sc => {
            const isUnlocked = masterOpen || sc.levelNumber === 1 || !!progress.completedScenarios[sc.levelNumber - 1];
            const completedData = progress.completedScenarios[sc.levelNumber];
            const isPassed = !!completedData;

            return (
              <div
                key={sc.scenarioId}
                className={`md-card tm-scenario-card ${!isUnlocked ? 'is-locked' : ''}`}
                style={{ '--card-accent': isPassed ? '#15803d' : '#0284c7' } as React.CSSProperties}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '3px 9px',
                      borderRadius: '999px',
                      background: '#e0f2fe',
                      color: '#0369a1'
                    }}>
                      {sc.domain}
                    </span>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: isPassed ? '#15803d' : isUnlocked ? '#0284c7' : 'var(--text-muted)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {isPassed ? <FileCheck2 size={13} /> : isUnlocked ? <Zap size={13} /> : <Lock size={13} />}
                      <span>{isPassed ? `Cleared (${completedData.highestAccuracy}%)` : isUnlocked ? `Level ${sc.levelNumber}` : 'Locked'}</span>
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: 'var(--icst-charcoal)', margin: '0 0 6px', lineHeight: 1.3 }}>
                    {sc.title}
                  </h3>

                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 14px', lineHeight: 1.48 }}>
                    {sc.instructions[0]}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span className="excel-pill">
                      <Gauge size={12} color="#0284c7" />
                      {sc.targetKPH.toLocaleString()} KPH
                    </span>
                    <span className="excel-pill">
                      <ShieldCheck size={12} color="#15803d" />
                      {sc.targetAccuracy}% Acc
                    </span>
                    <span className="excel-pill">
                      <Terminal size={12} />
                      {sc.vouchers.length} Vouchers
                    </span>
                    <span className="excel-pill">
                      <Clock size={12} />
                      {Math.round(sc.timeLimitSeconds / 60)}m
                    </span>
                    <span className="excel-pill" style={{ background: '#fef3c7', color: '#92400e' }}>
                      <Sparkles size={12} color="#d97706" />
                      +{sc.expReward} EXP
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '12px',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {completedData ? `Best: ${completedData.bestKPH.toLocaleString()} KPH` : sc.difficulty}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {isPassed && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleViewTestRecord(sc)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11.5px' }}
                        title={`View Level ${sc.levelNumber} test record & forensic audit`}
                      >
                        <FileText size={12} />
                        <span>Record</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className={`btn btn-sm ${isUnlocked ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => isUnlocked && onSelectLevel(sc.levelNumber)}
                      disabled={!isUnlocked}
                      style={{
                        background: isUnlocked ? '#0284c7' : 'var(--bg-subtle)',
                        borderColor: isUnlocked ? '#0369a1' : 'var(--border-medium)',
                        color: isUnlocked ? '#ffffff' : 'var(--text-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {!isUnlocked && <Lock size={12} />}
                      <span>{isPassed ? 'Practice Again' : isUnlocked ? 'Launch Stream' : 'Locked'}</span>
                      {isUnlocked && <ArrowRight size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ====================================================================
          TERMINAL STREAM OPERATOR CERTIFICATIONS
         ==================================================================== */}
      <section className="md-panel tm-reveal" aria-labelledby="terminal-certs-heading">
        <div className="md-panel-head">
          <div>
            <span className="md-eyebrow" style={{ color: '#d97706' }}>
              <Trophy size={13} />
              <span>HDDE Operator Honors</span>
            </span>
            <h2 id="terminal-certs-heading" className="md-h2">
              Terminal Stream Certifications
            </h2>
            <p className="md-sub">
              Clear speed thresholds and forensic trap audits to earn verified Terminal operator credentials.
            </p>
          </div>

          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 800,
            color: '#0369a1',
            background: '#e0f2fe',
            padding: '5px 12px',
            borderRadius: '999px'
          }}>
            {progress.unlockedAchievements.length} / {TERMINAL_ACHIEVEMENTS.length} Unlocked
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '14px' }}>
          {TERMINAL_ACHIEVEMENTS.map(ach => {
            const isUnlocked = progress.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                onMouseEnter={handleBadgeHover}
                onMouseLeave={handleBadgeLeave}
                style={{
                  background: isUnlocked
                    ? 'linear-gradient(145deg, var(--bg-surface) 0%, rgba(224, 242, 254, 0.55) 100%)'
                    : 'var(--bg-main)',
                  border: `1.5px solid ${isUnlocked ? '#0284c7' : 'var(--border-light)'}`,
                  borderRadius: '14px',
                  padding: '15px',
                  opacity: isUnlocked ? 1 : 0.68,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  transition: 'box-shadow 0.18s ease, border-color 0.18s ease'
                }}
              >
                <div
                  className="tm-badge-icon"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '11px',
                    background: isUnlocked ? '#e0f2fe' : 'var(--bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Award size={19} color={isUnlocked ? '#0284c7' : 'var(--text-muted)'} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--icst-charcoal)', margin: 0 }}>
                      {ach.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Test Record Evaluation Modal (Preserved) */}
      {viewingEvaluation && (
        <TerminalEvaluationModal
          summary={viewingEvaluation.summary}
          scenario={viewingEvaluation.scenario}
          onClose={() => setViewingEvaluation(null)}
          onRetry={() => {
            const lvl = viewingEvaluation.scenario.levelNumber;
            setViewingEvaluation(null);
            onSelectLevel(lvl);
          }}
          onNextLevel={
            viewingEvaluation.scenario.levelNumber < 5
              ? () => {
                  const nextLvl = viewingEvaluation.scenario.levelNumber + 1;
                  setViewingEvaluation(null);
                  onSelectLevel(nextLvl);
                }
              : undefined
          }
          onShare={(sum) => {
            setShareModalEvaluation(sum);
          }}
        />
      )}

      {/* Share Modal (Preserved) */}
      {shareModalEvaluation && (
        <AchievementShareModal
          summary={{
            uid: `terminal-level-${shareModalEvaluation.levelNumber}`,
            levelNumber: shareModalEvaluation.levelNumber,
            stageNumber: 1,
            totalEvaluatedUnits: shareModalEvaluation.totalFieldsEvaluated,
            correctUnits: shareModalEvaluation.correctFields,
            incorrectUnits: shareModalEvaluation.incorrectFields,
            missingUnits: 0,
            timeTakenSeconds: shareModalEvaluation.timeTakenSeconds,
            timeLimitSeconds: 300,
            accuracyPercentage: shareModalEvaluation.netScorePercent,
            requiredAccuracy: 85,
            passed: shareModalEvaluation.passed,
            expEarned: shareModalEvaluation.expEarned,
            isGuidedMode: false,
            fieldResults: [],
            cellResults: [],
            unlockedAchievements: shareModalEvaluation.unlockedAchievements,
            submittedAt: shareModalEvaluation.submittedAt,
            studentIdentity: studentProgress.studentIdentity
          }}
          onClose={() => setShareModalEvaluation(null)}
        />
      )}
    </div>
  );
};
