import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getSaleById } from '@/features/sales/sales.service';
import { Sale } from '@/features/sales/sales.types';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { theme } from '@/constants/theme';

export default function SaleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [sale, setSale] = useState<Sale | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getSaleById(id)
      .then(setSale)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Screen>
        <FeedbackState variant="loading" title="Cargando comprobante..." />
      </Screen>
    );
  }

  if (!sale) {
    return (
      <Screen>
        <FeedbackState
          variant="error"
          title="Comprobante no encontrado"
          description="No se encontró la venta solicitada."
          actionLabel="Volver a ventas"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title={`Comprobante ${sale.ticketNumber}`}
        subtitle={`Código QR: ${sale.qrCode} · Estado: ${sale.status}`}
        badge={sale.receipt.type}
      />

      <Card>
        <Text style={styles.label}>Cliente</Text>
        <Text style={styles.value}>{sale.clientName}</Text>

        <Text style={styles.label}>Vendedor responsable</Text>
        <Text style={styles.value}>{sale.sellerName}</Text>

        <Text style={styles.label}>Fecha y medio de pago</Text>
        <Text style={styles.value}>
          {sale.date} · {sale.paymentMethod}
        </Text>

        <Text style={styles.label}>CAE Comprobante Electrónico</Text>
        <Text style={styles.value}>{sale.receipt.cae}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Artículos facturados</Text>
        {sale.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.itemMeta}>
                {item.quantity} u. × ${item.unitPrice.toLocaleString('es-AR')}
              </Text>
            </View>
            <Text style={styles.itemSubtotal}>
              ${item.subtotal.toLocaleString('es-AR')}
            </Text>
          </View>
        ))}

        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal neto</Text>
            <Text style={styles.totalVal}>
              ${sale.subtotal.toLocaleString('es-AR')}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>IVA (21%)</Text>
            <Text style={styles.totalVal}>
              ${sale.iva.toLocaleString('es-AR')}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL FACTURADO</Text>
            <Text style={styles.grandTotalVal}>
              ${sale.total.toLocaleString('es-AR')}
            </Text>
          </View>
        </View>
      </Card>

      <AppButton
        title="Volver a Ventas y Caja"
        variant="outline"
        onPress={() => router.back()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
    fontWeight: '700',
    marginTop: 6,
  },
  value: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceMuted,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text,
  },
  itemMeta: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
  },
  itemSubtotal: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.text,
  },
  totalsBox: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
  },
  totalVal: {
    fontSize: theme.typography.small,
    color: theme.colors.text,
    fontWeight: '700',
  },
  grandTotalLabel: {
    fontSize: theme.typography.subtitle,
    fontWeight: '900',
    color: theme.colors.primaryDark,
    marginTop: 6,
  },
  grandTotalVal: {
    fontSize: theme.typography.subtitle,
    fontWeight: '900',
    color: theme.colors.success,
    marginTop: 6,
  },
});
