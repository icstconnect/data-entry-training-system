import React, { useState, useEffect } from 'react';
import { ExcelProgress, ExcelScenarioLevel } from '../../types/excel';
import { StudentProgress, Achievement } from '../../types';
import { EXCEL_LEVELS, EXCEL_ACHIEVEMENTS } from '../../data/excelScenariosData';
import { loadExcelProgress } from '../../services/excelStorageService';
import { TrophyGraphic } from '../common/TrophyGraphic';
import { AchievementShareModal } from '../common/AchievementShareModal';
import './excel.css';

import { 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Lock, 
  Share2, 
  ArrowRight, 
  Layers, 
  Award,
  Zap,
  Target
} from 'lucide-react';

interface ExcelDashboardProps {
  onSelectLevel: (lvl: number) => void;
  studentProgress: StudentProgress;
}

export const ExcelDashboard: React.FC<ExcelDashboardProps> = ({
  onSelectLevel,
  studentProgress
}) => {
  const [excelProgress, setExcelProgress] = useState<ExcelProgress>(() => loadExcelProgress());
  const [selectedAchievementToShare, setSelectedAchievementToShare] = useState<Achievement | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setExcelProgress(loadExcelProgress());
  }, []);

  const totalCompleted = Object.keys(excelProgress.completedLevels).length;
  const unlockedAchCount = excelProgress.unlockedAchievements.length;

  const handleShareClick = (ach: Achievement) => {
    setSelectedAchievementToShare(ach);
    setIsShareModalOpen(true);
  };

  return (
    <div className="excel-dashboard-root">
      {/* Hero Banner */}
      <section className="excel-dash-hero">
        <div className="excel-hero-title-group">
          <h1>
            <FileSpreadsheet size={28} />
            Excel Mass Data Entry Lab
          </h1>
          <p>
            Master realistic high-density data transcription across academic, commercial, banking, state examination, and government census registers. Real Excel interface with keyboard navigation and strict audit verification.
          </p>
        </div>

        <div className="excel-hero-stats">
          <div className="excel-hero-stat-card">
            <div className="excel-stat-val" style={{ color: '#fef08a' }}>
              {excelProgress.totalExcelExp}
            </div>
            <div className="excel-stat-lbl">Excel EXP</div>
          </div>

          <div className="excel-hero-stat-card">
            <div className="excel-stat-val">
              {totalCompleted} / 5
            </div>
            <div className="excel-stat-lbl">Levels Cleared</div>
          </div>

          <div className="excel-hero-stat-card">
            <div className="excel-stat-val">
              {unlockedAchCount} / 5
            </div>
            <div className="excel-stat-lbl">Trophies</div>
          </div>
        </div>
      </section>

      {/* 5 Scenario Levels Grid */}
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Training Scenarios & Registries
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Choose a registry to enter the full-screen Excel workbench.
          </p>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#107c41', background: '#e2fbe8', padding: '4px 10px', borderRadius: '12px' }}>
          5 Real-World Scenarios
        </span>
      </div>

      <div className="excel-levels-grid">
        {EXCEL_LEVELS.map((lvl) => {
          const completion = excelProgress.completedLevels[lvl.levelNumber];
          const isPassed = !!completion;
          const totalCells = lvl.sourceRecords.length * lvl.columns.length;

          return (
            <div key={lvl.levelNumber} className="excel-level-card">
              <div>
                <div className="excel-level-top">
                  <span className="excel-domain-tag">
                    {lvl.domain}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Level {lvl.levelNumber}
                  </span>
                </div>

                <h3 className="excel-card-title">{lvl.scenarioName}</h3>
                <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600, marginBottom: '8px' }}>
                  {lvl.scenarioSubtitle}
                </div>
                <p className="excel-card-desc">{lvl.description}</p>

                <div className="excel-meta-pills">
                  <span className="excel-pill">
                    <Layers size={12} />
                    {lvl.columns.length} Cols × {lvl.sourceRecords.length} Rows ({totalCells} Cells)
                  </span>

                  <span className="excel-pill">
                    <Target size={12} color="#15803d" />
                    Target: {lvl.targetAccuracy}% Accuracy
                  </span>

                  <span className="excel-pill">
                    <Clock size={12} />
                    {Math.floor(lvl.timeLimitSeconds / 60)}m benchmark
                  </span>

                  <span className="excel-pill" style={{ background: '#fef3c7', color: '#92400e' }}>
                    <Sparkles size={12} color="#d97706" />
                    +{lvl.expReward} EXP
                  </span>
                </div>
              </div>

              <div className="excel-card-action">
                <div>
                  {isPassed ? (
                    <div className="excel-level-status">
                      <CheckCircle2 size={16} color="#15803d" />
                      <span>Best: {completion.highestAccuracy}%</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Not Attempted
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onSelectLevel(lvl.levelNumber)}
                  style={{ background: '#107c41', borderColor: '#0d5e2e', gap: '6px', fontSize: '12px', padding: '6px 14px' }}
                >
                  <span>{isPassed ? 'Practice Again' : 'Start Entry'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5 Excel Achievements Section with Custom Trophy Graphics & Conditional Share Buttons */}
      <section className="excel-achievements-panel">
        <div className="excel-section-heading">
          <div className="excel-heading-left">
            <Award size={22} color="#f59e0b" />
            <div>
              <h2>Excel Registrar Honors & Achievements</h2>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Earn verified digital certificates for speed, volume, and cell accuracy. Certificates unlock automatically.
              </div>
            </div>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400e', background: '#fef3c7', padding: '4px 10px', borderRadius: '12px' }}>
            {unlockedAchCount} / {EXCEL_ACHIEVEMENTS.length} Unlocked
          </span>
        </div>

        <div className="excel-achieve-grid">
          {EXCEL_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = excelProgress.unlockedAchievements.includes(ach.id);

            return (
              <div 
                key={ach.id} 
                className={`excel-achieve-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                {/* Custom Trophy Graphic for this Excel task */}
                <TrophyGraphic 
                  achievementId={ach.id} 
                  isUnlocked={isUnlocked} 
                  size={58} 
                />

                <div className="excel-achieve-title">{ach.title}</div>
                <div className="excel-achieve-desc">{ach.description}</div>

                {/* Share Button: Disabled by default, active only when unlocked */}
                <button
                  type="button"
                  className="excel-share-btn"
                  disabled={!isUnlocked}
                  onClick={() => handleShareClick(ach)}
                  title={isUnlocked ? 'Share your achievement certificate' : 'Locked: Complete this level requirement to unlock'}
                >
                  {isUnlocked ? (
                    <>
                      <Share2 size={13} color="#15803d" />
                      <span>Share Certificate</span>
                    </>
                  ) : (
                    <>
                      <Lock size={13} />
                      <span>Locked (Complete Task)</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Evaluations Table if any exist */}
      {excelProgress.recentEvaluations.length > 0 && (
        <section style={{ marginTop: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Recent Batch Audit Records
          </h3>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-medium)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '8px 14px' }}>Date</th>
                  <th style={{ padding: '8px 14px' }}>Registry / Level</th>
                  <th style={{ padding: '8px 14px' }}>Accuracy</th>
                  <th style={{ padding: '8px 14px' }}>Speed</th>
                  <th style={{ padding: '8px 14px' }}>Result</th>
                  <th style={{ padding: '8px 14px' }}>EXP</th>
                </tr>
              </thead>
              <tbody>
                {excelProgress.recentEvaluations.slice(0, 5).map((evalItem, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px 14px', color: 'var(--text-muted)' }}>
                      {new Date(evalItem.submittedAt).toLocaleDateString()} {new Date(evalItem.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '8px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Level {evalItem.levelNumber}: {evalItem.scenarioName}
                    </td>
                    <td style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      <span style={{ color: evalItem.passed ? '#15803d' : '#b91c1c' }}>
                        {evalItem.accuracyPercentage}%
                      </span>
                    </td>
                    <td style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)' }}>
                      {evalItem.kph} KPH
                    </td>
                    <td style={{ padding: '8px 14px' }}>
                      <span style={{ 
                        fontSize: '10.5px', 
                        fontWeight: 700, 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        background: evalItem.passed ? '#e2fbe8' : '#fee2e2',
                        color: evalItem.passed ? '#166534' : '#991b1b'
                      }}>
                        {evalItem.passed ? 'PASSED' : 'RETRY'}
                      </span>
                    </td>
                    <td style={{ padding: '8px 14px', fontWeight: 700, color: '#15803d' }}>
                      +{evalItem.expEarned}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Achievement Share Modal */}
      {isShareModalOpen && selectedAchievementToShare && (
        <AchievementShareModal
          summary={{
            uid: `excel-ach-${selectedAchievementToShare.id}`,
            levelNumber: selectedAchievementToShare.badgeLevel || 1,
            stageNumber: 1,
            totalEvaluatedUnits: 100,
            correctUnits: 98,
            incorrectUnits: 2,
            missingUnits: 0,
            timeTakenSeconds: 240,
            timeLimitSeconds: 300,
            accuracyPercentage: 98.5,
            requiredAccuracy: 80,
            passed: true,
            expEarned: 150,
            isGuidedMode: false,
            fieldResults: [],
            cellResults: [],
            unlockedAchievements: [selectedAchievementToShare],
            submittedAt: new Date().toISOString(),
            studentIdentity: studentProgress.studentIdentity
          }}
          achievement={selectedAchievementToShare}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};
