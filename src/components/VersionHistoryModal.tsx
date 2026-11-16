import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DoodleVersionSnapshot } from '../types/doodle';
import { DoodleThumbnail } from './DoodleThumbnail';

interface VersionHistoryModalProps {
  visible: boolean;
  projectTitle: string;
  versions: DoodleVersionSnapshot[];
  currentVersionNumber: number;
  onClose: () => void;
  onRestoreVersion: (snapshot: DoodleVersionSnapshot) => void;
  onExportVersion: (snapshot: DoodleVersionSnapshot) => void;
  onDeleteVersion: (snapshotId: string) => void;
  onCreateSnapshotNow: () => void;
}

export function VersionHistoryModal({
  visible,
  projectTitle,
  versions,
  currentVersionNumber,
  onClose,
  onRestoreVersion,
  onExportVersion,
  onDeleteVersion,
  onCreateSnapshotNow,
}: VersionHistoryModalProps) {
  const sortedVersions = [...versions].sort((a, b) => b.timestamp - a.timestamp);

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

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleConfirmRestore = (snapshot: DoodleVersionSnapshot) => {
    Alert.alert(
      'Restore Version',
      `Restore to "${snapshot.label}" (${snapshot.strokeCount} strokes)? Your current canvas will be updated (you can undo anytime).`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'default',
          onPress: () => {
            onRestoreVersion(snapshot);
            onClose();
          },
        },
      ]
    );
  };

  const renderVersionItem = ({ item }: { item: DoodleVersionSnapshot }) => {
    const isCurrent = item.versionNumber === currentVersionNumber;

    return (
      <View style={[styles.versionCard, isCurrent && styles.currentVersionCard]}>
        {/* Top Info Header within Card */}
        <View style={styles.cardHeaderRow}>
          <DoodleThumbnail
            paths={item.paths}
            backgroundColor={item.canvasSettings.backgroundColor}
            size={40}
          />

          <View style={styles.versionInfo}>
            <View style={styles.titleLine}>
              <Text style={styles.versionLabel} numberOfLines={1}>
                {item.label}
              </Text>
              {isCurrent && (
                <View style={styles.activePill}>
                  <Text style={styles.activePillText}>CURRENT</Text>
                </View>
              )}
            </View>
            <Text style={styles.versionMeta}>
              {formatDate(item.timestamp)} • {item.strokeCount} strokes
            </Text>
          </View>
        </View>

        {item.note ? (
          <Text style={styles.versionNote} numberOfLines={2}>
            "{item.note}"
          </Text>
        ) : null}

        {/* Action Row: clean, bounded layout where delete icon is always visible and never cut off */}
        <View style={styles.cardBottomRow}>
          <TouchableOpacity
            style={styles.restoreBtn}
            onPress={() => handleConfirmRestore(item)}
            accessibilityLabel="Restore Version"
          >
            <Ionicons name="arrow-undo" size={15} color="#0284C7" />
            <Text style={styles.restoreBtnText}>Restore</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => onExportVersion(item)}
              accessibilityLabel="Export version"
            >
              <Ionicons name="share-outline" size={16} color="#475569" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconBtn, styles.deleteBtn]}
              onPress={() => onDeleteVersion(item.id)}
              accessibilityLabel="Delete version"
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
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
            <View style={styles.titleRow}>
              <MaterialCommunityIcons name="history" size={24} color="#0284C7" />
              <View>
                <Text style={styles.title}>Version History</Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                  {projectTitle}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Create new snapshot bar */}
          <TouchableOpacity
            style={styles.createSnapshotBtn}
            onPress={() => {
              onClose();
              onCreateSnapshotNow();
            }}
          >
            <Ionicons name="add-circle-outline" size={18} color="#0284C7" />
            <Text style={styles.createSnapshotText}>Save Current Canvas as New Version</Text>
          </TouchableOpacity>

          {/* List of snapshots */}
          {sortedVersions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="clock-outline" size={44} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No Version Snapshots Yet</Text>
              <Text style={styles.emptySubtitle}>
                Whenever you want to save a milestone, tap "Save & Versions" and create a named snapshot.
              </Text>
            </View>
          ) : (
            <FlatList
              data={sortedVersions}
              keyExtractor={(item) => item.id}
              renderItem={renderVersionItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
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
    paddingHorizontal: 16,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  createSnapshotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F2FE',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  createSnapshotText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  listContent: {
    paddingBottom: 24,
    gap: 10,
  },
  versionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  currentVersionCard: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  versionThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 10,
  },
  versionThumbText: {
    fontSize: 13,
    fontWeight: '800',
  },
  versionInfo: {
    flex: 1,
    marginLeft: 10,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  versionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  activePill: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  versionMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  versionNote: {
    fontSize: 12,
    color: '#334155',
    fontStyle: 'italic',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  restoreBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    padding: 7,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deleteBtn: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});
