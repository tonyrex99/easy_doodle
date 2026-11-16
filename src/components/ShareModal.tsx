import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  onShareFullImage: () => void;
  onSaveFullImage: () => void;
  onShareProjectFile: () => void;
  onStartCropMode: () => void;
}

export function ShareModal({
  visible,
  onClose,
  onShareFullImage,
  onSaveFullImage,
  onShareProjectFile,
  onStartCropMode,
}: ShareModalProps) {
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
              <Ionicons name="share-social" size={24} color="#0284C7" />
              <Text style={styles.title}>Export & Share</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {/* 1. Area Screen Grab / Crop & Share */}
            <TouchableOpacity
              style={[styles.optionCard, styles.highlightCard]}
              onPress={() => {
                onClose();
                onStartCropMode();
              }}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="crop" size={22} color="#0284C7" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Screen Grab Specific Area</Text>
                <Text style={styles.optionSubtitle}>
                  Select and crop any custom region of your doodle to share
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* 2. Share Full Image */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => {
                onClose();
                onShareFullImage();
              }}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="image-outline" size={22} color="#16A34A" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Share Full Drawing (PNG)</Text>
                <Text style={styles.optionSubtitle}>
                  Send full high-resolution image to friends or social apps
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* 3. Save to Photos / Camera Roll */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => {
                onClose();
                onSaveFullImage();
              }}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="download-outline" size={22} color="#D97706" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Save to Device Photos</Text>
                <Text style={styles.optionSubtitle}>
                  Save copy directly to your device photo gallery
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>

            {/* 4. Share .doodle Project File */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => {
                onClose();
                onShareProjectFile();
              }}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#F3E8FF' }]}>
                <MaterialCommunityIcons name="file-document-outline" size={22} color="#9333EA" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Share Doodle File (.doodle)</Text>
                <Text style={styles.optionSubtitle}>
                  Share the editable vector project so others can open it
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
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
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
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
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  highlightCard: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});

