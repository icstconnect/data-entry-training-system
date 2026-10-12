import {
  FieldDefinition,
  SourceRecord,
  FieldValidationResult,
  CellValidationResult,
  StageConfig,
  StageValidationSummary,
  ValidationMode
} from '../types';

/**
 * Safely resolves nested property string e.g. "address.district" or "schoolInfo.board"
 */
export function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current;
}

/**
 * Normalizes string values for NORMAL validation mode
 */
function normalizeString(val: any, mode: ValidationMode = 'NORMAL'): string {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (mode === 'NORMAL') {
    str = str.trim().replace(/\s+/g, ' ').toLowerCase();
  }
  return str;
}

/**
 * Calculates Levenshtein edit distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1]
        );
      }
    }
  }
  return dp[m][n];
}

/**
 * Intelligent discrepancy detector that pinpoints:
 * - Missing words or names (e.g. entered "Sourav", expected "Sourav Ghosh")
 * - Extra words
 * - Spelling mistakes in words (e.g. entered "Consistant", expected "Consistent")
 * - Digit errors in codes or phones (e.g. entered "9800010002", expected "9800010001")
 * - Transposed characters or dropped letters
 */
export function analyzeTextDiscrepancy(
  expected: any,
  entered: any,
  fieldLabel: string = 'Field'
): { errorType: 'wrong_text' | 'spelling_mistake' | 'missing_word' | 'missing_value' | 'format_error'; errorMessage: string } {
  const expStr = String(expected ?? '').trim();
  const entStr = String(entered ?? '').trim();

  if (!entStr) {
    return {
      errorType: 'missing_value',
      errorMessage: `${fieldLabel} is empty / missing`
    };
  }

  // Exact match
  if (expStr.toLowerCase() === entStr.toLowerCase()) {
    if (expStr !== entStr) {
      return {
        errorType: 'format_error',
        errorMessage: `Letter casing mismatch: expected "${expStr}", entered "${entStr}"`
      };
    }
    return {
      errorType: 'wrong_text',
      errorMessage: 'Value matches'
    };
  }

  // If both look like numeric/alphanumeric codes or phone numbers
  if (/^[\w-]+$/.test(expStr) && /^[\w-]+$/.test(entStr)) {
    if (expStr.length === entStr.length) {
      const diffPositions: number[] = [];
      for (let i = 0; i < expStr.length; i++) {
        if (expStr[i].toLowerCase() !== entStr[i].toLowerCase()) {
          diffPositions.push(i + 1);
        }
      }
      if (diffPositions.length <= 2) {
        return {
          errorType: 'spelling_mistake',
          errorMessage: `Character mismatch at position ${diffPositions.join(', ')}: expected "${expStr}", typed "${entStr}"`
        };
      }
    }
  }

  // Word-by-word token analysis
  const expWords = expStr.split(/\s+/).filter(Boolean);
  const entWords = entStr.split(/\s+/).filter(Boolean);

  const expWordsLower = expWords.map(w => w.toLowerCase());
  const entWordsLower = entWords.map(w => w.toLowerCase());

  // Check for missing words/name parts
  const missingWords = expWords.filter(w => !entWordsLower.includes(w.toLowerCase()));
  const extraWords = entWords.filter(w => !expWordsLower.includes(w.toLowerCase()));

  // Scenario 1: Words are completely present except some are missing (e.g. name "Sourav Ghosh" typed as "Sourav")
  if (missingWords.length > 0 && extraWords.length === 0) {
    const isName = fieldLabel.toLowerCase().includes('name');
    return {
      errorType: 'missing_word',
      errorMessage: isName 
        ? `Missing name component: "${missingWords.join(' ')}" is missing` 
        : `Missing word(s): expected "${missingWords.join(' ')}"`
    };
  }

  // Scenario 2: Extra words added that are not in source
  if (missingWords.length === 0 && extraWords.length > 0) {
    return {
      errorType: 'wrong_text',
      errorMessage: `Extra word(s) entered: "${extraWords.join(' ')}" not in source`
    };
  }

  // Scenario 3: Same number of words, check for word-level spelling mistakes
  if (expWords.length === entWords.length) {
    const misspelledPairs: { exp: string; ent: string }[] = [];
    for (let i = 0; i < expWords.length; i++) {
      if (expWordsLower[i] !== entWordsLower[i]) {
        misspelledPairs.push({ exp: expWords[i], ent: entWords[i] });
      }
    }

    if (misspelledPairs.length === 1) {
      const pair = misspelledPairs[0];
      const dist = levenshteinDistance(pair.exp, pair.ent);
      if (dist <= 3) {
        return {
          errorType: 'spelling_mistake',
          errorMessage: `Spelling mistake: expected "${pair.exp}", typed "${pair.ent}"`
        };
      } else {
        return {
          errorType: 'wrong_text',
          errorMessage: `Word mismatch: expected "${pair.exp}", typed "${pair.ent}"`
        };
      }
    } else if (misspelledPairs.length > 1) {
      const allClose = misspelledPairs.every(p => levenshteinDistance(p.exp, p.ent) <= 2);
      if (allClose) {
        const details = misspelledPairs.map(p => `"${p.ent}" -> "${p.exp}"`).join(', ');
        return {
          errorType: 'spelling_mistake',
          errorMessage: `Spelling mistakes detected: ${details}`
        };
      }
    }
  }

  // Scenario 4: Missing word AND spelling mistake
  if (missingWords.length > 0 && extraWords.length > 0) {
    for (const mw of missingWords) {
      for (const ew of extraWords) {
        if (levenshteinDistance(mw, ew) <= 2) {
          return {
            errorType: 'spelling_mistake',
            errorMessage: `Spelling mistake in "${ew}": expected "${mw}"`
          };
        }
      }
    }

    return {
      errorType: 'missing_word',
      errorMessage: `Missing or incorrect words: expected "${missingWords.join(' ')}"`
    };
  }

  // Scenario 5: General Levenshtein distance on overall string
  const overallDist = levenshteinDistance(expStr, entStr);
  if (overallDist <= 3) {
    return {
      errorType: 'spelling_mistake',
      errorMessage: `Spelling mistake: expected "${expStr}", typed "${entStr}"`
    };
  }

  return {
    errorType: 'wrong_text',
    errorMessage: `Mismatch: expected "${expStr}", received "${entStr}"`
  };
}

/**
 * Validates an individual field
 */
export function validateField(
  sourceRecord: SourceRecord,
  userValues: Record<string, any>,
  field: FieldDefinition,
  mode: ValidationMode = 'NORMAL'
): FieldValidationResult {
  let sourceValue = getNestedValue(sourceRecord, field.id);

  // If field is guardianPrefix, resolve prefix from source record
  if (field.id === 'guardianPrefix') {
    if (!sourceValue && sourceRecord.guardianPrefix) {
      sourceValue = sourceRecord.guardianPrefix;
    }
    if (!sourceValue && sourceRecord.guardianName) {
      const match = String(sourceRecord.guardianName).trim().match(/^(Shri|Late|Dr\.?|Mr\.?|Mrs\.?|Md\.?|Prof\.?|Smt\.?)\b/i);
      sourceValue = match ? match[0] : '';
    }
  }

  // If field is guardianName, the expected value in this name field is ONLY the first and last name!
  if (field.id === 'guardianName' && sourceRecord.guardianName) {
    const full = String(sourceRecord.guardianName).trim();
    sourceValue = full.replace(/^(Shri|Late|Dr\.?|Mr\.?|Mrs\.?|Md\.?|Prof\.?|Smt\.?)\s+/i, '').trim();
  }

  const enteredValue = userValues[field.id];
  const weight = field.weight ?? 1;

  // Check missing
  const isEmpty = enteredValue === undefined || enteredValue === null || enteredValue === '' ||
    (Array.isArray(enteredValue) && enteredValue.length === 0);

  if (field.required && isEmpty) {
    return {
      fieldId: field.id,
      label: field.label,
      sourceValue,
      enteredValue: '',
      status: 'missing',
      errorType: 'missing_value',
      errorMessage: 'This field is required',
      weight,
      section: field.section
    };
  }

  if (isEmpty && !field.required) {
    return {
      fieldId: field.id,
      label: field.label,
      sourceValue,
      enteredValue: '',
      status: 'correct',
      weight,
      section: field.section
    };
  }

  // Type specific validation
  switch (field.type) {
    case 'number':
    case 'decimal': {
      const numEntered = Number(enteredValue);
      const numSource = Number(sourceValue);
      if (isNaN(numEntered)) {
        return {
          fieldId: field.id,
          label: field.label,
          sourceValue,
          enteredValue,
          status: 'incorrect',
          errorType: 'wrong_number',
          errorMessage: 'Expected a valid numeric value',
          weight,
          section: field.section
        };
      }
      if (numEntered !== numSource) {
        return {
          fieldId: field.id,
          label: field.label,
          sourceValue,
          enteredValue,
          status: 'incorrect',
          errorType: 'wrong_number',
          errorMessage: 'Value does not match the source record',
          weight,
          section: field.section
        };
      }
      return {
        fieldId: field.id,
        label: field.label,
        sourceValue,
        enteredValue,
        status: 'correct',
        weight,
        section: field.section
      };
    }

    case 'date': {
      let dateStr = String(enteredValue).trim();

      // Normalize DD-MM-YYYY or DD/MM/YYYY into YYYY-MM-DD
      const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
      if (ddmmyyyyMatch) {
        const d = ddmmyyyyMatch[1].padStart(2, '0');
        const m = ddmmyyyyMatch[2].padStart(2, '0');
        const y = ddmmyyyyMatch[3];
        dateStr = `${y}-${m}-${d}`;
      } else if (dateStr.includes('/')) {
        dateStr = dateStr.replace(/\//g, '-');
      }

      const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!isoPattern.test(dateStr)) {
        return {
          fieldId: field.id,
          label: field.label,
          sourceValue,
          enteredValue,
          status: 'incorrect',
          errorType: 'wrong_date',
          errorMessage: 'Date format incorrect (expected YYYY-MM-DD)',
          weight,
          section: field.section
        };
      }
      if (dateStr !== String(sourceValue).trim()) {
        return {
          fieldId: field.id,
          label: field.label,
          sourceValue,
          enteredValue,
          status: 'incorrect',
          errorType: 'wrong_date',
          errorMessage: 'Date does not match the source record',
          weight,
          section: field.section
        };
      }
      return {
        fieldId: field.id,
        label: field.label,
        sourceValue,
        enteredValue,
        status: 'correct',
        weight,
        section: field.section
      };
    }

    case 'select':
    case 'searchable-select':
    case 'radio': {
      let normEntered = normalizeString(enteredValue, mode);
      let normSource = normalizeString(sourceValue, mode);

      if (field.id === 'guardianPrefix') {
        normEntered = normEntered.replace(/\.$/, '');
        normSource = normSource.replace(/\.$/, '');
      }

      if (normEntered !== normSource) {
        return {
          fieldId: field.id,
          label: field.label,
          sourceValue,
          enteredValue,
          status: 'incorrect',
          errorType: 'wrong_selection',
          errorMessage: 'Selected option does not match the source record',
          weight,
          section: field.section
        };
      }
      return {
        fieldId: field.id,
        label: field.label,
        sourceValue,
        enteredValue,
        status: 'correct',
        weight,
        section: field.section
      };
    }

    case 'smart-chips':
    case 'multi-select': {
      const enteredArr: string[] = Array.isArray(enteredValue)
        ? enteredValue.map(v => normalizeString(v, mode))
        : [];
      const sourceArr: string[] = Array.isArray(sourceValue)
        ? sourceValue.map(v => normalizeString(v, mode))
        : [];

      // Check set equality
      const setSource = new Set(sourceArr);
      const setEntered = new Set(enteredArr);

      let isMatch = setSource.size === setEntered.size;
      if (isMatch) {
        for (const item of setSource) {
          if (!setEntered.has(item)) {
            isMatch = false;
            break;
          }
        }
      }

      if (!isMatch) {
        return {
          fieldId: field.id,
          label: field.label,
          sourceValue,
          enteredValue,
          status: 'incorrect',
          errorType: 'wrong_selection',
          errorMessage: 'Selected chips/tags do not match source list',
          weight,
          section: field.section
        };
      }
      return {
        fieldId: field.id,
        label: field.label,
        sourceValue,
        enteredValue,
        status: 'correct',
        weight,
        section: field.section
      };
    }

    case 'name-with-prefix': {
      // Normalize salutation dots: e.g. "dr." -> "dr", "mr." -> "mr"
      const normEntered = normalizeString(enteredValue, mode).replace(/\b(dr|mr|mrs|md|prof|smt)\./gi, '$1');
      const normSource = normalizeString(sourceValue, mode).replace(/\b(dr|mr|mrs|md|prof|smt)\./gi, '$1');

      if (normEntered !== normSource) {
        return {
          fieldId: field.id,
          label: field.label,
          sourceValue,
          enteredValue,
          status: 'incorrect',
          errorType: 'wrong_text',
          errorMessage: 'Name does not match source record (check prefix and spelling)',
          weight,
          section: field.section
        };
      }
      return {
        fieldId: field.id,
        label: field.label,
        sourceValue,
        enteredValue,
        status: 'correct',
        weight,
        section: field.section
      };
    }

    default: {
      // 1. Aadhaar Card Identification: ignore spaces and hyphens
      const isAadhaarField = field.id.toLowerCase().includes('aadhaar') || 
                             field.label.toLowerCase().includes('aadhaar');

      if (isAadhaarField) {
        const cleanEntered = String(enteredValue ?? '').replace(/[\s-]+/g, '').trim();
        const cleanSource = String(sourceValue ?? '').replace(/[\s-]+/g, '').trim();

        if (cleanEntered !== cleanSource) {
          return {
            fieldId: field.id,
            label: field.label,
            sourceValue,
            enteredValue,
            status: 'incorrect',
            errorType: 'wrong_text',
            errorMessage: 'Aadhaar number does not match source record (12 digits)',
            weight,
            section: field.section
          };
        }
        return {
          fieldId: field.id,
          label: field.label,
          sourceValue,
          enteredValue,
          status: 'correct',
          weight,
          section: field.section
        };
      }

      // 2. Guardian Name: First and Last Name only
      const isGuardianField = field.id.toLowerCase().includes('guardian');
      if (isGuardianField) {
        const cleanEntered = normalizeString(enteredValue, mode).replace(/^(shri|late|dr\.?|mr\.?|mrs\.?|md\.?|prof\.?|smt\.?)\s+/i, '').trim();
        const cleanSource = normalizeString(sourceValue, mode).replace(/^(shri|late|dr\.?|mr\.?|mrs\.?|md\.?|prof\.?|smt\.?)\s+/i, '').trim();

        if (cleanEntered !== cleanSource) {
          const discrepancy = analyzeTextDiscrepancy(cleanSource, cleanEntered, field.label);
          return {
            fieldId: field.id,
            label: field.label,
            sourceValue,
            enteredValue,
            status: 'incorrect',
            errorType: discrepancy.errorType,
            errorMessage: discrepancy.errorMessage,
            weight,
            section: field.section
          };
        }
        return {
          fieldId: field.id,
          label: field.label,
          sourceValue,
          enteredValue,
          status: 'correct',
          weight,
          section: field.section
        };
      }

      // 3. Standard Text, email, tel, structured-id
      const normEntered = normalizeString(enteredValue, mode);
      const normSource = normalizeString(sourceValue, mode);

      if (normEntered !== normSource) {
        const discrepancy = analyzeTextDiscrepancy(sourceValue, enteredValue, field.label);
        return {
          fieldId: field.id,
          label: field.label,
          sourceValue,
          enteredValue,
          status: 'incorrect',
          errorType: discrepancy.errorType,
          errorMessage: discrepancy.errorMessage,
          weight,
          section: field.section
        };
      }
      return {
        fieldId: field.id,
        label: field.label,
        sourceValue,
        enteredValue,
        status: 'correct',
        weight,
        section: field.section
      };
    }
  }
}

/**
 * Validates marksheet cells (theory, oral, total, grade)
 */
export function validateMarksheet(
  sourceRecord: SourceRecord,
  userMarksheet: Record<string, { theory?: number; oral?: number; total?: number; grade?: string }>
): CellValidationResult[] {
  const results: CellValidationResult[] = [];
  if (!sourceRecord.marksheet?.subjects) return results;

  for (const subj of sourceRecord.marksheet.subjects) {
    const userSubj = userMarksheet[subj.code] || {};

    // Validate Theory
    if (subj.theory !== undefined) {
      const enteredTheory = userSubj.theory !== undefined && userSubj.theory !== null && String(userSubj.theory) !== ''
        ? Number(userSubj.theory)
        : undefined;

      if (enteredTheory === undefined) {
        results.push({
          rowId: subj.code,
          columnId: 'theory',
          columnLabel: `${subj.name} - Theory`,
          sourceValue: subj.theory,
          enteredValue: '',
          status: 'missing',
          errorMessage: 'Theory marks missing'
        });
      } else if (enteredTheory !== subj.theory) {
        results.push({
          rowId: subj.code,
          columnId: 'theory',
          columnLabel: `${subj.name} - Theory`,
          sourceValue: subj.theory,
          enteredValue: enteredTheory,
          status: 'incorrect',
          errorMessage: `Expected ${subj.theory}, received ${enteredTheory}`
        });
      } else {
        results.push({
          rowId: subj.code,
          columnId: 'theory',
          columnLabel: `${subj.name} - Theory`,
          sourceValue: subj.theory,
          enteredValue: enteredTheory,
          status: 'correct'
        });
      }
    }

    // Validate Oral/Practical
    if (subj.oral !== undefined) {
      const enteredOral = userSubj.oral !== undefined && userSubj.oral !== null && String(userSubj.oral) !== ''
        ? Number(userSubj.oral)
        : undefined;

      if (enteredOral === undefined) {
        results.push({
          rowId: subj.code,
          columnId: 'oral',
          columnLabel: `${subj.name} - Oral/Practical`,
          sourceValue: subj.oral,
          enteredValue: '',
          status: 'missing',
          errorMessage: 'Oral/Practical marks missing'
        });
      } else if (enteredOral !== subj.oral) {
        results.push({
          rowId: subj.code,
          columnId: 'oral',
          columnLabel: `${subj.name} - Oral/Practical`,
          sourceValue: subj.oral,
          enteredValue: enteredOral,
          status: 'incorrect',
          errorMessage: `Expected ${subj.oral}, received ${enteredOral}`
        });
      } else {
        results.push({
          rowId: subj.code,
          columnId: 'oral',
          columnLabel: `${subj.name} - Oral/Practical`,
          sourceValue: subj.oral,
          enteredValue: enteredOral,
          status: 'correct'
        });
      }
    }

    // Validate Total
    const enteredTotal = userSubj.total !== undefined && userSubj.total !== null && String(userSubj.total) !== ''
      ? Number(userSubj.total)
      : undefined;

    if (enteredTotal === undefined) {
      results.push({
        rowId: subj.code,
        columnId: 'total',
        columnLabel: `${subj.name} - Total`,
        sourceValue: subj.total,
        enteredValue: '',
        status: 'missing',
        errorMessage: 'Total marks missing'
      });
    } else if (enteredTotal !== subj.total) {
      results.push({
        rowId: subj.code,
        columnId: 'total',
        columnLabel: `${subj.name} - Total`,
        sourceValue: subj.total,
        enteredValue: enteredTotal,
        status: 'incorrect',
        errorMessage: `Total does not match (expected ${subj.total})`
      });
    } else {
      results.push({
        rowId: subj.code,
        columnId: 'total',
        columnLabel: `${subj.name} - Total`,
        sourceValue: subj.total,
        enteredValue: enteredTotal,
        status: 'correct'
      });
    }
  }

  return results;
}

/**
 * Validates spreadsheet/tabular grid rows
 */
export function validateTableRows(
  sourceRows: Record<string, any>[] | undefined,
  userRows: Record<string, any>[] | undefined,
  columns: { id: string; label: string }[]
): CellValidationResult[] {
  const results: CellValidationResult[] = [];
  if (!sourceRows || !userRows) return results;

  sourceRows.forEach((sourceRow, rowIndex) => {
    const userRow = userRows[rowIndex] || {};
    columns.forEach(col => {
      const srcVal = sourceRow[col.id];
      const usrVal = userRow[col.id];

      const isEmpty = usrVal === undefined || usrVal === null || String(usrVal).trim() === '';
      if (isEmpty) {
        results.push({
          rowId: rowIndex + 1,
          columnId: col.id,
          columnLabel: `Row ${rowIndex + 1} - ${col.label}`,
          sourceValue: srcVal,
          enteredValue: '',
          status: 'missing',
          errorMessage: 'Cell is empty'
        });
      } else if (String(srcVal).trim().toLowerCase() !== String(usrVal).trim().toLowerCase()) {
        const discrepancy = analyzeTextDiscrepancy(srcVal, usrVal, col.label);
        results.push({
          rowId: rowIndex + 1,
          columnId: col.id,
          columnLabel: `Row ${rowIndex + 1} - ${col.label}`,
          sourceValue: srcVal,
          enteredValue: usrVal,
          status: 'incorrect',
          errorMessage: discrepancy.errorMessage
        });
      } else {
        results.push({
          rowId: rowIndex + 1,
          columnId: col.id,
          columnLabel: `Row ${rowIndex + 1} - ${col.label}`,
          sourceValue: srcVal,
          enteredValue: usrVal,
          status: 'correct'
        });
      }
    });
  });

  return results;
}

/**
 * Full Stage Evaluation Engine:
 * Combines field results, table cells, and marksheet marks.
 * Calculates weighted accuracy percentage.
 */
export function evaluateStageSubmission(
  stage: StageConfig,
  sourceRecord: SourceRecord,
  userFormValues: Record<string, any>,
  userTableRows?: Record<string, any>[],
  userMarksheet?: Record<string, any>,
  timeTakenSeconds: number = 0,
  isGuidedMode: boolean = false,
  mode: ValidationMode = 'NORMAL',
  studentIdentity?: import('../types').StudentIdentity,
  timeLimitSeconds?: number
): StageValidationSummary {
  // 1. Evaluate fields
  const fieldResults: FieldValidationResult[] = stage.fields.map(f =>
    validateField(sourceRecord, userFormValues, f, mode)
  );

  // 2. Evaluate table if present
  let cellResults: CellValidationResult[] = [];
  if (stage.tableSchema && sourceRecord.tableRows && userTableRows) {
    cellResults = cellResults.concat(
      validateTableRows(sourceRecord.tableRows, userTableRows, stage.tableSchema.columns)
    );
  }

  // 3. Evaluate marksheet if present
  if (stage.marksheetSchema && sourceRecord.marksheet && userMarksheet) {
    cellResults = cellResults.concat(
      validateMarksheet(sourceRecord, userMarksheet)
    );
  }

  // 4. Calculate total evaluated units and score
  let weightedTotal = 0;
  let weightedCorrect = 0;
  let correctUnits = 0;
  let incorrectUnits = 0;
  let missingUnits = 0;

  for (const fr of fieldResults) {
    weightedTotal += fr.weight;
    if (fr.status === 'correct') {
      weightedCorrect += fr.weight;
      correctUnits++;
    } else if (fr.status === 'missing') {
      missingUnits++;
    } else {
      incorrectUnits++;
    }
  }

  for (const cr of cellResults) {
    const cellWeight = 1;
    weightedTotal += cellWeight;
    if (cr.status === 'correct') {
      weightedCorrect += cellWeight;
      correctUnits++;
    } else if (cr.status === 'missing') {
      missingUnits++;
    } else {
      incorrectUnits++;
    }
  }

  const rawAccuracy = weightedTotal > 0 ? (weightedCorrect / weightedTotal) * 100 : 0;
  const accuracyPercentage = Number(rawAccuracy.toFixed(1));

  // Check pass criteria
  // Level 5 demands exact 100% (any incorrect or missing cell fails)
  let passed = false;
  if (stage.requiredAccuracy === 100) {
    passed = incorrectUnits === 0 && missingUnits === 0 && accuracyPercentage === 100;
  } else {
    passed = accuracyPercentage >= stage.requiredAccuracy;
  }

  // 5. EXP Calculation:
  // Guided mode awards 0 EXP as specified!
  let expEarned = 0;
  if (!isGuidedMode && passed) {
    // Base EXP + accuracy bonus
    const accuracyFactor = accuracyPercentage / 100;
    expEarned = Math.round(stage.baseExp * accuracyFactor);

    // Optional speed bonus if finished efficiently under reasonable time
    if (timeTakenSeconds > 0 && timeTakenSeconds < 90) {
      expEarned += 25; // small speed bonus
    }
  }

  return {
    uid: sourceRecord.uid,
    studentIdentity,
    levelNumber: stage.levelNumber,
    stageNumber: stage.stageNumber,
    totalEvaluatedUnits: fieldResults.length + cellResults.length,
    correctUnits,
    incorrectUnits,
    missingUnits,
    accuracyPercentage,
    requiredAccuracy: stage.requiredAccuracy,
    passed,
    timeTakenSeconds,
    timeLimitSeconds: timeLimitSeconds || stage.timeLimitSeconds || 600,
    expEarned,
    isGuidedMode,
    fieldResults,
    cellResults,
    unlockedAchievements: [],
    submittedAt: new Date().toISOString()
  };
}
