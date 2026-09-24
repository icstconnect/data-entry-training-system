import { Achievement, StageValidationSummary, StudentProgress } from '../types';
import { BATCH_TITLES, LEVELS_INFO } from '../data/stagesConfig';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_stage',
    title: 'Data Entry Beginner',
    description: 'Completed your very first data entry training stage.',
    iconName: 'Sparkles',
    badgeLevel: 1
  },
  {
    id: 'level_1_complete',
    title: 'Foundation Certified',
    description: 'Completed all stages of Level 1: Foundation.',
    iconName: 'Award',
    badgeLevel: 1
  },
  {
    id: 'precision_operator',
    title: 'Precision Operator',
    description: 'Attained 95% or higher accuracy on an advanced stage.',
    iconName: 'Crosshair',
    badgeLevel: 2
  },
  {
    id: 'form_specialist',
    title: 'Form Specialist',
    description: 'Successfully finished complex multi-section records in Level 3.',
    iconName: 'FileCheck',
    badgeLevel: 3
  },
  {
    id: 'marksheet_operator',
    title: 'Marksheet Data Operator',
    description: 'Mastered high-precision state board marksheet entry in Level 4.',
    iconName: 'Table',
    badgeLevel: 4
  },
  {
    id: 'perfect_100',
    title: 'Flawless Precision',
    description: 'Submitted an attempt with 100% exact character and digit fidelity.',
    iconName: 'ShieldCheck',
    badgeLevel: 4
  },
  {
    id: 'master_operator',
    title: 'Master Data Entry Operator',
    description: 'Conquered the final 100% zero-tolerance Capstone stage of Level 5.',
    iconName: 'Trophy',
    badgeLevel: 5
  }
];

/**
 * Checks for any newly unlocked achievements based on the latest submission and history
 */
export function checkUnlockedAchievements(
  summary: StageValidationSummary,
  progress: StudentProgress
): { newAchievements: Achievement[]; newBatchTitle?: string } {
  if (!summary.passed || summary.isGuidedMode) {
    return { newAchievements: [] };
  }

  const alreadyUnlocked = new Set(progress.unlockedAchievements);
  const newAchievements: Achievement[] = [];

  // 1. First stage ever
  if (!alreadyUnlocked.has('first_stage')) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'first_stage')!;
    newAchievements.push({ ...ach, unlockedAt: new Date().toISOString() });
    alreadyUnlocked.add('first_stage');
  }

  // 2. Perfect 100%
  if (summary.accuracyPercentage === 100 && !alreadyUnlocked.has('perfect_100')) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'perfect_100')!;
    newAchievements.push({ ...ach, unlockedAt: new Date().toISOString() });
    alreadyUnlocked.add('perfect_100');
  }

  // 3. Precision Operator (95%+ in level 3+)
  if (summary.levelNumber >= 3 && summary.accuracyPercentage >= 95 && !alreadyUnlocked.has('precision_operator')) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'precision_operator')!;
    newAchievements.push({ ...ach, unlockedAt: new Date().toISOString() });
    alreadyUnlocked.add('precision_operator');
  }

  // 4. Form Specialist
  if (summary.levelNumber === 3 && summary.stageNumber === 2 && !alreadyUnlocked.has('form_specialist')) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'form_specialist')!;
    newAchievements.push({ ...ach, unlockedAt: new Date().toISOString() });
    alreadyUnlocked.add('form_specialist');
  }

  // 5. Marksheet Operator
  if (summary.levelNumber === 4 && summary.stageNumber >= 3 && !alreadyUnlocked.has('marksheet_operator')) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'marksheet_operator')!;
    newAchievements.push({ ...ach, unlockedAt: new Date().toISOString() });
    alreadyUnlocked.add('marksheet_operator');
  }

  // 6. Level 1 Complete check
  const l1s1 = progress.completedStages['L1-S1'] || (summary.levelNumber === 1 && summary.stageNumber === 1);
  const l1s2 = progress.completedStages['L1-S2'] || (summary.levelNumber === 1 && summary.stageNumber === 2);
  if (l1s1 && l1s2 && !alreadyUnlocked.has('level_1_complete')) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'level_1_complete')!;
    newAchievements.push({ ...ach, unlockedAt: new Date().toISOString() });
    alreadyUnlocked.add('level_1_complete');
  }

  // 7. Master Operator check (Level 5 Stage 6)
  if (summary.levelNumber === 5 && summary.stageNumber === 6 && summary.accuracyPercentage === 100 && !alreadyUnlocked.has('master_operator')) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'master_operator')!;
    newAchievements.push({ ...ach, unlockedAt: new Date().toISOString() });
    alreadyUnlocked.add('master_operator');
  }

  // Check Batch Title progression
  let newBatchTitle: string | undefined = undefined;
  const currentLevelInfo = LEVELS_INFO.find(l => l.levelNumber === summary.levelNumber);
  if (currentLevelInfo) {
    // Check if this submission completes the level or meets required accuracy
    const batch = BATCH_TITLES.find(b => b.levelNumber === summary.levelNumber);
    if (batch && summary.accuracyPercentage >= batch.minAccuracy) {
      if (progress.currentBatchTitle !== batch.title) {
        newBatchTitle = batch.title;
      }
    }
  }

  return { newAchievements, newBatchTitle };
}
