'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface CheckoutErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CheckoutError({ error, reset }: CheckoutErrorProps) {
  useEffect(() => {
    console.error('Error capturado en Checkout Error Boundary:', error.message);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center" id="checkout-error-boundary">
      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
        Error al procesar la compra
      </h1>

      <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
        {error.message || 'Ocurrió un inconveniente al cargar el resumen de tu compra o verificar la disponibilidad de los artículos en KeeyShop.'}
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          type="button"
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-xs transition-colors"
          id="checkout-retry-button"
        >
          Reintentar Proceso
        </button>

        <Link
          href="/cart"
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
        >
          Volver al Carrito
        </Link>
      </div>
    </div>
  );
}
