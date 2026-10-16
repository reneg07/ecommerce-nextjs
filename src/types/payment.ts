export interface PaymentIntentData {
  payment_intent_id: string;
  client_secret: string;
  amount: string;
  amount_cents: number;
  currency: string;
  status: string;
  reused: boolean;
}

export interface PaymentIntentActionState {
  success: boolean;
  message?: string;
  data?: PaymentIntentData;
  error?: string;
}
