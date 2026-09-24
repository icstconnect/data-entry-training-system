import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Play, 
  Smartphone, 
  Monitor, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Send 
} from 'lucide-react';

interface ShowcasePageProps {
  onStartPractice: () => void;
}

export const ShowcasePage: React.FC<ShowcasePageProps> = ({ onStartPractice }) => {
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);

  // Live simulation state for the showcase demo
  const [demoUid, setDemoUid] = useState('ICST-2026-001010');
  const [demoName, setDemoName] = useState('');
  const [demoDob, setDemoDob] = useState('');
  const [demoMarks, setDemoMarks] = useState('');
  const [demoExpGained, setDemoExpGained] = useState(false);
  const [demoAccuracy, setDemoAccuracy] = useState(98.5);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-typing simulation effect
  useEffect(() => {
    if (!isSimulating) return;

    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 6;
      if (step === 0) {
        setDemoName('');
        setDemoDob('');
        setDemoMarks('');
        setDemoExpGained(false);
      } else if (step === 1) {
        setDemoName('Sourav Ghosh');
      } else if (step === 2) {
        setDemoDob('2006-05-14');
      } else if (step === 3) {
        setDemoMarks('89');
      } else if (step === 4) {
        setDemoExpGained(true);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Social Share Handlers
  const shareUrl = window.location.origin;
  const shareText = `*ICST DATA ENTRY LAB* - Institute of Computer Science and Technology Chowberia\n\nPractice high-volume real-world data entry, academic marksheets (WBBSE/WBCHSE/CBSE), and earn EXP with verified accuracy!\n\nTry it free: ${shareUrl}`;

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ICST Data Entry Lab - Chowberia',
          text: 'Practice realistic data entry simulation at ICST Chowberia',
          url: shareUrl
        });
      } catch (e) {
        // Fallback
      }
    } else {
      handleCopyLink();
    }
  };

  // Generate Downloadable Instagram Story Card (1080 x 1920 portrait)
  const handleDownloadStoryCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 1920);
    bgGradient.addColorStop(0, '#0f172a');
    bgGradient.addColorStop(0.5, '#1e293b');
    bgGradient.addColorStop(1, '#0b132b');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Accent lighting
    ctx.fillStyle = 'rgba(24, 114, 192, 0.15)';
    ctx.beginPath();
    ctx.arc(540, 600, 480, 0, Math.PI * 2);
    ctx.fill();

    // Load and draw official logo
    const img = new Image();
    img.src = '/logo.png';
    img.onload = () => {
      // Draw logo centered
      ctx.drawImage(img, 540 - 140, 240, 280, 280);

      // Institute Name
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('INSTITUTE OF COMPUTER SCIENCE & TECHNOLOGY', 540, 600);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 30px Inter, sans-serif';
      ctx.fillText('CHOWBERIA • NADIA', 540, 650);

      // Main Title
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 72px Inter, sans-serif';
      ctx.fillText('ICST DATA ENTRY LAB', 540, 780);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 36px Inter, sans-serif';
      ctx.fillText('Learn • Practice • Improve • Achieve', 540, 840);

      // Card Feature Box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(140, 940, 800, 620, 28);
      ctx.fill();
      ctx.stroke();

      // Feature bullet points
      const features = [
        '✓ 5 Skill Levels (Foundation to Master)',
        '✓ Real UID-Based Reference Feeding',
        '✓ State Board Marksheets (WBBSE / WBCHSE / CBSE)',
        '✓ Zero-Error 100% Precision Challenges',
        '✓ Guided Mode Realtime Correction Feedback',
        '✓ Operator Title Badges & Certified EXP System'
      ];

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 32px Inter, sans-serif';
      ctx.textAlign = 'left';
      features.forEach((feat, idx) => {
        ctx.fillText(feat, 180, 1030 + idx * 80);
      });

      // Bottom Call to Action
      ctx.fillStyle = '#1872c0';
      ctx.beginPath();
      ctx.roundRect(240, 1640, 600, 110, 24);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 38px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('START PRACTICING NOW', 540, 1710);

      // Trigger download
      const link = document.createElement('a');
      link.download = 'icst-chowberia-data-entry-story.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div className="workbench-container" style={{ maxWidth: '1240px' }}>
      {/* Showcase Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '36px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: '#38bdf8',
          padding: '4px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 700,
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <Sparkles size={14} />
          <span>Official Training System • ICST Chowberia</span>
        </div>

        <h1 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>
          ICST DATA ENTRY LAB
        </h1>
        <div style={{ fontSize: '18px', color: '#94a3b8', fontWeight: 500, marginBottom: '20px' }}>
          Learn • Practice • Improve • Achieve
        </div>

        <p style={{ maxWidth: '680px', margin: '0 auto 28px', fontSize: '15px', color: '#cbd5e1', lineHeight: '1.6' }}>
          An operational training laboratory simulating realistic student registrations, institutional databases, and state board examination marksheets with real-time accuracy scoring.
        </p>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={onStartPractice}
            style={{ background: '#0284c7', borderColor: '#0369a1' }}
          >
            <Play size={16} />
            <span>START PRACTICE NOW</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={handleShareWhatsApp}
            style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <Share2 size={16} />
            <span>Share on WhatsApp</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={handleDownloadStoryCard}
            style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.2)' }}
            title="Download high-resolution 1080x1920 Instagram Story portrait card"
          >
            <Download size={16} />
            <span>Instagram Story Card</span>
          </button>
        </div>
      </div>

      {/* Interactive Live Simulation Demo Frame */}
      <div style={{ marginTop: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--icst-charcoal)' }}>
              Live Operational Simulation
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Watch automated high-speed data feeding or switch device views.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className={`btn btn-sm ${devicePreview === 'desktop' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDevicePreview('desktop')}
            >
              <Monitor size={14} />
              <span>Desktop View</span>
            </button>

            <button
              type="button"
              className={`btn btn-sm ${devicePreview === 'mobile' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDevicePreview('mobile')}
            >
              <Smartphone size={14} />
              <span>Mobile View</span>
            </button>
          </div>
        </div>

        {/* Preview Frame */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-md)',
          maxWidth: devicePreview === 'mobile' ? '420px' : '100%',
          margin: '0 auto',
          transition: 'all 0.3s ease'
        }}>
          {/* Simulated Mini Workbench */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-light)',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/logo.png" alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              <span style={{ fontWeight: 700, fontSize: '13px' }}>LEVEL 4: Professional Operator</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: '10px' }}>
                EXP 2,450
              </span>
              {demoExpGained && (
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#15803d', animation: 'floatUp 1.2s ease-out' }}>
                  +280 EXP
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: devicePreview === 'mobile' ? '1fr' : '1fr 1fr', gap: '16px' }}>
            {/* Source Reference Card */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--icst-blue-dark)', marginBottom: '8px' }}>
                REFERENCE CARD: {demoUid}
              </div>
              <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)' }}>
                <div><strong>Name:</strong> Sourav Ghosh</div>
                <div><strong>DOB:</strong> 2006-05-14</div>
                <div><strong>School:</strong> Chowberia High School</div>
                <div><strong>Math Marks:</strong> 89 / 100</div>
              </div>
            </div>

            {/* Destination Form Entry Simulation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Legal Name</label>
                <input
                  type="text"
                  className="field-input"
                  value={demoName}
                  placeholder="Typing..."
                  readOnly
                  style={{ background: demoName ? '#f0fdf4' : '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Date of Birth</label>
                <input
                  type="text"
                  className="field-input"
                  value={demoDob}
                  placeholder="YYYY-MM-DD"
                  readOnly
                  style={{ background: demoDob ? '#f0fdf4' : '#ffffff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Mathematics Marks</label>
                <input
                  type="text"
                  className="field-input"
                  value={demoMarks}
                  placeholder="0"
                  readOnly
                  style={{ background: demoMarks ? '#f0fdf4' : '#ffffff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <span style={{
                  background: demoExpGained ? '#f0fdf4' : '#f1f5f9',
                  color: demoExpGained ? '#15803d' : '#64748b',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={14} />
                  <span>{demoExpGained ? 'Accuracy: 98.5% (PASSED)' : 'Live Validating...'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Links Card */}
      <div style={{
        marginTop: '32px',
        marginBottom: '40px',
        background: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--icst-charcoal)' }}>
            Share ICST Data Entry Lab with Students & Batches
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Direct link to practice portal for mobile and desktop browser training.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCopyLink}
          >
            {copiedLink ? <Check size={14} color="#15803d" /> : <Copy size={14} />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Portal Link'}</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNativeShare}
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
