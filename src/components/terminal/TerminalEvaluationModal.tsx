import React, { useState } from 'react';
import { TerminalEvaluationSummary, TerminalScenario } from '../../types/terminal';
import { 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  RotateCcw, 
  Share2, 
  ArrowRight, 
  ShieldAlert, 
  Zap, 
  Clock, 
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TerminalEvaluationModalProps {
  summary: TerminalEvaluationSummary;
  scenario: TerminalScenario;
  onClose: () => void;
  onRetry: () => void;
  onNextLevel?: () => void;
  onShare: (summary: TerminalEvaluationSummary) => void;
  onApplyCorrections?: (
    correctedEntries: Record<string, Record<string, string>>,
    correctedFlags: Record<string, 'clean' | 'discrepant'>
  ) => void;
}

export const TerminalEvaluationModal: React.FC<TerminalEvaluationModalProps> = ({
  summary,
  scenario,
  onClose,
  onRetry,
  onNextLevel,
  onShare,
  onApplyCorrections
}) => {
  const [activeAuditTab, setActiveAuditTab] = useState<'why_down' | 'what_good'>('why_down');

  React.useEffect(() => {
    if (summary.passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [summary.passed]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAutoCorrect = () => {
    if (!onApplyCorrections) return;
    const correctEntries: Record<string, Record<string, string>> = {};
    const correctFlags: Record<string, 'clean' | 'discrepant'> = {};

    scenario.vouchers.forEach(v => {
      correctEntries[v.voucherId] = {};
      scenario.fields.forEach(f => {
        correctEntries[v.voucherId][f.id] = String(v.expectedValues[f.id] || '');
      });
      correctFlags[v.voucherId] = v.trapConfig.expectedFlag;
    });

    onApplyCorrections(correctEntries, correctFlags);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }}>
      <div className="modal-card" style={{ maxWidth: '680px', width: '95vw', maxHeight: '92vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', background: '#0d1522', color: '#f1f5f9', border: '1px solid #1e3a5f' }}>
        {/* Header */}
        <div style={{
          background: summary.passed
            ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
            : 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {summary.passed ? <Trophy size={24} color="#fde047" /> : <XCircle size={24} color="#fca5a5" />}
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                {summary.passed ? 'Batch Dispatch Cleared!' : 'Batch Verification Incomplete'}
              </h2>
              <span style={{ fontSize: '12px', opacity: 0.9 }}>
                {summary.scenarioTitle} • Level {summary.levelNumber}
              </span>
            </div>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 800,
            color: summary.passed ? '#a7f3d0' : '#fecaca'
          }}>
            Score: {summary.netScorePercent}%
          </div>
        </div>

        {/* Telemetry Stat Cards */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '16px'
          }}>
            {/* Speed KPH */}
            <div style={{ background: '#090e17', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#38bdf8', fontSize: '11px', fontWeight: 700 }}>
                <Zap size={12} />
                <span>SPEED</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                {summary.calculatedKPH.toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>KPH</div>
            </div>

            {/* Field Accuracy */}
            <div style={{ background: '#090e17', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#10b981', fontSize: '11px', fontWeight: 700 }}>
                <CheckCircle2 size={12} />
                <span>ACCURACY</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                {summary.fieldAccuracyPercent}%
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Target: {scenario.targetAccuracy}%</div>
            </div>

            {/* Forensic Trap Detection */}
            <div style={{ background: '#090e17', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#f59e0b', fontSize: '11px', fontWeight: 700 }}>
                <ShieldAlert size={12} />
                <span>AUDIT TRAPS</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                {summary.trapAccuracyPercent}%
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Detected</div>
            </div>

            {/* Max Streak */}
            <div style={{ background: '#090e17', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#ec4899', fontSize: '11px', fontWeight: 700 }}>
                <Flame size={12} />
                <span>STREAK</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#ec4899', marginTop: '2px' }}>
                {summary.maxStreak}x
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Combo</div>
            </div>
          </div>

          {/* Forensic Audit Tab (Why % is Down vs What is Good) */}
          <div style={{
            background: '#070c14',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            marginBottom: '16px',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #1e293b', background: '#0a101b' }}>
              <button
                type="button"
                onClick={() => setActiveAuditTab('why_down')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  borderBottom: activeAuditTab === 'why_down' ? '2px solid #ef4444' : 'none',
                  background: activeAuditTab === 'why_down' ? '#0d1522' : 'transparent',
                  color: activeAuditTab === 'why_down' ? '#fca5a5' : '#64748b',
                  fontWeight: 700,
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <XCircle size={13} color="#ef4444" />
                <span>Why Score is Down (-{(100 - summary.netScorePercent).toFixed(1)}%)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveAuditTab('what_good')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  borderBottom: activeAuditTab === 'what_good' ? '2px solid #10b981' : 'none',
                  background: activeAuditTab === 'what_good' ? '#0d1522' : 'transparent',
                  color: activeAuditTab === 'what_good' ? '#86efac' : '#64748b',
                  fontWeight: 700,
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={13} color="#10b981" />
                <span>What is Good (+{summary.netScorePercent}%)</span>
              </button>
            </div>

            <div style={{ padding: '12px 14px', fontSize: '11.5px' }}>
              {activeAuditTab === 'why_down' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#94a3b8' }}>
                    <span>Standard Benchmark: 100%</span>
                    <strong style={{ color: '#ef4444' }}>Deductions: -{(100 - summary.netScorePercent).toFixed(1)}%</strong>
                  </div>
                  {summary.passed && summary.netScorePercent === 100 ? (
                    <div style={{ color: '#10b981', fontWeight: 700, textAlign: 'center', padding: '6px' }}>
                      ✓ Zero Deductions! All vouchers and traps dispatched with 100% accuracy.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#fca5a5' }}>
                      {summary.fieldAccuracyPercent < 100 && (
                        <div>• Field character typos & mismatches lowered raw accuracy to {summary.fieldAccuracyPercent}%.</div>
                      )}
                      {summary.trapAccuracyPercent < 100 && (
                        <div>• Missed forensic trap voucher verification ({summary.trapAccuracyPercent}% detected).</div>
                      )}
                      {onApplyCorrections && (
                        <div style={{ marginTop: '4px', color: '#38bdf8', fontWeight: 700 }}>
                          Click "⚡ Auto-Correct All Discrepancies" below to instantly fix all entries to 100%!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#10b981' }}>
                  <div>✓ Keystroke speed reached <strong>{summary.calculatedKPH.toLocaleString()} KPH</strong>.</div>
                  <div>✓ High combo streak of <strong>{summary.maxStreak}x</strong> continuous clean entries.</div>
                  <div>✓ Net WPM output: <strong>{summary.netWpm} WPM</strong> with strict verification.</div>
                </div>
              )}
            </div>
          </div>

          {/* Forensic Audit Decisions Breakdown */}
          <div style={{ background: '#070c14', border: '1px solid #1a2536', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Voucher Discrepancy Decisions Breakdown:
              </h4>

              {onApplyCorrections && summary.netScorePercent < 100 && (
                <button
                  type="button"
                  onClick={handleAutoCorrect}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
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
                  <Zap size={12} />
                  <span>⚡ Auto-Correct All Discrepancies</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {summary.decisions.map((dec, idx) => {
                const voucher = scenario.vouchers.find(v => v.voucherId === dec.voucherId);
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#0d1522',
                    border: '1px solid #1e293b',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    fontSize: '11.5px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: '#38bdf8' }}>{dec.voucherId}</span>
                      <span style={{ color: '#64748b' }}>•</span>
                      <span style={{ color: '#cbd5e1' }}>{voucher?.voucherNumber}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '3px',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        background: dec.traineeFlag === 'clean' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: dec.traineeFlag === 'clean' ? '#10b981' : '#fca5a5'
                      }}>
                        Flagged: {dec.traineeFlag.toUpperCase()}
                      </span>

                      {dec.isCorrect ? (
                        <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle2 size={13} />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span style={{ color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <XCircle size={13} />
                          <span>Audit Miss</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unlocked Achievements */}
          {summary.unlockedAchievements && summary.unlockedAchievements.length > 0 && (
            <div style={{
              background: '#1c1608',
              border: '1px solid #ca8a04',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Award size={24} color="#facc15" />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#facc15' }}>
                  New Achievement Unlocked: {summary.unlockedAchievements[0].title}!
                </div>
                <div style={{ fontSize: '11px', color: '#fef08a' }}>
                  {summary.unlockedAchievements[0].description}
                </div>
              </div>
            </div>
          )}

          {/* EXP Award Footer Note */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
            <span>Time Taken: {formatTime(summary.timeTakenSeconds)}</span>
            <span style={{ color: '#fbbf24', fontWeight: 800 }}>+{summary.expEarned} EXP Earned</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{
          padding: '14px 24px',
          background: '#070c14',
          borderTop: '1px solid #1a2536',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            type="button"
            className="terminal-hud-btn"
            onClick={onRetry}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={14} />
            <span>Retry Batch</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="terminal-hud-btn"
              onClick={() => onShare(summary)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Share2 size={14} />
              <span>Share Voucher Certificate</span>
            </button>

            {summary.passed && onNextLevel && scenario.levelNumber < 5 && (
              <button
                type="button"
                className="terminal-card-btn ready"
                onClick={onNextLevel}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', margin: 0 }}
              >
                <span>Next Scenario</span>
                <ArrowRight size={14} />
              </button>
            )}

            <button
              type="button"
              className="terminal-hud-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
