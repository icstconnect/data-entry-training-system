// Core Types for ICST Data Entry Lab

export type UserRole = 'student' | 'teacher';

export type ValidationMode = 'STRICT' | 'NORMAL';

export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'decimal'
  | 'email'
  | 'tel'
  | 'date'
  | 'select'
  | 'searchable-select'
  | 'multi-select'
  | 'radio'
  | 'checkbox'
  | 'checkbox-group'
  | 'smart-chips'
  | 'cascading-select'
  | 'structured-id';

export interface SelectOption {
  label: string;
  value: string;
  category?: string;
  subOptions?: SelectOption[]; // For cascading select
}

export interface FieldDefinition {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  dependsOn?: string; // For cascading select
  helpText?: string;
  section?: string;
  weight?: number; // Configurable weighting (default 1)
  min?: number;
  max?: number;
  pattern?: string;
  formatMask?: string;
  defaultValue?: any;
}

export interface TableColumn {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select';
  width?: string;
  required?: boolean;
  options?: SelectOption[];
  min?: number;
  max?: number;
  readOnly?: boolean;
  isTotal?: boolean;
}

export interface TableRowSchema {
  id: string;
  [key: string]: any;
}

export interface MarksheetSubject {
  code: string;
  name: string;
  maxTheory?: number;
  maxPractical?: number;
  maxOral?: number;
  maxTotal: number;
}

export interface MarksheetSchema {
  boardType: 'WBBSE' | 'WBCHSE' | 'CBSE' | 'GENERAL';
  hasTheoryPractical: boolean;
  hasGrades: boolean;
  subjects: MarksheetSubject[];
}

export interface StageConfig {
  levelNumber: number; // 1 to 5
  stageNumber: number;
  title: string;
  subtitle: string;
  requiredAccuracy: number; // 80, 85, 90, 95, 100
  difficulty: 'Beginner' | 'Beginner-Intermediate' | 'Intermediate' | 'Advanced' | 'Expert';
  formType: 'simple-form' | 'multi-section' | 'academic-record' | 'marksheet' | 'tabular-grid' | 'master-challenge';
  description: string;
  instructions: string[];
  fields: FieldDefinition[];
  tableSchema?: {
    columns: TableColumn[];
    defaultRowsCount: number;
    allowAddRow?: boolean;
    tableName: string;
  };
  marksheetSchema?: MarksheetSchema;
  baseExp: number;
  sampleUid: string;
}

export interface LevelInfo {
  levelNumber: number;
  title: string;
  badgeTitle: string;
  requiredAccuracy: number;
  stageCount: number;
  description: string;
  color: string;
}

export interface SourceRecord {
  uid: string;
  studentName: string;
  guardianName: string;
  dob: string;
  gender: string;
  category: string;
  phone: string;
  email: string;
  bloodGroup: string;
  nationality: string;
  motherTongue: string;
  aadhaarNumber: string;
  address: {
    premise: string;
    street: string;
    district: string;
    state: string;
    pinCode: string;
  };
  schoolInfo: {
    schoolName: string;
    schoolCode: string;
    board: string;
    medium: string;
    admissionNumber: string;
    admissionDate: string;
    stream?: string;
  };
  academic: {
    registrationNumber: string;
    rollNumber: string;
    examCenterCode: string;
    examYear: string;
    previousPercentage?: number;
    conduct?: string;
    selectedSubjects?: string[];
    activities?: string[];
  };
  tableRows?: Record<string, any>[];
  marksheet?: {
    subjects: {
      code: string;
      name: string;
      theory?: number;
      practical?: number;
      oral?: number;
      total: number;
      grade?: string;
    }[];
    grandTotal: number;
    overallGrade?: string;
    division?: string;
    resultStatus: 'PASS' | 'COMPARTMENT' | 'DISTINCTION';
  };
  additionalFields?: Record<string, any>;
}

export interface FieldValidationResult {
  fieldId: string;
  label: string;
  sourceValue: any;
  enteredValue: any;
  status: 'correct' | 'incorrect' | 'missing' | 'format_warning';
  errorType?: 'wrong_text' | 'wrong_number' | 'wrong_date' | 'wrong_selection' | 'missing_value' | 'format_error';
  errorMessage?: string;
  weight: number;
  section?: string;
}

export interface CellValidationResult {
  rowId: string | number;
  columnId: string;
  columnLabel: string;
  sourceValue: any;
  enteredValue: any;
  status: 'correct' | 'incorrect' | 'missing';
  errorMessage?: string;
}

export interface StageValidationSummary {
  uid: string;
  levelNumber: number;
  stageNumber: number;
  totalEvaluatedUnits: number;
  correctUnits: number;
  incorrectUnits: number;
  missingUnits: number;
  accuracyPercentage: number;
  requiredAccuracy: number;
  passed: boolean;
  timeTakenSeconds: number;
  expEarned: number;
  isGuidedMode: boolean;
  fieldResults: FieldValidationResult[];
  cellResults: CellValidationResult[];
  unlockedAchievements: Achievement[];
  newBatchUnlocked?: string;
  submittedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badgeLevel: number;
  unlockedAt?: string;
}

export interface BatchTitle {
  levelNumber: number;
  title: string;
  minAccuracy: number;
  description: string;
}

export interface StudentProgress {
  currentLevel: number;
  currentStage: number;
  totalExp: number;
  completedStages: Record<string, { // key: "L1-S1"
    highestAccuracy: number;
    bestTimeSeconds: number;
    attemptsCount: number;
    completedAt: string;
  }>;
  unlockedAchievements: string[]; // achievement IDs
  currentBatchTitle: string;
  recentAttempts: StageValidationSummary[];
}

export interface TeacherTestConfig {
  id: string;
  testName: string;
  levelNumber: number;
  stageNumber: number;
  datasetType: string;
  allowGuidedMode: boolean;
  targetAccuracy: number;
  timeLimitSeconds?: number;
  expMultiplier: number;
  allowRetries: boolean;
  assignedBatches?: string[];
  createdAt: string;
}
