'use client';

import { useState } from 'react';
import { useCart } from '@/lib/store/useCartStore';

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    price: string;
    stock: number;
    image?: string;
    active?: boolean;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, items, isHydrated } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = isHydrated ? items.find((i) => i.productId === product.id) : undefined;
  const currentQtyInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0 || product.active === false;
  const isMaxStockReached = isHydrated && currentQtyInCart >= product.stock;

  const handleAdd = () => {
    if (isOutOfStock || isMaxStockReached) return;

    const added = addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image,
    });

    if (added) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  if (isOutOfStock) {
    return (
      <button
        disabled
        className="w-full py-3 px-5 rounded-lg font-semibold text-sm bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 flex items-center justify-center gap-2"
        id="add-to-cart-button-out-of-stock"
      >
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        Producto Agotado
      </button>
    );
  }

  if (isMaxStockReached) {
    return (
      <button
        disabled
        className="w-full py-3 px-5 rounded-lg font-semibold text-sm bg-amber-50 text-amber-800 border border-amber-200 cursor-not-allowed flex items-center justify-center gap-2"
        id="add-to-cart-button-max-stock"
      >
        <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Stock Máximo en Carrito ({currentQtyInCart} / {product.stock})
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      type="button"
      className={`w-full py-3 px-5 rounded-lg font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-sm ${
        justAdded
          ? 'bg-emerald-600 text-white shadow-emerald-500/20'
          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
      }`}
      id="add-to-cart-button"
    >
      {justAdded ? (
        <>
          <svg className="w-4 h-4 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          ¡Agregado al Carrito!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {currentQtyInCart > 0
            ? `Agregar más (${currentQtyInCart} en carrito)`
            : 'Agregar al Carrito'}
        </>
      )}
    </button>
  );
}
