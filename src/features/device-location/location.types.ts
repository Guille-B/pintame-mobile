export type CurrentLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
  source: 'current' | 'last-known';
};

export type LocationPermissionState = 'undetermined' | 'granted' | 'denied';

export type PrecisionClassification = {
  level: 'buena' | 'aceptable' | 'baja';
  label: string;
  description: string;
};
