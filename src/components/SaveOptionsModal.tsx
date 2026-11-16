import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  PanResponder,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme, LIGHT_THEME } from '../constants/theme';

interface SaveOptionsModalProps {
  visible: boolean;
  projectTitle: string;
  currentVersionNumber: number;
  versionCount: number;
  onClose: () => void;
  onQuickSave: () => void;
  onSaveAsVersion: (versionLabel: string, note?: string) => void;
  onSaveAsNewProject: (newTitle: string) => void;
  onOpenVersionHistory: () => void;
  theme?: AppTheme;
}

export function SaveOptionsModal({
  visible,
  projectTitle,
  currentVersionNumber,
  versionCount,
  onClose,
  onQuickSave,
  onSaveAsVersion,
  onSaveAsNewProject,
  onOpenVersionHistory,
  theme = LIGHT_THEME,
}: SaveOptionsModalProps) {
  const nextVersion = currentVersionNumber + 1;
  const [showVersionInput, setShowVersionInput] = useState(false);
  const [versionLabel, setVersionLabel] = useState('');
  const [versionNote, setVersionNote] = useState('');

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

  // Generate smart default version name: e.g. "My Doodle v2 (16 Nov, 03:30 PM)"
  useEffect(() => {
    if (visible) {
      const now = new Date();
      const dateStr = now.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
      const timeStr = now.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      });
      setVersionLabel(`${projectTitle} v${nextVersion} (${dateStr}, ${timeStr})`);
      setVersionNote('');
      setShowVersionInput(false);
    }
  }, [visible, projectTitle, nextVersion]);

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
          {/* Drag to dismiss handle */}
          <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
            <View style={[styles.dragHandle, { backgroundColor: theme.textMuted }]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="save" size={22} color={theme.primary} />
              <Text style={[styles.title, { color: theme.text }]}>Save Doodle</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary }]}
            >
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Current Project Info */}
            <View
              style={[
                styles.projectInfoCard,
                {
                  backgroundColor: theme.surfaceSecondary,
                  borderColor: theme.surfaceBorder,
                },
              ]}
            >
              <View style={styles.projectTextCol}>
                <Text style={[styles.projectTitleText, { color: theme.text }]} numberOfLines={1}>
                  {projectTitle}
                </Text>
                <Text style={[styles.versionSubtext, { color: theme.textSecondary }]}>
                  Current: Version {currentVersionNumber} • {versionCount} snapshot{versionCount === 1 ? '' : 's'}
                </Text>
              </View>
              {versionCount > 0 && (
                <TouchableOpacity
                  style={[styles.historyPillBtn, { backgroundColor: theme.primaryLight }]}
                  onPress={() => {
                    onClose();
                    onOpenVersionHistory();
                  }}
                >
                  <MaterialCommunityIcons name="history" size={16} color={theme.primary} />
                  <Text style={[styles.historyPillText, { color: theme.primary }]}>History</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Options */}
            {!showVersionInput ? (
              <View style={styles.optionsList}>
                {/* Option A: Save as New Version (Recommended) */}
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    styles.recommendedCard,
                    {
                      backgroundColor: theme.surfaceSecondary,
                      borderColor: theme.primary,
                    },
                  ]}
                  onPress={() => setShowVersionInput(true)}
                >
                  <View style={[styles.iconCircle, { backgroundColor: theme.primaryLight }]}>
                    <MaterialCommunityIcons name="source-branch" size={22} color={theme.primary} />
                  </View>
                  <View style={styles.optionDetails}>
                    <View style={styles.optionTitleRow}>
                      <Text style={[styles.optionTitle, { color: theme.text }]}>Save as New Version</Text>
                      <View style={[styles.recommendedBadge, { backgroundColor: theme.primaryLight }]}>
                        <Text style={[styles.recommendedBadgeText, { color: theme.primary }]}>RECOMMENDED</Text>
                      </View>
                    </View>
                    <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>
                      Creates Version {nextVersion} with date stamp so you can revert anytime
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                </TouchableOpacity>

                {/* Option B: Quick Overwrite Save */}
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
                    onQuickSave();
                  }}
                >
                  <View style={[styles.iconCircle, { backgroundColor: theme.cardBg }]}>
                    <Ionicons name="checkmark-done" size={20} color={theme.primary} />
                  </View>
                  <View style={styles.optionDetails}>
                    <Text style={[styles.optionTitle, { color: theme.text }]}>Quick Save</Text>
                    <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>
                      Updates current version ({currentVersionNumber}) directly
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                </TouchableOpacity>

                {/* Option C: Save as Separate Project */}
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
                    onSaveAsNewProject(`${projectTitle} (Copy)`);
                  }}
                >
                  <View style={[styles.iconCircle, { backgroundColor: theme.cardBg }]}>
                    <Ionicons name="copy-outline" size={20} color="#9333EA" />
                  </View>
                  <View style={styles.optionDetails}>
                    <Text style={[styles.optionTitle, { color: theme.text }]}>Save as Separate Copy</Text>
                    <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>
                      Clones current drawing into a brand new doodle file
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                </TouchableOpacity>
              </View>
            ) : (
              /* Custom Version Label Form */
              <View style={styles.versionInputContainer}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Version Label</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.surfaceSecondary,
                      borderColor: theme.surfaceBorder,
                      color: theme.text,
                    },
                  ]}
                  value={versionLabel}
                  onChangeText={setVersionLabel}
                  placeholder={`e.g. ${projectTitle} v${nextVersion}`}
                  placeholderTextColor={theme.textMuted}
                  autoFocus
                />

                <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 10 }]}>Version Note (Optional)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    styles.noteInput,
                    {
                      backgroundColor: theme.surfaceSecondary,
                      borderColor: theme.surfaceBorder,
                      color: theme.text,
                    },
                  ]}
                  value={versionNote}
                  onChangeText={setVersionNote}
                  placeholder="e.g. Added background shading and line details"
                  placeholderTextColor={theme.textMuted}
                  multiline
                  numberOfLines={2}
                />

                <View style={styles.inputActionsRow}>
                  <TouchableOpacity
                    style={[styles.backBtn, { backgroundColor: theme.surfaceSecondary, borderColor: theme.surfaceBorder }]}
                    onPress={() => setShowVersionInput(false)}
                  >
                    <Text style={[styles.backBtnText, { color: theme.text }]}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.confirmVersionBtn, { backgroundColor: theme.primary }]}
                    onPress={() => {
                      onClose();
                      onSaveAsVersion(versionLabel.trim() || `${projectTitle} v${nextVersion}`, versionNote.trim());
                    }}
                  >
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                    <Text style={styles.confirmVersionBtnText}>Save Version {nextVersion}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
    paddingBottom: 44,
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
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  projectInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  projectTextCol: {
    flex: 1,
    marginRight: 10,
  },
  projectTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  versionSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  historyPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  historyPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
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
  recommendedCard: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionDetails: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  recommendedBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recommendedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  optionDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  versionInputContainer: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  textInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noteInput: {
    height: 60,
    textAlignVertical: 'top',
    fontWeight: '400',
  },
  inputActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  backBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  confirmVersionBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0284C7',
    gap: 6,
  },
  confirmVersionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
