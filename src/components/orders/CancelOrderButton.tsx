'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cancelOrderAction } from '@/actions/order.actions';
import type { OrderStatus } from '@/types/order';

interface CancelOrderButtonProps {
  orderId: number;
  status: OrderStatus;
}

export function CancelOrderButton({ orderId, status }: CancelOrderButtonProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Únicamente las órdenes pendientes pueden cancelarse según contrato Laravel
  if (status !== 'pending') {
    return null;
  }

  const handleCancel = async () => {
    setIsCancelling(true);
    setErrorMessage(null);

    try {
      const response = await cancelOrderAction(orderId);

      if (response.success) {
        setIsConfirming(false);
        router.refresh();
      } else {
        setErrorMessage(response.message || 'No se pudo cancelar la orden.');
        setIsCancelling(false);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Error inesperado al cancelar la orden.'
      );
      setIsCancelling(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 space-y-2.5" id="cancel-confirmation-box">
        <div className="text-xs text-rose-800">
          <p className="font-bold">¿Confirmas la cancelación de la orden #{orderId}?</p>
          <p className="mt-0.5 text-[11px] text-rose-700">
            Los productos reservados volverán al inventario disponible del catálogo.
          </p>
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            type="button"
            className={`px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-colors ${
              isCancelling ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            id="confirm-cancel-order-button"
          >
            {isCancelling ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Cancelando...</span>
              </>
            ) : (
              'Sí, Cancelar Orden'
            )}
          </button>

          <button
            onClick={() => setIsConfirming(false)}
            disabled={isCancelling}
            type="button"
            className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
          >
            No, Mantener
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      type="button"
      className="px-3.5 py-2 rounded-lg border border-rose-300 hover:bg-rose-50 text-rose-600 font-semibold text-xs transition-colors"
      id="cancel-order-button"
    >
      Cancelar Orden
    </button>
  );
}
