import { captureRef } from 'react-native-view-shot';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Image, Platform } from 'react-native';
import { CropRect } from '../types/doodle';

export interface CaptureOptions {
  canvasWidth: number;
  canvasHeight: number;
  cropRect?: CropRect | null;
  format?: 'png' | 'jpg';
  quality?: number;
}

/**
 * Gets real pixel dimensions of an image URI
 */
function getImageSizeAsync(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    );
  });
}

/**
 * Captures full canvas or crops a designated region and returns the image URI.
 * Handles device pixel ratio scaling properly so the cropped region matches exactly what the user selected.
 */
export async function captureCanvas(
  viewRef: any,
  options: CaptureOptions
): Promise<string> {
  if (!viewRef) {
    throw new Error('Canvas reference is not available');
  }

  // 1. Capture canvas view
  const fullImageUri = await captureRef(viewRef, {
    format: options.format || 'png',
    quality: options.quality ?? 1.0,
    result: 'tmpfile',
  });

  // If no crop is specified, return full capture
  if (!options.cropRect) {
    return fullImageUri;
  }

  const { x, y, width, height } = options.cropRect;
  if (width <= 5 || height <= 5) {
    return fullImageUri;
  }

  // 2. Measure actual image pixel dimensions to calculate exact scaling factor
  let realWidth = options.canvasWidth;
  let realHeight = options.canvasHeight;
  try {
    const size = await getImageSizeAsync(fullImageUri);
    if (size.width > 0 && size.height > 0) {
      realWidth = size.width;
      realHeight = size.height;
    }
  } catch {
    // Fallback to 1:1 if dimension reading fails
  }

  const scaleX = realWidth / Math.max(1, options.canvasWidth);
  const scaleY = realHeight / Math.max(1, options.canvasHeight);

  // 3. Compute pixel-accurate crop coordinates bounded by real image limits
  const originX = Math.min(Math.max(0, Math.round(x * scaleX)), Math.max(0, realWidth - 2));
  const originY = Math.min(Math.max(0, Math.round(y * scaleY)), Math.max(0, realHeight - 2));
  const cropW = Math.min(Math.max(2, Math.round(width * scaleX)), realWidth - originX);
  const cropH = Math.min(Math.max(2, Math.round(height * scaleY)), realHeight - originY);

  const manipulated = await ImageManipulator.manipulateAsync(
    fullImageUri,
    [
      {
        crop: {
          originX,
          originY,
          width: cropW,
          height: cropH,
        },
      },
    ],
    {
      format: ImageManipulator.SaveFormat.PNG,
      compress: 1.0,
    }
  );

  return manipulated.uri;
}

/**
 * Share an image URI using native share dialog
 */
export async function shareImage(imageUri: string, title: string = 'Easy Doodle'): Promise<void> {
  const available = await Sharing.isAvailableAsync();
  if (!available) {
    throw new Error('Sharing is not available on this device');
  }

  await Sharing.shareAsync(imageUri, {
    mimeType: 'image/png',
    dialogTitle: title,
    UTI: 'public.png',
  });
}

/**
 * Save an image directly to the user's camera roll / media library.
 * Handles Android 10+ scoped storage safely and avoids false permission failures.
 */
export async function saveImageToGallery(imageUri: string): Promise<boolean> {
  try {
    // Check existing permission first
    let permission = await MediaLibrary.getPermissionsAsync();
    if (permission.status !== 'granted') {
      permission = await MediaLibrary.requestPermissionsAsync();
    }

    if (permission.status !== 'granted') {
      return false;
    }

    // Save asset to system gallery
    const asset = await MediaLibrary.createAssetAsync(imageUri);

    // Try organizing into Easy Doodle album (optional on scoped storage)
    try {
      if (Platform.OS !== 'web') {
        const album = await MediaLibrary.getAlbumAsync('Easy Doodle');
        if (album == null) {
          await MediaLibrary.createAlbumAsync('Easy Doodle', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      }
    } catch {
      // Album grouping is non-fatal: asset is already in Pictures/DCIM
    }

    return true;
  } catch (err) {
    console.error('Failed to save image to gallery:', err);
    return false;
  }
}
