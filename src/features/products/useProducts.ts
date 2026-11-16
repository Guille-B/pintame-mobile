import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from '@/features/auth/useSession';
import { getProducts } from './products.service';
import { Product, ProductCategory } from './products.types';

export function useProducts() {
  const { token } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'TODAS'>('TODAS');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    try {
      setError('');
      setIsLoading(true);
      const data = await getProducts(token);
      setProducts(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'No se pudo cargar el catálogo de pinturas.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'TODAS' || item.category === selectedCategory;
      const matchesLowStock =
        !onlyLowStock || item.currentStock <= item.minStock;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.technicalAttributes.surface.toLowerCase().includes(q) ||
        item.technicalAttributes.finish.toLowerCase().includes(q) ||
        item.technicalAttributes.colorName.toLowerCase().includes(q);
      return matchesCategory && matchesLowStock && matchesQuery;
    });
  }, [products, searchQuery, selectedCategory, onlyLowStock]);

  const lowStockCount = useMemo(
    () => products.filter((item) => item.currentStock <= item.minStock).length,
    [products]
  );

  return {
    products: filteredProducts,
    allProducts: products,
    lowStockCount,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    onlyLowStock,
    setOnlyLowStock,
    isLoading,
    error,
    reload: loadProducts,
  };
}
