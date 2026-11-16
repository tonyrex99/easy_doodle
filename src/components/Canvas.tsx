import React, { useRef, useState, useMemo, forwardRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  LayoutChangeEvent,
  TouchableOpacity,
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
import { Ionicons } from '@expo/vector-icons';
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
  resetZoom: () => void;
}

function getTouchDistance(t1: { pageX: number; pageY: number }, t2: { pageX: number; pageY: number }): number {
  const dx = t1.pageX - t2.pageX;
  const dy = t1.pageY - t2.pageY;
  return Math.sqrt(dx * dx + dy * dy);
}

function getTouchCenter(t1: { pageX: number; pageY: number }, t2: { pageX: number; pageY: number }): Point {
  return {
    x: (t1.pageX + t2.pageX) / 2,
    y: (t1.pageY + t2.pageY) / 2,
  };
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

  // Zoom and Pan transform states
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Refs for tracking active gestures without triggering re-renders during 60fps pan/pinch
  const scaleRef = useRef(1);
  scaleRef.current = scale;
  const panRef = useRef({ x: 0, y: 0 });
  panRef.current = pan;

  const isPinchingRef = useRef(false);
  const initialPinchDistRef = useRef(0);
  const initialScaleRef = useRef(1);
  const initialPanRef = useRef({ x: 0, y: 0 });
  const initialCenterRef = useRef<Point>({ x: 0, y: 0 });

  const activeToolRef = useRef(activeTool);
  activeToolRef.current = activeTool;
  const activeColorRef = useRef(activeColor);
  activeColorRef.current = activeColor;
  const strokeWidthRef = useRef(strokeWidth);
  strokeWidthRef.current = strokeWidth;
  const isCropModeRef = useRef(isCropModeActive);
  isCropModeRef.current = isCropModeActive;
  const canvasBgRef = useRef(canvasSettings.backgroundColor);
  canvasBgRef.current = canvasSettings.backgroundColor;

  const isShapeTool = useMemo(() => {
    return ['line', 'rectangle', 'circle', 'arrow'].includes(activeTool);
  }, [activeTool]);

  const resetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  React.useImperativeHandle(ref, () => ({
    viewShotRef,
    dimensions,
    resetZoom,
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setDimensions({ width, height });
    }
  };

  // Convert screen coordinates to canvas-space coordinates accounting for zoom and pan
  const toCanvasPoint = (screenX: number, screenY: number): Point => {
    const curScale = scaleRef.current;
    const curPan = panRef.current;
    return {
      x: (screenX - curPan.x) / curScale,
      y: (screenY - curPan.y) / curScale,
    };
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !isCropModeRef.current,
        onMoveShouldSetPanResponder: () => !isCropModeRef.current,

        onPanResponderGrant: (evt: GestureResponderEvent) => {
          if (isCropModeRef.current) return;
          const touches = evt.nativeEvent.touches;

          // Two-finger pinch & move begins: movement takes priority over drawing
          if (touches && touches.length >= 2) {
            isPinchingRef.current = true;
            setCurrentPoints([]);
            setShapeStart(null);
            setShapeCurrent(null);

            initialPinchDistRef.current = getTouchDistance(touches[0], touches[1]);
            initialScaleRef.current = scaleRef.current;
            initialPanRef.current = { ...panRef.current };
            initialCenterRef.current = getTouchCenter(touches[0], touches[1]);
            return;
          }

          // Single finger touch: if no tool selected ('none'), treat single-finger as canvas pan
          if (activeToolRef.current === 'none') {
            isPinchingRef.current = false;
            initialPanRef.current = { ...panRef.current };
            return;
          }

          // Otherwise single finger draws
          isPinchingRef.current = false;
          const { locationX, locationY } = evt.nativeEvent;
          const point = toCanvasPoint(locationX, locationY);

          if (['line', 'rectangle', 'circle', 'arrow'].includes(activeToolRef.current)) {
            setShapeStart(point);
            setShapeCurrent(point);
          } else {
            setCurrentPoints([point]);
          }
        },

        onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          if (isCropModeRef.current) return;
          const touches = evt.nativeEvent.touches;

          // Multi-touch pinch zoom & pan
          if (touches && touches.length >= 2) {
            if (!isPinchingRef.current) {
              // Upgraded to pinch mid-stroke: cancel line
              isPinchingRef.current = true;
              setCurrentPoints([]);
              setShapeStart(null);
              setShapeCurrent(null);
              initialPinchDistRef.current = getTouchDistance(touches[0], touches[1]);
              initialScaleRef.current = scaleRef.current;
              initialPanRef.current = { ...panRef.current };
              initialCenterRef.current = getTouchCenter(touches[0], touches[1]);
              return;
            }

            const currentDist = getTouchDistance(touches[0], touches[1]);
            const currentCenter = getTouchCenter(touches[0], touches[1]);

            if (initialPinchDistRef.current > 0) {
              const distRatio = currentDist / initialPinchDistRef.current;
              const newScale = Math.min(Math.max(0.4, initialScaleRef.current * distRatio), 4.5);
              setScale(newScale);

              const deltaX = currentCenter.x - initialCenterRef.current.x;
              const deltaY = currentCenter.y - initialCenterRef.current.y;
              setPan({
                x: initialPanRef.current.x + deltaX,
                y: initialPanRef.current.y + deltaY,
              });
            }
            return;
          }

          // Single-finger canvas pan when tool is 'none'
          if (activeToolRef.current === 'none') {
            setPan({
              x: initialPanRef.current.x + gestureState.dx,
              y: initialPanRef.current.y + gestureState.dy,
            });
            return;
          }

          // If was pinching and dropped to 1 finger, ignore drawing until next gesture
          if (isPinchingRef.current) return;

          // Normal single finger drawing
          const { locationX, locationY } = evt.nativeEvent;
          const point = toCanvasPoint(locationX, locationY);

          if (['line', 'rectangle', 'circle', 'arrow'].includes(activeToolRef.current)) {
            setShapeCurrent(point);
          } else {
            setCurrentPoints((prev) => [...prev, point]);
          }
        },

        onPanResponderRelease: (evt: GestureResponderEvent) => {
          if (isCropModeRef.current) return;
          if (isPinchingRef.current) {
            isPinchingRef.current = false;
            return;
          }

          if (activeToolRef.current === 'none') {
            return;
          }

          const { locationX, locationY } = evt.nativeEvent;
          const endPoint = toCanvasPoint(locationX, locationY);
          const tool = activeToolRef.current;
          const color = activeColorRef.current;
          const width = strokeWidthRef.current;

          if (['line', 'rectangle', 'circle', 'arrow'].includes(tool) && shapeStart) {
            const svgPath = shapeToSvgPath(tool, shapeStart, endPoint);
            if (svgPath) {
              const newPath: DoodlePath = {
                id: `path_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                points: [shapeStart, endPoint],
                svgPath,
                tool,
                color,
                strokeWidth: width,
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
            const isEraser = tool === 'eraser' || color === 'transparent';
            const isHighlighter = tool === 'highlighter';
            const isBrush = tool === 'brush';

            const newPath: DoodlePath = {
              id: `path_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
              points: allPoints,
              svgPath,
              tool,
              color: isEraser ? canvasBgRef.current : color,
              strokeWidth: isBrush ? width * 1.3 : isHighlighter ? width * 2.2 : width,
              opacity: isHighlighter ? 0.35 : isBrush ? 0.88 : 1,
            };
            onAddPath(newPath);
            setCurrentPoints([]);
          }
        },
      }),
    [shapeStart, currentPoints, onAddPath]
  );

  // Active stroke preview during dragging
  const activeStrokeSvg = useMemo(() => {
    if (isShapeTool && shapeStart && shapeCurrent) {
      return shapeToSvgPath(activeTool, shapeStart, shapeCurrent);
    }
    if (currentPoints.length > 0) {
      return pointsToSmoothSvgPath(currentPoints);
    }
    return '';
  }, [isShapeTool, activeTool, shapeStart, shapeCurrent, currentPoints]);

  const isEraser = activeTool === 'eraser' || activeColor === 'transparent';
  const isHighlighter = activeTool === 'highlighter';
  const isBrush = activeTool === 'brush';
  const previewStrokeWidth = isBrush
    ? strokeWidth * 1.3
    : isHighlighter
    ? strokeWidth * 2.2
    : strokeWidth;
  const previewOpacity = isHighlighter ? 0.35 : isBrush ? 0.88 : 1;
  const previewColor = isEraser ? canvasSettings.backgroundColor : activeColor;

  const isZoomedOrMoved = Math.abs(scale - 1) > 0.05 || Math.abs(pan.x) > 5 || Math.abs(pan.y) > 5;

  return (
    <View style={styles.container} onLayout={handleLayout} {...panResponder.panHandlers}>
      {/* Floating Zoom & Pan Indicator Pill */}
      {isZoomedOrMoved && (
        <TouchableOpacity style={styles.zoomResetPill} onPress={resetZoom}>
          <Ionicons name="scan-outline" size={14} color="#FFFFFF" />
          <Text style={styles.zoomResetText}>{Math.round(scale * 100)}% • Reset</Text>
        </TouchableOpacity>
      )}

      {/* Snapshot-capture Target View */}
      <ViewShot
        ref={viewShotRef}
        options={{ format: 'png', quality: 1.0 }}
        style={[
          styles.viewShotContainer,
          {
            backgroundColor: canvasSettings.backgroundColor,
          },
        ]}
      >
        <View
          style={[
            styles.transformWrapper,
            {
              width: dimensions.width,
              height: dimensions.height,
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { scale: scale },
              ],
            },
          ]}
        >
          <Svg
            width={dimensions.width}
            height={dimensions.height}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          >
            <Defs>
              {/* Background Grid Patterns */}
              {canvasSettings.gridType === 'squares' && (
                <Pattern
                  id="grid-squares"
                  width={canvasSettings.gridSize}
                  height={canvasSettings.gridSize}
                  patternUnits="userSpaceOnUse"
                >
                  <Path
                    d={`M ${canvasSettings.gridSize} 0 L 0 0 0 ${canvasSettings.gridSize}`}
                    fill="none"
                    stroke={canvasSettings.gridColor}
                    strokeWidth="1"
                    strokeOpacity={canvasSettings.gridOpacity}
                  />
                </Pattern>
              )}

              {canvasSettings.gridType === 'dots' && (
                <Pattern
                  id="grid-dots"
                  width={canvasSettings.gridSize}
                  height={canvasSettings.gridSize}
                  patternUnits="userSpaceOnUse"
                >
                  <Circle
                    cx={canvasSettings.gridSize / 2}
                    cy={canvasSettings.gridSize / 2}
                    r="1.5"
                    fill={canvasSettings.gridColor}
                    fillOpacity={canvasSettings.gridOpacity}
                  />
                </Pattern>
              )}

              {canvasSettings.gridType === 'lines' && (
                <Pattern
                  id="grid-lines"
                  width={canvasSettings.gridSize}
                  height={canvasSettings.gridSize}
                  patternUnits="userSpaceOnUse"
                >
                  <Line
                    x1="0"
                    y1={canvasSettings.gridSize}
                    x2={dimensions.width}
                    y2={canvasSettings.gridSize}
                    stroke={canvasSettings.gridColor}
                    strokeWidth="1"
                    strokeOpacity={canvasSettings.gridOpacity}
                  />
                </Pattern>
              )}
            </Defs>

            {/* Base Background Color */}
            <Rect
              x="0"
              y="0"
              width={dimensions.width}
              height={dimensions.height}
              fill={canvasSettings.backgroundColor}
            />

            {/* Grid Overlay */}
            {canvasSettings.gridType !== 'none' && (
              <Rect
                x="0"
                y="0"
                width={dimensions.width}
                height={dimensions.height}
                fill={`url(#grid-${canvasSettings.gridType})`}
              />
            )}

            {/* Rendered Paths */}
            <G>
              {paths.map((p) => {
                const strokeProps =
                  p.tool === 'brush'
                    ? {
                        strokeLinecap: 'round' as const,
                        strokeLinejoin: 'round' as const,
                      }
                    : {
                        strokeLinecap: 'round' as const,
                        strokeLinejoin: 'round' as const,
                      };

                return (
                  <Path
                    key={p.id}
                    d={p.svgPath}
                    stroke={p.color}
                    strokeWidth={p.strokeWidth}
                    fill="none"
                    opacity={p.opacity}
                    {...strokeProps}
                  />
                );
              })}
            </G>

            {/* Active Drawing In-Progress Stroke */}
            {activeStrokeSvg ? (
              <Path
                d={activeStrokeSvg}
                stroke={previewColor}
                strokeWidth={previewStrokeWidth}
                fill="none"
                opacity={previewOpacity}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
          </Svg>
        </View>
      </ViewShot>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  viewShotContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  transformWrapper: {
    transformOrigin: 'center center',
  },
  zoomResetPill: {
    position: 'absolute',
    top: 10,
    right: 12,
    zIndex: 99,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 5,
    borderWidth: 1,
    borderColor: '#38BDF8',
    elevation: 6,
  },
  zoomResetText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
