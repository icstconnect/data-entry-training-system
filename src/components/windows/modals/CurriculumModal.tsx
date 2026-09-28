import React, { useState } from 'react';
import { FILE_MANAGEMENT_LEVELS, FOLDER_MANAGEMENT_LEVELS } from '../../../data/windowsCurriculumData';

interface CurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTrack?: 'file_management' | 'folder_management';
}

export const CurriculumModal: React.FC<CurriculumModalProps> = ({
  isOpen,
  onClose,
  defaultTrack = 'file_management'
}) => {
  const [activeTab, setActiveTab] = useState<'file_management' | 'folder_management'>(defaultTrack);

  if (!isOpen) return null;

  return (
    <div className="win-modal-overlay" onClick={onClose}>
      <div 
        className="win-mica-window"
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '85vh',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <span>📚</span> Windows Organization Curriculum Architecture
          </h3>
          <button onClick={onClose} className="win-control-btn" style={{ width: '28px', height: '24px' }}>✕</button>
        </div>

        {/* Track Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => setActiveTab('file_management')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'file_management' ? '#0078d4' : 'transparent',
              color: activeTab === 'file_management' ? '#ffffff' : '#cbd5e1',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            📁 File Management (5 Levels)
          </button>
          <button
            onClick={() => setActiveTab('folder_management')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'folder_management' ? '#0078d4' : 'transparent',
              color: activeTab === 'folder_management' ? '#ffffff' : '#cbd5e1',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🗂️ Folder Management (7 Levels)
          </button>
        </div>

        {/* Tab Content List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
          {activeTab === 'file_management' ? (
            Object.values(FILE_MANAGEMENT_LEVELS).map((lvl) => (
              <div 
                key={lvl.levelNumber}
                style={{
                  background: 'rgba(30, 58, 138, 0.25)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#93c5fd', fontSize: '13px' }}>
                    {lvl.title}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.25)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '2px 8px', borderRadius: '12px', fontFamily: 'monospace', fontWeight: 700 }}>
                      +{lvl.levelNumber * 50} EXP
                    </span>
                    <span style={{ fontSize: '10px', background: 'rgba(59, 130, 246, 0.3)', color: '#bfdbfe', padding: '2px 8px', borderRadius: '12px', fontFamily: 'monospace' }}>
                      {lvl.badge}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 6px 0', lineHeight: 1.45 }}>
                  {lvl.goal}
                </p>
                {lvl.goalBn && (
                  <div style={{ fontSize: '11px', color: '#bfdbfe', background: 'rgba(0,0,0,0.25)', padding: '6px 8px', borderRadius: '4px' }}>
                    <strong style={{ color: '#60a5fa' }}>বাংলা লক্ষ্য:</strong> {lvl.goalBn}
                  </div>
                )}
              </div>
            ))
          ) : (
            Object.values(FOLDER_MANAGEMENT_LEVELS).map((lvl) => (
              <div 
                key={lvl.levelNumber}
                style={{
                  background: 'rgba(6, 78, 59, 0.25)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#6ee7b7', fontSize: '13px' }}>
                    {lvl.title}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.25)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '2px 8px', borderRadius: '12px', fontFamily: 'monospace', fontWeight: 700 }}>
                      +{lvl.levelNumber * 50} EXP
                    </span>
                    <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.3)', color: '#a7f3d0', padding: '2px 8px', borderRadius: '12px', fontFamily: 'monospace' }}>
                      {lvl.badge}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 6px 0', lineHeight: 1.45 }}>
                  {lvl.goal}
                </p>
                {lvl.goalBn && (
                  <div style={{ fontSize: '11px', color: '#a7f3d0', background: 'rgba(0,0,0,0.25)', padding: '6px 8px', borderRadius: '4px', marginBottom: '6px' }}>
                    <strong style={{ color: '#34d399' }}>বাংলা লক্ষ্য:</strong> {lvl.goalBn}
                  </div>
                )}
                <div style={{ fontSize: '11px', color: '#6ee7b7', fontStyle: 'italic', background: 'rgba(0,0,0,0.18)', padding: '5px 8px', borderRadius: '4px' }}>
                  গাইড: {lvl.bilingualGuide.bn}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button 
            onClick={onClose}
            style={{
              padding: '6px 18px',
              borderRadius: '6px',
              background: '#0078d4',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
