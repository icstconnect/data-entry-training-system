import { StudentProgress, StageValidationSummary, TeacherTestConfig } from '../types';

const PROGRESS_KEY = 'icst_data_entry_progress_v1';
const DRAFT_KEY_PREFIX = 'icst_data_entry_draft_';
const TEACHER_TESTS_KEY = 'icst_teacher_tests_v1';

export interface StageDraft {
  levelNumber: number;
  stageNumber: number;
  uid: string;
  formValues: Record<string, any>;
  tableRows?: Record<string, any>[];
  marksheetValues?: Record<string, any>;
  timeSeconds: number;
  isGuidedMode: boolean;
  savedAt: string;
}

const DEFAULT_PROGRESS: StudentProgress = {
  currentLevel: 1,
  currentStage: 1,
  totalExp: 0,
  completedStages: {},
  unlockedAchievements: [],
  currentBatchTitle: 'Data Entry Starter',
  recentAttempts: []
};

export function loadStudentProgress(): StudentProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load progress from localStorage', e);
    return DEFAULT_PROGRESS;
  }
}

export function saveStudentProgress(progress: StudentProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function saveStageDraft(draft: StageDraft): void {
  try {
    const key = `${DRAFT_KEY_PREFIX}L${draft.levelNumber}_S${draft.stageNumber}`;
    localStorage.setItem(key, JSON.stringify(draft));
  } catch (e) {
    console.error('Failed to save stage draft', e);
  }
}

export function loadStageDraft(levelNumber: number, stageNumber: number): StageDraft | null {
  try {
    const key = `${DRAFT_KEY_PREFIX}L${levelNumber}_S${stageNumber}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as StageDraft;
  } catch (e) {
    console.error('Failed to load stage draft', e);
    return null;
  }
}

export function clearStageDraft(levelNumber: number, stageNumber: number): void {
  try {
    const key = `${DRAFT_KEY_PREFIX}L${levelNumber}_S${stageNumber}`;
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to clear stage draft', e);
  }
}

export function loadTeacherTests(): TeacherTestConfig[] {
  try {
    const raw = localStorage.getItem(TEACHER_TESTS_KEY);
    if (!raw) {
      // Seed default sample tests
      const seedTests: TeacherTestConfig[] = [
        {
          id: 'test-101',
          testName: 'Class X Foundation - Student Registration Test',
          levelNumber: 1,
          stageNumber: 1,
          datasetType: 'Synthetic Students Nadia',
          allowGuidedMode: false,
          targetAccuracy: 85,
          timeLimitSeconds: 180,
          expMultiplier: 1.2,
          allowRetries: true,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'test-102',
          testName: 'Secondary Marksheet Verification Assessment',
          levelNumber: 4,
          stageNumber: 3,
          datasetType: 'WBBSE Secondary Batch',
          allowGuidedMode: false,
          targetAccuracy: 95,
          timeLimitSeconds: 300,
          expMultiplier: 1.5,
          allowRetries: false,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      localStorage.setItem(TEACHER_TESTS_KEY, JSON.stringify(seedTests));
      return seedTests;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveTeacherTest(test: TeacherTestConfig): void {
  try {
    const existing = loadTeacherTests();
    const updated = [test, ...existing.filter(t => t.id !== test.id)];
    localStorage.setItem(TEACHER_TESTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save teacher test', e);
  }
}

/**
 * Web Audio API subtle feedback synthesizer (no external media required)
 */
export function playFeedbackSound(type: 'click' | 'success' | 'level_up' | 'warning'): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'success') {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.35);
    } else if (type === 'level_up') {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.1, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.25);
      });
    }
  } catch (e) {
    // Audio context may be restricted by autoplay policy
  }
}
