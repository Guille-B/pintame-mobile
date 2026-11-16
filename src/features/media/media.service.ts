import * as ImagePicker from 'expo-image-picker';
import type { LocalPhoto } from './media.types';

function mapAsset(
  asset: ImagePicker.ImagePickerAsset,
  source: LocalPhoto['source']
): LocalPhoto {
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    fileName: asset.fileName ?? undefined,
    mimeType: asset.mimeType ?? undefined,
    fileSize: asset.fileSize,
    source,
  };
}

/**
 * Ejercicio 1 (Clase 14): Selección desde galería del sistema.
 * Si la persona cancela voluntariamente, devuelve null sin lanzar error ficticio.
 */
export async function pickPhoto(): Promise<LocalPhoto | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 0.85,
  });

  if (result.canceled || !result.assets?.[0]) return null;
  return mapAsset(result.assets[0], 'library');
}

/**
 * Ejercicio 1 (Clase 14): Captura con cámara del sistema.
 * Solicita permiso explícito de cámara y devuelve null si el usuario cancela.
 */
export async function takeSystemPhoto(): Promise<LocalPhoto | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new Error('No se concedió permiso para usar la cámara.');
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 0.85,
  });

  if (result.canceled || !result.assets?.[0]) return null;
  return mapAsset(result.assets[0], 'camera');
}
