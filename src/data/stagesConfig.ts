import { StageConfig, LevelInfo, BatchTitle } from '../types';

export const GUARDIAN_PREFIX_OPTIONS = [
  { label: 'Prefix', value: '' },
  { label: 'Shri', value: 'Shri' },
  { label: 'Late', value: 'Late' },
  { label: 'Dr.', value: 'Dr.' },
  { label: 'Mr.', value: 'Mr.' },
  { label: 'Mrs.', value: 'Mrs.' },
  { label: 'Md.', value: 'Md.' },
  { label: 'Prof.', value: 'Prof.' }
];

export const LEVELS_INFO: LevelInfo[] = [
  {
    levelNumber: 1,
    title: 'Foundation',
    badgeTitle: 'Data Entry Starter',
    requiredAccuracy: 80,
    stageCount: 2,
    description: 'Master foundational single-record inputs: names, dates, phone numbers, genders, and structured addresses.',
    color: '#0284c7' // sky-600
  },
  {
    levelNumber: 2,
    title: 'Basic Professional',
    badgeTitle: 'Data Entry Associate',
    requiredAccuracy: 85,
    stageCount: 3,
    description: 'Multi-control forms with searchable dropdowns, smart chips, identification formats, and mini data tables.',
    color: '#2563eb' // blue-600
  },
  {
    levelNumber: 3,
    title: 'Advanced Data Entry',
    badgeTitle: 'Data Entry Specialist',
    requiredAccuracy: 90,
    stageCount: 3,
    description: 'Long multi-section academic records, cascading dropdown dependencies, and multi-row data tables.',
    color: '#4f46e5' // indigo-600
  },
  {
    levelNumber: 4,
    title: 'Professional Data Operator',
    badgeTitle: 'Professional Data Operator',
    requiredAccuracy: 95,
    stageCount: 4,
    description: 'High-precision examination registration and state board marksheet data entry with strict verification.',
    color: '#7c3aed' // violet-600
  },
  {
    levelNumber: 5,
    title: 'Master Data Entry Operator',
    badgeTitle: 'Master Data Operator',
    requiredAccuracy: 100,
    stageCount: 6,
    description: 'Zero-tolerance 100% precision operational workflow across WBBSE, WBCHSE, and CBSE board examination marksheets.',
    color: '#0f766e' // teal-700
  }
];

export const BATCH_TITLES: BatchTitle[] = [
  { levelNumber: 1, title: 'Data Entry Starter', minAccuracy: 80, description: 'Demonstrated solid fundamentals in basic structured data entry.' },
  { levelNumber: 2, title: 'Data Entry Associate', minAccuracy: 85, description: 'Proficient in handling multi-field controls, IDs, and small tables.' },
  { levelNumber: 3, title: 'Data Entry Specialist', minAccuracy: 90, description: 'Excels at complex multi-section records and cascading validations.' },
  { levelNumber: 4, title: 'Professional Data Operator', minAccuracy: 95, description: 'High-speed professional operator capable of academic marksheet entry.' },
  { levelNumber: 5, title: 'Master Data Operator', minAccuracy: 100, description: 'Flawless 100% precision execution in high-volume enterprise marksheets.' }
];

export const STAGES: StageConfig[] = [
  // ==========================================
  // LEVEL 1: FOUNDATION (80% req, 2 stages)
  // ==========================================
  {
    levelNumber: 1,
    stageNumber: 1,
    title: 'Basic Student Registration',
    subtitle: 'Foundation Level • Single Record Entry',
    requiredAccuracy: 80,
    difficulty: 'Beginner',
    formType: 'simple-form',
    baseExp: 100,
    sampleUid: 'ICST-2026-001010',
    description: 'Practice entering foundational student identity fields: full name, guardian name, date of birth, gender, and contact phone number.',
    instructions: [
      'Enter the assigned UID in the reference lookup bar to load the source student file.',
      'Carefully transcribe student personal details into the matching fields.',
      'Ensure the date format is YYYY-MM-DD.',
      'Use the Review button to verify your entries before clicking Final Submit.'
    ],
    fields: [
      { id: 'studentName', label: 'Full Student Name', type: 'text', placeholder: 'e.g. Sourav Ghosh', required: true, weight: 1 },
      { 
        id: 'guardianPrefix', 
        label: 'Prefix', 
        type: 'select', 
        required: true, 
        weight: 0.5,
        options: GUARDIAN_PREFIX_OPTIONS 
      },
      { id: 'guardianName', label: 'Guardian / Father Name', type: 'text', placeholder: 'First & Last Name (e.g. Sayantan Biswas)', required: true, weight: 1 },
      { id: 'dob', label: 'Date of Birth (YYYY-MM-DD)', type: 'date', placeholder: 'YYYY-MM-DD', required: true, weight: 1 },
      { 
        id: 'gender', 
        label: 'Gender', 
        type: 'radio', 
        required: true, 
        weight: 1,
        options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }] 
      },
      { id: 'phone', label: 'Mobile Number', type: 'tel', placeholder: '10 digit mobile number', required: true, weight: 1 },
      {
        id: 'bloodGroup',
        label: 'Blood Group',
        type: 'select',
        required: false,
        weight: 1,
        options: [
          { label: 'Select Blood Group', value: '' },
          { label: 'A+', value: 'A+' },
          { label: 'A-', value: 'A-' },
          { label: 'B+', value: 'B+' },
          { label: 'B-', value: 'B-' },
          { label: 'O+', value: 'O+' },
          { label: 'O-', value: 'O-' },
          { label: 'AB+', value: 'AB+' },
          { label: 'AB-', value: 'AB-' }
        ]
      }
    ]
  },
  {
    levelNumber: 1,
    stageNumber: 2,
    title: 'Basic Contact & Address Entry',
    subtitle: 'Foundation Level • Address Hierarchy Entry',
    requiredAccuracy: 80,
    difficulty: 'Beginner',
    formType: 'simple-form',
    baseExp: 120,
    sampleUid: 'ICST-2026-001021',
    description: 'Accurately enter premise/holding, street, district, state, pin code, and email address.',
    instructions: [
      'Load the source record using the UID.',
      'Transcribe the complete address fields precisely as displayed in the source card.',
      'Ensure the 6-digit PIN code contains exact digits without spaces.',
      'Verify email spelling accurately.'
    ],
    fields: [
      { id: 'studentName', label: 'Student Name', type: 'text', required: true, weight: 1 },
      { id: 'email', label: 'Official Email Address', type: 'email', placeholder: 'name@domain.com', required: true, weight: 1 },
      { id: 'address.premise', label: 'Premise / House / Village', type: 'text', placeholder: 'Vill & PO - Chowberia', required: true, weight: 1 },
      { id: 'address.street', label: 'Street / Landmark', type: 'text', placeholder: 'Station Road', required: true, weight: 1 },
      { id: 'address.district', label: 'District', type: 'text', placeholder: 'Nadia', required: true, weight: 1 },
      { id: 'address.state', label: 'State', type: 'text', placeholder: 'West Bengal', required: true, weight: 1 },
      { id: 'address.pinCode', label: 'Postal PIN Code', type: 'text', placeholder: '6 digits', required: true, weight: 1 }
    ]
  },

  // ==========================================
  // LEVEL 2: BASIC PROFESSIONAL (85% req, 3 stages)
  // ==========================================
  {
    levelNumber: 2,
    stageNumber: 1,
    title: 'Personal Information & Identification',
    subtitle: 'Level 2 • Structured ID & Social Category',
    requiredAccuracy: 85,
    difficulty: 'Beginner-Intermediate',
    formType: 'multi-section',
    baseExp: 150,
    sampleUid: 'ICST-2026-001035',
    description: 'Enter structured identification data (Aadhaar number format), social category, nationality, and mother tongue.',
    instructions: [
      'Input the UID to fetch student identity credentials.',
      'Aadhaar number: enter 12 digits (spaces are optional).',
      'Select matching Category from the dropdown options.',
      'Check nationality and mother tongue against the source record.'
    ],
    fields: [
      { id: 'studentName', label: 'Candidate Full Name', type: 'text', required: true, weight: 1 },
      { id: 'dob', label: 'Date of Birth (YYYY-MM-DD)', type: 'date', placeholder: 'YYYY-MM-DD', required: true, weight: 1 },
      { 
        id: 'gender', 
        label: 'Gender', 
        type: 'radio', 
        required: true, 
        weight: 1,
        options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }] 
      },
      { 
        id: 'category', 
        label: 'Social Category', 
        type: 'select', 
        required: true, 
        weight: 1,
        options: [
          { label: 'Select Category', value: '' },
          { label: 'General', value: 'General' },
          { label: 'OBC-A', value: 'OBC-A' },
          { label: 'OBC-B', value: 'OBC-B' },
          { label: 'SC', value: 'SC' },
          { label: 'ST', value: 'ST' },
          { label: 'EWS', value: 'EWS' }
        ]
      },
      { id: 'aadhaarNumber', label: 'Aadhaar Identification Number', type: 'text', placeholder: '12-digit number (e.g. 766255747683)', required: true, weight: 2 },
      { id: 'nationality', label: 'Nationality', type: 'text', defaultValue: 'Indian', required: true, weight: 1 },
      { id: 'motherTongue', label: 'Mother Tongue', type: 'text', defaultValue: 'Bengali', required: true, weight: 1 }
    ]
  },
  {
    levelNumber: 2,
    stageNumber: 2,
    title: 'School Information & Enrollment',
    subtitle: 'Level 2 • Institutional Record Entry',
    requiredAccuracy: 85,
    difficulty: 'Beginner-Intermediate',
    formType: 'simple-form',
    baseExp: 160,
    sampleUid: 'ICST-2026-001048',
    description: 'Transcribe school details, institutional codes, affiliation board, medium of instruction, and admission reference numbers.',
    instructions: [
      'Load the institutional file via UID.',
      'Select the exact School Name using the searchable select component.',
      'Enter the official Admission Number and Admission Date accurately.'
    ],
    fields: [
      { id: 'studentName', label: 'Student Name', type: 'text', required: true, weight: 1 },
      { id: 'schoolInfo.schoolName', label: 'School Name', type: 'searchable-select', required: true, weight: 1.5,
        options: [
          { label: 'Chowberia High School (H.S.)', value: 'Chowberia High School (H.S.)' },
          { label: 'Ranaghat Bharati High School', value: 'Ranaghat Bharati High School' },
          { label: 'Chakdaha Ramlal Academy', value: 'Chakdaha Ramlal Academy' },
          { label: 'Krishnanagar Collegiate School', value: 'Krishnanagar Collegiate School' },
          { label: 'Kalyani Public School', value: 'Kalyani Public School' },
          { label: 'Bongaon High School', value: 'Bongaon High School' },
          { label: 'Nadia Model Academy', value: 'Nadia Model Academy' }
        ]
      },
      { id: 'schoolInfo.schoolCode', label: 'School Index / Center Code', type: 'text', required: true, weight: 1 },
      { 
        id: 'schoolInfo.board', 
        label: 'Affiliation Board', 
        type: 'select', 
        required: true, 
        weight: 1,
        options: [
          { label: 'Select Board', value: '' },
          { label: 'WBBSE', value: 'WBBSE' },
          { label: 'WBCHSE', value: 'WBCHSE' },
          { label: 'CBSE', value: 'CBSE' }
        ]
      },
      { 
        id: 'schoolInfo.medium', 
        label: 'Medium of Instruction', 
        type: 'radio', 
        required: true, 
        weight: 1,
        options: [{ label: 'Bengali', value: 'Bengali' }, { label: 'English', value: 'English' }]
      },
      { id: 'schoolInfo.admissionNumber', label: 'Admission Number', type: 'text', required: true, weight: 1 },
      { id: 'schoolInfo.admissionDate', label: 'Admission Date (YYYY-MM-DD)', type: 'date', placeholder: 'YYYY-MM-DD', required: true, weight: 1 }
    ]
  },
  {
    levelNumber: 2,
    stageNumber: 3,
    title: 'Student Record with Small Activities Table',
    subtitle: 'Level 2 • Hybrid Form & Internal Term Table',
    requiredAccuracy: 85,
    difficulty: 'Beginner-Intermediate',
    formType: 'tabular-grid',
    baseExp: 180,
    sampleUid: 'ICST-2026-001062',
    description: 'Enter student core data alongside smart activity chips and a 4-row internal assessment table.',
    instructions: [
      'Load the source record using UID.',
      'Type or select the smart co-curricular activity chips as listed.',
      'Enter the 4 assessment rows in the table with exact marks obtained and grades.'
    ],
    fields: [
      { id: 'studentName', label: 'Student Name', type: 'text', required: true, weight: 1 },
      { id: 'phone', label: 'Phone Number', type: 'tel', required: true, weight: 1 },
      { id: 'academic.previousPercentage', label: 'Previous Qualifying %', type: 'decimal', placeholder: 'e.g. 78.5', required: true, weight: 1 },
      { id: 'academic.activities', label: 'Co-curricular Activities (Chips)', type: 'smart-chips', placeholder: 'Type activity and press Enter or select', required: true, weight: 1.5 }
    ],
    tableSchema: {
      tableName: 'Internal Term Assessment Records',
      defaultRowsCount: 4,
      columns: [
        { id: 'subject', label: 'Subject', type: 'text', width: '220px', required: true },
        { id: 'maxMarks', label: 'Max Marks', type: 'number', width: '100px', required: true },
        { id: 'marksObtained', label: 'Marks Obtained', type: 'number', width: '120px', required: true, min: 0, max: 50 },
        { id: 'grade', label: 'Grade', type: 'text', width: '90px', required: true }
      ]
    }
  },

  // ==========================================
  // LEVEL 3: ADVANCED DATA ENTRY (90% req, 3 stages)
  // ==========================================
  {
    levelNumber: 3,
    stageNumber: 1,
    title: 'Academic Details & Subject Combinations',
    subtitle: 'Level 3 • Stream Selection & Subject Electives',
    requiredAccuracy: 90,
    difficulty: 'Intermediate',
    formType: 'simple-form',
    baseExp: 200,
    sampleUid: 'ICST-2026-001077',
    description: 'Manage cascading stream selection, multi-select subject groups, past academic scores, and registration codes.',
    instructions: [
      'Load student file using UID.',
      'Select stream, then choose the designated elective subjects matching the source record.',
      'Enter qualifying percentages with precision up to one decimal place.'
    ],
    fields: [
      { id: 'studentName', label: 'Candidate Name', type: 'text', required: true, weight: 1 },
      { id: 'schoolInfo.stream', label: 'Higher Secondary Stream', type: 'select', required: true, weight: 1,
        options: [
          { label: 'Select Stream', value: '' },
          { label: 'Science', value: 'Science' },
          { label: 'Commerce', value: 'Commerce' },
          { label: 'Arts / Humanities', value: 'Arts / Humanities' }
        ]
      },
      { id: 'academic.registrationNumber', label: 'Board Registration Number', type: 'text', placeholder: 'XXXXXX-WB/YYYY', required: true, weight: 2 },
      { id: 'academic.rollNumber', label: 'Roll Number', type: 'text', placeholder: 'XXX-XXXX', required: true, weight: 1.5 },
      { id: 'academic.previousPercentage', label: 'Qualifying Examination %', type: 'decimal', required: true, weight: 1 },
      { id: 'academic.conduct', label: 'Conduct Assessment', type: 'select', required: true, weight: 1,
        options: [
          { label: 'Select Conduct', value: '' },
          { label: 'Excellent', value: 'Excellent' },
          { label: 'Good', value: 'Good' },
          { label: 'Satisfactory', value: 'Satisfactory' }
        ]
      }
    ]
  },
  {
    levelNumber: 3,
    stageNumber: 2,
    title: 'Complex Multi-Section Student Record',
    subtitle: 'Level 3 • 4-Section Comprehensive Record',
    requiredAccuracy: 90,
    difficulty: 'Intermediate',
    formType: 'multi-section',
    baseExp: 220,
    sampleUid: 'ICST-2026-001090',
    description: 'A comprehensive four-section record combining identity, domicile address, academic registration, and contact information.',
    instructions: [
      'Navigate through the multi-section form.',
      'Ensure cross-field consistency across personal, address, and academic sections.',
      'Inspect all sections thoroughly using the Review feature before final submit.'
    ],
    fields: [
      // Section 1: Identity
      { id: 'studentName', label: 'Full Legal Name', type: 'text', required: true, weight: 1, section: 'Identity Details' },
      { 
        id: 'guardianPrefix', 
        label: 'Prefix', 
        type: 'select', 
        required: true, 
        weight: 0.5,
        options: GUARDIAN_PREFIX_OPTIONS,
        section: 'Identity Details'
      },
      { id: 'guardianName', label: 'Father / Guardian Name', type: 'text', placeholder: 'First & Last Name', required: true, weight: 1, section: 'Identity Details' },
      { id: 'dob', label: 'Date of Birth (YYYY-MM-DD)', type: 'date', placeholder: 'YYYY-MM-DD', required: true, weight: 1, section: 'Identity Details' },
      { id: 'gender', label: 'Gender', type: 'radio', required: true, weight: 1, section: 'Identity Details',
        options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }]
      },
      { id: 'category', label: 'Social Category', type: 'select', required: true, weight: 1, section: 'Identity Details',
        options: [
          { label: 'General', value: 'General' },
          { label: 'OBC-A', value: 'OBC-A' },
          { label: 'OBC-B', value: 'OBC-B' },
          { label: 'SC', value: 'SC' },
          { label: 'ST', value: 'ST' }
        ]
      },
      // Section 2: Contact
      { id: 'phone', label: 'Mobile Number', type: 'tel', required: true, weight: 1, section: 'Contact & Domicile' },
      { id: 'email', label: 'Email ID', type: 'email', required: true, weight: 1, section: 'Contact & Domicile' },
      { id: 'address.district', label: 'District', type: 'text', required: true, weight: 1, section: 'Contact & Domicile' },
      { id: 'address.pinCode', label: 'PIN Code', type: 'text', required: true, weight: 1, section: 'Contact & Domicile' },
      // Section 3: School
      { id: 'schoolInfo.schoolName', label: 'Institution Name', type: 'searchable-select', required: true, weight: 1, section: 'Institution & Registration',
        options: [
          { label: 'Chowberia High School (H.S.)', value: 'Chowberia High School (H.S.)' },
          { label: 'Ranaghat Bharati High School', value: 'Ranaghat Bharati High School' },
          { label: 'Chakdaha Ramlal Academy', value: 'Chakdaha Ramlal Academy' },
          { label: 'Krishnanagar Collegiate School', value: 'Krishnanagar Collegiate School' }
        ]
      },
      { id: 'academic.registrationNumber', label: 'Registration Number', type: 'text', required: true, weight: 1.5, section: 'Institution & Registration' },
      { id: 'academic.rollNumber', label: 'Roll Number', type: 'text', required: true, weight: 1.5, section: 'Institution & Registration' }
    ]
  },
  {
    levelNumber: 3,
    stageNumber: 3,
    title: 'Multi-Row Academic Enrollment Table',
    subtitle: 'Level 3 • Tabular High-Volume Enrollment',
    requiredAccuracy: 90,
    difficulty: 'Intermediate',
    formType: 'tabular-grid',
    baseExp: 240,
    sampleUid: 'ICST-2026-001105',
    description: 'Spreadsheet-style multi-row entry for candidate term assessment results with rapid keyboard navigation.',
    instructions: [
      'Load UID to reveal the internal assessment sheet.',
      'Use Tab or Enter key to move swiftly across cells.',
      'Check row by row to maintain 90%+ cell-level accuracy.'
    ],
    fields: [
      { id: 'studentName', label: 'Candidate Name', type: 'text', required: true, weight: 1 },
      { id: 'academic.rollNumber', label: 'Roll No', type: 'text', required: true, weight: 1 }
    ],
    tableSchema: {
      tableName: 'Term 1 Subject Evaluation Grid',
      defaultRowsCount: 4,
      columns: [
        { id: 'subject', label: 'Subject Name', type: 'text', width: '240px', required: true },
        { id: 'maxMarks', label: 'Full Marks', type: 'number', width: '110px', required: true },
        { id: 'marksObtained', label: 'Marks Scored', type: 'number', width: '130px', required: true, min: 0, max: 50 },
        { id: 'grade', label: 'Letter Grade', type: 'text', width: '110px', required: true },
        { id: 'remarks', label: 'Teacher Remarks', type: 'text', width: '160px', required: true }
      ]
    }
  },

  // ==========================================
  // LEVEL 4: PROFESSIONAL DATA OPERATOR (95% req, 4 stages)
  // ==========================================
  {
    levelNumber: 4,
    stageNumber: 1,
    title: 'Examination Registration Verification',
    subtitle: 'Level 4 • Precision Exam Portal Entry',
    requiredAccuracy: 95,
    difficulty: 'Advanced',
    formType: 'academic-record',
    baseExp: 280,
    sampleUid: 'ICST-2026-001124',
    description: 'High-precision examination registration form featuring center codes, board registration, roll numbers, and personal info.',
    instructions: [
      'This simulation requires 95% accuracy for stage clearance.',
      'Format codes like registration number and center codes must strictly match.',
      'Inspect each field meticulously before final submit.'
    ],
    fields: [
      { id: 'academic.registrationNumber', label: 'State Board Registration No.', type: 'text', required: true, weight: 2 },
      { id: 'academic.rollNumber', label: 'Admit Card Roll Number', type: 'text', required: true, weight: 2 },
      { id: 'academic.examCenterCode', label: 'Allocated Examination Center Code', type: 'text', required: true, weight: 1.5 },
      { id: 'studentName', label: 'Student Legal Name', type: 'text', required: true, weight: 1 },
      { 
        id: 'guardianPrefix', 
        label: 'Prefix', 
        type: 'select', 
        required: true, 
        weight: 0.5,
        options: GUARDIAN_PREFIX_OPTIONS 
      },
      { id: 'guardianName', label: 'Father / Guardian Name', type: 'text', placeholder: 'First & Last Name', required: true, weight: 1 },
      { id: 'dob', label: 'Date of Birth (YYYY-MM-DD)', type: 'date', required: true, weight: 1 },
      { id: 'gender', label: 'Gender', type: 'radio', required: true, weight: 1,
        options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }]
      },
      { id: 'schoolInfo.schoolName', label: 'Institution Name', type: 'searchable-select', required: true, weight: 1.5,
        options: [
          { label: 'Chowberia High School (H.S.)', value: 'Chowberia High School (H.S.)' },
          { label: 'Ranaghat Bharati High School', value: 'Ranaghat Bharati High School' },
          { label: 'Chakdaha Ramlal Academy', value: 'Chakdaha Ramlal Academy' },
          { label: 'Krishnanagar Collegiate School', value: 'Krishnanagar Collegiate School' }
        ]
      }
    ]
  },
  {
    levelNumber: 4,
    stageNumber: 2,
    title: 'Academic Record with Transfer Credentials',
    subtitle: 'Level 4 • Transfer & Academic Credentials',
    requiredAccuracy: 95,
    difficulty: 'Advanced',
    formType: 'multi-section',
    baseExp: 300,
    sampleUid: 'ICST-2026-001149',
    description: 'Multi-field institutional transfer record: previous percentage, conduct assessment, affiliation board, and admission serials.',
    instructions: [
      'Verify student admission serial numbers against the source document.',
      'Ensure correct entry of decimal marks and conduct certifications.'
    ],
    fields: [
      { id: 'studentName', label: 'Candidate Name', type: 'text', required: true, weight: 1 },
      { id: 'schoolInfo.admissionNumber', label: 'Enrollment / Admission Serial', type: 'text', required: true, weight: 1.5 },
      { id: 'schoolInfo.admissionDate', label: 'Date of Admission (YYYY-MM-DD)', type: 'date', placeholder: 'YYYY-MM-DD', required: true, weight: 1 },
      { id: 'schoolInfo.board', label: 'Examination Board', type: 'select', required: true, weight: 1,
        options: [
          { label: 'WBBSE', value: 'WBBSE' },
          { label: 'WBCHSE', value: 'WBCHSE' },
          { label: 'CBSE', value: 'CBSE' }
        ]
      },
      { id: 'academic.previousPercentage', label: 'Past Qualifying Percentage (%)', type: 'decimal', required: true, weight: 1.5 },
      { id: 'academic.conduct', label: 'Conduct Assessment Record', type: 'select', required: true, weight: 1,
        options: [
          { label: 'Excellent', value: 'Excellent' },
          { label: 'Good', value: 'Good' },
          { label: 'Satisfactory', value: 'Satisfactory' }
        ]
      },
      { id: 'phone', label: 'Emergency Contact Phone', type: 'tel', required: true, weight: 1 }
    ]
  },
  {
    levelNumber: 4,
    stageNumber: 3,
    title: 'Marksheet Entry — WBBSE-Inspired',
    subtitle: 'Level 4 • Secondary Board 7-Subject Marksheet',
    requiredAccuracy: 95,
    difficulty: 'Advanced',
    formType: 'marksheet',
    baseExp: 340,
    sampleUid: 'ICST-2026-001180',
    description: 'Simulated 7-subject secondary marksheet (Bengali, English, Math, Physical Science, Life Science, History, Geography) with theory, oral, and total marks.',
    instructions: [
      'Fictional training simulation layout inspired by standard secondary academic marksheets.',
      'Enter theory marks and oral/project marks for all 7 compulsory subjects.',
      'Verify calculated totals and division before submitting.'
    ],
    fields: [
      { id: 'studentName', label: 'Student Name', type: 'text', required: true, weight: 1 },
      { id: 'academic.rollNumber', label: 'Roll & Number', type: 'text', required: true, weight: 1.5 },
      { id: 'academic.registrationNumber', label: 'Registration No', type: 'text', required: true, weight: 1.5 }
    ],
    marksheetSchema: {
      boardType: 'WBBSE',
      hasTheoryPractical: true,
      hasGrades: true,
      subjects: [
        { code: 'BNGA', name: 'First Language (Bengali)', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'ENGB', name: 'Second Language (English)', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'MATH', name: 'Mathematics', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'PSCI', name: 'Physical Science', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'LSCI', name: 'Life Science', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'HIST', name: 'History', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'GEOG', name: 'Geography', maxTheory: 90, maxOral: 10, maxTotal: 100 }
      ]
    }
  },
  {
    levelNumber: 4,
    stageNumber: 4,
    title: 'Marksheet Entry — Mixed Board Format',
    subtitle: 'Level 4 • Multi-Component Marksheet Simulation',
    requiredAccuracy: 95,
    difficulty: 'Advanced',
    formType: 'marksheet',
    baseExp: 360,
    sampleUid: 'ICST-2026-001215',
    description: 'Comprehensive marksheet entry including subject total computation, letter grades, grand total, and pass division.',
    instructions: [
      'Load UID to retrieve student subject scores.',
      'Accurately feed each individual subject mark and verify grand total.',
      'Zero errors in numeric values are crucial to meet the 95% threshold.'
    ],
    fields: [
      { id: 'studentName', label: 'Student Name', type: 'text', required: true, weight: 1 },
      { id: 'schoolInfo.schoolName', label: 'School Name', type: 'text', required: true, weight: 1 },
      { id: 'academic.rollNumber', label: 'Board Roll No', type: 'text', required: true, weight: 1.5 }
    ],
    marksheetSchema: {
      boardType: 'GENERAL',
      hasTheoryPractical: true,
      hasGrades: true,
      subjects: [
        { code: 'BNGA', name: 'Bengali A', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'ENGB', name: 'English B', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'MATH', name: 'Mathematics', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'PSCI', name: 'Physical Science', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'LSCI', name: 'Life Science', maxTheory: 90, maxOral: 10, maxTotal: 100 }
      ]
    }
  },

  // ==========================================
  // LEVEL 5: MASTER DATA ENTRY OPERATOR (100% req, 6 stages)
  // ==========================================
  {
    levelNumber: 5,
    stageNumber: 1,
    title: 'Master Challenge: High-Precision Student Dossier',
    subtitle: 'Level 5 • 100% Accuracy Zero-Tolerance Challenge',
    requiredAccuracy: 100,
    difficulty: 'Expert',
    formType: 'multi-section',
    baseExp: 400,
    sampleUid: 'ICST-2026-001250',
    description: 'Strict 100% precision operational test. Any single mismatch will fail the attempt. Full student dossier entry.',
    instructions: [
      'CRITICAL: Level 5 requires exactly 100% accuracy. Zero errors tolerated.',
      'Every character, digit, and selection will be strictly verified against the source record.',
      'Review every field three times before final submission.'
    ],
    fields: [
      { id: 'studentName', label: 'Student Full Name', type: 'text', required: true, weight: 2 },
      { 
        id: 'guardianPrefix', 
        label: 'Prefix', 
        type: 'select', 
        required: true, 
        weight: 0.5,
        options: GUARDIAN_PREFIX_OPTIONS 
      },
      { id: 'guardianName', label: 'Guardian Full Name', type: 'text', placeholder: 'First & Last Name', required: true, weight: 2 },
      { id: 'dob', label: 'Date of Birth (YYYY-MM-DD)', type: 'date', required: true, weight: 2 },
      { id: 'gender', label: 'Gender', type: 'radio', required: true, weight: 1,
        options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }]
      },
      { id: 'phone', label: '10-Digit Mobile', type: 'tel', required: true, weight: 2 },
      { id: 'email', label: 'Email ID', type: 'email', required: true, weight: 2 },
      { id: 'aadhaarNumber', label: 'Aadhaar Identification', type: 'text', placeholder: '12-digit number (spaces optional)', required: true, weight: 3 },
      { id: 'address.premise', label: 'Holding / Premise', type: 'text', required: true, weight: 2 },
      { id: 'address.district', label: 'District', type: 'text', required: true, weight: 2 },
      { id: 'address.pinCode', label: 'PIN Code', type: 'text', required: true, weight: 2 },
      { id: 'academic.registrationNumber', label: 'Registration Number', type: 'text', required: true, weight: 3 },
      { id: 'academic.rollNumber', label: 'Board Roll No', type: 'text', required: true, weight: 2 }
    ]
  },
  {
    levelNumber: 5,
    stageNumber: 2,
    title: 'Multi-Table Academic Assessment Master Grid',
    subtitle: 'Level 5 • 100% Accuracy Tabular Grid',
    requiredAccuracy: 100,
    difficulty: 'Expert',
    formType: 'tabular-grid',
    baseExp: 420,
    sampleUid: 'ICST-2026-001300',
    description: 'High-density multi-row term assessment grid requiring zero typographical errors across all columns.',
    instructions: [
      'Enter all rows with 100% exact numerical and text fidelity.',
      'Navigate using keyboard shortcuts: Tab, Shift+Tab, and Enter.',
      'A single wrong cell prevents stage clearance.'
    ],
    fields: [
      { id: 'studentName', label: 'Student Name', type: 'text', required: true, weight: 2 },
      { id: 'academic.registrationNumber', label: 'Registration Number', type: 'text', required: true, weight: 2 }
    ],
    tableSchema: {
      tableName: 'Master Term Performance Matrix',
      defaultRowsCount: 4,
      columns: [
        { id: 'subject', label: 'Subject Name', type: 'text', width: '220px', required: true },
        { id: 'maxMarks', label: 'Max Marks', type: 'number', width: '100px', required: true },
        { id: 'marksObtained', label: 'Marks Scored', type: 'number', width: '120px', required: true, min: 0, max: 50 },
        { id: 'grade', label: 'Grade', type: 'text', width: '100px', required: true },
        { id: 'remarks', label: 'Evaluation Remarks', type: 'text', width: '160px', required: true }
      ]
    }
  },
  {
    levelNumber: 5,
    stageNumber: 3,
    title: 'WBBSE-Inspired Full Marksheet Operations',
    subtitle: 'Level 5 • 7-Subject Full Marksheet Entry',
    requiredAccuracy: 100,
    difficulty: 'Expert',
    formType: 'marksheet',
    baseExp: 450,
    sampleUid: 'ICST-2026-001350',
    description: 'Full 7-subject secondary examination marksheet with theory, oral, subject totals, grand total, and division.',
    instructions: [
      'Simulate high-volume marksheet operations under strict 100% accuracy rule.',
      'Check theory and oral marks for each subject: First Lang, Second Lang, Math, Phys Sci, Life Sci, History, Geography.'
    ],
    fields: [
      { id: 'studentName', label: 'Candidate Name', type: 'text', required: true, weight: 2 },
      { id: 'academic.rollNumber', label: 'Admit Roll Number', type: 'text', required: true, weight: 2 },
      { id: 'academic.registrationNumber', label: 'Registration No', type: 'text', required: true, weight: 2 }
    ],
    marksheetSchema: {
      boardType: 'WBBSE',
      hasTheoryPractical: true,
      hasGrades: true,
      subjects: [
        { code: 'BNGA', name: 'First Language (Bengali)', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'ENGB', name: 'Second Language (English)', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'MATH', name: 'Mathematics', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'PSCI', name: 'Physical Science', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'LSCI', name: 'Life Science', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'HIST', name: 'History', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'GEOG', name: 'Geography', maxTheory: 90, maxOral: 10, maxTotal: 100 }
      ]
    }
  },
  {
    levelNumber: 5,
    stageNumber: 4,
    title: 'WBCHSE-Inspired Higher Secondary Marksheet',
    subtitle: 'Level 5 • Higher Secondary Theory + Practical',
    requiredAccuracy: 100,
    difficulty: 'Expert',
    formType: 'marksheet',
    baseExp: 480,
    sampleUid: 'ICST-2026-001400',
    description: 'Higher secondary marksheet layout featuring language groups and science/commerce lab practical splits.',
    instructions: [
      'Theory marks are out of 70/80 and Practical/Project marks are out of 30/20.',
      'Ensure total marks and grades are entered with 100% precision.'
    ],
    fields: [
      { id: 'studentName', label: 'Student Name', type: 'text', required: true, weight: 2 },
      { id: 'schoolInfo.stream', label: 'HS Stream', type: 'text', required: true, weight: 2 },
      { id: 'academic.rollNumber', label: 'HS Roll & No', type: 'text', required: true, weight: 2 }
    ],
    marksheetSchema: {
      boardType: 'WBCHSE',
      hasTheoryPractical: true,
      hasGrades: true,
      subjects: [
        { code: 'BNGA', name: 'Bengali (Lang I)', maxTheory: 80, maxOral: 20, maxTotal: 100 },
        { code: 'ENGB', name: 'English (Lang II)', maxTheory: 80, maxOral: 20, maxTotal: 100 },
        { code: 'PHYS', name: 'Physics / Accountancy', maxTheory: 70, maxOral: 30, maxTotal: 100 },
        { code: 'CHEM', name: 'Chemistry / Business Studies', maxTheory: 70, maxOral: 30, maxTotal: 100 },
        { code: 'MATH', name: 'Mathematics', maxTheory: 80, maxOral: 20, maxTotal: 100 },
        { code: 'BIOS', name: 'Biological Sciences / Comp Appl', maxTheory: 70, maxOral: 30, maxTotal: 100 }
      ]
    }
  },
  {
    levelNumber: 5,
    stageNumber: 5,
    title: 'CBSE-Inspired Academic Marksheet Operations',
    subtitle: 'Level 5 • Board Marks + Grade Points',
    requiredAccuracy: 100,
    difficulty: 'Expert',
    formType: 'marksheet',
    baseExp: 500,
    sampleUid: 'ICST-2026-001450',
    description: 'Standardized CBSE-inspired marksheet entry with theory, internal assessment, total marks, and positional letter grades (A1 to E).',
    instructions: [
      'Fictional training layout inspired by national board marksheets.',
      'Enter theory and internal assessment marks, plus precise letter grades.'
    ],
    fields: [
      { id: 'studentName', label: 'Student Name', type: 'text', required: true, weight: 2 },
      { id: 'academic.rollNumber', label: 'CBSE Roll Number', type: 'text', required: true, weight: 2 },
      { id: 'schoolInfo.schoolName', label: 'Affiliated School Name', type: 'text', required: true, weight: 1.5 }
    ],
    marksheetSchema: {
      boardType: 'CBSE',
      hasTheoryPractical: true,
      hasGrades: true,
      subjects: [
        { code: 'ENG', name: 'English Core (301)', maxTheory: 80, maxOral: 20, maxTotal: 100 },
        { code: 'MTH', name: 'Mathematics (041)', maxTheory: 80, maxOral: 20, maxTotal: 100 },
        { code: 'SCI', name: 'Science (086)', maxTheory: 80, maxOral: 20, maxTotal: 100 },
        { code: 'SST', name: 'Social Science (087)', maxTheory: 80, maxOral: 20, maxTotal: 100 },
        { code: 'HIN', name: 'Hindi Course-A (002)', maxTheory: 80, maxOral: 20, maxTotal: 100 }
      ]
    }
  },
  {
    levelNumber: 5,
    stageNumber: 6,
    title: 'Master High-Volume Data Entry Challenge',
    subtitle: 'Level 5 • Final Capstone Certification Challenge',
    requiredAccuracy: 100,
    difficulty: 'Expert',
    formType: 'master-challenge',
    baseExp: 600,
    sampleUid: 'ICST-2026-001500',
    description: 'The ultimate ICST Chowberia Master Operator challenge. Full comprehensive student dossier + 7-subject marksheet. Zero tolerance for errors.',
    instructions: [
      'This is the Master Capstone examination stage of ICST Chowberia Data Entry Lab.',
      'Enter all 20+ fields: Personal, Institutional, Identifiers, and 7-subject mark records.',
      '100% accuracy unlocks the coveted "Master Data Operator" title.'
    ],
    fields: [
      { id: 'studentName', label: 'Student Legal Name', type: 'text', required: true, weight: 2 },
      { 
        id: 'guardianPrefix', 
        label: 'Prefix', 
        type: 'select', 
        required: true, 
        weight: 0.5,
        options: GUARDIAN_PREFIX_OPTIONS 
      },
      { id: 'guardianName', label: 'Father / Guardian Name', type: 'text', placeholder: 'First & Last Name', required: true, weight: 2 },
      { id: 'dob', label: 'Date of Birth (YYYY-MM-DD)', type: 'date', required: true, weight: 2 },
      { id: 'gender', label: 'Gender', type: 'radio', required: true, weight: 1,
        options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }]
      },
      { id: 'phone', label: 'Mobile Number', type: 'tel', required: true, weight: 2 },
      { id: 'email', label: 'Official Email', type: 'email', required: true, weight: 2 },
      { id: 'aadhaarNumber', label: 'Aadhaar Identification', type: 'text', placeholder: '12-digit number (spaces optional)', required: true, weight: 3 },
      { id: 'schoolInfo.schoolName', label: 'School Name', type: 'searchable-select', required: true, weight: 2,
        options: [
          { label: 'Chowberia High School (H.S.)', value: 'Chowberia High School (H.S.)' },
          { label: 'Ranaghat Bharati High School', value: 'Ranaghat Bharati High School' },
          { label: 'Chakdaha Ramlal Academy', value: 'Chakdaha Ramlal Academy' },
          { label: 'Krishnanagar Collegiate School', value: 'Krishnanagar Collegiate School' }
        ]
      },
      { id: 'academic.registrationNumber', label: 'Board Registration No.', type: 'text', required: true, weight: 3 },
      { id: 'academic.rollNumber', label: 'Roll Number', type: 'text', required: true, weight: 2 }
    ],
    marksheetSchema: {
      boardType: 'WBBSE',
      hasTheoryPractical: true,
      hasGrades: true,
      subjects: [
        { code: 'BNGA', name: 'First Language (Bengali)', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'ENGB', name: 'Second Language (English)', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'MATH', name: 'Mathematics', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'PSCI', name: 'Physical Science', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'LSCI', name: 'Life Science', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'HIST', name: 'History', maxTheory: 90, maxOral: 10, maxTotal: 100 },
        { code: 'GEOG', name: 'Geography', maxTheory: 90, maxOral: 10, maxTotal: 100 }
      ]
    }
  }
];

export function getStage(levelNumber: number, stageNumber: number): StageConfig | undefined {
  return STAGES.find(s => s.levelNumber === levelNumber && s.stageNumber === stageNumber);
}

export function getStagesForLevel(levelNumber: number): StageConfig[] {
  return STAGES.filter(s => s.levelNumber === levelNumber);
}
