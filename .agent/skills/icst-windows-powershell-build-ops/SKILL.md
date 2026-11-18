---
name: icst-windows-powershell-build-ops
description: >-
  Use when running shell commands, recursive code searches, image/SVG processing,
  or production build verification on this Windows PowerShell 5.1 workspace
  for ICST LAB.
---

# ICST LAB Windows PowerShell & Build Verification Ops

Environment-specific patterns learned while operating in `e:\Project\data-entry-training-system` on Windows PowerShell 5.1.

## 1. PowerShell 5.1 Command Conventions

- **No `&&` Chaining**: Windows PowerShell 5.1 rejects `&&`. Chain commands with `;` or `; if ($LASTEXITCODE -eq 0) { ... }`.
- **Recursive Text Search**: `Select-String -Path "src\**\*"` does not recurse reliably in PS 5.1. Always pipe from `Get-ChildItem -Recurse`:
  ```powershell
  Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx,*.css | Select-String -Pattern "your-pattern"
  ```
- **Avoid Complex Inline `node -e` Escaping**: For multi-line scripts or regexes with quotes, write a temporary `.mjs` script or use native PowerShell cmdlets instead of fighting quote escaping in `node -e`.

## 2. Image & SVG Asset Utilities on Windows

- **PNG Cropping / Resizing via .NET**: Always load `System.Drawing` before referencing bitmap classes:
  ```powershell
  Add-Type -AssemblyName System.Drawing
  ```
- **Strict XML Validation for Generated SVGs**:
  ```powershell
  $files = Get-ChildItem public\cursors -Recurse -Filter *.svg
  $bad = @()
  foreach ($f in $files) {
    try { [void]([xml](Get-Content $f.FullName -Raw)) } catch { $bad += $f.FullName }
  }
  Write-Output ("SVGs: {0} | InvalidXML: {1}" -f $files.Count, $bad.Count)
  ```

## 3. Mandatory Build & Output Audit Gate

Always run before concluding any code or asset change:
1. Run `npm run build` (executes `tsc -b && vite build`).
2. Resolve every strict TypeScript 6 diagnostic (`noImplicitAny`, `TS18048` possibly-undefined callback params, unused imports/vars).
3. Audit `dist/` for expected static assets (`logo.png`, `icstconnect-logo.png`, `favicon.png`, `favicon-32x32.png`, `sitemap.xml`, `robots.txt`, `sw.js`, `cursors/**/*.svg`) and confirm unwanted default placeholders (such as `favicon.svg`) are absent.
4. Note: Local Chrome remote debugging (`DevToolsActivePort`) may not be enabled on this machine; when browser attachment is unavailable, rely on strict TS build, XML/asset checks, and static inspection rather than retrying browser connection loops.
