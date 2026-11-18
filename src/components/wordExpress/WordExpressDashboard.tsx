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
  Cookie
} from 'lucide-react';

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
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, isPseudoFullscreen, toggleFullscreen } = useFullscreen(rootRef);

  const [toughness, setToughness] = useState<WordToughness>(() => getWordExpressToughnessCookie());
  const [masterActive, setMasterActive] = useState<boolean>(() => isMasterUnlocked());
  const [unlockPromptOpen, setUnlockPromptOpen] = useState(false);
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

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

  const handleSelectToughness = (next: WordToughness) => {
    setToughness(next);
    setWordExpressToughnessCookie(next);
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

  const records = progress.completedLevels || {};
  const completedCount = Object.values(records).filter(r => r.passed).length;
  const totalStars = Object.values(records).reduce((sum, r) => sum + (r.stars || 0), 0);
  const currentLevelId = progress.currentLevel || 1;
  const currentLevelData = WORD_EXPRESS_LEVELS.find(l => l.id === currentLevelId) || WORD_EXPRESS_LEVELS[0];
  const currentCriteria = getCriteriaForToughness(currentLevelData, toughness);
  const highestCarrier = getCarrierByTier(progress.highestCarrierTier || 1);

  return (
    <div
      ref={rootRef}
      className={`typing-root theme-${theme} ${isPseudoFullscreen ? 'is-pseudo-fullscreen' : ''} ${isFullscreen ? 'is-fullscreen' : ''}`}
      style={{ overflowY: isFullscreen ? 'auto' : undefined }}
    >
      {/* Top Header */}
      <header className="typing-header-bar">
        <div className="typing-header-left">
          {onBackToMainHub && (
            <button
              type="button"
              onClick={onBackToMainHub}
              className="we-back-btn"
            >
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
              <h1 style={{ fontSize: '16px', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                ICST Word Express Delivery Lab
              </h1>
              <span style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                25 Word Stages • 16-Tier Streak Vehicle Delivery • Easy / Moderate / Hard
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
            <span>{masterActive ? 'Master Unlocked (ICST)' : 'Instructor Unlock'}</span>
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

      <main className="typing-dashboard-wrap">
        {/* Hero Quick Launch Card */}
        <div
          style={{
            borderRadius: '16px',
            padding: '22px 26px',
            background: isDark
              ? 'linear-gradient(135deg, #212534 0%, #171923 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f4f0ff 100%)',
            border: `1.5px solid ${isDark ? '#3a3f55' : '#ddd4f0'}`,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}
        >
          <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="typing-stage-pill" style={{ borderColor: '#7c3aed', color: isDark ? '#c084fc' : '#6d28d9', background: isDark ? '#2e1065' : '#f3e8ff' }}>
                <Sparkles size={12} /> STAGE {currentLevelId} OF 25
              </span>
              <span className={`practicing-mode-tag ${toughness === 'easy' ? 'learning' : 'challenge'}`}>
                {toughness} toughness
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94a3b8' : '#5e564b' }}>
                {currentLevelData.stageName}
              </span>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>
              {currentLevelData.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '13px' }}>
              <span style={{ color: isDark ? '#cbd5e1' : '#4d463b', fontWeight: 600 }}>
                {currentLevelData.words.length} simple words • {currentLevelData.subtitle}
              </span>
              <span style={{ color: '#0284c7', background: isDark ? 'rgba(56,189,248,0.12)' : 'rgba(2,132,199,0.08)', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                Goal: {currentCriteria.desc}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleLaunchWithFullscreen(currentLevelId)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '13px 26px',
              borderRadius: '12px',
              background: '#7c3aed',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.38)'
            }}
          >
            <Play size={16} fill="currentColor" />
            <span>Start Stage {currentLevelId}</span>
          </button>
        </div>

        {/* Cookie-Backed Toughness Selector Panel */}
        <section className="we-toughness-panel">
          <div className="we-toughness-panel-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gauge size={17} color="#7c3aed" />
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>
                Choose Level Crossing Toughness
              </h3>
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
                  onClick={() => handleSelectToughness(card.id)}
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

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          <div className="we-metric-card">
            <span className="we-metric-lbl">Stages Cleared</span>
            <div className="we-metric-val">{completedCount} <small>/ 25</small></div>
          </div>
          <div className="we-metric-card">
            <span className="we-metric-lbl">Peak Speed</span>
            <div className="we-metric-val" style={{ color: '#0284c7' }}>{progress.bestWpm || 0} <small>WPM</small></div>
          </div>
          <div className="we-metric-card">
            <span className="we-metric-lbl">Avg Accuracy</span>
            <div className="we-metric-val" style={{ color: '#10b981' }}>{progress.averageAccuracy || 100}%</div>
          </div>
          <div className="we-metric-card">
            <span className="we-metric-lbl">Stars Earned</span>
            <div className="we-metric-val" style={{ color: '#f59e0b' }}>{totalStars} <small>/ 75 ★</small></div>
          </div>
          <div className="we-metric-card">
            <span className="we-metric-lbl">Highest Courier</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <DeliveryCarrierSVG carrierId={highestCarrier.id} accent={highestCarrier.accent} size={42} />
              <span style={{ fontSize: '13px', fontWeight: 800, color: highestCarrier.accent }}>
                {highestCarrier.name}
              </span>
            </div>
          </div>
        </div>

        {/* 16-Carrier Escalation Fleet Showcase */}
        <section className="we-fleet-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                16-Tier Streak Delivery Fleet (Human → UFO 3)
              </h3>
              <span style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                Build your typing streak cleanly to evolve your live word courier from Runner all the way to UFO 3!
              </span>
            </div>
          </div>

          <div className="we-fleet-grid">
            {CARRIER_TIERS.map(c => {
              const reached = c.tier <= (progress.highestCarrierTier || 1);
              return (
                <div
                  key={c.id}
                  className={`we-fleet-item ${reached ? 'is-reached' : ''}`}
                  style={{ borderColor: reached ? c.accent : undefined }}
                  title={`Tier ${c.tier}: ${c.name} — Requires ${c.minStreak} streak`}
                >
                  <div className="we-fleet-tier-row">
                    <span className="we-fleet-tier" style={{ background: reached ? c.accent : undefined }}>
                      T{c.tier}
                    </span>
                    <span className="we-fleet-streak">{c.minStreak}+ strk</span>
                  </div>
                  <DeliveryCarrierSVG carrierId={c.id} accent={c.accent} size={58} />
                  <span className="we-fleet-name">{c.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5 Stages (25 Levels) Grid */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
              Word Express Curriculum (25 Stages)
            </h3>
            <span style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#756c5e' }}>
              Click any unlocked stage to launch
            </span>
          </div>

          <div className="stage-card-grid">
            {WORD_EXPRESS_STAGES_META.map(stageMeta => {
              const [startLvl, endLvl] = stageMeta.levelRange;
              const stageLevels = WORD_EXPRESS_LEVELS.filter(l => l.id >= startLvl && l.id <= endLvl);
              const completedInStage = stageLevels.filter(l => records[l.id]?.passed).length;
              const isMastered = completedInStage === stageLevels.length;
              const isCurrentStage = !isMastered && currentLevelId >= startLvl && currentLevelId <= endLvl;
              const isLocked = !masterActive && currentLevelId < startLvl && completedInStage === 0;

              return (
                <div key={stageMeta.stage} className={`stage-card ${isCurrentStage ? 'is-active-stage' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: stageMeta.color, textTransform: 'uppercase' }}>
                        STAGE {stageMeta.stage} (L{startLvl}–L{endLvl})
                      </span>
                      <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '4px 0 2px 0' }}>
                        {stageMeta.title.replace(`Stage ${stageMeta.stage}: `, '')}
                      </h4>
                      <span style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                        {stageMeta.tagline}
                      </span>
                    </div>
                    <SummaryBadgeSlot earned={isMastered} stars={isMastered ? 3 : 0} size="sm" theme={theme} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                    {stageLevels.map(lvl => {
                      const rec = records[lvl.id];
                      const unlocked = masterActive || lvl.id <= (progress.maxUnlockedLevel || 1);
                      const isCurrent = currentLevelId === lvl.id;
                      const crit = getCriteriaForToughness(lvl, toughness);

                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          disabled={!unlocked}
                          onClick={() => unlocked && handleLaunchWithFullscreen(lvl.id)}
                          title={`Stage ${lvl.id}: ${lvl.title} (${crit.desc})`}
                          style={{
                            padding: '8px 4px',
                            borderRadius: '8px',
                            border: isCurrent ? `2px solid ${stageMeta.color}` : `1px solid ${isDark ? '#333842' : '#d2c8b7'}`,
                            background: rec?.passed
                              ? (isDark ? '#14382c' : '#ecfdf5')
                              : isCurrent
                              ? (isDark ? '#1e293b' : '#ede9fe')
                              : unlocked
                              ? (isDark ? '#272a32' : '#ffffff')
                              : (isDark ? '#1a1c20' : '#f2ece0'),
                            color: rec?.passed
                              ? (isDark ? '#34d399' : '#059669')
                              : isCurrent
                              ? stageMeta.color
                              : unlocked
                              ? (isDark ? '#f8fafc' : '#1c1915')
                              : (isDark ? '#4b5563' : '#a89d8d'),
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: unlocked ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '3px'
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

                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => {
                      const targetLvl = stageLevels.find(l => !records[l.id]?.passed)?.id || startLvl;
                      handleLaunchWithFullscreen(targetLvl);
                    }}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '10px',
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
        </div>
      </main>

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
              {passcodeError && <span style={{ color: '#ef4444', fontSize: '11px' }}>Invalid passcode. Enter 'ICST'.</span>}
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
      {/* Non-Blocking English / সহজ বাংলা Floating Lab Guide */}
      <LabGuideAssistant context="word-express-dashboard" theme={theme} />
    </div>
  );
};
