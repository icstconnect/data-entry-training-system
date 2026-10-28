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
            <li>Current student trainee identity and roll number</li>
            <li><strong>Practice Lab:</strong> all completed stages (1–18), high accuracy scores, and drafts</li>
            <li><strong>Excel Lab:</strong> all 5 scenario completions, benchmark times, and grid drafts</li>
            <li><strong>Windows Lab:</strong> File & Folder track unlocked levels (reset to Level 1) and tree states</li>
            <li><strong>Total EXP:</strong> all accumulated experience points across Practice, Excel, and Windows labs</li>
            <li>All unlocked operator badges, honors, and formal certificate statuses</li>
          </ul>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px 12px', borderRadius: '6px', color: '#991b1b', fontSize: '12px' }}>
            <strong>Note:</strong> Every training lab will return to an initial Level 1 unlocked state ready for a clean start.
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
