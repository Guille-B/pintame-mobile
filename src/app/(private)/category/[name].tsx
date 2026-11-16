import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { getProductsByCategory } from '@/features/products/products.service';
import { Product } from '@/features/products/products.types';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { AppButton } from '@/components/ui/AppButton';
import { ProductCard } from '@/components/products/ProductCard';

export default function CategoryProductsScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const decodedName = decodeURIComponent(name ?? '');
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!decodedName) return;
    setLoading(true);
    getProductsByCategory(decodedName)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [decodedName]);

  return (
    <Screen scroll={false}>
      <SectionHeader
        title={`Línea: ${decodedName}`}
        subtitle="Productos disponibles en inventario para esta categoría"
      />

      {loading ? (
        <FeedbackState variant="loading" title="Cargando línea de productos..." />
      ) : items.length === 0 ? (
        <FeedbackState
          variant="empty"
          title="Sin productos en esta categoría"
          description={`No se encontraron pinturas registradas bajo "${decodedName}".`}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/(private)/products/${item.id}`} asChild>
              <ProductCard product={item} />
            </Link>
          )}
        />
      )}

      <AppButton
        title="Volver al catálogo completo"
        variant="outline"
        onPress={() => router.back()}
      />
    </Screen>
  );
}
