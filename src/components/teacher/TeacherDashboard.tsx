import React, { useState } from 'react';
import { TeacherTestConfig, StudentProgress, StageValidationSummary } from '../../types';
import { loadTeacherTests, saveTeacherTest } from '../../services/storageService';
import { STAGES } from '../../data/stagesConfig';
import { 
  Plus, 
  Settings, 
  Play, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Sliders,
  FileSpreadsheet,
  Download
} from 'lucide-react';

interface TeacherDashboardProps {
  onLaunchTest: (level: number, stage: number) => void;
  studentProgress: StudentProgress;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onLaunchTest,
  studentProgress
}) => {
  const [tests, setTests] = useState<TeacherTestConfig[]>(() => loadTeacherTests());
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<StageValidationSummary | null>(null);

  // New Test Form State
  const [testName, setTestName] = useState('');
  const [levelNumber, setLevelNumber] = useState<number>(1);
  const [stageNumber, setStageNumber] = useState<number>(1);
  const [datasetType, setDatasetType] = useState('Synthetic Student Database Nadia');
  const [allowGuidedMode, setAllowGuidedMode] = useState(false);
  const [targetAccuracy, setTargetAccuracy] = useState<number>(85);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number>(180);
  const [expMultiplier, setExpMultiplier] = useState<number>(1.0);
  const [allowRetries, setAllowRetries] = useState(true);

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    const newTest: TeacherTestConfig = {
      id: `test-${Date.now()}`,
      testName: testName.trim(),
      levelNumber,
      stageNumber,
      datasetType,
      allowGuidedMode,
      targetAccuracy,
      timeLimitSeconds,
      expMultiplier,
      allowRetries,
      createdAt: new Date().toISOString()
    };

    saveTeacherTest(newTest);
    setTests(loadTeacherTests());
    setIsCreatingTest(false);
    setTestName('');
  };

  return (
    <div className="workbench-container" style={{ maxWidth: '1240px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        color: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img 
            src="/logo.png" 
            alt="ICST Chowberia" 
            style={{ width: '56px', height: '56px', objectFit: 'contain' }} 
          />
          <div>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#38bdf8', fontWeight: 700 }}>
              Institute of Computer Science and Technology Chowberia
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>
              Teacher & Assessment Administration Mode
            </h2>
            <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '2px' }}>
              Design customized examination tests, monitor performance, and review student accuracy.
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsCreatingTest(!isCreatingTest)}
          style={{ background: '#0284c7', borderColor: '#0369a1' }}
        >
          <Plus size={16} />
          <span>{isCreatingTest ? 'Cancel Test Builder' : 'Create Custom Test'}</span>
        </button>
      </div>

      {/* Test Creation Builder Form */}
      {isCreatingTest && (
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginTop: '20px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--icst-charcoal)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--icst-blue)" />
            <span>Teacher Test Builder</span>
          </h3>

          <form onSubmit={handleCreateTest}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div className="field-group full-width">
                <label className="field-label">Test Name / Assessment Title</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="e.g. Class X Board Marksheet Verification Test"
                  value={testName}
                  onChange={e => setTestName(e.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label">Target Level (1 - 5)</label>
                <select
                  className="field-input"
                  value={levelNumber}
                  onChange={e => {
                    setLevelNumber(Number(e.target.value));
                    setStageNumber(1);
                  }}
                >
                  <option value={1}>Level 1: Foundation (80%)</option>
                  <option value={2}>Level 2: Basic Professional (85%)</option>
                  <option value={3}>Level 3: Advanced Data Entry (90%)</option>
                  <option value={4}>Level 4: Professional Operator (95%)</option>
                  <option value={5}>Level 5: Master Operator (100%)</option>
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Stage Form Type</label>
                <select
                  className="field-input"
                  value={stageNumber}
                  onChange={e => setStageNumber(Number(e.target.value))}
                >
                  {STAGES.filter(s => s.levelNumber === levelNumber).map(s => (
                    <option key={s.stageNumber} value={s.stageNumber}>
                      Stage {s.stageNumber}: {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Target Accuracy Threshold (%)</label>
                <input
                  type="number"
                  className="field-input"
                  value={targetAccuracy}
                  min={50}
                  max={100}
                  onChange={e => setTargetAccuracy(Number(e.target.value))}
                />
              </div>

              <div className="field-group">
                <label className="field-label">Time Limit (Seconds)</label>
                <input
                  type="number"
                  className="field-input"
                  value={timeLimitSeconds}
                  min={30}
                  max={600}
                  onChange={e => setTimeLimitSeconds(Number(e.target.value))}
                />
              </div>

              <div className="field-group">
                <label className="field-label">EXP Multiplier</label>
                <select
                  className="field-input"
                  value={expMultiplier}
                  onChange={e => setExpMultiplier(Number(e.target.value))}
                >
                  <option value={1.0}>1.0x Normal</option>
                  <option value={1.2}>1.2x Exam Bonus</option>
                  <option value={1.5}>1.5x Certification Test</option>
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Guided Mode Access</label>
                <select
                  className="field-input"
                  value={allowGuidedMode ? 'true' : 'false'}
                  onChange={e => setAllowGuidedMode(e.target.value === 'true')}
                >
                  <option value="false">Strict Test (Guided Mode Disabled)</option>
                  <option value="true">Formative (Guided Mode Enabled, 0 EXP)</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsCreatingTest(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Test Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Configured Teacher Tests */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px', color: 'var(--icst-charcoal)' }}>
          Active Tests & Practicum Sessions ({tests.length})
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '16px'
        }}>
          {tests.map(test => (
            <div
              key={test.id}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{
                    background: 'var(--icst-blue-soft)',
                    color: 'var(--icst-blue-dark)',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    Level {test.levelNumber} • Stage {test.stageNumber}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Target: <strong>{test.targetAccuracy}%</strong>
                  </span>
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {test.testName}
                </h4>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Dataset: <strong>{test.datasetType}</strong></div>
                  <div>Time Limit: <strong>{test.timeLimitSeconds}s</strong></div>
                  <div>Guided Mode: <strong>{test.allowGuidedMode ? 'Allowed' : 'Prohibited'}</strong></div>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onLaunchTest(test.levelNumber, test.stageNumber)}
                >
                  <Play size={13} />
                  <span>Launch Assessment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Attempt Inspection & Performance Audit */}
      <div style={{ marginTop: '32px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--icst-charcoal)' }}>
              Student Attempt Logs & Precision Audit
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Inspect student-entered values against source datasets down to individual field mistakes.
            </div>
          </div>
        </div>

        {studentProgress.recentAttempts.length === 0 ? (
          <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileSpreadsheet size={36} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
            No student attempts submitted yet. Launch a practice test or exercise to populate records.
          </div>
        ) : (
          <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: 'var(--text-secondary)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '10px 14px' }}>Trainee Operator</th>
                  <th style={{ padding: '10px 14px' }}>Level / Stage</th>
                  <th style={{ padding: '10px 14px' }}>UID</th>
                  <th style={{ padding: '10px 14px' }}>Accuracy</th>
                  <th style={{ padding: '10px 14px' }}>Correct / Total</th>
                  <th style={{ padding: '10px 14px' }}>Time Taken</th>
                  <th style={{ padding: '10px 14px' }}>Mode</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {studentProgress.recentAttempts.map((attempt, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>
                      <div>{attempt.studentIdentity?.name || 'Trainee Operator'}</div>
                      <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {attempt.studentIdentity?.generatedRollId || 'NYSDB0140-0001'}
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>L{attempt.levelNumber} - Stage {attempt.stageNumber}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{attempt.uid}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 800, color: attempt.passed ? 'var(--success-green)' : 'var(--error-red)' }}>
                      {attempt.accuracyPercentage}%
                    </td>
                    <td style={{ padding: '10px 14px' }}>{attempt.correctUnits} / {attempt.totalEvaluatedUnits}</td>
                    <td style={{ padding: '10px 14px' }}>{attempt.timeTakenSeconds}s</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        background: attempt.isGuidedMode ? '#fffbeb' : '#f1f5f9',
                        color: attempt.isGuidedMode ? '#b45309' : '#475569',
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 600
                      }}>
                        {attempt.isGuidedMode ? 'Guided' : 'Standard'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedAttempt(attempt)}
                      >
                        Inspect Errors
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Detailed Attempt Error Inspection */}
        {selectedAttempt && (
          <div className="modal-overlay" onClick={() => setSelectedAttempt(null)}>
            <div className="modal-card" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--icst-blue-dark)', fontWeight: 700 }}>
                    Teacher Audit Inspection
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
                    UID: {selectedAttempt.uid} (L{selectedAttempt.levelNumber}-S{selectedAttempt.stageNumber})
                  </h3>
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: selectedAttempt.passed ? 'var(--success-green)' : 'var(--error-red)'
                }}>
                  {selectedAttempt.accuracyPercentage}%
                </div>
              </div>

              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#166534' }}>Correct</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#15803d' }}>{selectedAttempt.correctUnits}</div>
                  </div>
                  <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#991b1b' }}>Incorrect</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#b91c1c' }}>{selectedAttempt.incorrectUnits}</div>
                  </div>
                  <div style={{ background: '#fffbeb', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#92400e' }}>Missing</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#b45309' }}>{selectedAttempt.missingUnits}</div>
                  </div>
                </div>

                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
                  Field-by-Field Breakdown
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedAttempt.fieldResults.map((f, i) => (
                    <div key={i} style={{
                      padding: '8px 12px',
                      background: f.status === 'correct' ? '#f8fafc' : '#fef2f2',
                      border: `1px solid ${f.status === 'correct' ? '#e2e8f0' : '#fecaca'}`,
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                        <span>{f.label}</span>
                        <span style={{ color: f.status === 'correct' ? 'var(--success-green)' : 'var(--error-red)' }}>
                          {f.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ marginTop: '4px', display: 'flex', gap: '16px', fontFamily: 'var(--font-mono)' }}>
                        <div>Entered: <span style={{ color: 'var(--text-primary)' }}>{String(f.enteredValue || '(blank)')}</span></div>
                        <div>Expected: <span style={{ color: 'var(--text-muted)' }}>{String(f.sourceValue)}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedAttempt(null)}
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
