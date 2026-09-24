import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';

/**
 * Small, unobtrusive offline status indicator.
 * Requirement: "if offline sonly show a small popup offline and do not show anything else"
 * Displays only a small, non-blocking toast/pill in the corner without disrupting work.
 */
export const OfflineNotice: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [justCameOnline, setJustCameOnline] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setIsDismissed(false);
      setJustCameOnline(true);
      const timer = setTimeout(() => {
        setJustCameOnline(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setIsDismissed(false);
      setJustCameOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // If dismissed or online and not in the brief transition, render nothing
  if ((!isOffline && !justCameOnline) || (isOffline && isDismissed)) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '18px',
        right: '18px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: isOffline ? '#292524' : '#14532d',
        color: '#ffffff',
        padding: '8px 14px',
        borderRadius: '24px',
        fontSize: '12px',
        fontWeight: 600,
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.22)',
        border: `1px solid ${isOffline ? '#44403c' : '#22c55e'}`,
        animation: 'fadeInUp 0.3s ease-out',
        userSelect: 'none',
        pointerEvents: 'auto'
      }}
    >
      {isOffline ? (
        <>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#f59e0b',
              display: 'inline-block'
            }}
          />
          <WifiOff size={14} color="#f59e0b" />
          <span>Offline Mode • Data saved locally</span>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a8a29e',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '4px'
            }}
            title="Dismiss notice"
          >
            <X size={12} />
          </button>
        </>
      ) : (
        <>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block'
            }}
          />
          <Wifi size={14} color="#4ade80" />
          <span>Back Online</span>
        </>
      )}
    </div>
  );
};
