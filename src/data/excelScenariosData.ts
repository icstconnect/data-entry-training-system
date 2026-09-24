import { ExcelScenarioLevel } from '../types/excel';
import { Achievement } from '../types';

export const EXCEL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'excel_novice_grid',
    title: 'Spreadsheet Starter',
    description: 'Completed your very first Excel mass batch entry with ≥80% accuracy.',
    iconName: 'FileSpreadsheet',
    badgeLevel: 1
  },
  {
    id: 'excel_commercial_master',
    title: 'Commercial Inventory Specialist',
    description: 'Accurately transcribed commercial multi-item inventory stock with numbers and decimals.',
    iconName: 'Coins',
    badgeLevel: 2
  },
  {
    id: 'excel_banking_kyc',
    title: 'Banking KYC Ledger Master',
    description: 'Processed 15+ complex banking customer accounts and IFSC codes with zero column mismatches.',
    iconName: 'Building2',
    badgeLevel: 3
  },
  {
    id: 'excel_board_marksheet',
    title: 'Board Marksheet Maestro',
    description: 'Mastered high-density 11-column state board examination master sheet with ≥95% accuracy.',
    iconName: 'GraduationCap',
    badgeLevel: 4
  },
  {
    id: 'excel_census_grandmaster',
    title: 'Grandmaster Excel Registrar',
    description: 'Conquered the 22-row National Census Capstone with 100% flawless cell fidelity.',
    iconName: 'Crown',
    badgeLevel: 5
  }
];

export const EXCEL_LEVELS: ExcelScenarioLevel[] = [
  // ==========================================
  // LEVEL 1: ACADEMIC ADMISSION REGISTER
  // ==========================================
  {
    levelNumber: 1,
    levelTitle: 'Level 1: Foundation Tabular Entry',
    scenarioName: 'Class X Student Admission & Registration Register',
    scenarioSubtitle: 'Academic District Nadia • Secondary Section Admissions',
    description: 'Enter raw student admission log records into the standard 6-column admissions database. Practice rapid Tab and Enter key transitions.',
    domain: 'Academic',
    targetAccuracy: 80,
    timeLimitSeconds: 300,
    expReward: 100,
    sheetName: 'Student_Admissions_2026',
    columns: [
      { id: 'slNo', colLetter: 'A', header: 'Sl No', type: 'number', width: 80, align: 'center', required: true },
      { id: 'studentName', colLetter: 'B', header: 'Student Full Name', type: 'text', width: 220, align: 'left', required: true },
      { id: 'rollNo', colLetter: 'C', header: 'Roll No', type: 'text', width: 140, align: 'center', required: true },
      { id: 'guardianName', colLetter: 'D', header: 'Father / Guardian Name', type: 'text', width: 220, align: 'left', required: true },
      { id: 'mobile', colLetter: 'E', header: 'Mobile Number', type: 'phone', width: 150, align: 'center', required: true },
      { id: 'category', colLetter: 'F', header: 'Category', type: 'text', width: 120, align: 'center', required: true }
    ],
    tips: [
      'Use TAB key to move right to the next cell.',
      'Use ENTER key to complete the row and jump to the next line.',
      'Maintain exact case sensitivity for student and guardian names.'
    ],
    sourceRecords: [
      { slNo: '1', studentName: 'Sourav Ghosh', rollNo: 'ICST-2026-001', guardianName: 'Prabir Ghosh', mobile: '9830124587', category: 'General' },
      { slNo: '2', studentName: 'Ananya Mukherjee', rollNo: 'ICST-2026-002', guardianName: 'Debabrata Mukherjee', mobile: '9434871209', category: 'General' },
      { slNo: '3', studentName: 'Subham Karmakar', rollNo: 'ICST-2026-003', guardianName: 'Uttam Karmakar', mobile: '8910452398', category: 'OBC-B' },
      { slNo: '4', studentName: 'Priyanka Mondal', rollNo: 'ICST-2026-004', guardianName: 'Tarun Mondal', mobile: '7001923485', category: 'SC' },
      { slNo: '5', studentName: 'Tanmoy Adhikari', rollNo: 'ICST-2026-005', guardianName: 'Swapan Adhikari', mobile: '9123847561', category: 'General' },
      { slNo: '6', studentName: 'Sneha Sarkar', rollNo: 'ICST-2026-006', guardianName: 'Biswajit Sarkar', mobile: '9874102938', category: 'SC' },
      { slNo: '7', studentName: 'Rohan Majumdar', rollNo: 'ICST-2026-007', guardianName: 'Ashok Majumdar', mobile: '8697230491', category: 'OBC-A' },
      { slNo: '8', studentName: 'Debasmita Roy', rollNo: 'ICST-2026-008', guardianName: 'Subrata Roy', mobile: '9007182934', category: 'General' }
    ]
  },

  // ==========================================
  // LEVEL 2: COMMERCIAL INVENTORY & SUPPLY
  // ==========================================
  {
    levelNumber: 2,
    levelTitle: 'Level 2: Commercial Inventory Register',
    scenarioName: 'Wholesale Hardware & Electronics Stock Ledger',
    scenarioSubtitle: 'ICST Chowberia Commercial Supplies Depot',
    description: 'Enter SKU codes, product descriptions, stock quantities, and unit values. Ensure exact numerical and decimal fidelity across 8 columns.',
    domain: 'Commercial',
    targetAccuracy: 85,
    timeLimitSeconds: 380,
    expReward: 180,
    sheetName: 'Stock_Inventory_Q3',
    columns: [
      { id: 'sku', colLetter: 'A', header: 'Item SKU', type: 'text', width: 120, align: 'center', required: true },
      { id: 'productName', colLetter: 'B', header: 'Product Description', type: 'text', width: 240, align: 'left', required: true },
      { id: 'unit', colLetter: 'C', header: 'Unit', type: 'text', width: 90, align: 'center', required: true },
      { id: 'qty', colLetter: 'D', header: 'Quantity', type: 'number', width: 100, align: 'right', required: true },
      { id: 'unitPrice', colLetter: 'E', header: 'Unit Cost (₹)', type: 'currency', width: 120, align: 'right', required: true },
      { id: 'subtotal', colLetter: 'F', header: 'Subtotal (₹)', type: 'currency', width: 130, align: 'right', required: true },
      { id: 'gst', colLetter: 'G', header: 'GST Rate', type: 'text', width: 100, align: 'center', required: true },
      { id: 'total', colLetter: 'H', header: 'Total Value (₹)', type: 'currency', width: 140, align: 'right', required: true }
    ],
    tips: [
      'Enter numbers with exact decimal places as shown in the source ledger.',
      'Use the Numeric Keypad for fast digit typing.',
      'Do not type the ₹ currency symbol inside the cell—only enter digits.'
    ],
    sourceRecords: [
      { sku: 'HW-101', productName: 'Optical USB Mouse 1000 DPI', unit: 'Pcs', qty: '45', unitPrice: '220.00', subtotal: '9900.00', gst: '18%', total: '11682.00' },
      { sku: 'HW-102', productName: 'Multimedia Keyboard USB Standard', unit: 'Pcs', qty: '30', unitPrice: '450.00', subtotal: '13500.00', gst: '18%', total: '15930.00' },
      { sku: 'HW-103', productName: 'CAT-6 UTP Ethernet Cable 305m', unit: 'Box', qty: '8', unitPrice: '4200.00', subtotal: '33600.00', gst: '18%', total: '39648.00' },
      { sku: 'HW-104', productName: 'RJ-45 Crimping Tool Heavy Duty', unit: 'Pcs', qty: '15', unitPrice: '380.00', subtotal: '5700.00', gst: '18%', total: '6726.00' },
      { sku: 'HW-105', productName: 'Modular Switch 8-Port Gigabit', unit: 'Pcs', qty: '12', unitPrice: '1250.00', subtotal: '15000.00', gst: '18%', total: '17700.00' },
      { sku: 'HW-106', productName: 'A4 Laser Copier Paper 75 GSM', unit: 'Ream', qty: '80', unitPrice: '260.00', subtotal: '20800.00', gst: '12%', total: '23296.00' },
      { sku: 'HW-107', productName: 'Thermal Printer Paper Rolls 80mm', unit: 'Roll', qty: '150', unitPrice: '45.00', subtotal: '6750.00', gst: '12%', total: '7560.00' },
      { sku: 'HW-108', productName: 'USB Flash Drive 64GB High Speed', unit: 'Pcs', qty: '25', unitPrice: '410.00', subtotal: '10250.00', gst: '18%', total: '12095.00' },
      { sku: 'HW-109', productName: 'Surge Protector 6-Way 2 Meter', unit: 'Pcs', qty: '20', unitPrice: '520.00', subtotal: '10400.00', gst: '18%', total: '12272.00' },
      { sku: 'HW-110', productName: 'HDMI Cable High Speed 1.5 Meter', unit: 'Pcs', qty: '40', unitPrice: '160.00', subtotal: '6400.00', gst: '18%', total: '7552.00' },
      { sku: 'HW-111', productName: 'Desk Mic with USB Noise Filter', unit: 'Pcs', qty: '10', unitPrice: '850.00', subtotal: '8500.00', gst: '18%', total: '10030.00' },
      { sku: 'HW-112', productName: 'Laserjet Toner Cartridge 88A', unit: 'Pcs', qty: '14', unitPrice: '980.00', subtotal: '13720.00', gst: '18%', total: '16189.60' }
    ]
  },

  // ==========================================
  // LEVEL 3: BANKING CUSTOMER KYC & ACCOUNTS
  // ==========================================
  {
    levelNumber: 3,
    levelTitle: 'Level 3: Banking & KYC Account Ledger',
    scenarioName: 'Nationalized Bank Customer KYC Master Ledger',
    scenarioSubtitle: 'Core Banking System (CBS) Data Migration Batch',
    description: 'Process 15 multi-column banking records. Every 12-digit Aadhaar and 11-digit IFSC code requires strict formatting without character errors.',
    domain: 'Banking',
    targetAccuracy: 90,
    timeLimitSeconds: 460,
    expReward: 260,
    sheetName: 'Customer_KYC_Master',
    columns: [
      { id: 'accNo', colLetter: 'A', header: 'Account Number', type: 'text', width: 160, align: 'center', required: true },
      { id: 'ifsc', colLetter: 'B', header: 'IFSC Code', type: 'text', width: 140, align: 'center', required: true },
      { id: 'holderName', colLetter: 'C', header: 'Account Holder Name', type: 'text', width: 220, align: 'left', required: true },
      { id: 'accType', colLetter: 'D', header: 'Account Type', type: 'text', width: 120, align: 'center', required: true },
      { id: 'aadhaar', colLetter: 'E', header: 'Aadhaar Identification', type: 'text', width: 160, align: 'center', required: true },
      { id: 'branch', colLetter: 'F', header: 'Branch Name', type: 'text', width: 160, align: 'left', required: true },
      { id: 'balance', colLetter: 'G', header: 'Opening Balance (₹)', type: 'currency', width: 150, align: 'right', required: true }
    ],
    tips: [
      'IFSC codes must be uppercase (e.g. SBIN0001420, PUNB0124800).',
      'Aadhaar numbers are 12 digits (e.g. 766255747683 or with spaces).',
      'Pay extra attention to 11-digit bank account numbers.'
    ],
    sourceRecords: [
      { accNo: '31094827104', ifsc: 'SBIN0001420', holderName: 'Rajesh Kumar Halder', accType: 'Savings', aadhaar: '766255747683', branch: 'Chowberia Rural', balance: '14500.00' },
      { accNo: '31094827115', ifsc: 'SBIN0001420', holderName: 'Moumita Sen', accType: 'Savings', aadhaar: '891045239812', branch: 'Chowberia Rural', balance: '28450.50' },
      { accNo: '50200049182', ifsc: 'HDFC0000418', holderName: 'Biswajit Chakraborty', accType: 'Current', aadhaar: '451298347102', branch: 'Ranaghat Main', balance: '154000.00' },
      { accNo: '31094827126', ifsc: 'SBIN0001420', holderName: 'Sunita Dutta', accType: 'Savings', aadhaar: '320984127561', branch: 'Chowberia Rural', balance: '8750.00' },
      { accNo: '02840001092', ifsc: 'PUNB0124800', holderName: 'Aloke Nath Bhowmick', accType: 'Savings', aadhaar: '984512304918', branch: 'Nadia Central', balance: '42100.00' },
      { accNo: '31094827137', ifsc: 'SBIN0001420', holderName: 'Kalyani Paul', accType: 'Savings', aadhaar: '671209348512', branch: 'Chowberia Rural', balance: '19200.00' },
      { accNo: '50200049193', ifsc: 'HDFC0000418', holderName: 'Debasis Santra', accType: 'Current', aadhaar: '812934751029', branch: 'Ranaghat Main', balance: '89500.00' },
      { accNo: '31094827148', ifsc: 'SBIN0001420', holderName: 'Manasi Barman', accType: 'Savings', aadhaar: '540192837461', branch: 'Chowberia Rural', balance: '12400.00' },
      { accNo: '02840001103', ifsc: 'PUNB0124800', holderName: 'Shyamal Majhi', accType: 'Savings', aadhaar: '239845102934', branch: 'Nadia Central', balance: '6300.00' },
      { accNo: '31094827159', ifsc: 'SBIN0001420', holderName: 'Sampa Chatterjee', accType: 'Savings', aadhaar: '901238475610', branch: 'Chowberia Rural', balance: '34800.00' },
      { accNo: '50200049204', ifsc: 'HDFC0000418', holderName: 'Tarapada Ghosh', accType: 'Current', aadhaar: '741029384512', branch: 'Ranaghat Main', balance: '210500.00' },
      { accNo: '31094827170', ifsc: 'SBIN0001420', holderName: 'Purnima Karmakar', accType: 'Savings', aadhaar: '384756102938', branch: 'Chowberia Rural', balance: '16900.00' },
      { accNo: '02840001114', ifsc: 'PUNB0124800', holderName: 'Gouranga Das', accType: 'Savings', aadhaar: '849201938475', branch: 'Nadia Central', balance: '27650.00' },
      { accNo: '31094827181', ifsc: 'SBIN0001420', holderName: 'Rina Biswas', accType: 'Savings', aadhaar: '192837465019', branch: 'Chowberia Rural', balance: '9400.00' },
      { accNo: '31094827192', ifsc: 'SBIN0001420', holderName: 'Prasenjit Kundu', accType: 'Savings', aadhaar: '650192837465', branch: 'Chowberia Rural', balance: '45000.00' }
    ]
  },

  // ==========================================
  // LEVEL 4: STATE BOARD MARKSHEET MASTER SHEET
  // ==========================================
  {
    levelNumber: 4,
    levelTitle: 'Level 4: Academic Board Marksheet Ledger',
    scenarioName: 'WBBSE Secondary Examination Master Marksheet',
    scenarioSubtitle: 'Madhyamik Pariksha Official Tabulation Sheet',
    description: 'High-density 11-column tabular entry across 7 distinct academic subject marks, aggregate totals, and Division standings for 18 candidates.',
    domain: 'Education Board',
    targetAccuracy: 95,
    timeLimitSeconds: 520,
    expReward: 360,
    sheetName: 'WBBSE_Tabulation_2026',
    columns: [
      { id: 'roll', colLetter: 'A', header: 'Roll No', type: 'text', width: 130, align: 'center', required: true },
      { id: 'name', colLetter: 'B', header: 'Candidate Name', type: 'text', width: 210, align: 'left', required: true },
      { id: 'bengali', colLetter: 'C', header: 'BNGA', type: 'number', width: 80, align: 'center', required: true },
      { id: 'english', colLetter: 'D', header: 'ENGB', type: 'number', width: 80, align: 'center', required: true },
      { id: 'math', colLetter: 'E', header: 'MATH', type: 'number', width: 80, align: 'center', required: true },
      { id: 'physSci', colLetter: 'F', header: 'PSCI', type: 'number', width: 80, align: 'center', required: true },
      { id: 'lifeSci', colLetter: 'G', header: 'LSCI', type: 'number', width: 80, align: 'center', required: true },
      { id: 'history', colLetter: 'H', header: 'HIST', type: 'number', width: 80, align: 'center', required: true },
      { id: 'geography', colLetter: 'I', header: 'GEOG', type: 'number', width: 80, align: 'center', required: true },
      { id: 'total', colLetter: 'J', header: 'Total (700)', type: 'number', width: 100, align: 'center', required: true },
      { id: 'division', colLetter: 'K', header: 'Division', type: 'text', width: 110, align: 'center', required: true }
    ],
    tips: [
      'Use NUMPAD for rapid 2-digit subject mark entry.',
      'Check that Total equals the sum of all 7 subjects.',
      'Division values: 1st Div (>=420), 2nd Div (>=315), 3rd Div (>=238).'
    ],
    sourceRecords: [
      { roll: '512011N-0001', name: 'Abhijit Sarkar', bengali: '78', english: '72', math: '85', physSci: '81', lifeSci: '88', history: '74', geography: '79', total: '557', division: '1st Div' },
      { roll: '512011N-0002', name: 'Paramita Dey', bengali: '84', english: '80', math: '92', physSci: '89', lifeSci: '91', history: '82', geography: '86', total: '604', division: '1st Div' },
      { roll: '512011N-0003', name: 'Sandip Mondal', bengali: '62', english: '58', math: '66', physSci: '59', lifeSci: '64', history: '60', geography: '63', total: '432', division: '1st Div' },
      { roll: '512011N-0004', name: 'Rupali Paul', bengali: '71', english: '68', math: '75', physSci: '70', lifeSci: '79', history: '72', geography: '74', total: '509', division: '1st Div' },
      { roll: '512011N-0005', name: 'Sayan Chatterjee', bengali: '54', english: '48', math: '52', physSci: '49', lifeSci: '56', history: '50', geography: '53', total: '362', division: '2nd Div' },
      { roll: '512011N-0006', name: 'Pooja Biswas', bengali: '86', english: '82', math: '94', physSci: '90', lifeSci: '93', history: '85', geography: '88', total: '618', division: '1st Div' },
      { roll: '512011N-0007', name: 'Bikram Das', bengali: '48', english: '42', math: '45', physSci: '41', lifeSci: '50', history: '44', geography: '46', total: '316', division: '2nd Div' },
      { roll: '512011N-0008', name: 'Sangeeta Roy', bengali: '75', english: '70', math: '82', physSci: '78', lifeSci: '84', history: '73', geography: '76', total: '538', division: '1st Div' },
      { roll: '512011N-0009', name: 'Manish Kumar Shaw', bengali: '65', english: '61', math: '70', physSci: '64', lifeSci: '68', history: '62', geography: '66', total: '456', division: '1st Div' },
      { roll: '512011N-0010', name: 'Ankita Ghosh', bengali: '89', english: '86', math: '96', physSci: '92', lifeSci: '95', history: '88', geography: '91', total: '637', division: '1st Div' },
      { roll: '512011N-0011', name: 'Dipankar Sen', bengali: '58', english: '52', math: '60', physSci: '55', lifeSci: '62', history: '54', geography: '57', total: '398', division: '2nd Div' },
      { roll: '512011N-0012', name: 'Rima Pramanik', bengali: '77', english: '74', math: '80', physSci: '76', lifeSci: '82', history: '75', geography: '78', total: '542', division: '1st Div' },
      { roll: '512011N-0013', name: 'Kaushik Bhowmick', bengali: '44', english: '39', math: '42', physSci: '38', lifeSci: '45', history: '40', geography: '43', total: '291', division: '3rd Div' },
      { roll: '512011N-0014', name: 'Tanushree Dutta', bengali: '82', english: '78', math: '88', physSci: '84', lifeSci: '89', history: '80', geography: '83', total: '584', division: '1st Div' },
      { roll: '512011N-0015', name: 'Sourav Maji', bengali: '69', english: '64', math: '73', physSci: '68', lifeSci: '75', history: '67', geography: '70', total: '486', division: '1st Div' },
      { roll: '512011N-0016', name: 'Debolina Barman', bengali: '88', english: '85', math: '95', physSci: '91', lifeSci: '94', history: '87', geography: '90', total: '630', division: '1st Div' },
      { roll: '512011N-0017', name: 'Prosenjit Malakar', bengali: '56', english: '50', math: '58', physSci: '52', lifeSci: '60', history: '53', geography: '55', total: '384', division: '2nd Div' },
      { roll: '512011N-0018', name: 'Barnali Chakraborty', bengali: '91', english: '88', math: '98', physSci: '94', lifeSci: '97', history: '90', geography: '93', total: '651', division: '1st Div' }
    ]
  },

  // ==========================================
  // LEVEL 5: NATIONAL CENSUS & ELECTORAL ROLL
  // ==========================================
  {
    levelNumber: 5,
    levelTitle: 'Level 5: National Census & Electoral Roll Capstone',
    scenarioName: 'National Population Register & Electoral Roll Ledger',
    scenarioSubtitle: 'Govt. of India Electoral Ward 42 Chowberia',
    description: 'The ultimate zero-tolerance mass entry challenge: 22 dense citizen records across 10 specialized demographic columns with 100% precision target.',
    domain: 'Government Census',
    targetAccuracy: 100,
    timeLimitSeconds: 600,
    expReward: 500,
    sheetName: 'Electoral_Roll_Ward42',
    columns: [
      { id: 'epic', colLetter: 'A', header: 'EPIC Voter ID', type: 'text', width: 140, align: 'center', required: true },
      { id: 'houseNo', colLetter: 'B', header: 'House No', type: 'text', width: 90, align: 'center', required: true },
      { id: 'citizenName', colLetter: 'C', header: 'Citizen Full Name', type: 'text', width: 200, align: 'left', required: true },
      { id: 'relationName', colLetter: 'D', header: 'Father/Spouse Name', type: 'text', width: 200, align: 'left', required: true },
      { id: 'relation', colLetter: 'E', header: 'Relation', type: 'text', width: 90, align: 'center', required: true },
      { id: 'gender', colLetter: 'F', header: 'Gender', type: 'text', width: 80, align: 'center', required: true },
      { id: 'age', colLetter: 'G', header: 'Age', type: 'number', width: 70, align: 'center', required: true },
      { id: 'dob', colLetter: 'H', header: 'DOB (YYYY-MM-DD)', type: 'date', width: 130, align: 'center', required: true },
      { id: 'occupation', colLetter: 'I', header: 'Occupation', type: 'text', width: 140, align: 'left', required: true },
      { id: 'pollingCenter', colLetter: 'J', header: 'Polling Station', type: 'text', width: 170, align: 'left', required: true }
    ],
    tips: [
      'Epic Voter IDs format: 3 letters followed by 7 digits (e.g. WBD1029384).',
      'Dates must follow standard YYYY-MM-DD formatting.',
      'Level 5 Capstone requires 100% exact accuracy to achieve Grandmaster certification.'
    ],
    sourceRecords: [
      { epic: 'WBD1029384', houseNo: '14/A', citizenName: 'Amalendu Biswas', relationName: 'Birendra Biswas', relation: 'Father', gender: 'Male', age: '52', dob: '1974-04-12', occupation: 'Teacher', pollingCenter: 'Chowberia High School' },
      { epic: 'WBD1029385', houseNo: '14/A', citizenName: 'Champa Biswas', relationName: 'Amalendu Biswas', relation: 'Husband', gender: 'Female', age: '47', dob: '1979-08-25', occupation: 'Homemaker', pollingCenter: 'Chowberia High School' },
      { epic: 'WBD1029386', houseNo: '14/B', citizenName: 'Subhasis Roy', relationName: 'Nripendra Roy', relation: 'Father', gender: 'Male', age: '38', dob: '1988-11-03', occupation: 'Govt Service', pollingCenter: 'Chowberia High School' },
      { epic: 'WBD1029387', houseNo: '15/1', citizenName: 'Malati Mukherjee', relationName: 'Pranab Mukherjee', relation: 'Husband', gender: 'Female', age: '64', dob: '1962-02-18', occupation: 'Retired', pollingCenter: 'Panchayat Bhavan Booth 1' },
      { epic: 'WBD1029388', houseNo: '15/2', citizenName: 'Kallol Sengupta', relationName: 'Manindra Sengupta', relation: 'Father', gender: 'Male', age: '41', dob: '1985-06-30', occupation: 'Business', pollingCenter: 'Panchayat Bhavan Booth 1' },
      { epic: 'WBD1029389', houseNo: '16/A', citizenName: 'Sutapa Karmakar', relationName: 'Niranjan Karmakar', relation: 'Father', gender: 'Female', age: '29', dob: '1997-09-14', occupation: 'Accountant', pollingCenter: 'Chowberia Girls Primary' },
      { epic: 'WBD1029390', houseNo: '16/B', citizenName: 'Partha Sarathi Paul', relationName: 'Gostho Paul', relation: 'Father', gender: 'Male', age: '35', dob: '1991-03-21', occupation: 'Pharmacist', pollingCenter: 'Chowberia Girls Primary' },
      { epic: 'WBD1029391', houseNo: '17/1', citizenName: 'Bhaswati Ghosh', relationName: 'Anil Kumar Ghosh', relation: 'Husband', gender: 'Female', age: '58', dob: '1968-12-05', occupation: 'Teacher', pollingCenter: 'Chowberia High School' },
      { epic: 'WBD1029392', houseNo: '17/2', citizenName: 'Debabrata Halder', relationName: 'Sudhir Halder', relation: 'Father', gender: 'Male', age: '44', dob: '1982-05-19', occupation: 'Civil Engineer', pollingCenter: 'Chowberia High School' },
      { epic: 'WBD1029393', houseNo: '18/A', citizenName: 'Snigdha Adhikari', relationName: 'Debabrata Halder', relation: 'Husband', gender: 'Female', age: '39', dob: '1987-10-11', occupation: 'Professor', pollingCenter: 'Chowberia High School' },
      { epic: 'WBD1029394', houseNo: '19/C', citizenName: 'Tapan Kumar Das', relationName: 'Jogesh Das', relation: 'Father', gender: 'Male', age: '67', dob: '1959-01-29', occupation: 'Pensioner', pollingCenter: 'Panchayat Bhavan Booth 2' },
      { epic: 'WBD1029395', houseNo: '19/C', citizenName: 'Anjali Das', relationName: 'Tapan Kumar Das', relation: 'Husband', gender: 'Female', age: '61', dob: '1965-07-16', occupation: 'Homemaker', pollingCenter: 'Panchayat Bhavan Booth 2' },
      { epic: 'WBD1029396', houseNo: '20/1', citizenName: 'Kaushik Majumdar', relationName: 'Sankar Majumdar', relation: 'Father', gender: 'Male', age: '31', dob: '1995-04-08', occupation: 'Software Tech', pollingCenter: 'Chowberia Girls Primary' },
      { epic: 'WBD1029397', houseNo: '21/A', citizenName: 'Rumki Bhowmick', relationName: 'Dhirendra Bhowmick', relation: 'Father', gender: 'Female', age: '27', dob: '1999-08-22', occupation: 'Nurse', pollingCenter: 'Panchayat Bhavan Booth 1' },
      { epic: 'WBD1029398', houseNo: '22/B', citizenName: 'Sabyasachi Dey', relationName: 'Haripada Dey', relation: 'Father', gender: 'Male', age: '46', dob: '1980-03-15', occupation: 'Bank Officer', pollingCenter: 'Chowberia High School' },
      { epic: 'WBD1029399', houseNo: '22/B', citizenName: 'Mousumi Dey', relationName: 'Sabyasachi Dey', relation: 'Husband', gender: 'Female', age: '42', dob: '1984-11-27', occupation: 'Librarian', pollingCenter: 'Chowberia High School' },
      { epic: 'WBD1029400', houseNo: '23/1', citizenName: 'Gopal Chandra Kundu', relationName: 'Bankim Kundu', relation: 'Father', gender: 'Male', age: '54', dob: '1972-09-02', occupation: 'Trader', pollingCenter: 'Chowberia High School' },
      { epic: 'WBD1029401', houseNo: '24/A', citizenName: 'Madhumita Santra', relationName: 'Kartik Santra', relation: 'Father', gender: 'Female', age: '33', dob: '1993-06-14', occupation: 'Clerk', pollingCenter: 'Panchayat Bhavan Booth 2' },
      { epic: 'WBD1029402', houseNo: '25/C', citizenName: 'Bikash Ranjan Shaw', relationName: 'Ramadhar Shaw', relation: 'Father', gender: 'Male', age: '49', dob: '1977-10-31', occupation: 'Shop Owner', pollingCenter: 'Chowberia High School' },
      { epic: 'WBD1029403', houseNo: '26/1', citizenName: 'Jharna Pramanik', relationName: 'Nanda Pramanik', relation: 'Husband', gender: 'Female', age: '51', dob: '1975-02-09', occupation: 'Tailor', pollingCenter: 'Chowberia Girls Primary' },
      { epic: 'WBD1029404', houseNo: '27/A', citizenName: 'Soumya Deep Roy', relationName: 'Prabhat Roy', relation: 'Father', gender: 'Male', age: '24', dob: '2002-12-19', occupation: 'Student Operator', pollingCenter: 'Chowberia High School' },
      { epic: 'WBD1029405', houseNo: '28/B', citizenName: 'Kaveri Chatterjee', relationName: 'Somnath Chatterjee', relation: 'Father', gender: 'Female', age: '36', dob: '1990-05-04', occupation: 'Data Specialist', pollingCenter: 'Chowberia High School' }
    ]
  }
];
