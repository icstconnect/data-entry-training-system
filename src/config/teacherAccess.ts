/**
 * Dedicated Teacher Mode Access Configuration
 * 
 * NOTE: This is an application-level access gate for the ICST Data Entry Lab.
 * It is isolated in this configuration module so it can easily be replaced
 * with a secure server-side authentication endpoint without rewriting Teacher Mode UI.
 */

import { setMasterUnlocked } from '../services/masterUnlockService';

export const TEACHER_MODE_PASSWORD = "ICST";

export interface TeacherAuthResult {
  success: boolean;
  error?: string;
}

export async function verifyTeacherPassword(passwordAttempt: string): Promise<TeacherAuthResult> {
  const clean = (passwordAttempt || '').trim().toUpperCase();
  if (clean === TEACHER_MODE_PASSWORD) {
    setMasterUnlocked(true);
    return { success: true };
  }
  return { success: false, error: 'Incorrect teacher password. Enter "ICST" to unlock.' };
}
