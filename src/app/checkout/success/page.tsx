import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser, getAuthToken } from '@/lib/auth/session';
import { getOrderByIdApi } from '@/lib/api/orders';
import { Badge } from '@/components/ui/Badge';
import { OrderRefreshPolling } from '@/components/checkout/OrderRefreshPolling';
import type { Order } from '@/types/order';

export const metadata: Metadata = {
  title: 'Confirmación de Pago | KeeyShop',
  description: 'Recibo oficial y confirmación de pago de tu orden en KeeyShop.',
};

interface SuccessPageProps {
  searchParams: Promise<{
    order_id?: string;
    payment_intent?: string;
    payment_intent_client_secret?: string;
    redirect_status?: string;
  }>;
}

async function SuccessContent({ searchParams }: SuccessPageProps) {
  const user = await requireUser('/checkout/success');
  const token = await getAuthToken();

  const { order_id, payment_intent } = await searchParams;
  const orderId = parseInt(order_id || '', 10);

  if (isNaN(orderId) || orderId <= 0 || !token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">Identificador de orden no válido</h1>
        <p className="mt-1 text-sm text-slate-600">No pudimos localizar la orden especificada en el sistema.</p>
        <div className="mt-6">
          <Link href="/orders" className="text-sm font-semibold text-blue-600 hover:underline">
            Ir a Mis Órdenes
          </Link>
        </div>
      </div>
    );
  }

  let order: Order | null = null;
  try {
    order = await getOrderByIdApi(token, orderId);
  } catch {
    order = null;
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">Orden no encontrada</h1>
        <p className="mt-1 text-sm text-slate-600">
          No tienes autorización para ver esta orden o no existe en el sistema.
        </p>
        <div className="mt-6">
          <Link href="/products" className="text-sm font-semibold text-blue-600 hover:underline">
            Volver a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.status === 'paid';
  const isPending = order.status === 'pending';
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(order.total) || 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="order-success-container">
      {/* Estado del Pago */}
      <div className="text-center pb-8 border-b border-slate-200">
        <div
          className={`w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center text-2xl shadow-xs ${
            isPaid
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-500 text-white'
          }`}
        >
          {isPaid ? '✓' : '⏳'}
        </div>

        <div className="inline-flex items-center gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {isPaid ? '¡Pago Confirmado con Éxito!' : 'Pago Recibido — Procesando Conciliación'}
          </h1>
        </div>

        <div className="flex items-center justify-center gap-2">
          {isPaid && <Badge variant="success">Orden Pagada</Badge>}
          {isPending && <Badge variant="warning">Pendiente de Sincronización</Badge>}
          <span className="text-xs font-mono text-slate-500">Orden #{order.id}</span>
        </div>

        <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {isPaid
            ? `Muchas gracias por tu compra, ${user.name}. Tu transacción fue verificada exitosamente en Stripe y registrada en los sistemas de KeeyShop.`
            : `El cobro fue autorizado en Stripe para la orden #${order.id}. Estamos finalizando la conciliación interna en el servidor.`}
        </p>

        {isPending && <OrderRefreshPolling orderId={order.id} />}
      </div>

      {/* Resumen de la Orden */}
      <div className="mt-8 p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
          Comprobante de Compra
        </h2>

        <div className="divide-y divide-slate-100">
          {order.items?.map((item) => {
            const unitPrice = parseFloat(item.unit_price) || 0;
            const subtotal = parseFloat(item.subtotal) || 0;

            return (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{item.product_name}</p>
                  <p className="text-xs text-slate-500">
                    {item.quantity} × ${unitPrice.toFixed(2)}
                  </p>
                </div>
                <span className="font-bold text-slate-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
          <span className="text-sm font-bold text-slate-900">Importe Total Liquidado</span>
          <span className="text-2xl font-bold text-blue-600">{formattedTotal}</span>
        </div>

        {payment_intent && (
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 font-mono">
            Stripe PaymentIntent ID: {payment_intent}
          </div>
        )}
      </div>

      {/* Navegación posterior */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/products"
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-colors text-center"
        >
          Explorar Más Productos
        </Link>
        <Link
          href="/orders"
          className="w-full sm:w-auto px-6 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors text-center"
        >
          Ver Mis Órdenes
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  return (
    <main className="min-h-[calc(100vh-16rem)]">
      <Suspense
        fallback={
          <div className="max-w-md mx-auto px-4 py-20 text-center animate-pulse">
            <div className="w-14 h-14 mx-auto mb-4 bg-slate-200 rounded-xl" />
            <div className="h-6 w-48 mx-auto bg-slate-200 rounded mb-2" />
            <div className="h-4 w-64 mx-auto bg-slate-100 rounded" />
          </div>
        }
      >
        <SuccessContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
