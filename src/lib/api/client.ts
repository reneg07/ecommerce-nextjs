import { ApiError, type ApiResponse, type ApiErrorResponse } from '@/types/api';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';

export interface FetchOptions extends RequestInit {
  authToken?: string;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

/**
 * Cliente HTTP tipado centralizado para comunicación servidor a servidor con Laravel
 */
export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { authToken, headers, ...rest } = options;

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const requestHeaders = new Headers(headers);
  requestHeaders.set('Accept', 'application/json');

  if (authToken) {
    requestHeaders.set('Authorization', `Bearer ${authToken}`);
  }

  if (rest.body && typeof rest.body === 'string' && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...rest,
      headers: requestHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error de conexión con el backend de Laravel';
    throw new ApiError(`No se pudo conectar con el servidor: ${message}`, 503);
  }

  // Parsear respuesta JSON
  let json: unknown;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok) {
    if (json && typeof json === 'object' && 'message' in json) {
      const errorPayload = json as ApiErrorResponse;
      throw new ApiError(
        errorPayload.message || 'Error en la petición al backend',
        response.status,
        errorPayload.errors
      );
    }
    throw new ApiError(`Error HTTP ${response.status}: ${response.statusText}`, response.status);
  }

  const envelope = json as ApiResponse<T>;
  return envelope.data;
}
