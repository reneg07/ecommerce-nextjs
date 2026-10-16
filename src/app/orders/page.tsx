import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { requireUser, getAuthToken } from '@/lib/auth/session';
import { OrdersList } from '@/components/orders/OrdersList';
import { OrdersSkeleton } from '@/components/orders/OrdersSkeleton';

export const metadata: Metadata = {
  title: 'Mis Órdenes de Compra | KeeyShop',
  description: 'Historial de compras y seguimiento de pedidos en KeeyShop.',
};

export default async function OrdersPage() {
  // Defensa en profundidad: autenticación server-side obligatoria
  await requireUser('/orders');
  const token = await getAuthToken();

  return (
    <main className="min-h-[calc(100vh-16rem)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="pb-6 mb-8 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Mi Cuenta</span>
            <span>/</span>
            <span className="text-blue-600">Historial de Órdenes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Mis Órdenes
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Consulta el historial corporativo de compras y el estado de tus órdenes en KeeyShop.
          </p>
        </div>

        <Suspense fallback={<OrdersSkeleton />}>
          {token ? <OrdersList token={token} /> : <OrdersSkeleton />}
        </Suspense>
      </div>
    </main>
  );
}
