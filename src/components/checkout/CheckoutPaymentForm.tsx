'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface CheckoutPaymentFormProps {
  orderId: number;
  amount: string;
  currency: string;
}

export function CheckoutPaymentForm({
  orderId,
  amount,
  currency,
}: CheckoutPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase() || 'USD',
  }).format(parseFloat(amount) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage('La pasarela de pago aún no ha terminado de cargar. Por favor espera un momento.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Determinar URL de retorno segura
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const returnUrl = `${origin}/checkout/success?order_id=${orderId}`;

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
        redirect: 'if_required',
      });

      if (error) {
        // Error reportado por Stripe (tarjeta declinada, datos incompletos, 3DS cancelado)
        setErrorMessage(
          error.message || 'Ocurrió un error al procesar el pago. Por favor intenta con otra tarjeta.'
        );
        setIsProcessing(false);
        return;
      }

      // Si el pago se completó exitosamente sin requerir redirección externa 3DS
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        router.push(`/checkout/success?order_id=${orderId}&payment_intent=${paymentIntent.id}`);
      } else if (paymentIntent && paymentIntent.status === 'processing') {
        router.push(`/checkout/success?order_id=${orderId}&payment_intent=${paymentIntent.id}`);
      } else {
        // En caso de que se haya requerido redirección, Stripe gestiona la navegación al return_url
        setIsProcessing(false);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Error de red inesperado al comunicar con la pasarela de pagos.'
      );
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="stripe-payment-form">
      {errorMessage && (
        <div
          className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3"
          role="alert"
          id="payment-error-banner"
        >
          <svg className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-bold">Error en la transacción</p>
            <p className="mt-0.5 text-xs text-rose-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Stripe Payment Element Oficial */}
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span>🔒</span>
          <span>Transacción cifrada TLS de 256 bits directa a Stripe</span>
        </div>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`w-full sm:w-auto px-7 py-3 rounded-lg font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors ${
            !stripe || isProcessing
              ? 'bg-blue-300 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
          }`}
          id="confirm-payment-button"
        >
          {isProcessing ? (
            <>
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Procesando Pago Seguro...</span>
            </>
          ) : (
            <>
              <span>Pagar {formattedAmount}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
