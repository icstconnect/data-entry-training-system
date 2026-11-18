import React, { useState, useEffect } from 'react';
import { HelpCircle, X, Languages, Sparkles } from 'lucide-react';
import { TypingTheme } from '../../types/touchTyping';
import {
  GuideLang,
  LabGuideContext,
  LAB_GUIDE_CONTENT,
  loadGuideLang,
  saveGuideLang
} from '../../services/labGuideService';

export interface LabGuideAssistantProps {
  context: LabGuideContext;
  theme: TypingTheme;
}

/**
 * Unobtrusive, Non-Blocking Floating Bilingual Guide Widget (English / সহজ বাংলা).
 * - Collapsed by default so it NEVER irritates or blocks visuals/typing.
 * - No dark backdrop: typing and all buttons remain 100% usable even while open.
 * - Auto-blurs on click so Space/Enter never accidentally re-toggle the guide.
 */
export const LabGuideAssistant: React.FC<LabGuideAssistantProps> = ({ context, theme }) => {
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<GuideLang>(() => loadGuideLang());

  useEffect(() => {
    const syncLang = (e: Event) => {
      const custom = e as CustomEvent<{ lang?: GuideLang }>;
      setLang(custom.detail?.lang || loadGuideLang());
    };
    window.addEventListener('icst_guide_lang_changed', syncLang);
    window.addEventListener('icst_data_cleared', syncLang);
    return () => {
      window.removeEventListener('icst_guide_lang_changed', syncLang);
      window.removeEventListener('icst_data_cleared', syncLang);
    };
  }, []);

  const handleSetLang = (next: GuideLang, e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    setLang(next);
    saveGuideLang(next);
  };

  const handleToggleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    setIsOpen(prev => !prev);
  };

  const bundle = LAB_GUIDE_CONTENT[context];

  return (
    <div
      className={`lab-guide-dock ${isDark ? 'is-dark' : 'is-light'}`}
      role="complementary"
      aria-label="English and Bengali Lab Helper"
    >
      {/* Compact Popover Card (Non-blocking — sits cleanly in bottom-right corner) */}
      {isOpen && (
        <div className="lab-guide-panel">
          <div className="lab-guide-panel-header">
            <div className="lab-guide-panel-title-wrap">
              <span className="lab-guide-panel-title">
                <Sparkles size={13} color="#0ea5e9" />
                <span>{lang === 'bn' ? bundle.titleBn : bundle.titleEn}</span>
              </span>
              <span className="lab-guide-panel-sub">
                {lang === 'bn' ? bundle.subtitleBn : bundle.subtitleEn}
              </span>
            </div>

            <button
              type="button"
              className="lab-guide-close"
              onClick={handleToggleOpen}
              aria-label="Close helper guide"
              tabIndex={-1}
            >
              <X size={14} />
            </button>
          </div>

          {/* Instant EN / সহজ বাংলা Language Toggle */}
          <div className="lab-guide-lang-switch" role="group" aria-label="Guide Language">
            <button
              type="button"
              tabIndex={-1}
              className={`lab-guide-lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={e => handleSetLang('en', e)}
            >
              English
            </button>
            <button
              type="button"
              tabIndex={-1}
              className={`lab-guide-lang-btn ${lang === 'bn' ? 'active' : ''}`}
              onClick={e => handleSetLang('bn', e)}
            >
              সহজ বাংলা
            </button>
          </div>

          {/* Easy-to-read Bullet Tips */}
          <ul className="lab-guide-tips">
            {bundle.tips.map((tip, idx) => (
              <li key={idx} className="lab-guide-tip-row">
                <span className="lab-guide-tip-ico" aria-hidden="true">{tip.icon}</span>
                <span className="lab-guide-tip-text">{lang === 'bn' ? tip.bn : tip.en}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Subtle Bottom-Right Trigger Pill */}
      <div className="lab-guide-trigger-row">
        <button
          type="button"
          tabIndex={-1}
          className="lab-guide-quick-lang"
          onClick={e => handleSetLang(lang === 'en' ? 'bn' : 'en', e)}
          title={lang === 'en' ? 'Switch guide to Easy Bengali (সহজ বাংলা)' : 'Switch guide to English'}
        >
          <Languages size={13} />
          <span>{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
        </button>

        <button
          type="button"
          tabIndex={-1}
          className={`lab-guide-pill-btn ${isOpen ? 'is-open' : ''}`}
          onClick={handleToggleOpen}
          title={lang === 'bn' ? 'সাহায্য ও গাইড দেখুন' : 'Open quick lab guide'}
        >
          <HelpCircle size={14} />
          <span>{lang === 'bn' ? 'গাইড' : 'Guide'}</span>
        </button>
      </div>
    </div>
  );
};
