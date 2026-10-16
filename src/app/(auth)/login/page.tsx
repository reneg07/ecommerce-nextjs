import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { sanitizeRedirectUrl } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | KeeyShop',
  description: 'Accede a tu cuenta de KeeyShop para gestionar tus órdenes corporativas y realizar compras seguras.',
};

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

async function LoginContainer({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectParam } = await searchParams;
  const sanitizedRedirect = sanitizeRedirectUrl(redirectParam);
  return <LoginForm redirectTarget={sanitizedRedirect} />;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
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
            Iniciar Sesión
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Ingresa a tu cuenta para gestionar tus órdenes
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
          <Suspense
            fallback={
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-10 bg-slate-200 rounded-lg" />
                <div className="h-4 bg-slate-200 rounded w-1/4 mt-4" />
                <div className="h-10 bg-slate-200 rounded-lg" />
                <div className="h-11 bg-slate-200 rounded-lg mt-6" />
              </div>
            }
          >
            <LoginContainer searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
