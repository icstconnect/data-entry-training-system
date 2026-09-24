import React, { useState } from 'react';
import { verifyTeacherPassword } from '../../config/teacherAccess';
import { Lock, Eye, EyeOff, X, ArrowRight, AlertCircle, Shield } from 'lucide-react';

interface TeacherPasswordModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const TeacherPasswordModal: React.FC<TeacherPasswordModalProps> = ({
  onSuccess,
  onCancel
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the teacher mode password');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await verifyTeacherPassword(password);
    setIsLoading(false);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Incorrect teacher password');
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="var(--icst-blue)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Teacher Mode Access Gate</h3>
          </div>
          <button type="button" onClick={onCancel} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Teacher Mode allows configuring custom examinations, test datasets, and reviewing class attempt audits. Enter authorized administrative password to continue.
            </p>

            <div className="field-group">
              <label className="field-label">Teacher Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="field-input"
                  style={{ paddingRight: '40px' }}
                  placeholder="Enter administrator password..."
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '8px',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error-red)', fontSize: '12px', fontWeight: 600 }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              <span>Unlock Teacher Mode</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
