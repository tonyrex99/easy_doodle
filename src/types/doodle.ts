export type DrawingTool =
  | 'pen'
  | 'brush'
  | 'highlighter'
  | 'eraser'
  | 'line'
  | 'rectangle'
  | 'circle'
  | 'arrow';

export interface Point {
  x: number;
  y: number;
}

export interface DoodlePath {
  id: string;
  points: Point[];
  svgPath: string;
  tool: DrawingTool;
  color: string;
  strokeWidth: number;
  opacity: number;
  isShape?: boolean;
}

export type GridType = 'none' | 'squares' | 'dots' | 'isometric' | 'lines';

export interface CanvasSettings {
  backgroundColor: string;
  gridType: GridType;
  gridSize: number;
  gridColor: string;
  gridOpacity: number;
}

export interface DoodleVersionSnapshot {
  id: string;
  versionNumber: number;
  label: string; // e.g. "My Doodle v2 (Nov 16, 3:30 PM)"
  timestamp: number;
  paths: DoodlePath[];
  canvasSettings: CanvasSettings;
  strokeCount: number;
  note?: string;
}

export interface DoodleProject {
  id: string;
  rootProjectId?: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  paths: DoodlePath[];
  canvasSettings: CanvasSettings;
  thumbnail?: string;
  width?: number;
  height?: number;
  version: string;
  versionNumber?: number;
  versionHistory?: DoodleVersionSnapshot[];
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ColorPreset {
  name: string;
  hex: string;
}
