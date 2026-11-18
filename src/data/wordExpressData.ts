import {
  CarrierTier,
  WordExpressLevel,
  WordExpressResolvedCriteria,
  WordExpressStageMeta,
  WordToughness
} from '../types/wordExpress';

/**
 * 16 Escalating Visual Delivery Carriers — from Human Courier to UFO 3!
 * Ordered strictly by active streak from lowest to highest.
 */
export const CARRIER_TIERS: CarrierTier[] = [
  {
    tier: 1,
    id: 'human',
    name: 'Courier Runner',
    minStreak: 0,
    accent: '#f97316',
    glow: 'rgba(249, 115, 22, 0.35)',
    speedTag: 'On Foot',
    trackTheme: 'road',
    enterMs: 260,
    exitMs: 360
  },
  {
    tier: 2,
    id: 'bicycle',
    name: 'Bicycle',
    minStreak: 3,
    accent: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.35)',
    speedTag: 'Pedal Express',
    trackTheme: 'road',
    enterMs: 250,
    exitMs: 345
  },
  {
    tier: 3,
    id: 'motorcycle',
    name: 'Motorcycle',
    minStreak: 6,
    accent: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.35)',
    speedTag: 'Moto Dash',
    trackTheme: 'road',
    enterMs: 235,
    exitMs: 330
  },
  {
    tier: 4,
    id: 'car',
    name: '4-Wheeler Car',
    minStreak: 9,
    accent: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.35)',
    speedTag: 'Street Cruise',
    trackTheme: 'road',
    enterMs: 225,
    exitMs: 320
  },
  {
    tier: 5,
    id: 'small-f1',
    name: 'Small F1 Car',
    minStreak: 12,
    accent: '#eab308',
    glow: 'rgba(234, 179, 8, 0.4)',
    speedTag: 'Formula Jr.',
    trackTheme: 'race',
    enterMs: 215,
    exitMs: 305
  },
  {
    tier: 6,
    id: 'f1',
    name: 'F1 Car',
    minStreak: 16,
    accent: '#dc2626',
    glow: 'rgba(220, 38, 38, 0.45)',
    speedTag: 'Grand Prix',
    trackTheme: 'race',
    enterMs: 205,
    exitMs: 290
  },
  {
    tier: 7,
    id: 'small-plane',
    name: 'Small Airplane',
    minStreak: 20,
    accent: '#0ea5e9',
    glow: 'rgba(14, 165, 233, 0.4)',
    speedTag: 'Prop Flight',
    trackTheme: 'sky',
    enterMs: 200,
    exitMs: 285
  },
  {
    tier: 8,
    id: 'medium-plane',
    name: 'Medium Airplane',
    minStreak: 24,
    accent: '#0284c7',
    glow: 'rgba(2, 132, 199, 0.45)',
    speedTag: 'Twin Jet',
    trackTheme: 'sky',
    enterMs: 195,
    exitMs: 275
  },
  {
    tier: 9,
    id: 'big-plane',
    name: 'Big Airplane',
    minStreak: 28,
    accent: '#2563eb',
    glow: 'rgba(37, 99, 235, 0.45)',
    speedTag: 'Jumbo Liner',
    trackTheme: 'sky',
    enterMs: 190,
    exitMs: 270
  },
  {
    tier: 10,
    id: 'fighter',
    name: 'Fighter Plane',
    minStreak: 33,
    accent: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.5)',
    speedTag: 'Afterburner',
    trackTheme: 'sky',
    enterMs: 185,
    exitMs: 255
  },
  {
    tier: 11,
    id: 'supersonic',
    name: 'Supersonic Fighter',
    minStreak: 38,
    accent: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.55)',
    speedTag: 'Mach 2+',
    trackTheme: 'sky',
    enterMs: 175,
    exitMs: 245
  },
  {
    tier: 12,
    id: 'rocket',
    name: 'Rocket',
    minStreak: 43,
    accent: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.55)',
    speedTag: 'Orbital Boost',
    trackTheme: 'space',
    enterMs: 170,
    exitMs: 235
  },
  {
    tier: 13,
    id: 'spaceship',
    name: 'Spaceship',
    minStreak: 49,
    accent: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.55)',
    speedTag: 'Warp Drive',
    trackTheme: 'space',
    enterMs: 165,
    exitMs: 230
  },
  {
    tier: 14,
    id: 'ufo-1',
    name: 'UFO 1',
    minStreak: 55,
    accent: '#10b981',
    glow: 'rgba(16, 185, 129, 0.6)',
    speedTag: 'Scout Saucer',
    trackTheme: 'space',
    enterMs: 160,
    exitMs: 225
  },
  {
    tier: 15,
    id: 'ufo-2',
    name: 'UFO 2',
    minStreak: 62,
    accent: '#00d8ff',
    glow: 'rgba(0, 216, 255, 0.65)',
    speedTag: 'Plasma Cruiser',
    trackTheme: 'space',
    enterMs: 155,
    exitMs: 220
  },
  {
    tier: 16,
    id: 'ufo-3',
    name: 'UFO 3',
    minStreak: 70,
    accent: '#e879f9',
    glow: 'rgba(232, 121, 249, 0.7)',
    speedTag: 'Omega Mothership',
    trackTheme: 'space',
    enterMs: 150,
    exitMs: 215
  }
];

export function getCarrierForStreak(streak: number): CarrierTier {
  let matched = CARRIER_TIERS[0];
  for (const c of CARRIER_TIERS) {
    if (streak >= c.minStreak) {
      matched = c;
    } else {
      break;
    }
  }
  return matched;
}

export function getNextCarrierTier(currentTier: number): CarrierTier | null {
  return CARRIER_TIERS.find(c => c.tier === currentTier + 1) || null;
}

export function getCarrierByTier(tier: number): CarrierTier {
  return CARRIER_TIERS.find(c => c.tier === tier) || CARRIER_TIERS[0];
}

export const WORD_EXPRESS_STAGES_META: WordExpressStageMeta[] = [
  {
    stage: 1,
    title: 'Stage 1: Home Row Word Foundations',
    tagline: 'Simple 2–4 letter home-row words to build effortless rhythm',
    levelRange: [1, 5],
    badgeName: 'Road Courier',
    color: '#0ea5e9'
  },
  {
    stage: 2,
    title: 'Stage 2: Top Row Everyday Words',
    tagline: 'Natural daily vocabulary blending home & top row keys',
    levelRange: [6, 10],
    badgeName: 'Track Racer',
    color: '#10b981'
  },
  {
    stage: 3,
    title: 'Stage 3: Full Alphabet Simple Words',
    tagline: 'All 26 letters woven into friendly, high-flow words',
    levelRange: [11, 15],
    badgeName: 'Sky Aviator',
    color: '#8b5cf6'
  },
  {
    stage: 4,
    title: 'Stage 4: Multi-Syllable & Capitalized Words',
    tagline: 'Clean Shift capitals, longer everyday words & crisp cadence',
    levelRange: [16, 20],
    badgeName: 'Supersonic Pilot',
    color: '#f59e0b'
  },
  {
    stage: 5,
    title: 'Stage 5: Express Speed & Cosmic Mastery',
    tagline: 'Smooth compound words, office terms & UFO-speed streaks',
    levelRange: [21, 25],
    badgeName: 'Galactic Commander',
    color: '#ec4899'
  }
];

/**
 * 25 Progressive Word Delivery Stages
 */
export const WORD_EXPRESS_LEVELS: WordExpressLevel[] = [
  // STAGE 1: Home Row Simple Words (Levels 1-5)
  {
    id: 1,
    stage: 1,
    stageName: 'Home Row Word Foundations',
    title: 'First Simple Words',
    subtitle: 'Short home-row pairs & starter words',
    focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
    words: ['as', 'ad', 'all', 'add', 'dad', 'sad', 'lad', 'ask', 'fall', 'call', 'lad', 'all', 'dad', 'ask'],
    baseWpm: 10,
    baseAcc: 84,
    baseMaxErrors: null,
    baseMinStreak: null
  },
  {
    id: 2,
    stage: 1,
    stageName: 'Home Row Word Foundations',
    title: 'Home Row Rhythm',
    subtitle: 'Smooth 3–4 letter anchor words',
    focusKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    words: ['had', 'has', 'ash', 'gas', 'lag', 'hag', 'gal', 'half', 'hall', 'glad', 'flag', 'dash', 'gash', 'lash'],
    baseWpm: 12,
    baseAcc: 85,
    baseMaxErrors: null,
    baseMinStreak: null
  },
  {
    id: 3,
    stage: 1,
    stageName: 'Home Row Word Foundations',
    title: 'Steady Home Flow',
    subtitle: 'Balanced left & right hand words',
    focusKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    words: ['salad', 'glass', 'flash', 'flask', 'shall', 'falls', 'halls', 'flags', 'glads', 'slash', 'clash', 'ask', 'half', 'dash', 'glad'],
    baseWpm: 13,
    baseAcc: 86,
    baseMaxErrors: null,
    baseMinStreak: 10
  },
  {
    id: 4,
    stage: 1,
    stageName: 'Home Row Word Foundations',
    title: 'Adding Vowels E & O',
    subtitle: 'Simple words with e and o reach',
    focusKeys: ['e', 'o', 'a', 's', 'd', 'f', 'h', 'k', 'l'],
    words: ['see', 'old', 'dog', 'log', 'egg', 'off', 'ask', 'doe', 'foe', 'hoe', 'desk', 'held', 'shoe', 'load', 'fold', 'gold'],
    baseWpm: 14,
    baseAcc: 86,
    baseMaxErrors: null,
    baseMinStreak: 12
  },
  {
    id: 5,
    stage: 1,
    stageName: 'Home Row Word Foundations',
    title: 'Stage 1 Courier Run',
    subtitle: 'Home row + e, o, i everyday words',
    focusKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'e', 'i', 'o'],
    words: ['like', 'life', 'side', 'hide', 'file', 'hill', 'fill', 'gold', 'hold', 'sold', 'kids', 'dish', 'fish', 'soil', 'oil', 'leaf'],
    baseWpm: 15,
    baseAcc: 87,
    baseMaxErrors: 8,
    baseMinStreak: 14
  },

  // STAGE 2: Top Row Everyday Words (Levels 6-10)
  {
    id: 6,
    stage: 2,
    stageName: 'Top Row Everyday Words',
    title: 'Top Index Words',
    subtitle: 'Simple words using r, t, u, y',
    focusKeys: ['r', 't', 'u', 'y', 'a', 's', 'd', 'f', 'h'],
    words: ['rat', 'hat', 'sat', 'day', 'ray', 'try', 'fur', 'hut', 'rut', 'art', 'star', 'fast', 'hard', 'dust', 'rust', 'trust'],
    baseWpm: 15,
    baseAcc: 86,
    baseMaxErrors: null,
    baseMinStreak: 12
  },
  {
    id: 7,
    stage: 2,
    stageName: 'Top Row Everyday Words',
    title: 'Top Middle & Ring Words',
    subtitle: 'Natural words with w, e, i, o',
    focusKeys: ['w', 'e', 'i', 'o', 'r', 't', 's', 'd', 'l'],
    words: ['two', 'low', 'row', 'dew', 'new', 'owl', 'oil', 'wide', 'wire', 'wood', 'word', 'work', 'west', 'wind', 'will', 'well'],
    baseWpm: 16,
    baseAcc: 87,
    baseMaxErrors: null,
    baseMinStreak: 14
  },
  {
    id: 8,
    stage: 2,
    stageName: 'Top Row Everyday Words',
    title: 'Top Pinky Words (Q & P)',
    subtitle: 'Adding p and q to fluid words',
    focusKeys: ['q', 'p', 'w', 'e', 'r', 't', 'o', 'a', 's'],
    words: ['top', 'pop', 'pot', 'pet', 'pat', 'pit', 'step', 'stop', 'ship', 'shop', 'play', 'plan', 'part', 'port', 'quip', 'quit'],
    baseWpm: 17,
    baseAcc: 87,
    baseMaxErrors: 8,
    baseMinStreak: 14
  },
  {
    id: 9,
    stage: 2,
    stageName: 'Top Row Everyday Words',
    title: 'Daily Action Words',
    subtitle: 'Common verbs & nouns across two rows',
    focusKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    words: ['read', 'write', 'hear', 'walk', 'talk', 'look', 'keep', 'help', 'grow', 'flow', 'show', 'wait', 'stay', 'tree', 'road', 'water'],
    baseWpm: 18,
    baseAcc: 88,
    baseMaxErrors: 8,
    baseMinStreak: 16
  },
  {
    id: 10,
    stage: 2,
    stageName: 'Top Row Everyday Words',
    title: 'Stage 2 Express Sprint',
    subtitle: 'Smooth 5–6 letter home + top words',
    focusKeys: ['e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f'],
    words: ['light', 'right', 'first', 'great', 'start', 'paper', 'power', 'quiet', 'house', 'world', 'story', 'earth', 'field', 'heart', 'short', 'fresh'],
    baseWpm: 19,
    baseAcc: 89,
    baseMaxErrors: 7,
    baseMinStreak: 18
  },

  // STAGE 3: Full Alphabet Simple Words (Levels 11-15)
  {
    id: 11,
    stage: 3,
    stageName: 'Full Alphabet Simple Words',
    title: 'Bottom Index Words',
    subtitle: 'Simple words using v, b, n, m',
    focusKeys: ['v', 'b', 'n', 'm', 'a', 'e', 'i', 'o', 'u'],
    words: ['van', 'man', 'ban', 'fan', 'bin', 'sun', 'run', 'bus', 'map', 'mat', 'name', 'beam', 'moon', 'vine', 'five', 'move', 'team'],
    baseWpm: 18,
    baseAcc: 87,
    baseMaxErrors: 8,
    baseMinStreak: 16
  },
  {
    id: 12,
    stage: 3,
    stageName: 'Full Alphabet Simple Words',
    title: 'C & X Everyday Words',
    subtitle: 'Adding bottom middle & ring reaches',
    focusKeys: ['c', 'x', 'a', 'e', 'i', 'o', 's', 't', 'n'],
    words: ['cat', 'cup', 'car', 'box', 'fox', 'six', 'mix', 'fix', 'tax', 'wax', 'cake', 'city', 'cold', 'card', 'next', 'text', 'exit'],
    baseWpm: 19,
    baseAcc: 88,
    baseMaxErrors: 8,
    baseMinStreak: 16
  },
  {
    id: 13,
    stage: 3,
    stageName: 'Full Alphabet Simple Words',
    title: 'Z & Full Alphabet Words',
    subtitle: 'Completing all 26 letters cleanly',
    focusKeys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'q', 'j'],
    words: ['zip', 'zoo', 'zero', 'zone', 'jazz', 'quiz', 'jump', 'just', 'back', 'pack', 'blue', 'glow', 'zoom', 'maze', 'size', 'breeze', 'prize'],
    baseWpm: 20,
    baseAcc: 89,
    baseMaxErrors: 7,
    baseMinStreak: 18
  },
  {
    id: 14,
    stage: 3,
    stageName: 'Full Alphabet Simple Words',
    title: 'Everyday Objects Queue',
    subtitle: 'Crisp, familiar 4–5 letter nouns',
    focusKeys: ['a', 'b', 'c', 'd', 'e', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't'],
    words: ['book', 'desk', 'lamp', 'milk', 'bird', 'fish', 'coat', 'shoe', 'door', 'wall', 'clock', 'chair', 'table', 'phone', 'glass', 'bread', 'smile', 'train'],
    baseWpm: 21,
    baseAcc: 89,
    baseMaxErrors: 7,
    baseMinStreak: 20
  },
  {
    id: 15,
    stage: 3,
    stageName: 'Full Alphabet Simple Words',
    title: 'Stage 3 Aviator Run',
    subtitle: 'All-alphabet simple vocabulary streak',
    focusKeys: ['a', 'e', 'i', 'o', 'u', 'r', 's', 't', 'n', 'c', 'm', 'b'],
    words: ['quick', 'brown', 'jumps', 'river', 'cloud', 'music', 'plant', 'green', 'clean', 'dream', 'magic', 'ocean', 'stone', 'spark', 'voice', 'globe', 'craft', 'trail'],
    baseWpm: 22,
    baseAcc: 90,
    baseMaxErrors: 6,
    baseMinStreak: 22
  },

  // STAGE 4: Multi-Syllable & Capitalized Words (Levels 16-20)
  {
    id: 16,
    stage: 4,
    stageName: 'Multi-Syllable & Capitalized Words',
    title: 'Capitalized Starter Words',
    subtitle: 'Opposite-hand Shift on simple names & nouns',
    focusKeys: ['A', 'B', 'C', 'D', 'F', 'G', 'J', 'M', 'S', 'T'],
    words: ['Apple', 'Bridge', 'Cloud', 'Delta', 'Eagle', 'Flame', 'Green', 'House', 'India', 'Jungle', 'Kite', 'Light', 'Music', 'North', 'Ocean', 'Planet', 'River', 'Solar'],
    baseWpm: 21,
    baseAcc: 89,
    baseMaxErrors: 7,
    baseMinStreak: 18
  },
  {
    id: 17,
    stage: 4,
    stageName: 'Multi-Syllable & Capitalized Words',
    title: 'Two-Syllable Smooth Flow',
    subtitle: 'Natural 6-letter words with easy rhythm',
    focusKeys: ['a', 'e', 'i', 'o', 'r', 's', 't', 'n', 'l', 'm', 'p'],
    words: ['garden', 'market', 'school', 'window', 'summer', 'winter', 'silver', 'golden', 'rocket', 'planet', 'forest', 'island', 'bridge', 'pencil', 'laptop', 'screen', 'button', 'letter'],
    baseWpm: 23,
    baseAcc: 90,
    baseMaxErrors: 6,
    baseMinStreak: 22
  },
  {
    id: 18,
    stage: 4,
    stageName: 'Multi-Syllable & Capitalized Words',
    title: 'Office & Study Words',
    subtitle: 'Real classroom & workplace vocabulary',
    focusKeys: ['c', 'o', 'm', 'p', 'u', 't', 'e', 'r', 'd', 'a', 'f', 'l'],
    words: ['office', 'folder', 'record', 'report', 'sheet', 'table', 'typing', 'student', 'teacher', 'lesson', 'module', 'portal', 'status', 'verify', 'submit', 'review', 'backup', 'system'],
    baseWpm: 24,
    baseAcc: 90,
    baseMaxErrors: 6,
    baseMinStreak: 24
  },
  {
    id: 19,
    stage: 4,
    stageName: 'Multi-Syllable & Capitalized Words',
    title: 'Capitalized Places & Themes',
    subtitle: 'Smooth Shift transitions at rising speed',
    focusKeys: ['B', 'C', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'W'],
    words: ['Bengal', 'Campus', 'Coding', 'Design', 'Energy', 'Future', 'Galaxy', 'Harbor', 'Impact', 'Journey', 'Kernel', 'Launch', 'Matrix', 'Nadia', 'Orbit', 'Portal', 'Runner', 'Summit'],
    baseWpm: 25,
    baseAcc: 91,
    baseMaxErrors: 6,
    baseMinStreak: 24
  },
  {
    id: 20,
    stage: 4,
    stageName: 'Multi-Syllable & Capitalized Words',
    title: 'Stage 4 Supersonic Trial',
    subtitle: 'Crisp everyday words at jet pace',
    focusKeys: ['a', 'e', 'i', 'o', 'u', 's', 't', 'r', 'n', 'd', 'c', 'l'],
    words: ['bright', 'smooth', 'steady', 'simple', 'strong', 'active', 'modern', 'clever', 'swift', 'stream', 'flight', 'engine', 'beacon', 'signal', 'motion', 'target', 'reward', 'victor', 'master'],
    baseWpm: 26,
    baseAcc: 91,
    baseMaxErrors: 5,
    baseMinStreak: 26
  },

  // STAGE 5: Express Speed & Cosmic Mastery (Levels 21-25)
  {
    id: 21,
    stage: 5,
    stageName: 'Express Speed & Cosmic Mastery',
    title: 'Tech & Computing Words',
    subtitle: 'Clean 7–8 letter digital vocabulary',
    focusKeys: ['k', 'e', 'y', 'b', 'o', 'a', 'r', 'd', 'n', 't', 'w', 'c'],
    words: ['keyboard', 'network', 'browser', 'monitor', 'desktop', 'program', 'digital', 'storage', 'archive', 'command', 'process', 'display', 'printer', 'scanner', 'battery', 'adapter', 'console', 'package'],
    baseWpm: 26,
    baseAcc: 91,
    baseMaxErrors: 6,
    baseMinStreak: 26
  },
  {
    id: 22,
    stage: 5,
    stageName: 'Express Speed & Cosmic Mastery',
    title: 'Courier Fleet Sprint',
    subtitle: 'Transport & space themed streak builder',
    focusKeys: ['b', 'c', 'f', 'g', 'h', 'm', 'p', 'r', 's', 't', 'u', 'v'],
    words: ['runner', 'bicycle', 'scooter', 'cruiser', 'formula', 'biplane', 'airliner', 'fighter', 'mach', 'booster', 'rocket', 'starship', 'capsule', 'shuttle', 'saucer', 'galaxy', 'nebula', 'cosmos', 'meteor'],
    baseWpm: 28,
    baseAcc: 91,
    baseMaxErrors: 5,
    baseMinStreak: 28
  },
  {
    id: 23,
    stage: 5,
    stageName: 'Express Speed & Cosmic Mastery',
    title: 'Fluency & Flow Marathon',
    subtitle: '20 smooth words for long streak climbs',
    focusKeys: ['a', 'e', 'i', 'o', 'u', 'r', 's', 't', 'n', 'l', 'p', 'v'],
    words: ['practice', 'improve', 'achieve', 'certify', 'deliver', 'express', 'journey', 'balance', 'rhythm', 'cadence', 'harmony', 'forward', 'clarity', 'quality', 'ability', 'focused', 'natural', 'kinetic', 'swiftly', 'victory'],
    baseWpm: 29,
    baseAcc: 92,
    baseMaxErrors: 5,
    baseMinStreak: 32
  },
  {
    id: 24,
    stage: 5,
    stageName: 'Express Speed & Cosmic Mastery',
    title: 'Precision Warp Run',
    subtitle: 'Mixed capitals & longer speed words',
    focusKeys: ['C', 'E', 'F', 'G', 'M', 'P', 'R', 'S', 'T', 'V'],
    words: ['Velocity', 'Accuracy', 'Momentum', 'Throttle', 'Tailwind', 'Altitude', 'Starlight', 'Horizon', 'Quantum', 'Protocol', 'Terminal', 'Database', 'Document', 'Register', 'Operator', 'Champion', 'Landmark', 'Pipeline', 'Spectrum', 'Infinity'],
    baseWpm: 31,
    baseAcc: 92,
    baseMaxErrors: 4,
    baseMinStreak: 36
  },
  {
    id: 25,
    stage: 5,
    stageName: 'Express Speed & Cosmic Mastery',
    title: 'Galactic Final Delivery',
    subtitle: '22-word finale built to launch UFO 3!',
    focusKeys: ['A', 'C', 'E', 'G', 'M', 'O', 'P', 'R', 'S', 'U'],
    words: ['Express', 'Courier', 'Bicycle', 'Formula', 'Airliner', 'Fighter', 'Rocket', 'Starship', 'Saucer', 'Cosmic', 'Rhythm', 'Harmony', 'Precision', 'Velocity', 'Practice', 'Progress', 'Achieve', 'Certify', 'Keyboard', 'Champion', 'Galactic', 'Mastery'],
    baseWpm: 32,
    baseAcc: 93,
    baseMaxErrors: 4,
    baseMinStreak: 40
  }
];

/**
 * Dynamically calculates passing criteria for any level given the user's chosen toughness
 * (stored in cookies: 'easy' | 'moderate' | 'hard').
 */
export function getCriteriaForToughness(
  level: WordExpressLevel,
  toughness: WordToughness
): WordExpressResolvedCriteria {
  if (toughness === 'easy') {
    const minWpm = Math.max(6, Math.round(level.baseWpm * 0.7));
    const minAcc = Math.max(78, level.baseAcc - 5);
    const maxErrors = null;
    const minStreak = null;
    return {
      minWpm,
      minAcc,
      maxErrors,
      minStreak,
      desc: `Min ${minWpm} WPM • ${minAcc}% Acc`
    };
  }

  if (toughness === 'hard') {
    const minWpm = Math.round(level.baseWpm * 1.32);
    const minAcc = Math.min(97, level.baseAcc + 4);
    const maxErrors =
      level.baseMaxErrors !== null
        ? Math.max(2, Math.round(level.baseMaxErrors * 0.55))
        : Math.max(3, 8 - level.stage);
    const minStreak =
      level.baseMinStreak !== null
        ? Math.round(level.baseMinStreak * 1.25)
        : 12 + level.stage * 3;
    return {
      minWpm,
      minAcc,
      maxErrors,
      minStreak,
      desc: `Min ${minWpm} WPM • ${minAcc}% Acc • Max ${maxErrors} Err`
    };
  }

  // Moderate (balanced default)
  const minWpm = level.baseWpm;
  const minAcc = level.baseAcc;
  const maxErrors = level.baseMaxErrors;
  const minStreak = level.baseMinStreak;
  const parts = [`Min ${minWpm} WPM`, `${minAcc}% Acc`];
  if (maxErrors !== null) parts.push(`Max ${maxErrors} Err`);
  else if (minStreak !== null) parts.push(`${minStreak} Streak`);
  return {
    minWpm,
    minAcc,
    maxErrors,
    minStreak,
    desc: parts.join(' • ')
  };
}

export function getWordExpressLevelById(id: number): WordExpressLevel | undefined {
  return WORD_EXPRESS_LEVELS.find(lvl => lvl.id === id);
}
