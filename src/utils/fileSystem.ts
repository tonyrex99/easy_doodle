import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { DoodleProject } from '../types/doodle';

const PROJECTS_STORAGE_KEY = '@easy_doodle_projects_v1';
const AUTORECOVERY_DRAFT_KEY = '@easy_doodle_autorecovery_draft';

/**
 * Get all saved doodle projects from local storage
 */
export async function getSavedProjects(): Promise<DoodleProject[]> {
  try {
    const raw = await AsyncStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) return [];
    const list: DoodleProject[] = JSON.parse(raw);
    return list.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error('Error fetching saved doodles:', error);
    return [];
  }
}

/**
 * Save or update a doodle project in local storage
 */
export async function saveProject(project: DoodleProject): Promise<DoodleProject> {
  const projects = await getSavedProjects();
  const existingIdx = projects.findIndex((p) => p.id === project.id);

  const updatedProject: DoodleProject = {
    ...project,
    updatedAt: Date.now(),
  };

  if (existingIdx >= 0) {
    projects[existingIdx] = updatedProject;
  } else {
    projects.unshift(updatedProject);
  }

  await AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  return updatedProject;
}

/**
 * Delete a doodle project
 */
export async function deleteProject(id: string): Promise<void> {
  const projects = await getSavedProjects();
  const filtered = projects.filter((p) => p.id !== id);
  await AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Export a doodle project as a .doodle JSON file
 */
export async function exportDoodleFile(project: DoodleProject): Promise<string> {
  const sanitizedTitle = (project.title || 'untitled_doodle')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_');
  const fileName = `${sanitizedTitle}_${Date.now()}.doodle`;
  const baseDir = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';
  const fileUri = `${baseDir}${fileName}`;

  const fileData = JSON.stringify(project, null, 2);
  await FileSystem.writeAsStringAsync(fileUri, fileData, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return fileUri;
}

/**
 * Share a .doodle file using the native share sheet
 */
export async function shareDoodleFile(project: DoodleProject): Promise<void> {
  const available = await Sharing.isAvailableAsync();
  if (!available) {
    throw new Error('Sharing is not available on this device');
  }

  const fileUri = await exportDoodleFile(project);
  await Sharing.shareAsync(fileUri, {
    mimeType: 'application/json',
    dialogTitle: `Share "${project.title}" (.doodle)`,
    UTI: 'public.json',
  });
}

/**
 * Import a .doodle file from a given device URI (e.g. from an Android Intent / linked URL)
 */
export async function importDoodleFromUri(uri: string): Promise<DoodleProject | null> {
  try {
    const fileContent = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    const parsed = JSON.parse(fileContent);

    if (!parsed || !Array.isArray(parsed.paths) || !parsed.canvasSettings) {
      throw new Error('File does not appear to be a valid .doodle file');
    }

    const importedProject: DoodleProject = {
      ...parsed,
      id: `opened_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: parsed.title || 'Opened Doodle',
      updatedAt: Date.now(),
    };

    await saveProject(importedProject);
    return importedProject;
  } catch (err: any) {
    console.error('Failed to import doodle from uri:', err);
    throw err;
  }
}

/**
 * Import a .doodle file from device storage via document picker
 */
export async function importDoodleFromFile(): Promise<DoodleProject | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const file = result.assets[0];
    return await importDoodleFromUri(file.uri);
  } catch (err: any) {
    console.error('Failed to import doodle file:', err);
    throw err;
  }
}

/**
 * Word-style Auto-Recovery Draft System:
 * Keeps an ongoing emergency snapshot of unsaved changes and drawing state
 */
export interface AutoRecoveryDraft {
  project: DoodleProject;
  isDirty: boolean;
  timestamp: number;
}

export async function saveAutoRecoveryDraft(project: DoodleProject, isDirty: boolean): Promise<void> {
  try {
    const draft: AutoRecoveryDraft = {
      project,
      isDirty,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(AUTORECOVERY_DRAFT_KEY, JSON.stringify(draft));
  } catch (err) {
    console.warn('Could not save auto-recovery draft:', err);
  }
}

export async function getAutoRecoveryDraft(): Promise<AutoRecoveryDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(AUTORECOVERY_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearAutoRecoveryDraft(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTORECOVERY_DRAFT_KEY);
  } catch (err) {
    console.warn('Could not clear auto-recovery draft:', err);
  }
}
