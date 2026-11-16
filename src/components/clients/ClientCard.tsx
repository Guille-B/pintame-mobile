import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Client } from '@/features/clients/clients.types';
import { theme } from '@/constants/theme';

type Props = {
  client: Client;
  onPress?: () => void;
};

export function ClientCard({ client, onPress }: Props) {
  return (
    <Card onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.name}>{client.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{client.type}</Text>
        </View>
      </View>
      <Text style={styles.meta}>CUIT / DNI: {client.cuitOrDni}</Text>
      <Text style={styles.meta}>
        Tel: {client.phone} · {client.email}
      </Text>
      <Text style={styles.history}>
        Compras registradas: {client.purchaseHistory.length} · Preferencia:{' '}
        {client.preferredCategory}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    flexShrink: 1,
  },
  badge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  badgeText: {
    color: theme.colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  meta: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
    marginTop: 2,
  },
  history: {
    fontSize: theme.typography.small,
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: 6,
  },
});
