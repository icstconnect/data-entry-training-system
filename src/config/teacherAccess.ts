/**
 * Dedicated Teacher Mode Access Configuration
 * 
 * NOTE: This is an application-level access gate for the ICST Data Entry Lab.
 * It is isolated in this configuration module so it can easily be replaced
 * with a secure server-side authentication endpoint without rewriting Teacher Mode UI.
 */

export const TEACHER_MODE_PASSWORD = "ICST_TEACHER_2026";

export interface TeacherAuthResult {
  success: boolean;
  error?: string;
}

export async function verifyTeacherPassword(passwordAttempt: string): Promise<TeacherAuthResult> {
  // Current client-side authentication gate (can be swapped for an async fetch/API call later)
  if (passwordAttempt === TEACHER_MODE_PASSWORD) {
    return { success: true };
  }
  return { success: false, error: 'Incorrect teacher password' };
}
