import React, { useState, useEffect, useRef } from 'react';
import {
  Keyboard,
  Bluetooth,
  Cable,
  Smartphone,
  CheckCircle2,
  ArrowLeft,
  Play,
  ChevronDown,
  ChevronUp,
  Languages,
  Sparkles
} from 'lucide-react';
import { animate, createScope, stagger, spring } from 'animejs';
import { TypingTheme } from '../../types/touchTyping';
import { markPhysicalKeyboardNoticeDismissed } from '../../utils/mobileKeyboardDetect';
import './physicalKeyboardNotice.css';

type NoticeLangMode = 'both' | 'en' | 'bn';

export interface PhysicalKeyboardNoticeProps {
  variant: 'banner' | 'modal';
  labName: string;
  labNameBn: string;
  theme: TypingTheme;
  onContinue?: () => void;
  onBackToDashboard?: () => void;
}

const ANIM_KEYS = ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'];

export const PhysicalKeyboardNotice: React.FC<PhysicalKeyboardNoticeProps> = ({
  variant,
  labName,
  labNameBn,
  theme,
  onContinue,
  onBackToDashboard
}) => {
  const isDark = theme === 'dark';
  const rootRef = useRef<HTMLDivElement | null>(null);
  const detectedBadgeRef = useRef<HTMLDivElement | null>(null);

  const [langMode, setLangMode] = useState<NoticeLangMode>('both');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [physicalKeyDetected, setPhysicalKeyDetected] = useState<boolean>(false);

  // Detect live physical keyboard key press for encouraging visual feedback
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.code && (e.code.startsWith('Key') || e.code === 'Space' || e.code === 'Enter')) {
        setPhysicalKeyDetected(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Spring-pop detected badge when a physical key is pressed
  useEffect(() => {
    if (!physicalKeyDetected || !detectedBadgeRef.current) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const anim = animate(detectedBadgeRef.current, {
      scale: [0.8, 1.08, 1],
      opacity: [0, 1],
      duration: 420,
      ease: spring({ stiffness: 360, damping: 16 })
    });
    return () => {
      anim.pause();
    };
  }, [physicalKeyDetected]);

  // Anime.js v4 scoped graphical animation (OTG cable plug + signal stream + Bluetooth waves + keyboard ripple)
  useEffect(() => {
    if (!rootRef.current || isCollapsed) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const scope = createScope({ root: rootRef.current }).add(() => {
      // Smooth card entrance
      animate('.pkn-card-shell', {
        translateY: [14, 0],
        opacity: [0, 1],
        duration: 460,
        ease: 'outExpo'
      });

      // USB OTG Plug gentle connect pulse
      animate('.pkn-otg-plug', {
        translateX: [10, 0, 0, 10],
        duration: 2800,
        loop: true,
        ease: 'inOutSine'
      });

      // Glowing signal flow along the USB OTG cable (keyboard -> tablet/phone)
      animate('.pkn-cable-signal', {
        strokeDashoffset: [0, 64],
        duration: 1400,
        loop: true,
        ease: 'linear'
      });

      // Data pulse orb gliding from keyboard toward device
      animate('.pkn-data-orb', {
        translateX: [110, 0],
        opacity: [0, 1, 1, 0],
        scale: [0.7, 1.15, 0.7],
        duration: 1650,
        loop: true,
        ease: 'inOutQuad'
      });

      // Bluetooth wireless wave rings expanding
      animate('.pkn-bt-wave', {
        scale: [0.78, 1.22],
        opacity: [0.85, 0],
        delay: stagger(260),
        duration: 1500,
        loop: true,
        ease: 'outQuad'
      });

      // Physical keyboard keycap ripple (simulating real 10-finger typing)
      animate('.pkn-svg-key', {
        translateY: [0, 2.5, 0],
        opacity: [0.55, 1, 0.55],
        delay: stagger(120, { from: 'first' }),
        duration: 900,
        loop: true,
        ease: 'inOutSine'
      });

      // Mini screen home-row beam pulse inside the tablet/phone graphic
      animate('.pkn-screen-beam', {
        opacity: [0.35, 0.95, 0.35],
        scaleY: [0.9, 1.06, 0.9],
        duration: 1500,
        loop: true,
        ease: 'inOutSine'
      });

      // Floating keyboard gentle hover
      animate('.pkn-keyboard-group', {
        translateY: [-2.5, 2.5],
        duration: 2400,
        alternate: true,
        loop: true,
        ease: 'inOutSine'
      });
    });

    return () => {
      scope.revert();
    };
  }, [isCollapsed, variant]);

  const showEn = langMode === 'both' || langMode === 'en';
  const showBn = langMode === 'both' || langMode === 'bn';

  const handleContinueClick = () => {
    markPhysicalKeyboardNoticeDismissed();
    if (onContinue) onContinue();
  };

  const renderGraphicScene = () => (
    <div className="pkn-graphic-stage" aria-hidden="true">
      <svg
        viewBox="0 0 460 156"
        className="pkn-graphic-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pknCableGrad" x1="145" y1="96" x2="292" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="pknScreenGrad" x1="26" y1="26" x2="122" y2="112" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isDark ? '#0f2744' : '#e0f2fe'} />
            <stop offset="100%" stopColor={isDark ? '#1e1b4b' : '#ede9fe'} />
          </linearGradient>
        </defs>

        {/* Soft ambient backdrop glow */}
        <ellipse cx="82" cy="134" rx="56" ry="8" fill={isDark ? 'rgba(0,0,0,0.45)' : 'rgba(18,77,123,0.12)'} />
        <ellipse cx="364" cy="136" rx="78" ry="9" fill={isDark ? 'rgba(0,0,0,0.45)' : 'rgba(18,77,123,0.12)'} />

        {/* LEFT: TABLET / MOBILE DEVICE */}
        <g className="pkn-device-group">
          <rect
            x="22"
            y="24"
            width="112"
            height="102"
            rx="14"
            fill={isDark ? '#1e2430' : '#1e293b'}
            stroke={isDark ? '#475569' : '#334155'}
            strokeWidth="2.4"
          />
          {/* Inner Screen */}
          <rect x="30" y="32" width="96" height="86" rx="8" fill="url(#pknScreenGrad)" />
          {/* Camera dot */}
          <circle cx="78" cy="28" r="1.8" fill="#64748b" />
          {/* Mini ICST Typing Tracks on Screen */}
          <rect x="39" y="42" width="78" height="10" rx="4" fill={isDark ? 'rgba(56,189,248,0.22)' : 'rgba(2,132,199,0.18)'} />
          <rect x="44" y="45" width="32" height="4" rx="2" fill="#0ea5e9" />
          <rect x="39" y="57" width="78" height="10" rx="4" fill={isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.18)'} />
          <rect x="52" y="60" width="24" height="4" rx="2" fill="#10b981" />
          {/* Glowing Light Beam on Screen */}
          <rect
            className="pkn-screen-beam"
            x="68"
            y="67"
            width="18"
            height="34"
            rx="4"
            fill="rgba(56,189,248,0.38)"
            style={{ transformOrigin: '77px 84px' }}
          />
          {/* Mini Home-Row Keys on Screen */}
          <rect x="39" y="88" width="14" height="14" rx="3" fill={isDark ? '#0f172a' : '#ffffff'} stroke="#0ea5e9" strokeWidth="1.2" />
          <rect x="57" y="88" width="14" height="14" rx="3" fill={isDark ? '#0f172a' : '#ffffff'} stroke="#0ea5e9" strokeWidth="1.2" />
          <rect x="75" y="88" width="14" height="14" rx="3" fill="#0ea5e9" />
          <rect x="93" y="88" width="14" height="14" rx="3" fill={isDark ? '#0f172a' : '#ffffff'} stroke="#8b5cf6" strokeWidth="1.2" />
          <text x="82" y="98" textAnchor="middle" fontSize="8" fontWeight="800" fill="#ffffff">F</text>
        </g>

        {/* CENTER: BLUETOOTH WAVES + USB OTG ANIMATED CONNECTION */}
        <g className="pkn-connection-bridge">
          {/* Bluetooth Emblem & Animated Waves */}
          <g transform="translate(208, 38)">
            <circle
              className="pkn-bt-wave"
              cx="0"
              cy="0"
              r="18"
              stroke="#38bdf8"
              strokeWidth="1.8"
              style={{ transformOrigin: '0px 0px' }}
            />
            <circle
              className="pkn-bt-wave"
              cx="0"
              cy="0"
              r="26"
              stroke="#8b5cf6"
              strokeWidth="1.4"
              style={{ transformOrigin: '0px 0px' }}
            />
            <circle cx="0" cy="0" r="13" fill={isDark ? '#0c2a44' : '#e0f2fe'} stroke="#0ea5e9" strokeWidth="1.8" />
            <path
              d="M -3 -5 L 4 2 L 0 6 V -6 L 4 -2 L -3 5"
              stroke="#0ea5e9"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <text
            x="208"
            y="64"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="800"
            letterSpacing="0.5"
            fill={isDark ? '#94a3b8' : '#475569'}
          >
            BLUETOOTH / OTG
          </text>

          {/* Animated USB OTG Plug entering Device Side */}
          <g className="pkn-otg-plug">
            <rect x="134" y="88" width="10" height="12" rx="2" fill="#94a3b8" />
            <rect x="142" y="85" width="18" height="18" rx="4" fill="#0ea5e9" stroke="#0369a1" strokeWidth="1.4" />
            <circle cx="151" cy="94" r="2.2" fill="#e0f2fe" />
          </g>

          {/* Curved Base Cable */}
          <path
            d="M 160 94 C 190 94, 196 112, 224 112 C 252 112, 258 96, 286 96"
            stroke={isDark ? '#334155' : '#cbd5e1'}
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Animated Signal Dashes */}
          <path
            className="pkn-cable-signal"
            d="M 160 94 C 190 94, 196 112, 224 112 C 252 112, 258 96, 286 96"
            stroke="url(#pknCableGrad)"
            strokeWidth="3"
            strokeDasharray="10 8"
            strokeLinecap="round"
          />

          {/* Gliding Signal Data Orb */}
          <circle className="pkn-data-orb" cx="164" cy="94" r="4.5" fill="#38bdf8" />
        </g>

        {/* RIGHT: PHYSICAL 10-FINGER KEYBOARD */}
        <g className="pkn-keyboard-group">
          <rect
            x="284"
            y="44"
            width="156"
            height="84"
            rx="12"
            fill={isDark ? '#1e2430' : '#ffffff'}
            stroke={isDark ? '#475569' : '#94a3b8'}
            strokeWidth="2.2"
          />
          {/* Top LED status dots */}
          <circle cx="422" cy="53" r="2" fill="#10b981" />
          <circle cx="429" cy="53" r="2" fill="#38bdf8" />

          {/* Row 1 mini keys */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <rect
              key={`r1-${i}`}
              x={294 + i * 15}
              y="60"
              width="12"
              height="11"
              rx="2.5"
              fill={isDark ? '#2b3344' : '#f1f5f9'}
              stroke={isDark ? '#3f495e' : '#cbd5e1'}
              strokeWidth="1"
            />
          ))}

          {/* Row 2: Highlighted Home Row (A S D F - J K L ;) with anime.js ripple */}
          {ANIM_KEYS.map((label, idx) => {
            const xPos = 294 + idx * 16.5 + (idx >= 4 ? 4 : 0);
            const isAnchor = label === 'F' || label === 'J';
            return (
              <g key={label} className="pkn-svg-key">
                <rect
                  x={xPos}
                  y="77"
                  width="14"
                  height="16"
                  rx="3.5"
                  fill={isAnchor ? '#0ea5e9' : isDark ? '#334155' : '#e0f2fe'}
                  stroke={isAnchor ? '#38bdf8' : isDark ? '#475569' : '#7dd3fc'}
                  strokeWidth="1.2"
                />
                <text
                  x={xPos + 7}
                  y="88"
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="800"
                  fill={isAnchor ? '#ffffff' : isDark ? '#e2e8f0' : '#0369a1'}
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Row 3: Spacebar & Modifiers */}
          <rect x="294" y="99" width="24" height="14" rx="3" fill={isDark ? '#2b3344' : '#f1f5f9'} stroke={isDark ? '#3f495e' : '#cbd5e1'} strokeWidth="1" />
          <rect x="323" y="99" width="76" height="14" rx="4" fill={isDark ? '#0c2a44' : '#dbeafe'} stroke="#0ea5e9" strokeWidth="1.3" />
          <text x="361" y="109" textAnchor="middle" fontSize="7.5" fontWeight="800" fill={isDark ? '#7dd3fc' : '#0369a1'}>
            SPACE
          </text>
          <rect x="404" y="99" width="24" height="14" rx="3" fill={isDark ? '#2b3344' : '#f1f5f9'} stroke={isDark ? '#3f495e' : '#cbd5e1'} strokeWidth="1" />
        </g>
      </svg>
    </div>
  );

  const cardBody = (
    <div ref={rootRef} className={`pkn-root pkn-variant-${variant} ${isDark ? 'is-dark' : 'is-light'}`}>
      <div className="pkn-card-shell">
        {/* Top Header Row */}
        <div className="pkn-top-row">
          <div className="pkn-pill-group">
            <span className="pkn-device-pill">
              <Smartphone size={13} />
              <span>Mobile / Tablet</span>
            </span>
            <span className="pkn-lab-pill">
              <Keyboard size={13} />
              <span>{langMode === 'bn' ? labNameBn : labName}</span>
            </span>
            {physicalKeyDetected && (
              <div ref={detectedBadgeRef} className="pkn-detected-pill">
                <CheckCircle2 size={13} />
                <span>
                  {langMode === 'bn'
                    ? 'কিবোর্ড যুক্ত হয়েছে!'
                    : 'Physical Keyboard Detected!'}
                </span>
              </div>
            )}
          </div>

          <div className="pkn-controls-right">
            {/* Language Switcher: Both (Default) | English | সহজ বাংলা */}
            <div className="pkn-lang-switch" role="group" aria-label="Language mode">
              <Languages size={12} className="pkn-lang-ico" />
              <button
                type="button"
                className={`pkn-lang-btn ${langMode === 'both' ? 'active' : ''}`}
                onClick={() => setLangMode('both')}
              >
                EN + বাংলা
              </button>
              <button
                type="button"
                className={`pkn-lang-btn ${langMode === 'en' ? 'active' : ''}`}
                onClick={() => setLangMode('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={`pkn-lang-btn ${langMode === 'bn' ? 'active' : ''}`}
                onClick={() => setLangMode('bn')}
              >
                বাংলা
              </button>
            </div>

            {variant === 'banner' && (
              <button
                type="button"
                className="pkn-collapse-btn"
                onClick={() => setIsCollapsed(prev => !prev)}
                aria-expanded={!isCollapsed}
                title={isCollapsed ? 'Show keyboard setup guide' : 'Minimize banner'}
              >
                {isCollapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </button>
            )}
          </div>
        </div>

        {/* Collapsed Compact Line (Banner mode only) */}
        {variant === 'banner' && isCollapsed ? (
          <div className="pkn-collapsed-row" onClick={() => setIsCollapsed(false)}>
            <Sparkles size={14} color="#0ea5e9" />
            <span>
              <strong>Attach a Physical Keyboard (OTG / Bluetooth)</strong> • আসল টাইপিং অভিজ্ঞতার জন্য ফিজিক্যাল কিবোর্ড লাগান
            </span>
          </div>
        ) : (
          <>
            {/* Graphical Animated Illustration */}
            {renderGraphicScene()}

            {/* Bilingual Guidance Blocks (English + সহজ বাংলা) */}
            <div className={`pkn-bilingual-grid ${langMode === 'both' ? 'is-dual' : 'is-single'}`}>
              {showEn && (
                <div className="pkn-lang-card pkn-card-en">
                  <div className="pkn-lang-tag">ENGLISH</div>
                  <h3 className="pkn-heading">
                    Attach a Physical Keyboard for the Real Experience
                  </h3>
                  <p className="pkn-desc">
                    Touch typing &amp; word speed labs build real 10-finger muscle memory on physical keys. Connect any USB PC keyboard via an <strong>OTG adapter</strong> or pair a <strong>Bluetooth keyboard</strong> with your phone or tablet.
                  </p>
                  <div className="pkn-steps-row">
                    <span className="pkn-step-chip">
                      <Cable size={12} /> USB Keyboard + OTG
                    </span>
                    <span className="pkn-step-chip">
                      <Bluetooth size={12} /> Bluetooth Keyboard
                    </span>
                    <span className="pkn-step-chip">
                      <Smartphone size={12} /> Use Landscape View
                    </span>
                  </div>
                </div>
              )}

              {showBn && (
                <div className="pkn-lang-card pkn-card-bn">
                  <div className="pkn-lang-tag is-bn">সহজ বাংলা</div>
                  <h3 className="pkn-heading">
                    আসল টাইপিং অভিজ্ঞতার জন্য ফিজিক্যাল কিবোর্ড লাগান
                  </h3>
                  <p className="pkn-desc">
                    ১০ আঙুলে দ্রুত ও নির্ভুল টাইপিং শেখার জন্য আসল কিবোর্ড ব্যবহার করা সবচেয়ে ভালো। একটি <strong>OTG ক্যাবল</strong> দিয়ে যেকোনো কম্পিউটার কিবোর্ড অথবা <strong>Bluetooth কিবোর্ড</strong> আপনার মোবাইল বা ট্যাবলেটে লাগিয়ে নিন।
                  </p>
                  <div className="pkn-steps-row">
                    <span className="pkn-step-chip">
                      <Cable size={12} /> USB কিবোর্ড + OTG
                    </span>
                    <span className="pkn-step-chip">
                      <Bluetooth size={12} /> Bluetooth কিবোর্ড
                    </span>
                    <span className="pkn-step-chip">
                      <Smartphone size={12} /> ফোন আড়াআড়ি ধরুন
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions (Workbench Entry) */}
            {variant === 'modal' && (
              <div className="pkn-modal-footer">
                {onBackToDashboard && (
                  <button
                    type="button"
                    className="pkn-secondary-btn"
                    onClick={onBackToDashboard}
                  >
                    <ArrowLeft size={14} />
                    <span>
                      {langMode === 'bn'
                        ? 'ড্যাশবোর্ডে ফিরুন'
                        : langMode === 'en'
                        ? 'Back to Dashboard'
                        : 'Dashboard / ড্যাশবোর্ড'}
                    </span>
                  </button>
                )}

                {onContinue && (
                  <button
                    type="button"
                    className="pkn-primary-btn"
                    onClick={handleContinueClick}
                  >
                    <Play size={15} fill="currentColor" />
                    <span>
                      {langMode === 'bn'
                        ? 'কিবোর্ড লাগানো আছে — শুরু করুন'
                        : langMode === 'en'
                        ? 'Keyboard Attached — Continue'
                        : 'Keyboard Attached — Continue / শুরু করুন'}
                    </span>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (variant === 'modal') {
    return (
      <div
        className="pkn-modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label="Physical keyboard recommendation for mobile and tablet"
      >
        {cardBody}
      </div>
    );
  }

  return cardBody;
};
