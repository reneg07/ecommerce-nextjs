import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Crear Cuenta | KeeyShop',
  description: 'Regístrate en KeeyShop para adquirir hardware y soluciones con seguimiento de órdenes corporativas.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              K
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Keey<span className="text-blue-600">Shop</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Crear Cuenta
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Regístrate para comprar y gestionar tus órdenes en KeeyShop
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
