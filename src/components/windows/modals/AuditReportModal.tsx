import React from 'react';
import { WindowsSimulationMode } from '../../../types/windows';

export interface AuditItemBreakdown {
  label: string;
  isCorrect: boolean;
  statusText: string;
}

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: WindowsSimulationMode;
  levelNumber: number;
  scorePercentage: number;
  breakdown: AuditItemBreakdown[];
  onAutoFix: () => void;
  onNextStage: () => void;
  hasNextStage: boolean;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  mode,
  levelNumber,
  scorePercentage,
  breakdown,
  onAutoFix,
  onNextStage,
  hasNextStage
}) => {
  if (!isOpen) return null;

  const isPerfect = scorePercentage === 100;

  return (
    <div className="win-modal-overlay" onClick={onClose}>
      <div 
        className="win-mica-window"
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '85vh',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🤖</span>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Dita AI Organization Evaluation (Level {levelNumber})
            </h3>
          </div>
          <button onClick={onClose} className="win-control-btn" style={{ width: '28px', height: '24px' }}>✕</button>
        </div>

        {/* Score Circle & Title Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '14px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: `4px solid ${isPerfect ? '#10b981' : scorePercentage >= 50 ? '#3b82f6' : '#f59e0b'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '18px',
            color: isPerfect ? '#34d399' : scorePercentage >= 50 ? '#60a5fa' : '#fbbf24',
            fontFamily: 'monospace',
            flexShrink: 0
          }}>
            {scorePercentage}%
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px 0' }}>
              {isPerfect ? 'Excellent Architecture! 🎉' : `${scorePercentage}% Completed`}
            </h4>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
              {isPerfect 
                ? (mode === 'file_management' 
                    ? 'All files are properly organized according to curriculum standards!' 
                    : 'All folder branches, subfolders, and cleanups are perfectly configured!')
                : 'Some items require attention. Inspect the itemized checklist below to reach 100%.'}
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>
          {mode === 'file_management' ? 'File Filing Audit Breakdown:' : 'Folder Structure Hierarchy Audit:'}
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          maxHeight: '260px',
          paddingRight: '4px'
        }}>
          {breakdown.map((item, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                <span>{item.isCorrect ? '✅' : '⚠️'}</span>
                <span style={{
                  color: item.isCorrect ? '#34d399' : '#e2e8f0',
                  fontWeight: item.isCorrect ? 600 : 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {item.label}
                </span>
              </div>
              <div style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                color: item.isCorrect ? '#10b981' : '#f59e0b',
                whiteSpace: 'nowrap',
                marginLeft: '8px'
              }}>
                {item.statusText}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '8px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {isPerfect && hasNextStage && (
            <button
              onClick={() => {
                onNextStage();
                onClose();
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: '#ffffff',
                border: 'none',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)'
              }}
            >
              🚀 Next Stage ➔
            </button>
          )}

          <button
            onClick={() => {
              onAutoFix();
              onClose();
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: '#0078d4',
              color: '#ffffff',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ✨ Fix Everything (Auto-Organize)
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              border: 'none',
              fontSize: '12px',
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
