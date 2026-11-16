import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PAINT_PALETTE } from '../constants/colors';

interface ColorPickerModalProps {
  visible: boolean;
  currentColor: string;
  onSelectColor: (color: string) => void;
  onClose: () => void;
  recentColors?: string[];
}

export function ColorPickerModal({
  visible,
  currentColor,
  onSelectColor,
  onClose,
  recentColors = [],
}: ColorPickerModalProps) {
  const [customHex, setCustomHex] = useState(currentColor);

  const handleApplyCustomHex = () => {
    let cleanHex = customHex.trim();
    if (!cleanHex.startsWith('#')) {
      cleanHex = `#${cleanHex}`;
    }
    // Verify hex format (3 or 6 characters)
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(cleanHex)) {
      onSelectColor(cleanHex);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="color-palette" size={24} color="#0284C7" />
              <Text style={styles.title}>Choose Paint Colour</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Current Selected Color Preview */}
            <View style={styles.currentSection}>
              <View
                style={[
                  styles.previewCircle,
                  { backgroundColor: currentColor },
                ]}
              />
              <View style={styles.previewInfo}>
                <Text style={styles.previewLabel}>Current Colour</Text>
                <Text style={styles.previewHex}>{currentColor.toUpperCase()}</Text>
              </View>
            </View>

            {/* Quick Hex Input */}
            <View style={styles.hexInputRow}>
              <TextInput
                style={styles.hexInput}
                value={customHex}
                onChangeText={setCustomHex}
                placeholder="#FF0000"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                maxLength={7}
              />
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={handleApplyCustomHex}
              >
                <Text style={styles.applyBtnText}>Set Hex</Text>
              </TouchableOpacity>
            </View>

            {/* Paint Palette Swatches */}
            <Text style={styles.sectionTitle}>Classic Paint Swatches</Text>
            <View style={styles.paletteGrid}>
              {PAINT_PALETTE.map((color, index) => {
                const isSelected =
                  color.toLowerCase() === currentColor.toLowerCase();
                return (
                  <TouchableOpacity
                    key={`${color}-${index}`}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: color },
                      isSelected && styles.selectedSwatch,
                    ]}
                    onPress={() => {
                      setCustomHex(color);
                      onSelectColor(color);
                    }}
                    activeOpacity={0.7}
                  >
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={
                          ['#ffffff', '#fff200', '#efe4b0', '#99d9ea', '#c8bfe7'].includes(
                            color.toLowerCase()
                          )
                            ? '#000000'
                            : '#FFFFFF'
                        }
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Recently Used Colors */}
            {recentColors.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Recent Colours</Text>
                <View style={styles.recentRow}>
                  {recentColors.slice(0, 10).map((color, idx) => (
                    <TouchableOpacity
                      key={`recent-${color}-${idx}`}
                      style={[
                        styles.recentSwatch,
                        { backgroundColor: color },
                        color.toLowerCase() === currentColor.toLowerCase() &&
                          styles.selectedSwatch,
                      ]}
                      onPress={() => {
                        setCustomHex(color);
                        onSelectColor(color);
                      }}
                    />
                  ))}
                </View>
              </>
            )}
          </ScrollView>

          {/* Done Button */}
          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>Apply Colour</Text>
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
  currentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  previewInfo: {
    flex: 1,
  },
  previewLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  previewHex: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  hexInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  hexInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  applyBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 18,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 6,
  },
  paletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  colorSwatch: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  selectedSwatch: {
    borderWidth: 3,
    borderColor: '#0284C7',
    transform: [{ scale: 1.1 }],
  },
  recentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  recentSwatch: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  doneBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

