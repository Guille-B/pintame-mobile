import { useState } from 'react';
import {
  CurrentLocation,
  LocationPermissionState,
} from './location.types';
import {
  getCurrentLocation,
  getLastKnownLocation,
  requestLocationPermission,
} from './location.service';

export function useCurrentLocation() {
  const [location, setLocation] = useState<CurrentLocation | null>(null);
  const [lastKnown, setLastKnown] = useState<CurrentLocation | null>(null);
  const [permissionState, setPermissionState] =
    useState<LocationPermissionState>('undetermined');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function refresh() {
    if (isLoading) return;
    try {
      setError('');
      setIsLoading(true);

      const permission = await requestLocationPermission();
      if (permission.status !== 'granted') {
        setPermissionState('denied');
        setError(
          'Permiso de ubicación no concedido. Podés continuar operando la venta seleccionando la sucursal manualmente.'
        );
        return;
      }

      setPermissionState('granted');
      const current = await getCurrentLocation();
      setLocation(current);
    } catch {
      setError(
        'No fue posible obtener la ubicación. Verificá que los servicios de ubicación del dispositivo estén encendidos.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchLastKnown() {
    if (isLoading) return;
    try {
      setError('');
      setIsLoading(true);

      const permission = await requestLocationPermission();
      if (permission.status !== 'granted') {
        setPermissionState('denied');
        setError('Permiso de ubicación no concedido.');
        return;
      }

      setPermissionState('granted');
      const cached = await getLastKnownLocation();
      if (!cached) {
        setError('El sistema operativo no tiene una última ubicación conocida en caché.');
        return;
      }
      setLastKnown(cached);
    } catch {
      setError('No se pudo consultar la última ubicación conocida.');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    location,
    lastKnown,
    permissionState,
    isLoading,
    error,
    refresh,
    fetchLastKnown,
  };
}
