import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StudentProgress, Achievement, StageValidationSummary } from '../../types';
import { LEVELS_INFO, STAGES } from '../../data/stagesConfig';
import { ALL_ACHIEVEMENTS, UNIFIED_SYSTEM_ACHIEVEMENTS } from '../../services/achievementEngine';
import { EXCEL_ACHIEVEMENTS } from '../../data/excelScenariosData';
import { WINDOWS_ACHIEVEMENTS } from '../../data/windowsCurriculumData';
import { loadExcelProgress } from '../../services/excelStorageService';
import { loadWindowsProgress } from '../../services/windowsStorageService';
import { loadTerminalProgress } from '../../services/terminalStorageService';
import { loadTouchTypingProgress } from '../../services/touchTypingStorageService';
import { loadWordExpressProgress } from '../../services/wordExpressStorageService';
import {
  OPERATOR_RANKS,
  getRankForExp,
  calculateGlobalExpBreakdown
} from '../../services/expEngine';
import { ICST_CONNECT } from '../../config/appConfig';
import { AchievementShareModal } from '../common/AchievementShareModal';
import { TrophyGraphic } from '../common/TrophyGraphic';
import { animate, createScope, stagger, spring } from 'animejs';
import {
  Trophy,
  Award,
  CheckCircle2,
  TrendingUp,
  Play,
  Sparkles,
  Lock,
  Target,
  Share2,
  Eye,
  Keyboard,
  FileSpreadsheet,
  FolderTree,
  Terminal,
  Rocket,
  GraduationCap,
  ArrowRight,
  Zap,
  User,
  Activity,
  ExternalLink,
  Layers
} from 'lucide-react';
import './studentDashboard.css';

interface StudentDashboardProps {
  progress: StudentProgress;
  onSelectStage: (level: number, stage: number) => void;
  onOpenTyping?: () => void;
  onOpenExcel?: () => void;
  onOpenWindows?: () => void;
  onOpenTerminal?: () => void;
  onOpenWordExpress?: () => void;
  onOpenStudentSetup?: () => void;
  onOpenAchievementShare?: () => void;
}

type DashboardTab = 'curriculum' | 'trophies' | 'activity';
type TrophyFilter = 'all' | 'unlocked' | 'locked' | 'practice' | 'excel' | 'windows';
type ActivityFilter = 'all' | 'passed' | 'retry';

interface UnifiedActivityRow {
  id: string;
  lab: 'Practice' | 'Excel' | 'Terminal';
  labColor: string;
  label: string;
  refCode: string;
  accuracy: number;
  exp: number;
  durationSeconds: number;
  passed: boolean;
  submittedAt: string;
  retryAction: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  progress,
  onSelectStage,
  onOpenTyping,
  onOpenExcel,
  onOpenWindows,
  onOpenTerminal,
  onOpenWordExpress,
  onOpenStudentSetup,
  onOpenAchievementShare
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tabContentRef = useRef<HTMLDivElement | null>(null);
  const expCounterRef = useRef<HTMLSpanElement | null>(null);

  const [selectedAchievementForShare, setSelectedAchievementForShare] = useState<Achievement | null>(null);

  // Load real progress across ALL 6 ICST LAB modules
  const [excelProgress] = useState(() => loadExcelProgress());
  const [winProgress] = useState(() => loadWindowsProgress());
  const [terminalProgress] = useState(() => loadTerminalProgress());
  const [typingProgress] = useState(() => loadTouchTypingProgress());
  const [wordExpressProgress] = useState(() => loadWordExpressProgress());
  const [expBreakdown] = useState(() => calculateGlobalExpBreakdown());

  // Interactive UI controls
  const [activeTab, setActiveTab] = useState<DashboardTab>('curriculum');
  const [selectedLevel, setSelectedLevel] = useState<number>(() => Math.min(5, Math.max(1, progress.currentLevel || 1)));
  const [trophyFilter, setTrophyFilter] = useState<TrophyFilter>('all');
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');

  const totalExp = Math.max(progress.totalExp || 0, expBreakdown.totalExp);
  const { currentRank, nextRank, progressPercent: rankProgressPct } = useMemo(
    () => getRankForExp(totalExp),
    [totalExp]
  );

  const [inspectedRankIdx, setInspectedRankIdx] = useState<number>(() => {
    const idx = OPERATOR_RANKS.findIndex(r => r.title === currentRank.title);
    return idx >= 0 ? idx : 0;
  });

  // Per-lab completion metrics
  const practiceDone = Object.keys(progress.completedStages || {}).length;
  const practiceTotal = STAGES.length; // 18

  const excelDone = Object.keys(excelProgress.completedLevels || {}).length;
  const excelTotal = 5;

  const winFileDone = Object.keys(winProgress.fileManagementCompleted || {}).length;
  const winFolderDone = Object.keys(winProgress.folderManagementCompleted || {}).length;
  const winDone = winFileDone + winFolderDone;
  const winTotal = 12;

  const terminalDone = Object.keys(terminalProgress.completedScenarios || {}).length;
  const terminalTotal = 5;

  const typingDone = Object.values(typingProgress.completedLevels || {}).filter(r => r.passed || r.completed).length;
  const typingTotal = 25;
  const typingStars = Object.values(typingProgress.completedLevels || {}).reduce((s, r) => s + (r.stars || 0), 0);

  const wordExpressDone = Object.values(wordExpressProgress.completedLevels || {}).filter(r => r.passed || r.completed).length;
  const wordExpressTotal = 25;

  const globalCompleted = practiceDone + excelDone + winDone + terminalDone + typingDone + wordExpressDone;
  const globalTotal = practiceTotal + excelTotal + winTotal + terminalTotal + typingTotal + wordExpressTotal; // 90
  const globalPercent = Math.round((globalCompleted / Math.max(1, globalTotal)) * 100);

  // Unified unlocked trophy set across Practice, Excel & Windows
  const unlockedSet = useMemo(() => {
    const s = new Set<string>();
    (progress.unlockedAchievements || []).forEach(id => s.add(id));
    (excelProgress.unlockedAchievements || []).forEach(id => s.add(id));
    (winProgress.unlockedAchievements || []).forEach(id => s.add(id));
    return s;
  }, [progress.unlockedAchievements, excelProgress.unlockedAchievements, winProgress.unlockedAchievements]);

  const totalUnlockedTrophies = UNIFIED_SYSTEM_ACHIEVEMENTS.filter(a => unlockedSet.has(a.id)).length;
  const totalTrophiesCount = UNIFIED_SYSTEM_ACHIEVEMENTS.length;
  const trophyPercent = Math.round((totalUnlockedTrophies / Math.max(1, totalTrophiesCount)) * 100);

  // Peak Speed & Accuracy Telemetry
  const bestWpm = Math.max(typingProgress.bestWpm || 0, wordExpressProgress.bestWpm || 0, terminalProgress.bestNetWpm || 0);
  const highestKph = terminalProgress.highestKPH || 0;

  // Unified recent activity across Practice, Excel, and Terminal
  const unifiedActivities = useMemo<UnifiedActivityRow[]>(() => {
    const rows: UnifiedActivityRow[] = [];

    (progress.recentAttempts || []).forEach((att, idx) => {
      rows.push({
        id: `p-${idx}-${att.submittedAt}`,
        lab: 'Practice',
        labColor: '#1c6aa7',
        label: `L${att.levelNumber} • Stage ${att.stageNumber}`,
        refCode: att.uid,
        accuracy: att.accuracyPercentage,
        exp: att.expEarned,
        durationSeconds: att.timeTakenSeconds,
        passed: att.passed,
        submittedAt: att.submittedAt,
        retryAction: () => onSelectStage(att.levelNumber, att.stageNumber)
      });
    });

    (excelProgress.recentEvaluations || []).forEach((ev, idx) => {
      rows.push({
        id: `e-${idx}-${ev.submittedAt}`,
        lab: 'Excel',
        labColor: '#107c41',
        label: `Excel L${ev.levelNumber} • ${ev.scenarioName}`,
        refCode: `${ev.kph} KPH`,
        accuracy: ev.accuracyPercentage,
        exp: ev.expEarned,
        durationSeconds: ev.timeTakenSeconds,
        passed: ev.passed,
        submittedAt: ev.submittedAt,
        retryAction: () => onOpenExcel?.()
      });
    });

    (terminalProgress.recentEvaluations || []).forEach((ev, idx) => {
      rows.push({
        id: `t-${idx}-${ev.submittedAt}`,
        lab: 'Terminal',
        labColor: '#0369a1',
        label: `Terminal L${ev.levelNumber} • ${ev.domain}`,
        refCode: `${ev.calculatedKPH} KPH`,
        accuracy: ev.netScorePercent,
        exp: ev.expEarned,
        durationSeconds: ev.timeTakenSeconds,
        passed: ev.passed,
        submittedAt: ev.submittedAt,
        retryAction: () => onOpenTerminal?.()
      });
    });

    return rows.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [progress.recentAttempts, excelProgress.recentEvaluations, terminalProgress.recentEvaluations, onSelectStage, onOpenExcel, onOpenTerminal]);

  const averageAccuracy = useMemo(() => {
    if (unifiedActivities.length === 0) {
      return typingProgress.averageAccuracy || 100;
    }
    const sum = unifiedActivities.reduce((acc, r) => acc + r.accuracy, 0);
    return Math.round(sum / unifiedActivities.length);
  }, [unifiedActivities, typingProgress.averageAccuracy]);

  // 6-Lab Matrix Data
  const labModules = useMemo(() => [
    {
      id: 'practice',
      name: 'Practice & Marksheets',
      accent: '#1c6aa7',
      tint: '#edf4fa',
      icon: <GraduationCap size={18} color="#1c6aa7" />,
      done: practiceDone,
      total: practiceTotal,
      pct: Math.round((practiceDone / practiceTotal) * 100),
      exp: expBreakdown.practiceExp,
      highlight: `Level ${progress.currentLevel} Active`,
      onLaunch: () => onSelectStage(progress.currentLevel || 1, 1)
    },
    {
      id: 'excel',
      name: 'Excel 365 Mass Lab',
      accent: '#107c41',
      tint: '#ecfdf5',
      icon: <FileSpreadsheet size={18} color="#107c41" />,
      done: excelDone,
      total: excelTotal,
      pct: Math.round((excelDone / excelTotal) * 100),
      exp: expBreakdown.excelExp,
      highlight: `${excelProgress.unlockedAchievements.length}/${EXCEL_ACHIEVEMENTS.length} Trophies`,
      onLaunch: () => onOpenExcel?.()
    },
    {
      id: 'windows',
      name: 'Windows 11 Org Lab',
      accent: '#0284c7',
      tint: '#eff6ff',
      icon: <FolderTree size={18} color="#0284c7" />,
      done: winDone,
      total: winTotal,
      pct: Math.round((winDone / winTotal) * 100),
      exp: expBreakdown.windowsExp,
      highlight: `${winProgress.unlockedAchievements.length}/${WINDOWS_ACHIEVEMENTS.length} Badges`,
      onLaunch: () => onOpenWindows?.()
    },
    {
      id: 'terminal',
      name: 'Terminal Stream HDDE',
      accent: '#0369a1',
      tint: '#f0f9ff',
      icon: <Terminal size={18} color="#0369a1" />,
      done: terminalDone,
      total: terminalTotal,
      pct: Math.round((terminalDone / terminalTotal) * 100),
      exp: expBreakdown.terminalExp,
      highlight: highestKph > 0 ? `Peak ${highestKph.toLocaleString()} KPH` : '5 Enterprise Streams',
      onLaunch: () => onOpenTerminal?.()
    },
    {
      id: 'typing',
      name: 'Touch Typing Lab',
      accent: '#0891b2',
      tint: '#ecfeff',
      icon: <Keyboard size={18} color="#0891b2" />,
      done: typingDone,
      total: typingTotal,
      pct: Math.round((typingDone / typingTotal) * 100),
      exp: expBreakdown.typingExp,
      highlight: `${typingProgress.bestWpm || 0} WPM • ${typingStars} ★`,
      onLaunch: () => onOpenTyping?.()
    },
    {
      id: 'word-express',
      name: 'Word Express Lab',
      accent: '#7c3aed',
      tint: '#f5f3ff',
      icon: <Rocket size={18} color="#7c3aed" />,
      done: wordExpressDone,
      total: wordExpressTotal,
      pct: Math.round((wordExpressDone / wordExpressTotal) * 100),
      exp: expBreakdown.wordExpressExp,
      highlight: `${wordExpressProgress.bestWpm || 0} WPM • Fleet Tier ${wordExpressProgress.highestCarrierTier || 1}`,
      onLaunch: () => onOpenWordExpress?.()
    }
  ], [
    practiceDone, practiceTotal, excelDone, excelTotal, winDone, winTotal,
    terminalDone, terminalTotal, typingDone, typingTotal, wordExpressDone, wordExpressTotal,
    expBreakdown, progress.currentLevel, excelProgress.unlockedAchievements.length,
    winProgress.unlockedAchievements.length, highestKph, typingProgress.bestWpm,
    typingStars, wordExpressProgress.bestWpm, wordExpressProgress.highestCarrierTier,
    onSelectStage, onOpenExcel, onOpenWindows, onOpenTerminal, onOpenTyping, onOpenWordExpress
  ]);

  // Master anime.js v4 entrance & ambient motion choreography
  useEffect(() => {
    if (!rootRef.current) return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const scope = createScope({ root: rootRef.current }).add(() => {
      if (reducedMotion) {
        if (expCounterRef.current) {
          expCounterRef.current.textContent = totalExp.toLocaleString();
        }
        rootRef.current?.querySelectorAll<HTMLElement>('[data-target-width]').forEach(el => {
          el.style.width = `${el.dataset.targetWidth}%`;
        });
        return;
      }

      // 1. Hero & KPI staggered spring reveal
      animate('.sd-reveal', {
        translateY: [22, 0],
        opacity: [0, 1],
        duration: 640,
        delay: stagger(65),
        ease: 'outExpo'
      });

      // 2. Ambient hero glow & live status pulse
      animate('.sd-hero-glow', {
        translateX: [0, -24, 14, 0],
        translateY: [0, 16, -12, 0],
        scale: [1, 1.09, 0.96, 1],
        duration: 13000,
        loop: true,
        ease: 'inOutSine'
      });

      animate('.sd-live-pulse', {
        scale: [1, 1.38, 1],
        opacity: [1, 0.6, 1],
        duration: 1800,
        loop: true,
        ease: 'inOutSine'
      });

      // 3. SVG Rank beam traveling signal
      animate('.sd-beam-dash', {
        strokeDashoffset: [44, 0],
        duration: 1700,
        loop: true,
        ease: 'linear'
      });

      // 4. Orbital EXP SVG Ring sweep
      const circumference = 2 * Math.PI * 34; // r = 34 -> 213.63
      const targetOffset = circumference * (1 - rankProgressPct / 100);
      animate('.sd-orbital-ring', {
        strokeDashoffset: [circumference, targetOffset],
        duration: 1150,
        delay: 180,
        ease: 'outExpo'
      });

      // 5. Rolling EXP counter animation
      if (expCounterRef.current) {
        const counterObj = { val: 0 };
        animate(counterObj, {
          val: totalExp,
          duration: 1050,
          delay: 120,
          ease: 'outExpo',
          onUpdate: () => {
            if (expCounterRef.current) {
              expCounterRef.current.textContent = Math.round(counterObj.val).toLocaleString();
            }
          }
        });
      }

      // 6. Animate all progress bars cleanly to their real percentages
      const fillEls = rootRef.current?.querySelectorAll<HTMLElement>('[data-target-width]');
      fillEls?.forEach((el, idx) => {
        const pct = Number(el.dataset.targetWidth || '0');
        animate(el, {
          width: ['0%', `${pct}%`],
          duration: 850,
          delay: 220 + idx * 55,
          ease: 'outExpo'
        });
      });

      // 7. 6-Lab Matrix stagger reveal
      animate('.sd-lab-tile', {
        translateY: [18, 0],
        scale: [0.97, 1],
        opacity: [0, 1],
        duration: 540,
        delay: stagger(55, { start: 220 }),
        ease: 'outExpo'
      });
    });

    return () => {
      scope.revert();
    };
  }, [totalExp, rankProgressPct]);

  // Animate tab content & dynamic sub-filters smoothly with animejs
  const animateTabItems = (selector: string) => {
    window.requestAnimationFrame(() => {
      const items = tabContentRef.current?.querySelectorAll(selector);
      if (items && items.length > 0) {
        animate(items, {
          translateY: [16, 0],
          scale: [0.97, 1],
          opacity: [0, 1],
          duration: 420,
          delay: stagger(42),
          ease: 'outExpo'
        });
      }
    });
  };

  const handleSwitchTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    if (tab === 'curriculum') animateTabItems('.sd-stage-card');
    else if (tab === 'trophies') animateTabItems('.sd-trophy-card');
    else if (tab === 'activity') {
      window.requestAnimationFrame(() => {
        const bars = tabContentRef.current?.querySelectorAll('.sd-chart-bar');
        if (bars && bars.length > 0) {
          animate(bars, {
            scaleY: [0, 1],
            duration: 620,
            delay: stagger(55),
            ease: spring({ stiffness: 260, damping: 18 })
          });
        }
      });
    }
  };

  const handleSelectLevel = (lvlNum: number) => {
    setSelectedLevel(lvlNum);
    animateTabItems('.sd-stage-card');
  };

  const handleTrophyFilter = (flt: TrophyFilter) => {
    setTrophyFilter(flt);
    animateTabItems('.sd-trophy-card');
  };

  const handleRankClick = (idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    setInspectedRankIdx(idx);
    animate(e.currentTarget, {
      scale: [1, 0.93, 1.05, 1],
      duration: 340,
      ease: spring({ stiffness: 360, damping: 16 })
    });
  };

  const handleTileHover = (e: React.MouseEvent<HTMLElement>) => {
    const icon = e.currentTarget.querySelector('.sd-bounce-icon');
    if (icon) {
      animate(icon, {
        scale: [1, 1.18, 1.06],
        rotate: [0, -6, 0],
        duration: 340,
        ease: spring({ stiffness: 340, damping: 15 })
      });
    }
  };

  const handleTileLeave = (e: React.MouseEvent<HTMLElement>) => {
    const icon = e.currentTarget.querySelector('.sd-bounce-icon');
    if (icon) {
      animate(icon, {
        scale: 1,
        rotate: 0,
        duration: 220,
        ease: 'outQuad'
      });
    }
  };

  const createShareSummary = (ach: Achievement): StageValidationSummary => {
    const bestPassed = progress.recentAttempts.find(a => a.passed);
    const fallbackAttempt = progress.recentAttempts[0];

    return {
      uid: bestPassed?.uid || fallbackAttempt?.uid || 'ICST-2026-0001',
      studentIdentity: progress.studentIdentity,
      levelNumber: ach.badgeLevel || 1,
      stageNumber: 1,
      totalEvaluatedUnits: 12,
      correctUnits: 12,
      incorrectUnits: 0,
      missingUnits: 0,
      accuracyPercentage: ach.id === 'perfect_100' ? 100 : (bestPassed?.accuracyPercentage || 100),
      requiredAccuracy: 80,
      passed: true,
      timeTakenSeconds: bestPassed?.timeTakenSeconds || fallbackAttempt?.timeTakenSeconds || 85,
      expEarned: ach.badgeLevel * 50,
      isGuidedMode: false,
      fieldResults: [],
      cellResults: [],
      unlockedAchievements: [ach],
      submittedAt: new Date().toISOString()
    };
  };

  // Filtered trophies
  const filteredTrophies = useMemo(() => {
    return UNIFIED_SYSTEM_ACHIEVEMENTS.filter(ach => {
      const unlocked = unlockedSet.has(ach.id);
      if (trophyFilter === 'unlocked') return unlocked;
      if (trophyFilter === 'locked') return !unlocked;
      if (trophyFilter === 'practice' || trophyFilter === 'excel' || trophyFilter === 'windows') {
        return ach.group === trophyFilter;
      }
      return true;
    });
  }, [trophyFilter, unlockedSet]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    if (activityFilter === 'passed') return unifiedActivities.filter(a => a.passed);
    if (activityFilter === 'retry') return unifiedActivities.filter(a => !a.passed);
    return unifiedActivities;
  }, [activityFilter, unifiedActivities]);

  const currentLevelInfo = LEVELS_INFO.find(l => l.levelNumber === selectedLevel) || LEVELS_INFO[0];
  const currentLevelStages = STAGES.filter(s => s.levelNumber === selectedLevel);
  const inspectedRank = OPERATOR_RANKS[inspectedRankIdx] || currentRank;
  const expNeededForInspected = Math.max(0, inspectedRank.minExp - totalExp);

  const ringCircumference = 2 * Math.PI * 34;

  return (
    <div ref={rootRef} className="sd-root">
      {/* ====================================================================
          1. ANIMATED COMMAND HERO (PROFILE + ORBITAL EXP RING + RANK LADDER)
         ==================================================================== */}
      <section className="sd-hero sd-reveal" aria-label="Trainee Command Overview">
        <div className="sd-hero-glow" aria-hidden="true" />
        <div className="sd-hero-grid-dots" aria-hidden="true" />

        <div className="sd-hero-top">
          <div className="sd-identity-cluster">
            <div className="sd-avatar-ring">
              <img src="/logo.png" alt="ICST LAB Emblem" width={56} height={56} />
            </div>

            <div style={{ minWidth: 0 }}>
              <div className="sd-brand-row">
                <span className="sd-live-pulse" aria-hidden="true" />
                <span>ICST LAB • TRAINEE COMMAND CENTER • icstconnect.in</span>
              </div>

              <h1 className="sd-hero-title">
                {progress.studentIdentity?.name ? progress.studentIdentity.name : 'Trainee Command Profile'}
              </h1>

              <div className="sd-hero-meta">
                <span className="sd-rank-pill" style={{ borderColor: currentRank.color }}>
                  <Award size={13} color={currentRank.color} />
                  <span>{currentRank.title}</span>
                </span>
                <span className="sd-roll-pill">
                  {progress.studentIdentity?.generatedRollId || 'Guest Session • Set Roll ID'}
                </span>
              </div>

              <div className="sd-hero-actions">
                {onOpenStudentSetup && (
                  <button type="button" className="sd-hero-btn" onClick={onOpenStudentSetup}>
                    <User size={13} />
                    <span>{progress.studentIdentity ? 'Edit Identity' : 'Set Name & Roll'}</span>
                  </button>
                )}

                {onOpenAchievementShare && (
                  <button type="button" className="sd-hero-btn gold" onClick={onOpenAchievementShare}>
                    <Share2 size={13} />
                    <span>Share Honors Card</span>
                  </button>
                )}

                <a
                  href={ICST_CONNECT.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sd-hero-btn"
                >
                  <img
                    src={ICST_CONNECT.LOGO_PATH}
                    alt="ICST Connect"
                    width={15}
                    height={15}
                    style={{ borderRadius: '4px', objectFit: 'cover' }}
                  />
                  <span>icstconnect.in</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>

          {/* Orbital EXP Progress Ring + Rolling Counter */}
          <div className="sd-exp-orb">
            <div className="sd-ring-box" title={`${rankProgressPct}% toward next rank`}>
              <svg width="82" height="82" viewBox="0 0 82 82" aria-hidden="true">
                <circle
                  cx="41"
                  cy="41"
                  r="34"
                  fill="none"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth="7"
                />
                <circle
                  className="sd-orbital-ring"
                  cx="41"
                  cy="41"
                  r="34"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringCircumference}
                  transform="rotate(-90 41 41)"
                />
              </svg>
              <div className="sd-ring-center">
                <div className="sd-ring-pct">{rankProgressPct}%</div>
                <div className="sd-ring-sub">RANK</div>
              </div>
            </div>

            <div className="sd-exp-readout">
              <span className="sd-exp-caption">Total ICST LAB EXP</span>
              <div className="sd-exp-number">
                <span ref={expCounterRef}>{totalExp.toLocaleString()}</span>
                <span style={{ fontSize: '13px', marginLeft: '5px', color: '#fde68a' }}>EXP</span>
              </div>
              <span className="sd-exp-next">
                {nextRank
                  ? `${Math.max(0, nextRank.minExp - totalExp).toLocaleString()} EXP to ${nextRank.badge}`
                  : 'Peak Grandmaster Rank Reached!'}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive 5-Rank Career Ladder */}
        <div className="sd-rank-ladder">
          <div className="sd-ladder-track">
            <svg className="sd-ladder-beam" viewBox="0 0 1000 4" preserveAspectRatio="none" aria-hidden="true">
              <line x1="0" y1="2" x2="1000" y2="2" stroke="rgba(255,255,255,0.16)" strokeWidth="3" />
              <line
                x1="0"
                y1="2"
                x2="1000"
                y2="2"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeDasharray="16 28"
                className="sd-beam-dash"
              />
            </svg>

            {OPERATOR_RANKS.map((rk, idx) => {
              const reached = totalExp >= rk.minExp;
              const selected = inspectedRankIdx === idx;
              return (
                <button
                  key={rk.title}
                  type="button"
                  className={`sd-rank-node ${reached ? 'reached' : ''} ${selected ? 'selected' : ''}`}
                  onClick={(e) => handleRankClick(idx, e)}
                >
                  <span
                    className="sd-rank-dot"
                    style={{ background: reached ? rk.color : 'rgba(255,255,255,0.22)', color: reached ? '#0b1930' : '#ffffff' }}
                  >
                    {reached ? '✓' : idx + 1}
                  </span>
                  <span className="sd-rank-node-title">{rk.badge}</span>
                  <span className="sd-rank-node-exp">{rk.minExp.toLocaleString()} EXP</span>
                </button>
              );
            })}
          </div>

          <div className="sd-rank-detail-bar">
            <div>
              <strong style={{ color: inspectedRank.color }}>{inspectedRank.title}</strong>
              <span style={{ marginLeft: '8px', color: '#cbd5e1' }}>— {inspectedRank.description}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: expNeededForInspected === 0 ? '#34d399' : '#fbbf24' }}>
              {expNeededForInspected === 0 ? '✓ UNLOCKED' : `${expNeededForInspected.toLocaleString()} EXP NEEDED`}
            </span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. LIVE TELEMETRY KPI STRIP (4 ANIMATED CARDS)
         ==================================================================== */}
      <section className="sd-kpi-grid" aria-label="Key Performance Metrics">
        <div
          className="sd-kpi-card sd-reveal"
          style={{ '--kpi-accent': '#1c6aa7' } as React.CSSProperties}
          onMouseEnter={handleTileHover}
          onMouseLeave={handleTileLeave}
        >
          <div className="sd-kpi-top">
            <span className="sd-kpi-label">Global Mastery</span>
            <span className="sd-kpi-icon sd-bounce-icon" style={{ background: '#edf4fa' }}>
              <Target size={17} color="#1c6aa7" />
            </span>
          </div>
          <div className="sd-kpi-val">
            {globalCompleted} <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>/ {globalTotal}</span>
          </div>
          <div className="sd-kpi-sub">{globalPercent}% across all 6 labs</div>
          <div className="sd-bar-track">
            <div className="sd-bar-fill" data-target-width={globalPercent} style={{ background: 'linear-gradient(90deg, #1c6aa7, #38bdf8)' }} />
          </div>
        </div>

        <div
          className="sd-kpi-card sd-reveal"
          style={{ '--kpi-accent': '#d97706' } as React.CSSProperties}
          onMouseEnter={handleTileHover}
          onMouseLeave={handleTileLeave}
        >
          <div className="sd-kpi-top">
            <span className="sd-kpi-label">Honors Vault</span>
            <span className="sd-kpi-icon sd-bounce-icon" style={{ background: '#fef3c7' }}>
              <Trophy size={17} color="#d97706" />
            </span>
          </div>
          <div className="sd-kpi-val" style={{ color: '#b45309' }}>
            {totalUnlockedTrophies} <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>/ {totalTrophiesCount}</span>
          </div>
          <div className="sd-kpi-sub">Certified ICST LAB badges</div>
          <div className="sd-bar-track">
            <div className="sd-bar-fill" data-target-width={trophyPercent} style={{ background: 'linear-gradient(90deg, #f59e0b, #10b981)' }} />
          </div>
        </div>

        <div
          className="sd-kpi-card sd-reveal"
          style={{ '--kpi-accent': '#0891b2' } as React.CSSProperties}
          onMouseEnter={handleTileHover}
          onMouseLeave={handleTileLeave}
        >
          <div className="sd-kpi-top">
            <span className="sd-kpi-label">Peak Speed</span>
            <span className="sd-kpi-icon sd-bounce-icon" style={{ background: '#ecfeff' }}>
              <Zap size={17} color="#0891b2" />
            </span>
          </div>
          <div className="sd-kpi-val" style={{ color: '#0e7490' }}>
            {bestWpm} <span style={{ fontSize: '14px' }}>WPM</span>
          </div>
          <div className="sd-kpi-sub">
            {highestKph > 0 ? `Terminal Peak: ${highestKph.toLocaleString()} KPH` : `${typingStars} ★ earned in Typing`}
          </div>
          <div className="sd-bar-track">
            <div className="sd-bar-fill" data-target-width={Math.min(100, Math.round((bestWpm / 80) * 100))} style={{ background: 'linear-gradient(90deg, #0891b2, #38bdf8)' }} />
          </div>
        </div>

        <div
          className="sd-kpi-card sd-reveal"
          style={{ '--kpi-accent': '#16a34a' } as React.CSSProperties}
          onMouseEnter={handleTileHover}
          onMouseLeave={handleTileLeave}
        >
          <div className="sd-kpi-top">
            <span className="sd-kpi-label">Precision Index</span>
            <span className="sd-kpi-icon sd-bounce-icon" style={{ background: '#f0fdf4' }}>
              <TrendingUp size={17} color="#16a34a" />
            </span>
          </div>
          <div className="sd-kpi-val" style={{ color: '#15803d' }}>
            {averageAccuracy}%
          </div>
          <div className="sd-kpi-sub">{unifiedActivities.length} recorded evaluations</div>
          <div className="sd-bar-track">
            <div className="sd-bar-fill" data-target-width={averageAccuracy} style={{ background: 'linear-gradient(90deg, #16a34a, #34d399)' }} />
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. 6-LAB INTERACTIVE COMMAND MATRIX + EXP COMPOSITION BAR
         ==================================================================== */}
      <section className="sd-panel sd-reveal" aria-labelledby="sd-matrix-heading">
        <div className="sd-panel-head">
          <div>
            <span className="sd-eyebrow">
              <Layers size={12} />
              <span>All 6 Interactive Simulators</span>
            </span>
            <h2 id="sd-matrix-heading" className="sd-h2">
              Lab Mastery &amp; Quick Launch Matrix
            </h2>
          </div>

          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
            Click any module to resume training instantly
          </span>
        </div>

        {/* Multi-segment proportional EXP bar */}
        <div className="sd-exp-stack-bar" title="EXP share across ICST LAB modules">
          {labModules.map(mod => {
            const weight = totalExp > 0 ? Math.max(mod.exp > 0 ? 4 : 0, Math.round((mod.exp / totalExp) * 100)) : 16;
            return (
              <div
                key={mod.id}
                className="sd-exp-seg"
                style={{ flexGrow: weight || 1, background: mod.accent, opacity: mod.exp > 0 || totalExp === 0 ? 0.9 : 0.18 }}
                title={`${mod.name}: ${mod.exp} EXP`}
              />
            );
          })}
        </div>

        <div className="sd-labs-matrix">
          {labModules.map(mod => (
            <button
              key={mod.id}
              type="button"
              className="sd-lab-tile"
              style={{ '--tile-accent': mod.accent } as React.CSSProperties}
              onClick={mod.onLaunch}
              onMouseEnter={handleTileHover}
              onMouseLeave={handleTileLeave}
            >
              <div>
                <div className="sd-lab-tile-top">
                  <span className="sd-lab-icon-wrap sd-bounce-icon" style={{ background: mod.tint }}>
                    {mod.icon}
                  </span>
                  <span className="sd-lab-exp-pill">
                    {mod.exp.toLocaleString()} EXP
                  </span>
                </div>

                <h3 className="sd-lab-name" style={{ marginTop: '10px' }}>{mod.name}</h3>
                <div className="sd-lab-meta-row">
                  <span>{mod.done} / {mod.total} cleared</span>
                  <span style={{ color: mod.accent }}>{mod.pct}%</span>
                </div>

                <div className="sd-bar-track" style={{ marginTop: '8px' }}>
                  <div
                    className="sd-bar-fill"
                    data-target-width={mod.pct}
                    style={{ background: mod.accent }}
                  />
                </div>
              </div>

              <div className="sd-lab-launch-row">
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700 }}>{mod.highlight}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>Open</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ====================================================================
          4. INTERACTIVE TABBED DEEP-DIVE WORKSPACE
         ==================================================================== */}
      <section className="sd-panel sd-reveal" aria-label="Interactive Training Records Explorer">
        <div className="sd-panel-head">
          <div>
            <span className="sd-eyebrow">
              <Sparkles size={12} />
              <span>Interactive Explorer</span>
            </span>
            <h2 className="sd-h2">
              {activeTab === 'curriculum' && '5-Level Practice Roadmap'}
              {activeTab === 'trophies' && 'Unified Trophy & Certificate Vault'}
              {activeTab === 'activity' && 'Live Speed & Accuracy Telemetry'}
            </h2>
          </div>

          <div className="sd-tabs-bar" role="tablist" aria-label="Dashboard Sections">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'curriculum'}
              className={`sd-tab-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
              onClick={() => handleSwitchTab('curriculum')}
            >
              <GraduationCap size={15} />
              <span>Curriculum</span>
              <span className="sd-tab-count">{practiceDone}/{practiceTotal}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'trophies'}
              className={`sd-tab-btn ${activeTab === 'trophies' ? 'active' : ''}`}
              onClick={() => handleSwitchTab('trophies')}
            >
              <Trophy size={15} />
              <span>Trophy Vault</span>
              <span className="sd-tab-count">{totalUnlockedTrophies}/{totalTrophiesCount}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'activity'}
              className={`sd-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => handleSwitchTab('activity')}
            >
              <Activity size={15} />
              <span>Activity Log</span>
              <span className="sd-tab-count">{unifiedActivities.length}</span>
            </button>
          </div>
        </div>

        <div ref={tabContentRef}>
          {/* TAB 1: 5-LEVEL PRACTICE CURRICULUM ROADMAP */}
          {activeTab === 'curriculum' && (
            <div>
              <div className="sd-level-pills" role="tablist" aria-label="Select Practice Level">
                {LEVELS_INFO.map(lvl => {
                  const lvlStages = STAGES.filter(s => s.levelNumber === lvl.levelNumber);
                  const lvlDone = lvlStages.filter(s => !!progress.completedStages[`L${s.levelNumber}-S${s.stageNumber}`]).length;
                  const active = selectedLevel === lvl.levelNumber;
                  return (
                    <button
                      key={lvl.levelNumber}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      className={`sd-level-pill ${active ? 'active' : ''}`}
                      style={{ '--lvl-color': lvl.color } as React.CSSProperties}
                      onClick={() => handleSelectLevel(lvl.levelNumber)}
                    >
                      <span>Level {lvl.levelNumber}</span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        padding: '1px 7px',
                        borderRadius: '999px',
                        background: active ? 'rgba(255,255,255,0.22)' : 'var(--bg-subtle)'
                      }}>
                        {lvlDone}/{lvlStages.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="sd-level-banner">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      background: currentLevelInfo.color,
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '11px',
                      padding: '2px 9px',
                      borderRadius: '6px'
                    }}>
                      LEVEL {currentLevelInfo.levelNumber}
                    </span>
                    <strong style={{ fontSize: '15px', color: 'var(--icst-charcoal)' }}>
                      {currentLevelInfo.title}
                    </strong>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {currentLevelInfo.description}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Pass Benchmark
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 900, color: currentLevelInfo.color }}>
                    {currentLevelInfo.requiredAccuracy}% Accuracy
                  </div>
                </div>
              </div>

              <div className="sd-stages-grid">
                {currentLevelStages.map(st => {
                  const key = `L${st.levelNumber}-S${st.stageNumber}`;
                  const record = progress.completedStages[key];
                  const isDone = !!record;

                  return (
                    <div key={st.stageNumber} className={`sd-stage-card ${isDone ? 'done' : ''}`}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: currentLevelInfo.color, textTransform: 'uppercase' }}>
                            Stage {st.stageNumber}
                          </span>
                          {isDone && <CheckCircle2 size={14} color="#15803d" />}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--text-primary)', marginTop: '3px' }}>
                          {st.title}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                          {st.fields.length} Fields • {st.difficulty}
                          {record ? ` • Best ${record.highestAccuracy}%` : ` • +${st.baseExp} EXP`}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        onClick={() => onSelectStage(st.levelNumber, st.stageNumber)}
                      >
                        <Play size={12} />
                        <span>{isDone ? 'Repeat' : 'Start'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UNIFIED TROPHY & CERTIFICATE VAULT (22 BADGES) */}
          {activeTab === 'trophies' && (
            <div>
              <div className="sd-filter-row" role="tablist" aria-label="Filter Honors">
                {([
                  { id: 'all', label: `All (${totalTrophiesCount})` },
                  { id: 'unlocked', label: `Unlocked (${totalUnlockedTrophies})` },
                  { id: 'locked', label: `Locked (${totalTrophiesCount - totalUnlockedTrophies})` },
                  { id: 'practice', label: `Practice (${ALL_ACHIEVEMENTS.length})` },
                  { id: 'excel', label: `Excel (${EXCEL_ACHIEVEMENTS.length})` },
                  { id: 'windows', label: `Windows (${WINDOWS_ACHIEVEMENTS.length})` }
                ] as const).map(f => (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={trophyFilter === f.id}
                    className={`sd-filter-chip ${trophyFilter === f.id ? 'active' : ''}`}
                    onClick={() => handleTrophyFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredTrophies.length === 0 ? (
                <div className="sd-empty-box">
                  <Trophy size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                  <div style={{ fontWeight: 800, fontSize: '14px' }}>No trophies match this filter yet</div>
                  <p style={{ fontSize: '12.5px', marginTop: '4px' }}>
                    Complete stages across Practice, Excel 365, or Windows 11 labs to unlock certified ICST LAB trophies!
                  </p>
                </div>
              ) : (
                <div className="sd-trophy-grid">
                  {filteredTrophies.map(ach => {
                    const isUnlocked = unlockedSet.has(ach.id);
                    return (
                      <div key={ach.id} className={`sd-trophy-card ${isUnlocked ? 'unlocked' : ''}`}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: isUnlocked ? '#fef3c7' : 'var(--bg-subtle)',
                            color: isUnlocked ? '#b45309' : 'var(--text-muted)'
                          }}>
                            {ach.groupTitle || 'ICST LAB'} • L{ach.badgeLevel}
                          </span>

                          <span style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: isUnlocked ? '#15803d' : 'var(--text-muted)'
                          }}>
                            {isUnlocked ? (
                              <>
                                <CheckCircle2 size={12} color="#16a34a" />
                                <span>UNLOCKED</span>
                              </>
                            ) : (
                              <>
                                <Lock size={11} />
                                <span>LOCKED</span>
                              </>
                            )}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ flexShrink: 0 }}>
                            <TrophyGraphic
                              achievementId={ach.id}
                              level={ach.badgeLevel}
                              isUnlocked={isUnlocked}
                              size={62}
                            />
                          </div>

                          <div style={{ minWidth: 0, flex: 1 }}>
                            <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--icst-charcoal)', margin: '0 0 4px' }}>
                              {ach.title}
                            </h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 6px' }}>
                              {ach.description}
                            </p>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, color: '#d97706' }}>
                              +{ach.badgeLevel * 50} EXP REWARD
                            </span>
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '10px',
                          borderTop: '1px solid var(--border-light)',
                          marginTop: 'auto',
                          gap: '8px'
                        }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedAchievementForShare(ach)}
                            style={{ fontSize: '11.5px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                          >
                            <Eye size={12} />
                            <span>Preview</span>
                          </button>

                          <button
                            type="button"
                            className={`btn btn-sm ${isUnlocked ? 'btn-primary' : 'btn-secondary'}`}
                            disabled={!isUnlocked}
                            onClick={() => {
                              if (isUnlocked) setSelectedAchievementForShare(ach);
                            }}
                            style={{
                              fontSize: '11.5px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              opacity: isUnlocked ? 1 : 0.48,
                              cursor: isUnlocked ? 'pointer' : 'not-allowed'
                            }}
                          >
                            {isUnlocked ? <Share2 size={12} /> : <Lock size={12} />}
                            <span>{isUnlocked ? 'Share Certificate' : 'Locked'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: UNIFIED SPEED & ACCURACY ACTIVITY LOG */}
          {activeTab === 'activity' && (
            <div>
              {unifiedActivities.length === 0 ? (
                <div className="sd-empty-box">
                  <Activity size={32} color="var(--icst-blue)" style={{ marginBottom: '8px' }} />
                  <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--icst-charcoal)' }}>
                    No evaluations logged yet
                  </div>
                  <p style={{ fontSize: '13px', margin: '6px auto 16px', maxWidth: '420px' }}>
                    Complete your first stage in Practice, Excel 365, or Terminal Stream to see animated accuracy bars and detailed speed telemetry here.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onSelectStage(1, 1)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Play size={13} />
                    <span>Launch Level 1 Stage 1</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Animated Recent Accuracy Bar Chart */}
                  <div className="sd-chart-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--icst-charcoal)' }}>
                        Recent Accuracy Trend (Latest {Math.min(10, unifiedActivities.length)} Runs)
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                        Green = Passed • Red = Retry
                      </span>
                    </div>

                    <div className="sd-chart-bars">
                      {unifiedActivities.slice(0, 10).reverse().map((row, idx) => (
                        <div key={row.id} className="sd-chart-col" title={`${row.label}: ${row.accuracy}%`}>
                          <span className="sd-chart-val">{row.accuracy}%</span>
                          <div
                            className="sd-chart-bar"
                            style={{
                              height: `${Math.max(12, row.accuracy)}%`,
                              background: row.passed
                                ? 'linear-gradient(180deg, #10b981 0%, #15803d 100%)'
                                : 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)'
                            }}
                          />
                          <span className="sd-chart-lbl">#{idx + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filter Chips */}
                  <div className="sd-filter-row">
                    {([
                      { id: 'all', label: `All Runs (${unifiedActivities.length})` },
                      { id: 'passed', label: `Passed (${unifiedActivities.filter(a => a.passed).length})` },
                      { id: 'retry', label: `Retry (${unifiedActivities.filter(a => !a.passed).length})` }
                    ] as const).map(flt => (
                      <button
                        key={flt.id}
                        type="button"
                        className={`sd-filter-chip ${activityFilter === flt.id ? 'active' : ''}`}
                        onClick={() => setActivityFilter(flt.id)}
                      >
                        {flt.label}
                      </button>
                    ))}
                  </div>

                  <div className="sd-table-wrap">
                    <table className="sd-table">
                      <thead>
                        <tr>
                          <th>Lab</th>
                          <th>Module / Stage</th>
                          <th>Ref / Speed</th>
                          <th>Accuracy</th>
                          <th>EXP</th>
                          <th>Duration</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredActivities.slice(0, 20).map(row => (
                          <tr key={row.id}>
                            <td>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: '999px',
                                fontSize: '11px',
                                fontWeight: 800,
                                color: '#ffffff',
                                background: row.labColor
                              }}>
                                {row.lab}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700 }}>{row.label}</td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px' }}>{row.refCode}</td>
                            <td style={{ fontWeight: 800, color: row.passed ? '#15803d' : '#b91c1c' }}>
                              {row.accuracy}%
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#b45309' }}>
                              +{row.exp} EXP
                            </td>
                            <td>
                              {Math.floor(row.durationSeconds / 60)}m {row.durationSeconds % 60}s
                            </td>
                            <td>
                              <span style={{
                                background: row.passed ? '#dcfce7' : '#fee2e2',
                                color: row.passed ? '#166534' : '#991b1b',
                                padding: '2px 8px',
                                borderRadius: '999px',
                                fontSize: '11px',
                                fontWeight: 800
                              }}>
                                {row.passed ? 'PASSED' : 'RETRY'}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={row.retryAction}
                                style={{ fontSize: '11px', padding: '3px 9px' }}
                              >
                                Launch →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Achievement Share Modal */}
      {selectedAchievementForShare && (
        <AchievementShareModal
          achievement={selectedAchievementForShare}
          summary={createShareSummary(selectedAchievementForShare)}
          onClose={() => setSelectedAchievementForShare(null)}
        />
      )}
    </div>
  );
};
