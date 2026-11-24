# FINTRACE — Standalone UI/UX Package (HTML / CSS / JS)

This zip package contains the complete UI/UX interface for the **FINTRACE Unified Financial-Cyber Intelligence Platform**.

## Package Structure:

1. `index.html`, `assets/`:
   - Standalone compiled HTML, CSS, and JavaScript bundle.
   - Fully optimized and self-contained (total size under 3 MB, vastly below the 222 MB threshold).
   - Uses relative asset paths (`./assets/...`) so it runs anywhere without configuration.

2. `start_preview.bat` (Windows) & `start_preview.sh` (Mac/Linux):
   - Double-click to instantly launch and preview the UI in your browser at `http://localhost:3000`.

3. `standalone_html_css_js/`:
   - Dedicated distribution directory with compiled HTML, CSS, and JS ready for instant deployment to any static host (Netlify, Vercel, AWS S3, Cloudflare Pages, GitHub Pages, Apache, Nginx).

4. `source_code/`:
   - Complete unminified UI/UX React components, TypeScript files, Tailwind CSS configs, and module architecture.

## How to Run:
- **Option 1 (Instant)**: Double-click `start_preview.bat` on Windows.
- **Option 2 (Python)**: In terminal, run: `python -m http.server 3000`
- **Option 3 (Node)**: In terminal, run: `npx serve -l 3000 .`
- **Option 4 (Direct Browser)**: Double-click `index.html` to open directly in Google Chrome, Microsoft Edge, or Firefox.

## Features Included in this UI Package:
- Clean simple white Login Page with 1-Click Demo Access
- 12-Language Multilingual Switcher (English, Hindi, Tamil, Telugu, Bengali, etc.)
- 12 Dashboard Intelligence Cards with Real-Engine Integrations:
  - Total Transactions, Suspicious Activities, Critical Accounts, Resolved Cases
  - Pre-Attack Transaction Detection
  - Agentic AI Control Centre
  - KYC Intelligence
  - Mule Account Detection
  - Money Trail Analysis
  - Live Google Maps with Real Leaflet Map
  - Digital Twin Simulation
  - AI Risk Intelligence & SHAP Explainability
  - Account Risk Classification
  - Recent Alerts Queue
  - Automated Response Management SOAR
- All 19 navigation module interfaces
