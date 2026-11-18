import { useState, useEffect, useCallback, RefObject } from 'react';

function getCurrentFullscreenElement(): Element | null {
  if (typeof document === 'undefined') return null;
  return (
    document.fullscreenElement ||
    (document as unknown as { webkitFullscreenElement?: Element | null }).webkitFullscreenElement ||
    null
  );
}

/**
 * Helper to trigger native fullscreen immediately inside a user click gesture
 * (e.g. when launching a mandatory-fullscreen lab from its dashboard).
 */
export async function requestDocumentFullscreen(): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  if (getCurrentFullscreenElement()) return true;
  const el = document.documentElement;
  try {
    if (el.requestFullscreen) {
      await el.requestFullscreen();
      return true;
    }
    const webkitEl = el as unknown as { webkitRequestFullscreen?: () => Promise<void> | void };
    if (webkitEl.webkitRequestFullscreen) {
      await webkitEl.webkitRequestFullscreen();
      return true;
    }
  } catch {
    // Fullscreen API unavailable or blocked in current environment
  }
  return false;
}

export interface UseFullscreenOptions {
  /** Use document.documentElement so fullscreen persists smoothly across view transitions */
  useDocumentRoot?: boolean;
  /** If true, do not silently fall back to pseudo-fullscreen when native fullscreen is supported and rejected */
  mandatory?: boolean;
}

/**
 * Reusable Fullscreen Hook with native Fullscreen API + seamless CSS fallback.
 * Detects already-active fullscreen on mount and syncs with Esc / browser exits.
 */
export function useFullscreen(
  targetRef: RefObject<HTMLElement | null>,
  options: UseFullscreenOptions = {}
) {
  const { useDocumentRoot = true, mandatory = false } = options;

  const [isNativeFullscreen, setIsNativeFullscreen] = useState<boolean>(() =>
    Boolean(getCurrentFullscreenElement())
  );
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);

  const isFullscreen = isNativeFullscreen || isPseudoFullscreen;

  useEffect(() => {
    const handleFsChange = () => {
      const fsEl = getCurrentFullscreenElement();
      setIsNativeFullscreen(Boolean(fsEl));
      if (!fsEl) {
        setIsPseudoFullscreen(false);
      }
    };

    handleFsChange();
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const enterFullscreen = useCallback(async () => {
    const el = useDocumentRoot
      ? document.documentElement
      : targetRef.current || document.documentElement;

    const supportsNative = Boolean(
      el.requestFullscreen ||
      (el as unknown as { webkitRequestFullscreen?: () => Promise<void> | void })
        .webkitRequestFullscreen
    );

    if (supportsNative) {
      try {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
          setIsNativeFullscreen(true);
          return true;
        }
        const webkitEl = el as unknown as { webkitRequestFullscreen?: () => Promise<void> | void };
        if (webkitEl.webkitRequestFullscreen) {
          await webkitEl.webkitRequestFullscreen();
          setIsNativeFullscreen(true);
          return true;
        }
      } catch {
        // Fall back to viewport-filling mode if blocked by browser/iframe policy
        if (!mandatory || !document.fullscreenEnabled) {
          setIsPseudoFullscreen(true);
          return true;
        }
        // Even in mandatory mode, if fullscreenEnabled is false (embedded preview), allow pseudo-fullscreen
        setIsPseudoFullscreen(true);
        return true;
      }
    }

    setIsPseudoFullscreen(true);
    return true;
  }, [targetRef, useDocumentRoot, mandatory]);

  const exitFullscreen = useCallback(async () => {
    setIsPseudoFullscreen(false);
    try {
      const fsEl = getCurrentFullscreenElement();
      if (fsEl && document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (fsEl) {
        const webkitDoc = document as unknown as { webkitExitFullscreen?: () => Promise<void> | void };
        if (webkitDoc.webkitExitFullscreen) {
          await webkitDoc.webkitExitFullscreen();
        }
      }
    } catch {
      // Ignore exit errors
    }
    setIsNativeFullscreen(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      void exitFullscreen();
    } else {
      void enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    isNativeFullscreen,
    isPseudoFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen
  };
}
