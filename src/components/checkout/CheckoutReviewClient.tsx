'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/store/useCartStore';
import { createOrderAction } from '@/actions/order.actions';
import type { User } from '@/types/auth';

interface CheckoutReviewClientProps {
  user: User;
}

export function CheckoutReviewClient({ user }: CheckoutReviewClientProps) {
  const router = useRouter();
  const { items, subtotal, totalItems, clearCart, isHydrated } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isHydrated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-7 w-64 bg-slate-200 rounded mb-8" />
        <div className="h-40 bg-white border border-slate-200 rounded-xl mb-6" />
        <div className="h-40 bg-white border border-slate-200 rounded-xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center" id="empty-checkout-state">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          No hay artículos en el carrito para ordenar
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Añade productos desde el catálogo para iniciar el proceso de checkout corporativo.
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            ← Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || items.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    // Transformar items: estrictamente solo product_id y quantity
    // NUNCA enviamos price, subtotal o total hacia Laravel
    const payloadItems = items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    }));

    try {
      const response = await createOrderAction(payloadItems);

      if (response.success && response.order) {
        // La orden fue creada en Laravel y el stock fue decrementado atómicamente.
        // Ahora limpiamos el carrito local para que la orden sea la única fuente de verdad.
        clearCart();
        router.push(`/checkout?order=${response.order.id}`);
      } else {
        setErrorMessage(
          response.message || 'No se pudo generar la orden. Por favor verifica la disponibilidad.'
        );
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Error inesperado de red al comunicar con el servidor.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-slate-200 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Checkout</span>
          <span>/</span>
          <span className="text-blue-600">Paso 1 de 2: Revisión</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          Revisión de Orden
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Verifica los artículos y datos del comprador antes de generar la orden formal en el servidor.
        </p>
      </div>

      {errorMessage && (
        <div
          className="mb-8 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3"
          role="alert"
          id="checkout-error-banner"
        >
          <svg className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-bold">No fue posible crear la orden</p>
            <p className="mt-0.5 text-xs text-rose-700 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Datos del Comprador y Productos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Usuario Autenticado */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                👤
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cliente Corporativo</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {user.name} <span className="font-normal text-xs text-slate-500">({user.email})</span>
                </p>
              </div>
            </div>
          </div>

          {/* Card Detalle de Productos */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              Artículos en la orden ({totalItems})
            </h2>

            <div className="divide-y divide-slate-100">
              {items.map((item) => {
                const itemPrice = parseFloat(item.price) || 0;
                const lineTotal = (itemPrice * item.quantity).toFixed(2);

                return (
                  <div key={item.productId} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1.5"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Cantidad: <span className="font-semibold text-slate-700">{item.quantity}</span> × ${itemPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-slate-900">
                        ${lineTotal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aviso Legal y de Negocio */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
            <span className="text-blue-600 text-base">ℹ️</span>
            <div>
              <strong>Validación en Servidor:</strong> Al crear la orden, el backend Laravel valida el inventario y descuenta el stock de forma atómica. Los precios finales son ratificados directamente por el backend.
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resumen de Totales y Acción */}
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs sticky top-24">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Resumen Preliminar
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Total de artículos</span>
                <span className="font-semibold text-slate-900">{totalItems} uds.</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal estimado</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Gastos de envío</span>
                <span className="font-semibold text-emerald-600">Gratis ($0.00)</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-slate-900">Total Estimado</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 px-5 rounded-lg font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors ${
                  isSubmitting
                    ? 'bg-blue-300 cursor-not-allowed text-white'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                }`}
                id="create-order-button"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creando Orden en Servidor...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar y Crear Orden</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 text-center">
              <Link
                href="/cart"
                className="text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium"
              >
                ← Modificar Carrito
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
