import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useProducts } from '@/features/products/useProducts';
import { PRODUCT_CATEGORIES } from '@/features/products/products.service';
import { ProductCategory } from '@/features/products/products.types';
import { Screen } from '@/components/ui/Screen';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProductCard } from '@/components/products/ProductCard';
import { theme } from '@/constants/theme';

export default function ProductsListScreen() {
  const {
    products,
    lowStockCount,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    onlyLowStock,
    setOnlyLowStock,
    isLoading,
    error,
    reload,
  } = useProducts();

  const categories: (ProductCategory | 'TODAS')[] = [
    'TODAS',
    ...PRODUCT_CATEGORIES,
  ];

  return (
    <Screen scroll={false}>
      <SectionHeader
        title="Catálogo de Pinturas"
        subtitle="Filtrá por categoría, superficie, acabado o stock crítico"
        badge={lowStockCount > 0 ? `${lowStockCount} bajo stock` : undefined}
      />

      <AppInput
        label="Buscar por nombre, SKU, superficie o acabado"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Ej: Látex, Esmalte, Mampostería, Satinado..."
      />

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            onPress={() => setOnlyLowStock(!onlyLowStock)}
            style={[styles.chip, onlyLowStock && styles.chipDanger]}
          >
            <Text
              style={[styles.chipText, onlyLowStock && styles.chipTextActive]}
            >
              Solo Stock Bajo ({lowStockCount})
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {isLoading ? (
        <FeedbackState
          variant="loading"
          title="Cargando inventario..."
          description="Consultando catálogo y niveles de stock."
        />
      ) : error ? (
        <FeedbackState
          variant="error"
          title="Error al cargar productos"
          description={error}
          actionLabel="Reintentar"
          onAction={reload}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          refreshing={isLoading}
          onRefresh={reload}
          renderItem={({ item }) => (
            <Link href={`/(private)/products/${item.id}`} asChild>
              <Pressable>
                <ProductCard product={item} />
              </Pressable>
            </Link>
          )}
          ListEmptyComponent={
            <EmptyState
              title="Sin productos que coincidan"
              description="Probá limpiando los filtros o registrá una nueva pintura en el catálogo."
              actionLabel="Registrar nuevo producto"
              onAction={() => router.push('/(private)/products/form')}
            />
          }
        />
      )}

      <AppButton
        title="+ Registrar Producto con Atributos Técnicos"
        onPress={() => router.push('/(private)/products/form')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    marginBottom: theme.spacing.xs,
  },
  chipsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipDanger: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger,
  },
  chipText: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.colors.text,
  },
  chipTextActive: {
    color: 'white',
  },
});
