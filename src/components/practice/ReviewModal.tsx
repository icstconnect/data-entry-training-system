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
  HelpCircle,
  FileSpreadsheet,
  GraduationCap,
  Zap,
  Save
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
  onApplyCorrections?: (
    updatedFormValues: Record<string, any>,
    updatedTableRows?: Record<string, any>[],
    updatedMarksheetValues?: Record<string, any>
  ) => void;
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
  onConfirmAdvance,
  onApplyCorrections
}) => {
  const [filter, setFilter] = useState<'all' | 'mistakes' | 'correct'>('all');
  const [activeAuditTab, setActiveAuditTab] = useState<'why_down' | 'what_good'>('why_down');

  // Local editable copies of data for direct viewing corrections
  const [localFormValues, setLocalFormValues] = useState<Record<string, any>>(() => ({ ...formValues }));
  const [localTableRows, setLocalTableRows] = useState<Record<string, any>[]>(() => 
    tableRows ? JSON.parse(JSON.stringify(tableRows)) : []
  );
  const [localMarksheetValues, setLocalMarksheetValues] = useState<Record<string, any>>(() => 
    marksheetValues ? JSON.parse(JSON.stringify(marksheetValues)) : {}
  );
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  // Dynamically evaluate form fields based on local state
  const fieldResults: FieldValidationResult[] = useMemo(() => {
    return stage.fields.map(f => validateField(sourceRecord, localFormValues, f));
  }, [stage, sourceRecord, localFormValues]);

  // Dynamically evaluate spreadsheet table rows
  const tableCellResults: CellValidationResult[] = useMemo(() => {
    if (!stage.tableSchema) return [];
    return validateTableRows(sourceRecord.tableRows, localTableRows, stage.tableSchema.columns);
  }, [stage, sourceRecord, localTableRows]);

  // Dynamically evaluate marksheet table
  const marksheetCellResults: CellValidationResult[] = useMemo(() => {
    if (!stage.marksheetSchema) return [];
    return validateMarksheet(sourceRecord, localMarksheetValues || {}, stage.marksheetSchema);
  }, [stage, sourceRecord, localMarksheetValues]);

  // Aggregate accuracy metrics live
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
  const penaltyPerUnit = totalUnits > 0 ? (100 / totalUnits).toFixed(1) : '0';

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

  // Helper to format displayed values
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

  // Direct In-Place Correction Handlers
  const handleInlineChange = (fieldId: string, val: string) => {
    setLocalFormValues(prev => ({
      ...prev,
      [fieldId]: val
    }));
  };

  const handleFixField = (fieldId: string, expectedVal: any) => {
    setLocalFormValues(prev => ({
      ...prev,
      [fieldId]: expectedVal
    }));
  };

  const handleFixTableCell = (rowIndex: number, colId: string, expectedVal: any) => {
    setLocalTableRows(prev => {
      const copy = [...prev];
      if (!copy[rowIndex]) copy[rowIndex] = {};
      copy[rowIndex][colId] = expectedVal;
      return copy;
    });
  };

  const handleFixMarksheetCell = (subjectCode: string, colId: string, expectedVal: any) => {
    setLocalMarksheetValues(prev => {
      const copy = { ...prev };
      if (!copy[subjectCode]) copy[subjectCode] = {};
      copy[subjectCode][colId] = expectedVal;
      return copy;
    });
  };

  // Fix All Mistakes directly
  const handleFixAllMistakes = () => {
    const newForm = { ...localFormValues };
    fieldResults.forEach(fr => {
      if (fr.status !== 'correct' && fr.sourceValue !== undefined) {
        newForm[fr.fieldId] = fr.sourceValue;
      }
    });
    setLocalFormValues(newForm);

    if (stage.tableSchema && stage.tableSchema.columns) {
      const newTable = localTableRows.length > 0 ? [...localTableRows] : [];
      tableCellResults.forEach(cr => {
        if (cr.status !== 'correct') {
          const rowIdx = Number(cr.rowId) - 1;
          if (rowIdx >= 0) {
            if (!newTable[rowIdx]) newTable[rowIdx] = {};
            newTable[rowIdx][cr.columnId] = cr.sourceValue;
          }
        }
      });
      setLocalTableRows(newTable);
    }

    if (stage.marksheetSchema) {
      const newMarksheet = { ...localMarksheetValues };
      marksheetCellResults.forEach(mr => {
        if (mr.status !== 'correct') {
          const code = String(mr.rowId);
          if (!newMarksheet[code]) newMarksheet[code] = {};
          newMarksheet[code][mr.columnId] = mr.sourceValue;
        }
      });
      setLocalMarksheetValues(newMarksheet);
    }
  };

  const handleSaveAndApply = () => {
    if (onApplyCorrections) {
      onApplyCorrections(localFormValues, localTableRows, localMarksheetValues);
    }
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
      onClose();
    }, 400);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card review-modal-card" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '900px', width: '96vw', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className="review-modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
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
                <span>EXACT FORM AUDIT & DIRECT CORRECTION • LEVEL {stage.levelNumber} - STAGE {stage.stageNumber}</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--icst-charcoal)', margin: 0 }}>
                {stage.title}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {stage.subtitle} • Target Accuracy: <strong>{stage.requiredAccuracy}%</strong>
              </div>
            </div>

            {/* Live Accuracy Score Pill & Quick Fix All */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {mistakesTotal > 0 && (
                <button
                  type="button"
                  onClick={handleFixAllMistakes}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
                  }}
                  title="Directly correct all remaining mistakes to match the source file 100%"
                >
                  <Zap size={14} />
                  <span>⚡ Fix All Mistakes (100%)</span>
                </button>
              )}

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
          </div>

          {/* Quick Metrics Bar & Filter Controls */}
          <div className="review-stat-strip" style={{ justifyContent: 'space-between', marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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

        {/* Modal Body */}
        <div className="modal-body" style={{ overflowY: 'auto', padding: '16px 20px', background: '#f8fafc', flex: 1 }}>
          
          {/* Forensic Audit Deduction & Good Breakdown Banner */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f1f5f9' }}>
              <button
                type="button"
                onClick={() => setActiveAuditTab('why_down')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  borderBottom: activeAuditTab === 'why_down' ? '2.5px solid #b91c1c' : 'none',
                  background: activeAuditTab === 'why_down' ? '#ffffff' : 'transparent',
                  color: activeAuditTab === 'why_down' ? '#991b1b' : '#64748b',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <XCircle size={13} color="#b91c1c" />
                <span>Why % is Down (-{(100 - accuracyPercentage).toFixed(1)}%)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAuditTab('what_good')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  borderBottom: activeAuditTab === 'what_good' ? '2.5px solid #16a34a' : 'none',
                  background: activeAuditTab === 'what_good' ? '#ffffff' : 'transparent',
                  color: activeAuditTab === 'what_good' ? '#15803d' : '#64748b',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={13} color="#16a34a" />
                <span>What is Good (+{accuracyPercentage}%)</span>
              </button>
            </div>

            <div style={{ padding: '12px 14px' }}>
              {activeAuditTab === 'why_down' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                      Base Standard: 100.0%
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#b91c1c' }}>
                      Deduction: -{(100 - accuracyPercentage).toFixed(1)}% (each unit penalty: ~{penaltyPerUnit}%)
                    </span>
                  </div>

                  {mistakesTotal === 0 ? (
                    <div style={{ textAlign: 'center', padding: '10px', color: '#15803d', fontWeight: 700, fontSize: '12px' }}>
                      🎉 Zero Deductions! All fields match the source file with 100% accuracy.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {fieldResults.filter(f => f.status !== 'correct').map(f => (
                        <div key={f.fieldId} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#fff',
                          border: '1px solid #fee2e2',
                          borderRadius: '4px',
                          padding: '6px 10px',
                          fontSize: '11.5px'
                        }}>
                          <div>
                            <span style={{ fontWeight: 800, color: '#b91c1c' }}>-{penaltyPerUnit}%</span>
                            <strong style={{ marginLeft: '6px', color: '#1e293b' }}>{f.label}:</strong>
                            <span style={{ color: '#64748b', marginLeft: '4px' }}>
                              {f.status === 'missing' ? 'Left blank / unentered' : f.errorMessage || 'Value mismatch'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFixField(f.fieldId, f.sourceValue)}
                            style={{
                              background: '#16a34a',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '2px 8px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            <Zap size={11} />
                            <span>Fix</span>
                          </button>
                        </div>
                      ))}

                      {tableCellResults.filter(c => c.status !== 'correct').map((c, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#fff',
                          border: '1px solid #fee2e2',
                          borderRadius: '4px',
                          padding: '6px 10px',
                          fontSize: '11.5px'
                        }}>
                          <div>
                            <span style={{ fontWeight: 800, color: '#b91c1c' }}>-{penaltyPerUnit}%</span>
                            <strong style={{ marginLeft: '6px', color: '#1e293b' }}>Row {c.rowId} ({c.columnLabel}):</strong>
                            <span style={{ color: '#64748b', marginLeft: '4px' }}>{c.errorMessage}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFixTableCell(Number(c.rowId) - 1, c.columnId, c.sourceValue)}
                            style={{
                              background: '#16a34a',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '2px 8px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            ⚡ Fix
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                      Accredited Accuracy: +{accuracyPercentage}%
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#15803d' }}>
                      {correctUnits} of {totalUnits} Units Perfectly Matched
                    </span>
                  </div>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '6px 10px', fontSize: '11.5px', color: '#15803d' }}>
                    ✓ <strong>{correctUnits} Fields and Cells</strong> verified with zero typos, correct spelling, and precise numerical values.
                  </div>
                  {fieldResults.filter(f => f.status === 'correct').slice(0, 4).map(f => (
                    <div key={f.fieldId} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', color: '#15803d' }}>
                      ✓ <strong>{f.label}:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>{String(f.sourceValue)}</span>
                    </div>
                  ))}
                  {fieldResults.filter(f => f.status === 'correct').length > 4 && (
                    <div style={{ fontSize: '10.5px', color: '#64748b', textAlign: 'center' }}>
                      + {fieldResults.filter(f => f.status === 'correct').length - 4} more fields matched 100% perfectly.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Form Fields Sections */}
          {sections.map(sec => {
            const visibleItems = sec.items.filter(({ result }) => {
              if (filter === 'mistakes') return result.status !== 'correct';
              if (filter === 'correct') return result.status === 'correct';
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={sec.name} style={{ marginBottom: '22px' }}>
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
                  justifyContent: 'space-between'
                }}>
                  <span>{sec.name}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {visibleItems.length} field{visibleItems.length === 1 ? '' : 's'}
                  </span>
                </div>

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

                        <div className="review-comparison-box">
                          {isCorrect ? (
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
                            <>
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

                              {result.errorMessage && (
                                <div className="review-explanation-callout">
                                  <HelpCircle size={13} style={{ flexShrink: 0, marginTop: '1px' }} />
                                  <span><strong>Explanation:</strong> {result.errorMessage}</span>
                                </div>
                              )}

                              {/* DIRECT IN-PLACE CORRECTION WIDGET */}
                              <div style={{
                                marginTop: '8px',
                                padding: '8px 10px',
                                background: '#ffffff',
                                border: '1px solid #fed7aa',
                                borderRadius: 'var(--radius-sm)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#c2410c' }}>
                                    ✏️ Directly Correct Entry:
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleFixField(field.id, result.sourceValue)}
                                    style={{
                                      background: 'linear-gradient(135deg, #16a34a, #15803d)',
                                      color: '#ffffff',
                                      border: 'none',
                                      borderRadius: '4px',
                                      padding: '3px 8px',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    title="Instantly apply the correct expected value"
                                  >
                                    <Zap size={11} />
                                    <span>Apply Expected</span>
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={localFormValues[field.id] !== undefined ? String(localFormValues[field.id]) : ''}
                                  onChange={(e) => handleInlineChange(field.id, e.target.value)}
                                  placeholder={`Type correct ${field.label}...`}
                                  style={{
                                    padding: '6px 10px',
                                    fontSize: '12px',
                                    fontFamily: 'var(--font-mono)',
                                    border: '1px solid var(--border-medium)',
                                    borderRadius: '4px',
                                    width: '100%',
                                    outline: 'none',
                                    background: '#fff'
                                  }}
                                />
                              </div>
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

          {/* Table Rows if present */}
          {stage.tableSchema && localTableRows && localTableRows.length > 0 && (
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
                <span>{stage.tableSchema.tableName} (Tabular Verification & Direct Fix)</span>
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
                    {localTableRows.map((r, rowIndex) => (
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
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px' }}>
                                  <div style={{ color: '#b91c1c', textDecoration: usrVal ? 'line-through' : 'none', fontWeight: 600 }}>
                                    ❌ {usrVal ? String(usrVal) : <span style={{ fontStyle: 'italic' }}>[empty]</span>}
                                  </div>
                                  <div style={{ color: '#15803d', fontWeight: 800 }}>
                                    ✅ {String(cellRes?.sourceValue ?? '')}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleFixTableCell(rowIndex, col.id, cellRes?.sourceValue)}
                                    style={{
                                      alignSelf: 'flex-start',
                                      background: '#16a34a',
                                      color: '#fff',
                                      border: 'none',
                                      borderRadius: '3px',
                                      padding: '2px 6px',
                                      fontSize: '10px',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      marginTop: '2px'
                                    }}
                                  >
                                    ⚡ Fix Cell
                                  </button>
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

          {/* Marksheet if present */}
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
                <span>Marksheet Entries ({stage.marksheetSchema.boardType} Verification & Direct Fix)</span>
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
                      const entry = localMarksheetValues?.[s.code] || {};
                      const theoryRes = marksheetCellResults.find(c => c.rowId === s.code && c.columnId === 'theory');
                      const oralRes = marksheetCellResults.find(c => c.rowId === s.code && c.columnId === 'oral');
                      const totalRes = marksheetCellResults.find(c => c.rowId === s.code && c.columnId === 'total');
                      const gradeRes = marksheetCellResults.find(c => c.rowId === s.code && c.columnId === 'grade');

                      const renderMarkCell = (val: any, res: CellValidationResult | undefined, colKey: string) => {
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
                            <button
                              type="button"
                              onClick={() => handleFixMarksheetCell(s.code, colKey, res.sourceValue)}
                              style={{
                                alignSelf: 'flex-start',
                                background: '#16a34a',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '3px',
                                padding: '2px 5px',
                                fontSize: '10px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                marginTop: '2px'
                              }}
                            >
                              ⚡ Fix
                            </button>
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
                                {renderMarkCell(entry.theory, theoryRes, 'theory')}
                              </td>
                              <td 
                                className={oralRes && oralRes.status !== 'correct' ? 'review-table-cell-incorrect' : oralRes?.status === 'correct' ? 'review-table-cell-correct' : ''}
                                style={{ textAlign: 'center' }}
                              >
                                {renderMarkCell(entry.oral, oralRes, 'oral')}
                              </td>
                            </>
                          )}
                          <td 
                            className={totalRes && totalRes.status !== 'correct' ? 'review-table-cell-incorrect' : totalRes?.status === 'correct' ? 'review-table-cell-correct' : ''}
                            style={{ textAlign: 'center' }}
                          >
                            {renderMarkCell(entry.total, totalRes, 'total')}
                          </td>
                          {stage.marksheetSchema?.hasGrades && (
                            <td 
                              className={gradeRes && gradeRes.status !== 'correct' ? 'review-table-cell-incorrect' : gradeRes?.status === 'correct' ? 'review-table-cell-correct' : ''}
                              style={{ textAlign: 'center', fontWeight: 700 }}
                            >
                              {renderMarkCell(entry.grade, gradeRes, 'grade')}
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
        <div className="modal-footer" style={{ padding: '14px 20px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            <ArrowLeft size={14} />
            <span>{isPostSubmission ? 'CLOSE AUDIT' : 'BACK TO EDIT FORM'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {saveSuccessNotice && (
              <span style={{ fontSize: '12px', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={14} /> Corrections Saved!
              </span>
            )}

            {/* Direct Save & Apply Corrections Button */}
            {onApplyCorrections && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveAndApply}
                style={{
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  borderColor: '#166534',
                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Save size={14} />
                <span>SAVE & APPLY CORRECTIONS</span>
              </button>
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
          </div>
        </div>
      </div>
    </div>
  );
};
