import React from 'react';
import { Maximize2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { TypingTheme } from '../../types/touchTyping';

export interface FullscreenRequiredGateProps {
  labName: string;
  theme: TypingTheme;
  onEnterFullscreen: () => void;
  onBackToDashboard: () => void;
  isMidSession?: boolean;
}

export const FullscreenRequiredGate: React.FC<FullscreenRequiredGateProps> = ({
  labName,
  theme,
  onEnterFullscreen,
  onBackToDashboard,
  isMidSession = false
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className="fs-required-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fs-required-title"
    >
      <div className={`fs-required-card ${isDark ? 'is-dark' : 'is-light'}`}>
        <div className="fs-required-icon">
          <Maximize2 size={26} />
        </div>

        <span className="fs-required-badge">
          <ShieldCheck size={12} />
          <span>Mandatory Full Screen Mode</span>
        </span>

        <h2 id="fs-required-title" className="fs-required-title">
          {isMidSession ? 'Full Screen Paused' : `Enter Full Screen for ${labName}`}
        </h2>

        <p className="fs-required-desc">
          {isMidSession
            ? 'You exited Full Screen mode. Re-enter Full Screen to resume your session with your current progress and streak intact.'
            : `${labName} requires Full Screen mode so the delivery runway, keyboard guide, and hand overlay align cleanly without browser distractions.`}
        </p>

        <div className="fs-required-actions">
          <button
            type="button"
            className="fs-required-primary-btn"
            onClick={onEnterFullscreen}
            autoFocus
          >
            <Maximize2 size={16} />
            <span>{isMidSession ? 'Re-Enter Full Screen & Resume' : 'Enter Full Screen & Begin'}</span>
          </button>

          <button
            type="button"
            className="fs-required-secondary-btn"
            onClick={onBackToDashboard}
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
