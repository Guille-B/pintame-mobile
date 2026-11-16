import { apiRequest } from '@/lib/api/api.client';
import {
  CreateProductInput,
  Product,
  ProductCategory,
  StockMovement,
} from './products.types';

let productsDb: Product[] = [
  {
    id: 'prod-101',
    sku: 'LAT-INT-20L',
    qrCode: 'PINTAME:PRODUCT:prod-101',
    name: 'Látex Acrílico Interior Premium 20L',
    description:
      'Pintura al látex de máxima blancura y poder cubritivo para paredes interiores de mampostería y yeso. Lavable y antihongos.',
    price: 94500,
    currentStock: 18,
    minStock: 6,
    category: 'Látex',
    supplierName: 'Alba / AkzoNobel Patagonia',
    active: true,
    technicalAttributes: {
      surface: 'Mampostería / Yeso / Revoque interior',
      finish: 'Mate',
      yieldM2PerLiter: 12,
      base: 'Acuosa',
      colorName: 'Blanco Puro',
      colorHex: '#F8FAFC',
      liters: 20,
    },
    complementaryIds: ['prod-105', 'prod-106'],
  },
  {
    id: 'prod-102',
    sku: 'ESM-SIN-4L',
    qrCode: 'PINTAME:PRODUCT:prod-102',
    name: 'Esmalte Sintético Convertidor 3 en 1 (4L)',
    description:
      'Esmalte sintético brillante con convertidor de óxido integrado para rejas, portones metálicos y carpintería de madera.',
    price: 42800,
    currentStock: 4,
    minStock: 5,
    category: 'Esmaltes',
    supplierName: 'Sinteplast Distribuidora Sur',
    active: true,
    technicalAttributes: {
      surface: 'Hierro / Acero / Madera exterior',
      finish: 'Brillante',
      yieldM2PerLiter: 14,
      base: 'Solvente',
      colorName: 'Azul Marino Institucional',
      colorHex: '#0E6FB8',
      liters: 4,
    },
    complementaryIds: ['prod-106'],
  },
  {
    id: 'prod-103',
    sku: 'IMP-MEM-20L',
    qrCode: 'PINTAME:PRODUCT:prod-103',
    name: 'Membrana Líquida Elastómerica Techos 20L',
    description:
      'Impermeabilizante acrílico elástico de alta resistencia climática para losas, terrazas transitables y chapas de fibrocemento.',
    price: 112000,
    currentStock: 3,
    minStock: 5,
    category: 'Impermeabilizantes',
    supplierName: 'Plavicon / Química del Caucho',
    active: true,
    technicalAttributes: {
      surface: 'Techos / Losas / Terrazas',
      finish: 'Satinado',
      yieldM2PerLiter: 4,
      base: 'Acrílica',
      colorName: 'Rojo Teja Patagónico',
      colorHex: '#B91C1C',
      liters: 20,
    },
    complementaryIds: ['prod-105', 'prod-106'],
  },
  {
    id: 'prod-104',
    sku: 'MAD-PRO-4L',
    qrCode: 'PINTAME:PRODUCT:prod-104',
    name: 'Protector Impregnante Deck & Maderas UV 4L',
    description:
      'Impregnante lasur con filtro solar UV e hidrorepelente que protege maderas exteriores sin cuartear ni descascarar.',
    price: 38900,
    currentStock: 11,
    minStock: 4,
    category: 'Maderas',
    supplierName: 'Cetol / Línea Profesional',
    active: true,
    technicalAttributes: {
      surface: 'Decks / Pérgolas / Machimbre',
      finish: 'Satinado',
      yieldM2PerLiter: 15,
      base: 'Poliuretánica',
      colorName: 'Roble Claro',
      colorHex: '#B45309',
      liters: 4,
    },
    complementaryIds: ['prod-106'],
  },
  {
    id: 'prod-105',
    sku: 'FIJ-SEL-4L',
    qrCode: 'PINTAME:PRODUCT:prod-105',
    name: 'Fijador Sellador al Agua Concentrado 4L',
    description:
      'Acondicionador de superficies entizadas o de absorción despareja antes de aplicar látex interior o exterior.',
    price: 19600,
    currentStock: 15,
    minStock: 5,
    category: 'Látex',
    supplierName: 'Alba / AkzoNobel Patagonia',
    active: true,
    technicalAttributes: {
      surface: 'Revoque nuevo / Enduido / Yeso',
      finish: 'Mate',
      yieldM2PerLiter: 18,
      base: 'Acuosa',
      colorName: 'Incoloro Translúcido',
      colorHex: '#E2E8F0',
      liters: 4,
    },
    complementaryIds: ['prod-101', 'prod-106'],
  },
  {
    id: 'prod-106',
    sku: 'ACC-KIT-PRO',
    qrCode: 'PINTAME:PRODUCT:prod-106',
    name: 'Kit Rodillo Lana Natural 22cm + Bandeja + Cinta',
    description:
      'Combo profesional antigota de lana natural 22cm, bandeja plástica reforzada y cinta de enmascarar de 24mm x 50m.',
    price: 14900,
    currentStock: 24,
    minStock: 8,
    category: 'Accesorios',
    supplierName: 'El Galgo Herramientas para Pintores',
    active: true,
    technicalAttributes: {
      surface: 'Multipropósito (Paredes y Techos)',
      finish: 'N/A',
      yieldM2PerLiter: 0,
      base: 'Accesorio',
      colorName: 'Verde Lima Pintame',
      colorHex: '#8EC644',
      liters: 1,
    },
    complementaryIds: ['prod-101'],
  },
];

let stockMovementsDb: StockMovement[] = [
  {
    id: 'mov-01',
    productId: 'prod-101',
    type: 'ENTRADA',
    quantity: 20,
    date: '2026-11-10 09:15',
    reason: 'Recepción remito proveedor Alba #0004-8821',
  },
  {
    id: 'mov-02',
    productId: 'prod-102',
    type: 'SALIDA',
    quantity: 3,
    date: '2026-11-11 16:40',
    reason: 'Venta mostrador Ticket #T-001024',
  },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Látex',
  'Esmaltes',
  'Impermeabilizantes',
  'Maderas',
  'Accesorios',
];

export async function getProducts(token?: string | null): Promise<Product[]> {
  try {
    return await apiRequest<Product[]>('/products', { method: 'GET', token });
  } catch {
    return [...productsDb];
  }
}

export async function getProductById(
  id: string,
  token?: string | null
): Promise<Product | undefined> {
  try {
    return await apiRequest<Product>(`/products/${id}`, { method: 'GET', token });
  } catch {
    return productsDb.find((item) => item.id === id);
  }
}

export async function getProductsByCategory(
  category: string,
  token?: string | null
): Promise<Product[]> {
  const all = await getProducts(token);
  return all.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getLowStockAlerts(token?: string | null): Promise<Product[]> {
  const all = await getProducts(token);
  return all.filter((item) => item.currentStock <= item.minStock);
}

export async function getComplementaryProducts(
  product: Product,
  token?: string | null
): Promise<Product[]> {
  const all = await getProducts(token);
  return all.filter((item) => product.complementaryIds.includes(item.id));
}

export async function createProduct(
  input: CreateProductInput,
  token?: string | null
): Promise<Product> {
  try {
    return await apiRequest<Product>('/products', {
      method: 'POST',
      token,
      body: input,
    });
  } catch {
    const nextNumber = productsDb.length + 101;
    const newId = `prod-${nextNumber}`;
    const created: Product = {
      id: newId,
      sku: `${input.category.slice(0, 3).toUpperCase()}-${nextNumber}`,
      qrCode: `PINTAME:PRODUCT:${newId}`,
      name: input.name.trim(),
      description: input.description.trim(),
      price: input.price,
      currentStock: input.currentStock,
      minStock: input.minStock,
      category: input.category,
      supplierName: input.supplierName.trim() || 'Proveedor General',
      active: true,
      technicalAttributes: {
        surface: input.surface.trim() || 'Interior / Exterior',
        finish: input.finish,
        yieldM2PerLiter: input.yieldM2PerLiter,
        base: input.base,
        colorName: input.colorName.trim() || 'Blanco',
        colorHex: input.colorHex || '#0E6FB8',
        liters: input.liters,
      },
      complementaryIds: ['prod-106'],
      photoUri: input.photoUri,
    };
    productsDb = [created, ...productsDb];
    stockMovementsDb = [
      {
        id: `mov-${Date.now()}`,
        productId: created.id,
        type: 'ENTRADA',
        quantity: created.currentStock,
        date: new Date().toLocaleString(),
        reason: 'Alta inicial de producto desde app móvil',
      },
      ...stockMovementsDb,
    ];
    return created;
  }
}

export async function updateProductPhoto(
  productId: string,
  photoUri: string
): Promise<Product | undefined> {
  productsDb = productsDb.map((item) =>
    item.id === productId ? { ...item, photoUri } : item
  );
  return productsDb.find((item) => item.id === productId);
}

export function deductProductStockLocal(
  items: { productId: string; quantity: number }[],
  ticketNumber: string
) {
  productsDb = productsDb.map((prod) => {
    const sold = items.find((i) => i.productId === prod.id);
    if (!sold) return prod;
    const updatedStock = Math.max(0, prod.currentStock - sold.quantity);
    stockMovementsDb = [
      {
        id: `mov-${Date.now()}-${prod.id}`,
        productId: prod.id,
        type: 'SALIDA',
        quantity: sold.quantity,
        date: new Date().toLocaleString(),
        reason: `Venta confirmada ${ticketNumber}`,
      },
      ...stockMovementsDb,
    ];
    return { ...prod, currentStock: updatedStock };
  });
}

export function getProductMovementsLocal(productId: string): StockMovement[] {
  return stockMovementsDb.filter((m) => m.productId === productId);
}
