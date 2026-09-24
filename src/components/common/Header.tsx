import React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  GraduationCap, 
  UserCheck, 
  Share2, 
  LayoutDashboard,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeView: 'landing' | 'practice' | 'student-dashboard' | 'teacher-dashboard' | 'showcase';
  setActiveView: (view: 'landing' | 'practice' | 'student-dashboard' | 'teacher-dashboard' | 'showcase') => void;
  currentLevel: number;
  currentStage: number;
  totalExp: number;
  floatingExp: number | null;
  isGuidedMode: boolean;
  setIsGuidedMode: (val: boolean) => void;
  onOpenShortcuts: () => void;
  stageProgressPercent?: number;
  timerSeconds?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  activeView,
  setActiveView,
  currentLevel,
  currentStage,
  totalExp,
  floatingExp,
  isGuidedMode,
  setIsGuidedMode,
  onOpenShortcuts,
  stageProgressPercent = 0,
  timerSeconds
}) => {
  const formatTimer = (seconds?: number) => {
    if (seconds === undefined) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Section with ORIGINAL LOGO */}
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

        {/* Practice Bar (Visible in practice or student dashboard) */}
        {activeView === 'practice' && (
          <div className="practice-header-status">
            <div className="status-badge status-badge-level">
              L{currentLevel}
            </div>
            <div className="status-badge status-badge-stage">
              Stage {currentStage}
            </div>

            {timerSeconds !== undefined && (
              <div className="status-badge" title="Elapsed Time" style={{ color: '#475569' }}>
                <Clock size={13} />
                <span style={{ fontFamily: 'var(--font-mono)' }}>{formatTimer(timerSeconds)}</span>
              </div>
            )}

            {/* Guided Mode Toggle */}
            <button
              type="button"
              id="guided-mode-toggle"
              className={`guided-toggle ${isGuidedMode ? 'active' : 'inactive'}`}
              onClick={() => setIsGuidedMode(!isGuidedMode)}
              title={isGuidedMode ? 'Guided Mode is ON: Realtime feedback active, 0 EXP awarded' : 'Guided Mode is OFF: Standard assessment mode, normal EXP'}
            >
              <Sparkles size={14} color={isGuidedMode ? '#b45309' : '#64748b'} />
              <span>GUIDED {isGuidedMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        )}

        {/* Right Nav Actions */}
        <div className="header-nav">
          {/* Persistent EXP Display */}
          <div 
            className="exp-badge-container" 
            title="Total Practice EXP. Note: Guided Mode awards 0 EXP"
          >
            <Sparkles size={14} color="#d97706" />
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
            <span>Practice</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activeView === 'student-dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('student-dashboard')}
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activeView === 'teacher-dashboard' ? 'active' : ''}`}
            onClick={() => {
              setCurrentRole('teacher');
              setActiveView('teacher-dashboard');
            }}
          >
            <UserCheck size={15} />
            <span>Teacher Mode</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activeView === 'showcase' ? 'active' : ''}`}
            onClick={() => setActiveView('showcase')}
            title="ICST Social Media Promotional Showcase"
          >
            <Share2 size={15} />
            <span>Showcase</span>
          </button>

          <button
            type="button"
            className="nav-btn"
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts"
            style={{ padding: '6px' }}
          >
            <HelpCircle size={17} />
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
