import { StudentIdentity, Achievement } from './index';

export type ExcelDomain = 'Academic' | 'Commercial' | 'Banking' | 'Education Board' | 'Government Census';

export interface ExcelColumnDef {
  id: string;
  colLetter: string; // e.g. "A", "B", "C", "D"...
  header: string; // e.g. "Roll No", "Student Name"
  type: 'text' | 'number' | 'currency' | 'date' | 'phone' | 'email';
  placeholder?: string;
  width?: number; // pixel width
  required?: boolean;
  align?: 'left' | 'center' | 'right';
  format?: string;
}

export interface ExcelScenarioLevel {
  levelNumber: number;
  levelTitle: string;
  scenarioName: string;
  scenarioSubtitle: string;
  description: string;
  domain: ExcelDomain;
  targetAccuracy: number;
  timeLimitSeconds: number;
  expReward: number;
  sheetName: string;
  columns: ExcelColumnDef[];
  sourceRecords: Record<string, any>[];
  tips: string[];
}

export interface ExcelEvaluationSummary {
  levelNumber: number;
  scenarioName: string;
  totalCells: number;
  correctCells: number;
  incorrectCells: number;
  missingCells: number;
  accuracyPercentage: number;
  requiredAccuracy: number;
  passed: boolean;
  timeTakenSeconds: number;
  kph: number; // Keystrokes per hour
  expEarned: number;
  discrepancies: {
    row: number;
    colLetter: string;
    header: string;
    sourceVal: string;
    enteredVal: string;
    status: 'correct' | 'incorrect' | 'missing';
  }[];
  unlockedAchievements: Achievement[];
  submittedAt: string;
  studentIdentity?: StudentIdentity;
}

export interface ExcelDraftData {
  levelNumber: number;
  gridData: Record<string, string>; // key: "row_col", e.g. "0_0": "1001"
  elapsedSeconds: number;
  activeCell: { row: number; col: number };
  savedAt: string;
}

export interface ExcelProgress {
  currentLevel: number;
  totalExcelExp: number;
  completedLevels: Record<number, {
    highestAccuracy: number;
    bestTimeSeconds: number;
    attemptsCount: number;
    completedAt: string;
  }>;
  unlockedAchievements: string[];
  recentEvaluations: ExcelEvaluationSummary[];
}
