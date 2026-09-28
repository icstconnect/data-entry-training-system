import React, { useState, useEffect, useRef } from 'react';

interface RenameModalProps {
  isOpen: boolean;
  initialName: string;
  isFolder: boolean;
  onClose: () => void;
  onSubmit: (newName: string) => void;
}

export const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  initialName,
  isFolder,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // If file, select filename without extension
          if (!isFolder && initialName.includes('.')) {
            const lastDot = initialName.lastIndexOf('.');
            inputRef.current.setSelectionRange(0, lastDot);
          } else {
            inputRef.current.select();
          }
        }
      }, 50);
    }
  }, [isOpen, initialName, isFolder]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  };

  return (
    <div className="win-modal-overlay" onClick={onClose}>
      <div 
        className="win-mica-window"
        style={{ width: '100%', maxWidth: '380px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '8px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <span>✏️</span> Rename {isFolder ? 'Folder' : 'File'}
          </h3>
          <button onClick={onClose} className="win-control-btn" style={{ width: '24px', height: '24px' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#cbd5e1' }}>New Name:</label>
            <input 
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '12px',
                color: '#ffffff',
                outline: 'none'
              }}
            />
            {!isFolder && (
              <span style={{ fontSize: '10px', color: '#fde047', opacity: 0.85 }}>
                Remember: Keep extension (.docx, .xlsx, .pptx) intact so apps can open it!
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '8px' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#cbd5e1',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{
                padding: '5px 16px',
                borderRadius: '6px',
                background: '#0078d4',
                border: 'none',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
