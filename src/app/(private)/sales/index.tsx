import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useSales } from '@/features/sales/useSales';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SaleCard } from '@/components/sales/SaleCard';
import { theme } from '@/constants/theme';

export default function SalesListScreen() {
  const { sales, cashSummary, isLoading, error, reload } = useSales();

  return (
    <Screen scroll={false}>
      <SectionHeader
        title="Ventas, Caja y Facturación"
        subtitle="Arqueo de caja y comprobantes emitidos en sucursal"
      />

      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Total en Caja</Text>
            <Text style={styles.summaryValue}>
              ${cashSummary.totalAmount.toLocaleString('es-AR')}
            </Text>
          </View>
          <View style={styles.rightCol}>
            <Text style={styles.summaryLabel}>Tickets emitidos</Text>
            <Text style={styles.summaryTickets}>{cashSummary.totalTickets}</Text>
          </View>
        </View>
      </Card>

      {isLoading ? (
        <FeedbackState variant="loading" title="Cargando ventas..." />
      ) : error ? (
        <FeedbackState
          variant="error"
          title="Error al cargar ventas"
          description={error}
          actionLabel="Reintentar"
          onAction={reload}
        />
      ) : (
        <FlatList
          data={sales}
          keyExtractor={(item) => item.id}
          refreshing={isLoading}
          onRefresh={reload}
          renderItem={({ item }) => (
            <Link href={`/(private)/sales/${item.id}`} asChild>
              <Pressable>
                <SaleCard sale={item} />
              </Pressable>
            </Link>
          )}
          ListEmptyComponent={
            <EmptyState
              title="Sin ventas registradas"
              description="Iniciá una nueva venta para emitir el primer comprobante."
            />
          }
        />
      )}

      <AppButton
        title="+ Nueva Venta en Mostrador"
        variant="secondary"
        onPress={() => router.push('/(private)/sales/new')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: theme.typography.small,
    color: theme.colors.primaryDark,
    fontWeight: '700',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.primaryDark,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  summaryTickets: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.text,
  },
});
