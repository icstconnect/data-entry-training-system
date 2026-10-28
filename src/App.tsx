import React, { useState, useEffect } from 'react';
import { UserRole, StudentProgress, StudentIdentity } from './types';
import { 
  loadStudentProgress, 
  saveStudentProgress, 
  saveStudentIdentity,
  clearAllPracticeData 
} from './services/storageService';
import { APP_CONFIG } from './config/appConfig';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { OfflineNotice } from './components/common/OfflineNotice';
import { LandingPage } from './components/landing/LandingPage';
import { 
  GovtAccessibilityBar, 
  GovtFontSize, 
  GovtZoomLevel, 
  GovtContrastMode 
} from './components/common/GovtAccessibilityBar';
import { ScreenMagnifier } from './components/common/ScreenMagnifier';

// Lazy-loaded routes for lightning-fast initial page load
const PracticeWorkbench = React.lazy(() => import('./components/practice/PracticeWorkbench').then(m => ({ default: m.PracticeWorkbench })));
const StudentDashboard = React.lazy(() => import('./components/student/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const TeacherDashboard = React.lazy(() => import('./components/teacher/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const ShowcasePage = React.lazy(() => import('./components/showcase/ShowcasePage').then(m => ({ default: m.ShowcasePage })));
const ExcelDashboard = React.lazy(() => import('./components/excel/ExcelDashboard').then(m => ({ default: m.ExcelDashboard })));
const ExcelWorkbench = React.lazy(() => import('./components/excel/ExcelWorkbench').then(m => ({ default: m.ExcelWorkbench })));
const WindowsDashboard = React.lazy(() => import('./components/windows/WindowsDashboard').then(m => ({ default: m.WindowsDashboard })));
const WindowsWorkbench = React.lazy(() => import('./components/windows/WindowsWorkbench').then(m => ({ default: m.WindowsWorkbench })));
import { WindowsSimulationMode } from './types/windows';
import { setAppTitle } from './utils/dynamicTitle';
import { awardTaskExp } from './services/expEngine';

// Lazy-loaded modals (never loaded until explicitly triggered)
const KeyboardShortcutsModal = React.lazy(() => import('./components/common/KeyboardShortcutsModal').then(m => ({ default: m.KeyboardShortcutsModal })));
const TeacherPasswordModal = React.lazy(() => import('./components/common/TeacherPasswordModal').then(m => ({ default: m.TeacherPasswordModal })));
const ClearDataConfirmModal = React.lazy(() => import('./components/common/ClearDataConfirmModal').then(m => ({ default: m.ClearDataConfirmModal })));
const StudentSetupModal = React.lazy(() => import('./components/student/StudentSetupModal').then(m => ({ default: m.StudentSetupModal })));
const AchievementShareModal = React.lazy(() => import('./components/common/AchievementShareModal').then(m => ({ default: m.AchievementShareModal })));

// Inline lightweight view loader
const ViewLoader: React.FC = () => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div 
        style={{ 
          width: '30px', 
          height: '30px', 
          border: '3px solid var(--border-medium)', 
          borderTopColor: '#1c6aa7', 
          borderRadius: '50%', 
          animation: 'spin 0.75s linear infinite' 
        }} 
      />
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.3px' }}>
        Loading Lab Engine...
      </span>
    </div>
  </div>
);

export function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeView, setActiveView] = useState<'landing' | 'practice' | 'student-dashboard' | 'teacher-dashboard' | 'showcase' | 'excel' | 'windows'>('landing');
  const [excelLevel, setExcelLevel] = useState<number | null>(null);
  const [windowsState, setWindowsState] = useState<{ inWorkbench: boolean; mode: WindowsSimulationMode; level: number }>({
    inWorkbench: false,
    mode: 'file_management',
    level: 1
  });

  // Active level and stage
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [currentStage, setCurrentStage] = useState<number>(1);

  // Guided Mode Toggle (When ON: 0 EXP awarded, live corrections enabled)
  const [isGuidedMode, setIsGuidedMode] = useState<boolean>(false);

  // Student Profile & Progress
  const [studentProgress, setStudentProgress] = useState<StudentProgress>(() => loadStudentProgress());

  // EXP Floating Micro-animation state
  const [floatingExp, setFloatingExp] = useState<number | null>(null);

  // Timer states (Time Limit & Time Elapsed)
  const [timerElapsedSeconds, setTimerElapsedSeconds] = useState<number>(0);
  const [timerLimitSeconds, setTimerLimitSeconds] = useState<number>(APP_CONFIG.DEFAULT_TIME_LIMIT_SECONDS);

  // Modals state
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isTeacherPasswordOpen, setIsTeacherPasswordOpen] = useState<boolean>(false);
  const [isClearDataOpen, setIsClearDataOpen] = useState<boolean>(false);
  const [isStudentSetupOpen, setIsStudentSetupOpen] = useState<boolean>(false);
  const [isUniversalShareOpen, setIsUniversalShareOpen] = useState<boolean>(false);

  // Government Accessibility Bar & Screen Magnifier States
  const [govtFontSize, setGovtFontSize] = useState<GovtFontSize>(() => {
    return (localStorage.getItem('icst_govt_font_size') as GovtFontSize) || 'normal';
  });
  const [govtZoomLevel, setGovtZoomLevel] = useState<GovtZoomLevel>(() => {
    const raw = localStorage.getItem('icst_govt_zoom_level');
    return raw ? (Number(raw) as GovtZoomLevel) : 100;
  });
  const [govtContrastMode, setGovtContrastMode] = useState<GovtContrastMode>(() => {
    return (localStorage.getItem('icst_govt_contrast_mode') as GovtContrastMode) || 'standard';
  });
  const [isMagnifierActive, setIsMagnifierActive] = useState<boolean>(false);
  const [isSpeechActive, setIsSpeechActive] = useState<boolean>(false);

  // Universal Lab & Action Destination Gate
  type PendingLabTarget = 
    | { type: 'view'; view: 'practice' | 'excel' | 'windows' | 'showcase' }
    | { type: 'excelLevel'; level: number }
    | { type: 'windowsSimulation'; mode: WindowsSimulationMode; level: number }
    | { type: 'shareModal' }
    | null;

  const [pendingLabTarget, setPendingLabTarget] = useState<PendingLabTarget>(null);

  // Mandatory Student Identity Gatekeeper
  const requireStudentIdentity = (target: PendingLabTarget): boolean => {
    if (!studentProgress.studentIdentity || !studentProgress.studentIdentity.name?.trim()) {
      setPendingLabTarget(target);
      setIsStudentSetupOpen(true);
      return false;
    }
    return true;
  };

  // Listen to identity changes from any module (e.g. Achievement modal inline editor)
  useEffect(() => {
    const handleIdentityUpdated = (e: CustomEvent<StudentIdentity>) => {
      if (e.detail) {
        setStudentProgress(prev => ({
          ...prev,
          studentIdentity: e.detail
        }));
      }
    };
    const handleOpenUniversalShare = () => {
      if (!requireStudentIdentity({ type: 'shareModal' })) return;
      setIsUniversalShareOpen(true);
    };
    window.addEventListener('icst_student_identity_updated' as any, handleIdentityUpdated);
    window.addEventListener('icst_open_universal_share' as any, handleOpenUniversalShare);
    return () => {
      window.removeEventListener('icst_student_identity_updated' as any, handleIdentityUpdated);
      window.removeEventListener('icst_open_universal_share' as any, handleOpenUniversalShare);
    };
  }, [studentProgress.studentIdentity]);

  // Dynamic App Title Sync for every task, group, and page
  useEffect(() => {
    if (activeView === 'practice') {
      setAppTitle('practice', `Level ${currentLevel} • Stage ${currentStage}`);
    } else if (activeView === 'excel') {
      setAppTitle('excel', excelLevel ? `Scenario ${excelLevel} Batch` : undefined);
    } else if (activeView === 'windows') {
      if (windowsState.inWorkbench) {
        const modeText = windowsState.mode === 'folder_management' ? 'Folder Management' : 'File Organization';
        setAppTitle('windows', `${modeText} • Level ${windowsState.level}`);
      } else {
        setAppTitle('windows');
      }
    } else {
      setAppTitle(activeView);
    }
  }, [activeView, currentLevel, currentStage, excelLevel, windowsState]);

  // Sync Government Accessibility attributes with documentElement & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', govtFontSize);
    localStorage.setItem('icst_govt_font_size', govtFontSize);
  }, [govtFontSize]);

  useEffect(() => {
    document.documentElement.setAttribute('data-zoom', govtZoomLevel.toString());
    localStorage.setItem('icst_govt_zoom_level', govtZoomLevel.toString());
  }, [govtZoomLevel]);

  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', govtContrastMode);
    localStorage.setItem('icst_govt_contrast_mode', govtContrastMode);
  }, [govtContrastMode]);

  // Global listeners for Alt+M and icst_toggle_magnifier
  useEffect(() => {
    const handleToggleMagnifier = () => {
      setIsMagnifierActive(prev => !prev);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsMagnifierActive(prev => !prev);
      }
    };
    window.addEventListener('icst_toggle_magnifier', handleToggleMagnifier);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('icst_toggle_magnifier', handleToggleMagnifier);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleResetAccessibility = () => {
    setGovtFontSize('normal');
    setGovtZoomLevel(100);
    setGovtContrastMode('standard');
    setIsMagnifierActive(false);
    setIsSpeechActive(false);
  };

  // Route syncing: support /showcase, #showcase, #practice, etc.
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.includes('showcase') || hash === '#showcase') {
        setActiveView('showcase');
      } else if (hash === '#practice') {
        setActiveView('practice');
      } else if (hash === '#excel' || path.includes('excel')) {
        setActiveView('excel');
      } else if (hash === '#windows' || hash === '#windows-org' || path.includes('windows')) {
        setActiveView('windows');
      } else if (hash === '#dashboard') {
        setActiveView('student-dashboard');
      } else if (hash === '#teacher') {
        setCurrentRole('teacher');
        setActiveView('teacher-dashboard');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Sync active view to window hash with mandatory student identity check for all labs
  const handleViewChange = (view: 'landing' | 'practice' | 'student-dashboard' | 'teacher-dashboard' | 'showcase' | 'excel' | 'windows') => {
    const isLab = view === 'practice' || view === 'excel' || view === 'windows';
    if (isLab && !requireStudentIdentity({ type: 'view', view })) {
      return;
    }

    setActiveView(view);
    if (view === 'showcase') {
      window.location.hash = 'showcase';
    } else if (view === 'practice') {
      window.location.hash = 'practice';
    } else if (view === 'excel') {
      window.location.hash = 'excel';
    } else if (view === 'windows') {
      window.location.hash = 'windows';
    } else if (view === 'student-dashboard') {
      window.location.hash = 'dashboard';
    } else if (view === 'teacher-dashboard') {
      window.location.hash = 'teacher';
    } else {
      window.location.hash = 'home';
    }
  };

  // Global Keyboard shortcuts listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setIsTeacherPasswordOpen(false);
        setIsClearDataOpen(false);
        setIsUniversalShareOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // EXP Awarded Micro-animation trigger & unified profile synchronization
  const handleExpAwarded = (amount: number, source: 'practice' | 'excel' | 'windows' = 'practice') => {
    setFloatingExp(amount);
    setTimeout(() => {
      setFloatingExp(null);
    }, 1800);

    if (amount > 0) {
      // Route through unified expEngine
      const awardResult = awardTaskExp(amount, source, {
        alreadyAddedToTotal: source === 'practice'
      });
      setStudentProgress(prev => ({
        ...prev,
        totalExp: awardResult.newTotalExp,
        currentBatchTitle: awardResult.currentRank
      }));
    }
  };

  // Launch a specific stage
  const handleSelectStage = (lvl: number, stg: number) => {
    setCurrentLevel(lvl);
    setCurrentStage(stg);
    handleViewChange('practice');
  };

  // Save student identity from modal and fulfill any pending lab launch
  const handleSaveStudentIdentity = (identity: StudentIdentity) => {
    const updated = {
      ...studentProgress,
      studentIdentity: identity
    };
    setStudentProgress(updated);
    saveStudentProgress(updated);
    saveStudentIdentity(identity);
    setIsStudentSetupOpen(false);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('icst_student_identity_updated', { detail: identity }));
    }

    if (pendingLabTarget) {
      const target = pendingLabTarget;
      setPendingLabTarget(null);
      if (target.type === 'view') {
        setActiveView(target.view);
        window.location.hash = target.view;
      } else if (target.type === 'excelLevel') {
        setActiveView('excel');
        setExcelLevel(target.level);
        window.location.hash = 'excel';
      } else if (target.type === 'windowsSimulation') {
        setActiveView('windows');
        setWindowsState({ inWorkbench: true, mode: target.mode, level: target.level });
        window.location.hash = 'windows';
      } else if (target.type === 'shareModal') {
        setIsUniversalShareOpen(true);
      }
    }
  };

  // Confirm Clear All Practice Data
  const handleConfirmClearData = () => {
    clearAllPracticeData();
    const fresh = loadStudentProgress();
    setStudentProgress(fresh);
    setCurrentLevel(1);
    setCurrentStage(1);
    setExcelLevel(null);
    setTimerElapsedSeconds(0);
    setIsClearDataOpen(false);
    setActiveView('landing');
    window.location.hash = 'home';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Government Website Accessibility & Screen Magnifier Bar (GIGW Compliant) */}
      <GovtAccessibilityBar
        fontSize={govtFontSize}
        setFontSize={setGovtFontSize}
        zoomLevel={govtZoomLevel}
        setZoomLevel={setGovtZoomLevel}
        contrastMode={govtContrastMode}
        setContrastMode={setGovtContrastMode}
        isMagnifierActive={isMagnifierActive}
        setIsMagnifierActive={setIsMagnifierActive}
        isSpeechActive={isSpeechActive}
        setIsSpeechActive={setIsSpeechActive}
        onReset={handleResetAccessibility}
      />

      {/* Top Persistent Header */}
      <Header
        currentRole={currentRole}
        activeView={activeView}
        setActiveView={handleViewChange}
        currentLevel={currentLevel}
        currentStage={currentStage}
        totalExp={studentProgress.totalExp}
        floatingExp={floatingExp}
        isGuidedMode={isGuidedMode}
        setIsGuidedMode={setIsGuidedMode}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onClearDataClick={() => setIsClearDataOpen(true)}
        onOpenTeacherPassword={() => setIsTeacherPasswordOpen(true)}
        onOpenStudentSetup={() => setIsStudentSetupOpen(true)}
        studentIdentity={studentProgress.studentIdentity}
        stageProgressPercent={Math.round((Object.keys(studentProgress.completedStages).length / 18) * 100)}
        timerElapsedSeconds={timerElapsedSeconds}
        timerLimitSeconds={timerLimitSeconds}
      />

      {/* Main Views */}
      <main 
        id="main-content" 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: (activeView === 'windows' && windowsState.inWorkbench) ? 'hidden' : undefined,
          height: (activeView === 'windows' && windowsState.inWorkbench) ? 'calc(100vh - 58px)' : undefined
        }}
      >
        {activeView === 'landing' && (
          <LandingPage
            onStartPractice={() => handleViewChange('practice')}
            onOpenTeacherMode={() => setIsTeacherPasswordOpen(true)}
            onOpenDashboard={() => handleViewChange('student-dashboard')}
            onOpenShowcase={() => handleViewChange('showcase')}
            onOpenExcel={() => handleViewChange('excel')}
            onOpenWindows={() => handleViewChange('windows')}
            onOpenAchievementShare={() => {
              if (!requireStudentIdentity({ type: 'shareModal' })) return;
              setIsUniversalShareOpen(true);
            }}
          />
        )}

        <React.Suspense fallback={<ViewLoader />}>
          {activeView === 'practice' && (
            <PracticeWorkbench
              currentLevel={currentLevel}
              currentStage={currentStage}
              onStageChange={(lvl, stg) => {
                setCurrentLevel(lvl);
                setCurrentStage(stg);
              }}
              studentProgress={studentProgress}
              setStudentProgress={setStudentProgress}
              isGuidedMode={isGuidedMode}
              onExpAwarded={(amount) => handleExpAwarded(amount, 'practice')}
              onTimerTick={(elapsed, limit) => {
                setTimerElapsedSeconds(elapsed);
                setTimerLimitSeconds(limit);
              }}
            />
          )}

          {activeView === 'student-dashboard' && (
            <StudentDashboard
              progress={studentProgress}
              onSelectStage={handleSelectStage}
            />
          )}

          {activeView === 'teacher-dashboard' && (
            <TeacherDashboard
              onLaunchTest={handleSelectStage}
              studentProgress={studentProgress}
            />
          )}

          {activeView === 'showcase' && (
            <ShowcasePage
              onStartPractice={() => handleViewChange('practice')}
              onOpenAchievementShare={() => {
                if (!requireStudentIdentity({ type: 'shareModal' })) return;
                setIsUniversalShareOpen(true);
              }}
              studentIdentity={studentProgress.studentIdentity}
              onPromptStudentSetup={() => setIsStudentSetupOpen(true)}
            />
          )}

          {activeView === 'excel' && excelLevel === null && (
            <ExcelDashboard
              onSelectLevel={(lvl) => {
                if (!requireStudentIdentity({ type: 'excelLevel', level: lvl })) return;
                setExcelLevel(lvl);
              }}
              studentProgress={studentProgress}
            />
          )}

          {activeView === 'excel' && excelLevel !== null && (
            <ExcelWorkbench
              levelNumber={excelLevel}
              onBackToDashboard={() => setExcelLevel(null)}
              onSelectLevel={(lvl) => setExcelLevel(lvl)}
              studentProgress={studentProgress}
              onExpAwarded={(exp) => handleExpAwarded(exp, 'excel')}
            />
          )}

          {activeView === 'windows' && !windowsState.inWorkbench && (
            <WindowsDashboard
              onStartSimulation={(simMode, simLevel) => {
                if (!requireStudentIdentity({ type: 'windowsSimulation', mode: simMode, level: simLevel })) return;
                setWindowsState({ inWorkbench: true, mode: simMode, level: simLevel });
              }}
              onBackToHome={() => handleViewChange('landing')}
            />
          )}

          {activeView === 'windows' && windowsState.inWorkbench && (
            <WindowsWorkbench
              initialMode={windowsState.mode}
              initialLevel={windowsState.level}
              onExpAwarded={(exp) => handleExpAwarded(exp, 'windows')}
              onBackToDashboard={() => setWindowsState(s => ({ ...s, inWorkbench: false }))}
            />
          )}
        </React.Suspense>
      </main>

      {/* Brand Footer (hidden in Windows simulation workbench to fit full window without scrolling) */}
      {!(activeView === 'windows' && windowsState.inWorkbench) && <Footer />}

      {/* Modals wrapped in lightweight Suspense */}
      <React.Suspense fallback={null}>
        {/* Universal Achievement Sharing & Certificate Modal */}
        {isUniversalShareOpen && (
          <AchievementShareModal
            initialMode="select"
            onClose={() => setIsUniversalShareOpen(false)}
          />
        )}
        {/* Student Setup Gate Modal */}
        {isStudentSetupOpen && (
          <StudentSetupModal
            initialIdentity={studentProgress.studentIdentity}
            onSave={handleSaveStudentIdentity}
            onCancel={() => {
              setIsStudentSetupOpen(false);
              setPendingLabTarget(null);
            }}
            canCancel={!pendingLabTarget && !!studentProgress.studentIdentity}
          />
        )}

        {/* Teacher Password Gate Modal */}
        {isTeacherPasswordOpen && (
          <TeacherPasswordModal
            onSuccess={() => {
              setIsTeacherPasswordOpen(false);
              setCurrentRole('teacher');
              setActiveView('teacher-dashboard');
              window.location.hash = 'teacher';
            }}
            onCancel={() => setIsTeacherPasswordOpen(false)}
          />
        )}

        {/* Clear All Data Confirmation Modal */}
        {isClearDataOpen && (
          <ClearDataConfirmModal
            onConfirm={handleConfirmClearData}
            onCancel={() => setIsClearDataOpen(false)}
          />
        )}

        {/* Keyboard Shortcuts Modal */}
        {isShortcutsOpen && (
          <KeyboardShortcutsModal onClose={() => setIsShortcutsOpen(false)} />
        )}
      </React.Suspense>

      {/* Offline Status Popup (unobtrusive pill) */}
      <OfflineNotice />

      {/* Interactive Screen Magnifier Tool (Loupe & Docked modes) */}
      <ScreenMagnifier
        active={isMagnifierActive}
        onClose={() => setIsMagnifierActive(false)}
        isSpeechActive={isSpeechActive}
      />
    </div>
  );
}

export default App;
