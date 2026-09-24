import React, { useState } from 'react';
import { ExcelEvaluationSummary, ExcelScenarioLevel } from '../../types/excel';
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
}

export const ExcelEvaluationModal: React.FC<ExcelEvaluationModalProps> = ({
  summary,
  level,
  onClose,
  onNextLevel,
  onRetry,
  onShare
}) => {
  const [filterMode, setFilterMode] = useState<'discrepancies' | 'all'>('discrepancies');

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const filteredDiscrepancies = filterMode === 'discrepancies'
    ? summary.discrepancies.filter(d => d.status !== 'correct')
    : summary.discrepancies;

  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }}>
      <div 
        className="modal-container"
        style={{ 
          maxWidth: '840px', 
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'var(--bg-surface)',
          padding: '24px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#107c41', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              EXCEL BATCH EVALUATION REPORT • LEVEL {summary.levelNumber}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {summary.scenarioName}
            </h2>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Pass/Fail Status Banner */}
        <div 
          style={{ 
            borderRadius: 'var(--radius-lg)', 
            padding: '16px 20px', 
            background: summary.passed 
              ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' 
              : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            border: `1px solid ${summary.passed ? '#86efac' : '#fca5a5'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {summary.passed ? (
              <CheckCircle2 size={36} color="#15803d" />
            ) : (
              <AlertTriangle size={36} color="#b91c1c" />
            )}
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: summary.passed ? '#166534' : '#991b1b' }}>
                {summary.passed ? 'BATCH VERIFICATION PASSED' : 'TARGET ACCURACY NOT MET'}
              </div>
              <div style={{ fontSize: '12.5px', color: summary.passed ? '#15803d' : '#b91c1c', marginTop: '2px' }}>
                {summary.passed 
                  ? `Achieved ${summary.accuracyPercentage}% accuracy, meeting the required ${summary.requiredAccuracy}% benchmark.` 
                  : `Achieved ${summary.accuracyPercentage}% accuracy (Target: ${summary.requiredAccuracy}%). Review discrepancies and retry.`
                }
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: summary.passed ? '#15803d' : '#b91c1c' }}>
              {summary.accuracyPercentage}%
            </div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
              Total Fidelity
            </div>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Cells Verified</div>
            <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px', color: 'var(--text-primary)' }}>
              <span style={{ color: '#15803d' }}>{summary.correctCells}</span> / {summary.totalCells}
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Time Taken</div>
            <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Clock size={16} color="var(--icst-blue)" />
              {formatTime(summary.timeTakenSeconds)}
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Data Speed</div>
            <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Zap size={16} color="#d97706" />
              {summary.kph} <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>KPH</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>EXP Earned</div>
            <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Sparkles size={16} color="#15803d" />
              +{summary.expEarned}
            </div>
          </div>
        </div>

        {/* Newly Unlocked Achievements Showcase */}
        {summary.unlockedAchievements.length > 0 && (
          <div style={{ 
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', 
            border: '1px solid #fcd34d', 
            borderRadius: 'var(--radius-md)', 
            padding: '14px 16px', 
            marginBottom: '20px' 
          }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              🎉 Newly Unlocked Excel Achievement!
            </div>
            {summary.unlockedAchievements.map(ach => (
              <div key={ach.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <TrophyGraphic achievementId={ach.id} isUnlocked={true} size={48} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#78350f' }}>{ach.title}</div>
                    <div style={{ fontSize: '12px', color: '#92400e' }}>{ach.description}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ background: '#ffffff', borderColor: '#f59e0b', color: '#78350f', fontWeight: 700, gap: '6px' }}
                  onClick={() => onShare(summary)}
                >
                  <Share2 size={14} color="#d97706" />
                  Share Certificate
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Discrepancy Breakdown Section */}
        <div style={{ flex: 1, minHeight: '180px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Cell Audit Breakdown</span>
              <span style={{ fontSize: '11px', background: 'var(--bg-subtle)', padding: '1px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                {summary.discrepancies.length} issues detected
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
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
                    <th style={{ padding: '6px 10px', width: '90px' }}>Status</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
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
              Share Report
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
