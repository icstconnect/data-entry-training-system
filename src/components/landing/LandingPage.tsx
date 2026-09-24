import React from 'react';
import { 
  Play, 
  UserCheck, 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Table, 
  Award, 
  Target, 
  Sparkles, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';
import { LEVELS_INFO } from '../../data/stagesConfig';

interface LandingPageProps {
  onStartPractice: () => void;
  onOpenTeacherMode: () => void;
  onOpenDashboard: () => void;
  onOpenShowcase: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPractice,
  onOpenTeacherMode,
  onOpenDashboard,
  onOpenShowcase
}) => {
  const steps = [
    { title: '1. UID Entry', desc: 'Input or load assigned student reference UID' },
    { title: '2. Source Record', desc: 'Dossier archives loaded in authentic reference viewer' },
    { title: '3. Data Entry', desc: 'Type into multi-control forms, tables, and marksheets' },
    { title: '4. Review Screen', desc: 'Inspect completed fields and catch blanks before submit' },
    { title: '5. Validation Engine', desc: 'Exact character-level verification & accuracy % scoring' },
    { title: '6. EXP & Titles', desc: 'Earn verified EXP and unlock professional operator titles' }
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
        borderBottom: '1px solid var(--border-light)',
        padding: '56px 20px 64px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          {/* Logo Brand Header */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <img 
              src="/logo.png" 
              alt="ICST Chowberia Logo" 
              style={{ width: '72px', height: '72px', objectFit: 'contain' }} 
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--icst-blue-dark)' }}>
                Institute of Computer Science and Technology Chowberia
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                ICST - CHOWBERIA • DATA ENTRY TRAINING SYSTEM
              </div>
            </div>
          </div>

          <h1 style={{
            fontSize: '44px',
            fontWeight: 800,
            color: 'var(--icst-charcoal)',
            lineHeight: 1.15,
            letterSpacing: '-0.8px',
            marginBottom: '16px'
          }}>
            MASTER THE ART OF DATA ENTRY
          </h1>

          <p style={{
            fontSize: '20px',
            color: 'var(--icst-slate)',
            fontWeight: 500,
            marginBottom: '12px'
          }}>
            Practice. Improve. Achieve.
          </p>

          <p style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            maxWidth: '660px',
            margin: '0 auto 32px',
            lineHeight: 1.6
          }}>
            A professional training platform simulating realistic academic admissions, state board marksheets (WBBSE, WBCHSE, CBSE), and structured governmental databases with zero-error precision scoring.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={onStartPractice}
            >
              <Play size={17} />
              <span>START PRACTICE</span>
            </button>

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

      {/* Visual Workflow Steps */}
      <section style={{ padding: '48px 20px', background: '#ffffff', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--icst-charcoal)' }}>
              Authentic Operator Training Workflow
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              From UID lookup to live character verification and internal batch title certification.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px'
          }}>
            {steps.map((st, i) => (
              <div 
                key={i}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px 14px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--icst-blue-soft)',
                  color: 'var(--icst-blue-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '14px',
                  marginBottom: '10px'
                }}>
                  {i + 1}
                </div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {st.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {st.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Level Curriculum Highlights */}
      <section style={{ padding: '48px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--icst-charcoal)' }}>
              Progressive 5-Level Mastery Program
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              From beginner field controls to expert 100% zero-tolerance board marksheets.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {LEVELS_INFO.map(lvl => (
              <div 
                key={lvl.levelNumber}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{
                    display: 'inline-block',
                    background: lvl.color,
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    marginBottom: '8px'
                  }}>
                    LEVEL {lvl.levelNumber}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {lvl.title}
                  </h3>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: lvl.color, marginBottom: '8px' }}>
                    Pass Target: {lvl.requiredAccuracy}% Accuracy
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {lvl.description}
                  </p>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Title: <strong>{lvl.badgeTitle}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
