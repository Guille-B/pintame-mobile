import { apiRequest } from '@/lib/api/api.client';
import {
  Client,
  ClientPurchaseHistory,
  CreateClientInput,
} from './clients.types';

let clientsDb: Client[] = [
  {
    id: 'cli-201',
    name: 'Constructora Alto Valle S.R.L.',
    businessName: 'Constructora Alto Valle S.R.L.',
    cuitOrDni: '30-71589214-9',
    type: 'EMPRESA',
    phone: '+54 299 478-1120',
    email: 'compras@constructoraaltovalle.com.ar',
    registeredAt: '2026-03-14',
    active: true,
    preferredCategory: 'Látex e Impermeabilizantes',
    purchaseHistory: [
      {
        id: 'hist-01',
        saleId: 'sale-301',
        ticketNumber: 'FA-0001-00001024',
        date: '2026-11-11 16:40',
        total: 317400,
        itemsSummary: '2x Látex Acrílico Interior 20L + 3x Esmalte Sintético 4L',
      },
    ],
  },
  {
    id: 'cli-202',
    name: 'Martín Sepúlveda',
    cuitOrDni: '34.812.905',
    type: 'PARTICULAR',
    phone: '+54 299 512-8843',
    email: 'msepulveda@gmail.com',
    registeredAt: '2026-06-22',
    active: true,
    preferredCategory: 'Maderas y Esmaltes',
    purchaseHistory: [
      {
        id: 'hist-02',
        saleId: 'sale-302',
        ticketNumber: 'FB-0001-00001025',
        date: '2026-11-12 10:15',
        total: 53800,
        itemsSummary: '1x Protector Impregnante Deck 4L + 1x Kit Rodillo 22cm',
      },
    ],
  },
  {
    id: 'cli-203',
    name: 'Consorcio Edificio Río Negro',
    businessName: 'Consorcio Propietarios Edificio Río Negro 450',
    cuitOrDni: '30-68914002-3',
    type: 'EMPRESA',
    phone: '+54 299 442-9910',
    email: 'administracion@edificiorionegro.com.ar',
    registeredAt: '2026-08-05',
    active: true,
    preferredCategory: 'Impermeabilizantes',
    purchaseHistory: [],
  },
];

export async function getClients(token?: string | null): Promise<Client[]> {
  try {
    return await apiRequest<Client[]>('/clients', { method: 'GET', token });
  } catch {
    return [...clientsDb];
  }
}

export async function getClientById(
  id: string,
  token?: string | null
): Promise<Client | undefined> {
  try {
    return await apiRequest<Client>(`/clients/${id}`, { method: 'GET', token });
  } catch {
    return clientsDb.find((c) => c.id === id);
  }
}

export async function createClient(
  input: CreateClientInput,
  token?: string | null
): Promise<Client> {
  try {
    return await apiRequest<Client>('/clients', {
      method: 'POST',
      token,
      body: input,
    });
  } catch {
    const created: Client = {
      id: `cli-${Date.now()}`,
      name: input.name.trim(),
      businessName: input.businessName?.trim() || undefined,
      cuitOrDni: input.cuitOrDni.trim(),
      type: input.type,
      phone: input.phone.trim(),
      email: input.email.trim(),
      registeredAt: new Date().toISOString().slice(0, 10),
      active: true,
      preferredCategory: input.preferredCategory.trim() || 'Látex',
      purchaseHistory: [],
    };
    clientsDb = [created, ...clientsDb];
    return created;
  }
}

export function appendClientPurchaseHistoryLocal(
  clientId: string,
  entry: ClientPurchaseHistory
) {
  clientsDb = clientsDb.map((client) =>
    client.id === clientId
      ? { ...client, purchaseHistory: [entry, ...client.purchaseHistory] }
      : client
  );
}
