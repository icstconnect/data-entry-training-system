import React from 'react';
import { WindowsSimulationMode } from '../../types/windows';
import { FILE_MANAGEMENT_LEVELS, FOLDER_MANAGEMENT_LEVELS } from '../../data/windowsCurriculumData';

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
  onResetLevel
}) => {
  if (!isOpen) return null;

  const isFileMode = mode === 'file_management';
  const totalLevels = isFileMode ? 5 : 7;
  const currentLevelData = isFileMode 
    ? FILE_MANAGEMENT_LEVELS[currentLevel]
    : FOLDER_MANAGEMENT_LEVELS[currentLevel];

  const getScoreBarColor = () => {
    if (scorePercentage === 100) return '#10b981';
    if (scorePercentage >= 50) return '#3b82f6';
    return '#f59e0b';
  };

  return (
    <div className="win-mica-window win-copilot-card">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563eb, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 800,
            color: '#ffffff'
          }}>
            AI
          </div>
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Dita AI Assistant
            </h4>
            <p style={{ fontSize: '10px', color: '#34d399', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
              ● Online & Auditing
            </p>
          </div>
        </div>
        <button onClick={onClose} className="win-control-btn" style={{ width: '24px', height: '24px' }}>✕</button>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        background: 'rgba(0,0,0,0.35)',
        padding: '3px',
        borderRadius: '6px',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <button
          onClick={() => onSwitchMode('file_management')}
          style={{
            flex: 1,
            padding: '5px',
            borderRadius: '4px',
            border: 'none',
            background: isFileMode ? '#0078d4' : 'transparent',
            color: isFileMode ? '#ffffff' : '#94a3b8',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          File Mgmt (5L)
        </button>
        <button
          onClick={() => onSwitchMode('folder_management')}
          style={{
            flex: 1,
            padding: '5px',
            borderRadius: '4px',
            border: 'none',
            background: !isFileMode ? '#059669' : 'transparent',
            color: !isFileMode ? '#ffffff' : '#94a3b8',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Folder Mgmt (7L)
        </button>
      </div>

      {/* Level Selector */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
          <span style={{ fontWeight: 600, color: '#cbd5e1' }}>Curriculum Level:</span>
          <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '10px' }}>
            Unlocked: <b>Level {maxUnlockedLevel}</b>/{totalLevels}
          </span>
        </div>

        <select 
          value={currentLevel}
          onChange={(e) => onSelectLevel(parseInt(e.target.value, 10))}
          style={{
            background: '#242730',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '11px',
            color: '#e2e8f0',
            outline: 'none'
          }}
        >
          {Array.from({ length: totalLevels }, (_, idx) => {
            const lvlNum = idx + 1;
            const lvlObj = isFileMode ? FILE_MANAGEMENT_LEVELS[lvlNum] : FOLDER_MANAGEMENT_LEVELS[lvlNum];
            const isUnlocked = lvlNum <= maxUnlockedLevel;
            return (
              <option key={lvlNum} value={lvlNum} disabled={!isUnlocked}>
                {isUnlocked ? '🔓' : '🔒'} {lvlObj?.title || `Level ${lvlNum}`}
              </option>
            );
          })}
        </select>
      </div>

      {/* Active Goal Description */}
      <div style={{
        fontSize: '11px',
        color: '#cbd5e1',
        lineHeight: 1.5,
        background: isFileMode ? 'rgba(30, 58, 138, 0.35)' : 'rgba(6, 78, 59, 0.35)',
        padding: '10px',
        borderRadius: '8px',
        border: `1px solid ${isFileMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div>
          <strong style={{ color: isFileMode ? '#93c5fd' : '#6ee7b7' }}>Objective:</strong> {currentLevelData?.goal}
        </div>
        {currentLevelData?.goalBn && (
          <div style={{
            fontSize: '11px',
            color: isFileMode ? '#bfdbfe' : '#a7f3d0',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '6px 8px',
            borderRadius: '6px',
            lineHeight: 1.45
          }}>
            <strong style={{ color: isFileMode ? '#60a5fa' : '#34d399' }}>বাংলা লক্ষ্য:</strong> {currentLevelData.goalBn}
          </div>
        )}
      </div>

      {/* Live Organization Status */}
      <div style={{
        fontSize: '11px',
        background: 'rgba(15, 23, 42, 0.6)',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
          Live Organization Status
        </span>
        <div style={{ width: '100%', background: '#334155', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            background: getScoreBarColor(),
            height: '100%',
            width: `${scorePercentage}%`,
            transition: 'width 0.3s ease, background 0.3s ease'
          }} />
        </div>
        <span style={{ fontSize: '11px', color: '#e2e8f0', fontFamily: 'monospace' }}>
          {scoreSummaryText}
        </span>
      </div>

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

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
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
            padding: '6px 12px',
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
  );
};
