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

// Lazy-loaded routes for lightning-fast initial page load
const PracticeWorkbench = React.lazy(() => import('./components/practice/PracticeWorkbench').then(m => ({ default: m.PracticeWorkbench })));
const StudentDashboard = React.lazy(() => import('./components/student/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const TeacherDashboard = React.lazy(() => import('./components/teacher/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const ShowcasePage = React.lazy(() => import('./components/showcase/ShowcasePage').then(m => ({ default: m.ShowcasePage })));
const ExcelDashboard = React.lazy(() => import('./components/excel/ExcelDashboard').then(m => ({ default: m.ExcelDashboard })));
const ExcelWorkbench = React.lazy(() => import('./components/excel/ExcelWorkbench').then(m => ({ default: m.ExcelWorkbench })));

// Lazy-loaded modals (never loaded until explicitly triggered)
const KeyboardShortcutsModal = React.lazy(() => import('./components/common/KeyboardShortcutsModal').then(m => ({ default: m.KeyboardShortcutsModal })));
const TeacherPasswordModal = React.lazy(() => import('./components/common/TeacherPasswordModal').then(m => ({ default: m.TeacherPasswordModal })));
const ClearDataConfirmModal = React.lazy(() => import('./components/common/ClearDataConfirmModal').then(m => ({ default: m.ClearDataConfirmModal })));
const StudentSetupModal = React.lazy(() => import('./components/student/StudentSetupModal').then(m => ({ default: m.StudentSetupModal })));

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
  const [activeView, setActiveView] = useState<'landing' | 'practice' | 'student-dashboard' | 'teacher-dashboard' | 'showcase' | 'excel'>('landing');
  const [excelLevel, setExcelLevel] = useState<number | null>(null);

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
  const [pendingPracticeStart, setPendingPracticeStart] = useState<boolean>(false);

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

  // Sync active view to window hash
  const handleViewChange = (view: 'landing' | 'practice' | 'student-dashboard' | 'teacher-dashboard' | 'showcase' | 'excel') => {
    // If entering practice but no student identity is registered yet, gate with StudentSetupModal
    if (view === 'practice' && !studentProgress.studentIdentity) {
      setPendingPracticeStart(true);
      setIsStudentSetupOpen(true);
      return;
    }

    setActiveView(view);
    if (view === 'showcase') {
      window.location.hash = 'showcase';
    } else if (view === 'practice') {
      window.location.hash = 'practice';
    } else if (view === 'excel') {
      window.location.hash = 'excel';
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
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // EXP Awarded Micro-animation trigger
  const handleExpAwarded = (amount: number) => {
    setFloatingExp(amount);
    setTimeout(() => {
      setFloatingExp(null);
    }, 1800);
  };

  // Launch a specific stage
  const handleSelectStage = (lvl: number, stg: number) => {
    setCurrentLevel(lvl);
    setCurrentStage(stg);
    handleViewChange('practice');
  };

  // Save student identity from modal
  const handleSaveStudentIdentity = (identity: StudentIdentity) => {
    const updated = {
      ...studentProgress,
      studentIdentity: identity
    };
    setStudentProgress(updated);
    saveStudentProgress(updated);
    saveStudentIdentity(identity);
    setIsStudentSetupOpen(false);

    if (pendingPracticeStart) {
      setPendingPracticeStart(false);
      setActiveView('practice');
      window.location.hash = 'practice';
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
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeView === 'landing' && (
          <LandingPage
            onStartPractice={() => handleViewChange('practice')}
            onOpenTeacherMode={() => setIsTeacherPasswordOpen(true)}
            onOpenDashboard={() => handleViewChange('student-dashboard')}
            onOpenShowcase={() => handleViewChange('showcase')}
            onOpenExcel={() => handleViewChange('excel')}
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
              onExpAwarded={handleExpAwarded}
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
            />
          )}

          {activeView === 'excel' && excelLevel === null && (
            <ExcelDashboard
              onSelectLevel={(lvl) => setExcelLevel(lvl)}
              studentProgress={studentProgress}
            />
          )}

          {activeView === 'excel' && excelLevel !== null && (
            <ExcelWorkbench
              levelNumber={excelLevel}
              onBackToDashboard={() => setExcelLevel(null)}
              onSelectLevel={(lvl) => setExcelLevel(lvl)}
              studentProgress={studentProgress}
              onExpAwarded={handleExpAwarded}
            />
          )}
        </React.Suspense>
      </main>

      {/* Brand Footer */}
      <Footer />

      {/* Modals wrapped in lightweight Suspense */}
      <React.Suspense fallback={null}>
        {/* Student Setup Gate Modal */}
        {isStudentSetupOpen && (
          <StudentSetupModal
            initialIdentity={studentProgress.studentIdentity}
            onSave={handleSaveStudentIdentity}
            onCancel={() => {
              setIsStudentSetupOpen(false);
              setPendingPracticeStart(false);
            }}
            canCancel={!pendingPracticeStart && !!studentProgress.studentIdentity}
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
    </div>
  );
}

export default App;
