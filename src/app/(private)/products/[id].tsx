import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import {
  getComplementaryProducts,
  getProductById,
  getProductMovementsLocal,
} from '@/features/products/products.service';
import { Product, StockMovement } from '@/features/products/products.types';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { theme } from '@/constants/theme';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>();
  const [complementary, setComplementary] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id)
      .then(async (found) => {
        setProduct(found);
        if (found) {
          const comp = await getComplementaryProducts(found);
          setComplementary(comp);
          setMovements(getProductMovementsLocal(found.id));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Screen>
        <FeedbackState
          variant="loading"
          title="Cargando ficha técnica..."
          description="Obteniendo especificaciones y disponibilidad en depósito."
        />
      </Screen>
    );
  }

  if (!product) {
    return (
      <Screen>
        <FeedbackState
          variant="error"
          title="Producto no encontrado"
          description="No se encontró el artículo solicitado en el catálogo de Píntame."
          actionLabel="Volver al catálogo"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const isLowStock = product.currentStock <= product.minStock;

  return (
    <Screen>
      <SectionHeader
        title={product.name}
        subtitle={`SKU: ${product.sku} · Código QR: ${product.qrCode}`}
        badge={product.category}
      />

      {product.photoUri ? (
        <Card>
          <Text style={styles.cardTitle}>Fotografía del producto</Text>
          <Image
            source={{ uri: product.photoUri }}
            style={styles.photo}
            resizeMode="contain"
          />
        </Card>
      ) : null}

      <Card>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.label}>Precio unitario</Text>
            <Text style={styles.price}>
              ${product.price.toLocaleString('es-AR')}
            </Text>
          </View>
          <View style={styles.stockBox}>
            <Text style={styles.label}>Stock disponible / Mínimo</Text>
            <Text
              style={[
                styles.stockValue,
                isLowStock ? styles.stockDanger : styles.stockOk,
              ]}
            >
              {product.currentStock} u. / mín. {product.minStock} u.
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.meta}>Proveedor: {product.supplierName}</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Especificaciones Técnicas</Text>
        <View style={styles.attrGrid}>
          <View style={styles.attrItem}>
            <Text style={styles.attrLabel}>Superficie recomendada</Text>
            <Text style={styles.attrValue}>
              {product.technicalAttributes.surface}
            </Text>
          </View>
          <View style={styles.attrItem}>
            <Text style={styles.attrLabel}>Acabado</Text>
            <Text style={styles.attrValue}>
              {product.technicalAttributes.finish}
            </Text>
          </View>
          <View style={styles.attrItem}>
            <Text style={styles.attrLabel}>Rendimiento estimado</Text>
            <Text style={styles.attrValue}>
              {product.technicalAttributes.yieldM2PerLiter > 0
                ? `${product.technicalAttributes.yieldM2PerLiter} m² por litro`
                : 'No aplica'}
            </Text>
          </View>
          <View style={styles.attrItem}>
            <Text style={styles.attrLabel}>Base y presentación</Text>
            <Text style={styles.attrValue}>
              {product.technicalAttributes.base} ·{' '}
              {product.technicalAttributes.liters}L (
              {product.technicalAttributes.colorName})
            </Text>
          </View>
        </View>
      </Card>

      {complementary.length > 0 ? (
        <Card>
          <Text style={styles.cardTitle}>
            Insumos complementarios recomendados
          </Text>
          {complementary.map((comp) => (
            <Link
              key={comp.id}
              href={`/(private)/products/${comp.id}`}
              asChild
            >
              <AppButton
                title={`${comp.name} ($${comp.price.toLocaleString('es-AR')})`}
                variant="outline"
              />
            </Link>
          ))}
        </Card>
      ) : null}

      <Card>
        <Text style={styles.cardTitle}>Movimientos recientes de stock</Text>
        {movements.length === 0 ? (
          <Text style={styles.meta}>Sin movimientos recientes registrados.</Text>
        ) : (
          movements.map((mov) => (
            <View key={mov.id} style={styles.movRow}>
              <Text style={styles.movType}>
                {mov.type} ({mov.quantity} u.)
              </Text>
              <Text style={styles.meta}>
                {mov.date} · {mov.reason}
              </Text>
            </View>
          ))
        )}
      </Card>

      <Link
        href={`/(private)/category/${encodeURIComponent(product.category)}`}
        asChild
      >
        <AppButton
          title={`Ver toda la línea ${product.category}`}
          variant="secondary"
        />
      </Link>

      <AppButton
        title="Asociar fotografía de envase o muestra"
        variant="outline"
        onPress={() =>
          router.push({
            pathname: '/(private)/media-demo',
            params: { productId: product.id, productName: product.name },
          })
        }
      />

      <AppButton
        title="Volver al catálogo"
        variant="outline"
        onPress={() => router.back()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: '100%',
    height: 220,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
    fontWeight: '700',
  },
  price: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  stockBox: {
    alignItems: 'flex-end',
  },
  stockValue: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
  },
  stockOk: {
    color: theme.colors.success,
  },
  stockDanger: {
    color: theme.colors.danger,
  },
  description: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  meta: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
  },
  cardTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 8,
  },
  attrGrid: {
    gap: 8,
  },
  attrItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceMuted,
  },
  attrLabel: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
    fontWeight: '700',
  },
  attrValue: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '700',
    marginTop: 2,
  },
  movRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceMuted,
  },
  movType: {
    fontSize: theme.typography.small,
    fontWeight: '800',
    color: theme.colors.primaryDark,
  },
});
