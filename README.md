# Easy Doodle 🎨

A lightweight, feature-packed freehand drawing and doodling mobile application built with **React Native** and **Expo**.

---

## ✨ Features

- 🖌️ **Freehand Drawing Engine**:
  - Smooth vector stroke rendering using quadratic Bezier curve interpolation.
  - Natural tools: **Pen**, **Artistic Brush**, **Highlighter** (translucent), **Eraser**, and geometric shapes (**Line**, **Rectangle**, **Circle/Ellipse**, **Arrow**).
  - Stroke width adjustment with presets (`Fine`, `Medium`, `Bold`, `Chunky`, `Extra`) and live stroke cursor.
- 🎨 **MS Paint-Style Color Palette**:
  - Classic MS Paint top & bottom swatch rows.
  - Quick-switch color ribbon directly above the toolbar.
  - Custom HEX color input with validation.
  - Recent colors history.
- 📐 **Custom Grids & Paper Styles**:
  - Grid types: **Blank**, **Graph / Square Grid**, **Dot Grid (Bullet journal)**, **Ruled Lines (Notebook)**, and **Isometric Grid**.
  - Customizable grid spacing (`Dense`, `Normal`, `Spacious`) and visibility opacity (`Faint`, `Medium`, `Bold`).
  - Paper backgrounds: Pure White, Paper Cream, Soft Gray, Vintage Sepia, Mint Notebook, and Dark Chalkboard/Midnight.
- ✂️ **Area Screen Grab & Share**:
  - Interactive, resizable viewfinder overlay to crop and capture any custom section of the canvas.
  - Quick aspect ratios (`1:1 Square`, `16:9`, `Full`).
  - Instant **Share Area** or direct **Save to Camera Roll**.
- 💾 **Doodle Projects & Files (`.doodle`)**:
  - Save multiple doodle projects locally.
  - **Version History & Milestone Snapshots**: Save as new versions with auto-suggested smart labels incorporating current date/time (e.g. `My Doodle v2 (Nov 16, 3:30 PM)`). Revert or restore previous versions anytime without losing work.
  - Built-in **Doodle Gallery** to open, duplicate, rename, or delete doodles.
  - Export & share `.doodle` vector project files so other devices/users can open and continue editing.
  - Open & import external `.doodle` files via the native system document picker.
- 📱 **Google Play Store Ready**:
  - Custom app icon (1024x1024) and adaptive icons (foreground, background, monochrome).
  - 4 high-resolution Play Store promotional screenshot mockups (1080x1920) in `assets/playstore/`.
  - Google Play Store Feature Graphic (1024x500).

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the App
```bash
npx expo start
```
- Press `a` to run on an Android emulator or connected device.
- Scan the QR code with the Expo Go app.

### 3. Regenerate Play Store Icons & Screenshots
```bash
npm run generate-assets
```

---

## 📁 File Structure
- `App.tsx`: Main application screen and coordinator.
- `src/components/Canvas.tsx`: SVG vector drawing canvas, background grids, touch event handlers.
- `src/components/CropAreaOverlay.tsx`: Interactive viewfinder overlay for selective screen grabs.
- `src/components/ToolBar.tsx`: MS Paint-style tool switcher, brush sizes, and color ribbon.
- `src/components/ColorPickerModal.tsx`: Complete paint swatch picker with custom hex and recent history.
- `src/components/GridSelectorModal.tsx`: Grid patterns, density, and paper textures.
- `src/components/DoodleGalleryModal.tsx`: Project manager and `.doodle` file importer.
- `src/components/ShareModal.tsx`: Export options (PNG, crop, project file).
- `src/utils/fileSystem.ts`: Project storage and `.doodle` file import/export.
- `src/utils/cropCapture.ts`: Snapshot capture and area crop engine.
- `assets/playstore/`: Google Play Store screenshot mockups and feature graphic.

