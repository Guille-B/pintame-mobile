import { apiRequest } from '@/lib/api/api.client';
import { deductProductStockLocal } from '@/features/products/products.service';
import { appendClientPurchaseHistoryLocal } from '@/features/clients/clients.service';
import { CreateSaleInput, Sale } from './sales.types';

let salesDb: Sale[] = [
  {
    id: 'sale-301',
    ticketNumber: 'FA-0001-00001024',
    qrCode: 'PINTAME:SALE:sale-301',
    clientId: 'cli-201',
    clientName: 'Constructora Alto Valle S.R.L.',
    sellerId: 'usr-seller-02',
    sellerName: 'Franco Retamal',
    date: '2026-11-11 16:40',
    subtotal: 262314,
    iva: 55086,
    total: 317400,
    status: 'CONFIRMADA',
    paymentMethod: 'TRANSFERENCIA',
    items: [
      {
        id: 'item-1',
        productId: 'prod-101',
        productName: 'Látex Acrílico Interior Premium 20L',
        quantity: 2,
        unitPrice: 94500,
        subtotal: 189000,
      },
      {
        id: 'item-2',
        productId: 'prod-102',
        productName: 'Esmalte Sintético Convertidor 3 en 1 (4L)',
        quantity: 3,
        unitPrice: 42800,
        subtotal: 128400,
      },
    ],
    receipt: {
      id: 'comp-901',
      type: 'FACTURA_A',
      issuedAt: '2026-11-11 16:41',
      cae: '74458192003418',
    },
  },
  {
    id: 'sale-302',
    ticketNumber: 'FB-0001-00001025',
    qrCode: 'PINTAME:SALE:sale-302',
    clientId: 'cli-202',
    clientName: 'Martín Sepúlveda',
    sellerId: 'usr-admin-01',
    sellerName: 'Alexis Bautista',
    date: '2026-11-12 10:15',
    subtotal: 44463,
    iva: 9337,
    total: 53800,
    status: 'CONFIRMADA',
    paymentMethod: 'MERCADO_PAGO',
    items: [
      {
        id: 'item-3',
        productId: 'prod-104',
        productName: 'Protector Impregnante Deck & Maderas UV 4L',
        quantity: 1,
        unitPrice: 38900,
        subtotal: 38900,
      },
      {
        id: 'item-4',
        productId: 'prod-106',
        productName: 'Kit Rodillo Lana Natural 22cm + Bandeja + Cinta',
        quantity: 1,
        unitPrice: 14900,
        subtotal: 14900,
      },
    ],
    receipt: {
      id: 'comp-902',
      type: 'FACTURA_B',
      issuedAt: '2026-11-12 10:15',
      cae: '74458192003992',
    },
  },
];

export async function getSales(token?: string | null): Promise<Sale[]> {
  try {
    return await apiRequest<Sale[]>('/sales', { method: 'GET', token });
  } catch {
    return [...salesDb];
  }
}

export async function getSaleById(
  id: string,
  token?: string | null
): Promise<Sale | undefined> {
  try {
    return await apiRequest<Sale>(`/sales/${id}`, { method: 'GET', token });
  } catch {
    return salesDb.find((s) => s.id === id);
  }
}

export async function createSale(
  input: CreateSaleInput,
  token?: string | null
): Promise<Sale> {
  try {
    return await apiRequest<Sale>('/sales', {
      method: 'POST',
      token,
      body: input,
    });
  } catch {
    const total = input.items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );
    const subtotal = Math.round(total / 1.21);
    const iva = total - subtotal;
    const nextTicketNum = 1024 + salesDb.length;
    const prefix =
      input.receiptType === 'FACTURA_A'
        ? 'FA'
        : input.receiptType === 'FACTURA_B'
        ? 'FB'
        : 'TX';
    const ticketNumber = `${prefix}-0001-0000${nextTicketNum}`;
    const newId = `sale-${301 + salesDb.length}`;
    const nowStr = new Date().toLocaleString();

    const created: Sale = {
      id: newId,
      ticketNumber,
      qrCode: `PINTAME:SALE:${newId}`,
      clientId: input.clientId,
      clientName: input.clientName,
      sellerId: input.sellerId,
      sellerName: input.sellerName,
      date: nowStr,
      subtotal,
      iva,
      total,
      status: 'CONFIRMADA',
      paymentMethod: input.paymentMethod,
      items: input.items.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice,
      })),
      receipt: {
        id: `comp-${Date.now()}`,
        type: input.receiptType,
        issuedAt: nowStr,
        cae: `74458192${Math.floor(100000 + Math.random() * 899999)}`,
      },
    };

    salesDb = [created, ...salesDb];

    // Descontar stock automáticamente al confirmar venta (Requisito de Pintame)
    deductProductStockLocal(
      input.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      ticketNumber
    );

    // Actualizar historial de compras del cliente
    appendClientPurchaseHistoryLocal(input.clientId, {
      id: `hist-${Date.now()}`,
      saleId: created.id,
      ticketNumber: created.ticketNumber,
      date: created.date,
      total: created.total,
      itemsSummary: created.items
        .map((i) => `${i.quantity}x ${i.productName}`)
        .join(' + '),
    });

    return created;
  }
}
