import { useCallback, useEffect, useState } from 'react';
import { useSession } from '@/features/auth/useSession';
import { createClient, getClients } from './clients.service';
import { Client, ClientType } from './clients.types';

export function useClients() {
  const { token } = useSession();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadClients = useCallback(async () => {
    try {
      setError('');
      setIsLoading(true);
      const data = await getClients(token);
      setClients(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'No se pudieron cargar los clientes.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  return {
    clients,
    isLoading,
    error,
    reload: loadClients,
  };
}

export function useClientForm() {
  const { token } = useSession();
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [cuitOrDni, setCuitOrDni] = useState('');
  const [type, setType] = useState<ClientType>('PARTICULAR');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredCategory, setPreferredCategory] = useState('Látex');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) {
      next.name = 'Ingresá el nombre o denominación del cliente.';
    }
    if (!cuitOrDni.trim() || cuitOrDni.trim().length < 7) {
      next.cuitOrDni = 'Ingresá un DNI o CUIT válido.';
    }
    if (!phone.trim()) {
      next.phone = 'Ingresá un teléfono de contacto.';
    }
    if (!email.trim() || !email.includes('@')) {
      next.email = 'Ingresá un correo electrónico válido.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(): Promise<Client | null> {
    if (!validate()) return null;
    try {
      setSubmitting(true);
      const created = await createClient(
        {
          name,
          businessName: type === 'EMPRESA' ? businessName || name : undefined,
          cuitOrDni,
          type,
          phone,
          email,
          preferredCategory,
        },
        token
      );
      setName('');
      setBusinessName('');
      setCuitOrDni('');
      setPhone('');
      setEmail('');
      setErrors({});
      return created;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    values: {
      name,
      businessName,
      cuitOrDni,
      type,
      phone,
      email,
      preferredCategory,
    },
    setters: {
      setName,
      setBusinessName,
      setCuitOrDni,
      setType,
      setPhone,
      setEmail,
      setPreferredCategory,
    },
    errors,
    submitting,
    submit,
  };
}
