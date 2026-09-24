import React from 'react';
import { StageConfig } from '../../types';
import { CheckCircle2, AlertTriangle, XCircle, ArrowLeft, Send } from 'lucide-react';

interface ReviewModalProps {
  stage: StageConfig;
  formValues: Record<string, any>;
  tableRows?: Record<string, any>[];
  marksheetValues?: Record<string, any>;
  onClose: () => void;
  onFinalSubmit: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  stage,
  formValues,
  tableRows,
  marksheetValues,
  onClose,
  onFinalSubmit
}) => {
  // Assess inspection status for every field (without revealing the true source value!)
  const fieldInspections = stage.fields.map(f => {
    const val = formValues[f.id];
    const isEmpty = val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);

    let status: 'completed' | 'empty' | 'warning' = 'completed';
    let warningReason = '';

    if (isEmpty) {
      status = 'empty';
    } else if (f.type === 'date') {
      const dateStr = String(val).trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        status = 'warning';
        warningReason = 'Date format should be YYYY-MM-DD';
      }
    } else if (f.type === 'email') {
      const emailStr = String(val).trim();
      if (!emailStr.includes('@') || !emailStr.includes('.')) {
        status = 'warning';
        warningReason = 'Check email structure';
      }
    } else if (f.type === 'tel') {
      const telStr = String(val).replace(/\D/g, '');
      if (telStr.length !== 10) {
        status = 'warning';
        warningReason = 'Check 10-digit count';
      }
    }

    return {
      field: f,
      enteredDisplay: Array.isArray(val) ? val.join(', ') : (val ?? ''),
      status,
      warningReason
    };
  });

  const totalFields = fieldInspections.length;
  const completedFields = fieldInspections.filter(i => i.status === 'completed').length;
  const emptyFields = fieldInspections.filter(i => i.status === 'empty').length;
  const warningFields = fieldInspections.filter(i => i.status === 'warning').length;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--icst-blue-dark)', fontWeight: 700 }}>
              Pre-Submission Inspection
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--icst-charcoal)' }}>
              Review Entry Before Final Submit
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="review-status-pill pill-complete">
              {completedFields} Ready
            </span>
            {emptyFields > 0 && (
              <span className="review-status-pill pill-empty">
                {emptyFields} Empty
              </span>
            )}
            {warningFields > 0 && (
              <span className="review-status-pill pill-warning">
                {warningFields} Warnings
              </span>
            )}
          </div>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Inspect all entered values carefully. The correct answers will only be evaluated after final submission.
          </p>

          <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {fieldInspections.map(({ field, enteredDisplay, status, warningReason }) => (
              <div key={field.id} className="review-item">
                <div style={{ flex: 1, paddingRight: '12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                    {field.label} {field.required && <span style={{ color: 'var(--error-red)' }}>*</span>}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    color: status === 'empty' ? 'var(--text-muted)' : 'var(--text-secondary)',
                    marginTop: '2px'
                  }}>
                    {status === 'empty' ? '<em>(Empty)</em>' : enteredDisplay}
                  </div>
                </div>

                <div>
                  {status === 'completed' && (
                    <span className="review-status-pill pill-complete">
                      <CheckCircle2 size={12} />
                      <span>Entered</span>
                    </span>
                  )}
                  {status === 'empty' && (
                    <span className="review-status-pill pill-empty">
                      <XCircle size={12} />
                      <span>{field.required ? 'Required Empty' : 'Empty'}</span>
                    </span>
                  )}
                  {status === 'warning' && (
                    <span className="review-status-pill pill-warning" title={warningReason}>
                      <AlertTriangle size={12} />
                      <span>{warningReason || 'Check Format'}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Table summary note if stage has tables */}
          {stage.tableSchema && tableRows && (
            <div style={{ marginTop: '16px', background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
              <strong>Table Data:</strong> {tableRows.length} assessment rows recorded for verification.
            </div>
          )}

          {/* Marksheet summary note if stage has marksheet */}
          {stage.marksheetSchema && marksheetValues && (
            <div style={{ marginTop: '10px', background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
              <strong>Marksheet Data:</strong> {stage.marksheetSchema.subjects.length} subjects entries recorded.
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            <ArrowLeft size={14} />
            <span>Make Corrections</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onFinalSubmit}
            autoFocus
          >
            <Send size={14} />
            <span>FINAL SUBMIT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
