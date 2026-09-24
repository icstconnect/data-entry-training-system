import React, { useState } from 'react';
import { FieldDefinition, SourceRecord, ValidationMode } from '../../types';
import { validateField } from '../../services/validationEngine';
import { AlertCircle, Check, X, Search, Calendar } from 'lucide-react';

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
  const [chipInputValue, setChipInputValue] = useState('');

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
        return (
          <select
            id={`field-${field.id}`}
            className={`${inputClass} ${isPrefix ? 'field-select-prefix' : ''}`}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
          >
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      }

      case 'searchable-select': {
        const filteredOptions = (field.options || []).filter(opt =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div style={{ position: 'relative' }}>
            <div 
              className={inputClass}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <span>{value || <span style={{ color: 'var(--text-muted)' }}>{field.placeholder || 'Select option...'}</span>}</span>
              <Search size={14} color="var(--text-muted)" />
            </div>

            {isSearchOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 20,
                  background: '#ffffff',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  marginTop: '4px',
                  maxHeight: '220px',
                  overflowY: 'auto'
                }}
              >
                <div style={{ padding: '6px', borderBottom: '1px solid var(--border-light)' }}>
                  <input
                    type="text"
                    placeholder="Search options..."
                    className="field-input"
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
                {filteredOptions.length === 0 ? (
                  <div style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    No matching options
                  </div>
                ) : (
                  filteredOptions.map(opt => (
                    <div
                      key={opt.value}
                      style={{
                        padding: '8px 12px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        background: value === opt.value ? 'var(--icst-blue-soft)' : 'transparent',
                        color: value === opt.value ? 'var(--icst-blue-dark)' : 'inherit'
                      }}
                      onClick={() => {
                        onChange(opt.value);
                        setIsSearchOpen(false);
                      }}
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

      case 'smart-chips':
        return (
          <div>
            <div className="chips-container">
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
                className="chip-input-field"
                placeholder={currentChips.length === 0 ? (field.placeholder || 'Type and press Enter...') : '+ Add another'}
                value={chipInputValue}
                onChange={e => setChipInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChip(chipInputValue);
                  }
                }}
              />
            </div>
            {/* Quick suggested chips if available in field options */}
            {field.options && field.options.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quick add:</span>
                {field.options.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    style={{
                      fontSize: '11px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '1px 8px',
                      color: 'var(--text-secondary)'
                    }}
                    onClick={() => handleAddChip(opt.value)}
                  >
                    + {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );

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
