import React, { useState } from 'react';
import { Search, Shuffle, FileSearch, AlertCircle } from 'lucide-react';
import { generateRandomUid } from '../../services/syntheticDataGenerator';

interface UidSearchSectionProps {
  currentUid: string;
  onLoadUid: (uid: string) => void;
  isLoading?: boolean;
  sampleUid?: string;
}

export const UidSearchSection: React.FC<UidSearchSectionProps> = ({
  currentUid,
  onLoadUid,
  isLoading = false,
  sampleUid = 'ICST-2026-001010'
}) => {
  const [inputVal, setInputVal] = useState(currentUid || sampleUid);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim().toUpperCase();
    if (!trimmed) {
      setErrorMessage('Please enter a valid student UID');
      return;
    }
    setErrorMessage(null);
    onLoadUid(trimmed);
  };

  const handleRandomize = () => {
    const randomUid = generateRandomUid();
    setInputVal(randomUid);
    setErrorMessage(null);
    onLoadUid(randomUid);
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      padding: '12px 16px',
      marginBottom: '16px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px' }}>
          <FileSearch size={18} color="var(--icst-blue)" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--icst-charcoal)' }}>
              LOAD SOURCE RECORD
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Enter assigned UID or generate
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '220px', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="field-input"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase' }}
            placeholder="e.g. ICST-2026-001010"
            value={inputVal}
            onChange={e => {
              setInputVal(e.target.value);
              setErrorMessage(null);
            }}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={isLoading}
          >
            <Search size={14} />
            <span>LOAD DATA</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setInputVal(sampleUid);
              onLoadUid(sampleUid);
            }}
            title="Reset to stage assigned sample UID"
          >
            Default UID
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleRandomize}
            title="Generate a fresh randomized UID record"
          >
            <Shuffle size={13} />
            <span>New Record</span>
          </button>
        </div>
      </form>

      {errorMessage && (
        <div style={{
          marginTop: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: 'var(--error-red)',
          fontWeight: 600
        }}>
          <AlertCircle size={14} />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
