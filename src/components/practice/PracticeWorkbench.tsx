import React, { useState, useEffect, useRef } from 'react';
import { 
  StageConfig, 
  SourceRecord, 
  StageValidationSummary, 
  StudentProgress,
  ValidationMode,
  StudentIdentity
} from '../../types';
import { generateSyntheticRecord, generateRandomUid } from '../../services/syntheticDataGenerator';
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
import { isMasterUnlocked } from '../../services/masterUnlockService';
import { Lock, Unlock, Shuffle } from 'lucide-react';

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
  const [sourceRecord, setSourceRecord] = useState<SourceRecord>(() => generateSyntheticRecord(stage.sampleUid, stage.marksheetSchema));
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [tableRows, setTableRows] = useState<Record<string, any>[]>([]);
  const [marksheetValues, setMarksheetValues] = useState<Record<string, any>>({});
  const [masterUnlocked, setMasterUnlockedState] = useState<boolean>(() => isMasterUnlocked());

  useEffect(() => {
    const handleMasterChange = () => setMasterUnlockedState(isMasterUnlocked());
    window.addEventListener('icst_master_unlock_changed', handleMasterChange);
    return () => window.removeEventListener('icst_master_unlock_changed', handleMasterChange);
  }, []);

  const [timerElapsedSeconds, setTimerElapsedSeconds] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [validationSummary, setValidationSummary] = useState<StageValidationSummary | null>(null);
  const [stageTransitionData, setStageTransitionData] = useState<{ completedStage: number; nextStage: number } | null>(null);

  const [pendingDraft, setPendingDraft] = useState<StageDraft | null>(null);
  const [validationMode, setValidationMode] = useState<ValidationMode>('NORMAL');
  const [manualSaveNotification, setManualSaveNotification] = useState<boolean>(false);
  const [randomizeNotification, setRandomizeNotification] = useState<string | null>(null);

  // Mobile Reference Drawer toggle
  const [isMobileReferenceOpen, setIsMobileReferenceOpen] = useState<boolean>(false);

  // Initialize or check for autosave draft
  // Auto-restore cached data from localStorage without deleting or prompt
  useEffect(() => {
    const draft = loadStageDraft(stage.levelNumber, stage.stageNumber);
    if (draft && (Object.keys(draft.formValues || {}).length > 0 || (draft.tableRows && draft.tableRows.length > 0) || (draft.marksheetValues && Object.keys(draft.marksheetValues).length > 0))) {
      setUid(draft.uid);
      setSourceRecord(generateSyntheticRecord(draft.uid, stage.marksheetSchema));
      setFormValues(draft.formValues || {});
      setTableRows(draft.tableRows || []);
      setMarksheetValues(draft.marksheetValues || {});
      setTimerElapsedSeconds(draft.timeSeconds || 0);
      setPendingDraft(null);
    } else {
      const freshUid = generateRandomUid();
      resetToNewStage(stage, freshUid);
    }
  }, [stage.levelNumber, stage.stageNumber]);

  // Handle global data cleared event
  useEffect(() => {
    const handleDataCleared = () => {
      resetToNewStage(stage);
      setTimerElapsedSeconds(0);
      setValidationSummary(null);
      setStageTransitionData(null);
      setShowReviewModal(false);
    };
    window.addEventListener('icst_data_cleared', handleDataCleared);
    return () => window.removeEventListener('icst_data_cleared', handleDataCleared);
  }, [stage]);

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

  // Persistent autosave to localStorage - keeps cached data until Clear Data is clicked
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
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formValues, tableRows, marksheetValues, timerElapsedSeconds, uid, stage, isGuidedMode]);

  // Reset helper
  const resetToNewStage = (st: StageConfig, targetUid?: string) => {
    const activeUid = targetUid || generateRandomUid();
    setUid(activeUid);
    const src = generateSyntheticRecord(activeUid, st.marksheetSchema);
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
    setSourceRecord(generateSyntheticRecord(pendingDraft.uid, stage.marksheetSchema));
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
    resetToNewStage(stage, newUid);
    saveStageDraft({
      levelNumber: stage.levelNumber,
      stageNumber: stage.stageNumber,
      uid: newUid,
      formValues: {},
      timeSeconds: 0,
      isGuidedMode,
      savedAt: new Date().toISOString()
    });
  };

  // Handle Randomize Dossier
  const handleRandomizeDossier = () => {
    let nextUid = generateRandomUid();
    while (nextUid === uid) {
      nextUid = generateRandomUid();
    }
    playFeedbackSound('click');
    handleLoadUid(nextUid);
    const newRecord = generateSyntheticRecord(nextUid, stage.marksheetSchema);
    setRandomizeNotification(`🎲 New Dossier Loaded: ${nextUid} (${newRecord.studentName})`);
    setTimeout(() => setRandomizeNotification(null), 3500);
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

    // Keep cached data in localStorage until Clear Data button is clicked
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

  // Direct In-Place Corrections handler from ReviewModal / ResultScreen
  const handleApplyCorrections = (
    updatedFormValues: Record<string, any>,
    updatedTableRows?: Record<string, any>[],
    updatedMarksheetValues?: Record<string, any>
  ) => {
    setFormValues(updatedFormValues);
    if (updatedTableRows) setTableRows(updatedTableRows);
    if (updatedMarksheetValues) setMarksheetValues(updatedMarksheetValues);

    saveStageDraft({
      levelNumber: stage.levelNumber,
      stageNumber: stage.stageNumber,
      uid,
      formValues: updatedFormValues,
      tableRows: updatedTableRows || tableRows,
      marksheetValues: updatedMarksheetValues || marksheetValues,
      timeSeconds: timerElapsedSeconds,
      isGuidedMode,
      savedAt: new Date().toISOString()
    });

    if (validationSummary) {
      const freshSummary = evaluateStageSubmission(
        stage,
        sourceRecord,
        updatedFormValues,
        updatedTableRows || tableRows,
        updatedMarksheetValues || marksheetValues,
        timerElapsedSeconds,
        isGuidedMode,
        validationMode,
        studentProgress.studentIdentity,
        timeLimitSeconds
      );

      const stageKey = `L${stage.levelNumber}-S${stage.stageNumber}`;
      const prevStageRecord = studentProgress.completedStages[stageKey];
      const { newAchievements, newBatchTitle } = checkUnlockedAchievements(freshSummary, studentProgress);
      freshSummary.unlockedAchievements = newAchievements;
      if (newBatchTitle) freshSummary.newBatchUnlocked = newBatchTitle;

      const additionalExp = Math.max(0, freshSummary.expEarned - (validationSummary.expEarned || 0));

      const updatedProg: StudentProgress = {
        ...studentProgress,
        totalExp: studentProgress.totalExp + additionalExp,
        completedStages: {
          ...studentProgress.completedStages,
          [stageKey]: {
            highestAccuracy: Math.max(prevStageRecord?.highestAccuracy || 0, freshSummary.accuracyPercentage),
            bestTimeSeconds: prevStageRecord 
              ? Math.min(prevStageRecord.bestTimeSeconds, freshSummary.timeTakenSeconds) 
              : freshSummary.timeTakenSeconds,
            attemptsCount: (prevStageRecord?.attemptsCount || 0) + 1,
            completedAt: new Date().toISOString()
          }
        },
        unlockedAchievements: [
          ...studentProgress.unlockedAchievements,
          ...newAchievements.map(a => a.id)
        ],
        currentBatchTitle: newBatchTitle || studentProgress.currentBatchTitle
      };

      setStudentProgress(updatedProg);
      saveStudentProgress(updatedProg);

      if (additionalExp > 0) {
        onExpAwarded(additionalExp);
      }

      setValidationSummary(freshSummary);
      playFeedbackSound('level_up');
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
          sourceRecord={sourceRecord}
          formValues={formValues}
          tableRows={tableRows}
          marksheetValues={marksheetValues}
          isFinalStage={isFinalStage}
          onClose={() => setShowReviewModal(false)}
          onConfirmAdvance={handleAdvance}
          onApplyCorrections={handleApplyCorrections}
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
          sourceRecord={sourceRecord}
          formValues={formValues}
          tableRows={tableRows}
          marksheetValues={marksheetValues}
          onNextStage={nextStageConfig ? handleNextStageFromResult : undefined}
          onRetry={() => resetToNewStage(stage)}
          hasNextStage={!!nextStageConfig}
          onApplyCorrections={handleApplyCorrections}
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
              <SourceDocumentViewer 
                sourceRecord={sourceRecord} 
                onRandomize={handleRandomizeDossier}
              />
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
                    onRandomize={handleRandomizeDossier}
                  />
                </div>
              </div>
            )}

            {/* Right / Primary: Destination Form Panel */}
            <div className="form-panel">
              {randomizeNotification && (
                <div style={{
                  background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                  border: '1px solid #10b981',
                  color: '#065f46',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  marginBottom: '12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
                }}>
                  <Sparkles size={16} color="#059669" />
                  <span>{randomizeNotification}</span>
                </div>
              )}
              {/* Quick Level & Stage Navigator (All Levels & Stages Unlocked) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px',
                marginBottom: '14px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#334155', flexWrap: 'wrap' }}>
                  <span style={{ 
                    background: masterUnlocked ? '#059669' : '#475569', 
                    color: '#fff', 
                    padding: '2px 7px', 
                    borderRadius: '4px', 
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {masterUnlocked ? <Unlock size={11} /> : <Lock size={11} />}
                    {masterUnlocked ? 'MASTER UNLOCKED (ICST)' : 'STUDENT PROGRESSION'}
                  </span>
                  <span>Levels:</span>
                  {[1, 2, 3, 4, 5].map(lvlNum => {
                    const prevStages = STAGES.filter(s => s.levelNumber === lvlNum - 1);
                    const isPrevCompleted = prevStages.length > 0 && prevStages.every(s => !!studentProgress.completedStages[`L${lvlNum - 1}-S${s.stageNumber}`]);
                    const isLvlUnlocked = masterUnlocked || lvlNum === 1 || isPrevCompleted;

                    return (
                      <button
                        key={lvlNum}
                        type="button"
                        disabled={!isLvlUnlocked}
                        onClick={() => {
                          if (isLvlUnlocked) onStageChange(lvlNum, 1);
                        }}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: stage.levelNumber === lvlNum ? '1.5px solid #1c6aa7' : '1px solid #cbd5e1',
                          background: stage.levelNumber === lvlNum ? '#eff6ff' : isLvlUnlocked ? '#ffffff' : '#f1f5f9',
                          color: stage.levelNumber === lvlNum ? '#1c6aa7' : isLvlUnlocked ? '#475569' : '#94a3b8',
                          fontWeight: stage.levelNumber === lvlNum ? 800 : 600,
                          fontSize: '11px',
                          cursor: isLvlUnlocked ? 'pointer' : 'not-allowed',
                          opacity: isLvlUnlocked ? 1 : 0.6,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                        title={isLvlUnlocked ? `Switch to Level ${lvlNum}` : `Level ${lvlNum} locked. Clear Level ${lvlNum - 1} first.`}
                      >
                        {!isLvlUnlocked && <Lock size={10} />}
                        Lvl {lvlNum}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#64748b', flexWrap: 'wrap' }}>
                  <span>Stages:</span>
                  {STAGES.filter(s => s.levelNumber === stage.levelNumber).map(s => {
                    const isStageUnlocked = masterUnlocked || s.stageNumber === 1 || !!studentProgress.completedStages[`L${stage.levelNumber}-S${s.stageNumber - 1}`];

                    return (
                      <button
                        key={s.stageNumber}
                        type="button"
                        disabled={!isStageUnlocked}
                        onClick={() => {
                          if (isStageUnlocked) onStageChange(stage.levelNumber, s.stageNumber);
                        }}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: stage.stageNumber === s.stageNumber ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                          background: stage.stageNumber === s.stageNumber ? '#f0fdf4' : isStageUnlocked ? '#ffffff' : '#f1f5f9',
                          color: stage.stageNumber === s.stageNumber ? '#15803d' : isStageUnlocked ? '#475569' : '#94a3b8',
                          fontWeight: stage.stageNumber === s.stageNumber ? 800 : 500,
                          fontSize: '11px',
                          cursor: isStageUnlocked ? 'pointer' : 'not-allowed',
                          opacity: isStageUnlocked ? 1 : 0.6,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                        title={isStageUnlocked ? `Switch to Stage ${s.stageNumber}` : `Stage ${s.stageNumber} locked. Clear previous stage first.`}
                      >
                        {!isStageUnlocked && <Lock size={10} />}
                        S{s.stageNumber}
                      </button>
                    );
                  })}
                </div>
              </div>

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
                    id="btn-review-modal"
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
