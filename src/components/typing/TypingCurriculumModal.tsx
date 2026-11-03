import React, { useState } from 'react';
import { X, CheckCircle2, Lock, Star, Play, Award, Zap } from 'lucide-react';
import { LEVELS, STAGES_META } from './typingData';
import { TypingTheme } from '../../types/typing';
import { TouchTypingProgress } from '../../types/touchTyping';
import { isMasterUnlocked } from '../../services/masterUnlockService';
import './touchTyping.css';

export interface TypingCurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevelId: number;
  progress: TouchTypingProgress;
  onSelectLevel: (levelId: number) => void;
  theme: TypingTheme;
}

export const TypingCurriculumModal: React.FC<TypingCurriculumModalProps> = ({
  isOpen,
  onClose,
  currentLevelId,
  progress,
  onSelectLevel,
  theme
}) => {
  const [selectedStageTab, setSelectedStageTab] = useState<number | 'all'>('all');

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const records = progress.completedLevels || {};
  const masterUnlocked = isMasterUnlocked();

  const filteredStages = selectedStageTab === 'all' 
    ? STAGES_META 
    : STAGES_META.filter(s => s.stage === selectedStageTab);

  return (
    <div
      className="typing-curriculum-drawer-backdrop"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`typing-curriculum-drawer theme-${theme}`}>
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${isDark ? '#333842' : '#e4ddd0'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isDark ? '#212429' : '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: isDark ? '#0369a1' : '#e0f2fe',
                color: isDark ? '#38bdf8' : '#0369a1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Zap size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                Curriculum Roadmap
              </h2>
              <span style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                All 25 Progressive Mastery Levels
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: `1px solid ${isDark ? '#414856' : '#d2c8b7'}`,
              color: isDark ? '#cbd5e1' : '#4d463b',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Stage Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 24px',
            borderBottom: `1px solid ${isDark ? '#333842' : '#e4ddd0'}`,
            background: isDark ? '#191b1f' : '#f9f6f0',
            overflowX: 'auto'
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedStageTab('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              border: selectedStageTab === 'all' ? '1.5px solid #0284c7' : `1px solid ${isDark ? '#333842' : '#d2c8b7'}`,
              background: selectedStageTab === 'all' ? '#0284c7' : 'transparent',
              color: selectedStageTab === 'all' ? '#ffffff' : (isDark ? '#94a3b8' : '#756c5e'),
              whiteSpace: 'nowrap'
            }}
          >
            All Stages
          </button>
          {STAGES_META.map(s => (
            <button
              key={s.stage}
              type="button"
              onClick={() => setSelectedStageTab(s.stage)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                border: selectedStageTab === s.stage ? `1.5px solid ${s.color}` : `1px solid ${isDark ? '#333842' : '#d2c8b7'}`,
                background: selectedStageTab === s.stage ? `${s.color}20` : 'transparent',
                color: selectedStageTab === s.stage ? s.color : (isDark ? '#94a3b8' : '#756c5e'),
                whiteSpace: 'nowrap'
              }}
            >
              Stage {s.stage}
            </button>
          ))}
        </div>

        {/* Scrollable Levels List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          {filteredStages.map(stage => {
            const [startId, endId] = stage.levelRange;
            const stageLevels = LEVELS.filter(l => l.id >= startId && l.id <= endId);

            return (
              <div key={stage.stage} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: `${stage.color}20`,
                        color: stage.color
                      }}
                    >
                      STAGE {stage.stage}
                    </span>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>
                      {stage.title.replace(`Stage ${stage.stage}: `, '')}
                    </h3>
                  </div>
                  <span style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#756c5e' }}>
                    Levels {startId} - {endId}
                  </span>
                </div>

                {/* Levels list for this stage */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {stageLevels.map(level => {
                    const rec = records[level.id];
                    const isCompleted = !!rec?.passed;
                    const isUnlocked = masterUnlocked || level.id <= (progress.maxUnlockedLevel || 1);
                    const isCurrent = level.id === currentLevelId;

                    return (
                      <div
                        key={level.id}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '12px',
                          border: isCurrent 
                            ? `2px solid ${stage.color}` 
                            : `1px solid ${isDark ? '#333842' : '#e4ddd0'}`,
                          background: isCurrent 
                            ? (isDark ? '#1e293b' : '#edf4fa') 
                            : (isDark ? '#212429' : '#ffffff'),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          opacity: isUnlocked ? 1 : 0.6
                        }}
                      >
                        {/* Left: ID & Title & Criteria */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: isCompleted 
                                ? (isDark ? '#064e3b' : '#dcfce7') 
                                : isUnlocked 
                                  ? (isDark ? '#2b2f36' : '#f2ece0') 
                                  : (isDark ? '#191b1f' : '#e4ddd0'),
                              color: isCompleted ? '#10b981' : (isDark ? '#cbd5e1' : '#4d463b'),
                              fontSize: '12px',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            {isCompleted ? <CheckCircle2 size={16} /> : (isUnlocked ? level.id : <Lock size={14} />)}
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
                                {level.title}
                              </h4>
                              {isCurrent && (
                                <span style={{ fontSize: '10px', fontWeight: 800, color: stage.color, background: `${stage.color}20`, padding: '1px 6px', borderRadius: '4px' }}>
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#756c5e', display: 'block', marginTop: '2px' }}>
                              {level.subtitle} • {level.criteriaDesc}
                            </span>
                            {/* Focus Keys Badges */}
                            <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                              {level.focusKeys.slice(0, 6).map((k, i) => (
                                <span
                                  key={i}
                                  style={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    fontFamily: 'var(--font-mono, monospace)',
                                    padding: '1px 5px',
                                    borderRadius: '4px',
                                    background: isDark ? '#2d333f' : '#ede5d8',
                                    color: isDark ? '#cbd5e1' : '#221e1a'
                                  }}
                                >
                                  {k === ' ' ? '␣' : k}
                                </span>
                              ))}
                              {level.focusKeys.length > 6 && (
                                <span style={{ fontSize: '10px', color: isDark ? '#64748b' : '#8c8172', alignSelf: 'center' }}>
                                  +{level.focusKeys.length - 6} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Stars / Action button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {isCompleted && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                              {[1, 2, 3].map(starNum => (
                                <Star
                                  key={starNum}
                                  size={14}
                                  fill={(rec.stars || 0) >= starNum ? '#f59e0b' : 'none'}
                                  color={(rec.stars || 0) >= starNum ? '#f59e0b' : (isDark ? '#4b5563' : '#d2c8b7')}
                                />
                              ))}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (isUnlocked) {
                                onSelectLevel(level.id);
                                onClose();
                              }
                            }}
                            disabled={!isUnlocked}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: isCurrent ? 'none' : `1px solid ${isDark ? '#414856' : '#d2c8b7'}`,
                              background: isCurrent ? stage.color : (isUnlocked ? (isDark ? '#2a2e37' : '#ffffff') : 'transparent'),
                              color: isCurrent ? '#ffffff' : (isUnlocked ? (isDark ? '#f8fafc' : '#1c1915') : (isDark ? '#4b5563' : '#a89d8d')),
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: isUnlocked ? 'pointer' : 'not-allowed'
                            }}
                          >
                            {isUnlocked ? (
                              <>
                                <Play size={11} fill="currentColor" />
                                <span>{isCurrent ? 'Continue' : 'Practice'}</span>
                              </>
                            ) : (
                              <>
                                <Lock size={11} />
                                <span>Locked</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
