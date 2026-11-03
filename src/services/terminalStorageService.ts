import { 
  TerminalProgress, 
  TerminalDraftData, 
  TerminalEvaluationSummary, 
  TerminalScenario, 
  DiscrepancyAuditDecision,
  FieldDiffResult,
  DiffGlyph
} from '../types/terminal';
import { StudentIdentity, Achievement } from '../types';
import { TERMINAL_ACHIEVEMENTS } from '../data/terminalScenariosData';
import { awardTaskExp } from './expEngine';

const PROGRESS_KEY = 'icst_terminal_progress_v1';
const DRAFT_PREFIX = 'icst_terminal_draft_L';

const DEFAULT_TERMINAL_PROGRESS: TerminalProgress = {
  currentLevel: 5,
  totalTerminalExp: 0,
  highestKPH: 0,
  bestNetWpm: 0,
  completedScenarios: {},
  unlockedAchievements: [],
  recentEvaluations: []
};

/**
 * Computes character-by-character live discrepancy diff between target string and entered string
 */
export function computeFieldDiff(
  target: string,
  entered: string,
  isFocused: boolean = false
): FieldDiffResult {
  const targetChars = Array.from(target);
  const enteredChars = Array.from(entered);
  const maxLen = Math.max(targetChars.length, enteredChars.length);
  
  const glyphs: DiffGlyph[] = [];
  let matchedChars = 0;
  let firstErrorIndex: number | null = null;
  let excessChars = 0;

  for (let i = 0; i < maxLen; i++) {
    const tChar = targetChars[i] ?? '';
    const eChar = enteredChars[i] ?? '';
    const isCursor = isFocused && i === enteredChars.length;

    if (i < enteredChars.length) {
      if (i < targetChars.length) {
        if (tChar.toLowerCase() === eChar.toLowerCase()) {
          glyphs.push({
            index: i,
            targetChar: tChar,
            enteredChar: eChar,
            status: 'correct',
            isCursor: false
          });
          matchedChars++;
        } else {
          if (firstErrorIndex === null) firstErrorIndex = i;
          glyphs.push({
            index: i,
            targetChar: tChar,
            enteredChar: eChar,
            status: 'discrepancy',
            isCursor: false
          });
        }
      } else {
        if (firstErrorIndex === null) firstErrorIndex = i;
        excessChars++;
        glyphs.push({
          index: i,
          targetChar: '',
          enteredChar: eChar,
          status: 'excess',
          isCursor: false
        });
      }
    } else {
      glyphs.push({
        index: i,
        targetChar: tChar,
        enteredChar: '',
        status: 'pending',
        isCursor
      });
    }
  }

  if (isFocused && enteredChars.length >= maxLen) {
    glyphs.push({
      index: maxLen,
      targetChar: '',
      enteredChar: '',
      status: 'pending',
      isCursor: true
    });
  }

  const isCompleteMatch = entered.trim().toLowerCase() === target.trim().toLowerCase() && target.length > 0;
  let state: FieldDiffResult['state'] = 'idle';

  if (entered.length === 0) {
    state = 'idle';
  } else if (isCompleteMatch) {
    state = 'match';
  } else if (firstErrorIndex !== null) {
    state = 'discrepancy';
  } else {
    state = 'typing';
  }

  return {
    state,
    glyphs,
    matchedChars,
    totalTargetChars: targetChars.length,
    excessChars,
    firstErrorIndex,
    cursorIndex: enteredChars.length,
    isCompleteMatch
  };
}

export function loadTerminalProgress(): TerminalProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_TERMINAL_PROGRESS;
    return { ...DEFAULT_TERMINAL_PROGRESS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load terminal progress', e);
    return DEFAULT_TERMINAL_PROGRESS;
  }
}

export function saveTerminalProgress(progress: TerminalProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save terminal progress', e);
  }
}

export function loadTerminalDraft(level: number): TerminalDraftData | null {
  try {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${level}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveTerminalDraft(draft: TerminalDraftData): void {
  try {
    localStorage.setItem(`${DRAFT_PREFIX}${draft.levelNumber}`, JSON.stringify(draft));
  } catch (e) {
    console.error('Failed to save terminal draft', e);
  }
}

export function clearTerminalDraft(level: number): void {
  try {
    localStorage.removeItem(`${DRAFT_PREFIX}${level}`);
  } catch {}
}

export function clearTerminalProgress(): void {
  try {
    localStorage.removeItem(PROGRESS_KEY);
    for (let i = 1; i <= 5; i++) {
      clearTerminalDraft(i);
    }
  } catch {}
}

/**
 * Evaluates a completed batch of vouchers
 */
export function evaluateTerminalBatch(
  scenario: TerminalScenario,
  entries: Record<string, Record<string, string>>,
  discrepancyFlags: Record<string, { flag: 'clean' | 'discrepant'; note?: string }>,
  elapsedSeconds: number,
  totalKeyDepressions: number,
  backspaceCount: number,
  maxStreak: number,
  studentIdentity?: StudentIdentity
): TerminalEvaluationSummary {
  let totalFieldsEvaluated = 0;
  let correctFields = 0;
  let incorrectFields = 0;
  const decisions: DiscrepancyAuditDecision[] = [];

  let correctTraps = 0;
  const totalTraps = scenario.vouchers.length;

  scenario.vouchers.forEach(voucher => {
    const vEntries = entries[voucher.voucherId] || {};
    
    // Evaluate field correctness
    scenario.fields.forEach(field => {
      totalFieldsEvaluated++;
      const enteredVal = (vEntries[field.id] || '').trim().toLowerCase();
      const expectedVal = (voucher.expectedValues[field.id] || '').trim().toLowerCase();
      
      if (enteredVal === expectedVal && expectedVal !== '') {
        correctFields++;
      } else {
        incorrectFields++;
      }
    });

    // Evaluate trap detection
    const userFlag = discrepancyFlags[voucher.voucherId]?.flag || 'clean';
    const expectedFlag = voucher.trapConfig.expectedFlag;
    const isTrapDecisionCorrect = userFlag === expectedFlag;

    if (isTrapDecisionCorrect) {
      correctTraps++;
    }

    decisions.push({
      voucherId: voucher.voucherId,
      traineeFlag: userFlag,
      selectedTrapType: voucher.trapConfig.trapType,
      operatorNotes: discrepancyFlags[voucher.voucherId]?.note,
      isCorrect: isTrapDecisionCorrect
    });
  });

  const fieldAccuracyPercent = totalFieldsEvaluated > 0 
    ? Math.round((correctFields / totalFieldsEvaluated) * 1000) / 10 
    : 0;

  const trapAccuracyPercent = totalTraps > 0 
    ? Math.round((correctTraps / totalTraps) * 1000) / 10 
    : 100;

  // Composite Score: 70% Field Accuracy + 30% Audit Trap Accuracy
  const netScorePercent = Math.round((fieldAccuracyPercent * 0.7 + trapAccuracyPercent * 0.3) * 10) / 10;

  // Real-world KPH calculation: (totalKeys / elapsedSeconds) * 3600
  const effectiveSeconds = Math.max(elapsedSeconds, 5);
  const calculatedKPH = Math.round((totalKeyDepressions / effectiveSeconds) * 3600);
  const netWpm = Math.max(0, Math.round(((totalKeyDepressions / 5) - (incorrectFields * 2)) / (effectiveSeconds / 60)));

  const passed = netScorePercent >= scenario.targetAccuracy;

  // Calculate EXP Earned
  let expEarned = 0;
  if (passed) {
    const accuracyBonusRatio = netScorePercent / 100;
    const speedRatio = Math.min(1.5, Math.max(0.8, calculatedKPH / scenario.targetKPH));
    expEarned = Math.round(scenario.expReward * accuracyBonusRatio * speedRatio);
    if (trapAccuracyPercent === 100) {
      expEarned += 50; // Bonus for 100% forensic detection
    }
  } else {
    expEarned = Math.round(scenario.expReward * 0.25); // Effort EXP
  }

  // Check achievements
  const currentProgress = loadTerminalProgress();
  const unlockedAchievements: Achievement[] = [];

  const checkAndUnlock = (achId: string) => {
    if (!currentProgress.unlockedAchievements.includes(achId)) {
      const ach = TERMINAL_ACHIEVEMENTS.find(a => a.id === achId);
      if (ach) {
        unlockedAchievements.push(ach);
        currentProgress.unlockedAchievements.push(achId);
      }
    }
  };

  if (passed) {
    checkAndUnlock('terminal_cadence_starter');
  }
  if (trapAccuracyPercent === 100 && scenario.vouchers.some(v => v.trapConfig.hasTrap)) {
    checkAndUnlock('terminal_audit_vigilance');
  }
  if (maxStreak >= 50) {
    checkAndUnlock('terminal_10key_maestro');
  }
  if (calculatedKPH >= 10000) {
    checkAndUnlock('terminal_speed_10k');
  }
  if (fieldAccuracyPercent === 100 && trapAccuracyPercent === 100) {
    checkAndUnlock('terminal_zero_defect_batch');
  }
  if (scenario.levelNumber === 5 && passed && calculatedKPH >= 12000) {
    checkAndUnlock('terminal_grandmaster_registrar');
  }

  const summary: TerminalEvaluationSummary = {
    levelNumber: scenario.levelNumber,
    scenarioTitle: scenario.title,
    domain: scenario.domain,
    totalVouchers: scenario.vouchers.length,
    dispatchedVouchers: scenario.vouchers.length,
    totalFieldsEvaluated,
    correctFields,
    incorrectFields,
    fieldAccuracyPercent,
    trapAccuracyPercent,
    netScorePercent,
    passed,
    timeTakenSeconds: elapsedSeconds,
    calculatedKPH,
    netWpm,
    backspaceCount,
    maxStreak,
    expEarned,
    decisions,
    unlockedAchievements,
    submittedAt: new Date().toISOString(),
    studentIdentity
  };

  // Update master progress
  const existingLevelRecord = currentProgress.completedScenarios[scenario.levelNumber];
  currentProgress.completedScenarios[scenario.levelNumber] = {
    highestAccuracy: Math.max(existingLevelRecord?.highestAccuracy || 0, netScorePercent),
    bestKPH: Math.max(existingLevelRecord?.bestKPH || 0, calculatedKPH),
    bestTimeSeconds: existingLevelRecord ? Math.min(existingLevelRecord.bestTimeSeconds, elapsedSeconds) : elapsedSeconds,
    trapCatchRate: Math.max(existingLevelRecord?.trapCatchRate || 0, trapAccuracyPercent),
    attemptsCount: (existingLevelRecord?.attemptsCount || 0) + 1,
    completedAt: summary.submittedAt
  };

  currentProgress.totalTerminalExp += expEarned;
  currentProgress.highestKPH = Math.max(currentProgress.highestKPH, calculatedKPH);
  currentProgress.bestNetWpm = Math.max(currentProgress.bestNetWpm, netWpm);
  if (passed && scenario.levelNumber < 5 && currentProgress.currentLevel <= scenario.levelNumber) {
    currentProgress.currentLevel = scenario.levelNumber + 1;
  }
  currentProgress.recentEvaluations = [summary, ...currentProgress.recentEvaluations.slice(0, 19)];

  saveTerminalProgress(currentProgress);
  clearTerminalDraft(scenario.levelNumber);

  // Sync EXP with central student profile
  if (expEarned > 0) {
    awardTaskExp(expEarned, 'terminal', { details: `${scenario.domain} Level ${scenario.levelNumber}` });
  }

  return summary;
}

