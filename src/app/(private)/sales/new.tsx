import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useProducts } from '@/features/products/useProducts';
import { useClients } from '@/features/clients/useClients';
import { useNewSale } from '@/features/sales/useSales';
import { PaymentMethod, ReceiptType } from '@/features/sales/sales.types';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { theme } from '@/constants/theme';

const PAYMENT_METHODS: PaymentMethod[] = [
  'EFECTIVO',
  'TRANSFERENCIA',
  'TARJETA',
  'MERCADO_PAGO',
];

const RECEIPT_TYPES: ReceiptType[] = ['FACTURA_A', 'FACTURA_B', 'TICKET_X'];

export default function NewSaleScreen() {
  const { allProducts } = useProducts();
  const { clients } = useClients();
  const {
    selectedClientId,
    setSelectedClientId,
    setSelectedClientName,
    paymentMethod,
    setPaymentMethod,
    receiptType,
    setReceiptType,
    cart,
    addToCart,
    removeFromCart,
    complementarySuggestions,
    totals,
    error,
    submitting,
    confirmSale,
  } = useNewSale(allProducts);

  async function handleConfirm() {
    const created = await confirmSale();
    if (created) {
      router.push(`/(private)/sales/${created.id}`);
    }
  }

  return (
    <Screen>
      <SectionHeader
        title="Punto de Venta"
        subtitle="Seleccioná cliente y productos para emitir comprobante y actualizar stock"
      />

      {error ? (
        <FeedbackState
          variant="error"
          title="Atención en caja"
          description={error}
        />
      ) : null}

      <Card>
        <Text style={styles.sectionTitle}>1. Cliente y Facturación</Text>
        <View style={styles.chipsWrap}>
          {clients.map((cli) => {
            const active = cli.id === selectedClientId;
            return (
              <Pressable
                key={cli.id}
                onPress={() => {
                  setSelectedClientId(cli.id);
                  setSelectedClientName(cli.name);
                }}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {cli.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.fieldLabel}>Tipo de comprobante</Text>
        <View style={styles.chipsWrap}>
          {RECEIPT_TYPES.map((rt) => {
            const active = receiptType === rt;
            return (
              <Pressable
                key={rt}
                onPress={() => setReceiptType(rt)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {rt}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.fieldLabel}>Medio de pago</Text>
        <View style={styles.chipsWrap}>
          {PAYMENT_METHODS.map((pm) => {
            const active = paymentMethod === pm;
            return (
              <Pressable
                key={pm}
                onPress={() => setPaymentMethod(pm)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {pm}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>2. Pinturas e Insumos Disponibles</Text>
        {allProducts.map((prod) => (
          <View key={prod.id} style={styles.prodRow}>
            <View style={styles.prodInfo}>
              <Text style={styles.prodName}>{prod.name}</Text>
              <Text style={styles.prodMeta}>
                ${prod.price.toLocaleString('es-AR')} · Stock: {prod.currentStock} u.
              </Text>
            </View>
            <Pressable
              onPress={() => addToCart(prod)}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnText}>+ Agregar</Text>
            </Pressable>
          </View>
        ))}
      </Card>

      {complementarySuggestions.length > 0 ? (
        <Card style={styles.suggestionCard}>
          <Text style={styles.suggestionTitle}>
            Insumos complementarios recomendados para esta compra
          </Text>
          {complementarySuggestions.map((sug) => (
            <View key={sug.id} style={styles.prodRow}>
              <View style={styles.prodInfo}>
                <Text style={styles.prodName}>{sug.name}</Text>
                <Text style={styles.prodMeta}>
                  ${sug.price.toLocaleString('es-AR')}
                </Text>
              </View>
              <Pressable
                onPress={() => addToCart(sug)}
                style={styles.addBtnSecondary}
              >
                <Text style={styles.addBtnText}>+ Sumar</Text>
              </Pressable>
            </View>
          ))}
        </Card>
      ) : null}

      <Card>
        <Text style={styles.sectionTitle}>
          3. Detalle a Cobrar ({cart.length} artículo/s)
        </Text>
        {cart.length === 0 ? (
          <Text style={styles.prodMeta}>
            Todavía no agregaste productos a la venta actual.
          </Text>
        ) : (
          cart.map((entry) => (
            <View key={entry.product.id} style={styles.prodRow}>
              <View style={styles.prodInfo}>
                <Text style={styles.prodName}>
                  {entry.quantity}x {entry.product.name}
                </Text>
                <Text style={styles.prodMeta}>
                  Subtotal: $
                  {(entry.product.price * entry.quantity).toLocaleString('es-AR')}
                </Text>
              </View>
              <Pressable
                onPress={() => removeFromCart(entry.product.id)}
                style={styles.removeBtn}
              >
                <Text style={styles.removeBtnText}>Quitar</Text>
              </Pressable>
            </View>
          ))
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total a cobrar (IVA incl.):</Text>
          <Text style={styles.totalAmount}>
            ${totals.total.toLocaleString('es-AR')}
          </Text>
        </View>
      </Card>

      <AppButton
        title={
          submitting
            ? 'Emitiendo comprobante...'
            : 'Confirmar Venta y Emitir Comprobante'
        }
        onPress={handleConfirm}
        disabled={submitting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 8,
    marginBottom: 6,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.colors.text,
  },
  chipTextActive: {
    color: 'white',
  },
  prodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceMuted,
  },
  prodInfo: {
    flex: 1,
    paddingRight: 8,
  },
  prodName: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text,
  },
  prodMeta: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
  },
  addBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.sm,
  },
  addBtnSecondary: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.sm,
  },
  addBtnText: {
    color: 'white',
    fontWeight: '800',
    fontSize: theme.typography.small,
  },
  removeBtn: {
    backgroundColor: theme.colors.dangerBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
  },
  removeBtnText: {
    color: theme.colors.danger,
    fontWeight: '800',
    fontSize: theme.typography.small,
  },
  suggestionCard: {
    backgroundColor: '#F0FDF4',
    borderColor: theme.colors.secondary,
  },
  suggestionTitle: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.success,
    marginBottom: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalLabel: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.text,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.success,
  },
});
