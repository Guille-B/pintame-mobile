import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const SESSION_TOKEN_KEY = 'session_token';

// Fallback en memoria para entorno web donde SecureStore nativo no está disponible
let memoryToken: string | null = null;

export async function saveSessionToken(token: string): Promise<void> {
  memoryToken = token;
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(SESSION_TOKEN_KEY, token);
    } catch {
      // Ignorar si localStorage está bloqueado
    }
    return;
  }
  await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
}

export async function getSessionToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(SESSION_TOKEN_KEY) ?? memoryToken;
    } catch {
      return memoryToken;
    }
  }
  return await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
}

export async function deleteSessionToken(): Promise<void> {
  memoryToken = null;
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(SESSION_TOKEN_KEY);
    } catch {
      // Ignorar
    }
    return;
  }
  await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
}
