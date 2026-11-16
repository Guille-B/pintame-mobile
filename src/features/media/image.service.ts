import { Platform } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { File } from 'expo-file-system';
import type { OptimizationComparison, OptimizedPhoto } from './media.types';

async function resolveUriSizeBytes(uri: string): Promise<number | null> {
  if (Platform.OS !== 'web') {
    try {
      const file = new File(uri);
      if (typeof file.size === 'number' && file.size > 0) {
        return file.size;
      }
    } catch {
      // Fallback abajo
    }
  }

  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob.size;
  } catch {
    return null;
  }
}

export function fileSizeInBytes(uri: string): number | null {
  if (Platform.OS === 'web') return null;
  try {
    return new File(uri).size ?? null;
  } catch {
    return null;
  }
}

/**
 * Ejercicio 3 (Clase 14): Optimización de archivo con la API contextual moderna
 * de expo-image-manipulator (ImageManipulator.manipulate -> resize -> renderAsync -> saveAsync)
 * y medición de bytes con File de expo-file-system (con soporte compatible para Expo Web).
 */
export async function optimizePhoto(uri: string): Promise<OptimizedPhoto> {
  const context = ImageManipulator.manipulate(uri);
  context.resize({ width: 1024, height: null });
  const rendered = await context.renderAsync();
  const result = await rendered.saveAsync({
    compress: 0.75,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  const sizeBytes = await resolveUriSizeBytes(result.uri);

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
    sizeBytes,
  };
}

export async function compareAndOptimizePhoto(
  uri: string,
  fallbackBeforeBytes?: number
): Promise<OptimizationComparison> {
  const beforeBytes =
    fileSizeInBytes(uri) ??
    (await resolveUriSizeBytes(uri)) ??
    fallbackBeforeBytes ??
    null;
  const optimizedPhoto = await optimizePhoto(uri);
  const afterBytes = optimizedPhoto.sizeBytes;

  let reductionPercent: number | null = null;
  if (beforeBytes !== null && afterBytes !== null && beforeBytes > 0) {
    reductionPercent = Number(
      (100 * (1 - afterBytes / beforeBytes)).toFixed(1)
    );
  }

  return {
    beforeBytes,
    afterBytes,
    reductionPercent,
    optimizedPhoto,
  };
}
