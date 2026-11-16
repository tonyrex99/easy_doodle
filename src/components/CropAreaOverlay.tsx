import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const initialWidth = Math.round(canvasWidth * 0.7);
  const initialHeight = Math.round(canvasHeight * 0.5);
  const initialX = Math.round((canvasWidth - initialWidth) / 2);
  const initialY = Math.round((canvasHeight - initialHeight) / 2);

  const [crop, setCrop] = useState<CropRect>({
    x: Math.max(0, initialX),
    y: Math.max(0, initialY),
    width: initialWidth,
    height: initialHeight,
  });

  // State to track drag start positions
  const [dragStart, setDragStart] = useState<CropRect>(crop);

  // PanResponder for Moving the entire crop box
  const movePanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setDragStart(crop);
        },
        onPanResponderMove: (
          _e: GestureResponderEvent,
          gesture: PanResponderGestureState
        ) => {
          const newX = Math.min(
            Math.max(0, dragStart.x + gesture.dx),
            canvasWidth - dragStart.width
          );
          const newY = Math.min(
            Math.max(0, dragStart.y + gesture.dy),
            canvasHeight - dragStart.height
          );
          setCrop((prev) => ({
            ...prev,
            x: Math.round(newX),
            y: Math.round(newY),
          }));
        },
      }),
    [crop, dragStart, canvasWidth, canvasHeight]
  );

  // Helper to create resize handle responder
  const createResizeResponder = (corner: 'tl' | 'tr' | 'bl' | 'br') =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setDragStart(crop);
      },
      onPanResponderMove: (
        _e: GestureResponderEvent,
        gesture: PanResponderGestureState
      ) => {
        let newX = dragStart.x;
        let newY = dragStart.y;
        let newW = dragStart.width;
        let newH = dragStart.height;

        const MIN_SIZE = 40;

        if (corner === 'br') {
          newW = Math.min(
            Math.max(MIN_SIZE, dragStart.width + gesture.dx),
            canvasWidth - dragStart.x
          );
          newH = Math.min(
            Math.max(MIN_SIZE, dragStart.height + gesture.dy),
            canvasHeight - dragStart.y
          );
        } else if (corner === 'bl') {
          const rawW = dragStart.width - gesture.dx;
          if (rawW >= MIN_SIZE && dragStart.x + gesture.dx >= 0) {
            newX = dragStart.x + gesture.dx;
            newW = rawW;
          }
          newH = Math.min(
            Math.max(MIN_SIZE, dragStart.height + gesture.dy),
            canvasHeight - dragStart.y
          );
        } else if (corner === 'tr') {
          const rawH = dragStart.height - gesture.dy;
          if (rawH >= MIN_SIZE && dragStart.y + gesture.dy >= 0) {
            newY = dragStart.y + gesture.dy;
            newH = rawH;
          }
          newW = Math.min(
            Math.max(MIN_SIZE, dragStart.width + gesture.dx),
            canvasWidth - dragStart.x
          );
        } else if (corner === 'tl') {
          const rawW = dragStart.width - gesture.dx;
          const rawH = dragStart.height - gesture.dy;
          if (rawW >= MIN_SIZE && dragStart.x + gesture.dx >= 0) {
            newX = dragStart.x + gesture.dx;
            newW = rawW;
          }
          if (rawH >= MIN_SIZE && dragStart.y + gesture.dy >= 0) {
            newY = dragStart.y + gesture.dy;
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

  const tlResponder = useMemo(() => createResizeResponder('tl'), [crop, dragStart, canvasWidth, canvasHeight]);
  const trResponder = useMemo(() => createResizeResponder('tr'), [crop, dragStart, canvasWidth, canvasHeight]);
  const blResponder = useMemo(() => createResizeResponder('bl'), [crop, dragStart, canvasWidth, canvasHeight]);
  const brResponder = useMemo(() => createResizeResponder('br'), [crop, dragStart, canvasWidth, canvasHeight]);

  const applyPreset = (ratio: '1:1' | '16:9' | 'full') => {
    if (ratio === 'full') {
      setCrop({
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight,
      });
      return;
    }

    if (ratio === '1:1') {
      const size = Math.min(canvasWidth * 0.8, canvasHeight * 0.8);
      setCrop({
        x: Math.round((canvasWidth - size) / 2),
        y: Math.round((canvasHeight - size) / 2),
        width: Math.round(size),
        height: Math.round(size),
      });
      return;
    }

    if (ratio === '16:9') {
      const width = Math.round(canvasWidth * 0.85);
      const height = Math.round((width * 9) / 16);
      setCrop({
        x: Math.round((canvasWidth - width) / 2),
        y: Math.round((canvasHeight - height) / 2),
        width,
        height,
      });
    }
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Darkened Mask Segments around the crop region */}
      {/* Top Mask */}
      <View
        style={[
          styles.mask,
          { top: 0, left: 0, right: 0, height: crop.y },
        ]}
      />
      {/* Bottom Mask */}
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
      />
      {/* Left Mask */}
      <View
        style={[
          styles.mask,
          {
            top: crop.y,
            left: 0,
            width: crop.x,
            height: crop.height,
          },
        ]}
      />
      {/* Right Mask */}
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
      />

      {/* Preset bar at top */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Select Area to Grab</Text>
        <View style={styles.presetButtons}>
          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => applyPreset('1:1')}
          >
            <Text style={styles.presetBtnText}>1:1 Square</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => applyPreset('16:9')}
          >
            <Text style={styles.presetBtnText}>16:9</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => applyPreset('full')}
          >
            <Text style={styles.presetBtnText}>Full</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* The Resizable Crop Box */}
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
        <View style={styles.dimensionBadge}>
          <Text style={styles.dimensionText}>
            {crop.width} × {crop.height}
          </Text>
        </View>

        {/* Center Move Indicator */}
        <View style={styles.centerIndicator}>
          <Ionicons name="move" size={24} color="#FFFFFF" />
        </View>

        {/* Corner Resize Handles */}
        <View
          style={[styles.handle, styles.handleTL]}
          {...tlResponder.panHandlers}
        />
        <View
          style={[styles.handle, styles.handleTR]}
          {...trResponder.panHandlers}
        />
        <View
          style={[styles.handle, styles.handleBL]}
          {...blResponder.panHandlers}
        />
        <View
          style={[styles.handle, styles.handleBR]}
          {...brResponder.panHandlers}
        />
      </View>

      {/* Action Footer */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Ionicons name="close" size={20} color="#FFFFFF" />
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => onConfirmCrop(crop, 'save')}
        >
          <Ionicons name="download-outline" size={20} color="#FFFFFF" />
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareBtn}
          onPress={() => onConfirmCrop(crop, 'share')}
        >
          <Ionicons name="share-social" size={20} color="#FFFFFF" />
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
  topBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  topBarTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  presetButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  presetBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  presetBtnText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  cropBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  dimensionBadge: {
    position: 'absolute',
    top: -26,
    left: 0,
    backgroundColor: '#38BDF8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dimensionText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '700',
  },
  centerIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -16,
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  handle: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: '#38BDF8',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 12,
  },
  handleTL: {
    top: -12,
    left: -12,
  },
  handleTR: {
    top: -12,
    right: -12,
  },
  handleBL: {
    bottom: -12,
    left: -12,
  },
  handleBR: {
    bottom: -12,
    right: -12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#475569',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  shareBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

