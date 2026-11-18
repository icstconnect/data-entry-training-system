import React, { useState, useEffect, useRef } from 'react';
import { ExcelProgress, ExcelScenarioLevel, ExcelEvaluationSummary } from '../../types/excel';
import { ExcelEvaluationModal } from './ExcelEvaluationModal';
import { StudentProgress, Achievement } from '../../types';
import { EXCEL_LEVELS, EXCEL_ACHIEVEMENTS } from '../../data/excelScenariosData';
import { loadExcelProgress } from '../../services/excelStorageService';
import { isMasterUnlocked } from '../../services/masterUnlockService';
import { TrophyGraphic } from '../common/TrophyGraphic';
import { AchievementShareModal } from '../common/AchievementShareModal';
import { animate, createScope, stagger, spring } from 'animejs';
import '../common/moduleDashboard.css';
import './excel.css';

import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  Share2,
  ArrowRight,
  Layers,
  Award,
  Target,
  FileText,
  Play,
  Unlock,
  TrendingUp
} from 'lucide-react';

interface ExcelDashboardProps {
  onSelectLevel: (lvl: number) => void;
  studentProgress: StudentProgress;
}

type ExcelFilter = 'all' | 'unlocked' | 'completed';

const DEMO_CELLS = ['A1: 101', 'B1: 98%', 'C1: PASS', 'A2: 102', 'B2: 99%', 'C2: GOLD', 'A3: 103', 'B3: 100%', 'C3: PRO'];

export const ExcelDashboard: React.FC<ExcelDashboardProps> = ({
  onSelectLevel,
  studentProgress
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const expValRef = useRef<HTMLSpanElement | null>(null);

  const [excelProgress, setExcelProgress] = useState<ExcelProgress>(() => loadExcelProgress());
  const [selectedAchievementToShare, setSelectedAchievementToShare] = useState<Achievement | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<ExcelFilter>('all');
  const [activeCells, setActiveCells] = useState<number[]>([0, 4, 8]);
  const [viewingEvaluation, setViewingEvaluation] = useState<{
    summary: ExcelEvaluationSummary;
    level: ExcelScenarioLevel;
  } | null>(null);

  const handleViewExcelRecord = (lvl: ExcelScenarioLevel) => {
    const comp = excelProgress.completedLevels[lvl.levelNumber];
    if (!comp) return;

    const existing = (excelProgress.recentEvaluations || []).find(e => e.levelNumber === lvl.levelNumber);
    if (existing) {
      setViewingEvaluation({ summary: existing, level: lvl });
      return;
    }

    const totalCells = lvl.sourceRecords.length * lvl.columns.length;
    const correctCells = Math.round(totalCells * (comp.highestAccuracy / 100));

    const constructed: ExcelEvaluationSummary = {
      levelNumber: lvl.levelNumber,
      scenarioName: lvl.scenarioName,
      totalCells,
      correctCells,
      incorrectCells: totalCells - correctCells,
      missingCells: 0,
      accuracyPercentage: comp.highestAccuracy,
      requiredAccuracy: lvl.targetAccuracy,
      passed: comp.highestAccuracy >= lvl.targetAccuracy,
      timeTakenSeconds: comp.bestTimeSeconds,
      kph: 0,
      expEarned: lvl.expReward,
      discrepancies: [],
      unlockedAchievements: [],
      submittedAt: comp.completedAt || new Date().toISOString(),
      studentIdentity: studentProgress.studentIdentity
    };

    setViewingEvaluation({ summary: constructed, level: lvl });
  };

  useEffect(() => {
    setExcelProgress(loadExcelProgress());
  }, [studentProgress]);

  useEffect(() => {
    const refresh = () => setExcelProgress(loadExcelProgress());
    window.addEventListener('icst_data_cleared', refresh);
    window.addEventListener('icst_master_unlock_changed', refresh);
    return () => {
      window.removeEventListener('icst_data_cleared', refresh);
      window.removeEventListener('icst_master_unlock_changed', refresh);
    };
  }, []);

  const masterOpen = isMasterUnlocked();
  const totalCompleted = Object.keys(excelProgress.completedLevels).length;
  const completionPct = Math.round((totalCompleted / EXCEL_LEVELS.length) * 100);
  const unlockedAchCount = excelProgress.unlockedAchievements.length;
  const nextRecommendedLevel = Math.min(EXCEL_LEVELS.length, totalCompleted + 1);
  const ringCirc = 2 * Math.PI * 31;

  // Master anime.js v4 choreography
  useEffect(() => {
    if (!rootRef.current) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const scope = createScope({ root: rootRef.current }).add(() => {
      if (reduced) {
        if (expValRef.current) expValRef.current.textContent = excelProgress.totalExcelExp.toLocaleString();
        return;
      }

      animate('.ex-reveal', {
        translateY: [22, 0],
        opacity: [0, 1],
        duration: 620,
        delay: stagger(65),
        ease: 'outExpo'
      });

      animate('.md-hero-glow', {
        translateX: [0, -24, 14, 0],
        translateY: [0, 18, -10, 0],
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

      const targetOffset = ringCirc * (1 - completionPct / 100);
      animate('.ex-ring-progress', {
        strokeDashoffset: [ringCirc, targetOffset],
        duration: 1050,
        delay: 160,
        ease: 'outExpo'
      });

      if (expValRef.current) {
        const obj = { v: 0 };
        animate(obj, {
          v: excelProgress.totalExcelExp,
          duration: 950,
          delay: 120,
          ease: 'outExpo',
          onUpdate: () => {
            if (expValRef.current) expValRef.current.textContent = Math.round(obj.v).toLocaleString();
          }
        });
      }

      animate('.ex-scenario-card', {
        translateY: [18, 0],
        scale: [0.97, 1],
        opacity: [0, 1],
        duration: 540,
        delay: stagger(60, { start: 180 }),
        ease: 'outExpo'
      });
    });

    return () => scope.revert();
  }, [excelProgress.totalExcelExp, completionPct, ringCirc]);

  // Interactive hero 3x3 spreadsheet cell ripple
  const handleCellRipple = (idx: number) => {
    setActiveCells(prev => (prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]));
    const cells = rootRef.current?.querySelectorAll('.md-mini-cell');
    if (cells && cells.length > 0) {
      animate(cells, {
        scale: [
          { to: 0.9, duration: 85, ease: 'outQuad' },
          { to: 1.06, duration: 150, ease: 'outBack(1.6)' },
          { to: 1, duration: 150, ease: 'outQuad' }
        ],
        delay: stagger(42, { grid: [3, 3], from: idx })
      });
    }
  };

  const handleFilterChange = (next: ExcelFilter) => {
    setFilter(next);
    window.requestAnimationFrame(() => {
      const cards = cardsRef.current?.querySelectorAll('.ex-scenario-card');
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

  const handleShareClick = (ach: Achievement) => {
    setSelectedAchievementToShare(ach);
    setIsShareModalOpen(true);
  };

  const handleTrophyHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const svg = e.currentTarget.querySelector('svg');
    if (svg) {
      animate(svg, {
        scale: [1, 1.14, 1.06],
        rotate: [0, -5, 0],
        duration: 360,
        ease: spring({ stiffness: 320, damping: 14 })
      });
    }
  };

  const handleTrophyLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const svg = e.currentTarget.querySelector('svg');
    if (svg) {
      animate(svg, { scale: 1, rotate: 0, duration: 220, ease: 'outQuad' });
    }
  };

  const visibleLevels = EXCEL_LEVELS.filter(lvl => {
    const unlocked = masterOpen || lvl.levelNumber === 1 || !!excelProgress.completedLevels[lvl.levelNumber - 1];
    const completed = !!excelProgress.completedLevels[lvl.levelNumber];
    if (filter === 'unlocked') return unlocked;
    if (filter === 'completed') return completed;
    return true;
  });

  return (
    <div
      ref={rootRef}
      className="md-root"
      style={{
        '--md-accent': '#107c41',
        '--md-accent-dark': '#0b532c',
        '--md-hero-bg': 'linear-gradient(135deg, #072f1a 0%, #0d5e2e 52%, #107c41 100%)',
        '--md-glow': 'radial-gradient(circle, rgba(52, 211, 153, 0.34), transparent 70%)'
      } as React.CSSProperties}
    >
      {/* ====================================================================
          ANIMATED EMERALD HERO + INTERACTIVE MINI SPREADSHEET CONSOLE
         ==================================================================== */}
      <section className="md-hero ex-reveal" aria-label="Excel 365 Mass Lab Overview">
        <div className="md-hero-glow" aria-hidden="true" />
        <div className="md-hero-dots" aria-hidden="true" />

        <div className="md-hero-grid">
          <div>
            <span className="md-brand-eyebrow">
              <span className="md-pulse-dot" aria-hidden="true" />
              <span>ICST LAB • EXCEL 365 ENGINE • icstconnect.in</span>
            </span>

            <h1 className="md-hero-h1">
              Excel 365 Mass Data Lab
            </h1>

            <p className="md-hero-desc">
              Master high-density spreadsheet transcription across academic registers, wholesale depots, banking KYC ledgers, WBBSE marksheets, and census rolls with authentic Tab/Enter grid ergonomics.
            </p>

            <div className="md-hero-actions">
              <button
                type="button"
                className="md-btn-hero primary"
                onClick={() => onSelectLevel(nextRecommendedLevel)}
              >
                <Play size={15} fill="currentColor" />
                <span>{totalCompleted > 0 ? `Launch Level ${nextRecommendedLevel}` : 'Start Level 1 Sheet'}</span>
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

          {/* Right Console: Orbital Ring + Rolling EXP + Interactive 3x3 Ripple Grid */}
          <div className="md-hero-console">
            <div className="md-console-top">
              <div className="md-ring-wrap">
                <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
                  <circle cx="38" cy="38" r="31" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="6.5" />
                  <circle
                    className="ex-ring-progress"
                    cx="38"
                    cy="38"
                    r="31"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="6.5"
                    strokeLinecap="round"
                    strokeDasharray={ringCirc}
                    strokeDashoffset={ringCirc}
                    transform="rotate(-90 38 38)"
                  />
                </svg>
                <div className="md-ring-center">
                  <div className="md-ring-val" style={{ color: '#a7f3d0' }}>{completionPct}%</div>
                  <div className="md-ring-lbl">SHEETS</div>
                </div>
              </div>

              <div className="md-exp-stack">
                <span className="md-exp-lbl">Excel Lab EXP</span>
                <div className="md-exp-num">
                  <span ref={expValRef}>{excelProgress.totalExcelExp.toLocaleString()}</span>
                  <span style={{ fontSize: '12px', marginLeft: '4px', color: '#fde68a' }}>EXP</span>
                </div>
                <span style={{ fontSize: '11.5px', color: '#d1fae5', fontWeight: 700 }}>
                  {totalCompleted}/5 Scenarios • {unlockedAchCount}/5 Trophies
                </span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#a7f3d0', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>fx =INTERACTIVE_GRID({activeCells.length}/9)</span>
                <span style={{ opacity: 0.85 }}>Tap cells to ripple</span>
              </div>
              <div className="md-mini-grid-3x3">
                {DEMO_CELLS.map((label, idx) => (
                  <button
                    key={label}
                    type="button"
                    className={`md-mini-cell ${activeCells.includes(idx) ? 'active' : ''}`}
                    onClick={() => handleCellRipple(idx)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5 SCENARIO LEVELS EXPLORER WITH INTERACTIVE FILTER
         ==================================================================== */}
      <section className="md-panel ex-reveal" aria-labelledby="excel-scenarios-heading">
        <div className="md-panel-head">
          <div>
            <span className="md-eyebrow">
              <FileSpreadsheet size={13} />
              <span>Industrial Spreadsheet Registries</span>
            </span>
            <h2 id="excel-scenarios-heading" className="md-h2">
              5 Real-World Excel Scenarios
            </h2>
            <p className="md-sub">
              Pick any unlocked ledger to enter the full-screen Microsoft Excel 365 workbench.
            </p>
          </div>

          <div className="md-filter-bar" role="tablist" aria-label="Filter Excel scenarios">
            {([
              { id: 'all', label: `All (${EXCEL_LEVELS.length})` },
              { id: 'unlocked', label: 'Unlocked' },
              { id: 'completed', label: `Cleared (${totalCompleted})` }
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
          {visibleLevels.map((lvl) => {
            const isUnlocked = masterOpen || lvl.levelNumber === 1 || !!excelProgress.completedLevels[lvl.levelNumber - 1];
            const completion = excelProgress.completedLevels[lvl.levelNumber];
            const isPassed = !!completion;
            const totalCells = lvl.sourceRecords.length * lvl.columns.length;

            return (
              <div
                key={lvl.levelNumber}
                className={`md-card ex-scenario-card ${!isUnlocked ? 'is-locked' : ''}`}
                style={{ '--card-accent': isPassed ? '#15803d' : '#107c41' } as React.CSSProperties}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '8px' }}>
                    <span className="excel-domain-tag">{lvl.domain}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: isPassed ? '#dcfce7' : 'var(--bg-subtle)',
                      color: isPassed ? '#15803d' : 'var(--text-muted)'
                    }}>
                      LEVEL {lvl.levelNumber}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--icst-charcoal)', margin: '0 0 4px' }}>
                    {lvl.scenarioName}
                  </h3>
                  <div style={{ fontSize: '11.5px', color: '#b45309', fontWeight: 700, marginBottom: '8px' }}>
                    {lvl.scenarioSubtitle}
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 14px' }}>
                    {lvl.description}
                  </p>

                  <div className="excel-meta-pills">
                    <span className="excel-pill">
                      <Layers size={12} />
                      {lvl.columns.length}×{lvl.sourceRecords.length} ({totalCells} Cells)
                    </span>
                    <span className="excel-pill">
                      <Target size={12} color="#15803d" />
                      {lvl.targetAccuracy}% Target
                    </span>
                    <span className="excel-pill">
                      <Clock size={12} />
                      {Math.floor(lvl.timeLimitSeconds / 60)}m
                    </span>
                    <span className="excel-pill" style={{ background: '#fef3c7', color: '#92400e' }}>
                      <Sparkles size={12} color="#d97706" />
                      +{lvl.expReward} EXP
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-light)'
                }}>
                  <div>
                    {isPassed ? (
                      <div className="excel-level-status">
                        <CheckCircle2 size={15} color="#15803d" />
                        <span>Best: {completion.highestAccuracy}%</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {isUnlocked ? 'Ready to start' : 'Pass previous level'}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {isPassed && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleViewExcelRecord(lvl)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11.5px' }}
                      >
                        <FileText size={12} />
                        <span>Record</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className={`btn btn-sm ${isUnlocked ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => isUnlocked && onSelectLevel(lvl.levelNumber)}
                      disabled={!isUnlocked}
                      style={{
                        background: isUnlocked ? '#107c41' : 'var(--bg-subtle)',
                        borderColor: isUnlocked ? '#0d5e2e' : 'var(--border-medium)',
                        color: isUnlocked ? '#ffffff' : 'var(--text-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {!isUnlocked && <Lock size={12} />}
                      <span>{isPassed ? 'Practice Again' : isUnlocked ? 'Start Entry' : 'Locked'}</span>
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
          5 EXCEL REGISTRAR TROPHIES VAULT
         ==================================================================== */}
      <section className="md-panel ex-reveal" aria-labelledby="excel-trophies-heading">
        <div className="md-panel-head">
          <div>
            <span className="md-eyebrow" style={{ color: '#d97706' }}>
              <Award size={13} />
              <span>Certified Spreadsheet Honors</span>
            </span>
            <h2 id="excel-trophies-heading" className="md-h2">
              Excel Registrar Trophies
            </h2>
            <p className="md-sub">
              Unlock radiant SVG trophies automatically when you clear scenario accuracy targets.
            </p>
          </div>

          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 800,
            color: '#92400e',
            background: '#fef3c7',
            border: '1px solid #fde68a',
            padding: '5px 12px',
            borderRadius: '999px'
          }}>
            {unlockedAchCount} / {EXCEL_ACHIEVEMENTS.length} Unlocked
          </span>
        </div>

        <div className="excel-achieve-grid">
          {EXCEL_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = excelProgress.unlockedAchievements.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`excel-achieve-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                onMouseEnter={handleTrophyHover}
                onMouseLeave={handleTrophyLeave}
              >
                <TrophyGraphic achievementId={ach.id} isUnlocked={isUnlocked} size={62} />
                <div className="excel-achieve-title">{ach.title}</div>
                <div className="excel-achieve-desc">{ach.description}</div>

                <button
                  type="button"
                  className="excel-share-btn"
                  disabled={!isUnlocked}
                  onClick={() => handleShareClick(ach)}
                  title={isUnlocked ? 'Share your achievement certificate' : 'Locked: Complete this level requirement to unlock'}
                >
                  {isUnlocked ? (
                    <>
                      <Share2 size={13} color="#15803d" />
                      <span>Share Certificate</span>
                    </>
                  ) : (
                    <>
                      <Lock size={13} />
                      <span>Locked (Complete Task)</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ====================================================================
          RECENT BATCH AUDIT RECORDS
         ==================================================================== */}
      {excelProgress.recentEvaluations.length > 0 && (
        <section className="md-panel ex-reveal" aria-label="Recent Excel Batch Audits">
          <div className="md-panel-head" style={{ marginBottom: '12px' }}>
            <div>
              <span className="md-eyebrow">
                <TrendingUp size={13} />
                <span>Audit History</span>
              </span>
              <h2 className="md-h2">Recent Batch Evaluations</h2>
            </div>
          </div>

          <div style={{ border: '1px solid var(--border-light)', borderRadius: '14px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '10px 14px' }}>Date</th>
                  <th style={{ padding: '10px 14px' }}>Registry / Level</th>
                  <th style={{ padding: '10px 14px' }}>Accuracy</th>
                  <th style={{ padding: '10px 14px' }}>Speed</th>
                  <th style={{ padding: '10px 14px' }}>Result</th>
                  <th style={{ padding: '10px 14px' }}>EXP</th>
                </tr>
              </thead>
              <tbody>
                {excelProgress.recentEvaluations.slice(0, 6).map((evalItem, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>
                      {new Date(evalItem.submittedAt).toLocaleDateString()} {new Date(evalItem.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      L{evalItem.levelNumber}: {evalItem.scenarioName}
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: evalItem.passed ? '#15803d' : '#b91c1c' }}>
                      {evalItem.accuracyPercentage}%
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>
                      {evalItem.kph} KPH
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: 800,
                        padding: '2px 9px',
                        borderRadius: '999px',
                        background: evalItem.passed ? '#dcfce7' : '#fee2e2',
                        color: evalItem.passed ? '#166534' : '#991b1b'
                      }}>
                        {evalItem.passed ? 'PASSED' : 'RETRY'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#15803d' }}>
                      +{evalItem.expEarned}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Evaluation Record Preview Modal */}
      {viewingEvaluation && (
        <ExcelEvaluationModal
          summary={viewingEvaluation.summary}
          level={viewingEvaluation.level}
          onClose={() => setViewingEvaluation(null)}
          onRetry={() => {
            const lvlNum = viewingEvaluation.level.levelNumber;
            setViewingEvaluation(null);
            onSelectLevel(lvlNum);
          }}
          onShare={(summary) => {
            setViewingEvaluation(null);
            const ach = EXCEL_ACHIEVEMENTS[Math.min(EXCEL_ACHIEVEMENTS.length - 1, Math.max(0, summary.levelNumber - 1))];
            if (ach) handleShareClick(ach);
          }}
        />
      )}

      {/* Achievement Share Modal */}
      {isShareModalOpen && selectedAchievementToShare && (
        <AchievementShareModal
          summary={{
            uid: `excel-ach-${selectedAchievementToShare.id}`,
            levelNumber: selectedAchievementToShare.badgeLevel || 1,
            stageNumber: 1,
            totalEvaluatedUnits: 100,
            correctUnits: 98,
            incorrectUnits: 2,
            missingUnits: 0,
            timeTakenSeconds: 240,
            timeLimitSeconds: 300,
            accuracyPercentage: 98.5,
            requiredAccuracy: 80,
            passed: true,
            expEarned: 150,
            isGuidedMode: false,
            fieldResults: [],
            cellResults: [],
            unlockedAchievements: [selectedAchievementToShare],
            submittedAt: new Date().toISOString(),
            studentIdentity: studentProgress.studentIdentity
          }}
          achievement={selectedAchievementToShare}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};
