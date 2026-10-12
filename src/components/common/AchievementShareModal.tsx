import React, { useState, useEffect, useRef } from 'react';
import { StageValidationSummary, Achievement, StudentIdentity } from '../../types';
import { normalizeAndGenerateRollId, APP_CONFIG } from '../../config/appConfig';
import { UNIFIED_SYSTEM_ACHIEVEMENTS } from '../../services/achievementEngine';
import { 
  loadStudentProgress, 
  saveStudentProgress, 
  loadStudentIdentity, 
  saveStudentIdentity 
} from '../../services/storageService';
import { loadExcelProgress } from '../../services/excelStorageService';
import { loadWindowsProgress } from '../../services/windowsStorageService';
import { 
  getGroupCertificateStatuses, 
  renderFormalA4Certificate, 
  CertificateModuleGroup,
  GroupCertificateInfo 
} from '../../services/formalCertificateService';
import { 
  X, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Smartphone, 
  Image as ImageIcon, 
  Award, 
  Sparkles, 
  FileSpreadsheet, 
  FolderTree, 
  ChevronLeft, 
  CheckCircle2, 
  Lock, 
  Tag,
  User,
  AlertCircle,
  Eye,
  Printer,
  Scroll,
  Maximize2
} from 'lucide-react';

/**
 * Draws a high-contrast, ultra-radiant 3D golden trophy on canvas.
 * Fixes all washed-out/faded emoji issues on HTML5 canvas.
 */
function drawRadiantGoldenTrophy(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  _achGroup: 'practice' | 'excel' | 'windows',
  _badgeLevel: number = 1
) {
  ctx.save();

  // 1. Radiant Ambient Golden Halo (Warm illumination)
  const halo = ctx.createRadialGradient(cx, cy, 10, cx, cy, size * 0.95);
  halo.addColorStop(0, 'rgba(251, 191, 36, 0.75)');
  halo.addColorStop(0.35, 'rgba(245, 158, 11, 0.45)');
  halo.addColorStop(0.7, 'rgba(217, 119, 6, 0.15)');
  halo.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.95, 0, Math.PI * 2);
  ctx.fill();

  // 2. High-Contrast Deep Navy Crest Medallion
  ctx.fillStyle = '#091326';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.62, 0, Math.PI * 2);
  ctx.fill();

  // Outer Gold Beveled Rim (Dual metallic gradient stroke)
  const outerGold = ctx.createLinearGradient(cx - size * 0.6, cy - size * 0.6, cx + size * 0.6, cy + size * 0.6);
  outerGold.addColorStop(0, '#fef9c3');
  outerGold.addColorStop(0.3, '#fde047');
  outerGold.addColorStop(0.7, '#f59e0b');
  outerGold.addColorStop(1, '#d97706');
  ctx.strokeStyle = outerGold;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.62, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Metallic Gold Hairline
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.55, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Golden Laurel Arcs
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  // Left Laurel Arc
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.46, Math.PI * 0.65, Math.PI * 1.35, false);
  ctx.stroke();
  // Right Laurel Arc
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.46, Math.PI * 1.65, Math.PI * 2.35, false);
  ctx.stroke();

  // Laurel Leaf Nodes
  ctx.fillStyle = '#fef08a';
  const leafAngles = [0.8, 1.0, 1.2, 1.8, 2.0, 2.2];
  leafAngles.forEach(ang => {
    const lx = cx + Math.cos(ang * Math.PI) * (size * 0.46);
    const ly = cy + Math.sin(ang * Math.PI) * (size * 0.46);
    ctx.beginPath();
    ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4. Vibrant 3D Golden Trophy
  const handleGold = ctx.createLinearGradient(cx - 40, cy - 20, cx + 40, cy + 20);
  handleGold.addColorStop(0, '#fef9c3');
  handleGold.addColorStop(0.5, '#f59e0b');
  handleGold.addColorStop(1, '#92400e');

  ctx.strokeStyle = handleGold;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';

  // Left Handle
  ctx.beginPath();
  ctx.arc(cx - 24, cy - 8, 16, Math.PI * 0.6, Math.PI * 1.8, false);
  ctx.stroke();

  // Right Handle
  ctx.beginPath();
  ctx.arc(cx + 24, cy - 8, 16, Math.PI * 1.2, Math.PI * 0.4, false);
  ctx.stroke();

  // Trophy Chalice Goblet
  const trophyGold = ctx.createLinearGradient(cx - 30, cy - 28, cx + 30, cy + 28);
  trophyGold.addColorStop(0, '#fffbeb');
  trophyGold.addColorStop(0.2, '#fde047');
  trophyGold.addColorStop(0.65, '#f59e0b');
  trophyGold.addColorStop(1, '#b45309');

  ctx.fillStyle = trophyGold;
  ctx.beginPath();
  ctx.moveTo(cx - 26, cy - 24);
  ctx.lineTo(cx + 26, cy - 24);
  ctx.bezierCurveTo(cx + 26, cy + 10, cx + 18, cy + 22, cx, cy + 24);
  ctx.bezierCurveTo(cx - 18, cy + 22, cx - 26, cy + 10, cx - 26, cy - 24);
  ctx.closePath();
  ctx.fill();

  // Chalice Lip / Rim (Shining Gold Ellipse)
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 24, 26, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cup Rim highlight shine
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx - 8, cy - 24, 8, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stem / Pillar
  const stemGold = ctx.createLinearGradient(cx - 6, cy + 24, cx + 6, cy + 36);
  stemGold.addColorStop(0, '#f59e0b');
  stemGold.addColorStop(0.5, '#fde047');
  stemGold.addColorStop(1, '#b45309');
  ctx.fillStyle = stemGold;
  ctx.fillRect(cx - 5.5, cy + 24, 11, 12);

  // Pedestal Base Tier 1
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.roundRect(cx - 18, cy + 35, 36, 6, 2);
  ctx.fill();

  // Pedestal Base Tier 2 (Bottom Plinth)
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.roundRect(cx - 28, cy + 41, 56, 9, 2);
  ctx.fill();

  // Highlight line on bottom plinth
  ctx.fillStyle = '#fef9c3';
  ctx.fillRect(cx - 25, cy + 41, 50, 2);

  // 5. Embossed Center Star / Emblem on Cup
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  const starRadiusOuter = 8;
  const starRadiusInner = 4;
  const starY = cy - 2;
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? starRadiusOuter : starRadiusInner;
    const sx = cx + Math.cos(angle) * r;
    const sy = starY + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
  ctx.fill();

  // Star gold aura
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 6. Diamond Sparkles (4-Point Star Glints)
  function drawDiamondGlint(gx: number, gy: number, r: number) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(gx, gy - r);
    ctx.quadraticCurveTo(gx, gy, gx + r, gy);
    ctx.quadraticCurveTo(gx, gy, gx, gy + r);
    ctx.quadraticCurveTo(gx, gy, gx - r, gy);
    ctx.quadraticCurveTo(gx, gy, gx, gy - r);
    ctx.fill();

    ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
    ctx.beginPath();
    ctx.arc(gx, gy, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawDiamondGlint(cx + 42, cy - 32, 8);
  drawDiamondGlint(cx - 40, cy - 28, 7);
  drawDiamondGlint(cx + 46, cy + 20, 6);
  drawDiamondGlint(cx - 44, cy + 22, 6);

  ctx.restore();
}

interface AchievementShareModalProps {
  summary?: StageValidationSummary;
  achievement?: Achievement;
  onClose: () => void;
  initialMode?: 'select' | 'share';
}

export const AchievementShareModal: React.FC<AchievementShareModalProps> = ({
  summary: propSummary,
  achievement: propAchievement,
  onClose,
  initialMode
}) => {
  // Load Unlocked Achievements and group statuses
  const [studentProgress] = useState(() => loadStudentProgress());
  const [excelProgress] = useState(() => loadExcelProgress());
  const [windowsProgress] = useState(() => loadWindowsProgress());
  const groupStatuses = getGroupCertificateStatuses();

  // Set of all unlocked IDs
  const unlockedIds = new Set<string>([
    ...(studentProgress.unlockedAchievements || []),
    ...(excelProgress.unlockedAchievements || []),
    ...(windowsProgress.unlockedAchievements || [])
  ]);

  // Default selected achievement
  const defaultAch = propAchievement || UNIFIED_SYSTEM_ACHIEVEMENTS.find(a => unlockedIds.has(a.id)) || UNIFIED_SYSTEM_ACHIEVEMENTS[0];
  const [selectedAch, setSelectedAch] = useState<Achievement>(defaultAch);

  // Tab & Step modes
  const [categoryTab, setCategoryTab] = useState<'single' | 'diplomas'>('single');
  const [selectedGroupModule, setSelectedGroupModule] = useState<CertificateModuleGroup>('practice');

  const [currentStep, setCurrentStep] = useState<'select' | 'display'>(
    initialMode ? (initialMode === 'select' ? 'select' : 'display') : (propAchievement ? 'display' : 'select')
  );
  const [displayType, setDisplayType] = useState<'single' | 'a4Diploma'>('single');

  const [activeGroupFilter, setActiveGroupFilter] = useState<'all' | 'practice' | 'excel' | 'windows'>('all');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '4:5'>('9:16');
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Student Identity state (Mandatory for Achievements)
  const initialIdent = studentProgress.studentIdentity || propSummary?.studentIdentity || loadStudentIdentity();
  const [studentIdentity, setStudentIdentity] = useState<StudentIdentity | null>(initialIdent);
  const [isEditingName, setIsEditingName] = useState<boolean>(!initialIdent || !initialIdent.name?.trim());
  const [inputName, setInputName] = useState(initialIdent?.name || '');
  const [inputRoll, setInputRoll] = useState(initialIdent?.rawRoll || '001');
  const [nameError, setNameError] = useState<string | null>(null);

  const studentName = studentIdentity?.name?.trim() || 'Trainee Operator';
  const rollId = studentIdentity?.generatedRollId || 'ICST-2026-0001';

  // Inline Identity Save Handler
  const handleSaveInlineIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) {
      setNameError('Please enter your full legal name');
      return;
    }
    const norm = normalizeAndGenerateRollId(inputRoll);
    if (!norm) {
      setNameError('Roll must be 3 numeric digits (000–999)');
      return;
    }

    const newIdentity: StudentIdentity = {
      name: trimmed,
      rawRoll: norm.rawRoll,
      generatedRollId: norm.generatedRollId
    };

    setStudentIdentity(newIdentity);
    saveStudentIdentity(newIdentity);
    const currProg = loadStudentProgress();
    saveStudentProgress({
      ...currProg,
      studentIdentity: newIdentity
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('icst_student_identity_updated', { detail: newIdentity }));
    }

    setIsEditingName(false);
    setNameError(null);
  };

  // Derived achievement values
  const achGroup = selectedAch.group || (selectedAch.id.startsWith('excel') ? 'excel' : selectedAch.id.startsWith('win') ? 'windows' : 'practice');
  const achievementTitle = selectedAch.title;
  const achievementDesc = selectedAch.description;

  // Filtered achievements for Step 1 chooser
  const filteredAchievements = UNIFIED_SYSTEM_ACHIEVEMENTS.filter(a => {
    if (activeGroupFilter === 'all') return true;
    return a.group === activeGroupFilter;
  });

  // Render Certificate onto Canvas (Single Card OR Formal A4 Diploma)
  useEffect(() => {
    if (currentStep !== 'display' || isEditingName) return;

    setIsRendering(true);
    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;

    if (displayType === 'a4Diploma') {
      // Formal A4 Institutional Diploma (2480 x 3508 / 1240 x 1754)
      const currentIdent: StudentIdentity = {
        name: studentName,
        rawRoll: studentIdentity?.rawRoll || '001',
        generatedRollId: rollId
      };
      const grpInfo = groupStatuses[selectedGroupModule];
      renderFormalA4Certificate(canvas, selectedGroupModule, currentIdent, {
        isSample: !grpInfo.isUnlocked,
        scale: 1
      }).then(dataUrl => {
        setPreviewDataUrl(dataUrl);
        setIsRendering(false);
      });
      return;
    }

    // Single Achievement Card (9:16 or 4:5)
    const width = 1080;
    const height = aspectRatio === '9:16' ? 1920 : 1350;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Group-Specific Color Palettes
    let topColor = '#060d19';
    let midColor = '#0f1d38';
    let bottomColor = '#060a12';
    let accentGlow = 'rgba(56, 189, 248, 0.3)';
    let primaryAccent = '#38bdf8';
    let goldColor = '#fbbf24';
    let divisionTag = 'FOUNDATION DATA ENTRY & MARKSHEET DIVISION';
    let metricTitle = 'VERIFIED ACCURACY';
    let metricValue = '100%';
    let expValue = `+${selectedAch.badgeLevel * 50} EXP`;

    if (achGroup === 'excel') {
      topColor = '#031c11';
      midColor = '#064e3b';
      bottomColor = '#02120b';
      accentGlow = 'rgba(16, 185, 129, 0.35)';
      primaryAccent = '#34d399';
      goldColor = '#fde047';
      divisionTag = 'OFFICIAL EXCEL 365 MASS DATA DIVISION';
      metricTitle = 'LEDGER FIDELITY';
      metricValue = '100% PASS';
    } else if (achGroup === 'windows') {
      topColor = '#0a192f';
      midColor = '#1e3a8a';
      bottomColor = '#060d1a';
      accentGlow = 'rgba(2, 132, 199, 0.35)';
      primaryAccent = '#60a5fa';
      goldColor = '#38bdf8';
      divisionTag = 'WINDOWS 11 DESKTOP ARCHITECTURE DIVISION';
      metricTitle = 'DIRECTORY AUDIT';
      metricValue = 'VERIFIED';
    }

    // 2. Draw Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, topColor);
    bgGradient.addColorStop(0.35, midColor);
    bgGradient.addColorStop(0.75, topColor);
    bgGradient.addColorStop(1, bottomColor);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 3. Central Ambient Radial Glow
    const radialGlow = ctx.createRadialGradient(width / 2, height * 0.22, 10, width / 2, height * 0.22, 420);
    radialGlow.addColorStop(0, accentGlow);
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.22, 420, 0, Math.PI * 2);
    ctx.fill();

    // 4. Subtle Modern Grid Pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 5. Top Header Badge Pill with App Logo
    const badgeY = height * 0.045;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = primaryAccent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(width / 2 - 320, badgeY, 640, 52, 26);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = primaryAccent;
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(divisionTag, width / 2, badgeY + 34);

    // 6. Draw Institute Original Logo
    const logoImg = new Image();
    logoImg.src = '/logo.png';
    logoImg.onload = () => {
      const logoSize = aspectRatio === '9:16' ? 210 : 160;
      const logoY = height * 0.098;

      // Glow circle behind logo
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.arc(width / 2, logoY + logoSize / 2, logoSize / 2 + 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.drawImage(logoImg, width / 2 - logoSize / 2, logoY, logoSize, logoSize);

      // Institute Name & Full Branding
      const instY = logoY + logoSize + 38;
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 24px Inter, sans-serif';
      ctx.fillText(APP_CONFIG.INSTITUTE_NAME.toUpperCase(), width / 2, instY);

      ctx.fillStyle = primaryAccent;
      ctx.font = '700 19px Inter, sans-serif';
      ctx.fillText('ICST - CHOWBERIA • OPERATIONAL EXCELLENCE', width / 2, instY + 28);

      // 7. Main Central Honor Panel
      const boxY = instY + 50;
      const boxHeight = aspectRatio === '9:16' ? 860 : 600;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(80, boxY, width - 160, boxHeight, 32);
      ctx.fill();
      ctx.stroke();

      // Radiant High-Contrast 3D Golden Trophy
      const trophyCenterY = boxY + 75;
      drawRadiantGoldenTrophy(ctx, width / 2, trophyCenterY, 130, achGroup, selectedAch.badgeLevel);

      // Student Name & Roll ID
      const nameY = trophyCenterY + 80;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 20px Inter, sans-serif';
      ctx.fillText('STUDENT OPERATOR', width / 2, nameY);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 48px Inter, sans-serif';
      ctx.fillText(studentName, width / 2, nameY + 56);

      // Trainee Roll ID Pill
      const pillY = nameY + 82;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = primaryAccent;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 200, pillY, 400, 48, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = primaryAccent;
      ctx.font = 'bold 24px "JetBrains Mono", monospace';
      ctx.fillText(rollId, width / 2, pillY + 33);

      // Achievement Title
      const achY = pillY + 95;
      ctx.fillStyle = goldColor;
      ctx.font = '800 38px Inter, sans-serif';
      ctx.fillText(achievementTitle, width / 2, achY);

      // Table Description Text
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 20px Inter, sans-serif';
      const descLines = wrapText(ctx, achievementDesc, width - 240);
      descLines.slice(0, 3).forEach((line, idx) => {
        ctx.fillText(line, width / 2, achY + 40 + idx * 30);
      });

      // 8. Metric Cards
      const metricY = achY + (aspectRatio === '9:16' ? 150 : 110);
      const cardWidth = 380;
      const cardHeight = aspectRatio === '9:16' ? 130 : 100;

      // Accuracy Card
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.beginPath();
      ctx.roundRect(130, metricY, cardWidth, cardHeight, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = '700 18px Inter, sans-serif';
      ctx.fillText(metricTitle, 130 + cardWidth / 2, metricY + 34);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 42px "JetBrains Mono", monospace';
      ctx.fillText(metricValue, 130 + cardWidth / 2, metricY + (aspectRatio === '9:16' ? 92 : 80));

      // EXP Card
      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.beginPath();
      ctx.roundRect(width - 130 - cardWidth, metricY, cardWidth, cardHeight, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = '700 18px Inter, sans-serif';
      ctx.fillText('EXPERIENCE EARNED', width - 130 - cardWidth / 2, metricY + 34);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '800 42px "JetBrains Mono", monospace';
      ctx.fillText(expValue, width - 130 - cardWidth / 2, metricY + (aspectRatio === '9:16' ? 92 : 80));

      // 9. Bottom Footer with App Logo watermark & Social tag
      const appLogo = new Image();
      appLogo.src = '/logo-icst.png';
      appLogo.onload = () => {
        const appLogoSize = 46;
        const footerY = height - 75;

        ctx.drawImage(appLogo, width / 2 - appLogoSize / 2, footerY - 55, appLogoSize, appLogoSize);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 18px Inter, sans-serif';
        ctx.fillText('VERIFIED OPERATOR CREDENTIAL • @icstconnect • ICST CHOWBERIA', width / 2, footerY);

        ctx.fillStyle = '#64748b';
        ctx.font = '500 15px "JetBrains Mono", monospace';
        ctx.fillText('https://github.com/icstconnect • #ICSTChowberia', width / 2, footerY + 28);

        const dataUrl = canvas.toDataURL('image/png');
        setPreviewDataUrl(dataUrl);
        setIsRendering(false);
      };
      appLogo.onerror = () => {
        const dataUrl = canvas.toDataURL('image/png');
        setPreviewDataUrl(dataUrl);
        setIsRendering(false);
      };
    };
  }, [currentStep, displayType, selectedGroupModule, aspectRatio, selectedAch, studentName, rollId, achGroup]);

  // Helper function to wrap text nicely on canvas
  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

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
    const filename = displayType === 'a4Diploma'
      ? `ICST-Formal-Diploma-${selectedGroupModule.toUpperCase()}-${rollId}.png`
      : `ICST-Achievement-${selectedAch.id}-${rollId}.png`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setCopiedStatus('Certificate Downloaded (High-Resolution)!');
    setTimeout(() => setCopiedStatus(null), 3500);
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
        setCopiedStatus('Certificate copied to clipboard!');
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  // Print Certificate Handler
  const handlePrint = () => {
    if (!previewDataUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>ICST Official Certificate - ${studentName}</title>
          <style>
            body { margin: 0; display: flex; align-items: center; justify-content: center; background: #fff; }
            img { width: 100%; max-width: 900px; height: auto; display: block; }
            @media print {
              body { margin: 0; }
              img { width: 100%; height: 100%; object-fit: contain; }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <img src="${previewDataUrl}" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // WhatsApp Native Share or Fallback
  const handleWhatsApp = async () => {
    const isA4 = displayType === 'a4Diploma';
    const grpInfo = groupStatuses[selectedGroupModule];
    const shareText = isA4
      ? `*ICST FORMAL INSTITUTIONAL DIPLOMA*\n\n` +
        `🎓 *Student:* ${studentName}\n` +
        `🆔 *Trainee Roll ID:* ${rollId}\n` +
        `📜 *Module:* ${grpInfo.formalTitle}\n` +
        `🏛️ *Institution:* Institute of Computer Science and Technology Chowberia\n` +
        `✍️ *Signed by:* Academic Head & Chief Controller of Examinations\n\n` +
        `Verified Credentials: https://github.com/icstconnect\n` +
        `#ICSTChowberia @icstconnect`
      : `*ICST DATA ENTRY LAB — OFFICIAL ACHIEVEMENT*\n\n` +
        `👤 *Student:* ${studentName}\n` +
        `🆔 *Trainee Roll:* ${rollId}\n` +
        `🏆 *Achievement:* ${selectedAch.title}\n` +
        `📋 *Division:* ${selectedAch.groupTitle || 'ICST Training Lab'}\n` +
        `📝 *Details:* ${selectedAch.description}\n\n` +
        `Institute of Computer Science and Technology Chowberia\n` +
        `GitHub: https://github.com/icstconnect\n` +
        `#ICSTChowberia @icstconnect`;

    try {
      const blob = await getCanvasBlob();
      if (blob && navigator.share && navigator.canShare) {
        const filename = isA4 ? `ICST-Diploma-${selectedGroupModule}.png` : `ICST-Achievement-${selectedAch.id}.png`;
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: isA4 ? `ICST Formal Diploma - ${studentName}` : `ICST Achievement - ${studentName}`,
            text: shareText
          });
          return;
        }
      }
    } catch {
      // User cancelled
    }

    handleDownload();
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // Instagram Story Card Share
  const handleInstagram = async () => {
    const igText = `Official Technical Certificate from ICST Chowberia! Trainee: ${studentName} (${rollId}) • #ICSTChowberia @icstconnect`;

    try {
      const blob = await getCanvasBlob();
      if (blob && navigator.share && navigator.canShare) {
        const file = new File([blob], `ICST-Certificate-${rollId}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `ICST Certificate - ${studentName}`,
            text: igText
          });
          return;
        }
      }
    } catch {
      // User cancelled
    }

    handleDownload();
    setCopiedStatus('Certificate Downloaded! Ready to post on Instagram Story • Tag @icstconnect!');
    setTimeout(() => setCopiedStatus(null), 5000);
  };

  // Switch to viewing/sharing single achievement
  const handleSelectSingleAchievement = (ach: Achievement) => {
    setSelectedAch(ach);
    setDisplayType('single');
    setCurrentStep('display');
  };

  // Switch to viewing/sharing formal A4 diploma
  const handleSelectGroupDiploma = (grp: CertificateModuleGroup) => {
    setSelectedGroupModule(grp);
    setDisplayType('a4Diploma');
    setCurrentStep('display');
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1250 }} onClick={onClose}>
      <div 
        className="modal-card" 
        style={{ 
          maxWidth: currentStep === 'select' ? '920px' : '1080px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0,
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          background: '#ffffff'
        }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div style={{
          background: 'linear-gradient(135deg, #091326, #112240)',
          color: '#ffffff',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
            }}>
              {displayType === 'a4Diploma' && currentStep === 'display' ? '📜' : '🏆'}
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                {currentStep === 'select'
                  ? 'Official Honors & Formal A4 Diplomas'
                  : (displayType === 'a4Diploma' ? 'Formal Institutional A4 Diploma' : 'Verified Achievement Certificate')}
              </h3>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                Institute of Computer Science and Technology Chowberia • Verification Portal
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentStep === 'display' && (
              <button
                type="button"
                onClick={() => setCurrentStep('select')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '11px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <ChevronLeft size={13} />
                <span>Choose Another Honor</span>
              </button>
            )}
            <button 
              type="button" 
              onClick={onClose} 
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
              title="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* MANDATORY STUDENT NAME PROMPT */}
        {isEditingName ? (
          <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
            <div style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '14px',
              padding: '18px 20px',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start'
            }}>
              <AlertCircle size={24} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#92400e' }}>
                  Student Full Name Required for Verified Certifications
                </div>
                <div style={{ fontSize: '13px', color: '#b45309', marginTop: '4px', lineHeight: 1.5 }}>
                  Official ICST certificates and A4 diplomas require verified student credentials. This official name and trainee roll number will be automatically applied across all your practice sessions, Excel ledgers, and Windows labs.
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveInlineIdentity} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '460px', margin: '0 auto', width: '100%' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                  Student Full Legal Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="e.g. Sourav Ghosh"
                    value={inputName}
                    onChange={(e) => {
                      setInputName(e.target.value);
                      setNameError(null);
                    }}
                    style={{ paddingLeft: '38px', height: '42px', fontSize: '14px' }}
                    autoFocus
                    required
                  />
                  <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                  Trainee Roll Number (3 Digits: 000–999) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  maxLength={3}
                  className="field-input"
                  placeholder="e.g. 042"
                  value={inputRoll}
                  onChange={(e) => {
                    setInputRoll(e.target.value);
                    setNameError(null);
                  }}
                  style={{ height: '42px', fontSize: '14px', fontFamily: 'monospace' }}
                  required
                />
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Official Generated Trainee ID: <strong style={{ color: 'var(--icst-blue-dark)' }}>{normalizeAndGenerateRollId(inputRoll)?.generatedRollId || 'NYSDB0140-0042'}</strong>
                </div>
              </div>

              {nameError && (
                <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 700 }}>
                  {nameError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px', fontWeight: 800, fontSize: '13px' }}
                >
                  Save & Certify Achievement
                </button>
                {studentIdentity?.name && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsEditingName(false)}
                    style={{ padding: '12px 20px', fontSize: '13px' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* STEP 1: CHOOSER VIEW (SINGLE HONORS VS FORMAL A4 DIPLOMAS) */}
            {currentStep === 'select' && (
              <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
                {/* Primary Category Switcher */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  background: '#f1f5f9',
                  padding: '5px',
                  borderRadius: '12px',
                  alignSelf: 'flex-start'
                }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${categoryTab === 'single' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setCategoryTab('single')}
                    style={{ fontSize: '12px', padding: '6px 14px', fontWeight: 700 }}
                  >
                    <Award size={14} />
                    <span>🏆 Individual Honors ({UNIFIED_SYSTEM_ACHIEVEMENTS.length})</span>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${categoryTab === 'diplomas' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setCategoryTab('diplomas')}
                    style={{ fontSize: '12px', padding: '6px 14px', fontWeight: 700 }}
                  >
                    <Scroll size={14} />
                    <span>📜 Formal A4 Group Diplomas (3)</span>
                  </button>
                </div>

                {/* CATEGORY A: SINGLE ACHIEVEMENTS */}
                {categoryTab === 'single' && (
                  <>
                    {/* Sub-group Filter Tabs */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${activeGroupFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveGroupFilter('all')}
                      >
                        <span>All Modules ({UNIFIED_SYSTEM_ACHIEVEMENTS.length})</span>
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${activeGroupFilter === 'practice' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveGroupFilter('practice')}
                      >
                        <span>📝 Foundation & Marksheets</span>
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${activeGroupFilter === 'excel' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveGroupFilter('excel')}
                      >
                        <span>📊 Excel 365 Mass Data</span>
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${activeGroupFilter === 'windows' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveGroupFilter('windows')}
                      >
                        <span>🗂️ Windows 11 Organization</span>
                      </button>
                    </div>

                    {/* Achievement Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                      gap: '14px'
                    }}>
                      {filteredAchievements.map(ach => {
                        const isItemUnlocked = unlockedIds.has(ach.id);
                        const isPractice = ach.group === 'practice';
                        const isExcel = ach.group === 'excel';
                        const groupBorderColor = isPractice ? '#2563eb' : isExcel ? '#059669' : '#0284c7';
                        const groupBg = isPractice ? '#f0f7ff' : isExcel ? '#f0fdf4' : '#f0f9ff';

                        return (
                          <div
                            key={ach.id}
                            style={{
                              border: `1.5px solid ${groupBorderColor}30`,
                              borderRadius: '14px',
                              padding: '16px',
                              background: groupBg,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                              position: 'relative',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                              transition: 'transform 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: isPractice 
                                  ? 'linear-gradient(135deg, #1e40af, #3b82f6)' 
                                  : isExcel 
                                    ? 'linear-gradient(135deg, #065f46, #10b981)' 
                                    : 'linear-gradient(135deg, #0369a1, #0284c7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                color: '#ffffff'
                              }}>
                                {isPractice ? '🏆' : isExcel ? '📊' : '🗂️'}
                              </div>

                              <span style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: '10px',
                                background: isItemUnlocked ? '#dcfce7' : '#e2e8f0',
                                color: isItemUnlocked ? '#15803d' : '#475569'
                              }}>
                                {isItemUnlocked ? '✓ UNLOCKED' : 'SAMPLE'}
                              </span>
                            </div>

                            <div>
                              <div style={{ fontSize: '11px', color: groupBorderColor, fontWeight: 800, textTransform: 'uppercase' }}>
                                {ach.groupTitle}
                              </div>
                              <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '2px 0 4px 0', color: 'var(--text-primary)' }}>
                                {ach.title}
                              </h4>
                              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                                {ach.description}
                              </p>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleSelectSingleAchievement(ach)}
                                className="btn btn-secondary btn-sm"
                                style={{ flex: 1, fontSize: '11px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                              >
                                <Eye size={12} />
                                <span>View Achievement</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSelectSingleAchievement(ach)}
                                style={{
                                  flex: 1,
                                  background: groupBorderColor,
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '6px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Share2 size={12} />
                                <span>Share Achievement</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* CATEGORY B: FORMAL A4 GROUP DIPLOMAS */}
                {categoryTab === 'diplomas' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #091326, #112240)',
                      color: '#ffffff',
                      padding: '20px 24px',
                      borderRadius: '16px',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>
                        <Scroll size={16} />
                        <span>Official Institutional Credentials</span>
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '6px 0 8px 0', color: '#ffffff' }}>
                        Digitally Signed Formal A4 Portrait Diplomas
                      </h3>
                      <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                        Completing all stages or levels within a curriculum group unlocks an authentic, print-ready A4 Portrait Certificate digitally signed by the Academic Head and Chief Controller of Examinations with the official Institute Seal.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      {(['practice', 'excel', 'windows'] as CertificateModuleGroup[]).map(grp => {
                        const grpInfo = groupStatuses[grp];
                        const isUnlocked = grpInfo.isUnlocked;

                        return (
                          <div
                            key={grp}
                            style={{
                              background: '#ffffff',
                              border: isUnlocked ? '2px solid #c59b27' : '1px solid var(--border-light, #e2e8f0)',
                              borderRadius: '16px',
                              padding: '20px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px',
                              boxShadow: isUnlocked ? '0 8px 20px rgba(197, 155, 39, 0.15)' : 'var(--shadow-sm)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: isUnlocked ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : '#f1f5f9',
                                border: isUnlocked ? '1.5px solid #c59b27' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '22px'
                              }}>
                                📜
                              </div>

                              <span style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                padding: '3px 10px',
                                borderRadius: '12px',
                                background: isUnlocked ? '#dcfce7' : '#fef3c7',
                                color: isUnlocked ? '#15803d' : '#b45309'
                              }}>
                                {isUnlocked ? '✓ UNLOCKED & SIGNED' : 'IN PROGRESS'}
                              </span>
                            </div>

                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
                                A4 Portrait Formal Diploma
                              </div>
                              <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '2px 0 6px 0', color: 'var(--text-primary)' }}>
                                {grpInfo.title}
                              </h4>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                                {grpInfo.formalTitle}
                              </p>
                            </div>

                            {/* Progress Bar */}
                            <div style={{ marginTop: 'auto' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Module Progress</span>
                                <span style={{ color: isUnlocked ? '#15803d' : '#0284c7' }}>
                                  {grpInfo.completedUnits} / {grpInfo.totalUnits} Units ({grpInfo.completionPercentage}%)
                                </span>
                              </div>
                              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{
                                  width: `${grpInfo.completionPercentage}%`,
                                  height: '100%',
                                  background: isUnlocked ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #38bdf8, #0284c7)',
                                  borderRadius: '3px',
                                  transition: 'width 0.3s ease'
                                }} />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleSelectGroupDiploma(grp)}
                                style={{ flex: 1, fontSize: '11px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                              >
                                <Eye size={13} />
                                <span>{isUnlocked ? 'View Full Certificate' : 'Preview Sample'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSelectGroupDiploma(grp)}
                                style={{
                                  flex: 1,
                                  background: isUnlocked ? 'linear-gradient(135deg, #c59b27, #b45309)' : '#0f172a',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '8px',
                                  padding: '8px',
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Share2 size={13} />
                                <span>Share Achievement</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: FULL CERTIFICATE VIEWER & SOCIAL SHARING (SPLIT-VIEW WITH ZERO CROPPING) */}
            {currentStep === 'display' && (
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                flex: 1,
                overflowY: 'auto',
                background: '#09101d'
              }}>
                {/* Left Column: Full-Height Certificate Card Preview (100% visible, never cropped) */}
                <div style={{
                  flex: '1 1 420px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  background: 'radial-gradient(circle at center, #111e38 0%, #060b14 100%)',
                  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative'
                }}>
                  {previewDataUrl ? (
                    <img 
                      src={previewDataUrl} 
                      alt="Certificate Preview" 
                      style={{
                        maxHeight: '74vh',
                        maxWidth: '100%',
                        height: 'auto',
                        width: 'auto',
                        borderRadius: '12px',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
                        border: '1.5px solid rgba(255, 255, 255, 0.15)',
                        display: 'block'
                      }} 
                    />
                  ) : (
                    <div style={{ padding: '60px', color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>
                      <div style={{ width: '32px', height: '32px', border: '3px solid #38bdf8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.75s linear infinite', margin: '0 auto 12px' }} />
                      Generating high-resolution official certificate...
                    </div>
                  )}
                </div>

                {/* Right Column: Controls, Honoree Details, Social Sharing & Printing */}
                <div style={{
                  flex: '1 1 360px',
                  padding: '24px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  background: '#0f172a',
                  color: '#ffffff'
                }}>
                  {/* Certificate Title & Status */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: displayType === 'a4Diploma' ? '#fef3c7' : '#dcfce7',
                        color: displayType === 'a4Diploma' ? '#92400e' : '#15803d'
                      }}>
                        {displayType === 'a4Diploma' ? 'FORMAL A4 DIPLOMA' : 'VERIFIED SINGLE HONOR'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Digitally Verified Credentials
                      </span>
                    </div>

                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                      {displayType === 'a4Diploma' ? groupStatuses[selectedGroupModule].formalTitle : selectedAch.title}
                    </h3>
                  </div>

                  {/* Student Honoree Banner with Instant Inline Edit button */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} color="#ffffff" />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                          {studentName}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                          Roll ID: {rollId}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setInputName(studentName);
                        setInputRoll(studentIdentity?.rawRoll || '001');
                        setIsEditingName(true);
                      }}
                      style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}
                    >
                      Edit Name
                    </button>
                  </div>

                  {/* Single Achievement Format Switcher (Visible only for single achievement cards) */}
                  {displayType === 'single' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>
                        Export Card Format:
                      </span>
                      <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.06)', padding: '3px', borderRadius: '8px' }}>
                        <button
                          type="button"
                          className={`btn btn-sm ${aspectRatio === '9:16' ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => setAspectRatio('9:16')}
                          style={{ fontSize: '11px', padding: '4px 10px' }}
                        >
                          <Smartphone size={12} />
                          <span>Story (9:16)</span>
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${aspectRatio === '4:5' ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => setAspectRatio('4:5')}
                          style={{ fontSize: '11px', padding: '4px 10px' }}
                        >
                          <ImageIcon size={12} />
                          <span>Post (4:5)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notification Status Banner */}
                  {copiedStatus && (
                    <div style={{
                      background: '#064e3b',
                      color: '#6ee7b7',
                      border: '1px solid #059669',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Check size={16} />
                      <span>{copiedStatus}</span>
                    </div>
                  )}

                  {/* Action Controls: Share on WhatsApp, Instagram Story, Download PNG, Print */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleWhatsApp}
                        style={{
                          background: '#25D366',
                          color: '#ffffff',
                          borderColor: '#1EBE5D',
                          fontWeight: 800,
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '11px'
                        }}
                      >
                        <Share2 size={15} />
                        <span>Share on WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleInstagram}
                        style={{
                          background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                          color: '#ffffff',
                          borderColor: '#cc2366',
                          fontWeight: 800,
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '11px'
                        }}
                      >
                        <Smartphone size={15} />
                        <span>Instagram Story</span>
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleDownload}
                        style={{
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '11px',
                          background: 'rgba(255,255,255,0.08)',
                          color: '#ffffff',
                          borderColor: 'rgba(255,255,255,0.18)'
                        }}
                      >
                        <Download size={15} />
                        <span>Download Certificate</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCopyImage}
                        style={{
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '11px',
                          background: 'rgba(255,255,255,0.08)',
                          color: '#ffffff',
                          borderColor: 'rgba(255,255,255,0.18)'
                        }}
                      >
                        <Copy size={15} />
                        <span>Copy Image</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handlePrint}
                      style={{
                        width: '100%',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#94a3b8',
                        borderColor: 'rgba(255,255,255,0.12)'
                      }}
                    >
                      <Printer size={15} />
                      <span>Print Certificate (Physical Paper / PDF)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modal Footer */}
        <div style={{
          padding: '12px 24px',
          background: 'var(--bg-card-header, #f8fafc)',
          borderTop: '1px solid var(--border-light, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Official Institutional Credential • Institute of Computer Science and Technology Chowberia • Tag <strong>@icstconnect</strong>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStep === 'display' && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentStep('select')}
              >
                ← Back to Selector
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
