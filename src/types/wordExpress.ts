import { FingerCode, FingerStat, LevelCriteria } from './touchTyping';

export type WordToughness = 'easy' | 'moderate' | 'hard';

export type CarrierId =
  | 'human'
  | 'bicycle'
  | 'motorcycle'
  | 'car'
  | 'small-f1'
  | 'f1'
  | 'small-plane'
  | 'medium-plane'
  | 'big-plane'
  | 'fighter'
  | 'supersonic'
  | 'rocket'
  | 'spaceship'
  | 'ufo-1'
  | 'ufo-2'
  | 'ufo-3';

export type CarrierTrackTheme = 'road' | 'race' | 'sky' | 'space';

export interface CarrierTier {
  tier: number; // 1 to 16
  id: CarrierId;
  name: string;
  minStreak: number;
  accent: string;
  glow: string;
  speedTag: string;
  trackTheme: CarrierTrackTheme;
  enterMs: number;
  exitMs: number;
}

export interface WordExpressLevel {
  id: number; // 1 to 25
  stage: number; // 1 to 5
  stageName: string;
  title: string;
  subtitle: string;
  focusKeys: string[];
  words: string[];
  /** Baseline moderate passing criteria (scaled dynamically by easy / moderate / hard toughness) */
  baseWpm: number;
  baseAcc: number;
  baseMaxErrors: number | null;
  baseMinStreak: number | null;
}

export interface WordExpressStageMeta {
  stage: number;
  title: string;
  tagline: string;
  levelRange: [number, number];
  badgeName: string;
  color: string;
}

export interface WordExpressEvaluationResult {
  levelId: number;
  toughness: WordToughness;
  passed: boolean;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  elapsedSeconds: number;
  totalTyped: number;
  wordsCompleted: number;
  errorCount: number;
  maxStreak: number;
  peakCarrierTier: number;
  stars: number; // 0 to 3
  expEarned: number;
  failureReasons: string[];
  completedAt: string;
  fingerAccuracy?: Partial<Record<FingerCode, FingerStat>>;
}

export interface WordExpressLevelRecord {
  levelId: number;
  bestWpm: number;
  bestAccuracy: number;
  bestStreak: number;
  bestCarrierTier: number;
  stars: number;
  attempts: number;
  passed: boolean;
  completed: boolean;
  lastToughness: WordToughness;
  completedAt: string;
}

export interface WordExpressProgress {
  currentLevel: number;
  maxUnlockedLevel: number;
  unlockedLevels: number[];
  completedLevels: Record<number, WordExpressLevelRecord>;
  totalWordExpressExp: number;
  bestWpm: number;
  averageAccuracy: number;
  highestCarrierTier: number;
  totalPracticeTimeSeconds: number;
  lastPlayedLevel?: number;
}

export interface WordExpressResolvedCriteria extends LevelCriteria {
  desc: string;
}
