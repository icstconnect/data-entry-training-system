import React, { useRef } from 'react';
import { MarksheetSchema, SourceRecord } from '../../types';

interface MarksheetGridProps {
  schema: MarksheetSchema;
  marksheetValues: Record<string, { theory?: number | string; oral?: number | string; total?: number | string; grade?: string }>;
  onChange: (vals: Record<string, { theory?: number | string; oral?: number | string; total?: number | string; grade?: string }>) => void;
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

    // Auto calculate total if theory or oral is modified
    if (field === 'theory' || field === 'oral') {
      const thVal = field === 'theory' ? value : current.theory;
      const orVal = field === 'oral' ? value : current.oral;

      const hasTh = thVal !== undefined && thVal !== null && String(thVal).trim() !== '';
      const hasOr = orVal !== undefined && orVal !== null && String(orVal).trim() !== '';

      if (hasTh || hasOr) {
        const th = hasTh ? Number(thVal) : 0;
        const or = hasOr ? Number(orVal) : 0;
        if (!isNaN(th) && !isNaN(or)) {
          updated[subjCode].total = th + or;
        }
      } else {
        updated[subjCode].total = '';
      }
    }

    onChange(updated);
  };

  // Keyboard navigation across cells
  const handleKeyDown = (e: React.KeyboardEvent, subjIndex: number, field: 'theory' | 'oral' | 'total' | 'grade') => {
    const fieldsList: ('theory' | 'oral' | 'total' | 'grade')[] = [];
    if (schema.hasTheoryPractical) {
      fieldsList.push('theory', 'oral');
    }
    fieldsList.push('total');
    if (schema.hasGrades) {
      fieldsList.push('grade');
    }

    const currentFieldIndex = fieldsList.indexOf(field);
    let targetSubjIndex = subjIndex;
    let targetFieldIndex = currentFieldIndex;

    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (subjIndex < schema.subjects.length - 1) {
        targetSubjIndex = subjIndex + 1;
      } else if (currentFieldIndex < fieldsList.length - 1) {
        targetSubjIndex = 0;
        targetFieldIndex = currentFieldIndex + 1;
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (subjIndex > 0) {
        targetSubjIndex = subjIndex - 1;
      } else if (currentFieldIndex > 0) {
        targetSubjIndex = schema.subjects.length - 1;
        targetFieldIndex = currentFieldIndex - 1;
      }
    } else if (e.key === 'ArrowRight') {
      const input = e.target as HTMLInputElement;
      if (input.selectionEnd === input.value.length && currentFieldIndex < fieldsList.length - 1) {
        e.preventDefault();
        targetFieldIndex = currentFieldIndex + 1;
      }
    } else if (e.key === 'ArrowLeft') {
      const input = e.target as HTMLInputElement;
      if (input.selectionStart === 0 && currentFieldIndex > 0) {
        e.preventDefault();
        targetFieldIndex = currentFieldIndex - 1;
      }
    }

    if (targetSubjIndex !== subjIndex || targetFieldIndex !== currentFieldIndex) {
      const nextSubj = schema.subjects[targetSubjIndex];
      const nextField = fieldsList[targetFieldIndex];
      const nextRefKey = `${nextSubj.code}-${nextField}`;
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--icst-charcoal)' }}>
            Academic Marksheet Entry ({schema.boardType} Format)
          </h4>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Training simulation layout. Enter theory, oral/prac, total marks, and grades matching the source record.
          </span>
        </div>
        <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Grand Total:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--icst-blue-dark)' }}>{enteredGrandTotal}</span>
          {isGuidedMode && sourceRecord?.marksheet?.grandTotal !== undefined && (
            <span style={{ fontSize: '11px', color: enteredGrandTotal === sourceRecord.marksheet.grandTotal ? '#15803d' : '#b91c1c', fontWeight: 600 }}>
              {enteredGrandTotal === sourceRecord.marksheet.grandTotal ? '(Matches Source ✓)' : `(Target: ${sourceRecord.marksheet.grandTotal})`}
            </span>
          )}
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
                  <th style={{ width: '90px', textAlign: 'center' }}>Theory</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>Oral/Prac</th>
                </>
              )}
              <th style={{ width: '90px', textAlign: 'center' }}>Total</th>
              {schema.hasGrades && <th style={{ width: '75px', textAlign: 'center' }}>Grade</th>}
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
              const isGradeError = isGuidedMode && srcSubj && entry.grade !== undefined && String(entry.grade).trim() !== '' &&
                String(entry.grade).trim().toUpperCase() !== String(srcSubj.grade || '').trim().toUpperCase();

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
                          placeholder=""
                          value={entry.theory ?? ''}
                          onChange={e => handleFieldChange(subj.code, 'theory', e.target.value)}
                          onKeyDown={e => handleKeyDown(e, subjIdx, 'theory')}
                          style={{ textAlign: 'center' }}
                          title={isTheoryError ? `Expected: ${srcSubj?.theory}` : `Max: ${subj.maxTheory || 90}`}
                        />
                      </td>
                      <td>
                        <input
                          ref={el => { inputRefs.current[`${subj.code}-oral`] = el; }}
                          type="number"
                          className={`table-cell-input ${isOralError ? 'cell-guided-error' : ''}`}
                          placeholder=""
                          value={entry.oral ?? ''}
                          onChange={e => handleFieldChange(subj.code, 'oral', e.target.value)}
                          onKeyDown={e => handleKeyDown(e, subjIdx, 'oral')}
                          style={{ textAlign: 'center' }}
                          title={isOralError ? `Expected: ${srcSubj?.oral}` : `Max: ${subj.maxOral || 10}`}
                        />
                      </td>
                    </>
                  )}

                  <td>
                    <input
                      ref={el => { inputRefs.current[`${subj.code}-total`] = el; }}
                      type="number"
                      className={`table-cell-input ${isTotalError ? 'cell-guided-error' : ''}`}
                      placeholder=""
                      value={entry.total ?? ''}
                      onChange={e => handleFieldChange(subj.code, 'total', e.target.value)}
                      onKeyDown={e => handleKeyDown(e, subjIdx, 'total')}
                      style={{ textAlign: 'center', fontWeight: 600 }}
                      title={isTotalError ? `Expected: ${srcSubj?.total}` : 'Sum of Theory + Oral'}
                    />
                  </td>

                  {schema.hasGrades && (
                    <td>
                      <input
                        ref={el => { inputRefs.current[`${subj.code}-grade`] = el; }}
                        type="text"
                        className={`table-cell-input ${isGradeError ? 'cell-guided-error' : ''}`}
                        placeholder=""
                        value={entry.grade ?? ''}
                        onChange={e => handleFieldChange(subj.code, 'grade', e.target.value.toUpperCase())}
                        onKeyDown={e => handleKeyDown(e, subjIdx, 'grade')}
                        style={{ textTransform: 'uppercase', textAlign: 'center', fontWeight: 600 }}
                        title={isGradeError ? `Expected: ${srcSubj?.grade}` : 'Letter Grade'}
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
