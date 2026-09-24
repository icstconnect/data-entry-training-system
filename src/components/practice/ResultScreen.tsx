import React, { useEffect, useState } from 'react';
import { StageValidationSummary, StageConfig } from '../../types';
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
  ShieldCheck
} from 'lucide-react';
import { playFeedbackSound } from '../../services/storageService';

interface ResultScreenProps {
  summary: StageValidationSummary;
  stage: StageConfig;
  onNextStage?: () => void;
  onRetry: () => void;
  hasNextStage: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  summary,
  stage,
  onNextStage,
  onRetry,
  hasNextStage
}) => {
  const [showDetailedReport, setShowDetailedReport] = useState(false);

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

  return (
    <div style={{
      maxWidth: '720px',
      margin: '24px auto',
      background: '#ffffff',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden'
    }}>
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
          <span>{summary.passed ? 'STAGE COMPLETE' : 'ACCURACY REQUIREMENT NOT MET'}</span>
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
          Level {summary.levelNumber} • Stage {summary.stageNumber}
        </h2>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>
          {stage.title}
        </p>

        {/* Big Accuracy Metric */}
        <div style={{
          marginTop: '20px',
          display: 'inline-block',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(4px)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 28px',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', opacity: 0.85 }}>
            Verified Accuracy
          </div>
          <div style={{ fontSize: '44px', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
            {summary.accuracyPercentage}%
          </div>
          <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '2px' }}>
            Required Target: {summary.requiredAccuracy}%
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Metric Grid */}
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

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Time Elapsed</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', fontFamily: 'var(--font-mono)' }}>
              {formatTime(summary.timeTakenSeconds)}
            </div>
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
                {summary.isGuidedMode ? 'Guided Practice Mode Active' : 'EXP Earned'}
              </div>
              <div style={{ fontSize: '11px', color: summary.isGuidedMode ? '#64748b' : '#b45309' }}>
                {summary.isGuidedMode ? 'No EXP is awarded during Guided Mode sessions.' : 'Added to your permanent student record.'}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 700, marginBottom: '6px' }}>
              <Trophy size={18} />
              <span>NEW ACHIEVEMENT UNLOCKED!</span>
            </div>
            {summary.unlockedAchievements.map(ach => (
              <div key={ach.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#166534', marginTop: '4px' }}>
                <Award size={15} />
                <strong>{ach.title}</strong> — {ach.description}
              </div>
            ))}
          </div>
        )}

        {/* Detailed Error Report Toggle */}
        <div style={{ marginBottom: '24px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'space-between' }}
            onClick={() => setShowDetailedReport(!showDetailedReport)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={15} color="var(--warning-amber)" />
              <span>Detailed Inspection & Error Report</span>
            </div>
            {showDetailedReport ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showDetailedReport && (
            <div style={{
              marginTop: '10px',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              background: '#fbfcfe',
              maxHeight: '260px',
              overflowY: 'auto'
            }}>
              {summary.incorrectUnits === 0 && summary.missingUnits === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px', color: 'var(--success-green)', fontWeight: 600 }}>
                  <ShieldCheck size={28} style={{ margin: '0 auto 6px' }} />
                  Flawless Execution! Every field and marksheet cell matched the source file exactly.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {summary.fieldResults.filter(f => f.status !== 'correct').map(f => (
                    <div key={f.fieldId} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      padding: '6px 10px',
                      background: '#ffffff',
                      border: '1px solid #fee2e2',
                      borderRadius: '4px'
                    }}>
                      <div>
                        <strong>{f.label}:</strong> {f.errorMessage || 'Value mismatch'}
                      </div>
                      <span style={{ color: 'var(--error-red)', fontWeight: 700 }}>
                        {f.status === 'missing' ? 'MISSING' : 'INCORRECT'}
                      </span>
                    </div>
                  ))}

                  {summary.cellResults.filter(c => c.status !== 'correct').map((c, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      padding: '6px 10px',
                      background: '#ffffff',
                      border: '1px solid #fee2e2',
                      borderRadius: '4px'
                    }}>
                      <div>
                        <strong>{c.columnLabel}:</strong> {c.errorMessage}
                      </div>
                      <span style={{ color: 'var(--error-red)', fontWeight: 700 }}>
                        {c.status === 'missing' ? 'EMPTY CELL' : 'WRONG VALUE'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRetry}
          >
            <RotateCcw size={15} />
            <span>Practice Again</span>
          </button>

          {summary.passed && hasNextStage && (
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={onNextStage}
              autoFocus
            >
              <span>NEXT STAGE</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
