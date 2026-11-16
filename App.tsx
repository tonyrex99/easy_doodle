import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Canvas, CanvasHandle } from './src/components/Canvas';
import { HeaderBar } from './src/components/HeaderBar';
import { ToolBar } from './src/components/ToolBar';
import { ColorPickerModal } from './src/components/ColorPickerModal';
import { GridSelectorModal } from './src/components/GridSelectorModal';
import { DoodleGalleryModal } from './src/components/DoodleGalleryModal';
import { ShareModal } from './src/components/ShareModal';
import { CropAreaOverlay } from './src/components/CropAreaOverlay';
import { SaveOptionsModal } from './src/components/SaveOptionsModal';
import { VersionHistoryModal } from './src/components/VersionHistoryModal';
import { useDrawingHistory } from './src/hooks/useDrawingHistory';
import {
  DrawingTool,
  CanvasSettings,
  DoodleProject,
  DoodleVersionSnapshot,
  CropRect,
} from './src/types/doodle';
import { DEFAULT_CANVAS_SETTINGS } from './src/constants/colors';
import { saveProject, shareDoodleFile } from './src/utils/fileSystem';
import {
  captureCanvas,
  shareImage,
  saveImageToGallery,
} from './src/utils/cropCapture';

export default function App() {
  const [projectId, setProjectId] = useState<string>(
    () => `doodle_${Date.now()}`
  );
  const [projectTitle, setProjectTitle] = useState('My Doodle');
  const [versionNumber, setVersionNumber] = useState(1);
  const [versionHistory, setVersionHistory] = useState<DoodleVersionSnapshot[]>([]);
  const [activeTool, setActiveTool] = useState<DrawingTool>('pen');
  const [activeColor, setActiveColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [recentColors, setRecentColors] = useState<string[]>([
    '#000000',
    '#ED1C24',
    '#00A2E8',
    '#22B14C',
  ]);
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>(
    DEFAULT_CANVAS_SETTINGS
  );

  // Modals state
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [gridSettingsVisible, setGridSettingsVisible] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [saveOptionsVisible, setSaveOptionsVisible] = useState(false);
  const [versionHistoryVisible, setVersionHistoryVisible] = useState(false);
  const [isCropModeActive, setIsCropModeActive] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [busyMessage, setBusyMessage] = useState('');

  // Canvas ref
  const canvasRef = useRef<CanvasHandle>(null);

  // Drawing History (Undo/Redo)
  const {
    paths,
    addPath,
    undo,
    redo,
    clearCanvas,
    loadPaths,
    canUndo,
    canRedo,
  } = useDrawingHistory();

  // Color selection helper
  const handleSelectColor = useCallback((color: string) => {
    setActiveColor(color);
    setRecentColors((prev) => {
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== color.toLowerCase()
      );
      return [color, ...filtered].slice(0, 12);
    });
  }, []);

  // New Doodle
  const handleNewDoodle = useCallback(() => {
    if (paths.length > 0) {
      Alert.alert(
        'Create New Doodle',
        'Would you like to start a fresh canvas? Unsaved changes will be discarded.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'New Doodle',
            style: 'destructive',
            onPress: () => {
              setProjectId(`doodle_${Date.now()}`);
              setProjectTitle('My Doodle');
              setVersionNumber(1);
              setVersionHistory([]);
              loadPaths([]);
              setCanvasSettings(DEFAULT_CANVAS_SETTINGS);
              setIsCropModeActive(false);
            },
          },
        ]
      );
    } else {
      setProjectId(`doodle_${Date.now()}`);
      setProjectTitle('My Doodle');
      setVersionNumber(1);
      setVersionHistory([]);
      loadPaths([]);
      setCanvasSettings(DEFAULT_CANVAS_SETTINGS);
      setIsCropModeActive(false);
    }
  }, [paths.length, loadPaths]);

  // Current project representation
  const getCurrentProject = useCallback((): DoodleProject => {
    return {
      id: projectId,
      title: projectTitle || 'Untitled Doodle',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      paths,
      canvasSettings,
      version: '1.0',
      versionNumber,
      versionHistory,
    };
  }, [projectId, projectTitle, paths, canvasSettings, versionNumber, versionHistory]);

  // Quick Save (Overwrite Current)
  const handleQuickSave = useCallback(async () => {
    try {
      setIsBusy(true);
      setBusyMessage('Saving doodle...');
      const project = getCurrentProject();
      await saveProject(project);
      Alert.alert('Saved', `"${project.title}" saved successfully!`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save doodle');
    } finally {
      setIsBusy(false);
    }
  }, [getCurrentProject]);

  // Save as New Version with auto-generated or custom label
  const handleSaveAsVersion = useCallback(
    async (versionLabel: string, note?: string) => {
      try {
        setIsBusy(true);
        setBusyMessage('Creating new version snapshot...');
        const nextVer = versionNumber + 1;
        const newSnapshot: DoodleVersionSnapshot = {
          id: `ver_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          versionNumber: nextVer,
          label: versionLabel,
          timestamp: Date.now(),
          paths: [...paths],
          canvasSettings: { ...canvasSettings },
          strokeCount: paths.length,
          note: note || undefined,
        };

        const updatedHistory = [newSnapshot, ...versionHistory];
        const updatedProject: DoodleProject = {
          ...getCurrentProject(),
          versionNumber: nextVer,
          versionHistory: updatedHistory,
          updatedAt: Date.now(),
        };

        await saveProject(updatedProject);
        setVersionNumber(nextVer);
        setVersionHistory(updatedHistory);
        Alert.alert(
          'Version Saved!',
          `Created "${versionLabel}" with ${paths.length} strokes. You can restore this version anytime from Version History.`
        );
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to save version');
      } finally {
        setIsBusy(false);
      }
    },
    [versionNumber, versionHistory, paths, canvasSettings, getCurrentProject]
  );

  // Save as a separate copy
  const handleSaveAsNewProject = useCallback(
    async (newTitle: string) => {
      try {
        setIsBusy(true);
        setBusyMessage('Creating copy...');
        const newProjId = `doodle_${Date.now()}`;
        const copiedProject: DoodleProject = {
          ...getCurrentProject(),
          id: newProjId,
          title: newTitle,
          versionNumber: 1,
          versionHistory: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await saveProject(copiedProject);
        setProjectId(newProjId);
        setProjectTitle(newTitle);
        setVersionNumber(1);
        setVersionHistory([]);
        Alert.alert('Copy Saved', `Saved as new project "${newTitle}"!`);
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to create copy');
      } finally {
        setIsBusy(false);
      }
    },
    [getCurrentProject]
  );

  // Restore previous version
  const handleRestoreVersion = useCallback(
    (snapshot: DoodleVersionSnapshot) => {
      loadPaths(snapshot.paths || []);
      setCanvasSettings(snapshot.canvasSettings || DEFAULT_CANVAS_SETTINGS);
      setVersionNumber(snapshot.versionNumber);
      Alert.alert(
        'Version Restored',
        `Reverted to "${snapshot.label}". You can undo this change using the Undo button.`
      );
    },
    [loadPaths]
  );

  // Export a specific historical version as .doodle
  const handleExportVersion = useCallback(
    async (snapshot: DoodleVersionSnapshot) => {
      try {
        setIsBusy(true);
        setBusyMessage('Exporting version...');
        const tempProject: DoodleProject = {
          id: `export_${snapshot.id}`,
          title: `${projectTitle} (${snapshot.label})`,
          createdAt: snapshot.timestamp,
          updatedAt: snapshot.timestamp,
          paths: snapshot.paths,
          canvasSettings: snapshot.canvasSettings,
          version: '1.0',
        };
        await shareDoodleFile(tempProject);
      } catch (err: any) {
        Alert.alert('Export Error', err.message || 'Failed to export version');
      } finally {
        setIsBusy(false);
      }
    },
    [projectTitle]
  );

  // Delete a specific historical snapshot
  const handleDeleteVersion = useCallback(
    async (snapshotId: string) => {
      const updatedHistory = versionHistory.filter((v) => v.id !== snapshotId);
      setVersionHistory(updatedHistory);
      const updatedProject: DoodleProject = {
        ...getCurrentProject(),
        versionHistory: updatedHistory,
      };
      await saveProject(updatedProject);
    },
    [versionHistory, getCurrentProject]
  );

  // Open Project from Gallery or File
  const handleOpenProject = useCallback(
    (project: DoodleProject) => {
      setProjectId(project.id);
      setProjectTitle(project.title);
      setVersionNumber(project.versionNumber || 1);
      setVersionHistory(project.versionHistory || []);
      setCanvasSettings(project.canvasSettings || DEFAULT_CANVAS_SETTINGS);
      loadPaths(project.paths || []);
      setIsCropModeActive(false);
    },
    [loadPaths]
  );

  // Clear Canvas with confirmation
  const handleClearWithConfirm = useCallback(() => {
    if (paths.length === 0) return;
    Alert.alert(
      'Clear Canvas',
      'Are you sure you want to clear the entire canvas?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearCanvas,
        },
      ]
    );
  }, [paths.length, clearCanvas]);

  // Share full drawing
  const handleShareFullImage = useCallback(async () => {
    if (!canvasRef.current?.viewShotRef.current) return;
    try {
      setIsBusy(true);
      setBusyMessage('Preparing full drawing...');
      const uri = await captureCanvas(canvasRef.current.viewShotRef.current, {
        canvasWidth: canvasRef.current.dimensions.width,
        canvasHeight: canvasRef.current.dimensions.height,
      });
      await shareImage(uri, `${projectTitle} - Easy Doodle`);
    } catch (err: any) {
      Alert.alert('Export Error', err.message || 'Could not export drawing');
    } finally {
      setIsBusy(false);
    }
  }, [projectTitle]);

  // Save full image to device gallery
  const handleSaveFullImage = useCallback(async () => {
    if (!canvasRef.current?.viewShotRef.current) return;
    try {
      setIsBusy(true);
      setBusyMessage('Saving image to gallery...');
      const uri = await captureCanvas(canvasRef.current.viewShotRef.current, {
        canvasWidth: canvasRef.current.dimensions.width,
        canvasHeight: canvasRef.current.dimensions.height,
      });
      const saved = await saveImageToGallery(uri);
      if (saved) {
        Alert.alert('Saved to Photos', 'Drawing saved to your photo album!');
      } else {
        Alert.alert(
          'Permission Required',
          'Please grant photo library access to save doodles to your device gallery.'
        );
      }
    } catch (err: any) {
      Alert.alert('Save Error', err.message || 'Could not save image');
    } finally {
      setIsBusy(false);
    }
  }, []);

  // Share .doodle file
  const handleShareProjectFile = useCallback(async () => {
    try {
      setIsBusy(true);
      setBusyMessage('Preparing .doodle project file...');
      const project = getCurrentProject();
      await shareDoodleFile(project);
    } catch (err: any) {
      Alert.alert('Share Error', err.message || 'Could not share .doodle file');
    } finally {
      setIsBusy(false);
    }
  }, [getCurrentProject]);

  // Handle Area Screen Grab Crop Confirm
  const handleConfirmCrop = useCallback(
    async (cropRect: CropRect, action: 'share' | 'save') => {
      if (!canvasRef.current?.viewShotRef.current) return;
      try {
        setIsBusy(true);
        setBusyMessage('Capturing selected area...');
        const uri = await captureCanvas(canvasRef.current.viewShotRef.current, {
          canvasWidth: canvasRef.current.dimensions.width,
          canvasHeight: canvasRef.current.dimensions.height,
          cropRect,
        });

        if (action === 'share') {
          await shareImage(uri, `${projectTitle} (Clipped) - Easy Doodle`);
        } else {
          const saved = await saveImageToGallery(uri);
          if (saved) {
            Alert.alert(
              'Area Grab Saved',
              'The cropped section was saved to your photo album!'
            );
          } else {
            Alert.alert(
              'Permission Required',
              'Please allow photo access to save images.'
            );
          }
        }
        setIsCropModeActive(false);
      } catch (err: any) {
        Alert.alert('Capture Error', err.message || 'Failed to capture area');
      } finally {
        setIsBusy(false);
      }
    },
    [projectTitle]
  );

  const canvasWidth = canvasRef.current?.dimensions.width || 360;
  const canvasHeight = canvasRef.current?.dimensions.height || 600;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />

        {/* Top Header Bar */}
        <HeaderBar
          title={projectTitle}
          versionNumber={versionNumber}
          onChangeTitle={setProjectTitle}
          onNew={handleNewDoodle}
          onSave={() => setSaveOptionsVisible(true)}
          onOpenVersionHistory={() => setVersionHistoryVisible(true)}
          onOpenGallery={() => setGalleryVisible(true)}
          onToggleGridSettings={() => setGridSettingsVisible(true)}
          onStartCrop={() => {
            canvasRef.current?.resetZoom?.();
            setIsCropModeActive((prev) => !prev);
          }}
          onOpenShareModal={() => setShareModalVisible(true)}
          isCropModeActive={isCropModeActive}
        />

        {/* Drawing Canvas Area */}
        <View style={styles.canvasWrapper}>
          <Canvas
            ref={canvasRef}
            paths={paths}
            onAddPath={addPath}
            activeTool={activeTool}
            activeColor={activeColor}
            strokeWidth={strokeWidth}
            canvasSettings={canvasSettings}
            isCropModeActive={isCropModeActive}
          />

          {/* Area Screen Grab / Resizable Viewfinder Overlay */}
          {isCropModeActive && (
            <CropAreaOverlay
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              onCancel={() => setIsCropModeActive(false)}
              onConfirmCrop={handleConfirmCrop}
            />
          )}
        </View>

        {/* Bottom Toolbar with MS Paint Ribbon, tools, undo/redo */}
        <ToolBar
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          activeColor={activeColor}
          onOpenColorPicker={() => setColorPickerVisible(true)}
          strokeWidth={strokeWidth}
          onChangeStrokeWidth={setStrokeWidth}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onClear={handleClearWithConfirm}
          onSelectQuickColor={handleSelectColor}
        />

        {/* Color Picker Modal */}
        <ColorPickerModal
          visible={colorPickerVisible}
          activeColor={activeColor}
          onSelectColor={handleSelectColor}
          onClose={() => setColorPickerVisible(false)}
        />

        {/* Grid & Canvas Background Settings Modal */}
        <GridSelectorModal
          visible={gridSettingsVisible}
          settings={canvasSettings}
          onChangeSettings={setCanvasSettings}
          onClose={() => setGridSettingsVisible(false)}
        />

        {/* Saved Doodles Gallery & File Import Modal */}
        <DoodleGalleryModal
          visible={galleryVisible}
          currentProjectId={projectId}
          onOpenProject={handleOpenProject}
          onClose={() => setGalleryVisible(false)}
          onNewDoodle={handleNewDoodle}
        />

        {/* Share & Export Options Modal */}
        <ShareModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          onShareFullImage={handleShareFullImage}
          onSaveFullImage={handleSaveFullImage}
          onShareProjectFile={handleShareProjectFile}
          onStartCropMode={() => setIsCropModeActive(true)}
        />

        {/* Save & Versions Options Modal */}
        <SaveOptionsModal
          visible={saveOptionsVisible}
          projectTitle={projectTitle}
          currentVersionNumber={versionNumber}
          versionCount={versionHistory.length}
          onClose={() => setSaveOptionsVisible(false)}
          onQuickSave={handleQuickSave}
          onSaveAsVersion={handleSaveAsVersion}
          onSaveAsNewProject={handleSaveAsNewProject}
          onOpenVersionHistory={() => setVersionHistoryVisible(true)}
        />

        {/* Version History Timeline Modal */}
        <VersionHistoryModal
          visible={versionHistoryVisible}
          projectTitle={projectTitle}
          versions={versionHistory}
          currentVersionNumber={versionNumber}
          onClose={() => setVersionHistoryVisible(false)}
          onRestoreVersion={handleRestoreVersion}
          onExportVersion={handleExportVersion}
          onDeleteVersion={handleDeleteVersion}
          onCreateSnapshotNow={() => setSaveOptionsVisible(true)}
        />

        {/* Loading Overlay */}
        {isBusy && (
          <View style={styles.busyOverlay}>
            <View style={styles.busyCard}>
              <ActivityIndicator size="large" color="#0284C7" />
              <Text style={styles.busyText}>{busyMessage}</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  canvasWrapper: {
    flex: 1,
    position: 'relative',
  },
  busyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  busyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  busyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
});
