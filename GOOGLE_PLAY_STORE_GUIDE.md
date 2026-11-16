# Google Play Store Submission & Compliance Guide

This guide contains everything you need to fill out the **Google Play Console** for **Easy Doodle**.

---

## 1. App Information
- **App Name:** Easy Doodle
- **Short Description (max 80 chars):** Freehand drawing, selective area screen grab, grid paper, and version history.
- **Full Description:**
  Easy Doodle is an intuitive, offline-first creative drawing studio inspired by classic MS Paint with modern vector graphics!

  Whether you are sketching diagrams, doodling ideas, taking notes on grid paper, or annotating concepts, Easy Doodle gives you fluid drawing tools with zero bloat and total privacy.

  ✨ **Key Features:**
  - ✏️ **Fluid Vector Drawing:** Smooth quadratic Bezier curves for pen, artistic brush, highlighter, eraser, and shapes (rectangles, circles, lines, arrows).
  - ✂️ **Selective Area Screen Grab:** Snip any custom region with the resizable viewfinder or freehand "Drag to Snip", then share or save to photos immediately.
  - 🌿 **Version History & Auto-Recovery:** Save milestones as date-stamped versions and restore anytime. Microsoft Word-style Auto-Recovery safeguards unsaved work if interrupted.
  - 🎨 **Classic Paint Palette & Transparent Brush:** 30 vibrant swatches, custom hex picker, and transparent brush for clean erasing and layering.
  - 📐 **Grid & Paper Styles:** Graph grid, dot grid, ruled lines, and isometric patterns, with chalkboard, vintage sepia, and blueprint backgrounds.
  - 🔍 **Smooth Pinch Zoom & Pan:** Zoom from 40% to 450% and freely move your canvas sheet with two fingers (movement takes precedence over drawing).
  - 📁 **Native .doodle Files:** Save and share lightweight vector `.doodle` files with live visual thumbnails in your project gallery.
  - 🔒 **100% Private & Offline:** No accounts, no advertising, and zero data collected.

- **Category:** Art & Design (or Tools)
- **Tags:** Drawing, Sketching, Doodle, Paint, Grid, Screen Grab, Vector, Offline

---

## 2. Store URLs (GitHub Pages)
Once GitHub Pages is enabled on `master` branch `/docs` folder:
- **Website URL:** `https://tonyrex99.github.io/easy_doodle/`
- **Privacy Policy URL (MANDATORY):** `https://tonyrex99.github.io/easy_doodle/privacy.html`
- **Terms & EULA URL:** `https://tonyrex99.github.io/easy_doodle/eula.html`
- **Contact Email:** `tonyrex99@gmail.com`

---

## 3. Data Safety Questionnaire Answers
In the **App Content -> Data Safety** section of Google Play Console:

| Question | Answer | Details / Justification |
| :--- | :--- | :--- |
| **Does your app collect or share any user data?** | **No** | Easy Doodle operates 100% locally on device. No user data is sent to external servers. |
| **Is all user data encrypted in transit?** | **Yes** | Any user-initiated system shares use native Android TLS/IPC. |
| **Do you provide a way for users to request data deletion?** | **Yes** | Users can delete all saved doodles in-app or by uninstalling. |
| **Is this app designed for families/children?** | **Yes** | Safe for all ages (PEGI 3 / Everyone). |

---

## 4. App Content Declarations
- **Privacy Policy:** Paste `https://tonyrex99.github.io/easy_doodle/privacy.html`
- **Ads:** Select **"No, my app does not contain ads"**
- **App Access:** Select **"All features are available without restrictions"** (no login needed)
- **Content Rating:** Questionnaire results in **Everyone / PEGI 3** (no violence, adult themes, or vulgarity)
- **Target Audience:** Select **All ages (e.g. 13+, 16+, 18+ or include all ages)**
- **Financial Features:** Select **"No financial features"**
- **Government Apps:** Select **"No"**

---

## 5. Store Graphics & Assets
All generated assets are ready in `assets/playstore/`:
- **App Icon:** `assets/icon.png` (1024x1024 px PNG)
- **Feature Graphic:** `assets/playstore/feature_graphic.png` (1024x500 px PNG)
- **Phone Screenshots:**
  1. `assets/playstore/screenshot_1_draw.png` (1080x1920 px)
  2. `assets/playstore/screenshot_2_crop.png` (1080x1920 px)
  3. `assets/playstore/screenshot_3_grids.png` (1080x1920 px)
  4. `assets/playstore/screenshot_4_files.png` (1080x1920 px)

---

## 6. Binary Upload
Upload the release app bundle from:
`dist-builds/easy-doodle-release.aab`
- Version Code: `1`
- Version Name: `1.0.0`
- Target SDK: `36` (Android 15+)
- Supported ABIs: `arm64-v8a`, `armeabi-v7a`, `x86`, `x86_64` (64-bit compliant)

