import { StudentProgress, UserRole } from '../types';
import { loadStudentProgress, saveStudentProgress } from './storageService';
import { loadExcelProgress } from './excelStorageService';
import { loadWindowsProgress } from './windowsStorageService';

export interface ExpAwardResult {
  amountAwarded: number;
  newTotalExp: number;
  previousTotalExp: number;
  currentRank: string;
  nextRank: string;
  progressToNextRank: number; // 0 to 100
  source: 'practice' | 'excel' | 'windows';
}

export interface OperatorRank {
  minExp: number;
  title: string;
  badge: string;
  color: string;
  description: string;
}

export const OPERATOR_RANKS: OperatorRank[] = [
  {
    minExp: 0,
    title: 'Data Entry Trainee',
    badge: 'Trainee',
    color: '#94a3b8',
    description: 'Beginning foundation training across entry fields and interfaces.'
  },
  {
    minExp: 500,
    title: 'Certified Junior Operator',
    badge: 'Junior',
    color: '#38bdf8',
    description: 'Consistent accuracy across multi-field dossiers and commercial tables.'
  },
  {
    minExp: 1500,
    title: 'Senior Verification Specialist',
    badge: 'Senior Specialist',
    color: '#818cf8',
    description: 'Expertise in high-density marksheets and multi-column spreadsheets.'
  },
  {
    minExp: 3000,
    title: 'Executive Data & Spreadsheet Analyst',
    badge: 'Executive Analyst',
    color: '#10b981',
    description: 'Mastery of rapid tabular batch processing and directory architectures.'
  },
  {
    minExp: 5000,
    title: 'Grandmaster Systems Registrar',
    badge: 'Grandmaster',
    color: '#fbbf24',
    description: 'Peak institutional data authority with zero-error character fidelity.'
  }
];

export function getRankForExp(exp: number): {
  currentRank: OperatorRank;
  nextRank: OperatorRank | null;
  progressPercent: number;
} {
  let currentRank = OPERATOR_RANKS[0];
  let nextRank: OperatorRank | null = OPERATOR_RANKS[1];

  for (let i = OPERATOR_RANKS.length - 1; i >= 0; i--) {
    if (exp >= OPERATOR_RANKS[i].minExp) {
      currentRank = OPERATOR_RANKS[i];
      nextRank = OPERATOR_RANKS[i + 1] || null;
      break;
    }
  }

  let progressPercent = 100;
  if (nextRank) {
    const range = nextRank.minExp - currentRank.minExp;
    const gained = exp - currentRank.minExp;
    progressPercent = Math.min(100, Math.max(0, Math.round((gained / range) * 100)));
  }

  return { currentRank, nextRank, progressPercent };
}

/**
 * Unified EXP Engine: Awards EXP for ANY task across Practice, Excel, or Windows,
 * synchronizes global storage, and updates operator rankings.
 */
export function awardTaskExp(
  amount: number,
  source: 'practice' | 'excel' | 'windows',
  options?: { alreadyAddedToTotal?: boolean; details?: string }
): ExpAwardResult {
  const currentProgress = loadStudentProgress();
  const previousTotalExp = currentProgress.totalExp || 0;
  const newTotalExp = options?.alreadyAddedToTotal 
    ? previousTotalExp 
    : previousTotalExp + Math.max(0, amount);

  const { currentRank, nextRank, progressPercent } = getRankForExp(newTotalExp);

  const updatedProgress: StudentProgress = {
    ...currentProgress,
    totalExp: newTotalExp,
    currentBatchTitle: currentRank.title
  };

  saveStudentProgress(updatedProgress);

  // Dispatch custom window event so any listeners (Header, Dashboard) update instantly
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('icst_exp_awarded', {
        detail: {
          amount,
          source,
          newTotalExp,
          currentRank: currentRank.title
        }
      })
    );
  }

  return {
    amountAwarded: amount,
    newTotalExp,
    previousTotalExp,
    currentRank: currentRank.title,
    nextRank: nextRank ? nextRank.title : currentRank.title,
    progressToNextRank: progressPercent,
    source
  };
}

/**
 * Deterministically aggregates total EXP earned across all 3 modules
 */
export function calculateGlobalExpBreakdown(): {
  practiceExp: number;
  excelExp: number;
  windowsExp: number;
  totalExp: number;
} {
  const student = loadStudentProgress();
  const excel = loadExcelProgress();
  const win = loadWindowsProgress();

  const excelExp = excel.totalExcelExp || 0;
  const windowsExp = win.totalWindowsExp || 0;
  
  // Practice EXP is the difference or the student progress total
  const totalExp = Math.max(student.totalExp || 0, excelExp + windowsExp);
  const practiceExp = Math.max(0, totalExp - (excelExp + windowsExp));

  return {
    practiceExp,
    excelExp,
    windowsExp,
    totalExp
  };
}
