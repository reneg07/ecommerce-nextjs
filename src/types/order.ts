import type { Product } from './product';
import type { User } from './auth';

export type OrderStatus = 'pending' | 'paid' | 'cancelled';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed';

export interface Payment {
  id: number;
  order_id?: number;
  stripe_payment_intent_id?: string;
  amount: string;
  currency?: string;
  status: PaymentStatus;
  created_at?: string | null;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product?: Product;
  quantity: number;
  unit_price: string;
  subtotal: string;
  created_at?: string | null;
}

export interface Order {
  id: number;
  user_id: number;
  user?: User;
  total: string;
  status: OrderStatus;
  items: OrderItem[];
  payment?: Payment | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateOrderItemRequest {
  product_id: number;
  quantity: number;
}

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
}

export interface OrderActionState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  order?: Order;
}
