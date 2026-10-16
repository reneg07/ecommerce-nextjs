/**
 * Modelo de Usuario autenticado retornado por Laravel (UserResource)
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  created_at?: string;
  updated_at?: string;
}

/**
 * Payload de inicio de sesión
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Payload de registro de clientes (el rol es prohibido por el backend)
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * Respuesta devuelta por login y register en Laravel
 */
export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
  expires_in: number; // En segundos (ej: 3600)
}

/**
 * Respuesta devuelta por POST /api/auth/refresh
 */
export interface RefreshTokenResponse {
  token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Estado tipado para Server Actions con useActionState
 */
export interface AuthActionState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  timestamp?: number;
}
