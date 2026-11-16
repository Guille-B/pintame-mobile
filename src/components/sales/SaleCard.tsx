import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Sale } from '@/features/sales/sales.types';
import { theme } from '@/constants/theme';

type Props = {
  sale: Sale;
  onPress?: () => void;
};

export function SaleCard({ sale, onPress }: Props) {
  return (
    <Card onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.ticket}>{sale.ticketNumber}</Text>
        <Text style={styles.total}>${sale.total.toLocaleString('es-AR')}</Text>
      </View>
      <Text style={styles.client}>Cliente: {sale.clientName}</Text>
      <Text style={styles.meta}>
        {sale.date} · {sale.paymentMethod} · {sale.receipt.type}
      </Text>
      <Text style={styles.itemsCount}>
        {sale.items.length} ítem(s) · Vendedor: {sale.sellerName}
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
  ticket: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.primaryDark,
  },
  total: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.success,
  },
  client: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text,
  },
  meta: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
    marginTop: 2,
  },
  itemsCount: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
    marginTop: 4,
  },
});
