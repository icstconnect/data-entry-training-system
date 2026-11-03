import { TerminalScenario } from '../types/terminal';
import { Achievement } from '../types';

export const TERMINAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'terminal_cadence_starter',
    title: 'Terminal Cadence Starter',
    description: 'Dispatched your first high-speed treasury voucher stream with zero input halts.',
    iconName: 'Zap',
    badgeLevel: 1
  },
  {
    id: 'terminal_audit_vigilance',
    title: 'Forensic Audit Vigilance',
    description: 'Successfully detected and flagged arithmetic and check-digit traps in a live clearing stream.',
    iconName: 'ShieldAlert',
    badgeLevel: 2
  },
  {
    id: 'terminal_10key_maestro',
    title: '10-Key Numpad Maestro',
    description: 'Achieved a sustained 50+ flawless keystroke combo without touching the mouse or backspace.',
    iconName: 'Flame',
    badgeLevel: 3
  },
  {
    id: 'terminal_speed_10k',
    title: 'Velocity 10,000 KPH',
    description: 'Exceeded 10,000 Keystrokes Per Hour in an authentic commercial clearing batch.',
    iconName: 'Gauge',
    badgeLevel: 4
  },
  {
    id: 'terminal_zero_defect_batch',
    title: 'Flawless Dual-Entry Balancing',
    description: 'Cleared an entire 5-voucher intermodal shipping manifest with 100% field accuracy and zero debit/credit variance.',
    iconName: 'CheckCircle2',
    badgeLevel: 4
  },
  {
    id: 'terminal_grandmaster_registrar',
    title: 'Grandmaster Clearing Officer',
    description: 'Conquered the Level 5 High-Value Banking RTGS Clearing Stream with ≥12,000 KPH and 98% accuracy.',
    iconName: 'Crown',
    badgeLevel: 5
  }
];

export const TERMINAL_SCENARIOS: TerminalScenario[] = [
  // ==========================================
  // LEVEL 1: MUNICIPAL TREASURY TAX CHALLAN STREAM
  // ==========================================
  {
    levelNumber: 1,
    scenarioId: 'treasury_challan_l1',
    title: 'Level 1: Municipal Treasury Tax Challan & e-Receipt Stream',
    domain: 'Treasury e-Challan',
    difficulty: 'Beginner',
    targetKPH: 6000,
    targetAccuracy: 90,
    timeLimitSeconds: 360,
    expReward: 160,
    instructions: [
      'Transcribe physical Treasury Tax Challans into the dispatch queue without touching your mouse.',
      'Use TAB or ENTER to cycle through fields. Enter key on the final field dispatches the voucher.',
      'Verify Gross Demand, 5% Rebate deduction, and Net Payable. If arithmetic or date is invalid, press Flag Discrepancy (Alt+D).'
    ],
    fields: [
      {
        id: 'challanNo',
        label: 'Challan Serial No',
        fieldType: 'alphanumeric',
        placeholder: 'KMC-CH-XXXX',
        maxLength: 11,
        autoAdvance: true,
        voucherBox: { topPercent: 12, leftPercent: 55, widthPercent: 40, heightPercent: 10 },
        helpTip: '11-character receipt serial on top-right stamp'
      },
      {
        id: 'wardNo',
        label: 'Ward & Borough',
        fieldType: 'code',
        placeholder: 'WRD-XX-BXX',
        maxLength: 9,
        autoAdvance: true,
        voucherBox: { topPercent: 26, leftPercent: 6, widthPercent: 38, heightPercent: 9 },
        helpTip: 'Borough administrative jurisdiction'
      },
      {
        id: 'assesseeId',
        label: 'Assessee Tax ID',
        fieldType: 'alphanumeric',
        placeholder: 'TAX-XXXX-XX',
        maxLength: 11,
        autoAdvance: true,
        voucherBox: { topPercent: 26, leftPercent: 52, widthPercent: 42, heightPercent: 9 },
        helpTip: 'Unique Municipal Property Assessee code'
      },
      {
        id: 'grossAmount',
        label: 'Gross Demand (₹)',
        fieldType: 'currency',
        placeholder: '0.00',
        voucherBox: { topPercent: 48, leftPercent: 6, widthPercent: 42, heightPercent: 11 },
        helpTip: 'Quarterly property assessment tax demand'
      },
      {
        id: 'rebateAmount',
        label: 'Rebate Discount (₹)',
        fieldType: 'currency',
        placeholder: '0.00',
        voucherBox: { topPercent: 48, leftPercent: 52, widthPercent: 42, heightPercent: 11 },
        helpTip: 'Early settlement rebate (5% of gross if paid on time)'
      },
      {
        id: 'netPayable',
        label: 'Net Total Paid (₹)',
        fieldType: 'currency',
        placeholder: '0.00',
        voucherBox: { topPercent: 66, leftPercent: 52, widthPercent: 42, heightPercent: 12 },
        helpTip: 'Net amount cleared through treasury desk'
      }
    ],
    vouchers: [
      {
        voucherId: 'VCH-KMC-001',
        voucherNumber: 'KMC-CH-4819',
        dateStamp: '24-OCT-2026',
        issuerOrg: 'KOLKATA MUNICIPAL CORPORATION',
        subtitle: 'Assessment-Collection Department (South) • Counter e-Challan',
        sealText: 'MUNICIPAL TREASURY COUNTER #03 • PAID & CLEARED',
        visualData: {
          challanNo: 'KMC-CH-4819',
          wardNo: 'WRD-84-B09',
          assesseeId: 'TAX-9021-WB',
          grossAmount: '12400.00',
          rebateAmount: '620.00',
          netPayable: '11780.00'
        },
        expectedValues: {
          challanNo: 'KMC-CH-4819',
          wardNo: 'WRD-84-B09',
          assesseeId: 'TAX-9021-WB',
          grossAmount: '12400.00',
          rebateAmount: '620.00',
          netPayable: '11780.00'
        },
        debitAmount: 11780.00,
        creditAmount: 11780.00,
        trapConfig: {
          hasTrap: false,
          description: 'Valid clean challan. Gross ₹12,400 - 5% rebate ₹620 = ₹11,780 exact balance.',
          expectedFlag: 'clean'
        }
      },
      {
        voucherId: 'VCH-KMC-002',
        voucherNumber: 'KMC-CH-5120',
        dateStamp: '25-OCT-2026',
        issuerOrg: 'KOLKATA MUNICIPAL CORPORATION',
        subtitle: 'Assessment-Collection Department (North) • Counter e-Challan',
        sealText: 'MUNICIPAL TREASURY COUNTER #01 • PAID & CLEARED',
        visualData: {
          challanNo: 'KMC-CH-5120',
          wardNo: 'WRD-12-B02',
          assesseeId: 'TAX-3184-KL',
          grossAmount: '8600.00',
          rebateAmount: '430.00',
          netPayable: '8170.00'
        },
        expectedValues: {
          challanNo: 'KMC-CH-5120',
          wardNo: 'WRD-12-B02',
          assesseeId: 'TAX-3184-KL',
          grossAmount: '8600.00',
          rebateAmount: '430.00',
          netPayable: '8170.00'
        },
        debitAmount: 8170.00,
        creditAmount: 8170.00,
        trapConfig: {
          hasTrap: false,
          description: 'Valid clean challan. ₹8,600 - ₹430 = ₹8,170 exact balance.',
          expectedFlag: 'clean'
        }
      },
      {
        voucherId: 'VCH-KMC-003',
        voucherNumber: 'KMC-CH-5892',
        dateStamp: '25-OCT-2026',
        issuerOrg: 'KOLKATA MUNICIPAL CORPORATION',
        subtitle: 'Assessment-Collection Department (East) • Counter e-Challan',
        sealText: 'AUDIT TRAP FLAG: ARITHMETIC REBATE MISMATCH',
        visualData: {
          challanNo: 'KMC-CH-5892',
          wardNo: 'WRD-57-B07',
          assesseeId: 'TAX-7704-EM',
          grossAmount: '15000.00',
          rebateAmount: '750.00',
          netPayable: '14500.00' // TRAP: 15000 - 750 = 14250, but voucher says 14500!
        },
        expectedValues: {
          challanNo: 'KMC-CH-5892',
          wardNo: 'WRD-57-B07',
          assesseeId: 'TAX-7704-EM',
          grossAmount: '15000.00',
          rebateAmount: '750.00',
          netPayable: '14500.00'
        },
        debitAmount: 14500.00,
        creditAmount: 14250.00,
        trapConfig: {
          hasTrap: true,
          trapFieldId: 'netPayable',
          trapType: 'arithmetic_mismatch',
          description: 'Arithmetic Discrepancy Trap! Gross ₹15,000 - ₹750 rebate should equal ₹14,250, but voucher lists ₹14,500.',
          expectedFlag: 'discrepant'
        }
      },
      {
        voucherId: 'VCH-KMC-004',
        voucherNumber: 'KMC-CH-6411',
        dateStamp: '26-OCT-2026',
        issuerOrg: 'KOLKATA MUNICIPAL CORPORATION',
        subtitle: 'Assessment-Collection Department (Central) • Counter e-Challan',
        sealText: 'MUNICIPAL TREASURY COUNTER #02 • PAID & CLEARED',
        visualData: {
          challanNo: 'KMC-CH-6411',
          wardNo: 'WRD-45-B05',
          assesseeId: 'TAX-1892-CN',
          grossAmount: '22800.00',
          rebateAmount: '1140.00',
          netPayable: '21660.00'
        },
        expectedValues: {
          challanNo: 'KMC-CH-6411',
          wardNo: 'WRD-45-B05',
          assesseeId: 'TAX-1892-CN',
          grossAmount: '22800.00',
          rebateAmount: '1140.00',
          netPayable: '21660.00'
        },
        debitAmount: 21660.00,
        creditAmount: 21660.00,
        trapConfig: {
          hasTrap: false,
          description: 'Valid clean challan. ₹22,800 - ₹1,140 = ₹21,660 exact balance.',
          expectedFlag: 'clean'
        }
      }
    ]
  },

  // ==========================================
  // LEVEL 2: INTERMODAL FREIGHT CFS WAYBILL DISPATCH
  // ==========================================
  {
    levelNumber: 2,
    scenarioId: 'intermodal_freight_l2',
    title: 'Level 2: Intermodal Freight CFS & Container Waybill Dispatch',
    domain: 'Intermodal Freight',
    difficulty: 'Intermediate',
    targetKPH: 8000,
    targetAccuracy: 95,
    timeLimitSeconds: 380,
    expReward: 240,
    instructions: [
      'Process high-speed container freight consignment receipts off Kolkata Port logistics dockets.',
      'Auto-advance cursor activates on ISO container IDs (11 chars) and Origin/Dest yard codes.',
      'Verify: Net Weight = Gross Weight - Tare Weight. Watch for cargo weight manipulation.'
    ],
    fields: [
      {
        id: 'consignmentNo',
        label: 'Consignment Note (RR)',
        fieldType: 'alphanumeric',
        placeholder: 'RR-XXXX-XXXX',
        maxLength: 12,
        autoAdvance: true,
        voucherBox: { topPercent: 12, leftPercent: 52, widthPercent: 44, heightPercent: 10 },
        helpTip: '12-digit Railway Receipt / Consignment identifier'
      },
      {
        id: 'containerId',
        label: 'ISO Container ID',
        fieldType: 'alphanumeric',
        placeholder: 'MSKU-XXXXXXX',
        maxLength: 12,
        autoAdvance: true,
        voucherBox: { topPercent: 28, leftPercent: 6, widthPercent: 42, heightPercent: 10 },
        helpTip: 'Standard BIC ISO 6346 4-letter prefix + 7-digit serial'
      },
      {
        id: 'originYard',
        label: 'Origin Yard (Port)',
        fieldType: 'code',
        placeholder: 'IN-CCU-CFS1',
        maxLength: 11,
        autoAdvance: true,
        voucherBox: { topPercent: 28, leftPercent: 52, widthPercent: 42, heightPercent: 10 },
        helpTip: 'Origin Container Freight Station station code'
      },
      {
        id: 'grossWeightKg',
        label: 'Gross Weight (Kg)',
        fieldType: 'number',
        placeholder: '0',
        voucherBox: { topPercent: 48, leftPercent: 6, widthPercent: 28, heightPercent: 11 },
        helpTip: 'Total container scale weight including vehicle tare'
      },
      {
        id: 'tareWeightKg',
        label: 'Tare Weight (Kg)',
        fieldType: 'number',
        placeholder: '0',
        voucherBox: { topPercent: 48, leftPercent: 36, widthPercent: 28, heightPercent: 11 },
        helpTip: 'Empty tare weight of container chassis'
      },
      {
        id: 'netCargoKg',
        label: 'Net Cargo Weight (Kg)',
        fieldType: 'number',
        placeholder: '0',
        voucherBox: { topPercent: 48, leftPercent: 66, widthPercent: 28, heightPercent: 11 },
        helpTip: 'Net commercial cargo payload'
      },
      {
        id: 'sealNumber',
        label: 'High-Security Bolt Seal',
        fieldType: 'code',
        placeholder: 'SL-XXXXXX',
        maxLength: 9,
        autoAdvance: true,
        voucherBox: { topPercent: 68, leftPercent: 6, widthPercent: 42, heightPercent: 11 },
        helpTip: 'Customs tamper-evident seal number'
      }
    ],
    vouchers: [
      {
        voucherId: 'VCH-CFS-101',
        voucherNumber: 'RR-8891-2026',
        dateStamp: '26-OCT-2026',
        issuerOrg: 'KOLKATA CONTAINER FREIGHT STATION (CFS-01)',
        subtitle: 'Syama Prasad Mookerjee Port • Intermodal Terminal Dispatch',
        sealText: 'PORT CUSTOMS EXAMINED & SEAL VERIFIED',
        visualData: {
          consignmentNo: 'RR-8891-2026',
          containerId: 'MSKU-4902194',
          originYard: 'IN-CCU-CFS1',
          grossWeightKg: '30480',
          tareWeightKg: '3720',
          netCargoKg: '26760',
          sealNumber: 'SL-940218'
        },
        expectedValues: {
          consignmentNo: 'RR-8891-2026',
          containerId: 'MSKU-4902194',
          originYard: 'IN-CCU-CFS1',
          grossWeightKg: '30480',
          tareWeightKg: '3720',
          netCargoKg: '26760',
          sealNumber: 'SL-940218'
        },
        trapConfig: {
          hasTrap: false,
          description: 'Valid waybill. 30,480 - 3,720 = 26,760 kg net weight.',
          expectedFlag: 'clean'
        }
      },
      {
        voucherId: 'VCH-CFS-102',
        voucherNumber: 'RR-9042-2026',
        dateStamp: '26-OCT-2026',
        issuerOrg: 'HALDIA DOCK COMPLEX INTERMODAL YARD',
        subtitle: 'Container Terminal Berth #08 • Gateway Rail Clearance',
        sealText: 'CARGO CLEARANCE PERMITTED',
        visualData: {
          consignmentNo: 'RR-9042-2026',
          containerId: 'TGHU-8193025',
          originYard: 'IN-HAL-DOK2',
          grossWeightKg: '28600',
          tareWeightKg: '3800',
          netCargoKg: '23800' // TRAP: 28600 - 3800 = 24800, but says 23800! (1,000 kg shortage)
        },
        expectedValues: {
          consignmentNo: 'RR-9042-2026',
          containerId: 'TGHU-8193025',
          originYard: 'IN-HAL-DOK2',
          grossWeightKg: '28600',
          tareWeightKg: '3800',
          netCargoKg: '23800'
        },
        trapConfig: {
          hasTrap: true,
          trapFieldId: 'netCargoKg',
          trapType: 'arithmetic_mismatch',
          description: 'Cargo Discrepancy Trap! 28,600 kg Gross - 3,800 kg Tare must equal 24,800 kg, but manifest indicates 23,800 kg (1 Ton weight mismatch).',
          expectedFlag: 'discrepant'
        }
      },
      {
        voucherId: 'VCH-CFS-103',
        voucherNumber: 'RR-9215-2026',
        dateStamp: '27-OCT-2026',
        issuerOrg: 'CONCOR ICD MAJERHAT LOGISTICS TERMINAL',
        subtitle: 'Eastern Railway Division • Inbound Cargo Waybill',
        sealText: 'RAILWAY RECEIPTS VERIFIED',
        visualData: {
          consignmentNo: 'RR-9215-2026',
          containerId: 'CMAU-6102948',
          originYard: 'IN-MJR-ICD1',
          grossWeightKg: '32500',
          tareWeightKg: '3950',
          netCargoKg: '28550',
          sealNumber: 'SL-581920'
        },
        expectedValues: {
          consignmentNo: 'RR-9215-2026',
          containerId: 'CMAU-6102948',
          originYard: 'IN-MJR-ICD1',
          grossWeightKg: '32500',
          tareWeightKg: '3950',
          netCargoKg: '28550',
          sealNumber: 'SL-581920'
        },
        trapConfig: {
          hasTrap: false,
          description: 'Valid clean waybill. 32,500 - 3,950 = 28,550 kg net weight.',
          expectedFlag: 'clean'
        }
      }
    ]
  },

  // ==========================================
  // LEVEL 3: COMMERCIAL GST INVOICE & E-WAY BILL STREAM
  // ==========================================
  {
    levelNumber: 3,
    scenarioId: 'gst_eway_l3',
    title: 'Level 3: Commercial GST Tax Invoice & E-Way Bill Reconciliation',
    domain: 'Commercial GST',
    difficulty: 'Advanced',
    targetKPH: 10000,
    targetAccuracy: 95,
    timeLimitSeconds: 400,
    expReward: 320,
    instructions: [
      'Transcribe 15-character Supplier GSTINs, 8-digit HSN codes, and commercial tax components.',
      'Check GST split: For intra-state transactions, CGST must equal SGST (both at 9%).',
      'Total Invoice must equal Taxable Value + CGST + SGST.'
    ],
    fields: [
      {
        id: 'invoiceNumber',
        label: 'Tax Invoice Number',
        fieldType: 'alphanumeric',
        placeholder: 'INV-2026-XXXX',
        maxLength: 13,
        autoAdvance: true,
        voucherBox: { topPercent: 12, leftPercent: 52, widthPercent: 44, heightPercent: 10 },
        helpTip: 'Commercial Tax Invoice serial'
      },
      {
        id: 'supplierGstin',
        label: 'Supplier GSTIN',
        fieldType: 'alphanumeric',
        placeholder: '19AAAAA0000A1Z5',
        maxLength: 15,
        autoAdvance: true,
        voucherBox: { topPercent: 26, leftPercent: 6, widthPercent: 44, heightPercent: 9 },
        helpTip: '15-digit Goods & Services Tax Identification Number'
      },
      {
        id: 'hsnCode',
        label: 'HSN / SAC Code',
        fieldType: 'code',
        placeholder: '84713010',
        maxLength: 8,
        autoAdvance: true,
        voucherBox: { topPercent: 26, leftPercent: 52, widthPercent: 42, heightPercent: 9 },
        helpTip: 'Harmonized Commodity Classification code'
      },
      {
        id: 'taxableValue',
        label: 'Taxable Value (₹)',
        fieldType: 'currency',
        placeholder: '0.00',
        voucherBox: { topPercent: 46, leftPercent: 6, widthPercent: 28, heightPercent: 11 },
        helpTip: 'Pre-tax net goods value'
      },
      {
        id: 'cgstAmount',
        label: 'CGST 9% (₹)',
        fieldType: 'currency',
        placeholder: '0.00',
        voucherBox: { topPercent: 46, leftPercent: 36, widthPercent: 28, heightPercent: 11 },
        helpTip: 'Central GST (9% of Taxable Value)'
      },
      {
        id: 'sgstAmount',
        label: 'SGST 9% (₹)',
        fieldType: 'currency',
        placeholder: '0.00',
        voucherBox: { topPercent: 46, leftPercent: 66, widthPercent: 28, heightPercent: 11 },
        helpTip: 'State GST (must equal CGST)'
      },
      {
        id: 'totalInvoice',
        label: 'Total Invoice Value (₹)',
        fieldType: 'currency',
        placeholder: '0.00',
        voucherBox: { topPercent: 66, leftPercent: 52, widthPercent: 42, heightPercent: 12 },
        helpTip: 'Gross invoice total inclusive of all GST'
      }
    ],
    vouchers: [
      {
        voucherId: 'VCH-GST-201',
        voucherNumber: 'INV-2026-4011',
        dateStamp: '27-OCT-2026',
        issuerOrg: 'BENGAL TECHTRONICS HARDWARE LTD',
        subtitle: 'Sector V, Salt Lake, Kolkata • Tax Invoice under Section 31 of CGST Act',
        sealText: 'GST E-WAY BILL GENERATED: 1910-8492-0194',
        visualData: {
          invoiceNumber: 'INV-2026-4011',
          supplierGstin: '19AABCB1234D1Z2',
          hsnCode: '84713010',
          taxableValue: '50000.00',
          cgstAmount: '4500.00',
          sgstAmount: '4500.00',
          totalInvoice: '59000.00'
        },
        expectedValues: {
          invoiceNumber: 'INV-2026-4011',
          supplierGstin: '19AABCB1234D1Z2',
          hsnCode: '84713010',
          taxableValue: '50000.00',
          cgstAmount: '4500.00',
          sgstAmount: '4500.00',
          totalInvoice: '59000.00'
        },
        debitAmount: 59000.00,
        creditAmount: 59000.00,
        trapConfig: {
          hasTrap: false,
          description: 'Valid clean GST invoice. 50,000 + 4,500 CGST + 4,500 SGST = 59,000.',
          expectedFlag: 'clean'
        }
      },
      {
        voucherId: 'VCH-GST-202',
        voucherNumber: 'INV-2026-4099',
        dateStamp: '27-OCT-2026',
        issuerOrg: 'METRO CABLES & INDUSTRIAL SUPPLIES',
        subtitle: 'Chowberia Road, Nadia • Tax Invoice under CGST Act',
        sealText: 'AUDIT TRAP FLAG: TAX ASYMMETRY DETECTED',
        visualData: {
          invoiceNumber: 'INV-2026-4099',
          supplierGstin: '19AABCM9876E1Z8',
          hsnCode: '85444990',
          taxableValue: '80000.00',
          cgstAmount: '7200.00',
          sgstAmount: '5400.00', // TRAP: SGST must equal CGST at 9% (7200)!
          totalInvoice: '92600.00'
        },
        expectedValues: {
          invoiceNumber: 'INV-2026-4099',
          supplierGstin: '19AABCM9876E1Z8',
          hsnCode: '85444990',
          taxableValue: '80000.00',
          cgstAmount: '7200.00',
          sgstAmount: '5400.00',
          totalInvoice: '92600.00'
        },
        debitAmount: 92600.00,
        creditAmount: 94400.00,
        trapConfig: {
          hasTrap: true,
          trapFieldId: 'sgstAmount',
          trapType: 'arithmetic_mismatch',
          description: 'Tax Law Discrepancy Trap! CGST is ₹7,200 (9%), but SGST is listed as ₹5,400 (6.75%). Intra-state GST must have symmetric CGST and SGST rates.',
          expectedFlag: 'discrepant'
        }
      },
      {
        voucherId: 'VCH-GST-203',
        voucherNumber: 'INV-2026-4125',
        dateStamp: '28-OCT-2026',
        issuerOrg: 'DELTA PRECISION POWER SYSTEMS PVT LTD',
        subtitle: 'Kalyani Industrial Growth Centre • Official Tax Invoice',
        sealText: 'GST E-WAY BILL GENERATED: 1910-9941-8821',
        visualData: {
          invoiceNumber: 'INV-2026-4125',
          supplierGstin: '19AACCD5544F1Z1',
          hsnCode: '85044090',
          taxableValue: '120000.00',
          cgstAmount: '10800.00',
          sgstAmount: '10800.00',
          totalInvoice: '141600.00'
        },
        expectedValues: {
          invoiceNumber: 'INV-2026-4125',
          supplierGstin: '19AACCD5544F1Z1',
          hsnCode: '85044090',
          taxableValue: '120000.00',
          cgstAmount: '10800.00',
          sgstAmount: '10800.00',
          totalInvoice: '141600.00'
        },
        debitAmount: 141600.00,
        creditAmount: 141600.00,
        trapConfig: {
          hasTrap: false,
          description: 'Valid clean invoice. 120,000 + 10,800 + 10,800 = 141,600.',
          expectedFlag: 'clean'
        }
      }
    ]
  },

  // ==========================================
  // LEVEL 4: HEALTHCARE TPA & CASHLESS CLAIMS AUDIT
  // ==========================================
  {
    levelNumber: 4,
    scenarioId: 'healthcare_tpa_l4',
    title: 'Level 4: Healthcare TPA & Cashless Hospitalization Claims Audit',
    domain: 'Healthcare TPA',
    difficulty: 'Senior Specialist',
    targetKPH: 12000,
    targetAccuracy: 98,
    timeLimitSeconds: 420,
    expReward: 420,
    instructions: [
      'Audit cashless medical insurance claim dockets for hospital billing clearance.',
      'Verify: Billed Amount - Non-Admissible Deduction = Sanctioned Amount.',
      'Maintain 12,000+ KPH speed on numeric health claim codes.'
    ],
    fields: [
      {
        id: 'claimNumber',
        label: 'TPA Claim Number',
        fieldType: 'alphanumeric',
        placeholder: 'CLM-2026-XXXXX',
        maxLength: 14,
        autoAdvance: true,
        voucherBox: { topPercent: 12, leftPercent: 52, widthPercent: 44, heightPercent: 10 },
        helpTip: '14-character Third Party Administrator claim ID'
      },
      {
        id: 'patientUhid',
        label: 'Patient Health ID (UHID)',
        fieldType: 'code',
        placeholder: 'UHID-XXXX-XXXX',
        maxLength: 14,
        autoAdvance: true,
        voucherBox: { topPercent: 26, leftPercent: 6, widthPercent: 44, heightPercent: 9 },
        helpTip: 'Universal Health Identifier'
      },
      {
        id: 'icdCode',
        label: 'ICD-10 Diagnostic Code',
        fieldType: 'code',
        placeholder: 'E11.9',
        maxLength: 7,
        autoAdvance: true,
        voucherBox: { topPercent: 26, leftPercent: 52, widthPercent: 42, heightPercent: 9 },
        helpTip: 'International Classification of Diseases'
      },
      {
        id: 'billedAmount',
        label: 'Hospital Billed Amount (₹)',
        fieldType: 'currency',
        placeholder: '0.00',
        voucherBox: { topPercent: 46, leftPercent: 6, widthPercent: 28, heightPercent: 11 },
        helpTip: 'Total in-patient hospital bill'
      },
      {
        id: 'deductionAmount',
        label: 'Non-Admissible Deductions (₹)',
        fieldType: 'currency',
        placeholder: '0.00',
        voucherBox: { topPercent: 46, leftPercent: 36, widthPercent: 28, heightPercent: 11 },
        helpTip: 'Consumables & administrative co-pay deductions'
      },
      {
        id: 'sanctionedAmount',
        label: 'TPA Sanctioned Settlement (₹)',
        fieldType: 'currency',
        placeholder: '0.00',
        voucherBox: { topPercent: 46, leftPercent: 66, widthPercent: 28, heightPercent: 11 },
        helpTip: 'Final insurer settlement sanctioned'
      }
    ],
    vouchers: [
      {
        voucherId: 'VCH-TPA-301',
        voucherNumber: 'CLM-2026-09142',
        dateStamp: '28-OCT-2026',
        issuerOrg: 'NATIONAL HEALTH INSURANCE TPA SERVICES',
        subtitle: 'Cashless Hospitalization Claims Desk • Apollo Gleneagles Hospital',
        sealText: 'MEDICAL AUDIT PASSED • SANCTION ISSUED',
        visualData: {
          claimNumber: 'CLM-2026-09142',
          patientUhid: 'UHID-8821-4401',
          icdCode: 'I21.9',
          billedAmount: '145000.00',
          deductionAmount: '12500.00',
          sanctionedAmount: '132500.00'
        },
        expectedValues: {
          claimNumber: 'CLM-2026-09142',
          patientUhid: 'UHID-8821-4401',
          icdCode: 'I21.9',
          billedAmount: '145000.00',
          deductionAmount: '12500.00',
          sanctionedAmount: '132500.00'
        },
        debitAmount: 132500.00,
        creditAmount: 132500.00,
        trapConfig: {
          hasTrap: false,
          description: 'Valid clean medical claim. ₹145,000 - ₹12,500 = ₹132,500 exact settlement.',
          expectedFlag: 'clean'
        }
      },
      {
        voucherId: 'VCH-TPA-302',
        voucherNumber: 'CLM-2026-09255',
        dateStamp: '28-OCT-2026',
        issuerOrg: 'SWASTHYA SATHI SCHEME CLEARING DESK',
        subtitle: 'Govt. of West Bengal • IPD Hospitalization Claim Clearance',
        sealText: 'AUDIT TRAP: DEDUCTION OMISSION DETECTED',
        visualData: {
          claimNumber: 'CLM-2026-09255',
          patientUhid: 'UHID-5512-3390',
          icdCode: 'K35.8',
          billedAmount: '68000.00',
          deductionAmount: '8000.00',
          sanctionedAmount: '68000.00' // TRAP: Deductions of 8000 ignored!
        },
        expectedValues: {
          claimNumber: 'CLM-2026-09255',
          patientUhid: 'UHID-5512-3390',
          icdCode: 'K35.8',
          billedAmount: '68000.00',
          deductionAmount: '8000.00',
          sanctionedAmount: '68000.00'
        },
        debitAmount: 68000.00,
        creditAmount: 60000.00,
        trapConfig: {
          hasTrap: true,
          trapFieldId: 'sanctionedAmount',
          trapType: 'arithmetic_mismatch',
          description: 'Billing Settlement Discrepancy Trap! Billed ₹68,000 with ₹8,000 non-admissible deductions should yield ₹60,000, but hospital erroneously billed for the entire gross amount ₹68,000.',
          expectedFlag: 'discrepant'
        }
      },
      {
        voucherId: 'VCH-TPA-303',
        voucherNumber: 'CLM-2026-09310',
        dateStamp: '29-OCT-2026',
        issuerOrg: 'EASTERN ZONE TPA MEDICAL ADJUDICATION',
        subtitle: 'AMRI Hospital Salt Lake • Orthopedic Surgery Claim',
        sealText: 'VERIFIED & SANCTION CLEARED',
        visualData: {
          claimNumber: 'CLM-2026-09310',
          patientUhid: 'UHID-9901-2245',
          icdCode: 'S72.0',
          billedAmount: '210000.00',
          deductionAmount: '18500.00',
          sanctionedAmount: '191500.00'
        },
        expectedValues: {
          claimNumber: 'CLM-2026-09310',
          patientUhid: 'UHID-9901-2245',
          icdCode: 'S72.0',
          billedAmount: '210000.00',
          deductionAmount: '18500.00',
          sanctionedAmount: '191500.00'
        },
        debitAmount: 191500.00,
        creditAmount: 191500.00,
        trapConfig: {
          hasTrap: false,
          description: 'Valid clean claim. 210,000 - 18,500 = 191,500 exact settlement.',
          expectedFlag: 'clean'
        }
      }
    ]
  },

  // ==========================================
  // LEVEL 5: BANKING RTGS / NEFT TREASURY REMITTANCE
  // ==========================================
  {
    levelNumber: 5,
    scenarioId: 'banking_rtgs_l5',
    title: 'Level 5: Banking RTGS / NEFT High-Value Treasury Remittance',
    domain: 'Banking Remittance',
    difficulty: 'Grandmaster',
    targetKPH: 14000,
    targetAccuracy: 98,
    timeLimitSeconds: 450,
    expReward: 500,
    instructions: [
      'Execute high-value inter-bank RTGS remittance transaction dispatching.',
      'Strict banking syntax: IFSC 5th character must always be numeric zero (0).',
      'Benchmark speed: 14,000 KPH (approx. 4 characters/sec). Zero typing errors allowed.'
    ],
    fields: [
      {
        id: 'utrNumber',
        label: 'UTR Transaction Ref (22 Chars)',
        fieldType: 'alphanumeric',
        placeholder: 'PUNBR52026102900012345',
        maxLength: 22,
        autoAdvance: true,
        voucherBox: { topPercent: 12, leftPercent: 44, widthPercent: 52, heightPercent: 10 },
        helpTip: 'Unique Transaction Reference (22-character Reserve Bank standard)'
      },
      {
        id: 'remitterPan',
        label: 'Remitter Income Tax PAN',
        fieldType: 'alphanumeric',
        placeholder: 'ABCDE1234F',
        maxLength: 10,
        autoAdvance: true,
        voucherBox: { topPercent: 26, leftPercent: 6, widthPercent: 44, heightPercent: 9 },
        helpTip: '10-character Permanent Account Number'
      },
      {
        id: 'beneficiaryIfsc',
        label: 'Beneficiary Bank IFSC',
        fieldType: 'alphanumeric',
        placeholder: 'HDFC0001824',
        maxLength: 11,
        autoAdvance: true,
        voucherBox: { topPercent: 26, leftPercent: 52, widthPercent: 44, heightPercent: 9 },
        helpTip: '11-character Indian Financial System Code (5th char must be 0)'
      },
      {
        id: 'beneficiaryAccount',
        label: 'Beneficiary Account No',
        fieldType: 'number',
        placeholder: '50100294102941',
        maxLength: 16,
        autoAdvance: true,
        voucherBox: { topPercent: 46, leftPercent: 6, widthPercent: 44, heightPercent: 10 },
        helpTip: 'Beneficiary bank core savings/current account number'
      },
      {
        id: 'remittanceAmount',
        label: 'Remittance Principal (₹)',
        fieldType: 'currency',
        placeholder: '0.00',
        voucherBox: { topPercent: 46, leftPercent: 52, widthPercent: 44, heightPercent: 11 },
        helpTip: 'High-value treasury transfer amount'
      },
      {
        id: 'bankCharges',
        label: 'RTGS Interbank Charges (₹)',
        fieldType: 'currency',
        placeholder: '0.00',
        voucherBox: { topPercent: 66, leftPercent: 6, widthPercent: 44, heightPercent: 11 },
        helpTip: 'Statutory clearing charges'
      },
      {
        id: 'totalDebit',
        label: 'Total Account Debit (₹)',
        fieldType: 'currency',
        placeholder: '0.00',
        voucherBox: { topPercent: 66, leftPercent: 52, widthPercent: 44, heightPercent: 12 },
        helpTip: 'Total customer debited sum (Principal + Charges)'
      }
    ],
    vouchers: [
      {
        voucherId: 'VCH-RTGS-501',
        voucherNumber: 'PUNBR52026102900084920',
        dateStamp: '29-OCT-2026',
        issuerOrg: 'PUNJAB NATIONAL BANK • TREASURY BRANCH',
        subtitle: 'High-Value Real Time Gross Settlement (RTGS) Clearing Order',
        sealText: 'RBI GATEWAY CLEARED • SETTLEMENT FINAL',
        visualData: {
          utrNumber: 'PUNBR52026102900084920',
          remitterPan: 'AAACP8814K',
          beneficiaryIfsc: 'SBIN0000001',
          beneficiaryAccount: '30492819201',
          remittanceAmount: '500000.00',
          bankCharges: '25.00',
          totalDebit: '500025.00'
        },
        expectedValues: {
          utrNumber: 'PUNBR52026102900084920',
          remitterPan: 'AAACP8814K',
          beneficiaryIfsc: 'SBIN0000001',
          beneficiaryAccount: '30492819201',
          remittanceAmount: '500000.00',
          bankCharges: '25.00',
          totalDebit: '500025.00'
        },
        debitAmount: 500025.00,
        creditAmount: 500025.00,
        trapConfig: {
          hasTrap: false,
          description: 'Valid high-value RTGS transfer. ₹500,000 + ₹25 = ₹500,025 exact.',
          expectedFlag: 'clean'
        }
      },
      {
        voucherId: 'VCH-RTGS-502',
        voucherNumber: 'HDFCR52026102900019283',
        dateStamp: '29-OCT-2026',
        issuerOrg: 'HDFC BANK TREASURY DESK • DALHOUSIE BRANCH',
        subtitle: 'Inter-Bank High-Value RTGS Transfer Slip',
        sealText: 'AUDIT TRAP: INVALID IFSC 5TH CHARACTER',
        visualData: {
          utrNumber: 'HDFCR52026102900019283',
          remitterPan: 'BLZPK9041M',
          beneficiaryIfsc: 'ICICO001240', // TRAP: 5th char is letter 'O' instead of digit '0'!
          beneficiaryAccount: '001205004128',
          remittanceAmount: '1250000.00',
          bankCharges: '50.00',
          totalDebit: '1250050.00'
        },
        expectedValues: {
          utrNumber: 'HDFCR52026102900019283',
          remitterPan: 'BLZPK9041M',
          beneficiaryIfsc: 'ICICO001240',
          beneficiaryAccount: '001205004128',
          remittanceAmount: '1250000.00',
          bankCharges: '50.00',
          totalDebit: '1250050.00'
        },
        debitAmount: 1250050.00,
        creditAmount: 1250050.00,
        trapConfig: {
          hasTrap: true,
          trapFieldId: 'beneficiaryIfsc',
          trapType: 'invalid_checksum',
          description: 'Banking Syntax Discrepancy Trap! Beneficiary IFSC is listed as "ICICO001240" where the 5th character is the English letter "O" instead of the mandatory numeric digit "0". In RBI clearing, this leads to immediate interbank return.',
          expectedFlag: 'discrepant'
        }
      },
      {
        voucherId: 'VCH-RTGS-503',
        voucherNumber: 'UTIBR52026102900077124',
        dateStamp: '29-OCT-2026',
        issuerOrg: 'AXIS BANK CORPORATE BANKING CENTRE',
        subtitle: 'National RTGS Clearing Voucher • Kolkata Main',
        sealText: 'RBI GATEWAY CLEARED • SETTLEMENT FINAL',
        visualData: {
          utrNumber: 'UTIBR52026102900077124',
          remitterPan: 'CABCD4321E',
          beneficiaryIfsc: 'UTIB0000005',
          beneficiaryAccount: '918020048192841',
          remittanceAmount: '780000.00',
          bankCharges: '25.00',
          totalDebit: '780025.00'
        },
        expectedValues: {
          utrNumber: 'UTIBR52026102900077124',
          remitterPan: 'CABCD4321E',
          beneficiaryIfsc: 'UTIB0000005',
          beneficiaryAccount: '918020048192841',
          remittanceAmount: '780000.00',
          bankCharges: '25.00',
          totalDebit: '780025.00'
        },
        debitAmount: 780025.00,
        creditAmount: 780025.00,
        trapConfig: {
          hasTrap: false,
          description: 'Valid clean RTGS remittance. ₹780,000 + ₹25 = ₹780,025 exact.',
          expectedFlag: 'clean'
        }
      }
    ]
  }
];

