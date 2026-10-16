'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/store/useCartStore';

export function CartClient() {
  const {
    items,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    subtotal,
    totalItems,
    isHydrated,
  } = useCart();

  // Durante SSR y antes de la hidratación, skeleton sutil
  if (!isHydrated) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="h-7 w-48 bg-slate-200 rounded-md mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-28 bg-white border border-slate-200 rounded-xl" />
            <div className="h-28 bg-white border border-slate-200 rounded-xl" />
          </div>
          <div className="h-72 bg-white border border-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  // Estado vacío del carrito
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center" id="empty-cart-state">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
          Aún no has añadido productos a tu carrito. Explora nuestro catálogo corporativo de hardware y tecnología.
        </p>
        <div className="mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors"
            id="explore-products-cta"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Explorar Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>KeeyShop</span>
            <span>/</span>
            <span className="text-blue-600">Carrito de compras</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Tu Carrito
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Tienes <span className="font-semibold text-blue-600">{totalItems}</span> {totalItems === 1 ? 'artículo' : 'artículos'} seleccionados
          </p>
        </div>
        <button
          onClick={clearCart}
          type="button"
          className="self-start sm:self-auto text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1.5 transition-colors"
          id="clear-cart-button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Vaciar Carrito
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const itemPrice = parseFloat(item.price) || 0;
            const lineSubtotal = (itemPrice * item.quantity).toFixed(2);
            const isMaxStock = item.quantity >= item.stock;

            return (
              <div
                key={item.productId}
                className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:border-slate-300 transition-colors"
                data-testid={`cart-item-${item.productId}`}
              >
                {/* Imagen y detalles */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-18 h-18 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                      sizes="72px"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Precio unitario: <span className="font-semibold text-slate-900">${itemPrice.toFixed(2)}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Stock disponible: <span className="font-medium text-slate-700">{item.stock} unidades</span>
                    </p>
                  </div>
                </div>

                {/* Controles de cantidad y precio */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Selector + / - */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => decrementQuantity(item.productId)}
                      type="button"
                      className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors font-bold text-sm"
                      aria-label="Disminuir cantidad"
                      title="Disminuir cantidad"
                    >
                      -
                    </button>
                    <span className="w-9 text-center font-bold text-xs text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => incrementQuantity(item.productId)}
                      disabled={isMaxStock}
                      type="button"
                      className={`w-8 h-8 flex items-center justify-center font-bold text-sm transition-colors ${
                        isMaxStock
                          ? 'text-slate-400 cursor-not-allowed bg-slate-100'
                          : 'text-slate-700 hover:bg-slate-200'
                      }`}
                      aria-label="Aumentar cantidad"
                      title={isMaxStock ? 'Stock máximo alcanzado' : 'Aumentar cantidad'}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal por línea */}
                  <div className="text-right min-w-20">
                    <span className="text-base font-bold text-slate-900">
                      ${lineSubtotal}
                    </span>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    type="button"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                    title="Eliminar producto"
                    aria-label={`Eliminar ${item.name} del carrito`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen del Carrito */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs sticky top-24">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Resumen del Pedido
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({totalItems} artículos)</span>
              <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Envío estándar</span>
              <span className="font-semibold text-emerald-600">Gratis</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-slate-900">Total Estimado</span>
                <p className="text-[11px] text-slate-500">Impuestos calculados en checkout</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <span className="text-blue-600 text-sm">🔒</span>
            <span>Total e inventario se reservan formalmente en el servidor al confirmar tu orden.</span>
          </div>

          <div className="mt-6 space-y-2.5">
            <Link
              href="/checkout"
              className="w-full py-3.5 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
              id="proceed-to-checkout-button"
            >
              <span>Continuar Compra</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/products"
              className="w-full py-2.5 px-5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center justify-center transition-colors"
            >
              ← Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
