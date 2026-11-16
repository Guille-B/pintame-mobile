import * as Location from 'expo-location';
import { CurrentLocation, PrecisionClassification } from './location.types';

export async function requestLocationPermission() {
  return Location.requestForegroundPermissionsAsync();
}

export async function getCurrentLocation(): Promise<CurrentLocation> {
  const result = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: result.coords.latitude,
    longitude: result.coords.longitude,
    accuracy: result.coords.accuracy,
    timestamp: result.timestamp,
    source: 'current',
  };
}

export async function getLastKnownLocation(): Promise<CurrentLocation | null> {
  const result = await Location.getLastKnownPositionAsync();
  if (!result) return null;

  return {
    latitude: result.coords.latitude,
    longitude: result.coords.longitude,
    accuracy: result.coords.accuracy,
    timestamp: result.timestamp,
    source: 'last-known',
  };
}

/**
 * Clasificación visual de la precisión según Desafío de Integración (Clase 13, pág. 27):
 * - Buena: <= 25 m
 * - Aceptable: <= 100 m
 * - Baja: > 100 m o sin dato
 */
export function classifyLocationAccuracy(
  accuracy: number | null
): PrecisionClassification {
  if (accuracy === null) {
    return {
      level: 'baja',
      label: 'Precisión no informada',
      description: 'El proveedor del sistema no reportó radio de incertidumbre.',
    };
  }
  if (accuracy <= 25) {
    return {
      level: 'buena',
      label: 'Precisión Buena (<= 25 m)',
      description: 'Adecuada para verificar punto de entrega en obra o sucursal.',
    };
  }
  if (accuracy <= 100) {
    return {
      level: 'aceptable',
      label: 'Precisión Aceptable (26 a 100 m)',
      description: 'Útil para referencia de cuadra o zona urbana.',
    };
  }
  return {
    level: 'baja',
    label: 'Precisión Baja (> 100 m)',
    description: 'Posiblemente estimada por red celular o Wi-Fi; margen amplio.',
  };
}

export function formatMeasurementAge(timestamp: number): string {
  const diffSeconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (diffSeconds < 60) {
    return `medida hace ${diffSeconds} s`;
  }
  const diffMinutes = Math.round(diffSeconds / 60);
  return `medida hace ${diffMinutes} min`;
}
