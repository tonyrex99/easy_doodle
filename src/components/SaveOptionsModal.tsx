import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
}: SaveOptionsModalProps) {
  const nextVersion = currentVersionNumber + 1;
  const [showVersionInput, setShowVersionInput] = useState(false);
  const [versionLabel, setVersionLabel] = useState('');
  const [versionNote, setVersionNote] = useState('');

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
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="save" size={24} color="#0284C7" />
              <Text style={styles.title}>Save Doodle</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Current Project Info */}
          <View style={styles.projectInfoCard}>
            <View style={styles.projectTextCol}>
              <Text style={styles.projectTitleText} numberOfLines={1}>
                {projectTitle}
              </Text>
              <Text style={styles.versionSubtext}>
                Current: Version {currentVersionNumber} • {versionCount} saved snapshot{versionCount === 1 ? '' : 's'}
              </Text>
            </View>
            {versionCount > 0 && (
              <TouchableOpacity
                style={styles.historyPillBtn}
                onPress={() => {
                  onClose();
                  onOpenVersionHistory();
                }}
              >
                <MaterialCommunityIcons name="history" size={16} color="#0284C7" />
                <Text style={styles.historyPillText}>History</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Options */}
          {!showVersionInput ? (
            <View style={styles.optionsList}>
              {/* Option A: Save as New Version (Recommended) */}
              <TouchableOpacity
                style={[styles.optionCard, styles.recommendedCard]}
                onPress={() => setShowVersionInput(true)}
              >
                <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
                  <MaterialCommunityIcons name="source-branch" size={22} color="#0284C7" />
                </View>
                <View style={styles.optionDetails}>
                  <View style={styles.optionTitleRow}>
                    <Text style={styles.optionTitle}>Save as New Version</Text>
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
                    </View>
                  </View>
                  <Text style={styles.optionDesc}>
                    Creates Version {nextVersion} with date stamp so you can revert anytime
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              {/* Option B: Quick Overwrite Save */}
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => {
                  onClose();
                  onQuickSave();
                }}
              >
                <View style={[styles.iconCircle, { backgroundColor: '#F1F5F9' }]}>
                  <Ionicons name="checkmark-done" size={20} color="#475569" />
                </View>
                <View style={styles.optionDetails}>
                  <Text style={styles.optionTitle}>Quick Save</Text>
                  <Text style={styles.optionDesc}>
                    Updates current version ({currentVersionNumber}) without a new snapshot
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              {/* Option C: Save as Separate Project */}
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => {
                  onClose();
                  onSaveAsNewProject(`${projectTitle} (Copy)`);
                }}
              >
                <View style={[styles.iconCircle, { backgroundColor: '#F3E8FF' }]}>
                  <Ionicons name="copy-outline" size={20} color="#9333EA" />
                </View>
                <View style={styles.optionDetails}>
                  <Text style={styles.optionTitle}>Save as Separate Copy</Text>
                  <Text style={styles.optionDesc}>
                    Duplicates into a completely independent project file
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          ) : (
            /* Sub-view: Enter custom version label or use auto-generated */
            <View style={styles.versionInputContainer}>
              <Text style={styles.inputLabel}>Version Label (with date/time default):</Text>
              <TextInput
                style={styles.textInput}
                value={versionLabel}
                onChangeText={setVersionLabel}
                placeholder="Version name"
                placeholderTextColor="#94A3B8"
              />

              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Note (optional):</Text>
              <TextInput
                style={[styles.textInput, styles.noteInput]}
                value={versionNote}
                onChangeText={setVersionNote}
                placeholder="e.g. Added color fills, changed character expression..."
                placeholderTextColor="#94A3B8"
                multiline
              />

              <View style={styles.inputActionsRow}>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => setShowVersionInput(false)}
                >
                  <Text style={styles.backBtnText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmVersionBtn}
                  onPress={() => {
                    onClose();
                    onSaveAsVersion(versionLabel.trim() || `Version ${nextVersion}`, versionNote.trim());
                  }}
                >
                  <Ionicons name="save" size={18} color="#FFFFFF" />
                  <Text style={styles.confirmVersionBtnText}>Save Version {nextVersion}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    marginBottom: 14,
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
  projectInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
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
    width: 42,
    height: 42,
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

