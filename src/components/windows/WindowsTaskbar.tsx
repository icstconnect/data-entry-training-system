import React, { useState, useEffect } from 'react';
import { WindowsSimulationMode } from '../../types/windows';

interface WindowsTaskbarProps {
  isExplorerOpen: boolean;
  onToggleExplorer: () => void;
  onToggleCopilot: () => void;
  onNewFolder: () => void;
  mode: WindowsSimulationMode;
  onSwitchMode: (mode: WindowsSimulationMode) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const WindowsTaskbar: React.FC<WindowsTaskbarProps> = ({
  isExplorerOpen,
  onToggleExplorer,
  onToggleCopilot,
  onNewFolder,
  mode,
  onSwitchMode,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hrs = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      const ampm = hrs >= 12 ? 'PM' : 'AM';
      hrs = hrs % 12 || 12;
      setTimeStr(`${hrs}:${mins} ${ampm}`);

      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      const da = String(now.getDate()).padStart(2, '0');
      setDateStr(`${yr}-${mo}-${da}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="win-taskbar">
      {/* Left: Weather Widget */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: '#cbd5e1',
          padding: '4px 8px',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
        title="Simulated Weather Widget"
      >
        <span>⛅ 24°C</span>
        <span style={{ color: '#94a3b8', fontSize: '11px' }}>Mostly Sunny</span>
      </div>

      {/* Center: Windows 11 App Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 auto' }}>
        {/* Windows Start Button */}
        <button 
          className="win-taskbar-btn"
          title="Windows 11 Start Menu"
          onClick={() => {}}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 3H10.5V10.5H3V3Z" fill="#0078D4"/>
            <path d="M13.5 3H21V10.5H13.5V3Z" fill="#0078D4"/>
            <path d="M3 13.5H10.5V21H3V13.5Z" fill="#0078D4"/>
            <path d="M13.5 13.5H21V21H13.5V13.5Z" fill="#0078D4"/>
          </svg>
        </button>

        {/* File Explorer with Active Indicator */}
        <button 
          className={`win-taskbar-btn ${isExplorerOpen ? 'active' : ''}`}
          onClick={onToggleExplorer}
          title="File Explorer (Toggle)"
          style={{ fontSize: '18px' }}
        >
          📁
          {isExplorerOpen && <span className="win-taskbar-indicator" />}
        </button>

        {/* Dita AI Copilot Toggle */}
        <button 
          className="win-taskbar-btn"
          onClick={onToggleCopilot}
          title="Dita AI Copilot"
          style={{ fontSize: '18px' }}
        >
          🤖
        </button>

        {/* Quick New Folder */}
        <button 
          className="win-taskbar-btn"
          onClick={onNewFolder}
          title="Quick New Folder"
          style={{ fontSize: '18px' }}
        >
          ➕
        </button>

        {/* Track Switcher Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.35)',
          padding: '2px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
          marginLeft: '4px'
        }}>
          <button
            onClick={() => onSwitchMode('file_management')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: 'none',
              background: mode === 'file_management' ? '#0078d4' : 'transparent',
              color: mode === 'file_management' ? '#ffffff' : '#94a3b8',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="File Management Mode (5 Levels)"
          >
            File Mode
          </button>
          <button
            onClick={() => onSwitchMode('folder_management')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: 'none',
              background: mode === 'folder_management' ? '#059669' : 'transparent',
              color: mode === 'folder_management' ? '#ffffff' : '#94a3b8',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Folder Management Mode (7 Levels)"
          >
            Folder Mode
          </button>
        </div>
      </div>

      {/* Right: System Tray & Clock & Fullscreen */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#cbd5e1' }}>
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="win-taskbar-btn"
            style={{
              width: 'auto',
              padding: '0 8px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600,
              background: isFullscreen ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${isFullscreen ? 'rgba(96, 165, 250, 0.5)' : 'rgba(255, 255, 255, 0.15)'}`,
              borderRadius: '6px',
              color: isFullscreen ? '#93c5fd' : '#f1f5f9'
            }}
            title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Enter Full Screen Window Mode'}
          >
            <span style={{ fontSize: '13px' }}>{isFullscreen ? '🗗' : '⛶'}</span>
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}</span>
          </button>
        )}

        <span style={{
          fontSize: '11px',
          background: 'rgba(59, 130, 246, 0.2)',
          color: '#93c5fd',
          padding: '2px 8px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          Dita with AI
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right', lineHeight: 1.15, cursor: 'default' }}>
          <span style={{ fontWeight: 600 }}>{timeStr || '10:42 AM'}</span>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>{dateStr || '2026-09-28'}</span>
        </div>
      </div>
    </div>
  );
};
