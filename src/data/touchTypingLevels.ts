import { TouchTypingLevel, TouchTypingStage } from '../types/touchTyping';

/**
 * 5 Progressive Touch Typing Stages
 * Balanced 50% Learning Focus (Levels 1-12) & 50% Challenge Focus (Levels 13-25)
 */
export const TOUCH_TYPING_STAGES: TouchTypingStage[] = [
  {
    id: 1,
    name: 'Core Rhythm Foundations',
    description: 'Home row anchors, spacebar cadence, and relaxed finger positioning',
    levelRange: [1, 5]
  },
  {
    id: 2,
    name: 'Top Row Expansion',
    description: 'Comfortable upward reaches with index, middle, and ring fingers',
    levelRange: [6, 10]
  },
  {
    id: 3,
    name: 'Bottom Row Integration',
    description: 'Lower row coordination, punctuation anchors, and full alphabet flow',
    levelRange: [11, 15]
  },
  {
    id: 4,
    name: 'Capitals, Numbers & Punctuation',
    description: 'Opposite-hand Shift coordination, top number row, and structured data',
    levelRange: [16, 20]
  },
  {
    id: 5,
    name: 'Speed, Code & Mastery',
    description: 'Developer brackets, real-world syntax, prose flow, and confident velocity',
    levelRange: [21, 25]
  }
];

/**
 * 25 Progressive Levels — Balanced 50% Learning Focus (L1-L12) & 50% Challenge Focus (L13-L25)
 * Gently paced WPM, accuracy, and error tolerances so learners build muscle memory
 * without frustration before stepping into rewarding mid-to-advanced challenges.
 */
export const TOUCH_TYPING_LEVELS: TouchTypingLevel[] = [
  // =========================================================================
  // LEARNING FOCUS HALF (Levels 1-12) — Muscle Memory & Comfortable Rhythm
  // =========================================================================

  // STAGE 1: Core Rhythm Foundations (Levels 1-5)
  {
    id: 1,
    stage: 1,
    stageName: 'Core Rhythm Foundations',
    focusMode: 'learning',
    title: 'a, o & Spacebar Flow',
    subtitle: 'Keys: a, o, Space',
    focusKeys: ['a', 'o', ' '],
    text: 'aa o oo a aa o oo a ao oa aao ooa aa o oo aao ooa aoa oao',
    criteria: { minWpm: 6, minAcc: 80, maxErrors: null, minStreak: null },
    criteriaDesc: 'Min 6 WPM • 80% Accuracy'
  },
  {
    id: 2,
    stage: 1,
    stageName: 'Core Rhythm Foundations',
    focusMode: 'learning',
    title: 'Index Finger Anchors',
    subtitle: 'Keys: f, j, Space',
    focusKeys: ['f', 'j', ' '],
    text: 'ff j jj f ff j jj f fj jf ffj jjf fjf jfj ff jj fjf jfj',
    criteria: { minWpm: 8, minAcc: 82, maxErrors: null, minStreak: null },
    criteriaDesc: 'Min 8 WPM • 82% Accuracy'
  },
  {
    id: 3,
    stage: 1,
    stageName: 'Core Rhythm Foundations',
    focusMode: 'learning',
    title: 'Middle Finger Harmony',
    subtitle: 'Keys: d, k, f, j',
    focusKeys: ['d', 'k', 'f', 'j'],
    text: 'dd k kk d df jk fd kj ddk kkd fjd kdf jfk djk dfjk kjfd',
    criteria: { minWpm: 9, minAcc: 84, maxErrors: null, minStreak: null },
    criteriaDesc: 'Min 9 WPM • 84% Accuracy'
  },
  {
    id: 4,
    stage: 1,
    stageName: 'Core Rhythm Foundations',
    focusMode: 'learning',
    title: 'Ring & Pinky Balance',
    subtitle: 'Keys: s, l, a, ;',
    focusKeys: ['s', 'l', 'a', ';', 'd', 'k'],
    text: 'ss l ll a ;; as l; sad lad ask fall lass salad; all falls;',
    criteria: { minWpm: 10, minAcc: 85, maxErrors: null, minStreak: null },
    criteriaDesc: 'Min 10 WPM • 85% Accuracy'
  },
  {
    id: 5,
    stage: 1,
    stageName: 'Core Rhythm Foundations',
    focusMode: 'learning',
    title: 'Full Home Row Mastery',
    subtitle: 'Keys: a s d f g h j k l ;',
    focusKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    text: 'fg hj glad half flags glass shall flash dash hall jag; flask;',
    criteria: { minWpm: 12, minAcc: 86, maxErrors: null, minStreak: 10 },
    criteriaDesc: 'Min 12 WPM • 86% Acc • 10 Streak'
  },

  // STAGE 2: Top Row Expansion (Levels 6-10)
  {
    id: 6,
    stage: 2,
    stageName: 'Top Row Expansion',
    focusMode: 'learning',
    title: 'Top Index Reach',
    subtitle: 'Keys: r, u, t, y',
    focusKeys: ['r', 'u', 't', 'y', 'f', 'j'],
    text: 'frf juj ftf jyj rut try turf fury jury duty hurt truth',
    criteria: { minWpm: 12, minAcc: 85, maxErrors: null, minStreak: null },
    criteriaDesc: 'Min 12 WPM • 85% Accuracy'
  },
  {
    id: 7,
    stage: 2,
    stageName: 'Top Row Expansion',
    focusMode: 'learning',
    title: 'Top Middle & Ring',
    subtitle: 'Keys: e, i, w, o',
    focusKeys: ['e', 'i', 'w', 'o', 'd', 'k', 's', 'l'],
    text: 'ded kik sws lol we owe wire tier wide fifteen wood life',
    criteria: { minWpm: 13, minAcc: 86, maxErrors: null, minStreak: null },
    criteriaDesc: 'Min 13 WPM • 86% Accuracy'
  },
  {
    id: 8,
    stage: 2,
    stageName: 'Top Row Expansion',
    focusMode: 'learning',
    title: 'Top Pinky & Full Top Row',
    subtitle: 'Keys: q, p, full top row',
    focusKeys: ['q', 'p', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o'],
    text: 'qaq ;p; quip quote power quite proper equip topple query paper',
    criteria: { minWpm: 14, minAcc: 86, maxErrors: null, minStreak: null },
    criteriaDesc: 'Min 14 WPM • 86% Accuracy'
  },
  {
    id: 9,
    stage: 2,
    stageName: 'Top Row Expansion',
    focusMode: 'learning',
    title: 'Home + Top Row Words',
    subtitle: 'Fluid English Vocabulary',
    focusKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    text: 'water lighthouse proud quiet field world great worthy figure spirit',
    criteria: { minWpm: 16, minAcc: 87, maxErrors: null, minStreak: null },
    criteriaDesc: 'Min 16 WPM • 87% Accuracy'
  },
  {
    id: 10,
    stage: 2,
    stageName: 'Top Row Expansion',
    focusMode: 'learning',
    title: 'Stage 2 Rhythm Checkpoint',
    subtitle: 'Dynamic Word Combinations',
    focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'e', 'r', 't', 'u', 'i', 'o'],
    text: 'through powerful efforts your fingers glide effortlessly across top keys',
    criteria: { minWpm: 18, minAcc: 88, maxErrors: null, minStreak: 12 },
    criteriaDesc: 'Min 18 WPM • 88% Acc • 12 Streak'
  },

  // STAGE 3 (Early): Bottom Row Learning (Levels 11-12)
  {
    id: 11,
    stage: 3,
    stageName: 'Bottom Row Integration',
    focusMode: 'learning',
    title: 'Bottom Index Reach',
    subtitle: 'Keys: v, n, b, m',
    focusKeys: ['v', 'n', 'b', 'm', 'f', 'j'],
    text: 'fvf jnj fbf jmj van man ban never vibrant number moment',
    criteria: { minWpm: 16, minAcc: 86, maxErrors: null, minStreak: null },
    criteriaDesc: 'Min 16 WPM • 86% Accuracy'
  },
  {
    id: 12,
    stage: 3,
    stageName: 'Bottom Row Integration',
    focusMode: 'learning',
    title: 'Bottom Middle & Ring',
    subtitle: 'Keys: c, comma, x, period',
    focusKeys: ['c', ',', 'x', '.', 'd', 'k', 's', 'l'],
    text: 'dcd k,k sxs l.l six mix fix, next text, exact, clock, track.',
    criteria: { minWpm: 17, minAcc: 87, maxErrors: null, minStreak: null },
    criteriaDesc: 'Min 17 WPM • 87% Accuracy'
  },

  // =========================================================================
  // CHALLENGE FOCUS HALF (Levels 13-25) — Guided Speed, Accuracy & Fluency
  // =========================================================================

  // STAGE 3 (Challenge): Full Alphabet Integration (Levels 13-15)
  {
    id: 13,
    stage: 3,
    stageName: 'Bottom Row Integration',
    focusMode: 'challenge',
    title: 'Bottom Pinky & Full Alphabet',
    subtitle: 'Keys: z, slash, all 26 letters',
    focusKeys: ['z', '/', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
    text: 'aza ;/; zero zone/puzzle/dazzle/breeze/frozen/amaze/horizon.',
    criteria: { minWpm: 19, minAcc: 88, maxErrors: null, minStreak: 14 },
    criteriaDesc: 'Min 19 WPM • 88% Acc • 14 Streak'
  },
  {
    id: 14,
    stage: 3,
    stageName: 'Bottom Row Integration',
    focusMode: 'challenge',
    title: 'Pangram Flow',
    subtitle: 'Every Letter of the Alphabet',
    focusKeys: ['t', 'h', 'e', 'q', 'u', 'i', 'c', 'k', 'b', 'r', 'o', 'w', 'n', 'f', 'x', 'j', 'm', 'p', 's', 'v', 'l', 'a', 'z', 'y', 'd', 'g'],
    text: 'the quick brown fox jumps over the lazy dog. pack my box with five dozen jugs.',
    criteria: { minWpm: 21, minAcc: 89, maxErrors: 8, minStreak: null },
    criteriaDesc: 'Min 21 WPM • 89% Acc • Max 8 Err'
  },
  {
    id: 15,
    stage: 3,
    stageName: 'Bottom Row Integration',
    focusMode: 'challenge',
    title: 'Full Alphabet Challenge',
    subtitle: 'Sustained Rhythm & Flow',
    focusKeys: ['a', 'e', 'i', 'o', 'u', 'r', 's', 't', 'l', 'n'],
    text: 'mastering all twenty six letters unlocks complete freedom and smooth velocity.',
    criteria: { minWpm: 23, minAcc: 90, maxErrors: 7, minStreak: 16 },
    criteriaDesc: 'Min 23 WPM • 90% Acc • 16 Streak'
  },

  // STAGE 4: Capitalization, Numbers & Punctuation (Levels 16-20)
  {
    id: 16,
    stage: 4,
    stageName: 'Capitals, Numbers & Punctuation',
    focusMode: 'challenge',
    title: 'Shift Key & Capital Letters',
    subtitle: 'Opposite-Hand Shift Coordination',
    focusKeys: ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'T', 'N'],
    text: 'Alice Bob Charlie David Elena Frank Grace Henry Isabel Jack Karen Liam',
    criteria: { minWpm: 20, minAcc: 88, maxErrors: null, minStreak: 14 },
    criteriaDesc: 'Min 20 WPM • 88% Acc • 14 Streak'
  },
  {
    id: 17,
    stage: 4,
    stageName: 'Capitals, Numbers & Punctuation',
    focusMode: 'challenge',
    title: 'Sentence Punctuation',
    subtitle: 'Keys: . , ! ? \' " -',
    focusKeys: ['.', ',', '!', '?', "'", '"', '-'],
    text: 'Wait! Is that true? "Yes, it is," she replied; step-by-step practice works!',
    criteria: { minWpm: 22, minAcc: 89, maxErrors: 8, minStreak: null },
    criteriaDesc: 'Min 22 WPM • 89% Acc • Max 8 Err'
  },
  {
    id: 18,
    stage: 4,
    stageName: 'Capitals, Numbers & Punctuation',
    focusMode: 'challenge',
    title: 'Top Number Row',
    subtitle: 'Keys: 1 2 3 4 5 6 7 8 9 0',
    focusKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    text: '11 22 33 44 55 66 77 88 99 00 1928 3746 5012 8490 2026 365 247',
    criteria: { minWpm: 19, minAcc: 88, maxErrors: 8, minStreak: null },
    criteriaDesc: 'Min 19 WPM • 88% Acc • Max 8 Err'
  },
  {
    id: 19,
    stage: 4,
    stageName: 'Capitals, Numbers & Punctuation',
    focusMode: 'challenge',
    title: 'Alphanumeric Data Entry',
    subtitle: 'Mixed Numbers, Caps & Words',
    focusKeys: ['2', '0', '5', '9', 'A', 'B', 'F', 'G'],
    text: 'Order 4829 shipped on May 15 at 09:30 AM. Tracking ID: ZX-9042-B7.',
    criteria: { minWpm: 24, minAcc: 90, maxErrors: 7, minStreak: 16 },
    criteriaDesc: 'Min 24 WPM • 90% Acc • 16 Streak'
  },
  {
    id: 20,
    stage: 4,
    stageName: 'Capitals, Numbers & Punctuation',
    focusMode: 'challenge',
    title: 'Stage 4 Precision Trial',
    subtitle: 'Balanced Accuracy Benchmark',
    focusKeys: ['1', '9', '8', '4', '!', '?', '.', ','],
    text: 'Precision beats raw haste: steady focus yields 100% mastery in 25 stages!',
    criteria: { minWpm: 26, minAcc: 91, maxErrors: 6, minStreak: 18 },
    criteriaDesc: 'Min 26 WPM • 91% Acc • Max 6 Err'
  },

  // STAGE 5: Speed, Code & Mastery (Levels 21-25)
  {
    id: 21,
    stage: 5,
    stageName: 'Speed, Code & Mastery',
    focusMode: 'challenge',
    title: 'Developer Brackets & Symbols',
    subtitle: 'Keys: ( ) { } [ ] = + ;',
    focusKeys: ['(', ')', '{', '}', '[', ']', '=', '+', ';'],
    text: 'fn(x) { return [x + 1, x * 2]; } if (a >= b) { list[0] = (a + b); }',
    criteria: { minWpm: 23, minAcc: 89, maxErrors: 8, minStreak: null },
    criteriaDesc: 'Min 23 WPM • 89% Acc • Max 8 Err'
  },
  {
    id: 22,
    stage: 5,
    stageName: 'Speed, Code & Mastery',
    focusMode: 'challenge',
    title: 'JavaScript & CSS Syntax',
    subtitle: 'Real-World Code Patterns',
    focusKeys: ['c', 'o', 'n', 's', 't', '=', '>', '{', '}', ';'],
    text: 'const sum = (a, b) => a + b; export default App; .box { display: flex; }',
    criteria: { minWpm: 26, minAcc: 90, maxErrors: 7, minStreak: 18 },
    criteriaDesc: 'Min 26 WPM • 90% Acc • Max 7 Err'
  },
  {
    id: 23,
    stage: 5,
    stageName: 'Speed, Code & Mastery',
    focusMode: 'challenge',
    title: 'Steady Prose Marathon',
    subtitle: 'Continuous Rhythm Endurance',
    focusKeys: ['t', 'h', 'e', 'a', 'n', 'd', 'i', 'g'],
    text: 'True rhythm on the keyboard feels like playing a grand piano; every finger knows its exact lane without hesitation.',
    criteria: { minWpm: 30, minAcc: 92, maxErrors: 6, minStreak: 22 },
    criteriaDesc: 'Min 30 WPM • 92% Acc • 22 Streak'
  },
  {
    id: 24,
    stage: 5,
    stageName: 'Speed, Code & Mastery',
    focusMode: 'challenge',
    title: 'Precision Rhythm Gauntlet',
    subtitle: 'Controlled Speed & Accuracy',
    focusKeys: ['q', 'z', 'x', 'j', 'k', 'v', 'b', 'p'],
    text: 'Quick reflexes, steady rhythm, and calm focus separate the practicing typist from the confident master.',
    criteria: { minWpm: 34, minAcc: 94, maxErrors: 4, minStreak: 25 },
    criteriaDesc: 'Min 34 WPM • 94% Acc • Max 4 Err'
  },
  {
    id: 25,
    stage: 5,
    stageName: 'Speed, Code & Mastery',
    focusMode: 'challenge',
    title: 'Grandmaster Final Exam',
    subtitle: 'Speed & Accuracy Synthesis',
    focusKeys: ['A', 'Z', '0', '9', ';', '.', '!', ' '],
    text: 'Level 25 Final Trial: Achieve 38+ WPM with 95% accuracy! Your 10 fingers now move in effortless, synchronized harmony.',
    criteria: { minWpm: 38, minAcc: 95, maxErrors: 4, minStreak: 30 },
    criteriaDesc: 'Min 38 WPM • 95% Acc • 30 Streak'
  }
];

/**
 * Backward compatibility alias
 */
export const LEVELS = TOUCH_TYPING_LEVELS;

/**
 * Lookup helper to retrieve a level by ID (1-25)
 */
export function getTouchTypingLevelById(id: number): TouchTypingLevel | undefined {
  return TOUCH_TYPING_LEVELS.find(lvl => lvl.id === id);
}

/**
 * Lookup helper to retrieve all levels belonging to a specific stage (1-5)
 */
export function getTouchTypingLevelsByStage(stage: number): TouchTypingLevel[] {
  return TOUCH_TYPING_LEVELS.filter(lvl => lvl.stage === stage);
}
