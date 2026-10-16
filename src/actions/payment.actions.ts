'use server';

import { getAuthToken, requireUser } from '@/lib/auth/session';
import { createPaymentIntentApi } from '@/lib/api/payments';
import { ApiError } from '@/types/api';
import type { PaymentIntentActionState } from '@/types/payment';

/**
 * Server Action para iniciar o reutilizar un PaymentIntent de Stripe
 * Consume exclusivamente server-to-server la API de Laravel
 * Nunca expone tokens sensibles ni logs de client_secret
 */
export async function createPaymentIntentAction(
  orderId: number
): Promise<PaymentIntentActionState> {
  try {
    // 1. Defensa en profundidad: autenticación en servidor
    await requireUser(`/checkout?order=${orderId}`);
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        error: 'Sesión no válida o expirada. Por favor, inicia sesión para continuar.',
      };
    }

    // 2. Validación de parámetro
    if (!orderId || isNaN(orderId) || orderId <= 0) {
      return {
        success: false,
        error: 'Identificador de orden inválido.',
      };
    }

    // 3. Llamar a Laravel POST /api/orders/{orderId}/payment
    // Laravel valida propiedad de la orden, estado pendiente y calcula centavos
    const paymentData = await createPaymentIntentApi(token, orderId);

    // 4. Retornar únicamente datos sanitizados requeridos por Stripe Elements
    return {
      success: true,
      message: paymentData.reused
        ? 'PaymentIntent reutilizado para la orden pendiente.'
        : 'PaymentIntent generado exitosamente.',
      data: {
        payment_intent_id: paymentData.payment_intent_id,
        client_secret: paymentData.client_secret,
        amount: paymentData.amount,
        amount_cents: paymentData.amount_cents,
        currency: paymentData.currency,
        status: paymentData.status,
        reused: paymentData.reused,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        return {
          success: false,
          error: 'Tu sesión ha expirado. Inicia sesión nuevamente para procesar el pago.',
        };
      }
      if (error.status === 403) {
        return {
          success: false,
          error: 'Acceso denegado: no tienes autorización para pagar esta orden.',
        };
      }
      if (error.status === 404) {
        return {
          success: false,
          error: 'La orden especificada no existe en el sistema.',
        };
      }
      if (error.status === 400) {
        return {
          success: false,
          error: error.message || 'La orden no se encuentra disponible para pago.',
        };
      }
      return {
        success: false,
        error: error.message || 'Error del servidor al generar la intención de pago.',
      };
    }

    const message = error instanceof Error ? error.message : 'Error inesperado de comunicación con Stripe.';
    return {
      success: false,
      error: message,
    };
  }
}
