import React, { useState, useEffect, useRef } from 'react';
import { WindowsProgress, WindowsSimulationMode } from '../../types/windows';
import { StudentProgress } from '../../types';
import {
  FILE_MANAGEMENT_LEVELS,
  FOLDER_MANAGEMENT_LEVELS,
  WINDOWS_ACHIEVEMENTS
} from '../../data/windowsCurriculumData';
import { loadWindowsProgress } from '../../services/windowsStorageService';
import {
  isMasterUnlocked,
  verifyAndApplyMasterPassword,
  lockToStudentProgression
} from '../../services/masterUnlockService';
import {
  Key,
  Lock,
  Unlock,
  X,
  FolderTree,
  FolderOpen,
  Play,
  ArrowRight,
  Trophy,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import { animate, createScope, stagger, spring } from 'animejs';
import { AchievementsModal } from './modals/AchievementsModal';
import { CurriculumModal } from './modals/CurriculumModal';
import '../common/moduleDashboard.css';

interface WindowsDashboardProps {
  onStartSimulation: (mode: WindowsSimulationMode, level: number) => void;
  onBackToHome?: () => void;
  studentProgress?: StudentProgress;
}

export const WindowsDashboard: React.FC<WindowsDashboardProps> = ({
  onStartSimulation,
  onBackToHome,
  studentProgress
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const expRef = useRef<HTMLSpanElement | null>(null);
  const matrixRef = useRef<HTMLDivElement | null>(null);

  const [progress, setProgress] = useState<WindowsProgress>(() => loadWindowsProgress());
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [masterUnlocked, setMasterUnlockedState] = useState(() => isMasterUnlocked());
  const [showMasterPrompt, setShowMasterPrompt] = useState(false);
  const [masterPasswordInput, setMasterPasswordInput] = useState('');
  const [masterError, setMasterError] = useState<string | null>(null);
  const [matrixTab, setMatrixTab] = useState<WindowsSimulationMode>('file_management');

  useEffect(() => {
    const handleMasterUnlockChange = () => {
      setProgress(loadWindowsProgress());
      setMasterUnlockedState(isMasterUnlocked());
    };
    window.addEventListener('icst_master_unlock_changed', handleMasterUnlockChange);
    return () => window.removeEventListener('icst_master_unlock_changed', handleMasterUnlockChange);
  }, []);

  useEffect(() => {
    setProgress(loadWindowsProgress());
  }, [studentProgress]);

  useEffect(() => {
    const handleDataCleared = () => setProgress(loadWindowsProgress());
    window.addEventListener('icst_data_cleared', handleDataCleared);
    return () => window.removeEventListener('icst_data_cleared', handleDataCleared);
  }, []);

  const fileLevelsList = Object.values(FILE_MANAGEMENT_LEVELS).sort((a, b) => a.levelNumber - b.levelNumber);
  const folderLevelsList = Object.values(FOLDER_MANAGEMENT_LEVELS).sort((a, b) => a.levelNumber - b.levelNumber);

  const fileCompletedCount = Object.keys(progress.fileManagementCompleted).filter(
    k => progress.fileManagementCompleted[Number(k)]?.score === 100
  ).length;
  const filePercent = Math.round((fileCompletedCount / 5) * 100);

  const folderCompletedCount = Object.keys(progress.folderManagementCompleted).filter(
    k => progress.folderManagementCompleted[Number(k)]?.score === 100
  ).length;
  const folderPercent = Math.round((folderCompletedCount / 7) * 100);

  const totalCleared = fileCompletedCount + folderCompletedCount;
  const totalPct = Math.round((totalCleared / 12) * 100);
  const ringCirc = 2 * Math.PI * 31;

  // Master anime.js v4 entrance & motion choreography
  useEffect(() => {
    if (!rootRef.current) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const scope = createScope({ root: rootRef.current }).add(() => {
      if (reduced) {
        if (expRef.current) expRef.current.textContent = progress.totalWindowsExp.toLocaleString();
        rootRef.current?.querySelectorAll<HTMLElement>('[data-target-width]').forEach(el => {
          el.style.width = `${el.dataset.targetWidth}%`;
        });
        return;
      }

      animate('.win-reveal', {
        translateY: [22, 0],
        opacity: [0, 1],
        duration: 620,
        delay: stagger(65),
        ease: 'outExpo'
      });

      animate('.md-hero-glow', {
        translateX: [0, -20, 16, 0],
        translateY: [0, 16, -12, 0],
        duration: 13500,
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

      const targetOffset = ringCirc * (1 - totalPct / 100);
      animate('.win-ring-progress', {
        strokeDashoffset: [ringCirc, targetOffset],
        duration: 1050,
        delay: 160,
        ease: 'outExpo'
      });

      if (expRef.current) {
        const obj = { v: 0 };
        animate(obj, {
          v: progress.totalWindowsExp,
          duration: 950,
          delay: 120,
          ease: 'outExpo',
          onUpdate: () => {
            if (expRef.current) expRef.current.textContent = Math.round(obj.v).toLocaleString();
          }
        });
      }

      rootRef.current?.querySelectorAll<HTMLElement>('[data-target-width]').forEach((el, i) => {
        animate(el, {
          width: ['0%', `${el.dataset.targetWidth}%`],
          duration: 850,
          delay: 200 + i * 80,
          ease: 'outExpo'
        });
      });

      animate('.win-svg-dash', {
        strokeDashoffset: [40, 0],
        duration: 1700,
        loop: true,
        ease: 'linear'
      });
    });

    return () => scope.revert();
  }, [progress.totalWindowsExp, totalPct, ringCirc]);

  const handleMatrixSwitch = (mode: WindowsSimulationMode) => {
    setMatrixTab(mode);
    window.requestAnimationFrame(() => {
      const rows = matrixRef.current?.querySelectorAll('.win-matrix-item');
      if (rows && rows.length > 0) {
        animate(rows, {
          translateY: [14, 0],
          opacity: [0, 1],
          duration: 380,
          delay: stagger(42),
          ease: 'outExpo'
        });
      }
    });
  };

  const handleMasterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = verifyAndApplyMasterPassword(masterPasswordInput);
    if (res.success) {
      setMasterUnlockedState(true);
      setProgress(loadWindowsProgress());
      setShowMasterPrompt(false);
      setMasterPasswordInput('');
      setMasterError(null);
    } else {
      setMasterError('Invalid passcode. Enter ICST to unlock all 12 levels.');
    }
  };

  const handlePillBounce = (e: React.MouseEvent<HTMLButtonElement>) => {
    animate(e.currentTarget, {
      scale: [1, 1.09, 1],
      duration: 280,
      ease: spring({ stiffness: 360, damping: 15 })
    });
  };

  return (
    <div
      ref={rootRef}
      className="md-root"
      style={{
        '--md-accent': '#0284c7',
        '--md-accent-dark': '#0c4a6e',
        '--md-hero-bg': 'linear-gradient(135deg, #0b1930 0%, #0c3b66 55%, #0284c7 100%)',
        '--md-glow': 'radial-gradient(circle, rgba(56, 189, 248, 0.34), transparent 70%)'
      } as React.CSSProperties}
    >
      {/* ====================================================================
          ANIMATED FLUENT WINDOWS 11 HERO
         ==================================================================== */}
      <section className="md-hero win-reveal" aria-label="Windows 11 Organization Lab Overview">
        <div className="md-hero-glow" aria-hidden="true" />
        <div className="md-hero-dots" aria-hidden="true" />

        <div className="md-hero-grid">
          <div>
            <span className="md-brand-eyebrow">
              <span className="md-pulse-dot" aria-hidden="true" />
              <span>ICST LAB • WINDOWS 11 FLUENT SIMULATOR • icstconnect.in</span>
            </span>

            <h1 className="md-hero-h1">
              Windows 11 File &amp; Folder Architecture
            </h1>

            <p className="md-hero-desc">
              Master desktop extensions (.pdf, .docx, .xlsx), ISO 8601 naming, F2 batch renaming, junk cleanup, and multi-tier enterprise folder trees across 12 guided desktop levels.
            </p>

            <div className="md-hero-actions">
              <button
                type="button"
                className="md-btn-hero primary"
                onClick={() => onStartSimulation('file_management', progress.fileManagementCurrentLevel)}
              >
                <Play size={15} fill="currentColor" />
                <span>Resume File Lab (L{progress.fileManagementCurrentLevel})</span>
              </button>

              <button
                type="button"
                className="md-btn-hero ghost"
                onClick={() => setIsAchievementsOpen(true)}
              >
                <Trophy size={14} color="#fbbf24" />
                <span>Badges ({progress.unlockedAchievements.length}/{WINDOWS_ACHIEVEMENTS.length})</span>
              </button>

              <button
                type="button"
                className="md-btn-hero ghost"
                onClick={() => setIsCurriculumOpen(true)}
              >
                <BookOpen size={14} />
                <span>Curriculum</span>
              </button>

              {masterUnlocked ? (
                <button
                  type="button"
                  className="md-btn-hero unlocked"
                  onClick={() => {
                    lockToStudentProgression();
                    setMasterUnlockedState(false);
                    setProgress(loadWindowsProgress());
                  }}
                  title="Click to lock back to student progression"
                >
                  <Unlock size={14} />
                  <span>Master Unlocked</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="md-btn-hero ghost"
                  onClick={() => {
                    setShowMasterPrompt(true);
                    setMasterError(null);
                    setMasterPasswordInput('');
                  }}
                >
                  <Key size={14} />
                  <span>Master Unlock</span>
                </button>
              )}

              {onBackToHome && (
                <button type="button" className="md-btn-hero ghost" onClick={onBackToHome}>
                  <span>← Hub</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Console: Orbital Ring + Live Folder Tree Graphic */}
          <div className="md-hero-console">
            <div className="md-console-top">
              <div className="md-ring-wrap">
                <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
                  <circle cx="38" cy="38" r="31" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="6.5" />
                  <circle
                    className="win-ring-progress"
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
                  <div className="md-ring-val" style={{ color: '#7dd3fc' }}>{totalPct}%</div>
                  <div className="md-ring-lbl">OS LAB</div>
                </div>
              </div>

              <div className="md-exp-stack">
                <span className="md-exp-lbl">Windows Lab EXP</span>
                <div className="md-exp-num">
                  <span ref={expRef}>{progress.totalWindowsExp.toLocaleString()}</span>
                  <span style={{ fontSize: '12px', marginLeft: '4px', color: '#fde68a' }}>EXP</span>
                </div>
                <span style={{ fontSize: '11.5px', color: '#bae6fd', fontWeight: 700 }}>
                  {totalCleared}/12 Levels • {progress.unlockedAchievements.length}/10 Badges
                </span>
              </div>
            </div>

            {/* Graphical Tree Flow Preview */}
            <svg viewBox="0 0 280 76" fill="none" style={{ width: '100%', height: '72px' }} aria-hidden="true">
              <rect x="6" y="20" width="76" height="36" rx="9" fill="rgba(56,189,248,0.22)" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="44" y="42" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="800" fontFamily="monospace">C:\ICST</text>
              <path d="M82 38H116V18H134M116 38V58H134" stroke="rgba(125,211,252,0.45)" strokeWidth="2" />
              <path d="M82 38H116V18H134M116 38V58H134" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 10" className="win-svg-dash" />
              <rect x="134" y="5" width="138" height="26" rx="7" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" />
              <text x="203" y="22" textAnchor="middle" fill="#e0f2fe" fontSize="10" fontWeight="700" fontFamily="monospace">Files ({fileCompletedCount}/5)</text>
              <rect x="134" y="45" width="138" height="26" rx="7" fill="rgba(16,185,129,0.22)" stroke="#34d399" />
              <text x="203" y="62" textAnchor="middle" fill="#d1fae5" fontSize="10" fontWeight="700" fontFamily="monospace">Folders ({folderCompletedCount}/7)</text>
            </svg>
          </div>
        </div>
      </section>

      {/* ====================================================================
          DUAL INTERACTIVE TRACKS: FILE MANAGEMENT & FOLDER MANAGEMENT
         ==================================================================== */}
      <div className="md-track-grid-2">
        {/* Track 1: File Management */}
        <section
          className="md-panel win-reveal"
          style={{ '--md-accent': '#0078d4' } as React.CSSProperties}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FolderOpen size={22} color="#0078d4" />
              </span>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: 'var(--icst-charcoal)' }}>
                  File Management Lab
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  5 Progressive Levels • 750 EXP Max
                </span>
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 800, color: '#0369a1', background: '#e0f2fe', padding: '4px 10px', borderRadius: '999px' }}>
              {fileCompletedCount}/5 ({filePercent}%)
            </span>
          </div>

          <div className="md-bar-track" style={{ marginBottom: '14px' }}>
            <div className="md-bar-fill" data-target-width={filePercent} style={{ background: 'linear-gradient(90deg, #0078d4, #38bdf8)' }} />
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
            Classify extensions (.docx, .pptx, .xlsx, .mp4, .jpeg), academic subjects, ISO 8601 timestamps, studio pipelines, and AI data folders.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '7px', marginBottom: '16px' }}>
            {fileLevelsList.map(lvl => {
              const isCleared = progress.fileManagementCompleted[lvl.levelNumber]?.score === 100;
              const isUnlocked = masterUnlocked || lvl.levelNumber <= progress.fileManagementMaxUnlocked;
              return (
                <button
                  key={lvl.levelNumber}
                  type="button"
                  className="md-level-btn"
                  disabled={!isUnlocked}
                  onMouseEnter={handlePillBounce}
                  onClick={() => isUnlocked && onStartSimulation('file_management', lvl.levelNumber)}
                  style={{
                    borderColor: isCleared ? '#10b981' : isUnlocked ? '#0078d4' : undefined,
                    background: isCleared ? '#ecfdf5' : isUnlocked ? '#eff6ff' : undefined,
                    color: isCleared ? '#065f46' : isUnlocked ? '#1e40af' : undefined
                  }}
                  title={`Level ${lvl.levelNumber}: ${lvl.title}`}
                >
                  <span>{isCleared ? '✓' : isUnlocked ? `L${lvl.levelNumber}` : '🔒'}</span>
                  <span style={{ fontSize: '9px', opacity: 0.85 }}>+{lvl.levelNumber * 50}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', background: '#0078d4', borderColor: '#005a9e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={() => onStartSimulation('file_management', progress.fileManagementCurrentLevel)}
          >
            <Play size={15} fill="currentColor" />
            <span>Launch File Lab (Level {progress.fileManagementCurrentLevel})</span>
            <ArrowRight size={15} />
          </button>
        </section>

        {/* Track 2: Folder Management */}
        <section
          className="md-panel win-reveal"
          style={{ '--md-accent': '#059669' } as React.CSSProperties}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FolderTree size={22} color="#059669" />
              </span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: 'var(--icst-charcoal)' }}>
                    Folder Management Lab
                  </h2>
                  <span style={{ fontSize: '10px', background: '#dcfce7', color: '#15803d', fontWeight: 800, padding: '2px 7px', borderRadius: '999px' }}>
                    PRO
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  7 Progressive Levels • 1,400 EXP Max
                </span>
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 800, color: '#065f46', background: '#dcfce7', padding: '4px 10px', borderRadius: '999px' }}>
              {folderCompletedCount}/7 ({folderPercent}%)
            </span>
          </div>

          <div className="md-bar-track" style={{ marginBottom: '14px' }}>
            <div className="md-bar-fill" data-target-width={folderPercent} style={{ background: 'linear-gradient(90deg, #059669, #34d399)' }} />
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px' }}>
            Build deep folder hierarchies from scratch: subfolder nesting, F2 renaming, junk deletion, corporate directories, DevOps repos, and cloud trees.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', marginBottom: '16px' }}>
            {folderLevelsList.map(lvl => {
              const isCleared = progress.folderManagementCompleted[lvl.levelNumber]?.score === 100;
              const isUnlocked = masterUnlocked || lvl.levelNumber <= progress.folderManagementMaxUnlocked;
              return (
                <button
                  key={lvl.levelNumber}
                  type="button"
                  className="md-level-btn"
                  disabled={!isUnlocked}
                  onMouseEnter={handlePillBounce}
                  onClick={() => isUnlocked && onStartSimulation('folder_management', lvl.levelNumber)}
                  style={{
                    borderColor: isCleared ? '#10b981' : isUnlocked ? '#059669' : undefined,
                    background: isCleared ? '#dcfce7' : isUnlocked ? '#f0fdf4' : undefined,
                    color: isCleared ? '#065f46' : isUnlocked ? '#166534' : undefined
                  }}
                  title={`Level ${lvl.levelNumber}: ${lvl.title}`}
                >
                  <span>{isCleared ? '✓' : isUnlocked ? `L${lvl.levelNumber}` : '🔒'}</span>
                  <span style={{ fontSize: '8.5px', opacity: 0.85 }}>+{lvl.levelNumber * 50}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', background: '#059669', borderColor: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={() => onStartSimulation('folder_management', progress.folderManagementCurrentLevel)}
          >
            <Play size={15} fill="currentColor" />
            <span>Launch Folder Lab (Level {progress.folderManagementCurrentLevel})</span>
            <ArrowRight size={15} />
          </button>
        </section>
      </div>

      {/* ====================================================================
          INTERACTIVE CURRICULUM ROADMAP EXPLORER
         ==================================================================== */}
      <section className="md-panel win-reveal" aria-labelledby="win-matrix-heading">
        <div className="md-panel-head">
          <div>
            <span className="md-eyebrow">
              <Layers size={13} />
              <span>Interactive Level Roadmap</span>
            </span>
            <h2 id="win-matrix-heading" className="md-h2">
              Pedagogical Curriculum Explorer
            </h2>
          </div>

          <div className="md-filter-bar" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={matrixTab === 'file_management'}
              className={`md-filter-btn ${matrixTab === 'file_management' ? 'active' : ''}`}
              onClick={() => handleMatrixSwitch('file_management')}
            >
              File Track (5)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={matrixTab === 'folder_management'}
              className={`md-filter-btn ${matrixTab === 'folder_management' ? 'active' : ''}`}
              onClick={() => handleMatrixSwitch('folder_management')}
            >
              Folder Track (7)
            </button>
          </div>
        </div>

        <div ref={matrixRef} className="md-cards-grid">
          {(matrixTab === 'file_management' ? fileLevelsList : folderLevelsList).map(lvl => {
            const isFile = matrixTab === 'file_management';
            const isCleared = isFile
              ? progress.fileManagementCompleted[lvl.levelNumber]?.score === 100
              : progress.folderManagementCompleted[lvl.levelNumber]?.score === 100;
            const isUnlocked = masterUnlocked || (isFile
              ? lvl.levelNumber <= progress.fileManagementMaxUnlocked
              : lvl.levelNumber <= progress.folderManagementMaxUnlocked);

            return (
              <div
                key={`${matrixTab}-${lvl.levelNumber}`}
                className={`md-card win-matrix-item ${!isUnlocked ? 'is-locked' : ''}`}
                style={{ '--card-accent': isFile ? '#0078d4' : '#059669' } as React.CSSProperties}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, color: isFile ? '#0078d4' : '#059669' }}>
                      LEVEL {lvl.levelNumber} • {lvl.badge}
                    </span>
                    {isCleared && <CheckCircle2 size={15} color="#15803d" />}
                  </div>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 800, margin: '0 0 6px', color: 'var(--icst-charcoal)' }}>
                    {lvl.title}
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.48 }}>
                    {lvl.goal}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 800, color: '#d97706' }}>
                    <Sparkles size={11} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                    +{lvl.levelNumber * 50} EXP
                  </span>
                  <button
                    type="button"
                    className={`btn btn-sm ${isUnlocked ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={!isUnlocked}
                    onClick={() => isUnlocked && onStartSimulation(matrixTab, lvl.levelNumber)}
                    style={{
                      background: isUnlocked ? (isFile ? '#0078d4' : '#059669') : undefined,
                      borderColor: isUnlocked ? (isFile ? '#005a9e' : '#047857') : undefined,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {isUnlocked ? <Play size={12} fill="currentColor" /> : <Lock size={12} />}
                    <span>{isCleared ? 'Replay' : isUnlocked ? 'Start' : 'Locked'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Master Unlock Password Modal */}
      {showMasterPrompt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            zIndex: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={e => {
            if (e.target === e.currentTarget) setShowMasterPrompt(false);
          }}
        >
          <div style={{
            width: '100%',
            maxWidth: '380px',
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-medium)',
            borderRadius: '18px',
            padding: '22px',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.35)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '16px' }}>
                <Key size={18} color="#0284c7" />
                <span>Master Lab Override</span>
              </div>
              <button type="button" onClick={() => setShowMasterPrompt(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Enter Master Passcode (Hint: <strong>ICST</strong>) to unlock all 12 Windows Lab levels.
            </p>
            <form onSubmit={handleMasterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="password"
                value={masterPasswordInput}
                onChange={e => {
                  setMasterPasswordInput(e.target.value);
                  setMasterError(null);
                }}
                placeholder="Enter ICST"
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: `1.5px solid ${masterError ? '#ef4444' : 'var(--border-medium)'}`,
                  background: 'var(--bg-main)'
                }}
              />
              {masterError && <span style={{ color: '#dc2626', fontSize: '11.5px', fontWeight: 700 }}>{masterError}</span>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowMasterPrompt(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Unlock All Levels
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Existing Modals Preserved */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        unlockedIds={progress.unlockedAchievements}
      />
      <CurriculumModal
        isOpen={isCurriculumOpen}
        onClose={() => setIsCurriculumOpen(false)}
      />
    </div>
  );
};
