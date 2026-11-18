---
name: icst-typing-labs-architecture
description: >-
  Use when modifying or extending ICST LAB's Touch Typing Lab or Word Express
  Delivery Lab, including fullscreen enforcement, typing toughness/cookies, the
  16-vehicle delivery queue, post-stage analytics, bilingual English/Bengali guides,
  or mobile physical keyboard notices.
---

# ICST LAB Typing Labs Architecture

ICST LAB hosts two complementary 25-stage typing labs sharing fullscreen, bilingual guidance, and physical-keyboard UX patterns.

## 1. Shared Typing Lab Guardrails

- **Mandatory Fullscreen Mode**: Both `TouchTypingWorkbench.tsx` and `WordExpressWorkbench.tsx` enforce fullscreen via `useFullscreen` and `FullscreenRequiredGate.tsx` so trainees focus without browser distractions.
- **Mobile & Tablet Physical Keyboard Notice**: Render `src/components/common/PhysicalKeyboardNotice.tsx` (powered by `mobileKeyboardDetect.ts` + `physicalKeyboardNotice.css`):
  - Auto-detects touch/mobile/tablet devices.
  - Shows an `animejs` v4 animated SVG guide (OTG cable plug + signal pulse + Bluetooth waves + home-row ripple) in both **English + সহজ বাংলা**, with live physical keypress confirmation.
  - Inline banner on dashboards; dismissible entry modal on workbenches.
- **Global Clear Data Integration**: Any cookie or `localStorage` state added to either typing lab MUST be cleared inside `clearAllPracticeData()` in `src/services/storageService.ts` when the user clicks **Clear Data**.

## 2. Touch Typing Lab (`#typing`)

- **Key Files**: `TypingDashboard.tsx`, `TouchTypingWorkbench.tsx`, `HandSetupGuide.tsx`, `src/data/touchTypingLevels.ts`, `touchTypingStorageService.ts`.
- **Pedagogy & Toughness**: Keep the 25 levels balanced at **50% learning / 50% challenge** (accessible WPM/accuracy targets so beginners progress confidently while later stages remain challenging).
- **Visual Guidance**:
  - Always display a persistent **Practicing Keys** top strip showing the active level's target keys throughout the session.
  - Display the pre-start `HandSetupGuide.tsx` finger-placement overlay before the first keystroke.
  - Preserve Light/Dark theme switching (`icst_typing_theme`).

## 3. Word Express Delivery Lab (`#word-express`)

- **Key Files**: `WordExpressDashboard.tsx`, `WordExpressWorkbench.tsx`, `WordExpressReportView.tsx`, `LabGuideAssistant.tsx`, `wordExpressStorageService.ts`, `wordExpress.css`.
- **25 Word Stages & Cookie-Backed Toughness**:
  - Supports user-selectable `Easy` / `Moderate` / `Hard` difficulty persisted in cookies (`wordExpressStorageService.ts`) and cleared on Clear Data.
- **16-Vehicle Streak Courier Fleet** (lowest to highest streak):
  1. Human -> 2. Bicycle -> 3. Motorcycle -> 4. 4-Wheeler Car -> 5. Small F1 Car -> 6. F1 Car -> 7. Small Airplane -> 8. Medium Airplane -> 9. Big Airplane -> 10. Fighter Plane -> 11. Supersonic Fighter Plane -> 12. Rocket -> 13. Spaceship -> 14. UFO 1 -> 15. UFO 2 -> 16. UFO 3.
- **Delivery Queue & Error Physics**:
  - New words enter smoothly from the **left**, lock dead-center above the virtual hand keyboard until typed completely, and exit smoothly to the **right** via `animejs` v4.
  - **Streak Continuation**: Maintain the courier streak seamlessly when crossing stages.
  - **Wrong Key Behavior**: Do **NOT** trigger a new vehicle/fleet reload animation on a typo. Keep the current courier centered, trigger a visual vibration feedback, and downgrade the *next* queued fleet vehicle by 1 tier with smooth animation.
- **Post-Stage Report & Bilingual Guide**:
  - `WordExpressReportView.tsx`: Interactive animated summary with gauges, charts, per-finger precision heatmap, and tricky words breakdown.
  - `LabGuideAssistant.tsx`: Non-blocking floating English / **সহজ বাংলা** helper that never obstructs typing, visuals, or controls.

## 4. Verification

- Run `npm run build` (`tsc -b && vite build`).
- Verify Clear Data wipes all new cookies/`localStorage` keys and that GIGW High Contrast mode preserves legibility across modals and banners.
