import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { DoodleProject } from '../types/doodle';
import {
  getSavedProjects,
  deleteProject,
  shareDoodleFile,
  importDoodleFromFile,
  saveProject,
} from '../utils/fileSystem';

interface DoodleGalleryModalProps {
  visible: boolean;
  currentProjectId: string;
  onOpenProject: (project: DoodleProject) => void;
  onClose: () => void;
  onNewDoodle: () => void;
}

export function DoodleGalleryModal({
  visible,
  currentProjectId,
  onOpenProject,
  onClose,
  onNewDoodle,
}: DoodleGalleryModalProps) {
  const [projects, setProjects] = useState<DoodleProject[]>([]);
  const [loading, setLoading] = useState(false);

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

  const loadProjects = async () => {
    setLoading(true);
    try {
      const list = await getSavedProjects();
      setProjects(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadProjects();
    }
  }, [visible]);

  const handleDelete = (project: DoodleProject) => {
    Alert.alert(
      'Delete Doodle',
      `Are you sure you want to delete "${project.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteProject(project.id);
            await loadProjects();
          },
        },
      ]
    );
  };

  const handleDuplicate = async (project: DoodleProject) => {
    const duplicated: DoodleProject = {
      ...project,
      id: `copy_${Date.now()}`,
      title: `${project.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveProject(duplicated);
    await loadProjects();
  };

  const handleShareFile = async (project: DoodleProject) => {
    try {
      await shareDoodleFile(project);
    } catch (err: any) {
      Alert.alert('Share Error', err.message || 'Could not share file');
    }
  };

  const handleImport = async () => {
    try {
      const imported = await importDoodleFromFile();
      if (imported) {
        Alert.alert('Success', `Imported "${imported.title}" successfully!`);
        await loadProjects();
        onOpenProject(imported);
        onClose();
      }
    } catch (err: any) {
      Alert.alert('Import Failed', err.message || 'Invalid doodle file format');
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderProjectItem = ({ item }: { item: DoodleProject }) => {
    const isCurrent = item.id === currentProjectId;

    return (
      <View style={[styles.projectCard, isCurrent && styles.currentCard]}>
        {/* Left Color Preview Indicator */}
        <View
          style={[
            styles.cardThumb,
            { backgroundColor: item.canvasSettings.backgroundColor },
          ]}
        >
          <Feather
            name="image"
            size={20}
            color={
              ['#1E293B', '#121214', '#0F172A'].includes(
                item.canvasSettings.backgroundColor.toUpperCase()
              )
                ? '#94A3B8'
                : '#64748B'
            }
          />
        </View>

        {/* Project Info */}
        <TouchableOpacity
          style={styles.cardInfo}
          onPress={() => {
            onOpenProject(item);
            onClose();
          }}
        >
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {isCurrent && <Text style={styles.currentBadge}>ACTIVE</Text>}
          </View>
          <Text style={styles.cardMeta} numberOfLines={1}>
            {formatDate(item.updatedAt)} • {item.paths.length} strokes
          </Text>
        </TouchableOpacity>

        {/* Action Buttons: strictly bounded with shrink to prevent offscreen overflow */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionIconBtn}
            onPress={() => handleShareFile(item)}
            accessibilityLabel="Share File"
          >
            <Ionicons name="share-social-outline" size={16} color="#0284C7" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionIconBtn}
            onPress={() => handleDuplicate(item)}
            accessibilityLabel="Duplicate"
          >
            <Ionicons name="copy-outline" size={16} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionIconBtn, styles.deleteBtn]}
            onPress={() => handleDelete(item)}
            accessibilityLabel="Delete"
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
              <Ionicons name="folder-open" size={22} color="#0284C7" />
              <Text style={styles.title}>My Doodles & Files</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Action Row: Import External File & New */}
          <View style={styles.topActionsRow}>
            <TouchableOpacity
              style={styles.importBtn}
              onPress={handleImport}
            >
              <Ionicons name="document-attach-outline" size={17} color="#0284C7" />
              <Text style={styles.importBtnText}>Open .doodle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.newBtn}
              onPress={() => {
                onNewDoodle();
                onClose();
              }}
            >
              <Ionicons name="add" size={17} color="#FFFFFF" />
              <Text style={styles.newBtnText}>New Canvas</Text>
            </TouchableOpacity>
          </View>

          {/* List of projects */}
          {loading ? (
            <ActivityIndicator size="large" color="#0284C7" style={{ marginVertical: 40 }} />
          ) : projects.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="folder" size={44} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No Doodles Saved Yet</Text>
              <Text style={styles.emptySubtitle}>
                Draw something awesome and tap Save, or import a .doodle file to get started!
              </Text>
            </View>
          ) : (
            <FlatList
              data={projects}
              keyExtractor={(item) => item.id}
              renderItem={renderProjectItem}
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
    gap: 8,
    flex: 1,
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
  topActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  importBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F2FE',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  importBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  newBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  newBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 24,
    gap: 10,
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  currentCard: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
  },
  cardThumb: {
    width: 38,
    height: 38,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
    marginRight: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  currentBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginLeft: 6,
  },
  cardMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  actionIconBtn: {
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
