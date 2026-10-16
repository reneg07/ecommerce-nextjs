import type { Metadata } from 'next';
import { CartClient } from '@/components/cart/CartClient';

export const metadata: Metadata = {
  title: 'Carrito de Compras | KeeyShop',
  description: 'Revisa y gestiona los artículos en tu carrito de compras en KeeyShop.',
};

export default function CartPage() {
  return (
    <main className="min-h-[calc(100vh-16rem)]">
      <CartClient />
    </main>
  );
}
