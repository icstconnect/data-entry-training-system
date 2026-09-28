import React from 'react';

export interface TooltipData {
  title: string;
  icon: string;
  en: string;
  bn: string;
  x: number;
  y: number;
}

interface BilingualTooltipProps {
  data: TooltipData | null;
}

export const BilingualTooltip: React.FC<BilingualTooltipProps> = ({ data }) => {
  if (!data) return null;

  const padding = 15;
  const width = 300;
  const height = 160;

  let left = data.x + padding;
  let top = data.y + padding;

  if (typeof window !== 'undefined') {
    if (left + width > window.innerWidth) {
      left = data.x - width - 10;
    }
    if (top + height > window.innerHeight) {
      top = data.y - height - 10;
    }
  }

  return (
    <div 
      className="win-bilingual-tooltip"
      style={{ left: `${Math.max(10, left)}px`, top: `${Math.max(10, top)}px` }}
    >
      <div className="win-tooltip-title-box">
        <span style={{ fontSize: '20px' }}>{data.icon}</span>
        <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {data.title}
        </span>
      </div>

      <div className="win-tooltip-en">
        <strong style={{ color: '#60a5fa' }}>English:</strong> {data.en}
      </div>

      <div className="win-tooltip-bn">
        <strong style={{ color: '#34d399' }}>বাংলা:</strong> {data.bn}
      </div>
    </div>
  );
};
