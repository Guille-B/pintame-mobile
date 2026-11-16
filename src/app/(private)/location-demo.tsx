import { StyleSheet, Text } from 'react-native';
import { useCurrentLocation } from '@/features/device-location/useCurrentLocation';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LocationCard } from '@/components/location/LocationCard';
import { LocationPermissionState } from '@/components/location/LocationPermissionState';
import { theme } from '@/constants/theme';

export default function LocationDemoScreen() {
  const {
    location,
    lastKnown,
    permissionState,
    isLoading,
    error,
    refresh,
    fetchLastKnown,
  } = useCurrentLocation();

  return (
    <Screen>
      <SectionHeader
        title="Logística y Punto de Entrega"
        subtitle="Verificación geográfica para despacho de pedidos en obra y control de sucursal"
      />

      <LocationPermissionState state={permissionState} onRequest={refresh} />

      {error ? (
        <FeedbackState
          variant="error"
          title="Ubicación no disponible"
          description={error}
        />
      ) : null}

      {location ? (
        <LocationCard
          location={location}
          title="Posición actual del dispositivo"
        />
      ) : null}

      {lastKnown ? (
        <LocationCard
          location={lastKnown}
          title="Última ubicación registrada"
        />
      ) : null}

      <AppButton
        title={isLoading ? 'Obteniendo coordenadas...' : 'Actualizar ubicación actual'}
        disabled={isLoading}
        onPress={refresh}
      />

      <AppButton
        title="Consultar última posición registrada"
        variant="outline"
        disabled={isLoading}
        onPress={fetchLastKnown}
      />

      <Card>
        <Text style={styles.infoTitle}>Despacho y sucursal asignada</Text>
        <Text style={styles.infoBody}>
          • Sucursal operativa: Sucursal Central Cipolletti (Río Negro).{'\n'}
          • La lectura de posición permite adjuntar el punto de recepción al
          entregar pedidos de pintura e impermeabilizantes en obra.{'\n'}
          • En caso de operar en depósito cerrado o sin señal GPS, las ventas y
          remitos quedan asociados automáticamente a la sucursal activa.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  infoTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.primaryDark,
    marginBottom: 6,
  },
  infoBody: {
    fontSize: theme.typography.small,
    color: theme.colors.text,
    lineHeight: 20,
  },
});
