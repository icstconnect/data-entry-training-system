import React, { useState, useMemo } from 'react';
import { StageConfig, SourceRecord, FieldValidationResult, CellValidationResult } from '../../types';
import { 
  validateField, 
  validateTableRows, 
  validateMarksheet 
} from '../../services/validationEngine';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowLeft, 
  Send, 
  ArrowRight,
  ClipboardCheck,
  Check,
  X,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
  GraduationCap
} from 'lucide-react';

export interface ReviewModalProps {
  stage: StageConfig;
  sourceRecord: SourceRecord;
  formValues: Record<string, any>;
  tableRows?: Record<string, any>[];
  marksheetValues?: Record<string, any>;
  isFinalStage?: boolean;
  isPostSubmission?: boolean;
  onClose: () => void;
  onConfirmAdvance?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  stage,
  sourceRecord,
  formValues,
  tableRows,
  marksheetValues,
  isFinalStage = false,
  isPostSubmission = false,
  onClose,
  onConfirmAdvance
}) => {
  const [filter, setFilter] = useState<'all' | 'mistakes' | 'correct'>('all');

  // Evaluate form fields
  const fieldResults: FieldValidationResult[] = useMemo(() => {
    return stage.fields.map(f => validateField(sourceRecord, formValues, f));
  }, [stage, sourceRecord, formValues]);

  // Evaluate spreadsheet table rows if present
  const tableCellResults: CellValidationResult[] = useMemo(() => {
    if (!stage.tableSchema) return [];
    return validateTableRows(sourceRecord.tableRows, tableRows, stage.tableSchema.columns);
  }, [stage, sourceRecord, tableRows]);

  // Evaluate marksheet table if present
  const marksheetCellResults: CellValidationResult[] = useMemo(() => {
    if (!stage.marksheetSchema) return [];
    return validateMarksheet(sourceRecord, marksheetValues || {});
  }, [stage, sourceRecord, marksheetValues]);

  // Aggregate accuracy metrics
  const totalUnits = fieldResults.length + tableCellResults.length + marksheetCellResults.length;
  const correctUnits = 
    fieldResults.filter(f => f.status === 'correct').length +
    tableCellResults.filter(c => c.status === 'correct').length +
    marksheetCellResults.filter(c => c.status === 'correct').length;
  const incorrectUnits = 
    fieldResults.filter(f => f.status === 'incorrect').length +
    tableCellResults.filter(c => c.status === 'incorrect').length +
    marksheetCellResults.filter(c => c.status === 'incorrect').length;
  const missingUnits = 
    fieldResults.filter(f => f.status === 'missing').length +
    tableCellResults.filter(c => c.status === 'missing').length +
    marksheetCellResults.filter(c => c.status === 'missing').length;

  const mistakesTotal = incorrectUnits + missingUnits;
  const accuracyPercentage = Math.round((correctUnits / Math.max(1, totalUnits)) * 100);

  // Group fields into the exact sections as the form layout
  const sections: { name: string; items: { field: typeof stage.fields[0]; result: FieldValidationResult }[] }[] = [];
  const uncategorized = stage.fields
    .filter(f => !f.section)
    .map(f => ({ field: f, result: fieldResults.find(r => r.fieldId === f.id)! }));

  if (uncategorized.length > 0) {
    sections.push({ name: 'General Information', items: uncategorized });
  }

  const distinctSections = Array.from(new Set(stage.fields.map(f => f.section).filter(Boolean))) as string[];
  distinctSections.forEach(secName => {
    const items = stage.fields
      .filter(f => f.section === secName)
      .map(f => ({ field: f, result: fieldResults.find(r => r.fieldId === f.id)! }));
    sections.push({ name: secName, items });
  });

  // Helper to format displayed values nicely
  const formatVal = (v: any): string => {
    if (v === undefined || v === null) return '';
    if (Array.isArray(v)) return v.join(', ');
    return String(v).trim();
  };

  const getErrorBadgeText = (result: FieldValidationResult) => {
    if (result.status === 'missing') return 'REQUIRED BLANK';
    switch (result.errorType) {
      case 'spelling_mistake':
        return 'SPELLING MISTAKE';
      case 'missing_word':
        return 'MISSING WORD / NAME';
      case 'wrong_number':
        return 'NUMERIC MISMATCH';
      case 'format_error':
        return 'FORMAT MISMATCH';
      default:
        return 'WRONG VALUE';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card review-modal-card" 
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="review-modal-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ 
                fontSize: '11px', 
                textTransform: 'uppercase', 
                color: 'var(--icst-blue-dark)', 
                fontWeight: 700, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                marginBottom: '2px'
              }}>
                <ClipboardCheck size={14} />
                <span>EXACT FORM AUDIT • LEVEL {stage.levelNumber} - STAGE {stage.stageNumber}</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--icst-charcoal)', margin: 0 }}>
                {stage.title}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {stage.subtitle} • Target Accuracy: <strong>{stage.requiredAccuracy}%</strong>
              </div>
            </div>

            {/* Accuracy Score Pill */}
            <div style={{
              background: accuracyPercentage >= stage.requiredAccuracy ? '#f0fdf4' : '#fef2f2',
              border: `1.5px solid ${accuracyPercentage >= stage.requiredAccuracy ? '#86efac' : '#fca5a5'}`,
              borderRadius: 'var(--radius-md)',
              padding: '6px 14px',
              textAlign: 'center',
              minWidth: '110px'
            }}>
              <div style={{ 
                fontSize: '10px', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                color: accuracyPercentage >= stage.requiredAccuracy ? '#15803d' : '#b91c1c' 
              }}>
                Accuracy Score
              </div>
              <div style={{ 
                fontSize: '22px', 
                fontWeight: 800, 
                fontFamily: 'var(--font-mono)', 
                color: accuracyPercentage >= stage.requiredAccuracy ? '#166534' : '#991b1b',
                lineHeight: 1.1
              }}>
                {accuracyPercentage}%
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar & Filter Controls */}
          <div className="review-stat-strip" style={{ justifyContent: 'space-between' }}>
            {/* Counts */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="review-stat-chip">
                <span>Total Units:</span>
                <strong>{totalUnits}</strong>
              </span>
              <span className="review-stat-chip" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#15803d' }}>
                <Check size={12} />
                <span>{correctUnits} Correct</span>
              </span>
              {incorrectUnits > 0 && (
                <span className="review-stat-chip" style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#b91c1c' }}>
                  <X size={12} />
                  <span>{incorrectUnits} Mistakes</span>
                </span>
              )}
              {missingUnits > 0 && (
                <span className="review-stat-chip" style={{ background: '#fffbeb', borderColor: '#fde68a', color: '#b45309' }}>
                  <AlertCircle size={12} />
                  <span>{missingUnits} Missing</span>
                </span>
              )}
            </div>

            {/* Filter Toggle Buttons */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className={`review-filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                <span>All Fields ({totalUnits})</span>
              </button>
              <button
                type="button"
                className={`review-filter-btn ${filter === 'mistakes' ? 'active' : ''}`}
                onClick={() => setFilter('mistakes')}
                style={filter !== 'mistakes' && mistakesTotal > 0 ? { borderColor: '#fca5a5', color: '#b91c1c' } : {}}
              >
                <XCircle size={12} />
                <span>Mistakes Only ({mistakesTotal})</span>
              </button>
              <button
                type="button"
                className={`review-filter-btn ${filter === 'correct' ? 'active' : ''}`}
                onClick={() => setFilter('correct')}
              >
                <CheckCircle2 size={12} />
                <span>Correct Only ({correctUnits})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body: Rendered exact as the form */}
        <div className="modal-body" style={{ overflowY: 'auto', padding: '18px 20px', background: '#f8fafc' }}>
          
          {/* Instructions banner */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: '18px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={16} color="var(--icst-blue-primary)" />
              <span>
                <strong>Form Verification Guide:</strong> Compare what you typed against what will be correct in the exact form layout below.
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px', fontSize: '11px', fontWeight: 600 }}>
              <span style={{ color: '#15803d' }}>● Green = What is Correct</span>
              <span style={{ color: '#b91c1c' }}>● Red = What is Wrong</span>
            </div>
          </div>

          {/* Render Sections identical to form layout */}
          {sections.map(sec => {
            // Apply filtering to items in this section
            const visibleItems = sec.items.filter(({ result }) => {
              if (filter === 'mistakes') return result.status !== 'correct';
              if (filter === 'correct') return result.status === 'correct';
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={sec.name} style={{ marginBottom: '22px' }}>
                {/* Section Header styled identical to the form */}
                <div style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: 'var(--icst-blue-dark)',
                  background: 'var(--icst-blue-soft)',
                  borderLeft: '4px solid var(--icst-blue-primary)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>{sec.name}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {visibleItems.length} field{visibleItems.length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Form Grid identical to form layout */}
                <div className="form-grid">
                  {visibleItems.map(({ field, result }) => {
                    const isCorrect = result.status === 'correct';
                    const isMissing = result.status === 'missing';
                    const enteredStr = formatVal(result.enteredValue);
                    const sourceStr = formatVal(result.sourceValue);

                    return (
                      <div 
                        key={field.id} 
                        className={`review-field-card ${isCorrect ? 'is-correct' : isMissing ? 'is-missing' : 'is-incorrect'}`}
                      >
                        {/* Field Label + Status Badge */}
                        <div className="review-field-header">
                          <label className="review-field-label">
                            {field.label} {field.required && <span className="field-required">*</span>}
                          </label>

                          {isCorrect ? (
                            <span className="review-status-pill pill-complete">
                              <CheckCircle2 size={12} />
                              <span>CORRECT</span>
                            </span>
                          ) : isMissing ? (
                            <span className="review-status-pill pill-empty" style={{ background: '#fffbeb', borderColor: '#fde68a', color: '#b45309' }}>
                              <AlertCircle size={12} />
                              <span>{getErrorBadgeText(result)}</span>
                            </span>
                          ) : (
                            <span className="review-status-pill pill-empty">
                              <XCircle size={12} />
                              <span>{getErrorBadgeText(result)}</span>
                            </span>
                          )}
                        </div>

                        {/* Visual Comparison Box */}
                        <div className="review-comparison-box">
                          {isCorrect ? (
                            /* Correct Field Display */
                            <div style={{
                              background: '#f0fdf4',
                              border: '1px solid #86efac',
                              borderRadius: 'var(--radius-sm)',
                              padding: '8px 10px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>
                                  ✓ Entered & Validated
                                </span>
                                <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 600 }}>Matches Source</span>
                              </div>
                              <div style={{ 
                                fontFamily: 'var(--font-mono)', 
                                fontSize: '13px', 
                                fontWeight: 700, 
                                color: '#14532d',
                                wordBreak: 'break-word'
                              }}>
                                {enteredStr || <span style={{ fontStyle: 'italic', opacity: 0.6 }}>(Optional Blank)</span>}
                              </div>
                            </div>
                          ) : (
                            /* Mistake Comparison: What is wrong vs What will be correct */
                            <>
                              {/* 1. What was entered (Wrong) */}
                              <div className="review-entered-row">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#b91c1c' }}>
                                    ❌ What you entered (Wrong)
                                  </span>
                                  <span style={{ fontSize: '10px', fontWeight: 700, background: '#fee2e2', padding: '1px 5px', borderRadius: '4px' }}>
                                    YOUR INPUT
                                  </span>
                                </div>
                                <div style={{ 
                                  fontFamily: 'var(--font-mono)', 
                                  fontSize: '13px', 
                                  fontWeight: 600, 
                                  color: '#991b1b',
                                  textDecoration: enteredStr ? 'line-through' : 'none',
                                  wordBreak: 'break-word'
                                }}>
                                  {enteredStr || <span style={{ fontStyle: 'italic', fontWeight: 400 }}>[Left Blank / Not Entered]</span>}
                                </div>
                              </div>

                              {/* 2. What will be correct (Expected) */}
                              <div className="review-correct-row">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                                  <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#15803d' }}>
                                    ✅ What will be correct
                                  </span>
                                  <span style={{ fontSize: '10px', fontWeight: 700, background: '#dcfce7', padding: '1px 5px', borderRadius: '4px' }}>
                                    EXPECTED
                                  </span>
                                </div>
                                <div style={{ 
                                  fontFamily: 'var(--font-mono)', 
                                  fontSize: '13px', 
                                  fontWeight: 800, 
                                  color: '#14532d',
                                  wordBreak: 'break-word'
                                }}>
                                  {sourceStr || <span style={{ fontStyle: 'italic', fontWeight: 400 }}>(None specified)</span>}
                                </div>
                              </div>

                              {/* 3. Explanation banner */}
                              {result.errorMessage && (
                                <div className="review-explanation-callout">
                                  <HelpCircle size={13} style={{ flexShrink: 0, marginTop: '1px' }} />
                                  <span><strong>Explanation:</strong> {result.errorMessage}</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Full Tabular Grid Data if stage has table */}
          {stage.tableSchema && tableRows && tableRows.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 800,
                color: 'var(--icst-blue-dark)',
                background: 'var(--icst-blue-soft)',
                borderLeft: '4px solid var(--icst-blue-primary)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '12px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FileSpreadsheet size={15} />
                <span>{stage.tableSchema.tableName} (Tabular Verification)</span>
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: '#ffffff' }}>
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
                    {tableRows.map((r, rowIndex) => (
                      <tr key={rowIndex}>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>{rowIndex + 1}</td>
                        {stage.tableSchema?.columns.map(col => {
                          const usrVal = r[col.id];
                          const cellRes = tableCellResults.find(c => c.rowId === rowIndex + 1 && c.columnId === col.id);
                          const isCorrect = cellRes?.status === 'correct';
                          const isIncorrect = cellRes && cellRes.status !== 'correct';

                          return (
                            <td 
                              key={col.id} 
                              className={isIncorrect ? 'review-table-cell-incorrect' : isCorrect ? 'review-table-cell-correct' : ''}
                              style={{ padding: '8px 10px', verticalAlign: 'top' }}
                            >
                              {isCorrect ? (
                                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                                  ✓ {String(usrVal)}
                                </div>
                              ) : isIncorrect ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px' }}>
                                  <div style={{ color: '#b91c1c', textDecoration: usrVal ? 'line-through' : 'none', fontWeight: 600 }}>
                                    ❌ Entered: {usrVal ? String(usrVal) : <span style={{ fontStyle: 'italic' }}>[empty]</span>}
                                  </div>
                                  <div style={{ color: '#15803d', fontWeight: 800 }}>
                                    ✅ Correct: {String(cellRes?.sourceValue ?? '')}
                                  </div>
                                  {cellRes?.errorMessage && (
                                    <div style={{ color: '#991b1b', fontSize: '10px' }}>
                                      {cellRes.errorMessage}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span style={{ fontFamily: 'var(--font-mono)' }}>{String(usrVal || '-')}</span>
                              )}
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
          {stage.marksheetSchema && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 800,
                color: 'var(--icst-blue-dark)',
                background: 'var(--icst-blue-soft)',
                borderLeft: '4px solid var(--icst-blue-primary)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '12px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <GraduationCap size={15} />
                <span>Marksheet Entries ({stage.marksheetSchema.boardType} Verification)</span>
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: '#ffffff' }}>
                <table className="data-entry-table" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      {stage.marksheetSchema.hasTheoryPractical && (
                        <>
                          <th style={{ width: '130px', textAlign: 'center' }}>Theory</th>
                          <th style={{ width: '130px', textAlign: 'center' }}>Oral / Prac</th>
                        </>
                      )}
                      <th style={{ width: '130px', textAlign: 'center' }}>Total</th>
                      {stage.marksheetSchema.hasGrades && (
                        <th style={{ width: '90px', textAlign: 'center' }}>Grade</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {stage.marksheetSchema.subjects.map(s => {
                      const entry = marksheetValues?.[s.code] || {};
                      const theoryRes = marksheetCellResults.find(c => c.rowId === s.code && c.columnId === 'theory');
                      const oralRes = marksheetCellResults.find(c => c.rowId === s.code && c.columnId === 'oral');
                      const totalRes = marksheetCellResults.find(c => c.rowId === s.code && c.columnId === 'total');

                      const renderMarkCell = (val: any, res: CellValidationResult | undefined) => {
                        if (!res) return <span>{val !== undefined && val !== '' ? val : '-'}</span>;
                        if (res.status === 'correct') {
                          return (
                            <div style={{ color: '#15803d', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                              ✓ {val}
                            </div>
                          );
                        }
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px', textAlign: 'left' }}>
                            <div style={{ color: '#b91c1c', textDecoration: val ? 'line-through' : 'none', fontWeight: 600 }}>
                              ❌ {val ? String(val) : '[empty]'}
                            </div>
                            <div style={{ color: '#15803d', fontWeight: 800 }}>
                              ✅ {String(res.sourceValue)}
                            </div>
                          </div>
                        );
                      };

                      return (
                        <tr key={s.code}>
                          <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</td>
                          {stage.marksheetSchema?.hasTheoryPractical && (
                            <>
                              <td 
                                className={theoryRes && theoryRes.status !== 'correct' ? 'review-table-cell-incorrect' : theoryRes?.status === 'correct' ? 'review-table-cell-correct' : ''}
                                style={{ textAlign: 'center' }}
                              >
                                {renderMarkCell(entry.theory, theoryRes)}
                              </td>
                              <td 
                                className={oralRes && oralRes.status !== 'correct' ? 'review-table-cell-incorrect' : oralRes?.status === 'correct' ? 'review-table-cell-correct' : ''}
                                style={{ textAlign: 'center' }}
                              >
                                {renderMarkCell(entry.oral, oralRes)}
                              </td>
                            </>
                          )}
                          <td 
                            className={totalRes && totalRes.status !== 'correct' ? 'review-table-cell-incorrect' : totalRes?.status === 'correct' ? 'review-table-cell-correct' : ''}
                            style={{ textAlign: 'center' }}
                          >
                            {renderMarkCell(entry.total, totalRes)}
                          </td>
                          {stage.marksheetSchema?.hasGrades && (
                            <td style={{ textAlign: 'center', fontWeight: 700 }}>
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

        {/* Modal Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            <ArrowLeft size={14} />
            <span>{isPostSubmission ? 'CLOSE AUDIT' : 'BACK TO EDIT FORM'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {mistakesTotal > 0 && !isPostSubmission && (
              <span style={{ fontSize: '12px', color: '#b91c1c', fontWeight: 600 }}>
                ⚠️ {mistakesTotal} mistake{mistakesTotal === 1 ? '' : 's'} remaining
              </span>
            )}

            {!isPostSubmission && onConfirmAdvance && (
              isFinalStage ? (
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
                  <span>PROCEED TO NEXT STAGE</span>
                  <ArrowRight size={14} />
                </button>
              )
            )}

            {isPostSubmission && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                <span>DONE REVIEWING</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
