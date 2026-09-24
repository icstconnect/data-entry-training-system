import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExcelScenarioLevel, ExcelEvaluationSummary, ExcelDraftData } from '../../types/excel';
import { StudentProgress, Achievement } from '../../types';
import { EXCEL_LEVELS, EXCEL_ACHIEVEMENTS } from '../../data/excelScenariosData';
import { 
  loadExcelDraft, 
  saveExcelDraft, 
  evaluateExcelBatch, 
  loadExcelProgress 
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
  HardDrive
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

  const gridViewportRef = useRef<HTMLDivElement | null>(null);
  const inlineInputRef = useRef<HTMLInputElement | null>(null);
  const formulaInputRef = useRef<HTMLInputElement | null>(null);

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
  }, [level.levelNumber]);

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

  // Keep cell edit value in sync when selection changes and not editing
  useEffect(() => {
    if (!isEditing) {
      setCellEditVal(currentCellVal);
    }
  }, [activeCell, currentCellVal, isEditing]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inlineInputRef.current) {
      inlineInputRef.current.focus();
    }
  }, [isEditing]);

  // Format Timer String
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isOvertime = elapsedSeconds > level.timeLimitSeconds;

  // Move active cell
  const moveActiveCell = useCallback((dRow: number, dCol: number) => {
    setActiveCell(prev => {
      const totalRows = level.sourceRecords.length;
      const totalCols = level.columns.length;
      const newRow = Math.max(0, Math.min(totalRows - 1, prev.row + dRow));
      const newCol = Math.max(0, Math.min(totalCols - 1, prev.col + dCol));
      return { row: newRow, col: newCol };
    });
    setIsEditing(false);
  }, [level.sourceRecords.length, level.columns.length]);

  // Save current edit value into grid
  const commitEdit = useCallback((val: string) => {
    setGridData(prev => ({
      ...prev,
      [`${activeCell.row}_${activeCell.col}`]: val
    }));
    setIsEditing(false);
  }, [activeCell]);

  // Handle Tab, Enter, Arrows, F2, Esc in Grid
  const handleGridKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitEdit(cellEditVal);
        if (e.shiftKey) {
          moveActiveCell(-1, 0);
        } else {
          moveActiveCell(1, 0);
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        commitEdit(cellEditVal);
        if (e.shiftKey) {
          moveActiveCell(0, -1);
        } else {
          if (activeCell.col >= level.columns.length - 1) {
            // Wrap to next row
            if (activeCell.row < level.sourceRecords.length - 1) {
              setActiveCell({ row: activeCell.row + 1, col: 0 });
              setIsEditing(false);
            }
          } else {
            moveActiveCell(0, 1);
          }
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setCellEditVal(currentCellVal);
        setIsEditing(false);
      }
      return;
    }

    // When NOT in inline edit mode
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        moveActiveCell(0, -1);
      } else {
        if (activeCell.col >= level.columns.length - 1) {
          if (activeCell.row < level.sourceRecords.length - 1) {
            setActiveCell({ row: activeCell.row + 1, col: 0 });
          }
        } else {
          moveActiveCell(0, 1);
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        moveActiveCell(-1, 0);
      } else {
        moveActiveCell(1, 0);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActiveCell(-1, 0);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActiveCell(1, 0);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveActiveCell(0, -1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveActiveCell(0, 1);
    } else if (e.key === 'F2') {
      e.preventDefault();
      setIsEditing(true);
      setCellEditVal(currentCellVal);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      commitEdit('');
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Direct typing into selected cell enters edit mode with that initial char
      setIsEditing(true);
      setCellEditVal(e.key);
    }
  };

  // Submit and Audit Batch
  const handleSubmitBatch = () => {
    if (isEditing) {
      commitEdit(cellEditVal);
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

  // Reset/Clear Grid
  const handleResetGrid = () => {
    if (window.confirm('Are you sure you want to clear all entered data in this Excel sheet?')) {
      setGridData({});
      setActiveCell({ row: 0, col: 0 });
      setIsEditing(false);
    }
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
    // If summary has unlocked achievements, use the first one, or pick the level achievement
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
    <div className="excel-workbench-root" onKeyDown={handleGridKeyDown} tabIndex={0}>
      {/* Excel Title Bar (Emerald Green) */}
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

        <div className="excel-title-right">
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

      {/* Main Split Workspace */}
      <div className="excel-split-workspace">
        {/* Left Side: Physical Ledger Reference Document */}
        <section 
          className="excel-source-pane"
          aria-label="Official Source Register Document"
          onCopy={(e) => {
            e.preventDefault();
            alert('Anti-Cheating Policy: Copy-paste from the official source ledger is disabled. Type directly into the Excel spreadsheet cells.');
          }}
        >
          <div className="excel-source-header">
            <div className="excel-source-title-group">
              <span className="excel-source-title">
                <Eye size={14} color="#b45309" />
                Physical Master Ledger
              </span>
              <span className="excel-source-badge">{level.domain}</span>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={highlightSourceRow} 
                onChange={(e) => setHighlightSourceRow(e.target.checked)} 
              />
              <span>Focus Active Row</span>
            </label>
          </div>

          <div className="excel-source-content-scroll">
            <div className="ledger-sheet">
              {/* Watermark / Department Header */}
              <div className="ledger-heading">
                <div className="ledger-dept-name">{level.scenarioSubtitle}</div>
                <div className="ledger-doc-title">{level.scenarioName}</div>
                <div className="ledger-subtitle">
                  Official Verification Ledger • Strict Typing Standard Required
                </div>
              </div>

              {/* Source Records Table */}
              <div className="ledger-table-wrap">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th style={{ width: '38px', textAlign: 'center' }}>#</th>
                      {level.columns.map(col => (
                        <th key={col.id} style={{ minWidth: col.width ? `${col.width * 0.9}px` : 'auto' }}>
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {level.sourceRecords.map((row, rIdx) => {
                      const isActiveRow = highlightSourceRow && activeCell.row === rIdx;
                      return (
                        <tr key={rIdx} className={isActiveRow ? 'active-source-row' : ''}>
                          <td style={{ textAlign: 'center', fontWeight: 700, color: '#78350f' }}>
                            {isActiveRow ? <span className="ledger-row-pin">{rIdx + 1}</span> : rIdx + 1}
                          </td>
                          {level.columns.map(col => (
                            <td key={col.id} style={{ textAlign: col.align || 'left' }}>
                              {String(row[col.id] ?? '')}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Ledger Footer Tips */}
              <div style={{ marginTop: '14px', padding: '10px 12px', background: '#f5eedf', borderRadius: '4px', fontSize: '11px', color: '#574833', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <AlertCircle size={13} color="#b45309" />
                  <span>Auditor Typing Guidelines:</span>
                </div>
                {level.tips.map((tip, idx) => (
                  <div key={idx}>• {tip}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Authentic Microsoft Excel Grid Simulation */}
        <section className="excel-grid-pane" aria-label="Interactive Excel Spreadsheet">
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
                if (e.key === 'Enter') {
                  commitEdit(e.currentTarget.value);
                  moveActiveCell(1, 0);
                } else if (e.key === 'Tab') {
                  e.preventDefault();
                  commitEdit(e.currentTarget.value);
                  moveActiveCell(0, 1);
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
                              if (isEditing && !isSelected) {
                                commitEdit(cellEditVal);
                              }
                              setActiveCell({ row: rIdx, col: cIdx });
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
                                onBlur={() => commitEdit(cellEditVal)}
                                autoFocus
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
              <span>Navigation: Tab / Enter / Arrows</span>
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
    </div>
  );
};
