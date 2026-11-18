import React from 'react';
import { CarrierId } from '../../types/wordExpress';

export interface DeliveryCarrierSVGProps {
  carrierId: CarrierId;
  accent?: string;
  size?: number;
  boosted?: boolean;
  className?: string;
}

/**
 * 16 Custom Vector Delivery Vehicles (all oriented left-to-right along the delivery queue):
 * 1. Human Runner  2. Bicycle  3. Motorcycle  4. 4-Wheeler Car
 * 5. Small F1 Car  6. F1 Car   7. Small Airplane  8. Medium Airplane
 * 9. Big Airplane  10. Fighter Plane  11. Supersonic Fighter  12. Rocket
 * 13. Spaceship    14. UFO 1   15. UFO 2   16. UFO 3
 */
export const DeliveryCarrierSVG: React.FC<DeliveryCarrierSVGProps> = ({
  carrierId,
  accent = '#38bdf8',
  size = 64,
  boosted = false,
  className = ''
}) => {
  const height = Math.round(size * 0.62);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 110 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`carrier-svg ${boosted ? 'is-boosted' : ''} ${className}`}
      aria-hidden="true"
    >
      {/* 1. HUMAN RUNNER CARRYING PARCEL */}
      {carrierId === 'human' && (
        <g>
          {/* Ground shadow */}
          <ellipse cx="55" cy="61" rx="22" ry="4" fill="rgba(0,0,0,0.22)" />
          {/* Speed puffs */}
          <path d="M18 52 H28 M12 45 H24" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.65" />
          {/* Back leg */}
          <path d="M51 39 L37 52 L30 57" stroke="#334155" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Front leg */}
          <path d="M55 39 L67 49 L74 58" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Torso leaning forward */}
          <path d="M53 23 L57 40" stroke={accent} strokeWidth="9" strokeLinecap="round" />
          {/* Head */}
          <circle cx="58" cy="14" r="6.5" fill="#fdba74" stroke="#c2410c" strokeWidth="1.2" />
          {/* Cap */}
          <path d="M52 11 C54 6, 63 6, 65 11 L70 12 L52 12 Z" fill={accent} />
          {/* Arms holding parcel box */}
          <path d="M56 26 L68 30 L74 26" stroke="#fdba74" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {/* Word Parcel Box */}
          <rect x="69" y="17" width="16" height="14" rx="3" fill="#f59e0b" stroke="#92400e" strokeWidth="1.4" />
          <path d="M77 17 V31 M69 24 H85" stroke="#fef3c7" strokeWidth="1.4" />
        </g>
      )}

      {/* 2. BICYCLE */}
      {carrierId === 'bicycle' && (
        <g>
          <ellipse cx="55" cy="61" rx="32" ry="4" fill="rgba(0,0,0,0.2)" />
          {/* Wheels */}
          <circle cx="31" cy="46" r="13" stroke="#1e293b" strokeWidth="3.5" fill="rgba(255,255,255,0.12)" />
          <circle cx="31" cy="46" r="3" fill={accent} />
          <circle cx="79" cy="46" r="13" stroke="#1e293b" strokeWidth="3.5" fill="rgba(255,255,255,0.12)" />
          <circle cx="79" cy="46" r="3" fill={accent} />
          {/* Frame */}
          <path d="M31 46 L50 46 L68 28 L44 28 Z M50 46 L44 22 M68 28 L79 46 M65 21 L73 21" stroke={accent} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Rider */}
          <circle cx="55" cy="12" r="5.5" fill="#fdba74" />
          <path d="M46 25 L55 18 L66 22" stroke="#0f172a" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Rear Delivery Crate */}
          <rect x="20" y="21" width="16" height="11" rx="2.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.2" />
        </g>
      )}

      {/* 3. MOTORCYCLE */}
      {carrierId === 'motorcycle' && (
        <g>
          <ellipse cx="56" cy="61" rx="35" ry="4" fill="rgba(0,0,0,0.24)" />
          <path d="M8 46 H22 M4 52 H18" stroke={accent} strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
          {/* Wheels */}
          <circle cx="30" cy="47" r="12" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
          <circle cx="30" cy="47" r="4.5" fill="#e2e8f0" />
          <circle cx="82" cy="47" r="12" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
          <circle cx="82" cy="47" r="4.5" fill="#e2e8f0" />
          {/* Exhaust */}
          <path d="M22 46 L42 44" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
          {/* Sport Bike Body */}
          <path d="M26 34 L52 34 L67 24 L85 32 L78 44 L44 44 Z" fill={accent} stroke="#7f1d1d" strokeWidth="1.4" />
          {/* Windshield */}
          <path d="M67 24 L76 17 L83 26 Z" fill="#38bdf8" opacity="0.85" />
          {/* Helmeted Rider */}
          <circle cx="57" cy="17" r="6" fill="#1e293b" />
          <path d="M58 15 L63 16 L62 19 L57 18 Z" fill="#38bdf8" />
          <path d="M46 31 L56 23 L68 25" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" />
          {/* Headlight glow */}
          <circle cx="87" cy="34" r="3" fill="#fef08a" />
        </g>
      )}

      {/* 4. 4-WHEELER CAR */}
      {carrierId === 'car' && (
        <g>
          <ellipse cx="56" cy="61" rx="40" ry="4" fill="rgba(0,0,0,0.24)" />
          {/* Car Body */}
          <path d="M14 48 L16 34 L32 32 L44 19 L72 19 L84 32 L96 35 L98 48 Z" fill={accent} stroke="#1e3a8a" strokeWidth="1.6" />
          {/* Cabin Windows */}
          <path d="M46 23 L69 23 L78 32 L37 32 Z" fill="#bae6fd" stroke="#1e3a8a" strokeWidth="1.2" />
          <line x1="57" y1="23" x2="57" y2="32" stroke="#1e3a8a" strokeWidth="1.5" />
          {/* Headlight & Taillight */}
          <rect x="92" y="37" width="6" height="4" rx="1.5" fill="#fef08a" />
          <rect x="14" y="37" width="4" height="5" rx="1" fill="#ef4444" />
          {/* Wheels */}
          <circle cx="33" cy="49" r="9.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="2.2" />
          <circle cx="33" cy="49" r="3.5" fill="#e2e8f0" />
          <circle cx="79" cy="49" r="9.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="2.2" />
          <circle cx="79" cy="49" r="3.5" fill="#e2e8f0" />
        </g>
      )}

      {/* 5. SMALL F1 CAR */}
      {carrierId === 'small-f1' && (
        <g>
          <ellipse cx="56" cy="60" rx="38" ry="4" fill="rgba(0,0,0,0.26)" />
          <path d="M6 45 H20 M10 50 H22" stroke="#facc15" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
          {/* Rear Mini Wing */}
          <path d="M18 30 H28 L25 42 H19 Z" fill="#1e293b" />
          {/* Sleek Junior Chassis */}
          <path d="M22 44 L28 35 L58 33 L94 42 L94 48 L22 48 Z" fill={accent} stroke="#854d0e" strokeWidth="1.5" />
          {/* Cockpit & Helmet */}
          <ellipse cx="52" cy="34" rx="9" ry="4.5" fill="#0f172a" />
          <circle cx="52" cy="31" r="4.5" fill="#ffffff" stroke="#0f172a" strokeWidth="1.2" />
          {/* Front Wing */}
          <rect x="86" y="45" width="13" height="4" rx="2" fill="#1e293b" />
          {/* Racing Slicks */}
          <circle cx="32" cy="49" r="8.5" fill="#0f172a" stroke="#facc15" strokeWidth="2" />
          <circle cx="80" cy="49" r="8.5" fill="#0f172a" stroke="#facc15" strokeWidth="2" />
        </g>
      )}

      {/* 6. FULL F1 CAR */}
      {carrierId === 'f1' && (
        <g>
          <ellipse cx="56" cy="60" rx="44" ry="4" fill="rgba(0,0,0,0.28)" />
          {/* Turbo Flame */}
          <path d="M4 44 L17 40 L17 48 Z" fill="#f97316" />
          <path d="M8 44 L17 42 L17 46 Z" fill="#fef08a" />
          {/* Tall Rear Spoiler */}
          <path d="M14 23 H27 L24 41 H17 Z" fill="#0f172a" />
          <rect x="13" y="22" width="15" height="4.5" rx="1.5" fill={accent} />
          {/* Aerodynamic F1 Body */}
          <path d="M18 47 L24 33 L46 30 L56 26 L70 33 L100 42 L102 48 L18 48 Z" fill={accent} stroke="#7f1d1d" strokeWidth="1.4" />
          {/* Racing Stripe */}
          <path d="M26 39 L88 43" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          {/* Halo & Driver Helmet */}
          <path d="M46 31 Q57 22 67 32" stroke="#0f172a" strokeWidth="2.6" fill="none" />
          <circle cx="55" cy="29" r="4.5" fill="#fef08a" stroke="#0f172a" strokeWidth="1.2" />
          {/* Wide Front Spoiler */}
          <path d="M90 45 L106 44 L106 49 L89 49 Z" fill="#0f172a" />
          {/* Wide Slick Tires */}
          <circle cx="31" cy="49" r="9.5" fill="#0f172a" stroke="#ef4444" strokeWidth="2.4" />
          <circle cx="31" cy="49" r="3.8" fill="#cbd5e1" />
          <circle cx="83" cy="49" r="9.5" fill="#0f172a" stroke="#ef4444" strokeWidth="2.4" />
          <circle cx="83" cy="49" r="3.8" fill="#cbd5e1" />
        </g>
      )}

      {/* 7. SMALL AIRPLANE */}
      {carrierId === 'small-plane' && (
        <g>
          {/* Tail */}
          <path d="M16 32 L24 17 L34 32 Z" fill={accent} />
          {/* Fuselage */}
          <path d="M18 36 C18 30, 34 26, 78 28 C90 29, 95 34, 95 37 C95 41, 86 44, 72 44 L22 41 Z" fill="#f8fafc" stroke="#0369a1" strokeWidth="1.6" />
          {/* Stripe & Cockpit */}
          <path d="M24 37 H88" stroke={accent} strokeWidth="3.2" />
          <path d="M54 28 C62 24, 74 26, 78 32 H54 Z" fill="#38bdf8" />
          {/* Wing */}
          <path d="M42 36 L68 36 L58 50 L44 50 Z" fill={accent} stroke="#0369a1" strokeWidth="1.2" />
          {/* Spinning Propeller */}
          <rect x="95" y="33" width="4" height="8" rx="2" fill="#334155" />
          <ellipse cx="99" cy="37" rx="2.5" ry="15" fill="#94a3b8" opacity="0.65" />
        </g>
      )}

      {/* 8. MEDIUM AIRPLANE (TWIN JET) */}
      {carrierId === 'medium-plane' && (
        <g>
          {/* Contrails */}
          <path d="M4 42 H22 M8 36 H20" stroke="#bae6fd" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
          {/* Tail Fin */}
          <path d="M16 32 L25 13 L38 30 Z" fill={accent} />
          {/* Fuselage */}
          <path d="M16 35 C16 29, 32 25, 80 26 C94 27, 101 32, 101 36 C101 40, 92 43, 76 43 L20 40 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="1.6" />
          {/* Cockpit & Passenger Windows */}
          <path d="M84 28 L94 32 L84 33 Z" fill="#0f172a" />
          <path d="M40 33 H78" stroke="#0284c7" strokeWidth="2.6" strokeDasharray="4 4" strokeLinecap="round" />
          {/* Swept Wing & Engine Pod */}
          <path d="M44 37 L74 37 L58 54 L44 52 Z" fill={accent} />
          <rect x="53" y="42" width="15" height="6" rx="3" fill="#334155" />
        </g>
      )}

      {/* 9. BIG AIRPLANE (WIDE-BODY JUMBO JET) */}
      {carrierId === 'big-plane' && (
        <g>
          <path d="M2 45 H20 M6 39 H18" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
          {/* Tall Jumbo Tail */}
          <path d="M12 31 L22 9 L38 28 Z" fill={accent} />
          {/* Double-Deck Hump Fuselage */}
          <path d="M14 35 C14 27, 28 24, 58 24 C67 19, 86 19, 98 28 C104 32, 105 37, 102 41 C98 45, 86 46, 72 46 L18 42 Z" fill="#f8fafc" stroke="#1d4ed8" strokeWidth="1.6" />
          {/* Upper & Lower Deck Windows */}
          <path d="M68 25 H88" stroke="#1d4ed8" strokeWidth="2.5" strokeDasharray="3 3" />
          <path d="M32 34 H92" stroke={accent} strokeWidth="2.8" strokeDasharray="4 3" />
          {/* Large Swept Wing + Dual Engines */}
          <path d="M40 39 L78 39 L58 58 L42 56 Z" fill={accent} stroke="#1e40af" strokeWidth="1.2" />
          <rect x="52" y="45" width="15" height="6" rx="3" fill="#1e293b" />
          <rect x="44" y="51" width="13" height="5" rx="2.5" fill="#334155" />
        </g>
      )}

      {/* 10. FIGHTER PLANE */}
      {carrierId === 'fighter' && (
        <g>
          {/* Afterburner Flame */}
          <path d="M2 37 L22 31 L22 43 Z" fill="#f97316" />
          <path d="M9 37 L22 33.5 L22 40.5 Z" fill="#fef08a" />
          {/* Twin Cant Tail */}
          <path d="M20 33 L28 15 L40 31 Z" fill="#4338ca" />
          {/* Sharp Tactical Fuselage */}
          <path d="M20 33 L74 29 L106 37 L74 44 L20 42 Z" fill="#334155" stroke={accent} strokeWidth="1.6" />
          {/* Bubble Canopy */}
          <path d="M62 29 C70 22, 82 24, 86 32 L62 32 Z" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="1" />
          {/* Swept Wing */}
          <path d="M38 38 L74 37 L50 56 L36 53 Z" fill={accent} />
          {/* Wingtip Missile */}
          <path d="M36 54 H54" stroke="#f8fafc" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      )}

      {/* 11. SUPERSONIC FIGHTER PLANE */}
      {carrierId === 'supersonic' && (
        <g>
          {/* Mach Shock Cone */}
          <path d="M88 12 Q104 36 88 60" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="4 3" fill="none" opacity="0.85" />
          {/* Cyan-White Plasma Afterburner */}
          <path d="M0 37 L24 30 L24 44 Z" fill="#06b6d4" />
          <path d="M8 37 L24 33 L24 41 Z" fill="#ecfeff" />
          {/* Needle Delta Fuselage */}
          <path d="M22 32 L66 28 L108 37 L66 44 L22 42 Z" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.6" />
          {/* Delta Wings */}
          <path d="M28 31 L42 14 L54 30 Z" fill="#0891b2" />
          <path d="M30 39 L80 38 L44 58 L28 55 Z" fill="#06b6d4" opacity="0.92" />
          {/* Sleek Canopy */}
          <path d="M64 29 C74 24, 84 26, 89 33 H64 Z" fill="#67e8f9" />
        </g>
      )}

      {/* 12. ROCKET */}
      {carrierId === 'rocket' && (
        <g>
          {/* Blazing Multi-Layer Exhaust */}
          <path d="M2 34 L26 23 L26 45 Z" fill="#ef4444" />
          <path d="M8 34 L26 26 L26 42 Z" fill="#f59e0b" />
          <path d="M15 34 L26 30 L26 38 Z" fill="#fef08a" />
          {/* Upper & Lower Fins */}
          <path d="M24 23 L38 11 L46 23 Z" fill="#dc2626" />
          <path d="M24 45 L38 57 L46 45 Z" fill="#dc2626" />
          {/* Rocket Hull */}
          <path d="M26 23 H76 C90 23, 102 29, 106 34 C102 39, 90 45, 76 45 H26 Z" fill="#f8fafc" stroke="#475569" strokeWidth="1.6" />
          {/* Nose Cone */}
          <path d="M82 24 C92 25, 102 30, 106 34 C102 38, 92 43, 82 44 Z" fill={accent} />
          {/* Porthole Window */}
          <circle cx="62" cy="34" r="6.5" fill="#0ea5e9" stroke="#1e293b" strokeWidth="2.2" />
          <circle cx="64" cy="32" r="2" fill="#e0f2fe" />
        </g>
      )}

      {/* 13. SPACESHIP */}
      {carrierId === 'spaceship' && (
        <g>
          {/* Warp Ion Engines */}
          <path d="M2 27 L24 23 L24 31 Z M2 43 L24 39 L24 47 Z" fill="#a855f7" />
          <path d="M10 27 L24 25 L24 29 Z M10 43 L24 41 L24 45 Z" fill="#e9d5ff" />
          {/* Twin Nacelles */}
          <rect x="22" y="19" width="26" height="10" rx="4" fill="#312e81" stroke="#a78bfa" strokeWidth="1.3" />
          <rect x="22" y="41" width="26" height="10" rx="4" fill="#312e81" stroke="#a78bfa" strokeWidth="1.3" />
          {/* Main Starship Hull */}
          <path d="M28 28 L70 21 L104 35 L70 49 L28 42 Z" fill="#1e1b4b" stroke={accent} strokeWidth="1.8" />
          {/* Glowing Bridge & Energy Core */}
          <path d="M64 28 L84 35 L64 42 Z" fill="#38bdf8" opacity="0.85" />
          <circle cx="50" cy="35" r="5" fill="#c084fc" />
        </g>
      )}

      {/* 14. UFO 1 (SCOUT SAUCER) */}
      {carrierId === 'ufo-1' && (
        <g>
          {/* Emerald Tractor Glow */}
          <path d="M40 44 L28 64 H82 L70 44 Z" fill="rgba(16, 185, 129, 0.25)" />
          {/* Glass Dome */}
          <path d="M36 31 C36 16, 74 16, 74 31 Z" fill="#a7f3d0" stroke="#10b981" strokeWidth="1.8" />
          {/* Saucer Disc */}
          <ellipse cx="55" cy="35" rx="42" ry="12" fill="#1e293b" stroke={accent} strokeWidth="2.2" />
          <ellipse cx="55" cy="39" rx="26" ry="5" fill="#0f172a" />
          {/* Perimeter Lights */}
          <circle cx="28" cy="35" r="3" fill="#34d399" />
          <circle cx="42" cy="38" r="3" fill="#6ee7b7" />
          <circle cx="55" cy="39" r="3" fill="#34d399" />
          <circle cx="68" cy="38" r="3" fill="#6ee7b7" />
          <circle cx="82" cy="35" r="3" fill="#34d399" />
        </g>
      )}

      {/* 15. UFO 2 (TWIN-RING PLASMA CRUISER) */}
      {carrierId === 'ufo-2' && (
        <g>
          {/* Outer Plasma Halo */}
          <ellipse cx="55" cy="36" rx="48" ry="16" stroke="#00d8ff" strokeWidth="1.8" strokeDasharray="6 4" opacity="0.85" />
          {/* Cyan Beam */}
          <path d="M38 45 L24 65 H86 L72 45 Z" fill="rgba(0, 216, 255, 0.24)" />
          {/* Upper Plasma Dome */}
          <path d="M34 31 C36 13, 74 13, 76 31 Z" fill="#0891b2" stroke="#67e8f9" strokeWidth="2" />
          <ellipse cx="55" cy="22" rx="10" ry="4" fill="#ecfeff" opacity="0.7" />
          {/* Twin-Tier Hull */}
          <ellipse cx="55" cy="35" rx="42" ry="11" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.2" />
          <ellipse cx="55" cy="35" rx="30" ry="6" fill="#164e63" stroke="#00d8ff" strokeWidth="1.5" />
          {/* Lights */}
          <circle cx="25" cy="35" r="3.2" fill="#00f0ff" />
          <circle cx="40" cy="38" r="3.2" fill="#facc15" />
          <circle cx="55" cy="39" r="3.5" fill="#00f0ff" />
          <circle cx="70" cy="38" r="3.2" fill="#facc15" />
          <circle cx="85" cy="35" r="3.2" fill="#00f0ff" />
        </g>
      )}

      {/* 16. UFO 3 (OMEGA COSMIC MOTHERSHIP) */}
      {carrierId === 'ufo-3' && (
        <g>
          {/* Cosmic Aura & Stars */}
          <ellipse cx="55" cy="35" rx="51" ry="20" stroke="#e879f9" strokeWidth="1.8" strokeDasharray="4 4" opacity="0.9" />
          <circle cx="14" cy="16" r="2.2" fill="#fef08a" />
          <circle cx="96" cy="14" r="2.2" fill="#38bdf8" />
          <circle cx="98" cy="54" r="2" fill="#f0abfc" />
          {/* Golden-Violet Hyper Beam */}
          <path d="M36 45 L18 66 H92 L74 45 Z" fill="rgba(232, 121, 249, 0.28)" />
          {/* Crown Core */}
          <path d="M32 30 C35 10, 75 10, 78 30 Z" fill="#581c87" stroke="#f0abfc" strokeWidth="2.2" />
          <circle cx="55" cy="21" r="6" fill="#facc15" />
          {/* Triple-Ring Omega Hull */}
          <ellipse cx="55" cy="35" rx="45" ry="12.5" fill="#1e1b4b" stroke="#e879f9" strokeWidth="2.4" />
          <ellipse cx="55" cy="35" rx="32" ry="7" fill="#4c1d95" stroke="#facc15" strokeWidth="1.6" />
          {/* Omega Energy Nodes */}
          <circle cx="22" cy="35" r="3.4" fill="#facc15" />
          <circle cx="38" cy="39" r="3.4" fill="#38bdf8" />
          <circle cx="55" cy="40" r="4" fill="#fef08a" />
          <circle cx="72" cy="39" r="3.4" fill="#38bdf8" />
          <circle cx="88" cy="35" r="3.4" fill="#facc15" />
        </g>
      )}
    </svg>
  );
};
