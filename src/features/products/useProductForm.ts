import { useState } from 'react';
import { useSession } from '@/features/auth/useSession';
import { createProduct } from './products.service';
import { ProductCategory, TechnicalAttribute } from './products.types';

export function useProductForm() {
  const { token } = useSession();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currentStock, setCurrentStock] = useState('10');
  const [minStock, setMinStock] = useState('5');
  const [category, setCategory] = useState<ProductCategory>('Látex');
  const [supplierName, setSupplierName] = useState('Alba / AkzoNobel Patagonia');
  const [surface, setSurface] = useState('Mampostería interior y exterior');
  const [finish, setFinish] = useState<TechnicalAttribute['finish']>('Mate');
  const [yieldM2PerLiter, setYieldM2PerLiter] = useState('12');
  const [base, setBase] = useState<TechnicalAttribute['base']>('Acuosa');
  const [colorName, setColorName] = useState('Blanco Puro');
  const [colorHex, setColorHex] = useState('#0E6FB8');
  const [liters, setLiters] = useState('4');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) {
      nextErrors.name = 'Ingresá un nombre de producto válido (mínimo 3 caracteres).';
    }
    if (!description.trim() || description.trim().length < 8) {
      nextErrors.description = 'Agregá una descripción técnica breve (mínimo 8 caracteres).';
    }
    const parsedPrice = Number(price);
    if (!price.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      nextErrors.price = 'El precio unitario debe ser mayor a $0.';
    }
    const parsedStock = Number(currentStock);
    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      nextErrors.currentStock = 'El stock inicial no puede ser negativo.';
    }
    const parsedMinStock = Number(minStock);
    if (Number.isNaN(parsedMinStock) || parsedMinStock < 0) {
      nextErrors.minStock = 'El stock mínimo debe ser un número válido.';
    }
    if (!surface.trim()) {
      nextErrors.surface = 'Indicá la superficie recomendada.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function reset() {
    setName('');
    setDescription('');
    setPrice('');
    setCurrentStock('10');
    setMinStock('5');
    setCategory('Látex');
    setPhotoUri(undefined);
    setErrors({});
    setSubmitError('');
  }

  async function submit() {
    setSubmitError('');
    if (!validate()) return null;

    try {
      setSubmitting(true);
      const created = await createProduct(
        {
          name,
          description,
          price: Number(price),
          currentStock: Number(currentStock),
          minStock: Number(minStock),
          category,
          supplierName,
          surface,
          finish,
          yieldM2PerLiter: Number(yieldM2PerLiter) || 10,
          base,
          colorName,
          colorHex,
          liters: Number(liters) || 4,
          photoUri,
        },
        token
      );
      reset();
      return created;
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : 'No se pudo guardar el producto.'
      );
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    values: {
      name,
      description,
      price,
      currentStock,
      minStock,
      category,
      supplierName,
      surface,
      finish,
      yieldM2PerLiter,
      base,
      colorName,
      colorHex,
      liters,
      photoUri,
    },
    setters: {
      setName,
      setDescription,
      setPrice,
      setCurrentStock,
      setMinStock,
      setCategory,
      setSupplierName,
      setSurface,
      setFinish,
      setYieldM2PerLiter,
      setBase,
      setColorName,
      setColorHex,
      setLiters,
      setPhotoUri,
    },
    errors,
    submitting,
    submitError,
    submit,
    reset,
  };
}
