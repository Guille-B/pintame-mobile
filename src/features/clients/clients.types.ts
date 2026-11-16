export type ClientType = 'PARTICULAR' | 'EMPRESA';

export type ClientPurchaseHistory = {
  id: string;
  saleId: string;
  ticketNumber: string;
  date: string;
  total: number;
  itemsSummary: string;
};

export type Client = {
  id: string;
  name: string;
  businessName?: string; // razon_social del MER
  cuitOrDni: string;
  type: ClientType;
  phone: string;
  email: string;
  registeredAt: string;
  active: boolean;
  preferredCategory: string;
  purchaseHistory: ClientPurchaseHistory[];
};

export type CreateClientInput = {
  name: string;
  businessName?: string;
  cuitOrDni: string;
  type: ClientType;
  phone: string;
  email: string;
  preferredCategory: string;
};
