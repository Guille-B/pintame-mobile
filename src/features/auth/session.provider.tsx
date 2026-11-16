import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { AuthUser, LoginCredentials } from './auth.types';
import { getMe, login } from './auth.service';
import {
  deleteSessionToken,
  getSessionToken,
  saveSessionToken,
} from '@/lib/storage/secure-storage';

export type SessionContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
};

export const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      setIsLoading(true);
      const storedToken = await getSessionToken();
      if (!storedToken) {
        setUser(null);
        setToken(null);
        return;
      }
      const currentUser = await getMe(storedToken);
      setToken(storedToken);
      setUser(currentUser);
    } catch {
      await deleteSessionToken();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(credentials: LoginCredentials) {
    const response = await login(credentials);
    await saveSessionToken(response.accessToken);
    setToken(response.accessToken);
    setUser(response.user);
  }

  async function signOut() {
    await deleteSessionToken();
    setToken(null);
    setUser(null);
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        token,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
