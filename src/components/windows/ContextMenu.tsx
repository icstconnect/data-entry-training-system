import React from 'react';
import { VirtualItem } from '../../types/windows';

interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  targetItem: VirtualItem | null;
  hasClipboard: boolean;
  hasSelection: boolean;
  onOpenItem: () => void;
  onPasteIntoFolder: () => void;
  onCut: () => void;
  onCopy: () => void;
  onRename: () => void;
  onDelete: () => void;
  onPaste: () => void;
  onNewFolder: () => void;
  onSelectAll: () => void;
  onAudit: () => void;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  isOpen,
  targetItem,
  hasClipboard,
  hasSelection,
  onOpenItem,
  onPasteIntoFolder,
  onCut,
  onCopy,
  onRename,
  onDelete,
  onPaste,
  onNewFolder,
  onSelectAll,
  onAudit,
  onClose
}) => {
  if (!isOpen) return null;

  const isFolder = targetItem?.type === 'folder';

  // Boundary check
  const menuWidth = 220;
  const menuHeight = 280;
  let posX = x;
  let posY = y;
  if (typeof window !== 'undefined') {
    if (posX + menuWidth > window.innerWidth) posX = window.innerWidth - menuWidth - 10;
    if (posY + menuHeight > window.innerHeight) posY = window.innerHeight - menuHeight - 10;
  }

  const handleAction = (fn: () => void) => {
    fn();
    onClose();
  };

  return (
    <div 
      className="win-context-menu"
      style={{ left: `${Math.max(10, posX)}px`, top: `${Math.max(10, posY)}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      {targetItem && (
        <>
          <div className="win-ctx-item" onClick={() => handleAction(onOpenItem)}>
            <span>{isFolder ? '📂' : '👁️'}</span>
            <span>{isFolder ? `Open "${targetItem.name}"` : 'Open / Preview'}</span>
          </div>

          {isFolder && hasClipboard && (
            <div 
              className="win-ctx-item" 
              onClick={() => handleAction(onPasteIntoFolder)}
              style={{ color: '#6ee7b7', fontWeight: 600 }}
            >
              <span>📥</span>
              <span>Paste into this folder</span>
            </div>
          )}

          <div 
            className={`win-ctx-item ${!hasSelection ? 'disabled' : ''}`}
            onClick={() => handleAction(onCut)}
          >
            <span>✂️</span>
            <span>Cut</span>
            <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#94a3b8' }}>Ctrl+X</span>
          </div>

          <div 
            className={`win-ctx-item ${!hasSelection ? 'disabled' : ''}`}
            onClick={() => handleAction(onCopy)}
          >
            <span>📋</span>
            <span>Copy</span>
            <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#94a3b8' }}>Ctrl+C</span>
          </div>

          <div 
            className="win-ctx-item" 
            onClick={() => handleAction(onRename)}
          >
            <span>✏️</span>
            <span>Rename</span>
            <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#94a3b8' }}>F2</span>
          </div>

          <div 
            className="win-ctx-item win-ctx-item-danger" 
            onClick={() => handleAction(onDelete)}
            style={{ color: '#fca5a5' }}
          >
            <span>🗑️</span>
            <span>Delete</span>
            <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#94a3b8' }}>Del</span>
          </div>

          <div className="win-ctx-divider" />
        </>
      )}

      <div 
        className={`win-ctx-item ${!hasClipboard ? 'disabled' : ''}`}
        onClick={() => handleAction(onPaste)}
      >
        <span>📥</span>
        <span>Paste</span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#94a3b8' }}>Ctrl+V</span>
      </div>

      <div className="win-ctx-item" onClick={() => handleAction(onNewFolder)}>
        <span>➕</span>
        <span>New folder</span>
      </div>

      <div className="win-ctx-item" onClick={() => handleAction(onSelectAll)}>
        <span>📑</span>
        <span>Select all</span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#94a3b8' }}>Ctrl+A</span>
      </div>

      <div className="win-ctx-divider" />

      <div 
        className="win-ctx-item" 
        onClick={() => handleAction(onAudit)}
        style={{ color: '#6ee7b7' }}
      >
        <span>✨</span>
        <span>Audit with Dita AI</span>
      </div>
    </div>
  );
};
