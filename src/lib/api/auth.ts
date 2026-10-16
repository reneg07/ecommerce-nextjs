import { apiFetch } from './client';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenResponse,
  User,
} from '@/types/auth';

/**
 * Registrar un nuevo cliente en el backend Laravel
 */
export async function registerApi(data: RegisterRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
}

/**
 * Iniciar sesión con email y contraseña
 */
export async function loginApi(data: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
}

/**
 * Obtener perfil del usuario autenticado con token JWT
 */
export async function getMeApi(token: string): Promise<User> {
  return apiFetch<User>('/auth/me', {
    method: 'GET',
    authToken: token,
    cache: 'no-store',
  });
}

/**
 * Refrescar token JWT antes o tras expiración (dentro de la ventana de 2 semanas)
 */
export async function refreshTokenApi(token: string): Promise<RefreshTokenResponse> {
  return apiFetch<RefreshTokenResponse>('/auth/refresh', {
    method: 'POST',
    authToken: token,
    cache: 'no-store',
  });
}

/**
 * Cerrar sesión e invalidar token JWT en la lista negra del backend
 */
export async function logoutApi(token: string): Promise<void> {
  await apiFetch<null>('/auth/logout', {
    method: 'POST',
    authToken: token,
    cache: 'no-store',
  });
}
