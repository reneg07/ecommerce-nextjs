import React from 'react';
import Link from 'next/link';
import { getOrdersApi } from '@/lib/api/orders';
import { Badge } from '@/components/ui/Badge';
import type { Order } from '@/types/order';

interface OrdersListProps {
  token: string;
}

export async function OrdersList({ token }: OrdersListProps) {
  let orders: Order[] = [];
  try {
    orders = await getOrdersApi(token);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    orders = [];
  }

  // Estado vacío oficial
  if (orders.length === 0) {
    return (
      <div className="p-12 text-center rounded-xl bg-white border border-slate-200" id="empty-orders-state">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl text-blue-600">
          📦
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Aún no tienes órdenes registradas
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
          Al tramitar una orden corporativa en KeeyShop, podrás realizar el seguimiento y consulta de comprobantes desde este panel.
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-colors"
            id="explore-products-from-orders"
          >
            Explorar catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3" id="orders-list-container">
      {orders.map((order) => {
        const isPaid = order.status === 'paid';
        const isPending = order.status === 'pending';
        const isCancelled = order.status === 'cancelled';

        const formattedDate = order.created_at
          ? new Intl.DateTimeFormat('es-MX', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(order.created_at))
          : 'Fecha no registrada';

        const formattedTotal = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(parseFloat(order.total) || 0);

        const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || order.items?.length || 0;

        return (
          <div
            key={order.id}
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            data-testid={`order-card-${order.id}`}
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-3">
                <span className="font-bold text-base text-slate-900">
                  Orden #{order.id}
                </span>
                {isPaid && <Badge variant="success">Pagada</Badge>}
                {isPending && <Badge variant="warning">Pendiente</Badge>}
                {isCancelled && <Badge variant="danger">Cancelada</Badge>}
              </div>

              <p className="text-xs text-slate-500">
                Registrada el <span className="font-medium text-slate-700">{formattedDate}</span>
              </p>

              <div className="flex items-center gap-2.5 text-xs text-slate-500 pt-0.5">
                <span>{itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}</span>
                <span>•</span>
                <span className="font-bold text-sm text-blue-600">
                  {formattedTotal}
                </span>
                {order.payment && (
                  <>
                    <span>•</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Pago: {order.payment.status}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              {isPending && (
                <Link
                  href={`/checkout?order=${order.id}`}
                  className="px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs border border-amber-200 transition-colors"
                >
                  Pagar Ahora
                </Link>
              )}

              <Link
                href={`/orders/${order.id}`}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                Ver Detalle →
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
