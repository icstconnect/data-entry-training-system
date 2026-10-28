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

export function calculateMaxUnlocked(
  completed: Record<number, { score: number; completedAt: string }>,
  maxLevels: number,
  existingMax: number = 1
): number {
  let maxUnlocked = Math.max(1, existingMax);
  Object.keys(completed || {}).forEach(k => {
    const lvl = Number(k);
    if (completed[lvl] && completed[lvl].score === 100) {
      maxUnlocked = Math.max(maxUnlocked, Math.min(maxLevels, lvl + 1));
    }
  });
  return Math.min(maxLevels, maxUnlocked);
}

export function loadWindowsProgress(): WindowsProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_WINDOWS_PROGRESS };
    const parsed = JSON.parse(raw);
    const fileCompleted = parsed.fileManagementCompleted || {};
    const folderCompleted = parsed.folderManagementCompleted || {};
    
    // Always preserve old cleared stage states and unlocked levels
    const existingFileMax = Math.max(1, Number(parsed.fileManagementMaxUnlocked) || 1);
    const existingFolderMax = Math.max(1, Number(parsed.folderManagementMaxUnlocked) || 1);

    const trueFileMaxUnlocked = calculateMaxUnlocked(fileCompleted, 5, existingFileMax);
    const trueFolderMaxUnlocked = calculateMaxUnlocked(folderCompleted, 7, existingFolderMax);

    const progress: WindowsProgress = {
      fileManagementCurrentLevel: Math.min(
        Math.max(1, parsed.fileManagementCurrentLevel || 1),
        trueFileMaxUnlocked
      ),
      fileManagementMaxUnlocked: trueFileMaxUnlocked,
      fileManagementCompleted: fileCompleted,
      folderManagementCurrentLevel: Math.min(
        Math.max(1, parsed.folderManagementCurrentLevel || 1),
        trueFolderMaxUnlocked
      ),
      folderManagementMaxUnlocked: trueFolderMaxUnlocked,
      folderManagementCompleted: folderCompleted,
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

export function saveWindowsActiveLevel(mode: 'file_management' | 'folder_management', level: number): void {
  try {
    const current = loadWindowsProgress();
    if (mode === 'file_management') {
      current.fileManagementCurrentLevel = level;
    } else {
      current.folderManagementCurrentLevel = level;
    }
    saveWindowsProgress(current);
  } catch (err) {
    console.warn('Failed to save active Windows level:', err);
  }
}

export function clearWindowsProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear Windows progress:', err);
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

    if (score === 100 && prevScore < 100) {
      expEarned += levelNumber * 50;
    }

    current.fileManagementMaxUnlocked = calculateMaxUnlocked(
      current.fileManagementCompleted, 
      5, 
      Math.max(current.fileManagementMaxUnlocked, score === 100 ? levelNumber + 1 : 1)
    );
    // Preserve current level on the completed level (never reset to 1)
    current.fileManagementCurrentLevel = levelNumber;
  } else {
    const existing = current.folderManagementCompleted[levelNumber];
    const prevScore = existing?.score || 0;

    current.folderManagementCompleted[levelNumber] = {
      score: Math.max(prevScore, score),
      completedAt: new Date().toISOString()
    };

    if (score === 100 && prevScore < 100) {
      expEarned += levelNumber * 50;
    }

    current.folderManagementMaxUnlocked = calculateMaxUnlocked(
      current.folderManagementCompleted, 
      7, 
      Math.max(current.folderManagementMaxUnlocked, score === 100 ? levelNumber + 1 : 1)
    );
    // Preserve current level on the completed level (never reset to 1)
    current.folderManagementCurrentLevel = levelNumber;
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
