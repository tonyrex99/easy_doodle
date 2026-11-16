import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PAINT_PALETTE } from '../constants/colors';

interface ColorPickerModalProps {
  visible: boolean;
  activeColor: string;
  onSelectColor: (color: string) => void;
  onClose: () => void;
}

export function ColorPickerModal({
  visible,
  activeColor,
  onSelectColor,
  onClose,
}: ColorPickerModalProps) {
  const [customHex, setCustomHex] = useState(
    activeColor === 'transparent' ? '#000000' : activeColor
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

  const handleApplyCustomHex = () => {
    let cleanHex = customHex.trim();
    if (!cleanHex.startsWith('#')) {
      cleanHex = `#${cleanHex}`;
    }
    if (/^#[0-9A-F]{6}$/i.test(cleanHex) || /^#[0-9A-F]{3}$/i.test(cleanHex)) {
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
        {/* Tap outside to dismiss */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View style={styles.card}>
          {/* Drag to dismiss pill */}
          <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
            <View style={styles.dragHandle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Color Palette</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Active Color Preview & Transparent Option */}
          <View style={styles.activeColorRow}>
            <View style={styles.previewGroup}>
              <View
                style={[
                  styles.activeColorBox,
                  activeColor === 'transparent'
                    ? styles.transparentPreviewBox
                    : { backgroundColor: activeColor },
                ]}
              >
                {activeColor === 'transparent' && (
                  <MaterialCommunityIcons name="circle-off-outline" size={22} color="#64748B" />
                )}
              </View>
              <View>
                <Text style={styles.activeColorLabel}>Active Color</Text>
                <Text style={styles.activeColorHex}>
                  {activeColor === 'transparent' ? 'Transparent' : activeColor.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Quick Pick Transparent */}
            <TouchableOpacity
              style={[
                styles.transparentPickBtn,
                activeColor === 'transparent' && styles.transparentPickBtnActive,
              ]}
              onPress={() => {
                onSelectColor('transparent');
                onClose();
              }}
            >
              <MaterialCommunityIcons name="circle-off-outline" size={18} color="#0284C7" />
              <Text style={styles.transparentPickText}>Transparent</Text>
            </TouchableOpacity>
          </View>

          {/* MS Paint Palette Matrix */}
          <Text style={styles.sectionTitle}>Classic Paint Swatches</Text>
          <View style={styles.swatchGrid}>
            {PAINT_PALETTE.map((hex) => {
              const isSelected = hex.toLowerCase() === activeColor.toLowerCase();
              return (
                <TouchableOpacity
                  key={hex}
                  style={[
                    styles.gridSwatch,
                    { backgroundColor: hex },
                    hex === '#FFFFFF' && styles.whiteSwatchBorder,
                    isSelected && styles.gridSwatchSelected,
                  ]}
                  onPress={() => {
                    onSelectColor(hex);
                    setCustomHex(hex);
                    onClose();
                  }}
                />
              );
            })}
          </View>

          {/* Custom Hex Code Input */}
          <Text style={styles.sectionTitle}>Custom Hex Color</Text>
          <View style={styles.customHexRow}>
            <TextInput
              style={styles.hexInput}
              value={customHex}
              onChangeText={setCustomHex}
              placeholder="#000000"
              placeholderTextColor="#94A3B8"
              maxLength={7}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.applyHexBtn}
              onPress={handleApplyCustomHex}
            >
              <Text style={styles.applyHexText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 20,
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
    backgroundColor: '#CBD5E1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  activeColorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activeColorBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparentPreviewBox: {
    backgroundColor: '#F1F5F9',
    borderColor: '#94A3B8',
  },
  activeColorLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  activeColorHex: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  transparentPickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  transparentPickBtnActive: {
    borderColor: '#0284C7',
    borderWidth: 2,
  },
  transparentPickText: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
    justifyContent: 'center',
  },
  gridSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  whiteSwatchBorder: {
    borderColor: '#94A3B8',
  },
  gridSwatchSelected: {
    borderColor: '#0284C7',
    borderWidth: 3,
    transform: [{ scale: 1.2 }],
  },
  customHexRow: {
    flexDirection: 'row',
    gap: 10,
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
  applyHexBtn: {
    backgroundColor: '#0284C7',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyHexText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
