import React, { useState, useEffect } from 'react';
import { WindowsProgress, WindowsSimulationMode } from '../../types/windows';
import { StudentProgress } from '../../types';
import { FILE_MANAGEMENT_LEVELS, FOLDER_MANAGEMENT_LEVELS, WINDOWS_ACHIEVEMENTS } from '../../data/windowsCurriculumData';
import { loadWindowsProgress } from '../../services/windowsStorageService';
import { AchievementsModal } from './modals/AchievementsModal';
import { CurriculumModal } from './modals/CurriculumModal';

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
  const [progress, setProgress] = useState<WindowsProgress>(() => loadWindowsProgress());
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);

  useEffect(() => {
    setProgress(loadWindowsProgress());
  }, [studentProgress]);

  useEffect(() => {
    const handleDataCleared = () => {
      setProgress(loadWindowsProgress());
    };
    window.addEventListener('icst_data_cleared', handleDataCleared);
    return () => window.removeEventListener('icst_data_cleared', handleDataCleared);
  }, []);

  // File management stats
  const fileCompletedCount = Object.keys(progress.fileManagementCompleted).filter(
    k => progress.fileManagementCompleted[Number(k)]?.score === 100
  ).length;
  const filePercent = Math.round((fileCompletedCount / 5) * 100);

  // Folder management stats
  const folderCompletedCount = Object.keys(progress.folderManagementCompleted).filter(
    k => progress.folderManagementCompleted[Number(k)]?.score === 100
  ).length;
  const folderPercent = Math.round((folderCompletedCount / 7) * 100);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      fontFamily: 'var(--win-font)'
    }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
        borderRadius: '16px',
        padding: '28px 32px',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0078d4, #005a9e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            boxShadow: '0 8px 24px rgba(0, 120, 212, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            🪟
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              ICST Windows Organization Simulation Lab
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '4px 0 6px 0', letterSpacing: '-0.3px' }}>
              Master Windows 11 File & Folder Architecture
            </h1>
            <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
              Realistic Windows 11 desktop simulation with character-level filing audits, deep folder trees, subfolder nesting, F2 renaming, ISO 8601 conventions, and bilingual educational tooltips.
            </p>
          </div>
        </div>

        {/* Action Buttons & EXP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>
              Windows Lab EXP
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace' }}>
              {progress.totalWindowsExp} EXP
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsAchievementsOpen(true)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🏆</span> <span>Badges ({progress.unlockedAchievements.length}/10)</span>
            </button>
            <button
              onClick={() => setIsCurriculumOpen(true)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>📚</span> <span>Curriculum</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Learning Tracks (Split Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px' }}>
        {/* Track 1: File Management (5 Levels) */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          border: '1px solid var(--border-medium, #cbd5e1)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm, 0 2px 6px rgba(0,0,0,0.06))',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(0, 120, 212, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px'
              }}>
                📁
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
                  File Management Lab
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)' }}>
                  Class 3 to 11 • 5 Progressive Levels • <strong>750 EXP Max</strong>
                </span>
              </div>
            </div>

            <span style={{
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700
            }}>
              {fileCompletedCount}/5 Levels Cleared ({filePercent}%)
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary, #334155)', margin: 0, lineHeight: 1.5 }}>
            Learn extensions (.docx, .pptx, .xlsx, .mp4, .jpeg), subject folder classification, ISO 8601 timestamping, creative media studio pipelines, and AI data architectures.
          </p>

          {/* Level Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {Array.from({ length: 5 }, (_, i) => {
              const lvlNum = i + 1;
              const isCleared = progress.fileManagementCompleted[lvlNum]?.score === 100;
              const isUnlocked = lvlNum <= progress.fileManagementMaxUnlocked;
              const expReward = lvlNum * 50;
              return (
                <button
                  key={lvlNum}
                  onClick={() => isUnlocked && onStartSimulation('file_management', lvlNum)}
                  disabled={!isUnlocked}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: isCleared ? '1px solid #10b981' : isUnlocked ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                    background: isCleared ? '#ecfdf5' : isUnlocked ? '#eff6ff' : '#f8fafc',
                    color: isCleared ? '#065f46' : isUnlocked ? '#1e40af' : '#94a3b8',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    transition: 'all 0.15s ease'
                  }}
                  title={isUnlocked ? `Launch Level ${lvlNum} (+${expReward} EXP)` : `Level ${lvlNum} is locked`}
                >
                  <div>{isCleared ? '✅' : isUnlocked ? '🔓' : '🔒'}</div>
                  <div style={{ marginTop: '2px' }}>Lvl {lvlNum}</div>
                  <div style={{ fontSize: '9px', marginTop: '2px', color: isCleared ? '#059669' : isUnlocked ? '#2563eb' : '#94a3b8', fontWeight: 800 }}>
                    +{expReward} EXP
                  </div>
                </button>
              );
            })}
          </div>

          {/* Launch Button */}
          <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
            <button
              onClick={() => onStartSimulation('file_management', progress.fileManagementCurrentLevel)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: '#0078d4',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 120, 212, 0.3)'
              }}
            >
              <span>🚀 Launch File Lab (Resume L{progress.fileManagementCurrentLevel})</span>
            </button>
          </div>
        </div>

        {/* Track 2: Folder Management (7 Levels) */}
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          border: '1px solid var(--border-medium, #cbd5e1)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm, 0 2px 6px rgba(0,0,0,0.06))',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px'
              }}>
                🗂️
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary, #0f172a)' }}>
                    Folder Management Lab
                  </h3>
                  <span style={{ fontSize: '10px', background: '#dcfce7', color: '#15803d', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                    NEW
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)' }}>
                  Class 3 to Pro • 7 Progressive Levels • <strong>1,400 EXP Max</strong>
                </span>
              </div>
            </div>

            <span style={{
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700
            }}>
              {folderCompletedCount}/7 Levels Cleared ({folderPercent}%)
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary, #334155)', margin: 0, lineHeight: 1.5 }}>
            Construct real-world folder trees from scratch: Creation, subfolder nesting, F2 renaming, deleting junk, multi-department corporate directories, web engineering, and cloud infrastructures.
          </p>

          {/* Level Pills (7 Levels) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {Array.from({ length: 7 }, (_, i) => {
              const lvlNum = i + 1;
              const isCleared = progress.folderManagementCompleted[lvlNum]?.score === 100;
              const isUnlocked = lvlNum <= progress.folderManagementMaxUnlocked;
              const expReward = lvlNum * 50;
              return (
                <button
                  key={lvlNum}
                  onClick={() => isUnlocked && onStartSimulation('folder_management', lvlNum)}
                  disabled={!isUnlocked}
                  style={{
                    padding: '8px 2px',
                    borderRadius: '8px',
                    border: isCleared ? '1px solid #10b981' : isUnlocked ? '1px solid #10b981' : '1px solid #e2e8f0',
                    background: isCleared ? '#ecfdf5' : isUnlocked ? '#f0fdf4' : '#f8fafc',
                    color: isCleared ? '#065f46' : isUnlocked ? '#166534' : '#94a3b8',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: 700,
                    transition: 'all 0.15s ease'
                  }}
                  title={isUnlocked ? `Launch Level ${lvlNum} (+${expReward} EXP)` : `Level ${lvlNum} is locked`}
                >
                  <div>{isCleared ? '✅' : isUnlocked ? '🔓' : '🔒'}</div>
                  <div style={{ marginTop: '2px' }}>L{lvlNum}</div>
                  <div style={{ fontSize: '8px', marginTop: '2px', color: isCleared ? '#059669' : isUnlocked ? '#16a34a' : '#94a3b8', fontWeight: 800 }}>
                    +{expReward}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Launch Button */}
          <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
            <button
              onClick={() => onStartSimulation('folder_management', progress.folderManagementCurrentLevel)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
              }}
            >
              <span>🌲 Launch Folder Lab (Resume L{progress.folderManagementCurrentLevel})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum Overview Preview Table */}
      <div style={{
        background: 'var(--bg-card, #ffffff)',
        border: '1px solid var(--border-medium, #cbd5e1)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm, 0 2px 6px rgba(0,0,0,0.06))'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 16px 0', color: 'var(--text-primary, #0f172a)' }}>
          Pedagogical Curriculum Matrix
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#f8fafc' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e40af', marginBottom: '4px' }}>
              📁 File Management (5 Levels)
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
              <li><b>L1 (Class 3-5):</b> File Extensions & Formats (.docx, .xlsx, .mp4)</li>
              <li><b>L2 (Class 6-7):</b> School Academic Subject Hierarchy</li>
              <li><b>L3 (Class 8-9):</b> ISO 8601 Naming & Version Archiving</li>
              <li><b>L4 (Class 10-11):</b> Triple-Split Studio Pipeline</li>
              <li><b>L5 (Class 11 AI):</b> Machine Learning Pipeline Datasets</li>
            </ul>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', background: '#f8fafc' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#065f46', marginBottom: '4px' }}>
              🗂️ Folder Management (7 Levels)
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
              <li><b>L1 (Class 3-4):</b> Root Folder Creation & Junk Cleanup</li>
              <li><b>L2 (Class 5-6):</b> Subfolder Nesting & F2 Renaming</li>
              <li><b>L3 (Class 7-8):</b> 3-Tier Multi-Department Stream Tree</li>
              <li><b>L4 (Class 9-10):</b> Enterprise Corporate HQ Directory</li>
              <li><b>L5 (Class 10-11):</b> Web/DevOps Codebase Architecture</li>
              <li><b>L6 (Class 11-12):</b> Numbered Media Production Stages</li>
              <li><b>L7 (Pro / Cloud):</b> Enterprise Cloud Datacenter Hierarchy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modals */}
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
