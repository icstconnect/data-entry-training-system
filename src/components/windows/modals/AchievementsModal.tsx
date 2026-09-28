import React from 'react';
import { WINDOWS_ACHIEVEMENTS } from '../../../data/windowsCurriculumData';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedIds: string[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  unlockedIds
}) => {
  if (!isOpen) return null;

  const unlockedSet = new Set(unlockedIds);
  const fileTrackAchs = WINDOWS_ACHIEVEMENTS.slice(0, 5);
  const folderTrackAchs = WINDOWS_ACHIEVEMENTS.slice(5, 10);

  return (
    <div className="win-modal-overlay" onClick={onClose}>
      <div 
        className="win-mica-window"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🏆</span>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Windows Organization Achievements
              </h3>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                {unlockedSet.size} of {WINDOWS_ACHIEVEMENTS.length} Badges Unlocked
              </span>
            </div>
          </div>
          <button onClick={onClose} className="win-control-btn" style={{ width: '28px', height: '24px' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
          {/* File Management Track */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              📁 File Management Badges (5 Achievements)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
              {fileTrackAchs.map((ach) => {
                const isUnlocked = unlockedSet.has(ach.id);
                return (
                  <div 
                    key={ach.id}
                    style={{
                      background: isUnlocked ? 'rgba(30, 58, 138, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                      border: `1px solid ${isUnlocked ? 'rgba(96, 165, 250, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      opacity: isUnlocked ? 1 : 0.65
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: isUnlocked ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      flexShrink: 0
                    }}>
                      {isUnlocked ? '⭐' : '🔒'}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '12px', color: isUnlocked ? '#93c5fd' : '#cbd5e1' }}>
                        {ach.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.35 }}>
                        {ach.description}
                      </div>
                      <div style={{ fontSize: '10px', color: '#fbbf24', marginTop: '4px', fontWeight: 600, fontFamily: 'monospace' }}>
                        +{ach.badgeLevel * 50} EXP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Folder Management Track */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              🗂️ Folder Management Badges (5 Achievements)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
              {folderTrackAchs.map((ach) => {
                const isUnlocked = unlockedSet.has(ach.id);
                return (
                  <div 
                    key={ach.id}
                    style={{
                      background: isUnlocked ? 'rgba(6, 78, 59, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                      border: `1px solid ${isUnlocked ? 'rgba(52, 211, 153, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      opacity: isUnlocked ? 1 : 0.65
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: isUnlocked ? 'linear-gradient(135deg, #059669, #047857)' : '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      flexShrink: 0
                    }}>
                      {isUnlocked ? '🏆' : '🔒'}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '12px', color: isUnlocked ? '#a7f3d0' : '#cbd5e1' }}>
                        {ach.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.35 }}>
                        {ach.description}
                      </div>
                      <div style={{ fontSize: '10px', color: '#fbbf24', marginTop: '4px', fontWeight: 600, fontFamily: 'monospace' }}>
                        +{ach.badgeLevel * 50} EXP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button 
            type="button"
            onClick={() => {
              onClose();
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('icst_open_universal_share'));
              }
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>📜 View Full Certificates & Diplomas</span>
          </button>
          <button 
            onClick={onClose}
            style={{
              padding: '6px 18px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
