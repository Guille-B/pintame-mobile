import { StyleSheet, Text } from 'react-native';
import { useSession } from '@/features/auth/useSession';
import { getConfiguredApiUrl } from '@/lib/api/api.client';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { theme } from '@/constants/theme';

export default function ProfileScreen() {
  const { user, token, signOut } = useSession();

  return (
    <Screen>
      <SectionHeader
        title="Mi Perfil Operativo"
        subtitle="Datos del colaborador, sucursal activa y estado de conexión"
        badge={user?.role === 'ADMIN' ? 'ADMINISTRADOR' : 'VENDEDOR'}
      />

      <Card>
        <Text style={styles.label}>Colaborador</Text>
        <Text style={styles.value}>{user?.name}</Text>

        <Text style={styles.label}>Correo corporativo</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>Nivel de acceso</Text>
        <Text style={styles.value}>
          {user?.role === 'ADMIN'
            ? 'Administrador General'
            : 'Vendedor de Mostrador'}
        </Text>

        <Text style={styles.label}>Sucursal asignada</Text>
        <Text style={styles.value}>{user?.branch}</Text>
      </Card>

      <Card>
        <Text style={styles.label}>Estado de conexión del sistema</Text>
        <Text style={styles.meta}>
          Servidor central: {getConfiguredApiUrl()}
        </Text>
        <Text style={styles.meta}>
          Sesión cifrada en dispositivo: {token ? 'Activa' : 'Inactiva'}
        </Text>
      </Card>

      <AppButton
        title="Cerrar sesión"
        variant="danger"
        onPress={signOut}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
    fontWeight: '700',
    marginTop: 8,
  },
  value: {
    fontSize: theme.typography.subtitle,
    color: theme.colors.text,
    fontWeight: '800',
  },
  meta: {
    fontSize: theme.typography.small,
    color: theme.colors.text,
    marginTop: 6,
    lineHeight: 19,
  },
});
