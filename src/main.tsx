import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register Service Worker for offline training capability
if ('serviceWorker' in navigator && import.meta.env.MODE !== 'test') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('[ICST PWA] ServiceWorker registered successfully with scope:', registration.scope);
      },
      (err) => {
        console.warn('[ICST PWA] ServiceWorker registration encountered an issue:', err);
      }
    );
  });
}

