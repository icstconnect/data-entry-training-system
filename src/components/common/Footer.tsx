import React from 'react';
import { ExternalLink, Globe, Map } from 'lucide-react';
import { ICST_CONNECT } from '../../config/appConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-shell">
        <div className="footer-top-grid">
          {/* Dual-Brand Ownership Lockup */}
          <div className="footer-brand-col">
            <div className="footer-dual-logos">
              <img
                src="/logo.png"
                alt="ICST LAB Logo"
                className="footer-logo"
                width={44}
                height={44}
                loading="lazy"
              />
              <span className="footer-logo-link-x" aria-hidden="true">×</span>
              <a
                href={ICST_CONNECT.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icstconnect-logo-wrap"
                title="Visit ICST Connect Official Website (icstconnect.in)"
              >
                <img
                  src={ICST_CONNECT.LOGO_PATH}
                  alt="ICST Connect Official Logo (icstconnect.in)"
                  className="footer-icstconnect-logo"
                  width={42}
                  height={42}
                  loading="lazy"
                />
              </a>
            </div>

            <div className="footer-brand-copy">
              <div className="footer-ownership-pill">
                <Globe size={12} />
                <span>Official Property of <strong>icstconnect.in</strong></span>
              </div>
              <div className="footer-inst-title">
                ICST LAB • Institute of Computer Science &amp; Technology, Chowberia
              </div>
              <p className="footer-inst-sub">
                Part of the <strong>ICST Connect</strong> digital education ecosystem — empowering students with enterprise data entry, Excel 365, Windows 11, Terminal HDDE, and kinesthetic typing mastery.
              </p>
              <a
                href={ICST_CONNECT.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-portal-cta"
              >
                <span>Open ICST Connect Portal</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Direct ICST Connect Ecosystem Links */}
          <nav className="footer-link-col" aria-label="ICST Connect Ecosystem Links">
            <h3 className="footer-col-heading">ICST Connect</h3>
            <ul className="footer-link-list">
              <li>
                <a href={ICST_CONNECT.URL} target="_blank" rel="noopener noreferrer">
                  icstconnect.in Home <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href={ICST_CONNECT.COURSES_URL} target="_blank" rel="noopener noreferrer">
                  Certified Courses <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href={ICST_CONNECT.ONLINE_TEST_URL} target="_blank" rel="noopener noreferrer">
                  Online Examinations <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href={ICST_CONNECT.SCHOLARSHIPS_URL} target="_blank" rel="noopener noreferrer">
                  Scholarships <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href={ICST_CONNECT.CONNECT_URL} target="_blank" rel="noopener noreferrer">
                  Contact &amp; Connect <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </nav>

          {/* Interactive Labs Sitemap */}
          <nav className="footer-link-col" aria-label="Interactive Training Labs Sitemap">
            <h3 className="footer-col-heading">Training Labs</h3>
            <ul className="footer-link-list">
              <li><a href="#practice">Practice Forms &amp; Marksheets</a></li>
              <li><a href="#excel">Excel 365 Mass Entry Lab</a></li>
              <li><a href="#windows">Windows 11 Organization Lab</a></li>
              <li><a href="#terminal">Terminal Stream HDDE Lab</a></li>
              <li><a href="#typing">Touch Typing Lab (25 Levels)</a></li>
              <li><a href="#word-express">Word Express Delivery Lab</a></li>
            </ul>
          </nav>

          {/* Quick Portal & SEO Sitemap */}
          <nav className="footer-link-col" aria-label="Resources and Sitemap">
            <h3 className="footer-col-heading">Explore &amp; Sitemap</h3>
            <ul className="footer-link-list">
              <li><a href="#home">ICST LAB Home</a></li>
              <li><a href="#dashboard">Trainee Analytics Dashboard</a></li>
              <li><a href="#showcase">Live Honors Showcase</a></li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                  <Map size={11} /> XML Sitemap
                </a>
              </li>
              <li>
                <a href={ICST_CONNECT.GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  GitHub (@icstconnect) <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            © {new Date().getFullYear()} <strong>ICST Connect (icstconnect.in)</strong> • Institute of Computer Science &amp; Technology, Chowberia, West Bengal. All rights reserved.
          </div>
          <div className="footer-disclaimer">
            Training Simulation Platform. All academic marksheets and student data records are synthetic and fictional, engineered exclusively for skill enhancement.
          </div>
        </div>
      </div>
    </footer>
  );
};
