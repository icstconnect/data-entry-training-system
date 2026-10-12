import { Achievement } from '../types';
import { WindowsProgress } from '../types/windows';
import { WINDOWS_ACHIEVEMENTS } from '../data/windowsCurriculumData';

const STORAGE_KEY = 'icst_windows_lab_progress_v1';

const DEFAULT_WINDOWS_PROGRESS: WindowsProgress = {
  fileManagementCurrentLevel: 1,
  fileManagementMaxUnlocked: 1,
  fileManagementCompleted: {},
  folderManagementCurrentLevel: 1,
  folderManagementMaxUnlocked: 1,
  folderManagementCompleted: {},
  unlockedAchievements: [],
  totalWindowsExp: 0
};

export function calculateTotalWindowsExp(progress: WindowsProgress): number {
  let total = 0;
  Object.entries(progress.fileManagementCompleted || {}).forEach(([lvl, data]) => {
    if (data && data.score === 100) {
      total += Number(lvl) * 50;
    }
  });

  Object.entries(progress.folderManagementCompleted || {}).forEach(([lvl, data]) => {
    if (data && data.score === 100) {
      total += Number(lvl) * 50;
    }
  });

  return total;
}

export function loadWindowsProgress(): WindowsProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_WINDOWS_PROGRESS };
    const parsed = JSON.parse(raw);
    const progress: WindowsProgress = {
      fileManagementCurrentLevel: parsed.fileManagementCurrentLevel || 1,
      fileManagementMaxUnlocked: parsed.fileManagementMaxUnlocked || 1,
      fileManagementCompleted: parsed.fileManagementCompleted || {},
      folderManagementCurrentLevel: parsed.folderManagementCurrentLevel || 1,
      folderManagementMaxUnlocked: parsed.folderManagementMaxUnlocked || 1,
      folderManagementCompleted: parsed.folderManagementCompleted || {},
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
      totalWindowsExp: 0
    };
    progress.totalWindowsExp = calculateTotalWindowsExp(progress);
    return syncWindowsAchievements(progress);
  } catch {
    return { ...DEFAULT_WINDOWS_PROGRESS };
  }
}

export function saveWindowsProgress(progress: WindowsProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('Failed to save Windows progress to localStorage:', err);
  }
}

export function syncWindowsAchievements(progress: WindowsProgress): WindowsProgress {
  const unlocked = new Set(progress.unlockedAchievements);

  // File Management achievements
  if (progress.fileManagementCompleted[1]?.score === 100) unlocked.add('win_file_ext_master');
  if (progress.fileManagementCompleted[2]?.score === 100) unlocked.add('win_academic_organizer');
  if (progress.fileManagementCompleted[3]?.score === 100) unlocked.add('win_iso_archivist');
  if (progress.fileManagementCompleted[4]?.score === 100) unlocked.add('win_studio_producer');
  if (progress.fileManagementCompleted[5]?.score === 100) unlocked.add('win_ai_data_architect');

  // Folder Management achievements
  if (progress.folderManagementCompleted[1]?.score === 100 || progress.folderManagementCompleted[2]?.score === 100) {
    unlocked.add('win_folder_builder');
  }
  if (progress.folderManagementCompleted[3]?.score === 100) unlocked.add('win_tree_navigator');
  if (progress.folderManagementCompleted[4]?.score === 100) unlocked.add('win_enterprise_curator');
  if (progress.folderManagementCompleted[5]?.score === 100) unlocked.add('win_devops_structure');
  if (progress.folderManagementCompleted[6]?.score === 100 && progress.folderManagementCompleted[7]?.score === 100) {
    unlocked.add('win_cloud_grandmaster');
  }

  return {
    ...progress,
    unlockedAchievements: Array.from(unlocked)
  };
}

export function recordLevelCompletion(
  mode: 'file_management' | 'folder_management',
  levelNumber: number,
  score: number
): {
  updatedProgress: WindowsProgress;
  newAchievements: Achievement[];
  expEarned: number;
} {
  const current = loadWindowsProgress();
  const oldUnlocked = new Set(current.unlockedAchievements);
  let expEarned = 0;

  if (mode === 'file_management') {
    const existing = current.fileManagementCompleted[levelNumber];
    const prevScore = existing?.score || 0;
    
    current.fileManagementCompleted[levelNumber] = {
      score: Math.max(prevScore, score),
      completedAt: new Date().toISOString()
    };

    if (score === 100) {
      if (levelNumber === current.fileManagementMaxUnlocked && current.fileManagementMaxUnlocked < 5) {
        current.fileManagementMaxUnlocked = levelNumber + 1;
      }
      if (prevScore < 100) {
        expEarned += levelNumber * 50;
      }
    }
  } else {
    const existing = current.folderManagementCompleted[levelNumber];
    const prevScore = existing?.score || 0;

    current.folderManagementCompleted[levelNumber] = {
      score: Math.max(prevScore, score),
      completedAt: new Date().toISOString()
    };

    if (score === 100) {
      if (levelNumber === current.folderManagementMaxUnlocked && current.folderManagementMaxUnlocked < 7) {
        current.folderManagementMaxUnlocked = levelNumber + 1;
      }
      if (prevScore < 100) {
        expEarned += levelNumber * 50;
      }
    }
  }

  current.totalWindowsExp = calculateTotalWindowsExp(current);
  const synced = syncWindowsAchievements(current);
  saveWindowsProgress(synced);

  const newAchievements: Achievement[] = [];
  synced.unlockedAchievements.forEach(id => {
    if (!oldUnlocked.has(id)) {
      const found = WINDOWS_ACHIEVEMENTS.find(a => a.id === id);
      if (found) newAchievements.push(found);
    }
  });

  return {
    updatedProgress: synced,
    newAchievements,
    expEarned
  };
}
