import { apiRequest } from '@/lib/api/api.client';
import { AuthUser, LoginCredentials, LoginResponse } from './auth.types';

const DEMO_USERS: Record<string, { password: string; user: AuthUser; token: string }> = {
  'admin@pintame.com.ar': {
    password: 'pintame123',
    token: 'jwt_pintame_admin_token_2026',
    user: {
      id: 'usr-admin-01',
      firstName: 'Alexis',
      lastName: 'Bautista',
      name: 'Alexis Bautista',
      email: 'admin@pintame.com.ar',
      role: 'ADMIN',
      branch: 'Sucursal Central Cipolletti',
    },
  },
  'vendedor@pintame.com.ar': {
    password: 'pintame123',
    token: 'jwt_pintame_seller_token_2026',
    user: {
      id: 'usr-seller-02',
      firstName: 'Franco',
      lastName: 'Retamal',
      name: 'Franco Retamal',
      email: 'vendedor@pintame.com.ar',
      role: 'SELLER',
      branch: 'Sucursal Central Cipolletti',
    },
  },
};

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const normalizedEmail = credentials.email.trim().toLowerCase();

  try {
    return await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email: normalizedEmail, password: credentials.password },
    });
  } catch {
    const demoMatch = DEMO_USERS[normalizedEmail];
    if (demoMatch && demoMatch.password === credentials.password) {
      return {
        accessToken: demoMatch.token,
        user: demoMatch.user,
      };
    }
    throw new Error('Credenciales inválidas. Probá con admin@pintame.com.ar / pintame123');
  }
}

export async function getMe(token: string): Promise<AuthUser> {
  try {
    return await apiRequest<AuthUser>('/auth/me', {
      method: 'GET',
      token,
    });
  } catch {
    const found = Object.values(DEMO_USERS).find((entry) => entry.token === token);
    if (found) {
      return found.user;
    }
    throw new Error('Sesión expirada o token inválido.');
  }
}
