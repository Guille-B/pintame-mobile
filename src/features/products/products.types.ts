export type ProductCategory =
  | 'Látex'
  | 'Esmaltes'
  | 'Impermeabilizantes'
  | 'Maderas'
  | 'Accesorios';

export type TechnicalAttribute = {
  surface: string; // Interior/Exterior, Mampostería, Metal, Madera, Techos
  finish: 'Mate' | 'Satinado' | 'Brillante' | 'Semimate' | 'N/A';
  yieldM2PerLiter: number; // rendimiento_m2l del MER
  base: 'Acuosa' | 'Solvente' | 'Acrílica' | 'Poliuretánica' | 'Accesorio';
  colorName: string;
  colorHex: string;
  liters: number;
};

export type StockMovement = {
  id: string;
  productId: string;
  type: 'ENTRADA' | 'SALIDA';
  quantity: number;
  date: string;
  reason: string;
};

export type Product = {
  id: string;
  sku: string;
  qrCode: string;
  name: string;
  description: string;
  price: number;
  currentStock: number;
  minStock: number;
  category: ProductCategory;
  supplierName: string;
  active: boolean;
  technicalAttributes: TechnicalAttribute;
  complementaryIds: string[];
  photoUri?: string;
};

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  currentStock: number;
  minStock: number;
  category: ProductCategory;
  supplierName: string;
  surface: string;
  finish: TechnicalAttribute['finish'];
  yieldM2PerLiter: number;
  base: TechnicalAttribute['base'];
  colorName: string;
  colorHex: string;
  liters: number;
  photoUri?: string;
};
