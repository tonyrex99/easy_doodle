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
            size={22}
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
            {isCurrent && <Text style={styles.currentBadge}>CURRENT</Text>}
          </View>
          <Text style={styles.cardMeta}>
            {formatDate(item.updatedAt)} • {item.paths.length} strokes •{' '}
            {item.canvasSettings.gridType}
          </Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionIconBtn}
            onPress={() => handleShareFile(item)}
            accessibilityLabel="Share File"
          >
            <Ionicons name="share-social-outline" size={18} color="#0284C7" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionIconBtn}
            onPress={() => handleDuplicate(item)}
            accessibilityLabel="Duplicate"
          >
            <Ionicons name="copy-outline" size={18} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionIconBtn}
            onPress={() => handleDelete(item)}
            accessibilityLabel="Delete"
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
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
              <Ionicons name="folder-open" size={24} color="#0284C7" />
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
              <Ionicons name="document-attach-outline" size={18} color="#0284C7" />
              <Text style={styles.importBtnText}>Open .doodle File</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.newBtn}
              onPress={() => {
                onNewDoodle();
                onClose();
              }}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.newBtnText}>New Canvas</Text>
            </TouchableOpacity>
          </View>

          {/* List of projects */}
          {loading ? (
            <ActivityIndicator size="large" color="#0284C7" style={{ marginVertical: 40 }} />
          ) : projects.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="edit-3" size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No Doodles Saved Yet</Text>
              <Text style={styles.emptySubtitle}>
                Draw something and tap Save to store your artwork or export .doodle files!
              </Text>
            </View>
          ) : (
            <FlatList
              data={projects}
              keyExtractor={(item) => item.id}
              renderItem={renderProjectItem}
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
    paddingBottom: 30,
    height: '80%',
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
  topActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
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
    paddingBottom: 20,
    gap: 10,
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  currentCard: {
    borderColor: '#0284C7',
    borderWidth: 1.5,
  },
  cardThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  currentBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  cardMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionIconBtn: {
    padding: 8,
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

