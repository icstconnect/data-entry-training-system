import { TouchTypingLevel, TouchTypingStage } from '../types/touchTyping';

/**
 * 5 Progressive Touch Typing Stages
 */
export const TOUCH_TYPING_STAGES: TouchTypingStage[] = [
  {
    id: 1,
    name: 'Core Rhythm Foundations',
    description: 'Home row anchors, spacebar cadence, and fundamental finger positioning',
    levelRange: [1, 5]
  },
  {
    id: 2,
    name: 'Top Row Expansion',
    description: 'Reaching upward with index, middle, and ring fingers for fluid words',
    levelRange: [6, 10]
  },
  {
    id: 3,
    name: 'Bottom Row Integration',
    description: 'Lower row coordination, punctuation anchors, and full pangram flow',
    levelRange: [11, 15]
  },
  {
    id: 4,
    name: 'Capitals, Numbers & Punctuation',
    description: 'Opposite-hand Shift precision, top number row, and structured data formats',
    levelRange: [16, 20]
  },
  {
    id: 5,
    name: 'Advanced Speed, Code & Mastery',
    description: 'Developer brackets, programming syntax, sustained marathons, and grandmaster velocity',
    levelRange: [21, 25]
  }
];

/**
 * 25 Progressive Levels with Unique Passing Criteria
 * Level 1 starts with 'a', 'o', and Spacebar ('␣') to establish core rhythm.
 */
export const TOUCH_TYPING_LEVELS: TouchTypingLevel[] = [
  // STAGE 1: Home & Ring/Index Foundations (Levels 1-5)
  {
    id: 1,
    stage: 1,
    stageName: 'Core Rhythm Foundations',
    title: 'a, o & Spacebar Flow',
    subtitle: 'Keys: a, o, Space',
    focusKeys: ['a', 'o', ' '],
    text: 'aa o oo a aa o oo a ao oa aao ooa aa o oo aao ooa aoa oao',
    criteria: { minWpm: 10, minAcc: 85, maxErrors: null, minStreak: null },
    criteriaDesc: 'Min 10 WPM • 85% Accuracy'
  },
  {
    id: 2,
    stage: 1,
    stageName: 'Core Rhythm Foundations',
    title: 'Index Finger Anchors',
    subtitle: 'Keys: f, j, Space',
    focusKeys: ['f', 'j', ' '],
    text: 'ff j jj f ff j jj f fj jf ffj jjf fjf jfj ff jj fjf jfj',
    criteria: { minWpm: 12, minAcc: 88, maxErrors: null, minStreak: null },
    criteriaDesc: 'Min 12 WPM • 88% Accuracy'
  },
  {
    id: 3,
    stage: 1,
    stageName: 'Core Rhythm Foundations',
    title: 'Middle Finger Harmony',
    subtitle: 'Keys: d, k, f, j',
    focusKeys: ['d', 'k', 'f', 'j'],
    text: 'dd k kk d df jk fd kj ddk kkd fjd kdf jfk djk dfjk kjfd',
    criteria: { minWpm: 14, minAcc: 90, maxErrors: null, minStreak: 12 },
    criteriaDesc: 'Min 14 WPM • 90% Acc • 12 Streak'
  },
  {
    id: 4,
    stage: 1,
    stageName: 'Core Rhythm Foundations',
    title: 'Ring & Pinky Balance',
    subtitle: 'Keys: s, l, a, ;',
    focusKeys: ['s', 'l', 'a', ';', 'd', 'k'],
    text: 'ss l ll a ;; as l; sad lad ask fall lass salad; all falls;',
    criteria: { minWpm: 15, minAcc: 91, maxErrors: 5, minStreak: null },
    criteriaDesc: 'Min 15 WPM • 91% Acc • Max 5 Err'
  },
  {
    id: 5,
    stage: 1,
    stageName: 'Core Rhythm Foundations',
    title: 'Full Home Row Mastery',
    subtitle: 'Keys: a s d f g h j k l ;',
    focusKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    text: 'fg hj glad half flags glass shall flash dash hall jag; flask;',
    criteria: { minWpm: 18, minAcc: 92, maxErrors: 4, minStreak: 18 },
    criteriaDesc: 'Min 18 WPM • 92% Acc • Max 4 Err'
  },

  // STAGE 2: Top Row Expansion (Levels 6-10)
  {
    id: 6,
    stage: 2,
    stageName: 'Top Row Expansion',
    title: 'Top Index Reach',
    subtitle: 'Keys: r, u, t, y',
    focusKeys: ['r', 'u', 't', 'y', 'f', 'j'],
    text: 'frf juj ftf jyj rut try turf fury jury duty hurt truth',
    criteria: { minWpm: 18, minAcc: 90, maxErrors: null, minStreak: 15 },
    criteriaDesc: 'Min 18 WPM • 90% Acc • 15 Streak'
  },
  {
    id: 7,
    stage: 2,
    stageName: 'Top Row Expansion',
    title: 'Top Middle & Ring',
    subtitle: 'Keys: e, i, w, o',
    focusKeys: ['e', 'i', 'w', 'o', 'd', 'k', 's', 'l'],
    text: 'ded kik sws lol we owe wire tier wide fifteen wood life',
    criteria: { minWpm: 20, minAcc: 91, maxErrors: null, minStreak: null },
    criteriaDesc: 'Min 20 WPM • 91% Accuracy'
  },
  {
    id: 8,
    stage: 2,
    stageName: 'Top Row Expansion',
    title: 'Top Pinky & Full Top Row',
    subtitle: 'Keys: q, p, full top row',
    focusKeys: ['q', 'p', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o'],
    text: 'qaq ;p; quip quote power quite proper equip topple query paper',
    criteria: { minWpm: 22, minAcc: 92, maxErrors: 5, minStreak: null },
    criteriaDesc: 'Min 22 WPM • 92% Acc • Max 5 Err'
  },
  {
    id: 9,
    stage: 2,
    stageName: 'Top Row Expansion',
    title: 'Home + Top Row Words',
    subtitle: 'Fluid English Vocabulary',
    focusKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    text: 'water lighthouse proud quiet field world great worthy figure spirit',
    criteria: { minWpm: 25, minAcc: 93, maxErrors: null, minStreak: 20 },
    criteriaDesc: 'Min 25 WPM • 93% Acc • 20 Streak'
  },
  {
    id: 10,
    stage: 2,
    stageName: 'Top Row Expansion',
    title: 'Stage 2 Speed Boss',
    subtitle: 'Dynamic Word Combinations',
    focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'e', 'r', 't', 'u', 'i', 'o'],
    text: 'through powerful efforts your fingers glide effortlessly across top keys',
    criteria: { minWpm: 28, minAcc: 94, maxErrors: 3, minStreak: 25 },
    criteriaDesc: 'Min 28 WPM • 94% Acc • Max 3 Err'
  },

  // STAGE 3: Bottom Row Integration (Levels 11-15)
  {
    id: 11,
    stage: 3,
    stageName: 'Bottom Row Integration',
    title: 'Bottom Index Reach',
    subtitle: 'Keys: v, n, b, m',
    focusKeys: ['v', 'n', 'b', 'm', 'f', 'j'],
    text: 'fvf jnj fbf jmj van man ban never vibrant number moment',
    criteria: { minWpm: 24, minAcc: 91, maxErrors: null, minStreak: null },
    criteriaDesc: 'Min 24 WPM • 91% Accuracy'
  },
  {
    id: 12,
    stage: 3,
    stageName: 'Bottom Row Integration',
    title: 'Bottom Middle & Ring',
    subtitle: 'Keys: c, comma, x, period',
    focusKeys: ['c', ',', 'x', '.', 'd', 'k', 's', 'l'],
    text: 'dcd k,k sxs l.l six mix fix, next text, exact, clock, track.',
    criteria: { minWpm: 26, minAcc: 92, maxErrors: 5, minStreak: null },
    criteriaDesc: 'Min 26 WPM • 92% Acc • Max 5 Err'
  },
  {
    id: 13,
    stage: 3,
    stageName: 'Bottom Row Integration',
    title: 'Bottom Pinky & Full Alphabet',
    subtitle: 'Keys: z, slash, all 26 letters',
    focusKeys: ['z', '/', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
    text: 'aza ;/; zero zone/puzzle/dazzle/breeze/frozen/amaze/horizon.',
    criteria: { minWpm: 28, minAcc: 92, maxErrors: null, minStreak: 22 },
    criteriaDesc: 'Min 28 WPM • 92% Acc • 22 Streak'
  },
  {
    id: 14,
    stage: 3,
    stageName: 'Bottom Row Integration',
    title: 'Pangram Flow',
    subtitle: 'Every Letter of the Alphabet',
    focusKeys: ['t', 'h', 'e', 'q', 'u', 'i', 'c', 'k', 'b', 'r', 'o', 'w', 'n', 'f', 'x', 'j', 'm', 'p', 's', 'v', 'l', 'a', 'z', 'y', 'd', 'g'],
    text: 'the quick brown fox jumps over the lazy dog. pack my box with five dozen jugs.',
    criteria: { minWpm: 32, minAcc: 94, maxErrors: 4, minStreak: null },
    criteriaDesc: 'Min 32 WPM • 94% Acc • Max 4 Err'
  },
  {
    id: 15,
    stage: 3,
    stageName: 'Bottom Row Integration',
    title: 'Full Alphabet Boss Challenge',
    subtitle: 'Sustained Rhythm & Flow',
    focusKeys: ['a', 'e', 'i', 'o', 'u', 'r', 's', 't', 'l', 'n'],
    text: 'mastering all twenty six letters unlocks complete freedom and smooth velocity.',
    criteria: { minWpm: 35, minAcc: 95, maxErrors: 3, minStreak: 25 },
    criteriaDesc: 'Min 35 WPM • 95% Acc • 25 Streak'
  },

  // STAGE 4: Capitalization, Numbers & Punctuation (Levels 16-20)
  {
    id: 16,
    stage: 4,
    stageName: 'Capitals, Numbers & Punctuation',
    title: 'Shift Key & Capital Letters',
    subtitle: 'Opposite-Hand Shift Coordination',
    focusKeys: ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'T', 'N'],
    text: 'Alice Bob Charlie David Elena Frank Grace Henry Isabel Jack Karen Liam',
    criteria: { minWpm: 30, minAcc: 93, maxErrors: null, minStreak: 20 },
    criteriaDesc: 'Min 30 WPM • 93% Acc • 20 Streak'
  },
  {
    id: 17,
    stage: 4,
    stageName: 'Capitals, Numbers & Punctuation',
    title: 'Sentence Punctuation',
    subtitle: 'Keys: . , ! ? \' " -',
    focusKeys: ['.', ',', '!', '?', "'", '"', '-'],
    text: 'Wait! Is that true? "Yes, it is," she replied; step-by-step practice works!',
    criteria: { minWpm: 33, minAcc: 94, maxErrors: 4, minStreak: null },
    criteriaDesc: 'Min 33 WPM • 94% Acc • Max 4 Err'
  },
  {
    id: 18,
    stage: 4,
    stageName: 'Capitals, Numbers & Punctuation',
    title: 'Top Number Row',
    subtitle: 'Keys: 1 2 3 4 5 6 7 8 9 0',
    focusKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    text: '11 22 33 44 55 66 77 88 99 00 1928 3746 5012 8490 2026 365 247',
    criteria: { minWpm: 28, minAcc: 92, maxErrors: 4, minStreak: null },
    criteriaDesc: 'Min 28 WPM • 92% Acc • Max 4 Err'
  },
  {
    id: 19,
    stage: 4,
    stageName: 'Capitals, Numbers & Punctuation',
    title: 'Alphanumeric Data Entry',
    subtitle: 'Mixed Numbers, Caps & Words',
    focusKeys: ['2', '0', '5', '9', 'A', 'B', 'F', 'G'],
    text: 'Order 4829 shipped on May 15 at 09:30 AM. Tracking ID: ZX-9042-B7.',
    criteria: { minWpm: 35, minAcc: 95, maxErrors: 3, minStreak: 25 },
    criteriaDesc: 'Min 35 WPM • 95% Acc • 25 Streak'
  },
  {
    id: 20,
    stage: 4,
    stageName: 'Capitals, Numbers & Punctuation',
    title: 'Stage 4 Precision Trial',
    subtitle: 'Strict Accuracy Benchmark',
    focusKeys: ['1', '9', '8', '4', '!', '?', '.', ','],
    text: 'Precision beats raw haste: 99% focus yields 100% mastery in 25 stages!',
    criteria: { minWpm: 40, minAcc: 96, maxErrors: 2, minStreak: 30 },
    criteriaDesc: 'Min 40 WPM • 96% Acc • Max 2 Err'
  },

  // STAGE 5: Advanced Speed, Code & Mastery (Levels 21-25)
  {
    id: 21,
    stage: 5,
    stageName: 'Advanced Speed, Code & Mastery',
    title: 'Developer Brackets & Symbols',
    subtitle: 'Keys: ( ) { } [ ] < > = + ;',
    focusKeys: ['(', ')', '{', '}', '[', ']', '=', '+', ';'],
    text: 'fn(x) { return [x + 1, x * 2]; } if (a >= b) { list[0] = (a + b); }',
    criteria: { minWpm: 34, minAcc: 94, maxErrors: 4, minStreak: null },
    criteriaDesc: 'Min 34 WPM • 94% Acc • Max 4 Err'
  },
  {
    id: 22,
    stage: 5,
    stageName: 'Advanced Speed, Code & Mastery',
    title: 'JavaScript & CSS Syntax',
    subtitle: 'Real-World Code Patterns',
    focusKeys: ['c', 'o', 'n', 's', 't', '=', '>', '{', '}', ';'],
    text: 'const sum = (a, b) => a + b; export default App; .box { display: flex; }',
    criteria: { minWpm: 38, minAcc: 95, maxErrors: 3, minStreak: 25 },
    criteriaDesc: 'Min 38 WPM • 95% Acc • Max 3 Err'
  },
  {
    id: 23,
    stage: 5,
    stageName: 'Advanced Speed, Code & Mastery',
    title: 'High-Velocity Prose Marathon',
    subtitle: 'Continuous Rhythm Endurance',
    focusKeys: ['t', 'h', 'e', 'a', 'n', 'd', 'i', 'n', 'g'],
    text: 'True rhythm on the keyboard feels like playing a grand piano; every finger knows its exact lane without hesitation.',
    criteria: { minWpm: 45, minAcc: 96, maxErrors: 3, minStreak: 35 },
    criteriaDesc: 'Min 45 WPM • 96% Acc • 35 Streak'
  },
  {
    id: 24,
    stage: 5,
    stageName: 'Advanced Speed, Code & Mastery',
    title: 'Zero-Margin Precision Gauntlet',
    subtitle: 'Maximum 1 Error Allowed',
    focusKeys: ['q', 'z', 'x', 'j', 'k', 'v', 'b', 'p'],
    text: 'Quick reflexes, zero hesitation, and razor-sharp focus separate the adept typist from the grandmaster.',
    criteria: { minWpm: 50, minAcc: 98, maxErrors: 1, minStreak: 40 },
    criteriaDesc: 'Min 50 WPM • 98% Acc • Max 1 Err'
  },
  {
    id: 25,
    stage: 5,
    stageName: 'Advanced Speed, Code & Mastery',
    title: 'Grandmaster Final Exam',
    subtitle: 'Ultimate Speed & Accuracy Synthesis',
    focusKeys: ['A', 'Z', '0', '9', ';', '.', '!', ' '],
    text: 'Level 25 Final Trial: Achieve 55+ WPM with 98% accuracy! Your 10 fingers now move in effortless, synchronized harmony.',
    criteria: { minWpm: 55, minAcc: 98, maxErrors: 2, minStreak: 50 },
    criteriaDesc: 'Min 55 WPM • 98% Acc • 50 Streak'
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
