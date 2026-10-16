'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { loginApi, registerApi, logoutApi } from '@/lib/api/auth';
import { setAuthToken, clearAuthToken, getAuthToken, sanitizeRedirectUrl } from '@/lib/auth/session';
import { ApiError } from '@/types/api';
import type { AuthActionState } from '@/types/auth';

/**
 * Server Action para inicio de sesión seguro
 */
export async function loginAction(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = (formData.get('email') as string)?.trim() || '';
  const password = (formData.get('password') as string) || '';
  const redirectTarget = formData.get('redirect') as string | null;

  const errors: Record<string, string[]> = {};

  if (!email) {
    errors.email = ['El correo electrónico es obligatorio.'];
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ['El formato del correo electrónico es inválido.'];
  }

  if (!password) {
    errors.password = ['La contraseña es obligatoria.'];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Por favor corrige los errores en el formulario.',
      errors,
      timestamp: Date.now(),
    };
  }

  let destination = '/';

  try {
    const authData = await loginApi({ email, password });

    // Guardar el token exclusivamente en cookie httpOnly en el servidor
    await setAuthToken(authData.token, authData.expires_in);

    // Sanitizar destino para evitar Open Redirect
    destination = sanitizeRedirectUrl(redirectTarget);

    // Refrescar Navbar y rutas para reflejar sesión activa
    revalidatePath('/', 'layout');
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        return {
          success: false,
          message: 'Credenciales incorrectas. Verifica tu correo y contraseña.',
          errors: {
            email: ['Credenciales inválidas.'],
          },
          timestamp: Date.now(),
        };
      }

      if (error.status === 422) {
        return {
          success: false,
          message: error.message || 'Error de validación.',
          errors: error.errors,
          timestamp: Date.now(),
        };
      }

      return {
        success: false,
        message: error.message,
        timestamp: Date.now(),
      };
    }

    return {
      success: false,
      message: 'No fue posible conectar con el servidor de autenticación. Intenta nuevamente.',
      timestamp: Date.now(),
    };
  }

  // Redirigir fuera del bloque try/catch
  redirect(destination);
}

/**
 * Server Action para registro público de clientes
 */
export async function registerAction(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const name = (formData.get('name') as string)?.trim() || '';
  const email = (formData.get('email') as string)?.trim() || '';
  const password = (formData.get('password') as string) || '';
  const password_confirmation = (formData.get('password_confirmation') as string) || '';

  const errors: Record<string, string[]> = {};

  if (!name) {
    errors.name = ['El nombre es obligatorio.'];
  }

  if (!email) {
    errors.email = ['El correo electrónico es obligatorio.'];
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ['El formato del correo electrónico es inválido.'];
  }

  if (!password) {
    errors.password = ['La contraseña es obligatoria.'];
  } else if (password.length < 8) {
    errors.password = ['La contraseña debe tener al menos 8 caracteres.'];
  }

  if (!password_confirmation) {
    errors.password_confirmation = ['Debes confirmar la contraseña.'];
  } else if (password !== password_confirmation) {
    errors.password_confirmation = ['Las contraseñas no coinciden.'];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Por favor corrige los errores del formulario.',
      errors,
      timestamp: Date.now(),
    };
  }

  try {
    // NUNCA enviar 'role' (está prohibido por Laravel en RegisterRequest)
    const authData = await registerApi({
      name,
      email,
      password,
      password_confirmation,
    });

    await setAuthToken(authData.token, authData.expires_in);
    revalidatePath('/', 'layout');
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 422) {
        return {
          success: false,
          message: error.message || 'Error de validación.',
          errors: error.errors,
          timestamp: Date.now(),
        };
      }

      return {
        success: false,
        message: error.message,
        timestamp: Date.now(),
      };
    }

    return {
      success: false,
      message: 'Ocurrió un error inesperado al registrar el usuario.',
      timestamp: Date.now(),
    };
  }

  redirect('/');
}

/**
 * Server Action para cierre de sesión e invalidación de token
 */
export async function logoutAction(): Promise<void> {
  const token = await getAuthToken();

  if (token) {
    try {
      await logoutApi(token);
    } catch {
      // Si el token ya expiró en Laravel, continuamos borrando la cookie local
    }
  }

  await clearAuthToken();
  revalidatePath('/', 'layout');
  redirect('/login');
}
