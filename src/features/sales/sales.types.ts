export type PaymentMethod =
  | 'EFECTIVO'
  | 'TRANSFERENCIA'
  | 'TARJETA'
  | 'MERCADO_PAGO';

export type ReceiptType = 'FACTURA_A' | 'FACTURA_B' | 'TICKET_X';

export type SaleItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type InvoiceReceipt = {
  id: string;
  type: ReceiptType;
  issuedAt: string;
  cae: string;
};

export type Sale = {
  id: string;
  ticketNumber: string; // nro_ticket del MER
  qrCode: string;
  clientId: string;
  clientName: string;
  sellerId: string;
  sellerName: string;
  date: string;
  subtotal: number;
  iva: number;
  total: number;
  status: 'CONFIRMADA' | 'ANULADA';
  paymentMethod: PaymentMethod;
  items: SaleItem[];
  receipt: InvoiceReceipt;
};

export type CreateSaleInput = {
  clientId: string;
  clientName: string;
  sellerId: string;
  sellerName: string;
  paymentMethod: PaymentMethod;
  receiptType: ReceiptType;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
};
