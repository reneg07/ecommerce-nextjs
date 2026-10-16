import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMeApi, refreshTokenApi } from '@/lib/api/auth';
import { ApiError } from '@/types/api';
import type { User } from '@/types/auth';

export const AUTH_COOKIE_NAME = 'auth_token';

/**
 * Obtiene el token JWT de la cookie httpOnly en entorno servidor
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value || null;
}

/**
 * Almacena el token JWT de forma segura exclusivamente en cookie httpOnly
 */
export async function setAuthToken(token: string, maxAge = 3600): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

/**
 * Elimina la cookie httpOnly de autenticación
 */
export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Sanitiza URLs de redirección para prevenir vulnerabilidades de Open Redirect
 * Acepta exclusivamente rutas relativas locales (ej: /orders, /checkout)
 */
export function sanitizeRedirectUrl(target?: string | null): string {
  if (!target || typeof target !== 'string') {
    return '/';
  }

  const trimmed = target.trim();

  // Rechazar esquemas absolutos (http:, https:, javascript:) y dobles barras (//evil.com)
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.includes('://') ||
    trimmed.includes('\\')
  ) {
    return '/';
  }

  return trimmed;
}

/**
 * Obtiene el usuario autenticado actual desde el backend Laravel
 * Implementa recuperación con refresh token si el JWT expiró pero sigue en ventana de refresh
 */
export async function getCurrentUser(): Promise<User | null> {
  const token = await getAuthToken();
  if (!token) {
    return null;
  }

  try {
    return await getMeApi(token);
  } catch (error) {
    // Si el error es 401 (token expirado), intentar refresco seguro UNA SOLA VEZ
    if (error instanceof ApiError && error.status === 401) {
      try {
        const refreshResponse = await refreshTokenApi(token);
        if (refreshResponse && refreshResponse.token) {
          await setAuthToken(refreshResponse.token, refreshResponse.expires_in);
          return await getMeApi(refreshResponse.token);
        }
      } catch {
        // Si el refresco falla, el token expiró definitivamente o fue revocado
        await clearAuthToken();
        return null;
      }
    }

    // Para cualquier otro error de red o no autorizado, limpiar sesión
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      await clearAuthToken();
    }
    return null;
  }
}

/**
 * Helper de defensa en profundidad para páginas protegidas server-side
 * Si el usuario no tiene sesión válida, lo redirige al login conservando la ruta solicitada
 */
export async function requireUser(currentPath?: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    const redirectParam = currentPath ? `?redirect=${encodeURIComponent(currentPath)}` : '';
    redirect(`/login${redirectParam}`);
  }
  return user;
}
