import React, { useState } from 'react';
import { ExcelEvaluationSummary, ExcelScenarioLevel, ExcelDiscrepancy } from '../../types/excel';
import { TrophyGraphic } from '../common/TrophyGraphic';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Share2, 
  X,
  Filter
} from 'lucide-react';

interface ExcelEvaluationModalProps {
  summary: ExcelEvaluationSummary;
  level: ExcelScenarioLevel;
  onClose: () => void;
  onNextLevel?: () => void;
  onRetry: () => void;
  onShare: (summary: ExcelEvaluationSummary) => void;
  onApplyCorrections?: (corrections: Record<string, string>) => void;
}

export const ExcelEvaluationModal: React.FC<ExcelEvaluationModalProps> = ({
  summary,
  level,
  onClose,
  onNextLevel,
  onRetry,
  onShare,
  onApplyCorrections
}) => {
  const [filterMode, setFilterMode] = useState<'discrepancies' | 'all'>('discrepancies');
  const [activeAuditTab, setActiveAuditTab] = useState<'why_down' | 'what_good'>('why_down');

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const filteredDiscrepancies = filterMode === 'discrepancies'
    ? summary.discrepancies.filter(d => d.status !== 'correct')
    : summary.discrepancies;

  const totalCells = summary.totalCells || 1;
  const penaltyPerCell = (100 / totalCells).toFixed(2);

  const handleFixSingleCell = (d: ExcelDiscrepancy) => {
    if (!onApplyCorrections) return;
    const cellKey = `${d.colLetter}${d.row}`;
    onApplyCorrections({
      [cellKey]: String(d.sourceVal)
    });
  };

  const handleCorrectAllCells = () => {
    if (!onApplyCorrections) return;
    const patch: Record<string, string> = {};
    summary.discrepancies.forEach(d => {
      const cellKey = `${d.colLetter}${d.row}`;
      patch[cellKey] = String(d.sourceVal);
    });
    onApplyCorrections(patch);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }}>
      <div className="modal-card" style={{ maxWidth: '820px', width: '95vw', maxHeight: '92vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
        
        {/* Header Hero Banner */}
        <div style={{
          background: summary.passed 
            ? 'linear-gradient(135deg, #107c41 0%, #0b5a2e 100%)' 
            : 'linear-gradient(135deg, #c53929 0%, #8b1e12 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '20px 24px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.2)', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
              {summary.passed ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
              {summary.passed ? 'Batch Dispatched & Verified' : 'Accuracy Requirement Not Met'}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0' }}>
              Level {level.levelNumber}: {level.scenarioName}
            </h2>
            <div style={{ fontSize: '13px', opacity: 0.9 }}>
              {summary.passed 
                ? `Achieved ${summary.accuracyPercentage}% accuracy, meeting the required ${summary.requiredAccuracy}% benchmark.` 
                : `Achieved ${summary.accuracyPercentage}% accuracy (Target: ${summary.requiredAccuracy}%). Review discrepancies and correct directly below.`}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.85, fontWeight: 600 }}>Cell Accuracy</div>
            <div style={{ fontSize: '38px', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
              {summary.accuracyPercentage}%
            </div>
            <div style={{ fontSize: '11px', opacity: 0.85 }}>Required: {summary.requiredAccuracy}%</div>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '18px' }}>
          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Cells Verified</div>
            <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)' }}>
              <span style={{ color: '#15803d' }}>{summary.correctCells}</span> / {summary.totalCells}
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Time Taken</div>
            <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Clock size={15} color="var(--icst-blue)" />
              {formatTime(summary.timeTakenSeconds)}
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Data Speed</div>
            <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Zap size={15} color="#d97706" />
              {summary.kph} <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>KPH</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>EXP Earned</div>
            <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Sparkles size={15} color="#15803d" />
              +{summary.expEarned}
            </div>
          </div>
        </div>

        {/* Forensic Score Breakdown (Why % is Down & What is Good) */}
        <div style={{
          marginBottom: '18px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden'
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
              <span>Why % is Down (-{(100 - summary.accuracyPercentage).toFixed(1)}%)</span>
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
              <span>What is Good (+{summary.accuracyPercentage}%)</span>
            </button>
          </div>

          <div style={{ padding: '10px 14px', fontSize: '11.5px' }}>
            {activeAuditTab === 'why_down' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#64748b' }}>
                  <span>Base Score: 100%</span>
                  <strong style={{ color: '#b91c1c' }}>Each cell penalty: ~{penaltyPerCell}%</strong>
                </div>
                {summary.discrepancies.length === 0 ? (
                  <div style={{ color: '#15803d', fontWeight: 700, textAlign: 'center', padding: '6px' }}>
                    ✓ Flawless Workbook! Zero cell penalties incurred.
                  </div>
                ) : (
                  <div style={{ color: '#991b1b', lineHeight: 1.5 }}>
                    <strong>{summary.discrepancies.length} Cells</strong> had discrepancies (unentered or mismatched values), each deducting ~{penaltyPerCell}% from your score.
                    {onApplyCorrections && (
                      <span style={{ marginLeft: '6px', color: '#1e40af', fontWeight: 700 }}>
                        Click "⚡ Fix Cell" below or "Auto-Correct All" to restore 100% score!
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#15803d' }}>
                <div>✓ <strong>{summary.correctCells} of {summary.totalCells} cells</strong> matched the source register with 100% precision.</div>
                <div>✓ Data Entry Speed: <strong>{summary.kph} KPH</strong> ({summary.kph > 8000 ? 'Industrial Benchmark Exceeded' : 'Good steady rhythm'}).</div>
                <div>✓ Completed within <strong>{formatTime(summary.timeTakenSeconds)}</strong>.</div>
              </div>
            )}
          </div>
        </div>

        {/* Newly Unlocked Achievements Showcase */}
        {summary.unlockedAchievements.length > 0 && (
          <div style={{ 
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', 
            border: '1px solid #fcd34d', 
            borderRadius: 'var(--radius-md)', 
            padding: '12px 14px', 
            marginBottom: '16px' 
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
              🎉 Newly Unlocked Excel Achievement!
            </div>
            {summary.unlockedAchievements.map(ach => (
              <div key={ach.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TrophyGraphic achievementId={ach.id} isUnlocked={true} size={40} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#78350f' }}>{ach.title}</div>
                    <div style={{ fontSize: '11px', color: '#92400e' }}>{ach.description}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ background: '#ffffff', borderColor: '#f59e0b', color: '#78350f', fontWeight: 700, gap: '4px', padding: '4px 10px', fontSize: '11px' }}
                  onClick={() => onShare(summary)}
                >
                  <Share2 size={13} color="#d97706" />
                  Share Certificate
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Discrepancy Breakdown Section with Direct In-Place Corrections */}
        <div style={{ flex: 1, minHeight: '180px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Cell Audit Breakdown</span>
              <span style={{ fontSize: '11px', background: 'var(--bg-subtle)', padding: '1px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                {summary.discrepancies.length} issues detected
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {summary.discrepancies.length > 0 && onApplyCorrections && (
                <button
                  type="button"
                  onClick={handleCorrectAllCells}
                  style={{
                    background: 'linear-gradient(135deg, #107c41, #0b5a2e)',
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
                  title="Directly update all cells to match the source file 100%"
                >
                  <Zap size={12} />
                  <span>⚡ Auto-Correct All Cells</span>
                </button>
              )}

              <button
                type="button"
                className={`btn btn-xs ${filterMode === 'discrepancies' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterMode('discrepancies')}
                style={{ fontSize: '11px', padding: '3px 8px' }}
              >
                Errors Only ({summary.discrepancies.length})
              </button>
              <button
                type="button"
                className={`btn btn-xs ${filterMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterMode('all')}
                style={{ fontSize: '11px', padding: '3px 8px' }}
              >
                All Cells
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', background: '#fff' }}>
            {filteredDiscrepancies.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#15803d' }}>
                <CheckCircle2 size={32} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontWeight: 700, fontSize: '14px' }}>Flawless Batch! Zero Discrepancies</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Every single row and column matched the source register perfectly.</div>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
                    <th style={{ padding: '6px 10px', width: '70px' }}>Cell</th>
                    <th style={{ padding: '6px 10px' }}>Field</th>
                    <th style={{ padding: '6px 10px' }}>Expected Source</th>
                    <th style={{ padding: '6px 10px' }}>Your Entry</th>
                    <th style={{ padding: '6px 10px', width: '80px' }}>Status</th>
                    {onApplyCorrections && (
                      <th style={{ padding: '6px 10px', width: '90px', textAlign: 'center' }}>Direct Fix</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredDiscrepancies.map((d, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                      <td style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#107c41' }}>
                        {d.colLetter}{d.row}
                      </td>
                      <td style={{ padding: '6px 10px', color: 'var(--text-secondary)' }}>{d.header}</td>
                      <td style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', color: '#15803d', background: '#f0fdf4' }}>
                        {d.sourceVal}
                      </td>
                      <td style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', color: d.status === 'missing' ? '#9ca3af' : '#b91c1c', background: d.status === 'missing' ? '#f9fafb' : '#fef2f2' }}>
                        {d.enteredVal}
                      </td>
                      <td style={{ padding: '6px 10px' }}>
                        <span style={{ 
                          fontSize: '10px', 
                          fontWeight: 700, 
                          padding: '2px 6px', 
                          borderRadius: '3px',
                          textTransform: 'uppercase',
                          background: d.status === 'missing' ? '#f3f4f6' : '#fee2e2',
                          color: d.status === 'missing' ? '#4b5563' : '#991b1b'
                        }}>
                          {d.status}
                        </span>
                      </td>
                      {onApplyCorrections && (
                        <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleFixSingleCell(d)}
                            style={{
                              background: '#16a34a',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '3px',
                              padding: '2px 6px',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                            title={`Instantly set cell ${d.colLetter}${d.row} to "${d.sourceVal}"`}
                          >
                            ⚡ Fix Cell
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRetry}
            style={{ gap: '6px' }}
          >
            <RotateCcw size={15} />
            Edit & Correct Errors
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onShare(summary)}
              style={{ gap: '6px' }}
            >
              <Share2 size={15} />
              Share Achievement
            </button>

            {summary.passed && onNextLevel && level.levelNumber < 5 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onNextLevel}
                style={{ background: '#107c41', borderColor: '#0d5e2e', gap: '6px' }}
              >
                Next Level {level.levelNumber + 1}
                <ArrowRight size={15} />
              </button>
            )}

            <button
              type="button"
              className="btn btn-secondary"
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
