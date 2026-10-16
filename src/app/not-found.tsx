import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 font-bold text-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
        404
      </div>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
        Página o recurso no encontrado
      </h1>

      <p className="mt-2 text-sm text-slate-600">
        El recurso que buscas no está disponible en KeeyShop o el enlace solicitado ha expirado.
      </p>

      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors shadow-xs"
        >
          Explorar Catálogo
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 text-sm font-medium transition-colors"
        >
          Ir al Inicio
        </Link>
      </div>
    </div>
  );
}
