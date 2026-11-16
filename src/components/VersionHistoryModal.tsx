import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DoodleVersionSnapshot } from '../types/doodle';

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
        {/* Version Badge & Thumb */}
        <View
          style={[
            styles.versionThumb,
            { backgroundColor: item.canvasSettings.backgroundColor },
          ]}
        >
          <Text
            style={[
              styles.versionThumbText,
              {
                color: ['#1E293B', '#121214', '#0F172A'].includes(
                  item.canvasSettings.backgroundColor.toUpperCase()
                )
                  ? '#FFFFFF'
                  : '#0F172A',
              },
            ]}
          >
            v{item.versionNumber}
          </Text>
        </View>

        {/* Info */}
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
            {formatDate(item.timestamp)} • {item.strokeCount} strokes • {item.canvasSettings.gridType}
          </Text>
          {item.note ? (
            <Text style={styles.versionNote} numberOfLines={2}>
              "{item.note}"
            </Text>
          ) : null}
        </View>

        {/* Actions */}
        <View style={styles.versionActions}>
          <TouchableOpacity
            style={styles.restoreBtn}
            onPress={() => handleConfirmRestore(item)}
            accessibilityLabel="Restore Version"
          >
            <Ionicons name="arrow-undo" size={16} color="#0284C7" />
            <Text style={styles.restoreBtnText}>Restore</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => onExportVersion(item)}
            accessibilityLabel="Export version"
          >
            <Ionicons name="share-outline" size={16} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => onDeleteVersion(item.id)}
            accessibilityLabel="Delete version"
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
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
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <MaterialCommunityIcons name="history" size={24} color="#0284C7" />
              <Text style={styles.title}>Version History</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Subheader and Snapshot Button */}
          <View style={styles.topBar}>
            <Text style={styles.subTitle} numberOfLines={1}>
              {projectTitle}
            </Text>
            <TouchableOpacity
              style={styles.newSnapshotBtn}
              onPress={() => {
                onClose();
                onCreateSnapshotNow();
              }}
            >
              <Ionicons name="camera-outline" size={16} color="#FFFFFF" />
              <Text style={styles.newSnapshotBtnText}>Take Snapshot</Text>
            </TouchableOpacity>
          </View>

          {/* Version List */}
          {sortedVersions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="source-branch" size={44} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No Version Snapshots</Text>
              <Text style={styles.emptySubtitle}>
                Save as a new version whenever you want to preserve a milestone or experiment with changes safely!
              </Text>
            </View>
          ) : (
            <FlatList
              data={sortedVersions}
              keyExtractor={(item) => item.id}
              renderItem={renderVersionItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
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
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    flex: 1,
    marginRight: 10,
  },
  newSnapshotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 6,
  },
  newSnapshotBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listContent: {
    gap: 10,
    paddingBottom: 20,
  },
  versionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  currentVersionCard: {
    borderColor: '#0284C7',
    borderWidth: 1.5,
  },
  versionThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 12,
  },
  versionThumbText: {
    fontSize: 14,
    fontWeight: '800',
  },
  versionInfo: {
    flex: 1,
    marginRight: 6,
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
    flexShrink: 1,
  },
  activePill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
  },
  versionMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  versionNote: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#475569',
    marginTop: 2,
  },
  versionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  restoreBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
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

