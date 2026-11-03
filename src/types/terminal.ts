import { StudentIdentity, Achievement } from './index';

export type TerminalDomain = 
  | 'Treasury e-Challan' 
  | 'Intermodal Freight' 
  | 'Commercial GST' 
  | 'Healthcare TPA' 
  | 'Banking Remittance';

export type TerminalFieldType = 
  | 'text' 
  | 'number' 
  | 'currency' 
  | 'date' 
  | 'alphanumeric' 
  | 'code';

export interface VoucherBoundingBox {
  topPercent: number;    // % from top of voucher
  leftPercent: number;   // % from left of voucher
  widthPercent: number;  // % width
  heightPercent: number; // % height
}

export interface TerminalFieldDefinition {
  id: string;
  label: string;
  fieldType: TerminalFieldType;
  placeholder?: string;
  formatMask?: string;    // e.g. "DD/MM/YYYY" or "AAAAA0000A"
  maxLength?: number;
  autoAdvance?: boolean;
  required?: boolean;
  voucherBox?: VoucherBoundingBox; // Bounding box for spotlight highlighting
  helpTip?: string;
  weight?: number;
}

export type GlyphStatus = 'correct' | 'discrepancy' | 'pending' | 'excess';

export interface DiffGlyph {
  index: number;
  targetChar: string;
  enteredChar: string;
  status: GlyphStatus;
  isCursor: boolean;
}

export interface FieldDiffResult {
  state: 'idle' | 'typing' | 'match' | 'discrepancy';
  glyphs: DiffGlyph[];
  matchedChars: number;
  totalTargetChars: number;
  excessChars: number;
  firstErrorIndex: number | null;
  cursorIndex: number;
  isCompleteMatch: boolean;
}

export interface DiscrepancyTrapConfig {
  hasTrap: boolean;
  trapFieldId?: string;
  trapType?: 'arithmetic_mismatch' | 'expired_date' | 'invalid_checksum' | 'transposed_code' | 'duplicate_record';
  description: string;
  expectedFlag: 'clean' | 'discrepant';
}

export interface TerminalVoucher {
  voucherId: string;
  voucherNumber: string;
  dateStamp: string;
  issuerOrg: string;
  subtitle: string;
  sealText?: string;
  visualData: Record<string, string | number>; // Rendered text on physical document
  expectedValues: Record<string, string>;       // Expected typed values
  debitAmount?: number;
  creditAmount?: number;
  trapConfig: DiscrepancyTrapConfig;
}

export interface TerminalScenario {
  levelNumber: number;
  scenarioId: string;
  title: string;
  domain: TerminalDomain;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Senior Specialist' | 'Grandmaster';
  targetKPH: number;          // e.g., 6000, 8000, 10000, 12000, 15000
  targetAccuracy: number;     // e.g., 90%, 95%, 98%, 100%
  timeLimitSeconds: number;   // e.g., 360s
  expReward: number;          // e.g., 250 EXP
  instructions: string[];
  fields: TerminalFieldDefinition[];
  vouchers: TerminalVoucher[];
  batchControlTotal?: number;
}

export interface DiscrepancyAuditDecision {
  voucherId: string;
  traineeFlag: 'clean' | 'discrepant';
  selectedTrapType?: string;
  operatorNotes?: string;
  isCorrect: boolean;
}

export interface TerminalEvaluationSummary {
  levelNumber: number;
  scenarioTitle: string;
  domain: string;
  totalVouchers: number;
  dispatchedVouchers: number;
  totalFieldsEvaluated: number;
  correctFields: number;
  incorrectFields: number;
  fieldAccuracyPercent: number;
  trapAccuracyPercent: number;
  netScorePercent: number;
  passed: boolean;
  timeTakenSeconds: number;
  calculatedKPH: number;
  netWpm: number;
  backspaceCount: number;
  maxStreak: number;
  expEarned: number;
  decisions: DiscrepancyAuditDecision[];
  unlockedAchievements: Achievement[];
  submittedAt: string;
  studentIdentity?: StudentIdentity;
}

export interface TerminalDraftData {
  levelNumber: number;
  currentVoucherIndex: number;
  entries: Record<string, Record<string, string>>; // [voucherId][fieldId] => string
  discrepancyFlags: Record<string, { flag: 'clean' | 'discrepant'; note?: string }>;
  elapsedSeconds: number;
  totalKeyDepressions: number;
  correctKeyDepressions: number;
  errorDepressions: number;
  backspaceCount: number;
  savedAt: string;
}

export interface TerminalProgress {
  currentLevel: number;
  totalTerminalExp: number;
  highestKPH: number;
  bestNetWpm: number;
  completedScenarios: Record<number, {
    highestAccuracy: number;
    bestKPH: number;
    bestTimeSeconds: number;
    trapCatchRate: number;
    attemptsCount: number;
    completedAt: string;
  }>;
  unlockedAchievements: string[];
  recentEvaluations: TerminalEvaluationSummary[];
}

