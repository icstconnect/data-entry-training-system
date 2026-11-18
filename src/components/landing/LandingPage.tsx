import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Keyboard,
  FileSpreadsheet,
  FolderTree,
  Award,
  UserCheck,
  LayoutDashboard,
  Globe,
  BookOpen,
  ClipboardCheck,
  Share2,
  Zap,
  RotateCcw,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { animate, createScope, stagger, spring } from 'animejs';
import { ICST_CONNECT } from '../../config/appConfig';
import './landing.css';

interface LandingPageProps {
  onStartPractice: () => void;
  onOpenTeacherMode: () => void;
  onOpenDashboard: () => void;
  onOpenShowcase: () => void;
  onOpenExcel?: () => void;
  onOpenWindows?: () => void;
  onOpenTerminal?: () => void;
  onOpenTyping?: () => void;
  onOpenWordExpress?: () => void;
  onOpenAchievementShare?: () => void;
}

type PlaygroundMode = 'typing' | 'excel' | 'windows';
type LabCategory = 'all' | 'data-entry' | 'keyboard-os';

interface LabCardConfig {
  id: string;
  category: 'data-entry' | 'keyboard-os';
  tag: string;
  stat: string;
  title: string;
  desc: string;
  accent: string;
  tint: string;
  actionLabel: string;
  onLaunch: () => void;
  graphic: React.ReactNode;
}

const DEMO_WORDS = ['ICST', 'DATA', 'FAST', 'EXCEL', 'SKILL', 'TYPE'];
const MINI_KB_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const EXCEL_SAMPLES = [
  { coord: 'A1', value: 'ICST-01' },
  { coord: 'B1', value: '98.5%' },
  { coord: 'C1', value: 'PASS' },
  { coord: 'A2', value: 'ICST-02' },
  { coord: 'B2', value: '99.2%' },
  { coord: 'C2', value: 'HONOR' },
  { coord: 'A3', value: 'ICST-03' },
  { coord: 'B3', value: '100%' },
  { coord: 'C3', value: 'GOLD' }
];

interface SortFileItem {
  id: string;
  name: string;
  target: 'sheets' | 'docs' | 'media';
  color: string;
}

const SORT_FILES: SortFileItem[] = [
  { id: 'f1', name: 'Marks.xlsx', target: 'sheets', color: '#107c41' },
  { id: 'f2', name: 'Admit.pdf', target: 'docs', color: '#1c6aa7' },
  { id: 'f3', name: 'Logo.png', target: 'media', color: '#7c3aed' },
  { id: 'f4', name: 'KYC.xlsx', target: 'sheets', color: '#107c41' }
];

const JOURNEY_STEPS = [
  {
    num: '01',
    title: 'Pick a Lab',
    desc: 'Choose Forms, Excel 365, Windows 11, Terminal, Touch Typing, or Word Express.',
    tip: 'Tip: Start with Touch Typing to build effortless finger memory, or jump straight into Excel 365 ledgers.',
    ctaLabel: 'Launch Practice Lab'
  },
  {
    num: '02',
    title: 'Interactive Practice',
    desc: 'Train on authentic simulated workspaces with light-beam keys & guided hints.',
    tip: 'Tip: Every lab runs 100% offline as a PWA and saves your drafts safely in your browser.',
    ctaLabel: 'Try Touch Typing Lab'
  },
  {
    num: '03',
    title: 'Precision Audit',
    desc: 'Instant character-level accuracy verification, WPM cadence, and KPH scoring.',
    tip: 'Tip: Inspect your performance history, accuracy trends, and rank progression anytime in your Dashboard.',
    ctaLabel: 'Open My Dashboard'
  },
  {
    num: '04',
    title: 'ICST Honors',
    desc: 'Earn EXP titles and export verified ICST Connect achievement story cards.',
    tip: 'Tip: Share your verified honors card with @icstconnect and #ICSTChowberia on Instagram & WhatsApp!',
    ctaLabel: 'Share Honors Card'
  }
];

export const LandingPage: React.FC<LandingPageProps> = React.memo(({
  onStartPractice,
  onOpenTeacherMode,
  onOpenDashboard,
  onOpenShowcase,
  onOpenExcel,
  onOpenWindows,
  onOpenTerminal,
  onOpenTyping,
  onOpenWordExpress,
  onOpenAchievementShare
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const playgroundRef = useRef<HTMLDivElement | null>(null);
  const labsGridRef = useRef<HTMLDivElement | null>(null);

  // Interactive Hero Playground states
  const [pgMode, setPgMode] = useState<PlaygroundMode>('typing');
  const [wordIdx, setWordIdx] = useState(0);
  const [charPos, setCharPos] = useState(0);
  const [combo, setCombo] = useState(0);
  const [wordsSolved, setWordsSolved] = useState(0);

  // Excel Grid Pulse state
  const [filledCells, setFilledCells] = useState<number[]>([0, 4]);

  // Windows Quick Sort state
  const [sortedIds, setSortedIds] = useState<string[]>([]);

  // Lab Explorer Filter & Journey Active Step
  const [labFilter, setLabFilter] = useState<LabCategory>('all');
  const [activeStep, setActiveStep] = useState(0);

  const currentWord = DEMO_WORDS[wordIdx];
  const expectedChar = currentWord[charPos] || '';
  const progressRatio = currentWord.length > 0 ? charPos / currentWord.length : 0;

  // Trigger animejs micro-pop for any DOM element or selector inside root
  const triggerCharKey = useCallback((letter: string) => {
    const upper = letter.toUpperCase();
    const keyBtn = playgroundRef.current?.querySelector(`[data-key="${upper}"]`);
    if (keyBtn) {
      animate(keyBtn, {
        scale: [1, 0.84, 1.12, 1],
        duration: 280,
        ease: spring({ stiffness: 420, damping: 16 })
      });
    }

    if (upper === expectedChar) {
      const nextPos = charPos + 1;
      setCombo(c => c + 1);

      const tileEl = playgroundRef.current?.querySelector(`[data-char-idx="${charPos}"]`);
      if (tileEl) {
        animate(tileEl, {
          scale: [1, 1.24, 1],
          rotate: [0, -5, 0],
          duration: 340,
          ease: spring({ stiffness: 360, damping: 14 })
        });
      }

      if (nextPos >= currentWord.length) {
        setWordsSolved(w => w + 1);
        setCharPos(nextPos);
        const wordWrap = playgroundRef.current?.querySelector('.lp-type-word');
        if (wordWrap) {
          animate(wordWrap, {
            scale: [1, 1.07, 1],
            duration: 360,
            ease: 'outBack(1.8)'
          });
        }
        window.setTimeout(() => {
          setWordIdx(prev => (prev + 1) % DEMO_WORDS.length);
          setCharPos(0);
        }, 420);
      } else {
        setCharPos(nextPos);
      }
    } else if (/^[A-Z]$/.test(upper)) {
      setCombo(0);
      const tileEl = playgroundRef.current?.querySelector(`[data-char-idx="${charPos}"]`);
      if (tileEl) {
        animate(tileEl, {
          translateX: [0, -6, 6, -4, 4, 0],
          duration: 260,
          ease: 'inOutSine'
        });
      }
    }
  }, [charPos, currentWord.length, expectedChar]);

  // Listen to physical keyboard when in Type Spark mode (unless typing inside an input/modal)
  useEffect(() => {
    if (pgMode !== 'typing') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (/^[a-zA-Z]$/.test(e.key)) {
        triggerCharKey(e.key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pgMode, triggerCharKey]);

  // Excel cell ripple wave using animejs stagger grid
  const handleToggleExcelCell = (index: number) => {
    setFilledCells(prev => (prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]));
    const cells = playgroundRef.current?.querySelectorAll('.lp-excel-cell');
    if (cells && cells.length > 0) {
      animate(cells, {
        scale: [
          { to: 0.94, duration: 90, ease: 'outQuad' },
          { to: 1.04, duration: 150, ease: 'outBack(1.6)' },
          { to: 1, duration: 160, ease: 'outQuad' }
        ],
        delay: stagger(45, { grid: [3, 3], from: index })
      });
    }
  };

  // Windows quick sort zip animation
  const handleSortFile = (file: SortFileItem) => {
    if (sortedIds.includes(file.id)) return;
    const chipEl = playgroundRef.current?.querySelector(`[data-file-id="${file.id}"]`);
    const binEl = playgroundRef.current?.querySelector(`[data-bin="${file.target}"]`);

    if (chipEl) {
      animate(chipEl, {
        translateY: [0, 26],
        scale: [1, 0.72],
        opacity: [1, 0],
        duration: 260,
        ease: 'inBack(1.4)',
        onComplete: () => {
          setSortedIds(prev => (prev.includes(file.id) ? prev : [...prev, file.id]));
          if (binEl) {
            animate(binEl, {
              scale: [1, 1.1, 1],
              duration: 320,
              ease: spring({ stiffness: 360, damping: 14 })
            });
          }
        }
      });
    } else {
      setSortedIds(prev => [...prev, file.id]);
    }
  };

  // Switch playground tab with crisp animejs stage entrance
  const handleSwitchPgMode = (mode: PlaygroundMode) => {
    setPgMode(mode);
    window.requestAnimationFrame(() => {
      const stage = playgroundRef.current?.querySelector('.lp-pg-stage');
      if (stage) {
        animate(stage, {
          opacity: [0, 1],
          translateY: [12, 0],
          duration: 320,
          ease: 'outExpo'
        });
      }
    });
  };

  // Master animejs v4 Scoped Choreography (entrance + ambient motion + counters)
  useEffect(() => {
    if (!rootRef.current) return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const scope = createScope({ root: rootRef.current }).add(() => {
      if (reducedMotion) return;

      // 1. Crisp staggered hero entrance
      animate('.lp-hero-stagger', {
        translateY: [22, 0],
        opacity: [0, 1],
        duration: 680,
        delay: stagger(70),
        ease: 'outExpo'
      });

      // 2. Playground console entrance with gentle spring
      animate('.lp-playground-wrap', {
        translateY: [28, 0],
        scale: [0.96, 1],
        opacity: [0, 1],
        duration: 780,
        delay: 140,
        ease: spring({ stiffness: 220, damping: 20 })
      });

      // 3. Ambient floating background orbs (GPU transform only)
      animate('.lp-orb-1', {
        translateX: [0, -28, 16, 0],
        translateY: [0, 22, -14, 0],
        scale: [1, 1.08, 0.96, 1],
        duration: 14000,
        loop: true,
        ease: 'inOutSine'
      });

      animate('.lp-orb-2', {
        translateX: [0, 24, -18, 0],
        translateY: [0, -20, 16, 0],
        scale: [1, 0.95, 1.07, 1],
        duration: 16500,
        loop: true,
        ease: 'inOutSine'
      });

      // 4. Live indicator pulse dot
      animate('.lp-live-dot', {
        scale: [1, 1.35, 1],
        opacity: [1, 0.65, 1],
        duration: 1800,
        loop: true,
        ease: 'inOutSine'
      });

      // 5. Animated SVG signal beams (Journey line + ICST Connect dual-logo bridge)
      animate('.lp-signal-dash', {
        strokeDashoffset: [48, 0],
        duration: 1600,
        loop: true,
        ease: 'linear'
      });

      // 6. Floating micro-bob on Lab card graphics
      animate('.lp-svg-float', {
        translateY: [-3, 3],
        duration: 2400,
        delay: stagger(200),
        loop: true,
        alternate: true,
        ease: 'inOutSine'
      });

      // 7. Initial Lab cards reveal
      animate('.lp-lab-card', {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 560,
        delay: stagger(65, { start: 180 }),
        ease: 'outExpo'
      });
    });

    return () => {
      scope.revert();
    };
  }, []);

  // Re-animate lab cards cleanly when category filter switches
  const handleFilterChange = (category: LabCategory) => {
    setLabFilter(category);
    window.requestAnimationFrame(() => {
      const cards = labsGridRef.current?.querySelectorAll('.lp-lab-card');
      if (cards && cards.length > 0) {
        animate(cards, {
          translateY: [16, 0],
          scale: [0.96, 1],
          opacity: [0, 1],
          duration: 420,
          delay: stagger(50),
          ease: 'outExpo'
        });
      }
    });
  };

  // Tactile animejs spring bounce on Lab card hover
  const handleCardHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    const svg = e.currentTarget.querySelector('.lp-lab-svg');
    if (svg) {
      animate(svg, {
        scale: [1, 1.07, 1.04],
        duration: 360,
        ease: spring({ stiffness: 320, damping: 16 })
      });
    }
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const svg = e.currentTarget.querySelector('.lp-lab-svg');
    if (svg) {
      animate(svg, {
        scale: 1,
        duration: 240,
        ease: 'outQuad'
      });
    }
  };

  const labs: LabCardConfig[] = [
    {
      id: 'practice',
      category: 'data-entry',
      tag: 'Core Forms',
      stat: '5 Levels • 18 Stages',
      title: 'Practice & Marksheets Lab',
      desc: 'Transcribe admissions, KYC records, and WBBSE/WBCHSE board marksheets with character-level accuracy verification.',
      accent: '#1c6aa7',
      tint: '#edf4fa',
      actionLabel: 'Launch Practice Lab',
      onLaunch: onStartPractice,
      graphic: (
        <svg className="lp-lab-svg" viewBox="0 0 220 90" fill="none" aria-hidden="true">
          <rect x="26" y="12" width="168" height="66" rx="10" fill="#ffffff" stroke="#bfd6ea" strokeWidth="1.5" />
          <rect x="38" y="24" width="62" height="8" rx="4" fill="#1c6aa7" opacity="0.9" />
          <rect x="38" y="39" width="96" height="6" rx="3" fill="#cbd5e1" />
          <rect x="38" y="51" width="74" height="6" rx="3" fill="#cbd5e1" />
          <rect x="38" y="63" width="46" height="6" rx="3" fill="#93c5fd" />
          <g className="lp-svg-float">
            <circle cx="166" cy="46" r="16" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
            <path d="M159 46.5L164 51.5L174 41" stroke="#15803d" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      )
    },
    {
      id: 'excel',
      category: 'data-entry',
      tag: 'Spreadsheets',
      stat: '5 Scenarios • 600 EXP',
      title: 'Excel 365 Mass Data Lab',
      desc: 'Authentic Excel 365 grid with Tab/Enter muscle memory, formula bar coordinates, inventory, KYC & census sheets.',
      accent: '#107c41',
      tint: '#ecfdf5',
      actionLabel: 'Launch Excel 365 Lab',
      onLaunch: () => onOpenExcel?.(),
      graphic: (
        <svg className="lp-lab-svg" viewBox="0 0 220 90" fill="none" aria-hidden="true">
          <rect x="24" y="12" width="172" height="66" rx="10" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1.5" />
          <rect x="24" y="12" width="172" height="17" rx="10" fill="#107c41" />
          <rect x="24" y="21" width="172" height="8" fill="#107c41" />
          <circle cx="36" cy="20" r="3" fill="#a7f3d0" />
          <rect x="46" y="18" width="48" height="4" rx="2" fill="#d1fae5" />
          <rect x="34" y="36" width="46" height="14" rx="4" fill="#ecfdf5" stroke="#6ee7b7" />
          <rect x="86" y="36" width="46" height="14" rx="4" fill="#d1fae5" stroke="#107c41" strokeWidth="1.8" className="lp-svg-float" />
          <rect x="138" y="36" width="46" height="14" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
          <rect x="34" y="56" width="46" height="14" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
          <rect x="86" y="56" width="46" height="14" rx="4" fill="#ecfdf5" stroke="#6ee7b7" />
          <rect x="138" y="56" width="46" height="14" rx="4" fill="#ecfdf5" stroke="#6ee7b7" />
        </svg>
      )
    },
    {
      id: 'terminal',
      category: 'data-entry',
      tag: 'HDDE Stream',
      stat: '5 Domains • 14K KPH',
      title: 'Terminal Stream Lab',
      desc: '100% keyboard-driven Heads-Down Data Entry with scanned voucher spotlighting and real-time discrepancy radar.',
      accent: '#0369a1',
      tint: '#f0f9ff',
      actionLabel: 'Launch Terminal Lab',
      onLaunch: () => onOpenTerminal?.(),
      graphic: (
        <svg className="lp-lab-svg" viewBox="0 0 220 90" fill="none" aria-hidden="true">
          <rect x="24" y="12" width="172" height="66" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M38 33L46 39L38 45" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="54" y="36" width="68" height="6" rx="3" fill="#e0f2fe" />
          <rect x="38" y="53" width="44" height="5" rx="2.5" fill="#38bdf8" opacity="0.55" />
          <rect x="88" y="53" width="58" height="5" rx="2.5" fill="#10b981" opacity="0.85" />
          <g className="lp-svg-float">
            <rect x="152" y="25" width="32" height="38" rx="6" fill="#0284c7" opacity="0.28" stroke="#38bdf8" />
            <path d="M161 44H175M168 37V51" stroke="#7dd3fc" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </svg>
      )
    },
    {
      id: 'typing',
      category: 'keyboard-os',
      tag: 'Kinesthetic',
      stat: '25 Progressive Levels',
      title: 'Touch Typing Lab',
      desc: 'Spatial light-beam guided 10-finger typing from home row to code marathons with live WPM cadence & awards.',
      accent: '#0891b2',
      tint: '#ecfeff',
      actionLabel: 'Launch Touch Typing',
      onLaunch: () => onOpenTyping?.(),
      graphic: (
        <svg className="lp-lab-svg" viewBox="0 0 220 90" fill="none" aria-hidden="true">
          <rect x="22" y="22" width="176" height="52" rx="10" fill="#ffffff" stroke="#a5f3fc" strokeWidth="1.5" />
          {[34, 60, 86, 112, 138, 164].map((x, idx) => (
            <rect
              key={x}
              x={x}
              y="32"
              width="20"
              height="16"
              rx="4"
              fill={idx === 2 ? '#0891b2' : '#ecfeff'}
              stroke={idx === 2 ? '#0e7490' : '#67e8f9'}
              className={idx === 2 ? 'lp-svg-float' : undefined}
            />
          ))}
          <rect x="52" y="54" width="116" height="11" rx="4" fill="#cffafe" stroke="#22d3ee" />
          <path d="M96 10L96 28" stroke="#0891b2" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="3 3" className="lp-signal-dash" />
        </svg>
      )
    },
    {
      id: 'word-express',
      category: 'keyboard-os',
      tag: 'Speed Fleet',
      stat: '25 Stages • 16 Vehicles',
      title: 'Word Express Delivery Lab',
      desc: 'Type crisp word sprints with live animated courier streaks — evolve from Runner & Bicycle up to F1 Car & Rocket!',
      accent: '#7c3aed',
      tint: '#f5f3ff',
      actionLabel: 'Launch Word Express',
      onLaunch: () => onOpenWordExpress?.(),
      graphic: (
        <svg className="lp-lab-svg" viewBox="0 0 220 90" fill="none" aria-hidden="true">
          <path d="M24 64H196" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 6" className="lp-signal-dash" />
          <g className="lp-svg-float">
            <rect x="64" y="24" width="84" height="30" rx="15" fill="#7c3aed" />
            <circle cx="134" cy="39" r="7" fill="#ddd6fe" />
            <rect x="78" y="34" width="38" height="10" rx="5" fill="#ede9fe" />
            <path d="M40 33H58M32 41H55M44 49H59" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      )
    },
    {
      id: 'windows',
      category: 'keyboard-os',
      tag: 'Desktop OS',
      stat: '12 Levels • 2,150 EXP',
      title: 'Windows 11 Organization Lab',
      desc: 'Master Windows 11 file extensions, F2 batch renaming, ISO 8601 timestamps, and nested enterprise folder trees.',
      accent: '#0284c7',
      tint: '#eff6ff',
      actionLabel: 'Launch Windows Lab',
      onLaunch: () => onOpenWindows?.(),
      graphic: (
        <svg className="lp-lab-svg" viewBox="0 0 220 90" fill="none" aria-hidden="true">
          <g className="lp-svg-float">
            <path d="M36 28C36 24.7 38.7 22 42 22H72L80 30H122C125.3 30 128 32.7 128 36V66C128 69.3 125.3 72 122 72H42C38.7 72 36 69.3 36 66V28Z" fill="#38bdf8" />
            <rect x="44" y="38" width="76" height="26" rx="6" fill="#ffffff" opacity="0.92" />
          </g>
          <rect x="140" y="24" width="44" height="20" rx="6" fill="#ffffff" stroke="#7dd3fc" strokeWidth="1.5" />
          <rect x="140" y="50" width="44" height="20" rx="6" fill="#dbeafe" stroke="#0284c7" strokeWidth="1.5" />
          <path d="M128 48H140" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" className="lp-signal-dash" />
        </svg>
      )
    }
  ];

  const visibleLabs = labFilter === 'all' ? labs : labs.filter(l => l.category === labFilter);
  const activeStepObj = JOURNEY_STEPS[activeStep];

  const handleJourneyAction = () => {
    if (activeStep === 0) onStartPractice();
    else if (activeStep === 1) (onOpenTyping || onStartPractice)();
    else if (activeStep === 2) onOpenDashboard();
    else if (onOpenAchievementShare) onOpenAchievementShare();
    else onOpenShowcase();
  };

  return (
    <div ref={rootRef} className="lp-root">
      {/* Ambient Clean Graphical Backdrop */}
      <div className="lp-bg-canvas" aria-hidden="true">
        <div className="lp-bg-dots" />
        <div className="lp-orb lp-orb-1" />
        <div className="lp-orb lp-orb-2" />
      </div>

      {/* ====================================================================
          HERO SECTION: DUAL-BRAND IDENTITY + INTERACTIVE GRAPHICAL PLAYGROUND
         ==================================================================== */}
      <section className="lp-hero" aria-label="ICST LAB Overview">
        <div className="lp-container">
          <div className="lp-hero-grid">
            {/* Left Column: Clean Narrative & Direct ICST Connect Attribution */}
            <div>
              <a
                href={ICST_CONNECT.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="lp-ecosystem-pill lp-hero-stagger"
                title="ICST LAB is an official property of ICST Connect (icstconnect.in)"
              >
                <span className="lp-pill-logos">
                  <img
                    src={ICST_CONNECT.LOGO_PATH}
                    alt="ICST Connect Logo"
                    className="lp-pill-logo-connect"
                    width={22}
                    height={22}
                  />
                  <span className="lp-pill-x" aria-hidden="true">×</span>
                  <img
                    src="/logo.png"
                    alt="ICST LAB Logo"
                    className="lp-pill-logo-app"
                    width={22}
                    height={22}
                  />
                </span>
                <span className="lp-pill-copy">
                  <span className="lp-live-dot" aria-hidden="true" />
                  <span><strong>ICST LAB</strong> • Part of <strong>icstconnect.in</strong></span>
                  <ExternalLink size={12} />
                </span>
              </a>

              <h1 className="lp-hero-title">
                <span className="lp-title-line lp-hero-stagger">Type Faster. Enter Cleaner.</span>
                <span className="lp-title-line lp-title-accent lp-hero-stagger">Master Every Office Lab.</span>
              </h1>

              <p className="lp-hero-lead lp-hero-stagger">
                An interactive simulation suite for Forms, Excel 365, Windows 11, Terminal Streams, Touch Typing &amp; Word Express — engineered as an official property of <strong>ICST Connect (icstconnect.in)</strong>, Chowberia.
              </p>

              {/* Action Buttons */}
              <div className="lp-hero-actions lp-hero-stagger">
                <button
                  type="button"
                  className="lp-btn lp-btn-primary"
                  onClick={onStartPractice}
                >
                  <Play size={16} />
                  <span>Start Practice Lab</span>
                  <ArrowRight size={15} />
                </button>

                {onOpenTyping && (
                  <button
                    type="button"
                    className="lp-btn lp-btn-typing"
                    onClick={onOpenTyping}
                  >
                    <Keyboard size={16} />
                    <span>Touch Typing</span>
                  </button>
                )}

                <a
                  href={ICST_CONNECT.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lp-btn lp-btn-connect"
                >
                  <img
                    src={ICST_CONNECT.LOGO_PATH}
                    alt="ICST Connect"
                    className="lp-btn-connect-img"
                    width={18}
                    height={18}
                  />
                  <span>icstconnect.in</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Clean Live Metric Chips */}
              <div className="lp-metrics-row lp-hero-stagger">
                <div className="lp-metric-chip">
                  <div className="lp-metric-val">6 Labs</div>
                  <div className="lp-metric-label">Full Simulators</div>
                </div>
                <div className="lp-metric-chip">
                  <div className="lp-metric-val">80+</div>
                  <div className="lp-metric-label">Guided Stages</div>
                </div>
                <div className="lp-metric-chip">
                  <div className="lp-metric-val">100%</div>
                  <div className="lp-metric-label">Offline PWA</div>
                </div>
                <div className="lp-metric-chip">
                  <div className="lp-metric-val">0 ms</div>
                  <div className="lp-metric-label">Instant Audit</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Graphical Playground ("Try It Right Here") */}
            <div ref={playgroundRef} className="lp-playground-wrap">
              <div className="lp-playground-card" aria-label="Interactive Mini Lab Playground">
                <div className="lp-pg-header">
                  <span className="lp-pg-badge">
                    <Zap size={13} color="#d97706" />
                    <span>Interactive Preview</span>
                  </span>

                  <div className="lp-pg-tabs" role="tablist" aria-label="Mini Preview Modes">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={pgMode === 'typing'}
                      className={`lp-pg-tab ${pgMode === 'typing' ? 'active' : ''}`}
                      onClick={() => handleSwitchPgMode('typing')}
                    >
                      <Keyboard size={12} />
                      <span>Type</span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={pgMode === 'excel'}
                      className={`lp-pg-tab ${pgMode === 'excel' ? 'active' : ''}`}
                      onClick={() => handleSwitchPgMode('excel')}
                    >
                      <FileSpreadsheet size={12} />
                      <span>Grid</span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={pgMode === 'windows'}
                      className={`lp-pg-tab ${pgMode === 'windows' ? 'active' : ''}`}
                      onClick={() => handleSwitchPgMode('windows')}
                    >
                      <FolderTree size={12} />
                      <span>Sort</span>
                    </button>
                  </div>
                </div>

                {/* MODE 1: TYPE SPARK */}
                {pgMode === 'typing' && (
                  <div className="lp-pg-stage">
                    <div className="lp-type-top">
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#124d7b', marginBottom: '8px' }}>
                          Type on your keyboard or tap the glowing key!
                        </div>
                        <div className="lp-type-word" aria-live="polite">
                          {currentWord.split('').map((ch, idx) => (
                            <span
                              key={`${wordIdx}-${idx}`}
                              data-char-idx={idx}
                              className={`lp-char-tile ${idx < charPos ? 'done' : idx === charPos ? 'current' : ''}`}
                            >
                              {ch}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="lp-ring-wrap" title="Current word completion">
                        <svg width="54" height="54" viewBox="0 0 54 54" aria-hidden="true">
                          <circle cx="27" cy="27" r="22" fill="none" stroke="#dbeafe" strokeWidth="5" />
                          <circle
                            cx="27"
                            cy="27"
                            r="22"
                            fill="none"
                            stroke="#1c6aa7"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray={138.2}
                            strokeDashoffset={138.2 * (1 - progressRatio)}
                            transform="rotate(-90 27 27)"
                            style={{ transition: 'stroke-dashoffset 0.22s ease' }}
                          />
                        </svg>
                        <span className="lp-ring-text">{Math.round(progressRatio * 100)}%</span>
                      </div>
                    </div>

                    <div className="lp-keycap-hint">
                      <span>Next key: <strong>{expectedChar || '✓'}</strong></span>
                      <span className="lp-combo-badge">
                        <Sparkles size={11} />
                        <span>Streak {combo} • Solved {wordsSolved}</span>
                      </span>
                    </div>

                    <div className="lp-mini-kb">
                      {MINI_KB_ROWS.map((row, rIdx) => (
                        <div key={rIdx} className="lp-mini-kb-row">
                          {row.map(keyChar => (
                            <button
                              key={keyChar}
                              type="button"
                              data-key={keyChar}
                              className={`lp-mini-key ${keyChar === expectedChar ? 'target' : ''}`}
                              onClick={() => triggerCharKey(keyChar)}
                              aria-label={`Press key ${keyChar}`}
                            >
                              {keyChar}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className="lp-pg-footer">
                      <span className="lp-pg-status">25 kinesthetic levels waiting inside</span>
                      <button
                        type="button"
                        className="lp-pg-launch"
                        onClick={() => (onOpenTyping || onStartPractice)()}
                      >
                        <span>Open Typing Lab</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                )}

                {/* MODE 2: EXCEL GRID PULSE */}
                {pgMode === 'excel' && (
                  <div className="lp-pg-stage">
                    <div className="lp-excel-bar">
                      <span className="lp-excel-fx">fx</span>
                      <span>=VERIFIED_BATCH({filledCells.length}/9 CELLS)</span>
                    </div>

                    <div className="lp-excel-grid">
                      {EXCEL_SAMPLES.map((cell, idx) => {
                        const isFilled = filledCells.includes(idx);
                        return (
                          <button
                            key={cell.coord}
                            type="button"
                            className={`lp-excel-cell ${isFilled ? 'filled' : ''}`}
                            onClick={() => handleToggleExcelCell(idx)}
                          >
                            <span className="lp-excel-coord">{cell.coord}</span>
                            <span className="lp-excel-val">{isFilled ? cell.value : 'Tap +'}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="lp-pg-footer">
                      <span className="lp-pg-status">Tap any cell to trigger ripple entry</span>
                      <button
                        type="button"
                        className="lp-pg-launch"
                        onClick={() => (onOpenExcel || onStartPractice)()}
                      >
                        <span>Open Excel 365 Lab</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                )}

                {/* MODE 3: WINDOWS QUICK SORT */}
                {pgMode === 'windows' && (
                  <div className="lp-pg-stage">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#124d7b' }}>
                          {sortedIds.length < SORT_FILES.length
                            ? 'Click any file to auto-sort into its folder:'
                            : 'All files cleanly organized!'}
                        </span>
                        {sortedIds.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setSortedIds([])}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#0284c7', cursor: 'pointer' }}
                          >
                            <RotateCcw size={11} />
                            <span>Reset</span>
                          </button>
                        )}
                      </div>

                      <div className="lp-sort-files">
                        {SORT_FILES.filter(f => !sortedIds.includes(f.id)).map(file => (
                          <button
                            key={file.id}
                            type="button"
                            data-file-id={file.id}
                            className="lp-file-chip"
                            onClick={() => handleSortFile(file)}
                          >
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: file.color }} />
                            <span>{file.name}</span>
                          </button>
                        ))}
                        {sortedIds.length === SORT_FILES.length && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#15803d', fontWeight: 800, fontSize: '13px' }}>
                            <CheckCircle2 size={16} />
                            <span>100% Zero-Error Desktop Tree</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lp-folders-row">
                      {([
                        { id: 'sheets', label: 'Spreadsheets', emoji: '📊' },
                        { id: 'docs', label: 'Documents', emoji: '📄' },
                        { id: 'media', label: 'Media', emoji: '🖼️' }
                      ] as const).map(bin => {
                        const count = SORT_FILES.filter(f => f.target === bin.id && sortedIds.includes(f.id)).length;
                        return (
                          <div key={bin.id} data-bin={bin.id} className={`lp-folder-bin ${count > 0 ? 'has-item' : ''}`}>
                            <div style={{ fontSize: '20px', lineHeight: 1 }}>{bin.emoji}</div>
                            <div className="lp-folder-name">{bin.label}</div>
                            <div className="lp-folder-count">{count} file{count === 1 ? '' : 's'}</div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="lp-pg-footer">
                      <span className="lp-pg-status">12 Windows 11 desktop mastery levels</span>
                      <button
                        type="button"
                        className="lp-pg-launch"
                        onClick={() => (onOpenWindows || onStartPractice)()}
                      >
                        <span>Open Windows Lab</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6-LAB INTERACTIVE VISUAL EXPLORER
         ==================================================================== */}
      <section className="lp-section" aria-labelledby="labs-explorer-heading">
        <div className="lp-container">
          <div className="lp-section-head">
            <div>
              <span className="lp-eyebrow">
                <Sparkles size={12} />
                <span>Interactive Simulation Suite</span>
              </span>
              <h2 id="labs-explorer-heading" className="lp-section-h2">
                Choose a Lab &amp; Start Building Skill
              </h2>
              <p className="lp-section-desc">
                Six purpose-built environments modeled on real administrative, banking, spreadsheet, and keyboard workflows.
              </p>
            </div>

            <div className="lp-filter-bar" role="tablist" aria-label="Filter training labs">
              <button
                type="button"
                role="tab"
                aria-selected={labFilter === 'all'}
                className={`lp-filter-btn ${labFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All Labs (6)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={labFilter === 'data-entry'}
                className={`lp-filter-btn ${labFilter === 'data-entry' ? 'active' : ''}`}
                onClick={() => handleFilterChange('data-entry')}
              >
                Data Entry (3)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={labFilter === 'keyboard-os'}
                className={`lp-filter-btn ${labFilter === 'keyboard-os' ? 'active' : ''}`}
                onClick={() => handleFilterChange('keyboard-os')}
              >
                Keyboard &amp; OS (3)
              </button>
            </div>
          </div>

          <div ref={labsGridRef} className="lp-labs-grid">
            {visibleLabs.map(lab => (
              <button
                key={lab.id}
                type="button"
                className="lp-lab-card"
                style={{ '--lab-accent': lab.accent, '--lab-tint': lab.tint } as React.CSSProperties}
                onClick={lab.onLaunch}
                onMouseEnter={handleCardHover}
                onMouseLeave={handleCardLeave}
              >
                <div>
                  <div className="lp-lab-graphic-box">
                    {lab.graphic}
                  </div>
                  <div className="lp-lab-top-meta">
                    <span className="lp-lab-pill">{lab.tag}</span>
                    <span className="lp-lab-stat">{lab.stat}</span>
                  </div>
                  <h3 className="lp-lab-title">{lab.title}</h3>
                  <p className="lp-lab-desc">{lab.desc}</p>
                </div>

                <span className="lp-lab-cta">
                  <span>{lab.actionLabel}</span>
                  <ArrowRight size={14} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          GRAPHICAL 4-STEP INTERACTIVE JOURNEY
         ==================================================================== */}
      <section className="lp-section lp-section-surface" aria-labelledby="journey-heading">
        <div className="lp-container">
          <div className="lp-section-head">
            <div>
              <span className="lp-eyebrow">
                <Zap size={12} />
                <span>Zero-Friction Flow</span>
              </span>
              <h2 id="journey-heading" className="lp-section-h2">
                How You Level Up at ICST LAB
              </h2>
              <p className="lp-section-desc">
                Click any milestone below to preview your path from first keystroke to verified certificate.
              </p>
            </div>

            <button
              type="button"
              className="lp-btn lp-btn-connect"
              onClick={onOpenDashboard}
            >
              <LayoutDashboard size={15} />
              <span>View My Progress</span>
            </button>
          </div>

          <div className="lp-flow-wrap">
            <svg className="lp-flow-svg-line" viewBox="0 0 1000 12" preserveAspectRatio="none" aria-hidden="true">
              <line x1="0" y1="6" x2="1000" y2="6" stroke="#d2c8b7" strokeWidth="2.5" strokeDasharray="6 6" />
              <line x1="0" y1="6" x2="1000" y2="6" stroke="#1c6aa7" strokeWidth="2.5" strokeDasharray="14 34" className="lp-signal-dash" />
            </svg>

            <div className="lp-flow-grid">
              {JOURNEY_STEPS.map((st, idx) => (
                <button
                  key={st.num}
                  type="button"
                  className={`lp-flow-step ${activeStep === idx ? 'active' : ''}`}
                  onClick={() => setActiveStep(idx)}
                >
                  <div className="lp-flow-num">{st.num}</div>
                  <h3 className="lp-flow-title">{st.title}</h3>
                  <p className="lp-flow-desc">{st.desc}</p>
                </button>
              ))}
            </div>

            <div className="lp-flow-tip-bar">
              <span className="lp-flow-tip-text">{activeStepObj.tip}</span>
              <button
                type="button"
                className="lp-pg-launch"
                onClick={handleJourneyAction}
              >
                <span>{activeStepObj.ctaLabel}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          OFFICIAL ICST CONNECT ECOSYSTEM BRIDGE (icstconnect.in)
         ==================================================================== */}
      <section className="lp-section" aria-labelledby="icst-connect-bridge-heading">
        <div className="lp-container">
          <div className="lp-connect-card">
            <div className="lp-connect-top">
              {/* Animated Dual-Logo Bridge */}
              <div className="lp-connect-bridge-visual" aria-label="ICST Connect and ICST LAB Official Connection">
                <a
                  href={ICST_CONNECT.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lp-bridge-node"
                  style={{ textDecoration: 'none' }}
                  title="Visit ICST Connect Official Website"
                >
                  <div className="lp-bridge-logo-box">
                    <img
                      src={ICST_CONNECT.LOGO_PATH}
                      alt="ICST Connect Logo (icstconnect.in)"
                      width={42}
                      height={42}
                      loading="lazy"
                    />
                  </div>
                  <span className="lp-bridge-label">icstconnect.in</span>
                </a>

                <svg className="lp-bridge-pulse-svg" viewBox="0 0 74 24" fill="none" aria-hidden="true">
                  <line x1="4" y1="12" x2="70" y2="12" stroke="rgba(125,211,252,0.35)" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="4" y1="12" x2="70" y2="12" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="10 14" className="lp-signal-dash" />
                  <circle cx="37" cy="12" r="4" fill="#38bdf8" />
                </svg>

                <div className="lp-bridge-node">
                  <div className="lp-bridge-logo-box">
                    <img
                      src="/logo.png"
                      alt="ICST LAB Logo"
                      width={42}
                      height={42}
                      loading="lazy"
                    />
                  </div>
                  <span className="lp-bridge-label">ICST LAB</span>
                </div>
              </div>

              <div className="lp-connect-copy">
                <span className="lp-connect-tag">
                  <Globe size={12} />
                  <span>Official Property of icstconnect.in</span>
                </span>
                <h2 id="icst-connect-bridge-heading" className="lp-connect-h2">
                  Connected Directly to ICST Connect
                </h2>
                <p className="lp-connect-p">
                  This interactive lab suite is an official part of <strong>ICST Connect (icstconnect.in)</strong> — the student &amp; public digital portal of the <strong>Institute of Computer Science &amp; Technology, Chowberia</strong>. Explore certified courses, online exams, scholarships, or share your lab honors directly.
                </p>
              </div>
            </div>

            {/* Direct Ecosystem & Portal Action Tiles */}
            <div className="lp-connect-grid">
              <a
                href={ICST_CONNECT.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="lp-portal-tile"
              >
                <div className="lp-portal-icon" style={{ background: 'rgba(56, 189, 248, 0.2)' }}>
                  <Globe size={18} color="#38bdf8" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="lp-portal-tile-title">ICST Connect Home</div>
                  <div className="lp-portal-tile-sub">Visit icstconnect.in portal</div>
                </div>
                <ExternalLink size={14} color="#7dd3fc" />
              </a>

              <a
                href={ICST_CONNECT.COURSES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="lp-portal-tile"
              >
                <div className="lp-portal-icon" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                  <BookOpen size={18} color="#34d399" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="lp-portal-tile-title">Certified Courses</div>
                  <div className="lp-portal-tile-sub">Explore diplomas &amp; tracks</div>
                </div>
                <ExternalLink size={14} color="#7dd3fc" />
              </a>

              <a
                href={ICST_CONNECT.ONLINE_TEST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="lp-portal-tile"
              >
                <div className="lp-portal-icon" style={{ background: 'rgba(168, 85, 247, 0.22)' }}>
                  <ClipboardCheck size={18} color="#c084fc" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="lp-portal-tile-title">Online Examinations</div>
                  <div className="lp-portal-tile-sub">icstconnect.in/online-test</div>
                </div>
                <ExternalLink size={14} color="#7dd3fc" />
              </a>

              {onOpenAchievementShare && (
                <button
                  type="button"
                  className="lp-portal-tile"
                  onClick={onOpenAchievementShare}
                >
                  <div className="lp-portal-icon" style={{ background: 'rgba(251, 191, 36, 0.2)' }}>
                    <Award size={18} color="#fbbf24" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="lp-portal-tile-title">Share Verified Honors</div>
                    <div className="lp-portal-tile-sub">Story cards &amp; certificates</div>
                  </div>
                  <Share2 size={14} color="#fbbf24" />
                </button>
              )}

              <button
                type="button"
                className="lp-portal-tile"
                onClick={onOpenShowcase}
              >
                <div className="lp-portal-icon" style={{ background: 'rgba(249, 115, 22, 0.2)' }}>
                  <Sparkles size={18} color="#fb923c" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="lp-portal-tile-title">Live Showcase</div>
                  <div className="lp-portal-tile-sub">Institute highlights &amp; demos</div>
                </div>
                <ArrowRight size={14} color="#cbd5e1" />
              </button>

              <button
                type="button"
                className="lp-portal-tile"
                onClick={onOpenTeacherMode}
              >
                <div className="lp-portal-icon" style={{ background: 'rgba(129, 140, 248, 0.22)' }}>
                  <UserCheck size={18} color="#a5b4fc" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="lp-portal-tile-title">Teacher Mode</div>
                  <div className="lp-portal-tile-sub">Faculty assessment portal</div>
                </div>
                <ArrowRight size={14} color="#cbd5e1" />
              </button>
            </div>

            {/* Community Socials Strip */}
            <div className="lp-connect-socials">
              <div className="lp-social-links">
                <a
                  href={ICST_CONNECT.GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lp-social-pill"
                >
                  <span>GitHub • icstconnect</span>
                  <ExternalLink size={11} />
                </a>
                <a
                  href={ICST_CONNECT.INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lp-social-pill"
                >
                  <Smartphone size={12} />
                  <span>Instagram • @icstconnect</span>
                  <ExternalLink size={11} />
                </a>
              </div>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                Tag <strong style={{ color: '#e0f2fe' }}>#ICSTChowberia</strong> to be featured on ICST Connect
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});
