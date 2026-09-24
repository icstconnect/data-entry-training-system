import React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  GraduationCap, 
  UserCheck, 
  Share2, 
  LayoutDashboard,
  Clock,
  Trash2,
  User,
  AlertTriangle
} from 'lucide-react';
import { UserRole, StudentIdentity } from '../../types';

interface HeaderProps {
  currentRole: UserRole;
  activeView: 'landing' | 'practice' | 'student-dashboard' | 'teacher-dashboard' | 'showcase';
  setActiveView: (view: 'landing' | 'practice' | 'student-dashboard' | 'teacher-dashboard' | 'showcase') => void;
  currentLevel: number;
  currentStage: number;
  totalExp: number;
  floatingExp: number | null;
  isGuidedMode: boolean;
  setIsGuidedMode: (val: boolean) => void;
  onOpenShortcuts: () => void;
  onClearDataClick: () => void;
  onOpenTeacherPassword: () => void;
  onOpenStudentSetup: () => void;
  studentIdentity?: StudentIdentity | null;
  stageProgressPercent?: number;
  timerElapsedSeconds?: number;
  timerLimitSeconds?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  activeView,
  setActiveView,
  currentLevel,
  currentStage,
  totalExp,
  floatingExp,
  isGuidedMode,
  setIsGuidedMode,
  onOpenShortcuts,
  onClearDataClick,
  onOpenTeacherPassword,
  onOpenStudentSetup,
  studentIdentity,
  stageProgressPercent = 0,
  timerElapsedSeconds = 0,
  timerLimitSeconds = 600
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isOvertime = timerElapsedSeconds > timerLimitSeconds;
  const overtimeSeconds = isOvertime ? timerElapsedSeconds - timerLimitSeconds : 0;

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Section with ORIGINAL LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a 
            href="#home" 
            className="brand-section"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('landing');
            }}
          >
            <img 
              src="/logo.png" 
              alt="ICST Chowberia Official Logo" 
              className="brand-logo-img" 
            />
            <div className="brand-meta">
              <span className="brand-title">ICST Data Entry Lab</span>
              <span className="brand-sub">ICST - Chowberia</span>
            </div>
          </a>

          {/* Student Identity Pill */}
          {studentIdentity ? (
            <button
              type="button"
              className="student-identity-chip"
              onClick={onOpenStudentSetup}
              title="Click to edit student identity"
            >
              <User size={13} color="var(--icst-blue)" />
              <span className="student-name-text">{studentIdentity.name}</span>
              <span className="student-roll-text">{studentIdentity.generatedRollId}</span>
            </button>
          ) : (
            <button
              type="button"
              className="student-identity-chip-setup"
              onClick={onOpenStudentSetup}
              title="Set up trainee operator identity"
            >
              <User size={13} />
              <span>Set Student Name</span>
            </button>
          )}
        </div>

        {/* Practice Bar (Visible in practice or student dashboard) */}
        {activeView === 'practice' && (
          <div className="practice-header-status">
            <div className="status-badge status-badge-level">
              L{currentLevel}
            </div>
            <div className="status-badge status-badge-stage">
              Stage {currentStage}
            </div>

            {/* Time Limit & Time Elapsed Display */}
            <div className="time-display-box" title={`Configured Limit: ${formatTime(timerLimitSeconds)}`}>
              <div className="time-item">
                <span className="time-lbl">LIMIT</span>
                <span className="time-val">{formatTime(timerLimitSeconds)}</span>
              </div>
              <div className="time-separator">|</div>
              <div className={`time-item ${isOvertime ? 'time-item-over' : ''}`}>
                <span className="time-lbl">ELAPSED</span>
                <span className="time-val">{formatTime(timerElapsedSeconds)}</span>
              </div>
              {isOvertime && (
                <div className="time-over-tag" title="Operating past standard time limit">
                  <AlertTriangle size={11} />
                  <span>+{formatTime(overtimeSeconds)}</span>
                </div>
              )}
            </div>

            {/* Guided Mode Toggle */}
            <button
              type="button"
              id="guided-mode-toggle"
              className={`guided-toggle ${isGuidedMode ? 'active' : 'inactive'}`}
              onClick={() => setIsGuidedMode(!isGuidedMode)}
              title={isGuidedMode ? 'Guided Mode is ON: Realtime feedback active, 0 EXP awarded' : 'Guided Mode is OFF: Standard assessment mode, normal EXP'}
            >
              <Sparkles size={13} color={isGuidedMode ? '#b45309' : '#64748b'} />
              <span>{isGuidedMode ? 'GUIDED ON' : 'GUIDED OFF'}</span>
            </button>
          </div>
        )}

        {/* Right Nav Actions & Persistent Clear Data */}
        <div className="header-nav">
          {/* Persistent EXP Display */}
          <div 
            className="exp-badge-container" 
            title="Total Practice EXP. Note: Guided Mode awards 0 EXP"
          >
            <Sparkles size={13} color="#d97706" />
            <span>EXP {totalExp.toLocaleString()}</span>
            {floatingExp !== null && (
              <div className="exp-float-anim">
                +{floatingExp} EXP
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <button
            type="button"
            className={`nav-btn ${activeView === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveView('practice')}
          >
            <GraduationCap size={15} />
            <span className="nav-btn-text">Practice</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activeView === 'student-dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('student-dashboard')}
          >
            <LayoutDashboard size={15} />
            <span className="nav-btn-text">Dashboard</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activeView === 'teacher-dashboard' ? 'active' : ''}`}
            onClick={onOpenTeacherPassword}
            title="Administrative Teacher Mode (Password Required)"
          >
            <UserCheck size={15} />
            <span className="nav-btn-text">Teacher</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activeView === 'showcase' ? 'active' : ''}`}
            onClick={() => setActiveView('showcase')}
            title="ICST Social Media Promotional Showcase"
          >
            <Share2 size={15} />
            <span className="nav-btn-text">Showcase</span>
          </button>

          {/* Persistent Clear Data Control */}
          <button
            type="button"
            className="btn btn-secondary btn-sm clear-data-btn"
            onClick={onClearDataClick}
            title="Clear all stored local practice data, drafts, and identity"
          >
            <Trash2 size={13} color="var(--error-red)" />
            <span className="clear-data-text">CLEAR DATA</span>
          </button>

          <button
            type="button"
            className="nav-btn keyboard-shortcuts-btn"
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts"
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </div>

      {/* Progress Strip in Practice View */}
      {activeView === 'practice' && (
        <div className="header-progress-strip">
          <div 
            className="header-progress-fill" 
            style={{ width: `${Math.min(100, Math.max(0, stageProgressPercent))}%` }}
          />
        </div>
      )}
    </header>
  );
};
