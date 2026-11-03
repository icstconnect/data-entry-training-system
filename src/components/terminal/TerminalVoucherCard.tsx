import React, { useState } from 'react';
import { TerminalVoucher, TerminalFieldDefinition } from '../../types/terminal';
import { Eye, ShieldCheck, AlertTriangle, ZoomIn, ZoomOut } from 'lucide-react';

interface TerminalVoucherCardProps {
  voucher: TerminalVoucher;
  fields: TerminalFieldDefinition[];
  activeFieldId: string;
  isDeskSlant?: boolean;
  onSelectField?: (fieldId: string) => void;
}

export const TerminalVoucherCard: React.FC<TerminalVoucherCardProps> = ({
  voucher,
  fields,
  activeFieldId,
  isDeskSlant = false,
  onSelectField
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isLoupeActive, setIsLoupeActive] = useState<boolean>(false);
  const [loupePos, setLoupePos] = useState<{ x: number; y: number }>({ x: 150, y: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLoupeActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLoupePos({ x, y });
  };

  return (
    <div 
      className={`voucher-paper-sheet ${isDeskSlant ? 'desk-slant' : ''}`}
      style={{ transform: isDeskSlant ? 'perspective(1000px) rotateX(4deg) scale(0.98)' : `scale(${zoomLevel / 100})` }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsLoupeActive(true)}
      onMouseLeave={() => setIsLoupeActive(false)}
    >
      {/* Optical Loupe 2.5x Magnifier Glass */}
      {isLoupeActive && (
        <div 
          className="optical-loupe-glass"
          style={{
            left: `${loupePos.x - 75}px`,
            top: `${loupePos.y - 75}px`
          }}
        >
          <div className="optical-loupe-crosshair" />
        </div>
      )}

      {/* Official Voucher Header Band */}
      <div className="voucher-header-band">
        <div className="voucher-issuer-name">{voucher.issuerOrg}</div>
        <div className="voucher-subtitle-text">{voucher.subtitle}</div>
        <div className="voucher-serial-corner">{voucher.voucherNumber}</div>
        <div style={{ fontSize: '10px', color: '#78350f', marginTop: '4px', fontWeight: 600 }}>
          DATE: {voucher.dateStamp}
        </div>
      </div>

      {/* Physical Voucher Data Fields */}
      <div className="voucher-fields-grid">
        {fields.map(field => {
          const isSpotlight = field.id === activeFieldId;
          const displayVal = voucher.visualData[field.id] !== undefined
            ? String(voucher.visualData[field.id])
            : '<UNAVAILABLE>';

          return (
            <div
              key={field.id}
              className={`voucher-field-cell ${isSpotlight ? 'is-spotlight' : ''}`}
              onClick={() => onSelectField && onSelectField(field.id)}
              style={{ cursor: 'pointer' }}
              title={`Click to focus field: ${field.label}`}
            >
              <div className="voucher-field-label">
                <span>{field.label}</span>
                {isSpotlight && <span style={{ color: '#b45309', marginLeft: '4px' }}>● FOCUS</span>}
              </div>
              <div className="voucher-field-value">
                {displayVal}
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Verification Rubber Stamp */}
      <div className={`voucher-rubber-stamp ${voucher.trapConfig.hasTrap ? 'trap-stamp' : ''}`}>
        {voucher.sealText || (voucher.trapConfig.hasTrap ? 'DISCREPANCY ALERT' : 'AUDIT PASSED')}
      </div>

      {/* Voucher Footer Controls */}
      <div style={{
        marginTop: '16px',
        paddingTop: '8px',
        borderTop: '1px solid #e2d7c5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '10px',
        color: '#786650'
      }}>
        <span>Official Instrument • Serial: {voucher.voucherNumber}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            type="button" 
            onClick={() => setZoomLevel(prev => Math.min(prev + 10, 130))}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
            title="Zoom In"
          >
            <ZoomIn size={12} color="#786650" />
          </button>
          <button 
            type="button" 
            onClick={() => setZoomLevel(prev => Math.max(prev - 10, 80))}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
            title="Zoom Out"
          >
            <ZoomOut size={12} color="#786650" />
          </button>
          <span>{zoomLevel}%</span>
        </div>
      </div>
    </div>
  );
};

