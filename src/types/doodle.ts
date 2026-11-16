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

export interface DoodleProject {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  paths: DoodlePath[];
  canvasSettings: CanvasSettings;
  thumbnail?: string;
  width?: number;
  height?: number;
  version: string;
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

