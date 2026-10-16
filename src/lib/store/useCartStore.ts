'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useSyncExternalStore } from 'react';
import type { CartItem, CartStore } from '@/types/cart';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        if (product.stock <= 0) return false;

        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.productId === product.id);

        if (existingItem) {
          const newQty = existingItem.quantity + quantity;
          if (newQty > product.stock) {
            // No podemos exceder el stock disponible
            if (existingItem.quantity >= product.stock) {
              return false;
            }
            set({
              items: currentItems.map((i) =>
                i.productId === product.id ? { ...i, quantity: product.stock } : i
              ),
            });
            return true;
          }

          set({
            items: currentItems.map((i) =>
              i.productId === product.id ? { ...i, quantity: newQty } : i
            ),
          });
          return true;
        }

        const initialQty = Math.min(Math.max(1, quantity), product.stock);
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: initialQty,
          stock: product.stock,
          image: product.image || '/images/products/placeholder.svg',
        };

        set({ items: [...currentItems, newItem] });
        return true;
      },

      removeItem: (productId: number) => {
        set({
          items: get().items.filter((i) => i.productId !== productId),
        });
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const currentItems = get().items;
        const target = currentItems.find((i) => i.productId === productId);
        if (!target) return;

        const safeQty = Math.min(quantity, target.stock);

        set({
          items: currentItems.map((i) =>
            i.productId === productId ? { ...i, quantity: safeQty } : i
          ),
        });
      },

      incrementQuantity: (productId: number) => {
        const currentItems = get().items;
        const target = currentItems.find((i) => i.productId === productId);
        if (!target) return;

        if (target.quantity < target.stock) {
          set({
            items: currentItems.map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        }
      },

      decrementQuantity: (productId: number) => {
        const currentItems = get().items;
        const target = currentItems.find((i) => i.productId === productId);
        if (!target) return;

        if (target.quantity > 1) {
          set({
            items: currentItems.map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
            ),
          });
        } else {
          get().removeItem(productId);
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        const total = get().items.reduce((sum, item) => {
          const priceNum = parseFloat(item.price) || 0;
          return sum + priceNum * item.quantity;
        }, 0);
        return Math.round(total * 100) / 100;
      },
    }),
    {
      name: 'keeyshop-cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Solo persistimos la lista de items
      partialize: (state) => ({ items: state.items }),
    }
  )
);

const emptySubscribe = () => () => {};

/**
 * Hook seguro contra Hydration Mismatches en Next.js App Router y React 19
 * Retorna false en el snapshot del servidor y true en el cliente mediante useSyncExternalStore
 */
export function useCart() {
  const store = useCartStore();
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return {
    ...store,
    isHydrated,
    items: isHydrated ? store.items : [],
    totalItems: isHydrated ? store.getTotalItems() : 0,
    subtotal: isHydrated ? store.getSubtotal() : 0,
  };
}
