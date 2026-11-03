import React, { useState, useEffect } from 'react';
import { WindowsSimulationMode } from '../../types/windows';
import { FILE_MANAGEMENT_LEVELS, FOLDER_MANAGEMENT_LEVELS } from '../../data/windowsCurriculumData';
import { 
  isMasterUnlocked, 
  verifyAndApplyMasterPassword, 
  lockToStudentProgression 
} from '../../services/masterUnlockService';
import { 
  Maximize2, 
  Minimize2, 
  Minus, 
  X, 
  Key, 
  Lock, 
  Unlock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export interface AuditBreakdownItem {
  label: string;
  isCorrect: boolean;
  statusText: string;
}

interface DitaCopilotCardProps {
  isOpen: boolean;
  onClose: () => void;
  mode: WindowsSimulationMode;
  onSwitchMode: (mode: WindowsSimulationMode) => void;
  currentLevel: number;
  maxUnlockedLevel: number;
  onSelectLevel: (lvl: number) => void;
  scorePercentage: number;
  scoreSummaryText: string;
  onAdvanceNextStage: () => void;
  hasNextStage: boolean;
  onGiveHint: () => void;
  onResetLevel: () => void;
  breakdown?: AuditBreakdownItem[];
}

export const DitaCopilotCard: React.FC<DitaCopilotCardProps> = ({
  isOpen,
  onClose,
  mode,
  onSwitchMode,
  currentLevel,
  maxUnlockedLevel,
  onSelectLevel,
  scorePercentage,
  scoreSummaryText,
  onAdvanceNextStage,
  hasNextStage,
  onGiveHint,
  onResetLevel,
  breakdown = []
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [cardSize, setCardSize] = useState<'normal' | 'expanded'>('normal');
  const [langMode, setLangMode] = useState<'bn' | 'en' | 'both'>('bn');
  const [showChecklist, setShowChecklist] = useState<boolean>(false);

  // Master Password State
  const [masterUnlocked, setMasterUnlockedState] = useState<boolean>(() => isMasterUnlocked());
  const [showMasterPrompt, setShowMasterPrompt] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [masterError, setMasterError] = useState<string | null>(null);

  useEffect(() => {
    const handleMasterChange = (e: any) => {
      setMasterUnlockedState(isMasterUnlocked());
    };
    window.addEventListener('icst_master_unlock_changed', handleMasterChange);
    return () => window.removeEventListener('icst_master_unlock_changed', handleMasterChange);
  }, []);

  if (!isOpen) return null;

  const isFileMode = mode === 'file_management';
  const totalLevels = isFileMode ? 5 : 7;
  const currentLevelData = isFileMode 
    ? FILE_MANAGEMENT_LEVELS[currentLevel]
    : FOLDER_MANAGEMENT_LEVELS[currentLevel];

  const instructions = currentLevelData?.instructions || [];
  const instructionsBn = currentLevelData?.instructionsBn || [];

  const getScoreBarColor = () => {
    if (scorePercentage === 100) return '#10b981';
    if (scorePercentage >= 50) return '#3b82f6';
    return '#f59e0b';
  };

  const handleApplyMasterUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const result = verifyAndApplyMasterPassword(passwordInput);
    if (result.success) {
      setMasterUnlockedState(true);
      setShowMasterPrompt(false);
      setPasswordInput('');
      setMasterError(null);
    } else {
      setMasterError(result.error || 'Incorrect password');
    }
  };

  const handleLockToStudent = () => {
    lockToStudentProgression();
    setMasterUnlockedState(false);
    setShowMasterPrompt(false);
    // If student was on a locked stage, select level 1
    onSelectLevel(1);
  };

  // Minimized Floating Pill View
  if (isMinimized) {
    return (
      <div 
        className="win-copilot-minimized-pill win-mica-window"
        onClick={() => setIsMinimized(false)}
        title="Click to expand Data AI Assistant"
      >
        <div className="win-copilot-pill-avatar">
          AI
          <span className="win-copilot-pill-dot" />
        </div>
        <div className="win-copilot-pill-meta">
          <span className="win-copilot-pill-title">Data AI Assistant</span>
          <span className="win-copilot-pill-score">
            <b style={{ color: getScoreBarColor() }}>{scorePercentage}%</b> • Lvl {currentLevel}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '3px' }} onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setIsMinimized(false)} 
            className="win-control-btn"
            title="Expand Assistant"
            style={{ width: '22px', height: '22px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Maximize2 size={12} />
          </button>
          <button 
            onClick={onClose} 
            className="win-control-btn"
            title="Close Assistant"
            style={{ width: '22px', height: '22px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={12} />
          </button>
        </div>
      </div>
    );
  }

  const isExpanded = cardSize === 'expanded';

  return (
    <div className={`win-mica-window win-copilot-card ${isExpanded ? 'size-expanded' : ''}`}>
      {/* 1. Header (Fixed) */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
        paddingBottom: '6px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: isExpanded ? '30px' : '26px',
            height: isExpanded ? '30px' : '26px',
            borderRadius: '7px',
            background: 'linear-gradient(135deg, #2563eb, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isExpanded ? '12px' : '11px',
            fontWeight: 800,
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
            flexShrink: 0
          }}>
            AI
          </div>
          <div>
            <h4 style={{ 
              fontSize: isExpanded ? '13px' : '12px', 
              fontWeight: 700, 
              color: '#f8fafc', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              Data AI Assistant
              <span style={{
                fontSize: '9.5px',
                fontWeight: 600,
                background: 'rgba(52, 211, 153, 0.15)',
                color: '#34d399',
                padding: '1px 5px',
                borderRadius: '8px',
                border: '1px solid rgba(52, 211, 153, 0.3)'
              }}>
                Online
              </span>
            </h4>
          </div>
        </div>

        {/* Title Controls with Clean SVG Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <button 
            onClick={() => setCardSize(s => s === 'normal' ? 'expanded' : 'normal')} 
            className="win-control-btn"
            title={isExpanded ? 'Restore Standard Size (350px)' : 'Enlarge Assistant (480px)'}
            style={{ 
              width: '24px', 
              height: '22px', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isExpanded ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
              color: isExpanded ? '#93c5fd' : '#cbd5e1'
            }}
          >
            {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          <button 
            onClick={() => setIsMinimized(true)} 
            className="win-control-btn"
            title="Minimize Assistant"
            style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Minus size={14} />
          </button>
          <button 
            onClick={onClose} 
            className="win-control-btn"
            title="Close Assistant"
            style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 2. Mode Switcher (Fixed) */}
      <div style={{
        display: 'flex',
        gap: '4px',
        background: 'rgba(0,0,0,0.35)',
        padding: '2px',
        borderRadius: '6px',
        border: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0
      }}>
        <button
          onClick={() => onSwitchMode('file_management')}
          style={{
            flex: 1,
            padding: '4px',
            borderRadius: '4px',
            border: 'none',
            background: isFileMode ? '#0078d4' : 'transparent',
            color: isFileMode ? '#ffffff' : '#94a3b8',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          File Sorting (5L)
        </button>
        <button
          onClick={() => onSwitchMode('folder_management')}
          style={{
            flex: 1,
            padding: '4px',
            borderRadius: '4px',
            border: 'none',
            background: !isFileMode ? '#059669' : 'transparent',
            color: !isFileMode ? '#ffffff' : '#94a3b8',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Folder Tree (7L)
        </button>
      </div>

      {/* 3. Stage Selector (Full Width Row, Never Cramped) */}
      <div style={{ flexShrink: 0 }}>
        <select 
          value={currentLevel}
          onChange={(e) => onSelectLevel(parseInt(e.target.value, 10))}
          style={{
            width: '100%',
            background: '#242730',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            padding: '5px 8px',
            fontSize: '11px',
            color: '#e2e8f0',
            outline: 'none',
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
        >
          {Array.from({ length: totalLevels }, (_, idx) => {
            const lvlNum = idx + 1;
            const lvlObj = isFileMode ? FILE_MANAGEMENT_LEVELS[lvlNum] : FOLDER_MANAGEMENT_LEVELS[lvlNum];
            const isUnlocked = masterUnlocked || lvlNum <= maxUnlockedLevel;
            return (
              <option key={lvlNum} value={lvlNum} disabled={!isUnlocked}>
                {isUnlocked ? '🔓' : '🔒'} {lvlObj?.title || `Level ${lvlNum}`}
              </option>
            );
          })}
        </select>
      </div>

      {/* 4. Controls Utility Bar: Language Selector & Master Password Unlock */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '6px',
        flexShrink: 0
      }}>
        {/* Language Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '5px',
          padding: '2px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <button
            onClick={() => setLangMode('bn')}
            style={{
              background: langMode === 'bn' ? '#2563eb' : 'transparent',
              color: langMode === 'bn' ? '#ffffff' : '#94a3b8',
              border: 'none',
              borderRadius: '3px',
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="বাংলা নির্দেশনাবলী ও লক্ষ্য"
          >
            বাংলা
          </button>
          <button
            onClick={() => setLangMode('en')}
            style={{
              background: langMode === 'en' ? '#2563eb' : 'transparent',
              color: langMode === 'en' ? '#ffffff' : '#94a3b8',
              border: 'none',
              borderRadius: '3px',
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="English Instructions & Objective"
          >
            EN
          </button>
          <button
            onClick={() => setLangMode('both')}
            style={{
              background: langMode === 'both' ? '#2563eb' : 'transparent',
              color: langMode === 'both' ? '#ffffff' : '#94a3b8',
              border: 'none',
              borderRadius: '3px',
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="উভয় ভাষা (Bilingual)"
          >
            Both
          </button>
        </div>

        {/* Master Unlock Button / Indicator */}
        {masterUnlocked ? (
          <button
            onClick={handleLockToStudent}
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.45)',
              color: '#34d399',
              borderRadius: '5px',
              padding: '2px 8px',
              fontSize: '9.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
            title="Master Unlocked! Click to lock back to student progression."
          >
            <Unlock size={11} color="#34d399" />
            <span>Master Unlocked (Lock 🔒)</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setShowMasterPrompt(true);
              setMasterError(null);
            }}
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#fbbf24',
              borderRadius: '5px',
              padding: '2px 8px',
              fontSize: '9.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
            title="Teacher / Test Mode: Unlock all curriculum levels using master password (ICST)"
          >
            <Key size={11} color="#fbbf24" />
            <span>Master Unlock (ICST)</span>
          </button>
        )}
      </div>

      {/* Master Password Input Drawer (When triggered) */}
      {showMasterPrompt && (
        <form 
          onSubmit={handleApplyMasterUnlock}
          style={{
            background: '#1e293b',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            borderRadius: '6px',
            padding: '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={12} /> Master Password Gate
            </span>
            <button 
              type="button" 
              onClick={() => setShowMasterPrompt(false)} 
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
            >
              ✕
            </button>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input 
              type="text"
              autoFocus
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password (ICST)..."
              style={{
                flex: 1,
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                padding: '4px 6px',
                fontSize: '11px',
                color: '#ffffff',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#f59e0b',
                color: '#000000',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Unlock
            </button>
          </div>
          {masterError && (
            <div style={{ fontSize: '9.5px', color: '#f87171' }}>{masterError}</div>
          )}
        </form>
      )}

      {/* 5. Live Progress Bar (Fixed) */}
      <div style={{
        fontSize: '11px',
        background: 'rgba(15, 23, 42, 0.6)',
        padding: '8px 10px',
        borderRadius: '7px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Live Progress
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: getScoreBarColor(), fontFamily: 'monospace' }}>
              {scorePercentage}%
            </span>
            {breakdown.length > 0 && (
              <button
                onClick={() => setShowChecklist(!showChecklist)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#60a5fa',
                  fontSize: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                {showChecklist ? 'Hide Checklist ▲' : `Checklist (${breakdown.filter(b => b.isCorrect).length}/${breakdown.length}) ▼`}
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar with 7px height and rounded track */}
        <div style={{ width: '100%', background: '#334155', height: '7px', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            background: getScoreBarColor(),
            height: '100%',
            width: `${scorePercentage}%`,
            transition: 'width 0.3s ease, background 0.3s ease'
          }} />
        </div>

        <span style={{ fontSize: '10px', color: '#cbd5e1', fontFamily: 'monospace' }}>
          {scoreSummaryText}
        </span>
      </div>

      {/* 6. Middle Scrollable Body */}
      <div className="win-copilot-scroll-body">
        {/* Active Goal Description */}
        <div style={{
          fontSize: '11px',
          color: '#cbd5e1',
          lineHeight: 1.5,
          background: isFileMode ? 'rgba(30, 58, 138, 0.35)' : 'rgba(6, 78, 59, 0.35)',
          padding: '8px 10px',
          borderRadius: '7px',
          border: `1px solid ${isFileMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
            <div style={{ flex: 1 }}>
              {(langMode === 'en' || langMode === 'both') && (
                <div style={{ marginBottom: langMode === 'both' ? '4px' : '0' }}>
                  <strong style={{ color: isFileMode ? '#93c5fd' : '#6ee7b7' }}>Objective:</strong> {currentLevelData?.goal}
                </div>
              )}
              {(langMode === 'bn' || langMode === 'both') && currentLevelData?.goalBn && (
                <div style={{ 
                  color: isFileMode ? '#bfdbfe' : '#a7f3d0',
                  lineHeight: 1.55
                }}>
                  <strong style={{ color: isFileMode ? '#60a5fa' : '#34d399' }}>বাংলা লক্ষ্য:</strong> {currentLevelData.goalBn}
                </div>
              )}
            </div>

            <span style={{
              fontSize: '9.5px',
              fontWeight: 800,
              color: '#fbbf24',
              background: 'rgba(245, 158, 11, 0.25)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              padding: '1px 6px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}>
              +{currentLevel * 50} EXP
            </span>
          </div>
        </div>

        {/* Step-by-Step Task Instructions Section */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: '7px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '8px 10px'
        }}>
          <div style={{
            fontSize: '10.5px',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>📋 Step-by-Step Guide / কাজের ধাপ</span>
            <span style={{ fontSize: '9.5px', color: '#60a5fa', textTransform: 'none' }}>
              {instructions.length} Steps
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {instructions.length > 0 ? (
              instructions.map((inst, idx) => {
                const bnText = instructionsBn[idx] || '';
                return (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '7px',
                      fontSize: '11px',
                      color: '#e2e8f0',
                      lineHeight: 1.45
                    }}
                  >
                    <span style={{
                      minWidth: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: '#2563eb',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      marginTop: '2px',
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                      {(langMode === 'en' || langMode === 'both') && (
                        <span style={{ color: '#f1f5f9' }}>{inst}</span>
                      )}
                      {(langMode === 'bn' || langMode === 'both') && bnText && (
                        <span style={{ 
                          color: langMode === 'both' ? '#6ee7b7' : '#f1f5f9', 
                          lineHeight: 1.55 
                        }}>
                          {bnText}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '4px' }}>
                Follow the objective above to complete this level.
              </div>
            )}
          </div>
        </div>

        {/* Live Criteria Checklist Drawer (Scrolls inside) */}
        {showChecklist && breakdown.length > 0 && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '7px',
            padding: '7px 9px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>
              Verification Criteria Checklist
            </div>
            {breakdown.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  color: item.isCorrect ? '#34d399' : '#f87171',
                  gap: '6px',
                  padding: '2px 0'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <span>{item.isCorrect ? '✅' : '❌'}</span>
                  <span>{item.label}</span>
                </span>
                <span style={{ 
                  fontSize: '9px', 
                  color: item.isCorrect ? '#a7f3d0' : '#fca5a5', 
                  fontStyle: 'italic', 
                  flexShrink: 0 
                }}>
                  {item.statusText}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Footer Actions (Always Fixed at Bottom) */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '6px', 
        flexShrink: 0,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '6px'
      }}>
        {/* Advance to next stage button (unlocked at 100%) */}
        {scorePercentage === 100 && hasNextStage && (
          <button
            onClick={onAdvanceNextStage}
            style={{
              width: '100%',
              padding: '7px',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: '#ffffff',
              borderRadius: '6px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              animation: 'pulse 2s infinite'
            }}
          >
            🚀 Advance to Next Stage! ➔
          </button>
        )}

        {/* Hint & Reset Buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={onGiveHint}
            style={{
              flex: 1,
              background: '#0078d4',
              color: '#ffffff',
              border: 'none',
              fontSize: '11px',
              fontWeight: 600,
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            💡 Give Hint
          </button>
          <button
            onClick={onResetLevel}
            style={{
              padding: '6px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              border: 'none',
              fontSize: '11px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  );
};
