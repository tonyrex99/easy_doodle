import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

interface HeaderBarProps {
  title: string;
  versionNumber: number;
  onChangeTitle: (title: string) => void;
  onNew: () => void;
  onSave: () => void;
  onOpenVersionHistory: () => void;
  onOpenGallery: () => void;
  onToggleGridSettings: () => void;
  onStartCrop: () => void;
  onOpenShareModal: () => void;
  isCropModeActive?: boolean;
}

export function HeaderBar({
  title,
  versionNumber,
  onChangeTitle,
  onNew,
  onSave,
  onOpenVersionHistory,
  onOpenGallery,
  onToggleGridSettings,
  onStartCrop,
  onOpenShareModal,
  isCropModeActive,
}: HeaderBarProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <View style={styles.wrapper}>
      {/* Top Row: App Logo, Doodle Title, Version Pill, and New Doodle */}
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="draw" size={18} color="#FFFFFF" />
          </View>

          {/* Editable Title with Pencil Icon */}
          <View style={styles.titleInputContainer}>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={onChangeTitle}
              placeholder="Untitled Doodle"
              placeholderTextColor="#94A3B8"
              maxLength={28}
              onFocus={() => setIsEditingTitle(true)}
              onBlur={() => setIsEditingTitle(false)}
            />
            <Feather
              name="edit-3"
              size={14}
              color={isEditingTitle ? '#0284C7' : '#94A3B8'}
              style={styles.editIcon}
            />
          </View>
        </View>

        {/* Right Info: Version Pill & New Doodle */}
        <View style={styles.topRightGroup}>
          <TouchableOpacity
            style={styles.versionBadge}
            onPress={onOpenVersionHistory}
            accessibilityLabel="Version History"
          >
            <MaterialCommunityIcons name="source-branch" size={13} color="#0284C7" />
            <Text style={styles.versionBadgeText}>v{versionNumber}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.newDoodleBtn}
            onPress={onNew}
            accessibilityLabel="Create New Doodle"
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.newDoodleBtnText}>New</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Action Ribbon: Quick Actions */}
      <View style={styles.actionRibbon}>
        <TouchableOpacity
          style={styles.actionPillBtn}
          onPress={onSave}
          accessibilityLabel="Save & Versions"
        >
          <Ionicons name="save-outline" size={16} color="#0F172A" />
          <Text style={styles.actionBtnLabel}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionPillBtn}
          onPress={onOpenVersionHistory}
          accessibilityLabel="Version History"
        >
          <MaterialCommunityIcons name="history" size={17} color="#0284C7" />
          <Text style={[styles.actionBtnLabel, { color: '#0284C7' }]}>Versions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionPillBtn}
          onPress={onOpenGallery}
          accessibilityLabel="Files & Gallery"
        >
          <Ionicons name="folder-open-outline" size={16} color="#0F172A" />
          <Text style={styles.actionBtnLabel}>Files</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionPillBtn}
          onPress={onToggleGridSettings}
          accessibilityLabel="Grid & Paper"
        >
          <MaterialCommunityIcons name="grid" size={16} color="#0F172A" />
          <Text style={styles.actionBtnLabel}>Grid</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionPillBtn, isCropModeActive && styles.cropActivePill]}
          onPress={onStartCrop}
          accessibilityLabel="Area Screen Grab"
        >
          <Ionicons
            name="crop-outline"
            size={16}
            color={isCropModeActive ? '#FFFFFF' : '#0284C7'}
          />
          <Text
            style={[
              styles.actionBtnLabel,
              isCropModeActive ? { color: '#FFFFFF' } : { color: '#0284C7' },
            ]}
          >
            Snip
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sharePillBtn}
          onPress={onOpenShareModal}
          accessibilityLabel="Share Doodle"
        >
          <Ionicons name="share-social-outline" size={16} color="#FFFFFF" />
          <Text style={styles.shareBtnText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    gap: 8,
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  titleInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    paddingVertical: 4,
  },
  editIcon: {
    marginLeft: 4,
  },
  topRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 3,
  },
  versionBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  newDoodleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 3,
  },
  newDoodleBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  actionRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    paddingTop: 2,
  },
  actionPillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  cropActivePill: {
    backgroundColor: '#0284C7',
  },
  actionBtnLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  sharePillBtn: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  shareBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
