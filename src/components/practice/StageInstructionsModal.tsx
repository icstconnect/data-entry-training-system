import React from 'react';
import { StageConfig } from '../../types';
import { Target, Award, CheckCircle2, ArrowRight } from 'lucide-react';

interface StageInstructionsModalProps {
  stage: StageConfig;
  onStart: () => void;
}

export const StageInstructionsModal: React.FC<StageInstructionsModalProps> = ({
  stage,
  onStart
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--icst-blue-dark)', fontWeight: 700, letterSpacing: '0.5px' }}>
              Level {stage.levelNumber} • Stage {stage.stageNumber} Instructions
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--icst-charcoal)' }}>
              {stage.title}
            </h3>
          </div>
          <span style={{
            background: stage.requiredAccuracy === 100 ? '#fee2e2' : 'var(--icst-blue-soft)',
            color: stage.requiredAccuracy === 100 ? '#991b1b' : 'var(--icst-blue-dark)',
            border: `1px solid ${stage.requiredAccuracy === 100 ? '#fca5a5' : 'var(--icst-blue-border)'}`,
            padding: '3px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 700
          }}>
            Target: {stage.requiredAccuracy}%
          </span>
        </div>

        <div className="modal-body" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: '14px', lineHeight: '1.6' }}>
            {stage.description}
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              <CheckCircle2 size={16} color="var(--icst-blue)" />
              <span>Operational Requirements</span>
            </div>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {stage.instructions.map((inst, idx) => (
                <li key={idx} style={{ lineHeight: '1.4' }}>
                  {inst}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 10px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Difficulty</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{stage.difficulty}</div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 10px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Min Accuracy</div>
              <div style={{ fontWeight: 700, color: stage.requiredAccuracy === 100 ? '#b91c1c' : 'var(--icst-blue-dark)' }}>
                {stage.requiredAccuracy}%
              </div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 10px', borderRadius: '6px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Clearance EXP</div>
              <div style={{ fontWeight: 700, color: '#b45309' }}>+{stage.baseExp} EXP</div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onStart}
            autoFocus
          >
            <span>BEGIN ENTRY</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
