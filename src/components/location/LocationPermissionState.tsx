import { StyleSheet, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { LocationPermissionState as PermissionStateType } from '@/features/device-location/location.types';
import { theme } from '@/constants/theme';

type Props = {
  state: PermissionStateType;
  onRequest: () => void;
};

export function LocationPermissionState({ state, onRequest }: Props) {
  if (state === 'granted') return null;

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>
        {state === 'denied'
          ? 'Permiso de ubicación denegado'
          : 'Permiso foreground de ubicación'}
      </Text>
      <Text style={styles.description}>
        {state === 'denied'
          ? 'El acceso a ubicación fue rechazado. Píntame no insiste en bucle ni bloquea la app: podés registrar ventas o seleccionar la sucursal de Cipolletti manualmente.'
          : 'Usamos tu ubicación únicamente mientras estás en esta pantalla (foreground) para verificar la cercanía a la sucursal o registrar el punto de entrega en obra.'}
      </Text>
      {state === 'undetermined' ? (
        <AppButton title="Solicitar permiso foreground" onPress={onRequest} />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  title: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.primaryDark,
  },
  description: {
    fontSize: theme.typography.small,
    color: theme.colors.text,
    marginTop: 4,
    lineHeight: 19,
  },
});
