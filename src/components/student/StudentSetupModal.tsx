import React, { useState } from 'react';
import { StudentIdentity } from '../../types';
import { normalizeAndGenerateRollId, APP_CONFIG } from '../../config/appConfig';
import { User, Hash, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface StudentSetupModalProps {
  initialIdentity?: StudentIdentity | null;
  onSave: (identity: StudentIdentity) => void;
  onCancel?: () => void;
  canCancel?: boolean;
}

export const StudentSetupModal: React.FC<StudentSetupModalProps> = ({
  initialIdentity,
  onSave,
  onCancel,
  canCancel = false
}) => {
  const [name, setName] = useState(initialIdentity?.name || '');
  const [rollInput, setRollInput] = useState(initialIdentity?.rawRoll || '');
  const [error, setError] = useState<string | null>(null);

  // Live preview of generated roll identifier
  const normalized = normalizeAndGenerateRollId(rollInput);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter the student full name');
      return;
    }

    if (!rollInput.trim()) {
      setError('Please enter a 3-digit roll number (000–999)');
      return;
    }

    const norm = normalizeAndGenerateRollId(rollInput);
    if (!norm) {
      setError('Roll number must be between 000 and 999 (numeric only)');
      return;
    }

    setError(null);
    onSave({
      name: trimmedName,
      rawRoll: norm.rawRoll,
      generatedRollId: norm.generatedRollId
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/logo.png" 
              alt="ICST Logo" 
              style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
            />
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--icst-blue-dark)', fontWeight: 700 }}>
                {APP_CONFIG.INSTITUTE_SHORT} • Training Identity
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--icst-charcoal)' }}>
                Student Operator Setup
              </h3>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Please provide your student details. Your name and official trainee roll identifier will be recorded across your practice sessions, accuracy audits, and achievement certifications.
            </p>

            <div className="field-group">
              <label className="field-label">
                <span>Student Full Name <span className="field-required">*</span></span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="field-input"
                  style={{ paddingLeft: '34px' }}
                  placeholder="e.g. Sourav Ghosh"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  autoFocus
                  required
                />
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">
                <span>Class Roll Number (3 Digits: 000–999) <span className="field-required">*</span></span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="field-input"
                  style={{ paddingLeft: '34px', fontFamily: 'var(--font-mono)' }}
                  placeholder="e.g. 007, 042, 125"
                  maxLength={3}
                  value={rollInput}
                  onChange={e => {
                    // Allow only digits
                    const val = e.target.value.replace(/\D/g, '');
                    setRollInput(val);
                    setError(null);
                  }}
                  required
                />
                <Hash size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              </div>
              <span className="field-help">
                Single or double digits will automatically be formatted with leading zeros (e.g. 7 → 007).
              </span>
            </div>

            {/* Live Generated Roll ID preview */}
            {normalized && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <ShieldCheck size={18} color="#15803d" />
                <div style={{ fontSize: '12px' }}>
                  <div style={{ color: '#166534', fontWeight: 600 }}>Generated Trainee Identifier:</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '13px', color: '#14532d' }}>
                    {normalized.generatedRollId}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error-red)', fontSize: '12px', fontWeight: 600 }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            {canCancel && onCancel && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: canCancel ? 'auto' : '100%' }}
            >
              <span>CONFIRM & START PRACTICE</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
