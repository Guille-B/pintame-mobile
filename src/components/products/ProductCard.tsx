import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Product } from '@/features/products/products.types';
import { theme } from '@/constants/theme';

type Props = {
  product: Product;
  onPress?: () => void;
};

export function ProductCard({ product, onPress }: Props) {
  const isLowStock = product.currentStock <= product.minStock;

  return (
    <Card onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.colorBadgeRow}>
          <View
            style={[
              styles.colorDot,
              { backgroundColor: product.technicalAttributes.colorHex },
            ]}
          />
          <Text style={styles.category}>
            {product.category} · {product.sku}
          </Text>
        </View>
        <View
          style={[
            styles.stockBadge,
            isLowStock ? styles.stockDanger : styles.stockOk,
          ]}
        >
          <Text
            style={[
              styles.stockText,
              isLowStock ? styles.stockTextDanger : styles.stockTextOk,
            ]}
          >
            {isLowStock
              ? `ALERTA STOCK: ${product.currentStock} u.`
              : `Stock: ${product.currentStock} u.`}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{product.name}</Text>

      <Text style={styles.attributes}>
        Superficie: {product.technicalAttributes.surface} · Acabado:{' '}
        {product.technicalAttributes.finish}
        {product.technicalAttributes.yieldM2PerLiter > 0
          ? ` · Rend.: ${product.technicalAttributes.yieldM2PerLiter} m²/L`
          : ''}
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.supplier}>{product.supplierName}</Text>
        <Text style={styles.price}>
          ${product.price.toLocaleString('es-AR')}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  colorBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  category: {
    fontSize: theme.typography.small,
    color: theme.colors.primaryDark,
    fontWeight: '700',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  stockOk: {
    backgroundColor: theme.colors.successBg,
  },
  stockDanger: {
    backgroundColor: theme.colors.dangerBg,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '800',
  },
  stockTextOk: {
    color: theme.colors.success,
  },
  stockTextDanger: {
    color: theme.colors.danger,
  },
  title: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  attributes: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceMuted,
    paddingTop: 8,
  },
  supplier: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
  },
  price: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.primary,
  },
});
