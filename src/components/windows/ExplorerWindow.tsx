import React, { useState, useRef, useEffect } from 'react';
import { VirtualFolder, VirtualFile, VirtualItem, WindowsSimulationMode } from '../../types/windows';
import { TooltipData } from './BilingualTooltip';

interface ExplorerWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  mode: WindowsSimulationMode;
  levelNumber: number;
  levelBadge: string;
  currentFolderId: string;
  virtualFS: {
    folders: VirtualFolder[];
    files: VirtualFile[];
    recycleBin: VirtualItem[];
  };
  selectedItemIds: Set<string>;
  clipboard: { action: 'cut' | 'copy' | null; itemIds: string[] };
  onNavigateTo: (folderId: string) => void;
  onSelectItems: (ids: Set<string>) => void;
  onOpenItem: (item: VirtualItem) => void;
  onNewFolder: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onRename: () => void;
  onDelete: () => void;
  onCheckScore: () => void;
  onDropItems: (draggedIds: string[], targetFolderId: string | null) => void;
  onContextMenu: (e: React.MouseEvent, item: VirtualItem | null) => void;
  onShowTooltip: (data: TooltipData | null) => void;
  navHistory: string[];
  navIndex: number;
  onNavBack: () => void;
  onNavForward: () => void;
  onNavUp: () => void;
}

export const ExplorerWindow: React.FC<ExplorerWindowProps> = ({
  isOpen,
  onClose,
  onMinimize,
  mode,
  levelNumber,
  levelBadge,
  currentFolderId,
  virtualFS,
  selectedItemIds,
  clipboard,
  onNavigateTo,
  onSelectItems,
  onOpenItem,
  onNewFolder,
  onCut,
  onCopy,
  onPaste,
  onRename,
  onDelete,
  onCheckScore,
  onDropItems,
  onContextMenu,
  onShowTooltip,
  navHistory,
  navIndex,
  onNavBack,
  onNavForward,
  onNavUp
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [pos, setPos] = useState({ x: 90, y: 35 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, initX: 0, initY: 0 });

  // Dragging the titlebar
  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'button') return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initX: pos.x,
      initY: pos.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;
      setPos({
        x: Math.max(10, dragStartRef.current.initX + dx),
        y: Math.max(10, dragStartRef.current.initY + dy)
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  // Filter items in current directory
  let currentItems: VirtualItem[] = [];
  if (currentFolderId === 'recycle_bin') {
    currentItems = virtualFS.recycleBin;
  } else {
    const subfolders = virtualFS.folders.filter(f => f.parentId === currentFolderId);
    const files = virtualFS.files.filter(f => f.parentId === currentFolderId);
    currentItems = [...subfolders, ...files];
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    currentItems = currentItems.filter(item => item.name.toLowerCase().includes(q));
  }

  const getItemVisual = (item: VirtualItem) => {
    if (item.type === 'folder') {
      return { icon: item.icon || '📁', label: 'File folder' };
    }
    const ext = (item.ext || '').toLowerCase();
    switch (ext) {
      case 'docx':
      case 'doc':
        return { icon: '📘', label: 'Word Document' };
      case 'pptx':
      case 'ppt':
        return { icon: '📙', label: 'PowerPoint Presentation' };
      case 'xlsx':
      case 'xls':
      case 'csv':
        return { icon: '📗', label: 'Excel Spreadsheet' };
      case 'jpeg':
      case 'jpg':
      case 'png':
        return { icon: '🖼️', label: 'Image File' };
      case 'mp3':
      case 'wav':
        return { icon: '🎵', label: 'Audio Recording' };
      case 'mp4':
      case 'mov':
        return { icon: '🎬', label: 'Video Clip' };
      case 'pdf':
        return { icon: '📕', label: 'PDF Document' };
      default:
        return { icon: '📄', label: 'Text Document' };
    }
  };

  const handleItemClick = (e: React.MouseEvent, item: VirtualItem) => {
    e.stopPropagation();
    onShowTooltip(null);
    if (e.ctrlKey || e.metaKey) {
      const next = new Set(selectedItemIds);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      onSelectItems(next);
    } else {
      onSelectItems(new Set([item.id]));
    }
  };

  // Breadcrumbs chain
  const buildBreadcrumbs = () => {
    if (currentFolderId === 'recycle_bin') {
      return (
        <>
          <span 
            className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer"
            onClick={() => onNavigateTo('root')}
          >
            This PC
          </span>
          <span style={{ color: '#64748b' }}>›</span>
          <span style={{ color: '#ffffff', fontWeight: 600 }}>Recycle Bin</span>
        </>
      );
    }

    const chain: VirtualFolder[] = [];
    let cur = currentFolderId;
    while (cur && cur !== 'root') {
      const found = virtualFS.folders.find(f => f.id === cur);
      if (found) {
        chain.unshift(found);
        cur = found.parentId;
      } else {
        break;
      }
    }

    return (
      <>
        <span 
          style={{ cursor: 'pointer', padding: '2px 4px', borderRadius: '4px' }}
          onClick={() => onNavigateTo('root')}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const raw = e.dataTransfer.getData('text/plain');
            if (raw) onDropItems(JSON.parse(raw), 'root');
          }}
        >
          This PC
        </span>
        <span style={{ color: '#64748b' }}>›</span>
        <span 
          style={{ cursor: 'pointer', padding: '2px 4px', borderRadius: '4px' }}
          onClick={() => onNavigateTo('root')}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const raw = e.dataTransfer.getData('text/plain');
            if (raw) onDropItems(JSON.parse(raw), 'root');
          }}
        >
          Workspace (L{levelNumber})
        </span>

        {chain.map((folder, idx) => {
          const isLast = idx === chain.length - 1;
          return (
            <React.Fragment key={folder.id}>
              <span style={{ color: '#64748b' }}>›</span>
              <span
                style={{
                  cursor: 'pointer',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontWeight: isLast ? 600 : 400,
                  color: isLast ? '#ffffff' : '#cbd5e1'
                }}
                onClick={() => onNavigateTo(folder.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const raw = e.dataTransfer.getData('text/plain');
                  if (raw) onDropItems(JSON.parse(raw), folder.id);
                }}
              >
                {folder.name}
              </span>
            </React.Fragment>
          );
        })}
      </>
    );
  };

  const hasSelection = selectedItemIds.size > 0;
  const hasClipboard = clipboard.action !== null && clipboard.itemIds.length > 0;
  const recycleCount = virtualFS.recycleBin.length;

  return (
    <div
      className="win-mica-window win-explorer-window"
      style={{
        left: isMaximized ? '0px' : `${pos.x}px`,
        top: isMaximized ? '0px' : `${pos.y}px`,
        width: isMaximized ? '100vw' : '880px',
        height: isMaximized ? 'calc(100vh - 48px)' : '580px',
        borderRadius: isMaximized ? '0px' : '12px'
      }}
      onClick={() => onContextMenu({ clientX: 0, clientY: 0 } as any, null)}
    >
      {/* Title Bar */}
      <div 
        className="win-window-titlebar"
        onMouseDown={handleTitleBarMouseDown}
      >
        <div className="win-window-title-left">
          <span style={{ fontSize: '16px' }}>📁</span>
          <span>File Explorer — {mode === 'file_management' ? 'File Lab' : 'Folder Lab'} (Level {levelNumber})</span>
          <span style={{
            fontSize: '10px',
            background: mode === 'file_management' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(16, 185, 129, 0.25)',
            color: mode === 'file_management' ? '#93c5fd' : '#a7f3d0',
            border: `1px solid ${mode === 'file_management' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
            padding: '2px 8px',
            borderRadius: '12px',
            fontFamily: 'monospace'
          }}>
            {levelBadge}
          </span>
        </div>

        <div className="win-window-controls">
          <button 
            className="win-control-btn" 
            title="Minimize"
            onClick={onMinimize}
          >
            ─
          </button>
          <button 
            className="win-control-btn" 
            title={isMaximized ? 'Restore' : 'Maximize'}
            onClick={() => setIsMaximized(!isMaximized)}
          >
            {isMaximized ? '❐' : '□'}
          </button>
          <button 
            className="win-control-btn win-control-btn-close" 
            title="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Command Ribbon Toolbar */}
      <div className="win-ribbon-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
          <button 
            className="win-ribbon-btn win-ribbon-btn-primary"
            onClick={onNewFolder}
          >
            <span>➕</span> <span>New folder</span>
          </button>
          <div style={{ width: '1px', height: '20px', background: 'rgba(255, 255, 255, 0.15)', margin: '0 4px' }} />
          <button 
            className="win-ribbon-btn"
            disabled={!hasSelection}
            onClick={onCut}
            title="Cut (Ctrl+X)"
          >
            <span>✂️</span> <span>Cut</span>
          </button>
          <button 
            className="win-ribbon-btn"
            disabled={!hasSelection}
            onClick={onCopy}
            title="Copy (Ctrl+C)"
          >
            <span>📋</span> <span>Copy</span>
          </button>
          <button 
            className="win-ribbon-btn"
            disabled={!hasClipboard}
            onClick={onPaste}
            title="Paste (Ctrl+V)"
          >
            <span>📥</span> <span>Paste</span>
          </button>
          <button 
            className="win-ribbon-btn"
            disabled={selectedItemIds.size !== 1}
            onClick={onRename}
            title="Rename (F2)"
          >
            <span>✏️</span> <span>Rename</span>
          </button>
          <button 
            className="win-ribbon-btn"
            disabled={!hasSelection}
            onClick={onDelete}
            title="Delete (Del)"
            style={{ color: hasSelection ? '#fca5a5' : undefined }}
          >
            <span>🗑️</span> <span>Delete</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                border: 'none',
                background: viewMode === 'grid' ? '#0078d4' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : '#94a3b8',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                border: 'none',
                background: viewMode === 'list' ? '#0078d4' : 'transparent',
                color: viewMode === 'list' ? '#ffffff' : '#94a3b8',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              List
            </button>
          </div>

          <button
            onClick={onCheckScore}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #059669, #047857)',
              color: '#ffffff',
              border: 'none',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>✨</span> <span>Check Score</span>
          </button>
        </div>
      </div>

      {/* Navigation Toolbar */}
      <div className="win-nav-toolbar">
        <button 
          className="win-nav-arrow-btn"
          disabled={navIndex <= 0}
          onClick={onNavBack}
          title="Back (Alt+Left)"
        >
          🠔
        </button>
        <button 
          className="win-nav-arrow-btn"
          disabled={navIndex >= navHistory.length - 1}
          onClick={onNavForward}
          title="Forward (Alt+Right)"
        >
          🠖
        </button>
        <button 
          className="win-nav-arrow-btn"
          disabled={currentFolderId === 'root' || currentFolderId === 'recycle_bin'}
          onClick={onNavUp}
          title="Up to Parent (Alt+Up)"
        >
          🠕
        </button>

        {/* Address Bar */}
        <div className="win-address-bar">
          {buildBreadcrumbs()}
        </div>

        {/* Search */}
        <div className="win-search-box">
          <input 
            type="text"
            className="win-search-input"
            placeholder="Search Workspace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span style={{ position: 'absolute', left: '8px', top: '7px', fontSize: '11px', color: '#94a3b8' }}>🔍</span>
        </div>
      </div>

      {/* Main Split: Left Sidebar + Right Canvas */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* Left Quick Access Tree */}
        <div className="win-sidebar-tree">
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '4px 6px' }}>
            Quick Access
          </div>

          <div 
            className={`win-sidebar-item ${currentFolderId === 'root' ? 'active' : ''}`}
            onClick={() => onNavigateTo('root')}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const raw = e.dataTransfer.getData('text/plain');
              if (raw) onDropItems(JSON.parse(raw), 'root');
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🏠</span> <span>Workspace Root</span>
            </span>
          </div>

          <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '8px 6px 4px' }}>
            Folders Tree
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {virtualFS.folders.map(folder => {
              const childCount = virtualFS.files.filter(f => f.parentId === folder.id).length + 
                                 virtualFS.folders.filter(f => f.parentId === folder.id).length;
              const isSelected = currentFolderId === folder.id;
              return (
                <div
                  key={folder.id}
                  className={`win-sidebar-item ${isSelected ? 'active' : ''}`}
                  onClick={() => onNavigateTo(folder.id)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('dropzone-hover');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('dropzone-hover');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('dropzone-hover');
                    const raw = e.dataTransfer.getData('text/plain');
                    if (raw) onDropItems(JSON.parse(raw), folder.id);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                    <span>{folder.icon || '📁'}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {folder.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace' }}>
                    {childCount}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div 
              className={`win-sidebar-item ${currentFolderId === 'recycle_bin' ? 'active' : ''}`}
              onClick={() => onNavigateTo('recycle_bin')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const raw = e.dataTransfer.getData('text/plain');
                if (raw) onDropItems(JSON.parse(raw), 'recycle_bin');
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🗑️</span> <span>Recycle Bin</span>
              </span>
              <span style={{ fontSize: '10px', background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace' }}>
                {recycleCount}
              </span>
            </div>
          </div>
        </div>

        {/* Right Canvas Area */}
        <div 
          className="win-canvas-area"
          onClick={() => {
            onSelectItems(new Set());
            onShowTooltip(null);
          }}
          onContextMenu={(e) => {
            if ((e.target as HTMLElement).closest('.win-item-card, .win-item-list-row')) return;
            e.preventDefault();
            onContextMenu(e, null);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const raw = e.dataTransfer.getData('text/plain');
            if (raw) onDropItems(JSON.parse(raw), currentFolderId);
          }}
        >
          {/* Drop Banner / Helper */}
          <div className="win-drop-banner">
            <span>
              {currentFolderId === 'recycle_bin' 
                ? 'Recycle Bin: Contains deleted files. Select items to Restore or Delete permanently.'
                : mode === 'file_management'
                  ? 'Drag files into matching folders or use Cut/Copy & Paste (Ctrl+X / Ctrl+V).'
                  : 'Construct the required folder tree! Use "➕ New folder", F2 Rename, and Del to delete junk.'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {hasClipboard && (
                <span style={{
                  fontSize: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  color: '#fbbf24',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontFamily: 'monospace'
                }}>
                  Clipboard: {clipboard.action?.toUpperCase()} ({clipboard.itemIds.length})
                </span>
              )}
              <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                {currentItems.length} item{currentItems.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* Files / Folders List / Grid */}
          <div className="win-file-items-container">
            {currentItems.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', gap: '8px' }}>
                <span style={{ fontSize: '32px' }}>📂</span>
                <span style={{ fontSize: '12px' }}>This folder is currently empty.</span>
                {hasClipboard && (
                  <button 
                    onClick={onPaste}
                    style={{
                      marginTop: '8px',
                      padding: '4px 12px',
                      background: '#0078d4',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    📥 Paste items here
                  </button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="win-file-items-grid">
                {currentItems.map(item => {
                  const visual = getItemVisual(item);
                  const isSelected = selectedItemIds.has(item.id);
                  const isCut = clipboard.action === 'cut' && clipboard.itemIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      draggable
                      className={`win-item-card ${isSelected ? 'selected' : ''} ${isCut ? 'item-cut' : ''}`}
                      onClick={(e) => handleItemClick(e, item)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onShowTooltip(null);
                        onOpenItem(item);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!selectedItemIds.has(item.id)) {
                          onSelectItems(new Set([item.id]));
                        }
                        onContextMenu(e, item);
                      }}
                      onDragStart={(e) => {
                        if (!selectedItemIds.has(item.id)) {
                          onSelectItems(new Set([item.id]));
                        }
                        const idsToMove = selectedItemIds.has(item.id) 
                          ? Array.from(selectedItemIds) 
                          : [item.id];
                        e.dataTransfer.setData('text/plain', JSON.stringify(idsToMove));
                        e.currentTarget.classList.add('item-dragging');
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.classList.remove('item-dragging');
                      }}
                      onDragOver={(e) => {
                        if (item.type === 'folder') {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.add('dropzone-hover');
                        }
                      }}
                      onDragLeave={(e) => {
                        if (item.type === 'folder') {
                          e.currentTarget.classList.remove('dropzone-hover');
                        }
                      }}
                      onDrop={(e) => {
                        if (item.type === 'folder') {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.remove('dropzone-hover');
                          const raw = e.dataTransfer.getData('text/plain');
                          if (raw) onDropItems(JSON.parse(raw), item.id);
                        }
                      }}
                      onMouseEnter={(e) => {
                        onShowTooltip({
                          title: item.infoTitle || item.name,
                          icon: visual.icon,
                          en: item.infoEn || `Standard item stored in file system.`,
                          bn: item.infoBn || `এটি অপারেটিং সিস্টেমের একটি ফাইল বা ফোল্ডার।`,
                          x: e.clientX,
                          y: e.clientY
                        });
                      }}
                      onMouseMove={(e) => {
                        onShowTooltip({
                          title: item.infoTitle || item.name,
                          icon: visual.icon,
                          en: item.infoEn || `Standard item stored in file system.`,
                          bn: item.infoBn || `এটি অপারেটিং সিস্টেমের একটি ফাইল বা ফোল্ডার।`,
                          x: e.clientX,
                          y: e.clientY
                        });
                      }}
                      onMouseLeave={() => onShowTooltip(null)}
                    >
                      <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', pointerEvents: 'none' }}>
                        {visual.icon}
                      </div>
                      <span style={{
                        fontSize: '11px',
                        textAlign: 'center',
                        color: '#f1f5f9',
                        marginTop: '4px',
                        wordBreak: 'break-word',
                        pointerEvents: 'none',
                        maxWidth: '95px'
                      }}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="win-file-items-list">
                <div style={{ display: 'flex', alignItems: 'center', padding: '4px 12px', fontSize: '11px', fontWeight: 600, color: '#94a3b8', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ flex: 1 }}>Name</div>
                  <div style={{ width: '90px', textAlign: 'right' }}>Date</div>
                  <div style={{ width: '110px', textAlign: 'right' }}>Type</div>
                  <div style={{ width: '80px', textAlign: 'right' }}>Size</div>
                </div>

                {currentItems.map(item => {
                  const visual = getItemVisual(item);
                  const isSelected = selectedItemIds.has(item.id);
                  const isCut = clipboard.action === 'cut' && clipboard.itemIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      draggable
                      className={`win-item-list-row ${isSelected ? 'selected' : ''} ${isCut ? 'item-cut' : ''}`}
                      onClick={(e) => handleItemClick(e, item)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onShowTooltip(null);
                        onOpenItem(item);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!selectedItemIds.has(item.id)) {
                          onSelectItems(new Set([item.id]));
                        }
                        onContextMenu(e, item);
                      }}
                      onDragStart={(e) => {
                        if (!selectedItemIds.has(item.id)) {
                          onSelectItems(new Set([item.id]));
                        }
                        const idsToMove = selectedItemIds.has(item.id) 
                          ? Array.from(selectedItemIds) 
                          : [item.id];
                        e.dataTransfer.setData('text/plain', JSON.stringify(idsToMove));
                      }}
                      onDragOver={(e) => {
                        if (item.type === 'folder') {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.add('dropzone-hover');
                        }
                      }}
                      onDragLeave={(e) => {
                        if (item.type === 'folder') {
                          e.currentTarget.classList.remove('dropzone-hover');
                        }
                      }}
                      onDrop={(e) => {
                        if (item.type === 'folder') {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.remove('dropzone-hover');
                          const raw = e.dataTransfer.getData('text/plain');
                          if (raw) onDropItems(JSON.parse(raw), item.id);
                        }
                      }}
                      onMouseEnter={(e) => {
                        onShowTooltip({
                          title: item.infoTitle || item.name,
                          icon: visual.icon,
                          en: item.infoEn || `Standard item stored in file system.`,
                          bn: item.infoBn || `এটি অপারেটিং সিস্টেমের একটি ফাইল বা ফোল্ডার।`,
                          x: e.clientX,
                          y: e.clientY
                        });
                      }}
                      onMouseMove={(e) => {
                        onShowTooltip({
                          title: item.infoTitle || item.name,
                          icon: visual.icon,
                          en: item.infoEn || `Standard item stored in file system.`,
                          bn: item.infoBn || `এটি অপারেটিং সিস্টেমের একটি ফাইল বা ফোল্ডার।`,
                          x: e.clientX,
                          y: e.clientY
                        });
                      }}
                      onMouseLeave={() => onShowTooltip(null)}
                    >
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <span style={{ fontSize: '15px' }}>{visual.icon}</span>
                        <span style={{ color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </span>
                      </div>
                      <div style={{ width: '90px', textAlign: 'right', color: '#94a3b8', fontSize: '11px' }}>
                        {(item as VirtualFile).date || '2026-09-28'}
                      </div>
                      <div style={{ width: '110px', textAlign: 'right', color: '#94a3b8', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {visual.label}
                      </div>
                      <div style={{ width: '80px', textAlign: 'right', color: '#94a3b8', fontSize: '11px' }}>
                        {(item as VirtualFile).size || '--'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="win-statusbar">
            <span>{selectedItemIds.size} item{selectedItemIds.size === 1 ? '' : 's'} selected</span>
            <span style={{ color: '#64748b' }}>
              Tip: Cut (Ctrl+X), Copy (Ctrl+C), Paste (Ctrl+V), Rename (F2), Delete (Del)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
