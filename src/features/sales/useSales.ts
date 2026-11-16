import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from '@/features/auth/useSession';
import { createSale, getSales } from './sales.service';
import { PaymentMethod, ReceiptType, Sale } from './sales.types';
import { Product } from '@/features/products/products.types';

export function useSales() {
  const { token } = useSession();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSales = useCallback(async () => {
    try {
      setError('');
      setIsLoading(true);
      const data = await getSales(token);
      setSales(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'No se pudieron cargar las ventas.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const cashSummary = useMemo(() => {
    const totalAmount = sales.reduce((acc, s) => acc + s.total, 0);
    const totalTickets = sales.length;
    const avgTicket = totalTickets > 0 ? Math.round(totalAmount / totalTickets) : 0;
    return { totalAmount, totalTickets, avgTicket };
  }, [sales]);

  return {
    sales,
    cashSummary,
    isLoading,
    error,
    reload: loadSales,
  };
}

export function useNewSale(allProducts: Product[]) {
  const { user, token } = useSession();
  const [selectedClientId, setSelectedClientId] = useState('cli-201');
  const [selectedClientName, setSelectedClientName] = useState(
    'Constructora Alto Valle S.R.L.'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('EFECTIVO');
  const [receiptType, setReceiptType] = useState<ReceiptType>('FACTURA_B');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function addToCart(product: Product) {
    setError('');
    setCart((prev) => {
      const existing = prev.find((entry) => entry.product.id === product.id);
      if (existing) {
        if (existing.quantity + 1 > product.currentStock) {
          setError(`Stock disponible insuficiente para ${product.name}.`);
          return prev;
        }
        return prev.map((entry) =>
          entry.product.id === product.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }
      if (product.currentStock <= 0) {
        setError(`El producto ${product.name} no tiene stock disponible.`);
        return prev;
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((entry) => entry.product.id !== productId));
  }

  const complementarySuggestions = useMemo(() => {
    const inCartIds = new Set(cart.map((c) => c.product.id));
    const suggestedIds = new Set<string>();
    cart.forEach((c) => {
      c.product.complementaryIds.forEach((id) => {
        if (!inCartIds.has(id)) suggestedIds.add(id);
      });
    });
    return allProducts.filter((p) => suggestedIds.has(p.id));
  }, [cart, allProducts]);

  const totals = useMemo(() => {
    const total = cart.reduce(
      (acc, entry) => acc + entry.product.price * entry.quantity,
      0
    );
    const subtotal = Math.round(total / 1.21);
    const iva = total - subtotal;
    return { subtotal, iva, total };
  }, [cart]);

  async function confirmSale(): Promise<Sale | null> {
    if (cart.length === 0) {
      setError('Agregá al menos un producto al carrito para emitir la venta.');
      return null;
    }
    try {
      setSubmitting(true);
      setError('');
      const created = await createSale(
        {
          clientId: selectedClientId,
          clientName: selectedClientName,
          sellerId: user?.id ?? 'usr-seller-02',
          sellerName: user?.name ?? 'Vendedor Pintame',
          paymentMethod,
          receiptType,
          items: cart.map((entry) => ({
            productId: entry.product.id,
            productName: entry.product.name,
            quantity: entry.quantity,
            unitPrice: entry.product.price,
          })),
        },
        token
      );
      setCart([]);
      return created;
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'No se pudo registrar la venta.'
      );
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    selectedClientId,
    setSelectedClientId,
    selectedClientName,
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
  };
}
