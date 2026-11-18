import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  HelpCircle,
  GraduationCap,
  UserCheck,
  Share2,
  LayoutDashboard,
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
  ChevronRight,
  ChevronDown,
  Check,
  ClipboardList,
  Monitor,
  LayoutGrid,
  Rocket,
  ExternalLink
} from 'lucide-react';
import { animate, createScope, stagger, spring } from 'animejs';
import { UserRole, StudentIdentity } from '../../types';
import { ICST_CONNECT } from '../../config/appConfig';
import { isMasterUnlocked, lockToStudentProgression } from '../../services/masterUnlockService';

export type ActiveViewId =
  | 'landing'
  | 'practice'
  | 'student-dashboard'
  | 'teacher-dashboard'
  | 'showcase'
  | 'excel'
  | 'windows'
  | 'terminal'
  | 'typing'
  | 'word-express';

interface HeaderProps {
  currentRole: UserRole;
  activeView: ActiveViewId;
  setActiveView: (view: ActiveViewId) => void;
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
  id: ActiveViewId;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  badge?: string;
  badgeClass?: string;
  badgeColor?: string;
  title: string;
  requiresTeacher?: boolean;
}

interface NavDropdownGroup {
  id: 'data-entry' | 'os-typing' | 'portal';
  label: string;
  sectionTitle: string;
  icon: React.ReactNode;
  align?: 'left' | 'right';
  items: LabNavItem[];
}

const DATA_ENTRY_LABS: LabNavItem[] = [
  {
    id: 'practice',
    label: 'Practice Lab',
    shortLabel: 'Practice',
    description: 'Forms & board marksheets • 5 Levels',
    icon: <GraduationCap size={16} color="#1c6aa7" />,
    iconBg: '#edf4fa',
    title: 'Core Single-Form Data Entry & Marksheets Practice'
  },
  {
    id: 'excel',
    label: 'Excel Lab',
    shortLabel: 'Excel',
    description: 'Excel 365 mass ledgers • 5 Scenarios',
    icon: <FileSpreadsheet size={16} color="#16a34a" />,
    iconBg: '#f0fdf4',
    badge: 'NEW',
    badgeClass: 'badge-excel',
    badgeColor: '#16a34a',
    title: 'Excel Mass Data Entry Simulation Lab (5 Scenarios)'
  },
  {
    id: 'terminal',
    label: 'Terminal Lab',
    shortLabel: 'Terminal',
    description: 'Heads-down voucher stream • 5 Domains',
    icon: <Terminal size={16} color="#0284c7" />,
    iconBg: '#f0f9ff',
    badge: 'STREAM',
    badgeClass: 'badge-terminal',
    badgeColor: '#0284c7',
    title: 'Terminal Stream: High-Speed Enterprise Data Dispatcher & Voucher Verification'
  }
];

const OS_TYPING_LABS: LabNavItem[] = [
  {
    id: 'windows',
    label: 'Windows Lab',
    shortLabel: 'Windows',
    description: 'Windows 11 file & folder org • 10 Levels',
    icon: <FolderTree size={16} color="#0284c7" />,
    iconBg: '#eff6ff',
    badge: 'NEW',
    badgeClass: 'badge-windows',
    badgeColor: '#0284c7',
    title: 'Windows 11 Organization Simulation (File & Folder Tracks)'
  },
  {
    id: 'typing',
    label: 'Typing Lab',
    shortLabel: 'Typing',
    description: 'Light-beam guided typing • 25 Levels',
    icon: <Keyboard size={16} color="#0891b2" />,
    iconBg: '#ecfeff',
    badge: '25 LVL',
    badgeClass: 'badge-typing',
    badgeColor: '#0891b2',
    title: 'Touch Typing Lab (25 Levels with Light-Beam Guided Kinesthetic Training)'
  },
  {
    id: 'word-express',
    label: 'Word Express Lab',
    shortLabel: 'Words',
    description: 'Simple words • 16-vehicle streak courier',
    icon: <Rocket size={16} color="#7c3aed" />,
    iconBg: '#f5f3ff',
    badge: 'NEW',
    badgeClass: 'badge-word-express',
    badgeColor: '#7c3aed',
    title: 'Word Express Delivery Lab (25 Word Stages • Easy/Moderate/Hard • 16 Delivery Vehicles)'
  }
];

const PORTAL_ITEMS: LabNavItem[] = [
  {
    id: 'teacher-dashboard',
    label: 'Teacher Mode',
    shortLabel: 'Teacher',
    description: 'Instructor analytics & controls (Passcode)',
    icon: <UserCheck size={16} color="#7c3aed" />,
    iconBg: '#f5f3ff',
    title: 'Administrative Teacher Mode (Password Required: ICST)',
    requiresTeacher: true
  },
  {
    id: 'showcase',
    label: 'Live Showcase',
    shortLabel: 'Showcase',
    description: 'ICST achievements & promotional hub',
    icon: <Share2 size={16} color="#d97706" />,
    iconBg: '#fffbeb',
    title: 'ICST Social Media Promotional Showcase'
  }
];

const DASHBOARD_ITEM: LabNavItem = {
  id: 'student-dashboard',
  label: 'Dashboard',
  shortLabel: 'Dashboard',
  description: 'Trainee analytics & progress tracking',
  icon: <LayoutDashboard size={15} />,
  iconBg: '#edf4fa',
  title: 'Trainee Analytics & Performance Dashboard'
};

const NAV_DROPDOWN_GROUPS: NavDropdownGroup[] = [
  {
    id: 'data-entry',
    label: 'Data Entry',
    sectionTitle: 'Data Entry Labs',
    icon: <ClipboardList size={15} />,
    align: 'left',
    items: DATA_ENTRY_LABS
  },
  {
    id: 'os-typing',
    label: 'OS & Typing',
    sectionTitle: 'Computing & Keyboard Labs',
    icon: <Monitor size={15} />,
    align: 'left',
    items: OS_TYPING_LABS
  },
  {
    id: 'portal',
    label: 'Portal',
    sectionTitle: 'Institute Portal',
    icon: <LayoutGrid size={15} />,
    align: 'right',
    items: PORTAL_ITEMS
  }
];

export const Header: React.FC<HeaderProps> = React.memo(({
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
  const [openDropdown, setOpenDropdown] = useState<NavDropdownGroup['id'] | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<'data-entry' | 'os-typing' | null>(null);

  const headerRef = useRef<HTMLElement | null>(null);
  const desktopNavRef = useRef<HTMLDivElement | null>(null);
  const mobileBarRef = useRef<HTMLDivElement | null>(null);
  const prevExpRef = useRef<number>(totalExp);

  // 1. Initial mount entrance choreography (scoped & reduced-motion aware)
  useEffect(() => {
    if (!headerRef.current) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const scope = createScope({ root: headerRef.current }).add(() => {
      animate('.header-brand-cluster > *, .header-nav-desktop > *', {
        translateY: [-10, 0],
        opacity: [0, 1],
        duration: 460,
        delay: stagger(32),
        ease: 'outExpo'
      });
    });

    return () => scope.revert();
  }, []);

  // 2. Smooth spring animation when desktop or mobile dropdown opens
  useEffect(() => {
    if (!openDropdown && !openMobileDropdown) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    window.requestAnimationFrame(() => {
      const menus = headerRef.current?.querySelectorAll('.nav-dropdown-menu');
      if (menus && menus.length > 0) {
        animate(menus, {
          translateY: [-10, 0],
          scale: [0.96, 1],
          opacity: [0, 1],
          duration: 340,
          ease: spring({ stiffness: 360, damping: 22 })
        });
      }
      const items = headerRef.current?.querySelectorAll('.nav-dropdown-menu .nav-dropdown-item');
      if (items && items.length > 0) {
        animate(items, {
          translateX: [-8, 0],
          opacity: [0, 1],
          duration: 280,
          delay: stagger(32),
          ease: 'outExpo'
        });
      }
    });
  }, [openDropdown, openMobileDropdown]);

  // 3. Smooth slide-over entrance for mobile drawer
  useEffect(() => {
    if (!mobileMenuOpen) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    window.requestAnimationFrame(() => {
      const backdrop = headerRef.current?.querySelector('.header-mobile-drawer-backdrop');
      const drawer = headerRef.current?.querySelector('.header-mobile-drawer');
      const drawerItems = headerRef.current?.querySelectorAll('.drawer-nav-item');

      if (backdrop) {
        animate(backdrop, { opacity: [0, 1], duration: 220, ease: 'outQuad' });
      }
      if (drawer) {
        animate(drawer, {
          translateX: ['100%', '0%'],
          duration: 360,
          ease: 'outExpo'
        });
      }
      if (drawerItems && drawerItems.length > 0) {
        animate(drawerItems, {
          translateX: [16, 0],
          opacity: [0, 1],
          duration: 300,
          delay: stagger(24, { start: 80 }),
          ease: 'outExpo'
        });
      }
    });
  }, [mobileMenuOpen]);

  // 4. Tactile spring pop on EXP badge when EXP increases or floatingExp fires
  useEffect(() => {
    const expIncreased = totalExp > prevExpRef.current;
    prevExpRef.current = totalExp;
    if (!expIncreased && floatingExp === null) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const badges = headerRef.current?.querySelectorAll('.exp-badge-container');
    if (badges && badges.length > 0) {
      animate(badges, {
        scale: [1, 1.16, 1],
        duration: 420,
        ease: spring({ stiffness: 380, damping: 14 })
      });
    }
  }, [totalExp, floatingExp]);

  // 5. Crisp feedback pulse on active view switch & practice sub-toolbar reveal
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    window.requestAnimationFrame(() => {
      const activeBtns = headerRef.current?.querySelectorAll('.nav-btn.active, .tab-scroll-btn.active');
      if (activeBtns && activeBtns.length > 0) {
        animate(activeBtns, {
          scale: [0.95, 1.04, 1],
          duration: 320,
          ease: spring({ stiffness: 360, damping: 18 })
        });
      }
      if (activeView === 'practice') {
        const subBar = headerRef.current?.querySelector('.practice-sub-toolbar');
        if (subBar) {
          animate(subBar, {
            translateY: [-10, 0],
            opacity: [0, 1],
            duration: 340,
            ease: 'outExpo'
          });
        }
      }
    });
  }, [activeView]);

  const handleBrandLogoHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const img = e.currentTarget.querySelector('.brand-logo-img');
    if (img) {
      animate(img, {
        scale: [1, 1.14, 1.05],
        rotate: [0, -8, 0],
        duration: 380,
        ease: spring({ stiffness: 340, damping: 14 })
      });
    }
  };

  const handleBrandLogoLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const img = e.currentTarget.querySelector('.brand-logo-img');
    if (img) {
      animate(img, { scale: 1, rotate: 0, duration: 220, ease: 'outQuad' });
    }
  };

  useEffect(() => {
    const handleMasterChange = () => setMasterUnlockedState(isMasterUnlocked());
    window.addEventListener('icst_master_unlock_changed', handleMasterChange);
    return () => window.removeEventListener('icst_master_unlock_changed', handleMasterChange);
  }, []);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const inDesktop = desktopNavRef.current?.contains(target) ?? false;
      const inMobileBar = mobileBarRef.current?.contains(target) ?? false;
      if (!inDesktop && !inMobileBar) {
        setOpenDropdown(null);
        setOpenMobileDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setOpenMobileDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectNav = (item: LabNavItem) => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setOpenMobileDropdown(null);
    if (item.requiresTeacher) {
      onOpenTeacherPassword();
    } else {
      setActiveView(item.id);
    }
  };

  const toggleDesktopDropdown = (groupId: NavDropdownGroup['id']) => {
    setOpenDropdown(prev => (prev === groupId ? null : groupId));
  };

  const toggleMobileDropdown = (groupId: 'data-entry' | 'os-typing') => {
    setOpenMobileDropdown(prev => (prev === groupId ? null : groupId));
  };

  const getActiveItemInGroup = (group: NavDropdownGroup) =>
    group.items.find(item => item.id === activeView);

  const labDropdownGroups = NAV_DROPDOWN_GROUPS.filter(
    g => g.id === 'data-entry' || g.id === 'os-typing'
  ) as Array<NavDropdownGroup & { id: 'data-entry' | 'os-typing' }>;

  const portalGroup = NAV_DROPDOWN_GROUPS.find(g => g.id === 'portal')!;

  return (
    <header ref={headerRef} className="app-header">
      {/* Primary Global Navigation Header */}
      <div className="header-container">
        {/* Brand Section with ORIGINAL LOGO & Student Badge */}
        <div className="header-brand-cluster">
          <a
            href="#home"
            className="brand-section"
            onMouseEnter={handleBrandLogoHover}
            onMouseLeave={handleBrandLogoLeave}
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              setOpenDropdown(null);
              setOpenMobileDropdown(null);
              setActiveView('landing');
            }}
          >
            <img
              src="/logo.png"
              alt="ICST LAB Official Logo"
              className="brand-logo-img"
              width={40}
              height={40}
            />
            <div className="brand-meta">
              <span className="brand-title">ICST LAB</span>
              <span className="brand-sub">Part of icstconnect.in</span>
            </div>
          </a>

          {/* Direct Connection Pill to Official ICST Connect Portal */}
          <a
            href={ICST_CONNECT.URL}
            target="_blank"
            rel="noopener noreferrer"
            className="icst-connect-header-pill"
            title="Visit ICST Connect Official Portal (icstconnect.in) — Parent Platform of ICST LAB"
          >
            <img
              src={ICST_CONNECT.LOGO_PATH}
              alt="ICST Connect Logo"
              className="icst-connect-pill-logo"
              width={18}
              height={18}
            />
            <span className="icst-connect-pill-text">icstconnect.in</span>
            <ExternalLink size={11} className="icst-connect-pill-icon" />
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

        {/* Desktop Navigation Links & Grouped Lab Dropdowns (Visible on screens > 1060px) */}
        <nav
          ref={desktopNavRef}
          className="header-nav header-nav-desktop"
          aria-label="Primary Navigation"
        >
          {/* Grouped Lab Dropdowns: Data Entry & OS/Typing */}
          {labDropdownGroups.map(group => {
            const activeChild = getActiveItemInGroup(group);
            const isOpen = openDropdown === group.id;
            return (
              <div key={group.id} className="nav-dropdown">
                <button
                  type="button"
                  className={`nav-btn nav-dropdown-trigger ${activeChild ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                  onClick={() => toggleDesktopDropdown(group.id)}
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  title={activeChild ? `${group.label}: ${activeChild.label}` : `Open ${group.sectionTitle}`}
                >
                  {group.icon}
                  <span className="nav-btn-text">{group.label}</span>
                  {activeChild && (
                    <span className="nav-active-pill">{activeChild.shortLabel}</span>
                  )}
                  <ChevronDown size={13} className="nav-chevron" />
                </button>

                {isOpen && (
                  <div
                    className={`nav-dropdown-menu ${group.align === 'right' ? 'align-right' : ''}`}
                    role="menu"
                    aria-label={group.sectionTitle}
                  >
                    <div className="nav-dropdown-header">{group.sectionTitle}</div>
                    <div className="nav-dropdown-items">
                      {group.items.map(item => {
                        const isItemActive = activeView === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            role="menuitem"
                            className={`nav-dropdown-item ${isItemActive ? 'active' : ''}`}
                            onClick={() => handleSelectNav(item)}
                            title={item.title}
                          >
                            <span
                              className="nav-dropdown-item-icon"
                              style={{ background: item.iconBg }}
                            >
                              {item.icon}
                            </span>
                            <span className="nav-dropdown-item-body">
                              <span className="nav-dropdown-item-title-row">
                                <span className="nav-dropdown-item-title">{item.label}</span>
                                {item.badge && (
                                  <span
                                    className={`nav-lab-badge ${item.badgeClass || ''}`}
                                    style={{ background: item.badgeColor, color: '#ffffff' }}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </span>
                              <span className="nav-dropdown-item-desc">{item.description}</span>
                            </span>
                            <span className="nav-dropdown-item-trailing">
                              {isItemActive ? (
                                <Check size={15} className="nav-dropdown-check" />
                              ) : (
                                <ChevronRight size={14} className="nav-dropdown-arrow" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Direct Dashboard Navigation */}
          <button
            type="button"
            className={`nav-btn ${activeView === DASHBOARD_ITEM.id ? 'active' : ''}`}
            onClick={() => handleSelectNav(DASHBOARD_ITEM)}
            title={DASHBOARD_ITEM.title}
          >
            {DASHBOARD_ITEM.icon}
            <span className="nav-btn-text">{DASHBOARD_ITEM.label}</span>
          </button>

          {/* Institute Portal Dropdown (Teacher Mode & Live Showcase) */}
          {(() => {
            const activeChild = getActiveItemInGroup(portalGroup);
            const isOpen = openDropdown === portalGroup.id;
            return (
              <div className="nav-dropdown">
                <button
                  type="button"
                  className={`nav-btn nav-dropdown-trigger ${activeChild ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                  onClick={() => toggleDesktopDropdown(portalGroup.id)}
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  title={activeChild ? `Portal: ${activeChild.label}` : 'Teacher Mode & Live Showcase'}
                >
                  {portalGroup.icon}
                  <span className="nav-btn-text">{portalGroup.label}</span>
                  {activeChild && (
                    <span className="nav-active-pill">{activeChild.shortLabel}</span>
                  )}
                  <ChevronDown size={13} className="nav-chevron" />
                </button>

                {isOpen && (
                  <div
                    className="nav-dropdown-menu align-right"
                    role="menu"
                    aria-label={portalGroup.sectionTitle}
                  >
                    <div className="nav-dropdown-header">{portalGroup.sectionTitle}</div>
                    <div className="nav-dropdown-items">
                      {portalGroup.items.map(item => {
                        const isItemActive = activeView === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            role="menuitem"
                            className={`nav-dropdown-item ${isItemActive ? 'active' : ''}`}
                            onClick={() => handleSelectNav(item)}
                            title={item.title}
                          >
                            <span
                              className="nav-dropdown-item-icon"
                              style={{ background: item.iconBg }}
                            >
                              {item.icon}
                            </span>
                            <span className="nav-dropdown-item-body">
                              <span className="nav-dropdown-item-title-row">
                                <span className="nav-dropdown-item-title">{item.label}</span>
                              </span>
                              <span className="nav-dropdown-item-desc">{item.description}</span>
                            </span>
                            <span className="nav-dropdown-item-trailing">
                              {isItemActive ? (
                                <Check size={15} className="nav-dropdown-check" />
                              ) : (
                                <ChevronRight size={14} className="nav-dropdown-arrow" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          <span className="header-nav-divider" aria-hidden="true" />

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

          {/* Master Unlocked Status Pill */}
          {masterUnlocked && (
            <button
              type="button"
              className="nav-btn master-unlock-pill"
              onClick={() => {
                lockToStudentProgression();
                setMasterUnlockedState(false);
              }}
              title="Master Unlocked! All levels accessible. Click to lock back to student progression."
            >
              <Unlock size={13} color="#059669" />
              <span className="nav-btn-text">ICST 🔒</span>
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
            <span className="clear-data-text">Clear Data</span>
          </button>

          <button
            type="button"
            className="nav-btn keyboard-shortcuts-btn"
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts"
            aria-label="Keyboard Shortcuts"
          >
            <HelpCircle size={16} />
          </button>
        </nav>

        {/* Mobile / Tablet Header Trigger (Visible on screens <= 1060px) */}
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
            onClick={() => {
              setOpenMobileDropdown(null);
              setMobileMenuOpen(prev => !prev);
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            title="Navigation Menu & Labs"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Tablet & Mobile Grouped Labs Dropdown Strip (Visible on screens <= 1060px) */}
      <div
        ref={mobileBarRef}
        className="header-mobile-labs-bar"
        role="navigation"
        aria-label="Grouped Labs Navigation"
      >
        <div className="header-mobile-labs-inner">
          {labDropdownGroups.map(group => {
            const activeChild = getActiveItemInGroup(group);
            const isOpen = openMobileDropdown === group.id;
            return (
              <div key={group.id} className="mobile-lab-dropdown">
                <button
                  type="button"
                  className={`tab-scroll-btn ${activeChild ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                  onClick={() => toggleMobileDropdown(group.id)}
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                >
                  {group.icon}
                  <span className="tab-scroll-label">
                    {activeChild ? activeChild.shortLabel : group.label}
                  </span>
                  <ChevronDown size={13} className="nav-chevron" />
                </button>

                {isOpen && (
                  <div
                    className={`nav-dropdown-menu mobile-dropdown-panel ${group.id === 'os-typing' ? 'align-right-sm' : ''}`}
                    role="menu"
                    aria-label={group.sectionTitle}
                  >
                    <div className="nav-dropdown-header">{group.sectionTitle}</div>
                    <div className="nav-dropdown-items">
                      {group.items.map(item => {
                        const isItemActive = activeView === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            role="menuitem"
                            className={`nav-dropdown-item ${isItemActive ? 'active' : ''}`}
                            onClick={() => handleSelectNav(item)}
                          >
                            <span
                              className="nav-dropdown-item-icon"
                              style={{ background: item.iconBg }}
                            >
                              {item.icon}
                            </span>
                            <span className="nav-dropdown-item-body">
                              <span className="nav-dropdown-item-title-row">
                                <span className="nav-dropdown-item-title">{item.label}</span>
                                {item.badge && (
                                  <span
                                    className={`nav-lab-badge ${item.badgeClass || ''}`}
                                    style={{ background: item.badgeColor, color: '#ffffff' }}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </span>
                              <span className="nav-dropdown-item-desc">{item.description}</span>
                            </span>
                            <span className="nav-dropdown-item-trailing">
                              {isItemActive ? (
                                <Check size={15} className="nav-dropdown-check" />
                              ) : (
                                <ChevronRight size={14} className="nav-dropdown-arrow" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="button"
            className={`tab-scroll-btn ${activeView === DASHBOARD_ITEM.id ? 'active' : ''}`}
            onClick={() => handleSelectNav(DASHBOARD_ITEM)}
          >
            {DASHBOARD_ITEM.icon}
            <span className="tab-scroll-label">{DASHBOARD_ITEM.shortLabel}</span>
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Navigation Drawer */}
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
                <img src="/logo.png" alt="ICST LAB Logo" width={28} height={28} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', lineHeight: 1.15 }}>ICST LAB</div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--icst-blue)' }}>Property of icstconnect.in</div>
                </div>
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

            {/* Direct ICST Connect Portal Card in Mobile Drawer */}
            <a
              href={ICST_CONNECT.URL}
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-icst-connect-card"
            >
              <img
                src={ICST_CONNECT.LOGO_PATH}
                alt="ICST Connect Logo"
                width={32}
                height={32}
                className="drawer-icst-connect-logo"
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '13px', color: '#ffffff' }}>ICST Connect Portal</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.82)' }}>Official parent site • icstconnect.in</div>
              </div>
              <ExternalLink size={15} color="#ffffff" />
            </a>

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

            {/* Grouped Labs & Portal Navigation in Drawer */}
            <div className="drawer-nav-groups">
              {labDropdownGroups.map(group => (
                <div key={group.id} className="drawer-nav-list">
                  <span className="drawer-section-label">{group.sectionTitle}</span>
                  {group.items.map(item => (
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
              ))}

              <div className="drawer-nav-list">
                <span className="drawer-section-label">Student & Institute Portal</span>
                {[DASHBOARD_ITEM, ...PORTAL_ITEMS].map(item => (
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
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </button>
                ))}
              </div>
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
