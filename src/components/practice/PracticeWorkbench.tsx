import React, { useState, useEffect, useRef } from 'react';
import { 
  StageConfig, 
  SourceRecord, 
  StageValidationSummary, 
  StudentProgress,
  ValidationMode
} from '../../types';
import { generateSyntheticRecord } from '../../services/syntheticDataGenerator';
import { evaluateStageSubmission } from '../../services/validationEngine';
import { checkUnlockedAchievements } from '../../services/achievementEngine';
import { 
  saveStageDraft, 
  loadStageDraft, 
  clearStageDraft, 
  saveStudentProgress,
  StageDraft,
  playFeedbackSound
} from '../../services/storageService';
import { STAGES, getStage } from '../../data/stagesConfig';

import { UidSearchSection } from './UidSearchSection';
import { SourceDocumentViewer } from './SourceDocumentViewer';
import { FieldRenderer } from '../fields/FieldRenderer';
import { TabularEntryGrid } from '../table/TabularEntryGrid';
import { MarksheetGrid } from '../table/MarksheetGrid';
import { StageInstructionsModal } from './StageInstructionsModal';
import { ReviewModal } from './ReviewModal';
import { ResultScreen } from './ResultScreen';
import { AutosavePromptModal } from '../common/AutosavePromptModal';

import { 
  Eye, 
  Send, 
  RotateCcw, 
  Save, 
  Sparkles,
  Info,
  Check
} from 'lucide-react';

interface PracticeWorkbenchProps {
  currentLevel: number;
  currentStage: number;
  onStageChange: (level: number, stage: number) => void;
  studentProgress: StudentProgress;
  setStudentProgress: React.Dispatch<React.SetStateAction<StudentProgress>>;
  isGuidedMode: boolean;
  onExpAwarded: (amount: number) => void;
  onTimerTick?: (seconds: number) => void;
}

export const PracticeWorkbench: React.FC<PracticeWorkbenchProps> = ({
  currentLevel,
  currentStage,
  onStageChange,
  studentProgress,
  setStudentProgress,
  isGuidedMode,
  onExpAwarded,
  onTimerTick
}) => {
  const stage = getStage(currentLevel, currentStage) || STAGES[0];

  const [uid, setUid] = useState<string>(stage.sampleUid);
  const [sourceRecord, setSourceRecord] = useState<SourceRecord>(() => generateSyntheticRecord(stage.sampleUid));
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [tableRows, setTableRows] = useState<Record<string, any>[]>([]);
  const [marksheetValues, setMarksheetValues] = useState<Record<string, any>>({});

  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [validationSummary, setValidationSummary] = useState<StageValidationSummary | null>(null);

  const [pendingDraft, setPendingDraft] = useState<StageDraft | null>(null);
  const [validationMode, setValidationMode] = useState<ValidationMode>('NORMAL');
  const [manualSaveNotification, setManualSaveNotification] = useState<boolean>(false);

  // Initialize or check for autosave draft
  useEffect(() => {
    const draft = loadStageDraft(stage.levelNumber, stage.stageNumber);
    if (draft) {
      setPendingDraft(draft);
    } else {
      resetToNewStage(stage);
    }
  }, [stage.levelNumber, stage.stageNumber]);

  // Timer loop
  useEffect(() => {
    if (showInstructions || validationSummary) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        const next = prev + 1;
        if (onTimerTick) onTimerTick(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showInstructions, validationSummary]);

  // Periodic autosave every 5 seconds
  useEffect(() => {
    if (showInstructions || validationSummary || !sourceRecord) return;
    const timeout = setTimeout(() => {
      saveStageDraft({
        levelNumber: stage.levelNumber,
        stageNumber: stage.stageNumber,
        uid,
        formValues,
        tableRows,
        marksheetValues,
        timeSeconds: timerSeconds,
        isGuidedMode,
        savedAt: new Date().toISOString()
      });
    }, 3000);
    return () => clearTimeout(timeout);
  }, [formValues, tableRows, marksheetValues, timerSeconds, uid, stage, isGuidedMode]);

  // Reset helper
  const resetToNewStage = (st: StageConfig, targetUid?: string) => {
    const activeUid = targetUid || st.sampleUid;
    setUid(activeUid);
    const src = generateSyntheticRecord(activeUid);
    setSourceRecord(src);

    // Initialize default blank form values
    const initForm: Record<string, any> = {};
    st.fields.forEach(f => {
      initForm[f.id] = f.defaultValue !== undefined ? f.defaultValue : '';
    });
    setFormValues(initForm);

    // Initialize table rows if stage has table
    if (st.tableSchema) {
      const initRows: Record<string, any>[] = [];
      const count = st.tableSchema.defaultRowsCount || 4;
      for (let i = 0; i < count; i++) {
        const rowObj: Record<string, any> = { id: `row-${i + 1}` };
        st.tableSchema.columns.forEach(col => {
          rowObj[col.id] = '';
        });
        initRows.push(rowObj);
      }
      setTableRows(initRows);
    } else {
      setTableRows([]);
    }

    // Initialize marksheet values
    if (st.marksheetSchema) {
      const initMs: Record<string, any> = {};
      st.marksheetSchema.subjects.forEach(s => {
        initMs[s.code] = { theory: '', oral: '', total: '', grade: '' };
      });
      setMarksheetValues(initMs);
    } else {
      setMarksheetValues({});
    }

    setTimerSeconds(0);
    setValidationSummary(null);
  };

  // Draft Resume / Discard handlers
  const handleResumeDraft = () => {
    if (!pendingDraft) return;
    setUid(pendingDraft.uid);
    setSourceRecord(generateSyntheticRecord(pendingDraft.uid));
    setFormValues(pendingDraft.formValues || {});
    setTableRows(pendingDraft.tableRows || []);
    setMarksheetValues(pendingDraft.marksheetValues || {});
    setTimerSeconds(pendingDraft.timeSeconds || 0);
    setPendingDraft(null);
    setShowInstructions(false);
  };

  const handleDiscardDraft = () => {
    clearStageDraft(stage.levelNumber, stage.stageNumber);
    setPendingDraft(null);
    resetToNewStage(stage);
  };

  // Handle UID load
  const handleLoadUid = (newUid: string) => {
    setUid(newUid);
    const newRecord = generateSyntheticRecord(newUid);
    setSourceRecord(newRecord);
    // Clear draft for this stage on explicit new UID
    clearStageDraft(stage.levelNumber, stage.stageNumber);
    resetToNewStage(stage, newUid);
  };

  // Manual save handler
  const handleManualSave = () => {
    saveStageDraft({
      levelNumber: stage.levelNumber,
      stageNumber: stage.stageNumber,
      uid,
      formValues,
      tableRows,
      marksheetValues,
      timeSeconds: timerSeconds,
      isGuidedMode,
      savedAt: new Date().toISOString()
    });
    playFeedbackSound('click');
    setManualSaveNotification(true);
    setTimeout(() => setManualSaveNotification(false), 2000);
  };

  // Final Submit Handler
  const handleFinalSubmit = () => {
    setShowReviewModal(false);

    const summary = evaluateStageSubmission(
      stage,
      sourceRecord,
      formValues,
      tableRows,
      marksheetValues,
      timerSeconds,
      isGuidedMode,
      validationMode
    );

    // Check achievement unlock
    const { newAchievements, newBatchTitle } = checkUnlockedAchievements(summary, studentProgress);
    summary.unlockedAchievements = newAchievements;
    if (newBatchTitle) summary.newBatchUnlocked = newBatchTitle;

    // Update student progress
    const stageKey = `L${stage.levelNumber}-S${stage.stageNumber}`;
    const prevStageRecord = studentProgress.completedStages[stageKey];

    const updatedProgress: StudentProgress = {
      ...studentProgress,
      totalExp: studentProgress.totalExp + summary.expEarned,
      completedStages: {
        ...studentProgress.completedStages,
        [stageKey]: {
          highestAccuracy: Math.max(prevStageRecord?.highestAccuracy || 0, summary.accuracyPercentage),
          bestTimeSeconds: prevStageRecord 
            ? Math.min(prevStageRecord.bestTimeSeconds, summary.timeTakenSeconds) 
            : summary.timeTakenSeconds,
          attemptsCount: (prevStageRecord?.attemptsCount || 0) + 1,
          completedAt: new Date().toISOString()
        }
      },
      unlockedAchievements: [
        ...studentProgress.unlockedAchievements,
        ...newAchievements.map(a => a.id)
      ],
      currentBatchTitle: newBatchTitle || studentProgress.currentBatchTitle,
      recentAttempts: [summary, ...studentProgress.recentAttempts.slice(0, 19)]
    };

    setStudentProgress(updatedProgress);
    saveStudentProgress(updatedProgress);

    // Clear saved draft on completion
    clearStageDraft(stage.levelNumber, stage.stageNumber);

    // Trigger EXP floating badge animation if earned
    if (summary.expEarned > 0) {
      onExpAwarded(summary.expEarned);
    }

    setValidationSummary(summary);
  };

  // Check next stage existence
  const currentStageIndex = STAGES.findIndex(s => s.levelNumber === stage.levelNumber && s.stageNumber === stage.stageNumber);
  const nextStageConfig = STAGES[currentStageIndex + 1];

  const handleNextStage = () => {
    if (nextStageConfig) {
      onStageChange(nextStageConfig.levelNumber, nextStageConfig.stageNumber);
      setShowInstructions(true);
    }
  };

  // Group fields by section for multi-section stages
  const sections: { name: string; fields: typeof stage.fields }[] = [];
  const uncategorizedFields = stage.fields.filter(f => !f.section);

  if (uncategorizedFields.length > 0) {
    sections.push({ name: 'General Details', fields: uncategorizedFields });
  }

  const distinctSections = Array.from(new Set(stage.fields.map(f => f.section).filter(Boolean))) as string[];
  distinctSections.forEach(secName => {
    sections.push({
      name: secName,
      fields: stage.fields.filter(f => f.section === secName)
    });
  });

  return (
    <div className="workbench-container">
      {/* Autosave Draft Prompt Modal */}
      {pendingDraft && (
        <AutosavePromptModal
          draft={pendingDraft}
          onResume={handleResumeDraft}
          onDiscard={handleDiscardDraft}
        />
      )}

      {/* Stage Instructions Modal */}
      {showInstructions && (
        <StageInstructionsModal
          stage={stage}
          onStart={() => setShowInstructions(false)}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          stage={stage}
          formValues={formValues}
          tableRows={tableRows}
          marksheetValues={marksheetValues}
          onClose={() => setShowReviewModal(false)}
          onFinalSubmit={handleFinalSubmit}
        />
      )}

      {/* If result is ready, display Result Screen */}
      {validationSummary ? (
        <ResultScreen
          summary={validationSummary}
          stage={stage}
          onNextStage={nextStageConfig ? handleNextStage : undefined}
          onRetry={() => resetToNewStage(stage)}
          hasNextStage={!!nextStageConfig}
        />
      ) : (
        <>
          {/* Top UID Search Bar */}
          <UidSearchSection
            currentUid={uid}
            onLoadUid={handleLoadUid}
            sampleUid={stage.sampleUid}
          />

          {/* Workbench Split View (Source reference on Left, Data-Entry form on Right) */}
          <div className="workbench-split">
            {/* Left: Authentic Source Dossier Card */}
            <div>
              <SourceDocumentViewer sourceRecord={sourceRecord} />
            </div>

            {/* Right: Destination Form Panel */}
            <div className="form-panel">
              <div className="form-header-bar">
                <div>
                  <h3 className="form-title">{stage.title}</h3>
                  <div className="form-subtitle">
                    {stage.subtitle} • Target Accuracy: <strong>{stage.requiredAccuracy}%</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleManualSave}
                    title="Save draft to browser storage"
                  >
                    <Save size={13} />
                    <span>{manualSaveNotification ? 'Saved!' : 'Save Draft'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowInstructions(true)}
                    title="View instructions"
                  >
                    <Info size={13} />
                  </button>
                </div>
              </div>

              {/* Form Sections */}
              {sections.map(section => (
                <div key={section.name} style={{ marginBottom: '22px' }}>
                  {sections.length > 1 && (
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--icst-blue-dark)',
                      borderBottom: '2px solid var(--icst-blue-soft)',
                      paddingBottom: '4px',
                      marginBottom: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px'
                    }}>
                      {section.name}
                    </div>
                  )}

                  <div className="form-grid">
                    {section.fields.map(field => (
                      <FieldRenderer
                        key={field.id}
                        field={field}
                        value={formValues[field.id]}
                        onChange={val => setFormValues(prev => ({ ...prev, [field.id]: val }))}
                        sourceRecord={sourceRecord}
                        isGuidedMode={isGuidedMode}
                        validationMode={validationMode}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Tabular Grid (if configured for this stage) */}
              {stage.tableSchema && (
                <TabularEntryGrid
                  columns={stage.tableSchema.columns}
                  rows={tableRows}
                  onChange={setTableRows}
                  sourceRows={sourceRecord.tableRows}
                  isGuidedMode={isGuidedMode}
                  tableName={stage.tableSchema.tableName}
                />
              )}

              {/* Marksheet Grid (if configured for this stage) */}
              {stage.marksheetSchema && (
                <MarksheetGrid
                  schema={stage.marksheetSchema}
                  marksheetValues={marksheetValues}
                  onChange={setMarksheetValues}
                  sourceRecord={sourceRecord}
                  isGuidedMode={isGuidedMode}
                />
              )}

              {/* Bottom Action Controls */}
              <div className="bottom-action-bar">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => resetToNewStage(stage, uid)}
                >
                  <RotateCcw size={14} />
                  <span>Reset Form</span>
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowReviewModal(true)}
                  >
                    <Eye size={15} />
                    <span>REVIEW</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleFinalSubmit}
                  >
                    <Send size={15} />
                    <span>FINAL SUBMIT</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
