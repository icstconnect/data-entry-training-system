import { useState, useEffect } from 'react';

const DISMISS_SESSION_KEY = 'icst_typing_phys_kbd_dismissed';

/**
 * Detects mobile phones and tablets (viewport <= 1024px, or coarse touch pointer up to 1280px).
 */
export function useIsMobileOrTablet(): boolean {
  const check = () => {
    if (typeof window === 'undefined') return false;
    const width = window.innerWidth;
    if (width <= 1024) return true;
    const isCoarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    const hasTouch = navigator.maxTouchPoints > 0;
    return (isCoarse || hasTouch) && width <= 1280;
  };

  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>(check);

  useEffect(() => {
    const update = () => setIsMobileOrTablet(check());
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return isMobileOrTablet;
}

export function isPhysicalKeyboardNoticeDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function markPhysicalKeyboardNoticeDismissed(): void {
  try {
    sessionStorage.setItem(DISMISS_SESSION_KEY, '1');
  } catch {
    // Ignore storage errors
  }
}
