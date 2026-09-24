# ICST Data Entry Lab • Training & Certification Platform

> **Institute of Computer Science and Technology Chowberia**  
> *Chowberia, Nadia, West Bengal, India*  
> *Official Institutional Data Entry & Computer Applications Simulation Lab*

---

## 🏛️ About The Institute & Project

The **ICST Data Entry Lab** is a specialized, institutional-grade training simulation platform developed for the **Institute of Computer Science and Technology (ICST) - Chowberia**. 

Designed to prepare vocational and computer science students for real-world administrative, government, banking, and commercial data operations, the platform simulates authentic physical paper dossiers, state board marksheets, voter/census registers, and multi-column Microsoft Excel mass ledgers.

Unlike conventional typing tests that measure raw words-per-minute (WPM), the ICST Data Entry Lab evaluates **character-level precision**, **tabular field navigation**, **numerical keypad accuracy**, and **keystrokes per hour (KPH)** under strict regulatory benchmarks.

---

## 🚀 Core Features & Architecture

```
                          ICST DATA ENTRY LAB
                                   │
      ┌────────────────────────────┼────────────────────────────┐
      ▼                            ▼                            ▼
Single-Form Lab            Excel Mass Entry Lab         Institutional Hub
 (18 Stages, 5 Levels)      (5 Levels, 5 Trophies)     (Teacher/Student Modes)
      │                            │                            │
      ├─ UID Dossier Lookup        ├─ Authentic Excel 365 Grid  ├─ Secure PIN Auth
      ├─ Separate Prefix Dropdown  ├─ Physical Ledger Split     ├─ Live Showcase
      ├─ Unspaced Aadhaar Entry    ├─ Formula Bar (fx) & Names  ├─ Canvas Certificate
      └─ Auto Review & Audit       └─ Tab/Enter/Arrow Nav       └─ Offline PWA & Cache
```

### 1. 📋 Single-Form Structured Data Entry Training (18 Stages)
- **18 Progressive Scenarios across 5 Difficulty Levels**:
  - **Level 1**: Basic Personal Demographics & Admission Data (4 stages)
  - **Level 2**: Contact Information, Addresses & Phone Records (4 stages)
  - **Level 3**: Secondary Examination Marksheets (WBBSE Madhyamik Pariksha 7 subjects, 4 stages)
  - **Level 4**: Banking Accounts, IFSC & Transaction Ledgers (3 stages)
  - **Level 5**: Government Schemes, Voter Rolls & National Population Registry (3 stages)
- **Field-Specific Input Standards**:
  - **Name Prefix Selection**: Dedicated compact dropdown (`Mr.`, `Mrs.`, `Miss`, `Dr.`) isolated from the student name input.
  - **Single Full Name Field**: Holds first and last name without arbitrary splits.
  - **Aadhaar Card Entry**: Strict 12-digit format without spaces, matching official UIDAI verification standards.
  - **Mathematical Parity Verification**: Dynamic client-side totals checking (e.g. state board total marks, bank balances).
- **Auto-Fill & Review Screen**: Catch empty or unverified fields prior to final audit submission.

---

### 2. 📊 Dedicated Excel Mass Data Entry Simulation Lab
A completely separate, high-fidelity spreadsheet simulator designed for multi-row, multi-column tabular data operations:

- **Authentic Split-Screen Environment**:
  - **Left Pane (Physical Source Ledger)**: High-resolution official department ledger with authentic vintage typography, department seal watermarks, and active row focus tracking. Anti-cheating copy protection (`user-select: none`) ensures students transcribe from sight.
  - **Right Pane (Excel 365 Grid Engine)**: Office emerald green title bar (`#107c41`), Formula Bar (`fx`), coordinate name box (e.g. `B4`, `F12`), column letters `A..Z`, and row numbers `1..N`.
- **Keyboard Navigation Muscle Memory**:
  - `Tab`: Moves focus to the right cell (wraps to start of next row at end of line).
  - `Shift + Tab`: Moves focus left.
  - `Enter`: Commits cell and moves down one row.
  - `Shift + Enter`: Moves up.
  - `Arrow Keys`: Rapid directional navigation across the matrix.
  - `F2` / Direct Typing: Inline cell editing mode.
  - `Delete` / `Backspace`: Clears cell value.
- **5 Progressive Excel Scenarios**:

| Level | Registry Scenario | Domain | Columns | Rows | Total Cells | Time Benchmark | Target Accuracy | EXP |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | Class X Admission Register | Academic | 6 | 8 | 48 | 300s (5m) | 80% | 100 EXP |
| **2** | Wholesale Hardware Depot | Commercial | 8 | 12 | 96 | 380s (6.3m) | 85% | 180 EXP |
| **3** | Customer KYC Master Ledger | Banking | 7 | 15 | 105 | 420s (7m) | 90% | 250 EXP |
| **4** | WBBSE Examination Marksheet | Education Board | 11 | 18 | 198 | 480s (8m) | 95% | 350 EXP |
| **5** | National Population Roll | Government Census | 10 | 22 | 220 | 600s (10m) | 100% | 500 EXP |

---

### 3. 🏆 5 Excel Registrar Honors & Custom SVG Trophy Graphics
The Excel Lab features 5 distinct achievements, each accompanied by a bespoke SVG trophy graphic with dual visual states (locked monochrome vs. unlocked radiant metallic gradients):

1. **Spreadsheet Starter** (`excel_novice_grid`): Completed first Excel batch entry with ≥80% accuracy.
2. **Commercial Inventory Specialist** (`excel_commercial_master`): Transcribed multi-item inventory stock with numbers and decimal prices.
3. **Banking KYC Ledger Master** (`excel_banking_kyc`): Processed 15+ banking customer accounts and IFSC codes with zero column mismatches.
4. **Board Marksheet Maestro** (`excel_board_marksheet`): Mastered high-density 11-column state board examination master sheet with ≥95% accuracy.
5. **Grandmaster Excel Registrar** (`excel_census_grandmaster`): Conquered the 22-row National Census Capstone with 100% flawless fidelity.

> **Conditional Share Behavior**: Share buttons are **disabled by default** when locked (`Locked (Complete Task)`). Once the student unlocks the trophy by passing the benchmark, the button activates, enabling instant generation of a high-resolution certificate.

---

### 4. 🎨 Eye-Care Warm Tone Theme
Designed specifically to prevent digital eye strain, retinal fatigue, and headaches during extended 2–3 hour typing lab classes:
- Eliminates harsh, cool `#ffffff` and blue glare.
- Utilizes soothing warm ivory (`#f9f6f0`), warm parchment (`#fffdf9`), soft linen (`#f2ece0`), and warm slate charcoal (`#1c1915`) typography.
- High contrast compliant (WCAG AAA) for optimal readability.

---

### 5. ⚡ Offline-First PWA & Service Worker
The system operates completely offline without an internet connection once loaded:
- **Service Worker (`sw.js`)**: Employs a Stale-While-Revalidate caching strategy for application shell assets, fonts, icons, and official logos.
- **Unobtrusive Offline Notification**:
  - If internet connectivity drops, the app displays **only a small, sleek corner pill** (`Offline Mode • Data saved locally`).
  - No disruptive modal popups, alerts, or disabled controls appear. The trainee continues data entry seamlessly.
- **Web App Manifest (`manifest.json`)**: Enables standalone desktop and mobile installation with custom application icons and quick-launch shortcuts.

---

### 6. 🔒 Data Storage & Retention Guarantee
- All student credentials, completed stages, stage drafts, Excel drafts (`icst_excel_draft_L*`), EXP progress, and audit histories are saved directly to `localStorage`.
- **Zero Premature Deletion**: Cached data is **never automatically purged** on reload, navigation, or browser restarts.
- **Clear Data Lifecycle**: Data is only wiped when the user explicitly clicks the header's red **CLEAR DATA** button and confirms the destructive confirmation modal.

---

### 7. 📸 Viral Social Media Certificate Exporter
Students and teachers can generate certified achievement graphics using an in-browser HTML5 Canvas 2D engine:
- **Formats**: 9:16 Instagram/WhatsApp Story (1080×1920) and 4:5 Feed Post (1080×1350).
- **Features**: Embedded official ICST seal stamp, student name, roll number, accuracy badge, KPH speed metric, and verified institutional signature.
- **One-Click Actions**: Download PNG, copy to clipboard, or launch WhatsApp direct share.

---

## 🛠️ Technology Stack

| Layer | Technology |
|:---|:---|
| **Frontend Framework** | React 19 + TypeScript (Strict Type Safety) |
| **Build & Dev Tool** | Vite 8 + ESNext Bundler |
| **Styling** | Pure Vanilla CSS (Curated Institutional Design Tokens, Zero Tailwind Bloat) |
| **Iconography** | Lucide React |
| **Graphics Engine** | HTML5 Canvas 2D API (High-DPI 2x/3x scale rendering) |
| **Offline Cache** | Service Worker Cache Storage API |
| **Client Storage** | HTML5 LocalStorage + JSON State Serialization |

---

## 📁 Project Structure

```
data-entry-training-system/
├── index.html                   # HTML5 Entry with complete SEO, OpenGraph, PWA tags
├── public/
│   ├── favicon.svg              # Browser Tab Icon
│   ├── logo.png                 # Official ICST Chowberia Master Logo
│   ├── logo-icst.png            # Official Crest for marked hero sections
│   ├── manifest.json            # PWA Manifest with shortcuts & metadata
│   └── sw.js                    # Offline Service Worker & precache engine
├── src/
│   ├── assets/                  # Static media and graphics
│   ├── components/
│   │   ├── common/              # Global components (Header, Footer, Modals)
│   │   │   ├── AchievementShareModal.tsx  # Canvas 2D certificate generator
│   │   │   ├── ClearDataConfirmModal.tsx  # Safe storage wipe dialog
│   │   │   ├── Header.tsx                 # Persistent navigation bar
│   │   │   ├── OfflineNotice.tsx          # Unobtrusive offline status pill
│   │   │   └── TrophyGraphic.tsx          # Custom SVG trophies (locked/unlocked)
│   │   ├── excel/               # Dedicated Excel Mass Data Entry section
│   │   │   ├── excel.css                  # Authentic Microsoft Excel styles
│   │   │   ├── ExcelDashboard.tsx         # 5 Levels & 5 Achievements selector
│   │   │   ├── ExcelEvaluationModal.tsx   # Cell-by-cell discrepancy breakdown
│   │   │   └── ExcelWorkbench.tsx         # Split-screen Excel spreadsheet engine
│   │   ├── fields/              # Form field inputs & validations
│   │   ├── landing/             # Institutional homepage
│   │   ├── practice/            # Single-form practice workbench
│   │   ├── showcase/            # Promotional social showcase
│   │   ├── student/             # Student profile & dashboard
│   │   ├── table/               # Marksheet table controls
│   │   └── teacher/             # Teacher PIN authentication & dashboard
│   ├── config/
│   │   └── appConfig.ts         # Global app thresholds & credentials
│   ├── data/
│   │   ├── excelScenariosData.ts # 5 Excel levels & 5 achievements definition
│   │   └── stagesConfig.ts      # 18 Single-form stage specifications
│   ├── services/
│   │   ├── excelStorageService.ts # Excel evaluations, drafts, and achievements sync
│   │   └── storageService.ts      # LocalStorage persistence & clear lifecycle
│   ├── types/
│   │   ├── excel.ts             # Domain models for Excel simulation
│   │   └── index.ts             # Global TypeScript interfaces
│   ├── App.tsx                  # Root router, views, and modal container
│   ├── index.css                # Eye-care warm tone design system
│   └── main.tsx                 # React DOM mount & Service Worker registration
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
└── vite.config.ts               # Vite configuration
```

---

## 💻 Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.0 or higher recommended)
- `npm` (bundled with Node.js)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/icstconnect/data-entry-training-system.git
cd data-entry-training-system
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
The application will launch on `http://localhost:5173/`.

### 3. Build for Production
```bash
npm run build
```
This compiles TypeScript (`tsc -b`) and generates optimized production assets in `dist/`.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🔑 Administrative & Teacher Mode Access

To access the Teacher Dashboard:
1. Click **TEACHER** in the top navigation header or hero section.
2. When prompted for the Administrative Password, enter the institutional PIN:
   ```
   icst2026
   ```
3. Inside Teacher Mode, instructors can:
   - Launch specific test scenarios for students.
   - Inspect granular character-level error audits.
   - Validate batch completion records and class statistics.

---

## 📜 Educational Accreditation & Contact

**Institute of Computer Science and Technology (ICST) - Chowberia**  
- **Location**: Chowberia, Nadia District, West Bengal, India  
- **Focus**: Vocational IT Training, Practical Data Processing, State Exam Accreditation  
- **Application Version**: 1.0.0 (Production Release)  
- **License**: Institutional Proprietary • All Rights Reserved (ICST Chowberia)
