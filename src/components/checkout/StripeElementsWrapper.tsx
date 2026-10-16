'use client';

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe/client';
import { CheckoutPaymentForm } from './CheckoutPaymentForm';

interface StripeElementsWrapperProps {
  clientSecret: string;
  orderId: number;
  amount: string;
  currency: string;
}

export function StripeElementsWrapper({
  clientSecret,
  orderId,
  amount,
  currency,
}: StripeElementsWrapperProps) {
  const stripePromise = getStripe();

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#6366f1',
            colorBackground: '#0f172a',
            colorText: '#f8fafc',
            colorDanger: '#f43f5e',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '12px',
          },
        },
      }}
    >
      <CheckoutPaymentForm
        orderId={orderId}
        amount={amount}
        currency={currency}
      />
    </Elements>
  );
}
