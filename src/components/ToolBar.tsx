import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { DrawingTool } from '../types/doodle';
import { STROKE_WIDTH_PRESETS } from '../constants/colors';

interface ToolBarProps {
  activeTool: DrawingTool;
  onSelectTool: (tool: DrawingTool) => void;
  activeColor: string;
  onOpenColorPicker: () => void;
  strokeWidth: number;
  onChangeStrokeWidth: (width: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSelectQuickColor: (color: string) => void;
}

// Purple (#A349A4) removed per user request, replaced with transparent & vivid primary paints
const QUICK_COLORS = [
  '#000000', // Black
  '#ED1C24', // Red
  '#FF7F27', // Orange
  '#FFF200', // Yellow
  '#22B14C', // Green
  '#00A2E8', // Cyan/Light Blue
  '#3F48CC', // Indigo
  '#FFAEC9', // Pink
  '#FFFFFF', // White
  'transparent', // Transparent / Clear
];

export function ToolBar({
  activeTool,
  onSelectTool,
  activeColor,
  onOpenColorPicker,
  strokeWidth,
  onChangeStrokeWidth,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onSelectQuickColor,
}: ToolBarProps) {
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  const isShapeActive = ['line', 'rectangle', 'circle', 'arrow'].includes(activeTool);

  const toggleTool = (tool: DrawingTool) => {
    // If the user taps the tool that is already active, deselect it (switch to 'none' / pan mode)
    if (activeTool === tool) {
      onSelectTool('none');
    } else {
      onSelectTool(tool);
    }
    setShowShapeMenu(false);
    setShowSizeMenu(false);
  };

  const getShapeIcon = () => {
    switch (activeTool) {
      case 'rectangle':
        return 'square-outline';
      case 'circle':
        return 'ellipse-outline';
      case 'arrow':
        return 'arrow-forward-outline';
      case 'line':
      default:
        return 'remove-outline';
    }
  };

  return (
    <View style={styles.container}>
      {/* Pop-up Shape Selection Submenu */}
      {showShapeMenu && (
        <View style={styles.submenu}>
          <TouchableOpacity
            style={[styles.subBtn, activeTool === 'line' && styles.subBtnActive]}
            onPress={() => {
              onSelectTool('line');
              setShowShapeMenu(false);
            }}
          >
            <Ionicons name="remove-outline" size={20} color="#0F172A" />
            <Text style={styles.subBtnText}>Line</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subBtn, activeTool === 'rectangle' && styles.subBtnActive]}
            onPress={() => {
              onSelectTool('rectangle');
              setShowShapeMenu(false);
            }}
          >
            <Ionicons name="square-outline" size={20} color="#0F172A" />
            <Text style={styles.subBtnText}>Rect</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subBtn, activeTool === 'circle' && styles.subBtnActive]}
            onPress={() => {
              onSelectTool('circle');
              setShowShapeMenu(false);
            }}
          >
            <Ionicons name="ellipse-outline" size={20} color="#0F172A" />
            <Text style={styles.subBtnText}>Circle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subBtn, activeTool === 'arrow' && styles.subBtnActive]}
            onPress={() => {
              onSelectTool('arrow');
              setShowShapeMenu(false);
            }}
          >
            <Ionicons name="arrow-forward-outline" size={20} color="#0F172A" />
            <Text style={styles.subBtnText}>Arrow</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Pop-up Size Selection Submenu */}
      {showSizeMenu && (
        <View style={styles.submenuSize}>
          <Text style={styles.sizeTitle}>Stroke Size</Text>
          <View style={styles.sizeRow}>
            {STROROKE_PRESETS(activeColor, strokeWidth, onChangeStrokeWidth, setShowSizeMenu)}
          </View>
        </View>
      )}

      {/* Top Strip: Quick Color Swatches + Transparent + Palette Picker at back */}
      <View style={styles.colorRibbon}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.colorScroll}
        >
          {QUICK_COLORS.map((col) => {
            const isTransparent = col === 'transparent';
            const isSelected = isTransparent
              ? activeColor === 'transparent'
              : col.toLowerCase() === activeColor.toLowerCase();

            if (isTransparent) {
              return (
                <TouchableOpacity
                  key="transparent"
                  style={[
                    styles.ribbonSwatch,
                    styles.transparentSwatch,
                    isSelected && styles.ribbonSwatchSelected,
                  ]}
                  onPress={() => onSelectQuickColor('transparent')}
                  accessibilityLabel="Transparent / Erase"
                >
                  <MaterialCommunityIcons name="circle-off-outline" size={16} color="#64748B" />
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={col}
                style={[
                  styles.ribbonSwatch,
                  { backgroundColor: col },
                  col === '#FFFFFF' && styles.whiteSwatchBorder,
                  isSelected && styles.ribbonSwatchSelected,
                ]}
                onPress={() => onSelectQuickColor(col)}
              />
            );
          })}

          {/* Color Palette / Custom Picker Button at back */}
          <TouchableOpacity
            style={styles.moreColorBtn}
            onPress={onOpenColorPicker}
            accessibilityLabel="More Colors / Custom Palette"
          >
            <Ionicons name="color-palette" size={19} color="#0284C7" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Bottom Main Tool Row */}
      <View style={styles.toolsRow}>
        {/* Undo / Redo */}
        <View style={styles.historyGroup}>
          <TouchableOpacity
            style={[styles.iconBtn, !canUndo && styles.disabledBtn]}
            onPress={onUndo}
            disabled={!canUndo}
          >
            <Ionicons
              name="arrow-undo-outline"
              size={19}
              color={canUndo ? '#0F172A' : '#CBD5E1'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, !canRedo && styles.disabledBtn]}
            onPress={onRedo}
            disabled={!canRedo}
          >
            <Ionicons
              name="arrow-redo-outline"
              size={19}
              color={canRedo ? '#0F172A' : '#CBD5E1'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Tools: Pen, Brush, Highlighter, Eraser */}
        <View style={styles.toolGroup}>
          {/* Pen */}
          <TouchableOpacity
            style={[styles.toolBtn, activeTool === 'pen' && styles.toolBtnActive]}
            onPress={() => toggleTool('pen')}
            accessibilityLabel="Pen"
          >
            <Feather
              name="edit-2"
              size={18}
              color={activeTool === 'pen' ? '#FFFFFF' : '#475569'}
            />
          </TouchableOpacity>

          {/* Artistic Brush */}
          <TouchableOpacity
            style={[styles.toolBtn, activeTool === 'brush' && styles.toolBtnActive]}
            onPress={() => toggleTool('brush')}
            accessibilityLabel="Art Brush"
          >
            <MaterialCommunityIcons
              name="brush"
              size={20}
              color={activeTool === 'brush' ? '#FFFFFF' : '#475569'}
            />
          </TouchableOpacity>

          {/* Highlighter */}
          <TouchableOpacity
            style={[styles.toolBtn, activeTool === 'highlighter' && styles.toolBtnActive]}
            onPress={() => toggleTool('highlighter')}
            accessibilityLabel="Highlighter"
          >
            <MaterialCommunityIcons
              name="marker"
              size={20}
              color={activeTool === 'highlighter' ? '#FFFFFF' : '#475569'}
            />
          </TouchableOpacity>

          {/* Eraser */}
          <TouchableOpacity
            style={[styles.toolBtn, activeTool === 'eraser' && styles.toolBtnActive]}
            onPress={() => toggleTool('eraser')}
            accessibilityLabel="Eraser"
          >
            <MaterialCommunityIcons
              name="eraser"
              size={20}
              color={activeTool === 'eraser' ? '#FFFFFF' : '#475569'}
            />
          </TouchableOpacity>

          {/* Shapes Menu */}
          <TouchableOpacity
            style={[styles.toolBtn, isShapeActive && styles.toolBtnActive]}
            onPress={() => {
              setShowShapeMenu((prev) => !prev);
              setShowSizeMenu(false);
            }}
            accessibilityLabel="Shapes"
          >
            <Ionicons
              name={getShapeIcon()}
              size={18}
              color={isShapeActive ? '#FFFFFF' : '#475569'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Right Controls: Stroke Size & Clear */}
        <View style={styles.rightGroup}>
          <TouchableOpacity
            style={[styles.sizeBtn, showSizeMenu && styles.sizeBtnActive]}
            onPress={() => {
              setShowSizeMenu((prev) => !prev);
              setShowShapeMenu(false);
            }}
            accessibilityLabel="Stroke Width"
          >
            <View
              style={[
                styles.strokePreviewDot,
                {
                  width: Math.min(18, Math.max(6, strokeWidth * 0.9)),
                  height: Math.min(18, Math.max(6, strokeWidth * 0.9)),
                  backgroundColor:
                    activeColor === 'transparent' ? '#64748B' : activeColor,
                },
              ]}
            />
            <Text style={styles.sizeBtnText}>{strokeWidth}px</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onClear}
            accessibilityLabel="Clear Canvas"
          >
            <Ionicons name="trash-outline" size={19} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function STROROKE_PRESETS(
  activeColor: string,
  strokeWidth: number,
  onChangeStrokeWidth: (w: number) => void,
  setShowSizeMenu: (s: boolean) => void
) {
  return STROKE_WIDTH_PRESETS.map((preset) => (
    <TouchableOpacity
      key={preset.label}
      style={[
        styles.sizeOption,
        strokeWidth === preset.value && styles.sizeOptionActive,
      ]}
      onPress={() => {
        onChangeStrokeWidth(preset.value);
        setShowSizeMenu(false);
      }}
    >
      <View
        style={[
          styles.sizeDot,
          {
            width: Math.min(26, preset.value * 1.2 + 4),
            height: Math.min(26, preset.value * 1.2 + 4),
            backgroundColor: activeColor === 'transparent' ? '#64748B' : activeColor,
          },
        ]}
      />
      <Text style={styles.sizeLabel}>{preset.label}</Text>
    </TouchableOpacity>
  ));
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8,
  },
  colorRibbon: {
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  colorScroll: {
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
  },
  ribbonSwatch: {
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  whiteSwatchBorder: {
    borderColor: '#CBD5E1',
  },
  transparentSwatch: {
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#94A3B8',
  },
  ribbonSwatchSelected: {
    borderColor: '#0284C7',
    borderWidth: 3,
    transform: [{ scale: 1.15 }],
  },
  moreColorBtn: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  toolsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  historyGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.4,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 3,
  },
  toolGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toolBtn: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolBtnActive: {
    backgroundColor: '#0284C7',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  sizeBtnActive: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#0284C7',
  },
  strokePreviewDot: {
    borderRadius: 9,
  },
  sizeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  submenu: {
    position: 'absolute',
    bottom: 50,
    left: 80,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 999,
  },
  subBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  subBtnActive: {
    backgroundColor: '#E0F2FE',
  },
  subBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 2,
  },
  submenuSize: {
    position: 'absolute',
    bottom: 50,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 999,
  },
  sizeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeOption: {
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    minWidth: 44,
  },
  sizeOptionActive: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#0284C7',
  },
  sizeDot: {
    borderRadius: 13,
    marginBottom: 4,
  },
  sizeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
});
