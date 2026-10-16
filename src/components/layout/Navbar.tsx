import React, { Suspense } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { CartIndicator } from '@/components/layout/CartIndicator';

/**
 * Componente asíncrono para streaming de sesión con Suspense
 * Evita desoptimizaciones de prerenderizado estático en el RootLayout de Next.js 16
 */
async function NavbarAuth() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-semibold text-blue-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {user.name.split(' ')[0]}
        </span>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
      >
        Iniciar Sesión
      </Link>
      <Link
        href="/register"
        className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
      >
        Crear Cuenta
      </Link>
    </div>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
              Keey<span className="text-blue-600">Shop</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold -mt-0.5">
              TIENDA DE TECNOLOGÍA
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Navegación principal" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/products"
            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Catálogo
          </Link>
          <Link
            href="/orders"
            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Mis Órdenes
          </Link>
        </nav>

        {/* Auth State & Cart Actions */}
        <div className="flex items-center gap-3">
          <Suspense
            fallback={
              <div className="h-8 w-24 rounded-lg bg-slate-100 animate-pulse" />
            }
          >
            <NavbarAuth />
          </Suspense>

          <CartIndicator />
        </div>
      </div>
    </header>
  );
}
