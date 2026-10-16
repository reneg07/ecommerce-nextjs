'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OrderRefreshPollingProps {
  orderId: number;
}

export function OrderRefreshPolling({ orderId }: OrderRefreshPollingProps) {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Si la orden aún está pendiente, reintentar verificación hasta 3 veces automáticamente
    if (attempts < 3) {
      const timer = setTimeout(() => {
        setAttempts((prev) => prev + 1);
        router.refresh();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [attempts, router]);

  const handleManualCheck = () => {
    setIsChecking(true);
    router.refresh();
    setTimeout(() => setIsChecking(false), 1500);
  };

  return (
    <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="font-bold">Sincronizando confirmación del webhook de Laravel</span>
      </div>
      <p className="leading-relaxed">
        El pago fue recibido por Stripe. Nuestro servidor está procesando la firma criptográfica del webhook para actualizar el estado final de la orden #{orderId}.
      </p>

      <div className="mt-3">
        <button
          onClick={handleManualCheck}
          disabled={isChecking}
          type="button"
          className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-sm"
        >
          {isChecking ? 'Verificando...' : 'Verificar estado ahora'}
        </button>
      </div>
    </div>
  );
}
