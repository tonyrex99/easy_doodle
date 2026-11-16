export const PAINT_PALETTE = [
  // Row 1: Classic MS Paint Primary / Dark
  '#000000', // Black
  '#7F7F7F', // Gray
  '#880015', // Dark Red
  '#ED1C24', // Red
  '#FF7F27', // Orange
  '#FFF200', // Yellow
  '#22B14C', // Green
  '#00A2E8', // Light Blue
  '#3F48CC', // Indigo
  '#A349A4', // Purple

  // Row 2: Bright & Pastel / Light
  '#FFFFFF', // White
  '#C3C3C3', // Light Gray
  '#B97A57', // Brown
  '#FFAEC9', // Pink
  '#FFC90E', // Gold
  '#EFE4B0', // Light Yellow
  '#B5E61D', // Lime
  '#99D9EA', // Sky Blue
  '#7092BE', // Slate Blue
  '#C8BFE7', // Lavender

  // Row 3: Modern Neon & Vibrant
  '#FF0055', // Neon Pink
  '#FF5E00', // Neon Orange
  '#FFD600', // Bright Amber
  '#00E676', // Emerald Neon
  '#00E5FF', // Cyan Neon
  '#2979FF', // Electric Blue
  '#651FFF', // Deep Violet
  '#F50057', // Rose Red
  '#4E342E', // Deep Brown
  '#263238', // Charcoal
];

export const CANVAS_BACKGROUND_PRESETS = [
  { name: 'Pure White', hex: '#FFFFFF', dark: false },
  { name: 'Paper Cream', hex: '#FAF7F0', dark: false },
  { name: 'Soft Gray', hex: '#F1F5F9', dark: false },
  { name: 'Vintage Sepia', hex: '#F5EBE0', dark: false },
  { name: 'Chalkboard Dark', hex: '#1E293B', dark: true },
  { name: 'Midnight Charcoal', hex: '#121214', dark: true },
  { name: 'Blueprint Navy', hex: '#0F172A', dark: true },
  { name: 'Mint Notebook', hex: '#F0FDF4', dark: false },
];

export const STROKE_WIDTH_PRESETS = [
  { label: 'Fine', value: 2 },
  { label: 'Medium', value: 5 },
  { label: 'Bold', value: 12 },
  { label: 'Chunky', value: 24 },
  { label: 'Extra', value: 40 },
];

export const DEFAULT_CANVAS_SETTINGS = {
  backgroundColor: '#FFFFFF',
  gridType: 'squares' as const,
  gridSize: 28,
  gridColor: '#CBD5E1',
  gridOpacity: 0.6,
};

