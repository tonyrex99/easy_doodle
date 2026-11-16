import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CanvasSettings, GridType } from '../types/doodle';
import { CANVAS_BACKGROUND_PRESETS } from '../constants/colors';

interface GridSelectorModalProps {
  visible: boolean;
  settings: CanvasSettings;
  onChangeSettings: (newSettings: CanvasSettings) => void;
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
  onClose,
}: GridSelectorModalProps) {
  const isDarkBackground = ['#1E293B', '#121214', '#0F172A'].includes(
    settings.backgroundColor.toUpperCase()
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <MaterialCommunityIcons name="grid-large" size={24} color="#0284C7" />
              <Text style={styles.title}>Canvas & Grid Settings</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Grid Pattern Type */}
            <Text style={styles.sectionTitle}>Grid Style</Text>
            <View style={styles.typeGrid}>
              {GRID_TYPES.map((type) => {
                const isSelected = settings.gridType === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeCard,
                      isSelected && styles.typeCardSelected,
                    ]}
                    onPress={() => {
                      onChangeSettings({
                        ...settings,
                        gridType: type.id,
                        // auto contrast grid color based on background
                        gridColor: isDarkBackground ? '#64748B' : '#94A3B8',
                      });
                    }}
                  >
                    <MaterialCommunityIcons
                      name={type.icon as any}
                      size={24}
                      color={isSelected ? '#0284C7' : '#475569'}
                    />
                    <Text
                      style={[
                        styles.typeLabel,
                        isSelected && styles.typeLabelSelected,
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
                <Text style={styles.sectionTitle}>Grid Spacing</Text>
                <View style={styles.optionsRow}>
                  {GRID_SIZES.map((size) => {
                    const isSelected = settings.gridSize === size.value;
                    return (
                      <TouchableOpacity
                        key={size.label}
                        style={[
                          styles.optionBtn,
                          isSelected && styles.optionBtnSelected,
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
                            isSelected && styles.optionLabelSelected,
                          ]}
                        >
                          {size.label} ({size.value}px)
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Grid Opacity */}
                <Text style={styles.sectionTitle}>Grid Visibility</Text>
                <View style={styles.optionsRow}>
                  {OPACITIES.map((op) => {
                    const isSelected = settings.gridOpacity === op.value;
                    return (
                      <TouchableOpacity
                        key={op.label}
                        style={[
                          styles.optionBtn,
                          isSelected && styles.optionBtnSelected,
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
                            isSelected && styles.optionLabelSelected,
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

            {/* Canvas Background Color */}
            <Text style={styles.sectionTitle}>Canvas Paper / Background</Text>
            <View style={styles.bgGrid}>
              {CANVAS_BACKGROUND_PRESETS.map((preset) => {
                const isSelected =
                  preset.hex.toLowerCase() ===
                  settings.backgroundColor.toLowerCase();
                return (
                  <TouchableOpacity
                    key={preset.name}
                    style={[
                      styles.bgCard,
                      { backgroundColor: preset.hex },
                      isSelected && styles.bgCardSelected,
                    ]}
                    onPress={() => {
                      const willBeDark = preset.dark;
                      onChangeSettings({
                        ...settings,
                        backgroundColor: preset.hex,
                        gridColor: willBeDark ? '#64748B' : '#CBD5E1',
                      });
                    }}
                  >
                    <Text
                      style={[
                        styles.bgName,
                        { color: preset.dark ? '#FFFFFF' : '#0F172A' },
                      ]}
                    >
                      {preset.name}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={preset.dark ? '#38BDF8' : '#0284C7'}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>Apply Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    maxHeight: '85%',
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
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 10,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  typeCard: {
    flex: 1,
    minWidth: '28%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  typeCardSelected: {
    borderColor: '#0284C7',
    backgroundColor: '#E0F2FE',
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  typeLabelSelected: {
    color: '#0284C7',
    fontWeight: '700',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionBtnSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0284C7',
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  optionLabelSelected: {
    color: '#0284C7',
    fontWeight: '700',
  },
  bgGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  bgCard: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bgCardSelected: {
    borderColor: '#0284C7',
    borderWidth: 2.5,
  },
  bgName: {
    fontSize: 13,
    fontWeight: '600',
  },
  doneBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

