import React, { useRef } from 'react';
import { MarksheetSchema, SourceRecord } from '../../types';

interface MarksheetGridProps {
  schema: MarksheetSchema;
  marksheetValues: Record<string, { theory?: number; oral?: number; total?: number; grade?: string }>;
  onChange: (vals: Record<string, { theory?: number; oral?: number; total?: number; grade?: string }>) => void;
  sourceRecord?: SourceRecord;
  isGuidedMode: boolean;
}

export const MarksheetGrid: React.FC<MarksheetGridProps> = ({
  schema,
  marksheetValues,
  onChange,
  sourceRecord,
  isGuidedMode
}) => {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFieldChange = (subjCode: string, field: 'theory' | 'oral' | 'total' | 'grade', value: any) => {
    const current = marksheetValues[subjCode] || {};
    const updated = {
      ...marksheetValues,
      [subjCode]: {
        ...current,
        [field]: value
      }
    };

    // Auto calculate total if theory and oral are entered
    if (field === 'theory' || field === 'oral') {
      const th = field === 'theory' ? Number(value) : Number(current.theory || 0);
      const or = field === 'oral' ? Number(value) : Number(current.oral || 0);
      if (!isNaN(th) && !isNaN(or)) {
        updated[subjCode].total = th + or;
      }
    }

    onChange(updated);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, subjIndex: number, field: string) => {
    const fieldsList = ['theory', 'oral', 'total'];
    if (schema.hasGrades) fieldsList.push('grade');

    let targetSubjIndex = subjIndex;
    let targetField = field;

    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetSubjIndex = Math.min(schema.subjects.length - 1, subjIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      targetSubjIndex = Math.max(0, subjIndex - 1);
    }

    if (targetSubjIndex !== subjIndex) {
      const nextSubj = schema.subjects[targetSubjIndex];
      const nextRefKey = `${nextSubj.code}-${targetField}`;
      const nextInput = inputRefs.current[nextRefKey];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  };

  // Compute Grand Total of entered marks
  const enteredGrandTotal = schema.subjects.reduce((sum, subj) => {
    const entry = marksheetValues[subj.code];
    return sum + (entry?.total ? Number(entry.total) : 0);
  }, 0);

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--icst-charcoal)' }}>
            Academic Marksheet Entry ({schema.boardType} Format)
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Training simulation layout. Ensure theory and oral marks align with the source record.
          </span>
        </div>
        <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
          Grand Total: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--icst-blue-dark)' }}>{enteredGrandTotal}</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-entry-table">
          <thead>
            <tr>
              <th style={{ width: '70px' }}>Code</th>
              <th>Subject Name</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Full Marks</th>
              {schema.hasTheoryPractical && (
                <>
                  <th style={{ width: '90px' }}>Theory</th>
                  <th style={{ width: '90px' }}>Oral/Prac</th>
                </>
              )}
              <th style={{ width: '90px' }}>Total</th>
              {schema.hasGrades && <th style={{ width: '70px' }}>Grade</th>}
            </tr>
          </thead>
          <tbody>
            {schema.subjects.map((subj, subjIdx) => {
              const entry = marksheetValues[subj.code] || {};
              const srcSubj = sourceRecord?.marksheet?.subjects?.find(s => s.code === subj.code);

              const isTheoryError = isGuidedMode && srcSubj && entry.theory !== undefined && String(entry.theory) !== '' &&
                Number(entry.theory) !== srcSubj.theory;
              const isOralError = isGuidedMode && srcSubj && entry.oral !== undefined && String(entry.oral) !== '' &&
                Number(entry.oral) !== srcSubj.oral;
              const isTotalError = isGuidedMode && srcSubj && entry.total !== undefined && String(entry.total) !== '' &&
                Number(entry.total) !== srcSubj.total;

              return (
                <tr key={subj.code}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {subj.code}
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {subj.name}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {subj.maxTotal}
                  </td>

                  {schema.hasTheoryPractical && (
                    <>
                      <td>
                        <input
                          ref={el => { inputRefs.current[`${subj.code}-theory`] = el; }}
                          type="number"
                          className={`table-cell-input ${isTheoryError ? 'cell-guided-error' : ''}`}
                          placeholder={String(subj.maxTheory || 90)}
                          value={entry.theory ?? ''}
                          onChange={e => handleFieldChange(subj.code, 'theory', e.target.value)}
                          onKeyDown={e => handleKeyDown(e, subjIdx, 'theory')}
                          title={isTheoryError ? `Expected: ${srcSubj?.theory}` : undefined}
                        />
                      </td>
                      <td>
                        <input
                          ref={el => { inputRefs.current[`${subj.code}-oral`] = el; }}
                          type="number"
                          className={`table-cell-input ${isOralError ? 'cell-guided-error' : ''}`}
                          placeholder={String(subj.maxOral || 10)}
                          value={entry.oral ?? ''}
                          onChange={e => handleFieldChange(subj.code, 'oral', e.target.value)}
                          onKeyDown={e => handleKeyDown(e, subjIdx, 'oral')}
                          title={isOralError ? `Expected: ${srcSubj?.oral}` : undefined}
                        />
                      </td>
                    </>
                  )}

                  <td>
                    <input
                      ref={el => { inputRefs.current[`${subj.code}-total`] = el; }}
                      type="number"
                      className={`table-cell-input ${isTotalError ? 'cell-guided-error' : ''}`}
                      placeholder={entry.total ? String(entry.total) : '0'}
                      value={entry.total ?? ''}
                      onChange={e => handleFieldChange(subj.code, 'total', e.target.value)}
                      onKeyDown={e => handleKeyDown(e, subjIdx, 'total')}
                      title={isTotalError ? `Expected: ${srcSubj?.total}` : undefined}
                    />
                  </td>

                  {schema.hasGrades && (
                    <td>
                      <input
                        ref={el => { inputRefs.current[`${subj.code}-grade`] = el; }}
                        type="text"
                        className="table-cell-input"
                        placeholder="A/B"
                        value={entry.grade ?? ''}
                        onChange={e => handleFieldChange(subj.code, 'grade', e.target.value.toUpperCase())}
                        onKeyDown={e => handleKeyDown(e, subjIdx, 'grade')}
                        style={{ textTransform: 'uppercase' }}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
