import React from 'react';
import { 
  Play, 
  UserCheck, 
  Sparkles, 
  FileSpreadsheet,
  FolderTree,
  Share2,
  Award,
  ExternalLink,
  MessageCircle,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { LEVELS_INFO } from '../../data/stagesConfig';

interface LandingPageProps {
  onStartPractice: () => void;
  onOpenTeacherMode: () => void;
  onOpenDashboard: () => void;
  onOpenShowcase: () => void;
  onOpenExcel?: () => void;
  onOpenWindows?: () => void;
  onOpenAchievementShare?: () => void;
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
  onOpenExcel,
  onOpenWindows,
  onOpenAchievementShare
}) => {
  return (
    <div className="landing-root">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          {/* Logo Brand Header */}
          <div className="landing-brand-header">
            <img 
              src="/logo.png" 
              alt="ICST Chowberia Logo" 
              className="landing-brand-logo"
              width="76"
              height="76"
              loading="eager"
            />
            <div className="landing-brand-text">
              <div className="landing-inst-name">
                Institute of Computer Science and Technology Chowberia
              </div>
              <div className="landing-inst-sub">
                ICST - CHOWBERIA • DATA ENTRY & OFFICE COMPUTING LABORATORY
              </div>
            </div>
          </div>

          <h1 className="landing-hero-title">
            MASTER THE ART OF DATA ENTRY & COMPUTING
          </h1>

          <p className="landing-hero-tagline">
            Practice • Improve • Achieve • Certify
          </p>

          <p className="landing-hero-desc">
            An enterprise-grade training simulator modeling authentic academic admissions, state board marksheets (WBBSE, WBCHSE, CBSE), Microsoft Excel 365 tabular ledgers, and Windows 11 desktop file/folder architectures with zero-error precision auditing.
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

            {onOpenWindows && (
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={onOpenWindows}
                style={{ background: '#0284c7', borderColor: '#0369a1' }}
              >
                <FolderTree size={17} />
                <span>WINDOWS ORG LAB</span>
              </button>
            )}

            {onOpenAchievementShare && (
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={onOpenAchievementShare}
                style={{ background: 'rgba(251, 191, 36, 0.15)', borderColor: '#fbbf24', color: '#fbbf24', fontWeight: 700 }}
              >
                <Share2 size={17} />
                <span>SHARE ACHIEVEMENTS</span>
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

      {/* 3 Core Laboratory Modules Highlight */}
      <section style={{ maxWidth: '1200px', margin: '32px auto 0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Card 1: Practice */}
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            border: '1.5px solid var(--border-light, #e2e8f0)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                📝
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Foundation & Marksheets Lab
                </h3>
                <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700 }}>5 Levels • 18 Progressive Stages</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Transcribe physical dossier archives into structured forms. Master cascading dropdowns, date masks, phone formats, and WBBSE/WBCHSE examination marksheets.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onStartPractice}
              style={{ width: '100%' }}
            >
              Launch Practice Lab →
            </button>
          </div>

          {/* Card 2: Excel */}
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            border: '1.5px solid var(--border-light, #e2e8f0)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                📊
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Excel 365 Mass Data Lab
                </h3>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>5 Industrial Scenarios • Up to 600 EXP</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Authentic Microsoft 365 spreadsheet environment. Rapid Tab/Enter workflow, wholesale inventory, banking customer KYC, and national census registries.
            </p>
            {onOpenExcel && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onOpenExcel}
                style={{ width: '100%' }}
              >
                Launch Excel Lab →
              </button>
            )}
          </div>

          {/* Card 3: Windows */}
          <div style={{
            background: 'var(--bg-card, #ffffff)',
            border: '1.5px solid var(--border-light, #e2e8f0)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                🗂️
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Windows 11 Organization Lab
                </h3>
                <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>12 Levels (File & Folder) • 2,150 EXP</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Windows 11 desktop simulation with Mica design. Master extensions (.pdf, .docx, .xlsx), ISO 8601 timestamps, F2 renaming, deep folder trees, and cloud multi-tenancy.
            </p>
            {onOpenWindows && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onOpenWindows}
                style={{ width: '100%' }}
              >
                Launch Windows Lab →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* COMMUNITY, SOCIALS & HONORS SHARING SECTION */}
      <section style={{ maxWidth: '1200px', margin: '40px auto 0 auto', padding: '0 20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #091326, #112240)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ maxWidth: '680px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '10px'
              }}>
                <Sparkles size={12} />
                <span>ICST Student Community & Honors</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0', color: '#ffffff' }}>
                Share Your Verified Honors & Connect With Us
              </h2>
              <p style={{ fontSize: '14px', color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                Celebrate your typing milestones, 100% accuracy runs, and technical credentials! Generate high-resolution story cards and share directly to <strong>WhatsApp</strong> and <strong>Instagram</strong>. Tag us at <strong>@icstconnect</strong> or use <strong>#ICSTChowberia</strong> to be featured on our institute honor leaderboard!
              </p>
            </div>

            {onOpenAchievementShare && (
              <button
                type="button"
                onClick={onOpenAchievementShare}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '13px',
                  padding: '12px 22px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <Award size={18} />
                <span>Choose & Share Achievement</span>
              </button>
            )}
          </div>

          {/* Social Links Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px'
          }}>
            {/* GitHub */}
            <a
              href="https://github.com/icstconnect"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#24292e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Official GitHub</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>icstconnect</div>
              </div>
              <ExternalLink size={13} color="#64748b" style={{ marginLeft: 'auto' }} />
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/icstconnect"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Smartphone size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Instagram</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>@icstconnect</div>
              </div>
              <ExternalLink size={13} color="#64748b" style={{ marginLeft: 'auto' }} />
            </a>

            {/* WhatsApp */}
            <div
              onClick={onOpenAchievementShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageCircle size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>WhatsApp</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>Share Story Card</div>
              </div>
              <Share2 size={13} color="#64748b" style={{ marginLeft: 'auto' }} />
            </div>

            {/* Institute Tag Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px dashed rgba(56, 189, 248, 0.35)',
              borderRadius: '12px',
              padding: '12px 16px'
            }}>
              <CheckCircle2 size={20} color="#38bdf8" />
              <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                Use tag <strong>#ICSTChowberia</strong> for verified trainee spotlight!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Workflow Steps */}
      <section className="landing-section-workflow" style={{ marginTop: '40px' }}>
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

      {/* 5-Level Curriculum Highlights */}
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
