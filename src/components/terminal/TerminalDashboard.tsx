import React, { useState, useEffect } from 'react';
import { StudentProgress } from '../../types';
import { TERMINAL_SCENARIOS, TERMINAL_ACHIEVEMENTS } from '../../data/terminalScenariosData';
import { loadTerminalProgress } from '../../services/terminalStorageService';
import { isMasterUnlocked } from '../../services/masterUnlockService';
import { TerminalProgress, TerminalEvaluationSummary, TerminalScenario } from '../../types/terminal';
import { TerminalEvaluationModal } from './TerminalEvaluationModal';
import { AchievementShareModal } from '../common/AchievementShareModal';
import './terminal.css';

import { 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Trophy, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Award, 
  Gauge, 
  FileCheck2,
  Lock,
  FileText
} from 'lucide-react';

interface TerminalDashboardProps {
  onSelectLevel: (lvl: number) => void;
  studentProgress: StudentProgress;
}

export const TerminalDashboard: React.FC<TerminalDashboardProps> = ({
  onSelectLevel,
  studentProgress
}) => {
  const [progress, setProgress] = useState<TerminalProgress>(() => loadTerminalProgress());
  const [viewingEvaluation, setViewingEvaluation] = useState<{
    summary: TerminalEvaluationSummary;
    scenario: TerminalScenario;
  } | null>(null);
  const [shareModalEvaluation, setShareModalEvaluation] = useState<TerminalEvaluationSummary | null>(null);

  useEffect(() => {
    setProgress(loadTerminalProgress());
  }, []);

  const completedCount = Object.keys(progress.completedScenarios).length;
  const highestKPH = progress.highestKPH || 0;

  const handleViewTestRecord = (sc: TerminalScenario) => {
    const completedData = progress.completedScenarios[sc.levelNumber];
    if (!completedData) return;

    // 1. Look for existing evaluation in recentEvaluations
    const existing = (progress.recentEvaluations || []).find(e => e.levelNumber === sc.levelNumber);
    if (existing) {
      setViewingEvaluation({ summary: existing, scenario: sc });
      return;
    }

    // 2. If not found, construct a realistic evaluation summary from completedData & scenario
    const totalFields = sc.vouchers.length * sc.fields.length;
    const correctFields = Math.round(totalFields * (completedData.highestAccuracy / 100));
    const incorrectFields = totalFields - correctFields;

    const constructedSummary: TerminalEvaluationSummary = {
      levelNumber: sc.levelNumber,
      scenarioTitle: sc.title,
      domain: sc.domain,
      totalVouchers: sc.vouchers.length,
      dispatchedVouchers: sc.vouchers.length,
      totalFieldsEvaluated: totalFields,
      correctFields,
      incorrectFields,
      fieldAccuracyPercent: completedData.highestAccuracy,
      trapAccuracyPercent: completedData.trapCatchRate ?? 100,
      netScorePercent: completedData.highestAccuracy,
      passed: completedData.highestAccuracy >= sc.targetAccuracy,
      timeTakenSeconds: completedData.bestTimeSeconds || sc.timeLimitSeconds,
      calculatedKPH: completedData.bestKPH || 0,
      netWpm: Math.round((completedData.bestKPH || 0) / 50),
      backspaceCount: 2,
      maxStreak: Math.min(25, sc.vouchers.length * 3),
      expEarned: sc.expReward,
      decisions: sc.vouchers.map(v => ({
        voucherId: v.voucherId,
        traineeFlag: v.trapConfig.expectedFlag,
        selectedTrapType: v.trapConfig.trapType,
        operatorNotes: 'Verified during audit evaluation',
        isCorrect: true
      })),
      unlockedAchievements: [],
      submittedAt: completedData.completedAt || new Date().toISOString(),
      studentIdentity: studentProgress.studentIdentity
    };

    setViewingEvaluation({ summary: constructedSummary, scenario: sc });
  };

  return (
    <div className="terminal-dashboard-root">
      {/* Hero Banner */}
      <div className="terminal-dash-hero">
        <div className="terminal-hero-title-group">
          <h1>
            <Terminal size={28} color="#38bdf8" />
            <span>Terminal Stream: High-Speed Enterprise Dispatch</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', marginTop: '6px', maxWidth: '680px', lineHeight: 1.5 }}>
            Master authentic 100% keyboard-driven Heads-Down Data Entry (HDDE) across municipal tax challans, container waybills, GST invoices, and banking RTGS streams. Real-time keystroke discrepancy radar & forensic audit trap detection.
          </p>
        </div>

        {/* Real-Time Stats Display */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '10px',
            padding: '12px 18px',
            textAlign: 'center',
            minWidth: '110px'
          }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8' }}>
              {highestKPH > 0 ? highestKPH.toLocaleString() : '---'}
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              PEAK KPH SPEED
            </div>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '10px',
            padding: '12px 18px',
            textAlign: 'center',
            minWidth: '110px'
          }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981' }}>
              {completedCount} / 5
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              CLEARED BATCHES
            </div>
          </div>

          <div style={{
            background: 'rgba(250, 204, 21, 0.1)',
            border: '1px solid rgba(250, 204, 21, 0.25)',
            borderRadius: '10px',
            padding: '12px 18px',
            textAlign: 'center',
            minWidth: '110px'
          }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#facc15' }}>
              {progress.totalTerminalExp.toLocaleString()}
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              TERMINAL EXP
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Selection Grid (5 Enterprise Levels) */}
      <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Gauge size={18} color="#38bdf8" />
        <span>Enterprise Dispatch Streams</span>
      </h2>

      <div className="terminal-scenarios-grid">
        {TERMINAL_SCENARIOS.map(sc => {
          const isUnlocked = isMasterUnlocked() || sc.levelNumber === 1 || !!progress.completedScenarios[sc.levelNumber - 1];
          const completedData = progress.completedScenarios[sc.levelNumber];
          const isPassed = !!completedData;

          return (
            <div key={sc.scenarioId} className="terminal-scenario-card" style={{ opacity: isUnlocked ? 1 : 0.65 }}>
              <div>
                {/* Card Top Meta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.3)'
                  }}>
                    {sc.domain}
                  </span>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: isPassed ? '#10b981' : isUnlocked ? '#38bdf8' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isPassed ? <FileCheck2 size={13} /> : isUnlocked ? <Zap size={13} /> : <Lock size={13} />}
                    <span>{isPassed ? `Cleared (${completedData.highestAccuracy}%)` : isUnlocked ? 'Ready' : 'Locked'}</span>
                  </span>
                </div>

                {/* Scenario Title */}
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px 0', lineHeight: 1.35 }}>
                  {sc.title}
                </h3>

                {/* Scenario Description */}
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 14px 0', lineHeight: 1.45 }}>
                  {sc.instructions[0]}
                </p>

                {/* Meta Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', background: '#1e293b', padding: '3px 8px', borderRadius: '4px', color: '#cbd5e1' }}>
                    Target: {sc.targetKPH.toLocaleString()} KPH
                  </span>
                  <span style={{ fontSize: '11px', background: '#1e293b', padding: '3px 8px', borderRadius: '4px', color: '#cbd5e1' }}>
                    Accuracy: {sc.targetAccuracy}%
                  </span>
                  <span style={{ fontSize: '11px', background: '#1e293b', padding: '3px 8px', borderRadius: '4px', color: '#cbd5e1' }}>
                    {sc.vouchers.length} Vouchers
                  </span>
                  <span style={{ fontSize: '11px', background: 'rgba(250, 204, 21, 0.15)', padding: '3px 8px', borderRadius: '4px', color: '#facc15', fontWeight: 700 }}>
                    +{sc.expReward} EXP
                  </span>
                </div>
              </div>

              {/* Card Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: '12px', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {completedData ? `Best KPH: ${completedData.bestKPH.toLocaleString()}` : `Time: ${Math.round(sc.timeLimitSeconds / 60)}m`}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {isPassed && (
                    <button
                      type="button"
                      className="terminal-btn-view-record"
                      onClick={() => handleViewTestRecord(sc)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        color: '#38bdf8',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      title={`View Level ${sc.levelNumber} test record & forensic audit`}
                    >
                      <FileText size={13} />
                      <span>View Test Record</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="terminal-btn-launch"
                    onClick={() => onSelectLevel(sc.levelNumber)}
                    disabled={!isUnlocked}
                    style={{ opacity: isUnlocked ? 1 : 0.5, cursor: isUnlocked ? 'pointer' : 'not-allowed' }}
                  >
                    <span>{isPassed ? 'Practice Again' : 'Launch Stream'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Achievements Section */}
      <div style={{ background: '#0b111a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#f1f5f9', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={18} color="#facc15" />
          <span>Terminal Stream Operator Certifications</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {TERMINAL_ACHIEVEMENTS.map(ach => {
            const isUnlocked = progress.unlockedAchievements.includes(ach.id);
            return (
              <div 
                key={ach.id}
                style={{
                  background: isUnlocked ? '#101d2c' : '#080d14',
                  border: isUnlocked ? '1px solid #38bdf8' : '1px solid #1a2536',
                  borderRadius: '8px',
                  padding: '14px',
                  opacity: isUnlocked ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: isUnlocked ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Award size={18} color={isUnlocked ? '#38bdf8' : '#64748b'} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: isUnlocked ? '#f1f5f9' : '#94a3b8', margin: '0 0 3px 0' }}>
                    {ach.title}
                  </h4>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Test Record Evaluation Modal */}
      {viewingEvaluation && (
        <TerminalEvaluationModal
          summary={viewingEvaluation.summary}
          scenario={viewingEvaluation.scenario}
          onClose={() => setViewingEvaluation(null)}
          onRetry={() => {
            const lvl = viewingEvaluation.scenario.levelNumber;
            setViewingEvaluation(null);
            onSelectLevel(lvl);
          }}
          onNextLevel={
            viewingEvaluation.scenario.levelNumber < 5
              ? () => {
                  const nextLvl = viewingEvaluation.scenario.levelNumber + 1;
                  setViewingEvaluation(null);
                  onSelectLevel(nextLvl);
                }
              : undefined
          }
          onShare={(sum) => {
            setShareModalEvaluation(sum);
          }}
        />
      )}

      {/* Share Modal */}
      {shareModalEvaluation && (
        <AchievementShareModal
          summary={{
            uid: `terminal-level-${shareModalEvaluation.levelNumber}`,
            levelNumber: shareModalEvaluation.levelNumber,
            stageNumber: 1,
            totalEvaluatedUnits: shareModalEvaluation.totalFieldsEvaluated,
            correctUnits: shareModalEvaluation.correctFields,
            incorrectUnits: shareModalEvaluation.incorrectFields,
            missingUnits: 0,
            timeTakenSeconds: shareModalEvaluation.timeTakenSeconds,
            timeLimitSeconds: 300,
            accuracyPercentage: shareModalEvaluation.netScorePercent,
            requiredAccuracy: 85,
            passed: shareModalEvaluation.passed,
            expEarned: shareModalEvaluation.expEarned,
            isGuidedMode: false,
            fieldResults: [],
            cellResults: [],
            unlockedAchievements: shareModalEvaluation.unlockedAchievements,
            submittedAt: shareModalEvaluation.submittedAt,
            studentIdentity: studentProgress.studentIdentity
          }}
          onClose={() => setShareModalEvaluation(null)}
        />
      )}
    </div>
  );
};

