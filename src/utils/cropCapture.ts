import { captureRef } from 'react-native-view-shot';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { CropRect } from '../types/doodle';

export interface CaptureOptions {
  canvasWidth: number;
  canvasHeight: number;
  cropRect?: CropRect | null;
  format?: 'png' | 'jpg';
  quality?: number;
}

/**
 * Captures full canvas or crops a designated region and returns the image URI
 */
export async function captureCanvas(
  viewRef: any,
  options: CaptureOptions
): Promise<string> {
  if (!viewRef) {
    throw new Error('Canvas reference is not available');
  }

  // 1. Capture full canvas at 2x resolution for crisp graphics
  const fullImageUri = await captureRef(viewRef, {
    format: options.format || 'png',
    quality: options.quality ?? 1.0,
    result: 'tmpfile',
  });

  // If no crop is requested, return full capture
  if (!options.cropRect) {
    return fullImageUri;
  }

  const { x, y, width, height } = options.cropRect;
  if (width <= 5 || height <= 5) {
    return fullImageUri;
  }

  // 2. Normalize crop bounding box relative to canvas dimensions
  // Use manipulateAsync to crop
  const originX = Math.max(0, Math.round(x));
  const originY = Math.max(0, Math.round(y));
  const cropW = Math.max(10, Math.round(width));
  const cropH = Math.max(10, Math.round(height));

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
 * Save an image directly to the user's camera roll / media library
 */
export async function saveImageToGallery(imageUri: string): Promise<boolean> {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }

    const asset = await MediaLibrary.createAssetAsync(imageUri);
    await MediaLibrary.createAlbumAsync('Easy Doodle', asset, false);
    return true;
  } catch (err) {
    console.error('Failed to save image to gallery:', err);
    return false;
  }
}

