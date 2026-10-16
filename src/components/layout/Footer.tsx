import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Keey<span className="text-blue-600">Shop</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Solución de comercio electrónico corporativo con inventario sincronizado en tiempo real, autenticación segura y pasarela de pago Stripe.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Navegación</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-blue-600 transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-blue-600 transition-colors">
                  Historial de Órdenes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Seguridad &amp; Pagos</p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Cifrado SSL de extremo a extremo</li>
              <li>Procesamiento directo vía Stripe</li>
              <li>Autenticación JWT con httpOnly</li>
              <li>Garantía oficial y factura legal</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 KeeyShop. Todos los derechos reservados.</p>
          <p className="mt-2 sm:mt-0 font-medium">Inspirado en el estándar de calidad Keeycode</p>
        </div>
      </div>
    </footer>
  );
}
