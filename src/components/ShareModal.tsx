import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PanResponder,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme, LIGHT_THEME } from '../constants/theme';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  onShareFullImage: () => void;
  onSaveFullImage: () => void;
  onShareProjectFile: () => void;
  onStartCropMode: () => void;
  theme?: AppTheme;
}

export function ShareModal({
  visible,
  onClose,
  onShareFullImage,
  onSaveFullImage,
  onShareProjectFile,
  onStartCropMode,
  theme = LIGHT_THEME,
}: ShareModalProps) {
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
              borderTopWidth: 1,
            },
          ]}
        >
          {/* Drag to dismiss pill */}
          <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
            <View style={[styles.dragHandle, { backgroundColor: theme.textMuted }]} />
          </View>

          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="share-social" size={22} color={theme.primary} />
              <Text style={[styles.title, { color: theme.text }]}>Export & Share</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary }]}
            >
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.optionsList}>
              {/* 1. Area Screen Grab / Crop & Share */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  styles.highlightCard,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => {
                  onClose();
                  onStartCropMode();
                }}
              >
                <View style={[styles.optionIcon, { backgroundColor: theme.primaryLight }]}>
                  <Ionicons name="crop" size={22} color={theme.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: theme.text }]}>Screen Grab Specific Area</Text>
                  <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>
                    Select and crop any custom region of your doodle to share
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </TouchableOpacity>

              {/* 2. Share Full Image */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.surfaceBorder,
                  },
                ]}
                onPress={() => {
                  onClose();
                  onShareFullImage();
                }}
              >
                <View style={[styles.optionIcon, { backgroundColor: theme.cardBg }]}>
                  <Ionicons name="image-outline" size={22} color="#16A34A" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: theme.text }]}>Share Full Drawing (PNG)</Text>
                  <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>
                    Send full high-resolution image to friends or social apps
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </TouchableOpacity>

              {/* 3. Save to Photos / Camera Roll */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.surfaceBorder,
                  },
                ]}
                onPress={() => {
                  onClose();
                  onSaveFullImage();
                }}
              >
                <View style={[styles.optionIcon, { backgroundColor: theme.cardBg }]}>
                  <Ionicons name="download-outline" size={22} color="#0284C7" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: theme.text }]}>Save to Device Gallery</Text>
                  <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>
                    Save high-res drawing directly into your photo gallery
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </TouchableOpacity>

              {/* 4. Export & Share .doodle Project File */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.surfaceBorder,
                  },
                ]}
                onPress={() => {
                  onClose();
                  onShareProjectFile();
                }}
              >
                <View style={[styles.optionIcon, { backgroundColor: theme.cardBg }]}>
                  <MaterialCommunityIcons name="code-json" size={22} color="#9333EA" />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: theme.text }]}>Share .doodle File (Vector)</Text>
                  <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>
                    Share editable vector project with full strokes and layers
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </TouchableOpacity>
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
    maxHeight: '85%',
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
  scrollContent: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  highlightCard: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
