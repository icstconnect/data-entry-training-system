/**
 * Global Application Configuration for ICST Chowberia Data Entry Lab
 */

export const APP_CONFIG = {
  INSTITUTE_NAME: "Institute of Computer Science and Technology Chowberia",
  INSTITUTE_SHORT: "ICST - CHOWBERIA",
  APP_TITLE: "ICST Data Entry Lab",
  SUBTITLE: "Professional Data Entry Operator Training System",
  ROLL_PREFIX: "NYSDB0140-0",
  DEFAULT_TIME_LIMIT_SECONDS: 600, // 10 minutes

  // Ensure localhost:5173 is NEVER used in user-facing shares
  PUBLIC_APP_URL: typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? window.location.origin
    : 'https://icstchowberia.com/data-entry-lab'
};

/**
 * Format roll number:
 * Takes numeric string, normalizes to 3 digits (e.g. "7" -> "007", "42" -> "042", "125" -> "125")
 * Returns { rawRoll: "042", generatedRollId: "NYSDB0140-0042" } or null if invalid
 */
export function normalizeAndGenerateRollId(input: string | number): { rawRoll: string; generatedRollId: string } | null {
  const digits = String(input).trim().replace(/\D/g, '');
  if (!digits) return null;

  // Convert to integer and check bounds 0 to 999
  const num = parseInt(digits, 10);
  if (isNaN(num) || num < 0 || num > 999) return null;

  const rawRoll = String(num).padStart(3, '0');
  const generatedRollId = `${APP_CONFIG.ROLL_PREFIX}${rawRoll}`;
  return { rawRoll, generatedRollId };
}
