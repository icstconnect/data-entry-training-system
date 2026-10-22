import React from 'react';
import { 
  ZoomIn, 
  RotateCcw, 
  Contrast, 
  Volume2, 
  VolumeX, 
  ShieldCheck
} from 'lucide-react';

export type GovtFontSize = 'small' | 'normal' | 'large' | 'xlarge';
export type GovtZoomLevel = 90 | 100 | 115 | 125 | 130 | 150;
export type GovtContrastMode = 'standard' | 'high';

interface GovtAccessibilityBarProps {
  fontSize: GovtFontSize;
  setFontSize: (size: GovtFontSize) => void;
  zoomLevel: GovtZoomLevel;
  setZoomLevel: (zoom: GovtZoomLevel) => void;
  contrastMode: GovtContrastMode;
  setContrastMode: (mode: GovtContrastMode) => void;
  isMagnifierActive: boolean;
  setIsMagnifierActive: (active: boolean) => void;
  isSpeechActive: boolean;
  setIsSpeechActive: (active: boolean) => void;
  onReset: () => void;
}

export const GovtAccessibilityBar: React.FC<GovtAccessibilityBarProps> = ({
  fontSize,
  setFontSize,
  zoomLevel,
  setZoomLevel,
  contrastMode,
  setContrastMode,
  isMagnifierActive,
  setIsMagnifierActive,
  isSpeechActive,
  setIsSpeechActive,
  onReset
}) => {
  // Handler for text size buttons: simultaneously adjusts font size preset and page zoom
  const handleSetFontSize = (size: GovtFontSize) => {
    setFontSize(size);
    if (size === 'small') setZoomLevel(90);
    else if (size === 'normal') setZoomLevel(100);
    else if (size === 'large') setZoomLevel(115);
    else if (size === 'xlarge') setZoomLevel(130);
  };

  // Handler for explicit zoom percentages
  const handleSetZoomLevel = (lvl: GovtZoomLevel) => {
    setZoomLevel(lvl);
    if (lvl === 90) setFontSize('small');
    else if (lvl === 100) setFontSize('normal');
    else if (lvl === 115 || lvl === 125) setFontSize('large');
    else if (lvl === 130 || lvl === 150) setFontSize('xlarge');
  };

  return (
    <div className="govt-utility-bar" role="region" aria-label="Government Accessibility and Screen Magnifier Bar">
      {/* Tricolor National/State Govt Top Stripe */}
      <div className="govt-tricolor-stripe" aria-hidden="true">
        <span className="stripe-saffron" />
        <span className="stripe-white" />
        <span className="stripe-green" />
      </div>

      <div className="govt-bar-container">
        {/* Left: Official Institutional Identifier & Skip to Content */}
        <div className="govt-bar-left">
          <a href="#main-content" className="govt-skip-link">
            Skip to Main Content
          </a>
          <div className="govt-seal-badge">
            <ShieldCheck size={13} className="govt-seal-icon" />
            <span className="govt-seal-text">
              GOVT. RECOGNIZED ACCESSIBILITY PORTAL • GIGW COMPLIANT
            </span>
          </div>
        </div>

        {/* Right: Accessibility Controls & Screen Magnifier */}
        <div className="govt-bar-right">
          {/* Text Size Magnification (A- / A / A+ / A++) */}
          <div className="govt-control-group" title="Text Size Adjustment (Govt Portal Standard: A- A A+ A++)">
            <span className="govt-group-label">Text Size:</span>
            <div className="govt-btn-cluster">
              <button
                type="button"
                className={`govt-size-btn ${fontSize === 'small' ? 'active' : ''}`}
                onClick={() => handleSetFontSize('small')}
                title="Decrease Text Size (A- / 90% Scale)"
                aria-label="Decrease text size"
              >
                A-
              </button>
              <button
                type="button"
                className={`govt-size-btn ${fontSize === 'normal' ? 'active' : ''}`}
                onClick={() => handleSetFontSize('normal')}
                title="Default Normal Text Size (A / 100% Scale)"
                aria-label="Default normal text size"
              >
                A
              </button>
              <button
                type="button"
                className={`govt-size-btn ${fontSize === 'large' ? 'active' : ''}`}
                onClick={() => handleSetFontSize('large')}
                title="Increase Text Size (A+ / 115% Scale)"
                aria-label="Increase text size"
              >
                A+
              </button>
              <button
                type="button"
                className={`govt-size-btn ${fontSize === 'xlarge' ? 'active' : ''}`}
                onClick={() => handleSetFontSize('xlarge')}
                title="Extra Large Text Size (A++ / 130% Scale)"
                aria-label="Extra large text size"
              >
                A++
              </button>
            </div>
          </div>

          <div className="govt-divider" aria-hidden="true" />

          {/* Page Zoom Magnifier (100% | 115% | 125% | 150%) */}
          <div className="govt-control-group" title="Page Level Zoom Magnifier">
            <span className="govt-group-label">Zoom:</span>
            <div className="govt-btn-cluster">
              {([100, 115, 125, 150] as GovtZoomLevel[]).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  className={`govt-zoom-btn ${zoomLevel === lvl ? 'active' : ''}`}
                  onClick={() => handleSetZoomLevel(lvl)}
                  title={`Set Page Zoom to ${lvl}%`}
                >
                  {lvl}%
                </button>
              ))}
            </div>
          </div>

          <div className="govt-divider" aria-hidden="true" />

          {/* Dedicated Screen Magnifier Loupe Tool */}
          <button
            type="button"
            className={`govt-magnifier-btn ${isMagnifierActive ? 'active' : ''}`}
            onClick={() => setIsMagnifierActive(!isMagnifierActive)}
            title="Toggle Live Interactive Screen Magnifier (Shortcut: Alt + M)"
            aria-pressed={isMagnifierActive}
          >
            <ZoomIn size={14} />
            <span className="govt-magnifier-label">Screen Magnifier</span>
            <span className="govt-status-pill">
              {isMagnifierActive ? 'ON' : 'OFF'}
            </span>
            <span className="govt-kbd-hint">Alt+M</span>
          </button>

          <div className="govt-divider" aria-hidden="true" />

          {/* High Contrast Theme Switcher (Standard / High Contrast) */}
          <button
            type="button"
            className={`govt-contrast-btn ${contrastMode === 'high' ? 'active' : ''}`}
            onClick={() => setContrastMode(contrastMode === 'high' ? 'standard' : 'high')}
            title="High Contrast Mode (NIC/Govt Yellow-on-Black standard)"
            aria-pressed={contrastMode === 'high'}
          >
            <Contrast size={13} />
            <span>{contrastMode === 'high' ? 'High Contrast' : 'Standard'}</span>
          </button>

          {/* Screen Speech Reader Toggle */}
          <button
            type="button"
            className={`govt-speech-btn ${isSpeechActive ? 'active' : ''}`}
            onClick={() => setIsSpeechActive(!isSpeechActive)}
            title="Govt Voice Assistant: Read hovered fields aloud"
            aria-pressed={isSpeechActive}
          >
            {isSpeechActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>Voice</span>
          </button>

          {/* Reset All Accessibility & Zoom Controls */}
          <button
            type="button"
            className="govt-reset-btn"
            onClick={onReset}
            title="Reset text size, zoom, contrast, and magnifier to defaults"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
