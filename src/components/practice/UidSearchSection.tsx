import React, { useState, useEffect } from 'react';
import { Search, Shuffle, FileSearch, AlertCircle, Users } from 'lucide-react';
import { generateRandomUid, getPreloadedDummyPersons, SAMPLE_UIDS } from '../../services/syntheticDataGenerator';

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
  sampleUid = 'ICST-2026-001001'
}) => {
  const [inputVal, setInputVal] = useState(currentUid || sampleUid);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dummyPersons = getPreloadedDummyPersons();

  useEffect(() => {
    if (currentUid) {
      setInputVal(currentUid);
    }
  }, [currentUid]);

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
    let chosenUid = generateRandomUid();
    // Ensure we don't pick the exact same UID consecutively if possible
    if (chosenUid === inputVal) {
      chosenUid = generateRandomUid();
    }
    setInputVal(chosenUid);
    setErrorMessage(null);
    onLoadUid(chosenUid);
  };

  const handleSelectFromRoster = (selectedUid: string) => {
    if (!selectedUid) return;
    if (selectedUid === '__RANDOM__') {
      handleRandomize();
      return;
    }
    setInputVal(selectedUid);
    setErrorMessage(null);
    onLoadUid(selectedUid);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '170px' }}>
          <FileSearch size={18} color="var(--icst-blue)" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--icst-charcoal)' }}>
              LOAD SOURCE RECORD
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Pick from 25 profiles or enter UID
            </div>
          </div>
        </div>

        {/* 25 Student Roster Selector */}
        <div style={{ minWidth: '220px', flex: '1 1 240px' }}>
          <select
            className="field-input"
            style={{ fontSize: '12px', fontWeight: 500 }}
            value={dummyPersons.some(p => p.uid === inputVal) ? inputVal : ''}
            onChange={e => handleSelectFromRoster(e.target.value)}
            title="Quickly select any candidate from the 25 pre-generated student roster"
          >
            <option value="">📋 Select Candidate (25 Trainee Roster)...</option>
            <option value="__RANDOM__">🎲 [Randomize Candidate Record]</option>
            {dummyPersons.map((p, idx) => (
              <option key={p.uid} value={p.uid}>
                #{idx + 1}: {p.studentName} ({p.uid}) — {p.schoolName.substring(0, 24)}...
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 180px', display: 'flex', gap: '6px' }}>
          <input
            type="text"
            className="field-input"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase', minWidth: '120px' }}
            placeholder="e.g. ICST-2026-001001"
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
            title="Load source student record by entered UID"
          >
            <Search size={14} />
            <span>LOAD</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-sm"
            onClick={handleRandomize}
            style={{
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
            }}
            title="Randomize source record with a fresh candidate profile"
          >
            <Shuffle size={13} />
            <span>Randomize Record</span>
          </button>

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
