import { 
  TouchTypingProgress, 
  LevelProgressRecord, 
  TouchTypingDraft, 
  EvaluationResult, 
  TouchTypingLevel,
  FingerCode,
  FingerStat
} from '../types/touchTyping';
import { isMasterUnlocked } from './masterUnlockService';
import { awardTaskExp } from './expEngine';

const PROGRESS_STORAGE_KEY = 'icst_touch_typing_progress_v1';
const DRAFT_PREFIX = 'icst_touch_typing_draft_L';
export const TOTAL_TOUCH_TYPING_LEVELS = 25;

export const DEFAULT_TOUCH_TYPING_PROGRESS: TouchTypingProgress = {
  currentLevel: 1,
  maxUnlockedLevel: 1,
  unlockedLevels: [1],
  completedLevels: {},
  levelRecords: {},
  totalTouchTypingExp: 0,
  totalExp: 0,
  masterUnlocked: false,
  bestWpm: 0,
  averageAccuracy: 100,
  totalPracticeTimeSeconds: 0,
  unlockedAchievements: [],
  lastPlayedLevel: 1
};

/**
 * Calculates the maximum unlocked level based on completed levels records.
 * In normal student mode, passing a level unlocks the next level.
 */
export function calculateMaxUnlockedLevel(
  completed: Record<number, LevelProgressRecord>,
  existingMax: number = 1
): number {
  let maxUnlocked = Math.max(1, existingMax);
  Object.keys(completed || {}).forEach(k => {
    const lvl = Number(k);
    if (completed[lvl] && (completed[lvl].passed || completed[lvl].completed)) {
      maxUnlocked = Math.max(maxUnlocked, Math.min(TOTAL_TOUCH_TYPING_LEVELS, lvl + 1));
    }
  });
  return Math.min(TOTAL_TOUCH_TYPING_LEVELS, maxUnlocked);
}

/**
 * Checks whether a specific level is unlocked for the user.
 * If Master Unlock (ICST) is active, all 25 levels are immediately accessible.
 */
export function isTouchTypingLevelUnlocked(
  levelId: number, 
  progress?: TouchTypingProgress
): boolean {
  if (isMasterUnlocked()) return true;
  const currentProgress = progress || loadTouchTypingProgress();
  return levelId <= currentProgress.maxUnlockedLevel;
}

/**
 * Loads the current touch typing progress from localStorage.
 * Automatically synchronizes with master unlock state.
 */
export function loadTouchTypingProgress(): TouchTypingProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const parsed: Partial<TouchTypingProgress> = raw ? JSON.parse(raw) : {};
    const completedLevels: Record<number, LevelProgressRecord> = parsed.completedLevels || parsed.levelRecords || {};

    const masterActive = isMasterUnlocked();
    const existingMax = Math.max(1, Number(parsed.maxUnlockedLevel) || 1);
    const computedMax = calculateMaxUnlockedLevel(completedLevels, existingMax);
    const trueMaxUnlocked = masterActive ? TOTAL_TOUCH_TYPING_LEVELS : computedMax;

    const unlockedLevels = masterActive
      ? Array.from({ length: TOTAL_TOUCH_TYPING_LEVELS }, (_, i) => i + 1)
      : Array.from({ length: trueMaxUnlocked }, (_, i) => i + 1);

    const totalExp = Number(parsed.totalTouchTypingExp || parsed.totalExp) || 0;

    const progress: TouchTypingProgress = {
      currentLevel: Math.min(
        Math.max(1, Number(parsed.currentLevel) || 1),
        trueMaxUnlocked
      ),
      maxUnlockedLevel: trueMaxUnlocked,
      unlockedLevels,
      completedLevels,
      levelRecords: completedLevels,
      totalTouchTypingExp: totalExp,
      totalExp,
      masterUnlocked: masterActive,
      bestWpm: Number(parsed.bestWpm) || 0,
      averageAccuracy: Number(parsed.averageAccuracy) || 100,
      totalPracticeTimeSeconds: Number(parsed.totalPracticeTimeSeconds) || 0,
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
      lastPlayedLevel: parsed.lastPlayedLevel ? Math.max(1, Number(parsed.lastPlayedLevel)) : 1
    };

    return progress;
  } catch (err) {
    console.warn('Failed to load touch typing progress from localStorage:', err);
    return { ...DEFAULT_TOUCH_TYPING_PROGRESS };
  }
}

/**
 * Saves touch typing progress to localStorage and notifies listeners.
 */
export function saveTouchTypingProgress(progress: TouchTypingProgress): void {
  try {
    progress.levelRecords = progress.completedLevels;
    progress.totalExp = progress.totalTouchTypingExp;
    progress.masterUnlocked = isMasterUnlocked();
    progress.unlockedLevels = progress.masterUnlocked
      ? Array.from({ length: TOTAL_TOUCH_TYPING_LEVELS }, (_, i) => i + 1)
      : Array.from({ length: progress.maxUnlockedLevel }, (_, i) => i + 1);

    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('icst_touch_typing_progress_changed', { detail: { progress } })
      );
    }
  } catch (err) {
    console.error('Failed to save touch typing progress:', err);
  }
}

/**
 * Evaluates a completed typing run against level criteria and calculates stats, stars, and exp.
 */
export function evaluateTouchTypingRun(
  level: TouchTypingLevel,
  wpm: number,
  rawWpm: number,
  accuracy: number,
  elapsedSeconds: number,
  totalTyped: number,
  errorCount: number,
  maxStreak: number,
  fingerAccuracy?: Partial<Record<FingerCode, FingerStat>>
): EvaluationResult {
  const failureReasons: string[] = [];
  const { criteria } = level;

  if (wpm < criteria.minWpm) {
    failureReasons.push(`Speed: ${wpm} WPM is below required ${criteria.minWpm} WPM.`);
  }

  if (accuracy < criteria.minAcc) {
    failureReasons.push(`Accuracy: ${accuracy}% is below required ${criteria.minAcc}%.`);
  }

  if (criteria.maxErrors !== null && errorCount > criteria.maxErrors) {
    failureReasons.push(`Errors: ${errorCount} exceeds maximum allowed ${criteria.maxErrors}.`);
  }

  if (criteria.minStreak !== null && maxStreak < criteria.minStreak) {
    failureReasons.push(`Streak: Best streak ${maxStreak} is below required ${criteria.minStreak}.`);
  }

  const passed = failureReasons.length === 0;

  // Star calculation
  let stars = 0;
  if (passed) {
    if (accuracy >= 98 && wpm >= criteria.minWpm + 10) {
      stars = 3;
    } else if (accuracy >= 94 && wpm >= criteria.minWpm + 4) {
      stars = 2;
    } else {
      stars = 1;
    }
  }

  // EXP calculation
  let expEarned = 0;
  if (passed) {
    const baseExp = level.id * 20;
    const starBonus = stars * 15;
    const accuracyBonus = Math.round(accuracy * 0.5);
    expEarned = baseExp + starBonus + accuracyBonus;
  } else {
    // Consolation effort EXP for practice
    expEarned = Math.max(5, Math.round(wpm * 0.5));
  }

  return {
    levelId: level.id,
    passed,
    wpm,
    rawWpm,
    accuracy,
    elapsedSeconds,
    totalTyped,
    errorCount,
    maxStreak,
    stars,
    expEarned,
    failureReasons,
    completedAt: new Date().toISOString(),
    fingerAccuracy
  };
}

/**
 * Saves a completed evaluation record, updates level progress, awards EXP,
 * and unlocks the next level when criteria are satisfied.
 */
export function saveTouchTypingRecord(result: EvaluationResult): TouchTypingProgress {
  const progress = loadTouchTypingProgress();
  const existingRecord = progress.completedLevels[result.levelId];

  const updatedRecord: LevelProgressRecord = {
    levelId: result.levelId,
    bestWpm: Math.max(existingRecord?.bestWpm || 0, result.wpm),
    bestAccuracy: Math.max(existingRecord?.bestAccuracy || 0, result.accuracy),
    bestStreak: Math.max(existingRecord?.bestStreak || 0, result.maxStreak),
    stars: Math.max(existingRecord?.stars || 0, result.stars),
    attempts: (existingRecord?.attempts || 0) + 1,
    passed: Boolean(existingRecord?.passed || result.passed),
    completed: Boolean(existingRecord?.completed || result.passed),
    completedAt: result.completedAt
  };

  progress.completedLevels[result.levelId] = updatedRecord;
  progress.levelRecords[result.levelId] = updatedRecord;
  progress.lastPlayedLevel = result.levelId;
  progress.totalPracticeTimeSeconds += Math.round(result.elapsedSeconds);

  // If passed, compute updated maxUnlockedLevel
  if (result.passed) {
    if (result.levelId >= progress.maxUnlockedLevel && result.levelId < TOTAL_TOUCH_TYPING_LEVELS) {
      progress.maxUnlockedLevel = Math.max(progress.maxUnlockedLevel, result.levelId + 1);
    }
    // Auto-advance current level pointer if next level is unlocked
    if (result.levelId < TOTAL_TOUCH_TYPING_LEVELS) {
      progress.currentLevel = Math.max(progress.currentLevel, result.levelId + 1);
    }
  }

  // Update global metrics
  progress.bestWpm = Math.max(progress.bestWpm, result.wpm);
  
  // Compute overall average accuracy across passed levels
  const passedRecords = Object.values(progress.completedLevels).filter(r => r.passed || r.completed);
  if (passedRecords.length > 0) {
    const accSum = passedRecords.reduce((acc, r) => acc + r.bestAccuracy, 0);
    progress.averageAccuracy = Math.round(accSum / passedRecords.length);
  }

  // Award EXP
  if (result.expEarned > 0) {
    progress.totalTouchTypingExp += result.expEarned;
    progress.totalExp = progress.totalTouchTypingExp;
    try {
      awardTaskExp(result.expEarned, 'typing', {
        details: `Touch Typing Level ${result.levelId}: ${result.passed ? 'Passed' : 'Completed'}`
      });
    } catch (e) {
      console.warn('Failed to dispatch global EXP award:', e);
    }
  }

  // Clear any existing draft for this level
  clearTouchTypingDraft(result.levelId);

  // Save to storage
  saveTouchTypingProgress(progress);
  return progress;
}

/**
 * Unlocks the next touch typing level manually
 */
export function unlockNextTouchTypingLevel(currentLevelId: number): number {
  const progress = loadTouchTypingProgress();
  const nextLevel = Math.min(TOTAL_TOUCH_TYPING_LEVELS, currentLevelId + 1);
  if (nextLevel > progress.maxUnlockedLevel) {
    progress.maxUnlockedLevel = nextLevel;
    saveTouchTypingProgress(progress);
  }
  return progress.maxUnlockedLevel;
}

/**
 * Saves mid-session draft data
 */
export function saveTouchTypingDraft(draft: TouchTypingDraft): void {
  try {
    localStorage.setItem(`${DRAFT_PREFIX}${draft.levelId}`, JSON.stringify(draft));
  } catch (err) {
    console.warn('Failed to save touch typing draft:', err);
  }
}

/**
 * Loads saved mid-session draft data
 */
export function loadTouchTypingDraft(levelId: number): TouchTypingDraft | null {
  try {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${levelId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Clears draft for a given level
 */
export function clearTouchTypingDraft(levelId: number): void {
  try {
    localStorage.removeItem(`${DRAFT_PREFIX}${levelId}`);
  } catch {}
}

/**
 * Resets all touch typing progress and clears drafts
 */
export function resetTouchTypingProgress(): void {
  try {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    for (let i = 1; i <= TOTAL_TOUCH_TYPING_LEVELS; i++) {
      clearTouchTypingDraft(i);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('icst_touch_typing_progress_changed', {
          detail: { progress: { ...DEFAULT_TOUCH_TYPING_PROGRESS } }
        })
      );
    }
  } catch (err) {
    console.error('Failed to reset touch typing progress:', err);
  }
}
