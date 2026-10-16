import { apiFetch } from './client';
import type { Order, CreateOrderRequest } from '@/types/order';

/**
 * Crea una nueva orden de compra en Laravel con bloqueo transaccional e inventario atómico
 */
export async function createOrderApi(token: string, payload: CreateOrderRequest): Promise<Order> {
  return apiFetch<Order>('/orders', {
    method: 'POST',
    authToken: token,
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
}

/**
 * Obtiene el historial de órdenes del usuario autenticado
 */
export async function getOrdersApi(token: string): Promise<Order[]> {
  return apiFetch<Order[]>('/orders', {
    method: 'GET',
    authToken: token,
    cache: 'no-store',
    next: {
      tags: ['orders'],
    },
  });
}

/**
 * Obtiene el detalle de una orden por ID
 */
export async function getOrderByIdApi(token: string, id: number): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}`, {
    method: 'GET',
    authToken: token,
    cache: 'no-store',
    next: {
      tags: [`order-${id}`],
    },
  });
}

/**
 * Cancela una orden pendiente y restaura inventario en Laravel
 */
export async function cancelOrderApi(token: string, id: number): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}/cancel`, {
    method: 'POST',
    authToken: token,
    cache: 'no-store',
  });
}
