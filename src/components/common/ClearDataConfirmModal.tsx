import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ClearDataConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ClearDataConfirmModal: React.FC<ClearDataConfirmModalProps> = ({
  onConfirm,
  onCancel
}) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="var(--error-red)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--error-red)' }}>
              Clear All Practice Data?
            </h3>
          </div>
          <button type="button" onClick={onCancel} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: '12px', lineHeight: 1.5 }}>
            This will permanently remove your stored local training session data from this browser:
          </p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px', color: 'var(--text-primary)' }}>
            <li>Current student name and trainee roll identity</li>
            <li>In-progress practice drafts and active entries</li>
            <li>Local stage progress, high scores, and best times</li>
            <li>Accumulated practice EXP</li>
            <li>Unlocked operator achievements & badges</li>
            <li>Cached student evaluation logs</li>
          </ul>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px 12px', borderRadius: '6px', color: '#991b1b', fontSize: '12px' }}>
            <strong>Note:</strong> The application will return to a clean initial state ready for a new student registration.
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            autoFocus
          >
            <Trash2 size={14} />
            <span>CLEAR DATA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
