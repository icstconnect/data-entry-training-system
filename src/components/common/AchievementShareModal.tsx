import React, { useState, useEffect, useRef } from 'react';
import { StageValidationSummary, Achievement } from '../../types';
import { APP_CONFIG } from '../../config/appConfig';
import { 
  X, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Smartphone, 
  Image as ImageIcon,
  Award,
  Sparkles
} from 'lucide-react';

interface AchievementShareModalProps {
  summary: StageValidationSummary;
  achievement?: Achievement;
  onClose: () => void;
}

export const AchievementShareModal: React.FC<AchievementShareModalProps> = ({
  summary,
  achievement,
  onClose
}) => {
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '4:5'>('9:16');
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const studentName = summary.studentIdentity?.name || 'Trainee Operator';
  const rollId = summary.studentIdentity?.generatedRollId || 'NYSDB0140-0001';
  const achievementTitle = achievement?.title || 'Data Entry Certified Operator';
  const accuracyText = `${summary.accuracyPercentage}% ACCURACY`;
  const expText = summary.expEarned > 0 ? `+${summary.expEarned} EXP` : '+100 EXP';
  const levelText = achievement?.description 
    ? (achievement.description.length > 55 ? achievement.description.slice(0, 52) + '...' : achievement.description)
    : `LEVEL ${summary.levelNumber} • STAGE ${summary.stageNumber}`;

  // Render High-Quality Card onto Canvas
  useEffect(() => {
    setIsRendering(true);
    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;

    const width = 1080;
    const height = aspectRatio === '9:16' ? 1920 : 1350;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Gradient (Deep Navy Charcoal with Blue Radiance)
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#09101d');
    bgGradient.addColorStop(0.35, '#111d33');
    bgGradient.addColorStop(0.75, '#1e293b');
    bgGradient.addColorStop(1, '#070d18');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle Radial Glow behind logo/header
    const radialGlow = ctx.createRadialGradient(width / 2, height * 0.22, 20, width / 2, height * 0.22, 380);
    radialGlow.addColorStop(0, 'rgba(24, 114, 192, 0.28)');
    radialGlow.addColorStop(1, 'rgba(24, 114, 192, 0)');
    ctx.fillStyle = radialGlow;
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.22, 380, 0, Math.PI * 2);
    ctx.fill();

    // Top Header Badge
    const badgeY = height * 0.06;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(width / 2 - 280, badgeY, 560, 56, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL TRAINING ACHIEVEMENT', width / 2, badgeY + 36);

    // Draw the ORIGINAL unmodified logo asset
    const logoImg = new Image();
    logoImg.src = '/logo.png';
    logoImg.onload = () => {
      const logoSize = aspectRatio === '9:16' ? 240 : 180;
      const logoY = height * 0.11;
      ctx.drawImage(logoImg, width / 2 - logoSize / 2, logoY, logoSize, logoSize);

      // Institute Subtitle
      const instY = logoY + logoSize + 44;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 24px Inter, sans-serif';
      ctx.fillText(APP_CONFIG.INSTITUTE_NAME.toUpperCase(), width / 2, instY);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '800 22px Inter, sans-serif';
      ctx.fillText(APP_CONFIG.INSTITUTE_SHORT, width / 2, instY + 34);

      // Big Title
      const labTitleY = instY + 95;
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 56px Inter, sans-serif';
      ctx.fillText('ICST DATA ENTRY LAB', width / 2, labTitleY);

      // Main Achievement Box
      const boxY = labTitleY + 40;
      const boxHeight = aspectRatio === '9:16' ? 760 : 540;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(90, boxY, width - 180, boxHeight, 32);
      ctx.fill();
      ctx.stroke();

      // Student Name Header
      const nameY = boxY + (aspectRatio === '9:16' ? 90 : 70);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 24px Inter, sans-serif';
      ctx.fillText('STUDENT OPERATOR', width / 2, nameY);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 52px Inter, sans-serif';
      ctx.fillText(studentName, width / 2, nameY + 62);

      // Trainee Identifier Pill
      const pillY = nameY + 96;
      ctx.fillStyle = 'rgba(24, 114, 192, 0.22)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 220, pillY, 440, 56, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.fillText(rollId, width / 2, pillY + 39);

      // Achievement Title
      const achY = pillY + 110;
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.fillText(achievementTitle, width / 2, achY);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 24px Inter, sans-serif';
      ctx.fillText(levelText, width / 2, achY + 40);

      // Two Metric Cards (Accuracy & EXP)
      const metricY = achY + (aspectRatio === '9:16' ? 90 : 60);
      const cardWidth = 380;
      const cardHeight = aspectRatio === '9:16' ? 140 : 110;

      // Accuracy Card
      ctx.fillStyle = 'rgba(22, 163, 74, 0.15)';
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
      ctx.beginPath();
      ctx.roundRect(140, metricY, cardWidth, cardHeight, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#4ade80';
      ctx.font = '600 20px Inter, sans-serif';
      ctx.fillText('VERIFIED ACCURACY', 140 + cardWidth / 2, metricY + 38);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 46px "JetBrains Mono", monospace';
      ctx.fillText(`${summary.accuracyPercentage}%`, 140 + cardWidth / 2, metricY + (aspectRatio === '9:16' ? 100 : 86));

      // EXP Card
      ctx.fillStyle = 'rgba(217, 119, 6, 0.15)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.beginPath();
      ctx.roundRect(width - 140 - cardWidth, metricY, cardWidth, cardHeight, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde68a';
      ctx.font = '600 20px Inter, sans-serif';
      ctx.fillText('EXPERIENCE EARNED', width - 140 - cardWidth / 2, metricY + 38);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '800 46px "JetBrains Mono", monospace';
      ctx.fillText(expText, width - 140 - cardWidth / 2, metricY + (aspectRatio === '9:16' ? 100 : 86));

      // Bottom Footer Verification Note
      const footerY = height - 90;
      ctx.fillStyle = '#64748b';
      ctx.font = '500 20px Inter, sans-serif';
      ctx.fillText('VERIFIED OPERATOR RECORD • INSTITUTE OF COMPUTER SCIENCE & TECHNOLOGY', width / 2, footerY);

      const dataUrl = canvas.toDataURL('image/png');
      setPreviewDataUrl(dataUrl);
      setIsRendering(false);
    };
  }, [aspectRatio, summary, achievementTitle, studentName, rollId]);

  // Convert canvas to Blob
  const getCanvasBlob = async (): Promise<Blob | null> => {
    if (!canvasRef.current) return null;
    return new Promise(resolve => {
      canvasRef.current!.toBlob(blob => resolve(blob), 'image/png');
    });
  };

  // Download Handler
  const handleDownload = () => {
    if (!previewDataUrl) return;
    const a = document.createElement('a');
    a.href = previewDataUrl;
    a.download = `ICST-Achievement-${rollId}-${summary.levelNumber}-${summary.stageNumber}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setCopiedStatus('Image downloaded!');
    setTimeout(() => setCopiedStatus(null), 2500);
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    try {
      const blob = await getCanvasBlob();
      if (!blob) return;
      if (navigator.clipboard && (window as any).ClipboardItem) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({ 'image/png': blob })
        ]);
        setCopiedStatus('Image copied to clipboard!');
      } else {
        handleDownload();
      }
    } catch (e) {
      handleDownload();
    }
    setTimeout(() => setCopiedStatus(null), 2500);
  };

  // WhatsApp Native Share or Fallback
  const handleWhatsApp = async () => {
    const shareText = `*ICST DATA ENTRY LAB — ACHIEVEMENT UNLOCKED*\n\nStudent: ${studentName}\nTrainee Roll: ${rollId}\nAchievement: ${achievementTitle}\nLevel: Level ${summary.levelNumber}\nAccuracy: ${summary.accuracyPercentage}%\nEXP: ${expText}\n\nInstitute of Computer Science and Technology Chowberia\nOfficial Portal: ${APP_CONFIG.PUBLIC_APP_URL}`;

    try {
      const blob = await getCanvasBlob();
      if (blob && navigator.share && navigator.canShare) {
        const file = new File([blob], `ICST-Achievement-${rollId}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `ICST Achievement - ${studentName}`,
            text: shareText
          });
          return;
        }
      }
    } catch (e) {
      // User cancelled or unsupported
    }

    // Fallback: Download image and open WhatsApp
    handleDownload();
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // Instagram Native Share or Fallback
  const handleInstagram = async () => {
    try {
      const blob = await getCanvasBlob();
      if (blob && navigator.share && navigator.canShare) {
        const file = new File([blob], `ICST-Achievement-${rollId}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `ICST Achievement - ${studentName}`,
            text: `Data Entry Operator Achievement at ICST Chowberia! #ICSTChowberia #DataEntryLab`
          });
          return;
        }
      }
    } catch (e) {
      // User cancelled
    }

    // Fallback: Download high-res card for manual Instagram upload
    handleDownload();
    alert('Achievement image downloaded! You can now post this directly to your Instagram Story or Post.');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#fbbf24" />
            <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Branded Achievement Share Card</h3>
          </div>
          <button type="button" onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          {/* Aspect Ratio Switcher */}
          <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
            <button
              type="button"
              className={`btn btn-sm ${aspectRatio === '9:16' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setAspectRatio('9:16')}
            >
              <Smartphone size={13} />
              <span>Story (9:16)</span>
            </button>
            <button
              type="button"
              className={`btn btn-sm ${aspectRatio === '4:5' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setAspectRatio('4:5')}
            >
              <ImageIcon size={13} />
              <span>Post (4:5)</span>
            </button>
          </div>

          {/* Generated Card Preview */}
          <div style={{
            width: '100%',
            maxWidth: '360px',
            maxHeight: '440px',
            overflow: 'hidden',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid #cbd5e1',
            background: '#09101d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {previewDataUrl ? (
              <img 
                src={previewDataUrl} 
                alt="Achievement Preview" 
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} 
              />
            ) : (
              <div style={{ padding: '40px', color: '#94a3b8', fontSize: '13px' }}>
                Rendering branded achievement card...
              </div>
            )}
          </div>

          {copiedStatus && (
            <div style={{
              background: '#f0fdf4',
              color: '#15803d',
              border: '1px solid #bbf7d0',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Check size={14} />
              <span>{copiedStatus}</span>
            </div>
          )}

          {/* Social Share Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', width: '100%' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleWhatsApp}
              style={{ background: '#25D366', color: '#ffffff', borderColor: '#1EBE5D' }}
            >
              <Share2 size={15} />
              <span>WHATSAPP</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleInstagram}
              style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: '#ffffff', borderColor: '#cc2366' }}
            >
              <Smartphone size={15} />
              <span>INSTAGRAM</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleDownload}
            >
              <Download size={15} />
              <span>DOWNLOAD IMAGE</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCopyImage}
            >
              <Copy size={15} />
              <span>COPY IMAGE</span>
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
