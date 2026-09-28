import React from 'react';
import { VirtualFile } from '../../../types/windows';
import { soundEffects } from '../../../services/soundEffects';

interface FilePreviewModalProps {
  file: VirtualFile | null;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, onClose }) => {
  if (!file) return null;

  const ext = (file.ext || '').toLowerCase();

  const getVisual = () => {
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
        return { icon: '🖼️', label: 'Image Photo' };
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

  const visual = getVisual();

  return (
    <div className="win-modal-overlay" onClick={onClose}>
      <div 
        className="win-mica-window"
        style={{
          width: '100%',
          maxWidth: '680px',
          height: '520px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div style={{
          height: '38px',
          padding: '0 14px',
          background: '#181a20',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600 }}>
            <span>{visual.icon}</span>
            <span>{visual.label} — {file.name}</span>
          </div>
          <button 
            onClick={onClose}
            className="win-control-btn win-control-btn-close"
            style={{ width: '28px', height: '24px' }}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          flex: 1,
          padding: '16px',
          background: '#14161b',
          overflowY: 'auto',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: '#e2e8f0',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {['docx', 'pdf', 'txt', 'py'].includes(ext) && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{
                background: '#1f2229',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                flex: 1,
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                fontFamily: 'var(--win-font)'
              }}>
                {file.preview || 'No text preview available.'}
              </div>
              <div style={{ marginTop: '10px', fontSize: '11px', color: '#94a3b8' }}>
                File Type: .{ext.toUpperCase()} | Size: {file.size} | Date: {file.date}
              </div>
            </div>
          )}

          {ext === 'pptx' && (
            <div style={{
              flex: 1,
              background: 'linear-gradient(135deg, rgba(124, 45, 18, 0.4), #0f172a)',
              border: '1px solid rgba(249, 115, 22, 0.25)',
              borderRadius: '8px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '48px', marginBottom: '12px' }}>📊</span>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fed7aa', marginBottom: '8px', fontFamily: 'var(--win-font)' }}>
                {file.name}
              </h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', maxWidth: '360px', whiteSpace: 'pre-line', lineHeight: 1.5, fontFamily: 'var(--win-font)' }}>
                {file.preview || 'Slide presentation'}
              </p>
            </div>
          )}

          {['xlsx', 'csv'].includes(ext) && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ overflowX: 'auto', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(6, 78, 59, 0.4)', color: '#6ee7b7', borderBottom: '1px solid rgba(5, 150, 105, 0.3)' }}>
                      <th style={{ padding: '8px', borderRight: '1px solid rgba(5, 150, 105, 0.3)' }}>#</th>
                      <th style={{ padding: '8px', borderRight: '1px solid rgba(5, 150, 105, 0.3)' }}>Column A</th>
                      <th style={{ padding: '8px', borderRight: '1px solid rgba(5, 150, 105, 0.3)' }}>Column B</th>
                      <th style={{ padding: '8px' }}>Value</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: '#cbd5e1' }}>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '8px', borderRight: '1px solid rgba(255, 255, 255, 0.05)', color: '#64748b' }}>1</td>
                      <td style={{ padding: '8px', borderRight: '1px solid rgba(255, 255, 255, 0.05)' }}>Dataset Metric</td>
                      <td style={{ padding: '8px', borderRight: '1px solid rgba(255, 255, 255, 0.05)' }}>Normalized</td>
                      <td style={{ padding: '8px', color: '#34d399', fontWeight: 600 }}>0.982</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '8px', borderRight: '1px solid rgba(255, 255, 255, 0.05)', color: '#64748b' }}>2</td>
                      <td style={{ padding: '8px', borderRight: '1px solid rgba(255, 255, 255, 0.05)' }}>Observations</td>
                      <td style={{ padding: '8px', borderRight: '1px solid rgba(255, 255, 255, 0.05)' }}>Valid</td>
                      <td style={{ padding: '8px', color: '#34d399', fontWeight: 600 }}>1,450</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px', borderRight: '1px solid rgba(255, 255, 255, 0.05)', color: '#64748b' }}>3</td>
                      <td style={{ padding: '8px', borderRight: '1px solid rgba(255, 255, 255, 0.05)' }}>Loss Error</td>
                      <td style={{ padding: '8px', borderRight: '1px solid rgba(255, 255, 255, 0.05)' }}>Stochastic</td>
                      <td style={{ padding: '8px', color: '#f87171', fontWeight: 600 }}>0.014</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '12px', fontSize: '11px', color: '#94a3b8', whiteSpace: 'pre-wrap' }}>
                {file.preview || ''}
              </div>
            </div>
          )}

          {['jpeg', 'png', 'jpg'].includes(ext) && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '16px'
            }}>
              <div style={{
                width: '220px',
                height: '160px',
                background: 'linear-gradient(135deg, #312e81, #6b21a8)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                🏞️
              </div>
              <span style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '12px', fontFamily: 'var(--win-font)' }}>
                {file.name}
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', fontFamily: 'var(--win-font)' }}>
                {file.preview || 'High-resolution image raster'}
              </span>
            </div>
          )}

          {ext === 'mp3' && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(80, 7, 36, 0.2)',
              borderRadius: '8px',
              border: '1px solid rgba(236, 72, 153, 0.2)',
              padding: '24px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '48px' }}>🎧</span>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fbcfe8', marginTop: '8px', fontFamily: 'var(--win-font)' }}>
                {file.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontFamily: 'var(--win-font)' }}>
                {file.preview || 'Audio Clip'}
              </p>
              <button 
                onClick={() => soundEffects.playTone('success')}
                style={{
                  marginTop: '16px',
                  padding: '6px 16px',
                  background: '#db2777',
                  color: '#ffffff',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ▶ Play Sample Synth Chime
              </button>
            </div>
          )}

          {ext === 'mp4' && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(69, 10, 10, 0.2)',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '24px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '48px' }}>🎬</span>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fecaca', marginTop: '8px', fontFamily: 'var(--win-font)' }}>
                {file.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontFamily: 'var(--win-font)' }}>
                {file.preview || 'Video Stream'}
              </p>
              <div style={{ width: '100%', maxWidth: '320px', background: '#334155', height: '6px', borderRadius: '3px', overflow: 'hidden', marginTop: '16px' }}>
                <div style={{ background: '#ef4444', height: '100%', width: '65%' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
