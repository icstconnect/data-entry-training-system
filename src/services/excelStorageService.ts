import { ExcelProgress, ExcelEvaluationSummary, ExcelDraftData, ExcelScenarioLevel } from '../types/excel';
import { StudentIdentity, Achievement } from '../types';
import { EXCEL_ACHIEVEMENTS, EXCEL_LEVELS } from '../data/excelScenariosData';

const EXCEL_PROGRESS_KEY = 'icst_excel_progress_v1';
const EXCEL_DRAFT_PREFIX = 'icst_excel_draft_L';

const DEFAULT_EXCEL_PROGRESS: ExcelProgress = {
  currentLevel: 1,
  totalExcelExp: 0,
  completedLevels: {},
  unlockedAchievements: [],
  recentEvaluations: []
};

export function loadExcelProgress(): ExcelProgress {
  try {
    const raw = localStorage.getItem(EXCEL_PROGRESS_KEY);
    if (!raw) return DEFAULT_EXCEL_PROGRESS;
    const parsed = JSON.parse(raw);
    const base: ExcelProgress = { ...DEFAULT_EXCEL_PROGRESS, ...parsed };
    return syncExcelAchievements(base);
  } catch (e) {
    console.error('Failed to load excel progress', e);
    return DEFAULT_EXCEL_PROGRESS;
  }
}

export function saveExcelProgress(progress: ExcelProgress): void {
  try {
    localStorage.setItem(EXCEL_PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save excel progress', e);
  }
}

export function loadExcelDraft(levelNumber: number): ExcelDraftData | null {
  try {
    const raw = localStorage.getItem(`${EXCEL_DRAFT_PREFIX}${levelNumber}`);
    if (!raw) return null;
    return JSON.parse(raw) as ExcelDraftData;
  } catch (e) {
    return null;
  }
}

export function saveExcelDraft(draft: ExcelDraftData): void {
  try {
    localStorage.setItem(`${EXCEL_DRAFT_PREFIX}${draft.levelNumber}`, JSON.stringify(draft));
  } catch (e) {
    console.error('Failed to save excel draft', e);
  }
}

/**
 * Normalizes values for comparison (case-insensitive, trims trailing spaces, standardizes decimals)
 */
function normalizeExcelVal(val: any): string {
  if (val === undefined || val === null) return '';
  let str = String(val).trim();
  // Strip currency symbols if present
  str = str.replace(/[₹$,]/g, '').trim();
  // Normalize consecutive spaces
  str = str.replace(/\s+/g, ' ');
  return str.toLowerCase();
}

/**
 * Validates the student's entered grid data against the official source records
 */
export function evaluateExcelBatch(
  level: ExcelScenarioLevel,
  gridData: Record<string, string>, // key: "row_col", e.g. "0_0": "val"
  elapsedSeconds: number,
  studentIdentity?: StudentIdentity
): ExcelEvaluationSummary {
  const totalRows = level.sourceRecords.length;
  const totalCols = level.columns.length;
  const totalCells = totalRows * totalCols;

  let correctCells = 0;
  let incorrectCells = 0;
  let missingCells = 0;
  let totalKeystrokes = 0;

  const discrepancies: ExcelEvaluationSummary['discrepancies'] = [];

  for (let r = 0; r < totalRows; r++) {
    const sourceRow = level.sourceRecords[r];

    for (let c = 0; c < totalCols; c++) {
      const colDef = level.columns[c];
      const sourceVal = String(sourceRow[colDef.id] ?? '');
      const cellKey = `${r}_${c}`;
      const enteredVal = String(gridData[cellKey] ?? '').trim();

      totalKeystrokes += enteredVal.length;

      const normSource = normalizeExcelVal(sourceVal);
      const normEntered = normalizeExcelVal(enteredVal);

      if (enteredVal === '') {
        missingCells++;
        discrepancies.push({
          row: r + 1,
          colLetter: colDef.colLetter,
          header: colDef.header,
          sourceVal,
          enteredVal: '(empty)',
          status: 'missing'
        });
      } else if (normSource === normEntered) {
        correctCells++;
      } else {
        incorrectCells++;
        discrepancies.push({
          row: r + 1,
          colLetter: colDef.colLetter,
          header: colDef.header,
          sourceVal,
          enteredVal,
          status: 'incorrect'
        });
      }
    }
  }

  const accuracyPercentage = totalCells > 0 ? Math.round((correctCells / totalCells) * 1000) / 10 : 0;
  const passed = accuracyPercentage >= level.targetAccuracy;

  // Keystrokes Per Hour (KPH) standard metric
  const minutes = Math.max(elapsedSeconds / 60, 0.1);
  const kph = Math.round((totalKeystrokes / minutes) * 60);

  // EXP formula based on accuracy and completion
  let expEarned = 0;
  if (passed) {
    const accMultiplier = accuracyPercentage / 100;
    expEarned = Math.round(level.expReward * accMultiplier);
    if (accuracyPercentage === 100) {
      expEarned += 50; // Perfect bonus
    }
  }

  // Check Newly Unlocked Achievements
  const unlockedAchievements: Achievement[] = [];
  const currentProgress = loadExcelProgress();
  const alreadyUnlocked = new Set(currentProgress.unlockedAchievements);

  if (passed) {
    // 1. Spreadsheet Starter (Level 1 pass)
    if (level.levelNumber === 1 && !alreadyUnlocked.has('excel_novice_grid')) {
      const ach = EXCEL_ACHIEVEMENTS.find(a => a.id === 'excel_novice_grid')!;
      unlockedAchievements.push({ ...ach, unlockedAt: new Date().toISOString() });
      alreadyUnlocked.add('excel_novice_grid');
    }

    // 2. Commercial Inventory Specialist (Level 2 pass)
    if (level.levelNumber === 2 && !alreadyUnlocked.has('excel_commercial_master')) {
      const ach = EXCEL_ACHIEVEMENTS.find(a => a.id === 'excel_commercial_master')!;
      unlockedAchievements.push({ ...ach, unlockedAt: new Date().toISOString() });
      alreadyUnlocked.add('excel_commercial_master');
    }

    // 3. Banking KYC Ledger Master (Level 3 pass)
    if (level.levelNumber === 3 && !alreadyUnlocked.has('excel_banking_kyc')) {
      const ach = EXCEL_ACHIEVEMENTS.find(a => a.id === 'excel_banking_kyc')!;
      unlockedAchievements.push({ ...ach, unlockedAt: new Date().toISOString() });
      alreadyUnlocked.add('excel_banking_kyc');
    }

    // 4. Board Marksheet Maestro (Level 4 pass with >=95%)
    if (level.levelNumber === 4 && accuracyPercentage >= 95 && !alreadyUnlocked.has('excel_board_marksheet')) {
      const ach = EXCEL_ACHIEVEMENTS.find(a => a.id === 'excel_board_marksheet')!;
      unlockedAchievements.push({ ...ach, unlockedAt: new Date().toISOString() });
      alreadyUnlocked.add('excel_board_marksheet');
    }

    // 5. Grandmaster Excel Registrar (Level 5 pass with 100%)
    if (level.levelNumber === 5 && accuracyPercentage === 100 && !alreadyUnlocked.has('excel_census_grandmaster')) {
      const ach = EXCEL_ACHIEVEMENTS.find(a => a.id === 'excel_census_grandmaster')!;
      unlockedAchievements.push({ ...ach, unlockedAt: new Date().toISOString() });
      alreadyUnlocked.add('excel_census_grandmaster');
    }
  }

  // Update Progress in localStorage
  const existingLevelRecord = currentProgress.completedLevels[level.levelNumber];
  const updatedCompletedLevels = {
    ...currentProgress.completedLevels,
    [level.levelNumber]: {
      highestAccuracy: Math.max(existingLevelRecord?.highestAccuracy || 0, accuracyPercentage),
      bestTimeSeconds: existingLevelRecord ? Math.min(existingLevelRecord.bestTimeSeconds, elapsedSeconds) : elapsedSeconds,
      attemptsCount: (existingLevelRecord?.attemptsCount || 0) + 1,
      completedAt: new Date().toISOString()
    }
  };

  const updatedProgress: ExcelProgress = {
    ...currentProgress,
    totalExcelExp: currentProgress.totalExcelExp + expEarned,
    completedLevels: updatedCompletedLevels,
    unlockedAchievements: Array.from(alreadyUnlocked),
    recentEvaluations: [
      {
        levelNumber: level.levelNumber,
        scenarioName: level.scenarioName,
        totalCells,
        correctCells,
        incorrectCells,
        missingCells,
        accuracyPercentage,
        requiredAccuracy: level.targetAccuracy,
        passed,
        timeTakenSeconds: elapsedSeconds,
        kph,
        expEarned,
        discrepancies: discrepancies.slice(0, 50),
        unlockedAchievements,
        submittedAt: new Date().toISOString(),
        studentIdentity
      },
      ...currentProgress.recentEvaluations.slice(0, 19)
    ]
  };

  saveExcelProgress(updatedProgress);

  return {
    levelNumber: level.levelNumber,
    scenarioName: level.scenarioName,
    totalCells,
    correctCells,
    incorrectCells,
    missingCells,
    accuracyPercentage,
    requiredAccuracy: level.targetAccuracy,
    passed,
    timeTakenSeconds: elapsedSeconds,
    kph,
    expEarned,
    discrepancies,
    unlockedAchievements,
    submittedAt: new Date().toISOString(),
    studentIdentity
  };
}

/**
 * Synchronizes unlocked Excel achievements based on completed level records
 */
export function syncExcelAchievements(progress: ExcelProgress): ExcelProgress {
  const unlocked = new Set(progress.unlockedAchievements || []);
  let changed = false;

  // Level 1
  if (!unlocked.has('excel_novice_grid')) {
    if (progress.completedLevels[1]?.highestAccuracy >= 80) {
      unlocked.add('excel_novice_grid');
      changed = true;
    }
  }

  // Level 2
  if (!unlocked.has('excel_commercial_master')) {
    if (progress.completedLevels[2]?.highestAccuracy >= 85) {
      unlocked.add('excel_commercial_master');
      changed = true;
    }
  }

  // Level 3
  if (!unlocked.has('excel_banking_kyc')) {
    if (progress.completedLevels[3]?.highestAccuracy >= 90) {
      unlocked.add('excel_banking_kyc');
      changed = true;
    }
  }

  // Level 4
  if (!unlocked.has('excel_board_marksheet')) {
    if (progress.completedLevels[4]?.highestAccuracy >= 95) {
      unlocked.add('excel_board_marksheet');
      changed = true;
    }
  }

  // Level 5
  if (!unlocked.has('excel_census_grandmaster')) {
    if (progress.completedLevels[5]?.highestAccuracy === 100) {
      unlocked.add('excel_census_grandmaster');
      changed = true;
    }
  }

  if (changed) {
    const updated = {
      ...progress,
      unlockedAchievements: Array.from(unlocked)
    };
    saveExcelProgress(updated);
    return updated;
  }

  return progress;
}
