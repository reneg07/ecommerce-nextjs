'use server';

import { revalidatePath } from 'next/cache';
import { getAuthToken, requireUser } from '@/lib/auth/session';
import { createOrderApi, cancelOrderApi } from '@/lib/api/orders';
import { ApiError } from '@/types/api';
import type { OrderActionState, CreateOrderItemRequest } from '@/types/order';

/**
 * Server Action para creación de órdenes de compra
 * Transmite ÚNICAMENTE los campos permitidos por Laravel ({ items: [{ product_id, quantity }] })
 * Previene el envío de totales o precios prohibidos por StoreOrderRequest
 */
export async function createOrderAction(
  items: CreateOrderItemRequest[]
): Promise<OrderActionState> {
  try {
    // 1. Defensa en profundidad: verificar sesión activa en servidor
    await requireUser('/checkout');
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: 'Sesión no válida o expirada. Por favor, inicia sesión para continuar.',
      };
    }

    // 2. Validación de estructura en el servidor
    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        success: false,
        message: 'El carrito no contiene productos válidos para generar la orden.',
      };
    }

    // 3. Estricto: sanitizar el payload enviando EXCLUSIVAMENTE product_id y quantity
    // Laravel prohíbe taxativamente: price, unit_price, subtotal, total (responde 422 si se envían)
    const sanitizedItems: CreateOrderItemRequest[] = items.map((item) => ({
      product_id: Number(item.product_id),
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
    }));

    for (const item of sanitizedItems) {
      if (!item.product_id || isNaN(item.product_id) || item.product_id <= 0) {
        return {
          success: false,
          message: 'Uno o más productos tienen un identificador no válido.',
        };
      }
      if (!item.quantity || isNaN(item.quantity) || item.quantity <= 0) {
        return {
          success: false,
          message: 'La cantidad de cada producto debe ser de al menos 1 unidad.',
        };
      }
    }

    // 4. Invocar API de Laravel (transacción atómica con row locking y descuento de stock)
    const order = await createOrderApi(token, { items: sanitizedItems });

    // 5. Revalidar rutas en Next.js 16 para evitar Stale UI
    revalidatePath('/orders');
    revalidatePath('/checkout');

    return {
      success: true,
      order,
      message: 'Orden creada exitosamente.',
    };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        return {
          success: false,
          message: 'Tu sesión ha expirado. Por favor vuelve a iniciar sesión.',
        };
      }
      if (error.status === 400 || error.status === 422) {
        return {
          success: false,
          message: error.message || 'No se pudo crear la orden. Por favor verifica el stock disponible.',
          errors: error.errors,
        };
      }
      return {
        success: false,
        message: error.message,
      };
    }

    const message = error instanceof Error ? error.message : 'Error inesperado al procesar la orden.';
    return {
      success: false,
      message,
    };
  }
}

/**
 * Server Action para cancelar una orden pendiente y restaurar stock en Laravel
 */
export async function cancelOrderAction(orderId: number): Promise<OrderActionState> {
  try {
    // 1. Defensa en profundidad: verificar sesión activa
    await requireUser(`/orders/${orderId}`);
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: 'Sesión no válida o expirada. Por favor, inicia sesión para continuar.',
      };
    }

    if (!orderId || isNaN(orderId) || orderId <= 0) {
      return {
        success: false,
        message: 'Identificador de orden no válido.',
      };
    }

    // 2. Invocar Laravel POST /api/orders/{id}/cancel
    const order = await cancelOrderApi(token, orderId);

    // 3. Revalidar para evitar Stale UI
    revalidatePath('/orders');
    revalidatePath(`/orders/${orderId}`);
    revalidatePath('/checkout');
    revalidatePath('/products');

    return {
      success: true,
      order,
      message: `Orden #${orderId} cancelada exitosamente y el inventario ha sido restaurado.`,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        return {
          success: false,
          message: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
        };
      }
      if (error.status === 403) {
        return {
          success: false,
          message: 'Acceso denegado: no tienes autorización para cancelar esta orden.',
        };
      }
      if (error.status === 404) {
        return {
          success: false,
          message: 'La orden que intentas cancelar no existe.',
        };
      }
      if (error.status === 400) {
        return {
          success: false,
          message: error.message || 'No se puede cancelar una orden que ya fue pagada o cancelada previamente.',
        };
      }
      return {
        success: false,
        message: error.message,
      };
    }

    const message = error instanceof Error ? error.message : 'Error inesperado al cancelar la orden.';
    return {
      success: false,
      message,
    };
  }
}
