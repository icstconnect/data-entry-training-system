import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  FileSpreadsheet,
  FolderTree,
  Terminal,
  Keyboard,
  Lock,
  Unlock,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { UserRole, StudentIdentity } from '../../types';
import { isMasterUnlocked, lockToStudentProgression } from '../../services/masterUnlockService';

interface HeaderProps {
  currentRole: UserRole;
  activeView: 'landing' | 'practice' | 'student-dashboard' | 'teacher-dashboard' | 'showcase' | 'excel' | 'windows' | 'terminal' | 'typing';
  setActiveView: (view: 'landing' | 'practice' | 'student-dashboard' | 'teacher-dashboard' | 'showcase' | 'excel' | 'windows' | 'terminal' | 'typing') => void;
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

interface LabNavItem {
  id: HeaderProps['activeView'];
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  badge?: string;
  badgeClass?: string;
  badgeColor?: string;
  title: string;
  requiresTeacher?: boolean;
}

const LAB_NAV_ITEMS: LabNavItem[] = [
  {
    id: 'practice',
    label: 'Practice',
    shortLabel: 'Practice',
    icon: <GraduationCap size={15} />,
    title: 'Core Single-Form Data Entry Practice'
  },
  {
    id: 'excel',
    label: 'Excel Lab',
    shortLabel: 'Excel',
    icon: <FileSpreadsheet size={15} color="#16a34a" />,
    badge: 'NEW',
    badgeClass: 'badge-excel',
    badgeColor: '#16a34a',
    title: 'Excel Mass Data Entry Simulation Lab (5 Scenarios)'
  },
  {
    id: 'windows',
    label: 'Windows Lab',
    shortLabel: 'Windows',
    icon: <FolderTree size={15} color="#0284c7" />,
    badge: 'NEW',
    badgeClass: 'badge-windows',
    badgeColor: '#0284c7',
    title: 'Windows 11 Organization Simulation (File & Folder Tracks)'
  },
  {
    id: 'terminal',
    label: 'Terminal Lab',
    shortLabel: 'Terminal',
    icon: <Terminal size={15} color="#38bdf8" />,
    badge: 'STREAM',
    badgeClass: 'badge-terminal',
    badgeColor: '#0284c7',
    title: 'Terminal Stream: High-Speed Enterprise Data Dispatcher & Voucher Verification'
  },
  {
    id: 'typing',
    label: 'Typing Lab',
    shortLabel: 'Typing',
    icon: <Keyboard size={15} color="#0891b2" />,
    badge: '25 LVL',
    badgeClass: 'badge-typing',
    badgeColor: '#0891b2',
    title: 'Touch Typing Lab (25 Levels with Light-Beam Guided Kinesthetic Training)'
  },
  {
    id: 'student-dashboard',
    label: 'Dashboard',
    shortLabel: 'Dashboard',
    icon: <LayoutDashboard size={15} />,
    title: 'Trainee Analytics & Performance Dashboard'
  },
  {
    id: 'teacher-dashboard',
    label: 'Teacher',
    shortLabel: 'Teacher',
    icon: <UserCheck size={15} />,
    title: 'Administrative Teacher Mode (Password Required: ICST)',
    requiresTeacher: true
  },
  {
    id: 'showcase',
    label: 'Showcase',
    shortLabel: 'Showcase',
    icon: <Share2 size={15} />,
    title: 'ICST Social Media Promotional Showcase'
  }
];

export const Header: React.FC<HeaderProps> = React.memo(({
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
  const isPractice = activeView === 'practice';
  const isOvertime = isPractice && timerElapsedSeconds > timerLimitSeconds;
  const overtimeSeconds = isOvertime ? timerElapsedSeconds - timerLimitSeconds : 0;

  const [masterUnlocked, setMasterUnlockedState] = useState<boolean>(() => isMasterUnlocked());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleMasterChange = () => setMasterUnlockedState(isMasterUnlocked());
    window.addEventListener('icst_master_unlock_changed', handleMasterChange);
    return () => window.removeEventListener('icst_master_unlock_changed', handleMasterChange);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectNav = (item: LabNavItem) => {
    setMobileMenuOpen(false);
    if (item.requiresTeacher) {
      onOpenTeacherPassword();
    } else {
      setActiveView(item.id);
    }
  };

  return (
    <header className="app-header">
      {/* Primary Global Navigation Header */}
      <div className="header-container">
        {/* Brand Section with ORIGINAL LOGO & Student Badge */}
        <div className="header-brand-cluster">
          <a 
            href="#home" 
            className="brand-section"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
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
              title={`Trainee: ${studentIdentity.name} (${studentIdentity.generatedRollId}). Click to edit.`}
            >
              <span className="student-chip-avatar">
                <User size={12} color="var(--icst-blue)" />
              </span>
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

        {/* Desktop Navigation Links & Controls (Visible on screens >= 1100px) */}
        <div className="header-nav header-nav-desktop">
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

          {/* Full Desktop Lab Navigation Buttons */}
          {LAB_NAV_ITEMS.map(item => (
            <button
              key={item.id}
              type="button"
              className={`nav-btn ${activeView === item.id ? 'active' : ''}`}
              onClick={() => handleSelectNav(item)}
              title={item.title}
            >
              {item.icon}
              <span className="nav-btn-text">{item.label}</span>
              {item.badge && (
                <span 
                  className={`nav-lab-badge ${item.badgeClass || ''}`} 
                  style={{ background: item.badgeColor, color: '#ffffff' }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          {/* Master Unlocked Status Pill */}
          {masterUnlocked && (
            <button
              type="button"
              className="nav-btn"
              onClick={() => {
                lockToStudentProgression();
                setMasterUnlockedState(false);
              }}
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#059669',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Master Unlocked! All levels accessible. Click to lock back to student progression."
            >
              <Unlock size={13} color="#059669" />
              <span className="nav-btn-text">ICST (Lock 🔒)</span>
            </button>
          )}

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

        {/* Mobile / Tablet Header Trigger (Visible on screens < 1100px) */}
        <div className="header-nav-mobile-trigger">
          {/* Compact EXP Display */}
          <div 
            className="exp-badge-container compact" 
            title="Total Practice EXP"
          >
            <Sparkles size={12} color="#d97706" />
            <span>EXP {totalExp.toLocaleString()}</span>
          </div>

          {/* Hamburger / Close Menu Toggle Button */}
          <button
            type="button"
            className={`mobile-menu-toggle-btn ${mobileMenuOpen ? 'is-open' : ''}`}
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            title="Navigation Menu & Labs"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Horizontal Touch-Scrollable Labs Strip (Visible on screens < 1100px) */}
      <div className="header-tabs-scroll" role="navigation" aria-label="Labs Navigation Bar">
        <div className="header-tabs-scroll-inner">
          {LAB_NAV_ITEMS.map(item => (
            <button
              key={item.id}
              type="button"
              className={`tab-scroll-btn ${activeView === item.id ? 'active' : ''}`}
              onClick={() => handleSelectNav(item)}
              title={item.title}
            >
              {item.icon}
              <span className="tab-scroll-label">{item.shortLabel}</span>
              {item.badge && (
                <span 
                  className={`nav-lab-badge ${item.badgeClass || ''}`} 
                  style={{ background: item.badgeColor, color: '#ffffff' }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Slide-Down / Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div 
          className="header-mobile-drawer-backdrop" 
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="header-mobile-drawer" 
            onClick={e => e.stopPropagation()}
          >
            <div className="drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '28px', height: '28px' }} />
                <span style={{ fontWeight: 800, fontSize: '15px' }}>ICST Navigation Hub</span>
              </div>
              <button 
                type="button" 
                className="drawer-close-btn" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Student Profile Overview Card in Drawer */}
            <div className="drawer-student-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="drawer-student-avatar">
                  <User size={16} color="#0284c7" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '13px' }}>
                    {studentIdentity ? studentIdentity.name : 'Guest Trainee'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {studentIdentity ? studentIdentity.generatedRollId : 'No roll configured'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenStudentSetup();
                }}
                style={{ fontSize: '11px', padding: '4px 8px' }}
              >
                {studentIdentity ? 'Edit Profile' : 'Set Name'}
              </button>
            </div>

            {/* Master Unlock Status in Drawer */}
            {masterUnlocked ? (
              <div style={{ padding: '8px 12px', background: '#d1fae5', borderRadius: '8px', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065f46', fontSize: '12px', fontWeight: 700 }}>
                  <Unlock size={14} color="#059669" />
                  <span>Master Unlocked (All Labs Open)</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    lockToStudentProgression();
                    setMasterUnlockedState(false);
                  }}
                  style={{ background: '#059669', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Lock
                </button>
              </div>
            ) : (
              <div style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>
                  <Lock size={14} />
                  <span>Instructor Mode: Passcode ICST</span>
                </div>
              </div>
            )}

            {/* Labs Navigation List */}
            <div className="drawer-nav-list">
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Training Laboratories
              </span>

              {LAB_NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className={`drawer-nav-item ${activeView === item.id ? 'active' : ''}`}
                  onClick={() => handleSelectNav(item)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="drawer-item-icon">{item.icon}</span>
                    <span style={{ fontWeight: activeView === item.id ? 800 : 600 }}>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.badge && (
                      <span 
                        className={`nav-lab-badge ${item.badgeClass || ''}`} 
                        style={{ background: item.badgeColor, color: '#ffffff' }}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </div>
                </button>
              ))}
            </div>

            {/* Utility Actions at Bottom of Drawer */}
            <div className="drawer-footer-actions">
              <button
                type="button"
                className="drawer-action-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenShortcuts();
                }}
              >
                <HelpCircle size={15} />
                <span>Keyboard Shortcuts</span>
              </button>

              <button
                type="button"
                className="drawer-action-btn clear-danger"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onClearDataClick();
                }}
              >
                <Trash2 size={15} color="var(--error-red)" />
                <span>Clear All Data & Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Practice Sub-Toolbar Strip (Visible only in practice view) */}
      {activeView === 'practice' && (
        <div className="practice-sub-toolbar">
          <div className="practice-sub-toolbar-container">
            {/* Left: Level & Stage Indicators */}
            <div className="practice-sub-left">
              <span className="status-badge status-badge-level">
                LEVEL {currentLevel}
              </span>
              <span className="status-badge status-badge-stage">
                Stage {currentStage}
              </span>
            </div>

            {/* Center: High-Legibility Time Telemetry Box */}
            <div className="practice-sub-center">
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
            </div>

            {/* Right: Guided Mode Toggle Switch */}
            <div className="practice-sub-right">
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
          </div>
        </div>
      )}

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
});
