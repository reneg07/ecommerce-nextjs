import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { requireUser, getAuthToken } from '@/lib/auth/session';
import { getOrderByIdApi } from '@/lib/api/orders';
import { CheckoutReviewClient } from '@/components/checkout/CheckoutReviewClient';
import { OrderConfirmedView } from '@/components/checkout/OrderConfirmedView';
import CheckoutLoading from './loading';
import type { Order } from '@/types/order';

export const metadata: Metadata = {
  title: 'Checkout Seguro | KeeyShop',
  description: 'Revisión y confirmación de orden corporativa con pago protegido en KeeyShop.',
};

interface CheckoutPageProps {
  searchParams: Promise<{ order?: string }>;
}

async function CheckoutContent({ searchParams }: CheckoutPageProps) {
  // 1. Defensa en profundidad: autenticación obligatoria en servidor
  const user = await requireUser('/checkout');
  const token = await getAuthToken();

  const { order: orderIdParam } = await searchParams;

  // 2. Si ya existe una orden creada, cargarla directamente desde Laravel
  let existingOrder: Order | null = null;
  if (orderIdParam) {
    const orderId = parseInt(orderIdParam, 10);
    if (!isNaN(orderId) && orderId > 0 && token) {
      try {
        existingOrder = await getOrderByIdApi(token, orderId);
      } catch {
        // Si no se encuentra la orden o pertenece a otro usuario, continuar al review
        existingOrder = null;
      }
    }
  }

  if (existingOrder) {
    return <OrderConfirmedView order={existingOrder} />;
  }

  // 3. De lo contrario, mostrar la revisión de los items del carrito para crear la orden
  return <CheckoutReviewClient user={user} />;
}

export default function CheckoutPage({ searchParams }: CheckoutPageProps) {
  return (
    <main className="min-h-[calc(100vh-16rem)]">
      <Suspense fallback={<CheckoutLoading />}>
        <CheckoutContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
