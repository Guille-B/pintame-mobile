const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.0.10:3000/api';

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
  timeoutMs?: number;
};

/**
 * Cliente HTTP centralizado según Clase 8 y Material de Desarrollo Móvil.
 * Centraliza base URL, headers, Authorization Bearer token, serialización JSON y errores HTTP.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 2500);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message ?? `Error HTTP ${response.status} del servidor`);
    }
    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}

export function getConfiguredApiUrl(): string {
  return API_URL;
}
