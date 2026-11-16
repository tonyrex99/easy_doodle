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

const QUICK_COLORS = [
  '#000000',
  '#ED1C24',
  '#FF7F27',
  '#FFF200',
  '#22B14C',
  '#00A2E8',
  '#3F48CC',
  '#A349A4',
  '#FFAEC9',
  '#FFFFFF',
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
      {/* Pop-up Shape Selection Menu */}
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

      {/* Pop-up Size Selection Menu */}
      {showSizeMenu && (
        <View style={styles.submenuSize}>
          <Text style={styles.sizeTitle}>Stroke Size</Text>
          <View style={styles.sizeRow}>
            {STROKE_WIDTH_PRESETS.map((preset) => (
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
                      backgroundColor: activeColor,
                    },
                  ]}
                />
                <Text style={styles.sizeLabel}>{preset.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Top Strip: Quick Color Swatches like MS Paint Ribbon */}
      <View style={styles.colorRibbon}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.colorScroll}
        >
          {QUICK_COLORS.map((col) => {
            const isSelected = col.toLowerCase() === activeColor.toLowerCase();
            return (
              <TouchableOpacity
                key={col}
                style={[
                  styles.ribbonSwatch,
                  { backgroundColor: col },
                  isSelected && styles.ribbonSwatchSelected,
                ]}
                onPress={() => onSelectQuickColor(col)}
              />
            );
          })}

          {/* Color Wheel / Full Palette Modal Opener */}
          <TouchableOpacity
            style={styles.moreColorBtn}
            onPress={onOpenColorPicker}
          >
            <Ionicons name="color-palette-outline" size={18} color="#0284C7" />
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
              size={20}
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
              size={20}
              color={canRedo ? '#0F172A' : '#CBD5E1'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Tools: Pen, Brush, Highlighter, Eraser */}
        <View style={styles.toolGroup}>
          <TouchableOpacity
            style={[styles.toolBtn, activeTool === 'pen' && styles.toolBtnActive]}
            onPress={() => {
              onSelectTool('pen');
              setShowShapeMenu(false);
              setShowSizeMenu(false);
            }}
          >
            <Feather
              name="edit-2"
              size={18}
              color={activeTool === 'pen' ? '#FFFFFF' : '#475569'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolBtn, activeTool === 'brush' && styles.toolBtnActive]}
            onPress={() => {
              onSelectTool('brush');
              setShowShapeMenu(false);
              setShowSizeMenu(false);
            }}
          >
            <MaterialCommunityIcons
              name="brush"
              size={20}
              color={activeTool === 'brush' ? '#FFFFFF' : '#475569'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolBtn, activeTool === 'highlighter' && styles.toolBtnActive]}
            onPress={() => {
              onSelectTool('highlighter');
              setShowShapeMenu(false);
              setShowSizeMenu(false);
            }}
          >
            <MaterialCommunityIcons
              name="marker"
              size={20}
              color={activeTool === 'highlighter' ? '#FFFFFF' : '#475569'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolBtn, activeTool === 'eraser' && styles.toolBtnActive]}
            onPress={() => {
              onSelectTool('eraser');
              setShowShapeMenu(false);
              setShowSizeMenu(false);
            }}
          >
            <MaterialCommunityIcons
              name="eraser"
              size={20}
              color={activeTool === 'eraser' ? '#FFFFFF' : '#475569'}
            />
          </TouchableOpacity>

          {/* Shapes Button with Submenu */}
          <TouchableOpacity
            style={[styles.toolBtn, isShapeActive && styles.toolBtnActive]}
            onPress={() => {
              setShowShapeMenu(!showShapeMenu);
              setShowSizeMenu(false);
            }}
          >
            <Ionicons
              name={getShapeIcon()}
              size={19}
              color={isShapeActive ? '#FFFFFF' : '#475569'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Stroke Size Button */}
        <TouchableOpacity
          style={[styles.sizeIndicatorBtn, showSizeMenu && styles.toolBtnActive]}
          onPress={() => {
            setShowSizeMenu(!showSizeMenu);
            setShowShapeMenu(false);
          }}
        >
          <View
            style={[
              styles.previewDot,
              {
                width: Math.min(18, strokeWidth * 0.7 + 4),
                height: Math.min(18, strokeWidth * 0.7 + 4),
                backgroundColor: showSizeMenu ? '#FFFFFF' : '#0F172A',
              },
            ]}
          />
        </TouchableOpacity>

        {/* Clear Canvas */}
        <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
          <Ionicons name="trash-outline" size={19} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 6,
  },
  submenu: {
    position: 'absolute',
    top: -55,
    left: 80,
    right: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 6,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  subBtnActive: {
    backgroundColor: '#E0F2FE',
  },
  subBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  submenuSize: {
    position: 'absolute',
    top: -95,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sizeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeOption: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sizeOptionActive: {
    backgroundColor: '#E0F2FE',
  },
  sizeDot: {
    borderRadius: 13,
    marginBottom: 4,
  },
  sizeLabel: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  colorRibbon: {
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  colorScroll: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 4,
  },
  ribbonSwatch: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  ribbonSwatchSelected: {
    borderColor: '#0284C7',
    borderWidth: 3,
    transform: [{ scale: 1.15 }],
  },
  moreColorBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  toolsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
  },
  disabledBtn: {
    opacity: 0.4,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  toolGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  toolBtn: {
    padding: 9,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  toolBtnActive: {
    backgroundColor: '#0284C7',
  },
  sizeIndicatorBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewDot: {
    borderRadius: 9,
  },
  clearBtn: {
    padding: 9,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
  },
});

