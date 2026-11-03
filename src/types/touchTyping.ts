/**
 * Touch Typing Lab - Type Definitions & Interfaces
 * Provides strongly-typed models for keyboard geometry, finger tracking,
 * 25-level curriculum, live statistics, and evaluation.
 */

export type FingerCode = 
  | 'LP'    // Left Pinky
  | 'LR'    // Left Ring
  | 'LM'    // Left Middle
  | 'LI'    // Left Index
  | 'THUMB' // Thumbs (Spacebar)
  | 'RI'    // Right Index
  | 'RM'    // Right Middle
  | 'RR'    // Right Ring
  | 'RP';   // Right Pinky

export type FingerId = FingerCode;
export type HandId = 'left' | 'right' | 'both' | 'thumb';
export type TypingTheme = 'light' | 'dark';

export interface FingerMetaItem {
  name: string;
  short: string;
  beamCenterPct: number;
  hand?: HandId;
  color?: string;
  colorVar?: string;
}

export type FingerInfo = FingerMetaItem;

export interface KeyDefinition {
  id: string;
  label: string;
  shift?: string;
  x: number;
  w: number;
  finger: FingerCode;
  isSpecial?: boolean;
  isSpace?: boolean;
  home?: boolean;
  bump?: boolean;
}

export type KeyDef = KeyDefinition;

export interface CharMeta extends KeyDefinition {
  rowIndex: number;
  centerPct: number;
  widthPct: number;
  display: string;
  needsShift: 'ShiftLeft' | 'ShiftRight' | null;
  shiftFinger?: FingerCode;
}

export type CharLookupDef = CharMeta;

export interface LevelCriteria {
  minWpm: number;
  minAcc: number;
  maxErrors: number | null;
  minStreak: number | null;
}

export interface TouchTypingLevel {
  id: number;
  stage: number;
  stageName: string;
  title: string;
  subtitle: string;
  focusKeys: string[];
  text: string;
  criteria: LevelCriteria;
  criteriaDesc: string;
}

export type TypingLevel = TouchTypingLevel;

export interface TouchTypingStage {
  id: number;
  name: string;
  description: string;
  levelRange: [number, number];
}

export interface FingerStat {
  finger: FingerCode;
  totalHits: number;
  correctHits: number;
  accuracy: number;
}

export interface LiveTypingStats {
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number;
  streak: number;
  maxStreak: number;
  errorCount: number;
  correctCount: number;
  totalTyped: number;
  elapsedSeconds: number;
  progressPercent: number;
}

export type TypingStats = LiveTypingStats;

export interface EvaluationResult {
  levelId: number;
  passed: boolean;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  elapsedSeconds: number;
  totalTyped: number;
  errorCount: number;
  maxStreak: number;
  stars: number; // 0 to 3
  expEarned: number;
  failureReasons: string[];
  completedAt: string;
  fingerAccuracy?: Partial<Record<FingerCode, FingerStat>>;
}

export interface LevelProgressRecord {
  levelId: number;
  bestWpm: number;
  bestAccuracy: number;
  bestStreak: number;
  stars: number;
  completedAt: string;
  attempts: number;
  passed: boolean;
  completed: boolean;
  unlockedAt?: string;
}

export interface TouchTypingDraft {
  levelId: number;
  typedText: string;
  elapsedSeconds: number;
  errorCount: number;
  savedAt: string;
}

export interface TouchTypingProgress {
  currentLevel: number;
  maxUnlockedLevel: number;
  unlockedLevels: number[];
  completedLevels: Record<number, LevelProgressRecord>;
  levelRecords: Record<number, LevelProgressRecord>;
  totalTouchTypingExp: number;
  totalExp: number;
  masterUnlocked: boolean;
  bestWpm: number;
  averageAccuracy: number;
  totalPracticeTimeSeconds: number;
  unlockedAchievements: string[];
  lastPlayedLevel?: number;
}

export type TypingUserProgress = TouchTypingProgress;
