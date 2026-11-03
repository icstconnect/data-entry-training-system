import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  TerminalScenario, 
  TerminalEvaluationSummary, 
  TerminalDraftData,
  FieldDiffResult
} from '../../types/terminal';
import { StudentProgress, Achievement } from '../../types';
import { TERMINAL_SCENARIOS, TERMINAL_ACHIEVEMENTS } from '../../data/terminalScenariosData';
import { 
  loadTerminalDraft, 
  saveTerminalDraft, 
  evaluateTerminalBatch,
  computeFieldDiff
} from '../../services/terminalStorageService';
import { terminalSound } from '../../utils/terminalSound';
import { TerminalVoucherCard } from './TerminalVoucherCard';
import { TerminalEvaluationModal } from './TerminalEvaluationModal';
import { AchievementShareModal } from '../common/AchievementShareModal';
import './terminal.css';

import { 
  Terminal, 
  ChevronLeft, 
  Clock, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  CheckCircle2, 
  RotateCcw, 
  Send, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Layers,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface TerminalWorkbenchProps {
  levelNumber: number;
  onBackToDashboard: () => void;
  onSelectLevel: (lvl: number) => void;
  studentProgress: StudentProgress;
  onExpAwarded?: (exp: number) => void;
}

export const TerminalWorkbench: React.FC<TerminalWorkbenchProps> = ({
  levelNumber,
  onBackToDashboard,
  onSelectLevel,
  studentProgress,
  onExpAwarded
}) => {
  const scenario: TerminalScenario = TERMINAL_SCENARIOS.find(s => s.levelNumber === levelNumber) || TERMINAL_SCENARIOS[0];

  // Voucher & Field Navigation State
  const [currentVoucherIdx, setCurrentVoucherIdx] = useState<number>(0);
  const [activeFieldIdx, setActiveFieldIdx] = useState<number>(0);
  
  // Entered Data State: entries[voucherId][fieldId] => string
  const [entries, setEntries] = useState<Record<string, Record<string, string>>>({});
  const [discrepancyFlags, setDiscrepancyFlags] = useState<Record<string, { flag: 'clean' | 'discrepant'; note?: string }>>({});

  // Input value for active field
  const [inputValue, setInputValue] = useState<string>('');

  // Desk Slant & Fullscreen Preferences
  const [isDeskSlant, setIsDeskSlant] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Telemetry Engine States
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [totalKeys, setTotalKeys] = useState<number>(0);
  const [correctKeys, setCorrectKeys] = useState<number>(0);
  const [errorKeys, setErrorKeys] = useState<number>(0);
  const [backspaces, setBackspaces] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);

  // Dispatched History Log (Ticker Tape)
  const [streamHistory, setStreamHistory] = useState<Array<{
    fieldLabel: string;
    value: string;
    status: 'CLEARED' | 'FLAGGED';
    timestamp: string;
  }>>([]);

  // Evaluation & Modal state
  const [evalSummary, setEvalSummary] = useState<TerminalEvaluationSummary | null>(null);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState<boolean>(false);
  const [shareAchievement, setShareAchievement] = useState<Achievement | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const workbenchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentVoucher = scenario.vouchers[currentVoucherIdx] || scenario.vouchers[0];
  const currentField = scenario.fields[activeFieldIdx] || scenario.fields[0];
  const targetExpectedVal = currentVoucher?.expectedValues[currentField?.id] || '';

  // Compute live character diff for real-time visualization
  const liveDiff: FieldDiffResult = computeFieldDiff(targetExpectedVal, inputValue, true);

  // Initialize or Load Saved Draft
  useEffect(() => {
    const draft = loadTerminalDraft(scenario.levelNumber);
    if (draft) {
      setEntries(draft.entries || {});
      setDiscrepancyFlags(draft.discrepancyFlags || {});
      setCurrentVoucherIdx(draft.currentVoucherIndex || 0);
      setElapsedSeconds(draft.elapsedSeconds || 0);
      setTotalKeys(draft.totalKeyDepressions || 0);
      setCorrectKeys(draft.correctKeyDepressions || 0);
      setErrorKeys(draft.errorDepressions || 0);
      setBackspaces(draft.backspaceCount || 0);

      const savedVal = draft.entries?.[scenario.vouchers[draft.currentVoucherIndex || 0]?.voucherId]?.[scenario.fields[0]?.id] || '';
      setInputValue(savedVal);
    } else {
      setEntries({});
      setDiscrepancyFlags({});
      setCurrentVoucherIdx(0);
      setActiveFieldIdx(0);
      setInputValue('');
      setElapsedSeconds(0);
      setTotalKeys(0);
      setCorrectKeys(0);
      setErrorKeys(0);
      setBackspaces(0);
      setCurrentStreak(0);
      setMaxStreak(0);
      setStreamHistory([]);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  }, [scenario.levelNumber]);

  // Fullscreen API Synchronizer
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      workbenchRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Persistent Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Debounced Auto-Save
  useEffect(() => {
    const timeout = setTimeout(() => {
      const draft: TerminalDraftData = {
        levelNumber: scenario.levelNumber,
        currentVoucherIndex: currentVoucherIdx,
        entries,
        discrepancyFlags,
        elapsedSeconds,
        totalKeyDepressions: totalKeys,
        correctKeyDepressions: correctKeys,
        errorDepressions: errorKeys,
        backspaceCount: backspaces,
        savedAt: new Date().toISOString()
      };
      saveTerminalDraft(draft);
    }, 800);
    return () => clearTimeout(timeout);
  }, [entries, discrepancyFlags, currentVoucherIdx, elapsedSeconds, totalKeys, correctKeys, errorKeys, backspaces, scenario.levelNumber]);

  // Live KDPH Speedometer Calculation
  const effectiveSecs = Math.max(elapsedSeconds, 1);
  const currentKPH = Math.round((totalKeys / effectiveSecs) * 3600);

  // Streak Multiplier Tier
  const streakTier = currentStreak >= 50 ? 'tier-overdrive' 
    : currentStreak >= 25 ? 'tier-electro' 
    : currentStreak >= 10 ? 'tier-focus' 
    : '';

  const streakMultiplier = currentStreak >= 50 ? '3.0x' 
    : currentStreak >= 25 ? '2.0x' 
    : currentStreak >= 10 ? '1.5x' 
    : '1.0x';

  // Synchronize input value when field or voucher changes
  const switchField = useCallback((newFieldIdx: number, newVoucherIdx: number = currentVoucherIdx) => {
    const vId = scenario.vouchers[newVoucherIdx]?.voucherId;
    const fId = scenario.fields[newFieldIdx]?.id;
    const existingVal = entries[vId]?.[fId] || '';
    
    setActiveFieldIdx(newFieldIdx);
    setCurrentVoucherIdx(newVoucherIdx);
    setInputValue(existingVal);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [scenario.vouchers, scenario.fields, entries, currentVoucherIdx]);

  // Commit current field input and advance
  const commitFieldAndAdvance = useCallback((val: string) => {
    const vId = currentVoucher.voucherId;
    const fId = currentField.id;

    // Save entered value in state
    setEntries(prev => ({
      ...prev,
      [vId]: {
        ...(prev[vId] || {}),
        [fId]: val
      }
    }));

    // Add to stream history ticker tape
    setStreamHistory(prev => [
      {
        fieldLabel: currentField.label,
        value: val || '<BLANK>',
        status: val.trim().toLowerCase() === targetExpectedVal.trim().toLowerCase() ? 'CLEARED' : 'FLAGGED',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      },
      ...prev.slice(0, 14)
    ]);

    // Check if there is a next field in the current voucher
    if (activeFieldIdx < scenario.fields.length - 1) {
      terminalSound.playVoucherAccepted();
      switchField(activeFieldIdx + 1, currentVoucherIdx);
    } else {
      // Reached the end of fields for this voucher -> advance voucher or dispatch
      if (currentVoucherIdx < scenario.vouchers.length - 1) {
        terminalSound.playVoucherAccepted();
        switchField(0, currentVoucherIdx + 1);
      } else {
        // Last field of last voucher
        terminalSound.playVoucherAccepted();
      }
    }
  }, [currentVoucher, currentField, targetExpectedVal, activeFieldIdx, scenario.fields.length, currentVoucherIdx, scenario.vouchers.length, switchField]);

  // Handle Input Keystrokes with Real-Time Discrepancy Detection & Audio
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    const prevLen = inputValue.length;
    const newLen = newVal.length;

    setTotalKeys(k => k + 1);

    if (newLen < prevLen) {
      // Backspace hit
      setBackspaces(b => b + 1);
      setCurrentStreak(s => Math.max(0, s - 1));
      terminalSound.playKeyClick(true);
    } else {
      // Character typed
      const typedChar = newVal[newLen - 1];
      const targetChar = targetExpectedVal[newLen - 1];
      const isMatch = targetChar !== undefined && typedChar.toLowerCase() === targetChar.toLowerCase();

      if (isMatch) {
        setCorrectKeys(k => k + 1);
        setCurrentStreak(s => {
          const nextS = s + 1;
          if (nextS > maxStreak) setMaxStreak(nextS);
          if (nextS === 10 || nextS === 25 || nextS === 50) {
            terminalSound.playStreakChime(nextS >= 50 ? 3 : nextS >= 25 ? 2 : 1);
          }
          return nextS;
        });
        terminalSound.playKeyClick(true);
      } else {
        setErrorKeys(k => k + 1);
        setCurrentStreak(0);
        terminalSound.playKeyClick(false);
      }
    }

    setInputValue(newVal);

    // Auto-advance if field has fixed maxLength and input satisfied completely
    if (currentField.autoAdvance && currentField.maxLength && newVal.length >= currentField.maxLength) {
      commitFieldAndAdvance(newVal);
    }
  };

  // Keyboard Navigation: Enter, Tab, Arrow keys, Alt+D for trap, Alt+A for clean
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitFieldAndAdvance(inputValue);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        if (activeFieldIdx > 0) {
          switchField(activeFieldIdx - 1, currentVoucherIdx);
        } else if (currentVoucherIdx > 0) {
          switchField(scenario.fields.length - 1, currentVoucherIdx - 1);
        }
      } else {
        commitFieldAndAdvance(inputValue);
      }
    } else if (e.altKey && (e.key === 'd' || e.key === 'D')) {
      e.preventDefault();
      toggleDiscrepancyFlag('discrepant');
    } else if (e.altKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      toggleDiscrepancyFlag('clean');
    } else if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleDispatchBatch();
    }
  };

  // Toggle Discrepancy Flag for Active Voucher
  const toggleDiscrepancyFlag = (flag: 'clean' | 'discrepant') => {
    const vId = currentVoucher.voucherId;
    setDiscrepancyFlags(prev => ({
      ...prev,
      [vId]: {
        flag,
        note: flag === 'discrepant' ? 'Operator flagged discrepancy in audit stream' : undefined
      }
    }));
    if (flag === 'discrepant') {
      terminalSound.playTrapAlert();
    } else {
      terminalSound.playKeyClick(true);
    }
  };

  // Dispatch and Evaluate Batch
  const handleDispatchBatch = () => {
    // Save active field before evaluating
    const vId = currentVoucher.voucherId;
    const fId = currentField.id;
    const finalEntries = {
      ...entries,
      [vId]: {
        ...(entries[vId] || {}),
        [fId]: inputValue
      }
    };

    const summary = evaluateTerminalBatch(
      scenario,
      finalEntries,
      discrepancyFlags,
      elapsedSeconds,
      totalKeys,
      backspaces,
      maxStreak,
      studentProgress.studentIdentity
    );

    if (summary.passed) {
      terminalSound.playBatchComplete();
    } else {
      terminalSound.playTrapAlert();
    }

    setEvalSummary(summary);
    setIsEvalModalOpen(true);

    if (summary.expEarned > 0 && onExpAwarded) {
      onExpAwarded(summary.expEarned);
    }
  };

  // Direct In-Place Corrections handler from TerminalEvaluationModal
  const handleApplyCorrections = (
    correctedEntries: Record<string, Record<string, string>>,
    correctedFlags: Record<string, 'clean' | 'discrepant'>
  ) => {
    const formattedFlags: Record<string, { flag: 'clean' | 'discrepant'; note?: string }> = {};
    Object.entries(correctedFlags).forEach(([k, v]) => {
      formattedFlags[k] = { flag: v };
    });

    setEntries(correctedEntries);
    setDiscrepancyFlags(formattedFlags);

    const freshSummary = evaluateTerminalBatch(
      scenario,
      correctedEntries,
      formattedFlags,
      elapsedSeconds,
      totalKeys + 50,
      0,
      Math.max(maxStreak, 20),
      studentProgress.studentIdentity
    );

    terminalSound.playBatchComplete();
    setEvalSummary(freshSummary);

    if (freshSummary.expEarned > 0 && onExpAwarded) {
      onExpAwarded(freshSummary.expEarned);
    }
  };

  // Format Time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isOvertime = elapsedSeconds > scenario.timeLimitSeconds;
  const isVoucherFlaggedDiscrepant = discrepancyFlags[currentVoucher.voucherId]?.flag === 'discrepant';

  return (
    <div 
      ref={workbenchRef}
      className={`terminal-workbench-root ${isFullscreen ? 'is-fullscreen' : ''}`}
      tabIndex={0}
    >
      {/* Top Telemetry HUD Bar */}
      <header className="terminal-hud-bar">
        <div className="terminal-hud-left">
          <button
            type="button"
            onClick={onBackToDashboard}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px'
            }}
            title="Return to Terminal Levels"
          >
            <ChevronLeft size={16} />
            <span>Dashboard</span>
          </button>

          <div className="terminal-stream-badge">
            <span className="stream-pulse-dot" />
            <span>STREAM DISPATCH</span>
          </div>

          <div className="terminal-scenario-tag">
            <span>{scenario.title}</span>
          </div>
        </div>

        {/* Center: Live Speedometer Dial, Streak Multiplier & Balance Check */}
        <div className="terminal-hud-center">
          <div className="kdph-meter-pill" title="Live Keystrokes Per Hour pace">
            <Zap size={14} color="#38bdf8" />
            <div className="kdph-value-group">
              <span className="kdph-number">{currentKPH.toLocaleString()}</span>
              <span className="kdph-label">KPH SPEED</span>
            </div>
          </div>

          <div className={`streak-meter-pill ${streakTier}`} title="Continuous flawless keystroke streak multiplier">
            <Flame size={14} color={streakTier ? '#f59e0b' : '#64748b'} />
            <span>{currentStreak}x Combo ({streakMultiplier} EXP)</span>
          </div>

          <div className={`balance-check-badge ${isVoucherFlaggedDiscrepant ? 'unbalanced' : 'balanced'}`}>
            <ShieldCheck size={12} />
            <span>{isVoucherFlaggedDiscrepant ? 'FLAGGED DISCREPANCY' : 'CLEARANCE READY'}</span>
          </div>
        </div>

        {/* Right: Fullscreen, Audio, Timer, EXP Max */}
        <div className="terminal-hud-right">
          <button
            type="button"
            onClick={() => {
              const muted = terminalSound.toggleMute();
              setIsMuted(muted);
            }}
            style={{
              background: '#111a28',
              border: '1px solid #1e2e42',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isMuted ? '#ef4444' : '#10b981',
              cursor: 'pointer'
            }}
            title={isMuted ? 'Unmute Audio Synthesizer' : 'Mute Tactile Keystrokes'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            style={{
              background: '#111a28',
              border: '1px solid #1e2e42',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              cursor: 'pointer'
            }}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>

          <div className={`terminal-timer-badge ${isOvertime ? 'overtime' : ''}`} title={`Benchmark: ${formatTime(scenario.timeLimitSeconds)}`}>
            <Clock size={12} />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#fef08a', background: 'rgba(250, 204, 21, 0.15)', padding: '3px 8px', borderRadius: '12px' }}>
            <Sparkles size={11} color="#facc15" />
            <span>+{scenario.expReward} EXP</span>
          </div>
        </div>
      </header>

      {/* Main Dual Stage (48% Scanned Voucher / 52% Industrial Clearing Console) */}
      <div className="terminal-split-stage">
        {/* Left Stage: Archival Physical Voucher Station */}
        <section className="terminal-docket-stage" aria-label="Physical Voucher Station">
          <div className="docket-top-toolbar">
            <div className="docket-voucher-tabs">
              {scenario.vouchers.map((v, vIdx) => {
                const isActive = vIdx === currentVoucherIdx;
                const isFlagged = discrepancyFlags[v.voucherId]?.flag === 'discrepant';
                return (
                  <button
                    key={v.voucherId}
                    type="button"
                    className={`voucher-step-pill ${isActive ? 'active' : ''}`}
                    onClick={() => switchField(0, vIdx)}
                    style={{ borderColor: isFlagged ? '#ef4444' : undefined }}
                    title={`Voucher #${vIdx + 1}: ${v.voucherNumber}`}
                  >
                    <span>#{vIdx + 1}</span>
                    {isFlagged && <span style={{ color: '#ef4444', marginLeft: '3px' }}>▲</span>}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsDeskSlant(!isDeskSlant)}
                style={{
                  background: isDeskSlant ? '#0284c7' : '#1e293b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                title="Toggle 3D Ergonomic Slanted Desk View"
              >
                <span>3D Tilt: {isDeskSlant ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Scanned Voucher Viewport with Dynamic Spotlight */}
          <div className="docket-canvas-scroll">
            <TerminalVoucherCard
              voucher={currentVoucher}
              fields={scenario.fields}
              activeFieldId={currentField.id}
              isDeskSlant={isDeskSlant}
              onSelectField={(fId) => {
                const fIdx = scenario.fields.findIndex(f => f.id === fId);
                if (fIdx !== -1) switchField(fIdx);
              }}
            />
          </div>
        </section>

        {/* Right Stage: Industrial Clearing Console */}
        <section className="terminal-console-stage" aria-label="Industrial Clearing Console">
          <div className="console-header-bar">
            <div className="console-title-pill">
              <Terminal size={14} />
              <span>HEADS-DOWN CLEARING STREAM</span>
            </div>

            <div className="console-stream-mode">
              <span>Field {activeFieldIdx + 1} of {scenario.fields.length} • Voucher {currentVoucherIdx + 1} of {scenario.vouchers.length}</span>
            </div>
          </div>

          {/* Active Focus Dispatch Channel (Primary Typing Station) */}
          <div className="active-dispatch-channel">
            <div className="active-field-meta">
              <div className="active-field-title">
                <span>{currentField.label}</span>
              </div>
              <div className="active-field-tip">
                <span>{currentField.helpTip || currentField.placeholder || ''}</span>
              </div>
            </div>

            {/* Live Segmented Character Rail with Real-Time Diff Feedback */}
            <div className="char-diff-rail" title="Real-time character verification rail">
              {liveDiff.glyphs.map((g, idx) => (
                <div 
                  key={idx}
                  className={`glyph-slot glyph-${g.status} ${g.isCursor ? 'glyph-cursor' : ''}`}
                >
                  {g.enteredChar || g.targetChar || '•'}
                </div>
              ))}
            </div>

            {/* Native High-Speed Keystroke Input Layer */}
            <input
              ref={inputRef}
              type="text"
              className={`terminal-rapid-input ${liveDiff.state === 'discrepancy' ? 'input-error' : ''}`}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              maxLength={currentField.maxLength}
              placeholder={`Enter ${currentField.label}... (Press ENTER to advance)`}
              autoFocus
            />

            {/* Inline Discrepancy Diff Chip (Alerts on character mismatch instantly) */}
            {liveDiff.state === 'discrepancy' && (
              <div className="live-diff-chip">
                <ShieldAlert size={14} color="#ef4444" />
                <span>
                  Discrepancy at Col {liveDiff.firstErrorIndex! + 1}: Expected <strong className="diff-target-val">"{targetExpectedVal}"</strong> ≠ Typed <strong className="diff-typed-val">"{inputValue}"</strong>
                </span>
              </div>
            )}
          </div>

          {/* Discrepancy Audit Flag Bar */}
          <div className="discrepancy-flag-bar">
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
              Forensic Audit Decision for #{currentVoucher.voucherNumber}:
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className={`flag-btn btn-clean ${!isVoucherFlaggedDiscrepant ? 'active' : ''}`}
                onClick={() => toggleDiscrepancyFlag('clean')}
                title="Mark voucher as clean / valid (Alt+A)"
              >
                <CheckCircle2 size={13} />
                <span>CLEAN VOUCHER (Alt+A)</span>
              </button>

              <button
                type="button"
                className={`flag-btn btn-trap ${isVoucherFlaggedDiscrepant ? 'active' : ''}`}
                onClick={() => toggleDiscrepancyFlag('discrepant')}
                title="Flag voucher as containing discrepancy / arithmetic error (Alt+D)"
              >
                <ShieldAlert size={13} />
                <span>FLAG DISCREPANCY (Alt+D)</span>
              </button>
            </div>
          </div>

          {/* Stream History Queue (Rolling Ticker Tape) */}
          <div className="stream-history-deck">
            <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Stream Clearance Audit Tape ({streamHistory.length} fields):
            </div>
            {streamHistory.length === 0 ? (
              <div style={{ color: '#475569', fontSize: '11px', textAlign: 'center', marginTop: '14px' }}>
                Key strokes will stream here as fields are dispatched...
              </div>
            ) : (
              streamHistory.map((item, idx) => (
                <div key={idx} className="history-card-item">
                  <span className="history-field-lbl">{item.fieldLabel}</span>
                  <span className="history-field-val">{item.value}</span>
                  <span className="history-status-tag">{item.status}</span>
                </div>
              ))
            )}
          </div>

          {/* Batch Dispatch & Navigation Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  if (activeFieldIdx > 0) switchField(activeFieldIdx - 1);
                  else if (currentVoucherIdx > 0) switchField(scenario.fields.length - 1, currentVoucherIdx - 1);
                }}
                disabled={activeFieldIdx === 0 && currentVoucherIdx === 0}
                style={{
                  background: '#111a28',
                  border: '1px solid #1e2e42',
                  color: '#94a3b8',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ArrowLeft size={12} />
                <span>Prev Field</span>
              </button>

              <button
                type="button"
                onClick={() => commitFieldAndAdvance(inputValue)}
                style={{
                  background: '#111a28',
                  border: '1px solid #1e2e42',
                  color: '#38bdf8',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Next Field</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleDispatchBatch}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 18px',
                fontSize: '12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)'
              }}
              title="Audit and Dispatch Complete Batch (Ctrl+Enter)"
            >
              <Send size={13} />
              <span>Verify & Dispatch Batch</span>
            </button>
          </div>
        </section>
      </div>

      {/* Footer Command Strip */}
      <footer className="terminal-footer-strip">
        <div className="footer-hotkey-hints">
          <span className="hotkey-chip"><kbd className="key-kbd">ENTER</kbd> Commit & Advance</span>
          <span className="hotkey-chip"><kbd className="key-kbd">TAB</kbd> Next Field</span>
          <span className="hotkey-chip"><kbd className="key-kbd">ALT+A</kbd> Mark Clean</span>
          <span className="hotkey-chip"><kbd className="key-kbd">ALT+D</kbd> Flag Trap</span>
          <span className="hotkey-chip"><kbd className="key-kbd">CTRL+ENTER</kbd> Dispatch Batch</span>
        </div>

        <div>
          <span>ICST Terminal Stream • Real-Time Clearing Hub v1.0</span>
        </div>
      </footer>

      {/* Evaluation Modal */}
      {isEvalModalOpen && evalSummary && (
        <TerminalEvaluationModal
          summary={evalSummary}
          scenario={scenario}
          onClose={() => setIsEvalModalOpen(false)}
          onRetry={() => {
            setIsEvalModalOpen(false);
            setEntries({});
            setDiscrepancyFlags({});
            setInputValue('');
            setCurrentVoucherIdx(0);
            setActiveFieldIdx(0);
            setElapsedSeconds(0);
            setTotalKeys(0);
            setCorrectKeys(0);
            setErrorKeys(0);
            setBackspaces(0);
            setCurrentStreak(0);
            setMaxStreak(0);
            setStreamHistory([]);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          onNextLevel={() => {
            setIsEvalModalOpen(false);
            if (scenario.levelNumber < 5) {
              onSelectLevel(scenario.levelNumber + 1);
            }
          }}
          onShare={(sum) => {
            let ach = sum.unlockedAchievements[0];
            if (!ach) {
              ach = TERMINAL_ACHIEVEMENTS[0];
            }
            setShareAchievement(ach);
            setIsShareModalOpen(true);
          }}
          onApplyCorrections={handleApplyCorrections}
        />
      )}

      {/* Achievement Share Modal */}
      {isShareModalOpen && evalSummary && (
        <AchievementShareModal
          summary={{
            uid: `terminal-level-${scenario.levelNumber}`,
            levelNumber: scenario.levelNumber,
            stageNumber: 1,
            totalEvaluatedUnits: evalSummary.totalFieldsEvaluated,
            correctUnits: evalSummary.correctFields,
            incorrectUnits: evalSummary.incorrectFields,
            missingUnits: 0,
            timeTakenSeconds: evalSummary.timeTakenSeconds,
            timeLimitSeconds: scenario.timeLimitSeconds,
            accuracyPercentage: evalSummary.netScorePercent,
            requiredAccuracy: scenario.targetAccuracy,
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

