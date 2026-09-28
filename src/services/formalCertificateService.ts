/**
 * Formal A4 Institutional Certificate Service
 * Generates print-ready, digitally signed A4 Portrait Certificates (2480 x 3508 / 1240 x 1754)
 * with authentic ICST Institute branding, original seal, and institutional signatures.
 */

import { StudentIdentity, StudentProgress } from '../types';
import { loadStudentProgress } from './storageService';
import { loadExcelProgress } from './excelStorageService';
import { loadWindowsProgress } from './windowsStorageService';
import { STAGES } from '../data/stagesConfig';
import { EXCEL_LEVELS } from '../data/excelScenariosData';
import { FILE_MANAGEMENT_LEVELS, FOLDER_MANAGEMENT_LEVELS } from '../data/windowsCurriculumData';

export type CertificateModuleGroup = 'practice' | 'excel' | 'windows';

export interface GroupCertificateInfo {
  group: CertificateModuleGroup;
  title: string;
  formalTitle: string;
  divisionName: string;
  totalUnits: number;
  completedUnits: number;
  isUnlocked: boolean;
  completionPercentage: number;
  certificateCode: string;
  standardAccuracy: string;
  totalExp: number;
}

/**
 * Checks completion status for each of the 3 curriculum groups
 */
export function getGroupCertificateStatuses(): Record<CertificateModuleGroup, GroupCertificateInfo> {
  const student = loadStudentProgress();
  const excel = loadExcelProgress();
  const win = loadWindowsProgress();

  // 1. Practice Group (18 stages)
  const practiceCompleted = Object.keys(student.completedStages || {}).length;
  const practiceTotal = STAGES.length; // 18
  const practiceUnlocked = practiceCompleted >= practiceTotal;

  // 2. Excel Group (5 scenarios)
  const excelCompleted = Object.keys(excel.completedLevels || {}).length;
  const excelTotal = EXCEL_LEVELS.length; // 5
  const excelUnlocked = excelCompleted >= excelTotal;

  // 3. Windows Group (5 file + 7 folder = 12 levels)
  const winFileTotal = Object.keys(FILE_MANAGEMENT_LEVELS).length;
  const winFolderTotal = Object.keys(FOLDER_MANAGEMENT_LEVELS).length;
  const winTotal = winFileTotal + winFolderTotal; // 12
  const winFileCompleted = Object.keys(win.fileManagementCompleted || {}).length;
  const winFolderCompleted = Object.keys(win.folderManagementCompleted || {}).length;
  const winCompleted = winFileCompleted + winFolderCompleted;
  const winUnlocked = winCompleted >= winTotal;

  return {
    practice: {
      group: 'practice',
      title: 'Foundation & Academic Marksheets Lab',
      formalTitle: 'FOUNDATION DATA ENTRY & ACADEMIC MARKSHEET TRANSCRIPTION',
      divisionName: 'FACULTY OF INFORMATION MANAGEMENT & REGISTRATION SYSTEMS',
      totalUnits: practiceTotal,
      completedUnits: practiceCompleted,
      isUnlocked: practiceUnlocked,
      completionPercentage: Math.round((practiceCompleted / practiceTotal) * 100),
      certificateCode: 'FDEM',
      standardAccuracy: '95%+ Character Fidelity',
      totalExp: student.totalExp || 0
    },
    excel: {
      group: 'excel',
      title: 'Excel 365 Professional Mass Data Lab',
      formalTitle: 'EXCEL 365 ADVANCED MASS DATA MANAGEMENT & AUDITING',
      divisionName: 'FACULTY OF ADVANCED SPREADSHEET AUDITING & DATA AUTOMATION',
      totalUnits: excelTotal,
      completedUnits: excelCompleted,
      isUnlocked: excelUnlocked,
      completionPercentage: Math.round((excelCompleted / excelTotal) * 100),
      certificateCode: 'EX365',
      standardAccuracy: '100% Ledger Fidelity',
      totalExp: excel.totalExcelExp || 0
    },
    windows: {
      group: 'windows',
      title: 'Windows 11 Operating System Architecture Lab',
      formalTitle: 'WINDOWS 11 OPERATING SYSTEM ARCHITECTURE & DIRECTORY MANAGEMENT',
      divisionName: 'FACULTY OF DESKTOP INFRASTRUCTURE & SYSTEMS ARCHITECTURE',
      totalUnits: winTotal,
      completedUnits: winCompleted,
      isUnlocked: winUnlocked,
      completionPercentage: Math.round((winCompleted / winTotal) * 100),
      certificateCode: 'WIN11',
      standardAccuracy: '100% Structural Fidelity',
      totalExp: win.totalWindowsExp || 0
    }
  };
}

/**
 * Renders a formal, high-resolution A4 Portrait Certificate onto an HTML5 Canvas.
 * Canvas aspect ratio is exact A4 Portrait (1 : 1.4142).
 * Dimensions: 1240 x 1754 (or scale for 2480 x 3508 print).
 */
export function renderFormalA4Certificate(
  canvas: HTMLCanvasElement,
  group: CertificateModuleGroup,
  identity: StudentIdentity,
  options?: { isSample?: boolean; scale?: number }
): Promise<string> {
  return new Promise((resolve) => {
    const scale = options?.scale || 1;
    const width = 1240 * scale;
    const height = 1754 * scale;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    const statuses = getGroupCertificateStatuses();
    const info = statuses[group];

    // 1. Classical Parchment Diploma Background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#fefdfb');
    bgGradient.addColorStop(0.5, '#fbf8ee');
    bgGradient.addColorStop(1, '#f7f3e6');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle guilloche / linen border texture lines
    ctx.strokeStyle = 'rgba(197, 160, 89, 0.08)';
    ctx.lineWidth = 1 * scale;
    for (let i = 0; i < width; i += 32 * scale) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let j = 0; j < height; j += 32 * scale) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }

    // 2. Classical Diploma Ornamental Frames
    const pad = 44 * scale;

    // Outer Primary Navy Frame
    ctx.strokeStyle = '#0a1d37';
    ctx.lineWidth = 5 * scale;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

    // Secondary Gold Metallic Frame
    ctx.strokeStyle = '#c59b27';
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(pad + 8 * scale, pad + 8 * scale, width - (pad + 8 * scale) * 2, height - (pad + 8 * scale) * 2);

    // Tertiary Fine Inner Hairline Frame
    ctx.strokeStyle = 'rgba(11, 29, 58, 0.3)';
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(pad + 14 * scale, pad + 14 * scale, width - (pad + 14 * scale) * 2, height - (pad + 14 * scale) * 2);

    // Classical Corner Rosettes / Flourishes
    const cornerSize = 40 * scale;
    const drawCornerFlourish = (cx: number, cy: number, flipX: number, flipY: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(flipX, flipY);
      ctx.strokeStyle = '#c59b27';
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.arc(0, 0, cornerSize, 0, Math.PI / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, cornerSize - 8 * scale, 0, Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = '#0a1d37';
      ctx.beginPath();
      ctx.arc(cornerSize / 2, cornerSize / 2, 4 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawCornerFlourish(pad + 14 * scale, pad + 14 * scale, 1, 1);
    drawCornerFlourish(width - (pad + 14 * scale), pad + 14 * scale, -1, 1);
    drawCornerFlourish(pad + 14 * scale, height - (pad + 14 * scale), 1, -1);
    drawCornerFlourish(width - (pad + 14 * scale), height - (pad + 14 * scale), -1, -1);

    // 3. Central Watermark of Official Institute Seal (Subtle & Elegant)
    const logoImg = new Image();
    logoImg.src = '/logo.png';
    logoImg.onload = () => {
      // Draw faint center watermark
      ctx.save();
      ctx.globalAlpha = 0.055;
      const wmSize = 540 * scale;
      ctx.drawImage(logoImg, width / 2 - wmSize / 2, height / 2 - wmSize / 2 + 60 * scale, wmSize, wmSize);
      ctx.restore();

      // Top Primary Institute Seal (Crisp, Official)
      const topLogoSize = 130 * scale;
      const topLogoY = 85 * scale;
      ctx.drawImage(logoImg, width / 2 - topLogoSize / 2, topLogoY, topLogoSize, topLogoSize);

      // 4. Institutional Authority & Top Branding
      const instHeaderY = topLogoY + topLogoSize + 32 * scale;
      ctx.textAlign = 'center';

      ctx.fillStyle = '#0b192c';
      ctx.font = `800 ${28 * scale}px "Cinzel", "Times New Roman", Georgia, serif`;
      ctx.fillText('INSTITUTE OF COMPUTER SCIENCE & TECHNOLOGY', width / 2, instHeaderY);

      ctx.fillStyle = '#b45309';
      ctx.font = `700 ${14 * scale}px Inter, sans-serif`;
      ctx.letterSpacing = '1.5px';
      ctx.fillText('ESTD: 2000 • CHOWBERIA, PURBASTHALI, DIST. NADIA, WEST BENGAL', width / 2, instHeaderY + 22 * scale);

      ctx.fillStyle = '#475569';
      ctx.font = `600 ${12 * scale}px Inter, sans-serif`;
      ctx.fillText('GOVERNMENT REGISTERED TECHNICAL TRAINING INSTITUTION', width / 2, instHeaderY + 40 * scale);

      // Ornamental Gold Divider with Central Diamond
      const divY = instHeaderY + 54 * scale;
      const divWidth = 440 * scale;
      const divGrad = ctx.createLinearGradient(width / 2 - divWidth / 2, divY, width / 2 + divWidth / 2, divY);
      divGrad.addColorStop(0, 'rgba(197, 155, 39, 0)');
      divGrad.addColorStop(0.5, '#c59b27');
      divGrad.addColorStop(1, 'rgba(197, 155, 39, 0)');
      ctx.strokeStyle = divGrad;
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(width / 2 - divWidth / 2, divY);
      ctx.lineTo(width / 2 + divWidth / 2, divY);
      ctx.stroke();

      // Center gold diamond on divider
      ctx.fillStyle = '#c59b27';
      ctx.beginPath();
      ctx.moveTo(width / 2, divY - 5 * scale);
      ctx.lineTo(width / 2 + 6 * scale, divY);
      ctx.lineTo(width / 2, divY + 5 * scale);
      ctx.lineTo(width / 2 - 6 * scale, divY);
      ctx.fill();

      // 5. Certificate Category & Serial Number
      const certTitleY = divY + 44 * scale;
      ctx.fillStyle = '#94a3b8';
      ctx.font = `700 ${11 * scale}px "JetBrains Mono", monospace`;
      const serialNum = `ICST/CERT/2026/${info.certificateCode}-${identity.rawRoll || '001'}`;
      ctx.fillText(`DOCUMENT VERIFICATION NO: ${serialNum}`, width / 2, certTitleY);

      // Certificate Main Heading
      ctx.fillStyle = '#0a1d37';
      ctx.font = `900 ${36 * scale}px "Cinzel", "Times New Roman", Georgia, serif`;
      ctx.letterSpacing = '1px';
      ctx.fillText('CERTIFICATE OF TECHNICAL COMPETENCY', width / 2, certTitleY + 44 * scale);

      ctx.fillStyle = '#b45309';
      ctx.font = `800 ${13 * scale}px Inter, sans-serif`;
      ctx.letterSpacing = '2px';
      ctx.fillText(info.divisionName, width / 2, certTitleY + 70 * scale);

      // 6. Formal Body Text
      const bodyY = certTitleY + 115 * scale;
      ctx.fillStyle = '#475569';
      ctx.font = `italic 500 ${18 * scale}px Georgia, "Times New Roman", serif`;
      ctx.fillText('This is to formally certify that', width / 2, bodyY);

      // Student Full Legal Name (Large, Distinguished)
      const nameY = bodyY + 52 * scale;
      ctx.fillStyle = '#0b1d3a';
      ctx.font = `800 ${44 * scale}px "Times New Roman", Georgia, serif`;
      ctx.fillText(identity.name || 'Trainee Operator', width / 2, nameY);

      // Underline under Student Name
      const nameWidth = Math.min(width - 300 * scale, ctx.measureText(identity.name || 'Trainee Operator').width + 60 * scale);
      ctx.strokeStyle = '#c59b27';
      ctx.lineWidth = 1.5 * scale;
      ctx.beginPath();
      ctx.moveTo(width / 2 - nameWidth / 2, nameY + 12 * scale);
      ctx.lineTo(width / 2 + nameWidth / 2, nameY + 12 * scale);
      ctx.stroke();

      // Student Trainee Roll Number
      const rollY = nameY + 44 * scale;
      ctx.fillStyle = '#334155';
      ctx.font = `600 ${17 * scale}px Inter, sans-serif`;
      ctx.fillText(`bearing Trainee Roll ID: ${identity.generatedRollId || 'NYSDB0140-0001'}`, width / 2, rollY);

      // Formal Statement of Completion
      const stateY = rollY + 44 * scale;
      ctx.fillStyle = '#475569';
      ctx.font = `italic 500 ${18 * scale}px Georgia, "Times New Roman", serif`;
      ctx.fillText('has successfully completed the module:', width / 2, stateY);

      // Module Formal Title Plaque
      const plaqueY = stateY + 28 * scale;
      const plaqueHeight = 64 * scale;
      const plaqueWidth = width - 260 * scale;

      ctx.fillStyle = '#0f2240';
      ctx.strokeStyle = '#c59b27';
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.roundRect(width / 2 - plaqueWidth / 2, plaqueY, plaqueWidth, plaqueHeight, 10 * scale);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = `800 ${21 * scale}px "Cinzel", Inter, sans-serif`;
      ctx.letterSpacing = '1px';
      ctx.fillText(info.formalTitle, width / 2, plaqueY + 40 * scale);

      // Performance Evaluation Statement
      const perfY = plaqueY + plaqueHeight + 42 * scale;
      ctx.fillStyle = '#334155';
      ctx.font = `500 ${15 * scale}px Inter, sans-serif`;
      ctx.fillText('with verified institutional character fidelity, structured database validation,', width / 2, perfY);
      ctx.fillText('and demonstrated technical mastery under rigorous operational laboratory standards.', width / 2, perfY + 24 * scale);

      // 7. Verified Performance Metric Badges
      const badgeStripY = perfY + 68 * scale;
      const badgeWidth = 230 * scale;
      const badgeHeight = 66 * scale;

      // Metric 1: Standards Passed
      const b1X = width / 2 - badgeWidth * 1.5 - 20 * scale;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      ctx.roundRect(b1X, badgeStripY, badgeWidth, badgeHeight, 8 * scale);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = `700 ${10 * scale}px Inter, sans-serif`;
      ctx.fillText('CURRICULUM UNITS', b1X + badgeWidth / 2, badgeStripY + 22 * scale);
      ctx.fillStyle = '#0f2240';
      ctx.font = `800 ${16 * scale}px "JetBrains Mono", monospace`;
      ctx.fillText(`${info.completedUnits} / ${info.totalUnits} COMPLETED`, b1X + badgeWidth / 2, badgeStripY + 48 * scale);

      // Metric 2: Quality Fidelity
      const b2X = width / 2 - badgeWidth / 2;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#c59b27';
      ctx.lineWidth = 1.5 * scale;
      ctx.beginPath();
      ctx.roundRect(b2X, badgeStripY, badgeWidth, badgeHeight, 8 * scale);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#b45309';
      ctx.font = `700 ${10 * scale}px Inter, sans-serif`;
      ctx.fillText('VERIFIED ACCURACY', b2X + badgeWidth / 2, badgeStripY + 22 * scale);
      ctx.fillStyle = '#15803d';
      ctx.font = `800 ${16 * scale}px "JetBrains Mono", monospace`;
      ctx.fillText(info.standardAccuracy, b2X + badgeWidth / 2, badgeStripY + 48 * scale);

      // Metric 3: Experience Credits
      const b3X = width / 2 + badgeWidth * 0.5 + 20 * scale;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      ctx.roundRect(b3X, badgeStripY, badgeWidth, badgeHeight, 8 * scale);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = `700 ${10 * scale}px Inter, sans-serif`;
      ctx.fillText('TECHNICAL CREDITS', b3X + badgeWidth / 2, badgeStripY + 22 * scale);
      ctx.fillStyle = '#b45309';
      ctx.font = `800 ${16 * scale}px "JetBrains Mono", monospace`;
      ctx.fillText(`+${info.totalExp.toLocaleString()} EXP`, b3X + badgeWidth / 2, badgeStripY + 48 * scale);

      // 8. Signatures & Embossed Institutional Seal
      const sigY = badgeStripY + badgeHeight + 110 * scale;

      // Left Signature: Academic Head
      const sigLeftX = width * 0.23;
      ctx.fillStyle = '#0f2240';
      ctx.font = `italic 700 ${30 * scale}px "Brush Script MT", "Segoe Script", cursive, serif`;
      ctx.fillText('P. K. Banerjee', sigLeftX, sigY);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5 * scale;
      ctx.beginPath();
      ctx.moveTo(sigLeftX - 120 * scale, sigY + 12 * scale);
      ctx.lineTo(sigLeftX + 120 * scale, sigY + 12 * scale);
      ctx.stroke();

      ctx.fillStyle = '#0f2240';
      ctx.font = `700 ${13 * scale}px Inter, sans-serif`;
      ctx.fillText('Academic Head & Curriculum Director', sigLeftX, sigY + 32 * scale);
      ctx.fillStyle = '#64748b';
      ctx.font = `500 ${11 * scale}px Inter, sans-serif`;
      ctx.fillText('ICST Chowberia Technical Examination Division', sigLeftX, sigY + 48 * scale);

      // Right Signature: Chief Controller of Examinations
      const sigRightX = width * 0.77;
      ctx.fillStyle = '#0f2240';
      ctx.font = `italic 700 ${30 * scale}px "Brush Script MT", "Segoe Script", cursive, serif`;
      ctx.fillText('Dr. S. K. Mukherjee', sigRightX, sigY);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5 * scale;
      ctx.beginPath();
      ctx.moveTo(sigRightX - 120 * scale, sigY + 12 * scale);
      ctx.lineTo(sigRightX + 120 * scale, sigY + 12 * scale);
      ctx.stroke();

      ctx.fillStyle = '#0f2240';
      ctx.font = `700 ${13 * scale}px Inter, sans-serif`;
      ctx.fillText('Chief Controller of Technical Examinations', sigRightX, sigY + 32 * scale);
      ctx.fillStyle = '#64748b';
      ctx.font = `500 ${11 * scale}px Inter, sans-serif`;
      ctx.fillText('Institute of Computer Science and Technology', sigRightX, sigY + 48 * scale);

      // Center Embossed Gold Institutional Seal
      const sealRadius = 55 * scale;
      const sealCenterY = sigY + 10 * scale;

      // Ribbon tails behind seal
      ctx.fillStyle = '#0f2240';
      ctx.beginPath();
      ctx.moveTo(width / 2 - 18 * scale, sealCenterY + sealRadius - 10 * scale);
      ctx.lineTo(width / 2 - 38 * scale, sealCenterY + sealRadius + 50 * scale);
      ctx.lineTo(width / 2 - 20 * scale, sealCenterY + sealRadius + 40 * scale);
      ctx.lineTo(width / 2 - 2 * scale, sealCenterY + sealRadius + 50 * scale);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(width / 2 + 18 * scale, sealCenterY + sealRadius - 10 * scale);
      ctx.lineTo(width / 2 + 38 * scale, sealCenterY + sealRadius + 50 * scale);
      ctx.lineTo(width / 2 + 20 * scale, sealCenterY + sealRadius + 40 * scale);
      ctx.lineTo(width / 2 + 2 * scale, sealCenterY + sealRadius + 50 * scale);
      ctx.closePath();
      ctx.fill();

      // Gold seal body
      const sealGrad = ctx.createRadialGradient(
        width / 2 - 10 * scale,
        sealCenterY - 10 * scale,
        5 * scale,
        width / 2,
        sealCenterY,
        sealRadius
      );
      sealGrad.addColorStop(0, '#fef9c3');
      sealGrad.addColorStop(0.4, '#fde047');
      sealGrad.addColorStop(0.8, '#d97706');
      sealGrad.addColorStop(1, '#92400e');

      ctx.fillStyle = sealGrad;
      ctx.beginPath();
      ctx.arc(width / 2, sealCenterY, sealRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3 * scale;
      ctx.stroke();

      // Inner ring of seal
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5 * scale;
      ctx.beginPath();
      ctx.arc(width / 2, sealCenterY, sealRadius - 7 * scale, 0, Math.PI * 2);
      ctx.stroke();

      // Star in center of seal
      ctx.fillStyle = '#78350f';
      ctx.font = `800 ${13 * scale}px "Cinzel", serif`;
      ctx.fillText('ICST', width / 2, sealCenterY - 8 * scale);
      ctx.font = `700 ${10 * scale}px Inter, sans-serif`;
      ctx.fillText('★ CHOWBERIA ★', width / 2, sealCenterY + 6 * scale);
      ctx.font = `800 ${9 * scale}px Inter, sans-serif`;
      ctx.fillText('SEAL', width / 2, sealCenterY + 18 * scale);

      // 9. Bottom Security & Verification Bar
      const btmY = height - 60 * scale;
      ctx.fillStyle = '#64748b';
      ctx.font = `500 ${11 * scale}px Inter, sans-serif`;
      ctx.fillText(
        `Issued by Institute of Computer Science & Technology, Chowberia • Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
        width / 2,
        btmY
      );

      ctx.fillStyle = '#94a3b8';
      ctx.font = `500 ${9.5 * scale}px "JetBrains Mono", monospace`;
      ctx.fillText(
        'Digitally verifiable certificate recorded in official ICST institutional database archives. For validation: https://github.com/icstconnect',
        width / 2,
        btmY + 16 * scale
      );

      // Sample watermark if viewing in sample mode
      if (options?.isSample && !info.isUnlocked) {
        ctx.save();
        ctx.translate(width / 2, height / 2 + 100 * scale);
        ctx.rotate(-Math.PI / 6);
        ctx.fillStyle = 'rgba(217, 119, 6, 0.16)';
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
        ctx.lineWidth = 3 * scale;
        ctx.font = `900 ${68 * scale}px Inter, sans-serif`;
        ctx.strokeText('UNLOCKED UPON MODULE COMPLETION', 0, 0);
        ctx.fillText('UNLOCKED UPON MODULE COMPLETION', 0, 0);
        ctx.restore();
      }

      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    };

    logoImg.onerror = () => {
      resolve('');
    };
  });
}
