import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  X, 
  Lock, 
  Unlock, 
  Maximize2, 
  Minimize2, 
  Move,
  Layers,
  Circle,
  Square,
  Volume2
} from 'lucide-react';

export type MagnifierMode = 'lens' | 'docked';
export type LensShape = 'circle' | 'rect';
export type LensSize = 'small' | 'medium' | 'large';

interface ScreenMagnifierProps {
  active: boolean;
  onClose: () => void;
  isSpeechActive?: boolean;
}

interface InspectedTargetInfo {
  text: string;
  contextLabel: string;
  tagName: string;
  isInputOrEditable: boolean;
  charCount: number;
}

export const ScreenMagnifier: React.FC<ScreenMagnifierProps> = ({
  active,
  onClose,
  isSpeechActive = false
}) => {
  const [zoomFactor, setZoomFactor] = useState<number>(2.0);
  const [mode, setMode] = useState<MagnifierMode>('lens');
  const [shape, setShape] = useState<LensShape>('circle');
  const [size, setSize] = useState<LensSize>('medium');
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 300, y: 300 });
  const [inspectedInfo, setInspectedInfo] = useState<InspectedTargetInfo | null>(null);

  // Debounced speech synthesizer
  const lastSpokenRef = useRef<string>('');
  const speechTimerRef = useRef<any>(null);

  // Dimension map for lens size
  const lensDimension = {
    small: { width: 200, height: 200 },
    medium: { width: 260, height: 260 },
    large: { width: 340, height: 340 }
  }[size];

  // Helper to extract clean text and context label from any hovered DOM node
  const inspectElement = useCallback((el: HTMLElement | null): InspectedTargetInfo | null => {
    if (!el || el.closest('.screen-magnifier-ignore')) return null;

    let text = '';
    let isInputOrEditable = false;

    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      isInputOrEditable = true;
      text = el.value || el.placeholder || '';
    } else if (el instanceof HTMLSelectElement) {
      isInputOrEditable = true;
      text = el.value || '';
    } else {
      // Prioritize explicit data values or inner text
      const sourceVal = el.closest('.source-val');
      const tableCell = el.closest('td, th');
      const badge = el.closest('.badge, .status-badge');
      
      if (sourceVal && sourceVal.textContent) {
        text = sourceVal.textContent.trim();
      } else if (tableCell && tableCell.textContent) {
        text = tableCell.textContent.trim();
      } else if (badge && badge.textContent) {
        text = badge.textContent.trim();
      } else {
        // Collect direct or clean text
        text = (el.innerText || el.textContent || '').trim();
        // If too long, take the first 160 characters
        if (text.length > 160) {
          text = text.substring(0, 160) + '...';
        }
      }
    }

    if (!text) {
      // Check title or alt or aria-label
      text = el.getAttribute('aria-label') || el.getAttribute('title') || (el as HTMLImageElement).alt || '';
    }

    if (!text) return null;

    // Detect Context Label
    let contextLabel = 'Page Content';
    const sourceItem = el.closest('.source-item');
    if (sourceItem) {
      const keyEl = sourceItem.querySelector('.source-key');
      if (keyEl && keyEl.textContent) {
        contextLabel = keyEl.textContent.trim();
      } else {
        contextLabel = 'Reference Dossier';
      }
    } else {
      const formGroup = el.closest('.form-group, .field-wrapper');
      if (formGroup) {
        const lbl = formGroup.querySelector('label, .field-label');
        if (lbl && lbl.textContent) {
          contextLabel = lbl.textContent.trim();
        }
      } else {
        const th = el.closest('tr')?.querySelector('th');
        if (th && th.textContent) {
          contextLabel = th.textContent.trim();
        } else {
          const cardHeader = el.closest('.card, .section, .box')?.querySelector('h2, h3, h4, .section-title');
          if (cardHeader && cardHeader.textContent) {
            contextLabel = cardHeader.textContent.trim();
          }
        }
      }
    }

    return {
      text,
      contextLabel,
      tagName: el.tagName.toLowerCase(),
      isInputOrEditable,
      charCount: text.length
    };
  }, []);

  // Track mouse coordinates & element under cursor
  useEffect(() => {
    if (!active) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isLocked) return;

      const x = e.clientX;
      const y = e.clientY;
      setMousePos({ x, y });

      // Identify element underneath
      const el = document.elementFromPoint(x, y) as HTMLElement | null;
      const info = inspectElement(el);
      if (info) {
        setInspectedInfo(info);

        // Voice Reader assistance
        if (isSpeechActive && 'speechSynthesis' in window) {
          if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
          speechTimerRef.current = setTimeout(() => {
            const speechText = `${info.contextLabel}: ${info.text}`;
            if (speechText !== lastSpokenRef.current && info.text.length < 80) {
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(speechText);
              utterance.rate = 1.05;
              utterance.pitch = 1.0;
              window.speechSynthesis.speak(utterance);
              lastSpokenRef.current = speechText;
            }
          }, 350);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoomFactor(prev => Math.min(4.0, +(prev + 0.5).toFixed(1)));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setZoomFactor(prev => Math.max(1.5, +(prev - 0.5).toFixed(1)));
      } else if (e.key.toLowerCase() === 'l' && !['input', 'textarea'].includes((document.activeElement?.tagName || '').toLowerCase())) {
        e.preventDefault();
        setIsLocked(prev => !prev);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [active, isLocked, isSpeechActive, inspectElement, onClose]);

  if (!active) return null;

  // Compute position for the floating lens (keep inside screen bounds)
  const lensWidth = lensDimension.width;
  const lensHeight = shape === 'circle' ? lensDimension.width : lensDimension.height * 0.75;
  const lensLeft = Math.min(Math.max(15, mousePos.x - lensWidth / 2), window.innerWidth - lensWidth - 15);
  const lensTop = Math.min(Math.max(15, mousePos.y - lensHeight / 2), window.innerHeight - lensHeight - 15);

  return (
    <div className="screen-magnifier-root screen-magnifier-ignore" role="dialog" aria-label="Govt Screen Magnifier Active">
      {/* 1. DOCKED MODE BANNER (Fixed top ribbon) */}
      {mode === 'docked' && (
        <div className="magnifier-docked-banner">
          <div className="docked-inner">
            <div className="docked-meta">
              <span className="docked-badge">GOVT SCREEN MAGNIFIER ({zoomFactor}x)</span>
              <span className="docked-context">
                {inspectedInfo ? inspectedInfo.contextLabel : 'Hover over any text, slip, or table'}
              </span>
            </div>
            <div className="docked-text-display">
              {inspectedInfo ? (
                <span className="docked-val">{inspectedInfo.text}</span>
              ) : (
                <span className="docked-placeholder">Move cursor over any document text or table cell to magnify...</span>
              )}
            </div>
            {inspectedInfo && (
              <div className="docked-char-breakdown">
                <span className="docked-char-count">{inspectedInfo.charCount} chars</span>
                <div className="docked-chars-pill">
                  {inspectedInfo.text.split('').map((char, idx) => (
                    <span key={idx} className="char-cell" title={`Char #${idx + 1}: ${char === ' ' ? 'Space' : char}`}>
                      {char === ' ' ? '␣' : char}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. FLOATING LENS MODE (Glass loupe following mouse cursor) */}
      {mode === 'lens' && (
        <div 
          className={`magnifier-floating-lens ${shape === 'circle' ? 'shape-circle' : 'shape-rect'} ${isLocked ? 'is-locked' : ''}`}
          style={{
            left: `${lensLeft}px`,
            top: `${lensTop}px`,
            width: `${lensWidth}px`,
            height: `${lensHeight}px`
          }}
        >
          {/* Bezel Rim & Glint Reflection */}
          <div className="lens-glass-reflection" />
          <div className="lens-crosshair-h" />
          <div className="lens-crosshair-v" />

          {/* Inspected Content Container */}
          <div className="lens-content-wrapper" style={{ transform: `scale(${zoomFactor >= 2.5 ? 1.05 : 1})` }}>
            {inspectedInfo ? (
              <div className="lens-inspected-card">
                <div className="lens-header-tag">
                  <span className="lens-ctx-label">{inspectedInfo.contextLabel}</span>
                  <span className="lens-zoom-tag">{zoomFactor}x</span>
                </div>
                
                <div className="lens-main-text">
                  {inspectedInfo.text}
                </div>

                {/* Character inspection for data-entry precision */}
                <div className="lens-char-stream">
                  {inspectedInfo.text.slice(0, 18).split('').map((c, i) => (
                    <span key={i} className="lens-char-box">
                      {c === ' ' ? '␣' : c}
                    </span>
                  ))}
                  {inspectedInfo.text.length > 18 && (
                    <span className="lens-more-tag">+{inspectedInfo.text.length - 18}</span>
                  )}
                </div>

                {isLocked && (
                  <div className="lens-locked-indicator">
                    <Lock size={10} /> <span>LOCKED (Press L or Lock icon to unlock)</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="lens-empty-prompt">
                <ZoomIn size={24} color="#60a5fa" />
                <span>Hover over text to inspect</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. FLOATING MAGNIFIER CONTROLLER HUD (Govt Inspection Bar) */}
      <div className="magnifier-controller-hud" role="toolbar" aria-label="Magnifier Controls">
        <div className="hud-header">
          <div className="hud-title-cluster">
            <ZoomIn size={14} color="#38bdf8" />
            <span className="hud-title">Govt Magnifier</span>
            <span className="hud-zoom-badge">{zoomFactor}x</span>
          </div>
          <button 
            type="button" 
            className="hud-close-btn" 
            onClick={onClose} 
            title="Close Magnifier (Esc)"
            aria-label="Close Magnifier"
          >
            <X size={14} />
          </button>
        </div>

        <div className="hud-controls-grid">
          {/* Zoom Factor Stepper */}
          <div className="hud-control-row">
            <span className="hud-lbl">Zoom Scale:</span>
            <div className="hud-stepper">
              <button
                type="button"
                className="hud-step-btn"
                onClick={() => setZoomFactor(prev => Math.max(1.5, +(prev - 0.5).toFixed(1)))}
                disabled={zoomFactor <= 1.5}
                title="Decrease Zoom Scale (-)"
              >
                <ZoomOut size={12} />
              </button>
              <div className="hud-factor-val">{zoomFactor}x</div>
              <button
                type="button"
                className="hud-step-btn"
                onClick={() => setZoomFactor(prev => Math.min(4.0, +(prev + 0.5).toFixed(1)))}
                disabled={zoomFactor >= 4.0}
                title="Increase Zoom Scale (+)"
              >
                <ZoomIn size={12} />
              </button>
            </div>
          </div>

          {/* Mode Selector (Lens Loupe vs Docked Ribbon) */}
          <div className="hud-control-row">
            <span className="hud-lbl">Layout Mode:</span>
            <div className="hud-segmented">
              <button
                type="button"
                className={`hud-seg-btn ${mode === 'lens' ? 'active' : ''}`}
                onClick={() => setMode('lens')}
                title="Floating Lens (Loupe follows mouse cursor)"
              >
                Loupe
              </button>
              <button
                type="button"
                className={`hud-seg-btn ${mode === 'docked' ? 'active' : ''}`}
                onClick={() => setMode('docked')}
                title="Docked Ribbon (Fixed top magnifier strip)"
              >
                Docked Ribbon
              </button>
            </div>
          </div>

          {/* Lens Shape & Size (Only in Lens mode) */}
          {mode === 'lens' && (
            <div className="hud-control-row">
              <span className="hud-lbl">Lens Shape:</span>
              <div className="hud-segmented">
                <button
                  type="button"
                  className={`hud-seg-btn ${shape === 'circle' ? 'active' : ''}`}
                  onClick={() => setShape('circle')}
                  title="Circular Glass Lens"
                >
                  <Circle size={11} /> Circle
                </button>
                <button
                  type="button"
                  className={`hud-seg-btn ${shape === 'rect' ? 'active' : ''}`}
                  onClick={() => setShape('rect')}
                  title="Rectangular Viewing Window"
                >
                  <Square size={11} /> Rect
                </button>
              </div>
            </div>
          )}

          {/* Lock / Freeze Frame Button */}
          <div className="hud-actions-strip">
            <button
              type="button"
              className={`hud-action-btn ${isLocked ? 'active-locked' : ''}`}
              onClick={() => setIsLocked(!isLocked)}
              title={isLocked ? 'Unlock lens position (Press L)' : 'Freeze lens position over this text to inspect without shaking (Press L)'}
            >
              {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
              <span>{isLocked ? 'Position Locked' : 'Freeze Position (L)'}</span>
            </button>
          </div>
        </div>

        <div className="hud-footer-hint">
          <span>Shortcuts: <strong>+ / -</strong> Zoom • <strong>L</strong> Freeze • <strong>Esc</strong> Close</span>
        </div>
      </div>
    </div>
  );
};
