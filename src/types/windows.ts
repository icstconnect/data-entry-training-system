import { StudentIdentity, Achievement } from './index';

export type WindowsSimulationMode = 'file_management' | 'folder_management';

export type WindowsItemType = 'file' | 'folder';

export interface VirtualFile {
  id: string;
  name: string;
  ext: string;
  size: string;
  date: string;
  type: 'file';
  parentId: string; // 'root' | folderId | 'recycle_bin'
  originalParentId?: string;
  targetFolderId?: string;
  preview?: string;
  infoTitle?: string;
  infoEn?: string;
  infoBn?: string;
}

export interface VirtualFolder {
  id: string;
  name: string;
  type: 'folder';
  parentId: string; // 'root' | folderId | 'recycle_bin'
  originalParentId?: string;
  icon?: string;
  isTarget?: boolean;
  accepted?: string[];
  infoTitle?: string;
  infoEn?: string;
  infoBn?: string;
}

export type VirtualItem = VirtualFile | VirtualFolder;

export interface VirtualFileSystem {
  folders: VirtualFolder[];
  files: VirtualFile[];
  recycleBin: VirtualItem[];
}

export interface FileManagementTargetFolder {
  id: string;
  name: string;
  icon: string;
  accepted: string[];
  infoTitle: string;
  infoEn: string;
  infoBn: string;
}

export interface FileManagementLevel {
  levelNumber: number;
  title: string;
  badge: string;
  goal: string;
  goalBn?: string;
  targetFolders: FileManagementTargetFolder[];
  files: Omit<VirtualFile, 'type' | 'parentId'>[];
}

export interface ExpectedFolderNode {
  name: string;
  path: string; // e.g. "Academics/Science/Physics"
  infoTitle: string;
  infoEn: string;
  infoBn: string;
  children?: ExpectedFolderNode[];
}

export interface FolderManagementLevel {
  levelNumber: number;
  title: string;
  badge: string;
  goal: string;
  goalBn?: string;
  instructions: string[];
  initialFolders: {
    id: string;
    name: string;
    parentId: string;
    isJunk?: boolean;
    needsRenameTo?: string;
    infoTitle?: string;
    infoEn?: string;
    infoBn?: string;
  }[];
  expectedTree: ExpectedFolderNode[];
  junkFolderNamesToDelete?: string[];
  renamedFoldersExpected?: {
    originalIdOrName: string;
    expectedName: string;
  }[];
  bilingualGuide: {
    en: string;
    bn: string;
  };
}

export interface WindowsProgress {
  fileManagementCurrentLevel: number;
  fileManagementMaxUnlocked: number;
  fileManagementCompleted: Record<number, {
    score: number;
    completedAt: string;
  }>;
  folderManagementCurrentLevel: number;
  folderManagementMaxUnlocked: number;
  folderManagementCompleted: Record<number, {
    score: number;
    completedAt: string;
  }>;
  unlockedAchievements: string[];
  totalWindowsExp: number;
}
