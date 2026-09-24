import React from 'react';
import { StageConfig } from '../../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowLeft, 
  Send, 
  ArrowRight,
  ClipboardList
} from 'lucide-react';

interface ReviewModalProps {
  stage: StageConfig;
  formValues: Record<string, any>;
  tableRows?: Record<string, any>[];
  marksheetValues?: Record<string, any>;
  isFinalStage: boolean;
  onClose: () => void;
  onConfirmAdvance: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  stage,
  formValues,
  tableRows,
  marksheetValues,
  isFinalStage,
  onClose,
  onConfirmAdvance
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
        warningReason = 'Expected 10 digits';
      }
    }

    return {
      field: f,
      enteredDisplay: Array.isArray(val) ? val.join(', ') : (val ?? ''),
      status,
      warningReason
    };
  });

  const completedFields = fieldInspections.filter(i => i.status === 'completed').length;
  const emptyFields = fieldInspections.filter(i => i.status === 'empty').length;
  const warningFields = fieldInspections.filter(i => i.status === 'warning').length;

  // Group fields into their respective sections
  const sections: { name: string; items: typeof fieldInspections }[] = [];
  const uncategorized = fieldInspections.filter(i => !i.field.section);
  if (uncategorized.length > 0) {
    sections.push({ name: 'General Information', items: uncategorized });
  }

  const distinctSections = Array.from(new Set(stage.fields.map(f => f.section).filter(Boolean))) as string[];
  distinctSections.forEach(secName => {
    sections.push({
      name: secName,
      items: fieldInspections.filter(i => i.field.section === secName)
    });
  });

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '780px', maxHeight: '92vh' }}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--icst-blue-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ClipboardList size={14} />
              <span>Full Form Review • Stage {stage.stageNumber} of {stage.levelNumber === 1 ? 2 : stage.levelNumber === 2 || stage.levelNumber === 3 ? 3 : stage.levelNumber === 4 ? 4 : 6}</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--icst-charcoal)' }}>
              Complete Entered Data Inspection
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="review-status-pill pill-complete">
              {completedFields} Completed
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

        <div className="modal-body" style={{ overflowY: 'auto', padding: '20px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
            Verify all information entered into the form below. In accordance with examination regulations, correct source answers are withheld until final evaluation.
          </p>

          {/* Render Sections with all fields */}
          {sections.map(sec => (
            <div key={sec.name} style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--icst-blue-dark)',
                background: 'var(--icst-blue-soft)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}>
                {sec.name}
              </div>

              <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#ffffff' }}>
                {sec.items.map(({ field, enteredDisplay, status, warningReason }) => (
                  <div key={field.id} className="review-item">
                    <div style={{ flex: 1, paddingRight: '12px' }}>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                        {field.label} {field.required && <span style={{ color: 'var(--error-red)' }}>*</span>}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        fontFamily: 'var(--font-mono)',
                        color: status === 'empty' ? 'var(--text-muted)' : 'var(--text-primary)',
                        marginTop: '3px',
                        fontWeight: status === 'completed' ? 600 : 400
                      }}>
                        {status === 'empty' ? <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>[Not Entered / Blank]</span> : enteredDisplay}
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
                          <span>{field.required ? 'Required Blank' : 'Blank'}</span>
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
            </div>
          ))}

          {/* Full Tabular Grid Data if stage has table */}
          {stage.tableSchema && tableRows && tableRows.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--icst-blue-dark)',
                background: 'var(--icst-blue-soft)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '10px',
                textTransform: 'uppercase'
              }}>
                {stage.tableSchema.tableName} (Entered Rows)
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                <table className="data-entry-table" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                      {stage.tableSchema.columns.map(col => (
                        <th key={col.id}>{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((r, i) => (
                      <tr key={i}>
                        <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>{i + 1}</td>
                        {stage.tableSchema?.columns.map(col => {
                          const val = r[col.id];
                          const isBlank = val === undefined || val === null || String(val).trim() === '';
                          return (
                            <td key={col.id} style={{ fontFamily: 'var(--font-mono)' }}>
                              {isBlank ? <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>-</span> : String(val)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Full Marksheet Grid Data if stage has marksheet */}
          {stage.marksheetSchema && marksheetValues && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--icst-blue-dark)',
                background: 'var(--icst-blue-soft)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '10px',
                textTransform: 'uppercase'
              }}>
                Marksheet Entries ({stage.marksheetSchema.boardType} Format)
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                <table className="data-entry-table" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      {stage.marksheetSchema.hasTheoryPractical && (
                        <>
                          <th style={{ width: '80px', textAlign: 'center' }}>Theory</th>
                          <th style={{ width: '80px', textAlign: 'center' }}>Oral/Prac</th>
                        </>
                      )}
                      <th style={{ width: '80px', textAlign: 'center' }}>Total</th>
                      {stage.marksheetSchema.hasGrades && (
                        <th style={{ width: '70px', textAlign: 'center' }}>Grade</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {stage.marksheetSchema.subjects.map(s => {
                      const entry = marksheetValues[s.code] || {};
                      return (
                        <tr key={s.code}>
                          <td style={{ fontWeight: 600 }}>{s.name}</td>
                          {stage.marksheetSchema?.hasTheoryPractical && (
                            <>
                              <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                                {entry.theory !== undefined && entry.theory !== '' ? entry.theory : <span style={{ color: '#94a3b8' }}>-</span>}
                              </td>
                              <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                                {entry.oral !== undefined && entry.oral !== '' ? entry.oral : <span style={{ color: '#94a3b8' }}>-</span>}
                              </td>
                            </>
                          )}
                          <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--icst-blue-dark)' }}>
                            {entry.total !== undefined && entry.total !== '' ? entry.total : <span style={{ color: '#94a3b8' }}>-</span>}
                          </td>
                          {stage.marksheetSchema?.hasGrades && (
                            <td style={{ textAlign: 'center', fontWeight: 600 }}>
                              {entry.grade || '-'}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            <ArrowLeft size={14} />
            <span>BACK TO EDIT</span>
          </button>

          {isFinalStage ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onConfirmAdvance}
              autoFocus
            >
              <Send size={14} />
              <span>FINAL SUBMIT</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onConfirmAdvance}
              autoFocus
            >
              <span>NEXT STAGE</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
