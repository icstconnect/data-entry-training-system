import {
  WordExpressEvaluationResult,
  WordExpressLevel,
  WordExpressLevelRecord,
  WordExpressProgress,
  WordToughness
} from '../types/wordExpress';
import { FingerCode, FingerStat } from '../types/touchTyping';
import { getCriteriaForToughness } from '../data/wordExpressData';
import { isMasterUnlocked } from './masterUnlockService';
import { awardTaskExp } from './expEngine';

const PROGRESS_STORAGE_KEY = 'icst_word_express_progress_v1';
export const WORD_EXPRESS_TOUGHNESS_COOKIE = 'icst_word_express_toughness';
export const TOTAL_WORD_EXPRESS_LEVELS = 25;

export const DEFAULT_WORD_EXPRESS_PROGRESS: WordExpressProgress = {
  currentLevel: 1,
  maxUnlockedLevel: 1,
  unlockedLevels: [1],
  completedLevels: {},
  totalWordExpressExp: 0,
  bestWpm: 0,
  averageAccuracy: 100,
  highestCarrierTier: 1,
  totalPracticeTimeSeconds: 0,
  lastPlayedLevel: 1
};

// ============================================================================
// COOKIE PERSISTENCE FOR LAB TOUGHNESS (easy | moderate | hard)
// ============================================================================
export function getWordExpressToughnessCookie(): WordToughness {
  if (typeof document === 'undefined') return 'moderate';
  try {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const entry of cookies) {
      const idx = entry.indexOf('=');
      if (idx === -1) continue;
      const name = decodeURIComponent(entry.slice(0, idx).trim());
      if (name === WORD_EXPRESS_TOUGHNESS_COOKIE) {
        const val = decodeURIComponent(entry.slice(idx + 1).trim());
        if (val === 'easy' || val === 'moderate' || val === 'hard') {
          return val;
        }
      }
    }
  } catch {
    // Fallback to default moderate
  }
  return 'moderate';
}

export function setWordExpressToughnessCookie(toughness: WordToughness): void {
  if (typeof document === 'undefined') return;
  try {
    const maxAgeSeconds = 60 * 60 * 24 * 365; // 1 year
    document.cookie = `${encodeURIComponent(WORD_EXPRESS_TOUGHNESS_COOKIE)}=${encodeURIComponent(toughness)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('icst_word_express_toughness_changed', { detail: { toughness } })
      );
    }
  } catch (err) {
    console.warn('Failed to write toughness cookie:', err);
  }
}

export function clearWordExpressToughnessCookie(): void {
  if (typeof document === 'undefined') return;
  try {
    document.cookie = `${encodeURIComponent(WORD_EXPRESS_TOUGHNESS_COOKIE)}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('icst_word_express_toughness_changed', { detail: { toughness: 'moderate' } })
      );
    }
  } catch (err) {
    console.warn('Failed to clear toughness cookie:', err);
  }
}

// ============================================================================
// PROGRESS STORAGE & EVALUATION
// ============================================================================
function calculateMaxUnlockedLevel(
  completed: Record<number, WordExpressLevelRecord>,
  existingMax: number = 1
): number {
  let maxUnlocked = Math.max(1, existingMax);
  Object.keys(completed || {}).forEach(k => {
    const lvl = Number(k);
    if (completed[lvl] && (completed[lvl].passed || completed[lvl].completed)) {
      maxUnlocked = Math.max(maxUnlocked, Math.min(TOTAL_WORD_EXPRESS_LEVELS, lvl + 1));
    }
  });
  return Math.min(TOTAL_WORD_EXPRESS_LEVELS, maxUnlocked);
}

export function loadWordExpressProgress(): WordExpressProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const parsed: Partial<WordExpressProgress> = raw ? JSON.parse(raw) : {};
    const completedLevels: Record<number, WordExpressLevelRecord> = parsed.completedLevels || {};

    const masterActive = isMasterUnlocked();
    const existingMax = Math.max(1, Number(parsed.maxUnlockedLevel) || 1);
    const computedMax = calculateMaxUnlockedLevel(completedLevels, existingMax);
    const trueMaxUnlocked = masterActive ? TOTAL_WORD_EXPRESS_LEVELS : computedMax;

    const unlockedLevels = Array.from({ length: trueMaxUnlocked }, (_, i) => i + 1);

    return {
      currentLevel: Math.min(Math.max(1, Number(parsed.currentLevel) || 1), trueMaxUnlocked),
      maxUnlockedLevel: trueMaxUnlocked,
      unlockedLevels,
      completedLevels,
      totalWordExpressExp: Number(parsed.totalWordExpressExp) || 0,
      bestWpm: Number(parsed.bestWpm) || 0,
      averageAccuracy: Number(parsed.averageAccuracy) || 100,
      highestCarrierTier: Math.max(1, Number(parsed.highestCarrierTier) || 1),
      totalPracticeTimeSeconds: Number(parsed.totalPracticeTimeSeconds) || 0,
      lastPlayedLevel: parsed.lastPlayedLevel ? Math.max(1, Number(parsed.lastPlayedLevel)) : 1
    };
  } catch {
    return { ...DEFAULT_WORD_EXPRESS_PROGRESS };
  }
}

export function saveWordExpressProgress(progress: WordExpressProgress): void {
  try {
    const masterActive = isMasterUnlocked();
    progress.unlockedLevels = masterActive
      ? Array.from({ length: TOTAL_WORD_EXPRESS_LEVELS }, (_, i) => i + 1)
      : Array.from({ length: progress.maxUnlockedLevel }, (_, i) => i + 1);

    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('icst_word_express_progress_changed', { detail: { progress } })
      );
    }
  } catch (err) {
    console.error('Failed to save Word Express progress:', err);
  }
}

export function evaluateWordExpressRun(
  level: WordExpressLevel,
  toughness: WordToughness,
  wpm: number,
  rawWpm: number,
  accuracy: number,
  elapsedSeconds: number,
  totalTyped: number,
  wordsCompleted: number,
  errorCount: number,
  maxStreak: number,
  peakCarrierTier: number,
  fingerAccuracy?: Partial<Record<FingerCode, FingerStat>>
): WordExpressEvaluationResult {
  const criteria = getCriteriaForToughness(level, toughness);
  const failureReasons: string[] = [];

  if (wpm < criteria.minWpm) {
    failureReasons.push(`Speed: ${wpm} WPM is below required ${criteria.minWpm} WPM (${toughness}).`);
  }
  if (accuracy < criteria.minAcc) {
    failureReasons.push(`Accuracy: ${accuracy}% is below required ${criteria.minAcc}%.`);
  }
  if (criteria.maxErrors !== null && errorCount > criteria.maxErrors) {
    failureReasons.push(`Errors: ${errorCount} exceeds max allowed ${criteria.maxErrors}.`);
  }
  if (criteria.minStreak !== null && maxStreak < criteria.minStreak) {
    failureReasons.push(`Streak: Best streak ${maxStreak} is below required ${criteria.minStreak}.`);
  }

  const passed = failureReasons.length === 0;

  let stars = 0;
  if (passed) {
    if (accuracy >= Math.min(97, criteria.minAcc + 4) && wpm >= criteria.minWpm + 6) {
      stars = 3;
    } else if (accuracy >= Math.min(93, criteria.minAcc + 2) && wpm >= criteria.minWpm + 3) {
      stars = 2;
    } else {
      stars = 1;
    }
  }

  const toughnessMult = toughness === 'hard' ? 1.25 : toughness === 'easy' ? 0.85 : 1;
  let expEarned = 0;
  if (passed) {
    const baseExp = level.id * 18;
    const starBonus = stars * 14;
    const carrierBonus = peakCarrierTier * 3;
    expEarned = Math.round((baseExp + starBonus + carrierBonus) * toughnessMult);
  } else {
    expEarned = Math.max(6, Math.round(wpm * 0.45));
  }

  return {
    levelId: level.id,
    toughness,
    passed,
    wpm,
    rawWpm,
    accuracy,
    elapsedSeconds,
    totalTyped,
    wordsCompleted,
    errorCount,
    maxStreak,
    peakCarrierTier,
    stars,
    expEarned,
    failureReasons,
    completedAt: new Date().toISOString(),
    fingerAccuracy
  };
}

export function saveWordExpressRecord(result: WordExpressEvaluationResult): WordExpressProgress {
  const progress = loadWordExpressProgress();
  const existing = progress.completedLevels[result.levelId];

  const updatedRecord: WordExpressLevelRecord = {
    levelId: result.levelId,
    bestWpm: Math.max(existing?.bestWpm || 0, result.wpm),
    bestAccuracy: Math.max(existing?.bestAccuracy || 0, result.accuracy),
    bestStreak: Math.max(existing?.bestStreak || 0, result.maxStreak),
    bestCarrierTier: Math.max(existing?.bestCarrierTier || 1, result.peakCarrierTier),
    stars: Math.max(existing?.stars || 0, result.stars),
    attempts: (existing?.attempts || 0) + 1,
    passed: Boolean(existing?.passed || result.passed),
    completed: Boolean(existing?.completed || result.passed),
    lastToughness: result.toughness,
    completedAt: result.completedAt
  };

  progress.completedLevels[result.levelId] = updatedRecord;
  progress.lastPlayedLevel = result.levelId;
  progress.totalPracticeTimeSeconds += Math.round(result.elapsedSeconds);
  progress.highestCarrierTier = Math.max(progress.highestCarrierTier || 1, result.peakCarrierTier);

  if (result.passed) {
    if (result.levelId >= progress.maxUnlockedLevel && result.levelId < TOTAL_WORD_EXPRESS_LEVELS) {
      progress.maxUnlockedLevel = Math.max(progress.maxUnlockedLevel, result.levelId + 1);
    }
    if (result.levelId < TOTAL_WORD_EXPRESS_LEVELS) {
      progress.currentLevel = Math.max(progress.currentLevel, result.levelId + 1);
    }
  }

  progress.bestWpm = Math.max(progress.bestWpm, result.wpm);

  const passedRecords = Object.values(progress.completedLevels).filter(r => r.passed || r.completed);
  if (passedRecords.length > 0) {
    const accSum = passedRecords.reduce((acc, r) => acc + r.bestAccuracy, 0);
    progress.averageAccuracy = Math.round(accSum / passedRecords.length);
  }

  if (result.expEarned > 0) {
    progress.totalWordExpressExp += result.expEarned;
    try {
      awardTaskExp(result.expEarned, 'word-express', {
        details: `Word Express Level ${result.levelId} (${result.toughness}): ${result.passed ? 'Passed' : 'Completed'}`
      });
    } catch (e) {
      console.warn('Failed to dispatch global EXP award:', e);
    }
  }

  saveWordExpressProgress(progress);
  return progress;
}

/**
 * Clears all Word Express localStorage progress AND removes the toughness cookie.
 */
export function resetWordExpressProgress(): void {
  try {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    clearWordExpressToughnessCookie();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('icst_word_express_progress_changed', {
          detail: { progress: { ...DEFAULT_WORD_EXPRESS_PROGRESS } }
        })
      );
    }
  } catch (err) {
    console.error('Failed to reset Word Express progress:', err);
  }
}
