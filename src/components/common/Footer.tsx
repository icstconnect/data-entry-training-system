import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img 
            src="/logo.png" 
            alt="ICST Chowberia Logo" 
            className="footer-logo" 
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--icst-charcoal)' }}>
              Institute of Computer Science and Technology Chowberia
            </div>
            <div style={{ fontSize: '12px', color: 'var(--icst-slate)', fontWeight: 600 }}>
              ICST - CHOWBERIA • Data Entry Training System
            </div>
          </div>
        </div>

        <div className="footer-disclaimer">
          Training Simulation Platform. All academic marksheets and student data records are synthetic and fictional, engineered exclusively for skill enhancement.
        </div>
      </div>
    </footer>
  );
};
