/**
 * Dynamic Title & Runtime SEO Metadata Service — ICST LAB
 * Synchronizes document.title, meta description, Open Graph, Twitter Cards,
 * and canonical URL across every lab view for full search engine discoverability.
 * Official property of ICST Connect (https://icstconnect.in).
 */

const BRAND_NAME = 'ICST LAB';
const PARENT_BRAND = 'ICST Connect (icstconnect.in)';

interface ViewSeoMeta {
  title: string;
  description: string;
  hashPath: string;
}

function getSeoMeta(view: string, detail?: string): ViewSeoMeta {
  switch (view) {
    case 'home':
    case 'landing':
      return {
        title: `${BRAND_NAME} | Official Interactive Training Platform by ${PARENT_BRAND}`,
        description:
          'ICST LAB — Official interactive training platform by ICST Connect (icstconnect.in) for Data Entry, Touch Typing, Excel 365, Windows 11, Terminal Stream, and Word Express at Institute of Computer Science and Technology, Chowberia.',
        hashPath: ''
      };

    case 'showcase':
      return {
        title: `Live Simulation & Honors Showcase | ${BRAND_NAME} • icstconnect.in`,
        description:
          'Explore verified trainee honors, live interactive demonstrations, and shareable achievement certificates on ICST LAB by ICST Connect (icstconnect.in).',
        hashPath: '#showcase'
      };

    case 'practice':
      return {
        title: detail
          ? `${detail} | Practice • ${BRAND_NAME}`
          : `Practice & Marksheets Lab | ${BRAND_NAME} • icstconnect.in`,
        description:
          'Practice structured admission forms, WBBSE/WBCHSE board marksheets, banking KYC, and character-level accuracy audits on ICST LAB (icstconnect.in).',
        hashPath: '#practice'
      };

    case 'excel':
      return {
        title: detail
          ? `${detail} | Excel 365 • ${BRAND_NAME}`
          : `Excel 365 Mass Lab | ${BRAND_NAME} • icstconnect.in`,
        description:
          'Master high-speed Microsoft Excel 365 tabular workflows, wholesale ledgers, KYC sheets, and census batches on ICST LAB by ICST Connect.',
        hashPath: '#excel'
      };

    case 'windows':
      return {
        title: detail
          ? `${detail} | Windows 11 • ${BRAND_NAME}`
          : `Windows 11 Organization Lab | ${BRAND_NAME} • icstconnect.in`,
        description:
          'Interactive Windows 11 desktop simulation for mastering file extensions, F2 renaming, ISO timestamps, and enterprise folder hierarchies on ICST LAB (icstconnect.in).',
        hashPath: '#windows'
      };

    case 'terminal':
      return {
        title: detail
          ? `${detail} | Terminal Stream • ${BRAND_NAME}`
          : `Terminal Stream Lab | ${BRAND_NAME} • icstconnect.in`,
        description:
          'Train 100% keyboard-driven Heads-Down Data Entry (HDDE) with scanned voucher spotlighting and real-time discrepancy radar on ICST LAB (icstconnect.in).',
        hashPath: '#terminal'
      };

    case 'typing':
    case 'touch-typing':
      return {
        title: detail
          ? `${detail} | Touch Typing • ${BRAND_NAME}`
          : `Touch Typing Lab (25 Levels) | ${BRAND_NAME} • icstconnect.in`,
        description:
          '25-level light-beam guided 10-finger touch typing trainer with live WPM cadence, accuracy telemetry, and finger geometry on ICST LAB (icstconnect.in).',
        hashPath: '#typing'
      };

    case 'word-express':
      return {
        title: detail
          ? `${detail} | Word Express • ${BRAND_NAME}`
          : `Word Express Delivery Lab | ${BRAND_NAME} • icstconnect.in`,
        description:
          'Build rapid word-typing fluency across 25 progressive stages and unlock a 16-vehicle delivery streak fleet on ICST LAB by ICST Connect.',
        hashPath: '#word-express'
      };

    case 'dashboard':
    case 'student-dashboard':
      return {
        title: `Student Profile, EXP & Honors | ${BRAND_NAME} • icstconnect.in`,
        description:
          'Track completed stages, typing speed trends, EXP rank badges, and downloadable ICST LAB certificates powered by ICST Connect.',
        hashPath: '#dashboard'
      };

    case 'teacher':
    case 'teacher-dashboard':
      return {
        title: `Teacher Assessment & Control Portal | ${BRAND_NAME} • icstconnect.in`,
        description:
          'Instructor portal for ICST LAB (icstconnect.in) to launch batch tests, inspect audit accuracy, and manage lab assessments.',
        hashPath: '#teacher'
      };

    default:
      return {
        title: detail
          ? `${detail} | ${BRAND_NAME} • icstconnect.in`
          : `${BRAND_NAME} | ${PARENT_BRAND}`,
        description:
          'ICST LAB — Official interactive computing & data training platform by ICST Connect (icstconnect.in), Institute of Computer Science and Technology Chowberia.',
        hashPath: ''
      };
  }
}

function setMetaContent(selector: string, content: string): void {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) {
    el.setAttribute('content', content);
  }
}

export function setAppTitle(view: string, detail?: string): void {
  if (typeof document === 'undefined') return;

  const meta = getSeoMeta(view, detail);
  document.title = meta.title;

  setMetaContent('meta[name="description"]', meta.description);
  setMetaContent('meta[property="og:title"]', meta.title);
  setMetaContent('meta[property="og:description"]', meta.description);
  setMetaContent('meta[name="twitter:title"]', meta.title);
  setMetaContent('meta[name="twitter:description"]', meta.description);

  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const url = `${window.location.origin}/${meta.hashPath}`;
    if (canonical) {
      canonical.setAttribute('href', url);
    }
    setMetaContent('meta[property="og:url"]', url);
  }
}
