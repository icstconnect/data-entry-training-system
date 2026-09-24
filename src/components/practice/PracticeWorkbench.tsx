import React, { useState, useEffect, useRef } from 'react';
import { 
  StageConfig, 
  SourceRecord, 
  StageValidationSummary, 
  StudentProgress,
  ValidationMode,
  StudentIdentity
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
import { APP_CONFIG } from '../../config/appConfig';

import { UidSearchSection } from './UidSearchSection';
import { SourceDocumentViewer } from './SourceDocumentViewer';
import { FieldRenderer } from '../fields/FieldRenderer';
import { TabularEntryGrid } from '../table/TabularEntryGrid';
import { MarksheetGrid } from '../table/MarksheetGrid';
import { StageInstructionsModal } from './StageInstructionsModal';
import { ReviewModal } from './ReviewModal';
import { ResultScreen } from './ResultScreen';
import { StageTransitionModal } from './StageTransitionModal';
import { AutosavePromptModal } from '../common/AutosavePromptModal';

import { 
  Eye, 
  Send, 
  RotateCcw, 
  Save, 
  Sparkles,
  Info,
  Check,
  ArrowRight,
  FileText,
  Clock,
  ChevronRight
} from 'lucide-react';

interface PracticeWorkbenchProps {
  currentLevel: number;
  currentStage: number;
  onStageChange: (level: number, stage: number) => void;
  studentProgress: StudentProgress;
  setStudentProgress: React.Dispatch<React.SetStateAction<StudentProgress>>;
  isGuidedMode: boolean;
  onExpAwarded: (amount: number) => void;
  onTimerTick?: (elapsed: number, limit: number) => void;
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
  const stagesForThisLevel = STAGES.filter(s => s.levelNumber === stage.levelNumber);
  const isFinalStage = stage.stageNumber === stagesForThisLevel.length;
  const timeLimitSeconds = stage.timeLimitSeconds || APP_CONFIG.DEFAULT_TIME_LIMIT_SECONDS;

  const [uid, setUid] = useState<string>(stage.sampleUid);
  const [sourceRecord, setSourceRecord] = useState<SourceRecord>(() => generateSyntheticRecord(stage.sampleUid));
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [tableRows, setTableRows] = useState<Record<string, any>[]>([]);
  const [marksheetValues, setMarksheetValues] = useState<Record<string, any>>({});

  const [timerElapsedSeconds, setTimerElapsedSeconds] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [validationSummary, setValidationSummary] = useState<StageValidationSummary | null>(null);
  const [stageTransitionData, setStageTransitionData] = useState<{ completedStage: number; nextStage: number } | null>(null);

  const [pendingDraft, setPendingDraft] = useState<StageDraft | null>(null);
  const [validationMode, setValidationMode] = useState<ValidationMode>('NORMAL');
  const [manualSaveNotification, setManualSaveNotification] = useState<boolean>(false);

  // Mobile Reference Drawer toggle
  const [isMobileReferenceOpen, setIsMobileReferenceOpen] = useState<boolean>(false);

  // Initialize or check for autosave draft
  useEffect(() => {
    const draft = loadStageDraft(stage.levelNumber, stage.stageNumber);
    if (draft) {
      setPendingDraft(draft);
    } else {
      resetToNewStage(stage);
    }
  }, [stage.levelNumber, stage.stageNumber]);

  // Timer loop - counts upward (Time Elapsed)
  useEffect(() => {
    if (showInstructions || validationSummary || stageTransitionData) return;
    const interval = setInterval(() => {
      setTimerElapsedSeconds(prev => {
        const next = prev + 1;
        if (onTimerTick) onTimerTick(next, timeLimitSeconds);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showInstructions, validationSummary, stageTransitionData, timeLimitSeconds]);

  // Periodic autosave every 3 seconds
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
        timeSeconds: timerElapsedSeconds,
        isGuidedMode,
        savedAt: new Date().toISOString()
      });
    }, 3000);
    return () => clearTimeout(timeout);
  }, [formValues, tableRows, marksheetValues, timerElapsedSeconds, uid, stage, isGuidedMode]);

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

    setTimerElapsedSeconds(0);
    setValidationSummary(null);
    setStageTransitionData(null);
  };

  // Draft Resume / Discard handlers
  const handleResumeDraft = () => {
    if (!pendingDraft) return;
    setUid(pendingDraft.uid);
    setSourceRecord(generateSyntheticRecord(pendingDraft.uid));
    setFormValues(pendingDraft.formValues || {});
    setTableRows(pendingDraft.tableRows || []);
    setMarksheetValues(pendingDraft.marksheetValues || {});
    setTimerElapsedSeconds(pendingDraft.timeSeconds || 0);
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
      timeSeconds: timerElapsedSeconds,
      isGuidedMode,
      savedAt: new Date().toISOString()
    });
    playFeedbackSound('click');
    setManualSaveNotification(true);
    setTimeout(() => setManualSaveNotification(false), 2000);
  };

  // Stage Advance Handler (either Next Stage or Final Submit)
  const handleAdvance = () => {
    setShowReviewModal(false);

    const summary = evaluateStageSubmission(
      stage,
      sourceRecord,
      formValues,
      tableRows,
      marksheetValues,
      timerElapsedSeconds,
      isGuidedMode,
      validationMode,
      studentProgress.studentIdentity,
      timeLimitSeconds
    );

    // Save attempt record
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
      recentAttempts: [summary, ...studentProgress.recentAttempts.slice(0, 19)]
    };

    clearStageDraft(stage.levelNumber, stage.stageNumber);

    if (!isFinalStage) {
      // Intermediate stage: save progress and show brief transition
      setStudentProgress(updatedProgress);
      saveStudentProgress(updatedProgress);
      setStageTransitionData({
        completedStage: stage.stageNumber,
        nextStage: stage.stageNumber + 1
      });
    } else {
      // Final stage of the level: check achievements and show full ResultScreen
      const { newAchievements, newBatchTitle } = checkUnlockedAchievements(summary, updatedProgress);
      summary.unlockedAchievements = newAchievements;
      if (newBatchTitle) summary.newBatchUnlocked = newBatchTitle;

      const finalProgress: StudentProgress = {
        ...updatedProgress,
        unlockedAchievements: [
          ...updatedProgress.unlockedAchievements,
          ...newAchievements.map(a => a.id)
        ],
        currentBatchTitle: newBatchTitle || updatedProgress.currentBatchTitle
      };

      setStudentProgress(finalProgress);
      saveStudentProgress(finalProgress);

      if (summary.expEarned > 0) {
        onExpAwarded(summary.expEarned);
      }

      setValidationSummary(summary);
    }
  };

  const handleContinueAfterTransition = () => {
    if (stageTransitionData) {
      const nextStg = stageTransitionData.nextStage;
      setStageTransitionData(null);
      onStageChange(stage.levelNumber, nextStg);
      setShowInstructions(false);
    }
  };

  // Next Stage / Next Level helper from ResultScreen
  const currentStageIndex = STAGES.findIndex(s => s.levelNumber === stage.levelNumber && s.stageNumber === stage.stageNumber);
  const nextStageConfig = STAGES[currentStageIndex + 1];

  const handleNextStageFromResult = () => {
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

  // Render fields with prefix + name pairing for compact UX
  const renderFieldList = (fields: typeof stage.fields) => {
    const nodes: React.ReactNode[] = [];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const isPrefix = field.id.toLowerCase().includes('prefix');
      const nextField = fields[i + 1];
      const isNextName = nextField && (nextField.id.toLowerCase().includes('name') || nextField.id.toLowerCase().includes('guardian'));

      if (isPrefix && isNextName) {
        nodes.push(
          <div className="field-prefix-name-row" key={`${field.id}-${nextField.id}-pair`}>
            <div className="field-prefix-wrapper">
              <FieldRenderer
                field={field}
                value={formValues[field.id]}
                onChange={val => setFormValues(prev => ({ ...prev, [field.id]: val }))}
                sourceRecord={sourceRecord}
                isGuidedMode={isGuidedMode}
                validationMode={validationMode}
              />
            </div>
            <div className="field-name-wrapper">
              <FieldRenderer
                field={nextField}
                value={formValues[nextField.id]}
                onChange={val => setFormValues(prev => ({ ...prev, [nextField.id]: val }))}
                sourceRecord={sourceRecord}
                isGuidedMode={isGuidedMode}
                validationMode={validationMode}
              />
            </div>
          </div>
        );
        i++; // skip nextField since it's paired with prefix
      } else {
        nodes.push(
          <FieldRenderer
            key={field.id}
            field={field}
            value={formValues[field.id]}
            onChange={val => setFormValues(prev => ({ ...prev, [field.id]: val }))}
            sourceRecord={sourceRecord}
            isGuidedMode={isGuidedMode}
            validationMode={validationMode}
          />
        );
      }
    }
    return nodes;
  };

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

      {/* Review Modal with Full Form Data */}
      {showReviewModal && (
        <ReviewModal
          stage={stage}
          formValues={formValues}
          tableRows={tableRows}
          marksheetValues={marksheetValues}
          isFinalStage={isFinalStage}
          onClose={() => setShowReviewModal(false)}
          onConfirmAdvance={handleAdvance}
        />
      )}

      {/* Intermediate Stage Transition Modal */}
      {stageTransitionData && (
        <StageTransitionModal
          completedLevelNumber={stage.levelNumber}
          completedStageNumber={stageTransitionData.completedStage}
          nextStageNumber={stageTransitionData.nextStage}
          onContinue={handleContinueAfterTransition}
        />
      )}

      {/* Result Screen (Final Stage) */}
      {validationSummary ? (
        <ResultScreen
          summary={validationSummary}
          stage={stage}
          onNextStage={nextStageConfig ? handleNextStageFromResult : undefined}
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

          {/* Mobile Reference Floating / Top Access Button */}
          <div className="mobile-reference-banner">
            <button
              type="button"
              className="btn btn-primary btn-sm mobile-ref-btn"
              onClick={() => setIsMobileReferenceOpen(true)}
            >
              <FileText size={15} />
              <span>REFERENCE DATA (UID: {uid})</span>
              <ChevronRight size={15} />
            </button>
            <span className="mobile-ref-hint">
              Tap to view source dossier
            </span>
          </div>

          {/* Workbench Layout (Desktop: Side-by-Side; Mobile: Form Primary, Reference in Drawer) */}
          <div className="workbench-split">
            {/* Desktop Left: Sticky Non-Selectable Source Dossier */}
            <div className="desktop-source-pane">
              <SourceDocumentViewer sourceRecord={sourceRecord} />
            </div>

            {/* Mobile Reference Drawer Modal */}
            {isMobileReferenceOpen && (
              <div className="modal-overlay" onClick={() => setIsMobileReferenceOpen(false)}>
                <div 
                  className="modal-card mobile-drawer-card" 
                  onClick={e => e.stopPropagation()}
                >
                  <SourceDocumentViewer 
                    sourceRecord={sourceRecord} 
                    isMobileDrawer={true}
                    onClose={() => setIsMobileReferenceOpen(false)}
                  />
                </div>
              </div>
            )}

            {/* Right / Primary: Destination Form Panel */}
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
                    {renderFieldList(section.fields)}
                  </div>
                </div>
              ))}

              {/* Tabular Grid (if configured for this stage) */}
              {stage.tableSchema && (
                <div className="table-responsive-wrapper">
                  <TabularEntryGrid
                    columns={stage.tableSchema.columns}
                    rows={tableRows}
                    onChange={setTableRows}
                    sourceRows={sourceRecord.tableRows}
                    isGuidedMode={isGuidedMode}
                    tableName={stage.tableSchema.tableName}
                  />
                </div>
              )}

              {/* Marksheet Grid (if configured for this stage) */}
              {stage.marksheetSchema && (
                <div className="table-responsive-wrapper">
                  <MarksheetGrid
                    schema={stage.marksheetSchema}
                    marksheetValues={marksheetValues}
                    onChange={setMarksheetValues}
                    sourceRecord={sourceRecord}
                    isGuidedMode={isGuidedMode}
                  />
                </div>
              )}

              {/* Bottom Action Controls: REVIEW + NEXT STAGE or FINAL SUBMIT */}
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

                  {isFinalStage ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAdvance}
                    >
                      <Send size={15} />
                      <span>FINAL SUBMIT</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAdvance}
                    >
                      <span>NEXT STAGE</span>
                      <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
