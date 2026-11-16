import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { CanvasSettings, GridType } from '../types/doodle';
import {
  CANVAS_BACKGROUND_PRESETS,
  DEFAULT_CANVAS_SETTINGS_LIGHT,
  DEFAULT_CANVAS_SETTINGS_DARK,
} from '../constants/colors';
import { ThemeMode, AppTheme } from '../constants/theme';

interface GridSelectorModalProps {
  visible: boolean;
  settings: CanvasSettings;
  onChangeSettings: (newSettings: CanvasSettings) => void;
  themeMode: ThemeMode;
  onChangeThemeMode: (mode: ThemeMode) => void;
  theme: AppTheme;
  onClose: () => void;
}

const GRID_TYPES: { id: GridType; label: string; icon: string }[] = [
  { id: 'none', label: 'Blank', icon: 'crop-square' },
  { id: 'squares', label: 'Graph Grid', icon: 'grid' },
  { id: 'dots', label: 'Dot Grid', icon: 'circle-slice-8' },
  { id: 'lines', label: 'Ruled Lines', icon: 'view-headline' },
  { id: 'isometric', label: 'Isometric', icon: 'vector-polygon' },
];

const GRID_SIZES = [
  { label: 'Dense', value: 18 },
  { label: 'Normal', value: 28 },
  { label: 'Spacious', value: 44 },
];

const OPACITIES = [
  { label: 'Faint', value: 0.3 },
  { label: 'Medium', value: 0.6 },
  { label: 'Bold', value: 0.9 },
];

export function GridSelectorModal({
  visible,
  settings,
  onChangeSettings,
  themeMode,
  onChangeThemeMode,
  theme,
  onClose,
}: GridSelectorModalProps) {
  const isDarkBackground = ['#1E293B', '#121214', '#0F172A'].includes(
    settings.backgroundColor.toUpperCase()
  );

  // Drag down to dismiss responder
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_e, gesture) => gesture.dy > 10,
      onPanResponderRelease: (_e, gesture) => {
        if (gesture.dy > 50) {
          onClose();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Tap outside to dismiss */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.surfaceBorder,
            },
          ]}
        >
          {/* Drag to dismiss handle */}
          <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
            <View style={[styles.dragHandle, { backgroundColor: theme.textMuted }]} />
          </View>

          <View style={styles.header}>
            <View style={styles.titleRow}>
              <MaterialCommunityIcons name="cog-outline" size={24} color={theme.primary} />
              <Text style={[styles.title, { color: theme.text }]}>Settings & Canvas Grid</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary }]}
            >
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* App Theme Mode Selector */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              App Appearance (Theme)
            </Text>
            <View style={styles.themeSelectorRow}>
              {/* Match System */}
              <TouchableOpacity
                style={[
                  styles.themeOptionBtn,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.surfaceBorder,
                  },
                  themeMode === 'system' && {
                    borderColor: theme.primary,
                    backgroundColor: theme.primaryLight,
                  },
                ]}
                onPress={() => onChangeThemeMode('system')}
              >
                <Feather
                  name="smartphone"
                  size={18}
                  color={themeMode === 'system' ? theme.primary : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: theme.text },
                    themeMode === 'system' && { color: theme.primary, fontWeight: '800' },
                  ]}
                >
                  System
                </Text>
              </TouchableOpacity>

              {/* Light Mode */}
              <TouchableOpacity
                style={[
                  styles.themeOptionBtn,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.surfaceBorder,
                  },
                  themeMode === 'light' && {
                    borderColor: theme.primary,
                    backgroundColor: theme.primaryLight,
                  },
                ]}
                onPress={() => onChangeThemeMode('light')}
              >
                <Feather
                  name="sun"
                  size={18}
                  color={themeMode === 'light' ? theme.primary : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: theme.text },
                    themeMode === 'light' && { color: theme.primary, fontWeight: '800' },
                  ]}
                >
                  Light
                </Text>
              </TouchableOpacity>

              {/* Dark Mode */}
              <TouchableOpacity
                style={[
                  styles.themeOptionBtn,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.surfaceBorder,
                  },
                  themeMode === 'dark' && {
                    borderColor: theme.primary,
                    backgroundColor: theme.primaryLight,
                  },
                ]}
                onPress={() => onChangeThemeMode('dark')}
              >
                <Feather
                  name="moon"
                  size={18}
                  color={themeMode === 'dark' ? theme.primary : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.themeOptionText,
                    { color: theme.text },
                    themeMode === 'dark' && { color: theme.primary, fontWeight: '800' },
                  ]}
                >
                  Dark
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Canvas Mode Match Presets */}
            <View style={styles.quickMatchRow}>
              <TouchableOpacity
                style={[
                  styles.quickPresetBtn,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.surfaceBorder,
                  },
                ]}
                onPress={() => onChangeSettings(DEFAULT_CANVAS_SETTINGS_LIGHT)}
              >
                <Feather name="sun" size={14} color="#0284C7" />
                <Text style={[styles.quickPresetText, { color: theme.text }]}>
                  Reset Canvas to Light Grid
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.quickPresetBtn,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.surfaceBorder,
                  },
                ]}
                onPress={() => onChangeSettings(DEFAULT_CANVAS_SETTINGS_DARK)}
              >
                <Feather name="moon" size={14} color="#38BDF8" />
                <Text style={[styles.quickPresetText, { color: theme.text }]}>
                  Reset Canvas to Dark Grid
                </Text>
              </TouchableOpacity>
            </View>

            {/* Grid Pattern Type */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Grid Style</Text>
            <View style={styles.typeGrid}>
              {GRID_TYPES.map((type) => {
                const isSelected = settings.gridType === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeCard,
                      {
                        backgroundColor: theme.surfaceSecondary,
                        borderColor: theme.surfaceBorder,
                      },
                      isSelected && {
                        borderColor: theme.primary,
                        backgroundColor: theme.primaryLight,
                      },
                    ]}
                    onPress={() => {
                      onChangeSettings({
                        ...settings,
                        gridType: type.id,
                        gridColor: isDarkBackground ? '#64748B' : '#94A3B8',
                      });
                    }}
                  >
                    <MaterialCommunityIcons
                      name={type.icon as any}
                      size={24}
                      color={isSelected ? theme.primary : theme.textSecondary}
                    />
                    <Text
                      style={[
                        styles.typeLabel,
                        { color: theme.textSecondary },
                        isSelected && { color: theme.primary, fontWeight: '700' },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Grid Spacing / Size (if grid not none) */}
            {settings.gridType !== 'none' && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                  Grid Spacing
                </Text>
                <View style={styles.optionsRow}>
                  {GRID_SIZES.map((size) => {
                    const isSelected = settings.gridSize === size.value;
                    return (
                      <TouchableOpacity
                        key={size.label}
                        style={[
                          styles.optionBtn,
                          {
                            backgroundColor: theme.surfaceSecondary,
                            borderColor: theme.surfaceBorder,
                          },
                          isSelected && {
                            borderColor: theme.primary,
                            backgroundColor: theme.primaryLight,
                          },
                        ]}
                        onPress={() =>
                          onChangeSettings({
                            ...settings,
                            gridSize: size.value,
                          })
                        }
                      >
                        <Text
                          style={[
                            styles.optionLabel,
                            { color: theme.textSecondary },
                            isSelected && { color: theme.primary, fontWeight: '700' },
                          ]}
                        >
                          {size.label} ({size.value}px)
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Grid Opacity */}
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                  Grid Visibility
                </Text>
                <View style={styles.optionsRow}>
                  {OPACITIES.map((op) => {
                    const isSelected = settings.gridOpacity === op.value;
                    return (
                      <TouchableOpacity
                        key={op.label}
                        style={[
                          styles.optionBtn,
                          {
                            backgroundColor: theme.surfaceSecondary,
                            borderColor: theme.surfaceBorder,
                          },
                          isSelected && {
                            borderColor: theme.primary,
                            backgroundColor: theme.primaryLight,
                          },
                        ]}
                        onPress={() =>
                          onChangeSettings({
                            ...settings,
                            gridOpacity: op.value,
                          })
                        }
                      >
                        <Text
                          style={[
                            styles.optionLabel,
                            { color: theme.textSecondary },
                            isSelected && { color: theme.primary, fontWeight: '700' },
                          ]}
                        >
                          {op.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {/* Canvas Paper / Background Palette */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              Paper & Background
            </Text>
            <View style={styles.backgroundsGrid}>
              {CANVAS_BACKGROUND_PRESETS.map((preset) => {
                const isSelected =
                  settings.backgroundColor.toUpperCase() === preset.hex.toUpperCase();
                return (
                  <TouchableOpacity
                    key={preset.name}
                    style={[
                      styles.bgPresetCard,
                      { backgroundColor: preset.hex },
                      isSelected && styles.bgPresetSelected,
                    ]}
                    onPress={() => {
                      onChangeSettings({
                        ...settings,
                        backgroundColor: preset.hex,
                        gridColor: preset.dark ? '#64748B' : '#94A3B8',
                      });
                    }}
                  >
                    <Text
                      style={[
                        styles.bgPresetText,
                        { color: preset.dark ? '#FFFFFF' : '#0F172A' },
                      ]}
                    >
                      {preset.name}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={preset.dark ? '#38BDF8' : '#0284C7'}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  card: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
    borderTopWidth: 1,
  },
  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  themeOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1.5,
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  quickMatchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  quickPresetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    gap: 5,
    borderWidth: 1,
  },
  quickPresetText: {
    fontSize: 11,
    fontWeight: '600',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  typeCard: {
    flex: 1,
    minWidth: '28%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  backgroundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  bgPresetCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  bgPresetSelected: {
    borderColor: '#0284C7',
    borderWidth: 2.5,
  },
  bgPresetText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
