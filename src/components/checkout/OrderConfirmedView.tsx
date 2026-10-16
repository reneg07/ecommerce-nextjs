'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Order } from '@/types/order';
import { Badge } from '@/components/ui/Badge';
import { createPaymentIntentAction } from '@/actions/payment.actions';
import dynamic from 'next/dynamic';
import type { PaymentIntentData } from '@/types/payment';

// Carga diferida de Stripe SDK para evitar penalizaciones de bundle/LCP
const StripeElementsWrapper = dynamic(
  () => import('./StripeElementsWrapper').then((mod) => mod.StripeElementsWrapper),
  {
    loading: () => (
      <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 animate-pulse">
        <div className="w-8 h-8 mx-auto mb-2 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Iniciando pasarela de pago Stripe...</p>
      </div>
    ),
    ssr: false,
  }
);

interface OrderConfirmedViewProps {
  order: Order;
}

export function OrderConfirmedView({ order }: OrderConfirmedViewProps) {
  const [paymentData, setPaymentData] = useState<PaymentIntentData | null>(null);
  const [isLoadingIntent, setIsLoadingIntent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(order.total) || 0);

  const isPaid = order.status === 'paid';
  const isCancelled = order.status === 'cancelled';
  const isPending = order.status === 'pending';

  const handleStartPayment = async () => {
    setIsLoadingIntent(true);
    setErrorMessage(null);

    try {
      const response = await createPaymentIntentAction(order.id);

      if (response.success && response.data) {
        setPaymentData(response.data);
      } else {
        setErrorMessage(
          response.error || 'No se pudo generar la intención de pago. Verifica tu conexión.'
        );
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Error inesperado al conectar con Stripe.'
      );
    } finally {
      setIsLoadingIntent(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="order-confirmed-view">
      {/* Banner de Estado de la Orden */}
      <div
        className={`p-6 rounded-xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border ${
          isPaid
            ? 'bg-emerald-50/80 border-emerald-200'
            : isCancelled
            ? 'bg-rose-50/80 border-rose-200'
            : 'bg-blue-50/80 border-blue-200'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-xs ${
              isPaid
                ? 'bg-emerald-600'
                : isCancelled
                ? 'bg-rose-600'
                : 'bg-blue-600'
            }`}
          >
            {isPaid ? '✓' : isCancelled ? '✕' : '📦'}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Orden #{order.id}
              </h1>
              {isPaid && <Badge variant="success">Pagada</Badge>}
              {isPending && <Badge variant="warning">Pendiente de Pago</Badge>}
              {isCancelled && <Badge variant="danger">Cancelada</Badge>}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {isPaid
                ? 'Esta orden ya ha sido confirmada y pagada en su totalidad.'
                : isCancelled
                ? 'Esta orden fue cancelada y el inventario fue restaurado.'
                : 'Inventario bloqueado y reservado formalmente en el servidor de Laravel.'}
            </p>
          </div>
        </div>

        {isPaid && (
          <Link
            href={`/checkout/success?order_id=${order.id}`}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors self-start sm:self-auto shadow-xs"
          >
            Ver Comprobante
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Columna Izquierda: Detalle de Artículos y Total */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-100">
              Resumen de la Orden
            </h2>

            <div className="divide-y divide-slate-100">
              {order.items?.map((item) => {
                const unitPrice = parseFloat(item.unit_price) || 0;
                const lineSubtotal = parseFloat(item.subtotal) || 0;

                return (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-semibold text-slate-900">{item.product_name}</p>
                      <p className="text-slate-500">
                        {item.quantity} × ${unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900">
                      ${lineSubtotal.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-xs font-semibold text-slate-600">Total Oficial</span>
              <span className="text-xl font-bold text-blue-600">
                {formattedTotal}
              </span>
            </div>
          </div>

          <Link
            href="/products"
            className="block w-full py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-xs text-center transition-colors"
          >
            ← Volver al Catálogo
          </Link>
        </div>

        {/* Columna Derecha: Pasarela de Pago con Stripe */}
        <div className="lg:col-span-2">
          <div className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">💳</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Pasarela de Pago Protegida
                  </h3>
                  <p className="text-xs text-slate-500">Integración nativa con Stripe PaymentElement</p>
                </div>
              </div>

              {paymentData?.reused && (
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200">
                  PaymentIntent Reutilizado
                </span>
              )}
            </div>

            {errorMessage && (
              <div
                className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3"
                role="alert"
              >
                <svg className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-bold">Error al inicializar el pago</p>
                  <p className="mt-0.5 text-xs text-rose-700">{errorMessage}</p>
                </div>
              </div>
            )}

            {isPaid ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-base font-bold text-slate-900">Esta orden ya fue liquidada</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  El pago fue confirmado exitosamente por Stripe y conciliado en Laravel.
                </p>
                <div className="mt-5">
                  <Link
                    href={`/checkout/success?order_id=${order.id}`}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-xs hover:bg-blue-700 transition-colors inline-block"
                  >
                    Ver Recibo de Compra
                  </Link>
                </div>
              </div>
            ) : isCancelled ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold">
                  ✕
                </div>
                <h4 className="text-base font-bold text-slate-900">Orden Cancelada</h4>
                <p className="text-xs text-slate-500 mt-1">Esta orden ya no admite cargos o cobros bancarios.</p>
              </div>
            ) : paymentData ? (
              /* PaymentElement oficial cargado con client_secret */
              <StripeElementsWrapper
                clientSecret={paymentData.client_secret}
                orderId={order.id}
                amount={paymentData.amount}
                currency={paymentData.currency}
              />
            ) : (
              /* Paso 1: Botón para solicitar PaymentIntent a Laravel */
              <div className="space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Para liquidar formalmente tu orden por un importe de <strong>{formattedTotal}</strong>, pulsa el botón inferior para abrir el módulo protegido de pago.
                </p>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <p>✓ Cifrado SSL/TLS de 256 bits directo con la pasarela bancaria.</p>
                  <p>✓ Compatible con protocolos de autenticación reforzada 3D Secure 2.0.</p>
                  <p>✓ Cumplimiento normativo PCI-DSS de nivel superior.</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleStartPayment}
                    disabled={isLoadingIntent}
                    type="button"
                    className={`w-full py-3.5 px-5 rounded-lg font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors ${
                      isLoadingIntent
                        ? 'bg-blue-300 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                    }`}
                    id="initialize-stripe-payment-button"
                  >
                    {isLoadingIntent ? (
                      <>
                        <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Conectando con Servidor de Pagos...</span>
                      </>
                    ) : (
                      <>
                        <span>Proceder al Pago con Tarjeta</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
