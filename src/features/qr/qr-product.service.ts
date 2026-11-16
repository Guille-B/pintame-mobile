import { apiRequest } from '@/lib/api/api.client';
import { getProductById } from '@/features/products/products.service';
import { getSaleById } from '@/features/sales/sales.service';

export type ValidateQrResponse = {
  valid: boolean;
  action: 'OPEN_PRODUCT' | 'OPEN_SALE' | 'UNKNOWN';
  targetId?: string;
  title?: string;
  subtitle?: string;
  message: string;
};

export async function validatePintameQr(
  qrValue: string,
  token?: string | null
): Promise<ValidateQrResponse> {
  try {
    return await apiRequest<ValidateQrResponse>('/qr/validate', {
      method: 'POST',
      token,
      body: { qrValue },
    });
  } catch {
    const clean = qrValue.trim();

    if (clean.startsWith('PINTAME:PRODUCT:')) {
      const productId = clean.replace('PINTAME:PRODUCT:', '');
      const product = await getProductById(productId, token);
      if (product) {
        return {
          valid: true,
          action: 'OPEN_PRODUCT',
          targetId: product.id,
          title: product.name,
          subtitle: `SKU: ${product.sku} · Stock actual: ${product.currentStock} u. · $${product.price.toLocaleString('es-AR')}`,
          message: 'Producto de catálogo verificado correctamente.',
        };
      }
    }

    if (clean.startsWith('PINTAME:SALE:')) {
      const saleId = clean.replace('PINTAME:SALE:', '');
      const sale = await getSaleById(saleId, token);
      if (sale) {
        return {
          valid: true,
          action: 'OPEN_SALE',
          targetId: sale.id,
          title: `Comprobante ${sale.ticketNumber}`,
          subtitle: `Cliente: ${sale.clientName} · Total: $${sale.total.toLocaleString('es-AR')}`,
          message: 'Comprobante de venta validado.',
        };
      }
    }

    return {
      valid: false,
      action: 'UNKNOWN',
      message:
        'El código QR leído no corresponde a una lata o comprobante registrado en Píntame.',
    };
  }
}
