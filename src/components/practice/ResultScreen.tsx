import React, { useEffect, useState } from 'react';
import { StageValidationSummary, StageConfig, SourceRecord } from '../../types';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Award,
  ShieldCheck,
  Share2,
  User,
  Eye,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { playFeedbackSound } from '../../services/storageService';
import { AchievementShareModal } from '../common/AchievementShareModal';
import { ReviewModal } from './ReviewModal';

interface ResultScreenProps {
  summary: StageValidationSummary;
  stage: StageConfig;
  sourceRecord?: SourceRecord;
  formValues?: Record<string, any>;
  tableRows?: Record<string, any>[];
  marksheetValues?: Record<string, any>;
  onNextStage?: () => void;
  onRetry: () => void;
  hasNextStage: boolean;
  onApplyCorrections?: (
    updatedFormValues: Record<string, any>,
    updatedTableRows?: Record<string, any>[],
    updatedMarksheetValues?: Record<string, any>
  ) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  summary,
  stage,
  sourceRecord,
  formValues,
  tableRows,
  marksheetValues,
  onNextStage,
  onRetry,
  hasNextStage,
  onApplyCorrections
}) => {
  const [showDetailedReport, setShowDetailedReport] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showMistakesModal, setShowMistakesModal] = useState(false);
  const [activeAuditTab, setActiveAuditTab] = useState<'why_down' | 'what_good'>('why_down');

  const timeLimit = summary.timeLimitSeconds || stage.timeLimitSeconds || 600;
  const isOvertime = summary.timeTakenSeconds > timeLimit;
  const overtimeSeconds = isOvertime ? summary.timeTakenSeconds - timeLimit : 0;
  const totalUnits = summary.totalEvaluatedUnits || (summary.correctUnits + summary.incorrectUnits + summary.missingUnits) || 1;
  const penaltyPerUnit = (100 / totalUnits).toFixed(1);

  useEffect(() => {
    if (summary.passed) {
      playFeedbackSound('level_up');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }
    } else {
      playFeedbackSound('warning');
    }
  }, [summary.passed]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const studentName = summary.studentIdentity?.name || 'Trainee Operator';
  const rollId = summary.studentIdentity?.generatedRollId || 'NYSDB0140-0001';

  // Direct In-Place Correction Handlers from ResultScreen
  const handleFixSingleField = (fieldId: string, expectedVal: any) => {
    if (!onApplyCorrections) return;
    const updatedForm = { ...(formValues || {}), [fieldId]: expectedVal };
    onApplyCorrections(updatedForm, tableRows, marksheetValues);
  };

  const handleCorrectAllDiscrepancies = () => {
    if (!onApplyCorrections || !sourceRecord) return;
    const updatedForm = { ...(formValues || {}) };
    summary.fieldResults.forEach(f => {
      if (f.status !== 'correct' && f.sourceValue !== undefined) {
        updatedForm[f.fieldId] = f.sourceValue;
      }
    });

    let updatedTable = tableRows ? [...tableRows] : undefined;
    if (stage.tableSchema && stage.tableSchema.columns && sourceRecord.tableRows) {
      updatedTable = sourceRecord.tableRows.map(r => ({ ...r }));
    }

    let updatedMarksheet = marksheetValues ? { ...marksheetValues } : undefined;
    if (stage.marksheetSchema && sourceRecord.marksheet) {
      updatedMarksheet = {};
      sourceRecord.marksheet.subjects.forEach(sub => {
        updatedMarksheet![sub.code] = {
          theory: sub.theory,
          practical: sub.practical,
          oral: sub.oral,
          total: sub.total,
          grade: sub.grade
        };
      });
    }

    onApplyCorrections(updatedForm, updatedTable, updatedMarksheet);
  };

  return (
    <div style={{
      maxWidth: '780px',
      margin: '24px auto',
      background: '#ffffff',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden'
    }}>
      {/* Share Modal */}
      {isShareModalOpen && (
        <AchievementShareModal
          summary={summary}
          achievement={summary.unlockedAchievements[0]}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {/* Exact Form Layout Mistakes Modal */}
      {showMistakesModal && sourceRecord && (
        <ReviewModal
          stage={stage}
          sourceRecord={sourceRecord}
          formValues={formValues || {}}
          tableRows={tableRows}
          marksheetValues={marksheetValues}
          isPostSubmission={true}
          onClose={() => setShowMistakesModal(false)}
          onApplyCorrections={onApplyCorrections}
        />
      )}

      {/* Result Hero Header */}
      <div style={{
        background: summary.passed 
          ? 'linear-gradient(135deg, #065f46, #047857)' 
          : 'linear-gradient(135deg, #991b1b, #b91c1c)',
        color: '#ffffff',
        padding: '28px 24px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '10px'
        }}>
          {summary.passed ? <CheckCircle size={14} /> : <XCircle size={14} />}
          <span>{summary.passed ? 'LEVEL ASSESSMENT PASSED' : 'ACCURACY REQUIREMENT NOT MET'}</span>
        </div>

        {/* Student Identity Display */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '4px 14px',
          borderRadius: '16px',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '8px'
        }}>
          <User size={14} />
          <span>{studentName}</span>
          <span style={{ opacity: 0.7 }}>•</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{rollId}</span>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px' }}>
          Level {summary.levelNumber} • Stage {summary.stageNumber}
        </h2>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>
          {stage.title}
        </p>

        {/* Big Accuracy Metric */}
        <div style={{
          marginTop: '16px',
          display: 'inline-block',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(4px)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 28px',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', opacity: 0.85 }}>
            Verified Accuracy
          </div>
          <div style={{ fontSize: '42px', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
            {summary.accuracyPercentage}%
          </div>
          <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '2px' }}>
            Required Target: {summary.requiredAccuracy}%
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Metric Grid with Time Limit + Time Elapsed */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>Correct Units</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#15803d', fontFamily: 'var(--font-mono)' }}>
              {summary.correctUnits}
            </div>
          </div>

          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#991b1b', fontWeight: 600 }}>Incorrect</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#b91c1c', fontFamily: 'var(--font-mono)' }}>
              {summary.incorrectUnits}
            </div>
          </div>

          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>Missing</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#b45309', fontFamily: 'var(--font-mono)' }}>
              {summary.missingUnits}
            </div>
          </div>

          {/* Time Elapsed & Time Limit */}
          <div style={{ background: isOvertime ? '#fff7ed' : '#f8fafc', border: `1px solid ${isOvertime ? '#fed7aa' : '#e2e8f0'}`, padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
              LIMIT: {formatTime(timeLimit)}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: isOvertime ? '#c2410c' : '#1e293b', fontFamily: 'var(--font-mono)' }}>
              {formatTime(summary.timeTakenSeconds)}
            </div>
            {isOvertime ? (
              <div style={{ fontSize: '10px', color: '#ea580c', fontWeight: 700 }}>
                OVER +{formatTime(overtimeSeconds)}
              </div>
            ) : (
              <div style={{ fontSize: '10px', color: '#15803d', fontWeight: 600 }}>
                Within Limit
              </div>
            )}
          </div>
        </div>

        {/* FORENSIC SCORE AUDIT: WHY % IS DOWN VS WHAT IS GOOD */}
        <div style={{
          marginBottom: '20px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f1f5f9' }}>
            <button
              type="button"
              onClick={() => setActiveAuditTab('why_down')}
              style={{
                flex: 1,
                padding: '10px 14px',
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
              <XCircle size={14} color="#b91c1c" />
              <span>Why % is Down (-{(100 - summary.accuracyPercentage).toFixed(1)}%)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAuditTab('what_good')}
              style={{
                flex: 1,
                padding: '10px 14px',
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
              <CheckCircle2 size={14} color="#16a34a" />
              <span>What is Good (+{summary.accuracyPercentage}%)</span>
            </button>
          </div>

          <div style={{ padding: '14px 16px' }}>
            {activeAuditTab === 'why_down' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                    Standard Base: 100.0%
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#b91c1c' }}>
                    Total Deductions: -{(100 - summary.accuracyPercentage).toFixed(1)}% (each unit penalty: ~{penaltyPerUnit}%)
                  </span>
                </div>

                {summary.incorrectUnits === 0 && summary.missingUnits === 0 ? (
                  <div style={{ textAlign: 'center', padding: '12px', color: '#15803d', fontWeight: 700, fontSize: '12px' }}>
                    🎉 Zero Deductions! 100% Flawless Entry achieved across all fields.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {summary.fieldResults.filter(f => f.status !== 'correct').map(f => (
                      <div key={f.fieldId} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#ffffff',
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
                        {onApplyCorrections && (
                          <button
                            type="button"
                            onClick={() => handleFixSingleField(f.fieldId, f.sourceValue)}
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
                        )}
                      </div>
                    ))}

                    {summary.cellResults.filter(c => c.status !== 'correct').map((c, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#ffffff',
                        border: '1px solid #fee2e2',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        fontSize: '11.5px'
                      }}>
                        <div>
                          <span style={{ fontWeight: 800, color: '#b91c1c' }}>-{penaltyPerUnit}%</span>
                          <strong style={{ marginLeft: '6px', color: '#1e293b' }}>{c.columnLabel}:</strong>
                          <span style={{ color: '#64748b', marginLeft: '4px' }}>{c.errorMessage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                    Accredited Accuracy: +{summary.accuracyPercentage}%
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#15803d' }}>
                    {summary.correctUnits} of {totalUnits} Units Perfectly Matched
                  </span>
                </div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '6px 10px', fontSize: '11.5px', color: '#15803d' }}>
                  ✓ <strong>{summary.correctUnits} Fields and Cells</strong> verified with zero typos, correct spelling, and precise numerical values.
                </div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '6px 10px', fontSize: '11.5px', color: '#15803d' }}>
                  ✓ Completed in <strong>{formatTime(summary.timeTakenSeconds)}</strong> (within benchmark limit).
                </div>
                {summary.fieldResults.filter(f => f.status === 'correct').slice(0, 4).map(f => (
                  <div key={f.fieldId} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', color: '#15803d' }}>
                    ✓ <strong>{f.label}:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>{String(f.sourceValue)}</span>
                  </div>
                ))}
                {summary.fieldResults.filter(f => f.status === 'correct').length > 4 && (
                  <div style={{ fontSize: '10.5px', color: '#64748b', textAlign: 'center' }}>
                    + {summary.fieldResults.filter(f => f.status === 'correct').length - 4} more fields matched 100% perfectly.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* EXP Reward Highlight */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: summary.isGuidedMode ? '#f1f5f9' : '#fef3c7',
          border: `1px solid ${summary.isGuidedMode ? '#cbd5e1' : '#fde68a'}`,
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color={summary.isGuidedMode ? '#64748b' : '#b45309'} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: summary.isGuidedMode ? '#475569' : '#92400e' }}>
                {summary.isGuidedMode ? 'Guided Practice Session' : 'Experience Points (EXP)'}
              </div>
              <div style={{ fontSize: '11px', color: summary.isGuidedMode ? '#64748b' : '#b45309' }}>
                {summary.isGuidedMode ? 'Guided Mode awards 0 EXP. Turn Guided OFF for certification.' : `Accredited to trainee: ${studentName} (${rollId})`}
              </div>
            </div>
          </div>
          <div style={{
            fontSize: '22px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: summary.isGuidedMode ? '#64748b' : '#92400e'
          }}>
            +{summary.expEarned} EXP
          </div>
        </div>

        {/* Achievements / Batch Unlocked Card */}
        {summary.unlockedAchievements.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            border: '1px solid #86efac',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 800 }}>
                <Trophy size={18} />
                <span>NEW ACHIEVEMENT UNLOCKED!</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsShareModalOpen(true)}
                  style={{ background: '#ffffff', borderColor: '#86efac', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Eye size={13} />
                  <span>View Achievement</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsShareModalOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#16a34a', borderColor: '#15803d' }}
                >
                  <Share2 size={13} />
                  <span>Share Achievement</span>
                </button>
              </div>
            </div>
            {summary.unlockedAchievements.map(ach => (
              <div key={ach.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#166534', marginTop: '4px' }}>
                <Award size={15} />
                <strong>{ach.title}</strong> — {ach.description}
              </div>
            ))}
          </div>
        )}

        {/* Prominent Callout to Inspect & Directly Correct in Exact Form Layout */}
        {sourceRecord && (
          <div style={{ marginBottom: '20px' }}>
            <button
              type="button"
              id="btn-show-mistakes-modal"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '15px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
              onClick={() => setShowMistakesModal(true)}
            >
              <Eye size={18} />
              <span>SHOW MISTAKES & DIRECTLY CORRECT IN EXACT FORM</span>
              <span style={{
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '3px 9px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.4px'
              }}>
                {summary.incorrectUnits + summary.missingUnits} MISTAKES
              </span>
            </button>
            <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>
              Inspect and directly correct wrong or missing entries with 1-click in the exact form design
            </div>
          </div>
        )}

        {/* Detailed Error Report with Direct Correction Buttons */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1, justifyContent: 'space-between' }}
              onClick={() => setShowDetailedReport(!showDetailedReport)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={15} color="var(--warning-amber)" />
                <span>Field-by-Field Inspection & Direct Correction</span>
              </div>
              {showDetailedReport ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {showDetailedReport && (
            <div style={{
              marginTop: '10px',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              background: '#fbfcfe',
              maxHeight: '340px',
              overflowY: 'auto'
            }}>
              {summary.incorrectUnits === 0 && summary.missingUnits === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px', color: 'var(--success-green)', fontWeight: 600 }}>
                  <ShieldCheck size={28} style={{ margin: '0 auto 6px' }} />
                  Flawless Execution! Every field and marksheet cell matched the source file exactly.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Auto-Correct All Discrepancies Action Bar */}
                  {onApplyCorrections && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af' }}>
                        ⚡ Direct Correction Mode Available
                      </span>
                      <button
                        type="button"
                        onClick={handleCorrectAllDiscrepancies}
                        style={{
                          background: 'linear-gradient(135deg, #16a34a, #15803d)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)'
                        }}
                      >
                        <Zap size={13} />
                        <span>Auto-Correct All to 100% & Re-Verify</span>
                      </button>
                    </div>
                  )}

                  {summary.fieldResults.filter(f => f.status !== 'correct').map(f => (
                    <div key={f.fieldId} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      fontSize: '12px',
                      padding: '10px 12px',
                      background: '#ffffff',
                      border: '1px solid #fee2e2',
                      borderRadius: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <strong>{f.label}:</strong> <span style={{ color: 'var(--error-red)', marginLeft: '4px' }}>{f.errorMessage || 'Value mismatch'}</span>
                        </div>
                        <span style={{ color: 'var(--error-red)', fontWeight: 700, fontSize: '11px' }}>
                          {f.status === 'missing' ? 'MISSING' : (f.errorType === 'spelling_mistake' ? 'SPELLING MISTAKE' : (f.errorType === 'missing_word' ? 'MISSING WORD' : 'INCORRECT'))}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '14px', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                          <span style={{ color: '#991b1b' }}>Entered: <strong>{String(f.enteredValue || '(blank)')}</strong></span>
                          <span style={{ color: '#15803d' }}>Expected: <strong>{String(f.sourceValue)}</strong></span>
                        </div>
                        {onApplyCorrections && (
                          <button
                            type="button"
                            onClick={() => handleFixSingleField(f.fieldId, f.sourceValue)}
                            style={{
                              background: '#16a34a',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 10px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Zap size={11} />
                            <span>Fix to "{String(f.sourceValue)}"</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {summary.cellResults.filter(c => c.status !== 'correct').map((c, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      fontSize: '12px',
                      padding: '8px 10px',
                      background: '#ffffff',
                      border: '1px solid #fee2e2',
                      borderRadius: '4px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <strong>{c.columnLabel}:</strong> <span style={{ color: 'var(--error-red)', marginLeft: '4px' }}>{c.errorMessage}</span>
                        </div>
                        <span style={{ color: 'var(--error-red)', fontWeight: 700, fontSize: '11px' }}>
                          {c.status === 'missing' ? 'EMPTY CELL' : 'INCORRECT CELL'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '14px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        <span>Entered: <strong style={{ color: '#991b1b' }}>{String(c.enteredValue || '(empty)')}</strong></span>
                        <span>Expected: <strong style={{ color: '#15803d' }}>{String(c.sourceValue)}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {sourceRecord && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowMistakesModal(true)}
              style={{ borderColor: 'var(--icst-blue-primary)', color: 'var(--icst-blue-dark)', fontWeight: 600 }}
            >
              <Eye size={14} />
              <span>Review & Direct Correct</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRetry}
            style={{ fontWeight: 600 }}
          >
            <RotateCcw size={14} />
            <span>Retry Stage</span>
          </button>

          {summary.passed && hasNextStage && onNextStage && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onNextStage}
              style={{ fontWeight: 700 }}
            >
              <span>Next Stage</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
