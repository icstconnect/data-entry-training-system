import React from 'react';
import { 
  Play, 
  UserCheck, 
  Sparkles, 
  FileSpreadsheet
} from 'lucide-react';
import { LEVELS_INFO } from '../../data/stagesConfig';

interface LandingPageProps {
  onStartPractice: () => void;
  onOpenTeacherMode: () => void;
  onOpenDashboard: () => void;
  onOpenShowcase: () => void;
  onOpenExcel?: () => void;
}

const STEPS = [
  { title: '1. UID Entry', desc: 'Input or load assigned student reference UID' },
  { title: '2. Source Record', desc: 'Dossier archives loaded in authentic reference viewer' },
  { title: '3. Data Entry', desc: 'Type into multi-control forms, tables, and marksheets' },
  { title: '4. Review Screen', desc: 'Inspect completed fields and catch blanks before submit' },
  { title: '5. Validation Engine', desc: 'Exact character-level verification & accuracy % scoring' },
  { title: '6. EXP & Titles', desc: 'Earn verified EXP and unlock professional operator titles' }
];

export const LandingPage: React.FC<LandingPageProps> = React.memo(({
  onStartPractice,
  onOpenTeacherMode,
  onOpenDashboard,
  onOpenShowcase,
  onOpenExcel
}) => {
  return (
    <div className="landing-root">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          {/* Logo Brand Header */}
          <div className="landing-brand-header">
            <img 
              src="/logo-icst.png" 
              alt="ICST Chowberia Logo" 
              className="landing-brand-logo"
              width="72"
              height="72"
              loading="eager"
            />
            <div className="landing-brand-text">
              <div className="landing-inst-name">
                Institute of Computer Science and Technology Chowberia
              </div>
              <div className="landing-inst-sub">
                ICST - CHOWBERIA • DATA ENTRY TRAINING SYSTEM
              </div>
            </div>
          </div>

          <h1 className="landing-hero-title">
            MASTER THE ART OF DATA ENTRY
          </h1>

          <p className="landing-hero-tagline">
            Practice. Improve. Achieve.
          </p>

          <p className="landing-hero-desc">
            A professional training platform simulating realistic academic admissions, state board marksheets (WBBSE, WBCHSE, CBSE), and structured governmental databases with zero-error precision scoring.
          </p>

          {/* CTA Buttons */}
          <div className="landing-cta-cluster">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={onStartPractice}
            >
              <Play size={17} />
              <span>START PRACTICE</span>
            </button>

            {onOpenExcel && (
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={onOpenExcel}
                style={{ background: '#107c41', borderColor: '#0d5e2e' }}
              >
                <FileSpreadsheet size={17} />
                <span>EXCEL MASS ENTRY LAB</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={onOpenTeacherMode}
            >
              <UserCheck size={17} />
              <span>TEACHER MODE</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={onOpenShowcase}
            >
              <Sparkles size={17} color="var(--icst-blue)" />
              <span>LIVE SHOWCASE</span>
            </button>
          </div>
        </div>
      </section>

      {/* Visual Workflow Steps (Optimized with content-visibility to eliminate forced reflows) */}
      <section className="landing-section-workflow">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">
              Authentic Operator Training Workflow
            </h2>
            <p className="landing-section-sub">
              From UID lookup to live character verification and internal batch title certification.
            </p>
          </div>

          <div className="landing-steps-grid">
            {STEPS.map((st, i) => (
              <div key={i} className="landing-step-card">
                <div className="landing-step-badge">
                  {i + 1}
                </div>
                <div className="landing-step-title">
                  {st.title}
                </div>
                <div className="landing-step-desc">
                  {st.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Level Curriculum Highlights (Optimized with content-visibility) */}
      <section className="landing-section-levels">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2 className="landing-section-title">
              Progressive 5-Level Mastery Program
            </h2>
            <p className="landing-section-sub">
              From beginner field controls to expert 100% zero-tolerance board marksheets.
            </p>
          </div>

          <div className="landing-levels-grid">
            {LEVELS_INFO.map(lvl => (
              <div key={lvl.levelNumber} className="landing-level-card">
                <div>
                  <div 
                    className="landing-level-tag"
                    style={{ background: lvl.color }}
                  >
                    LEVEL {lvl.levelNumber}
                  </div>
                  <h3 className="landing-level-title">
                    {lvl.title}
                  </h3>
                  <div 
                    className="landing-level-target"
                    style={{ color: lvl.color }}
                  >
                    Pass Target: {lvl.requiredAccuracy}% Accuracy
                  </div>
                  <p className="landing-level-desc">
                    {lvl.description}
                  </p>
                </div>

                <div className="landing-level-footer">
                  Title: <strong>{lvl.badgeTitle}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
});
