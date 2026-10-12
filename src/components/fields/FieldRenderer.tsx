import React, { useState } from 'react';
import { FieldDefinition, SourceRecord, ValidationMode } from '../../types';
import { validateField } from '../../services/validationEngine';
import { AlertCircle, Check, X, Search, Calendar, ChevronDown } from 'lucide-react';
import { SCHOOLS, ACTIVITIES } from '../../services/syntheticDataGenerator';

interface FieldRendererProps {
  field: FieldDefinition;
  value: any;
  onChange: (val: any) => void;
  sourceRecord?: SourceRecord;
  isGuidedMode: boolean;
  validationMode?: ValidationMode;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  sourceRecord,
  isGuidedMode,
  validationMode = 'NORMAL'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [chipInputValue, setChipInputValue] = useState('');
  const [isChipDropdownOpen, setIsChipDropdownOpen] = useState(false);
  const [highlightedChipIndex, setHighlightedChipIndex] = useState(-1);

  // Evaluate guided feedback if guided mode is on and sourceRecord is present
  const guidedValidation = (isGuidedMode && sourceRecord) 
    ? validateField(sourceRecord, { [field.id]: value }, field, validationMode)
    : null;

  const hasGuidedError = isGuidedMode && guidedValidation && guidedValidation.status === 'incorrect';
  const hasGuidedMissing = isGuidedMode && guidedValidation && guidedValidation.status === 'missing' && (value !== undefined && value !== '');
  const isGuidedValid = isGuidedMode && guidedValidation && guidedValidation.status === 'correct' && value !== undefined && value !== '';

  const inputClass = `field-input ${
    hasGuidedError || hasGuidedMissing ? 'has-error' : isGuidedValid ? 'is-valid-guided' : ''
  }`;

  // Smart Chips Handler
  const currentChips: string[] = Array.isArray(value) ? value : [];

  const handleAddChip = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!currentChips.includes(trimmed)) {
      onChange([...currentChips, trimmed]);
    }
    setChipInputValue('');
  };

  const handleRemoveChip = (indexToRemove: number) => {
    onChange(currentChips.filter((_, i) => i !== indexToRemove));
  };

  // Render based on field type
  const renderControl = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={`field-${field.id}`}
            className={inputClass}
            rows={3}
            placeholder={field.placeholder || ''}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
          />
        );

      case 'date': {
        const datePlaceholder = field.placeholder || 'YYYY-MM-DD';
        return (
          <div className="date-input-container">
            <input
              type="text"
              id={`field-${field.id}`}
              className={`${inputClass} date-text-input`}
              placeholder={datePlaceholder}
              value={value ?? ''}
              maxLength={10}
              inputMode="numeric"
              autoComplete="off"
              onChange={e => {
                const raw = e.target.value;
                // If user is deleting/backspacing, allow naturally
                if (raw.length < (value || '').length) {
                  onChange(raw);
                  return;
                }
                // Strip characters other than digits, dashes, and slashes
                const cleaned = raw.replace(/[^\d-/]/g, '');
                const digits = cleaned.replace(/\D/g, '');

                // If user enters pure digits without separator, auto-format to YYYY-MM-DD
                if (!cleaned.includes('-') && !cleaned.includes('/')) {
                  if (digits.length <= 4) {
                    onChange(digits);
                  } else if (digits.length <= 6) {
                    onChange(`${digits.slice(0, 4)}-${digits.slice(4)}`);
                  } else {
                    onChange(`${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`);
                  }
                } else {
                  onChange(cleaned);
                }
              }}
              onBlur={() => {
                if (value) {
                  const str = String(value).trim();
                  // Normalize DD-MM-YYYY or DD/MM/YYYY to YYYY-MM-DD
                  const ddmmyyyy = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
                  if (ddmmyyyy) {
                    const d = ddmmyyyy[1].padStart(2, '0');
                    const m = ddmmyyyy[2].padStart(2, '0');
                    const y = ddmmyyyy[3];
                    onChange(`${y}-${m}-${d}`);
                  } else if (/^\d{4}\/\d{2}\/\d{2}$/.test(str)) {
                    onChange(str.replace(/\//g, '-'));
                  }
                }
              }}
            />
            {/* Clickable calendar picker trigger button */}
            <label 
              htmlFor={`native-date-${field.id}`} 
              className="date-picker-trigger" 
              title="Open calendar picker"
            >
              <Calendar size={15} color="var(--icst-blue)" />
              <input
                type="date"
                id={`native-date-${field.id}`}
                tabIndex={-1}
                className="date-picker-native-hidden"
                value={/^\d{4}-\d{2}-\d{2}$/.test(value ?? '') ? value : ''}
                onChange={e => {
                  if (e.target.value) {
                    onChange(e.target.value);
                  }
                }}
              />
            </label>
          </div>
        );
      }

      case 'number':
      case 'decimal':
        return (
          <input
            type="number"
            step={field.type === 'decimal' ? '0.1' : '1'}
            id={`field-${field.id}`}
            className={inputClass}
            placeholder={field.placeholder || (field.type === 'decimal' ? '0.0' : '0')}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
          />
        );

      case 'select': {
        const isPrefix = field.id.toLowerCase().includes('prefix');
        const hasEmptyOption = field.options?.some(opt => opt.value === '');
        return (
          <select
            id={`field-${field.id}`}
            className={`${inputClass} ${isPrefix ? 'field-select-prefix' : ''}`}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
          >
            {!hasEmptyOption && (
              <option value="">
                {`-- Select ${field.label} --`}
              </option>
            )}
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      }

      case 'searchable-select': {
        const optionsList = field.options && field.options.length > 0 
          ? field.options 
          : SCHOOLS.map(s => ({ label: s.name, value: s.name }));

        const filteredOptions = optionsList.filter(opt =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div style={{ position: 'relative' }} className="searchable-select-wrapper">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                id={`field-${field.id}`}
                className={inputClass}
                style={{ paddingRight: '56px', cursor: 'text' }}
                placeholder={field.placeholder || 'Type or select institution...'}
                value={isSearchOpen ? searchTerm : (value ?? '')}
                onFocus={() => {
                  setSearchTerm(value ? String(value) : '');
                  setIsSearchOpen(true);
                  setHighlightedIndex(-1);
                }}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                  setHighlightedIndex(0);
                }}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (!isSearchOpen) {
                      setIsSearchOpen(true);
                    } else {
                      setHighlightedIndex(prev => Math.min(filteredOptions.length - 1, prev + 1));
                    }
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setHighlightedIndex(prev => Math.max(0, prev - 1));
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (isSearchOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                      onChange(filteredOptions[highlightedIndex].value);
                      setIsSearchOpen(false);
                      setSearchTerm('');
                    } else if (filteredOptions.length > 0) {
                      onChange(filteredOptions[0].value);
                      setIsSearchOpen(false);
                      setSearchTerm('');
                    }
                  } else if (e.key === 'Escape') {
                    setIsSearchOpen(false);
                  } else if (e.key === 'Tab') {
                    if (isSearchOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                      onChange(filteredOptions[highlightedIndex].value);
                    } else if (isSearchOpen && searchTerm) {
                      const exact = optionsList.find(o => o.label.toLowerCase() === searchTerm.toLowerCase());
                      if (exact) onChange(exact.value);
                    }
                    setIsSearchOpen(false);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setIsSearchOpen(false);
                  }, 250);
                }}
                autoComplete="off"
              />
              <div style={{
                position: 'absolute',
                right: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                pointerEvents: 'none'
              }}>
                {value && (
                  <span
                    style={{ cursor: 'pointer', pointerEvents: 'auto', color: 'var(--text-muted)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange('');
                      setSearchTerm('');
                    }}
                    title="Clear selection"
                  >
                    <X size={13} />
                  </span>
                )}
                <span
                  style={{ cursor: 'pointer', pointerEvents: 'auto', display: 'flex', alignItems: 'center' }}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <ChevronDown size={14} color="var(--text-muted)" />
                </span>
              </div>
            </div>

            {isSearchOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 50,
                  background: '#ffffff',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  marginTop: '4px',
                  maxHeight: '230px',
                  overflowY: 'auto'
                }}
              >
                <div style={{ padding: '4px 10px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{filteredOptions.length} available institutions</span>
                  <span>Use ↑↓ keys & Enter or click</span>
                </div>
                {filteredOptions.length === 0 ? (
                  <div style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    No matching institutions found for "{searchTerm}"
                  </div>
                ) : (
                  filteredOptions.map((opt, idx) => (
                    <div
                      key={opt.value}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        background: (highlightedIndex === idx || value === opt.value) ? 'var(--icst-blue-soft)' : 'transparent',
                        color: (highlightedIndex === idx || value === opt.value) ? 'var(--icst-blue-dark)' : 'inherit',
                        fontWeight: value === opt.value ? 700 : 400,
                        borderBottom: '1px solid #f8fafc'
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onChange(opt.value);
                        setIsSearchOpen(false);
                        setSearchTerm('');
                      }}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                    >
                      {opt.label}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      }

      case 'radio':
        return (
          <div className="radio-group">
            {field.options?.map(opt => (
              <label key={opt.value} className="radio-item">
                <input
                  type="radio"
                  name={`radio-${field.id}`}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => onChange(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox-group': {
        const selected = Array.isArray(value) ? value : [];
        return (
          <div className="checkbox-group">
            {field.options?.map(opt => {
              const isChecked = selected.includes(opt.value);
              return (
                <label key={opt.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    value={opt.value}
                    checked={isChecked}
                    onChange={() => {
                      if (isChecked) {
                        onChange(selected.filter((v: string) => v !== opt.value));
                      } else {
                        onChange([...selected, opt.value]);
                      }
                    }}
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
        );
      }

      case 'smart-chips': {
        const activitiesPool = field.options && field.options.length > 0
          ? field.options.map(o => o.value)
          : ACTIVITIES;

        const availableSuggestions = activitiesPool.filter(
          act => !currentChips.includes(act) && 
            (chipInputValue ? act.toLowerCase().includes(chipInputValue.toLowerCase()) : true)
        );

        return (
          <div style={{ position: 'relative' }}>
            <div className="chips-container" style={{ position: 'relative' }}>
              {currentChips.map((chip, idx) => (
                <span key={idx} className="chip-tag">
                  {chip}
                  <button
                    type="button"
                    className="chip-remove-btn"
                    onClick={() => handleRemoveChip(idx)}
                    title="Remove chip"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                id={`field-${field.id}`}
                className="chip-input-field"
                placeholder={currentChips.length === 0 ? (field.placeholder || 'Type to filter & select activities (e.g. NCC, NSS, Drama)...') : '+ Add more (type to search)'}
                value={chipInputValue}
                onFocus={() => setIsChipDropdownOpen(true)}
                onChange={e => {
                  setChipInputValue(e.target.value);
                  setIsChipDropdownOpen(true);
                  setHighlightedChipIndex(0);
                }}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setIsChipDropdownOpen(true);
                    setHighlightedChipIndex(prev => Math.min(availableSuggestions.length - 1, prev + 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setHighlightedChipIndex(prev => Math.max(0, prev - 1));
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (isChipDropdownOpen && highlightedChipIndex >= 0 && availableSuggestions[highlightedChipIndex]) {
                      handleAddChip(availableSuggestions[highlightedChipIndex]);
                    } else if (chipInputValue) {
                      handleAddChip(chipInputValue);
                    }
                    setIsChipDropdownOpen(false);
                  } else if (e.key === 'Escape') {
                    setIsChipDropdownOpen(false);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setIsChipDropdownOpen(false), 250);
                }}
              />
            </div>

            {/* Dropdown Suggestions List for Co-Curricular Activities */}
            {isChipDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 45,
                  background: '#ffffff',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  marginTop: '4px',
                  maxHeight: '210px',
                  overflowY: 'auto'
                }}
              >
                <div style={{ padding: '4px 10px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{availableSuggestions.length} activities available</span>
                  <span>Click or press Enter to add</span>
                </div>
                {availableSuggestions.length === 0 ? (
                  <div style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    Press Enter to add "{chipInputValue}" as custom activity
                  </div>
                ) : (
                  availableSuggestions.slice(0, 15).map((act, i) => (
                    <div
                      key={act}
                      style={{
                        padding: '7px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        background: highlightedChipIndex === i ? 'var(--icst-blue-soft)' : 'transparent',
                        color: highlightedChipIndex === i ? 'var(--icst-blue-dark)' : 'inherit',
                        borderBottom: '1px solid #f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleAddChip(act);
                      }}
                      onMouseEnter={() => setHighlightedChipIndex(i)}
                    >
                      <span>{act}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>+ Add</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Quick suggested chips cloud */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quick add:</span>
              {activitiesPool.slice(0, 8).filter(a => !currentChips.includes(a)).map(act => (
                <button
                  key={act}
                  type="button"
                  style={{
                    fontSize: '11px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '1px 8px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleAddChip(act)}
                >
                  + {act}
                </button>
              ))}
            </div>
          </div>
        );
      }

      case 'tel':
        return (
          <input
            type="tel"
            id={`field-${field.id}`}
            className={inputClass}
            placeholder={field.placeholder || '10-digit mobile'}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            id={`field-${field.id}`}
            className={inputClass}
            placeholder={field.placeholder || 'student@domain.com'}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
          />
        );

      default: {
        // If field is Aadhaar identification, allow direct 12 digits without space
        const isAadhaar = field.id.toLowerCase().includes('aadhaar') || field.label.toLowerCase().includes('aadhaar');
        if (isAadhaar) {
          return (
            <input
              type="text"
              id={`field-${field.id}`}
              className={inputClass}
              placeholder={field.placeholder || "12-digit number (spaces optional)"}
              maxLength={14}
              inputMode="numeric"
              value={value ?? ''}
              onChange={e => onChange(e.target.value)}
              autoComplete="off"
            />
          );
        }

        return (
          <input
            type="text"
            id={`field-${field.id}`}
            className={inputClass}
            placeholder={field.placeholder || ''}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
          />
        );
      }
    }
  };

  const isPrefix = field.id.toLowerCase().includes('prefix');
  return (
    <div className={`field-group ${isPrefix ? 'field-prefix-compact' : ''} ${field.type === 'textarea' || field.type === 'smart-chips' ? 'full-width' : ''}`}>
      <label htmlFor={`field-${field.id}`} className="field-label">
        <span>
          {field.label}
          {field.required && <span className="field-required">*</span>}
        </span>
        {isGuidedValid && (
          <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px' }}>
            <Check size={12} /> Correct
          </span>
        )}
      </label>

      {renderControl()}

      {field.helpText && !hasGuidedError && (
        <span className="field-help">{field.helpText}</span>
      )}

      {/* Guided mode error explanation */}
      {hasGuidedError && guidedValidation && (
        <div className="field-error-msg">
          <AlertCircle size={12} />
          <span>{guidedValidation.errorMessage || 'Value does not match source record'}</span>
        </div>
      )}
    </div>
  );
};
