import React, { useEffect } from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { playFeedbackSound } from '../../services/storageService';

interface StageTransitionModalProps {
  completedLevelNumber: number;
  completedStageNumber: number;
  nextStageNumber: number;
  onContinue: () => void;
}

export const StageTransitionModal: React.FC<StageTransitionModalProps> = ({
  completedLevelNumber,
  completedStageNumber,
  nextStageNumber,
  onContinue
}) => {
  useEffect(() => {
    playFeedbackSound('success');
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '440px', textAlign: 'center', padding: '28px 24px' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: '#f0fdf4',
          border: '2px solid #86efac',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#16a34a'
        }}>
          <CheckCircle2 size={32} />
        </div>

        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--icst-blue-dark)', fontWeight: 700, marginBottom: '4px' }}>
          Level {completedLevelNumber} Progress
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--icst-charcoal)', marginBottom: '8px' }}>
          STAGE {completedStageNumber} COMPLETE
        </h3>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
          Your stage entries have been securely archived. Advancing to the next curriculum stage.
        </p>

        <div style={{
          background: 'var(--icst-blue-soft)',
          border: '1px solid var(--icst-blue-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: 'var(--icst-blue-dark)',
          fontWeight: 700,
          fontSize: '14px'
        }}>
          <span>NEXT: STAGE {nextStageNumber}</span>
          <ArrowRight size={16} />
        </div>

        <button
          type="button"
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={onContinue}
          autoFocus
        >
          <span>CONTINUE TO STAGE {nextStageNumber}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
