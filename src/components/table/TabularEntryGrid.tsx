import React, { useRef } from 'react';
import { TableColumn } from '../../types';

interface TabularEntryGridProps {
  columns: TableColumn[];
  rows: Record<string, any>[];
  onChange: (updatedRows: Record<string, any>[]) => void;
  sourceRows?: Record<string, any>[];
  isGuidedMode: boolean;
  tableName?: string;
}

export const TabularEntryGrid: React.FC<TabularEntryGridProps> = ({
  columns,
  rows,
  onChange,
  sourceRows,
  isGuidedMode,
  tableName = 'Tabular Data Entry'
}) => {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleCellChange = (rowIndex: number, colId: string, value: any) => {
    const updated = [...rows];
    updated[rowIndex] = {
      ...updated[rowIndex],
      [colId]: value
    };
    onChange(updated);
  };

  // Keyboard navigation across cells
  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
    let targetRow = rowIndex;
    let targetCol = colIndex;

    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      targetRow = Math.min(rows.length - 1, rowIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      targetRow = Math.max(0, rowIndex - 1);
    } else if (e.key === 'ArrowRight' && (e.target as HTMLInputElement).selectionEnd === (e.target as HTMLInputElement).value.length) {
      targetCol = Math.min(columns.length - 1, colIndex + 1);
    } else if (e.key === 'ArrowLeft' && (e.target as HTMLInputElement).selectionStart === 0) {
      targetCol = Math.max(0, colIndex - 1);
    }

    if (targetRow !== rowIndex || targetCol !== colIndex) {
      const nextColId = columns[targetCol].id;
      const refKey = `${targetRow}-${nextColId}`;
      const nextInput = inputRefs.current[refKey];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--icst-charcoal)' }}>
          {tableName}
        </h4>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Tip: Use <kbd style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: '3px' }}>Tab</kbd> or <kbd style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: '3px' }}>Enter</kbd> to move between cells
        </span>
      </div>

      <div className="table-wrapper">
        <table className="data-entry-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>#</th>
              {columns.map(col => (
                <th key={col.id} style={{ width: col.width || 'auto' }}>
                  {col.label} {col.required && <span style={{ color: 'var(--error-red)' }}>*</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const srcRow = sourceRows ? sourceRows[rowIndex] : undefined;

              return (
                <tr key={row.id || rowIndex}>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, background: '#f8fafc' }}>
                    {rowIndex + 1}
                  </td>
                  {columns.map((col, colIndex) => {
                    const cellVal = row[col.id] ?? '';
                    const srcVal = srcRow ? srcRow[col.id] : undefined;
                    const refKey = `${rowIndex}-${col.id}`;

                    const isCellWrong = isGuidedMode && srcRow && cellVal !== '' && 
                      String(cellVal).trim().toLowerCase() !== String(srcVal).trim().toLowerCase();

                    return (
                      <td key={col.id}>
                        <input
                          ref={el => { inputRefs.current[refKey] = el; }}
                          type={col.type === 'number' ? 'number' : 'text'}
                          className={`table-cell-input ${isCellWrong ? 'cell-guided-error' : ''}`}
                          placeholder={col.type === 'number' ? '0' : '...'}
                          value={cellVal}
                          onChange={e => handleCellChange(rowIndex, col.id, e.target.value)}
                          onKeyDown={e => handleKeyDown(e, rowIndex, colIndex)}
                          title={isCellWrong ? `Expected: ${srcVal}` : undefined}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
