import React, { useRef, useState, useMemo, forwardRef } from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  LayoutChangeEvent,
} from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Line,
  Pattern,
  Defs,
  G,
} from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import {
  DoodlePath,
  DrawingTool,
  CanvasSettings,
  Point,
} from '../types/doodle';
import { pointsToSmoothSvgPath, shapeToSvgPath } from '../utils/svgPath';

interface CanvasProps {
  paths: DoodlePath[];
  onAddPath: (path: DoodlePath) => void;
  activeTool: DrawingTool;
  activeColor: string;
  strokeWidth: number;
  canvasSettings: CanvasSettings;
  isCropModeActive?: boolean;
}

export interface CanvasHandle {
  viewShotRef: React.RefObject<any>;
  dimensions: { width: number; height: number };
}

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(function Canvas(
  {
    paths,
    onAddPath,
    activeTool,
    activeColor,
    strokeWidth,
    canvasSettings,
    isCropModeActive = false,
  },
  ref
) {
  const viewShotRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 360, height: 600 });
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [shapeStart, setShapeStart] = useState<Point | null>(null);
  const [shapeCurrent, setShapeCurrent] = useState<Point | null>(null);

  // Expose ref handle for capturing snapshots
  React.useImperativeHandle(ref, () => ({
    viewShotRef,
    dimensions,
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setDimensions({ width, height });
    }
  };

  const isShapeTool = useMemo(() => {
    return ['line', 'rectangle', 'circle', 'arrow'].includes(activeTool);
  }, [activeTool]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !isCropModeActive,
        onMoveShouldSetPanResponder: () => !isCropModeActive,

        onPanResponderGrant: (
          evt: GestureResponderEvent,
          _gestureState: PanResponderGestureState
        ) => {
          if (isCropModeActive) return;
          const { locationX, locationY } = evt.nativeEvent;
          const point: Point = { x: locationX, y: locationY };

          if (isShapeTool) {
            setShapeStart(point);
            setShapeCurrent(point);
          } else {
            setCurrentPoints([point]);
          }
        },

        onPanResponderMove: (
          evt: GestureResponderEvent,
          _gestureState: PanResponderGestureState
        ) => {
          if (isCropModeActive) return;
          const { locationX, locationY } = evt.nativeEvent;
          const point: Point = { x: locationX, y: locationY };

          if (isShapeTool) {
            setShapeCurrent(point);
          } else {
            setCurrentPoints((prev) => [...prev, point]);
          }
        },

        onPanResponderRelease: (
          evt: GestureResponderEvent,
          _gestureState: PanResponderGestureState
        ) => {
          if (isCropModeActive) return;
          const { locationX, locationY } = evt.nativeEvent;
          const endPoint: Point = { x: locationX, y: locationY };

          if (isShapeTool && shapeStart) {
            const svgPath = shapeToSvgPath(activeTool, shapeStart, endPoint);
            if (svgPath) {
              const newPath: DoodlePath = {
                id: `path_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                points: [shapeStart, endPoint],
                svgPath,
                tool: activeTool,
                color: activeColor,
                strokeWidth,
                opacity: 1,
                isShape: true,
              };
              onAddPath(newPath);
            }
            setShapeStart(null);
            setShapeCurrent(null);
          } else if (currentPoints.length > 0) {
            const allPoints = [...currentPoints, endPoint];
            const svgPath = pointsToSmoothSvgPath(allPoints);
            const isEraser = activeTool === 'eraser';
            const isHighlighter = activeTool === 'highlighter';

            const newPath: DoodlePath = {
              id: `path_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
              points: allPoints,
              svgPath,
              tool: activeTool,
              color: isEraser ? canvasSettings.backgroundColor : activeColor,
              strokeWidth: isEraser ? strokeWidth * 2.2 : strokeWidth,
              opacity: isHighlighter ? 0.4 : 1,
            };

            onAddPath(newPath);
            setCurrentPoints([]);
          }
        },
      }),
    [
      isCropModeActive,
      isShapeTool,
      activeTool,
      activeColor,
      strokeWidth,
      canvasSettings.backgroundColor,
      shapeStart,
      currentPoints,
      onAddPath,
    ]
  );

  // Active stroke in progress
  const activeStrokeSvg = useMemo(() => {
    if (isShapeTool) {
      if (shapeStart && shapeCurrent) {
        return shapeToSvgPath(activeTool, shapeStart, shapeCurrent);
      }
      return '';
    }
    return pointsToSmoothSvgPath(currentPoints);
  }, [isShapeTool, shapeStart, shapeCurrent, activeTool, currentPoints]);

  const activeStrokeColor =
    activeTool === 'eraser'
      ? canvasSettings.backgroundColor
      : activeColor;

  const activeStrokeWidth =
    activeTool === 'eraser' ? strokeWidth * 2.2 : strokeWidth;

  const activeOpacity = activeTool === 'highlighter' ? 0.4 : 1;

  // Render Grid patterns
  const renderGridPattern = () => {
    const { gridType, gridSize, gridColor, gridOpacity } = canvasSettings;
    if (gridType === 'none') return null;

    const effectiveGridColor = gridColor;

    return (
      <Defs>
        {gridType === 'squares' && (
          <Pattern
            id="grid-squares"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <Rect
              width={gridSize}
              height={gridSize}
              fill="none"
              stroke={effectiveGridColor}
              strokeWidth={1}
              strokeOpacity={gridOpacity}
            />
          </Pattern>
        )}

        {gridType === 'dots' && (
          <Pattern
            id="grid-dots"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <Circle
              cx={gridSize / 2}
              cy={gridSize / 2}
              r={1.5}
              fill={effectiveGridColor}
              fillOpacity={gridOpacity * 1.2}
            />
          </Pattern>
        )}

        {gridType === 'lines' && (
          <Pattern
            id="grid-lines"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <Line
              x1={0}
              y1={gridSize}
              x2={gridSize}
              y2={gridSize}
              stroke={effectiveGridColor}
              strokeWidth={1}
              strokeOpacity={gridOpacity}
            />
          </Pattern>
        )}

        {gridType === 'isometric' && (
          <Pattern
            id="grid-isometric"
            width={gridSize * 1.732}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <Line
              x1={0}
              y1={0}
              x2={gridSize * 1.732}
              y2={gridSize}
              stroke={effectiveGridColor}
              strokeWidth={0.8}
              strokeOpacity={gridOpacity * 0.8}
            />
            <Line
              x1={0}
              y1={gridSize}
              x2={gridSize * 1.732}
              y2={0}
              stroke={effectiveGridColor}
              strokeWidth={0.8}
              strokeOpacity={gridOpacity * 0.8}
            />
          </Pattern>
        )}
      </Defs>
    );
  };

  const getGridFillId = () => {
    switch (canvasSettings.gridType) {
      case 'squares':
        return 'url(#grid-squares)';
      case 'dots':
        return 'url(#grid-dots)';
      case 'lines':
        return 'url(#grid-lines)';
      case 'isometric':
        return 'url(#grid-isometric)';
      default:
        return 'none';
    }
  };

  return (
    <View style={styles.container} onLayout={handleLayout} {...panResponder.panHandlers}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: 'png', quality: 1.0 }}
        style={[
          styles.viewShotContainer,
          { backgroundColor: canvasSettings.backgroundColor },
        ]}
      >
        <Svg
          width={dimensions.width}
          height={dimensions.height}
          style={StyleSheet.absoluteFill}
        >
          {renderGridPattern()}

          {/* Grid Overlay */}
          {canvasSettings.gridType !== 'none' && (
            <Rect
              x={0}
              y={0}
              width={dimensions.width}
              height={dimensions.height}
              fill={getGridFillId()}
            />
          )}

          {/* Render Saved/History Paths */}
          <G>
            {paths.map((p) => (
              <Path
                key={p.id}
                d={p.svgPath}
                stroke={p.color}
                strokeWidth={p.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={p.opacity}
              />
            ))}
          </G>

          {/* Render Active Stroke in real-time */}
          {activeStrokeSvg ? (
            <Path
              d={activeStrokeSvg}
              stroke={activeStrokeColor}
              strokeWidth={activeStrokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={activeOpacity}
            />
          ) : null}
        </Svg>
      </ViewShot>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  viewShotContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

