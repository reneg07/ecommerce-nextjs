import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser, getAuthToken } from '@/lib/auth/session';
import { getOrderByIdApi } from '@/lib/api/orders';
import { Badge } from '@/components/ui/Badge';
import { CancelOrderButton } from '@/components/orders/CancelOrderButton';
import type { Order } from '@/types/order';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Detalle de Orden #${id} | KeeyShop`,
    description: `Consulta el estado, artículos y comprobante de la orden #${id} en KeeyShop.`,
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const orderId = parseInt(id, 10);

  // 1. Defensa en profundidad: sesión obligatoria
  await requireUser(`/orders/${id}`);
  const token = await getAuthToken();

  if (isNaN(orderId) || orderId <= 0 || !token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">Identificador Inválido</h1>
        <p className="mt-1 text-sm text-slate-600">El número de orden proporcionado es incorrecto.</p>
        <div className="mt-6">
          <Link href="/orders" className="text-sm font-semibold text-blue-600 hover:underline">
            Volver a Mis Órdenes
          </Link>
        </div>
      </div>
    );
  }

  // 2. Consultar Laravel: valida propiedad y existencia
  let order: Order | null = null;
  let isForbidden = false;

  try {
    order = await getOrderByIdApi(token, orderId);
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 403) {
      isForbidden = true;
    }
    order = null;
  }

  // 3. Si la orden no existe o pertenece a otro usuario, no filtrar datos sensibles
  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center" id="order-not-found-or-forbidden">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center text-2xl font-bold">
          🔒
        </div>
        <h1 className="text-xl font-bold text-slate-900">
          {isForbidden ? 'Acceso Denegado' : 'Orden No Encontrada'}
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-sm mx-auto">
          {isForbidden
            ? 'No tienes autorización para consultar esta orden de compra.'
            : 'La orden solicitada no existe o no se encuentra disponible.'}
        </p>
        <div className="mt-6">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            ← Volver a Mis Órdenes
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.status === 'paid';
  const isPending = order.status === 'pending';
  const isCancelled = order.status === 'cancelled';

  const formattedDate = order.created_at
    ? new Intl.DateTimeFormat('es-MX', {
        dateStyle: 'full',
        timeStyle: 'medium',
      }).format(new Date(order.created_at))
    : 'Fecha no registrada';

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(order.total) || 0);

  return (
    <main className="min-h-[calc(100vh-16rem)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/orders" className="hover:text-blue-600 transition-colors">
            Mis Órdenes
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">
            Orden #{order.id}
          </span>
        </nav>

        {/* Encabezado Principal */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                Orden #{order.id}
              </h1>
              {isPaid && <Badge variant="success">Pagada</Badge>}
              {isPending && <Badge variant="warning">Pendiente de Pago</Badge>}
              {isCancelled && <Badge variant="danger">Cancelada</Badge>}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {formattedDate}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {isPending && (
              <>
                <Link
                  href={`/checkout?order=${order.id}`}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
                  id="pay-pending-order-link"
                >
                  Pagar con Stripe →
                </Link>
                <CancelOrderButton orderId={order.id} status={order.status} />
              </>
            )}

            {isPaid && (
              <Link
                href={`/checkout/success?order_id=${order.id}`}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                Ver Comprobante
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Lista de Artículos */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100">
                Artículos Comprados ({order.items?.length || 0})
              </h2>

              <div className="divide-y divide-slate-100">
                {order.items?.map((item) => {
                  const unitPrice = parseFloat(item.unit_price) || 0;
                  const lineSubtotal = parseFloat(item.subtotal) || 0;

                  return (
                    <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-sm text-slate-900">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Cantidad: <span className="font-semibold text-slate-700">{item.quantity}</span> × ${unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-slate-900">
                          ${lineSubtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-slate-600">Total Oficial</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formattedTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Estado de Pago y Detalles */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-100">
                Información de Transacción
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Estado:</span>
                  <span className="font-bold text-slate-900">
                    {order.payment ? order.payment.status.toUpperCase() : isPaid ? 'CONFIRMADO' : 'PENDIENTE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Moneda:</span>
                  <span className="font-medium text-slate-900">USD ($)</span>
                </div>
                {order.payment?.stripe_payment_intent_id && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 block mb-0.5">ID Transacción Stripe:</span>
                    <span className="font-mono text-[11px] text-slate-600 break-all">
                      {order.payment.stripe_payment_intent_id}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/orders"
              className="block w-full py-2.5 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs text-center transition-colors"
            >
              ← Volver al Historial
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
