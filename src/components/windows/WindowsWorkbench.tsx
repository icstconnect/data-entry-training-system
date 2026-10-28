import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  VirtualFolder, 
  VirtualFile, 
  VirtualItem, 
  WindowsSimulationMode, 
  WindowsProgress,
  ExpectedFolderNode 
} from '../../types/windows';
import { 
  FILE_MANAGEMENT_LEVELS, 
  FOLDER_MANAGEMENT_LEVELS 
} from '../../data/windowsCurriculumData';
import { 
  loadWindowsProgress, 
  recordLevelCompletion,
  saveWindowsActiveLevel
} from '../../services/windowsStorageService';
import { soundEffects } from '../../services/soundEffects';

import { ExplorerWindow } from './ExplorerWindow';
import { DitaCopilotCard } from './DitaCopilotCard';
import { WindowsTaskbar } from './WindowsTaskbar';
import { ContextMenu } from './ContextMenu';
import { BilingualTooltip, TooltipData } from './BilingualTooltip';

import { FilePreviewModal } from './modals/FilePreviewModal';
import { NewFolderModal } from './modals/NewFolderModal';
import { RenameModal } from './modals/RenameModal';
import { AuditReportModal, AuditItemBreakdown } from './modals/AuditReportModal';
import { CurriculumModal } from './modals/CurriculumModal';
import { AchievementsModal } from './modals/AchievementsModal';

import './windows.css';

interface WindowsWorkbenchProps {
  initialMode?: WindowsSimulationMode;
  initialLevel?: number;
  onExpAwarded?: (exp: number) => void;
  onBackToDashboard?: () => void;
}

export const WindowsWorkbench: React.FC<WindowsWorkbenchProps> = ({
  initialMode = 'file_management',
  initialLevel,
  onExpAwarded,
  onBackToDashboard
}) => {
  // Modes & Levels
  const [mode, setMode] = useState<WindowsSimulationMode>(initialMode);
  const [windowsProgress, setWindowsProgress] = useState<WindowsProgress>(() => {
    const p = loadWindowsProgress();
    if (initialLevel) {
      if (initialMode === 'file_management') {
        p.fileManagementCurrentLevel = initialLevel;
      } else {
        p.folderManagementCurrentLevel = initialLevel;
      }
    }
    return p;
  });

  // Fullscreen container ref & state
  const workbenchRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (workbenchRef.current?.requestFullscreen) {
        workbenchRef.current.requestFullscreen().catch(() => {
          setIsFullscreen(f => !f);
        });
      } else {
        setIsFullscreen(f => !f);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);
  
  const currentLevel = mode === 'file_management' 
    ? windowsProgress.fileManagementCurrentLevel 
    : windowsProgress.folderManagementCurrentLevel;

  const maxUnlockedLevel = mode === 'file_management'
    ? windowsProgress.fileManagementMaxUnlocked
    : windowsProgress.folderManagementMaxUnlocked;

  // Virtual File System
  const [folders, setFolders] = useState<VirtualFolder[]>([]);
  const [files, setFiles] = useState<VirtualFile[]>([]);
  const [recycleBin, setRecycleBin] = useState<VirtualItem[]>([]);

  // Navigation & Selection
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [clipboard, setClipboard] = useState<{ action: 'cut' | 'copy' | null; itemIds: string[] }>({ action: null, itemIds: [] });
  const [navHistory, setNavHistory] = useState<string[]>(['root']);
  const [navIndex, setNavIndex] = useState<number>(0);

  // Window & Card Visibility
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);

  // Modals
  const [previewFile, setPreviewFile] = useState<VirtualFile | null>(null);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<VirtualItem | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  // Context Menu & Tooltip
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; isOpen: boolean; item: VirtualItem | null }>({
    x: 0,
    y: 0,
    isOpen: false,
    item: null
  });
  const [hoverTooltip, setHoverTooltip] = useState<TooltipData | null>(null);

  // Toast
  const [toast, setToast] = useState<{ icon: string; text: string; visible: boolean }>({ icon: '', text: '', visible: false });

  const showToast = useCallback((icon: string, text: string) => {
    setToast({ icon, text, visible: true });
    setTimeout(() => {
      setToast(t => ({ ...t, visible: false }));
    }, 2400);
  }, []);

  // Initialize Level State
  const initLevel = useCallback((targetMode: WindowsSimulationMode, lvl: number, forceReset = false) => {
    setCurrentFolderId('root');
    setSelectedItemIds(new Set());
    setClipboard({ action: null, itemIds: [] });
    setNavHistory(['root']);
    setNavIndex(0);

    const isAlreadyCleared = !forceReset && (targetMode === 'file_management'
      ? (windowsProgress.fileManagementCompleted[lvl]?.score === 100)
      : (windowsProgress.folderManagementCompleted[lvl]?.score === 100));

    if (targetMode === 'file_management') {
      const data = FILE_MANAGEMENT_LEVELS[lvl] || FILE_MANAGEMENT_LEVELS[1];
      const initialFolders: VirtualFolder[] = data.targetFolders.map(tf => ({
        id: tf.id,
        name: tf.name,
        type: 'folder',
        parentId: 'root',
        icon: tf.icon,
        isTarget: true,
        infoTitle: tf.infoTitle,
        infoEn: tf.infoEn,
        infoBn: tf.infoBn
      }));

      const initialFiles: VirtualFile[] = data.files.map(f => ({
        ...f,
        type: 'file',
        parentId: isAlreadyCleared && f.targetFolderId ? f.targetFolderId : 'root'
      }));

      setFolders(initialFolders);
      setFiles(initialFiles);
      setRecycleBin([]);
    } else {
      const data = FOLDER_MANAGEMENT_LEVELS[lvl] || FOLDER_MANAGEMENT_LEVELS[1];
      
      if (isAlreadyCleared) {
        // Preserve the completed folder tree for cleared stage
        const newFolders: VirtualFolder[] = [];
        const createNodes = (node: ExpectedFolderNode, parentId: string) => {
          const id = 'folder_cleared_' + Math.random().toString(36).substring(2, 7);
          newFolders.push({
            id,
            name: node.name,
            type: 'folder',
            parentId,
            icon: '📁',
            infoTitle: node.infoTitle,
            infoEn: node.infoEn,
            infoBn: node.infoBn
          });
          if (node.children) {
            node.children.forEach(ch => createNodes(ch, id));
          }
        };

        data.expectedTree.forEach(rootNode => createNodes(rootNode, 'root'));

        const junkList: VirtualItem[] = [];
        if (data.junkFolderNamesToDelete) {
          data.junkFolderNamesToDelete.forEach(junkName => {
            junkList.push({
              id: 'junk_' + Math.random().toString(36).substring(2, 6),
              name: junkName,
              type: 'folder',
              parentId: 'recycle_bin',
              originalParentId: 'root'
            });
          });
        }

        setFolders(newFolders);
        setFiles([]);
        setRecycleBin(junkList);
      } else {
        const initialFolders: VirtualFolder[] = data.initialFolders.map(inf => ({
          id: inf.id,
          name: inf.name,
          type: 'folder',
          parentId: inf.parentId,
          infoTitle: inf.infoTitle,
          infoEn: inf.infoEn,
          infoBn: inf.infoBn
        }));

        setFolders(initialFolders);
        setFiles([]);
        setRecycleBin([]);
      }
    }
  }, [windowsProgress.fileManagementCompleted, windowsProgress.folderManagementCompleted]);

  // Sync level on mount or mode change
  useEffect(() => {
    initLevel(mode, currentLevel);
  }, [mode, currentLevel, initLevel]);

  // Mode Switching
  const handleSwitchMode = (newMode: WindowsSimulationMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    soundEffects.playTone('click');
    const targetLvl = newMode === 'file_management'
      ? windowsProgress.fileManagementCurrentLevel
      : windowsProgress.folderManagementCurrentLevel;
    initLevel(newMode, targetLvl);
    showToast('🪟', `Switched to ${newMode === 'file_management' ? 'File Management' : 'Folder Management'} track`);
  };

  // Level Selecting
  const handleSelectLevel = (lvl: number) => {
    if (lvl > maxUnlockedLevel) {
      soundEffects.playTone('error');
      showToast('🔒', `Stage ${lvl} is locked! Complete Stage ${maxUnlockedLevel} with 100% first.`);
      return;
    }
    soundEffects.playTone('click');
    saveWindowsActiveLevel(mode, lvl);
    setWindowsProgress(prev => {
      const updated = {
        ...prev,
        [mode === 'file_management' ? 'fileManagementCurrentLevel' : 'folderManagementCurrentLevel']: lvl
      };
      return updated;
    });
    initLevel(mode, lvl);
    showToast('ℹ️', `Loaded Level ${lvl}`);
  };

  // Navigation handlers
  const handleNavigateTo = (folderId: string) => {
    if (folderId === currentFolderId) return;
    const nextHist = navHistory.slice(0, navIndex + 1);
    nextHist.push(folderId);
    setNavHistory(nextHist);
    setNavIndex(nextHist.length - 1);
    setCurrentFolderId(folderId);
    setSelectedItemIds(new Set());
    soundEffects.playTone('click');
  };

  const handleNavBack = () => {
    if (navIndex > 0) {
      const prevIdx = navIndex - 1;
      setNavIndex(prevIdx);
      setCurrentFolderId(navHistory[prevIdx]);
      setSelectedItemIds(new Set());
    }
  };

  const handleNavForward = () => {
    if (navIndex < navHistory.length - 1) {
      const nextIdx = navIndex + 1;
      setNavIndex(nextIdx);
      setCurrentFolderId(navHistory[nextIdx]);
      setSelectedItemIds(new Set());
    }
  };

  const handleNavUp = () => {
    if (currentFolderId === 'root' || currentFolderId === 'recycle_bin') return;
    const f = folders.find(x => x.id === currentFolderId);
    handleNavigateTo(f ? f.parentId : 'root');
  };

  // Clipboard operations
  const handleCut = () => {
    if (selectedItemIds.size === 0) return;
    setClipboard({ action: 'cut', itemIds: Array.from(selectedItemIds) });
    soundEffects.playTone('copy');
    showToast('✂️', `Cut ${selectedItemIds.size} item(s). Ready to Paste!`);
  };

  const handleCopy = () => {
    if (selectedItemIds.size === 0) return;
    setClipboard({ action: 'copy', itemIds: Array.from(selectedItemIds) });
    soundEffects.playTone('copy');
    showToast('📋', `Copied ${selectedItemIds.size} item(s). Ready to Paste!`);
  };

  const executePasteInto = useCallback((targetFolderId: string) => {
    if (!clipboard.action || clipboard.itemIds.length === 0) return;

    if (clipboard.action === 'cut') {
      let count = 0;
      setFiles(prev => prev.map(f => {
        if (clipboard.itemIds.includes(f.id)) {
          count++;
          return { ...f, parentId: targetFolderId };
        }
        return f;
      }));

      setFolders(prev => prev.map(f => {
        if (clipboard.itemIds.includes(f.id) && f.id !== targetFolderId) {
          count++;
          return { ...f, parentId: targetFolderId };
        }
        return f;
      }));

      setClipboard({ action: null, itemIds: [] });
      soundEffects.playTone('paste');
      showToast('📥', `Moved ${count} item(s)`);
    } else if (clipboard.action === 'copy') {
      const newFiles: VirtualFile[] = [];
      files.forEach(f => {
        if (clipboard.itemIds.includes(f.id)) {
          const parts = f.name.split('.');
          const ext = parts.length > 1 ? parts.pop() : '';
          const baseName = parts.join('.');
          const newName = ext ? `${baseName}_Copy.${ext}` : `${f.name}_Copy`;
          newFiles.push({
            ...f,
            id: 'file_copy_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            name: newName,
            parentId: targetFolderId,
            date: '2026-09-28'
          });
        }
      });
      if (newFiles.length > 0) {
        setFiles(prev => [...prev, ...newFiles]);
        soundEffects.playTone('paste');
        showToast('📥', `Pasted ${newFiles.length} item(s)`);
      }
    }
  }, [clipboard, files, showToast]);

  const handlePaste = useCallback(() => {
    let target = currentFolderId;
    if (selectedItemIds.size === 1) {
      const selId = Array.from(selectedItemIds)[0];
      const foundF = folders.find(f => f.id === selId);
      if (foundF) target = foundF.id;
    }
    executePasteInto(target);
  }, [currentFolderId, selectedItemIds, folders, executePasteInto]);

  const handleDelete = () => {
    if (selectedItemIds.size === 0) return;
    const ids = Array.from(selectedItemIds);
    let deletedCount = 0;

    if (currentFolderId === 'recycle_bin') {
      setRecycleBin(prev => prev.filter(x => !ids.includes(x.id)));
      deletedCount = ids.length;
    } else {
      const filesToDelete = files.filter(f => ids.includes(f.id));
      const foldersToDelete = folders.filter(f => ids.includes(f.id));

      if (filesToDelete.length > 0) {
        setFiles(prev => prev.filter(f => !ids.includes(f.id)));
        setRecycleBin(prev => [...prev, ...filesToDelete.map(f => ({ ...f, originalParentId: f.parentId, parentId: 'recycle_bin' }))]);
        deletedCount += filesToDelete.length;
      }
      if (foldersToDelete.length > 0) {
        setFolders(prev => prev.filter(f => !ids.includes(f.id)));
        setRecycleBin(prev => [...prev, ...foldersToDelete.map(f => ({ ...f, originalParentId: f.parentId, parentId: 'recycle_bin' }))]);
        deletedCount += foldersToDelete.length;
      }
    }

    setSelectedItemIds(new Set());
    soundEffects.playTone('delete');
    showToast('🗑️', `Deleted ${deletedCount} item(s) to Recycle Bin`);
  };

  // Drop Handler
  const handleDropItems = (draggedIds: string[], targetFolderId: string | null) => {
    const target = targetFolderId || currentFolderId;
    if (draggedIds.length === 0) return;

    if (target === 'recycle_bin') {
      const filesToDelete = files.filter(f => draggedIds.includes(f.id));
      const foldersToDelete = folders.filter(f => draggedIds.includes(f.id));
      setFiles(prev => prev.filter(f => !draggedIds.includes(f.id)));
      setFolders(prev => prev.filter(f => !draggedIds.includes(f.id)));
      setRecycleBin(prev => [
        ...prev,
        ...filesToDelete.map(f => ({ ...f, originalParentId: f.parentId, parentId: 'recycle_bin' })),
        ...foldersToDelete.map(f => ({ ...f, originalParentId: f.parentId, parentId: 'recycle_bin' }))
      ]);
      soundEffects.playTone('delete');
      showToast('🗑️', `Moved ${draggedIds.length} item(s) to Recycle Bin`);
      return;
    }

    let moved = 0;
    setFiles(prev => prev.map(f => {
      if (draggedIds.includes(f.id) && f.parentId !== target) {
        moved++;
        return { ...f, parentId: target };
      }
      return f;
    }));

    setFolders(prev => prev.map(f => {
      if (draggedIds.includes(f.id) && f.id !== target && f.parentId !== target) {
        moved++;
        return { ...f, parentId: target };
      }
      return f;
    }));

    if (moved > 0) {
      soundEffects.playTone('drop');
      showToast('📁', `Moved ${moved} item(s) successfully`);
    }
  };

  // New Folder creation
  const handleCreateFolder = (name: string) => {
    const newId = 'folder_' + Date.now();
    const newFolder: VirtualFolder = {
      id: newId,
      name,
      type: 'folder',
      parentId: currentFolderId === 'recycle_bin' ? 'root' : currentFolderId,
      icon: '📁'
    };
    setFolders(prev => [...prev, newFolder]);
    setIsNewFolderOpen(false);
    soundEffects.playTone('click');
    showToast('📁', `Created folder "${name}"`);
  };

  // Rename
  const handleRenameSubmit = (newName: string) => {
    if (!renameTarget) return;
    const targetId = renameTarget.id;

    if (renameTarget.type === 'file') {
      setFiles(prev => prev.map(f => {
        if (f.id === targetId) {
          const parts = newName.split('.');
          const ext = parts.length > 1 ? parts.pop()?.toLowerCase() || f.ext : f.ext;
          return { ...f, name: newName, ext };
        }
        return f;
      }));
    } else {
      setFolders(prev => prev.map(f => {
        if (f.id === targetId) return { ...f, name: newName };
        return f;
      }));
    }

    setRenameTarget(null);
    soundEffects.playTone('click');
    showToast('✏️', `Renamed to "${newName}"`);
  };

  // Context Menu Actions
  const handleOpenItem = (item: VirtualItem) => {
    if (item.type === 'folder') {
      handleNavigateTo(item.id);
    } else {
      setPreviewFile(item as VirtualFile);
    }
  };

  // SCORING ENGINE & AUDIT BREAKDOWN
  const auditEvaluation = useMemo(() => {
    if (mode === 'file_management') {
      const lvl = FILE_MANAGEMENT_LEVELS[currentLevel] || FILE_MANAGEMENT_LEVELS[1];
      const total = lvl.files.length;
      let correct = 0;
      const breakdown: AuditItemBreakdown[] = [];

      lvl.files.forEach(templateF => {
        const liveFile = files.find(f => f.id === templateF.id);
        const targetF = folders.find(f => f.id === templateF.targetFolderId);
        const targetName = targetF?.name || 'Target Folder';
        const isMatch = liveFile && liveFile.parentId === templateF.targetFolderId;

        if (isMatch) correct++;

        breakdown.push({
          label: templateF.name,
          isCorrect: !!isMatch,
          statusText: isMatch ? `In ${targetName}` : `Move to: ${targetName}`
        });
      });

      const percentage = Math.round((correct / Math.max(1, total)) * 100);
      return {
        percentage,
        correctCount: correct,
        totalUnits: total,
        summaryText: `Organization: ${percentage}% (${correct}/${total} correctly filed)`,
        breakdown
      };
    } else {
      // TRACK 2: FOLDER MANAGEMENT SCORING
      const lvl = FOLDER_MANAGEMENT_LEVELS[currentLevel] || FOLDER_MANAGEMENT_LEVELS[1];
      let totalPoints = 0;
      let earnedPoints = 0;
      const breakdown: AuditItemBreakdown[] = [];

      // 1. Check Expected Folder Tree
      const verifyNode = (node: ExpectedFolderNode, expectedParentId: string) => {
        totalPoints++;
        const matchingFolder = folders.find(f => f.name.toLowerCase() === node.name.toLowerCase() && f.parentId === expectedParentId);
        if (matchingFolder) {
          earnedPoints++;
          breakdown.push({
            label: `📁 ${node.path}`,
            isCorrect: true,
            statusText: 'Created in correct branch'
          });
          if (node.children) {
            node.children.forEach(ch => verifyNode(ch, matchingFolder.id));
          }
        } else {
          breakdown.push({
            label: `📁 ${node.path}`,
            isCorrect: false,
            statusText: 'Missing / Not in correct folder'
          });
          if (node.children) {
            node.children.forEach(ch => verifyNode(ch, 'non_existent'));
          }
        }
      };

      lvl.expectedTree.forEach(rootNode => {
        verifyNode(rootNode, 'root');
      });

      // 2. Check Junk Folders (must be deleted to recycle_bin or removed)
      if (lvl.junkFolderNamesToDelete && lvl.junkFolderNamesToDelete.length > 0) {
        lvl.junkFolderNamesToDelete.forEach(junkName => {
          totalPoints++;
          const inActive = folders.some(f => f.name.toLowerCase() === junkName.toLowerCase());
          const inRecycle = recycleBin.some(r => r.name.toLowerCase() === junkName.toLowerCase());
          const isDeleted = !inActive && inRecycle;

          if (isDeleted) {
            earnedPoints++;
            breakdown.push({
              label: `🗑️ Delete "${junkName}"`,
              isCorrect: true,
              statusText: 'Deleted to Recycle Bin'
            });
          } else {
            breakdown.push({
              label: `🗑️ Delete "${junkName}"`,
              isCorrect: false,
              statusText: 'Still active in workspace'
            });
          }
        });
      }

      // 3. Check Renamed Folders
      if (lvl.renamedFoldersExpected && lvl.renamedFoldersExpected.length > 0) {
        lvl.renamedFoldersExpected.forEach(ren => {
          totalPoints++;
          const hasOld = folders.some(f => f.name.toLowerCase() === ren.originalIdOrName.toLowerCase());
          const hasNew = folders.some(f => f.name.toLowerCase() === ren.expectedName.toLowerCase());
          const isRenamed = !hasOld && hasNew;

          if (isRenamed) {
            earnedPoints++;
            breakdown.push({
              label: `✏️ Rename "${ren.originalIdOrName}" ➔ "${ren.expectedName}"`,
              isCorrect: true,
              statusText: 'Renamed successfully'
            });
          } else {
            breakdown.push({
              label: `✏️ Rename "${ren.originalIdOrName}" ➔ "${ren.expectedName}"`,
              isCorrect: false,
              statusText: 'Needs F2 Rename'
            });
          }
        });
      }

      const percentage = Math.round((earnedPoints / Math.max(1, totalPoints)) * 100);
      return {
        percentage,
        correctCount: earnedPoints,
        totalUnits: totalPoints,
        summaryText: `Tree Structure: ${percentage}% (${earnedPoints}/${totalPoints} verified)`,
        breakdown
      };
    }
  }, [mode, currentLevel, files, folders, recycleBin]);

  // Check 100% completion & unlock
  const completedLevelsRef = useRef<Set<string>>(new Set());

  // Seed with previously cleared stages so achievements/toasts don't repeat
  useEffect(() => {
    Object.keys(windowsProgress.fileManagementCompleted || {}).forEach(k => {
      if (windowsProgress.fileManagementCompleted[Number(k)]?.score === 100) {
        completedLevelsRef.current.add(`file_management_L${k}`);
      }
    });
    Object.keys(windowsProgress.folderManagementCompleted || {}).forEach(k => {
      if (windowsProgress.folderManagementCompleted[Number(k)]?.score === 100) {
        completedLevelsRef.current.add(`folder_management_L${k}`);
      }
    });
  }, []);

  useEffect(() => {
    if (auditEvaluation.percentage === 100) {
      const key = `${mode}_L${currentLevel}`;
      if (!completedLevelsRef.current.has(key)) {
        completedLevelsRef.current.add(key);
        const result = recordLevelCompletion(mode, currentLevel, 100);
        // Preserve active current level on completed stage
        setWindowsProgress(prev => ({
          ...result.updatedProgress,
          fileManagementCurrentLevel: mode === 'file_management' ? currentLevel : prev.fileManagementCurrentLevel,
          folderManagementCurrentLevel: mode === 'folder_management' ? currentLevel : prev.folderManagementCurrentLevel
        }));
        if (result.expEarned > 0 && onExpAwarded) {
          onExpAwarded(result.expEarned);
        }
        if (result.newAchievements.length > 0) {
          soundEffects.playTone('success');
          showToast('🏆', `Unlocked Achievement: ${result.newAchievements[0].title}!`);
        }
      }
    }
  }, [auditEvaluation.percentage, mode, currentLevel, onExpAwarded, showToast]);

  // Advance Next Stage
  const handleAdvanceNextStage = () => {
    const totalLevels = mode === 'file_management' ? 5 : 7;
    if (currentLevel < totalLevels) {
      const nextLvl = currentLevel + 1;
      handleSelectLevel(nextLvl);
      soundEffects.playTone('success');
      showToast('🚀', `Advanced to Stage ${nextLvl}!`);
    } else {
      soundEffects.playTone('success');
      showToast('🎉', `You have mastered all ${totalLevels} stages of this curriculum!`);
    }
  };

  // Give Hint
  const handleGiveHint = () => {
    soundEffects.playTone('click');
    const firstIssue = auditEvaluation.breakdown.find(b => !b.isCorrect);
    if (firstIssue) {
      showToast('💡', `Hint: ${firstIssue.label} (${firstIssue.statusText})`);
    } else {
      showToast('🎉', 'Everything is perfectly organized!');
    }
  };

  // Auto-Fix / Fix Everything
  const handleAutoFix = () => {
    soundEffects.playTone('success');
    if (mode === 'file_management') {
      const lvl = FILE_MANAGEMENT_LEVELS[currentLevel];
      setFiles(prev => prev.map(f => {
        const template = lvl.files.find(tf => tf.id === f.id);
        if (template && template.targetFolderId) {
          return { ...f, parentId: template.targetFolderId };
        }
        return f;
      }));
      showToast('✨', 'Auto-organized all files to target folders!');
    } else {
      const lvl = FOLDER_MANAGEMENT_LEVELS[currentLevel];
      // Build entire expected tree structure
      const newFolders: VirtualFolder[] = [];
      const createNodes = (node: ExpectedFolderNode, parentId: string) => {
        const id = 'folder_auto_' + Math.random().toString(36).substring(2, 7);
        newFolders.push({
          id,
          name: node.name,
          type: 'folder',
          parentId,
          icon: '📁',
          infoTitle: node.infoTitle,
          infoEn: node.infoEn,
          infoBn: node.infoBn
        });
        if (node.children) {
          node.children.forEach(ch => createNodes(ch, id));
        }
      };

      lvl.expectedTree.forEach(rootNode => createNodes(rootNode, 'root'));

      // Move junk folders to recycle bin
      const junkList: VirtualItem[] = [];
      if (lvl.junkFolderNamesToDelete) {
        lvl.junkFolderNamesToDelete.forEach(junkName => {
          junkList.push({
            id: 'junk_' + Math.random().toString(36).substring(2, 6),
            name: junkName,
            type: 'folder',
            parentId: 'recycle_bin',
            originalParentId: 'root'
          });
        });
      }

      setFolders(newFolders);
      setRecycleBin(junkList);
      showToast('✨', 'Auto-constructed the complete folder tree!');
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((document.activeElement?.tagName || '').toLowerCase())) {
        return;
      }

      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && (e.code === 'KeyC' || e.key.toLowerCase() === 'c')) {
        e.preventDefault();
        handleCopy();
      } else if (isCtrl && (e.code === 'KeyX' || e.key.toLowerCase() === 'x')) {
        e.preventDefault();
        handleCut();
      } else if (isCtrl && (e.code === 'KeyV' || e.key.toLowerCase() === 'v')) {
        e.preventDefault();
        handlePaste();
      } else if (e.key === 'Delete' || e.code === 'Delete') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'F2' || e.code === 'F2') {
        e.preventDefault();
        if (selectedItemIds.size === 1) {
          const firstId = Array.from(selectedItemIds)[0];
          const found = files.find(f => f.id === firstId) || folders.find(f => f.id === firstId);
          if (found) setRenameTarget(found);
        }
      } else if (isCtrl && (e.code === 'KeyA' || e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        const activeItems = currentFolderId === 'recycle_bin' 
          ? recycleBin 
          : [...folders.filter(f => f.parentId === currentFolderId), ...files.filter(f => f.parentId === currentFolderId)];
        setSelectedItemIds(new Set(activeItems.map(x => x.id)));
      } else if (e.key === 'Escape') {
        setSelectedItemIds(new Set());
        setContextMenu(c => ({ ...c, isOpen: false }));
        setHoverTooltip(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCopy, handleCut, handlePaste, selectedItemIds, files, folders, currentFolderId, recycleBin]);

  const levelBadge = mode === 'file_management'
    ? (FILE_MANAGEMENT_LEVELS[currentLevel]?.badge || `Level ${currentLevel}`)
    : (FOLDER_MANAGEMENT_LEVELS[currentLevel]?.badge || `Level ${currentLevel}`);

  return (
    <div 
      ref={workbenchRef}
      className={`win-desktop-root ${isFullscreen ? 'is-fullscreen' : ''}`}
      onClick={() => setContextMenu(c => ({ ...c, isOpen: false }))}
    >
      {/* Desktop Surface */}
      <div className="win-desktop-surface">
        {/* Desktop Icons Column */}
        <div className="win-desktop-icons-col">
          {/* This PC */}
          <div 
            className="win-desktop-icon"
            onDoubleClick={() => {
              setIsExplorerOpen(true);
              handleNavigateTo('root');
            }}
          >
            <div style={{ fontSize: '32px' }}>💻</div>
            <span className="win-desktop-icon-label">This PC</span>
          </div>

          {/* Recycle Bin */}
          <div 
            className="win-desktop-icon"
            style={{ position: 'relative' }}
            onDoubleClick={() => {
              setIsExplorerOpen(true);
              handleNavigateTo('recycle_bin');
            }}
          >
            <div style={{ fontSize: '32px' }}>🗑️</div>
            {recycleBin.length > 0 && (
              <span className="win-desktop-icon-badge">{recycleBin.length}</span>
            )}
            <span className="win-desktop-icon-label">Recycle Bin</span>
          </div>

          {/* Curriculum */}
          <div 
            className="win-desktop-icon"
            onClick={() => setIsCurriculumOpen(true)}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
            }}>
              📚
            </div>
            <span className="win-desktop-icon-label">Curriculum</span>
          </div>

          {/* AI Audit */}
          <div 
            className="win-desktop-icon"
            onClick={() => setIsAuditModalOpen(true)}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)'
            }}>
              ⭐
            </div>
            <span className="win-desktop-icon-label">AI Audit</span>
          </div>

          {/* Achievements */}
          <div 
            className="win-desktop-icon"
            onClick={() => setIsAchievementsOpen(true)}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #d97706, #f59e0b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4)'
            }}>
              🏆
            </div>
            <span className="win-desktop-icon-label">Badges</span>
          </div>

          {/* Full Screen Desktop Button */}
          <div 
            className="win-desktop-icon"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen Window Mode'}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)'
            }}>
              {isFullscreen ? '🗗' : '⛶'}
            </div>
            <span className="win-desktop-icon-label">{isFullscreen ? 'Exit Full' : 'Full Screen'}</span>
          </div>

          {/* Back to Lab Hub */}
          {onBackToDashboard && (
            <div 
              className="win-desktop-icon"
              onClick={onBackToDashboard}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🔙
              </div>
              <span className="win-desktop-icon-label">Hub</span>
            </div>
          )}
        </div>

        {/* File Explorer Window */}
        <ExplorerWindow 
          isOpen={isExplorerOpen}
          onClose={() => setIsExplorerOpen(false)}
          onMinimize={() => setIsExplorerOpen(false)}
          mode={mode}
          levelNumber={currentLevel}
          levelBadge={levelBadge}
          currentFolderId={currentFolderId}
          virtualFS={{ folders, files, recycleBin }}
          selectedItemIds={selectedItemIds}
          clipboard={clipboard}
          onNavigateTo={handleNavigateTo}
          onSelectItems={setSelectedItemIds}
          onOpenItem={handleOpenItem}
          onNewFolder={() => setIsNewFolderOpen(true)}
          onCut={handleCut}
          onCopy={handleCopy}
          onPaste={handlePaste}
          onRename={() => {
            if (selectedItemIds.size === 1) {
              const firstId = Array.from(selectedItemIds)[0];
              const found = files.find(f => f.id === firstId) || folders.find(f => f.id === firstId);
              if (found) setRenameTarget(found);
            }
          }}
          onDelete={handleDelete}
          onCheckScore={() => setIsAuditModalOpen(true)}
          onDropItems={handleDropItems}
          onContextMenu={(e, item) => {
            setContextMenu({
              x: e.clientX,
              y: e.clientY,
              isOpen: true,
              item
            });
          }}
          onShowTooltip={setHoverTooltip}
          navHistory={navHistory}
          navIndex={navIndex}
          onNavBack={handleNavBack}
          onNavForward={handleNavForward}
          onNavUp={handleNavUp}
        />

        {/* Dita AI Copilot Floating Card */}
        <DitaCopilotCard 
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          mode={mode}
          onSwitchMode={handleSwitchMode}
          currentLevel={currentLevel}
          maxUnlockedLevel={maxUnlockedLevel}
          onSelectLevel={handleSelectLevel}
          scorePercentage={auditEvaluation.percentage}
          scoreSummaryText={auditEvaluation.summaryText}
          onAdvanceNextStage={handleAdvanceNextStage}
          hasNextStage={currentLevel < (mode === 'file_management' ? 5 : 7)}
          onGiveHint={handleGiveHint}
          onResetLevel={() => initLevel(mode, currentLevel, true)}
        />
      </div>

      {/* Taskbar */}
      <WindowsTaskbar 
        isExplorerOpen={isExplorerOpen}
        onToggleExplorer={() => setIsExplorerOpen(!isExplorerOpen)}
        onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        onNewFolder={() => setIsNewFolderOpen(true)}
        mode={mode}
        onSwitchMode={handleSwitchMode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Context Menu */}
      <ContextMenu 
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        targetItem={contextMenu.item}
        hasClipboard={clipboard.action !== null && clipboard.itemIds.length > 0}
        hasSelection={selectedItemIds.size > 0}
        onOpenItem={() => {
          if (contextMenu.item) handleOpenItem(contextMenu.item);
        }}
        onPasteIntoFolder={() => {
          if (contextMenu.item?.type === 'folder') {
            executePasteInto(contextMenu.item.id);
          }
        }}
        onCut={handleCut}
        onCopy={handleCopy}
        onRename={() => {
          if (contextMenu.item) setRenameTarget(contextMenu.item);
        }}
        onDelete={handleDelete}
        onPaste={handlePaste}
        onNewFolder={() => setIsNewFolderOpen(true)}
        onSelectAll={() => {
          const activeItems = currentFolderId === 'recycle_bin' 
            ? recycleBin 
            : [...folders.filter(f => f.parentId === currentFolderId), ...files.filter(f => f.parentId === currentFolderId)];
          setSelectedItemIds(new Set(activeItems.map(x => x.id)));
        }}
        onAudit={() => setIsAuditModalOpen(true)}
        onClose={() => setContextMenu(c => ({ ...c, isOpen: false }))}
      />

      {/* Bilingual Hover Tooltip */}
      <BilingualTooltip data={hoverTooltip} />

      {/* Modals */}
      <FilePreviewModal 
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <NewFolderModal 
        isOpen={isNewFolderOpen}
        onClose={() => setIsNewFolderOpen(false)}
        onSubmit={handleCreateFolder}
      />

      <RenameModal 
        isOpen={renameTarget !== null}
        initialName={renameTarget?.name || ''}
        isFolder={renameTarget?.type === 'folder'}
        onClose={() => setRenameTarget(null)}
        onSubmit={handleRenameSubmit}
      />

      <AuditReportModal 
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        mode={mode}
        levelNumber={currentLevel}
        scorePercentage={auditEvaluation.percentage}
        breakdown={auditEvaluation.breakdown}
        onAutoFix={handleAutoFix}
        onNextStage={handleAdvanceNextStage}
        hasNextStage={currentLevel < (mode === 'file_management' ? 5 : 7)}
      />

      <CurriculumModal 
        isOpen={isCurriculumOpen}
        onClose={() => setIsCurriculumOpen(false)}
        defaultTrack={mode}
      />

      <AchievementsModal 
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        unlockedIds={windowsProgress.unlockedAchievements}
      />

      {/* Toast Notification */}
      {toast.visible && (
        <div className="win-toast">
          <span style={{ fontSize: '16px' }}>{toast.icon}</span>
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
};
