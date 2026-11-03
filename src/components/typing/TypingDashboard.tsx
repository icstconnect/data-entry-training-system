import React, { useState, useEffect } from 'react';
import { 
  Play, Lock, Unlock, Award, Zap, Target, Flame, 
  BookOpen, ChevronRight, CheckCircle2, RotateCcw, 
  Sun, Moon, ShieldAlert, Sparkles, Trophy
} from 'lucide-react';
import { SummaryBadgeSlot } from './SummaryBadgeSlot';
import { TypingCurriculumModal } from './TypingCurriculumModal';
import { STAGES_META, LEVELS } from './typingData';
import { TypingTheme } from '../../types/typing';
import { TouchTypingProgress } from '../../types/touchTyping';
import { 
  isMasterUnlocked, 
  verifyAndApplyMasterPassword, 
  lockToStudentProgression 
} from '../../services/masterUnlockService';
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
  const [unlockPasswordPrompt, setUnlockPasswordPrompt] = useState(false);
  const [curriculumDrawerOpen, setCurriculumDrawerOpen] = useState(false);
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [masterActive, setMasterActive] = useState<boolean>(() => isMasterUnlocked());

  useEffect(() => {
    const handleUnlockChange = (e: any) => {
      setMasterActive(!!e.detail?.unlocked);
    };
    window.addEventListener('icst_master_unlock_changed', handleUnlockChange);
    return () => window.removeEventListener('icst_master_unlock_changed', handleUnlockChange);
  }, []);

  // Compute stats across all records
  const records = progress.completedLevels || {};
  const completedLevelsCount = Object.values(records).filter(r => r.passed).length;
  const totalStars = Object.values(records).reduce((sum, r) => sum + (r.stars || 0), 0);
  
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

  // Handler for Master Unlock
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

  const currentLevelId = progress.currentLevel || 1;
  const currentLevelData = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];

  return (
    <div className={`typing-root theme-${theme} ${className}`}>
      {/* ================================================================= */}
      {/* TOP HEADER CONTROLS BAR                                           */}
      {/* ================================================================= */}
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
                fontWeight: 600,
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
                borderRadius: '8px',
                background: isDark ? '#0369a1' : '#e0f2fe',
                color: isDark ? '#38bdf8' : '#0369a1'
              }}
            >
              <Zap size={18} />
            </span>
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                ICST Touch Typing Laboratory
              </h1>
              <span style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                Spatial Light-Beam Guided 10-Finger Kinesthetic Training
              </span>
            </div>
          </div>
        </div>

        <div className="typing-header-right">
          {/* Master Unlock Button */}
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
            <span>{masterActive ? 'Master Unlocked (ICST)' : 'Instructor Unlock'}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="typing-theme-toggle-btn"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun size={14} color="#facc15" /> : <Moon size={14} color="#0284c7" />}
            <span>{isDark ? '☀️ Light' : '🌙 Dark'}</span>
          </button>

          {/* View Curriculum Drawer */}
          <button
            type="button"
            onClick={() => { setCurriculumDrawerOpen(true); if (onOpenCurriculum) onOpenCurriculum(); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              background: '#0284c7',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
            }}
          >
            <BookOpen size={13} />
            <span>Curriculum (25 Levels)</span>
          </button>
        </div>
      </header>

      {/* ================================================================= */}
      {/* INSTRUCTOR UNLOCK POPUP MODAL                                     */}
      {/* ================================================================= */}
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
                    Invalid passcode. Enter 'ICST' to unlock.
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
                    background: '#0284c7',
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

      {/* ================================================================= */}
      {/* MAIN DASHBOARD CONTENT AREA                                       */}
      {/* ================================================================= */}
      <main className="typing-dashboard-wrap">
        {/* HERO BANNER & RESUME QUICK LAUNCH */}
        <div
          style={{
            borderRadius: '16px',
            padding: '24px 28px',
            background: isDark 
              ? 'linear-gradient(135deg, #21252d 0%, #17191d 100%)' 
              : 'linear-gradient(135deg, #ffffff 0%, #f6f1e9 100%)',
            border: `1.5px solid ${isDark ? '#363d4c' : '#dfd7c8'}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}
        >
          <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="typing-stage-pill" style={{ borderColor: '#0284c7', color: isDark ? '#38bdf8' : '#0369a1', background: isDark ? '#1e293b' : '#e0f2fe' }}>
                <Sparkles size={12} /> LEVEL {currentLevelId} IN PROGRESS
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94a3b8' : '#5e564b' }}>
                Stage {currentLevelData.stage} of 5 • {currentLevelData.stageName}
              </span>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '2px 0 0 0', lineHeight: 1.25, color: isDark ? '#f8fafc' : '#1c1915' }}>
              {currentLevelData.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: isDark ? '#cbd5e1' : '#4d463b', fontWeight: 600 }}>
                {currentLevelData.subtitle}
              </span>
              <span style={{ color: isDark ? '#64748b' : '#b3a693' }}>•</span>
              <span style={{ fontSize: '12px', color: isDark ? '#38bdf8' : '#0369a1', background: isDark ? 'rgba(56,189,248,0.1)' : 'rgba(2,132,199,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                Goal: {currentLevelData.criteriaDesc}
              </span>
            </div>
          </div>

          {/* Quick Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={() => onLaunchLevel(currentLevelId)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '13px 26px',
                borderRadius: '10px',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              <Play size={16} fill="currentColor" />
              <span>Launch Practice Lab</span>
            </button>
          </div>
        </div>

        {/* OVERALL METRICS STATS BAR */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px'
          }}
        >
          {/* Card: Levels Completed */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              background: isDark ? '#212429' : '#ffffff',
              border: `1px solid ${isDark ? '#333842' : '#e4ddd0'}`
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94a3b8' : '#756c5e', textTransform: 'uppercase' }}>
              Curriculum Progress
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
              <span style={{ fontSize: '26px', fontWeight: 800 }}>{completedLevelsCount}</span>
              <span style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#756c5e' }}>/ 25 Completed</span>
            </div>
          </div>

          {/* Card: Highest WPM */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              background: isDark ? '#212429' : '#ffffff',
              border: `1px solid ${isDark ? '#333842' : '#e4ddd0'}`
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94a3b8' : '#756c5e', textTransform: 'uppercase' }}>
              Peak Typing Velocity
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
              <span style={{ fontSize: '26px', fontWeight: 800, color: isDark ? '#38bdf8' : '#0284c7' }}>{bestWpm}</span>
              <span style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#756c5e' }}>WPM</span>
            </div>
          </div>

          {/* Card: Accuracy */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              background: isDark ? '#212429' : '#ffffff',
              border: `1px solid ${isDark ? '#333842' : '#e4ddd0'}`
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94a3b8' : '#756c5e', textTransform: 'uppercase' }}>
              Average Precision
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
              <span style={{ fontSize: '26px', fontWeight: 800, color: '#10b981' }}>{avgAccuracy}%</span>
              <span style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#756c5e' }}>Overall</span>
            </div>
          </div>

          {/* Card: Stars Earned */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              background: isDark ? '#212429' : '#ffffff',
              border: `1px solid ${isDark ? '#333842' : '#e4ddd0'}`
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#94a3b8' : '#756c5e', textTransform: 'uppercase' }}>
              Golden Stars Earned
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
              <span style={{ fontSize: '26px', fontWeight: 800, color: '#f59e0b' }}>{totalStars}</span>
              <span style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#756c5e' }}>/ 75 ★</span>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 5 STAGES CARDS GRID                                             */}
        {/* =============================================================== */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
              Mastery Stages (1 to 5)
            </h3>
            <span style={{ fontSize: '13px', color: isDark ? '#94a3b8' : '#756c5e' }}>
              Select any unlocked stage to train
            </span>
          </div>

          <div className="stage-card-grid">
            {STAGES_META.map(stageMeta => {
              const [startLevel, endLevel] = stageMeta.levelRange;
              const stageLevels = LEVELS.filter(l => l.id >= startLevel && l.id <= endLevel);
              const completedInStage = stageLevels.filter(l => records[l.id]?.passed).length;
              const isStageMastered = completedInStage === stageLevels.length;
              const isCurrentStage = !isStageMastered && (currentLevelId >= startLevel && currentLevelId <= endLevel);
              const isStageLocked = !masterActive && currentLevelId < startLevel && completedInStage === 0;

              return (
                <div
                  key={stageMeta.stage}
                  className={`stage-card ${isCurrentStage ? 'is-active-stage' : ''}`}
                >
                  {/* Top Badge Slot & Stage Title */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: stageMeta.color,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        STAGE {stageMeta.stage}
                      </span>
                      <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '4px 0 2px 0', lineHeight: 1.2 }}>
                        {stageMeta.title.replace(`Stage ${stageMeta.stage}: `, '')}
                      </h4>
                      <span style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                        {stageMeta.tagline}
                      </span>
                    </div>

                    {/* Summary Badge Slot */}
                    <SummaryBadgeSlot
                      earned={isStageMastered}
                      stars={isStageMastered ? 3 : 0}
                      size="sm"
                      theme={theme}
                      tooltip={isStageMastered ? `${stageMeta.badgeName} Earned!` : `Complete all ${stageLevels.length} levels in Stage ${stageMeta.stage} to earn medal`}
                    />
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                      <span>Progress</span>
                      <span>{completedInStage} / {stageLevels.length} Levels</span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '4px', background: isDark ? '#191b1f' : '#e4ddd0', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${(completedInStage / stageLevels.length) * 100}%`,
                          backgroundColor: stageMeta.color,
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Level Pills 5-Keycap Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginTop: '8px' }}>
                    {stageLevels.map(lvl => {
                      const rec = records[lvl.id];
                      const isLvlUnlocked = masterActive || lvl.id <= (progress.maxUnlockedLevel || 1);
                      const isCurrent = currentLevelId === lvl.id;

                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => {
                            if (isLvlUnlocked) onLaunchLevel(lvl.id);
                          }}
                          disabled={!isLvlUnlocked}
                          title={`Level ${lvl.id}: ${lvl.title} ${rec?.passed ? '★'.repeat(rec.stars || 1) : (isLvlUnlocked ? '(Ready)' : '(Locked)')}`}
                          style={{
                            padding: '8px 4px',
                            borderRadius: '8px',
                            border: isCurrent 
                              ? `2px solid ${stageMeta.color}` 
                              : `1px solid ${isDark ? '#333842' : '#d2c8b7'}`,
                            background: rec?.passed 
                              ? (isDark ? '#14382c' : '#ecfdf5') 
                              : isCurrent 
                                ? (isDark ? '#1e293b' : '#e0f2fe')
                                : isLvlUnlocked 
                                  ? (isDark ? '#272a32' : '#ffffff')
                                  : (isDark ? '#1a1c20' : '#f2ece0'),
                            color: rec?.passed 
                              ? (isDark ? '#34d399' : '#059669') 
                              : isCurrent 
                                ? stageMeta.color
                                : isLvlUnlocked 
                                  ? (isDark ? '#f8fafc' : '#1c1915')
                                  : (isDark ? '#4b5563' : '#a89d8d'),
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: isLvlUnlocked ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                            boxShadow: isCurrent 
                              ? `0 0 10px ${stageMeta.color}35` 
                              : isLvlUnlocked 
                                ? (isDark ? '0 2px 0 #15171b' : '0 2px 0 #cfc6b6') 
                                : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>L{lvl.id}</span>
                          <span style={{ fontSize: '9px', lineHeight: 1, fontWeight: 700 }}>
                            {rec?.passed ? '★'.repeat(rec.stars || 1) : (isLvlUnlocked ? '•' : '🔒')}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Stage Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      // Find first incomplete level in this stage, or first level
                      const targetLvl = stageLevels.find(l => !records[l.id]?.passed)?.id || startLevel;
                      onLaunchLevel(targetLvl);
                    }}
                    disabled={isStageLocked}
                    style={{
                      marginTop: '10px',
                      padding: '11px 16px',
                      borderRadius: '10px',
                      border: isStageLocked 
                        ? `1px solid ${isDark ? '#333842' : '#d2c8b7'}` 
                        : 'none',
                      background: isStageLocked 
                        ? (isDark ? '#1a1c20' : '#f2ece0') 
                        : stageMeta.color,
                      color: isStageLocked 
                        ? (isDark ? '#64748b' : '#a89d8d') 
                        : '#ffffff',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: isStageLocked ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: isStageLocked ? 'none' : `0 4px 14px ${stageMeta.color}40`,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isStageLocked ? <Lock size={14} /> : <Play size={14} fill="currentColor" />}
                    <span>{isStageLocked ? 'Stage Locked' : `Practice Stage ${stageMeta.stage} →`}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <TypingCurriculumModal
        isOpen={curriculumDrawerOpen}
        onClose={() => setCurriculumDrawerOpen(false)}
        currentLevelId={progress.currentLevel || 1}
        progress={progress}
        onSelectLevel={(lvlId) => {
          setCurriculumDrawerOpen(false);
          onLaunchLevel(lvlId);
        }}
        theme={theme}
      />
    </div>
  );
};
