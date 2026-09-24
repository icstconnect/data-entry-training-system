import React from 'react';

export interface TrophyGraphicProps {
  achievementId: string;
  level?: number;
  isUnlocked: boolean;
  size?: number;
  className?: string;
}

/**
 * Custom SVG Trophy Graphics uniquely designed for each achievement level & task.
 * Supports distinct locked (monochrome/padlock) and unlocked (radiant metallic gradient) states.
 */
export const TrophyGraphic: React.FC<TrophyGraphicProps> = ({
  achievementId,
  level,
  isUnlocked,
  size = 64,
  className = ''
}) => {
  const s = size;

  // Locked State Render
  if (!isUnlocked) {
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ filter: 'grayscale(1)', opacity: 0.55 }}
      >
        <circle cx="50" cy="50" r="46" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 3" />
        {/* Silhouette of Trophy */}
        <path
          d="M32 26 H68 V46 C68 56 59 64 50 64 C41 64 32 56 32 46 Z"
          fill="#cbd5e1"
        />
        <path d="M46 64 H54 V74 H46 Z" fill="#94a3b8" />
        <path d="M34 74 H66 V82 H34 Z" fill="#94a3b8" rx="2" />
        {/* Wing handles */}
        <path
          d="M32 30 C22 30 20 44 32 48"
          stroke="#cbd5e1"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M68 30 C78 30 80 44 68 48"
          stroke="#cbd5e1"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Prominent Padlock Emblem */}
        <rect x="42" y="44" width="16" height="13" rx="2.5" fill="#64748b" />
        <path
          d="M45 44 V39 C45 36.2 47.2 34 50 34 C52.8 34 55 36.2 55 39 V44"
          stroke="#64748b"
          strokeWidth="2.5"
          fill="none"
        />
        <circle cx="50" cy="50" r="1.5" fill="#f8fafc" />
      </svg>
    );
  }

  // UNLOCKED STATE - Specialized Trophy Graphics by Task & Level

  // 1. first_stage (Level 1: Novice Initiation Cup - Bronze & Amber Star)
  if (achievementId === 'first_stage') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="bronzeCup" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="40%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="bronzeStar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <radialGradient id="starterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 158, 11, 0.28)" />
            <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#starterGlow)" />
        <circle cx="50" cy="50" r="44" fill="#fffbeb" stroke="#fcd34d" strokeWidth="2" />
        {/* Handles */}
        <path d="M30 30 C18 30 16 46 30 50" stroke="url(#bronzeCup)" strokeWidth="4" strokeLinecap="round" />
        <path d="M70 30 C82 30 84 46 70 50" stroke="url(#bronzeCup)" strokeWidth="4" strokeLinecap="round" />
        {/* Goblet body */}
        <path d="M30 26 H70 V46 C70 57 61 64 50 64 C39 64 30 57 30 46 Z" fill="url(#bronzeCup)" />
        {/* Rim highlight */}
        <ellipse cx="50" cy="26" rx="20" ry="3.5" fill="#fde68a" />
        {/* Pedestal */}
        <path d="M46 64 H54 V74 H46 Z" fill="#b45309" />
        <path d="M32 74 H68 V82 H32 Z" fill="#92400e" rx="3" />
        {/* Embossed Starter Star */}
        <polygon points="50,32 53,41 62,41 55,47 57,56 50,51 43,56 45,47 38,41 47,41" fill="url(#bronzeStar)" />
        <circle cx="50" cy="45" r="2" fill="#ffffff" />
      </svg>
    );
  }

  // 2. level_1_complete (Level 1 Foundation Certified - Silver Laurel & Sapphire Crest)
  if (achievementId === 'level_1_complete') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="silverPlat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id="azureGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="2" />
        {/* Laurel Wreath */}
        <path d="M22 45 C20 32 30 20 40 18" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
        <path d="M78 45 C80 32 70 20 60 18" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
        {/* Goblet Handles with double arch */}
        <path d="M28 28 C16 28 14 48 30 52" stroke="url(#silverPlat)" strokeWidth="4" strokeLinecap="round" />
        <path d="M72 28 C84 28 86 48 70 52" stroke="url(#silverPlat)" strokeWidth="4" strokeLinecap="round" />
        {/* Cup */}
        <path d="M28 24 H72 V46 C72 58 62 66 50 66 C38 66 28 58 28 46 Z" fill="url(#silverPlat)" />
        <ellipse cx="50" cy="24" rx="22" ry="4" fill="#ffffff" />
        {/* Stem & Tiered Base */}
        <path d="M46 66 H54 V74 H46 Z" fill="#64748b" />
        <path d="M30 74 H70 V82 H30 Z" fill="#475569" rx="3" />
        {/* Certified Foundation Shield */}
        <path d="M50 32 L59 36 V48 C59 54 50 58 50 58 C50 58 41 54 41 48 V36 Z" fill="url(#azureGlow)" />
        <path d="M46 44 L49 47 L55 41" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 3. precision_operator (Level 2: Target Crosshair & Emerald Precision Cup)
  if (achievementId === 'precision_operator') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="emeraldGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="60%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="precisionCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="2" />
        {/* Precision Radar Rings */}
        <circle cx="50" cy="42" r="28" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1.5" strokeDasharray="3 3" />
        {/* Aerodynamic Handles */}
        <path d="M28 26 C14 26 14 50 30 52" stroke="url(#emeraldGold)" strokeWidth="4" strokeLinecap="round" />
        <path d="M72 26 C86 26 86 50 70 52" stroke="url(#emeraldGold)" strokeWidth="4" strokeLinecap="round" />
        {/* Cup */}
        <path d="M28 22 H72 V44 C72 56 62 65 50 65 C38 65 28 56 28 44 Z" fill="url(#emeraldGold)" />
        <ellipse cx="50" cy="22" rx="22" ry="3.5" fill="#a7f3d0" />
        <path d="M46 65 H54 V74 H46 Z" fill="#047857" />
        <path d="M30 74 H70 V82 H30 Z" fill="#064e3b" rx="3" />
        {/* Crosshair Target Reticle */}
        <circle cx="50" cy="42" r="10" stroke="#ffffff" strokeWidth="2" fill="none" />
        <circle cx="50" cy="42" r="3" fill="#ffffff" />
        <line x1="50" y1="28" x2="50" y2="34" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="50" x2="50" y2="56" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="42" x2="42" y2="42" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <line x1="58" y1="42" x2="64" y2="42" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 4. form_specialist (Level 3: Amethyst Multi-Section Royal Goblet)
  if (achievementId === 'form_specialist') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="amethystGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#581c87" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#faf5ff" stroke="#e9d5ff" strokeWidth="2" />
        {/* Wing Handles */}
        <path d="M26 26 C12 26 12 50 28 54" stroke="url(#amethystGrad)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M74 26 C88 26 88 50 72 54" stroke="url(#amethystGrad)" strokeWidth="4.5" strokeLinecap="round" />
        {/* Cup */}
        <path d="M26 20 H74 V44 C74 58 63 67 50 67 C37 67 26 58 26 44 Z" fill="url(#amethystGrad)" />
        <ellipse cx="50" cy="20" rx="24" ry="4" fill="#f3e8ff" />
        {/* Pedestal */}
        <path d="M45 67 H55 V74 H45 Z" fill="#7e22ce" />
        <path d="M28 74 H72 V82 H28 Z" fill="#581c87" rx="3" />
        {/* Form Document Stack Icon */}
        <rect x="42" y="30" width="16" height="20" rx="2" fill="#ffffff" />
        <line x1="45" y1="35" x2="55" y2="35" stroke="#9333ea" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="45" y1="39" x2="55" y2="39" stroke="#9333ea" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="45" y1="43" x2="52" y2="43" stroke="#9333ea" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 5. marksheet_operator (Level 4: State Board Ruby Spreadsheet Chalice)
  if (achievementId === 'marksheet_operator') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="rubyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="45%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#fef2f2" stroke="#fecaca" strokeWidth="2" />
        {/* Handles */}
        <path d="M26 26 C12 26 12 50 28 54" stroke="url(#rubyGrad)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M74 26 C88 26 88 50 72 54" stroke="url(#rubyGrad)" strokeWidth="4.5" strokeLinecap="round" />
        {/* Cup */}
        <path d="M26 20 H74 V44 C74 58 63 67 50 67 C37 67 26 58 26 44 Z" fill="url(#rubyGrad)" />
        <ellipse cx="50" cy="20" rx="24" ry="4" fill="#fee2e2" />
        <path d="M45 67 H55 V74 H45 Z" fill="#991b1b" />
        <path d="M28 74 H72 V82 H28 Z" fill="#7f1d1d" rx="3" />
        {/* 3x3 Table Grid Marks Seal */}
        <rect x="40" y="30" width="20" height="20" rx="2" fill="#ffffff" />
        <line x1="40" y1="36" x2="60" y2="36" stroke="#b91c1c" strokeWidth="1.2" />
        <line x1="40" y1="43" x2="60" y2="43" stroke="#b91c1c" strokeWidth="1.2" />
        <line x1="46" y1="30" x2="46" y2="50" stroke="#b91c1c" strokeWidth="1.2" />
        <line x1="53" y1="30" x2="53" y2="50" stroke="#b91c1c" strokeWidth="1.2" />
      </svg>
    );
  }

  // 6. perfect_100 (Level 4: Flawless 100% Diamond Crown Cup)
  if (achievementId === 'perfect_100') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="pureGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#facc15" />
            <stop offset="70%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
          <radialGradient id="sunburst" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(250, 204, 21, 0.45)" />
            <stop offset="100%" stopColor="rgba(250, 204, 21, 0)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#sunburst)" />
        <circle cx="50" cy="50" r="46" fill="#fffbeb" stroke="#fde047" strokeWidth="2.5" />
        {/* Crown Tri-points */}
        <polygon points="50,8 55,16 63,12 60,20 40,20 37,12 45,16" fill="url(#pureGoldGrad)" />
        {/* Golden Wings */}
        <path d="M26 26 C10 26 8 52 28 56" stroke="url(#pureGoldGrad)" strokeWidth="5" strokeLinecap="round" />
        <path d="M74 26 C90 26 92 52 72 56" stroke="url(#pureGoldGrad)" strokeWidth="5" strokeLinecap="round" />
        {/* Cup */}
        <path d="M26 20 H74 V46 C74 60 63 68 50 68 C37 68 26 60 26 46 Z" fill="url(#pureGoldGrad)" />
        <ellipse cx="50" cy="20" rx="24" ry="4" fill="#fef9c3" />
        <path d="M44 68 H56 V75 H44 Z" fill="#ca8a04" />
        <path d="M26 75 H74 V83 H26 Z" fill="#a16207" rx="3.5" />
        {/* "100%" Emblem */}
        <text
          x="50"
          y="46"
          fontSize="13"
          fontWeight="900"
          fontFamily="Inter, sans-serif"
          fill="#78350f"
          textAnchor="middle"
          letterSpacing="-0.5px"
        >
          100%
        </text>
        <text
          x="50"
          y="56"
          fontSize="7"
          fontWeight="800"
          fontFamily="Inter, sans-serif"
          fill="#92400e"
          textAnchor="middle"
          letterSpacing="0.8px"
        >
          FLAWLESS
        </text>
      </svg>
    );
  }

  // EXCEL MASS DATA ENTRY ACHIEVEMENTS (5 LEVELS)

  // E1. excel_novice_grid (Level 1: Spreadsheet Starter - Excel Green & Grid Trophy)
  if (achievementId === 'excel_novice_grid') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="excelGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
        {/* Handles */}
        <path d="M28 28 C16 28 14 48 30 52" stroke="url(#excelGreenGrad)" strokeWidth="4" strokeLinecap="round" />
        <path d="M72 28 C84 28 86 48 70 52" stroke="url(#excelGreenGrad)" strokeWidth="4" strokeLinecap="round" />
        {/* Cup */}
        <path d="M28 22 H72 V46 C72 58 62 66 50 66 C38 66 28 58 28 46 Z" fill="url(#excelGreenGrad)" />
        <ellipse cx="50" cy="22" rx="22" ry="3.5" fill="#bbf7d0" />
        {/* Base */}
        <path d="M46 66 H54 V74 H46 Z" fill="#15803d" />
        <path d="M30 74 H70 V82 H30 Z" fill="#14532d" rx="3" />
        {/* Excel "X" Green Badge */}
        <rect x="42" y="32" width="16" height="16" rx="3" fill="#107c41" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M46 36 L54 44 M54 36 L46 44" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // E2. excel_commercial_master (Level 2: Commercial Inventory - Gold Coin & Stock Ledger)
  if (achievementId === 'excel_commercial_master') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="commGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#fffbeb" stroke="#fde047" strokeWidth="2" />
        {/* Wing Handles */}
        <path d="M26 26 C12 26 12 50 28 54" stroke="url(#commGold)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M74 26 C88 26 88 50 72 54" stroke="url(#commGold)" strokeWidth="4.5" strokeLinecap="round" />
        {/* Cup */}
        <path d="M26 20 H74 V46 C74 58 63 68 50 68 C37 68 26 58 26 46 Z" fill="url(#commGold)" />
        <ellipse cx="50" cy="20" rx="24" ry="4" fill="#fef9c3" />
        <path d="M45 68 H55 V75 H45 Z" fill="#ca8a04" />
        <path d="M28 75 H72 V83 H28 Z" fill="#854d0e" rx="3" />
        {/* Rupee Symbol Coin */}
        <circle cx="50" cy="42" r="11" fill="#78350f" stroke="#fde047" strokeWidth="1.5" />
        <text x="50" y="47" fontSize="13" fontWeight="900" fontFamily="Inter, sans-serif" fill="#fef08a" textAnchor="middle">₹</text>
      </svg>
    );
  }

  // E3. excel_banking_kyc (Level 3: Banking KYC Ledger - Vault Shield & Azure Trophy)
  if (achievementId === 'excel_banking_kyc') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="bankAzure" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#f0f9ff" stroke="#7dd3fc" strokeWidth="2" />
        <path d="M26 26 C12 26 12 50 28 54" stroke="url(#bankAzure)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M74 26 C88 26 88 50 72 54" stroke="url(#bankAzure)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M26 20 H74 V46 C74 58 63 68 50 68 C37 68 26 58 26 46 Z" fill="url(#bankAzure)" />
        <ellipse cx="50" cy="20" rx="24" ry="4" fill="#e0f2fe" />
        <path d="M45 68 H55 V75 H45 Z" fill="#0369a1" />
        <path d="M28 75 H72 V83 H28 Z" fill="#0c4a6e" rx="3" />
        {/* Bank Pillar / Vault Icon */}
        <rect x="42" y="32" width="16" height="18" rx="2" fill="#ffffff" />
        <polygon points="41,32 50,26 59,32" fill="#0284c7" />
        <rect x="44" y="35" width="2.5" height="12" fill="#0284c7" />
        <rect x="49" y="35" width="2.5" height="12" fill="#0284c7" />
        <rect x="54" y="35" width="2.5" height="12" fill="#0284c7" />
      </svg>
    );
  }

  // E4. excel_board_marksheet (Level 4: State Board Tabulation - Crimson & Gold Graduation Cup)
  if (achievementId === 'excel_board_marksheet') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="boardCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#fff1f2" stroke="#fda4af" strokeWidth="2" />
        {/* Graduation Cap on top */}
        <polygon points="50,10 68,16 50,22 32,16" fill="#1e293b" />
        <rect x="42" y="20" width="16" height="4" fill="#334155" />
        <path d="M64 18 V28" stroke="#eab308" strokeWidth="1.5" />
        {/* Handles */}
        <path d="M26 28 C12 28 12 52 28 56" stroke="url(#boardCrimson)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M74 28 C88 28 88 52 72 56" stroke="url(#boardCrimson)" strokeWidth="4.5" strokeLinecap="round" />
        {/* Cup */}
        <path d="M26 24 H74 V48 C74 60 63 69 50 69 C37 69 26 60 26 48 Z" fill="url(#boardCrimson)" />
        <path d="M45 69 H55 V76 H45 Z" fill="#be123c" />
        <path d="M28 76 H72 V84 H28 Z" fill="#881337" rx="3" />
        {/* Tabular Marksheet Grid Emblem */}
        <rect x="40" y="34" width="20" height="18" rx="2" fill="#ffffff" />
        <line x1="40" y1="40" x2="60" y2="40" stroke="#be123c" strokeWidth="1.2" />
        <line x1="40" y1="46" x2="60" y2="46" stroke="#be123c" strokeWidth="1.2" />
        <line x1="47" y1="34" x2="47" y2="52" stroke="#be123c" strokeWidth="1.2" />
        <line x1="53" y1="34" x2="53" y2="52" stroke="#be123c" strokeWidth="1.2" />
      </svg>
    );
  }

  // E5. excel_census_grandmaster (Level 5 Capstone: Grandmaster Excel Registrar - Imperial Platinum Star)
  if (achievementId === 'excel_census_grandmaster') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="censusPlat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#e2e8f0" />
            <stop offset="70%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="censusGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#eab308" strokeWidth="2.5" />
        {/* Crown 5 Stars */}
        <polygon points="50,6 52,11 57,11 53,14 55,19 50,16 45,19 47,14 43,11 48,11" fill="#eab308" />
        <polygon points="34,10 35.5,13.5 39,13.5 36,16 37.5,19.5 34,17.5 30.5,19.5 32,16 29,13.5 32.5,13.5" fill="#eab308" />
        <polygon points="66,10 67.5,13.5 71,13.5 68,16 69.5,19.5 66,17.5 62.5,19.5 64,16 61,13.5 64.5,13.5" fill="#eab308" />
        {/* Dual Dragon Handles */}
        <path d="M24 24 C6 24 6 54 26 58" stroke="url(#censusGold)" strokeWidth="5" strokeLinecap="round" />
        <path d="M76 24 C94 24 94 54 74 58" stroke="url(#censusGold)" strokeWidth="5" strokeLinecap="round" />
        {/* Platinum Cup */}
        <path d="M24 20 H76 V48 C76 62 65 71 50 71 C35 71 24 62 24 48 Z" fill="url(#censusPlat)" stroke="url(#censusGold)" strokeWidth="1.5" />
        <ellipse cx="50" cy="20" rx="26" ry="4" fill="#ffffff" />
        <path d="M44 71 H56 V78 H44 Z" fill="url(#censusGold)" />
        <path d="M24 78 H76 V86 H24 Z" fill="url(#censusGold)" rx="3.5" />
        {/* Grand Census Seal */}
        <circle cx="50" cy="44" r="12" fill="#1e293b" stroke="url(#censusGold)" strokeWidth="2" />
        <polygon points="50,36 53,42 59,42 54,46 56,52 50,48 44,52 46,46 41,42 47,42" fill="url(#censusGold)" />
      </svg>
    );
  }

  // 7. master_operator (Level 5 Capstone: Grandmaster Platinum & Golden Imperial Cup)
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="imperialPlat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#f8fafc" />
          <stop offset="70%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="imperialGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#fafafa" stroke="#eab308" strokeWidth="2.5" />
      {/* 5 Apex Stars */}
      <polygon points="50,6 52,11 57,11 53,14 55,19 50,16 45,19 47,14 43,11 48,11" fill="#eab308" />
      <polygon points="34,10 35.5,13.5 39,13.5 36,16 37.5,19.5 34,17.5 30.5,19.5 32,16 29,13.5 32.5,13.5" fill="#eab308" />
      <polygon points="66,10 67.5,13.5 71,13.5 68,16 69.5,19.5 66,17.5 62.5,19.5 64,16 61,13.5 64.5,13.5" fill="#eab308" />
      {/* Dual Ornate Dragon Handles */}
      <path d="M26 24 C8 24 6 54 28 58" stroke="url(#imperialGold)" strokeWidth="5" strokeLinecap="round" />
      <path d="M74 24 C92 24 94 54 72 58" stroke="url(#imperialGold)" strokeWidth="5" strokeLinecap="round" />
      {/* Platinum Main Cup */}
      <path d="M26 20 H74 V48 C74 62 63 70 50 70 C37 70 26 62 26 48 Z" fill="url(#imperialPlat)" stroke="url(#imperialGold)" strokeWidth="1.5" />
      <ellipse cx="50" cy="20" rx="24" ry="4" fill="#ffffff" />
      {/* Gold Trim & Base */}
      <path d="M44 70 H56 V77 H44 Z" fill="url(#imperialGold)" />
      <path d="M24 77 H76 V85 H24 Z" fill="url(#imperialGold)" rx="3.5" />
      {/* Center Grand Diamond Emblem */}
      <polygon points="50,28 60,38 50,56 40,38" fill="url(#imperialGold)" />
      <polygon points="50,32 56,38 50,50 44,38" fill="#ffffff" opacity="0.9" />
    </svg>
  );
};
