import React, { useState } from 'react';
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
    // Randomly pick one of the 25 preloaded dummy persons or generate a random one
    const randomPerson = dummyPersons[Math.floor(Math.random() * dummyPersons.length)];
    const chosenUid = randomPerson ? randomPerson.uid : generateRandomUid();
    setInputVal(chosenUid);
    setErrorMessage(null);
    onLoadUid(chosenUid);
  };

  const handleSelectFromRoster = (selectedUid: string) => {
    if (!selectedUid) return;
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
          >
            <Search size={14} />
            <span>LOAD</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
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
            title="Randomly select one of the 25 candidate profiles"
          >
            <Shuffle size={13} />
            <span>Random Student</span>
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
