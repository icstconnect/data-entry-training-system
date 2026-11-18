import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { animate, createScope, stagger } from 'animejs';
import {
  CursorPreferencesState,
  getCursorPreferences,
  subscribeCursorPreferences,
} from '../../utils/icstCursor';

type HoverKind = 'default' | 'pointer' | 'text' | 'cell' | 'disabled' | 'loading' | 'dragging';

const INTERACTIVE_SEL =
  'a, button, summary, select, label[for], [role="button"], [role="tab"], [role="menuitem"], [role="link"], input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], .nav-btn, .lab-card, .clickable';
const TEXT_SEL =
  'input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="url"], input[type="tel"], input[type="number"], input:not([type]), textarea, [contenteditable="true"]';

function classifyHoverTarget(target: EventTarget | null): HoverKind {
  const root = document.documentElement;
  if (root.getAttribute('data-icst-dragging') === 'true') return 'dragging';
  if (root.getAttribute('data-icst-cursor-state') === 'loading') return 'loading';

  if (!(target instanceof Element)) return 'default';
  if (target.closest(':disabled, [aria-disabled="true"], .disabled')) return 'disabled';
  if (target.closest('[aria-busy="true"]')) return 'loading';
  if (target.closest('.excel-data-cell, .excel-fill-handle')) return 'cell';
  if (target.closest(TEXT_SEL)) return 'text';
  if (target.closest(INTERACTIVE_SEL)) return 'pointer';
  return 'default';
}

/**
 * GPU-composited 60fps Animated Cursor Companion Layer
 * Active ONLY for the 2 Animated Cursor Themes:
 *  - `pulse-orbit`: Magnetic orbital ring, live orbiting satellite dot & sonar click-wave
 *  - `prism-aurora`: Rotating chromatic aurora halo, 5-node kinetic comet trail & click spark burst
 *
 * Portals into `document.fullscreenElement || document.body` so animations stay visible
 * even inside Fullscreen Touch Typing & Word Express labs.
 */
export const IcstAnimatedCursorOverlay: React.FC = () => {
  const [prefs, setPrefs] = useState<CursorPreferencesState>(() => getCursorPreferences());
  const [portalTarget, setPortalTarget] = useState<Element | null>(() =>
    typeof document !== 'undefined' ? document.fullscreenElement || document.body : null
  );

  const layerRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const pulseRippleRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sparkRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isAnimatedTheme = prefs.theme === 'pulse-orbit' || prefs.theme === 'prism-aurora';

  useEffect(() => {
    return subscribeCursorPreferences(setPrefs);
  }, []);

  // Stay visible inside HTML5 Fullscreen elements (Touch Typing / Word Express)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onFullscreenChange = () => {
      setPortalTarget(document.fullscreenElement || document.body);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Main 60fps pointer tracking + animejs v4 click bursts
  useEffect(() => {
    if (!isAnimatedTheme) return;
    if (typeof window === 'undefined') return;

    // Respect reduced motion & disable on touch-only screens
    const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const layerEl = layerRef.current;
    const ringEl = ringRef.current;
    if (!layerEl || !ringEl) return;

    const scope = createScope({ root: layerEl });

    let visible = false;
    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let orbitAngle = 0;
    let lastHover: HoverKind = 'default';
    let lastTarget: EventTarget | null = null;
    let rafId = 0;

    // 5-node kinetic trail positions for Prism Aurora
    const trailPts = Array.from({ length: 5 }, () => ({ x: -100, y: -100 }));

    const setHoverKind = (next: HoverKind) => {
      if (next === lastHover) return;
      lastHover = next;
      ringEl.setAttribute('data-hover', next);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') {
        if (visible) {
          visible = false;
          layerEl.style.opacity = '0';
        }
        return;
      }

      targetX = e.clientX;
      targetY = e.clientY;

      if (!visible) {
        visible = true;
        ringX = targetX;
        ringY = targetY;
        for (let i = 0; i < trailPts.length; i++) {
          trailPts[i].x = targetX;
          trailPts[i].y = targetY;
        }
        layerEl.style.opacity = '1';
      }

      if (e.target !== lastTarget) {
        lastTarget = e.target;
        setHoverKind(classifyHoverTarget(e.target));
      }
    };

    const onPointerLeave = () => {
      visible = false;
      layerEl.style.opacity = '0';
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const cx = e.clientX;
      const cy = e.clientY;

      ringEl.setAttribute('data-pressed', 'true');

      if (prefs.theme === 'pulse-orbit' && pulseRippleRef.current) {
        const ripple = pulseRippleRef.current;
        ripple.style.left = `${cx}px`;
        ripple.style.top = `${cy}px`;
        scope.add(() => {
          animate(ripple, {
            scale: [0.35, 2.05],
            opacity: [0.85, 0],
            duration: 420,
            ease: 'outExpo',
          });
        });
      } else if (prefs.theme === 'prism-aurora') {
        const sparks = sparkRefs.current.filter((el): el is HTMLDivElement => el !== null);
        if (sparks.length > 0) {
          sparks.forEach((sp) => {
            sp.style.left = `${cx}px`;
            sp.style.top = `${cy}px`;
          });
          scope.add(() => {
            animate(sparks, {
              translateX: (_el, i = 0) => Math.cos((i * Math.PI * 2) / sparks.length) * 24,
              translateY: (_el, i = 0) => Math.sin((i * Math.PI * 2) / sparks.length) * 24,
              scale: [1.1, 0],
              opacity: [1, 0],
              duration: 460,
              delay: stagger(18),
              ease: 'outExpo',
            });
          });
        }
      }
    };

    const onPointerUp = () => {
      ringEl.removeAttribute('data-pressed');
    };

    const tick = () => {
      if (visible) {
        const lerp = prefs.theme === 'pulse-orbit' ? 0.22 : 0.26;
        ringX += (targetX - ringX) * lerp;
        ringY += (targetY - ringY) * lerp;

        const speed = lastHover === 'loading' ? 7.5 : lastHover === 'pointer' ? 3.2 : 1.7;
        orbitAngle = (orbitAngle + speed) % 360;

        ringEl.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;

        const rotator = ringEl.firstElementChild as HTMLElement | null;
        if (rotator) {
          rotator.style.transform = `rotate(${orbitAngle.toFixed(1)}deg)`;
        }

        if (prefs.theme === 'prism-aurora') {
          let prevX = targetX;
          let prevY = targetY;
          for (let i = 0; i < trailPts.length; i++) {
            const pt = trailPts[i];
            const follow = 0.34 - i * 0.045;
            pt.x += (prevX - pt.x) * follow;
            pt.y += (prevY - pt.y) * follow;
            prevX = pt.x;
            prevY = pt.y;

            const node = trailRefs.current[i];
            if (node) {
              const dist = Math.hypot(targetX - pt.x, targetY - pt.y);
              const alpha = Math.min(0.72, dist / 24) * (1 - i * 0.16);
              node.style.transform = `translate3d(${pt.x.toFixed(2)}px, ${pt.y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${(1 - i * 0.14).toFixed(2)})`;
              node.style.opacity = alpha.toFixed(3);
            }
          }
        }
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('blur', onPointerLeave, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      scope.revert();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
    };
  }, [isAnimatedTheme, prefs.theme]);

  if (!isAnimatedTheme || !portalTarget) return null;

  return createPortal(
    <div
      ref={layerRef}
      className={`icst-anim-cursor-layer theme-${prefs.theme} appearance-${prefs.resolvedAppearance}`}
      aria-hidden="true"
    >
      {/* Prism Aurora 5-node kinetic comet trail */}
      {prefs.theme === 'prism-aurora' &&
        [0, 1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            ref={(el) => {
              trailRefs.current[idx] = el;
            }}
            className={`icst-aurora-trail-dot dot-${idx}`}
          />
        ))}

      {/* Main animated orbital / aurora companion ring */}
      <div ref={ringRef} className="icst-anim-cursor-ring" data-hover="default">
        {prefs.theme === 'pulse-orbit' ? (
          <svg
            className="icst-orbit-svg"
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
          >
            <circle
              cx="22"
              cy="22"
              r="16.5"
              className="icst-orbit-track"
              strokeWidth="1.25"
              strokeDasharray="4 4"
            />
            <path
              d="M22 5.5A16.5 16.5 0 0 1 38.5 22"
              className="icst-orbit-arc"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <circle cx="38.5" cy="22" r="2.6" className="icst-orbit-satellite" />
          </svg>
        ) : (
          <div className="icst-aurora-ring-spinner">
            <span className="icst-aurora-ring-core" />
          </div>
        )}
      </div>

      {/* Pulse Orbit sonar click ripple */}
      {prefs.theme === 'pulse-orbit' && (
        <div ref={pulseRippleRef} className="icst-orbit-click-ripple" />
      )}

      {/* Prism Aurora 6-spark click burst */}
      {prefs.theme === 'prism-aurora' &&
        [0, 1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            ref={(el) => {
              sparkRefs.current[idx] = el;
            }}
            className={`icst-aurora-spark spark-${idx}`}
          />
        ))}
    </div>,
    portalTarget
  );
};
