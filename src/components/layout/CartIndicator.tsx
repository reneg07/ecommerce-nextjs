'use client';

import Link from 'next/link';
import { useCart } from '@/lib/store/useCartStore';

export function CartIndicator() {
  const { totalItems, isHydrated } = useCart();
  const count = isHydrated ? totalItems : 0;

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent"
      aria-label={`Carrito de compras con ${count} artículos`}
      id="cart-indicator-button"
    >
      <svg
        className="w-5 h-5 text-slate-600 dark:text-slate-300 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      <span className="hidden sm:inline font-semibold">Carrito</span>
      {count > 0 && (
        <span
          className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full min-w-5 h-5 animate-in fade-in zoom-in duration-200 shadow-sm"
          id="cart-count-badge"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
