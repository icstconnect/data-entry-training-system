import { SourceRecord } from '../types';

// Deterministic pseudo-random number generator using seed (Murmur-like simple hash)
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function createRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function next() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const FIRST_NAMES_MALE = [
  'Sourav', 'Debabrata', 'Subhajit', 'Aniket', 'Arijit', 'Rohan', 'Pranab', 'Bikash',
  'Sayantan', 'Indranil', 'Tanmay', 'Arpan', 'Dipankar', 'Suman', 'Avik', 'Abhishek',
  'Subham', 'Pritam', 'Siddhartha', 'Sandip', 'Debashis', 'Nilanjan', 'Kaushik', 'Somenath'
];

export const FIRST_NAMES_FEMALE = [
  'Poulomi', 'Ananya', 'Sneha', 'Mousumi', 'Debolina', 'Riya', 'Shreya', 'Tanusree',
  'Payel', 'Rumpa', 'Sarmistha', 'Madhurima', 'Priyanka', 'Soma', 'Barnali', 'Koyel',
  'Debasmita', 'Sangita', 'Rituparna', 'Moumita', 'Swagata', 'Archana', 'Monali', 'Shampa'
];

export const LAST_NAMES = [
  'Ghosh', 'Biswas', 'Roy', 'Mukherjee', 'Banerjee', 'Chakraborty', 'Mondal', 'Dutta',
  'Saha', 'Bhowmick', 'Majumdar', 'Paul', 'Kundu', 'Chatterjee', 'Das', 'Sen',
  'Adhikari', 'Karmakar', 'Sarkar', 'Bhattacharya', 'Baidya', 'Halder', 'Samanta', 'Pramanik'
];

export const GUARDIAN_PREFIXES = ['Shri', 'Late', 'Dr.', 'Mr.', 'Prof.'];

export const LOCALITIES_NADIA = [
  { premise: 'Vill & PO - Chowberia', street: 'Station Road', district: 'Nadia', state: 'West Bengal', pin: '741221' },
  { premise: 'Subhash Pally', street: 'College Road, Ranaghat', district: 'Nadia', state: 'West Bengal', pin: '741201' },
  { premise: 'Rabindra Sarani', street: 'Chakdaha Main Road', district: 'Nadia', state: 'West Bengal', pin: '741222' },
  { premise: 'Ward No 4', street: 'Krishnanagar Station Road', district: 'Nadia', state: 'West Bengal', pin: '741101' },
  { premise: 'Dakshinpara', street: 'Kalyani Ghoshpara Road', district: 'Nadia', state: 'West Bengal', pin: '741235' },
  { premise: 'Shantipur High School Lane', street: 'Post Office More', district: 'Nadia', state: 'West Bengal', pin: '741404' },
  { premise: 'Budge Budge Trunk Road', street: 'Diamond Harbour', district: 'South 24 Parganas', state: 'West Bengal', pin: '700137' },
  { premise: 'Netaji Subhas Road', street: 'Barasat Sadar', district: 'North 24 Parganas', state: 'West Bengal', pin: '700124' },
  { premise: 'Taherpur Notun Pally', street: 'Netaji Road', district: 'Nadia', state: 'West Bengal', pin: '741159' },
  { premise: 'Karimpur Hospital More', street: 'Shikarpur Road', district: 'Nadia', state: 'West Bengal', pin: '741152' },
  { premise: 'Bagula Rail Gate', street: 'Hanskhali Road', district: 'Nadia', state: 'West Bengal', pin: '741502' },
  { premise: 'Birnagar Municipality Ward 2', street: 'Ula Main Road', district: 'Nadia', state: 'West Bengal', pin: '741127' }
];

export const SCHOOLS = [
  { name: 'Chowberia High School (H.S.)', code: 'SCH-CHW-104', board: 'WBBSE', medium: 'Bengali' },
  { name: 'Ranaghat Bharati High School', code: 'SCH-RNG-208', board: 'WBBSE', medium: 'Bengali' },
  { name: 'Chakdaha Ramlal Academy', code: 'SCH-CKD-315', board: 'WBCHSE', medium: 'Bengali' },
  { name: 'Krishnanagar Collegiate School', code: 'SCH-KRN-402', board: 'WBBSE', medium: 'Bengali' },
  { name: 'Kalyani Public School', code: 'SCH-KLY-501', board: 'CBSE', medium: 'English' },
  { name: 'Bongaon High School', code: 'SCH-BNG-612', board: 'WBCHSE', medium: 'Bengali' },
  { name: 'Nadia Model Academy', code: 'SCH-NMA-709', board: 'CBSE', medium: 'English' },
  { name: 'Shantipur Oriental Academy', code: 'SCH-STP-118', board: 'WBBSE', medium: 'Bengali' },
  { name: 'Taherpur Netaji Vidyapith', code: 'SCH-THP-224', board: 'WBCHSE', medium: 'Bengali' },
  { name: 'Karimpur Pannadevi High School', code: 'SCH-KMP-331', board: 'WBBSE', medium: 'Bengali' },
  { name: 'Habibpur High School', code: 'SCH-HBP-447', board: 'WBBSE', medium: 'Bengali' },
  { name: 'Bagula High School', code: 'SCH-BGL-552', board: 'WBCHSE', medium: 'Bengali' },
  { name: 'Birnagar High School', code: 'SCH-BNR-663', board: 'WBBSE', medium: 'Bengali' },
  { name: 'Bethuadahari J.C.M. High School', code: 'SCH-BTH-774', board: 'WBBSE', medium: 'Bengali' },
  { name: 'Plassey High School', code: 'SCH-PLS-885', board: 'WBCHSE', medium: 'Bengali' },
  { name: 'Santipur Municipal High School', code: 'SCH-SMH-992', board: 'WBBSE', medium: 'Bengali' },
  { name: 'Nabadwip Bakultala High School', code: 'SCH-NBD-109', board: 'WBBSE', medium: 'Bengali' },
  { name: 'Majhdia Rail Bazar High School', code: 'SCH-MJD-216', board: 'WBCHSE', medium: 'Bengali' },
  { name: 'Ranaghat Brojobala Girls\' High School', code: 'SCH-RBG-328', board: 'WBBSE', medium: 'Bengali' },
  { name: 'Krishnanagar Lady Carmichael Girls\' High School', code: 'SCH-KLC-439', board: 'WBCHSE', medium: 'Bengali' },
  { name: 'Kalyani Central Model School', code: 'SCH-KCM-550', board: 'CBSE', medium: 'English' },
  { name: 'Bongaon Kavi Keshablal Vidyapith', code: 'SCH-BKK-661', board: 'WBBSE', medium: 'Bengali' }
];

export const CATEGORIES = ['General', 'OBC-A', 'OBC-B', 'SC', 'ST', 'EWS'];
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const ACTIVITIES = [
  'NSS (National Service Scheme)',
  'NCC Cadet (Army Wing)',
  'Annual Athletics & Sports',
  'Quiz & Debate Club',
  'Computer & Coding Club',
  'Science Exhibition & Models',
  'Cultural Drama & Theatre',
  'Art & Craft Exhibition',
  'Scouts & Guides Troop',
  'Red Cross Youth Society',
  'Music, Choir & Vocal',
  'Yoga & Physical Wellness',
  'Environmental & Eco Club',
  'Football First XI',
  'Cricket First XI',
  'Badminton Championship',
  'Table Tennis Squad',
  'Volleyball Club',
  'Chess & Mind Strategy',
  'Photography & Media Club',
  'Creative Writing & Magazine',
  'Martial Arts & Self Defense',
  'First Aid & Emergency Response',
  'Community Social Service',
  'Gardening & Green Campus',
  'Folk Dance & Rabindra Sangeet',
  'Recitation & Elocution',
  'School Marching Band',
  'Robotics & STEM Workshop',
  'Disaster Management Volunteer'
];

export const TEACHER_REMARKS = [
  'Consistent & Diligent',
  'Good in Lab & Practical',
  'Excellent Performance',
  'Satisfactory Progress',
  'Active Participant in Class',
  'Well Behaved and Punctual',
  'Hardworking and Sincere',
  'Commendable Grasp of Concepts',
  'Good Analytical Ability',
  'Shows Steady Improvement',
  'Capable of Higher Marks',
  'Outstanding Work Ethic',
  'Needs More Practice in Numericals',
  'Regular & Attentive Trainee'
];

/**
 * Generates a consistent, realistic synthetic record based deterministically on UID string.
 */
export function generateSyntheticRecord(uid: string): SourceRecord {
  const seed = hashString(uid);
  const rng = createRng(seed);

  const isFemale = rng() > 0.5;
  const firstName = isFemale 
    ? FIRST_NAMES_FEMALE[Math.floor(rng() * FIRST_NAMES_FEMALE.length)]
    : FIRST_NAMES_MALE[Math.floor(rng() * FIRST_NAMES_MALE.length)];
  const lastName = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
  const studentName = `${firstName} ${lastName}`;

  const guardianFirst = FIRST_NAMES_MALE[Math.floor(rng() * FIRST_NAMES_MALE.length)];
  const guardianPrefix = GUARDIAN_PREFIXES[Math.floor(rng() * GUARDIAN_PREFIXES.length)];
  const guardianName = `${guardianPrefix} ${guardianFirst} ${lastName}`;

  // Date of birth: between 2004 and 2008
  const birthYear = 2004 + Math.floor(rng() * 5);
  const birthMonth = String(1 + Math.floor(rng() * 12)).padStart(2, '0');
  const birthDay = String(1 + Math.floor(rng() * 28)).padStart(2, '0');
  const dob = `${birthYear}-${birthMonth}-${birthDay}`;

  const gender = isFemale ? 'Female' : 'Male';
  const category = CATEGORIES[Math.floor(rng() * CATEGORIES.length)];
  const bloodGroup = BLOOD_GROUPS[Math.floor(rng() * BLOOD_GROUPS.length)];

  // Dummy test mobile number (Non-routable Indian fictitious sequence starting with 98000)
  const phonePrefix = '98000';
  const phoneSuffix = String(Math.floor(10000 + rng() * 90000));
  const phone = `${phonePrefix}${phoneSuffix}`;

  const emailUser = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(rng() * 90 + 10)}`;
  const email = `${emailUser}@gmail.com`;

  // Aadhaar format: 12 digits (synthetic dummy block)
  const a1 = String(Math.floor(2000 + rng() * 7000));
  const a2 = String(Math.floor(1000 + rng() * 9000));
  const a3 = String(Math.floor(1000 + rng() * 9000));
  const aadhaarNumber = `${a1} ${a2} ${a3}`;

  const loc = LOCALITIES_NADIA[Math.floor(rng() * LOCALITIES_NADIA.length)];
  const school = SCHOOLS[Math.floor(rng() * SCHOOLS.length)];

  // Admission info
  const admYear = birthYear + 14;
  const admNumber = `ADM/${admYear}/${Math.floor(1000 + rng() * 9000)}`;
  const admDate = `${admYear}-04-${String(1 + Math.floor(rng() * 20)).padStart(2, '0')}`;

  // Academic registration
  const regNumber = `${String(Math.floor(100000 + rng() * 900000))}-WB/${admYear}`;
  const rollNumber = `${school.code.substring(4, 7)}-${String(Math.floor(100 + rng() * 899))}`;
  const examCenterCode = `CEN-${school.code.substring(4, 7)}`;
  const previousPct = Number((62 + rng() * 32).toFixed(1));

  // Activities (1-3 items)
  const actCount = 1 + Math.floor(rng() * 3);
  const shuffledActs = [...ACTIVITIES].sort(() => rng() - 0.5);
  const selectedActivities = shuffledActs.slice(0, actCount);

  // Teacher overall remark
  const teacherRemark = TEACHER_REMARKS[Math.floor(rng() * TEACHER_REMARKS.length)];

  // Generate Table rows (for multi-row stages)
  const tableRows = [
    {
      id: 'row-1',
      term: 'Term 1 Internal',
      subject: 'Mathematics',
      maxMarks: 50,
      marksObtained: Math.floor(35 + rng() * 15),
      grade: 'A',
      remarks: TEACHER_REMARKS[0] // 'Consistent & Diligent'
    },
    {
      id: 'row-2',
      term: 'Term 1 Internal',
      subject: 'Physical Science',
      maxMarks: 50,
      marksObtained: Math.floor(32 + rng() * 16),
      grade: 'A',
      remarks: TEACHER_REMARKS[1] // 'Good in Lab & Practical'
    },
    {
      id: 'row-3',
      term: 'Term 1 Internal',
      subject: 'Life Science',
      maxMarks: 50,
      marksObtained: Math.floor(36 + rng() * 14),
      grade: 'A+',
      remarks: TEACHER_REMARKS[2] // 'Excellent Performance'
    },
    {
      id: 'row-4',
      term: 'Term 1 Internal',
      subject: 'English',
      maxMarks: 50,
      marksObtained: Math.floor(30 + rng() * 18),
      grade: 'B+',
      remarks: TEACHER_REMARKS[3] // 'Satisfactory Progress'
    }
  ];

  // Marksheet generation (WBBSE/General)
  const subjectsData = [
    { code: 'BNGA', name: 'First Language (Bengali)', theory: Math.floor(65 + rng() * 25), oral: Math.floor(8 + rng() * 3), maxTotal: 100 },
    { code: 'ENGB', name: 'Second Language (English)', theory: Math.floor(60 + rng() * 28), oral: Math.floor(7 + rng() * 4), maxTotal: 100 },
    { code: 'MATH', name: 'Mathematics', theory: Math.floor(58 + rng() * 38), oral: Math.floor(8 + rng() * 3), maxTotal: 100 },
    { code: 'PSCI', name: 'Physical Science', theory: Math.floor(62 + rng() * 30), oral: Math.floor(7 + rng() * 4), maxTotal: 100 },
    { code: 'LSCI', name: 'Life Science', theory: Math.floor(68 + rng() * 26), oral: Math.floor(8 + rng() * 3), maxTotal: 100 },
    { code: 'HIST', name: 'History', theory: Math.floor(55 + rng() * 35), oral: Math.floor(8 + rng() * 3), maxTotal: 100 },
    { code: 'GEOG', name: 'Geography', theory: Math.floor(64 + rng() * 30), oral: Math.floor(8 + rng() * 3), maxTotal: 100 }
  ].map(s => {
    const total = (s.theory || 0) + (s.oral || 0);
    let grade = 'B';
    if (total >= 90) grade = 'AA';
    else if (total >= 80) grade = 'A+';
    else if (total >= 70) grade = 'A';
    else if (total >= 60) grade = 'B+';
    else if (total >= 45) grade = 'B';
    else if (total >= 34) grade = 'C';
    else grade = 'D';

    return {
      code: s.code,
      name: s.name,
      theory: s.theory,
      oral: s.oral,
      total,
      grade
    };
  });

  const grandTotal = subjectsData.reduce((acc, curr) => acc + curr.total, 0);
  const avg = grandTotal / subjectsData.length;
  let division = 'Second Division';
  let overallGrade = 'B+';
  if (avg >= 75) {
    division = 'First Division with Star';
    overallGrade = 'A+';
  } else if (avg >= 60) {
    division = 'First Division';
    overallGrade = 'A';
  }

  return {
    uid,
    studentName,
    guardianPrefix,
    guardianName,
    dob,
    gender,
    category,
    phone,
    email,
    bloodGroup,
    nationality: 'Indian',
    motherTongue: 'Bengali',
    aadhaarNumber,
    address: {
      premise: loc.premise,
      street: loc.street,
      district: loc.district,
      state: loc.state,
      pinCode: loc.pin
    },
    schoolInfo: {
      schoolName: school.name,
      schoolCode: school.code,
      board: school.board,
      medium: school.medium,
      admissionNumber: admNumber,
      admissionDate: admDate,
      stream: 'Science'
    },
    academic: {
      registrationNumber: regNumber,
      rollNumber,
      examCenterCode,
      examYear: '2026',
      previousPercentage: previousPct,
      conduct: 'Good',
      teacherRemarks: teacherRemark,
      selectedSubjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
      activities: selectedActivities
    },
    tableRows,
    marksheet: {
      subjects: subjectsData,
      grandTotal,
      overallGrade,
      division,
      resultStatus: 'PASS'
    }
  };
}

/**
 * Pre-seeded sample UIDs (minimum 25 trainees) for instant access across all levels.
 */
export const SAMPLE_UIDS = [
  'ICST-2026-001001',
  'ICST-2026-001002',
  'ICST-2026-001003',
  'ICST-2026-001004',
  'ICST-2026-001005',
  'ICST-2026-001006',
  'ICST-2026-001007',
  'ICST-2026-001008',
  'ICST-2026-001009',
  'ICST-2026-001010',
  'ICST-2026-001011',
  'ICST-2026-001012',
  'ICST-2026-001013',
  'ICST-2026-001014',
  'ICST-2026-001015',
  'ICST-2026-001016',
  'ICST-2026-001017',
  'ICST-2026-001018',
  'ICST-2026-001019',
  'ICST-2026-001020',
  'ICST-2026-001021',
  'ICST-2026-001022',
  'ICST-2026-001023',
  'ICST-2026-001024',
  'ICST-2026-001025'
];

export interface PreloadedDummyPerson {
  uid: string;
  studentName: string;
  schoolName: string;
  category: string;
  phone: string;
  gender: string;
}

/**
 * Returns a list of minimum 25 preloaded realistic dummy persons with details.
 */
export function getPreloadedDummyPersons(): PreloadedDummyPerson[] {
  return SAMPLE_UIDS.map(uid => {
    const rec = generateSyntheticRecord(uid);
    return {
      uid: rec.uid,
      studentName: rec.studentName,
      schoolName: rec.schoolInfo.schoolName,
      category: rec.category,
      phone: rec.phone,
      gender: rec.gender
    };
  });
}

/**
 * Generate a random valid UID from the sample roster or fresh sequence
 */
export function generateRandomUid(): string {
  // 60% chance to pick from preloaded roster, 40% fresh sequence
  if (Math.random() < 0.6) {
    const randomIdx = Math.floor(Math.random() * SAMPLE_UIDS.length);
    return SAMPLE_UIDS[randomIdx];
  }
  const num = Math.floor(1000 + Math.random() * 9000);
  return `ICST-2026-00${num}`;
}
