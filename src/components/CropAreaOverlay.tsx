import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CropRect } from '../types/doodle';

interface CropAreaOverlayProps {
  canvasWidth: number;
  canvasHeight: number;
  onCancel: () => void;
  onConfirmCrop: (cropRect: CropRect, action: 'share' | 'save') => void;
}

export function CropAreaOverlay({
  canvasWidth,
  canvasHeight,
  onCancel,
  onConfirmCrop,
}: CropAreaOverlayProps) {
  // Initial default crop is centered 70% of canvas
  const initialWidth = Math.round(Math.max(80, canvasWidth * 0.7));
  const initialHeight = Math.round(Math.max(80, canvasHeight * 0.5));
  const initialX = Math.round(Math.max(0, (canvasWidth - initialWidth) / 2));
  const initialY = Math.round(Math.max(0, (canvasHeight - initialHeight) / 2));

  const [crop, setCrop] = useState<CropRect>({
    x: initialX,
    y: initialY,
    width: initialWidth,
    height: initialHeight,
  });

  const [isSnipMode, setIsSnipMode] = useState(false);

  // Use refs to avoid stale closures in PanResponders and prevent gesture fighting/restarts
  const cropRef = useRef<CropRect>(crop);
  cropRef.current = crop;

  const dragStartRef = useRef<CropRect>(crop);
  const snipStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isSnipModeRef = useRef<boolean>(isSnipMode);
  isSnipModeRef.current = isSnipMode;

  const widthRef = useRef(canvasWidth);
  const heightRef = useRef(canvasHeight);
  widthRef.current = canvasWidth;
  heightRef.current = canvasHeight;

  // PanResponder for Moving the entire crop box
  const movePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isSnipModeRef.current,
      onMoveShouldSetPanResponder: (_e, gesture) =>
        !isSnipModeRef.current && (Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2),
      onPanResponderGrant: () => {
        dragStartRef.current = { ...cropRef.current };
      },
      onPanResponderMove: (_e: GestureResponderEvent, gesture: PanResponderGestureState) => {
        const start = dragStartRef.current;
        const maxW = widthRef.current;
        const maxH = heightRef.current;

        const newX = Math.min(Math.max(0, start.x + gesture.dx), Math.max(0, maxW - start.width));
        const newY = Math.min(Math.max(0, start.y + gesture.dy), Math.max(0, maxH - start.height));

        setCrop({
          ...start,
          x: Math.round(newX),
          y: Math.round(newY),
        });
      },
    })
  ).current;

  // Helper to create resize handle responder
  const createResizeResponder = (corner: 'tl' | 'tr' | 'bl' | 'br') =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_e, gesture) =>
        Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2,
      onPanResponderGrant: () => {
        dragStartRef.current = { ...cropRef.current };
      },
      onPanResponderMove: (_e: GestureResponderEvent, gesture: PanResponderGestureState) => {
        const start = dragStartRef.current;
        const maxW = widthRef.current;
        const maxH = heightRef.current;
        const MIN_SIZE = 40;

        let newX = start.x;
        let newY = start.y;
        let newW = start.width;
        let newH = start.height;

        if (corner === 'br') {
          newW = Math.min(Math.max(MIN_SIZE, start.width + gesture.dx), maxW - start.x);
          newH = Math.min(Math.max(MIN_SIZE, start.height + gesture.dy), maxH - start.y);
        } else if (corner === 'bl') {
          const rawW = start.width - gesture.dx;
          const candidateX = start.x + gesture.dx;
          if (rawW >= MIN_SIZE && candidateX >= 0) {
            newX = candidateX;
            newW = rawW;
          }
          newH = Math.min(Math.max(MIN_SIZE, start.height + gesture.dy), maxH - start.y);
        } else if (corner === 'tr') {
          const rawH = start.height - gesture.dy;
          const candidateY = start.y + gesture.dy;
          if (rawH >= MIN_SIZE && candidateY >= 0) {
            newY = candidateY;
            newH = rawH;
          }
          newW = Math.min(Math.max(MIN_SIZE, start.width + gesture.dx), maxW - start.x);
        } else if (corner === 'tl') {
          const rawW = start.width - gesture.dx;
          const rawH = start.height - gesture.dy;
          const candidateX = start.x + gesture.dx;
          const candidateY = start.y + gesture.dy;
          if (rawW >= MIN_SIZE && candidateX >= 0) {
            newX = candidateX;
            newW = rawW;
          }
          if (rawH >= MIN_SIZE && candidateY >= 0) {
            newY = candidateY;
            newH = rawH;
          }
        }

        setCrop({
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newW),
          height: Math.round(newH),
        });
      },
    });

  const tlResponder = useRef(createResizeResponder('tl')).current;
  const trResponder = useRef(createResizeResponder('tr')).current;
  const blResponder = useRef(createResizeResponder('bl')).current;
  const brResponder = useRef(createResizeResponder('br')).current;

  // Freehand Drag-to-Snip PanResponder on canvas background
  const snipPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isSnipModeRef.current,
      onMoveShouldSetPanResponder: () => isSnipModeRef.current,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        snipStartRef.current = { x: locationX, y: locationY };
        setCrop({
          x: Math.round(locationX),
          y: Math.round(locationY),
          width: 10,
          height: 10,
        });
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        const start = snipStartRef.current;
        const maxW = widthRef.current;
        const maxH = heightRef.current;

        const left = Math.min(start.x, locationX);
        const top = Math.min(start.y, locationY);
        const right = Math.max(start.x, locationX);
        const bottom = Math.max(start.y, locationY);

        const boundedLeft = Math.max(0, Math.min(left, maxW - 20));
        const boundedTop = Math.max(0, Math.min(top, maxH - 20));
        const boundedW = Math.min(Math.max(20, right - left), maxW - boundedLeft);
        const boundedH = Math.min(Math.max(20, bottom - top), maxH - boundedTop);

        setCrop({
          x: Math.round(boundedLeft),
          y: Math.round(boundedTop),
          width: Math.round(boundedW),
          height: Math.round(boundedH),
        });
      },
      onPanResponderRelease: () => {
        // Automatically switch back from snip mode to fine-tune mode once box is drawn
        setIsSnipMode(false);
      },
    })
  ).current;

  const applyPreset = (ratio: '1:1' | '16:9' | 'full') => {
    setIsSnipMode(false);
    if (ratio === 'full') {
      // Leave slight 4px inset so borders and handles are visible and never overlap control bars
      setCrop({
        x: 4,
        y: 4,
        width: Math.max(40, canvasWidth - 8),
        height: Math.max(40, canvasHeight - 8),
      });
      return;
    }

    if (ratio === '1:1') {
      const size = Math.round(Math.min(canvasWidth * 0.8, canvasHeight * 0.7));
      setCrop({
        x: Math.round(Math.max(0, (canvasWidth - size) / 2)),
        y: Math.round(Math.max(0, (canvasHeight - size) / 2)),
        width: size,
        height: size,
      });
      return;
    }

    if (ratio === '16:9') {
      const width = Math.round(canvasWidth * 0.85);
      const height = Math.round((width * 9) / 16);
      setCrop({
        x: Math.round(Math.max(0, (canvasWidth - width) / 2)),
        y: Math.round(Math.max(0, (canvasHeight - height) / 2)),
        width,
        height: Math.min(height, canvasHeight - 20),
      });
    }
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Darkened Mask Segments around the crop region */}
      <View
        style={[styles.mask, { top: 0, left: 0, right: 0, height: Math.max(0, crop.y) }]}
        pointerEvents="none"
      />
      <View
        style={[
          styles.mask,
          {
            top: crop.y + crop.height,
            left: 0,
            right: 0,
            bottom: 0,
          },
        ]}
        pointerEvents="none"
      />
      <View
        style={[
          styles.mask,
          {
            top: crop.y,
            left: 0,
            width: Math.max(0, crop.x),
            height: crop.height,
          },
        ]}
        pointerEvents="none"
      />
      <View
        style={[
          styles.mask,
          {
            top: crop.y,
            left: crop.x + crop.width,
            right: 0,
            height: crop.height,
          },
        ]}
        pointerEvents="none"
      />

      {/* Freehand Drag-to-Snip Gesture Layer (active when user taps Drag to Snip) */}
      {isSnipMode && (
        <View
          style={[StyleSheet.absoluteFill, styles.snipActiveLayer]}
          {...snipPanResponder.panHandlers}
        >
          <View style={styles.snipHintPill}>
            <MaterialCommunityIcons name="gesture-tap" size={18} color="#FFFFFF" />
            <Text style={styles.snipHintText}>Touch and drag anywhere to draw grab box</Text>
          </View>
        </View>
      )}

      {/* Resizable / Movable Crop Box */}
      {!isSnipMode && (
        <View
          style={[
            styles.cropBox,
            {
              left: crop.x,
              top: crop.y,
              width: crop.width,
              height: crop.height,
            },
          ]}
          {...movePanResponder.panHandlers}
        >
          {/* Dimension badge */}
          <View style={styles.dimensionBadge} pointerEvents="none">
            <Text style={styles.dimensionText}>
              {crop.width} × {crop.height} px
            </Text>
          </View>

          {/* Center Move Indicator */}
          <View style={styles.centerIndicator} pointerEvents="none">
            <Ionicons name="move" size={20} color="#FFFFFF" />
          </View>

          {/* Corner Resize Handles */}
          <View style={[styles.handle, styles.handleTL]} {...tlResponder.panHandlers} />
          <View style={[styles.handle, styles.handleTR]} {...trResponder.panHandlers} />
          <View style={[styles.handle, styles.handleBL]} {...blResponder.panHandlers} />
          <View style={[styles.handle, styles.handleBR]} {...brResponder.panHandlers} />
        </View>
      )}

      {/* Top Header Control Bar with Exit Button */}
      <View style={styles.topBar}>
        <View style={styles.topTitleGroup}>
          <Text style={styles.topBarTitle}>Area Screen Grab</Text>
        </View>

        <View style={styles.presetButtons}>
          <TouchableOpacity
            style={[styles.presetBtn, isSnipMode && styles.snipBtnActive]}
            onPress={() => setIsSnipMode((prev) => !prev)}
          >
            <MaterialCommunityIcons
              name="crop-free"
              size={15}
              color={isSnipMode ? '#FFFFFF' : '#38BDF8'}
            />
            <Text style={[styles.presetBtnText, isSnipMode && styles.presetTextActive]}>
              Drag to Snip
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.presetBtn} onPress={() => applyPreset('1:1')}>
            <Text style={styles.presetBtnText}>1:1</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.presetBtn} onPress={() => applyPreset('16:9')}>
            <Text style={styles.presetBtnText}>16:9</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.presetBtn} onPress={() => applyPreset('full')}>
            <Text style={styles.presetBtnText}>Full</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.closeHeaderBtn}
          onPress={onCancel}
          accessibilityLabel="Exit Grab Mode"
        >
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Action Footer */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Ionicons name="close-circle-outline" size={18} color="#94A3B8" />
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => onConfirmCrop(crop, 'save')}
        >
          <Ionicons name="download-outline" size={18} color="#FFFFFF" />
          <Text style={styles.btnText}>Save Crop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareBtn}
          onPress={() => onConfirmCrop(crop, 'share')}
        >
          <Ionicons name="share-social-outline" size={18} color="#FFFFFF" />
          <Text style={styles.btnText}>Share Area</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  snipActiveLayer: {
    backgroundColor: 'rgba(2, 132, 199, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  snipHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  snipHintText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  topBar: {
    position: 'absolute',
    top: 12,
    left: 10,
    right: 10,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 20,
    zIndex: 1000,
  },
  topTitleGroup: {
    marginRight: 6,
  },
  topBarTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
  },
  presetButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  presetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  snipBtnActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  presetBtnText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
  closeHeaderBtn: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#334155',
    marginLeft: 6,
  },
  cropBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    zIndex: 40,
  },
  dimensionBadge: {
    position: 'absolute',
    top: -24,
    left: 0,
    backgroundColor: '#0284C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dimensionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  centerIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  handle: {
    position: 'absolute',
    width: 28,
    height: 28,
    backgroundColor: '#38BDF8',
    borderColor: '#FFFFFF',
    borderWidth: 2.5,
    borderRadius: 14,
    elevation: 8,
  },
  handleTL: {
    top: -14,
    left: -14,
  },
  handleTR: {
    top: -14,
    right: -14,
  },
  handleBL: {
    bottom: -14,
    left: -14,
  },
  handleBR: {
    bottom: -14,
    right: -14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 24,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 20,
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cancelBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  shareBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
