import React from 'react';
import { FingerId, TypingTheme } from '../../types/typing';

export interface IllustratedHandsSVGProps {
  activeFinger: FingerId | null;
  shiftFinger?: FingerId | null;
  isPressed?: boolean;
  isError?: boolean;
  theme: TypingTheme;
  className?: string;
}

export const IllustratedHandsSVG: React.FC<IllustratedHandsSVGProps> = ({
  activeFinger,
  shiftFinger = null,
  isPressed = false,
  isError = false,
  theme,
  className = ''
}) => {
  const isDark = theme === 'dark';

  // Skin and stroke theme parameters
  const skinFill = isDark ? '#262a33' : '#f5eee3';
  const palmFill = isDark ? '#21252d' : '#ede3d5';
  const strokeColor = isDark ? '#465063' : '#b3a591';
  const creaseStroke = isDark ? '#363d4c' : '#c9bcab';
  const nailFill = isDark ? '#323743' : '#e6dcce';

  // State glow colors
  const activeGlow = isDark ? '#00f0ff' : '#0284c7';
  const shiftGlow = '#f59e0b';
  const errorGlow = '#ef4444';

  const getFingerState = (fingerId: FingerId) => {
    const isActive = activeFinger === fingerId;
    const isShift = shiftFinger === fingerId;

    if (isActive) {
      return {
        fill: isError ? errorGlow : activeGlow,
        stroke: '#ffffff',
        glowId: isError ? 'url(#errorGlowFilter)' : 'url(#activeGlowFilter)',
        strokeWidth: 2.5,
        isActive: true,
        isShift: false,
        isError
      };
    }

    if (isShift) {
      return {
        fill: shiftGlow,
        stroke: '#ffffff',
        glowId: 'url(#shiftGlowFilter)',
        strokeWidth: 2.5,
        isActive: false,
        isShift: true,
        isError: false
      };
    }

    return {
      fill: skinFill,
      stroke: strokeColor,
      glowId: undefined,
      strokeWidth: 1.5,
      isActive: false,
      isShift: false,
      isError: false
    };
  };

  const lpState = getFingerState('LP');
  const lrState = getFingerState('LR');
  const lmState = getFingerState('LM');
  const liState = getFingerState('LI');
  const thumbState = getFingerState('THUMB');
  const riState = getFingerState('RI');
  const rmState = getFingerState('RM');
  const rrState = getFingerState('RR');
  const rpState = getFingerState('RP');

  return (
    <div className={`typing-hands-container ${className}`}>
      <svg
        viewBox="0 0 1000 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="typing-hands-svg"
      >
        <defs>
          {/* Active Finger Glow Filter */}
          <filter id="activeGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Shift Guidance Filter */}
          <filter id="shiftGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Error Glow Filter */}
          <filter id="errorGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Soft Palm Drop Shadow */}
          <filter id="handShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor={isDark ? '#000000' : '#4a3f35'} floodOpacity={isDark ? '0.45' : '0.12'} />
          </filter>
        </defs>

        {/* ================================================================= */}
        {/* LEFT HAND                                                         */}
        {/* ================================================================= */}
        <g id="leftHand" filter="url(#handShadow)">
          {/* Left Wrist & Palm Body */}
          <path
            d="M 175 320 L 165 240 C 160 215, 170 195, 195 180 L 375 185 C 405 200, 420 225, 410 260 L 395 320 Z"
            fill={palmFill}
            stroke={strokeColor}
            strokeWidth="1.8"
          />

          {/* Palm Creases & Tendons (Left) */}
          <path d="M 210 230 C 255 245, 310 240, 360 220" stroke={creaseStroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 235 255 C 275 270, 330 265, 370 245" stroke={creaseStroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 285 220 L 280 290" stroke={creaseStroke} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
          <path d="M 345 210 L 350 280" stroke={creaseStroke} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

          {/* LEFT PINKY (LP) - ~x=165 */}
          <g id="finger-LP" style={{ transformOrigin: '165px 190px', transform: lpState.isActive && isPressed ? 'translateY(4px) scale(0.98)' : 'none', transition: 'all 0.08s ease' }}>
            <path
              d="M 152 195 C 145 155, 150 90, 165 65 C 172 52, 185 55, 186 68 C 187 88, 185 145, 184 185 Z"
              fill={lpState.fill}
              stroke={lpState.stroke}
              strokeWidth={lpState.strokeWidth}
              filter={lpState.glowId}
            />
            {/* Knuckle Creases */}
            <path d="M 154 140 Q 168 136 182 140" stroke={creaseStroke} strokeWidth="1.2" />
            <path d="M 157 100 Q 169 97 180 100" stroke={creaseStroke} strokeWidth="1.2" />
            {/* Fingernail Plate */}
            <path d="M 160 70 C 160 62, 175 62, 175 70 C 175 76, 160 76, 160 70 Z" fill={nailFill} opacity="0.8" />
          </g>

          {/* LEFT RING (LR) - ~x=228 */}
          <g id="finger-LR" style={{ transformOrigin: '228px 185px', transform: lrState.isActive && isPressed ? 'translateY(4px) scale(0.98)' : 'none', transition: 'all 0.08s ease' }}>
            <path
              d="M 212 185 C 208 145, 210 65, 228 35 C 236 22, 250 24, 252 38 C 255 65, 253 140, 248 185 Z"
              fill={lrState.fill}
              stroke={lrState.stroke}
              strokeWidth={lrState.strokeWidth}
              filter={lrState.glowId}
            />
            {/* Knuckle Creases */}
            <path d="M 214 130 Q 230 126 246 130" stroke={creaseStroke} strokeWidth="1.2" />
            <path d="M 218 85 Q 231 82 244 85" stroke={creaseStroke} strokeWidth="1.2" />
            {/* Fingernail Plate */}
            <path d="M 221 42 C 221 34, 239 34, 239 42 C 239 49, 221 49, 221 42 Z" fill={nailFill} opacity="0.8" />
          </g>

          {/* LEFT MIDDLE (LM) - ~x=292 */}
          <g id="finger-LM" style={{ transformOrigin: '292px 185px', transform: lmState.isActive && isPressed ? 'translateY(4px) scale(0.98)' : 'none', transition: 'all 0.08s ease' }}>
            <path
              d="M 276 185 C 273 140, 275 45, 292 18 C 300 6, 316 8, 318 22 C 322 55, 319 140, 314 185 Z"
              fill={lmState.fill}
              stroke={lmState.stroke}
              strokeWidth={lmState.strokeWidth}
              filter={lmState.glowId}
            />
            {/* Knuckle Creases */}
            <path d="M 278 125 Q 296 120 314 125" stroke={creaseStroke} strokeWidth="1.2" />
            <path d="M 282 75 Q 296 72 312 75" stroke={creaseStroke} strokeWidth="1.2" />
            {/* Fingernail Plate */}
            <path d="M 285 26 C 285 17, 305 17, 305 26 C 305 34, 285 34, 285 26 Z" fill={nailFill} opacity="0.8" />
          </g>

          {/* LEFT INDEX (LI) - ~x=362 */}
          <g id="finger-LI" style={{ transformOrigin: '362px 185px', transform: liState.isActive && isPressed ? 'translateY(4px) scale(0.98)' : 'none', transition: 'all 0.08s ease' }}>
            <path
              d="M 345 188 C 342 145, 345 68, 362 40 C 370 27, 385 28, 388 42 C 392 70, 389 145, 383 192 Z"
              fill={liState.fill}
              stroke={liState.stroke}
              strokeWidth={liState.strokeWidth}
              filter={liState.glowId}
            />
            {/* Knuckle Creases */}
            <path d="M 347 132 Q 365 128 382 132" stroke={creaseStroke} strokeWidth="1.2" />
            <path d="M 351 86 Q 365 83 379 86" stroke={creaseStroke} strokeWidth="1.2" />
            {/* Fingernail Plate */}
            <path d="M 354 46 C 354 38, 373 38, 373 46 C 373 53, 354 53, 354 46 Z" fill={nailFill} opacity="0.8" />
          </g>

          {/* LEFT THUMB (THUMB) - ~x=445 */}
          <g id="finger-LeftThumb" style={{ transformOrigin: '410px 245px', transform: thumbState.isActive && isPressed ? 'translateY(4px) scale(0.98)' : 'none', transition: 'all 0.08s ease' }}>
            <path
              d="M 390 220 C 415 195, 455 140, 475 140 C 490 140, 492 155, 480 175 C 460 210, 430 248, 412 260 Z"
              fill={thumbState.fill}
              stroke={thumbState.stroke}
              strokeWidth={thumbState.strokeWidth}
              filter={thumbState.glowId}
            />
            {/* Thumb Knuckle Crease */}
            <path d="M 430 195 Q 445 180 460 185" stroke={creaseStroke} strokeWidth="1.2" />
            {/* Thumb Nail Plate */}
            <path d="M 466 146 C 475 140, 484 148, 480 156 C 474 163, 463 154, 466 146 Z" fill={nailFill} opacity="0.8" />
          </g>
        </g>

        {/* ================================================================= */}
        {/* RIGHT HAND                                                        */}
        {/* ================================================================= */}
        <g id="rightHand" filter="url(#handShadow)">
          {/* Right Wrist & Palm Body */}
          <path
            d="M 825 320 L 835 240 C 840 215, 830 195, 805 180 L 625 185 C 595 200, 580 225, 590 260 L 605 320 Z"
            fill={palmFill}
            stroke={strokeColor}
            strokeWidth="1.8"
          />

          {/* Palm Creases & Tendons (Right) */}
          <path d="M 790 230 C 745 245, 690 240, 640 220" stroke={creaseStroke} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 765 255 C 725 270, 670 265, 630 245" stroke={creaseStroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 715 220 L 720 290" stroke={creaseStroke} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
          <path d="M 655 210 L 650 280" stroke={creaseStroke} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

          {/* RIGHT THUMB (THUMB) - ~x=555 */}
          <g id="finger-RightThumb" style={{ transformOrigin: '590px 245px', transform: thumbState.isActive && isPressed ? 'translateY(4px) scale(0.98)' : 'none', transition: 'all 0.08s ease' }}>
            <path
              d="M 610 220 C 585 195, 545 140, 525 140 C 510 140, 508 155, 520 175 C 540 210, 570 248, 588 260 Z"
              fill={thumbState.fill}
              stroke={thumbState.stroke}
              strokeWidth={thumbState.strokeWidth}
              filter={thumbState.glowId}
            />
            {/* Thumb Knuckle Crease */}
            <path d="M 570 195 Q 555 180 540 185" stroke={creaseStroke} strokeWidth="1.2" />
            {/* Thumb Nail Plate */}
            <path d="M 534 146 C 525 140, 516 148, 520 156 C 526 163, 537 154, 534 146 Z" fill={nailFill} opacity="0.8" />
          </g>

          {/* RIGHT INDEX (RI) - ~x=638 */}
          <g id="finger-RI" style={{ transformOrigin: '638px 185px', transform: riState.isActive && isPressed ? 'translateY(4px) scale(0.98)' : 'none', transition: 'all 0.08s ease' }}>
            <path
              d="M 655 188 C 658 145, 655 68, 638 40 C 630 27, 615 28, 612 42 C 608 70, 611 145, 617 192 Z"
              fill={riState.fill}
              stroke={riState.stroke}
              strokeWidth={riState.strokeWidth}
              filter={riState.glowId}
            />
            {/* Knuckle Creases */}
            <path d="M 653 132 Q 635 128 618 132" stroke={creaseStroke} strokeWidth="1.2" />
            <path d="M 649 86 Q 635 83 621 86" stroke={creaseStroke} strokeWidth="1.2" />
            {/* Fingernail Plate */}
            <path d="M 627 46 C 627 38, 646 38, 646 46 C 646 53, 627 53, 627 46 Z" fill={nailFill} opacity="0.8" />
          </g>

          {/* RIGHT MIDDLE (RM) - ~x=708 */}
          <g id="finger-RM" style={{ transformOrigin: '708px 185px', transform: rmState.isActive && isPressed ? 'translateY(4px) scale(0.98)' : 'none', transition: 'all 0.08s ease' }}>
            <path
              d="M 724 185 C 727 140, 725 45, 708 18 C 700 6, 684 8, 682 22 C 678 55, 681 140, 686 185 Z"
              fill={rmState.fill}
              stroke={rmState.stroke}
              strokeWidth={rmState.strokeWidth}
              filter={rmState.glowId}
            />
            {/* Knuckle Creases */}
            <path d="M 722 125 Q 704 120 686 125" stroke={creaseStroke} strokeWidth="1.2" />
            <path d="M 718 75 Q 704 72 688 75" stroke={creaseStroke} strokeWidth="1.2" />
            {/* Fingernail Plate */}
            <path d="M 695 26 C 695 17, 715 17, 715 26 C 715 34, 695 34, 695 26 Z" fill={nailFill} opacity="0.8" />
          </g>

          {/* RIGHT RING (RR) - ~x=772 */}
          <g id="finger-RR" style={{ transformOrigin: '772px 185px', transform: rrState.isActive && isPressed ? 'translateY(4px) scale(0.98)' : 'none', transition: 'all 0.08s ease' }}>
            <path
              d="M 788 185 C 792 145, 790 65, 772 35 C 764 22, 750 24, 748 38 C 745 65, 747 140, 752 185 Z"
              fill={rrState.fill}
              stroke={rrState.stroke}
              strokeWidth={rrState.strokeWidth}
              filter={rrState.glowId}
            />
            {/* Knuckle Creases */}
            <path d="M 786 130 Q 770 126 754 130" stroke={creaseStroke} strokeWidth="1.2" />
            <path d="M 782 85 Q 769 82 756 85" stroke={creaseStroke} strokeWidth="1.2" />
            {/* Fingernail Plate */}
            <path d="M 761 42 C 761 34, 779 34, 779 42 C 779 49, 761 49, 761 42 Z" fill={nailFill} opacity="0.8" />
          </g>

          {/* RIGHT PINKY (RP) - ~x=835 */}
          <g id="finger-RP" style={{ transformOrigin: '835px 190px', transform: rpState.isActive && isPressed ? 'translateY(4px) scale(0.98)' : 'none', transition: 'all 0.08s ease' }}>
            <path
              d="M 848 195 C 855 155, 850 90, 835 65 C 828 52, 815 55, 814 68 C 813 88, 815 145, 816 185 Z"
              fill={rpState.fill}
              stroke={rpState.stroke}
              strokeWidth={rpState.strokeWidth}
              filter={rpState.glowId}
            />
            {/* Knuckle Creases */}
            <path d="M 846 140 Q 832 136 818 140" stroke={creaseStroke} strokeWidth="1.2" />
            <path d="M 843 100 Q 831 97 820 100" stroke={creaseStroke} strokeWidth="1.2" />
            {/* Fingernail Plate */}
            <path d="M 825 70 C 825 62, 840 62, 840 70 C 840 76, 825 76, 825 70 Z" fill={nailFill} opacity="0.8" />
          </g>
        </g>
      </svg>
    </div>
  );
};
