/**
 * Global Application Configuration for ICST LAB
 * Official Interactive Training Property of ICST Connect (https://icstconnect.in)
 */

export const ICST_CONNECT = {
  NAME: "ICST Connect",
  DOMAIN: "icstconnect.in",
  URL: "https://icstconnect.in",
  COURSES_URL: "https://icstconnect.in/courses",
  ONLINE_TEST_URL: "https://icstconnect.in/online-test",
  SCHOLARSHIPS_URL: "https://icstconnect.in/scholarships",
  ABOUT_URL: "https://icstconnect.in/about",
  CONNECT_URL: "https://icstconnect.in/connect",
  LOGO_PATH: "/icstconnect-logo.png",
  REMOTE_LOGO_URL: "https://icstconnect.in/logo.png",
  GITHUB_URL: "https://github.com/icstconnect",
  INSTAGRAM_URL: "https://instagram.com/icstconnect",
  HANDLE: "@icstconnect",
  HASHTAG: "#ICSTChowberia",
  ATTRIBUTION: "An official property of icstconnect.in"
} as const;

export const APP_CONFIG = {
  INSTITUTE_NAME: "Institute of Computer Science and Technology Chowberia",
  INSTITUTE_SHORT: "ICST - CHOWBERIA",
  APP_TITLE: "ICST LAB",
  SUBTITLE: "Official Interactive Training Platform by ICST Connect (icstconnect.in)",
  APP_LOGO_PATH: "/logo.png",
  ICST_CONNECT_LOGO_PATH: ICST_CONNECT.LOGO_PATH,
  PARENT_PORTAL_URL: ICST_CONNECT.URL,
  PARENT_PORTAL_DOMAIN: ICST_CONNECT.DOMAIN,
  ROLL_PREFIX: "NYSDB0140-0",
  DEFAULT_TIME_LIMIT_SECONDS: 600, // 10 minutes

  // Ensure localhost:5173 is NEVER used in user-facing shares
  PUBLIC_APP_URL: typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? window.location.origin
    : 'https://icstconnect.in/typing-practice'
};

/**
 * Format roll number:
 * Takes numeric string, normalizes to 3 digits (e.g. "7" -> "007", "42" -> "042", "125" -> "125")
 * Returns { rawRoll: "042", generatedRollId: "NYSDB0140-0042" } or null if invalid
 */
export function normalizeAndGenerateRollId(input: string | number): { rawRoll: string; generatedRollId: string } | null {
  const digits = String(input).trim().replace(/\D/g, '');
  if (!digits) return null;

  // Convert to integer and check bounds 0 to 999
  const num = parseInt(digits, 10);
  if (isNaN(num) || num < 0 || num > 999) return null;

  const rawRoll = String(num).padStart(3, '0');
  const generatedRollId = `${APP_CONFIG.ROLL_PREFIX}${rawRoll}`;
  return { rawRoll, generatedRollId };
}
