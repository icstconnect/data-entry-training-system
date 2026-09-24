import React from 'react';
import { StudentProgress, LevelInfo } from '../../types';
import { LEVELS_INFO, STAGES } from '../../data/stagesConfig';
import { ALL_ACHIEVEMENTS } from '../../services/achievementEngine';
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Play, 
  Sparkles,
  Lock,
  Target
} from 'lucide-react';

interface StudentDashboardProps {
  progress: StudentProgress;
  onSelectStage: (level: number, stage: number) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  progress,
  onSelectStage
}) => {
  const totalStagesCount = STAGES.length; // 18 stages
  const completedStagesCount = Object.keys(progress.completedStages).length;
  const overallProgressPercent = Math.round((completedStagesCount / totalStagesCount) * 100);

  return (
    <div className="workbench-container" style={{ maxWidth: '1200px' }}>
      {/* Top Banner with Batch Title and Overall EXP */}
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
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img 
            src="/logo.png" 
            alt="ICST Chowberia" 
            style={{ width: '64px', height: '64px', objectFit: 'contain' }} 
          />
          <div>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#38bdf8', fontWeight: 700 }}>
              Institute of Computer Science and Technology Chowberia
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>
              Student Training Profile
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 700
              }}>
                {progress.currentBatchTitle}
              </span>
              <span style={{ fontSize: '13px', opacity: 0.8 }}>
                • Level {progress.currentLevel} Active
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.75 }}>
              Total Experience
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
              {progress.totalExp.toLocaleString()} EXP
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Stat Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginTop: '16px'
      }}>
        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>Overall Curriculum</span>
            <Target size={16} color="var(--icst-blue)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            {completedStagesCount} / {totalStagesCount}
          </div>
          <div style={{ marginTop: '8px', background: '#e2e8f0', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
            <div style={{ background: 'var(--icst-blue)', height: '100%', width: `${overallProgressPercent}%` }} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
            {overallProgressPercent}% Stages Completed
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>Achievements</span>
            <Trophy size={16} color="#d97706" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#b45309', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            {progress.unlockedAchievements.length} / {ALL_ACHIEVEMENTS.length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Data Entry Honors & Medals
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>Total Attempts</span>
            <TrendingUp size={16} color="#16a34a" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            {progress.recentAttempts.length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Recorded evaluations
          </div>
        </div>
      </div>

      {/* Levels and Stages Curriculum Map */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px', color: 'var(--icst-charcoal)' }}>
          5-Level Training Progression
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {LEVELS_INFO.map(lvl => {
            const levelStages = STAGES.filter(s => s.levelNumber === lvl.levelNumber);

            return (
              <div 
                key={lvl.levelNumber}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      background: lvl.color,
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '6px'
                    }}>
                      LEVEL {lvl.levelNumber}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--icst-charcoal)' }}>
                        {lvl.title}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {lvl.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Required Accuracy: <strong style={{ color: lvl.color }}>{lvl.requiredAccuracy}%</strong>
                    </span>
                  </div>
                </div>

                {/* Stages List within this Level */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '12px'
                }}>
                  {levelStages.map(st => {
                    const key = `L${st.levelNumber}-S${st.stageNumber}`;
                    const record = progress.completedStages[key];
                    const isCompleted = !!record;

                    return (
                      <div
                        key={st.stageNumber}
                        style={{
                          background: isCompleted ? '#f0fdf4' : '#f8fafc',
                          border: `1px solid ${isCompleted ? '#bbf7d0' : '#e2e8f0'}`,
                          borderRadius: 'var(--radius-md)',
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--icst-blue)' }}>
                              Stage {st.stageNumber}
                            </span>
                            {isCompleted && (
                              <CheckCircle2 size={13} color="#15803d" />
                            )}
                          </div>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>
                            {st.title}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {st.fields.length} Fields • {st.difficulty}
                            {record && ` • Best: ${record.highestAccuracy}%`}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ flexShrink: 0 }}
                          onClick={() => onSelectStage(st.levelNumber, st.stageNumber)}
                        >
                          <Play size={12} />
                          <span>{isCompleted ? 'Repeat' : 'Start'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Gallery */}
      <div style={{ marginTop: '28px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px', color: 'var(--icst-charcoal)' }}>
          Honor Achievements
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px'
        }}>
          {ALL_ACHIEVEMENTS.map(ach => {
            const isUnlocked = progress.unlockedAchievements.includes(ach.id);

            return (
              <div
                key={ach.id}
                style={{
                  background: isUnlocked ? '#ffffff' : '#f8fafc',
                  border: `1px solid ${isUnlocked ? '#fde68a' : '#e2e8f0'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: isUnlocked ? 1 : 0.6
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: isUnlocked ? '#fef3c7' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isUnlocked ? '#b45309' : '#94a3b8',
                  flexShrink: 0
                }}>
                  {isUnlocked ? <Trophy size={18} /> : <Lock size={16} />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                    {ach.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {ach.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Attempts Log */}
      {progress.recentAttempts.length > 0 && (
        <div style={{ marginTop: '28px', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px', color: 'var(--icst-charcoal)' }}>
            Recent Evaluations History
          </h3>
          <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: 'var(--text-secondary)', textAlign: 'left', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '10px 14px' }}>Stage</th>
                  <th style={{ padding: '10px 14px' }}>UID</th>
                  <th style={{ padding: '10px 14px' }}>Accuracy</th>
                  <th style={{ padding: '10px 14px' }}>EXP</th>
                  <th style={{ padding: '10px 14px' }}>Time</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {progress.recentAttempts.map((att, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>L{att.levelNumber} - Stage {att.stageNumber}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{att.uid}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: att.passed ? 'var(--success-green)' : 'var(--error-red)' }}>
                      {att.accuracyPercentage}%
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      +{att.expEarned} EXP
                    </td>
                    <td style={{ padding: '10px 14px' }}>{Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        background: att.passed ? '#f0fdf4' : '#fef2f2',
                        color: att.passed ? '#166534' : '#991b1b',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        {att.passed ? 'PASSED' : 'RETRY'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
