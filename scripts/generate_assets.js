const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const PLAYSTORE_DIR = path.join(ASSETS_DIR, 'playstore');

if (!fs.existsSync(PLAYSTORE_DIR)) {
  fs.mkdirSync(PLAYSTORE_DIR, { recursive: true });
}

// 1. App Icon SVG (1024x1024)
const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="50%" stop-color="#0369A1"/>
      <stop offset="100%" stop-color="#075985"/>
    </linearGradient>
    <linearGradient id="pencilBody" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <linearGradient id="pencilWood" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <linearGradient id="rainbowGrad" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF0055"/>
      <stop offset="25%" stop-color="#FF7F27"/>
      <stop offset="50%" stop-color="#FFF200"/>
      <stop offset="75%" stop-color="#00E676"/>
      <stop offset="100%" stop-color="#00E5FF"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
    <pattern id="gridPattern" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.12"/>
    </pattern>
  </defs>

  <!-- Background Base with subtle grid texture -->
  <rect width="1024" height="1024" rx="224" fill="url(#bgGrad)"/>
  <rect width="1024" height="1024" rx="224" fill="url(#gridPattern)"/>

  <!-- Glowing Doodle Loop -->
  <path d="M 180 720 C 180 500, 320 360, 520 360 C 720 360, 840 500, 780 680 C 720 840, 480 840, 420 700 C 370 580, 500 480, 640 480 C 760 480, 840 580, 800 680" 
        stroke="url(#rainbowGrad)" stroke-width="54" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#shadow)"/>

  <!-- Stylized Pencil / Stylus in Action -->
  <g transform="translate(680, 240) rotate(42)" filter="url(#shadow)">
    <!-- Eraser Top -->
    <rect x="-42" y="-120" width="84" height="50" rx="14" fill="#F43F5E"/>
    <!-- Metal Ferrule -->
    <rect x="-42" y="-70" width="84" height="24" fill="#CBD5E1"/>
    <line x1="-42" y1="-58" x2="42" y2="-58" stroke="#94A3B8" stroke-width="4"/>
    <!-- Pencil Body (Hexagonal facet look) -->
    <rect x="-42" y="-46" width="84" height="240" fill="url(#pencilBody)" rx="4"/>
    <rect x="-14" y="-46" width="28" height="240" fill="#FDE047"/>
    <!-- Sharpened Wood Cone -->
    <polygon points="-42,194 42,194 0,280" fill="url(#pencilWood)"/>
    <!-- Graphite / Stylus Tip -->
    <polygon points="-16,246 16,246 0,280" fill="#0F172A"/>
  </g>

  <!-- Sparkling creative stars -->
  <path d="M 280 280 Q 280 320 240 320 Q 280 320 280 360 Q 280 320 320 320 Q 280 320 280 280 Z" fill="#FDE047" opacity="0.9"/>
  <path d="M 760 780 Q 760 810 730 810 Q 760 810 760 840 Q 760 810 790 810 Q 760 810 760 780 Z" fill="#FFFFFF" opacity="0.8"/>
  <circle cx="340" cy="420" r="10" fill="#38BDF8"/>
  <circle cx="720" cy="380" r="8" fill="#F43F5E"/>
</svg>
`;

// 2. Android Adaptive Foreground (432x432)
const fgSvg = `
<svg width="432" height="432" viewBox="0 0 432 432" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rainbowFg" x1="0" y1="0" x2="432" y2="432" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF0055"/>
      <stop offset="30%" stop-color="#FF7F27"/>
      <stop offset="60%" stop-color="#FFF200"/>
      <stop offset="85%" stop-color="#00E676"/>
      <stop offset="100%" stop-color="#00E5FF"/>
    </linearGradient>
    <filter id="fgShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Doodle Ribbon -->
  <path d="M 90 280 C 90 190, 150 140, 230 140 C 310 140, 350 200, 320 270 C 290 330, 200 330, 180 270 C 160 220, 210 190, 270 190 C 320 190, 350 230, 330 270" 
        stroke="url(#rainbowFg)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#fgShadow)"/>

  <!-- Stylized Pencil -->
  <g transform="translate(290, 110) rotate(42) scale(0.44)" filter="url(#fgShadow)">
    <rect x="-42" y="-120" width="84" height="50" rx="14" fill="#F43F5E"/>
    <rect x="-42" y="-70" width="84" height="24" fill="#CBD5E1"/>
    <rect x="-42" y="-46" width="84" height="240" fill="#FBBF24" rx="4"/>
    <rect x="-14" y="-46" width="28" height="240" fill="#FDE047"/>
    <polygon points="-42,194 42,194 0,280" fill="#FDE68A"/>
    <polygon points="-16,246 16,246 0,280" fill="#0F172A"/>
  </g>
</svg>
`;

// 3. Android Adaptive Background (432x432)
const bgSvg = `
<svg width="432" height="432" viewBox="0 0 432 432" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="adaptiveBgGrad" x1="0" y1="0" x2="432" y2="432" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#0369A1"/>
    </linearGradient>
    <pattern id="gridAdaptive" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.14"/>
    </pattern>
  </defs>
  <rect width="432" height="432" fill="url(#adaptiveBgGrad)"/>
  <rect width="432" height="432" fill="url(#gridAdaptive)"/>
</svg>
`;

// 4. Android Monochrome Icon (432x432)
const monoSvg = `
<svg width="432" height="432" viewBox="0 0 432 432" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M 100 280 C 100 200, 160 150, 230 150 C 300 150, 340 200, 320 270 C 290 330, 200 330, 180 270 C 160 220, 210 190, 270 190" 
        stroke="#FFFFFF" stroke-width="26" stroke-linecap="round" fill="none"/>
  <circle cx="310" cy="140" r="28" fill="#FFFFFF"/>
</svg>
`;

function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Google Play Store Screenshots Generator (1080x1920)
function generateScreenshotSvg(options) {
  const { title, subtitle, badgeText, badgeColor, frameSvg } = options;

  const raw = `
<svg width="1080" height="1920" viewBox="0 0 1080 1920" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="posterGrad" x1="0" y1="0" x2="1080" y2="1920" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0B132B"/>
      <stop offset="40%" stop-color="#1C2541"/>
      <stop offset="100%" stop-color="#0A1128"/>
    </linearGradient>
    <filter id="phoneShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="24" stdDeviation="40" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Poster Gradient -->
  <rect width="1080" height="1920" fill="url(#posterGrad)"/>

  <!-- Subtle ambient glow circles -->
  <circle cx="200" cy="400" r="300" fill="#0284C7" opacity="0.18" filter="blur(80px)"/>
  <circle cx="880" cy="1200" r="350" fill="#38BDF8" opacity="0.12" filter="blur(90px)"/>
  <circle cx="300" cy="1600" r="250" fill="#10B981" opacity="0.12" filter="blur(80px)"/>

  <!-- Top Feature Badge -->
  <g transform="translate(100, 110)">
    <rect width="220" height="42" rx="21" fill="${badgeColor}" fill-opacity="0.2"/>
    <rect width="220" height="42" rx="21" stroke="${badgeColor}" stroke-width="2"/>
    <text x="110" y="27" fill="${badgeColor}" font-family="system-ui, -apple-system, Roboto, sans-serif" font-size="16" font-weight="800" text-anchor="middle" letter-spacing="1.5">${escapeXml(badgeText)}</text>
  </g>

  <!-- Main Headline & Subtitle -->
  <text x="100" y="230" fill="#FFFFFF" font-family="system-ui, -apple-system, Roboto, sans-serif" font-size="52" font-weight="900" letter-spacing="-0.5">${escapeXml(title)}</text>
  <text x="100" y="300" fill="#94A3B8" font-family="system-ui, -apple-system, Roboto, sans-serif" font-size="28" font-weight="500">${escapeXml(subtitle)}</text>

  <!-- Realistic Smartphone Device Frame -->
  <g transform="translate(140, 390)" filter="url(#phoneShadow)">
    <!-- Device Outer Body Bezel -->
    <rect width="800" height="1580" rx="64" fill="#020617" stroke="#334155" stroke-width="6"/>

    <!-- Screen Area (Inner Display) -->
    <g transform="translate(24, 24)">
      <clipPath id="screenClip">
        <rect width="752" height="1532" rx="44"/>
      </clipPath>

      <g clip-path="url(#screenClip)">
        <!-- Screen Content Injected -->
        ${frameSvg}
      </g>
    </g>

    <!-- Top Dynamic Island / Camera Notch -->
    <rect x="330" y="40" width="140" height="28" rx="14" fill="#000000"/>
    <circle cx="435" cy="54" r="5" fill="#1E293B"/>
  </g>
</svg>
`;

  return raw.replace(/ & /g, ' &amp; ');
}

// Frame 1: Freehand Drawing Canvas UI
const screen1Ui = `
  <rect width="752" height="1532" fill="#FFFFFF"/>
  <!-- Status Bar -->
  <text x="50" y="44" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="700">9:41</text>
  <circle cx="700" cy="38" r="6" fill="#0F172A"/>

  <!-- App Header -->
  <rect y="60" width="752" height="76" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
  <rect x="24" y="80" width="36" height="36" rx="8" fill="#0284C7"/>
  <text x="76" y="104" fill="#0F172A" font-family="sans-serif" font-size="20" font-weight="800">Space Explorer</text>

  <!-- Header Action Buttons -->
  <rect x="520" y="80" width="36" height="36" rx="8" fill="#F1F5F9"/>
  <rect x="570" y="80" width="36" height="36" rx="8" fill="#F1F5F9"/>
  <rect x="620" y="80" width="36" height="36" rx="8" fill="#F1F5F9"/>
  <rect x="670" y="80" width="46" height="36" rx="8" fill="#0284C7"/>

  <!-- Subtle Canvas Grid -->
  <g stroke="#CBD5E1" stroke-width="1" opacity="0.4">
    ${Array.from({ length: 25 }, (_, i) => `<line x1="0" y1="${136 + i * 44}" x2="752" y2="${136 + i * 44}"/>`).join('')}
    ${Array.from({ length: 18 }, (_, i) => `<line x1="${i * 44}" y1="136" x2="${i * 44}" y2="1350"/>`).join('')}
  </g>

  <!-- Artful Doodle Drawing: Cute Planet, Rocket & Stars -->
  <!-- Bright Sun/Planet -->
  <circle cx="240" cy="520" r="130" fill="#FEF08A" stroke="#EAB308" stroke-width="10"/>
  <ellipse cx="240" cy="520" rx="200" ry="46" fill="none" stroke="#F59E0B" stroke-width="14" transform="rotate(-15, 240, 520)"/>
  
  <!-- Rocket Doodle -->
  <g transform="translate(480, 420) rotate(-35)">
    <!-- Rocket exhaust fire -->
    <path d="M -20 180 Q 0 250 20 180 Z" fill="#EF4444"/>
    <path d="M -12 180 Q 0 230 12 180 Z" fill="#FBBF24"/>
    <!-- Fins -->
    <path d="M -40 160 L -60 190 L -30 180 Z" fill="#DC2626"/>
    <path d="M 40 160 L 60 190 L 30 180 Z" fill="#DC2626"/>
    <!-- Body -->
    <path d="M -36 170 L -36 70 Q 0 -20 36 70 L 36 170 Z" fill="#FFFFFF" stroke="#0284C7" stroke-width="8"/>
    <!-- Nose cone -->
    <path d="M -32 50 Q 0 -15 32 50 Z" fill="#EF4444"/>
    <!-- Porthole window -->
    <circle cx="0" cy="90" r="22" fill="#38BDF8" stroke="#0284C7" stroke-width="6"/>
  </g>

  <!-- Freehand Swirl Trails -->
  <path d="M 120 880 Q 280 720 450 900 T 680 780" stroke="#FF0055" stroke-width="14" stroke-linecap="round" fill="none"/>
  <path d="M 160 1020 Q 340 1140 540 1010 T 680 1180" stroke="#00E676" stroke-width="12" stroke-linecap="round" fill="none"/>
  
  <!-- Doodle Stars -->
  <path d="M 160 340 Q 160 360 140 360 Q 160 360 160 380 Q 160 360 180 360 Q 160 360 160 340 Z" fill="#F59E0B"/>
  <path d="M 640 280 Q 640 300 620 300 Q 640 300 640 320 Q 640 300 660 300 Q 640 300 640 280 Z" fill="#38BDF8"/>
  <path d="M 620 980 Q 620 1000 600 1000 Q 620 1000 620 1020 Q 620 1000 640 1000 Q 620 1000 620 980 Z" fill="#A855F7"/>

  <!-- Paint Color Ribbon Bottom -->
  <g transform="translate(0, 1340)">
    <rect width="752" height="192" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
    
    <!-- Quick Color Swatches -->
    <g transform="translate(24, 16)">
      ${['#000000', '#ED1C24', '#FF7F27', '#FFF200', '#22B14C', '#00A2E8', '#3F48CC', '#A349A4', '#FFAEC9', '#FFFFFF'].map((col, idx) => `
        <circle cx="${24 + idx * 64}" cy="24" r="22" fill="${col}" stroke="${col === '#ED1C24' ? '#0284C7' : '#CBD5E1'}" stroke-width="${col === '#ED1C24' ? 4 : 2}"/>
      `).join('')}
      <!-- Color Picker wheel button -->
      <circle cx="664" cy="24" r="22" fill="#E0F2FE" stroke="#38BDF8" stroke-width="2"/>
    </g>

    <!-- Bottom Tool Bar Icons -->
    <g transform="translate(24, 94)">
      <!-- Undo / Redo -->
      <rect x="0" y="0" width="46" height="46" rx="10" fill="#F8FAFC"/>
      <rect x="54" y="0" width="46" height="46" rx="10" fill="#F8FAFC"/>
      
      <!-- Divider -->
      <line x1="114" y1="6" x2="114" y2="40" stroke="#E2E8F0" stroke-width="2"/>

      <!-- Tools: Pen (Active), Brush, Highlighter, Eraser, Shapes -->
      <rect x="130" y="0" width="52" height="46" rx="12" fill="#0284C7"/>
      <rect x="190" y="0" width="52" height="46" rx="12" fill="#F1F5F9"/>
      <rect x="250" y="0" width="52" height="46" rx="12" fill="#F1F5F9"/>
      <rect x="310" y="0" width="52" height="46" rx="12" fill="#F1F5F9"/>
      <rect x="370" y="0" width="52" height="46" rx="12" fill="#F1F5F9"/>

      <!-- Stroke Size Preview -->
      <rect x="580" y="0" width="46" height="46" rx="10" fill="#F1F5F9"/>
      <circle cx="603" cy="23" r="8" fill="#0F172A"/>

      <!-- Clear Trash -->
      <rect x="644" y="0" width="46" height="46" rx="10" fill="#FEE2E2"/>
    </g>
  </g>
`;

// Frame 2: Area Screen Grab Viewfinder UI
const screen2Ui = `
  <rect width="752" height="1532" fill="#FAF7F0"/>
  <!-- Status Bar -->
  <text x="50" y="44" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="700">9:41</text>
  
  <!-- Canvas Artwork in Background -->
  <g transform="translate(80, 200)">
    <!-- Architectural / Geometry Sketch -->
    <rect x="40" y="320" width="220" height="300" fill="none" stroke="#0F172A" stroke-width="6"/>
    <polygon points="40,320 150,200 260,320" fill="none" stroke="#0F172A" stroke-width="6"/>
    <!-- Tree and garden sketch -->
    <circle cx="440" cy="420" r="90" fill="#BBF7D0" stroke="#16A34A" stroke-width="8"/>
    <rect x="425" y="510" width="30" height="120" fill="#92400E"/>
    <!-- Sun -->
    <circle cx="460" cy="180" r="60" fill="#FEF08A" stroke="#EAB308" stroke-width="6"/>
  </g>

  <!-- Darkened Overlay Mask around crop -->
  <path d="M 0 0 L 752 0 L 752 1532 L 0 1532 Z M 60 380 L 690 380 L 690 1080 L 60 1080 Z" fill="#0F172A" fill-opacity="0.68" fill-rule="evenodd"/>

  <!-- Active Viewfinder Crop Box -->
  <rect x="60" y="380" width="630" height="700" fill="#38BDF8" fill-opacity="0.08" stroke="#38BDF8" stroke-width="4" stroke-dasharray="12 8"/>

  <!-- Dimension Badge -->
  <g transform="translate(60, 334)">
    <rect width="180" height="38" rx="8" fill="#38BDF8"/>
    <text x="90" y="24" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="800" text-anchor="middle">540 × 600 px</text>
  </g>

  <!-- Viewfinder Corner Handles -->
  <circle cx="60" cy="380" r="16" fill="#38BDF8" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="690" cy="380" r="16" fill="#38BDF8" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="60" cy="1080" r="16" fill="#38BDF8" stroke="#FFFFFF" stroke-width="4"/>
  <circle cx="690" cy="1080" r="16" fill="#38BDF8" stroke="#FFFFFF" stroke-width="4"/>

  <!-- Center Move Target -->
  <circle cx="375" cy="730" r="32" fill="#0F172A" fill-opacity="0.75"/>
  <path d="M 375 714 L 375 746 M 359 730 L 391 730" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>

  <!-- Top Selection Presets Pill Bar -->
  <g transform="translate(80, 90)">
    <rect width="592" height="60" rx="16" fill="#0F172A" fill-opacity="0.95"/>
    <text x="30" y="36" fill="#F8FAFC" font-family="sans-serif" font-size="17" font-weight="800">Select Area</text>
    <!-- Preset buttons -->
    <rect x="250" y="10" width="96" height="40" rx="10" fill="#334155"/>
    <text x="298" y="35" fill="#E2E8F0" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle">1:1 Square</text>

    <rect x="360" y="10" width="96" height="40" rx="10" fill="#334155"/>
    <text x="408" y="35" fill="#E2E8F0" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle">16:9</text>

    <rect x="470" y="10" width="96" height="40" rx="10" fill="#0284C7"/>
    <text x="518" y="35" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle">Custom</text>
  </g>

  <!-- Bottom Area Grab Actions -->
  <g transform="translate(60, 1370)">
    <rect x="0" y="0" width="180" height="68" rx="18" fill="#475569"/>
    <text x="90" y="42" fill="#FFFFFF" font-family="sans-serif" font-size="18" font-weight="700" text-anchor="middle">Cancel</text>

    <rect x="200" y="0" width="200" height="68" rx="18" fill="#0284C7"/>
    <text x="300" y="42" fill="#FFFFFF" font-family="sans-serif" font-size="18" font-weight="700" text-anchor="middle">Save Crop</text>

    <rect x="420" y="0" width="210" height="68" rx="18" fill="#10B981"/>
    <text x="525" y="42" fill="#FFFFFF" font-family="sans-serif" font-size="18" font-weight="800" text-anchor="middle">Share Area</text>
  </g>
`;

// Frame 3: Custom Grids & Paper Styles UI
const screen3Ui = `
  <rect width="752" height="1532" fill="#FFFFFF"/>
  <text x="50" y="44" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="700">9:41</text>

  <!-- 4 Split Showcase Panels of different Grids -->
  <!-- Quadrant 1: Math Graph Paper (Square Grid) -->
  <g transform="translate(36, 100)">
    <rect width="324" height="420" rx="20" fill="#FFFFFF" stroke="#0284C7" stroke-width="4"/>
    <g stroke="#93C5FD" stroke-width="1.2" opacity="0.6">
      ${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 30}" x2="324" y2="${i * 30}"/>`).join('')}
      ${Array.from({ length: 11 }, (_, i) => `<line x1="${i * 30}" y1="0" x2="${i * 30}" y2="420"/>`).join('')}
    </g>
    <!-- Sine Wave Doodle -->
    <path d="M 20 210 Q 95 90 162 210 T 304 210" stroke="#2563EB" stroke-width="6" fill="none"/>
    <rect x="20" y="360" width="130" height="36" rx="8" fill="#0284C7"/>
    <text x="85" y="384" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="800" text-anchor="middle">Graph Paper</text>
  </g>

  <!-- Quadrant 2: Bullet Journal Dot Grid -->
  <g transform="translate(392, 100)">
    <rect width="324" height="420" rx="20" fill="#FAF7F0" stroke="#CBD5E1" stroke-width="2"/>
    <g fill="#94A3B8" opacity="0.8">
      ${Array.from({ length: 12 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => `<circle cx="${28 + c * 34}" cy="${28 + r * 34}" r="2.5"/>`).join('')
      ).join('')}
    </g>
    <!-- Geometric doodle -->
    <polygon points="162,100 240,240 84,240" stroke="#F59E0B" stroke-width="6" fill="none"/>
    <rect x="20" y="360" width="130" height="36" rx="8" fill="#D97706"/>
    <text x="85" y="384" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="800" text-anchor="middle">Dot Grid</text>
  </g>

  <!-- Quadrant 3: Ruled Lined Notebook -->
  <g transform="translate(36, 560)">
    <rect width="324" height="420" rx="20" fill="#F0FDF4" stroke="#CBD5E1" stroke-width="2"/>
    <line x1="60" y1="0" x2="60" y2="420" stroke="#FCA5A5" stroke-width="2"/>
    <g stroke="#86EFAC" stroke-width="1.5">
      ${Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${35 + i * 35}" x2="324" y2="${35 + i * 35}"/>`).join('')}
    </g>
    <!-- Handwriting doodle -->
    <text x="80" y="100" fill="#15803D" font-family="cursive, sans-serif" font-size="24">Ideas & Notes</text>
    <rect x="20" y="360" width="130" height="36" rx="8" fill="#16A34A"/>
    <text x="85" y="384" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="800" text-anchor="middle">Ruled Paper</text>
  </g>

  <!-- Quadrant 4: Chalkboard Dark Mode -->
  <g transform="translate(392, 560)">
    <rect width="324" height="420" rx="20" fill="#1E293B" stroke="#475569" stroke-width="2"/>
    <g stroke="#64748B" stroke-width="1" opacity="0.4">
      ${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 30}" x2="324" y2="${i * 30}"/>`).join('')}
      ${Array.from({ length: 11 }, (_, i) => `<line x1="${i * 30}" y1="0" x2="${i * 30}" y2="420"/>`).join('')}
    </g>
    <!-- Chalk doodle neon -->
    <circle cx="162" cy="200" r="70" stroke="#38BDF8" stroke-width="6" fill="none"/>
    <rect x="20" y="360" width="130" height="36" rx="8" fill="#38BDF8"/>
    <text x="85" y="384" fill="#0F172A" font-family="sans-serif" font-size="14" font-weight="800" text-anchor="middle">Chalkboard</text>
  </g>

  <!-- Bottom Selection Sheet Preview -->
  <g transform="translate(36, 1020)">
    <rect width="680" height="460" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <text x="40" y="60" fill="#0F172A" font-family="sans-serif" font-size="22" font-weight="800">Canvas & Grid Settings</text>
    
    <!-- 5 Grid Style Chips -->
    <g transform="translate(40, 100)">
      <rect x="0" y="0" width="110" height="70" rx="14" fill="#E0F2FE" stroke="#0284C7" stroke-width="3"/>
      <text x="55" y="44" fill="#0284C7" font-family="sans-serif" font-size="15" font-weight="700" text-anchor="middle">Squares</text>

      <rect x="125" y="0" width="110" height="70" rx="14" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
      <text x="180" y="44" fill="#475569" font-family="sans-serif" font-size="15" font-weight="700" text-anchor="middle">Dots</text>

      <rect x="250" y="0" width="110" height="70" rx="14" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
      <text x="305" y="44" fill="#475569" font-family="sans-serif" font-size="15" font-weight="700" text-anchor="middle">Lines</text>

      <rect x="375" y="0" width="110" height="70" rx="14" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
      <text x="430" y="44" fill="#475569" font-family="sans-serif" font-size="15" font-weight="700" text-anchor="middle">Isometric</text>

      <rect x="500" y="0" width="90" height="70" rx="14" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
      <text x="545" y="44" fill="#475569" font-family="sans-serif" font-size="15" font-weight="700" text-anchor="middle">Blank</text>
    </g>

    <!-- Background Swatches -->
    <text x="40" y="220" fill="#475569" font-family="sans-serif" font-size="16" font-weight="700">Paper Backgrounds</text>
    <g transform="translate(40, 240)">
      ${['#FFFFFF', '#FAF7F0', '#F1F5F9', '#1E293B', '#0F172A', '#F0FDF4'].map((bg, idx) => `
        <rect x="${idx * 102}" y="0" width="86" height="56" rx="12" fill="${bg}" stroke="#CBD5E1" stroke-width="2"/>
      `).join('')}
    </g>

    <rect x="40" y="350" width="600" height="64" rx="16" fill="#0F172A"/>
    <text x="340" y="390" fill="#FFFFFF" font-family="sans-serif" font-size="18" font-weight="700" text-anchor="middle">Apply Grid Settings</text>
  </g>
`;

// Frame 4: Save & Open .doodle Files UI
const screen4Ui = `
  <rect width="752" height="1532" fill="#FFFFFF"/>
  <text x="50" y="44" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="700">9:41</text>

  <!-- Modal Header -->
  <g transform="translate(36, 90)">
    <text x="0" y="40" fill="#0F172A" font-family="sans-serif" font-size="30" font-weight="900">My Doodles & Files</text>
    
    <!-- Action Buttons: Import & New -->
    <g transform="translate(0, 70)">
      <rect width="324" height="60" rx="16" fill="#E0F2FE"/>
      <text x="162" y="37" fill="#0284C7" font-family="sans-serif" font-size="16" font-weight="800" text-anchor="middle">Open .doodle File</text>

      <rect x="346" y="0" width="334" height="60" rx="16" fill="#0F172A"/>
      <text x="513" y="37" fill="#FFFFFF" font-family="sans-serif" font-size="16" font-weight="800" text-anchor="middle">+ New Canvas</text>
    </g>

    <!-- Saved Projects List -->
    <g transform="translate(0, 170)">
      ${[
        { title: 'Cyberpunk Character Concept', time: 'Today, 10:45 AM', strokes: 142, grid: 'Graph', col: '#1E293B' },
        { title: 'Living Room Architecture Plan', time: 'Yesterday, 4:20 PM', strokes: 86, grid: 'Squares', col: '#FAF7F0' },
        { title: 'Cartoon Cat & Dog Sketch', time: 'Nov 14, 2:15 PM', strokes: 210, grid: 'Blank', col: '#FFFFFF' },
        { title: 'Brainstorm Mind Map', time: 'Nov 12, 11:30 AM', strokes: 64, grid: 'Dots', col: '#F0FDF4' },
        { title: 'Isometric Game Tile', time: 'Nov 09, 8:00 PM', strokes: 119, grid: 'Isometric', col: '#0F172A' },
      ].map((p, idx) => `
        <g transform="translate(0, ${idx * 160})">
          <rect width="680" height="136" rx="20" fill="#F8FAFC" stroke="${idx === 0 ? '#0284C7' : '#E2E8F0'}" stroke-width="${idx === 0 ? 3 : 1.5}"/>
          <!-- Thumbnail box -->
          <rect x="18" y="18" width="100" height="100" rx="14" fill="${p.col}" stroke="#CBD5E1" stroke-width="1.5"/>
          <circle cx="68" cy="68" r="24" fill="#0284C7" opacity="0.4"/>
          
          <!-- Title & Meta -->
          <text x="140" y="52" fill="#0F172A" font-family="sans-serif" font-size="20" font-weight="800">${p.title}</text>
          <text x="140" y="86" fill="#64748B" font-family="sans-serif" font-size="14">${p.time} • ${p.strokes} strokes • ${p.grid}</text>
          
          ${idx === 0 ? `
            <rect x="140" y="98" width="80" height="22" rx="6" fill="#E0F2FE"/>
            <text x="180" y="114" fill="#0284C7" font-family="sans-serif" font-size="11" font-weight="800" text-anchor="middle">ACTIVE</text>
          ` : ''}

          <!-- Quick Actions: Share, Duplicate, Trash -->
          <circle cx="530" cy="68" r="22" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
          <circle cx="584" cy="68" r="22" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
          <circle cx="638" cy="68" r="22" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
        </g>
      `).join('')}
    </g>
  </g>
`;

// 5. Google Play Store Feature Graphic (1024x500)
const featureGraphicSvg = `
<svg width="1024" height="500" viewBox="0 0 1024 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="featGrad" x1="0" y1="0" x2="1024" y2="500" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="60%" stop-color="#0369A1"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <pattern id="featGrid" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.12"/>
    </pattern>
    <linearGradient id="featRainbow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FF0055"/>
      <stop offset="35%" stop-color="#FF7F27"/>
      <stop offset="60%" stop-color="#FFD600"/>
      <stop offset="85%" stop-color="#00E676"/>
      <stop offset="100%" stop-color="#00E5FF"/>
    </linearGradient>
  </defs>

  <rect width="1024" height="500" fill="url(#featGrad)"/>
  <rect width="1024" height="500" fill="url(#featGrid)"/>

  <!-- Left Text Info -->
  <g transform="translate(80, 110)">
    <!-- Badge -->
    <rect width="210" height="36" rx="18" fill="#FFFFFF" fill-opacity="0.2"/>
    <text x="105" y="24" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="800" text-anchor="middle" letter-spacing="1.5">FREEHAND &amp; PAINT</text>

    <!-- Main Title -->
    <text x="0" y="100" fill="#FFFFFF" font-family="sans-serif" font-size="64" font-weight="900" letter-spacing="-1">Easy Doodle</text>
    
    <!-- Subtitle -->
    <text x="0" y="155" fill="#BAE6FD" font-family="sans-serif" font-size="22" font-weight="500">Draw, Grid Styles, Area Crop &amp; Share Files</text>

    <!-- Feature Pills -->
    <g transform="translate(0, 195)">
      <rect x="0" y="0" width="130" height="40" rx="10" fill="#0284C7" stroke="#38BDF8" stroke-width="2"/>
      <text x="65" y="25" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle">Freehand</text>

      <rect x="142" y="0" width="150" height="40" rx="10" fill="#0284C7" stroke="#38BDF8" stroke-width="2"/>
      <text x="217" y="25" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle">Custom Grids</text>

      <rect x="304" y="0" width="140" height="40" rx="10" fill="#0284C7" stroke="#38BDF8" stroke-width="2"/>
      <text x="374" y="25" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle">Area Grab</text>
    </g>
  </g>

  <!-- Right Side Stylized Ribbon Loop & Giant Pencil -->
  <path d="M 620 400 C 600 240, 700 120, 840 140 C 960 160, 990 320, 880 400 C 780 470, 720 380, 760 280 C 800 180, 920 180, 960 260" 
        stroke="url(#featRainbow)" stroke-width="36" stroke-linecap="round" fill="none"/>

  <!-- Pencil / Stylus -->
  <g transform="translate(860, 120) rotate(35) scale(0.75)">
    <rect x="-42" y="-120" width="84" height="50" rx="14" fill="#F43F5E"/>
    <rect x="-42" y="-70" width="84" height="24" fill="#CBD5E1"/>
    <rect x="-42" y="-46" width="84" height="240" fill="#FBBF24" rx="4"/>
    <rect x="-14" y="-46" width="28" height="240" fill="#FDE047"/>
    <polygon points="-42,194 42,194 0,280" fill="#FDE68A"/>
    <polygon points="-16,246 16,246 0,280" fill="#0F172A"/>
  </g>
</svg>
`;

async function run() {
  console.log('Generating App Icons and Google Play Store assets...');

  // 1. App Icon
  await sharp(Buffer.from(iconSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS_DIR, 'icon.png'));
  console.log('✓ Created assets/icon.png (1024x1024)');

  // 2. Android Adaptive Foreground
  await sharp(Buffer.from(fgSvg))
    .resize(432, 432)
    .png()
    .toFile(path.join(ASSETS_DIR, 'android-icon-foreground.png'));
  console.log('✓ Created assets/android-icon-foreground.png (432x432)');

  // 3. Android Adaptive Background
  await sharp(Buffer.from(bgSvg))
    .resize(432, 432)
    .png()
    .toFile(path.join(ASSETS_DIR, 'android-icon-background.png'));
  console.log('✓ Created assets/android-icon-background.png (432x432)');

  // 4. Android Monochrome Icon
  await sharp(Buffer.from(monoSvg))
    .resize(432, 432)
    .png()
    .toFile(path.join(ASSETS_DIR, 'android-icon-monochrome.png'));
  console.log('✓ Created assets/android-icon-monochrome.png (432x432)');

  // 5. Splash Icon
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(ASSETS_DIR, 'splash-icon.png'));
  console.log('✓ Created assets/splash-icon.png (512x512)');

  // 6. Screenshot 1: Freehand Drawing & Paint Tools
  const s1Svg = generateScreenshotSvg({
    badgeText: 'FREEHAND CANVAS',
    badgeColor: '#38BDF8',
    title: 'Draw & Paint Freely',
    subtitle: 'Smooth brushes, pencil, highlighter & Paint color ribbon',
    frameSvg: screen1Ui,
  });
  await sharp(Buffer.from(s1Svg))
    .resize(1080, 1920)
    .png()
    .toFile(path.join(PLAYSTORE_DIR, 'screenshot_1_draw.png'));
  console.log('✓ Created assets/playstore/screenshot_1_draw.png (1080x1920)');

  // 7. Screenshot 2: Screen Grab & Area Crop
  const s2Svg = generateScreenshotSvg({
    badgeText: 'AREA SCREEN GRAB',
    badgeColor: '#10B981',
    title: 'Crop & Grab Any Area',
    subtitle: 'Select any part of your drawing and share in 1 tap',
    frameSvg: screen2Ui,
  });
  await sharp(Buffer.from(s2Svg))
    .resize(1080, 1920)
    .png()
    .toFile(path.join(PLAYSTORE_DIR, 'screenshot_2_crop.png'));
  console.log('✓ Created assets/playstore/screenshot_2_crop.png (1080x1920)');

  // 8. Screenshot 3: Custom Grids & Paper Styles
  const s3Svg = generateScreenshotSvg({
    badgeText: 'CANVAS GRIDS',
    badgeColor: '#F59E0B',
    title: 'Custom Grids & Paper',
    subtitle: 'Graph paper, dot grids, notebook lines & dark chalkboard',
    frameSvg: screen3Ui,
  });
  await sharp(Buffer.from(s3Svg))
    .resize(1080, 1920)
    .png()
    .toFile(path.join(PLAYSTORE_DIR, 'screenshot_3_grids.png'));
  console.log('✓ Created assets/playstore/screenshot_3_grids.png (1080x1920)');

  // 9. Screenshot 4: Save & Open .doodle Files
  const s4Svg = generateScreenshotSvg({
    badgeText: 'PROJECT FILES',
    badgeColor: '#A855F7',
    title: 'Save & Open .doodle Files',
    subtitle: 'Store your vector projects locally and share files with ease',
    frameSvg: screen4Ui,
  });
  await sharp(Buffer.from(s4Svg))
    .resize(1080, 1920)
    .png()
    .toFile(path.join(PLAYSTORE_DIR, 'screenshot_4_files.png'));
  console.log('✓ Created assets/playstore/screenshot_4_files.png (1080x1920)');

  // 10. Google Play Store Feature Graphic (1024x500)
  await sharp(Buffer.from(featureGraphicSvg))
    .resize(1024, 500)
    .png()
    .toFile(path.join(PLAYSTORE_DIR, 'feature_graphic.png'));
  console.log('✓ Created assets/playstore/feature_graphic.png (1024x500)');

  console.log('\nAll App Icons and Google Play Store Screenshots generated successfully!');
}

run().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
