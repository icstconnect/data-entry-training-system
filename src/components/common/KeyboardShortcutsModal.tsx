import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ onClose }) => {
  const shortcuts = [
    { key: 'Tab', desc: 'Advance to next field or table cell' },
    { key: 'Shift + Tab', desc: 'Return to previous field or table cell' },
    { key: 'Enter', desc: 'Confirm entry / Move to next row in marksheet' },
    { key: 'Arrow Keys', desc: 'Navigate between spreadsheet and marksheet cells' },
    { key: 'Ctrl + S / ⌘ + S', desc: 'Manually save current practice draft' },
    { key: 'Alt + R', desc: 'Open Review screen' },
    { key: 'Escape', desc: 'Close any active popup or inspection modal' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '460px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Keyboard size={18} color="var(--icst-blue)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Data Entry Operator Shortcuts</h3>
          </div>
          <button type="button" onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {shortcuts.map(s => (
              <div 
                key={s.key} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px'
                }}
              >
                <kbd style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontWeight: 600, 
                  background: '#ffffff', 
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  boxShadow: '0 1px 1px rgba(0,0,0,0.1)'
                }}>
                  {s.key}
                </kbd>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {s.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
