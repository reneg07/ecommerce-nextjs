import { apiFetch } from './client';
import type { PaymentIntentData } from '@/types/payment';

/**
 * Genera o recupera un PaymentIntent en Stripe para una orden pendiente
 * Consume POST /api/orders/{orderId}/payment mediante token Bearer del usuario
 */
export async function createPaymentIntentApi(
  token: string,
  orderId: number
): Promise<PaymentIntentData> {
  return apiFetch<PaymentIntentData>(`/orders/${orderId}/payment`, {
    method: 'POST',
    authToken: token,
    cache: 'no-store',
  });
}
