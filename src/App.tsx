import React, { useState, useEffect } from 'react';
import { UserRole, StudentProgress } from './types';
import { loadStudentProgress, saveStudentProgress } from './services/storageService';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';

import { LandingPage } from './components/landing/LandingPage';
import { PracticeWorkbench } from './components/practice/PracticeWorkbench';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ShowcasePage } from './components/showcase/ShowcasePage';

export function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeView, setActiveView] = useState<'landing' | 'practice' | 'student-dashboard' | 'teacher-dashboard' | 'showcase'>('landing');

  // Active level and stage
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [currentStage, setCurrentStage] = useState<number>(1);

  // Guided Mode Toggle (When ON: 0 EXP awarded, live corrections enabled)
  const [isGuidedMode, setIsGuidedMode] = useState<boolean>(false);

  // Student Profile & Progress
  const [studentProgress, setStudentProgress] = useState<StudentProgress>(() => loadStudentProgress());

  // EXP Floating Micro-animation state
  const [floatingExp, setFloatingExp] = useState<number | null>(null);

  // Practice Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // Keyboard Shortcuts Modal
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Route syncing: support /showcase, #showcase, #practice, etc.
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.includes('showcase') || hash === '#showcase') {
        setActiveView('showcase');
      } else if (hash === '#practice') {
        setActiveView('practice');
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
  const handleViewChange = (view: 'landing' | 'practice' | 'student-dashboard' | 'teacher-dashboard' | 'showcase') => {
    setActiveView(view);
    if (view === 'showcase') {
      window.location.hash = 'showcase';
    } else if (view === 'practice') {
      window.location.hash = 'practice';
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
        // Handled within PracticeWorkbench
      } else if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Persistent Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeView={activeView}
        setActiveView={handleViewChange}
        currentLevel={currentLevel}
        currentStage={currentStage}
        totalExp={studentProgress.totalExp}
        floatingExp={floatingExp}
        isGuidedMode={isGuidedMode}
        setIsGuidedMode={setIsGuidedMode}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        stageProgressPercent={Math.round((Object.keys(studentProgress.completedStages).length / 18) * 100)}
        timerSeconds={timerSeconds}
      />

      {/* Main Views */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeView === 'landing' && (
          <LandingPage
            onStartPractice={() => handleViewChange('practice')}
            onOpenTeacherMode={() => {
              setCurrentRole('teacher');
              handleViewChange('teacher-dashboard');
            }}
            onOpenDashboard={() => handleViewChange('student-dashboard')}
            onOpenShowcase={() => handleViewChange('showcase')}
          />
        )}

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
            onTimerTick={setTimerSeconds}
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
      </main>

      {/* Brand Footer */}
      <Footer />

      {/* Keyboard Shortcuts Modal */}
      {isShortcutsOpen && (
        <KeyboardShortcutsModal onClose={() => setIsShortcutsOpen(false)} />
      )}
    </div>
  );
}

export default App;
