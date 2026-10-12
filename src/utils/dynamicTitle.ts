/**
 * Dynamic Title Service
 * Dynamically updates document.title for every task, curriculum group, and page view
 */

const BASE_INSTITUTE = 'ICST Chowberia';

export function setAppTitle(view: string, detail?: string): void {
  if (typeof document === 'undefined') return;

  switch (view) {
    case 'home':
    case 'landing':
      document.title = `ICST Data Entry Lab | Institute of Computer Science & Technology Chowberia`;
      break;

    case 'showcase':
      document.title = `Live Simulation & Showcase | ICST Data Entry Lab`;
      break;

    case 'practice':
      document.title = detail 
        ? `${detail} | ICST Practice Lab`
        : `Practice Workbench | ICST Data Entry Lab`;
      break;

    case 'excel':
      document.title = detail 
        ? `${detail} | ICST Excel 365 Lab`
        : `Excel 365 Mass Data Lab | ${BASE_INSTITUTE}`;
      break;

    case 'windows':
      document.title = detail 
        ? `${detail} | ICST Windows Lab`
        : `Windows Organization Lab | ${BASE_INSTITUTE}`;
      break;

    case 'dashboard':
    case 'student-dashboard':
      document.title = `Student Profile & Honors | ${BASE_INSTITUTE}`;
      break;

    case 'teacher':
    case 'teacher-dashboard':
      document.title = `Teacher Assessment & Control Portal | ${BASE_INSTITUTE}`;
      break;

    default:
      document.title = detail 
        ? `${detail} | ICST Data Entry Lab`
        : `ICST Data Entry Lab | ${BASE_INSTITUTE}`;
      break;
  }
}
