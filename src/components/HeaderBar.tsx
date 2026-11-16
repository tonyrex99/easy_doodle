import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface HeaderBarProps {
  title: string;
  onChangeTitle: (title: string) => void;
  onNew: () => void;
  onSave: () => void;
  onOpenGallery: () => void;
  onToggleGridSettings: () => void;
  onStartCrop: () => void;
  onOpenShareModal: () => void;
  isCropModeActive?: boolean;
}

export function HeaderBar({
  title,
  onChangeTitle,
  onNew,
  onSave,
  onOpenGallery,
  onToggleGridSettings,
  onStartCrop,
  onOpenShareModal,
  isCropModeActive,
}: HeaderBarProps) {
  return (
    <View style={styles.container}>
      {/* Left Group: Logo/App Title & Project Name */}
      <View style={styles.leftGroup}>
        <View style={styles.logoBadge}>
          <MaterialCommunityIcons name="draw" size={20} color="#FFFFFF" />
        </View>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={onChangeTitle}
          placeholder="Untitled Doodle"
          placeholderTextColor="#94A3B8"
          maxLength={24}
        />
      </View>

      {/* Right Action Icons */}
      <View style={styles.actions}>
        {/* New Doodle */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onNew}
          accessibilityLabel="New Doodle"
        >
          <Ionicons name="add-outline" size={22} color="#0F172A" />
        </TouchableOpacity>

        {/* Save */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onSave}
          accessibilityLabel="Save Doodle"
        >
          <Ionicons name="save-outline" size={20} color="#0F172A" />
        </TouchableOpacity>

        {/* Open Gallery / Doodle Files */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onOpenGallery}
          accessibilityLabel="Open Doodles"
        >
          <Ionicons name="folder-open-outline" size={20} color="#0F172A" />
        </TouchableOpacity>

        {/* Grid & Background */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onToggleGridSettings}
          accessibilityLabel="Grid Settings"
        >
          <MaterialCommunityIcons name="grid" size={20} color="#0F172A" />
        </TouchableOpacity>

        {/* Area Screen Grab / Crop */}
        <TouchableOpacity
          style={[styles.actionBtn, isCropModeActive && styles.cropActiveBtn]}
          onPress={onStartCrop}
          accessibilityLabel="Area Screen Grab"
        >
          <Ionicons
            name="crop-outline"
            size={20}
            color={isCropModeActive ? '#FFFFFF' : '#0284C7'}
          />
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity
          style={styles.shareHeaderBtn}
          onPress={onOpenShareModal}
          accessibilityLabel="Share"
        >
          <Ionicons name="share-social-outline" size={19} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 6,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleInput: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropActiveBtn: {
    backgroundColor: '#0284C7',
  },
  shareHeaderBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

