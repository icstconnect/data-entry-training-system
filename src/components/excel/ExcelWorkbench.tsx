import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExcelScenarioLevel, ExcelEvaluationSummary, ExcelDraftData } from '../../types/excel';
import { StudentProgress, Achievement } from '../../types';
import { EXCEL_LEVELS, EXCEL_ACHIEVEMENTS } from '../../data/excelScenariosData';
import { 
  loadExcelDraft, 
  saveExcelDraft, 
  evaluateExcelBatch 
} from '../../services/excelStorageService';
import { ExcelEvaluationModal } from './ExcelEvaluationModal';
import { AchievementShareModal } from '../common/AchievementShareModal';
import './excel.css';

import { 
  FileSpreadsheet, 
  CheckCircle2, 
  RotateCcw, 
  Download, 
  Clock, 
  Sparkles, 
  ChevronLeft, 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  AlertCircle,
  HardDrive, 
  Columns, 
  Rows, 
  PanelBottom, 
  Maximize, 
  Minimize, 
  Maximize2, 
  BookOpen, 
  X 
} from 'lucide-react';

interface ExcelWorkbenchProps {
  levelNumber: number;
  onBackToDashboard: () => void;
  onSelectLevel: (lvl: number) => void;
  studentProgress: StudentProgress;
  onExpAwarded?: (exp: number) => void;
}

export const ExcelWorkbench: React.FC<ExcelWorkbenchProps> = ({
  levelNumber,
  onBackToDashboard,
  onSelectLevel,
  studentProgress,
  onExpAwarded
}) => {
  const level: ExcelScenarioLevel = EXCEL_LEVELS.find(l => l.levelNumber === levelNumber) || EXCEL_LEVELS[0];

  // Responsive View Mode: 'top' (default/recommended) | 'bottom' | 'left' | 'grid' | 'ledger'
  const [viewMode, setViewMode] = useState<'top' | 'bottom' | 'left' | 'grid' | 'ledger'>('top');

  // Full Screen State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Grid Data State: key is "r_c", e.g. "0_0" = value
  const [gridData, setGridData] = useState<Record<string, string>>({});
  const [activeCell, setActiveCell] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [cellEditVal, setCellEditVal] = useState<string>('');
  
  // Ribbon Styling Preferences
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [cellAlign, setCellAlign] = useState<'left' | 'center' | 'right'>('left');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [highlightSourceRow, setHighlightSourceRow] = useState<boolean>(true);

  // Timer & AutoSave
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Evaluation & Modal state
  const [evalSummary, setEvalSummary] = useState<ExcelEvaluationSummary | null>(null);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState<boolean>(false);
  const [shareAchievement, setShareAchievement] = useState<Achievement | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  const gridViewportRef = useRef<HTMLDivElement | null>(null);
  const sourceScrollRef = useRef<HTMLDivElement | null>(null);
  const inlineInputRef = useRef<HTMLInputElement | null>(null);
  const formulaInputRef = useRef<HTMLInputElement | null>(null);
  const workbenchRootRef = useRef<HTMLDivElement | null>(null);

  // Load Saved Draft or Initialize Fresh Grid
  useEffect(() => {
    const savedDraft = loadExcelDraft(level.levelNumber);
    if (savedDraft) {
      setGridData(savedDraft.gridData || {});
      setElapsedSeconds(savedDraft.elapsedSeconds || 0);
      setActiveCell(savedDraft.activeCell || { row: 0, col: 0 });
      setLastSavedTime(savedDraft.savedAt ? new Date(savedDraft.savedAt).toLocaleTimeString() : 'Loaded draft');
    } else {
      setGridData({});
      setElapsedSeconds(0);
      setActiveCell({ row: 0, col: 0 });
      setLastSavedTime('New Sheet');
    }
    setIsEditing(false);
    setTimeout(() => {
      workbenchRootRef.current?.focus();
    }, 100);
  }, [level.levelNumber]);

  // Handle global data cleared event
  useEffect(() => {
    const handleDataCleared = () => {
      setGridData({});
      setElapsedSeconds(0);
      setActiveCell({ row: 0, col: 0 });
      setLastSavedTime('New Sheet');
      setIsEditing(false);
      setEvalSummary(null);
    };
    window.addEventListener('icst_data_cleared', handleDataCleared);
    return () => window.removeEventListener('icst_data_cleared', handleDataCleared);
  }, []);

  // Full Screen API Synchronizer
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      workbenchRootRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error("Exit fullscreen error:", err);
      });
    }
  };

  // Persistent Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Debounced Auto-Save Draft to LocalStorage (Never lost!)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSaving(true);
      const nowStr = new Date().toISOString();
      const draft: ExcelDraftData = {
        levelNumber: level.levelNumber,
        gridData,
        elapsedSeconds,
        activeCell,
        savedAt: nowStr
      };
      saveExcelDraft(draft);
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsSaving(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [gridData, elapsedSeconds, activeCell, level.levelNumber]);

  // Current active cell coordinates and active value
  const currentKey = `${activeCell.row}_${activeCell.col}`;
  const currentCellVal = gridData[currentKey] ?? '';
  const currentColDef = level.columns[activeCell.col];
  const activeCoordinate = `${currentColDef ? currentColDef.colLetter : 'A'}${activeCell.row + 1}`;

  // Current source target value for helper indicator
  const currentSourceVal = level.sourceRecords[activeCell.row]?.[currentColDef?.id] !== undefined
    ? String(level.sourceRecords[activeCell.row][currentColDef.id])
    : '';

  // Keep cell edit value in sync when selection changes and not editing
  useEffect(() => {
    if (!isEditing) {
      setCellEditVal(currentCellVal);
    }
  }, [activeCell, currentCellVal, isEditing]);

  // Focus input and move caret to end when editing starts
  useEffect(() => {
    if (isEditing && inlineInputRef.current) {
      inlineInputRef.current.focus();
      const len = inlineInputRef.current.value.length;
      inlineInputRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  // Auto-scroll selected cell into view in both Excel grid and Source Ledger
  useEffect(() => {
    if (gridViewportRef.current) {
      const activeEl = gridViewportRef.current.querySelector('.cell-selected');
      if (activeEl) {
        (activeEl as HTMLElement).scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
    if (sourceScrollRef.current) {
      const activeSourceEl = sourceScrollRef.current.querySelector('.active-source-cell');
      if (activeSourceEl) {
        (activeSourceEl as HTMLElement).scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
  }, [activeCell]);

  // Format Timer String
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isOvertime = elapsedSeconds > level.timeLimitSeconds;

  // Commit value to a specific cell
  const commitCell = useCallback((row: number, col: number, val: string) => {
    setGridData(prev => {
      const key = `${row}_${col}`;
      if (prev[key] === val) return prev;
      return { ...prev, [key]: val };
    });
    setIsEditing(false);
  }, []);

  // Unified commit and move function: handles arrow keys, Tab, Enter with optional wrapping
  const commitAndMove = useCallback((
    dRow: number, 
    dCol: number, 
    currentVal?: string, 
    wrap = false
  ) => {
    const valToCommit = currentVal !== undefined ? currentVal : cellEditVal;
    const curRow = activeCell.row;
    const curCol = activeCell.col;
    const totalRows = level.sourceRecords.length;
    const totalCols = level.columns.length;

    // Save current cell value
    setGridData(prev => {
      const key = `${curRow}_${curCol}`;
      if (prev[key] === valToCommit) return prev;
      return { ...prev, [key]: valToCommit };
    });
    setIsEditing(false);

    // Compute target coordinates
    let targetRow = curRow;
    let targetCol = curCol;

    if (wrap && dCol > 0 && curCol === totalCols - 1) {
      // Wrap to next line
      if (curRow < totalRows - 1) {
        targetRow = curRow + 1;
        targetCol = 0;
      }
    } else if (wrap && dCol < 0 && curCol === 0) {
      // Wrap backward to previous line
      if (curRow > 0) {
        targetRow = curRow - 1;
        targetCol = totalCols - 1;
      }
    } else {
      targetRow = Math.max(0, Math.min(totalRows - 1, curRow + dRow));
      targetCol = Math.max(0, Math.min(totalCols - 1, curCol + dCol));
    }

    setActiveCell({ row: targetRow, col: targetCol });

    // Ensure keyboard focus returns to the workbench root
    requestAnimationFrame(() => {
      workbenchRootRef.current?.focus();
    });
  }, [activeCell, cellEditVal, level.sourceRecords.length, level.columns.length]);

  // Handle Tab, Enter, Arrows, F2, Backspace, Esc on workbench root
  const handleGridKeyDown = (e: React.KeyboardEvent) => {
    // If typing inside an input element, let that input handle its own events
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      commitAndMove(0, e.shiftKey ? -1 : 1, undefined, true);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      commitAndMove(e.shiftKey ? -1 : 1, 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      commitAndMove(-1, 0);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      commitAndMove(1, 0);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      commitAndMove(0, -1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      commitAndMove(0, 1);
    } else if (e.key === 'F2') {
      e.preventDefault();
      setIsEditing(true);
      setCellEditVal(currentCellVal);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      commitCell(activeCell.row, activeCell.col, '');
      setCellEditVal('');
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Direct typing into selected cell:
      // PREVENT DEFAULT is essential to prevent browser from inserting the character a second time!
      e.preventDefault();
      setIsEditing(true);
      setCellEditVal(e.key);
    }
  };

  // Submit and Audit Batch
  const handleSubmitBatch = () => {
    if (isEditing) {
      commitCell(activeCell.row, activeCell.col, cellEditVal);
    }

    const summary = evaluateExcelBatch(
      level,
      gridData,
      elapsedSeconds,
      studentProgress.studentIdentity
    );

    setEvalSummary(summary);
    setIsEvalModalOpen(true);

    if (summary.expEarned > 0 && onExpAwarded) {
      onExpAwarded(summary.expEarned);
    }
  };

  // Direct In-Place Corrections handler from ExcelEvaluationModal
  const handleApplyCorrections = (corrections: Record<string, string>) => {
    const nextGrid = { ...gridData, ...corrections };
    setGridData(nextGrid);
    saveExcelDraft({
      levelNumber: level.levelNumber,
      gridData: nextGrid,
      activeCell,
      elapsedSeconds,
      savedAt: new Date().toISOString()
    });
    const freshSummary = evaluateExcelBatch(
      level,
      nextGrid,
      elapsedSeconds,
      studentProgress.studentIdentity
    );
    setEvalSummary(freshSummary);
    if (freshSummary.expEarned > 0 && onExpAwarded) {
      onExpAwarded(freshSummary.expEarned);
    }
  };

  // Reset/Clear Grid In-App Dialog Handlers
  const handleResetGrid = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    setGridData({});
    setActiveCell({ row: 0, col: 0 });
    setIsEditing(false);
    setIsResetConfirmOpen(false);
    setTimeout(() => {
      workbenchRootRef.current?.focus();
    }, 50);
  };

  const handleCancelReset = () => {
    setIsResetConfirmOpen(false);
    setTimeout(() => {
      workbenchRootRef.current?.focus();
    }, 50);
  };

  // Export entered data as CSV file
  const handleExportCSV = () => {
    const headers = level.columns.map(c => `"${c.header.replace(/"/g, '""')}"`).join(',');
    const rows = level.sourceRecords.map((_, rIdx) => {
      return level.columns.map((_, cIdx) => {
        const val = gridData[`${rIdx}_${cIdx}`] ?? '';
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',');
    });
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${level.sheetName}_export.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Cells completion count
  const totalCells = level.sourceRecords.length * level.columns.length;
  const filledCellsCount = Object.values(gridData).filter(v => v.trim() !== '').length;
  const completionPercentage = Math.round((filledCellsCount / totalCells) * 100);

  // Trigger Share Modal
  const handleOpenShare = (sum: ExcelEvaluationSummary) => {
    let ach = sum.unlockedAchievements[0];
    if (!ach) {
      const matchId = level.levelNumber === 1 ? 'excel_novice_grid'
        : level.levelNumber === 2 ? 'excel_commercial_master'
        : level.levelNumber === 3 ? 'excel_banking_kyc'
        : level.levelNumber === 4 ? 'excel_board_marksheet'
        : 'excel_census_grandmaster';
      ach = EXCEL_ACHIEVEMENTS.find(a => a.id === matchId) || EXCEL_ACHIEVEMENTS[0];
    }
    setShareAchievement(ach);
    setIsShareModalOpen(true);
  };

  return (
    <div 
      ref={workbenchRootRef} 
      className={`excel-workbench-root ${isFullscreen ? 'is-fullscreen' : ''}`} 
      onKeyDown={handleGridKeyDown} 
      tabIndex={0}
    >
      {/* Excel Title Bar (Office Green) */}
      <div className="excel-title-bar">
        <div className="excel-title-left">
          <button 
            type="button" 
            onClick={onBackToDashboard}
            className="excel-tool-btn"
            style={{ color: '#fff', gap: '4px', fontWeight: 600 }}
            title="Return to Excel Levels Dashboard"
          >
            <ChevronLeft size={16} />
            <span>Excel Levels</span>
          </button>

          <div className="excel-app-badge">
            <FileSpreadsheet size={14} />
            <span>Excel 365 Mass Data Lab</span>
          </div>

          <div className="excel-filename-tag">
            <span>{level.sheetName}.xlsx</span>
            <span>•</span>
            <span style={{ fontSize: '11px', opacity: 0.85 }}>{level.levelTitle}</span>
          </div>

          <div className="excel-autosave-pill" title="Automatic persistent local storage">
            <HardDrive size={11} />
            <span>{isSaving ? 'Saving...' : `Saved (${lastSavedTime})`}</span>
          </div>
        </div>

        {/* Center: Responsive View Mode Switcher */}
        <div className="excel-view-mode-cluster">
          <button 
            type="button" 
            className={`excel-mode-pill ${viewMode === 'top' ? 'active' : ''}`}
            onClick={() => setViewMode('top')}
            title="Top/Bottom: Reference Ledger on Top, Excel on Bottom (Recommended)"
          >
            <Rows size={12} />
            <span className="mode-pill-text">Top Ledger</span>
          </button>
          <button 
            type="button" 
            className={`excel-mode-pill ${viewMode === 'bottom' ? 'active' : ''}`}
            onClick={() => setViewMode('bottom')}
            title="Bottom Split: Excel on Top, Reference Ledger on Bottom"
          >
            <PanelBottom size={12} />
            <span className="mode-pill-text">Bottom Ledger</span>
          </button>
          <button 
            type="button" 
            className={`excel-mode-pill ${viewMode === 'left' ? 'active' : ''}`}
            onClick={() => setViewMode('left')}
            title="Side-by-Side: Reference Ledger on Left, Excel on Right"
          >
            <Columns size={12} />
            <span className="mode-pill-text">Side Split</span>
          </button>
          <button 
            type="button" 
            className={`excel-mode-pill ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Full Window: Focus Excel Spreadsheet"
          >
            <Maximize2 size={12} />
            <span className="mode-pill-text">Excel Only</span>
          </button>
          <button 
            type="button" 
            className={`excel-mode-pill ${viewMode === 'ledger' ? 'active' : ''}`}
            onClick={() => setViewMode('ledger')}
            title="Full Window: Inspect Reference Ledger"
          >
            <BookOpen size={12} />
            <span className="mode-pill-text">Ledger Only</span>
          </button>
        </div>

        {/* Right: Fullscreen Toggle, Timer, EXP Reward */}
        <div className="excel-title-right">
          <button
            type="button"
            className={`excel-fullscreen-btn ${isFullscreen ? 'active' : ''}`}
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Full Screen Mode (Esc)" : "Enter Full Screen Mode"}
          >
            {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
            <span>{isFullscreen ? "Exit Fullscreen" : "Full Screen"}</span>
          </button>

          <div className={`excel-timer-chip ${isOvertime ? 'overtime' : ''}`} title={`Benchmark: ${formatTime(level.timeLimitSeconds)}`}>
            <Clock size={13} />
            <span>{formatTime(elapsedSeconds)}</span>
            <span style={{ opacity: 0.75, fontSize: '10px' }}>/ {formatTime(level.timeLimitSeconds)}</span>
          </div>

          <div className="excel-autosave-pill" style={{ background: 'rgba(255, 215, 0, 0.25)', color: '#fff9c4' }}>
            <Sparkles size={12} color="#fef08a" />
            <span>+{level.expReward} EXP Max</span>
          </div>
        </div>
      </div>

      {/* Main Split Workspace: Mode handles top/bottom/left/grid/ledger */}
      <div className={`excel-split-workspace split-mode-${viewMode}`}>
        {/* Source Reference Document Pane (Master Ledger) */}
        <section 
          className={`excel-source-pane ${viewMode === 'grid' ? 'mode-hidden' : viewMode === 'ledger' ? 'mode-fullscreen' : ''}`}
          aria-label="Official Source Register Document"
          onCopy={(e) => {
            e.preventDefault();
            alert('Anti-Cheating Policy: Copy-paste from the official source ledger is disabled. Type directly into the Excel spreadsheet cells.');
          }}
        >
          {/* Compact, Informative Source Header */}
          <div className="excel-source-header">
            <div className="excel-source-title-group">
              <span className="excel-source-title">
                <Eye size={14} color="#b45309" />
                Physical Master Ledger
              </span>
              <span className="excel-source-badge">{level.domain}</span>
              <span className="excel-source-level-title" title={level.scenarioName}>
                {level.scenarioName}
              </span>
            </div>

            {/* Target Field Assistant: Highlights exactly what cell corresponds to active cursor */}
            <div className="excel-active-source-badge" title="Active Cell corresponding to cursor in Excel">
              <span className="active-field-lbl">Target Cell:</span>
              <span className="active-field-coord">{activeCoordinate}</span>
              <span className="active-field-col">{currentColDef?.header || ''}</span>
              <span className="active-field-arrow">➔</span>
              <strong className="active-field-val">
                {currentSourceVal !== '' ? `"${currentSourceVal}"` : '<empty>'}
              </strong>
            </div>

            <div className="excel-source-controls">
              <label className="excel-source-checkbox" title="Highlight the entire active row in the ledger">
                <input 
                  type="checkbox" 
                  checked={highlightSourceRow} 
                  onChange={(e) => setHighlightSourceRow(e.target.checked)} 
                />
                <span>Focus Active Row</span>
              </label>

              <div className="excel-source-layout-pills">
                <button 
                  type="button" 
                  className={`layout-pill ${viewMode === 'top' ? 'active' : ''}`}
                  onClick={() => setViewMode('top')}
                  title="Position Source Ledger on TOP"
                >
                  <Rows size={11} />
                  <span>Top</span>
                </button>
                <button 
                  type="button" 
                  className={`layout-pill ${viewMode === 'bottom' ? 'active' : ''}`}
                  onClick={() => setViewMode('bottom')}
                  title="Position Source Ledger at BOTTOM"
                >
                  <PanelBottom size={11} />
                  <span>Bottom</span>
                </button>
                <button 
                  type="button" 
                  className={`layout-pill ${viewMode === 'left' ? 'active' : ''}`}
                  onClick={() => setViewMode('left')}
                  title="Position Source Ledger on LEFT side"
                >
                  <Columns size={11} />
                  <span>Side</span>
                </button>
              </div>
            </div>
          </div>

          <div ref={sourceScrollRef} className="excel-source-content-scroll">
            <div className="ledger-sheet">
              {/* Document Header Line */}
              <div className="ledger-heading">
                <div className="ledger-dept-name">{level.scenarioSubtitle}</div>
                <div className="ledger-doc-title">{level.scenarioName}</div>
                <div className="ledger-subtitle">
                  Official Verification Ledger • Strict Typing Standard Required ({level.sourceRecords.length} records)
                </div>
              </div>

              {/* Source Records Table with Cell-Level Selection Highlight */}
              <div className="ledger-table-wrap">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th style={{ width: '38px', textAlign: 'center' }}>#</th>
                      {level.columns.map((col, cIdx) => {
                        const isColActive = activeCell.col === cIdx;
                        return (
                          <th 
                            key={col.id} 
                            style={{ minWidth: col.width ? `${col.width * 0.9}px` : 'auto' }}
                            className={isColActive ? 'source-th-active' : ''}
                          >
                            <span className="source-col-letter">{col.colLetter}</span>
                            <span className="source-col-title">{col.header}</span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {level.sourceRecords.map((row, rIdx) => {
                      const isActiveRow = activeCell.row === rIdx;
                      return (
                        <tr key={rIdx} className={isActiveRow && highlightSourceRow ? 'active-source-row' : ''}>
                          <td style={{ textAlign: 'center', fontWeight: 700, color: '#78350f' }}>
                            {isActiveRow ? <span className="ledger-row-pin">{rIdx + 1}</span> : rIdx + 1}
                          </td>
                          {level.columns.map((col, cIdx) => {
                            const isSelectedCell = activeCell.row === rIdx && activeCell.col === cIdx;
                            return (
                              <td 
                                key={col.id} 
                                className={`ledger-cell ${isSelectedCell ? 'active-source-cell' : ''}`}
                                style={{ textAlign: col.align || 'left' }}
                                title={`Record #${rIdx + 1} • ${col.header}: Click to select in Excel`}
                                onClick={() => {
                                  if (isEditing) {
                                    commitCell(activeCell.row, activeCell.col, cellEditVal);
                                  }
                                  setActiveCell({ row: rIdx, col: cIdx });
                                  workbenchRootRef.current?.focus();
                                }}
                              >
                                {isSelectedCell ? (
                                  <span className="source-cell-highlight-badge">
                                    {String(row[col.id] ?? '')}
                                  </span>
                                ) : (
                                  String(row[col.id] ?? '')
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Compact Auditor Typing Guidelines */}
              <div className="ledger-guidelines-strip">
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <AlertCircle size={13} color="#b45309" />
                  <span>Auditor Guidelines:</span>
                </div>
                {level.tips.map((tip, idx) => (
                  <span key={idx} className="guideline-item">• {tip}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Microsoft Excel Spreadsheet Grid */}
        <section 
          className={`excel-grid-pane ${viewMode === 'ledger' ? 'mode-hidden' : viewMode === 'grid' ? 'mode-fullscreen' : ''}`} 
          aria-label="Interactive Excel Spreadsheet"
        >
          {/* Excel Ribbon Bar */}
          <div className="excel-ribbon-bar">
            <div className="excel-ribbon-group">
              <button 
                type="button" 
                className={`excel-tool-btn ${isBold ? 'active' : ''}`}
                onClick={() => setIsBold(!isBold)}
                title="Toggle Bold (Visual aid)"
              >
                <Bold size={13} />
              </button>
              <button 
                type="button" 
                className={`excel-tool-btn ${isItalic ? 'active' : ''}`}
                onClick={() => setIsItalic(!isItalic)}
                title="Toggle Italic"
              >
                <Italic size={13} />
              </button>

              <div className="excel-separator" />

              <button 
                type="button" 
                className={`excel-tool-btn ${cellAlign === 'left' ? 'active' : ''}`}
                onClick={() => setCellAlign('left')}
                title="Align Left"
              >
                <AlignLeft size={13} />
              </button>
              <button 
                type="button" 
                className={`excel-tool-btn ${cellAlign === 'center' ? 'active' : ''}`}
                onClick={() => setCellAlign('center')}
                title="Align Center"
              >
                <AlignCenter size={13} />
              </button>
              <button 
                type="button" 
                className={`excel-tool-btn ${cellAlign === 'right' ? 'active' : ''}`}
                onClick={() => setCellAlign('right')}
                title="Align Right"
              >
                <AlignRight size={13} />
              </button>

              <div className="excel-separator" />

              <button 
                type="button" 
                className="excel-tool-btn"
                onClick={() => setZoomLevel(prev => Math.min(prev + 10, 130))}
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
              <button 
                type="button" 
                className="excel-tool-btn"
                onClick={() => setZoomLevel(prev => Math.max(prev - 10, 80))}
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span style={{ fontSize: '11px', color: '#605e5c', fontFamily: 'var(--font-mono)' }}>{zoomLevel}%</span>
            </div>

            <div className="excel-ribbon-group">
              <button
                type="button"
                className="excel-tool-btn"
                onClick={handleResetGrid}
                title="Clear all entered cells"
              >
                <RotateCcw size={13} />
                <span>Clear Draft</span>
              </button>

              <button
                type="button"
                className="excel-tool-btn"
                onClick={handleExportCSV}
                title="Download spreadsheet as CSV"
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                className="excel-btn-submit"
                onClick={handleSubmitBatch}
                title="Audit and verify batch entries against source"
              >
                <CheckCircle2 size={15} />
                <span>Validate & Audit Batch</span>
              </button>
            </div>
          </div>

          {/* Excel Formula Bar */}
          <div className="excel-formula-bar">
            <div className="excel-name-box" title="Active Cell Coordinate">
              {activeCoordinate}
            </div>

            <div className="excel-fx-symbol" title="Formula indicator">
              fx
            </div>

            <input
              ref={formulaInputRef}
              type="text"
              className="excel-formula-input"
              value={isEditing ? cellEditVal : currentCellVal}
              onChange={(e) => {
                if (!isEditing) setIsEditing(true);
                setCellEditVal(e.target.value);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commitAndMove(e.shiftKey ? -1 : 1, 0, e.currentTarget.value);
                } else if (e.key === 'Tab') {
                  e.preventDefault();
                  commitAndMove(0, e.shiftKey ? -1 : 1, e.currentTarget.value, true);
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  setCellEditVal(currentCellVal);
                  setIsEditing(false);
                  workbenchRootRef.current?.focus();
                }
              }}
              placeholder={`Enter value for cell ${activeCoordinate}...`}
            />
          </div>

          {/* Spreadsheet Table Viewport */}
          <div 
            ref={gridViewportRef}
            className="excel-sheet-viewport" 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
          >
            <table className="excel-table-grid">
              <thead>
                <tr>
                  {/* Corner Header */}
                  <th className="excel-corner-header" onClick={() => setActiveCell({ row: 0, col: 0 })} />
                  
                  {/* Column Letter Headers (A, B, C...) */}
                  {level.columns.map((col, cIdx) => {
                    const isColActive = activeCell.col === cIdx;
                    return (
                      <th 
                        key={col.id} 
                        className={`excel-col-header ${isColActive ? 'col-active' : ''}`}
                        style={{ width: `${col.width || 140}px` }}
                        onClick={() => setActiveCell(prev => ({ ...prev, col: cIdx }))}
                      >
                        <div>{col.colLetter}</div>
                        <span className="excel-col-title-sub" title={col.header}>
                          {col.header}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {level.sourceRecords.map((_, rIdx) => {
                  const isRowActive = activeCell.row === rIdx;
                  return (
                    <tr key={rIdx}>
                      {/* Row Number Header (1, 2, 3...) */}
                      <th 
                        className={`excel-row-header ${isRowActive ? 'row-active' : ''}`}
                        onClick={() => setActiveCell(prev => ({ ...prev, row: rIdx }))}
                      >
                        {rIdx + 1}
                      </th>

                      {/* Row Data Cells */}
                      {level.columns.map((col, cIdx) => {
                        const isSelected = activeCell.row === rIdx && activeCell.col === cIdx;
                        const cellKey = `${rIdx}_${cIdx}`;
                        const cellVal = gridData[cellKey] ?? '';

                        return (
                          <td
                            key={col.id}
                            className={`excel-data-cell ${isSelected ? 'cell-selected' : ''} ${col.align === 'right' ? 'align-right' : col.align === 'center' ? 'align-center' : ''}`}
                            style={{
                              fontWeight: isBold ? 700 : 400,
                              fontStyle: isItalic ? 'italic' : 'normal',
                              textAlign: cellAlign !== 'left' ? cellAlign : (col.align || 'left')
                            }}
                            onClick={() => {
                              if (isEditing) {
                                commitCell(activeCell.row, activeCell.col, cellEditVal);
                              }
                              setActiveCell({ row: rIdx, col: cIdx });
                              workbenchRootRef.current?.focus();
                            }}
                            onDoubleClick={() => {
                              setActiveCell({ row: rIdx, col: cIdx });
                              setIsEditing(true);
                              setCellEditVal(cellVal);
                            }}
                          >
                            {isSelected && isEditing ? (
                              <input
                                ref={inlineInputRef}
                                type="text"
                                className="excel-cell-input"
                                value={cellEditVal}
                                onChange={(e) => setCellEditVal(e.target.value)}
                                onBlur={() => {
                                  if (isEditing) {
                                    commitCell(activeCell.row, activeCell.col, cellEditVal);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Tab') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    commitAndMove(0, e.shiftKey ? -1 : 1, e.currentTarget.value, true);
                                  } else if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    commitAndMove(e.shiftKey ? -1 : 1, 0, e.currentTarget.value);
                                  } else if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    commitAndMove(1, 0, e.currentTarget.value);
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    commitAndMove(-1, 0, e.currentTarget.value);
                                  } else if (e.key === 'ArrowRight') {
                                    const inputEl = e.currentTarget;
                                    const isAtEnd = inputEl.selectionEnd === inputEl.value.length;
                                    const isAllSelected = inputEl.selectionStart === 0 && inputEl.selectionEnd === inputEl.value.length;
                                    if (isAtEnd || isAllSelected) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      commitAndMove(0, 1, e.currentTarget.value, true);
                                    }
                                  } else if (e.key === 'ArrowLeft') {
                                    const inputEl = e.currentTarget;
                                    const isAtStart = inputEl.selectionStart === 0;
                                    const isAllSelected = inputEl.selectionStart === 0 && inputEl.selectionEnd === inputEl.value.length;
                                    if (isAtStart || isAllSelected) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      commitAndMove(0, -1, e.currentTarget.value, true);
                                    }
                                  } else if (e.key === 'Escape') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCellEditVal(currentCellVal);
                                    setIsEditing(false);
                                    workbenchRootRef.current?.focus();
                                  }
                                }}
                              />
                            ) : (
                              <span>{cellVal}</span>
                            )}

                            {isSelected && <div className="excel-fill-handle" />}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Sheet Tab & Status Bar */}
          <div className="excel-bottom-bar">
            <div className="excel-sheet-tabs-cluster">
              <div className="excel-sheet-tab">
                <FileSpreadsheet size={13} />
                <span>{level.sheetName}</span>
              </div>
            </div>

            <div className="excel-status-info">
              <span>Ready</span>
              <span>Cell: {activeCoordinate}</span>
              <span>
                Progress: {filledCellsCount} / {totalCells} ({completionPercentage}%)
              </span>
              <span>Navigation: Tab / Enter / Arrow Keys</span>
            </div>
          </div>
        </section>
      </div>

      {/* Discrepancy & Evaluation Modal */}
      {isEvalModalOpen && evalSummary && (
        <ExcelEvaluationModal
          summary={evalSummary}
          level={level}
          onClose={() => setIsEvalModalOpen(false)}
          onRetry={() => setIsEvalModalOpen(false)}
          onNextLevel={() => {
            setIsEvalModalOpen(false);
            if (level.levelNumber < 5) {
              onSelectLevel(level.levelNumber + 1);
            }
          }}
          onShare={(sum) => handleOpenShare(sum)}
          onApplyCorrections={handleApplyCorrections}
        />
      )}

      {/* Achievement Share Modal */}
      {isShareModalOpen && evalSummary && (
        <AchievementShareModal
          summary={{
            uid: `excel-level-${level.levelNumber}`,
            levelNumber: level.levelNumber,
            stageNumber: 1,
            totalEvaluatedUnits: evalSummary.totalCells,
            correctUnits: evalSummary.correctCells,
            incorrectUnits: evalSummary.incorrectCells,
            missingUnits: evalSummary.missingCells,
            timeTakenSeconds: evalSummary.timeTakenSeconds,
            timeLimitSeconds: level.timeLimitSeconds,
            accuracyPercentage: evalSummary.accuracyPercentage,
            requiredAccuracy: level.targetAccuracy,
            passed: evalSummary.passed,
            expEarned: evalSummary.expEarned,
            isGuidedMode: false,
            fieldResults: [],
            cellResults: [],
            unlockedAchievements: evalSummary.unlockedAchievements,
            submittedAt: evalSummary.submittedAt,
            studentIdentity: studentProgress.studentIdentity
          }}
          achievement={shareAchievement || undefined}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {/* In-App Confirmation Modal: Clear Excel Draft */}
      {isResetConfirmOpen && (
        <div className="modal-overlay" style={{ zIndex: 1300 }} onClick={handleCancelReset}>
          <div className="modal-card" style={{ maxWidth: '440px', padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{
              background: 'linear-gradient(135deg, #107c41, #0b5a2f)',
              color: '#ffffff',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <RotateCcw size={18} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>
                    Clear Excel Draft?
                  </h3>
                  <span style={{ fontSize: '11px', opacity: 0.85 }}>
                    {level.sheetName}.xlsx • Level {level.levelNumber}
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleCancelReset}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  opacity: 0.8,
                  padding: '4px'
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: '20px', color: 'var(--text-primary)', fontSize: '13px', lineHeight: 1.5 }}>
              <p style={{ margin: '0 0 12px 0' }}>
                Are you sure you want to clear all entered data in this Excel worksheet?
              </p>
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#92400e',
                fontSize: '12px',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start'
              }}>
                <AlertCircle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  All {filledCellsCount} entered cells and local draft edits will be reset. The source ledger records will remain unchanged for you to re-type.
                </span>
              </div>
            </div>

            <div className="modal-footer" style={{
              padding: '12px 20px',
              background: 'var(--bg-card-header, #f8fafc)',
              borderTop: '1px solid var(--border-light, #e2e8f0)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelReset}
                style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmReset}
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
                autoFocus
              >
                <RotateCcw size={14} />
                <span>Clear All Cells</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
