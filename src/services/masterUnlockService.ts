/**
 * Master Unlock Service (Password: "ICST")
 * 
 * Allows teachers, examiners, and testers to unlock all levels
 * across all training labs (Windows Lab, Practice Lab, Excel Lab, Terminal Lab).
 * 
 * In normal student mode (default), students start at Level 1 and must
 * achieve required clearance (100% or passing criteria) to advance sequentially.
 */

const MASTER_UNLOCK_STORAGE_KEY = 'icst_master_unlock_active_v1';
export const MASTER_PASSWORD = 'ICST';

export function isMasterUnlocked(): boolean {
  try {
    return localStorage.getItem(MASTER_UNLOCK_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setMasterUnlocked(unlocked: boolean): void {
  try {
    if (unlocked) {
      localStorage.setItem(MASTER_UNLOCK_STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(MASTER_UNLOCK_STORAGE_KEY);
    }
    // Notify all active workbench components of master unlock state change
    window.dispatchEvent(new CustomEvent('icst_master_unlock_changed', { detail: { unlocked } }));
  } catch (err) {
    console.error('Failed to set master unlock state:', err);
  }
}

export function verifyAndApplyMasterPassword(passwordAttempt: string): { success: boolean; error?: string } {
  const clean = (passwordAttempt || '').trim().toUpperCase();
  if (clean === MASTER_PASSWORD) {
    setMasterUnlocked(true);
    return { success: true };
  }
  return { success: false, error: 'Incorrect master password. Enter "ICST" to unlock all levels.' };
}

export function lockToStudentProgression(): void {
  setMasterUnlocked(false);
}

